/**
 * The Law Kaksha - Complete Admin REST API Routes
 * Endpoints for managing Subscriptions, Students & DRM rights, Books/Codices, Cases, MCQs, Coupons, QOTD & Analytics
 */

const express = require("express");
const Database = require("../db/database");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper to get or initialize a collection
function getTable(name) {
  return Database.table(name);
}

// -----------------------------------------------------------------------------
// 1. ANALYTICS / OVERVIEW
// -----------------------------------------------------------------------------
router.get("/admin/analytics", (req, res) => {
  try {
    const subsTable = getTable("subscriptions");
    const studentsTable = getTable("users");
    const productsTable = getTable("products");

    const subs = subsTable.find();
    const totalRevenue = subs.reduce((acc, curr) => {
      const num = parseInt(String(curr.amount || curr.price || 0).replace(/[^0-9]/g, "")) || 0;
      return acc + num;
    }, 0);

    const activeSubs = subs.filter((s) => s.accessStatus === "Active" || s.status === "ACTIVE").length;
    const students = studentsTable.find((u) => u.role === "student");

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        activeSubscriptionsCount: activeSubs,
        totalStudentsCount: students.length,
        activeStudentsCount: students.filter((s) => s.is_active !== 0).length,
        productsCount: productsTable.count(),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching analytics." });
  }
});

// -----------------------------------------------------------------------------
// 2. SUBSCRIPTIONS CRUD
// -----------------------------------------------------------------------------
router.get("/admin/subscriptions", (req, res) => {
  try {
    const subsTable = getTable("subscriptions");
    res.status(200).json({ success: true, subscriptions: subsTable.find() });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching subscriptions." });
  }
});

router.post("/admin/subscriptions", (req, res) => {
  try {
    const subsTable = getTable("subscriptions");
    const newSub = subsTable.insert({
      id: req.body.id || `LK-SUB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: req.body.studentName || "Enrolled Student",
      studentRoll: req.body.studentRoll || "LRK-2026-004182",
      email: req.body.email || "student@thelawkaksha.com",
      phone: req.body.phone || "+91 98765 43210",
      item: req.body.item || "Volume 1 & 2 Master Digital Pass",
      targetExam: req.body.targetExam || "CA Foundation Paper 2",
      amount: req.body.amount || "₹449",
      date: req.body.date || new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      paymentMode: req.body.paymentMode || "Direct Grant / Admin",
      accessStatus: req.body.accessStatus || "Active",
      status: "ACTIVE",
    });
    res.status(201).json({ success: true, subscription: newSub });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating subscription." });
  }
});

router.put("/admin/subscriptions/:id", (req, res) => {
  try {
    const subsTable = getTable("subscriptions");
    const updated = subsTable.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Subscription not found." });
    res.status(200).json({ success: true, subscription: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating subscription." });
  }
});

router.delete("/admin/subscriptions/:id", (req, res) => {
  try {
    const subsTable = getTable("subscriptions");
    const success = subsTable.delete(req.params.id);
    res.status(200).json({ success });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting subscription." });
  }
});

// -----------------------------------------------------------------------------
// 3. STUDENTS CRUD
// -----------------------------------------------------------------------------
router.get("/admin/students", (req, res) => {
  try {
    const usersTable = getTable("users");
    const students = usersTable.find((u) => u.role === "student").map(({ password_hash, ...u }) => u);
    res.status(200).json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching students." });
  }
});

router.post("/admin/students", (req, res) => {
  try {
    const usersTable = getTable("users");
    const newStudent = usersTable.insert({
      id: req.body.id || `std-${Date.now()}`,
      student_id: req.body.student_id || `LRK-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      name: req.body.name || "New Candidate",
      email: req.body.email || `student_${Date.now()}@thelawkaksha.com`,
      phone: req.body.phone || "+91 98765 43210",
      target_exam: req.body.target_exam || "CA Foundation Paper 2",
      role: "student",
      is_active: req.body.is_active !== undefined ? (req.body.is_active ? 1 : 0) : 1,
      drm_access: req.body.drm_access !== undefined ? req.body.drm_access : true,
      enrolled_books: req.body.enrolled_books || ["Business Law (Volume 1)"],
      joined_date: req.body.joined_date || "Today",
    });
    const { password_hash, ...safe } = newStudent;
    res.status(201).json({ success: true, student: safe });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating student." });
  }
});

router.put("/admin/students/:id", (req, res) => {
  try {
    const usersTable = getTable("users");
    const updated = usersTable.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Student not found." });
    const { password_hash, ...safe } = updated;
    res.status(200).json({ success: true, student: safe });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating student." });
  }
});

router.delete("/admin/students/:id", (req, res) => {
  try {
    const usersTable = getTable("users");
    const success = usersTable.delete(req.params.id);
    res.status(200).json({ success });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting student." });
  }
});

// -----------------------------------------------------------------------------
// 4. PRODUCTS & STUDY CODICES CRUD
// -----------------------------------------------------------------------------
router.get("/admin/products", (req, res) => {
  try {
    const productsTable = getTable("products");
    res.status(200).json({ success: true, products: productsTable.find() });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching products." });
  }
});

