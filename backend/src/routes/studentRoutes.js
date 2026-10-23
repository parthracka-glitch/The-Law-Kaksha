/**
 * The Law Kaksha - Student API Routes with MongoDB Atlas
 * Connects the Student Dashboard with MongoDB Atlas
 * Accurately determines course purchases, unlocked DRM codices, and live learning resources
 */

const express = require("express");
const User = require("../models/User");
const Subscription = require("../models/Subscription");
const Product = require("../models/Product");
const Resource = require("../models/Resource");
const WeeklyCase = require("../models/WeeklyCase");
const McqQuestion = require("../models/McqQuestion");
const McqTest = require("../models/McqTest");
const SiteSetting = require("../models/SiteSetting");
const Course = require("../models/Course");
const Act = require("../models/Act");
const Unit = require("../models/Unit");
const ContentItem = require("../models/ContentItem");
const Entitlement = require("../models/Entitlement");
const SupportTicket = require("../models/SupportTicket");
const { isConnected } = require("../db/mongo");
const Database = require("../db/database");
const { requireAuth } = require("../middleware/authMiddleware");
const { serializeProduct, serializeResource } = require("../utils/responseSerializer");

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
    let resources = [];
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
      [products, cases, mcqs, mcqTests, resources] = await Promise.all([
        Product.find({ status: "Active" }).lean(),
        WeeklyCase.find().sort({ createdAt: 1 }).lean(),
        McqQuestion.find().sort({ createdAt: 1 }).lean(),
        McqTest.find({ status: "Active" }).sort({ createdAt: -1 }).lean(),
        Resource.find({ status: "Published" }).sort({ chapterNumber: 1, order: 1 }).lean(),
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
      resources = Database.table("resources").find();
    }

    // Determine unlocked item IDs
    const unlockedSet = new Set();

    // From student record
    if (student?.unlockedItemIds) {
      student.unlockedItemIds.forEach((id) => unlockedSet.add(id));
    }

    // From active entitlements
    if (isConnected()) {
      try {
        const ents = await Entitlement.find({
          $or: [
            ...(student?.id ? [{ user_id: student.id }] : []),
            ...(email ? [{ user_email: email }] : []),
            ...(studentId ? [{ student_id: studentId }] : []),
          ],
          status: "active",
          expires_at: { $gt: new Date() },
        }).lean();
        ents.forEach((e) => {
          if (e.course_id) unlockedSet.add(e.course_id);
          if (e.courseId) unlockedSet.add(e.courseId);
          if (e.item_id) unlockedSet.add(e.item_id);
        });
      } catch (_) {}
    } else {
      try {
        const ents = Database.table("entitlements").find(
          (e) =>
            ((student?.id && e.user_id === student.id) ||
              (email && e.user_email === email) ||
              (studentId && e.student_id === studentId)) &&
            e.status === "active" &&
            (!e.expires_at || new Date(e.expires_at) > new Date())
        );
        ents.forEach((e) => {
          if (e.course_id) unlockedSet.add(e.course_id);
          if (e.courseId) unlockedSet.add(e.courseId);
          if (e.item_id) unlockedSet.add(e.item_id);
        });
      } catch (_) {}
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
      hasActiveSubscription: subscriptions.length > 0 || finalUnlockedIds.length > 0,
      unlockedItemIds: finalUnlockedIds,
      subscriptions,
      availableProducts: products.map(serializeProduct),
      resources: resources.map((r) => serializeResource(r)),
      cases,
      mcqs,
      mcqTests,
      examSettings,
      lawXp: typeof student?.lawXp === "number" ? student.lawXp : 0,
      streakDays: typeof student?.streakDays === "number" ? student.streakDays : 0,
      longest_streak: typeof student?.longest_streak === "number" ? student.longest_streak : (typeof student?.streakDays === "number" ? student.streakDays : 0),
      completedUnits: Array.isArray(student?.completedUnits) ? student.completedUnits : [],
      lastRead: student?.lastRead || null,
      bookmarks: Array.isArray(student?.bookmarks) ? student.bookmarks : [],
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
      lawXp: typeof xpTotal === "number" ? xpTotal : 0,
    });
  } catch (err) {
    console.error("[Student API] Sync progress error:", err);
    res.status(500).json({ success: false, message: "Error updating student progress." });
  }
});

/**
 * GET /api/student/cart
 * Returns saved cart items for authenticated student
 */
router.get("/cart", requireAuth, async (req, res) => {
  try {
    const email = req.user.email ? String(req.user.email).toLowerCase().trim() : null;
    const studentId = req.user.id || req.user.student_id;
    let userDoc = null;
    if (isConnected() && (email || studentId)) {
      userDoc = await User.findOne({
        $or: [
          ...(email ? [{ email }] : []),
          ...(studentId ? [{ id: studentId }, { student_id: studentId }] : []),
        ],
      }).lean();
    } else if (email || studentId) {
      userDoc = Database.table("users").findOne(
        (u) => (email && u.email === email) || (studentId && (u.id === studentId || u.student_id === studentId))
      );
    }
    const items = Array.isArray(userDoc?.cart_items) ? userDoc.cart_items : [];
    return res.status(200).json({ success: true, items });
  } catch (err) {
    console.error("[Student API] Get cart error:", err);
    return res.status(500).json({ success: false, items: [], message: "Error fetching cart." });
  }
});

/**
 * POST /api/student/cart
 * Persists cart items for authenticated student
 */
