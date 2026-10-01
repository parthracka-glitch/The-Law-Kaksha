/**
 * The Law Kaksha - Admin REST API Routes with MongoDB Atlas
 * Fully synchronizes Subscriptions, Students, Products, Cases, MCQs, Coupons, QOTD & Analytics with MongoDB Atlas
 */

const express = require("express");
const Product = require("../models/Product");
const User = require("../models/User");
const Subscription = require("../models/Subscription");
const WeeklyCase = require("../models/WeeklyCase");
const McqQuestion = require("../models/McqQuestion");
const Coupon = require("../models/Coupon");
const SiteSetting = require("../models/SiteSetting");
const Database = require("../db/database");
const { isConnected } = require("../db/mongo");

const router = express.Router();

// -----------------------------------------------------------------------------
// 1. ANALYTICS / OVERVIEW
// -----------------------------------------------------------------------------
router.get("/admin/analytics", async (req, res) => {
  try {
    if (isConnected()) {
      const [subs, students, productsCount] = await Promise.all([
        Subscription.find().lean(),
        User.find({ role: "student" }).lean(),
        Product.countDocuments(),
      ]);

      const totalRevenue = subs.reduce((acc, curr) => {
        const num = parseInt(String(curr.amount || 0).replace(/[^0-9]/g, "")) || 0;
        return acc + num;
      }, 0);

      const activeSubs = subs.filter((s) => s.accessStatus === "Active").length;
      const activeStudents = students.filter((s) => s.is_active).length;

      return res.status(200).json({
        success: true,
        source: "mongodb_atlas",
        data: {
          totalRevenue,
          activeSubscriptionsCount: activeSubs,
          totalStudentsCount: students.length,
          activeStudentsCount: activeStudents,
          productsCount,
        },
      });
    }

    // Fallback to local DB
    const subsTable = Database.table("subscriptions");
    const studentsTable = Database.table("users");
    const productsTable = Database.table("products");
    const subs = subsTable.find();
    const totalRevenue = subs.reduce((acc, curr) => {
      const num = parseInt(String(curr.amount || 0).replace(/[^0-9]/g, "")) || 0;
      return acc + num;
    }, 0);

    res.status(200).json({
      success: true,
      source: "local_cache",
      data: {
        totalRevenue,
        activeSubscriptionsCount: subs.filter((s) => s.accessStatus === "Active").length,
        totalStudentsCount: studentsTable.count((u) => u.role === "student"),
        activeStudentsCount: studentsTable.count((u) => u.role === "student" && u.is_active),
        productsCount: productsTable.count(),
      },
    });
  } catch (err) {
    console.error("[Admin API] Analytics error:", err);
    res.status(500).json({ success: false, message: "Error fetching analytics." });
  }
});

// -----------------------------------------------------------------------------
// 2. PRODUCTS / STUDY CODICES CRUD (Direct to MongoDB Atlas)
// -----------------------------------------------------------------------------
router.get("/admin/products", async (req, res) => {
  try {
    if (isConnected()) {
      const products = await Product.find().sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, source: "mongodb_atlas", products });
    }
    const productsTable = Database.table("products");
    res.status(200).json({ success: true, source: "local_cache", products: productsTable.find() });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching products." });
  }
});