router.post("/admin/products", (req, res) => {
  try {
    const productsTable = getTable("products");
    const newProduct = productsTable.insert({
      id: req.body.id || `prod-${Date.now()}`,
      title: req.body.title || "Statutory Law Codex",
      subtitle: req.body.subtitle || "Digital DRM Codex",
      category: req.body.category || "CA Foundation",
      format: "Digital Codex (In-Web DRM)",
      price: req.body.price || 249,
      originalPrice: req.body.originalPrice || 499,
      pages: req.body.pages || "150+ Pages",
      status: req.body.status || "Active",
      pdfUrl: req.body.pdfUrl || "/api/pdf/cseet-business-law-full.pdf",
      description: req.body.description || "Digital codex with DRM protection.",
      units: req.body.units || ["Unit 1", "Unit 2"],
    });
    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating product." });
  }
});

router.put("/admin/products/:id", (req, res) => {
  try {
    const productsTable = getTable("products");
    const updated = productsTable.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Product not found." });
    res.status(200).json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating product." });
  }
});

router.delete("/admin/products/:id", (req, res) => {
  try {
    const productsTable = getTable("products");
    const success = productsTable.delete(req.params.id);
    res.status(200).json({ success });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting product." });
  }
});

// -----------------------------------------------------------------------------
// 5. WEEKLY CASE STUDIES CRUD
// -----------------------------------------------------------------------------
router.get("/admin/cases", (req, res) => {
  try {
    const casesTable = getTable("weekly_cases");
    res.status(200).json({ success: true, cases: casesTable.find() });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching cases." });
  }
});

router.post("/admin/cases", (req, res) => {
  try {
    const casesTable = getTable("weekly_cases");
    const newCase = casesTable.insert({
      id: req.body.id || `case-${Date.now()}`,
      day: req.body.day || "Monster Monday",
      badge: req.body.badge || "Contract Act 1872",
      subject: req.body.subject || "Indian Contract Act",
      title: req.body.title || "Case Scenario",
      scenario: req.body.scenario || "",
      modelAnswer: req.body.modelAnswer || "",
      precedent: req.body.precedent || "",
      marks: req.body.marks || "6 Marks",
    });
    res.status(201).json({ success: true, caseStudy: newCase });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating case." });
  }
});

router.put("/admin/cases/:id", (req, res) => {
  try {
    const casesTable = getTable("weekly_cases");
    const updated = casesTable.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Case not found." });
    res.status(200).json({ success: true, caseStudy: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating case." });
  }
});

router.delete("/admin/cases/:id", (req, res) => {
  try {
    const casesTable = getTable("weekly_cases");
    const success = casesTable.delete(req.params.id);
    res.status(200).json({ success });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting case." });
  }
});

// -----------------------------------------------------------------------------
// 6. MCQ QUESTION BANK CRUD
// -----------------------------------------------------------------------------
router.get("/admin/mcqs", (req, res) => {
  try {
    const mcqTable = getTable("mcqs");
    res.status(200).json({ success: true, mcqs: mcqTable.find() });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching MCQs." });
  }
});

router.post("/admin/mcqs", (req, res) => {
  try {
    const mcqTable = getTable("mcqs");
    const newMcq = mcqTable.insert({
      id: req.body.id || `mcq-${Date.now()}`,
      subject: req.body.subject || "Indian Contract Act",
      section: req.body.section || "Section 10",
      question: req.body.question || "Statutory Question",
      options: req.body.options || ["Option A", "Option B", "Option C", "Option D"],
      correctOption: req.body.correctOption !== undefined ? req.body.correctOption : 0,
      explanation: req.body.explanation || "Statutory reference explanation.",
    });
    res.status(201).json({ success: true, mcq: newMcq });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating MCQ." });
  }
});

router.put("/admin/mcqs/:id", (req, res) => {
  try {
    const mcqTable = getTable("mcqs");
    const updated = mcqTable.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "MCQ not found." });
    res.status(200).json({ success: true, mcq: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating MCQ." });
  }
});

router.delete("/admin/mcqs/:id", (req, res) => {
  try {
    const mcqTable = getTable("mcqs");
    const success = mcqTable.delete(req.params.id);
    res.status(200).json({ success });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting MCQ." });
  }
});

// -----------------------------------------------------------------------------
// 7. COUPONS CRUD
// -----------------------------------------------------------------------------
router.get("/admin/coupons", (req, res) => {
  try {
    const couponsTable = getTable("coupons");
    res.status(200).json({ success: true, coupons: couponsTable.find() });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching coupons." });
  }
});

router.post("/admin/coupons", (req, res) => {
  try {
    const couponsTable = getTable("coupons");
    const newCoupon = couponsTable.insert({
      id: req.body.id || `cp-${Date.now()}`,
      code: (req.body.code || "OFFER2026").toUpperCase(),
      discountPercent: Number(req.body.discountPercent) || 20,
      minOrder: Number(req.body.minOrder) || 200,
      maxUses: Number(req.body.maxUses) || 500,
      usedCount: 0,
      expiryDate: req.body.expiryDate || "2026-12-31",
      status: req.body.status || "Active",
    });
    res.status(201).json({ success: true, coupon: newCoupon });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating coupon." });
  }
});

router.put("/admin/coupons/:id", (req, res) => {
  try {
    const couponsTable = getTable("coupons");
    const updated = couponsTable.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Coupon not found." });
    res.status(200).json({ success: true, coupon: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating coupon." });
  }
});

router.delete("/admin/coupons/:id", (req, res) => {
  try {
    const couponsTable = getTable("coupons");
    const success = couponsTable.delete(req.params.id);
    res.status(200).json({ success });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting coupon." });
  }
});

module.exports = router;
