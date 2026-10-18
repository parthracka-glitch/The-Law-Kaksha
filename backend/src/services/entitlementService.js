/**
 * The Law Kaksha - Entitlement & Payment Fulfillment Service
 * Handles idempotent entitlement grants, payment creation, triple-path reconciliation,
 * and fail-closed integrity guarantees for digital access.
 */

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Database = require("../db/database");
const { isConnected } = require("../db/mongo");

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (keyId && keySecret) {
    try {
      return new Razorpay({ key_id: keyId, key_secret: keySecret });
    } catch (e) {
      console.warn("[Razorpay] Client initialization warning:", e.message);
    }
  }
  return null;
}

/**
 * Idempotently grant digital entitlement for an order.
 * Fails loudly in production if MongoDB is unavailable.
 */
async function grantEntitlement(orderIdOrRecord, options = {}) {
  const {
    gatewayPaymentId,
    gatewayOrderId,
    paymentMethod = "UPI / Razorpay",
    grantedBy = "razorpay_verify",
    notes = "",
    adminUser = null,
    rawPayload = null,
  } = options;

  // 1. Fail Loudly in Production if MongoDB is unavailable
  if (process.env.NODE_ENV === "production" && !isConnected()) {
    const errMsg = "CRITICAL_DATABASE_UNAVAILABLE: Payment fulfillment cannot proceed because MongoDB Atlas is disconnected in production.";
    console.error(`[EntitlementService] ${errMsg}`);
    throw new Error(errMsg);
  }

  // 2. Locate Order Record
  const ordersTable = Database.table("orders");
  let order = null;
  if (typeof orderIdOrRecord === "object" && orderIdOrRecord !== null) {
    order = orderIdOrRecord;
  } else {
    const searchId = String(orderIdOrRecord).trim();
    order =
      ordersTable.findById(searchId) ||
      ordersTable.findOne(
        (o) => o.id === searchId || o.gateway_order_id === searchId || o.order_no === searchId
      );
  }

  if (!order) {
    return {
      success: false,
      error: "ORDER_NOT_FOUND",
      message: `Order record not found for reference: ${orderIdOrRecord}`,
    };
  }

  const entitlementsTable = Database.table("entitlements");
  const paymentsTable = Database.table("payments");
  const usersTable = Database.table("users");
  const coursesTable = Database.table("courses");

  // 3. Idempotency Check: if order is already COMPLETED and entitlement exists, return cleanly
  const existingEntitlement = entitlementsTable.findOne((e) => e.order_id === order.id && e.status === "active");
  if ((order.status === "COMPLETED" || order.status === "paid") && existingEntitlement) {
    const student = usersTable.findOne(
      (u) => u.id === existingEntitlement.user_id || u.email === existingEntitlement.user_email
    );
    return {
      success: true,
      alreadyGranted: true,
      message: "Entitlement already active and valid for this order.",
      order,
      student,
      entitlement: existingEntitlement,
    };
  }

  // 4. Extract and Normalize Customer Details
  const email = (
    order.customer_email ||
    order.personal_details?.email ||
    order.userEmail ||
    ""
  ).toLowerCase().trim();

  const name =
    order.customer_name ||
    order.personal_details?.fullName ||
    order.personal_details?.name ||
    "Enrolled Student";

  const phone =
    order.customer_phone ||
    order.personal_details?.phone ||
    "";

  const targetExam =
    order.target_exam ||
    order.personal_details?.targetExam ||
    "CA Foundation Paper 2: Business Laws";

  const isCSEET = targetExam.toLowerCase().includes("cseet");

  // 5. Find or Create Student User
  let student = usersTable.findOne(
    (u) => (u.email && u.email.toLowerCase() === email) || (email && u.student_id === email)
  );

  const studentRoll =
    student?.student_id ||
    (isCSEET
      ? `LRK-2026-CS${Math.floor(1000 + Math.random() * 9000)}`
      : `LRK-2026-CA${Math.floor(1000 + Math.random() * 9000)}`);

  const tempPassword = student?.tempPassword || `Law@${Math.floor(1000 + Math.random() * 9000)}`;
  const passwordHash = student?.password_hash || bcrypt.hashSync(tempPassword, 10);
  const deviceId = options.deviceId || order.deviceId || `DEV-${Date.now()}`;
  const deviceName = options.deviceName || order.deviceName || "Primary Device";

  // 6. Determine Unlocked Courses, Items & Access Duration
  let primaryCourseId = isCSEET ? "cseet-business-communication" : "ca-foundation-paper-2";
  let accessDays = 180; // default 6-month validity

  const unlockedItemIds = new Set(student?.unlockedItemIds || []);

  (order.items || []).forEach((item) => {
    const itemId = String(item.id || item.item_id || "").toLowerCase();
    unlockedItemIds.add(itemId);

    if (itemId.includes("cseet")) {
      primaryCourseId = "cseet-business-communication";
    } else if (itemId.includes("ca-foundation") || itemId.includes("vol1") || itemId.includes("codex")) {
      primaryCourseId = "ca-foundation-paper-2";
    }
  });

  // Check Course metadata in Database for configured accessDays
  const courseRecord = coursesTable.findOne((c) => c.id === primaryCourseId || c.slug === primaryCourseId);
  if (courseRecord && courseRecord.accessDays) {
    accessDays = Number(courseRecord.accessDays);
  }

  // Add standard alias IDs for seamless student reader access
  if (primaryCourseId === "ca-foundation-paper-2") {
    unlockedItemIds.add("ca-foundation-paper-2");
    unlockedItemIds.add("course-ca-foundation-sub");
    unlockedItemIds.add("ca-foundation-business-laws");
    unlockedItemIds.add("book-vol-1");
  } else if (primaryCourseId === "cseet-business-communication") {
    unlockedItemIds.add("cseet-business-communication");
    unlockedItemIds.add("course-cseet-sub");
    unlockedItemIds.add("cseet-business-law");
    unlockedItemIds.add("book-vol-2");
  }

  const finalUnlockedItems = Array.from(unlockedItemIds);

  if (!student) {
    student = usersTable.insert({
      id: `usr-${Date.now()}`,
      student_id: studentRoll,
      name,
      email,
      boundGmail: email,
      phone,
      password_hash: passwordHash,
      tempPassword,
      target_exam: targetExam,
      role: "student",
      is_active: 1,
      drm_access: 1,
      unlockedItemIds: finalUnlockedItems,
      activeDeviceId: deviceId,
      activeDeviceName: deviceName,
      lastActiveAt: new Date().toISOString(),
      tokenVersion: 1,
    });
  } else {
    usersTable.update(student.id, {
      drm_access: 1,
      is_active: 1,
      unlockedItemIds: finalUnlockedItems,
      activeDeviceId: student.activeDeviceId || deviceId,
      activeDeviceName: student.activeDeviceName || deviceName,
      lastActiveAt: new Date().toISOString(),
    });
    student = usersTable.findById(student.id);
  }

  // 7. Create / Update Payment Record
  const paymentAmount = Number(order.total_amount || order.total || order.amount || 99);
  const paymentId = gatewayPaymentId || order.gateway_payment_id || `pay_LK_${Date.now()}`;
  let payment = paymentsTable.findOne((p) => p.order_id === order.id || p.gateway_payment_id === paymentId);

  if (!payment) {
    payment = paymentsTable.insert({
      id: `pay-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      order_id: order.id,
      gateway: "razorpay",
      gateway_order_id: order.gateway_order_id || gatewayOrderId || "",
      gateway_payment_id: paymentId,
      amount: paymentAmount,
      currency: "INR",
      status: "success",
      method: paymentMethod,
      paid_at: new Date().toISOString(),
      raw_payload: rawPayload || null,
    });
  } else {
    paymentsTable.update(payment.id, {
      status: "success",
      gateway_payment_id: paymentId,
      paid_at: new Date().toISOString(),
    });
  }

  // 8. Create Entitlement Record
  const now = new Date();
  const expiresAt = new Date(now.getTime() + accessDays * 86400000);

  const entitlement = entitlementsTable.insert({
    id: `ent-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    user_id: student.id,
    user_email: email,
    item_type: "course",
    item_id: primaryCourseId,
    courseId: primaryCourseId,
    order_id: order.id,
    starts_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
    status: "active",
    granted_by: grantedBy,
  });

  // 9. Update Order to COMPLETED / paid
  ordersTable.update(order.id, {
    status: "COMPLETED",
    gateway_payment_id: paymentId,
    entitlement_id: entitlement.id,
    updated_at: new Date().toISOString(),
  });
  order = ordersTable.findById(order.id);

  // 10. Backward-Compatible Subscription Record
  const subscriptionsTable = Database.table("subscriptions");
  const subRecord = {
    id: `LK-SUB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: student.id,
    studentName: student.name,
    studentRoll: studentRoll,
    email: student.email,
    phone: student.phone,
    item: (order.items || []).map((i) => i.title).join(", ") || primaryCourseId,
    targetExam: order.target_exam || targetExam,
    amount: `₹${paymentAmount}`,
    date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    paymentMode: paymentMethod,
    accessStatus: "Active",
    status: "ACTIVE",
    unlockedItemIds: finalUnlockedItems,
    expires_at: expiresAt.toISOString(),
  };
  subscriptionsTable.insert(subRecord);

  // 11. Synchronize to MongoDB Atlas (if connected)
  if (isConnected()) {
    try {
      const User = require("../models/User");
      const Order = require("../models/Order");
      const Payment = require("../models/Payment");
      const Entitlement = require("../models/Entitlement");
      const Subscription = require("../models/Subscription");

      await Promise.all([
        User.findOneAndUpdate(
          { email: student.email },
          {
            $set: {
              name: student.name,
              phone: student.phone,
              student_id: studentRoll,
              target_exam: targetExam,
              drm_access: true,
              is_active: true,
              tokenVersion: student.tokenVersion || 1,
              lastActiveAt: new Date(),
            },
            $addToSet: {
              unlockedItemIds: { $each: finalUnlockedItems },
            },
          },
          { upsert: true, new: true }
        ),
        Order.findOneAndUpdate(
          { id: order.id },
          {
            $set: {
              status: "COMPLETED",
              payment_id: paymentId,
            },
          }
        ),
        Payment.create({
          id: payment.id,
          order_id: order.id,
          gateway: "razorpay",
          gateway_order_id: payment.gateway_order_id,
          gateway_payment_id: payment.gateway_payment_id,
          amount: paymentAmount,
          currency: "INR",
          status: "success",
          method: paymentMethod,
          paid_at: now,
          raw_payload: rawPayload,
        }),
        Entitlement.create({
          id: entitlement.id,
          user_id: student.id,
          user_email: email,
          item_type: "course",
          item_id: primaryCourseId,
          courseId: primaryCourseId,
          order_id: order.id,
          starts_at: now,
          expires_at: expiresAt,
          status: "active",
        }),
        Subscription.create(subRecord),
      ]);
    } catch (mongoErr) {
      console.error("[EntitlementService] MongoDB Atlas sync error:", mongoErr.message);
      if (process.env.NODE_ENV === "production") {
        throw mongoErr;
      }
    }
  }

  // 12. Record Audit Log for Manual Admin Grants
  if (grantedBy === "admin_manual") {
    const auditRecord = {
      id: `aud-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      action: "MANUAL_ENTITLEMENT_GRANT",
      admin_id: adminUser?.id || "admin",
      admin_email: adminUser?.email || "admin@thelawkaksha.com",
      target_user_id: student.id,
      target_user_email: student.email,
      order_id: order.id,
      details: {
        courseId: primaryCourseId,
        accessDays,
        notes: notes || "Granted access manually by administrator",
      },
      timestamp: new Date().toISOString(),
    };
    Database.table("audit_logs").insert(auditRecord);

    if (isConnected()) {
      try {
        const AuditLog = require("../models/AuditLog");
        await AuditLog.create(auditRecord);
      } catch (err) {
        console.warn("[EntitlementService] AuditLog Mongo create warning:", err.message);
      }
    }
  }

  return {
    success: true,
    alreadyGranted: false,
    message: "Digital entitlement and DRM license granted successfully.",
    order,
    student,
    entitlement,
    payment,
    credentials: {
      studentId: studentRoll,
      tempPassword,
      email: student.email,
    },
  };
}

