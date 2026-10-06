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
      resources,
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

    const liveSessionsTable = Database.table("live_sessions");
    const sessions = liveSessionsTable.find((s) => s.is_active !== false);

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
      streakDays: stats ? stats.current_streak : 1,
      lastActiveDate: stats ? stats.last_active_date : new Date().toISOString().split("T")[0],
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

module.exports = router;
