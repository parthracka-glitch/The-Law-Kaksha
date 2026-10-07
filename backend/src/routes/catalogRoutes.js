/**
 * The Law Kaksha — Catalog Routes
 * Serves courses, acts/units, study codices from MongoDB Atlas for CA Foundation & CSEET
 */

const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Resource = require("../models/Resource");
const SiteSetting = require("../models/SiteSetting");
const Database = require("../db/database");
const { isConnected } = require("../db/mongo");

// Base courses
const DEFAULT_COURSES = [
  {
    id: "course-ca-foundation-sub",
    slug: "ca-foundation-business-laws-monthly-access",
    type: "course",
    courseId: "course-ca-foundation",
    title: "CA Foundation Business Laws",
    subtitle: "Complete 7 Chapters Study Notes, Case Studies & Question Bank",
    description: "Comprehensive preparation platform for CA Foundation Paper 2 (ICAI New Scheme). Includes chapter-wise notes, practice questions, weekly case problems, and model solutions.",
    price: 99,
    original_price: 299,
    badge: "₹99 / Month",
    category: "CA Foundation",
    examBody: "ICAI",
    pages_or_duration: "7 Chapters (ICAI Scheme)",
    cover_image: "/assets/ca-cs-hero-books-v2.png",
    highlights: [
      "Chapter-wise notes for all 7 Acts (Contract, Sale of Goods, Partnership, LLP, Companies, NI Act)",
      "Weekly descriptive case study practice with model solutions",
      "Downloadable DRM-protected study PDFs",
      "ICAI answer drafting rubrics & Last Day Revision (LDR) maps",
    ],
  },
  {
    id: "course-cseet-sub",
    slug: "cseet-business-law-management-monthly-access",
    type: "course",
    courseId: "course-cseet",
    title: "CSEET Business Law & Management",
    subtitle: "8 Units Study Notes, Chapter-wise MCQs & Mock Tests",
    description: "Complete preparation platform for CSEET Paper 2 (ICSI Syllabus). Includes unit-wise notes, conceptual MCQs with detailed explanations, and timed mock drills.",
    price: 99,
    original_price: 299,
    badge: "₹99 / Month",
    category: "CSEET",
    examBody: "ICSI",
    pages_or_duration: "8 Units (ICSI Syllabus)",
    cover_image: "/assets/ca-cs-hero-books-v2.png",
    highlights: [
      "Comprehensive notes for all 8 Business Law and Management units",
      "Chapter-wise practice MCQs with explanations for each option",
      "Weekly timed mock tests with instant score reports",
      "Last Day Revision (LDR) summaries and concept flowcharts",
    ],
  },
];

