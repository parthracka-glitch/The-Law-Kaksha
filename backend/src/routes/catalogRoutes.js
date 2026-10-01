/**
 * The Law Kaksha — Catalog Routes
 * Serves courses, acts/units, shopping catalog products, and content for CA Foundation & CSEET
 */

const express = require("express");
const router = express.Router();
const Database = require("../db/database");

// Academic Catalog: Official CA Foundation & CSEET Subscription Courses
const CATALOG_PRODUCTS = [
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
    category: "CA Foundation Paper 2",
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
    category: "CSEET Paper 2",
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


// GET /api/catalog — List all catalog products with rich filters
router.get("/catalog", (req, res) => {
  let products = [...CATALOG_PRODUCTS];

  if (req.query.type && req.query.type !== "all") {
    products = products.filter((p) => p.type === req.query.type);
  }
  if (req.query.courseId && req.query.courseId !== "all") {
    products = products.filter((p) => p.courseId === req.query.courseId);
  }
  if (req.query.search) {
    const q = req.query.search.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  res.status(200).json({
    success: true,
    count: products.length,
    products,
    items: products,
  });
});

// GET /api/catalog/:id — Get a single product's complete details
router.get("/catalog/:id", (req, res) => {
  const product = CATALOG_PRODUCTS.find(
    (p) => p.id === req.params.id || p.slug === req.params.id
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found in catalog.",
    });
  }

  res.status(200).json({
    success: true,
    product,
    item: product,
  });
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

// GET /api/courses/:courseId/free-resources — Get free/sample resources
router.get("/courses/:courseId/free-resources", (req, res) => {
  const contentTable = Database.table("content");
  const freeContent = contentTable.find(
    (c) => c.courseId === req.params.courseId && c.isSample === true
  );
  res.status(200).json({ success: true, freeResources: freeContent });
});

module.exports = router;
