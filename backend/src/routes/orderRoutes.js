/**
 * The Law Kaksha - Orders & Digital Access Fulfillment Routes
 * Handles order initialization, payment verification, and automated DRM unlocking.
 */

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Database = require("../db/database");
const { requireAuth, JWT_SECRET } = require("../middleware/authMiddleware");

const router = express.Router();

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (keyId && keySecret) {
    try {
      return new Razorpay({ key_id: keyId, key_secret: keySecret });
    } catch (e) {
      console.warn("[Razorpay] Initialization warning:", e.message);
    }
  }
  return null;
}

const CANONICAL_CATALOG_PRICES = {
  "course-ca-foundation-sub": 99,
  "ca-foundation-sub": 99,
  "ca-foundation-business-laws": 99,
  "ca-foundation": 99,
  "prod-vol1": 99,
  "book-vol-1": 99,
  "course-cseet-sub": 99,
  "cseet-sub": 99,
  "cseet-business-law": 99,
  "cseet-management": 99,
  "cseet": 99,
  "prod-vol2": 99,
  "book-vol-2": 99,
  "prod-combo": 180,
  "all-access": 180,
};

function getCanonicalPrice(itemId) {
  if (!itemId) return 99;
  const cleanId = String(itemId).trim().toLowerCase();
  if (CANONICAL_CATALOG_PRICES[cleanId]) {
    return CANONICAL_CATALOG_PRICES[cleanId];
  }
  const productsTable = Database.table("products");
  const p = productsTable.findById(cleanId) || productsTable.findOne((x) => x.id === cleanId || x.slug === cleanId);
  if (p && typeof p.price === "number") return p.price;

  const coursesTable = Database.table("courses");
  const c = coursesTable.findById(cleanId) || coursesTable.findOne((x) => x.id === cleanId || x.slug === cleanId);
  if (c && typeof c.price === "number") return c.price;

  const plansTable = Database.table("subscription_plans");
  const plan = plansTable.findById(cleanId) || plansTable.findOne((x) => x.id === cleanId || x.slug === cleanId);
  if (plan && typeof plan.price === "number") return plan.price;

  return 99;
}

/**
 * 1. Order Creation Handler
 * POST /api/orders/create & POST /api/create-order
 * Integrates Razorpay Orders API (orders.create) with server-side price validation
 */
