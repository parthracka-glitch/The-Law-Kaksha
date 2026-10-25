/**
 * The Law Kaksha — Seed CSEET Full Course Data
 * Seeds Course, Acts, Units, ContentItems, Resources, Products & Subscription Plans
 * for both MongoDB Atlas and Local JSON database (lawkaksha_db.json)
 */

const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const mongoose = require("mongoose");
const Course = require("../models/Course");
const Act = require("../models/Act");
const Unit = require("../models/Unit");
const ContentItem = require("../models/ContentItem");
const Resource = require("../models/Resource");
const Product = require("../models/Product");
const Subscription = require("../models/Subscription");
const { connectMongo, isConnected } = require("../db/mongo");

const CSEET_DIR = "C:\\Users\\Parth Racka\\OneDrive\\Desktop\\NIRVANAA STUDIOS PROJECTS\\The Law Kaksha\\CSEET";
const FRONTEND_NOTES_DIR = path.resolve(__dirname, "../../../frontend/public/notes");

function getFileSize(filename) {
  try {
    const p1 = path.join(FRONTEND_NOTES_DIR, filename);
    if (fs.existsSync(p1)) return fs.statSync(p1).size;
    const p2 = path.join(CSEET_DIR, filename);
    if (fs.existsSync(p2)) return fs.statSync(p2).size;
  } catch {}
  return 1000000;
}

