/**
 * The Law Kaksha - Admin Management & Analytics Routes
 */

const express = require("express");
const Database = require("../db/database");
const { requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Enforce admin privileges for all admin endpoints
router.use(requireAdmin);

// 1. GET /api/admin/analytics — Overview metrics
router.get("/analytics", (req, res) => {
  try {
    const usersTable = Database.table("users");
    const productsTable = Database.table("products");
    const ordersTable = Database.table("orders");
    const enrollmentsTable = Database.table("enrollments");

    const totalStudents = usersTable.count((u) => u.role === "student");
    const totalProducts = productsTable.count();
    const allOrders = ordersTable.find();
    const paidOrders = allOrders.filter((o) => o.payment_status === "PAID");

    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const activeEnrollments = enrollmentsTable.count((e) => e.access_status === "ACTIVE");

    return res.status(200).json({
      success: true,
      analytics: {
        totalRevenue,
        totalStudents,
        totalOrders: allOrders.length,
        paidOrdersCount: paidOrders.length,
        activeEnrollments,
        totalProducts,
      },
    });
  } catch (err) {
    console.error("[Admin] Analytics error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// 2. GET /api/admin/orders — Full order list
router.get("/orders", (req, res) => {
  try {
    const ordersTable = Database.table("orders");
    const orderItemsTable = Database.table("order_items");
    const productsTable = Database.table("products");

    const orders = ordersTable.find();
    const detailedOrders = orders.map((o) => {
      const items = orderItemsTable.find((oi) => oi.order_id === o.id);
      const itemsWithTitle = items.map((i) => {
        const product = productsTable.findById(i.product_id);
        return {
          ...i,
          title: product ? product.title : i.product_id,
        };
      });
      return {
        ...o,
        items: itemsWithTitle,
      };
    });

    return res.status(200).json({
      success: true,
      count: detailedOrders.length,
      orders: detailedOrders,
    });
  } catch (err) {
    console.error("[Admin] Orders error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// 3. PUT /api/admin/orders/:id/status — Update tracking or status
router.put("/orders/:id/status", (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status, tracking_number } = req.body;
    const ordersTable = Database.table("orders");

    const updates = {};
    if (payment_status) updates.payment_status = payment_status;
    if (tracking_number !== undefined) updates.tracking_number = tracking_number;

    const updated = ordersTable.update(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Order updated successfully.",
      order: updated,
    });
  } catch (err) {
    console.error("[Admin] Update order error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// 4. GET /api/admin/students — Student list with active enrollments
router.get("/students", (req, res) => {
  try {
    const usersTable = Database.table("users");
    const enrollmentsTable = Database.table("enrollments");
    const productsTable = Database.table("products");

    const students = usersTable.find((u) => u.role === "student");
    const detailedStudents = students.map((s) => {
      const { password_hash, ...safeStudent } = s;
      const studentEnrollments = enrollmentsTable.find((e) => e.user_id === s.id);
      const unlockedProducts = studentEnrollments.map((e) => {
        const prod = productsTable.findById(e.product_id);
        return {
          productId: e.product_id,
          accessStatus: e.access_status,
          title: prod ? prod.title : e.product_id,
          grantedAt: e.granted_at,
        };
      });

      return {
        ...safeStudent,
        enrollments: unlockedProducts,
        unlockedItemIds: studentEnrollments
          .filter((e) => e.access_status === "ACTIVE")
          .map((e) => e.product_id),
      };
    });

    return res.status(200).json({
      success: true,
      count: detailedStudents.length,
      students: detailedStudents,
    });
  } catch (err) {
    console.error("[Admin] Students error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// 5. POST /api/admin/students/:id/toggle-access — Manually grant or revoke course
router.post("/students/:id/toggle-access", (req, res) => {
  try {
    const { id } = req.params;
    const { productId, action } = req.body; // action: 'grant' | 'revoke'

    if (!productId || !action) {
      return res.status(400).json({
        success: false,
        message: "Product ID and action ('grant' or 'revoke') are required.",
      });
    }

    const enrollmentsTable = Database.table("enrollments");
    const existing = enrollmentsTable.findOne(
      (e) => e.user_id === id && e.product_id === productId
    );

    if (action === "grant") {
      if (existing) {
        enrollmentsTable.update(existing.id, { access_status: "ACTIVE" });
      } else {
        enrollmentsTable.insert({
          id: `enr-${Date.now()}`,
          user_id: id,
          product_id: productId,
          order_id: "ADMIN-MANUAL-GRANT",
          access_status: "ACTIVE",
        });
      }
    } else if (action === "revoke") {
      if (existing) {
        enrollmentsTable.update(existing.id, { access_status: "REVOKED" });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Course access ${action === "grant" ? "granted" : "revoked"} successfully.`,
    });
  } catch (err) {
    console.error("[Admin] Toggle access error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

module.exports = router;
