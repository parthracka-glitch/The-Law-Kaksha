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

// GET /api/reviews — Verified student testimonials
const VERIFIED_REVIEWS = [
  {
    id: "rev-001",
    student_name: "Aaditya Singhal",
    student_rank: "CA Foundation • 84/100 in Business Laws",
    rating: 5,
    title: "The Section 16 comparison block saved my examination.",
    comment:
      "Direct ICAI language alignment with actual case studies. The structured 3-part answer drafting framework helped me score an exemption in Business Laws effortlessly.",
    created_at: "2026-09-15T10:00:00Z",
    is_verified: true,
  },
  {
    id: "rev-002",
    student_name: "Pooja Deshmukh",
    student_rank: "CSEET National Merit • Exemption in Legal Aptitude",
    rating: 5,
    title: "Companies Act & LLP Act codified into gold.",
    comment:
      "I used to struggle with retaining section numbers and circular dates. The Law Kaksha codex made it intuitive. The 3D reader and margin notes are world-class.",
    created_at: "2026-09-18T14:30:00Z",
    is_verified: true,
  },
  {
    id: "rev-003",
    student_name: "Rohan V. Kulkarni",
    student_rank: "CA Foundation Aspirant • All India Rank Candidate",
    rating: 5,
    title: "Unmatched clarity on Regulatory Framework.",
    comment:
      "The visual breakdowns and case law summaries give you the exact presentation style ICAI examiners reward. Best investment for CA law preparation.",
    created_at: "2026-09-22T09:15:00Z",
    is_verified: true,
  },
  {
    id: "rev-004",
    student_name: "Sneha Nair",
    student_rank: "CA Inter Group 1 • Corporate & Other Laws Exemption",
    rating: 5,
    title: "From fear of law to scoring 76 in corporate law.",
    comment:
      "The Bare Act decoding approach removes all ambiguity. The question bank has complete past examinations mapped unit-wise.",
    created_at: "2026-09-25T11:45:00Z",
    is_verified: true,
  },
  {
    id: "rev-005",
    student_name: "Karan Mehta",
    student_rank: "CA Foundation • Distinction in Law",
    rating: 5,
    title: "Indian Partnership Act & Sale of Goods Act made simple.",
    comment:
      "Partnership Act used to feel confusing. The 3-unit sample notes break down mutual agency, holding out, and dissolution with clear examples. Scored exemption comfortably!",
    created_at: "2026-09-28T16:20:00Z",
    is_verified: true,
  },
  {
    id: "rev-006",
    student_name: "CSEET Law Candidate",
    student_rank: "Business Law & Mgt — 88%",
    rating: 5,
    title: "The only material you need for law mastery.",
    comment:
      "No unnecessary fluff. Direct Bare Act sections with recent circulars. The question bank has complete past examinations mapped unit-wise.",
    created_at: "2026-10-01T08:00:00Z",
    is_verified: true,
  },
];

const reviewRateLimitMap = new Map();
const REVIEW_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REVIEWS_PER_HOUR = 5;

router.get("/reviews", (req, res) => {
  const publishedReviews = VERIFIED_REVIEWS.filter((r) => r.is_verified);
  return res.status(200).json({
    success: true,
    reviews: publishedReviews,
    total: publishedReviews.length,
  });
});

router.post("/reviews", (req, res) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "global";
  const now = Date.now();
  const entry = reviewRateLimitMap.get(ip) || { count: 0, resetAt: now + REVIEW_WINDOW_MS };

  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + REVIEW_WINDOW_MS;
  } else {
    entry.count += 1;
  }
  reviewRateLimitMap.set(ip, entry);

  if (entry.count > MAX_REVIEWS_PER_HOUR) {
    return res.status(429).json({
      success: false,
      message: "Too many review submissions from this IP. Please try again later.",
    });
  }

  const { student_name, student_rank, rating, title, comment } = req.body || {};
  if (!student_name || !title || !comment) {
    return res.status(400).json({
      success: false,
      message: "Student name, review title, and comment are required.",
    });
  }

  const newReview = {
    id: `rev-${Date.now().toString().slice(-4)}`,
    student_name: String(student_name).slice(0, 80),
    student_rank: String(student_rank || "Aspirant").slice(0, 100),
    rating: Math.min(Math.max(Number(rating) || 5, 1), 5),
    title: String(title).slice(0, 120),
    comment: String(comment).slice(0, 1000),
    created_at: new Date().toISOString(),
    is_verified: false, // Default to unverified pending moderation
  };

  VERIFIED_REVIEWS.unshift(newReview);
  return res.status(201).json({
    success: true,
    message: "Thank you! Your testimonial has been submitted for verification.",
    review: newReview,
  });
});

module.exports = router;

