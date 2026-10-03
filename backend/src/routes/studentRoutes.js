/**
 * The Law Kaksha - Student API Routes with MongoDB Atlas
 * Connects the Student Dashboard with MongoDB Atlas
 * Accurately determines course purchases, unlocked DRM codices, and live learning resources
 */

const express = require("express");
const User = require("../models/User");
const Subscription = require("../models/Subscription");
const Product = require("../models/Product");
const WeeklyCase = require("../models/WeeklyCase");
const McqQuestion = require("../models/McqQuestion");
const McqTest = require("../models/McqTest");
const SiteSetting = require("../models/SiteSetting");
const { isConnected } = require("../db/mongo");
const Database = require("../db/database");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET /api/student/dashboard
 * Requires authenticated student session.
 * Ownership: Returns authenticated student's profile & courses. Admins can view any student.
 */
router.get("/dashboard", requireAuth, async (req, res) => {
  try {
    let email = req.user.email ? String(req.user.email).toLowerCase().trim() : null;
    let studentId = req.user.student_id ? String(req.user.student_id).trim() : null;

    // Admin override for support inspection
    if (req.user.role === "admin" && (req.query.email || req.query.studentId)) {
      if (req.query.email) email = String(req.query.email).toLowerCase().trim();
      if (req.query.studentId) studentId = String(req.query.studentId).trim();
    }

    let student = null;
    let subscriptions = [];
    let products = [];
    let cases = [];
    let mcqs = [];
    let mcqTests = [];
    let examSettings = [];
    let qotd = null;

    if (isConnected()) {
      // 1. Find student
      if (email || studentId) {
        student = await User.findOne({
          $or: [
            ...(email ? [{ email }] : []),
            ...(studentId ? [{ student_id: studentId }, { id: studentId }] : []),
          ],
        }).select("-password_hash").lean();

        // 2. Find student's active subscriptions
        subscriptions = await Subscription.find({
          $or: [
            ...(email ? [{ email }] : []),
            ...(studentId ? [{ studentRoll: studentId }] : []),
          ],
          accessStatus: "Active",
        }).lean();
      }

      // 3. Find live platform resources uploaded by Admin
      [products, cases, mcqs, mcqTests] = await Promise.all([
        Product.find({ status: "Active" }).lean(),
        WeeklyCase.find().sort({ createdAt: 1 }).lean(),
        McqQuestion.find().sort({ createdAt: 1 }).lean(),
        McqTest.find({ status: "Active" }).sort({ createdAt: -1 }).lean(),
      ]);

      const examSettingDoc = await SiteSetting.findOne({ key: "exam_countdown" }).lean();
      examSettings = examSettingDoc?.value || [];

      const qotdDoc = await SiteSetting.findOne({ key: "qotd" }).lean();
      qotd = qotdDoc?.value || null;
    } else {
      // Local fallback
      const usersTable = Database.table("users");
      const subsTable = Database.table("subscriptions");
      if (email || studentId) {
        student = usersTable.findOne(
          (u) => (email && u.email === email) || (studentId && (u.student_id === studentId || u.id === studentId))
        );
        subscriptions = subsTable.find(
          (s) => ((email && s.email === email) || (studentId && s.studentRoll === studentId)) && s.accessStatus === "Active"
        );
      }
      products = Database.table("products").find();
      cases = Database.table("weekly_cases").find();
      mcqs = Database.table("mcqs").find();
      mcqTests = Database.table("mcq_tests").find();
    }

    // Determine unlocked item IDs
    const unlockedSet = new Set();

    // From student record
    if (student?.unlockedItemIds) {
      student.unlockedItemIds.forEach((id) => unlockedSet.add(id));
    }

    // From active subscriptions
    subscriptions.forEach((sub) => {
      if (sub.productId) unlockedSet.add(String(sub.productId));
      if (sub.itemId) unlockedSet.add(String(sub.itemId));
      if (sub.item) unlockedSet.add(String(sub.item));
      if (sub.unlockedItemIds && Array.isArray(sub.unlockedItemIds)) {
        sub.unlockedItemIds.forEach((id) => unlockedSet.add(id));
      }
      // Heuristic matches
      const itemTitle = (sub.item || "").toLowerCase();
      if (itemTitle.includes("volume 1") || itemTitle.includes("vol 1")) {
        unlockedSet.add("prod-vol1");
      }
      if (itemTitle.includes("volume 2") || itemTitle.includes("vol 2")) {
        unlockedSet.add("prod-vol2");
      }
      if (itemTitle.includes("master") || itemTitle.includes("combo") || itemTitle.includes("2-volume")) {
        unlockedSet.add("prod-vol1");
        unlockedSet.add("prod-vol2");
        unlockedSet.add("prod-combo");
      }
      if (itemTitle.includes("ca foundation") || itemTitle.includes("question bank")) {
        unlockedSet.add("course-ca-foundation-sub");
        unlockedSet.add("ca-foundation-business-laws");
        unlockedSet.add("ca-foundation");
        unlockedSet.add("prod-vol1");
      }
      if (itemTitle.includes("cseet")) {
        unlockedSet.add("course-cseet-sub");
        unlockedSet.add("cseet-business-law");
        unlockedSet.add("cseet-management");
        unlockedSet.add("cseet");
        unlockedSet.add("prod-vol2");
      }
    });

    const finalUnlockedIds = Array.from(unlockedSet);

    res.status(200).json({
      success: true,
      source: isConnected() ? "mongodb_atlas" : "local_cache",
      student: student || null,
      hasActiveSubscription: subscriptions.length > 0 || (student && student.drm_access),
      unlockedItemIds: finalUnlockedIds,
      subscriptions,
      availableProducts: products,
      cases,
      mcqs,
      mcqTests,
      examSettings,
      qotd,
      lawXp: student?.lawXp || 150,
      streakDays: student?.streakDays || 1,
      completedUnits: student?.completedUnits || ["ca-ch1-u1", "ca-ch4-u1"],
      lastRead: student?.lastRead || {
        title: "Indian Partnership Act, 1932 (Unit 1)",
        url: "/notes/unit-1-general-nature-of-partnership.pdf",
        date: "Today",
        progress: 50,
      },
      bookmarks: student?.bookmarks || [],
    });
  } catch (err) {
    console.error("[Student API] Dashboard fetch error:", err);
    res.status(500).json({ success: false, message: "Error fetching student dashboard." });
  }
});