router.post("/admin/products", async (req, res) => {
  try {
    const payload = {
      id: req.body.id || `prod-${Date.now()}`,
      title: req.body.title || "Statutory Law Codex",
      subtitle: req.body.subtitle || "Digital DRM Codex",
      category: req.body.category || "CA Foundation",
      format: req.body.format || "Digital Codex (In-Web DRM)",
      price: Number(req.body.price) || 249,
      originalPrice: Number(req.body.originalPrice) || 499,
      pages: req.body.pages || "150+ Pages",
      status: req.body.status || "Active",
      pdfUrl: req.body.pdfUrl || "/api/pdf/cseet-business-law-full.pdf",
      description: req.body.description || "",
      units: Array.isArray(req.body.units) ? req.body.units : ["Unit 1", "Unit 2"],
      highlights: Array.isArray(req.body.highlights) ? req.body.highlights : ["In-Web DRM Reading"],
      cover_image: req.body.cover_image || "/assets/ca-cs-hero-books-v2.png",
      isSample: Boolean(req.body.isSample),
    };

    if (isConnected()) {
      const created = await Product.findOneAndUpdate({ id: payload.id }, payload, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
      // also keep local DB in sync
      Database.table("products").insert(payload);
      return res.status(201).json({ success: true, source: "mongodb_atlas", product: created });
    }

    const created = Database.table("products").insert(payload);
    res.status(201).json({ success: true, source: "local_cache", product: created });
  } catch (err) {
    console.error("[Admin API] Create product error:", err);
    res.status(500).json({ success: false, message: "Error creating product: " + err.message });
  }
});

router.put("/admin/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (isConnected()) {
      const updated = await Product.findOneAndUpdate({ id }, req.body, { new: true });
      Database.table("products").update(id, req.body);
      if (!updated) return res.status(404).json({ success: false, message: "Product not found." });
      return res.status(200).json({ success: true, source: "mongodb_atlas", product: updated });
    }

    const updated = Database.table("products").update(id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Product not found." });
    res.status(200).json({ success: true, source: "local_cache", product: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating product." });
  }
});

router.delete("/admin/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (isConnected()) {
      await Product.deleteOne({ id });
      Database.table("products").delete(id);
      return res.status(200).json({ success: true, source: "mongodb_atlas" });
    }
    const success = Database.table("products").delete(id);
    res.status(200).json({ success });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting product." });
  }
});

// -----------------------------------------------------------------------------
// 3. WEEKLY CASES CRUD (Direct to MongoDB Atlas)
// -----------------------------------------------------------------------------
router.get("/admin/cases", async (req, res) => {
  try {
    if (isConnected()) {
      const cases = await WeeklyCase.find().sort({ createdAt: 1 }).lean();
      return res.status(200).json({ success: true, source: "mongodb_atlas", cases });
    }
    const casesTable = Database.table("weekly_cases");
    res.status(200).json({ success: true, source: "local_cache", cases: casesTable.find() });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching cases." });
  }
});

router.post("/admin/cases", async (req, res) => {
  try {
    const payload = {
      id: req.body.id || `case-${Date.now()}`,
      day: req.body.day || "Monster Monday",
      badge: req.body.badge || "Contract Act 1872",
      subject: req.body.subject || "Indian Contract Act",
      title: req.body.title || "Case Scenario",
      scenario: req.body.scenario || "",
      modelAnswer: req.body.modelAnswer || "",
      precedent: req.body.precedent || "",
      marks: req.body.marks || "6 Marks",
      courseId: req.body.courseId || "course-ca-foundation",
    };

    if (isConnected()) {
      const created = await WeeklyCase.findOneAndUpdate({ id: payload.id }, payload, {
        upsert: true,
        new: true,
      });
      Database.table("weekly_cases").insert(payload);
      return res.status(201).json({ success: true, source: "mongodb_atlas", caseStudy: created });
    }

    const created = Database.table("weekly_cases").insert(payload);
    res.status(201).json({ success: true, source: "local_cache", caseStudy: created });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating case." });
  }
});

router.put("/admin/cases/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (isConnected()) {
      const updated = await WeeklyCase.findOneAndUpdate({ id }, req.body, { new: true });
      Database.table("weekly_cases").update(id, req.body);
      return res.status(200).json({ success: true, source: "mongodb_atlas", caseStudy: updated });
    }
    const updated = Database.table("weekly_cases").update(id, req.body);
    res.status(200).json({ success: true, caseStudy: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating case." });
  }
});

router.delete("/admin/cases/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (isConnected()) {
      await WeeklyCase.deleteOne({ id });
      Database.table("weekly_cases").delete(id);
      return res.status(200).json({ success: true, source: "mongodb_atlas" });
    }
    const success = Database.table("weekly_cases").delete(id);
    res.status(200).json({ success });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting case." });
  }
});

// -----------------------------------------------------------------------------
// 4. MCQ QUESTION BANK CRUD (Direct to MongoDB Atlas)
// -----------------------------------------------------------------------------
router.get("/admin/mcqs", async (req, res) => {
  try {
    if (isConnected()) {
      const mcqs = await McqQuestion.find().sort({ createdAt: 1 }).lean();
      return res.status(200).json({ success: true, source: "mongodb_atlas", mcqs });
    }
    const mcqTable = Database.table("mcqs");
    res.status(200).json({ success: true, source: "local_cache", mcqs: mcqTable.find() });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching MCQs." });
  }
});

