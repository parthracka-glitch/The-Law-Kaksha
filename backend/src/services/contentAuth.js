/**
 * The Law Kaksha — Centralized Zero-Trust Content Authorization Gate
 * Phase P3: Default-Deny Access Enforcement
 */

const Database = require("../db/database");
const Entitlement = require("../models/Entitlement");
const Subscription = require("../models/Subscription");
const Course = require("../models/Course");
const Act = require("../models/Act");
const Unit = require("../models/Unit");
const { isConnected } = require("../db/mongo");

/**
 * Authorize a user's request to access a specific ContentItem (or legacy Resource)
 * @param {Object|null} user - Decoded JWT user object from request
 * @param {Object} contentItem - The content item or resource being requested
 * @param {Object} options - { isSampleRequest: boolean }
 * @returns {Promise<{ allowed: boolean, reason?: string, entitlement?: Object, isSample?: boolean, isAdmin?: boolean }>}
 */
async function authorizeContentAccess(user, contentItem, options = {}) {
  // 1. Validate content item existence
  if (!contentItem) {
    return { allowed: false, reason: "NOT_FOUND" };
  }

  // 2. Free Sample Access (unauthenticated or sample query)
  if (options.isSampleRequest || contentItem.isSample) {
    return { allowed: true, isSample: true };
  }

  // 3. User Authentication Check
  if (!user) {
    return { allowed: false, reason: "NO_LOGIN" };
  }

  // 4. Administrator Override
  if (user.role === "admin") {
    return { allowed: true, isAdmin: true };
  }

  // 5. DRM Block Check
  if (user.drm_access === false) {
    return { allowed: false, reason: "DRM_BLOCKED" };
  }

  // 6. Resolve Course Hierarchy to check "coming_soon" status
  let courseId = contentItem.courseId || null;
  let isComingSoon = false;

  if (contentItem.unitId) {
    // Resolve Unit -> Act -> Course
    let unit = null;
    let act = null;
    let course = null;

    if (isConnected()) {
      unit = await Unit.findOne({ id: contentItem.unitId }).lean();
      if (unit && unit.actId) {
        act = await Act.findOne({ id: unit.actId }).lean();
      }
      if (act && act.courseId) {
        courseId = act.courseId;
        course = await Course.findOne({ id: act.courseId }).lean();
      }
    } else {
      const unitsTable = Database.table("units");
      const actsTable = Database.table("acts");
      const coursesTable = Database.table("courses");

      unit = unitsTable.findOne((u) => u.id === contentItem.unitId);
      if (unit && unit.actId) {
        act = actsTable.findOne((a) => a.id === unit.actId);
      }
      if (act && act.courseId) {
        courseId = act.courseId;
        course = coursesTable.findOne((c) => c.id === act.courseId);
      }
    }

    if (act && act.availability === "coming_soon") {
      isComingSoon = true;
    }
    if (course && course.availability === "coming_soon") {
      isComingSoon = true;
    }
  }

  // If item or course is Coming Soon, block non-admin access
  if (isComingSoon) {
    return { allowed: false, reason: "COMING_SOON" };
  }

  // Published check
  if (contentItem.isPublished === false) {
    return { allowed: false, reason: "NOT_PUBLISHED" };
  }

  // Fallback courseId if not resolved from Unit
  if (!courseId) {
    courseId = contentItem.course || "course-ca-foundation";
  }

  // Normalize course IDs (ca-foundation vs course-ca-foundation vs course-ca-qbank)
  const normalizedCourseIds = [courseId];
  const cLower = String(courseId || "").toLowerCase();
  if (cLower.includes("qbank") || cLower.includes("question-bank")) {
    normalizedCourseIds.push(
      "course-ca-qbank",
      "ca-foundation-qbank",
      "ca-qbank",
      "sub-ca-qbank",
      "ca-foundation-smart-revision-question-bank",
      "smart-revision-question-bank"
    );
  } else if (cLower.includes("ca") || cLower.includes("foundation")) {
    normalizedCourseIds.push(
      "course-ca-foundation",
      "ca-foundation",
      "ca-foundation-paper-2",
      "course-ca-foundation-sub",
      "ca-foundation-business-laws",
      "prod-vol1",
      "book-vol-1",
      "prod-combo",
      "all-access"
    );
  }
  if (cLower.includes("cs") || cLower.includes("cseet")) {
    normalizedCourseIds.push(
      "course-cseet",
      "cseet",
      "cseet-business-laws-management",
      "cseet-business-communication",
      "course-cseet-sub",
      "prod-vol2",
      "book-vol-2",
      "prod-combo",
      "all-access"
    );
  }

  const userId = user.id || user._id || user.student_id;
  const userEmail = (user.email || "").toLowerCase().trim();
  const studentRoll = user.student_id || user.studentRoll;
  const now = new Date();

  // 7. Check Entitlements (P2/P4 model)
  if (isConnected()) {
    try {
      const entitlements = await Entitlement.find({
        $or: [
          ...(userId ? [{ user_id: userId }] : []),
          ...(userEmail ? [{ user_email: userEmail }] : []),
          ...(studentRoll ? [{ student_id: studentRoll }] : []),
        ],
        courseId: { $in: normalizedCourseIds },
      }).sort({ expires_at: -1 }).lean();

      if (entitlements && entitlements.length > 0) {
        const activeEntitlement = entitlements.find(
          (e) => e.status === "active" && new Date(e.expires_at) > now
        );
        if (activeEntitlement) {
          return { allowed: true, entitlement: activeEntitlement };
        }
        // Found entitlement but it expired
        return { allowed: false, reason: "EXPIRED" };
      }
    } catch (e) {
      console.warn("[ContentAuth] Error querying Mongo Entitlements:", e.message);
    }

    // Check Subscriptions in MongoDB
    try {
      const subs = await Subscription.find({
        $or: [
          ...(userId ? [{ userId }] : []),
          ...(userEmail ? [{ email: userEmail }] : []),
          ...(studentRoll ? [{ studentRoll }] : []),
        ],
      }).lean();

      if (subs && subs.length > 0) {
        const active = subs.find((s) => s.status === "ACTIVE" || s.accessStatus === "Active");
        if (active) {
          return { allowed: true, subscription: active };
        }
        return { allowed: false, reason: "EXPIRED" };
      }
    } catch (_) {}
  } else {
    // Local JSON Database Check
    const entitlementsTable = Database.table("entitlements");
    const userEntitlements = entitlementsTable.find(
      (e) =>
        (e.user_id === userId || (userEmail && e.user_email === userEmail) || (studentRoll && e.student_id === studentRoll)) &&
        normalizedCourseIds.includes(e.courseId)
    );

    if (userEntitlements && userEntitlements.length > 0) {
      const active = userEntitlements.find(
        (e) => e.status === "active" && new Date(e.expires_at) > now
      );
      if (active) {
        return { allowed: true, entitlement: active };
      }
      return { allowed: false, reason: "EXPIRED" };
    }

    // Check legacy Subscriptions table
    const subsTable = Database.table("subscriptions");
    const userSubs = subsTable.find(
      (s) =>
        s.userId === userId || (userEmail && s.email === userEmail) || (studentRoll && s.studentRoll === studentRoll)
    );

    if (userSubs && userSubs.length > 0) {
      const active = userSubs.find((s) => s.status === "ACTIVE" || s.accessStatus === "Active");
      if (active) {
        return { allowed: true, subscription: active };
      }
      return { allowed: false, reason: "EXPIRED" };
    }
  }

  // 8. If unlockedItemIds contains this item ID directly
  if (user.unlockedItemIds && Array.isArray(user.unlockedItemIds) && user.unlockedItemIds.includes(contentItem.id)) {
    return { allowed: true };
  }

  return { allowed: false, reason: "NO_ACCESS" };
}

module.exports = {
  authorizeContentAccess,
};