// GET /api/public/site-data — Public site sync data (products, countdowns, QOTD)
router.get("/public/site-data", async (req, res) => {
  try {
    let products = [];
    let examSettings = [];
    let qotd = null;

    if (isConnected()) {
      products = await Product.find({ status: "Active" }).sort({ createdAt: -1 }).lean();
      const examDoc = await SiteSetting.findOne({ key: "exam_countdown" }).lean();
      if (examDoc) examSettings = examDoc.value;
      const qotdDoc = await SiteSetting.findOne({ key: "qotd" }).lean();
      if (qotdDoc) qotd = qotdDoc.value;
    } else {
      products = Database.table("products").find((p) => p.status === "Active");
    }

    res.status(200).json({
      success: true,
      source: isConnected() ? "mongodb_atlas" : "local_cache",
      products,
      examSettings,
      qotd,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching site data." });
  }
});

// GET /api/catalog — List all catalog products (DB + Courses)
router.get("/catalog", async (req, res) => {
  try {
    let dbProducts = [];
    if (isConnected()) {
      dbProducts = await Product.find({ status: "Active" }).lean();
    } else {
      dbProducts = Database.table("products").find((p) => p.status === "Active");
    }

    // Adapt DB products into catalog format
    const formattedDbProducts = dbProducts.map((p) => ({
      ...p,
      original_price: p.originalPrice || 499,
      badge: `₹${p.price}`,
    }));

    let allProducts = [...DEFAULT_COURSES, ...formattedDbProducts];

    if (req.query.type && req.query.type !== "all") {
      allProducts = allProducts.filter((p) => p.type === req.query.type);
    }
    if (req.query.category && req.query.category !== "all") {
      allProducts = allProducts.filter(
        (p) => p.category === req.query.category || p.category === "Both"
      );
    }
    if (req.query.search) {
      const q = req.query.search.toLowerCase().trim();
      allProducts = allProducts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    res.status(200).json({
      success: true,
      source: isConnected() ? "mongodb_atlas" : "local_cache",
      count: allProducts.length,
      products: allProducts,
      items: allProducts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching catalog." });
  }
});

// GET /api/catalog/:id — Get a single product's complete details
router.get("/catalog/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Check in default courses
    let product = DEFAULT_COURSES.find((p) => p.id === id || p.slug === id);

    if (!product) {
      if (isConnected()) {
        product = await Product.findOne({ id }).lean();
      } else {
        product = Database.table("products").findOne((p) => p.id === id);
      }
    }

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found in catalog." });
    }

    res.status(200).json({
      success: true,
      product: {
        ...product,
        original_price: product.originalPrice || product.original_price || 499,
      },
      item: product,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching product details." });
  }
});

// GET /api/courses — List all courses
router.get("/courses", (req, res) => {
  const coursesTable = Database.table("courses");
  const courses = coursesTable.find();
  res.status(200).json({ success: true, courses });
});

// GET /api/courses/:courseId — Get a specific course
router.get("/courses/:courseId", (req, res) => {
  const coursesTable = Database.table("courses");
  const course = coursesTable.findOne((c) => c.id === req.params.courseId);
  if (!course) {
    return res.status(404).json({ success: false, message: "Course not found" });
  }
  res.status(200).json({ success: true, course });
});

// GET /api/courses/:courseId/acts — Get acts/units for a course
router.get("/courses/:courseId/acts", (req, res) => {
  const actsTable = Database.table("acts");
  const acts = actsTable
    .find((a) => a.courseId === req.params.courseId)
    .sort((a, b) => a.order - b.order);
  res.status(200).json({ success: true, acts });
});

// GET /api/courses/:courseId/content — Get all content for a course
router.get("/courses/:courseId/content", (req, res) => {
  const contentTable = Database.table("content");
  let content = contentTable.find((c) => c.courseId === req.params.courseId);

  if (req.query.type) {
    content = content.filter((c) => c.type === req.query.type);
  }
  if (req.query.actId) {
    content = content.filter((c) => c.actId === req.query.actId);
  }
  if (req.query.sampleOnly === "true") {
    content = content.filter((c) => c.isSample === true);
  }

  res.status(200).json({ success: true, content });
});

// GET /api/courses/:courseId/weekly — Get weekly content
router.get("/courses/:courseId/weekly", (req, res) => {
  const weeklyContentTable = Database.table("weekly_content");
  const weekly = weeklyContentTable.find(
    (w) => w.courseId === req.params.courseId && w.status === "active"
  );
  res.status(200).json({ success: true, weekly });
});

// GET /api/resources — Act-wise resources query
router.get("/resources", async (req, res) => {
  try {
    const { course, actName, type, sampleOnly } = req.query;
    const filter = {};
    if (course) filter.course = course;
    if (actName) filter.actName = actName;
    if (type) filter.type = type;
    if (sampleOnly === "true") filter.isSample = true;

    if (isConnected()) {
      const resources = await Resource.find(filter).sort({ chapterNumber: 1, order: 1 }).lean();
      return res.status(200).json({ success: true, source: "mongodb_atlas", resources });
    }

    const resourcesTable = Database.table("resources");
    let resources = resourcesTable.find();
    if (course) resources = resources.filter((r) => r.course === course);
    if (actName) resources = resources.filter((r) => r.actName === actName);
    if (type) resources = resources.filter((r) => r.type === type);
    if (sampleOnly === "true") resources = resources.filter((r) => r.isSample === true);

    res.status(200).json({ success: true, source: "local_cache", resources });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching resources: " + err.message });
  }
});

// GET /api/public/section16-comparison — Section 16(1) Sale of Goods Model Answer Block
router.get("/public/section16-comparison", async (req, res) => {
  try {
    if (isConnected()) {
      const setting = await SiteSetting.findOne({ key: "section16_comparison" });
      if (setting && setting.value) {
        return res.status(200).json({ success: true, source: "mongodb_atlas", comparison: setting.value });
      }
    }
    res.status(200).json({
      success: true,
      source: "default",
      comparison: {
        act: "The Sale of Goods Act, 1930",
        section: "Section 16(1)",
        marks: 6,
        topic: "Doctrine of Caveat Emptor & Implied Condition as to Quality or Fitness",
        question: "Under Section 16(1) of the Sale of Goods Act, 1930, explain the conditions under which an implied condition as to quality or fitness applies even when not expressly stated.",
        aspirantScore: "2 / 6 Marks",
        aspirantAnswer: "Caveat Emptor means let the buyer beware. The buyer should inspect goods himself before buying. However, if the buyer told the seller why he is buying and seller is in business, seller is responsible. (Priest v. Last)",
        aspirantIssues: [
          "Fails to cite exact statutory 3-element test of Section 16(1)",
          "Missing explanation of 'communication of purpose by implication'",
          "No mention of patent or trade name proviso exception",
        ],
        modelScore: "6 / 6 Marks",
        modelAnswer: "Under Section 16(1) of the Sale of Goods Act, 1930, the general rule of Caveat Emptor is displaced and an implied condition arises if: (1) Buyer makes known to seller the particular purpose (expressly or by implication), (2) Buyer relies on seller's skill or judgment, (3) Goods are of a description which seller supplies in the course of business. Exception: Proviso to Sec 16(1) provides no implied condition for specified articles sold under patent or trade name.",
        modelKeyTakeaways: [
          "Exact 3-prong statutory rule citation from ICAI Suggested Answers",
          "Sub-clause proviso regarding patent/trade names clearly demarcated",
          "Structured in Point-Wise Legal Architecture for maximum evaluator marks",
        ],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching comparison block." });
  }
});

// ==========================================
// SURFACE A & C PUBLIC CONTENT ENDPOINTS (§6)
// ==========================================

// GET /api/subscriptions — List active subscriptions
router.get("/subscriptions", async (req, res) => {
  try {
    let plans = [];
    const plansTable = Database.table("subscription_plans");
    plans = plansTable.find((p) => p.is_active !== false).sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

    if (isConnected()) {
      try {
        const Subscription = require("../models/Subscription");
        const mongoPlans = await Subscription.find({ is_active: true, price: { $gt: 0 } }).sort({ display_order: 1 }).lean();
        if (mongoPlans && mongoPlans.length > 0) plans = mongoPlans;
      } catch (_) {}
    }

    res.status(200).json({ success: true, count: plans.length, subscriptions: plans });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching subscriptions: " + err.message });
  }
});

// GET /api/subscriptions/:slug — Single subscription detail
router.get("/subscriptions/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    let plan = null;
    const plansTable = Database.table("subscription_plans");
    plan = plansTable.findOne((p) => p.slug === slug || p.id === slug);

    if (!plan && isConnected()) {
      try {
        const Subscription = require("../models/Subscription");
        plan = await Subscription.findOne({ $or: [{ slug }, { id: slug }] }).lean();
      } catch (_) {}
    }

    if (!plan) {
      return res.status(404).json({ success: false, message: "Subscription plan not found" });
    }

    // Attach courses
    const coursesTable = Database.table("courses");
    const attachedCourses = (plan.course_ids || []).map((cId) => coursesTable.findOne((c) => c.id === cId)).filter(Boolean);

    res.status(200).json({
      success: true,
      subscription: { ...plan, courses: attachedCourses },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching subscription detail: " + err.message });
  }
});

// GET /api/extra-courses — Standalone purchasable courses (kind = extra)
router.get("/extra-courses", async (req, res) => {
  try {
    const coursesTable = Database.table("courses");
    let extras = coursesTable.find((c) => c.kind === "extra" && c.is_active !== false);

    if (isConnected()) {
      try {
        const Course = require("../models/Course");
        const mongoExtras = await Course.find({ kind: "extra", is_active: true }).lean();
        if (mongoExtras && mongoExtras.length > 0) extras = mongoExtras;
      } catch (_) {}
    }

    res.status(200).json({ success: true, count: extras.length, extraCourses: extras });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching extra courses: " + err.message });
  }
});

// GET /api/carousel-slides — Website banner & subscription slides (A1, B4)
router.get("/carousel-slides", async (req, res) => {
  try {
    const carouselTable = Database.table("carousel_slides");
    let slides = carouselTable.find((s) => (s.placement === "website" || s.placement === "homepage_top") && s.is_active !== false).sort((a, b) => (a.display_order || a.order || 0) - (b.display_order || b.order || 0));

    if (isConnected()) {
      try {
        const CarouselSlide = require("../models/CarouselSlide");
        const mongoSlides = await CarouselSlide.find({ is_active: true }).sort({ display_order: 1 }).lean();
        if (mongoSlides && mongoSlides.length > 0) slides = mongoSlides;
      } catch (_) {}
    }

    const normalized = slides.map((s) => ({
      ...s,
      order: s.display_order !== undefined ? s.display_order : (s.order || 1),
      display_order: s.display_order !== undefined ? s.display_order : (s.order || 1),
      cta_link: s.cta_link || "/courses",
      image: s.image || "/images/hero_ca_foundation.jpg",
    }));

    res.status(200).json({ success: true, count: normalized.length, slides: normalized, data: normalized });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching carousel slides: " + err.message });
  }
});

// GET /api/offers — Active promotional offers (A5, B7)
router.get("/offers", async (req, res) => {
  try {
    const offersTable = Database.table("offers");
    const now = new Date();
    let offers = offersTable.find((o) => {
      if (o.is_active === false) return false;
      if (o.valid_to && new Date(o.valid_to) < now) return false;
      return true;
    }).sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

    if (isConnected()) {
      try {
        const Offer = require("../models/Offer");
        const mongoOffers = await Offer.find({ is_active: true, $or: [{ valid_to: { $gte: now } }, { valid_to: null }] }).sort({ display_order: 1 }).lean();
        if (mongoOffers && mongoOffers.length > 0) offers = mongoOffers;
      } catch (_) {}
    }

    res.status(200).json({ success: true, count: offers.length, offers });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching offers: " + err.message });
  }
});

// GET /api/case-studies — Published legal case studies (A6, B8)
router.get("/case-studies", async (req, res) => {
  try {
    const forDashboard = req.query.dashboard === "true";
    const caseStudiesTable = Database.table("case_studies");
    let caseStudies = caseStudiesTable.find((c) => {
      if (c.is_published === false) return false;
      if (forDashboard) return c.show_on_dashboard !== false;
      return c.show_on_website !== false;
    });

    if (isConnected()) {
      try {
        const CaseStudy = require("../models/CaseStudy");
        const filter = { is_published: true };
        if (forDashboard) filter.show_on_dashboard = true;
        else filter.show_on_website = true;
        const mongoCases = await CaseStudy.find(filter).lean();
        if (mongoCases && mongoCases.length > 0) caseStudies = mongoCases;
      } catch (_) {}
    }

    res.status(200).json({ success: true, count: caseStudies.length, caseStudies });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching case studies: " + err.message });
  }
});

// GET /api/case-studies/:slug — Single case study detail
router.get("/case-studies/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const caseStudiesTable = Database.table("case_studies");
    let caseStudy = caseStudiesTable.findOne((c) => (c.slug === slug || c.id === slug) && c.is_published !== false);

    if (!caseStudy && isConnected()) {
      try {
        const CaseStudy = require("../models/CaseStudy");
        caseStudy = await CaseStudy.findOne({ $or: [{ slug }, { id: slug }], is_published: true }).lean();
      } catch (_) {}
    }

    if (!caseStudy) {
      return res.status(404).json({ success: false, message: "Case study not found" });
    }

    res.status(200).json({ success: true, caseStudy });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching case study: " + err.message });
  }
});

// GET /api/settings/public — Public site settings (footer, about, contact) (A4)
router.get("/settings/public", async (req, res) => {
  try {
    const settingsTable = Database.table("site_settings");
    const footerSetting = settingsTable.findOne((s) => s.key === "footer_details");
    const socialsSetting = settingsTable.findOne((s) => s.key === "social_links");
    const aboutSetting = settingsTable.findOne((s) => s.key === "about_us");

    res.status(200).json({
      success: true,
      footer: footerSetting ? footerSetting.value : null,
      socials: socialsSetting ? socialsSetting.value : null,
      about: aboutSetting ? aboutSetting.value : null,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching public settings: " + err.message });
  }
});

// POST /api/coupons/validate — Server-side coupon validator (§10.1)
router.post("/coupons/validate", async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }

    const cleanCode = String(code).trim().toUpperCase();
    const orderSubtotal = Number(subtotal) || 0;
    const couponsTable = Database.table("coupons");
    let coupon = couponsTable.findOne((c) => c.code === cleanCode && c.is_active !== false);

    if (!coupon && isConnected()) {
      try {
        const Coupon = require("../models/Coupon");
        coupon = await Coupon.findOne({ code: cleanCode, is_active: true }).lean();
      } catch (_) {}
    }

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid or inactive coupon code." });
    }

    // Date range check
    const now = new Date();
    if (coupon.valid_to && new Date(coupon.valid_to) < now) {
      return res.status(400).json({ success: false, message: "This coupon has expired." });
    }

    // Min order check
    if (coupon.min_order && orderSubtotal < coupon.min_order) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.min_order} required to use this coupon.`,
      });
    }

    // Usage limit check
    if (coupon.usage_limit && (coupon.used_count || coupon.usedCount || 0) >= coupon.usage_limit) {
      return res.status(400).json({ success: false, message: "Coupon usage limit reached." });
    }

    // Calculate discount on server
    let discount = 0;
    const discountType = coupon.discount_type || "percent";
    const discountVal = Number(coupon.value || coupon.discountPercent || 0);

    if (discountType === "percent") {
      discount = Math.round((orderSubtotal * discountVal) / 100);
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else {
      discount = Math.min(discountVal, orderSubtotal);
    }

    res.status(200).json({
      success: true,
      valid: true,
      code: coupon.code,
      discount_type: discountType,
      value: discountVal,
      discount,
      final_total: Math.max(0, orderSubtotal - discount),
      coupon_id: coupon.id,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error validating coupon: " + err.message });
  }
});

module.exports = router;
