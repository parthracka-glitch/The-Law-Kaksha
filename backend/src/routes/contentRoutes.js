/**
 * The Law Kaksha - Protected DRM Content & Entitlement Gate Routes
 */

const express = require("express");
const Database = require("../db/database");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/content/:productId/access — Server-side entitlement check for course & PDF vault
router.get("/content/:productId/access", requireAuth, (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const productsTable = Database.table("products");
    const enrollmentsTable = Database.table("enrollments");

    const product = productsTable.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Requested course or material does not exist.",
      });
    }

    // Check Entitlement in enrollments table
    const enrollment = enrollmentsTable.findOne(
      (e) =>
        e.user_id === userId &&
        e.product_id === productId &&
        e.access_status === "ACTIVE"
    );

    // If user is admin, allow preview access; otherwise must be enrolled
    if (!enrollment && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "ACCESS_DENIED",
        message:
          "Access denied. You have not purchased this course or your subscription has expired.",
        productId,
        productTitle: product.title,
      });
    }

    // Generate dynamic DRM watermark data tied to student's verified session
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
      product: {
        id: product.id,
        title: product.title,
        subtitle: product.subtitle,
        type: product.type,
        pagesOrDuration: product.pages_or_duration,
        fullFileKey: product.full_file_key,
        syllabus: product.syllabus,
      },
      watermark,
      sessionToken: `drm_${Buffer.from(`${req.user.id}:${productId}:${Date.now()}`).toString("base64")}`,
    });
  } catch (err) {
    console.error("[Content] Access verification error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

module.exports = router;
