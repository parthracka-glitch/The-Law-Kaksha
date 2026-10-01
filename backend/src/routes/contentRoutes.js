/**
 * The Law Kaksha - Protected Content & Subscription Entitlement Routes
 */

const express = require("express");
const Database = require("../db/database");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/content/:contentId/access — Subscription entitlement check for notes and materials
router.get("/content/:contentId/access", requireAuth, (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.user.id;

    const contentTable = Database.table("content");
    const subscriptionsTable = Database.table("subscriptions");

    const item = contentTable.findById(contentId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Requested material does not exist.",
      });
    }

    // Free sample items are accessible by all authenticated users
    if (item.isSample) {
      return res.status(200).json({
        success: true,
        message: "Sample material access granted.",
        content: item,
      });
    }

    // Check for active subscription for the course
    const activeSub = subscriptionsTable.findOne(
      (s) => s.userId === userId && s.courseId === item.courseId && s.status === "ACTIVE"
    );

    if (!activeSub && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "SUBSCRIPTION_REQUIRED",
        message: "Active subscription required for this course material.",
        courseId: item.courseId,
      });
    }

    // Watermark metadata
    const watermark = {
      studentName: req.user.name,
      studentId: req.user.student_id,
      email: req.user.email,
      timestamp: new Date().toISOString(),
      watermarkText: `${req.user.name} • ${req.user.student_id} • Licensed to ${req.user.email}`,
    };

    return res.status(200).json({
      success: true,
      message: "Access granted.",
      content: item,
      subscription: activeSub,
      watermark,
    });
  } catch (err) {
    console.error("[Content] Access verification error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

module.exports = router;
