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
const { grantEntitlement, reconcileOrder } = require("../services/entitlementService");

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
    const phone = shippingDetails.phone || req.body.phone || "";
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

    // Fulfill entitlement idempotently using EntitlementService
    const grantResult = await grantEntitlement(order.id, {
      gatewayPaymentId: razorpayPaymentId,
      gatewayOrderId: razorpayOrderId,
      paymentMethod: "UPI / Razorpay",
      grantedBy: "razorpay_verify",
      deviceId: req.body.deviceId,
      deviceName: req.body.deviceName,
    });

    if (!grantResult.success) {
      return res.status(500).json({
        success: false,
        message: grantResult.message || "Payment verified but access fulfillment failed.",
      });
    }

    const student = grantResult.student;
    const cleanEmail = student.email;
    const studentId = student.student_id;
    const deviceId = req.body.deviceId || student.activeDeviceId || `DEV-${Date.now()}`;
    const tempPassword = grantResult.credentials?.tempPassword || student.tempPassword;

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
        id: grantResult.order.id,
        total_amount: grantResult.order.total_amount,
        status: "COMPLETED",
        tracking_number: "INSTANT-IN-WEB-DRM-ACTIVE",
        date: new Date().toISOString(),
      },
      student: {
        ...safeStudent,
        student_id: studentId,
        unlockedItemIds: student.unlockedItemIds,
      },
      credentials: {
        studentId: studentId,
        tempPassword: tempPassword,
        email: cleanEmail,
      },
      studentId: studentId,
      tempPassword: tempPassword,
      unlockedItemIds: student.unlockedItemIds,
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
    return res.status(500).json({ success: false, message: "Payment verification failed: " + err.message });
  }
}

/**
 * 4. Razorpay Webhook Handler
 * POST /api/webhooks/razorpay
 * Cryptographically verifies x-razorpay-signature and fulfills entitlement for order.paid / payment.captured
 */
async function handleRazorpayWebhook(req, res) {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const webhookSecret =
      process.env.RAZORPAY_WEBHOOK_SECRET ||
      process.env.RAZORPAY_KEY_SECRET ||
      (process.env.NODE_ENV !== "production" ? "mock_razorpay_webhook_secret" : null);

    if (!webhookSecret) {
      if (process.env.NODE_ENV === "production") {
        return res.status(500).json({ success: false, message: "RAZORPAY_WEBHOOK_SECRET unconfigured in production." });
      }
    }

    if (webhookSecret && signature) {
      const payload = req.rawBody ? req.rawBody.toString() : (typeof req.body === "string" ? req.body : JSON.stringify(req.body));
      const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(payload).digest("hex");

      const sigBuffer = Buffer.from(signature);
      const expectedBuffer = Buffer.from(expectedSignature);
      const isValid = sigBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(sigBuffer, expectedBuffer);

      if (!isValid) {
        console.warn("[Razorpay Webhook] Signature mismatch.");
        return res.status(400).json({ success: false, message: "Webhook signature mismatch." });
      }
    } else if (process.env.NODE_ENV === "production") {
      return res.status(400).json({ success: false, message: "Missing required webhook signature header." });
    }

    const event = req.body?.event;
    const payload = req.body?.payload || {};

    let gatewayOrderId = null;
    let gatewayPaymentId = null;

    if (event === "order.paid") {
      gatewayOrderId = payload.order?.entity?.id;
      gatewayPaymentId = payload.payment?.entity?.id;
    } else if (event === "payment.captured") {
      gatewayPaymentId = payload.payment?.entity?.id;
      gatewayOrderId = payload.payment?.entity?.order_id;
    }

    if (!gatewayOrderId && !gatewayPaymentId) {
      return res.status(200).json({ status: "ok", message: `Event ${event} acknowledged.` });
    }

    const ordersTable = Database.table("orders");
    const order = ordersTable.findOne(
      (o) =>
        (gatewayOrderId && o.gateway_order_id === gatewayOrderId) ||
        (gatewayPaymentId && o.gateway_payment_id === gatewayPaymentId)
    );

    if (!order) {
      console.warn(`[Razorpay Webhook] Order not found for gatewayOrderId: ${gatewayOrderId}`);
      return res.status(200).json({ status: "ok", message: "Order not tracked, ignored." });
    }

    const grantResult = await grantEntitlement(order.id, {
      gatewayPaymentId: gatewayPaymentId || `pay_wh_${Date.now()}`,
      gatewayOrderId,
      grantedBy: "razorpay_webhook",
      rawPayload: req.body,
    });

    return res.status(200).json({
      status: "ok",
      success: true,
      message: "Webhook processed and digital entitlement granted.",
      alreadyGranted: grantResult.alreadyGranted,
    });
  } catch (err) {
    console.error("[Razorpay Webhook] Processing error:", err);
    return res.status(500).json({ success: false, message: "Webhook error: " + err.message });
  }
}

// 1. Order Creation endpoint
router.post("/orders/create", handleCreateOrder);

// 2. Payment Verification endpoint
router.post("/orders/verify", handleVerifyPayment);

// 3. Razorpay Webhooks
router.post("/webhooks/razorpay", handleRazorpayWebhook);
router.post("/webhook/razorpay", handleRazorpayWebhook);

// 4. Order Reconcile & Status Endpoints
router.get("/orders/:id/status", async (req, res) => {
  try {
    const result = await reconcileOrder(req.params.id);
    if (!result.success && result.error === "ORDER_NOT_FOUND") {
      return res.status(404).json(result);
    }
    return res.status(200).json(result);
  } catch (err) {
    console.error("[Orders] Status error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/orders/:id/reconcile", async (req, res) => {
  try {
    const result = await reconcileOrder(req.params.id);
    if (!result.success && result.error === "ORDER_NOT_FOUND") {
      return res.status(404).json(result);
    }
    return res.status(200).json(result);
  } catch (err) {
    console.error("[Orders] Reconcile error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/orders/reconcile-my-access", requireAuth, async (req, res) => {
  try {
    const email = (req.user.email || "").toLowerCase().trim();
    if (!email) {
      return res.status(400).json({ success: false, message: "User email not found in token." });
    }

    const ordersTable = Database.table("orders");
    const userOrders = ordersTable.find(
      (o) =>
        (o.customer_email && o.customer_email.toLowerCase() === email) ||
        (o.personal_details?.email && o.personal_details.email.toLowerCase() === email)
    );

    let reconciledCount = 0;
    for (const ord of userOrders) {
      if (ord.status === "PENDING" || ord.status === "pending") {
        const rec = await reconcileOrder(ord);
        if (rec.reconciled) reconciledCount++;
      } else if (ord.status === "COMPLETED" || ord.status === "paid") {
        await grantEntitlement(ord.id, { grantedBy: "reconcile" });
      }
    }

    const entitlementsTable = Database.table("entitlements");
    const studentEntitlements = entitlementsTable.find(
      (e) => (e.user_id === req.user.id || e.user_email === email) && e.status === "active"
    );

    return res.status(200).json({
      success: true,
      message:
        reconciledCount > 0
          ? `Successfully reconciled ${reconciledCount} order(s). Access is now active!`
          : "Access check complete. All paid orders are currently active.",
      reconciledCount,
      entitlements: studentEntitlements,
    });
  } catch (err) {
    console.error("[Orders] Reconcile my access error:", err);
    return res.status(500).json({ success: false, message: "Failed to reconcile access: " + err.message });
  }
});


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