router.post("/cart", requireAuth, async (req, res) => {
  try {
    const email = req.user.email ? String(req.user.email).toLowerCase().trim() : null;
    const studentId = req.user.id || req.user.student_id;
    const items = Array.isArray(req.body.items) ? req.body.items : [];

    if (isConnected() && (email || studentId)) {
      await User.updateOne(
        {
          $or: [
            ...(email ? [{ email }] : []),
            ...(studentId ? [{ id: studentId }, { student_id: studentId }] : []),
          ],
        },
        { $set: { cart_items: items } }
      );
    }

    const usersTable = Database.table("users");
    const localUser = usersTable.findOne(
      (u) => (email && u.email === email) || (studentId && (u.id === studentId || u.student_id === studentId))
    );
    if (localUser) {
      usersTable.update(localUser.id, { cart_items: items });
    }

    return res.status(200).json({ success: true, count: items.length });
  } catch (err) {
    console.error("[Student API] Save cart error:", err);
    return res.status(500).json({ success: false, message: "Error saving cart." });
  }
});

// ==========================================
// SURFACE C SPECIFIC MODULES (§9 & §10)
// ==========================================

// GET /api/student/gate — Gate check: account has >= 1 active entitlement (§2, C0)
router.get("/gate", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const email = req.user.email ? String(req.user.email).toLowerCase().trim() : "";
    const now = new Date();

    const entitlementsTable = Database.table("entitlements");
    const activeEntitlements = entitlementsTable.find((e) => {
      if (e.user_id !== userId && e.user_email !== email) return false;
      if (e.status !== "active") return false;
      if (e.expires_at && new Date(e.expires_at) < now) return false;
      return true;
    });

    let isAllowed = activeEntitlements.length > 0;

    // Check legacy subscriptions fallback
    if (!isAllowed) {
      const subsTable = Database.table("subscriptions");
      const legacySub = subsTable.findOne((s) => (s.email === email || s.studentRoll === req.user.student_id) && s.accessStatus === "Active");
      if (legacySub || req.user.drm_access) {
        isAllowed = true;
      }
    }

    res.status(200).json({
      success: true,
      allowed: isAllowed,
      hasActiveSubscription: isAllowed,
      has_active_entitlement: isAllowed,
      entitlementsCount: activeEntitlements.length,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        student_id: req.user.student_id,
        role: req.user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error checking student gate: " + err.message });
  }
});

// GET /api/student/resources — Subscribed resources with expiry badge (C1)
router.get("/resources", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const email = req.user.email ? String(req.user.email).toLowerCase().trim() : "";
    const now = new Date();

    const entitlementsTable = Database.table("entitlements");
    const activeEntitlements = entitlementsTable.find((e) => {
      if (e.user_id !== userId && e.user_email !== email) return false;
      if (e.status !== "active") return false;
      if (e.expires_at && new Date(e.expires_at) < now) return false;
      return true;
    });

    const plansTable = Database.table("subscription_plans");
    const coursesTable = Database.table("courses");
    const resourcesTable = Database.table("resources");

    const entitledCourseIds = new Set();
    const planItems = [];

    activeEntitlements.forEach((ent) => {
      if (ent.item_type === "subscription") {
        const plan = plansTable.findOne((p) => p.id === ent.item_id || p.slug === ent.item_id);
        if (plan) {
          (plan.course_ids || []).forEach((cId) => entitledCourseIds.add(cId));
          planItems.push({
            ...plan,
            expires_at: ent.expires_at,
            days_remaining: Math.max(0, Math.ceil((new Date(ent.expires_at) - now) / (1000 * 60 * 60 * 24))),
          });
        }
      } else if (ent.item_type === "extra_course" || ent.item_type === "course") {
        entitledCourseIds.add(ent.item_id);
      }
    });

    // Fallback: If student has drm_access, default to core courses
    if (entitledCourseIds.size === 0 && (req.user.drm_access || req.user.role === "admin")) {
      entitledCourseIds.add("course-ca-foundation");
      entitledCourseIds.add("course-cseet");
    }

    const availableCourses = coursesTable.find((c) => entitledCourseIds.has(c.id));
    const availableResources = resourcesTable.find((r) => entitledCourseIds.has(r.course_id) || entitledCourseIds.has(r.course));

    res.status(200).json({
      success: true,
      subscriptions: planItems,
      courses: availableCourses,
      resources: availableResources,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching student resources: " + err.message });
  }
});

// GET /api/student/explore — Other resources available to buy (C2)
router.get("/explore", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const email = req.user.email ? String(req.user.email).toLowerCase().trim() : "";
    const now = new Date();

    const entitlementsTable = Database.table("entitlements");
    const activeItemIds = new Set(
      entitlementsTable
        .find((e) => (e.user_id === userId || e.user_email === email) && e.status === "active" && new Date(e.expires_at) >= now)
        .map((e) => e.item_id)
    );

    const coursesTable = Database.table("courses");
    const plansTable = Database.table("subscription_plans");

    // Unowned extra courses
    const extraCourses = coursesTable
      .find((c) => c.kind === "extra" && c.is_active !== false && !activeItemIds.has(c.id))
      .map((c) => ({ ...c, item_type: "extra_course" }));

    // Unowned subscription plans
    const subscriptions = plansTable
      .find((p) => p.is_active !== false && !activeItemIds.has(p.id) && !activeItemIds.has(p.slug))
      .map((p) => ({ ...p, item_type: "subscription" }));

    res.status(200).json({
      success: true,
      exploreItems: [...extraCourses, ...subscriptions],
      extraCourses,
      subscriptions,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching explore carousel items: " + err.message });
  }
});

// GET /api/student/calendar — Live sessions, subscription expiries, streak days (C4)
router.get("/calendar", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const email = req.user.email ? String(req.user.email).toLowerCase().trim() : "";

    const sessions = [];

    const entitlementsTable = Database.table("entitlements");
    const expiries = entitlementsTable
      .find((e) => (e.user_id === userId || e.user_email === email) && e.status === "active")
      .map((e) => ({
        id: `exp-${e.id}`,
        title: `Access Expiry (${e.item_type})`,
        date: e.expires_at,
        type: "expiry",
      }));

    const userStatsTable = Database.table("user_stats");
    const stats = userStatsTable.findOne((u) => u.user_id === userId);

    res.status(200).json({
      success: true,
      sessions,
      expiries,
      streakDays: stats && typeof stats.current_streak === "number" ? stats.current_streak : 0,
      lastActiveDate: stats ? stats.last_active_date : "",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching student calendar: " + err.message });
  }
});