router.post("/admin/mcqs", async (req, res) => {
  try {
    const payload = {
      id: req.body.id || `mcq-${Date.now()}`,
      subject: req.body.subject || "Indian Contract Act",
      section: req.body.section || "Section 10",
      question: req.body.question || "Statutory Question",
      options: req.body.options || ["Option A", "Option B", "Option C", "Option D"],
      correctOption: Number(req.body.correctOption) || 0,
      explanation: req.body.explanation || "Statutory reference explanation.",
      courseId: req.body.courseId || "course-cseet",
    };

    if (isConnected()) {
      const created = await McqQuestion.findOneAndUpdate({ id: payload.id }, payload, {
        upsert: true,
        new: true,
      });
      Database.table("mcqs").insert(payload);
      return res.status(201).json({ success: true, source: "mongodb_atlas", mcq: created });
    }

    const created = Database.table("mcqs").insert(payload);
    res.status(201).json({ success: true, mcq: created });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating MCQ." });
  }
});

router.put("/admin/mcqs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (isConnected()) {
      const updated = await McqQuestion.findOneAndUpdate({ id }, req.body, { new: true });
      Database.table("mcqs").update(id, req.body);
      return res.status(200).json({ success: true, source: "mongodb_atlas", mcq: updated });
    }
    const updated = Database.table("mcqs").update(id, req.body);
    res.status(200).json({ success: true, mcq: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating MCQ." });
  }
});

router.delete("/admin/mcqs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (isConnected()) {
      await McqQuestion.deleteOne({ id });
      Database.table("mcqs").delete(id);
      return res.status(200).json({ success: true, source: "mongodb_atlas" });
    }
    const success = Database.table("mcqs").delete(id);
    res.status(200).json({ success });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting MCQ." });
  }
});

// -----------------------------------------------------------------------------
// 5. COUPONS CRUD (Direct to MongoDB Atlas)
// -----------------------------------------------------------------------------
router.get("/admin/coupons", async (req, res) => {
  try {
    if (isConnected()) {
      const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, source: "mongodb_atlas", coupons });
    }
    const couponsTable = Database.table("coupons");
    res.status(200).json({ success: true, source: "local_cache", coupons: couponsTable.find() });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching coupons." });
  }
});

router.post("/admin/coupons", async (req, res) => {
  try {
    const payload = {
      id: req.body.id || `cp-${Date.now()}`,
      code: String(req.body.code || "OFFER2026").toUpperCase().trim(),
      discountPercent: Number(req.body.discountPercent) || 20,
      minOrder: Number(req.body.minOrder) || 200,
      maxUses: Number(req.body.maxUses) || 500,
      usedCount: Number(req.body.usedCount) || 0,
      expiryDate: req.body.expiryDate || "2026-12-31",
      status: req.body.status || "Active",
    };

    if (isConnected()) {
      const created = await Coupon.findOneAndUpdate({ code: payload.code }, payload, {
        upsert: true,
        new: true,
      });
      Database.table("coupons").insert(payload);
      return res.status(201).json({ success: true, source: "mongodb_atlas", coupon: created });
    }

    const created = Database.table("coupons").insert(payload);
    res.status(201).json({ success: true, coupon: created });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating coupon." });
  }
});

router.put("/admin/coupons/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (isConnected()) {
      const updated = await Coupon.findOneAndUpdate({ id }, req.body, { new: true });
      Database.table("coupons").update(id, req.body);
      return res.status(200).json({ success: true, source: "mongodb_atlas", coupon: updated });
    }
    const updated = Database.table("coupons").update(id, req.body);
    res.status(200).json({ success: true, coupon: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating coupon." });
  }
});

router.delete("/admin/coupons/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (isConnected()) {
      await Coupon.deleteOne({ id });
      Database.table("coupons").delete(id);
      return res.status(200).json({ success: true, source: "mongodb_atlas" });
    }
    const success = Database.table("coupons").delete(id);
    res.status(200).json({ success });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting coupon." });
  }
});

