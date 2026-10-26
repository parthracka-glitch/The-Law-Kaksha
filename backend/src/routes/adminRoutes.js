/**
 * The Law Kaksha - Admin REST API Routes with MongoDB Atlas
 * Fully synchronizes Subscriptions, Students, Products, Cases, MCQs, Coupons, QOTD & Analytics with MongoDB Atlas
 */

const express = require("express");
const path = require("path");
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max for high-fidelity statutory codices
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/octet-stream",
    ];
    const isPdfExt = (file.originalname || "").toLowerCase().endsWith(".pdf");
    if (allowedMimeTypes.includes(file.mimetype) || isPdfExt) {
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
const Course = require("../models/Course");
const Act = require("../models/Act");
const Unit = require("../models/Unit");
const ContentItem = require("../models/ContentItem");
const SupportTicket = require("../models/SupportTicket");
const Database = require("../db/database");
const { isConnected } = require("../db/mongo");
const { uploadToStorage, isCloudinaryConfigured } = require("../utils/cloudinary");
const { requireAdmin } = require("../middleware/authMiddleware");
const { grantEntitlement, reconcileOrder } = require("../services/entitlementService");

const router = express.Router();

function createSlug(value) {
  const slug = String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
  return slug || `course-${Date.now()}`;
}

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
      cover_image: req.body.cover_image || "/assets/ca-cs-hero-books-sharp.png",
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

    const caseStudyData = {
      id: payload.id,
      slug: payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || payload.id,
      title: payload.title,
      summary: payload.scenario || "",
      content: payload.scenario + "\n\n### Model Answer:\n" + payload.modelAnswer + (payload.precedent ? "\n\n### Precedent:\n" + payload.precedent : ""),
      act_name: payload.badge || payload.subject || "Contract Act",
      marks_weight: parseInt(payload.marks, 10) || 6,
      show_on_website: true,
      show_on_dashboard: true,
      is_published: true,
    };

    if (isConnected()) {
      const created = await WeeklyCase.findOneAndUpdate({ id: payload.id }, payload, {
        upsert: true,
        new: true,
      });
      try {
        const CaseStudy = require("../models/CaseStudy");
        await CaseStudy.findOneAndUpdate({ id: payload.id }, caseStudyData, { upsert: true });
      } catch (_) {}
      Database.table("weekly_cases").insert(payload);
      Database.table("case_studies").insert(caseStudyData);
      return res.status(201).json({ success: true, source: "mongodb_atlas", caseStudy: created });
    }

    const created = Database.table("weekly_cases").insert(payload);
    Database.table("case_studies").insert(caseStudyData);
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
      try {
        const CaseStudy = require("../models/CaseStudy");
        await CaseStudy.findOneAndUpdate({ id }, {
          ...(req.body.title ? { title: req.body.title } : {}),
          ...(req.body.scenario ? { summary: req.body.scenario } : {}),
          ...(req.body.badge ? { act_name: req.body.badge } : {}),
        });
      } catch (_) {}
      Database.table("weekly_cases").update(id, req.body);
      Database.table("case_studies").update(id, req.body);
      return res.status(200).json({ success: true, source: "mongodb_atlas", caseStudy: updated });
    }
    const updated = Database.table("weekly_cases").update(id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Case study not found." });
    Database.table("case_studies").update(id, req.body);
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
      try {
        const CaseStudy = require("../models/CaseStudy");
        await CaseStudy.deleteOne({ id });
      } catch (_) {}
      Database.table("weekly_cases").delete(id);
      Database.table("case_studies").delete(id);
      return res.status(200).json({ success: true, source: "mongodb_atlas" });
    }
    const success = Database.table("weekly_cases").delete(id);
    Database.table("case_studies").delete(id);
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
      let students = await User.find({ role: "student" }).sort({ updatedAt: -1, createdAt: -1 }).select("-password_hash").lean();

      try {
        const subs = await Subscription.find().sort({ createdAt: -1 }).lean();
        const subsByEmail = new Map();
        for (const s of subs) {
          if (s.email && !subsByEmail.has(s.email.toLowerCase())) {
            subsByEmail.set(s.email.toLowerCase(), s);
          }
        }

        students = students.map((std) => {
          const sub = subsByEmail.get((std.email || "").toLowerCase());
          const enrolled =
            Array.isArray(std.enrolled_books) && std.enrolled_books.length > 0
              ? std.enrolled_books
              : sub && sub.item
              ? [sub.item]
              : [];
          return {
            ...std,
            enrolled_books: enrolled,
            latest_purchase_date: sub?.date || (sub?.createdAt ? new Date(sub.createdAt).toLocaleDateString("en-IN") : undefined),
            has_active_purchase: Boolean(enrolled.length > 0 || (std.unlockedItemIds && std.unlockedItemIds.length > 0) || sub),
          };
        });

        // Segregate: Course buyers on top, sorted by latest purchase date descending
        students.sort((a, b) => {
          const scoreA = (a.has_active_purchase ? 10000000000000 : 0) + (new Date(a.updatedAt || a.createdAt || 0).getTime());
          const scoreB = (b.has_active_purchase ? 10000000000000 : 0) + (new Date(b.updatedAt || b.createdAt || 0).getTime());
          return scoreB - scoreA;
        });
      } catch (subErr) {
        console.warn("[AdminRoutes] Subscriptions enrichment warning:", subErr.message);
      }

      return res.status(200).json({ success: true, source: "mongodb_atlas", students });
    }
    const usersTable = Database.table("users");
    const students = usersTable.find((u) => u.role === "student").reverse().map(({ password_hash, ...u }) => u);
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
      phone: req.body.phone || "",
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
    // If request contains plan attributes rather than student enrollment attributes, handle plan creation
    if (req.body.title && req.body.price !== undefined && !req.body.studentName && !req.body.email) {
      const { title, slug, short_desc, description, price, mrp, duration_days, thumbnail, features, course_ids, display_order } = req.body;
      const plansTable = Database.table("subscription_plans");
      const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const newPlan = plansTable.insert({
        id: req.body.id || `sub-${Date.now()}`,
        title,
        slug: generatedSlug,
        short_desc: short_desc || "",
        description: description || "",
        price: Number(price),
        mrp: Number(mrp || price * 2),
        duration_days: Number(duration_days || 30),
        thumbnail: thumbnail || "/assets/ca-cs-hero-books-sharp.png",
        features: Array.isArray(features) ? features : [],
        course_ids: Array.isArray(course_ids) ? course_ids : [],
        display_order: Number(display_order || 0),
        is_active: true,
      });
      return res.status(201).json({ success: true, subscription: newPlan });
    }

    const payload = {
      id: req.body.id || `LK-SUB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: req.body.studentName || "Enrolled Student",
      studentRoll: req.body.studentRoll || "LRK-2026-004182",
      email: String(req.body.email || "student@thelawkaksha.com").toLowerCase().trim(),
      phone: req.body.phone || "",
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
        { id: "ex-1", exam: "CSEET Business Laws and Management", date: "2026-11-12", session: "November 2026 Attempt" },
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

// GET /admin/mcq-pool - Get all Daily High-Yield Case Challenge MCQs
router.get("/admin/mcq-pool", async (req, res) => {
  try {
    if (isConnected()) {
      const setting = await SiteSetting.findOne({ key: "mcq_pool" });
      if (setting && Array.isArray(setting.value) && setting.value.length > 0) {
        return res.status(200).json({ success: true, mcqPool: setting.value });
      }
    }
    // Return empty or default pool indicator
    res.status(200).json({ success: true, mcqPool: null });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching MCQ pool." });
  }
});

// POST /admin/mcq-pool - Save all Daily High-Yield Case Challenge MCQs to MongoDB
router.post("/admin/mcq-pool", async (req, res) => {
  try {
    const mcqPool = req.body.mcqPool;
    if (isConnected()) {
      await SiteSetting.findOneAndUpdate({ key: "mcq_pool" }, { value: mcqPool }, { upsert: true });
      return res.status(200).json({ success: true, source: "mongodb_atlas", mcqPool });
    }
    res.status(200).json({ success: true, mcqPool });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error saving MCQ pool." });
  }
});


// -----------------------------------------------------------------------------
// 9. FILE UPLOAD TO CLOUDINARY / SECURE STORAGE
// -----------------------------------------------------------------------------
router.post(
  "/admin/upload",
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        console.error("[Admin Upload Multer Error]:", err);
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "The uploaded file is too large. Maximum supported file size is 100MB.",
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message || "Failed to process uploaded file.",
        });
      }
      next();
    });
  },
  async (req, res) => {
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
  }
);

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
    title: "CSEET Business Laws and Management",
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

    res.status(200).json({ success: true, count: orders.length, orders, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching orders: " + err.message });
  }
});

// B1: ADMIN ORDER RE-CHECK PAYMENT (§8 B1)
router.post("/admin/orders/:id/recheck", async (req, res) => {
  try {
    const result = await reconcileOrder(req.params.id);
    if (!result.success && result.error === "ORDER_NOT_FOUND") {
      return res.status(404).json(result);
    }
    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: "Error reconciling order: " + err.message });
  }
});

// B1: ADMIN MANUAL ENTITLEMENT GRANT WITH AUDIT LOG (§8 B1)
router.post("/admin/orders/:id/grant-manual", async (req, res) => {
  try {
    const orderId = req.params.id;
    const { notes = "Granted access manually by administrator" } = req.body;

    const result = await grantEntitlement(orderId, {
      grantedBy: "admin_manual",
      adminUser: req.user,
      notes,
    });

    if (!result.success) {
      const status = result.error === "ORDER_NOT_FOUND" ? 404 : 400;
      return res.status(status).json(result);
    }

    return res.status(200).json({
      success: true,
      message: "Digital entitlement granted manually. Action recorded in audit logs.",
      ...result,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error granting manual entitlement: " + err.message });
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
router.get("/admin/subscription-plans", async (req, res) => {
  try {
    const plansTable = Database.table("subscription_plans");
    const plans = plansTable.find();
    res.status(200).json({ success: true, count: plans.length, subscriptions: plans, plans });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching subscription plans: " + err.message });
  }
});

router.post(["/admin/subscription-plans", "/admin/subscriptions/plan"], async (req, res) => {
  try {
    const { title, slug, short_desc, description, price, mrp, duration_days, thumbnail, features, course_ids, display_order } = req.body;
    if (!title || price === undefined) {
      return res.status(400).json({ success: false, message: "Title and price are required." });
    }

    const plansTable = Database.table("subscription_plans");
    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newPlan = plansTable.insert({
      id: req.body.id || `sub-${Date.now()}`,
      title,
      slug: generatedSlug,
      short_desc: short_desc || "",
      description: description || "",
      price: Number(price),
      mrp: Number(mrp || price * 2),
      duration_days: Number(duration_days || 30),
      thumbnail: thumbnail || "/assets/ca-cs-hero-books-sharp.png",
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

// B2 & B3: COURSES & EXTRA COURSES CRUD (§8 B2 & B3) & COURSES HIERARCHY MANAGEMENT (P5)
router.get("/admin/courses", async (req, res) => {
  try {
    if (isConnected()) {
      const courses = await Course.find().sort({ order: 1, display_order: 1 }).lean();
      if (courses && courses.length > 0) {
        return res.status(200).json({ success: true, count: courses.length, source: "mongodb_atlas", courses });
      }
    }
    const coursesTable = Database.table("courses");
    const courses = coursesTable.find().sort((a, b) => {
      const ordA = a.order ?? (a.kind === "core" ? 1 : 99);
      const ordB = b.order ?? (b.kind === "core" ? 1 : 99);
      return ordA - ordB;
    });
    res.status(200).json({ success: true, count: courses.length, source: "local_cache", courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/admin/courses", async (req, res) => {
  try {
    const { title, slug, description, thumbnail, kind, price, mrp, show_on_website, display_order, availability, accessDays, exam_body } = req.body;
    if (!title) return res.status(400).json({ success: false, message: "Course title is required." });

    let courseSlug = createSlug(slug || title);
    if (isConnected()) {
      const existingSlug = await Course.findOne({ slug: courseSlug }).lean();
      if (existingSlug) courseSlug = `${courseSlug}-${Date.now()}`;
    } else if (Database.table("courses").findOne((c) => c.slug === courseSlug)) {
      courseSlug = `${courseSlug}-${Date.now()}`;
    }

    const newCourseData = {
      id: req.body.id || `course-${Date.now()}`,
      slug: courseSlug,
      title,
      description: description || "",
      thumbnail: thumbnail || "/assets/ca-cs-hero-books-sharp.png",
      kind: kind === "extra" ? "extra" : "core",
      price: Number(price || 0),
      mrp: Number(mrp || 0),
      accessDays: Number(accessDays || 30),
      availability: availability === "coming_soon" ? "coming_soon" : "live",
      exam_body: exam_body || "ICAI",
      show_on_website: show_on_website !== false,
      is_active: true,
      order: Number(display_order || 99),
      display_order: Number(display_order || 99),
    };

    if (isConnected()) {
      const created = await Course.create(newCourseData);
      Database.table("courses").insert(newCourseData);
      return res.status(201).json({ success: true, source: "mongodb_atlas", course: created });
    }

    const coursesTable = Database.table("courses");
    const newCourse = coursesTable.insert(newCourseData);
    res.status(201).json({ success: true, source: "local_cache", course: newCourse });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/admin/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const allowedFields = [
      "title",
      "slug",
      "availability",
      "price",
      "mrp",
      "accessDays",
      "description",
      "thumbnail",
      "kind",
      "exam_body",
      "is_active",
      "order",
      "display_order",
    ];
    const updates = {};
    for (const f of allowedFields) {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    }
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.accessDays !== undefined) updates.accessDays = Number(updates.accessDays);
    if (updates.mrp !== undefined) updates.mrp = Number(updates.mrp);

    const mongoose = require("mongoose");
    const filter = mongoose.isValidObjectId(id)
      ? { $or: [{ _id: id }, { id }, { slug: id }] }
      : { $or: [{ id }, { slug: id }] };

    let updatedMongo = null;
    if (isConnected()) {
      try {
        updatedMongo = await Course.findOneAndUpdate(filter, { $set: updates }, { new: true });
      } catch (mongoErr) {
        console.warn("[AdminRoutes] Course update in Atlas error:", mongoErr.message);
      }
    }

    // Always keep local disk database in sync
    const coursesTable = Database.table("courses");
    const localItem = coursesTable.findOne((c) => c.id === id || c.slug === id || c._id === id);
    let updatedLocal = null;
    if (localItem) {
      updatedLocal = coursesTable.update(localItem.id, updates);
    } else if (updatedMongo) {
      const doc = updatedMongo.toObject ? updatedMongo.toObject() : updatedMongo;
      updatedLocal = coursesTable.insert({ ...doc, ...updates });
    }

    // Propagate price, duration, thumbnail & title to subscription_plans so the whole website reflects the admin's change
    if (updates.price !== undefined || updates.accessDays !== undefined || updates.mrp !== undefined || updates.thumbnail !== undefined || updates.title !== undefined) {
      const courseDoc = updatedMongo || localItem;
      const courseIdentifier = `${id} ${courseDoc?.id || ""} ${courseDoc?.slug || ""} ${courseDoc?.title || ""}`.toLowerCase();
      const isCa = courseIdentifier.includes("ca-foundation") || courseIdentifier.includes("paper 2") || courseIdentifier.includes("foundation");
      const isCs = courseIdentifier.includes("cseet");

      const planUpdates = {};
      if (updates.price !== undefined) planUpdates.price = updates.price;
      if (updates.mrp !== undefined && updates.mrp > 0) {
        planUpdates.mrp = updates.mrp;
      } else if (updates.price !== undefined) {
        const existingMrp = Number(courseDoc?.mrp || 0);
        planUpdates.mrp = existingMrp > updates.price ? existingMrp : Math.max(updates.price * 2, 299);
      }
      if (updates.accessDays !== undefined && updates.accessDays > 0) planUpdates.duration_days = updates.accessDays;
      if (updates.thumbnail !== undefined) planUpdates.thumbnail = updates.thumbnail;
      if (updates.title !== undefined) planUpdates.title = updates.title;
      if (updates.description !== undefined) planUpdates.description = updates.description;

      const plansTable = Database.table("subscription_plans");
      const matchedPlans = plansTable.find((p) => {
        if (p.course_ids && (p.course_ids.includes(id) || (courseDoc && p.course_ids.includes(courseDoc.id)))) return true;
        if (isCa && (p.id.includes("ca") || p.slug.includes("ca"))) return true;
        if (isCs && (p.id.includes("cs") || p.slug.includes("cs"))) return true;
        return false;
      });

      matchedPlans.forEach((p) => {
        plansTable.update(p.id, planUpdates);
      });

      if (isConnected()) {
        try {
          const Subscription = require("../models/Subscription");
          const subId = isCa ? "sub-ca-foundation-monthly" : isCs ? "sub-cseet-monthly" : `sub-${courseDoc?.id || id}`;
          const subSlug = isCa ? "ca-foundation-monthly" : isCs ? "cseet-monthly" : (courseDoc?.slug || id);
          const subTitle = updates.title || (isCa ? "CA Foundation Business Laws" : isCs ? "CSEET Business Law and Management" : (courseDoc?.title || id));

          // Safeguard: ONLY update catalog plan templates, NEVER touch actual student subscriptions (which have email or studentRoll)
          const planFilter = {
            $or: [
              { id: subId },
              { slug: subSlug },
            ],
            email: { $exists: false },
            studentRoll: { $exists: false },
          };

          await Subscription.findOneAndUpdate(
            planFilter,
            {
              $set: {
                id: subId,
                slug: subSlug,
                title: subTitle,
                ...planUpdates,
                is_active: true,
                course_ids: [courseDoc?.id || id],
              },
            },
            { upsert: false }
          );
        } catch (subErr) {
          console.warn("[AdminRoutes] Subscription sync warning:", subErr.message);
        }
      }
    }

    if (!updatedMongo && !updatedLocal) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    res.status(200).json({
      success: true,
      source: updatedMongo ? "mongodb_atlas" : "local_cache",
      course: updatedMongo || updatedLocal,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating course: " + err.message });
  }
});

// Helper function to delete course from both local and Atlas
async function executeDeleteCourse(id) {
  const coursesTable = Database.table("courses");
  const local = coursesTable.findOne((c) => c.id === id || c._id === id || c.slug === id);
  if (local) coursesTable.delete(local.id);
  coursesTable.delete(id);

  if (isConnected()) {
    try {
      const mongoose = require("mongoose");
      const filter = mongoose.isValidObjectId(id)
        ? { $or: [{ _id: id }, { id }, { slug: id }] }
        : { $or: [{ id }, { slug: id }] };
      await Course.deleteMany(filter);
      await Subscription.deleteMany({
        $or: [{ course_ids: id }, { id: `sub-${id}` }, { slug: id }],
      });
    } catch (mongoErr) {
      console.warn("[AdminRoutes] Course delete from Atlas error:", mongoErr.message);
    }
  }
}

router.delete("/admin/courses/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await executeDeleteCourse(id);
    res.status(200).json({ success: true, message: "Course deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST fallback for clients/proxies that restrict DELETE method
router.post("/admin/courses/:id/delete", async (req, res) => {
  try {
    const id = req.params.id;
    await executeDeleteCourse(id);
    res.status(200).json({ success: true, message: "Course deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/admin/courses/delete", async (req, res) => {
  try {
    const id = req.body.id || req.body.courseId;
    if (!id) return res.status(400).json({ success: false, message: "Course ID is required." });
    await executeDeleteCourse(id);
    res.status(200).json({ success: true, message: "Course deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// B3: EXTRA COURSES SPECIFIC ENDPOINTS
router.get("/admin/extra-courses", async (req, res) => {
  try {
    if (isConnected()) {
      try {
        const mongoExtras = await Course.find({ kind: "extra" }).sort({ order: 1, display_order: 1 }).lean();
        if (mongoExtras && mongoExtras.length > 0) {
          return res.status(200).json({ success: true, count: mongoExtras.length, source: "mongodb_atlas", extraCourses: mongoExtras });
        }
      } catch (_) {}
    }
    const coursesTable = Database.table("courses");
    const extraCourses = coursesTable.find((c) => c.kind === "extra");
    res.status(200).json({ success: true, count: extraCourses.length, source: "local_cache", extraCourses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/admin/extra-courses", async (req, res) => {
  try {
    req.body.kind = "extra";
    const payload = {
      id: req.body.id || `course-extra-${Date.now()}`,
      slug: createSlug(req.body.slug || req.body.title || `extra-${Date.now()}`),
      title: req.body.title || "Extra Course",
      description: req.body.description || "",
      thumbnail: req.body.thumbnail || "/assets/ca-cs-hero-books-sharp.png",
      kind: "extra",
      price: Number(req.body.price || 49),
      mrp: Number(req.body.mrp || 149),
      accessDays: Number(req.body.accessDays || 30),
      availability: req.body.availability || "live",
      exam_body: req.body.exam_body || "ICAI",
      show_on_website: req.body.show_on_website !== false,
      is_active: true,
      order: 99,
      display_order: 99,
    };

    if (isConnected()) {
      try {
        const created = await Course.create(payload);
        Database.table("courses").insert(payload);
        return res.status(201).json({ success: true, source: "mongodb_atlas", course: created });
      } catch (_) {}
    }

    const coursesTable = Database.table("courses");
    const newExtra = coursesTable.insert(payload);
    res.status(201).json({ success: true, source: "local_cache", course: newExtra });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// B4: WEBSITE CAROUSEL CRUD & REORDER (§8 B4)
const CANONICAL_WEBSITE_SLIDES = [
  {
    id: "slide-1",
    placement: "website",
    title: "Master CA Foundation Business Laws",
    subtitle: "Complete codified ICAI syllabus notes, high-yield visual flowcharts & daily exam-calibrated case studies.",
    image: "/images/hero_ca_foundation.jpg",
    cta_label: "Explore CA Foundation Pass",
    cta_link: "/courses",
    badge: "MOST POPULAR • PAPER 2",
    rating: "4.9/5 Rating (1,200+ Candidates)",
    subscription_id: "sub-ca-foundation-monthly",
    display_order: 1,
    order: 1,
    is_active: true,
  },
  {
    id: "slide-2",
    placement: "website",
    title: "CSEET Business Law and Management",
    subtitle: "Interactive 3D digital codices, ICSI unit MCQs, and weekly live Google Meet doubt clearing sessions.",
    image: "/images/hero_cseet_law.jpg",
    cta_label: "Explore CSEET Pass",
    cta_link: "/courses",
    badge: "ICSI SYLLABUS • 8 UNITS",
    rating: "100% ICSI Exam Aligned",
    subscription_id: "sub-cseet-monthly",
    display_order: 2,
    order: 2,
    is_active: true,
  },
  {
    id: "slide-3",
    placement: "website",
    title: "Dual Foundation + CSEET All-Access Pass",
    subtitle: "One unified pass for comprehensive commerce law mastery. Complete statutory library at special launch pricing.",
    image: "/images/hero_dual_combo.jpg",
    cta_label: "Get Dual All-Access Pass @ ₹180",
    cta_link: "/courses",
    badge: "BEST VALUE • LAUNCH SPECIAL",
    rating: "Dual Course Master Bundle",
    subscription_id: "sub-combo-bundle",
    display_order: 3,
    order: 3,
    is_active: true,
  },
];

router.get("/admin/carousel", async (req, res) => {
  try {
    const carouselTable = Database.table("carousel_slides");
    let slides = carouselTable.find().sort((a, b) => (a.display_order || a.order || 0) - (b.display_order || b.order || 0));

    if (isConnected()) {
      try {
        const CarouselSlide = require("../models/CarouselSlide");
        const mongoSlides = await CarouselSlide.find().sort({ display_order: 1 }).lean();
        if (mongoSlides && mongoSlides.length > 0) slides = mongoSlides;
      } catch (_) {}
    }

    // If database is empty or still has placeholder images, auto-sync canonical slides
    if (slides.length === 0 || slides.some((s) => !s.image || s.image.includes("ca-cs-hero-books-v2") || s.title.includes("Crack CA Foundation"))) {
      CANONICAL_WEBSITE_SLIDES.forEach((s) => {
        const found = carouselTable.findOne((item) => item.id === s.id);
        if (found) {
          carouselTable.update(s.id, s);
        } else {
          carouselTable.insert(s);
        }
      });
      slides = carouselTable.find().sort((a, b) => (a.display_order || a.order || 0) - (b.display_order || b.order || 0));
    }

    const normalizedSlides = slides.map((s) => ({
      ...s,
      order: s.display_order !== undefined ? s.display_order : (s.order || 1),
      display_order: s.display_order !== undefined ? s.display_order : (s.order || 1),
      cta_link: s.cta_link || "/courses",
      badge: s.badge || "",
      image: s.image || "/images/hero_ca_foundation.jpg",
    }));

    res.status(200).json({ success: true, count: normalizedSlides.length, slides: normalizedSlides, data: normalizedSlides });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/admin/carousel/sync-defaults", async (req, res) => {
  try {
    const carouselTable = Database.table("carousel_slides");
    CANONICAL_WEBSITE_SLIDES.forEach((s) => {
      const found = carouselTable.findOne((item) => item.id === s.id);
      if (found) {
        carouselTable.update(s.id, s);
      } else {
        carouselTable.insert(s);
      }
    });

    if (isConnected()) {
      try {
        const CarouselSlide = require("../models/CarouselSlide");
        for (const s of CANONICAL_WEBSITE_SLIDES) {
          await CarouselSlide.findOneAndUpdate({ id: s.id }, { $set: s }, { upsert: true });
        }
      } catch (_) {}
    }

    const currentSlides = carouselTable.find().sort((a, b) => (a.display_order || a.order || 0) - (b.display_order || b.order || 0));
    const normalized = currentSlides.map((s) => ({
      ...s,
      order: s.display_order !== undefined ? s.display_order : (s.order || 1),
      display_order: s.display_order !== undefined ? s.display_order : (s.order || 1),
      cta_link: s.cta_link || "/courses",
    }));

    res.status(200).json({
      success: true,
      message: "Synchronized with current live website carousel slides.",
      slides: normalized,
      data: normalized,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/admin/carousel", async (req, res) => {
  try {
    const { title, subtitle, image, cta_label, cta_link, badge, rating, subscription_id, display_order, order, is_active } = req.body;
    if (!title) return res.status(400).json({ success: false, message: "Slide title is required." });

    const orderNum = Number(display_order !== undefined ? display_order : (order !== undefined ? order : 1));
    const carouselTable = Database.table("carousel_slides");
    const newSlide = carouselTable.insert({
      id: `slide-${Date.now()}`,
      placement: "website",
      title,
      subtitle: subtitle || "",
      image: image || "/images/hero_ca_foundation.jpg",
      cta_label: cta_label || "Explore Plan",
      cta_link: cta_link || "/courses",
      badge: badge || "",
      rating: rating || "",
      subscription_id: subscription_id || null,
      display_order: orderNum,
      order: orderNum,
      is_active: is_active !== false,
    });

    if (isConnected()) {
      try {
        const CarouselSlide = require("../models/CarouselSlide");
        await CarouselSlide.create(newSlide);
      } catch (_) {}
    }

    res.status(201).json({ success: true, slide: newSlide, data: newSlide });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/admin/carousel/:id", async (req, res) => {
  try {
    const carouselTable = Database.table("carousel_slides");
    const payload = { ...req.body };
    if (payload.order !== undefined && payload.display_order === undefined) {
      payload.display_order = Number(payload.order);
    } else if (payload.display_order !== undefined && payload.order === undefined) {
      payload.order = Number(payload.display_order);
    }

    const updated = carouselTable.update(req.params.id, payload);
    if (!updated) return res.status(404).json({ success: false, message: "Slide not found." });

    if (isConnected()) {
      try {
        const CarouselSlide = require("../models/CarouselSlide");
        await CarouselSlide.findOneAndUpdate({ id: req.params.id }, { $set: payload }, { new: true });
      } catch (_) {}
    }

    res.status(200).json({ success: true, slide: updated, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/admin/carousel/:id", async (req, res) => {
  try {
    const carouselTable = Database.table("carousel_slides");
    carouselTable.delete(req.params.id);

    if (isConnected()) {
      try {
        const CarouselSlide = require("../models/CarouselSlide");
        await CarouselSlide.deleteOne({ id: req.params.id });
      } catch (_) {}
    }

    res.status(200).json({ success: true, message: "Slide deleted." });
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
      banner: banner || "/assets/ca-cs-hero-books-sharp.png",
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
      cover_image: cover_image || "/assets/ca-cs-hero-books-sharp.png",
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

// B5: LIVE SESSIONS & GOOGLE MEET LINKS CRUD (§8 B5)
router.get("/admin/live-sessions", async (req, res) => {
  try {
    if (isConnected()) {
      try {
        const LiveSession = require("../models/LiveSession");
        const sessions = await LiveSession.find().sort({ scheduled_at: -1 }).lean();
        if (sessions && sessions.length > 0) {
          return res.status(200).json({ success: true, count: sessions.length, source: "mongodb_atlas", sessions });
        }
      } catch (_) {}
    }
    const sessionsTable = Database.table("live_sessions");
    const sessions = sessionsTable.find().sort((a, b) => new Date(b.scheduled_at || 0).getTime() - new Date(a.scheduled_at || 0).getTime());
    res.status(200).json({ success: true, count: sessions.length, source: "local_cache", sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching live sessions: " + err.message });
  }
});

router.post("/admin/live-sessions", async (req, res) => {
  try {
    const { title, description, meet_url, target_exam, faculty_name, scheduled_at, duration_minutes, is_active } = req.body;
    if (!title || !meet_url) {
      return res.status(400).json({ success: false, message: "Title and Google Meet URL are required." });
    }

    const payload = {
      id: req.body.id || `session-${Date.now()}`,
      title,
      description: description || "",
      meet_url,
      target_exam: target_exam || "All Exams",
      faculty_name: faculty_name || "Faculty",
      scheduled_at: scheduled_at ? new Date(scheduled_at).toISOString() : new Date().toISOString(),
      duration_minutes: Number(duration_minutes || 60),
      is_active: is_active !== false,
    };

    if (isConnected()) {
      try {
        const LiveSession = require("../models/LiveSession");
        const created = await LiveSession.findOneAndUpdate({ id: payload.id }, payload, { upsert: true, new: true });
        Database.table("live_sessions").insert(payload);
        return res.status(201).json({ success: true, source: "mongodb_atlas", session: created });
      } catch (_) {}
    }

    const sessionsTable = Database.table("live_sessions");
    const created = sessionsTable.insert(payload);
    res.status(201).json({ success: true, source: "local_cache", session: created });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating live session: " + err.message });
  }
});

router.delete("/admin/live-sessions/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (isConnected()) {
      try {
        const LiveSession = require("../models/LiveSession");
        await LiveSession.deleteOne({ id });
      } catch (_) {}
    }
    const sessionsTable = Database.table("live_sessions");
    sessionsTable.delete(id);
    res.status(200).json({ success: true, message: "Live session removed." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting live session: " + err.message });
  }
});

// B10: DATA EXPORT (CSV / EXCEL FORMAT)
router.get("/admin/export/:entity", async (req, res) => {
  try {
    const { entity } = req.params; // orders, payments, expenses, students
    let records = [];

    if (entity === "orders") {
      if (isConnected()) {
        try {
          const Order = require("../models/Order");
          records = await Order.find().sort({ createdAt: -1 }).lean();
        } catch (_) {}
      }
      if (records.length === 0) {
        records = Database.table("orders").find();
      }
    } else if (entity === "payments") {
      if (isConnected()) {
        try {
          const Payment = require("../models/Payment");
          records = await Payment.find().sort({ createdAt: -1 }).lean();
        } catch (_) {}
      }
      if (records.length === 0) {
        records = Database.table("payments").find();
      }
      if (records.length === 0) {
        records = Database.table("orders").find((o) => o.status === "paid" || o.status === "COMPLETED");
      }
    } else if (entity === "expenses") {
      if (isConnected()) {
        try {
          const Expense = require("../models/Expense");
          records = await Expense.find().sort({ createdAt: -1 }).lean();
        } catch (_) {}
      }
      if (records.length === 0) {
        records = Database.table("expenses").find();
      }
    } else if (entity === "students" || entity === "users") {
      if (isConnected()) {
        try {
          const User = require("../models/User");
          const users = await User.find({ role: { $ne: "admin" } }).sort({ createdAt: -1 }).lean();
          if (users && users.length > 0) {
            records = users.map((u) => {
              const { password_hash, ...safe } = u;
              return safe;
            });
          }
        } catch (_) {}
      }
      if (records.length === 0) {
        records = Database.table("users").find((u) => u.role !== "admin").map((u) => {
          const { password_hash, ...safe } = u;
          return safe;
        });
      }
    } else {
      return res.status(400).json({ success: false, message: "Unsupported export entity. Use orders, payments, expenses, or students." });
    }

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=lawkaksha_${entity}_${Date.now()}.csv`);

    if (records.length === 0) {
      return res.status(200).send("id,message\n0,\"No records found to export\"");
    }

    // Convert to CSV
    const keys = Object.keys(records[0]).filter((k) => typeof records[0][k] !== "object");
    const csvHeader = keys.join(",");
    const csvRows = records.map((r) =>
      keys.map((k) => `"${String(r[k] || "").replace(/"/g, '""')}"`).join(",")
    );
    const csvContent = [csvHeader, ...csvRows].join("\n");

    res.status(200).send(csvContent);
  } catch (err) {
    res.status(500).json({ success: false, message: "Export error: " + err.message });
  }
});