async function handleCreateOrder(req, res) {
  try {
    const { items = [], shippingDetails = {}, couponCode } = req.body;

    let subtotal = 0;
    let validatedItems = [];

    let finalAmount = 0;
    let amountInPaise = 0;
    let discountAmount = 0;

    if (items && items.length > 0) {
      validatedItems = items.map((it) => {
        const price = getCanonicalPrice(it.id);
        const quantity = Math.max(1, Number(it.quantity) || 1);
        subtotal += price * quantity;
        return {
          id: it.id,
          title: it.title || "Statutory Law Codex",
          price,
          quantity,
          format: "pdf",
        };
      });

      // Apply verified discounts
      let discountPercent = 0;
      if (couponCode) {
        const cleanCode = String(couponCode).trim().toUpperCase();
        const couponsTable = Database.table("coupons");
        const coupon = couponsTable.findOne((c) => c.code === cleanCode && c.status === "Active");
        if (coupon) {
          discountPercent = coupon.discountPercent || 20;
        } else if (cleanCode === "EXEMPTION2026" || cleanCode === "LAW20" || cleanCode === "CALAW20") {
          discountPercent = 20;
        } else if (cleanCode === "FIRST50") {
          discountPercent = 15;
        } else if (cleanCode === "RANKERS" || cleanCode === "RANKER10") {
          discountPercent = 25;
        }
      }

      discountAmount = Math.round((subtotal * discountPercent) / 100);
      finalAmount = Math.max(0, subtotal - discountAmount);
      amountInPaise = Math.round(finalAmount * 100);
    } else if (req.body.amount !== undefined) {
      if (process.env.NODE_ENV === "production") {
        return res.status(400).json({
          success: false,
          message: "Orders in production must specify valid items from the course catalog.",
        });
      }
      amountInPaise = Math.round(Number(req.body.amount));
      if (isNaN(amountInPaise) || amountInPaise < 100) {
        return res.status(400).json({
          success: false,
          message: "Order amount must be at least 100 paise (₹1).",
        });
      }
      finalAmount = amountInPaise / 100;
      subtotal = finalAmount;
      validatedItems = [
        {
          id: "course-law-codex",
          title: "The Law Kaksha Codex",
          price: finalAmount,
          quantity: 1,
          format: "pdf",
        },
      ];
    } else {
      return res.status(400).json({
        success: false,
        message: "No items or amount specified in the order cart.",
      });
    }

    // Validate minimum amount is at least 100 paise (₹1) as per Razorpay requirements
    if (amountInPaise < 100) {
      return res.status(400).json({
        success: false,
        message: "Order amount must be at least 100 paise (₹1).",
      });
    }

    const name = shippingDetails.name || req.body.name || "Enrolled Student";
    const email = shippingDetails.email || req.body.email || "student@thelawkaksha.com";
    const phone = shippingDetails.phone || req.body.phone || "+91 98765 43210";
    const exam = shippingDetails.exam || req.body.exam || "CA Foundation Paper 2: Business Laws";

    const orderId = `LK-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    let razorpayOrderId = null;
    const rzp = getRazorpayClient();

    if (rzp) {
      try {
        const rzpOrder = await rzp.orders.create({
          amount: amountInPaise,
          currency: "INR",
          receipt: orderId.slice(0, 40),
          notes: {
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            target_exam: exam,
          },
        });
        razorpayOrderId = rzpOrder.id;
      } catch (rzpErr) {
        console.error("[Razorpay API Error]:", rzpErr);
        return res.status(500).json({
          success: false,
          message: rzpErr.error?.description || rzpErr.message || "Failed to create Razorpay payment order.",
        });
      }
    } else {
      if (process.env.NODE_ENV === "production") {
        return res.status(500).json({
          success: false,
          message: "Payment gateway credentials (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) are missing or misconfigured in production.",
        });
      }
      razorpayOrderId = `order_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const ordersTable = Database.table("orders");
    const newOrder = ordersTable.insert({
      id: orderId,
      gateway_order_id: razorpayOrderId,
      customer_name: name,
      customer_email: email.toLowerCase(),
      customer_phone: phone,
      target_exam: exam,
      items: validatedItems,
      subtotal,
      discount_amount: discountAmount,
      total_amount: finalAmount,
      amount_paise: amountInPaise,
      status: "PENDING",
      payment_method: "ONLINE",
    });

    const responseData = {
      order_id: razorpayOrderId,
      orderId: newOrder.id,
      razorpayOrderId: razorpayOrderId,
      amount: newOrder.total_amount, // in ₹
      amount_paise: amountInPaise, // in paise
      currency: "INR",
      receipt: orderId,
      key_id: process.env.RAZORPAY_KEY_ID || "",
    };

    return res.status(200).json({
      success: true,
      data: responseData,
      ...responseData,
    });
  } catch (err) {
    console.error("[Orders] Create order error:", err);
    return res.status(500).json({ success: false, message: "Failed to initiate order." });
  }
}

/**
 * 2. Payment Verification Handler
 * POST /api/orders/verify & POST /api/verify-payment
 * Cryptographically verifies HMAC-SHA256 signature and fulfills digital enrollment
 */