/**
 * POST /api/student/sync-progress
 * Requires authentication. Updates progress strictly for the authenticated student.
 */
router.post("/sync-progress", requireAuth, async (req, res) => {
  try {
    const { xpGained, xpTotal, completedUnits, lastRead, streakDays, bookmarks } = req.body;
    const targetUserId = req.user.id;
    const targetEmail = req.user.email ? String(req.user.email).toLowerCase().trim() : null;

    if (isConnected()) {
      const updateData = {};
      if (typeof xpTotal === "number") updateData.lawXp = xpTotal;
      else if (typeof xpGained === "number") updateData.$inc = { lawXp: xpGained };
      if (completedUnits && Array.isArray(completedUnits)) updateData.completedUnits = completedUnits;
      if (lastRead && typeof lastRead === "object") updateData.lastRead = lastRead;
      if (typeof streakDays === "number") updateData.streakDays = streakDays;
      if (bookmarks && Array.isArray(bookmarks)) updateData.bookmarks = bookmarks;

      const updatedUser = await User.findOneAndUpdate(
        {
          $or: [
            ...(targetEmail ? [{ email: targetEmail }] : []),
            ...(targetUserId ? [{ id: targetUserId }] : []),
          ],
        },
        updateData,
        { new: true }
      ).select("-password_hash");

      return res.status(200).json({
        success: true,
        source: "mongodb_atlas",
        student: updatedUser,
        lawXp: updatedUser?.lawXp || 0,
      });
    }

    res.status(200).json({
      success: true,
      source: "local_cache",
      lawXp: xpTotal || 150,
    });
  } catch (err) {
    console.error("[Student API] Sync progress error:", err);
    res.status(500).json({ success: false, message: "Error updating student progress." });
  }
});

module.exports = router;