// -----------------------------------------------------------------------------
// 15. COURSES HIERARCHY MANAGEMENT (P5) - Handled in Section B2/B3 above
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// 16. ACTS MANAGEMENT (P5)
// -----------------------------------------------------------------------------
router.get("/admin/acts", async (req, res) => {
  try {
    const { courseId } = req.query;
    if (isConnected()) {
      const filter = courseId ? { courseId } : {};
      const acts = await Act.find(filter).sort({ order: 1 }).lean();
      if (acts && acts.length > 0) {
        return res.status(200).json({ success: true, source: "mongodb_atlas", acts });
      }
    }
    let acts = Database.table("acts").find();
    if (courseId) acts = acts.filter((a) => a.courseId === courseId);
    acts.sort((a, b) => (a.order || 0) - (b.order || 0));
    res.status(200).json({ success: true, source: "local_cache", acts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching acts: " + err.message });
  }
});

router.post("/admin/acts", async (req, res) => {
  try {
    const payload = {
      id: req.body.id || `act-${Date.now()}`,
      courseId: req.body.courseId,
      title: req.body.title,
      availability: req.body.availability === "coming_soon" ? "coming_soon" : "live",
      order: Number(req.body.order) || 1,
      description: req.body.description || "",
    };
    if (!payload.courseId || !payload.title) {
      return res.status(400).json({ success: false, message: "courseId and title are required." });
    }

    if (isConnected()) {
      const created = await Act.create(payload);
      Database.table("acts").insert(payload);
      return res.status(201).json({ success: true, source: "mongodb_atlas", act: created });
    }

    const created = Database.table("acts").insert(payload);
    res.status(201).json({ success: true, source: "local_cache", act: created });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating act: " + err.message });
  }
});

router.put("/admin/acts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const allowed = ["title", "availability", "order", "description"];
    const updates = {};
    for (const f of allowed) {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    }
    if (updates.order !== undefined) updates.order = Number(updates.order);

    if (isConnected()) {
      const updated = await Act.findOneAndUpdate({ id }, updates, { new: true });
      Database.table("acts").update(id, updates);
      if (!updated) return res.status(404).json({ success: false, message: "Act not found." });
      return res.status(200).json({ success: true, source: "mongodb_atlas", act: updated });
    }

    const updated = Database.table("acts").update(id, updates);
    if (!updated) return res.status(404).json({ success: false, message: "Act not found." });
    res.status(200).json({ success: true, source: "local_cache", act: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating act: " + err.message });
  }
});

router.delete("/admin/acts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isConnected()) {
      await Act.deleteOne({ id });
      Database.table("acts").delete(id);
      return res.status(200).json({ success: true, source: "mongodb_atlas" });
    }
    Database.table("acts").delete(id);
    res.status(200).json({ success: true, source: "local_cache" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting act: " + err.message });
  }
});

// -----------------------------------------------------------------------------
// 17. UNITS MANAGEMENT (P5)
// -----------------------------------------------------------------------------
router.get("/admin/units", async (req, res) => {
  try {
    const { actId } = req.query;
    if (isConnected()) {
      const filter = actId ? { actId } : {};
      const units = await Unit.find(filter).sort({ order: 1 }).lean();
      if (units && units.length > 0) {
        return res.status(200).json({ success: true, source: "mongodb_atlas", units });
      }
    }
    let units = Database.table("units").find();
    if (actId) units = units.filter((u) => u.actId === actId);
    units.sort((a, b) => (a.order || 0) - (b.order || 0));
    res.status(200).json({ success: true, source: "local_cache", units });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching units: " + err.message });
  }
});

router.post("/admin/units", async (req, res) => {
  try {
    const payload = {
      id: req.body.id || `unit-${Date.now()}`,
      actId: req.body.actId,
      title: req.body.title || "New Unit",
      order: Number(req.body.order) || 1,
      summary: req.body.summary || "",
    };
    if (!payload.actId) {
      return res.status(400).json({ success: false, message: "actId is required." });
    }

    if (isConnected()) {
      const created = await Unit.create(payload);
      Database.table("units").insert(payload);
      return res.status(201).json({ success: true, source: "mongodb_atlas", unit: created });
    }
    const created = Database.table("units").insert(payload);
    res.status(201).json({ success: true, source: "local_cache", unit: created });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating unit: " + err.message });
  }
});

router.put("/admin/units/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const allowed = ["title", "order", "summary"];
    const updates = {};
    for (const f of allowed) {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    }
    if (updates.order !== undefined) updates.order = Number(updates.order);

    if (isConnected()) {
      const updated = await Unit.findOneAndUpdate({ id }, updates, { new: true });
      Database.table("units").update(id, updates);
      if (!updated) return res.status(404).json({ success: false, message: "Unit not found." });
      return res.status(200).json({ success: true, source: "mongodb_atlas", unit: updated });
    }

    const updated = Database.table("units").update(id, updates);
    if (!updated) return res.status(404).json({ success: false, message: "Unit not found." });
    res.status(200).json({ success: true, source: "local_cache", unit: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating unit: " + err.message });
  }
});

router.delete("/admin/units/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isConnected()) {
      await Unit.deleteOne({ id });
      Database.table("units").delete(id);
      return res.status(200).json({ success: true, source: "mongodb_atlas" });
    }
    Database.table("units").delete(id);
    res.status(200).json({ success: true, source: "local_cache" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting unit: " + err.message });
  }
});