async function handleVerifyPayment(req, res) {
  try {
    const orderId = req.body.orderId || req.body.order_id || req.body.receipt;
    const razorpayOrderId = req.body.razorpay_order_id || req.body.razorpayOrderId || req.body.order_id;
    const razorpayPaymentId = req.body.razorpay_payment_id || req.body.razorpayPaymentId || req.body.payment_id;
    const razorpaySignature = req.body.razorpay_signature || req.body.razorpaySignature || req.body.signature;

    if (!razorpayOrderId || !razorpayPaymentId) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment parameters: order_id and payment_id are required.",
      });
    }

    const ordersTable = Database.table("orders");
    let order = ordersTable.findOne(
      (o) => (orderId && o.id === orderId) || (razorpayOrderId && o.gateway_order_id === razorpayOrderId)
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Pending order record not found. Please initiate checkout.",
      });
    }

    // Cryptographic HMAC-SHA256 signature verification (Fail-closed in production)
    const razorpaySecret =
      process.env.RAZORPAY_KEY_SECRET ||
      (process.env.NODE_ENV !== "production" ? "mock_razorpay_secret_key" : null);

    if (!razorpaySecret) {
      return res.status(500).json({
        success: false,
        message: "Payment verification failed: RAZORPAY_KEY_SECRET is not configured on the server.",
      });
    }

    if (!razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Payment signature is required for verification.",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", razorpaySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const sigBuffer = Buffer.from(razorpaySignature);
    const expectedBuffer = Buffer.from(expectedSignature);
    const isValid = sigBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(sigBuffer, expectedBuffer);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Payment signature mismatch. Transaction verification failed.",
      });
    }

    // Idempotent fulfillment if order was already verified
    if (order.status === "COMPLETED") {
      const usersTable = Database.table("users");
      const student = usersTable.findOne(
        (u) => u.email && u.email.toLowerCase() === (order.customer_email || "").toLowerCase()
      );
      return res.status(200).json({
        success: true,
        message: "Payment already verified and enrollment active.",
        data: { order, student },
        order,
      });
    }

    ordersTable.update(order.id, {
      status: "COMPLETED",
      gateway_payment_id: razorpayPaymentId || `pay_LK_${Date.now()}`,
    });

    // Determine unlocked item IDs
    const unlockedItemIds = [];
    (order.items || []).forEach((it) => {
      const id = it.id || "";
      if (id) unlockedItemIds.push(id);
      if (id === "ca-book-vol-1" || id === "book-vol-1" || id === "prod-vol1" || id.includes("ca-foundation") || id.includes("ca-book") || id.includes("question-bank")) {
        unlockedItemIds.push("book-vol-1", "ca-foundation-business-laws", "course-ca-foundation-sub", "ca-foundation");
      }
      if (id === "ca-book-vol-2" || id === "book-vol-2" || id === "prod-vol2" || id.includes("cseet")) {
        unlockedItemIds.push("book-vol-2", "cseet-business-law", "cseet-management", "course-cseet-sub", "cseet");
      }
      if (id === "prod-combo" || id === "all-access") {
        unlockedItemIds.push("book-vol-1", "book-vol-2", "ca-foundation-business-laws", "cseet-business-law", "course-ca-foundation-sub", "course-cseet-sub", "all-access");
      }
      if (id.includes("mcq")) {
        unlockedItemIds.push("book-mcq");
      }
      if (id.includes("ldr")) {
        unlockedItemIds.push("book-ldr");
      }
    });

    // Create or retrieve student account
    const usersTable = Database.table("users");
    const cleanEmail = (order.customer_email || "").toLowerCase().trim();
    let student = usersTable.findOne(
      (u) => (u.email && u.email.toLowerCase() === cleanEmail)
    );

    const isCSEET = (order.target_exam || "").toLowerCase().includes("cseet");
    const studentId = student?.student_id || (isCSEET ? `LRK-2026-CS${Math.floor(1000 + Math.random() * 9000)}` : `LRK-2026-CA${Math.floor(1000 + Math.random() * 9000)}`);
    const tempPassword = student?.tempPassword || order.tempPassword || `Law@${Math.floor(1000 + Math.random() * 9000)}`;
    const passwordHash = student?.password_hash || bcrypt.hashSync(tempPassword, 10);
    const deviceId = req.body.deviceId || order.deviceId || `DEV-${Date.now()}`;
    const deviceName = req.body.deviceName || order.deviceName || "Primary Device";

    if (!student) {
      student = usersTable.insert({
        id: `usr-${Date.now()}`,
        student_id: studentId,
        name: order.customer_name || "Enrolled Student",
        email: cleanEmail,
        boundGmail: cleanEmail,
        phone: order.customer_phone || "",
        password_hash: passwordHash,
        tempPassword: tempPassword,
        target_exam: order.target_exam,
        role: "student",
        is_active: 1,
        drm_access: 1,
        unlockedItemIds,
        activeDeviceId: deviceId,
        activeDeviceName: deviceName,
        lastActiveAt: new Date().toISOString(),
      });
    } else {
      const combined = Array.from(new Set([...(student.unlockedItemIds || []), ...unlockedItemIds]));
      usersTable.update(student.id, {
        unlockedItemIds: combined,
        password_hash: passwordHash,
        tempPassword: tempPassword,
        activeDeviceId: deviceId,
        activeDeviceName: deviceName,
        lastActiveAt: new Date().toISOString(),
      });
    }

    // Insert active subscription record
    const subscriptionsTable = Database.table("subscriptions");
    const subRecord = {
      id: `LK-SUB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: student.id,
      studentName: student.name,
      studentRoll: studentId,
      email: cleanEmail,
      phone: student.phone,
      item: (order.items || []).map((i) => i.title).join(", "),
      targetExam: order.target_exam,
      amount: `₹${order.total_amount}`,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      paymentMode: "UPI / Razorpay",
      accessStatus: "Active",
      status: "ACTIVE",
      unlockedItemIds,
    };
    subscriptionsTable.insert(subRecord);

    // Sync directly to MongoDB Atlas
    const { isConnected } = require("../db/mongo");
    if (isConnected()) {
      const User = require("../models/User");
      const Subscription = require("../models/Subscription");

      User.findOneAndUpdate(
        { email: cleanEmail },
        {
          $addToSet: {
            unlockedItemIds: { $each: unlockedItemIds },
            enrolled_books: { $each: (order.items || []).map((i) => i.title) },
          },
          $set: {
            name: student.name,
            phone: student.phone,
            student_id: studentId,
            target_exam: order.target_exam,
            drm_access: true,
            is_active: true,
            password_hash: passwordHash,
            tempPassword: tempPassword,
            boundGmail: cleanEmail,
            activeDeviceId: deviceId,
            activeDeviceName: deviceName,
            lastActiveAt: new Date(),
          },
        },
        { upsert: true }
      ).catch((e) => console.error("[Orders] Atlas user sync error:", e));

      Subscription.create(subRecord).catch((e) => console.error("[Orders] Atlas sub create error:", e));
    }

    const token = jwt.sign(
      {
        id: student.id,
        email: cleanEmail,
        role: student.role || "student",
        student_id: studentId,
        deviceId: deviceId,
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    const { password_hash, ...safeStudent } = student;

    const responseData = {
      order: {
        id: order.id,
        total_amount: order.total_amount,
        status: "COMPLETED",
        tracking_number: "INSTANT-IN-WEB-DRM-ACTIVE",
        date: new Date().toISOString(),
      },
      student: {
        ...safeStudent,
        student_id: studentId,
        unlockedItemIds,
      },
      credentials: {
        studentId: studentId,
        tempPassword: tempPassword,
        email: cleanEmail,
      },
      studentId: studentId,
      tempPassword: tempPassword,
      unlockedItemIds,
      deviceId,
      token,
    };

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully. Instant In-Web DRM access granted.",
      data: responseData,
      ...responseData,
    });
  } catch (err) {
    console.error("[Orders] Verification error:", err);
    return res.status(500).json({ success: false, message: "Payment verification failed." });
  }
}

// 1. Order Creation endpoints
router.post("/orders/create", handleCreateOrder);
router.post("/create-order", handleCreateOrder);

// 2. Payment Verification endpoints
router.post("/orders/verify", handleVerifyPayment);
router.post("/verify-payment", handleVerifyPayment);


/**
 * 3. GET /api/orders/:id
 * Secure authenticated retrieval: only order owner or administrator can view
 */
router.get("/orders/:id", requireAuth, (req, res) => {
  try {
    const ordersTable = Database.table("orders");
    const order = ordersTable.findById(req.params.id) || ordersTable.findOne((o) => o.gateway_order_id === req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    const isOwner = req.user.email && order.customer_email && req.user.email.toLowerCase() === order.customer_email.toLowerCase();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Access denied. You cannot view another student's order." });
    }

    return res.status(200).json({ success: true, order });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to retrieve order." });
  }
});

module.exports = router;