// GET /api/student/case-studies — Case studies for student dashboard (C7)
router.get("/case-studies", requireAuth, async (req, res) => {
  try {
    const caseStudiesTable = Database.table("case_studies");
    const caseStudies = caseStudiesTable.find((c) => c.is_published !== false && c.show_on_dashboard !== false);
    res.status(200).json({ success: true, count: caseStudies.length, caseStudies });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching dashboard case studies: " + err.message });
  }
});

// GET /api/student/profile & PUT /api/student/profile — Profile changes (C5)
router.get("/profile", requireAuth, async (req, res) => {
  try {
    const usersTable = Database.table("users");
    const user = usersTable.findOne((u) => u.id === req.user.id) || req.user;
    res.status(200).json({
      success: true,
      profile: {
        id: user.id,
        name: user.name,
        email: user.email, // read-only per §9 C5
        phone: user.phone || "",
        city: user.city || "",
        state: user.state || "",
        avatar_url: user.avatar_url || user.picture || "",
        student_id: user.student_id,
        role: user.role,
        joined_date: user.joined_date || user.created_at,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching profile: " + err.message });
  }
});

router.put("/profile", requireAuth, async (req, res) => {
  try {
    const { name, phone, city, state, avatar_url } = req.body;
    const usersTable = Database.table("users");
    const updates = {};
    if (name) updates.name = String(name).trim();
    if (phone !== undefined) updates.phone = String(phone).trim();
    if (city !== undefined) updates.city = String(city).trim();
    if (state !== undefined) updates.state = String(state).trim();
    if (avatar_url !== undefined) {
      updates.avatar_url = avatar_url;
      updates.picture = avatar_url;
    }

    const updated = usersTable.update(req.user.id, updates);

    if (isConnected()) {
      try {
        await User.findOneAndUpdate({ id: req.user.id }, updates);
      } catch (_) {}
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      profile: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating profile: " + err.message });
  }
});

// GET /api/student/refer — Refer & earn stats and code (C6, §10.6)
router.get("/refer", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const usersTable = Database.table("users");
    let user = usersTable.findOne((u) => u.id === userId);

    if (!user.referral_code) {
      const randomCode = `LK-${(user.name || "REF").slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      usersTable.update(userId, { referral_code: randomCode });
      user.referral_code = randomCode;
    }

    const referralsTable = Database.table("referrals");
    const referrals = referralsTable.find((r) => r.referrer_user_id === userId);

    const qualifiedCount = referrals.filter((r) => r.status === "qualified" || r.status === "rewarded").length;
    const pendingCount = referrals.filter((r) => r.status === "pending").length;

    res.status(200).json({
      success: true,
      referralCode: user.referral_code,
      referralLink: `https://thelawkaksha.com?ref=${user.referral_code}`,
      stats: {
        totalInvites: referrals.length,
        qualified: qualifiedCount,
        pending: pendingCount,
        rewardPoints: qualifiedCount * 50,
      },
      referrals,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching referral details: " + err.message });
  }
});

// POST /api/student/activity — Record streak & XP event (C3, §10.5)
router.post("/activity", requireAuth, async (req, res) => {
  try {
    const { actionType, refId } = req.body; // daily_checkin, resource_completed, live_session
    const userId = req.user.id;

    // XP configuration defaults per §10.5
    const XP_MAP = {
      daily_checkin: 5,
      resource_completed: 10,
      live_session: 20,
      streak_milestone: 50,
    };

    const points = XP_MAP[actionType] || 5;
    const todayStr = new Date().toISOString().split("T")[0];

    const statsTable = Database.table("user_stats");
    let stats = statsTable.findOne((s) => s.user_id === userId);

    if (!stats) {
      stats = statsTable.insert({
        id: `stat-${userId}`,
        user_id: userId,
        xp_total: 0,
        current_streak: 1,
        longest_streak: 1,
        last_active_date: todayStr,
        events: [],
      });
    }

    const lastActive = stats.last_active_date;
    let newStreak = stats.current_streak;

    if (lastActive !== todayStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (lastActive === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1; // reset streak after missed day per §10.5
      }
    }

    const newXp = (stats.xp_total || 0) + points;
    const longest = Math.max(stats.longest_streak || 1, newStreak);

    statsTable.update(stats.id, {
      xp_total: newXp,
      current_streak: newStreak,
      longest_streak: longest,
      last_active_date: todayStr,
    });

    const xpEventsTable = Database.table("xp_events");
    xpEventsTable.insert({
      id: `xp-${Date.now()}`,
      user_id: userId,
      type: actionType,
      points,
      ref_type: actionType,
      ref_id: refId || "",
    });

    res.status(200).json({
      success: true,
      currentStreak: newStreak,
      longestStreak: longest,
      totalXp: newXp,
      pointsEarned: points,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating activity: " + err.message });
  }
});

// GET /api/student/checkout-item/:itemType/:itemId — Direct Buy Now helper (§3.2, C2)
router.get("/checkout-item/:itemType/:itemId", requireAuth, async (req, res) => {
  try {
    const { itemType, itemId } = req.params;
    let item = null;

    if (itemType === "subscription") {
      const plansTable = Database.table("subscription_plans");
      item = plansTable.findOne((p) => p.id === itemId || p.slug === itemId);
    } else {
      const coursesTable = Database.table("courses");
      item = coursesTable.findOne((c) => c.id === itemId || c.slug === itemId);
    }

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    const usersTable = Database.table("users");
    const user = usersTable.findOne((u) => u.id === req.user.id) || req.user;

    res.status(200).json({
      success: true,
      item: {
        id: item.id,
        title: item.title,
        price: item.price,
        mrp: item.mrp || item.originalPrice || 299,
        thumbnail: item.thumbnail,
        item_type: itemType,
      },
      prefilledDetails: {
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        city: user.city || "",
        state: user.state || "",
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching item for direct checkout: " + err.message });
  }
});
/**
 * GET /api/student/check-enrollment
 * Verifies if an email or authenticated student has an active course purchase
 */
router.get("/check-enrollment", async (req, res) => {
  try {
    let email = req.query.email ? String(req.query.email).toLowerCase().trim() : null;
    let studentId = req.query.studentId ? String(req.query.studentId).trim() : null;

    // Check token if provided in header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const jwt = require("jsonwebtoken");
        const { JWT_SECRET } = require("../middleware/authMiddleware");
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded) {
          if (!email && decoded.email) email = decoded.email.toLowerCase().trim();
          if (!studentId && decoded.student_id) studentId = decoded.student_id;
          if (decoded.role === "admin") {
            return res.status(200).json({
              success: true,
              hasPurchasedCourse: true,
              role: "admin",
              message: "Administrator access granted.",
            });
          }
        }
      } catch (e) {}
    }

    if (!email && !studentId) {
      return res.status(400).json({
        success: false,
        hasPurchasedCourse: false,
        message: "Student email or Roll ID is required to verify enrollment.",
      });
    }

    let hasPurchased = false;
    let enrolledItems = [];

    if (isConnected()) {
      const Order = require("../models/Order");
      const User = require("../models/User");
      const Subscription = require("../models/Subscription");

      const [user, sub, paidOrder] = await Promise.all([
        User.findOne({
          $or: [
            ...(email ? [{ email }] : []),
            ...(studentId ? [{ student_id: studentId }, { id: studentId }] : []),
          ],
        }).lean(),
        Subscription.findOne({
          $or: [
            ...(email ? [{ email }] : []),
            ...(studentId ? [{ studentRoll: studentId }] : []),
          ],
          accessStatus: "Active",
        }).lean(),
        Order.find({
          $or: [
            ...(email ? [{ "personal_details.email": email }, { userEmail: email }] : []),
            ...(studentId ? [{ studentId }, { user_id: studentId }] : []),
          ],
          status: { $in: ["paid", "COMPLETED"] },
        }).lean(),
      ]);

      if (user?.role === "admin" || sub || (paidOrder && (Array.isArray(paidOrder) ? paidOrder.length > 0 : true))) {
        hasPurchased = true;
      }
      if (user?.unlockedItemIds && user.unlockedItemIds.length > 0) {
        hasPurchased = true;
        enrolledItems.push(...user.unlockedItemIds);
      }
      if (user?.enrolled_books && user.enrolled_books.length > 0) {
        hasPurchased = true;
        enrolledItems.push(...user.enrolled_books);
      }
      if (sub?.item) {
        enrolledItems.push(sub.item);
      }
      if (paidOrder) {
        const orderList = Array.isArray(paidOrder) ? paidOrder : [paidOrder];
        orderList.forEach((o) => {
          if (Array.isArray(o.items)) {
            o.items.forEach((i) => {
              if (i.id) enrolledItems.push(i.id);
              if (i.itemId) enrolledItems.push(i.itemId);
              if (i.title) enrolledItems.push(i.title);
              if (i.category) enrolledItems.push(i.category);
            });
          }
        });
      }
    } else {
      const usersTable = Database.table("users");
      const subsTable = Database.table("subscriptions");
      const ordersTable = Database.table("orders");

      const user = usersTable.findOne(
        (u) => (email && u.email === email) || (studentId && (u.student_id === studentId || u.id === studentId))
      );
      const sub = subsTable.findOne(
        (s) => ((email && s.email === email) || (studentId && s.studentRoll === studentId)) && s.accessStatus === "Active"
      );
      const paidOrders = ordersTable.find(
        (o) =>
          ((email && (o.userEmail === email || o.personal_details?.email === email)) ||
            (studentId && (o.studentId === studentId || o.user_id === studentId))) &&
          (o.status === "paid" || o.status === "COMPLETED")
      ) || [];

      if (user?.role === "admin" || sub || paidOrders.length > 0) {
        hasPurchased = true;
      }
      if (user?.unlockedItemIds && user.unlockedItemIds.length > 0) {
        hasPurchased = true;
        enrolledItems.push(...user.unlockedItemIds);
      }
      if (paidOrders.length > 0) {
        paidOrders.forEach((o) => {
          if (Array.isArray(o.items)) {
            o.items.forEach((i) => {
              if (i.id) enrolledItems.push(i.id);
              if (i.itemId) enrolledItems.push(i.itemId);
              if (i.title) enrolledItems.push(i.title);
            });
          }
        });
      }
    }

    return res.status(200).json({
      success: true,
      hasPurchasedCourse: hasPurchased,
      enrolledItems: Array.from(new Set(enrolledItems)),
      message: hasPurchased
        ? "Active enrollment verified."
        : "No active course purchase found for this account.",
    });
  } catch (err) {
    console.error("[check-enrollment] Error:", err);
    return res.status(500).json({ success: false, hasPurchasedCourse: false, message: "Error verifying enrollment." });
  }
});

/**
 * GET /api/student/my-courses
 * Returns the student's enrolled courses with hierarchical Course -> Act -> Unit -> ContentItem.
 * Coming-soon acts are flagged with isComingSoon: true so they can be badged and locked in the UI.
 */
router.get("/my-courses", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id || req.user.student_id;
    const email = req.user.email ? String(req.user.email).toLowerCase().trim() : "";
    const studentId = req.user.student_id ? String(req.user.student_id).trim() : "";
    const isAdmin = req.user.role === "admin";

    let activeCourseIds = new Set();
    if (isAdmin) {
      activeCourseIds.add("*"); // Admin has access to all courses
    }

    if (isConnected()) {
      // Find active entitlements
      const entitlements = await Entitlement.find({
        $or: [
          ...(userId ? [{ user_id: userId }] : []),
          ...(email ? [{ user_email: email }] : []),
          ...(studentId ? [{ student_id: studentId }] : []),
        ],
        status: "active",
        expires_at: { $gt: new Date() },
      }).lean();

      entitlements.forEach((e) => {
        if (e.course_id) activeCourseIds.add(e.course_id);
        if (e.courseId) activeCourseIds.add(e.courseId);
        const cId = String(e.course_id || e.courseId || "").toLowerCase();
        if (cId.includes("ca") || cId.includes("foundation")) {
          activeCourseIds.add("ca-foundation");
          activeCourseIds.add("course-ca-foundation");
        }
        if (cId.includes("cseet")) {
          activeCourseIds.add("cseet-business-communication");
          activeCourseIds.add("course-cseet");
          activeCourseIds.add("cseet");
        }
      });

      // Also check subscriptions
      const subs = await Subscription.find({
        $or: [
          ...(email ? [{ email }] : []),
          ...(studentId ? [{ studentRoll: studentId }] : []),
        ],
        accessStatus: "Active",
      }).lean();

      subs.forEach((s) => {
        if (s.productId) activeCourseIds.add(s.productId);
        if (s.itemId) activeCourseIds.add(s.itemId);
        const title = (s.item || "").toLowerCase();
        if (title.includes("ca foundation") || title.includes("vol 1")) {
          activeCourseIds.add("ca-foundation");
          activeCourseIds.add("course-ca-foundation");
        }
        if (title.includes("cseet") || title.includes("vol 2")) {
          activeCourseIds.add("cseet-business-communication");
          activeCourseIds.add("course-cseet");
          activeCourseIds.add("cseet");
        }
      });

      // Check student user unlockedItemIds
      const studentUser = await User.findOne({
        $or: [
          ...(userId ? [{ id: userId }, { _id: userId }] : []),
          ...(email ? [{ email }] : []),
          ...(studentId ? [{ student_id: studentId }] : []),
        ],
      }).lean();

      if (studentUser && Array.isArray(studentUser.unlockedItemIds)) {
        studentUser.unlockedItemIds.forEach((id) => {
          const lower = String(id).toLowerCase();
          if (lower.includes("ca") || lower.includes("foundation") || lower.includes("vol1")) {
            activeCourseIds.add("ca-foundation");
            activeCourseIds.add("course-ca-foundation");
          }
          if (lower.includes("cseet") || lower.includes("vol2")) {
            activeCourseIds.add("cseet-business-communication");
            activeCourseIds.add("course-cseet");
            activeCourseIds.add("cseet");
          }
        });
      }

      // Fetch all courses sorted by curriculum order
      const allCourses = await Course.find({ is_active: { $ne: false } }).sort({ order: 1, display_order: 1 }).lean();
      const allActs = await Act.find().sort({ order: 1 }).lean();
      const allUnits = await Unit.find().sort({ order: 1 }).lean();
      const allItems = await ContentItem.find({ isPublished: { $ne: false } }).sort({ order: 1 }).lean();

      const enrolledCourses = allCourses
        .map((course) => {
          const isEnrolled = activeCourseIds.has("*") || activeCourseIds.has(course.id) || activeCourseIds.has(String(course._id));
          const acts = allActs
            .filter((a) => a.courseId === course.id)
            .map((act) => {
              const units = allUnits
                .filter((u) => u.actId === act.id)
                .map((unit) => {
                  const contentItems = allItems
                    .filter((item) => item.unitId === unit.id)
                    .map((item) => ({
                      id: item.id,
                      title: item.title,
                      contentType: item.contentType || item.type || "notes",
                      description: item.description,
                      duration: item.duration || "",
                      pages: item.pages || item.fileName || "",
                      fileUrl: `/api/content/${item.id}/file`,
                      isFreeSample: Boolean(item.isFreeSample || item.isSample),
                      isLocked: !isEnrolled && !Boolean(item.isFreeSample || item.isSample),
                      samplePagesRange:
                        item.samplePagesRange ||
                        (item.sampleFromPage && item.sampleToPage
                          ? `${item.sampleFromPage}-${item.sampleToPage}`
                          : ""),
                      order: item.order,
                    }));
                  return {
                    id: unit.id,
                    title: unit.title,
                    order: unit.order,
                    contentItems,
                  };
                });
              return {
                id: act.id,
                title: act.title,
                order: act.order,
                isComingSoon: Boolean(act.isComingSoon || act.availability === "coming_soon"),
                units,
              };
            });
          return {
            id: course.id,
            title: course.title,
            description: course.description,
            price: course.price,
            accessDays: course.accessDays,
            isEnrolled,
            acts,
          };
        })
        .filter((c) => (c.acts && c.acts.length > 0) || c.id === "course-ca-foundation" || c.id === "ca-foundation")
        .sort((a, b) => (b.acts?.length || 0) - (a.acts?.length || 0));

      return res.status(200).json({ success: true, courses: enrolledCourses });
    }

    // Local JSON DB fallback
    const entitlementsTable = Database.table("entitlements");
    const entitlements = entitlementsTable.find(
      (e) =>
        ((userId && e.user_id === userId) ||
          (email && e.user_email === email) ||
          (studentId && e.student_id === studentId)) &&
        e.status === "active" &&
        (!e.expires_at || new Date(e.expires_at) > new Date())
    );
    entitlements.forEach((e) => {
      if (e.course_id) activeCourseIds.add(e.course_id);
      if (e.courseId) activeCourseIds.add(e.courseId);
      const cId = String(e.course_id || e.courseId || "").toLowerCase();
      if (cId.includes("ca") || cId.includes("foundation")) {
        activeCourseIds.add("ca-foundation");
        activeCourseIds.add("course-ca-foundation");
      }
      if (cId.includes("cseet")) {
        activeCourseIds.add("cseet-business-communication");
        activeCourseIds.add("course-cseet");
        activeCourseIds.add("cseet");
      }
    });

    const subs = Database.table("subscriptions").find(
      (s) => ((email && s.email === email) || (studentId && s.studentRoll === studentId)) && s.accessStatus === "Active"
    );
    subs.forEach((s) => {
      if (s.productId) activeCourseIds.add(s.productId);
      if (s.itemId) activeCourseIds.add(s.itemId);
      const title = (s.item || "").toLowerCase();
      if (title.includes("ca foundation") || title.includes("vol 1")) {
        activeCourseIds.add("ca-foundation");
        activeCourseIds.add("course-ca-foundation");
      }
      if (title.includes("cseet") || title.includes("vol 2")) {
        activeCourseIds.add("cseet-business-communication");
        activeCourseIds.add("course-cseet");
        activeCourseIds.add("cseet");
      }
    });

    const localUser = Database.table("users").findOne(
      (u) => (userId && u.id === userId) || (email && u.email === email) || (studentId && u.student_id === studentId)
    );
    if (localUser && Array.isArray(localUser.unlockedItemIds)) {
      localUser.unlockedItemIds.forEach((id) => {
        const lower = String(id).toLowerCase();
        if (lower.includes("ca") || lower.includes("foundation") || lower.includes("vol1")) {
          activeCourseIds.add("ca-foundation");
          activeCourseIds.add("course-ca-foundation");
        }
        if (lower.includes("cseet") || lower.includes("vol2")) {
          activeCourseIds.add("cseet-business-communication");
          activeCourseIds.add("course-cseet");
          activeCourseIds.add("cseet");
        }
      });
    }

    const coursesTable = Database.table("courses");
    const actsTable = Database.table("acts");
    const unitsTable = Database.table("units");
    const itemsTable = Database.table("content_items");

    let allCourses = [];
    let allActs = [];
    let allUnits = [];
    let allItems = [];

    if (isConnected()) {
      try {
        allCourses = await Course.find({ is_active: { $ne: false } }).sort({ order: 1, display_order: 1 }).lean();
        allActs = await Act.find().sort({ order: 1 }).lean();
        allUnits = await Unit.find().sort({ order: 1 }).lean();
        allItems = await ContentItem.find({ isPublished: { $ne: false } }).sort({ order: 1 }).lean();
      } catch (err) {
        console.warn("[StudentRoutes] Atlas fetch error:", err.message);
      }
    }

    if (!allCourses || allCourses.length === 0) {
      allCourses = coursesTable
        .find((c) => c.isLive !== false && c.is_active !== false)
        .sort((a, b) => {
          const ordA = a.order ?? (a.kind === "core" ? 1 : 99);
          const ordB = b.order ?? (b.kind === "core" ? 1 : 99);
          return ordA - ordB;
        });
    }
    if (!allActs || allActs.length === 0) {
      allActs = actsTable.find();
    }
    if (!allUnits || allUnits.length === 0) {
      allUnits = unitsTable.find();
    }
    if (!allItems || allItems.length === 0) {
      allItems = itemsTable.find((i) => i.isPublished !== false && i.status !== "Draft");
    }

    const enrolledCourses = allCourses
      .map((course) => {
        const isEnrolled = activeCourseIds.has("*") || activeCourseIds.has(course.id);
        const acts = allActs
          .filter((a) => a.courseId === course.id)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((act) => {
            const units = allUnits
              .filter((u) => u.actId === act.id)
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((unit) => {
                const contentItems = allItems
                  .filter((item) => item.unitId === unit.id)
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((item) => ({
                    id: item.id,
                    title: item.title,
                    contentType: item.contentType || item.type || "notes",
                    description: item.description,
                    duration: item.duration || "",
                    pages: item.pages || item.fileName || "",
                    fileUrl: `/api/content/${item.id}/file`,
                    isFreeSample: Boolean(item.isFreeSample || item.isSample),
                    isLocked: !isEnrolled && !Boolean(item.isFreeSample || item.isSample),
                    samplePagesRange:
                      item.samplePagesRange ||
                      (item.sampleFromPage && item.sampleToPage
                        ? `${item.sampleFromPage}-${item.sampleToPage}`
                        : ""),
                    order: item.order,
                  }));
                return {
                  id: unit.id,
                  title: unit.title,
                  order: unit.order,
                  contentItems,
                };
              });
            return {
              id: act.id,
              title: act.title,
              order: act.order,
              isComingSoon: Boolean(act.isComingSoon || act.availability === "coming_soon"),
              units,
            };
          });
        return {
          id: course.id,
          title: course.title,
          description: course.description,
          price: course.price,
          accessDays: course.accessDays,
          isEnrolled,
          acts,
        };
      })
      .filter((c) => (c.acts && c.acts.length > 0) || c.id === "course-ca-foundation" || c.id === "ca-foundation")
      .sort((a, b) => (b.acts?.length || 0) - (a.acts?.length || 0));

    res.status(200).json({ success: true, courses: enrolledCourses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching my courses: " + err.message });
  }
});

/**
 * GET /api/student/progress
 * Returns unit completion stats, streak count, streak calendar info, and XP.
 */
router.get("/progress", requireAuth, async (req, res) => {
  try {
    const email = req.user.email ? String(req.user.email).toLowerCase().trim() : "";
    const studentId = req.user.student_id ? String(req.user.student_id).trim() : "";
    const userId = req.user.id || req.user._id;

    let student = null;
    if (isConnected()) {
      student = await User.findOne({
        $or: [
          ...(userId ? [{ _id: userId }] : []),
          ...(studentId ? [{ student_id: studentId }, { id: studentId }] : []),
          ...(email ? [{ email }] : []),
        ],
      }).select("-password_hash").lean();
    } else {
      const usersTable = Database.table("users");
      student = usersTable.findOne(
        (u) =>
          (userId && (u.id === userId || u._id === userId)) ||
          (studentId && (u.student_id === studentId || u.id === studentId)) ||
          (email && u.email === email)
      );
    }

    const completedUnits = Array.isArray(student?.completedUnits) ? student.completedUnits : [];
    const totalUnitsCompleted = completedUnits.length;
    const streakDays = typeof student?.streakDays === "number" ? student.streakDays : 0;
    const longestStreak = typeof student?.longest_streak === "number" ? student.longest_streak : streakDays;
    const lawXp = typeof student?.lawXp === "number" ? student.lawXp : 0;

    const todayStr = new Date().toISOString().split("T")[0];
    const hasActiveStreakToday = streakDays > 0 && student?.last_login_date === todayStr;

    res.status(200).json({
      success: true,
      totalUnitsCompleted,
      completedUnits,
      streak: streakDays,
      streakDays,
      longest_streak: longestStreak,
      lawXp,
      streakHistory: hasActiveStreakToday ? [
        { date: todayStr, active: true, xpEarned: 25 },
      ] : [],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching progress: " + err.message });
  }
});

/**
 * POST /api/student/toggle-unit-complete
 * Marks a unit as completed / incomplete.
 */
router.post("/toggle-unit-complete", requireAuth, async (req, res) => {
  try {
    const { unitId, completed } = req.body;
    if (!unitId) return res.status(400).json({ success: false, message: "unitId is required." });

    const email = req.user.email ? String(req.user.email).toLowerCase().trim() : "";
    const studentId = req.user.student_id ? String(req.user.student_id).trim() : "";
    const userId = req.user.id || req.user._id;

    if (isConnected()) {
      const student = await User.findOne({
        $or: [
          ...(userId ? [{ _id: userId }] : []),
          ...(studentId ? [{ student_id: studentId }, { id: studentId }] : []),
          ...(email ? [{ email }] : []),
        ],
      });
      if (!student) return res.status(404).json({ success: false, message: "Student record not found." });

      let currentCompleted = Array.isArray(student.completedUnits) ? [...student.completedUnits] : [];
      const isAlready = currentCompleted.includes(unitId);
      const shouldComplete = completed !== undefined ? Boolean(completed) : !isAlready;

      if (shouldComplete && !isAlready) {
        currentCompleted.push(unitId);
        student.lawXp = (student.lawXp || 100) + 20;
      } else if (!shouldComplete && isAlready) {
        currentCompleted = currentCompleted.filter((id) => id !== unitId);
      }
      student.completedUnits = currentCompleted;
      await student.save();

      return res.status(200).json({
        success: true,
        completedUnits: currentCompleted,
        totalUnitsCompleted: currentCompleted.length,
        lawXp: student.lawXp,
      });
    }

    const usersTable = Database.table("users");
    const student = usersTable.findOne(
      (u) =>
        (userId && (u.id === userId || u._id === userId)) ||
        (studentId && (u.student_id === studentId || u.id === studentId)) ||
        (email && u.email === email)
    );
    if (!student) return res.status(404).json({ success: false, message: "Student record not found." });

    let currentCompleted = Array.isArray(student.completedUnits) ? [...student.completedUnits] : [];
    const isAlready = currentCompleted.includes(unitId);
    const shouldComplete = completed !== undefined ? Boolean(completed) : !isAlready;

    if (shouldComplete && !isAlready) {
      currentCompleted.push(unitId);
      student.lawXp = (student.lawXp || 100) + 20;
    } else if (!shouldComplete && isAlready) {
      currentCompleted = currentCompleted.filter((id) => id !== unitId);
    }
    const updated = usersTable.update(student.id, {
      completedUnits: currentCompleted,
      lawXp: student.lawXp,
    });

    res.status(200).json({
      success: true,
      completedUnits: currentCompleted,
      totalUnitsCompleted: currentCompleted.length,
      lawXp: updated.lawXp || student.lawXp,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error toggling unit completion: " + err.message });
  }
});

/**
 * GET /api/student/bookmarks
 */
router.get("/bookmarks", requireAuth, async (req, res) => {
  try {
    const email = req.user.email ? String(req.user.email).toLowerCase().trim() : "";
    const studentId = req.user.student_id ? String(req.user.student_id).trim() : "";
    const userId = req.user.id || req.user._id;

    let student = null;
    if (isConnected()) {
      student = await User.findOne({
        $or: [
          ...(userId ? [{ _id: userId }] : []),
          ...(studentId ? [{ student_id: studentId }, { id: studentId }] : []),
          ...(email ? [{ email }] : []),
        ],
      }).select("bookmarks").lean();
    } else {
      const usersTable = Database.table("users");
      student = usersTable.findOne(
        (u) =>
          (userId && (u.id === userId || u._id === userId)) ||
          (studentId && (u.student_id === studentId || u.id === studentId)) ||
          (email && u.email === email)
      );
    }

    res.status(200).json({
      success: true,
      bookmarks: Array.isArray(student?.bookmarks) ? student.bookmarks : [],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching bookmarks: " + err.message });
  }
});

/**
 * POST /api/student/bookmarks
 */
router.post("/bookmarks", requireAuth, async (req, res) => {
  try {
    const { id, title, courseId, unitId, type, url } = req.body;
    if (!id || !title) return res.status(400).json({ success: false, message: "id and title are required." });

    const email = req.user.email ? String(req.user.email).toLowerCase().trim() : "";
    const studentId = req.user.student_id ? String(req.user.student_id).trim() : "";
    const userId = req.user.id || req.user._id;

    const newBookmark = {
      id,
      title,
      courseId: courseId || "",
      unitId: unitId || "",
      type: type || "notes",
      url: url || "",
      createdAt: new Date().toISOString(),
    };

    if (isConnected()) {
      const student = await User.findOne({
        $or: [
          ...(userId ? [{ _id: userId }] : []),
          ...(studentId ? [{ student_id: studentId }, { id: studentId }] : []),
          ...(email ? [{ email }] : []),
        ],
      });
      if (!student) return res.status(404).json({ success: false, message: "Student not found." });

      let bookmarks = Array.isArray(student.bookmarks) ? [...student.bookmarks] : [];
      if (!bookmarks.some((b) => b.id === id)) {
        bookmarks.push(newBookmark);
        student.bookmarks = bookmarks;
        await student.save();
      }
      return res.status(200).json({ success: true, bookmarks: student.bookmarks });
    }

    const usersTable = Database.table("users");
    const student = usersTable.findOne(
      (u) =>
        (userId && (u.id === userId || u._id === userId)) ||
        (studentId && (u.student_id === studentId || u.id === studentId)) ||
        (email && u.email === email)
    );
    if (!student) return res.status(404).json({ success: false, message: "Student not found." });

    let bookmarks = Array.isArray(student.bookmarks) ? [...student.bookmarks] : [];
    if (!bookmarks.some((b) => b.id === id)) {
      bookmarks.push(newBookmark);
      usersTable.update(student.id, { bookmarks });
    }
    res.status(200).json({ success: true, bookmarks });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding bookmark: " + err.message });
  }
});

/**
 * DELETE /api/student/bookmarks/:id
 */
router.delete("/bookmarks/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const email = req.user.email ? String(req.user.email).toLowerCase().trim() : "";
    const studentId = req.user.student_id ? String(req.user.student_id).trim() : "";
    const userId = req.user.id || req.user._id;

    if (isConnected()) {
      const student = await User.findOne({
        $or: [
          ...(userId ? [{ _id: userId }] : []),
          ...(studentId ? [{ student_id: studentId }, { id: studentId }] : []),
          ...(email ? [{ email }] : []),
        ],
      });
      if (!student) return res.status(404).json({ success: false, message: "Student not found." });

      student.bookmarks = (student.bookmarks || []).filter((b) => b.id !== id);
      await student.save();
      return res.status(200).json({ success: true, bookmarks: student.bookmarks });
    }

    const usersTable = Database.table("users");
    const student = usersTable.findOne(
      (u) =>
        (userId && (u.id === userId || u._id === userId)) ||
        (studentId && (u.student_id === studentId || u.id === studentId)) ||
        (email && u.email === email)
    );
    if (!student) return res.status(404).json({ success: false, message: "Student not found." });

    const bookmarks = (student.bookmarks || []).filter((b) => b.id !== id);
    usersTable.update(student.id, { bookmarks });
    res.status(200).json({ success: true, bookmarks });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error removing bookmark: " + err.message });
  }
});

/**
 * GET /api/student/support-tickets
 */
router.get("/support-tickets", requireAuth, async (req, res) => {
  try {
    const studentId = req.user.id || req.user.student_id || req.user._id;
    const email = req.user.email ? String(req.user.email).toLowerCase().trim() : "";

    if (isConnected()) {
      const tickets = await SupportTicket.find({
        $or: [
          ...(studentId ? [{ student_id: studentId }] : []),
          ...(email ? [{ student_email: email }] : []),
        ],
      }).sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, tickets });
    }

    const ticketsTable = Database.table("support_tickets");
    const tickets = ticketsTable.find(
      (t) => (studentId && t.student_id === studentId) || (email && t.student_email === email)
    );
    tickets.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    res.status(200).json({ success: true, tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching tickets: " + err.message });
  }
});

// Rate Limiter: Support Ticket Spam Protection (Max 20 tickets per 10 minutes per IP/student)
const ticketRateLimitMap = new Map();
const TICKET_WINDOW_MS = 10 * 60 * 1000;
const MAX_TICKETS = process.env.NODE_ENV === "test" ? 500 : 20;

function ticketRateLimiter(req, res, next) {
  const key = (req.user && (req.user.student_id || req.user.id)) || req.ip || "global";
  const now = Date.now();
  const entry = ticketRateLimitMap.get(key) || { count: 0, resetAt: now + TICKET_WINDOW_MS };

  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + TICKET_WINDOW_MS;
  } else {
    entry.count += 1;
  }
  ticketRateLimitMap.set(key, entry);

  if (entry.count > MAX_TICKETS) {
    return res.status(429).json({
      success: false,
      message: "Too many support tickets submitted. Please allow our academic team time to respond.",
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    });
  }
  next();
}

/**
 * POST /api/student/support-tickets
 */
router.post("/support-tickets", requireAuth, ticketRateLimiter, async (req, res) => {
  try {
    const { subject, message, category, priority } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ success: false, message: "Subject and message are required." });
    }

    const studentId = String(req.user.student_id || req.user.id || req.user._id);
    const studentEmail = req.user.email ? String(req.user.email).toLowerCase().trim() : "";
    const studentName = req.user.name || "Student";
    const ticketId = `tkt-${Date.now()}`;

    const newTicket = {
      id: ticketId,
      student_id: studentId,
      student_name: studentName,
      student_email: studentEmail,
      subject: String(subject).trim(),
      category: category ? String(category).trim() : "General Support",
      message: String(message).trim(),
      priority: priority || "medium",
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isConnected()) {
      const created = await SupportTicket.create(newTicket);
      return res.status(201).json({ success: true, ticket: created });
    }

    const ticketsTable = Database.table("support_tickets");
    const created = ticketsTable.insert(newTicket);
    res.status(201).json({ success: true, ticket: created });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating ticket: " + err.message });
  }
});

module.exports = router;
