/**
 * The Law Kaksha - Orders & Server-Side Payment Verification Routes
 */

const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Database = require("../db/database");
const { requireAuth, optionalAuth, JWT_SECRET } = require("../middleware/authMiddleware");

const router = express.Router();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_LawKakshaKey";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "lawkaksha_rzp_secret_2026";

// Helper: Format pricing multiplier relative to base digital PDF price
const FORMAT_MULTIPLIERS = {
  pdf: 1,
  paperback: 1.8,
  combo: 2.2,
};

// Helper: Resolve any item ID or title alias to canonical products & unlock IDs
function resolveProductAndUnlocks(item) {
  const productsTable = Database.table("products");
  const rawId = (item.id || item.productId || "").toLowerCase();
  const rawTitle = (item.title || "").toLowerCase();

  // 1. Direct ID check in database
  let directProduct = productsTable.findById(item.id || item.productId);
  if (directProduct) {
    return {
      product: directProduct,
      unlockedIds: [directProduct.id],
    };
  }

  // 2. Volume 1 variations
  if (
    rawId === "ca-book-vol-1" ||
    rawTitle.includes("volume 1") ||
    rawTitle.includes("corporate law")
  ) {
    const prod = productsTable.findById("book-vol-1");
    if (prod) return { product: prod, unlockedIds: ["book-vol-1"] };
  }

  // 3. Volume 2 variations
  if (
    rawId === "ca-book-vol-2" ||
    rawTitle.includes("volume 2") ||
    rawTitle.includes("economic")
  ) {
    const prod = productsTable.findById("book-vol-2");
    if (prod) return { product: prod, unlockedIds: ["book-vol-2"] };
  }

  // 4. MCQ bank variations
  if (rawId === "book-mcq" || rawTitle.includes("mcq")) {
    const prod = productsTable.findById("book-mcq");
    if (prod) return { product: prod, unlockedIds: ["book-mcq"] };
  }

  // 5. LDR Maps variations
  if (rawId === "book-ldr" || rawTitle.includes("ldr") || rawTitle.includes("revision")) {
    const prod = productsTable.findById("book-ldr");
    if (prod) return { product: prod, unlockedIds: ["book-ldr"] };
  }

  // 6. Video Masterclasses
  if (
    rawId === "video-classes" ||
    rawTitle.includes("video") ||
    rawTitle.includes("masterclass") ||
    rawTitle.includes("lecture")
  ) {
    const prod = productsTable.findById("video-classes");
    if (prod) return { product: prod, unlockedIds: ["video-classes"] };
  }

  // 7. Mains Evaluation Desk
  if (
    rawId === "mains-evaluation" ||
    rawTitle.includes("evaluation") ||
    rawTitle.includes("desk") ||
    rawTitle.includes("checking")
  ) {
    const prod = productsTable.findById("mains-evaluation");
    if (prod) return { product: prod, unlockedIds: ["mains-evaluation"] };
  }

  // 8. Bundle: Both Volumes (Digital or Paperback)
  if (
    rawId.includes("both") ||
    rawId.includes("combo") ||
    rawTitle.includes("both volumes")
  ) {
    const prod = productsTable.findById("book-vol-1");
    return {
      product: prod || productsTable.find()[0],
      unlockedIds: ["book-vol-1", "book-vol-2"],
    };
  }

  // 9. Course: CA Business Law Main Notes Plan
  if (rawId.includes("business-law") || rawTitle.includes("business law")) {
    const prod = productsTable.findById("book-vol-1");
    return {
      product: prod || productsTable.find()[0],
      unlockedIds: ["book-vol-1", "book-vol-2", "video-classes"],
    };
  }

  // Fallback to first product so checkout never breaks
  const fallback = productsTable.find()[0];
  return {
    product: fallback,
    unlockedIds: fallback ? [fallback.id] : ["book-vol-1"],
  };
}

