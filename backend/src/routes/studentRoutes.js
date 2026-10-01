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
const SiteSetting = require("../models/SiteSetting");
const { isConnected } = require("../db/mongo");
const Database = require("../db/database");

const router = express.Router();

/**
 * GET /api/student/dashboard
 * Query: ?email=... or ?studentId=...
 * Returns student profile, active courses, unlocked DRM books, weekly cases & MCQs
 */
router.get("/dashboard", async (req, res) => {
  try {
    const email = req.query.email ? String(req.query.email).toLowerCase().trim() : null;
    const studentId = req.query.studentId ? String(req.query.studentId).trim() : null;

    let student = null;
    let subscriptions = [];
    let products = [];
    let cases = [];
    let mcqs = [];
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
      [products, cases, mcqs] = await Promise.all([
        Product.find({ status: "Active" }).lean(),
        WeeklyCase.find().sort({ createdAt: 1 }).lean(),
        McqQuestion.find().sort({ createdAt: 1 }).lean(),
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
    }

    // Determine unlocked item IDs
    const unlockedSet = new Set();

    // From student record
    if (student?.unlockedItemIds) {
      student.unlockedItemIds.forEach((id) => unlockedSet.add(id));
    }

    // From active subscriptions
    subscriptions.forEach((sub) => {
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
      if (itemTitle.includes("ca foundation")) {
        unlockedSet.add("course-ca-foundation-sub");
        unlockedSet.add("prod-vol1");
      }
      if (itemTitle.includes("cseet")) {
        unlockedSet.add("course-cseet-sub");
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
      examSettings,
      qotd,
    });
  } catch (err) {
    console.error("[Student API] Dashboard fetch error:", err);
    res.status(500).json({ success: false, message: "Error fetching student dashboard." });
  }
});

/**
 * POST /api/student/sync-purchase
 * Body: { studentData: { name, email, phone, rollNumber }, items: [...], orderId }
 * Directly provisions subscription and unlocks DRM codex in MongoDB Atlas!
 */
router.post("/sync-purchase", async (req, res) => {
  try {
    const { studentData, items, orderId, totalAmount, paymentMode } = req.body;
    if (!studentData || !studentData.email) {
      return res.status(400).json({ success: false, message: "Student data with email is required." });
    }

    const email = studentData.email.toLowerCase().trim();
    const rollNumber = studentData.rollNumber || studentData.studentId || `LRK-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const purchasedItemIds = (items || []).map((i) => i.id);

    // If master combo pass bought, include individual books too
    if (purchasedItemIds.includes("prod-combo")) {
      purchasedItemIds.push("prod-vol1", "prod-vol2");
    }

    const subId = orderId || `LK-SUB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemNames = (items || []).map((i) => i.title).join(" + ") || "Complete Study Access";

    if (isConnected()) {
      // 1. Create or Update Student User
      const updatedUser = await User.findOneAndUpdate(
        { email },
        {
          $set: {
            name: studentData.name || "Enrolled Student",
            phone: studentData.phone || "",
            target_exam: studentData.exam || "CA Foundation Paper 2: Business Laws",
            student_id: rollNumber,
            role: "student",
            is_active: true,
            drm_access: true,
          },
          $addToSet: {
            unlockedItemIds: { $each: purchasedItemIds },
            enrolled_books: { $each: (items || []).map((i) => i.title) },
          },
        },
        { upsert: true, new: true }
      ).select("-password_hash");

      // 2. Create Subscription record in Atlas
      const newSub = await Subscription.findOneAndUpdate(
        { id: subId },
        {
          id: subId,
          studentName: studentData.name || "Enrolled Student",
          studentRoll: rollNumber,
          email,
          phone: studentData.phone || "",
          item: itemNames,
          targetExam: studentData.exam || "CA Foundation Paper 2: Business Laws",
          amount: `₹${totalAmount || 449}`,
          date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
          paymentMode: paymentMode || "Instant UPI / QR Code",
          accessStatus: "Active",
          unlockedItemIds: purchasedItemIds,
        },
        { upsert: true, new: true }
      );

      return res.status(200).json({
        success: true,
        source: "mongodb_atlas",
        student: updatedUser,
        subscription: newSub,
        unlockedItemIds: updatedUser.unlockedItemIds,
      });
    }

    // Local fallback
    const usersTable = Database.table("users");
    const subsTable = Database.table("subscriptions");

    const localSub = subsTable.insert({
      id: subId,
      studentName: studentData.name,
      studentRoll: rollNumber,
      email,
      phone: studentData.phone,
      item: itemNames,
      targetExam: studentData.exam,
      amount: `₹${totalAmount || 449}`,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      paymentMode: paymentMode || "Instant UPI / QR Code",
      accessStatus: "Active",
      unlockedItemIds: purchasedItemIds,
    });

    res.status(200).json({
      success: true,
      source: "local_cache",
      subscription: localSub,
      unlockedItemIds: purchasedItemIds,
    });
  } catch (err) {
    console.error("[Student API] Sync purchase error:", err);
    res.status(500).json({ success: false, message: "Error syncing student purchase." });
  }
});

module.exports = router;