async function seedCSEET() {
  console.log("=================================================");
  console.log("Starting Full CSEET Course Seeding...");
  console.log("=================================================");

  let mongoLive = false;
  try {
    await connectMongo();
    mongoLive = isConnected();
    console.log(`MongoDB Atlas Status: ${mongoLive ? "CONNECTED" : "OFFLINE"}`);
  } catch (err) {
    console.warn("MongoDB connection warning:", err.message);
  }

  // 1. COURSE DEFINITION
  const cseetCourse = {
    id: "course-cseet",
    title: "CSEET Business Laws and Management",
    slug: "cseet-business-laws-management",
    availability: "live",
    price: 99,
    mrp: 299,
    accessDays: 30,
    description: "Comprehensive ICSI CSEET Paper 2 Business Laws & Management preparation codex.",
    thumbnail: "/covers/vol2-codex.webp",
    cover_image: "/covers/vol2-codex.webp",
    pdfUrl: "/samples/Lesson 7 Introduction to Management (Comprehensive Notes).pdf",
    previewPagesLimit: 10,
    kind: "core",
    is_active: true,
    order: 2,
    display_order: 2,
    exam_body: "ICSI",
    units_count: 4,
    highlights: [
      "All 4 Comprehensive Management Modules (Lessons 7-10) Included",
      "Unit-wise Detailed Notes & Statutory Frameworks",
      "Interactive DRM Protected In-Web Reader",
      "ICSI Model Case Studies & Modern Management Approaches",
    ],
  };

  // 2. ACTS DEFINITION
  const acts = [
    {
      id: "act-cseet-mgmt",
      courseId: "course-cseet",
      title: "Business Management (Paper 2, Part B)",
      availability: "live",
      order: 1,
      description: "Core syllabus for ICSI CSEET Paper 2 Part B Business Management covering Lessons 7, 8, 9, and 10.",
    },
  ];

  // 3. UNITS DEFINITION
  const units = [
    {
      id: "unit-cseet-l7",
      actId: "act-cseet-mgmt",
      title: "Lesson 7: Introduction to Management",
      order: 1,
      summary: "Concepts, nature, process, significance and managerial levels in modern organizations.",
    },
    {
      id: "unit-cseet-l8",
      actId: "act-cseet-mgmt",
      title: "Lesson 8: Functions of Management",
      order: 2,
      summary: "Planning, Organizing, Staffing, Directing, and Controlling functions with ICSI exam focus.",
    },
    {
      id: "unit-cseet-l9",
      actId: "act-cseet-mgmt",
      title: "Lesson 9: Principles of Management and Modern Approaches",
      order: 3,
      summary: "Henri Fayol's 14 principles, Taylor's scientific management, and contemporary administrative thought.",
    },
    {
      id: "unit-cseet-l10",
      actId: "act-cseet-mgmt",
      title: "Lesson 10: Management Knowledge for Company Secretaries",
      order: 4,
      summary: "Specialized governance acumen, corporate decision-making, and leadership for CS.",
    },
  ];

  // 4. CONTENT ITEMS (PDFs inside Units)
  const contentItems = [
    {
      id: "ci-cseet-l7",
      unitId: "unit-cseet-l7",
      type: "notes",
      title: "Lesson 7 — Introduction to Management (Comprehensive Notes)",
      fileName: "Lesson 7 Introduction to Management (Comprehensive Notes).pdf",
      fileSize: getFileSize("Lesson 7 Introduction to Management (Comprehensive Notes).pdf"),
      isSample: true,
      sampleFromPage: 1,
      sampleToPage: 10,
      samplePagesRange: "1-10",
      isPublished: true,
      order: 1,
      description: "Comprehensive chapter codex covering nature, significance, managerial levels and roles under ICSI syllabus.",
    },
    {
      id: "ci-cseet-l8",
      unitId: "unit-cseet-l8",
      type: "notes",
      title: "Lesson 8 — Functions of Management (Comprehensive Notes)",
      fileName: "Lesson 8 Functions of Management (Comprehensive Notes).pdf",
      fileSize: getFileSize("Lesson 8 Functions of Management (Comprehensive Notes).pdf"),
      isSample: false,
      isPublished: true,
      order: 1,
      description: "In-depth guide covering Planning, Organizing, Staffing, Directing, and Controlling.",
    },
    {
      id: "ci-cseet-l9",
      unitId: "unit-cseet-l9",
      type: "notes",
      title: "Lesson 9 — Principles of Management and Modern Approaches",
      fileName: "Lesson 9 Principles of Management and Modern Approaches.pdf",
      fileSize: getFileSize("Lesson 9 Principles of Management and Modern Approaches.pdf"),
      isSample: false,
      isPublished: true,
      order: 1,
      description: "Classical and contemporary administrative frameworks, Henri Fayol & FW Taylor principles.",
    },
    {
      id: "ci-cseet-l10",
      unitId: "unit-cseet-l10",
      type: "notes",
      title: "Lesson 10 — Management Knowledge for CS",
      fileName: "Lesson 10 Management Knowledge for CS.pdf",
      fileSize: getFileSize("Lesson 10 Management Knowledge for CS.pdf"),
      isSample: false,
      isPublished: true,
      order: 1,
      description: "Specialized managerial acumen, strategic execution, and boardroom leadership for Company Secretaries.",
    },
  ];

  // 5. RESOURCES DEFINITION (Manageable in Admin Dashboard)
  const resources = [
    {
      id: "res-cseet-l7",
      course_id: "course-cseet",
      course: "cseet",
      actName: "Business Management",
      chapterNumber: 7,
      title: "Lesson 7: Introduction to Management (Free Sample & Notes)",
      type: "notes",
      file_or_url: "/samples/Lesson 7 Introduction to Management (Comprehensive Notes).pdf",
      pdfUrl: "/samples/Lesson 7 Introduction to Management (Comprehensive Notes).pdf",
      samplePdfUrl: "/samples/Lesson 7 Introduction to Management (Comprehensive Notes).pdf",
      description: "ICSI CSEET comprehensive notes covering management definitions, scope, and objectives.",
      isSample: true,
      status: "Published",
      display_order: 1,
      order: 1,
      is_active: true,
      pages: "50+ Pages",
      previewPagesLimit: 10,
    },
    {
      id: "res-cseet-l8",
      course_id: "course-cseet",
      course: "cseet",
      actName: "Business Management",
      chapterNumber: 8,
      title: "Lesson 8: Functions of Management",
      type: "notes",
      file_or_url: "/notes/Lesson 8 Functions of Management (Comprehensive Notes).pdf",
      pdfUrl: "/notes/Lesson 8 Functions of Management (Comprehensive Notes).pdf",
      samplePdfUrl: "/notes/Lesson 8 Functions of Management (Comprehensive Notes).pdf?sample=true",
      description: "Full module notes on managerial functions, span of control, delegation, and coordination.",
      isSample: false,
      status: "Published",
      display_order: 2,
      order: 2,
      is_active: true,
      pages: "80+ Pages",
      previewPagesLimit: 5,
    },
    {
      id: "res-cseet-l9",
      course_id: "course-cseet",
      course: "cseet",
      actName: "Business Management",
      chapterNumber: 9,
      title: "Lesson 9: Principles of Management & Modern Approaches",
      type: "notes",
      file_or_url: "/notes/Lesson 9 Principles of Management and Modern Approaches.pdf",
      pdfUrl: "/notes/Lesson 9 Principles of Management and Modern Approaches.pdf",
      samplePdfUrl: "/notes/Lesson 9 Principles of Management and Modern Approaches.pdf?sample=true",
      description: "Core management principles, modern administrative systems, and exam revision pointers.",
      isSample: false,
      status: "Published",
      display_order: 3,
      order: 3,
      is_active: true,
      pages: "40+ Pages",
      previewPagesLimit: 5,
    },
    {
      id: "res-cseet-l10",
      course_id: "course-cseet",
      course: "cseet",
      actName: "Business Management",
      chapterNumber: 10,
      title: "Lesson 10: Management Knowledge for Company Secretaries",
      type: "notes",
      file_or_url: "/notes/Lesson 10 Management Knowledge for CS.pdf",
      pdfUrl: "/notes/Lesson 10 Management Knowledge for CS.pdf",
      samplePdfUrl: "/notes/Lesson 10 Management Knowledge for CS.pdf?sample=true",
      description: "Professional knowledge and management application for upcoming Company Secretaries.",
      isSample: false,
      status: "Published",
      display_order: 4,
      order: 4,
      is_active: true,
      pages: "70+ Pages",
      previewPagesLimit: 5,
    },
  ];

  // 6. PRODUCT DEFINITION (For Catalog & Course Box Free Sample)
  const product = {
    id: "course-cseet",
    title: "CSEET Business Laws and Management",
    subtitle: "Paper 2 Master Codex & Complete Notes",
    category: "CSEET",
    format: "Digital Codex (In-Web DRM)",
    price: 99,
    originalPrice: 299,
    pages: "240+ Pages",
    status: "Active",
    pdfUrl: "/samples/Lesson 7 Introduction to Management (Comprehensive Notes).pdf",
    description:
      "Complete ICSI CSEET Paper 2 Business Management curriculum covering Introduction to Management, Functions of Management, Principles of Management, and Management Knowledge for Company Secretaries.",
    units: [
      "Lesson 7: Introduction to Management",
      "Lesson 8: Functions of Management",
      "Lesson 9: Principles of Management and Modern Approaches",
      "Lesson 10: Management Knowledge for CS",
    ],
    highlights: [
      "All 4 Comprehensive Management Modules Included",
      "ICSI Pattern Case Studies & Problem Scenarios",
      "Interactive DRM Protected In-Web Reader",
      "Model Question-Answers for CSEET Paper 2",
    ],
    cover_image: "/covers/vol2-codex.webp",
    isSample: true,
    previewPagesLimit: 10,
    samplePagesRange: "1-10",
  };

  // 7. SUBSCRIPTION PLAN DEFINITIONS
  const subscriptionPlans = [
    {
      id: "sub-cseet-monthly",
      title: "CSEET Business Laws and Management Monthly Pass",
      slug: "cseet-business-laws-management-monthly-access",
      short_desc: "All-Inclusive 30-Day Access to CSEET Paper 2 Business Management",
      description: "Full access to all 4 Management Lessons, Comprehensive Notes, and In-Web Reader.",
      price: 99,
      mrp: 299,
      duration_days: 30,
      thumbnail: "/covers/vol2-codex.webp",
      features: [
        "Full access to Lesson 7: Introduction to Management",
        "Full access to Lesson 8: Functions of Management",
        "Full access to Lesson 9: Principles of Management",
        "Full access to Lesson 10: Management Knowledge for CS",
        "In-web secure reader with progress tracking",
      ],
      course_ids: ["course-cseet"],
      display_order: 2,
      is_active: true,
    },
    {
      id: "course-cseet-sub",
      title: "CSEET Business Laws and Management Complete Access Pass",
      slug: "cseet-business-laws-management",
      short_desc: "All-Inclusive 30-Day Access to CSEET Paper 2 Business Management",
      description: "Full access to all 4 Management Lessons, Comprehensive Notes, and In-Web Reader.",
      price: 99,
      mrp: 299,
      duration_days: 30,
      thumbnail: "/covers/vol2-codex.webp",
      features: [
        "Full access to Lesson 7: Introduction to Management",
        "Full access to Lesson 8: Functions of Management",
        "Full access to Lesson 9: Principles of Management",
        "Full access to Lesson 10: Management Knowledge for CS",
        "In-web secure reader with progress tracking",
      ],
      course_ids: ["course-cseet"],
      display_order: 2,
      is_active: true,
    },
  ];

  // =========================================================================
  // PERSISTENCE EXECUTION
  // =========================================================================

  // A. MongoDB Atlas
  if (mongoLive) {
    console.log("\n[MongoDB Atlas] Writing CSEET entities...");
    await Course.deleteMany({ id: cseetCourse.id });
    await Course.create(cseetCourse);
    console.log("✓ Course inserted in Mongo");

    await Act.deleteMany({ courseId: cseetCourse.id });
    await Act.insertMany(acts);
    console.log(`✓ ${acts.length} Acts inserted in Mongo`);

    const actIds = acts.map((a) => a.id);
    await Unit.deleteMany({ actId: { $in: actIds } });
    await Unit.insertMany(units);
    console.log(`✓ ${units.length} Units inserted in Mongo`);

    const unitIds = units.map((u) => u.id);
    await ContentItem.deleteMany({ unitId: { $in: unitIds } });
    await ContentItem.insertMany(contentItems);
    console.log(`✓ ${contentItems.length} ContentItems inserted in Mongo`);

    const resIds = resources.map((r) => r.id);
    await Resource.deleteMany({ $or: [{ id: { $in: resIds } }, { course_id: cseetCourse.id }] });
    await Resource.insertMany(resources);
    console.log(`✓ ${resources.length} Resources inserted in Mongo`);

    await Product.deleteMany({ id: product.id });
    await Product.create(product);
    console.log("✓ Product inserted in Mongo");

    for (const plan of subscriptionPlans) {
      await Subscription.deleteMany({ id: plan.id });
      await Subscription.create(plan);
    }
    console.log(`✓ ${subscriptionPlans.length} Subscription Plans inserted in Mongo`);
  }

  // B. Local JSON Database
  console.log("\n[Local JSON DB] Writing CSEET entities...");
  const dbPath = path.join(__dirname, "../../data/lawkaksha_db.json");
  let db = {};
  if (fs.existsSync(dbPath)) {
    try {
      db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    } catch {
      db = {};
    }
  }

  // Ensure tables exist
  db.courses = (db.courses || []).filter((c) => c.id !== cseetCourse.id);
  db.courses.push(cseetCourse);

  const actIdSet = new Set(acts.map((a) => a.id));
  db.acts = (db.acts || []).filter((a) => !actIdSet.has(a.id) && a.courseId !== cseetCourse.id);
  db.acts.push(...acts);

  const unitIdSet = new Set(units.map((u) => u.id));
  db.units = (db.units || []).filter((u) => !unitIdSet.has(u.id) && !actIdSet.has(u.actId));
  db.units.push(...units);

  const ciIdSet = new Set(contentItems.map((c) => c.id));
  db.content_items = (db.content_items || []).filter((c) => !ciIdSet.has(c.id) && !unitIdSet.has(c.unitId));
  db.content_items.push(...contentItems);

  const resIdSet = new Set(resources.map((r) => r.id));
  db.resources = (db.resources || []).filter((r) => !resIdSet.has(r.id) && r.course_id !== cseetCourse.id);
  db.resources.push(...resources);

  db.products = (db.products || []).filter((p) => p.id !== product.id);
  db.products.push(product);

  for (const plan of subscriptionPlans) {
    db.subscription_plans = (db.subscription_plans || []).filter((s) => s.id !== plan.id);
    db.subscription_plans.push(plan);

    db.subscriptions = (db.subscriptions || []).filter((s) => s.id !== plan.id);
    db.subscriptions.push(plan);
  }

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
  console.log("✓ All CSEET entities saved to lawkaksha_db.json");

  console.log("\n=================================================");
  console.log("CSEET Seed Completed Successfully!");
  console.log(`- Course: ${cseetCourse.title}`);
  console.log(`- Acts: ${acts.length}`);
  console.log(`- Units: ${units.length}`);
  console.log(`- Content Items: ${contentItems.length}`);
  console.log(`- Resources: ${resources.length}`);
  console.log(`- Free Sample PDF: ${product.pdfUrl}`);
  console.log("=================================================");

  process.exit(0);
}

seedCSEET().catch((err) => {
  console.error("CSEET Seeding failed with error:", err);
  process.exit(1);
});