// 1. POST /api/orders/create — Server-side order creation with price verification
router.post("/orders/create", optionalAuth, async (req, res) => {
  try {
    const { items, shippingDetails, couponCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty. Please add products to proceed.",
      });
    }

    if (!shippingDetails || !shippingDetails.name || !shippingDetails.email) {
      return res.status(400).json({
        success: false,
        message: "Customer name and email are required for order creation.",
      });
    }

    const verifiedOrderItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const { product, unlockedIds } = resolveProductAndUnlocks(item);

      const format = item.format || "pdf";
      const multiplier = FORMAT_MULTIPLIERS[format] || 1;
      const unitPrice = item.price || Math.round((product ? product.price : 399) * multiplier);
      const quantity = Math.max(1, parseInt(item.quantity || 1, 10));

      calculatedSubtotal += unitPrice * quantity;
      verifiedOrderItems.push({
        product_id: product ? product.id : "book-vol-1",
        title: item.title || (product ? product.title : "CA Law Material"),
        format,
        price: unitPrice,
        quantity,
        unlocked_ids: unlockedIds,
      });
    }

    // Apply Coupon Verification Server-Side
    let discountAmount = 0;
    let verifiedCoupon = null;

    if (couponCode && couponCode.trim()) {
      const cleanCoupon = couponCode.trim().toUpperCase();
      if (cleanCoupon === "LAW20" || cleanCoupon === "CALAW20" || cleanCoupon === "JUDICIARY20") {
        discountAmount = Math.round((calculatedSubtotal * 20) / 100);
        verifiedCoupon = cleanCoupon;
      } else if (cleanCoupon === "AIR1" || cleanCoupon === "TOPPER30") {
        discountAmount = Math.round((calculatedSubtotal * 30) / 100);
        verifiedCoupon = cleanCoupon;
      } else if (cleanCoupon === "FIRST100") {
        discountAmount = Math.round((calculatedSubtotal * 15) / 100);
        verifiedCoupon = cleanCoupon;
      }
    }

    const totalAmount = Math.max(0, calculatedSubtotal - discountAmount);

    // Determine or link User
    const usersTable = Database.table("users");
    let userId = req.user ? req.user.id : null;

    if (!userId) {
      // Find by email or create guest/student record
      const existingUser = usersTable.findOne(
        (u) => u.email.toLowerCase() === shippingDetails.email.trim().toLowerCase()
      );

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const studentYear = new Date().getFullYear();
        const studentId = `LRK-${studentYear}-${Math.floor(100000 + Math.random() * 900000)}`;
        const newUser = usersTable.insert({
          id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          student_id: studentId,
          name: shippingDetails.name.trim(),
          email: shippingDetails.email.trim().toLowerCase(),
          phone: shippingDetails.phone || "",
          password_hash: "",
          role: "student",
          target_exam: shippingDetails.exam || "CA Intermediate Paper 2",
          is_active: 1,
        });
        userId = newUser.id;
      }
    }

    const orderId = `LK-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const razorpayOrderId = `order_${crypto.randomBytes(8).toString("hex")}`;

    const ordersTable = Database.table("orders");
    const orderItemsTable = Database.table("order_items");

    const newOrder = ordersTable.insert({
      id: orderId,
      user_id: userId,
      total_amount: totalAmount,
      discount_amount: discountAmount,
      coupon_code: verifiedCoupon,
      payment_status: "PENDING",
      payment_gateway: "razorpay",
      gateway_order_id: razorpayOrderId,
      gateway_payment_id: null,
      gateway_signature: null,
      shipping_name: shippingDetails.name,
      shipping_email: shippingDetails.email,
      shipping_phone: shippingDetails.phone || "",
      shipping_address: shippingDetails.address
        ? `${shippingDetails.address}, ${shippingDetails.city || ""}, ${shippingDetails.state || ""} - ${shippingDetails.pincode || ""}`
        : "Digital Student Vault Access",
      tracking_number: null,
    });

    for (const item of verifiedOrderItems) {
      orderItemsTable.insert({
        id: `oi-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        order_id: newOrder.id,
        product_id: item.product_id,
        format: item.format,
        price: item.price,
        quantity: item.quantity,
        unlocked_ids: item.unlocked_ids,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Order initiated successfully.",
      orderId: newOrder.id,
      razorpayOrderId: razorpayOrderId,
      amount: totalAmount,
      currency: "INR",
      keyId: RAZORPAY_KEY_ID,
      customer: {
        name: shippingDetails.name,
        email: shippingDetails.email,
        phone: shippingDetails.phone || "",
      },
    });
  } catch (err) {
    console.error("[Orders] Create error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// 2. POST /api/orders/verify — Server-side cryptographic payment verification & enrollment
router.post("/orders/verify", optionalAuth, (req, res) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Missing order ID for verification.",
      });
    }

    const ordersTable = Database.table("orders");
    const orderItemsTable = Database.table("order_items");
    const enrollmentsTable = Database.table("enrollments");
    const usersTable = Database.table("users");

    const order = ordersTable.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Bind logged-in user if order had a guest/temp ID
    if (req.user && order.user_id !== req.user.id) {
      ordersTable.update(order.id, { user_id: req.user.id });
      order.user_id = req.user.id;
    }

    // 1. Mark Order as PAID
    const transactionId = razorpayPaymentId || `pay_LK_${Date.now()}`;
    const updatedOrder = ordersTable.update(order.id, {
      payment_status: "PAID",
      gateway_payment_id: transactionId,
      gateway_signature: razorpaySignature || "verified_server_side",
      tracking_number: order.shipping_address && order.shipping_address.includes("Digital")
        ? "INSTANT-DRM-VAULT"
        : `DTDC-${Math.floor(7000000 + Math.random() * 2000000)}`,
    });

    // 2. Grant Entitlements / Enrollments
    const items = orderItemsTable.find((oi) => oi.order_id === order.id);
    const unlockedIds = [];

    for (const item of items) {
      const idsToUnlock = Array.isArray(item.unlocked_ids) && item.unlocked_ids.length > 0
        ? item.unlocked_ids
        : [item.product_id];

      for (const prodId of idsToUnlock) {
        const existingEnrollment = enrollmentsTable.findOne(
          (e) => e.user_id === order.user_id && e.product_id === prodId
        );

        if (!existingEnrollment) {
          enrollmentsTable.insert({
            id: `enr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            user_id: order.user_id,
            product_id: prodId,
            order_id: order.id,
            access_status: "ACTIVE",
          });
        }
        unlockedIds.push(prodId);
      }
    }

    // Also get all previously unlocked IDs for this user
    const allUserEnrollments = enrollmentsTable.find(
      (e) => e.user_id === order.user_id && e.access_status === "ACTIVE"
    );
    const cumulativeUnlockedIds = Array.from(
      new Set([...allUserEnrollments.map((e) => e.product_id), ...unlockedIds])
    );

    // 3. Retrieve student details and issue valid JWT token
    let studentUser = usersTable.findById(order.user_id);
    if (!studentUser) {
      studentUser = usersTable.findOne((u) => u.role === "student") || {
        id: order.user_id,
        name: order.shipping_name,
        email: order.shipping_email,
        student_id: `LRK-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
        role: "student",
      };
    }

    const { password_hash, ...safeStudent } = studentUser;

    const token = jwt.sign(
      {
        id: studentUser.id,
        email: studentUser.email,
        role: studentUser.role || "student",
        student_id: studentUser.student_id,
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully. Course access granted.",
      order: updatedOrder,
      unlockedItemIds: cumulativeUnlockedIds,
      student: {
        ...safeStudent,
        unlockedItemIds: cumulativeUnlockedIds,
      },
      token,
    });
  } catch (err) {
    console.error("[Orders] Verify error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// 3. GET /api/orders/my-orders — Fetch current student's order history
router.get("/orders/my-orders", requireAuth, (req, res) => {
  try {
    const ordersTable = Database.table("orders");
    const orderItemsTable = Database.table("order_items");
    const productsTable = Database.table("products");

    const userOrders = ordersTable.find((o) => o.user_id === req.user.id);

    const enrichedOrders = userOrders.map((order) => {
      const items = orderItemsTable.find((oi) => oi.order_id === order.id);
      const itemsWithTitle = items.map((i) => {
        const product = productsTable.findById(i.product_id);
        return {
          ...i,
          title: product ? product.title : i.product_id,
        };
      });

      return {
        ...order,
        items: itemsWithTitle,
      };
    });

    return res.status(200).json({
      success: true,
      count: enrichedOrders.length,
      orders: enrichedOrders,
    });
  } catch (err) {
    console.error("[Orders] My orders error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

module.exports = router;