// -----------------------------------------------------------------------------
// 18. CONTENT ITEMS MANAGEMENT (P5)
// -----------------------------------------------------------------------------
router.get("/admin/content-items", async (req, res) => {
  try {
    const { unitId, type } = req.query;
    if (isConnected()) {
      const filter = {};
      if (unitId) filter.unitId = unitId;
      if (type) filter.type = type;
      const items = await ContentItem.find(filter).sort({ order: 1 }).lean();
      if (items && items.length > 0) {
        return res.status(200).json({ success: true, source: "mongodb_atlas", items });
      }
    }
    let items = Database.table("content_items").find();
    if (unitId) items = items.filter((i) => i.unitId === unitId);
    if (type) items = items.filter((i) => i.type === type);
    items.sort((a, b) => (a.order || 0) - (b.order || 0));
    res.status(200).json({ success: true, source: "local_cache", items });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching content items: " + err.message });
  }
});

router.post("/admin/content-items", async (req, res) => {
  try {
    const {
      unitId,
      title,
      type,
      isSample,
      samplePagesRange,
      sampleFromPage,
      sampleToPage,
      isPublished,
      description,
      order,
      fileName,
      fileSize,
      cloudinaryPublicId,
    } = req.body;

    if (!unitId || !title) {
      return res.status(400).json({ success: false, message: "unitId and title are required." });
    }

    let fromP = Number(sampleFromPage) || 1;
    let toP = Number(sampleToPage) || 5;
    if (samplePagesRange && typeof samplePagesRange === "string") {
      const parts = samplePagesRange.split("-").map((p) => parseInt(p.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        fromP = parts[0];
        toP = parts[1];
      }
    }

    const payload = {
      id: req.body.id || `item-${Date.now()}`,
      unitId,
      title,
      type: type || "notes",
      isSample: Boolean(isSample),
      sampleFromPage: fromP,
      sampleToPage: toP,
      samplePagesRange: `${fromP}-${toP}`,
      isPublished: isPublished !== false,
      description: description || "",
      order: Number(order) || 1,
      fileName: fileName || "",
      fileSize: Number(fileSize) || 0,
      cloudinaryPublicId: cloudinaryPublicId || "",
      publishedAt: new Date(),
    };

    if (isConnected()) {
      const created = await ContentItem.create(payload);
      Database.table("content_items").insert(payload);
      return res.status(201).json({ success: true, source: "mongodb_atlas", item: created });
    }
    const created = Database.table("content_items").insert(payload);
    res.status(201).json({ success: true, source: "local_cache", item: created });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating content item: " + err.message });
  }
});

router.put("/admin/content-items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const allowed = [
      "title",
      "type",
      "isSample",
      "samplePagesRange",
      "sampleFromPage",
      "sampleToPage",
      "isPublished",
      "description",
      "order",
      "fileName",
      "fileSize",
      "cloudinaryPublicId",
    ];
    const updates = {};
    for (const f of allowed) {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    }
    if (updates.samplePagesRange && typeof updates.samplePagesRange === "string") {
      const parts = updates.samplePagesRange.split("-").map((p) => parseInt(p.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        updates.sampleFromPage = parts[0];
        updates.sampleToPage = parts[1];
      }
    }
    if (updates.order !== undefined) updates.order = Number(updates.order);
    if (updates.isSample !== undefined) updates.isSample = Boolean(updates.isSample);
    if (updates.isPublished !== undefined) updates.isPublished = Boolean(updates.isPublished);

    if (isConnected()) {
      const updated = await ContentItem.findOneAndUpdate({ id }, updates, { new: true });
      Database.table("content_items").update(id, updates);
      if (!updated) return res.status(404).json({ success: false, message: "Content item not found." });
      return res.status(200).json({ success: true, source: "mongodb_atlas", item: updated });
    }

    const updated = Database.table("content_items").update(id, updates);
    if (!updated) return res.status(404).json({ success: false, message: "Content item not found." });
    res.status(200).json({ success: true, source: "local_cache", item: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating content item: " + err.message });
  }
});

router.delete("/admin/content-items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isConnected()) {
      await ContentItem.deleteOne({ id });
      Database.table("content_items").delete(id);
      return res.status(200).json({ success: true, source: "mongodb_atlas" });
    }
    Database.table("content_items").delete(id);
    res.status(200).json({ success: true, source: "local_cache" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting content item: " + err.message });
  }
});