/**
 * Reconcile a single order by querying the Razorpay API or validating payment state.
 */
async function reconcileOrder(orderIdOrRecord) {
  const ordersTable = Database.table("orders");
  let order = null;
  if (typeof orderIdOrRecord === "object" && orderIdOrRecord !== null) {
    order = orderIdOrRecord;
  } else {
    const searchId = String(orderIdOrRecord).trim();
    order =
      ordersTable.findById(searchId) ||
      ordersTable.findOne(
        (o) => o.id === searchId || o.gateway_order_id === searchId || o.order_no === searchId
      );
  }

  if (!order) {
    return { success: false, error: "ORDER_NOT_FOUND", message: "Order not found" };
  }

  if (order.status === "COMPLETED" || order.status === "paid") {
    // Ensure entitlement exists
    const grantResult = await grantEntitlement(order, { grantedBy: "reconcile" });
    return {
      success: true,
      status: "COMPLETED",
      reconciled: false,
      alreadyPaid: true,
      message: "Order is already paid and entitlement is active.",
      order,
      entitlement: grantResult.entitlement,
    };
  }

  // Order is pending: Check with Razorpay API
  const rzp = getRazorpayClient();
  const gatewayOrderId = order.gateway_order_id;

  if (rzp && gatewayOrderId && !gatewayOrderId.startsWith("mock_")) {
    try {
      // Check order status on Razorpay
      const rzpOrder = await rzp.orders.fetch(gatewayOrderId);
      if (rzpOrder.status === "paid") {
        // Fetch payments for this order
        const payments = await rzp.orders.fetchPayments(gatewayOrderId);
        const successfulPayment = (payments.items || []).find((p) => p.status === "captured");
        const paymentId = successfulPayment?.id || `pay_${Date.now()}`;

        const grantResult = await grantEntitlement(order, {
          gatewayPaymentId: paymentId,
          gatewayOrderId,
          grantedBy: "reconcile",
        });

        return {
          success: true,
          status: "COMPLETED",
          reconciled: true,
          message: "Payment confirmed on Razorpay. Entitlement has been granted.",
          order: grantResult.order,
          entitlement: grantResult.entitlement,
        };
      }
    } catch (rzpErr) {
      console.warn(`[EntitlementService] Razorpay reconcile fetch error for ${gatewayOrderId}:`, rzpErr.message);
    }
  }

  // Fallback for dev / mock mode
  if (process.env.NODE_ENV !== "production" && (order.mock_paid || (gatewayOrderId && gatewayOrderId.startsWith("order_test_")))) {
    const grantResult = await grantEntitlement(order, {
      gatewayPaymentId: `pay_test_${Date.now()}`,
      gatewayOrderId,
      grantedBy: "reconcile_mock",
    });
    return {
      success: true,
      status: "COMPLETED",
      reconciled: true,
      message: "Dev test order reconciled and access granted.",
      order: grantResult.order,
      entitlement: grantResult.entitlement,
    };
  }

  return {
    success: true,
    status: order.status || "PENDING",
    reconciled: false,
    message: "Payment is not yet confirmed by gateway. Please complete payment.",
    order,
  };
}

/**
 * Background sweeper to reconcile pending orders from the last 24 hours.
 */
async function sweepPendingOrders() {
  const ordersTable = Database.table("orders");
  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  const pendingOrders = ordersTable.find((o) => {
    if (o.status !== "PENDING" && o.status !== "pending") return false;
    const createdAt = new Date(o.created_at || o.createdAt || 0).getTime();
    return now - createdAt < ONE_DAY_MS;
  });

  console.log(`[Sweeper] Found ${pendingOrders.length} pending orders to reconcile.`);
  const results = [];

  for (const ord of pendingOrders) {
    try {
      const res = await reconcileOrder(ord);
      if (res.reconciled) {
        results.push({ orderId: ord.id, reconciled: true });
        console.log(`[Sweeper] Reconciled order ${ord.id} successfully.`);
      }
    } catch (e) {
      console.error(`[Sweeper] Failed to reconcile order ${ord.id}:`, e.message);
    }
  }

  return { sweptCount: pendingOrders.length, reconciledCount: results.length, results };
}

module.exports = {
  grantEntitlement,
  reconcileOrder,
  sweepPendingOrders,
};
