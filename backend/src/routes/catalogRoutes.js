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

module.exports = router;