// -----------------------------------------------------------------------------
// 6. STUDENTS & DRM RIGHTS CRUD (Direct to MongoDB Atlas)
// -----------------------------------------------------------------------------
router.get("/admin/students", async (req, res) => {
  try {
    if (isConnected()) {
      const students = await User.find({ role: "student" }).select("-password_hash").lean();
      return res.status(200).json({ success: true, source: "mongodb_atlas", students });
    }
    const usersTable = Database.table("users");
    const students = usersTable.find((u) => u.role === "student").map(({ password_hash, ...u }) => u);
    res.status(200).json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching students." });
  }
});

router.post("/admin/students", async (req, res) => {
  try {
    const payload = {
      id: req.body.id || `std-${Date.now()}`,
      student_id: req.body.student_id || `LRK-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      name: req.body.name || "New Candidate",
      email: String(req.body.email || `student_${Date.now()}@thelawkaksha.com`).toLowerCase().trim(),
      phone: req.body.phone || "+91 98765 43210",
      target_exam: req.body.target_exam || "CA Foundation Paper 2",
      role: "student",
      is_active: req.body.is_active !== undefined ? Boolean(req.body.is_active) : true,
      drm_access: req.body.drm_access !== undefined ? Boolean(req.body.drm_access) : true,
      enrolled_books: Array.isArray(req.body.enrolled_books) ? req.body.enrolled_books : ["Business Law (Volume 1)"],
      unlockedItemIds: Array.isArray(req.body.unlockedItemIds) ? req.body.unlockedItemIds : ["prod-vol1"],
      joined_date: req.body.joined_date || "Today",
    };

    if (isConnected()) {
      const created = await User.findOneAndUpdate({ email: payload.email }, payload, {
        upsert: true,
        new: true,
      }).select("-password_hash");
      Database.table("users").insert(payload);
      return res.status(201).json({ success: true, source: "mongodb_atlas", student: created });
    }

    const created = Database.table("users").insert(payload);
    const { password_hash, ...safe } = created;
    res.status(201).json({ success: true, student: safe });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating student." });
  }
});

router.put("/admin/students/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (isConnected()) {
      const updated = await User.findOneAndUpdate({ id }, req.body, { new: true }).select("-password_hash");
      Database.table("users").update(id, req.body);
      return res.status(200).json({ success: true, source: "mongodb_atlas", student: updated });
    }
    const updated = Database.table("users").update(id, req.body);
    const { password_hash, ...safe } = updated;
    res.status(200).json({ success: true, student: safe });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating student." });
  }
});

router.delete("/admin/students/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (isConnected()) {
      await User.deleteOne({ id });
      Database.table("users").delete(id);
      return res.status(200).json({ success: true, source: "mongodb_atlas" });
    }
    const success = Database.table("users").delete(id);
    res.status(200).json({ success });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting student." });
  }
});

// -----------------------------------------------------------------------------
// 7. SUBSCRIPTIONS CRUD (Direct to MongoDB Atlas)
// -----------------------------------------------------------------------------
router.get("/admin/subscriptions", async (req, res) => {
  try {
    if (isConnected()) {
      const subscriptions = await Subscription.find().sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, source: "mongodb_atlas", subscriptions });
    }
    const subsTable = Database.table("subscriptions");
    res.status(200).json({ success: true, source: "local_cache", subscriptions: subsTable.find() });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching subscriptions." });
  }
});

router.post("/admin/subscriptions", async (req, res) => {
  try {
    const payload = {
      id: req.body.id || `LK-SUB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: req.body.studentName || "Enrolled Student",
      studentRoll: req.body.studentRoll || "LRK-2026-004182",
      email: String(req.body.email || "student@thelawkaksha.com").toLowerCase().trim(),
      phone: req.body.phone || "+91 98765 43210",
      item: req.body.item || "Volume 1 & 2 Master Digital Pass",
      targetExam: req.body.targetExam || "CA Foundation Paper 2",
      amount: req.body.amount || "₹449",
      date: req.body.date || new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      paymentMode: req.body.paymentMode || "Direct Grant / Admin",
      accessStatus: req.body.accessStatus || "Active",
      unlockedItemIds: Array.isArray(req.body.unlockedItemIds) ? req.body.unlockedItemIds : ["prod-vol1", "prod-vol2", "prod-combo"],
    };

    if (isConnected()) {
      const created = await Subscription.findOneAndUpdate({ id: payload.id }, payload, {
        upsert: true,
        new: true,
      });

      // Synchronously grant access to Student User record in Atlas
      await User.findOneAndUpdate(
        { email: payload.email },
        {
          $addToSet: {
            unlockedItemIds: { $each: payload.unlockedItemIds },
            enrolled_books: payload.item,
          },
          $set: { drm_access: true, is_active: true },
        },
        { upsert: true }
      );

      Database.table("subscriptions").insert(payload);
      return res.status(201).json({ success: true, source: "mongodb_atlas", subscription: created });
    }

    const created = Database.table("subscriptions").insert(payload);
    res.status(201).json({ success: true, subscription: created });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating subscription." });
  }
});