// -----------------------------------------------------------------------------
// 19. SITE SETTINGS & BRANDING CONFIGURATION (P5)
// -----------------------------------------------------------------------------
router.get("/admin/settings", async (req, res) => {
  try {
    let siteDetails = {
      support_email: "support@thelawkaksha.com",
      contact_email: "support@thelawkaksha.com",
      domain: "https://thelawkaksha.com",
      watermark_text: "THE LAW KAKSHA • PROTECTED STUDY MATERIAL",
      whatsapp_number: "", // Clean by default; UI hides button when empty
      site_title: "The Law Kaksha",
      contact_phone: "",
    };

    if (isConnected()) {
      const doc = await SiteSetting.findOne({ key: "site_details" }).lean();
      if (doc && doc.value) siteDetails = { ...siteDetails, ...doc.value };
    } else {
      const settingsTable = Database.table("site_settings");
      const record = settingsTable.findOne((s) => s.key === "site_details");
      if (record && record.value) siteDetails = { ...siteDetails, ...record.value };
    }

    const settingsTable = Database.table("site_settings");
    const settings = settingsTable.find();
    res.status(200).json({ success: true, settings, data: siteDetails });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching settings: " + err.message });
  }
});

router.put("/admin/settings", async (req, res) => {
  try {
    const payload = req.body || {};
    const siteDetails = {
      support_email: payload.support_email || payload.contact_email || "support@thelawkaksha.com",
      contact_email: payload.contact_email || payload.support_email || "support@thelawkaksha.com",
      domain: payload.domain || "https://thelawkaksha.com",
      watermark_text: payload.watermark_text || "THE LAW KAKSHA • PROTECTED STUDY MATERIAL",
      whatsapp_number: payload.whatsapp_number !== undefined ? payload.whatsapp_number.trim() : "",
      site_title: payload.site_title || "The Law Kaksha",
      contact_phone: payload.contact_phone || "",
    };

    if (isConnected()) {
      await SiteSetting.findOneAndUpdate(
        { key: "site_details" },
        { key: "site_details", value: siteDetails },
        { upsert: true, new: true }
      );
      if (payload.announcement) {
        await SiteSetting.findOneAndUpdate(
          { key: "announcement" },
          { key: "announcement", value: payload.announcement },
          { upsert: true }
        );
      }
      if (payload.social_links) {
        await SiteSetting.findOneAndUpdate(
          { key: "social_links" },
          { key: "social_links", value: payload.social_links },
          { upsert: true }
        );
      }
    }

    const settingsTable = Database.table("site_settings");
    const existing = settingsTable.findOne((s) => s.key === "site_details");
    if (existing) {
      settingsTable.update(existing.id, { value: siteDetails });
    } else {
      settingsTable.insert({ id: `set-${Date.now()}`, key: "site_details", value: siteDetails });
    }

    res.status(200).json({
      success: true,
      message: "Site settings updated successfully.",
      data: siteDetails,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating settings: " + err.message });
  }
});

router.post("/admin/settings", async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ success: false, message: "Settings key is required." });

    if (isConnected()) {
      const updated = await SiteSetting.findOneAndUpdate({ key }, { key, value }, { upsert: true, new: true });
      return res.status(200).json({ success: true, source: "mongodb_atlas", setting: updated });
    }

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

// GET /api/admin/support-tickets
router.get("/admin/support-tickets", async (req, res) => {
  try {
    if (isConnected()) {
      const tickets = await SupportTicket.find().sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, tickets });
    }
    const tickets = Database.table("support_tickets").find();
    tickets.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    res.status(200).json({ success: true, tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching tickets: " + err.message });
  }
});

// PUT /api/admin/support-tickets/:id/reply
router.put("/admin/support-tickets/:id/reply", async (req, res) => {
  try {
    const { id } = req.params;
    const { reply, status } = req.body;
    if (!reply) return res.status(400).json({ success: false, message: "Reply message is required." });

    const newStatus = status || "resolved";
    const now = new Date();
    const adminId = req.user?.id || req.user?.student_id || "admin";

    if (isConnected()) {
      const ticket = await SupportTicket.findOneAndUpdate(
        { id },
        {
          admin_reply: String(reply).trim(),
          admin_replied_at: now,
          admin_id: adminId,
          status: newStatus,
        },
        { new: true }
      ).lean();
      if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found." });
      return res.status(200).json({ success: true, ticket });
    }

    const ticketsTable = Database.table("support_tickets");
    const existing = ticketsTable.findOne((t) => t.id === id);
    if (!existing) return res.status(404).json({ success: false, message: "Ticket not found." });

    const updated = ticketsTable.update(existing.id, {
      admin_reply: String(reply).trim(),
      admin_replied_at: now,
      admin_id: adminId,
      status: newStatus,
    });
    res.status(200).json({ success: true, ticket: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error replying to ticket: " + err.message });
  }
});

module.exports = router;
