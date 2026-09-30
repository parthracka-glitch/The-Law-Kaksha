/**
 * The Law Kaksha - Single-Administrator Master Operations & Control API
 * Full Control: Books/Products, Users, Batches, Sessions, Orders, DRM Keys & Mains Grading
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const Database = require("../db/database");
const { requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Enforce admin privileges for all endpoints in this router
router.use(requireAdmin);

// =============================================================================
// 1. ANALYTICS & REVENUE OVERVIEW
// =============================================================================
router.get("/analytics", (req, res) => {
  try {
    const usersTable = Database.table("users");
    const productsTable = Database.table("products");
    const ordersTable = Database.table("orders");
    const enrollmentsTable = Database.table("enrollments");
    const batchesTable = Database.table("batches");

    const totalStudents = usersTable.count((u) => u.role === "student");
    const totalProducts = productsTable.count();
    const allOrders = ordersTable.find();
    const paidOrders = allOrders.filter((o) => o.payment_status === "PAID");

    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const activeEnrollments = enrollmentsTable.count((e) => e.access_status === "ACTIVE");
    const totalBatches = batchesTable.count();

    return res.status(200).json({
      success: true,
      analytics: {
        totalRevenue,
        totalStudents,
        totalOrders: allOrders.length,
        paidOrdersCount: paidOrders.length,
        activeEnrollments,
        totalProducts,
        totalBatches,
      },
    });
  } catch (err) {
    console.error("[Admin] Analytics error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// =============================================================================
// 2. BOOKS & COURSE CATALOG MANAGEMENT (CRUD)
// =============================================================================

// List all products / books
router.get("/products", (req, res) => {
  try {
    const productsTable = Database.table("products");
    const products = productsTable.find();
    return res.status(200).json({ success: true, count: products.length, products });
  } catch (err) {
    console.error("[Admin] Get products error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Add new book / product
router.post("/products", (req, res) => {
  try {
    const {
      title,
      subtitle,
      type = "book",
      category,
      price,
      original_price,
      pages_or_duration,
      stock = 100,
      description,
      badge,
      highlights = [],
      syllabus = [],
      preview_file,
      full_file_key,
    } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, price, and category are required.",
      });
    }

    const productsTable = Database.table("products");
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newProduct = productsTable.insert({
      id: `prod-${Date.now()}`,
      slug,
      type,
      title,
      subtitle: subtitle || "Comprehensive Academic Study Module",
      category,
      price: Number(price),
      original_price: Number(original_price || price * 1.4),
      pages_or_duration: pages_or_duration || "400 Pages",
      stock: Number(stock),
      description: description || "Official study materials engineered for CA aspirants.",
      badge: badge || "New Edition",
      cover_image: "/covers/vol1-codex.webp",
      preview_file: preview_file || "sample-preview.pdf",
      full_file_key: full_file_key || `vault/${slug}-2026.pdf`,
      highlights: highlights.length > 0 ? highlights : ["ICAI Syllabus Aligned", "Solved Case Scenarios"],
      syllabus: syllabus.length > 0 ? syllabus : [{ chapter: "Chapter 1", title: "Statutory Provisions & Analysis" }],
      status: "published",
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully.",
      product: newProduct,
    });
  } catch (err) {
    console.error("[Admin] Add product error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Edit existing book / product
router.put("/products/:id", (req, res) => {
  try {
    const { id } = req.params;
    const productsTable = Database.table("products");
    const existing = productsTable.findById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const updates = { ...req.body };
    if (updates.price) updates.price = Number(updates.price);
    if (updates.original_price) updates.original_price = Number(updates.original_price);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);

    const updated = productsTable.update(id, updates);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product: updated,
    });
  } catch (err) {
    console.error("[Admin] Update product error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Delete book / product
router.delete("/products/:id", (req, res) => {
  try {
    const { id } = req.params;
    const productsTable = Database.table("products");
    const deleted = productsTable.delete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    return res.status(200).json({ success: true, message: "Product deleted successfully." });
  } catch (err) {
    console.error("[Admin] Delete product error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// =============================================================================
// 3. USERS & STUDENTS MANAGEMENT
// =============================================================================

// List all students
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

// Create new student
router.post("/students", async (req, res) => {
  try {
    const { name, email, phone, target_exam, password } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required." });
    }

    const usersTable = Database.table("users");
    const existing = usersTable.findOne((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered." });
    }

    const passwordHash = await bcrypt.hash(password || "Password2026!", 10);
    const newStudent = usersTable.insert({
      id: `usr-std-${Date.now()}`,
      student_id: `LK-${Date.now().toString().slice(-6)}`,
      name,
      email,
      phone: phone || "",
      password_hash: passwordHash,
      role: "student",
      target_exam: target_exam || "CA Final 2026",
      is_active: 1,
    });

    const { password_hash, ...safe } = newStudent;
    return res.status(201).json({ success: true, message: "Student created successfully.", student: safe });
  } catch (err) {
    console.error("[Admin] Create student error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Reset Student Password
router.post("/students/:id/reset-password", async (req, res) => {
  try {
    const { id } = req.params;
    const { new_password } = req.body;
    const usersTable = Database.table("users");

    const student = usersTable.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    const passwordHash = await bcrypt.hash(new_password || "Password2026!", 10);
    usersTable.update(id, { password_hash: passwordHash });

    return res.status(200).json({ success: true, message: "Student password reset successfully." });
  } catch (err) {
    console.error("[Admin] Reset password error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Reset DRM Device Lock for a Student
router.post("/students/:id/reset-drm", (req, res) => {
  try {
    const { id } = req.params;
    const usersTable = Database.table("users");

    const student = usersTable.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    // Reset hardware bound devices
    usersTable.update(id, { bound_devices: [], drm_reset_at: new Date().toISOString() });

    return res.status(200).json({
      success: true,
      message: "Student DRM hardware workstations reset successfully. The student may now bind 2 new devices.",
    });
  } catch (err) {
    console.error("[Admin] Reset DRM error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Toggle student status (Active/Inactive)
router.put("/students/:id/status", (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    const usersTable = Database.table("users");

    const updated = usersTable.update(id, { is_active: is_active ? 1 : 0 });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    return res.status(200).json({
      success: true,
      message: `Student account ${is_active ? "activated" : "deactivated"}.`,
      student: updated,
    });
  } catch (err) {
    console.error("[Admin] Toggle student status error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Grant / Revoke course enrollment
router.post("/students/:id/toggle-access", (req, res) => {
  try {
    const { id } = req.params;
    const { productId, action } = req.body;

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
          granted_at: new Date().toISOString(),
        });
      }
    } else if (action === "revoke") {
      if (existing) {
        enrollmentsTable.update(existing.id, { access_status: "REVOKED" });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Access ${action === "grant" ? "granted" : "revoked"} successfully.`,
    });
  } catch (err) {
    console.error("[Admin] Toggle access error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// =============================================================================
// 4. BATCHES & SESSIONS MANAGEMENT
// =============================================================================

// List all batches
router.get("/batches", (req, res) => {
  try {
    const batchesTable = Database.table("batches");
    let batches = batchesTable.find();
    if (batches.length === 0) {
      // Seed default batches if empty
      const defaultBatches = [
        {
          id: "batch-ca-final-may26",
          name: "CA Final Corporate & Economic Laws (May 2026 Batch)",
          level: "CA Final",
          target_attempt: "May 2026",
          status: "ACTIVE",
          enrolled_count: 420,
          schedule: "Mon, Wed, Fri (07:00 PM - 09:00 PM)",
          linked_products: ["book-vol-1", "video-classes"],
        },
        {
          id: "batch-ca-inter-nov26",
          name: "CA Intermediate Business Laws Regular Batch (Nov 2026)",
          level: "CA Intermediate",
          target_attempt: "Nov 2026",
          status: "ACTIVE",
          enrolled_count: 680,
          schedule: "Tue, Thu, Sat (06:30 PM - 08:30 PM)",
          linked_products: ["book-vol-2", "book-mcq"],
        },
      ];
      defaultBatches.forEach((b) => batchesTable.insert(b));
      batches = batchesTable.find();
    }

    return res.status(200).json({ success: true, count: batches.length, batches });
  } catch (err) {
    console.error("[Admin] Get batches error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Create new batch
router.post("/batches", (req, res) => {
  try {
    const { name, level, target_attempt, schedule, linked_products = [] } = req.body;
    if (!name || !level) {
      return res.status(400).json({ success: false, message: "Batch name and level are required." });
    }

    const batchesTable = Database.table("batches");
    const newBatch = batchesTable.insert({
      id: `batch-${Date.now()}`,
      name,
      level,
      target_attempt: target_attempt || "2026 Batch",
      status: "ACTIVE",
      enrolled_count: 0,
      schedule: schedule || "TBA",
      linked_products,
    });

    return res.status(201).json({ success: true, message: "Batch created successfully.", batch: newBatch });
  } catch (err) {
    console.error("[Admin] Create batch error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Edit batch
router.put("/batches/:id", (req, res) => {
  try {
    const { id } = req.params;
    const batchesTable = Database.table("batches");
    const updated = batchesTable.update(id, req.body);

    if (!updated) {
      return res.status(404).json({ success: false, message: "Batch not found." });
    }

    return res.status(200).json({ success: true, message: "Batch updated successfully.", batch: updated });
  } catch (err) {
    console.error("[Admin] Update batch error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Delete batch
router.delete("/batches/:id", (req, res) => {
  try {
    const { id } = req.params;
    const batchesTable = Database.table("batches");
    const deleted = batchesTable.delete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Batch not found." });
    }

    return res.status(200).json({ success: true, message: "Batch deleted successfully." });
  } catch (err) {
    console.error("[Admin] Delete batch error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// List all sessions
router.get("/sessions", (req, res) => {
  try {
    const sessionsTable = Database.table("sessions");
    let sessions = sessionsTable.find();
    if (sessions.length === 0) {
      const defaultSessions = [
        {
          id: "sess-01",
          batch_id: "batch-ca-final-may26",
          topic: "Companies Act Section 186 (Loans & Investments Deep Dive)",
          date: "2026-10-02",
          time: "19:00 IST",
          duration_minutes: 120,
          meeting_link: "https://zoom.us/j/lawkaksha-room-1",
          status: "UPCOMING",
        },
        {
          id: "sess-02",
          batch_id: "batch-ca-inter-nov26",
          topic: "General Clauses Act (Statutory Presumptions & Precedents)",
          date: "2026-10-03",
          time: "18:30 IST",
          duration_minutes: 90,
          meeting_link: "https://zoom.us/j/lawkaksha-room-2",
          status: "UPCOMING",
        },
      ];
      defaultSessions.forEach((s) => sessionsTable.insert(s));
      sessions = sessionsTable.find();
    }

    return res.status(200).json({ success: true, count: sessions.length, sessions });
  } catch (err) {
    console.error("[Admin] Get sessions error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Schedule new session
router.post("/sessions", (req, res) => {
  try {
    const { batch_id, topic, date, time, duration_minutes = 90, meeting_link } = req.body;
    if (!topic || !date || !time) {
      return res.status(400).json({ success: false, message: "Topic, date, and time are required." });
    }

    const sessionsTable = Database.table("sessions");
    const newSession = sessionsTable.insert({
      id: `sess-${Date.now()}`,
      batch_id: batch_id || "general",
      topic,
      date,
      time,
      duration_minutes: Number(duration_minutes),
      meeting_link: meeting_link || "https://zoom.us/j/lawkaksha-live",
      status: "UPCOMING",
    });

    return res.status(201).json({ success: true, message: "Session scheduled successfully.", session: newSession });
  } catch (err) {
    console.error("[Admin] Schedule session error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Delete session
router.delete("/sessions/:id", (req, res) => {
  try {
    const { id } = req.params;
    const sessionsTable = Database.table("sessions");
    const deleted = sessionsTable.delete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Session not found." });
    }

    return res.status(200).json({ success: true, message: "Session cancelled successfully." });
  } catch (err) {
    console.error("[Admin] Delete session error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// =============================================================================
// 5. ORDERS & LOGISTICS DISPATCH
// =============================================================================
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

router.put("/orders/:id/status", (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status, tracking_number, fulfillment_status } = req.body;
    const ordersTable = Database.table("orders");

    const updates = {};
    if (payment_status) updates.payment_status = payment_status;
    if (fulfillment_status) updates.fulfillment_status = fulfillment_status;
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

module.exports = router;