router.put("/admin/subscriptions/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (isConnected()) {
      const updated = await Subscription.findOneAndUpdate({ id }, req.body, { new: true });
      Database.table("subscriptions").update(id, req.body);
      return res.status(200).json({ success: true, source: "mongodb_atlas", subscription: updated });
    }
    const updated = Database.table("subscriptions").update(id, req.body);
    res.status(200).json({ success: true, subscription: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating subscription." });
  }
});

router.delete("/admin/subscriptions/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (isConnected()) {
      await Subscription.deleteOne({ id });
      Database.table("subscriptions").delete(id);
      return res.status(200).json({ success: true, source: "mongodb_atlas" });
    }
    const success = Database.table("subscriptions").delete(id);
    res.status(200).json({ success });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting subscription." });
  }
});

// -----------------------------------------------------------------------------
// 8. EXAM COUNTDOWNS & QOTD SETTINGS (Direct to MongoDB Atlas)
// -----------------------------------------------------------------------------
router.get("/admin/exam-settings", async (req, res) => {
  try {
    if (isConnected()) {
      const setting = await SiteSetting.findOne({ key: "exam_countdown" });
      if (setting && setting.value) {
        return res.status(200).json({ success: true, examSettings: setting.value });
      }
    }
    res.status(200).json({
      success: true,
      examSettings: [
        { id: "ex-1", exam: "CSEET Paper 2 (Business Law & Management)", date: "2026-11-12", session: "November 2026 Attempt" },
        { id: "ex-2", exam: "CA Foundation Paper 2 (Business Laws)", date: "2026-12-20", session: "December 2026 Attempt" },
      ],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching exam settings." });
  }
});

router.post("/admin/exam-settings", async (req, res) => {
  try {
    const value = req.body.examSettings;
    if (isConnected()) {
      await SiteSetting.findOneAndUpdate({ key: "exam_countdown" }, { value }, { upsert: true });
      return res.status(200).json({ success: true, source: "mongodb_atlas", examSettings: value });
    }
    res.status(200).json({ success: true, examSettings: value });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error saving exam settings." });
  }
});

router.get("/admin/qotd", async (req, res) => {
  try {
    if (isConnected()) {
      const setting = await SiteSetting.findOne({ key: "qotd" });
      if (setting && setting.value) {
        return res.status(200).json({ success: true, qotd: setting.value });
      }
    }
    res.status(200).json({
      success: true,
      qotd: {
        id: "qotd-1",
        act: "Indian Partnership Act, 1932",
        section: "Section 28",
        question: "When a retired partner's name is retained on the letterhead without public notice, third parties can sue under:",
        options: ["Doctrine of Subrogation", "Doctrine of Holding Out", "Doctrine of Ultra Vires", "Doctrine of Estoppel in Pais"],
        correctOption: 1,
        explanation: "Under Section 28 of the Indian Partnership Act 1932, anyone who represents or allows himself to be represented as a partner is liable as a partner by Holding Out.",
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching QOTD." });
  }
});

router.post("/admin/qotd", async (req, res) => {
  try {
    const qotd = req.body.qotd;
    if (isConnected()) {
      await SiteSetting.findOneAndUpdate({ key: "qotd" }, { value: qotd }, { upsert: true });
      return res.status(200).json({ success: true, source: "mongodb_atlas", qotd });
    }
    res.status(200).json({ success: true, qotd });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error saving QOTD." });
  }
});

module.exports = router;
