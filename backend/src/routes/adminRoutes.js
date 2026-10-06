/**
 * The Law Kaksha - Admin REST API Routes with MongoDB Atlas
 * Fully synchronizes Subscriptions, Students, Products, Cases, MCQs, Coupons, QOTD & Analytics with MongoDB Atlas
 */

const express = require("express");
const path = require("path");
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max to prevent memory exhaustion (SEC-08)
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Only PDF and image (JPEG, PNG, WebP) files are allowed."), false);
    }
  },
});
const Product = require("../models/Product");
const User = require("../models/User");
const Subscription = require("../models/Subscription");
const WeeklyCase = require("../models/WeeklyCase");
const McqQuestion = require("../models/McqQuestion");
const McqTest = require("../models/McqTest");
const Resource = require("../models/Resource");
const Coupon = require("../models/Coupon");
const SiteSetting = require("../models/SiteSetting");
const Database = require("../db/database");
const { isConnected } = require("../db/mongo");
const { uploadToStorage, isCloudinaryConfigured } = require("../utils/cloudinary");
const { requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Enforce Administrator privileges for all /admin/* endpoints
router.use("/admin", requireAdmin);

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
      previewPagesLimit: Number(req.body.previewPagesLimit) > 0 ? Number(req.body.previewPagesLimit) : 5,
      samplePagesRange: req.body.samplePagesRange || "1-5",
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
    const updateData = { ...req.body };
    if (updateData.previewPagesLimit) {
      updateData.previewPagesLimit = Number(updateData.previewPagesLimit);
    }
    if (isConnected()) {
      const updated = await Product.findOneAndUpdate({ id }, updateData, { new: true });
      Database.table("products").update(id, updateData);
      if (!updated) return res.status(404).json({ success: false, message: "Product not found." });
      return res.status(200).json({ success: true, source: "mongodb_atlas", product: updated });
    }

    const updated = Database.table("products").update(id, updateData);
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
      if (!updated) return res.status(404).json({ success: false, message: "Case study not found." });
      Database.table("weekly_cases").update(id, req.body);
      return res.status(200).json({ success: true, source: "mongodb_atlas", caseStudy: updated });
    }
    const updated = Database.table("weekly_cases").update(id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Case study not found." });
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
// 4. GOOGLE FORM MCQ TESTS CRUD (Direct to MongoDB Atlas)
// -----------------------------------------------------------------------------
router.get("/admin/mcq-tests", async (req, res) => {
  try {
    if (isConnected()) {
      const tests = await McqTest.find().sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, source: "mongodb_atlas", tests });
    }
    const testsTable = Database.table("mcq_tests");
    res.status(200).json({ success: true, source: "local_cache", tests: testsTable.find() });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching MCQ tests." });
  }
});

router.post("/admin/mcq-tests", async (req, res) => {
  try {
    const payload = {
      id: req.body.id || `gtest-${Date.now()}`,
      title: req.body.title || "Weekly Google Form Mock Test",
      course: req.body.course || "ca",
      subject: req.body.subject || "The Indian Contract Act, 1872",
      formUrl: req.body.formUrl || "",
      questionCount: Number(req.body.questionCount) || 30,
      duration: Number(req.body.duration) || 30,
      totalMarks: Number(req.body.totalMarks) || 30,
      status: req.body.status || "Active",
      instructions: req.body.instructions || "Attempt all questions in one sitting. Follow ICAI / ICSI pattern.",
    };

    if (isConnected()) {
      const created = await McqTest.findOneAndUpdate({ id: payload.id }, payload, {
        upsert: true,
        new: true,
      });
      Database.table("mcq_tests").insert(payload);
      return res.status(201).json({ success: true, source: "mongodb_atlas", test: created });
    }

    const created = Database.table("mcq_tests").insert(payload);
    res.status(201).json({ success: true, test: created });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating MCQ test." });
  }
});

router.put("/admin/mcq-tests/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (isConnected()) {
      const updated = await McqTest.findOneAndUpdate({ id }, req.body, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: "MCQ test not found." });
      Database.table("mcq_tests").update(id, req.body);
      return res.status(200).json({ success: true, source: "mongodb_atlas", test: updated });
    }
    const updated = Database.table("mcq_tests").update(id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "MCQ test not found." });
    res.status(200).json({ success: true, test: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating MCQ test." });
  }
});

router.delete("/admin/mcq-tests/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (isConnected()) {
      await McqTest.deleteOne({ id });
      Database.table("mcq_tests").delete(id);
      return res.status(200).json({ success: true, source: "mongodb_atlas" });
    }
    const success = Database.table("mcq_tests").delete(id);
    res.status(200).json({ success });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting MCQ test." });
  }
});

// Legacy backward compatibility for individual MCQs
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
    // Allowlist safe fields to prevent privilege escalation / mass assignment (SEC-07)
    const allowedFields = [
      "name",
      "email",
      "phone",
      "target_exam",
      "is_active",
      "drm_access",
      "enrolled_books",
      "unlockedItemIds",
    ];
    const updateData = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    if (isConnected()) {
      const updated = await User.findOneAndUpdate({ id }, updateData, { new: true }).select("-password_hash");
      if (!updated) return res.status(404).json({ success: false, message: "Student not found." });
      Database.table("users").update(id, updateData);
      return res.status(200).json({ success: true, source: "mongodb_atlas", student: updated });
    }
    const updated = Database.table("users").update(id, updateData);
    if (!updated) return res.status(404).json({ success: false, message: "Student not found." });
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
    const allowedFields = [
      "studentName",
      "studentRoll",
      "email",
      "phone",
      "item",
      "targetExam",
      "amount",
      "date",
      "paymentMode",
      "accessStatus",
      "unlockedItemIds",
    ];
    const updateData = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    if (isConnected()) {
      const updated = await Subscription.findOneAndUpdate({ id }, updateData, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: "Subscription not found." });
      Database.table("subscriptions").update(id, updateData);
      return res.status(200).json({ success: true, source: "mongodb_atlas", subscription: updated });
    }
    const updated = Database.table("subscriptions").update(id, updateData);
    if (!updated) return res.status(404).json({ success: false, message: "Subscription not found." });
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

// -----------------------------------------------------------------------------
// 9. FILE UPLOAD TO CLOUDINARY / SECURE STORAGE
// -----------------------------------------------------------------------------
router.post("/admin/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided for upload." });
    }

    const originalName = req.file.originalname || "document";
    const extension = originalName.substring(originalName.lastIndexOf("."));
    const isPdf = req.file.mimetype === "application/pdf" || extension.toLowerCase() === ".pdf";
    const resource_type = isPdf ? "raw" : "image";
    const folder = isPdf ? "thelawkaksha/pdfs" : "thelawkaksha/covers";

    const uploadResult = await uploadToStorage(req.file.buffer, {
      folder,
      resource_type,
      public_id: `${path.parse(originalName).name.replace(/[^a-zA-Z0-9_-]/g, "_")}-${Date.now()}`,
      extension,
    });

    res.status(200).json({
      success: true,
      message: "File uploaded successfully.",
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      isLocal: uploadResult.isLocal || false,
    });
  } catch (err) {
    console.error("[Admin API] File upload error:", err);
    res.status(500).json({ success: false, message: "File upload failed: " + err.message });
  }
});

// -----------------------------------------------------------------------------
// 10. ACT-WISE RESOURCES CRUD (Direct to MongoDB Atlas)
// -----------------------------------------------------------------------------
router.get("/admin/resources", async (req, res) => {
  try {
    const { course, actName, type } = req.query;
    const filter = {};
    if (course) filter.course = course;
    if (actName) filter.actName = actName;
    if (type) filter.type = type;

    if (isConnected()) {
      const resources = await Resource.find(filter).sort({ chapterNumber: 1, order: 1 }).lean();
      return res.status(200).json({ success: true, source: "mongodb_atlas", resources });
    }

    const resourcesTable = Database.table("resources");
    res.status(200).json({ success: true, source: "local_cache", resources: resourcesTable.find() });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching resources." });
  }
});

router.post("/admin/resources", async (req, res) => {
  try {
    const payload = {
      id: req.body.id || `res-${Date.now()}`,
      course: req.body.course || "ca-foundation",
      actName: req.body.actName || "The Indian Partnership Act, 1932",
      chapterNumber: Number(req.body.chapterNumber) || 4,
      type: req.body.type || "notes",
      title: req.body.title || "Chapter Notes",
      description: req.body.description || "",
      pdfUrl: req.body.pdfUrl || "/notes/unit-1-general-nature-of-partnership.pdf",
      samplePdfUrl: req.body.samplePdfUrl || "",
      isSample: Boolean(req.body.isSample),
      status: req.body.status || "Published",
      order: Number(req.body.order) || 0,
      pages: req.body.pages || "20 Pages",
      cloudinaryPublicId: req.body.cloudinaryPublicId || "",
      previewPagesLimit: Number(req.body.previewPagesLimit) > 0 ? Number(req.body.previewPagesLimit) : 5,
    };

    if (isConnected()) {
      const created = await Resource.findOneAndUpdate({ id: payload.id }, payload, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
      Database.table("resources").insert(payload);
      return res.status(201).json({ success: true, source: "mongodb_atlas", resource: created });
    }

    const created = Database.table("resources").insert(payload);
    res.status(201).json({ success: true, resource: created });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating resource: " + err.message });
  }
});

router.put("/admin/resources/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const allowedFields = [
      "course",
      "actName",
      "chapterNumber",
      "type",
      "title",
      "description",
      "pdfUrl",
      "samplePdfUrl",
      "isSample",
      "status",
      "order",
      "pages",
      "cloudinaryPublicId",
      "previewPagesLimit",
    ];
    const updateData = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }
    if (updateData.previewPagesLimit !== undefined) {
      updateData.previewPagesLimit = Number(updateData.previewPagesLimit);
    }
    if (updateData.chapterNumber !== undefined) {
      updateData.chapterNumber = Number(updateData.chapterNumber);
    }
    if (updateData.order !== undefined) {
      updateData.order = Number(updateData.order);
    }
    if (updateData.isSample !== undefined) {
      updateData.isSample = Boolean(updateData.isSample);
    }

    if (isConnected()) {
      const updated = await Resource.findOneAndUpdate({ id }, updateData, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: "Resource not found." });
      Database.table("resources").update(id, updateData);
      return res.status(200).json({ success: true, source: "mongodb_atlas", resource: updated });
    }

    const updated = Database.table("resources").update(id, updateData);
    if (!updated) return res.status(404).json({ success: false, message: "Resource not found." });
    res.status(200).json({ success: true, resource: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating resource." });
  }
});

router.delete("/admin/resources/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (isConnected()) {
      await Resource.deleteOne({ id });
      Database.table("resources").delete(id);
      return res.status(200).json({ success: true, source: "mongodb_atlas" });
    }
    const success = Database.table("resources").delete(id);
    res.status(200).json({ success });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting resource." });
  }
});

// -----------------------------------------------------------------------------
// 11. SECTION 16(1) SALE OF GOODS COMPARISON BLOCK MANAGER
// -----------------------------------------------------------------------------
router.get("/admin/section16-comparison", async (req, res) => {
  try {
    if (isConnected()) {
      const setting = await SiteSetting.findOne({ key: "section16_comparison" });
      if (setting && setting.value) {
        return res.status(200).json({ success: true, comparison: setting.value });
      }
    }
    res.status(200).json({
      success: true,
      comparison: {
        act: "The Sale of Goods Act, 1930",
        section: "Section 16(1)",
        marks: 6,
        topic: "Doctrine of Caveat Emptor & Implied Condition as to Quality or Fitness",
        question: "Under Section 16(1) of the Sale of Goods Act, 1930, when is an implied condition as to quality or fitness created without an express declaration by the buyer?",
        aspirantScore: "2 / 6 Marks",
        aspirantAnswer: "Caveat Emptor means let the buyer beware. The buyer should check the goods himself before buying. However, if the buyer told the seller why he is buying and seller is a shopkeeper, then seller is responsible if goods are defective. (Priest v. Last)",
        aspirantIssues: [
          "Fails to cite exact statutory 3-element test of Section 16(1)",
          "Missing explanation of 'communication of purpose by implication'",
          "Missing analysis of reliance on seller's skill and judgment",
          "No step-by-step conclusion on buyer remedies",
        ],
        modelScore: "6 / 6 Marks (Full Marks)",
        modelAnswer: "1. STATUTORY PROVISION:\\nAccording to Section 16(1) of the Sale of Goods Act, 1930, where the buyer, expressly or by implication, makes known to the seller the particular purpose for which the goods are required, so as to show that the buyer relies on the seller's skill or judgment, and the goods are of a description which it is in the course of the seller's business to supply, there is an implied condition that the goods shall be reasonably fit for such purpose.\\n\\n2. THREE ESSENTIAL TESTS:\\n(a) Buyer made known the purpose to seller (expressly or impliedly).\\n(b) Buyer relied on seller's skill and judgment.\\n(c) Seller's business is to supply goods of that description.\\n\\n3. LANDMARK PRECEDENT (Priest v. Last [1903] 2 KB 148):\\nWhere goods are capable of only one normal use (e.g. hot water bottle), the purpose is communicated by implication. Reliance on the chemist is presumed.\\n\\n4. CONCLUSION:\\nBreach of this condition entitles the buyer to reject the goods and claim full damages under Section 59.",
        modelHighlights: [
          "Exact statutory wording & section citation",
          "Structured 4-step ICAI presentation layout",
          "Case law citation (Priest v. Last) with legal principle",
          "Clear distinction between express & implied communication",
        ],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching comparison data." });
  }
});

// -----------------------------------------------------------------------------
// 12. LIVE BROADCAST ANNOUNCEMENT BANNER
// -----------------------------------------------------------------------------
router.get("/admin/announcement", async (req, res) => {
  try {
    if (isConnected()) {
      const setting = await SiteSetting.findOne({ key: "announcement" });
      if (setting && setting.value) {
        return res.status(200).json({ success: true, announcement: setting.value });
      }
    }
    res.status(200).json({
      success: true,
      announcement: {
        enabled: true,
        text: "⚡ Special CA Foundation & CSEET Study Passes available at introductory ₹99/month!",
        badge: "OFFER",
        link: "/courses",
        target: "all",
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching announcement." });
  }
});

router.post("/admin/announcement", async (req, res) => {
  try {
    const announcement = req.body.announcement;
    if (isConnected()) {
      await SiteSetting.findOneAndUpdate({ key: "announcement" }, { value: announcement }, { upsert: true });
      return res.status(200).json({ success: true, source: "mongodb_atlas", announcement });
    }
    res.status(200).json({ success: true, announcement });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error saving announcement." });
  }
});

// Public endpoint for homepage/student portal to fetch broadcast banner
router.get("/announcement", async (req, res) => {
  try {
    if (isConnected()) {
      const setting = await SiteSetting.findOne({ key: "announcement" });
      if (setting && setting.value) {
        return res.status(200).json({ success: true, announcement: setting.value });
      }
    }
    res.status(200).json({
      success: true,
      announcement: {
        enabled: true,
        text: "⚡ Special CA Foundation & CSEET Study Passes available at introductory ₹99/month!",
        badge: "OFFER",
        link: "/courses",
        target: "all",
      },
    });
  } catch (err) {
    res.status(200).json({
      success: true,
      announcement: {
        enabled: false,
        text: "",
        badge: "UPDATE",
        link: "",
        target: "all",
      },
    });
  }
});
// -----------------------------------------------------------------------------
// 13. PROMO BANNERS / CODEX PASSES SETTINGS (STUDENT DASHBOARD)
// -----------------------------------------------------------------------------
const DEFAULT_PROMO_BANNERS = {
  sectionTitle: "LAW KAKSHA CODEX PASSES",
  enabled: true,
  caCard: {
    id: "card_ca",
    streamBadge: "Paper 2 • 7 Chapters",
    discountBadge: "67% OFF",
    title: "CA Foundation Business Laws",
    subtitle: "Complete Codex Notes",
    price: 99,
    originalPrice: 299,
    saveText: "Save ₹200",
    description: "All 7 Chapters in simple English, 3 weekly solved cases & 1.5-day LDR flowcharts",
    features: ["📖 7 Chapters", "⚖️ Solved Cases", "⚡ LDR Notes"],
    buttonText: "Explore CA Notes",
    actionType: "ca",
    customUrl: "",
    theme: "lavender",
    enabled: true,
  },
  csCard: {
    id: "card_cs",
    streamBadge: "ICSI • 8 Exam Units",
    discountBadge: "67% OFF",
    title: "CSEET Business Law & Management",
    subtitle: "Master Question Bank",
    price: 99,
    originalPrice: 299,
    saveText: "Save ₹200",
    description: "All 8 ICSI Units, 30-MCQ weekly timed mock tests & quick revision concept notes",
    features: ["🎯 8 Units", "⏱️ Timed MCQs", "💡 Concept Bank"],
    buttonText: "Explore CSEET Notes",
    actionType: "cs",
    customUrl: "",
    theme: "lavender",
    enabled: true,
  },
  comboCard: {
    id: "card_combo",
    streamBadge: "Best Value • All-Access Dual Pass",
    discountBadge: "64% OFF",
    title: "All-Access Dual Codex Pass",
    subtitle: "CA Foundation + CSEET Combo",
    price: 180,
    originalPrice: 499,
    saveText: "Save ₹319",
    description: "Get unlimited access to both CA Foundation & CSEET notes, all weekly solved cases & practice mock drills",
    features: ["🎓 Both Courses", "🏆 Full Question Bank", "⏱️ Timed Mock Tests"],
    buttonText: "Unlock All-Access",
    actionType: "all-access",
    customUrl: "",
    theme: "purple",
    enabled: true,
  },
};

router.get("/admin/promo-banners", async (req, res) => {
  try {
    if (isConnected()) {
      const setting = await SiteSetting.findOne({ key: "promo_banners" });
      if (setting && setting.value) {
        return res.status(200).json({ success: true, promoBanners: setting.value });
      }
    }
    res.status(200).json({ success: true, promoBanners: DEFAULT_PROMO_BANNERS });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching promo banners." });
  }
});

router.post("/admin/promo-banners", async (req, res) => {
  try {
    const promoBanners = req.body.promoBanners || req.body;
    if (isConnected()) {
      await SiteSetting.findOneAndUpdate({ key: "promo_banners" }, { value: promoBanners }, { upsert: true });
      return res.status(200).json({ success: true, source: "mongodb_atlas", promoBanners });
    }
    res.status(200).json({ success: true, promoBanners });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error saving promo banners." });
  }
});

// Public endpoint for student dashboard
router.get("/promo-banners", async (req, res) => {
  try {
    if (isConnected()) {
      const setting = await SiteSetting.findOne({ key: "promo_banners" });
      if (setting && setting.value) {
        return res.status(200).json({ success: true, promoBanners: setting.value });
      }
    }
    res.status(200).json({ success: true, promoBanners: DEFAULT_PROMO_BANNERS });
  } catch (err) {
    res.status(200).json({ success: true, promoBanners: DEFAULT_PROMO_BANNERS });
  }
});

// ==========================================
// SURFACE B: ADMIN MODULES (B0 - B10)
// ==========================================

// B0: OVERVIEW METRICS (§8 B0)
router.get("/admin/overview", async (req, res) => {
  try {
    const ordersTable = Database.table("orders");
    const expensesTable = Database.table("expenses");
    const usersTable = Database.table("users");
    const entitlementsTable = Database.table("entitlements");

    const allOrders = ordersTable.find();
    const allExpenses = expensesTable.find();
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Revenue calculations
    const paidOrders = allOrders.filter((o) => o.status === "paid" || o.status === "COMPLETED");
    const todayRevenue = paidOrders
      .filter((o) => (o.created_at || "").startsWith(todayStr))
      .reduce((sum, o) => sum + (o.total || o.total_amount || 0), 0);

    const monthRevenue = paidOrders
      .filter((o) => {
        const d = new Date(o.created_at);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, o) => sum + (o.total || o.total_amount || 0), 0);

    // Expenses calculations
    const monthExpenses = allExpenses
      .filter((e) => {
        const d = new Date(e.expense_date || e.created_at);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    // Active students with valid entitlements
    const activeStudents = entitlementsTable.find((e) => e.status === "active" && new Date(e.expires_at) >= now).length;
    const totalStudents = usersTable.count((u) => u.role === "student");

    // Recent orders (last 10)
    const recentOrders = [...allOrders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10);

    res.status(200).json({
      success: true,
      overview: {
        todayRevenue,
        monthRevenue,
        monthExpenses,
        netProfit: monthRevenue - monthExpenses,
        newBookingsToday: allOrders.filter((o) => (o.created_at || "").startsWith(todayStr)).length,
        totalBookings: allOrders.length,
        activeStudents: activeStudents || totalStudents,
        totalStudents,
        recentOrders,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching overview: " + err.message });
  }
});

// B1: ORDERS (BOOKINGS) MANAGEMENT (§8 B1)
router.get("/admin/orders", async (req, res) => {
  try {
    const ordersTable = Database.table("orders");
    let orders = ordersTable.find();

    const { status, search, dateFrom, dateTo } = req.query;
    if (status && status !== "all") {
      orders = orders.filter((o) => (o.status || "").toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      orders = orders.filter(
        (o) =>
          (o.id || "").toLowerCase().includes(q) ||
          (o.order_no || "").toLowerCase().includes(q) ||
          (o.customer_name || o.personal_details?.name || "").toLowerCase().includes(q) ||
          (o.customer_email || o.personal_details?.email || "").toLowerCase().includes(q)
      );
    }
    if (dateFrom) {
      orders = orders.filter((o) => new Date(o.created_at) >= new Date(dateFrom));
    }
    if (dateTo) {
      orders = orders.filter((o) => new Date(o.created_at) <= new Date(dateTo));
    }

    orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching orders: " + err.message });
  }
});

// B1: ORDER REFUND & ENTITLEMENT REVOCATION (§8 B1, §10.2)
router.post("/admin/orders/:id/refund", async (req, res) => {
  try {
    const orderId = req.params.id;
    const ordersTable = Database.table("orders");
    const order = ordersTable.findOne((o) => o.id === orderId || o.order_no === orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    ordersTable.update(order.id, { status: "refunded" });

    // Revoke corresponding entitlements
    const entitlementsTable = Database.table("entitlements");
    const relatedEntitlements = entitlementsTable.find((e) => e.order_id === order.id);
    relatedEntitlements.forEach((e) => {
      entitlementsTable.update(e.id, { status: "revoked" });
    });

    res.status(200).json({
      success: true,
      message: "Order marked as refunded and entitlements revoked.",
      orderId: order.id,
      revokedCount: relatedEntitlements.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error refunding order: " + err.message });
  }
});

// B1: ENTITLEMENT MANAGEMENT: REVOKE & EXTEND
router.post("/admin/entitlements/:id/revoke", async (req, res) => {
  try {
    const entitlementsTable = Database.table("entitlements");
    const updated = entitlementsTable.update(req.params.id, { status: "revoked" });
    if (!updated) return res.status(404).json({ success: false, message: "Entitlement not found" });
    res.status(200).json({ success: true, message: "Entitlement revoked.", entitlement: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/admin/entitlements/:id/extend", async (req, res) => {
  try {
    const { days = 30 } = req.body;
    const entitlementsTable = Database.table("entitlements");
    const ent = entitlementsTable.findById(req.params.id);
    if (!ent) return res.status(404).json({ success: false, message: "Entitlement not found" });

    const currentExpiry = new Date(ent.expires_at || Date.now());
    const baseDate = currentExpiry > new Date() ? currentExpiry : new Date();
    const newExpiry = new Date(baseDate.getTime() + Number(days) * 24 * 60 * 60 * 1000);

    const updated = entitlementsTable.update(ent.id, {
      expires_at: newExpiry.toISOString(),
      status: "active",
    });

    res.status(200).json({ success: true, message: `Entitlement extended by ${days} days.`, entitlement: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// B2: SUBSCRIPTION PLANS CRUD (§8 B2)
router.post("/admin/subscriptions", async (req, res) => {
  try {
    const { title, slug, short_desc, description, price, mrp, duration_days, thumbnail, features, course_ids, display_order } = req.body;
    if (!title || price === undefined) {
      return res.status(400).json({ success: false, message: "Title and price are required." });
    }

    const plansTable = Database.table("subscription_plans");
    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newPlan = plansTable.insert({
      id: `sub-${Date.now()}`,
      title,
      slug: generatedSlug,
      short_desc: short_desc || "",
      description: description || "",
      price: Number(price),
      mrp: Number(mrp || price * 2),
      duration_days: Number(duration_days || 30),
      thumbnail: thumbnail || "/assets/ca-cs-hero-books-v2.png",
      features: Array.isArray(features) ? features : [],
      course_ids: Array.isArray(course_ids) ? course_ids : [],
      display_order: Number(display_order || 0),
      is_active: true,
    });

    res.status(201).json({ success: true, subscription: newPlan });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating subscription: " + err.message });
  }
});

// B2 & B3: COURSES & EXTRA COURSES CRUD (§8 B2 & B3)
router.get("/admin/courses", async (req, res) => {
  try {
    const coursesTable = Database.table("courses");
    const courses = coursesTable.find();
    res.status(200).json({ success: true, count: courses.length, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/admin/courses", async (req, res) => {
  try {
    const { title, description, thumbnail, kind, price, mrp, show_on_website, display_order } = req.body;
    if (!title) return res.status(400).json({ success: false, message: "Course title is required." });

    const coursesTable = Database.table("courses");
    const newCourse = coursesTable.insert({
      id: `course-${Date.now()}`,
      title,
      description: description || "",
      thumbnail: thumbnail || "/assets/ca-cs-hero-books-v2.png",
      kind: kind === "extra" ? "extra" : "core",
      price: Number(price || 0),
      mrp: Number(mrp || 0),
      show_on_website: show_on_website !== false,
      is_active: true,
      display_order: Number(display_order || 0),
    });

    res.status(201).json({ success: true, course: newCourse });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/admin/courses/:id", async (req, res) => {
  try {
    const coursesTable = Database.table("courses");
    const updated = coursesTable.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Course not found" });
    res.status(200).json({ success: true, course: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/admin/courses/:id", async (req, res) => {
  try {
    const coursesTable = Database.table("courses");
    coursesTable.delete(req.params.id);
    res.status(200).json({ success: true, message: "Course deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// B3: EXTRA COURSES SPECIFIC ENDPOINTS
router.get("/admin/extra-courses", async (req, res) => {
  try {
    const coursesTable = Database.table("courses");
    const extraCourses = coursesTable.find((c) => c.kind === "extra");
    res.status(200).json({ success: true, extraCourses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/admin/extra-courses", async (req, res) => {
  try {
    req.body.kind = "extra";
    const coursesTable = Database.table("courses");
    const newExtra = coursesTable.insert({
      id: `course-extra-${Date.now()}`,
      title: req.body.title,
      description: req.body.description || "",
      thumbnail: req.body.thumbnail || "/assets/ca-cs-hero-books-v2.png",
      kind: "extra",
      price: Number(req.body.price || 49),
      mrp: Number(req.body.mrp || 149),
      show_on_website: req.body.show_on_website !== false,
      is_active: true,
    });
    res.status(201).json({ success: true, course: newExtra });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// B4: WEBSITE CAROUSEL CRUD & REORDER (§8 B4)
router.get("/admin/carousel", async (req, res) => {
  try {
    const carouselTable = Database.table("carousel_slides");
    const slides = carouselTable.find().sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    res.status(200).json({ success: true, slides });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/admin/carousel", async (req, res) => {
  try {
    const { title, subtitle, image, cta_label, subscription_id, display_order, is_active } = req.body;
    if (!title) return res.status(400).json({ success: false, message: "Slide title is required." });

    const carouselTable = Database.table("carousel_slides");
    const newSlide = carouselTable.insert({
      id: `slide-${Date.now()}`,
      placement: "website",
      title,
      subtitle: subtitle || "",
      image: image || "/assets/ca-cs-hero-books-v2.png",
      cta_label: cta_label || "Explore Plan",
      subscription_id: subscription_id || null,
      display_order: Number(display_order || 0),
      is_active: is_active !== false,
    });

    res.status(201).json({ success: true, slide: newSlide });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/admin/carousel/:id", async (req, res) => {
  try {
    const carouselTable = Database.table("carousel_slides");
    const updated = carouselTable.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Slide not found." });
    res.status(200).json({ success: true, slide: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/admin/carousel/:id", async (req, res) => {
  try {
    const carouselTable = Database.table("carousel_slides");
    carouselTable.delete(req.params.id);
    res.status(200).json({ success: true, message: "Slide deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// B5: LIVE SESSIONS (GOOGLE MEET LINKS) CRUD (§8 B5)
router.get("/admin/live-sessions", async (req, res) => {
  try {
    const liveSessionsTable = Database.table("live_sessions");
    const sessions = liveSessionsTable.find().sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at));
    res.status(200).json({ success: true, count: sessions.length, sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/admin/live-sessions", async (req, res) => {
  try {
    const { title, subscription_id, course_id, starts_at, ends_at, meet_link, notes } = req.body;
    if (!title || !meet_link || !starts_at) {
      return res.status(400).json({ success: false, message: "Title, Meet link, and start time are required." });
    }

    const liveSessionsTable = Database.table("live_sessions");
    const newSession = liveSessionsTable.insert({
      id: `live-${Date.now()}`,
      title,
      subscription_id: subscription_id || null,
      course_id: course_id || null,
      starts_at: new Date(starts_at).toISOString(),
      ends_at: ends_at ? new Date(ends_at).toISOString() : new Date(new Date(starts_at).getTime() + 90 * 60 * 1000).toISOString(),
      meet_link,
      notes: notes || "",
      is_active: true,
    });

    res.status(201).json({ success: true, session: newSession });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/admin/live-sessions/:id", async (req, res) => {
  try {
    const liveSessionsTable = Database.table("live_sessions");
    const updated = liveSessionsTable.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Live session not found." });
    res.status(200).json({ success: true, session: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/admin/live-sessions/:id", async (req, res) => {
  try {
    const liveSessionsTable = Database.table("live_sessions");
    liveSessionsTable.delete(req.params.id);
    res.status(200).json({ success: true, message: "Live session deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// B6: EXPENSE TRACKER CRUD & SUMMARY (§8 B6)
router.get("/admin/expenses", async (req, res) => {
  try {
    const expensesTable = Database.table("expenses");
    const expenses = expensesTable.find().sort((a, b) => new Date(b.expense_date) - new Date(a.expense_date));
    res.status(200).json({ success: true, count: expenses.length, expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/admin/expenses", async (req, res) => {
  try {
    const { category, title, amount, expense_date, notes, receipt_url } = req.body;
    if (!category || !title || amount === undefined) {
      return res.status(400).json({ success: false, message: "Category, title, and amount are required." });
    }

    const expensesTable = Database.table("expenses");
    const newExpense = expensesTable.insert({
      id: `exp-${Date.now()}`,
      category,
      title,
      amount: Number(amount),
      expense_date: expense_date ? new Date(expense_date).toISOString() : new Date().toISOString(),
      notes: notes || "",
      receipt_url: receipt_url || "",
      created_by: req.user.name || "admin",
    });

    res.status(201).json({ success: true, expense: newExpense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/admin/expenses/:id", async (req, res) => {
  try {
    const expensesTable = Database.table("expenses");
    const updated = expensesTable.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Expense not found." });
    res.status(200).json({ success: true, expense: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/admin/expenses/:id", async (req, res) => {
  try {
    const expensesTable = Database.table("expenses");
    expensesTable.delete(req.params.id);
    res.status(200).json({ success: true, message: "Expense deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/admin/expenses/summary", async (req, res) => {
  try {
    const expensesTable = Database.table("expenses");
    const ordersTable = Database.table("orders");
    const allExpenses = expensesTable.find();
    const allOrders = ordersTable.find();

    const categoryBreakdown = {};
    let totalExpenses = 0;
    allExpenses.forEach((e) => {
      categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + (e.amount || 0);
      totalExpenses += e.amount || 0;
    });

    const paidOrders = allOrders.filter((o) => o.status === "paid" || o.status === "COMPLETED");
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || o.total_amount || 0), 0);

    res.status(200).json({
      success: true,
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      categoryBreakdown,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// B7: OFFERS SECTION CRUD (§8 B7)
router.get("/admin/offers", async (req, res) => {
  try {
    const offersTable = Database.table("offers");
    const offers = offersTable.find().sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    res.status(200).json({ success: true, count: offers.length, offers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/admin/offers", async (req, res) => {
  try {
    const { title, description, banner, coupon_id, coupon_code, valid_from, valid_to, display_order, is_active } = req.body;
    if (!title) return res.status(400).json({ success: false, message: "Offer title is required." });

    const offersTable = Database.table("offers");
    const newOffer = offersTable.insert({
      id: `offer-${Date.now()}`,
      title,
      description: description || "",
      banner: banner || "/assets/ca-cs-hero-books-v2.png",
      coupon_id: coupon_id || null,
      coupon_code: coupon_code || "",
      valid_from: valid_from ? new Date(valid_from).toISOString() : new Date().toISOString(),
      valid_to: valid_to ? new Date(valid_to).toISOString() : null,
      display_order: Number(display_order || 0),
      is_active: is_active !== false,
    });

    res.status(201).json({ success: true, offer: newOffer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/admin/offers/:id", async (req, res) => {
  try {
    const offersTable = Database.table("offers");
    const updated = offersTable.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Offer not found." });
    res.status(200).json({ success: true, offer: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/admin/offers/:id", async (req, res) => {
  try {
    const offersTable = Database.table("offers");
    offersTable.delete(req.params.id);
    res.status(200).json({ success: true, message: "Offer deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// B8: CASE STUDIES CRUD (§8 B8)
router.get("/admin/case-studies", async (req, res) => {
  try {
    const caseStudiesTable = Database.table("case_studies");
    const cases = caseStudiesTable.find();
    res.status(200).json({ success: true, count: cases.length, caseStudies: cases });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/admin/case-studies", async (req, res) => {
  try {
    const { title, slug, summary, content, cover_image, act_name, marks_weight, show_on_website, show_on_dashboard, is_published } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: "Title and content are required." });

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const caseStudiesTable = Database.table("case_studies");

    const newCase = caseStudiesTable.insert({
      id: `case-${Date.now()}`,
      title,
      slug: generatedSlug,
      summary: summary || "",
      content,
      cover_image: cover_image || "/assets/ca-cs-hero-books-v2.png",
      act_name: act_name || "Contract Act",
      marks_weight: Number(marks_weight || 6),
      show_on_website: show_on_website !== false,
      show_on_dashboard: show_on_dashboard !== false,
      is_published: is_published !== false,
    });

    res.status(201).json({ success: true, caseStudy: newCase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/admin/case-studies/:id", async (req, res) => {
  try {
    const caseStudiesTable = Database.table("case_studies");
    const updated = caseStudiesTable.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Case study not found." });
    res.status(200).json({ success: true, caseStudy: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/admin/case-studies/:id", async (req, res) => {
  try {
    const caseStudiesTable = Database.table("case_studies");
    caseStudiesTable.delete(req.params.id);
    res.status(200).json({ success: true, message: "Case study deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// B10: PAYMENTS TABLE & DATA EXPORT (§8 B10)
router.get("/admin/payments", async (req, res) => {
  try {
    const paymentsTable = Database.table("payments");
    const ordersTable = Database.table("orders");
    let payments = paymentsTable.find();

    // If no direct payment records yet, synthesize from paid orders
    if (payments.length === 0) {
      const paidOrders = ordersTable.find((o) => o.status === "paid" || o.status === "COMPLETED");
      payments = paidOrders.map((o) => ({
        id: `pay-${o.id}`,
        order_id: o.id,
        order_no: o.order_no || o.id,
        customer_name: o.customer_name || o.personal_details?.name || "Student",
        customer_email: o.customer_email || o.personal_details?.email || "",
        amount: o.total || o.total_amount || 0,
        currency: "INR",
        gateway: "Razorpay",
        gateway_payment_id: o.payment_id || `pay_${Date.now()}`,
        status: "success",
        method: "UPI",
        paid_at: o.created_at,
      }));
    }

    res.status(200).json({ success: true, count: payments.length, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// B10: DATA EXPORT (CSV / EXCEL FORMAT)
router.get("/admin/export/:entity", async (req, res) => {
  try {
    const { entity } = req.params; // orders, payments, expenses
    let records = [];

    if (entity === "orders") {
      records = Database.table("orders").find();
    } else if (entity === "payments") {
      records = Database.table("payments").find();
      if (records.length === 0) {
        records = Database.table("orders").find((o) => o.status === "paid" || o.status === "COMPLETED");
      }
    } else if (entity === "expenses") {
      records = Database.table("expenses").find();
    } else {
      return res.status(400).json({ success: false, message: "Unsupported export entity. Use orders, payments, or expenses." });
    }

    if (records.length === 0) {
      return res.status(200).send("No records found to export.");
    }

    // Convert to CSV
    const keys = Object.keys(records[0]).filter((k) => typeof records[0][k] !== "object");
    const csvHeader = keys.join(",");
    const csvRows = records.map((r) =>
      keys.map((k) => `"${String(r[k] || "").replace(/"/g, '""')}"`).join(",")
    );
    const csvContent = [csvHeader, ...csvRows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=lawkaksha_${entity}_${Date.now()}.csv`);
    res.status(200).send(csvContent);
  } catch (err) {
    res.status(500).json({ success: false, message: "Export error: " + err.message });
  }
});

// SITE SETTINGS MANAGEMENT
router.get("/admin/settings", async (req, res) => {
  try {
    const settingsTable = Database.table("site_settings");
    const settings = settingsTable.find();
    res.status(200).json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/admin/settings", async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ success: false, message: "Settings key is required." });

    const settingsTable = Database.table("site_settings");
    const existing = settingsTable.findOne((s) => s.key === key);
    let updated;
    if (existing) {
      updated = settingsTable.update(existing.id, { value });
    } else {
      updated = settingsTable.insert({ id: `set-${Date.now()}`, key, value });
    }

    res.status(200).json({ success: true, setting: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
