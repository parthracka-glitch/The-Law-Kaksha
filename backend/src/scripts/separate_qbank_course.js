/**
 * The Law Kaksha — Separate Question Bank into a Standalone Course
 * - Creates course-ca-qbank (Price: ₹349, MRP: ₹699, includes Part 1 & 2)
 * - Decouples Question Bank from CA Foundation (updates CA Foundation to 20 units across 4 acts)
 * - Sets up Acts, Units, ContentItems, Resources, Product, and Subscription for Question Bank
 * - Revokes Question Bank final PDF access from students who only bought CA Foundation
 * - Syncs both MongoDB Atlas and Local JSON (data/lawkaksha_db.json)
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
const User = require("../models/User");
const Entitlement = require("../models/Entitlement");
const { connectMongo, isConnected } = require("../db/mongo");

const FRONTEND_DIR = path.resolve(__dirname, "../../../frontend/public");

function getFileSize(filename) {
  const p1 = path.join(FRONTEND_DIR, "notes", filename);
  if (fs.existsSync(p1)) return fs.statSync(p1).size;
  const p2 = path.join(FRONTEND_DIR, "samples", filename);
  if (fs.existsSync(p2)) return fs.statSync(p2).size;
  const p3 = path.join("C:\\Users\\Parth Racka\\OneDrive\\Desktop\\NIRVANAA STUDIOS PROJECTS\\The Law Kaksha\\CA Foundation\\Question Bank FINAL pdf", filename);
  if (fs.existsSync(p3)) return fs.statSync(p3).size;
  const p4 = path.join("C:\\Users\\Parth Racka\\OneDrive\\Desktop\\NIRVANAA STUDIOS PROJECTS\\The Law Kaksha\\CA Foundation\\Ouestion Bank Sample Pdf", filename);
  if (fs.existsSync(p4)) return fs.statSync(p4).size;
  return 1000000;
}

async function run() {
  console.log("=================================================");
  console.log("Starting Question Bank Course Separation Migration...");
  console.log("=================================================");

  let mongoLive = false;
  try {
    await connectMongo();
    mongoLive = isConnected();
    console.log(`MongoDB Atlas Status: ${mongoLive ? "CONNECTED" : "OFFLINE"}`);
  } catch (err) {
    console.warn("MongoDB connection warning:", err.message);
  }

  // 1. STANDALONE QUESTION BANK COURSE DEFINITION
  const qbankCourse = {
    id: "course-ca-qbank",
    title: "CA Foundation — Smart Revision Question Bank (Part 1 & 2)",
    slug: "ca-foundation-smart-revision-question-bank",
    availability: "live",
    price: 349,
    mrp: 699,
    accessDays: 180,
    description:
      "Official CA Foundation Paper 2 Smart Revision Question Bank (Part 1 & Part 2). Comprehensive ICAI exam-oriented practice questions, RTPs, MTPs & suggested model answers.",
    thumbnail: "/assets/ca-cs-hero-books-sharp.png",
    kind: "extra",
    is_active: true,
    order: 3,
    display_order: 3,
    exam_body: "ICAI",
    units_count: 2,
    highlights: [
      "Both Part 1 & Part 2 Complete Final Volumes Included",
      "Official Smart Revision Question Bank Final Copies",
      "Exam-pattern practice sets with RTPs, MTPs & suggested answers",
      "Examiner-tested 3-step ICAI model answer frameworks",
      "In-Web DRM Secure Watermarked Reader access with zero downloads",
    ],
  };

  // 2. QUESTION BANK ACT DEFINITION
  const qbankAct = {
    id: "act-ca-qbank",
    courseId: "course-ca-qbank",
    title: "Smart Revision Question Banks (Part 1 & 2)",
    availability: "live",
    order: 1,
    description:
      "Official CA Foundation Smart Revision Question Bank — Complete Volume 1 & Volume 2 Final Copies.",
  };

  // 3. QUESTION BANK UNITS DEFINITION (ONLY 2 FINAL VOLUMES)
  const qbankUnits = [
    {
      id: "unit-ca-qbank-part1",
      actId: "act-ca-qbank",
      title: "Question Bank Part 1 (Final Volume)",
      order: 1,
      summary: "Official Part 1 Final Volume Question Bank.",
    },
    {
      id: "unit-ca-qbank-part2",
      actId: "act-ca-qbank",
      title: "Question Bank Part 2 (Final Volume)",
      order: 2,
      summary: "Official Part 2 Final Volume Question Bank.",
    },
  ];

  // 4. QUESTION BANK CONTENT ITEMS (ONLY 2 FINAL VOLUME COPIES IN COURSE SECTION)
  const qbankContentItems = [
    {
      id: "ci-ca-qbank-part1-final",
      unitId: "unit-ca-qbank-part1",
      type: "practice",
      title: "Question Bank Part 1 (Final Copy)",
      fileName: "Question Bank_Part1 Final Copy.pdf",
      fileSize: getFileSize("Question Bank_Part1 Final Copy.pdf"),
      isSample: false,
      isPublished: true,
      order: 1,
      description: "Complete final volume of Question Bank Part 1.",
    },
    {
      id: "ci-ca-qbank-part2-final",
      unitId: "unit-ca-qbank-part2",
      type: "practice",
      title: "Question Bank Part 2 (Final Copy)",
      fileName: "Question Bank Part 2_Final Copy.pdf",
      fileSize: getFileSize("Question Bank Part 2_Final Copy.pdf"),
      isSample: false,
      isPublished: true,
      order: 2,
      description: "Complete final volume of Question Bank Part 2.",
    },
  ];

  // 5. QUESTION BANK RESOURCES DEFINITION
  const qbankResources = [
    {
      id: "res-ca-qbank-part1-sample",
      course_id: "course-ca-qbank",
      courseId: "course-ca-qbank",
      course: "ca-qbank",
      actName: "Question Bank Part 1",
      chapterNumber: 1,
      title: "Smart Revision Question Bank Part 1 (Free Sample Copy)",
      type: "practice",
      file_or_url: "/samples/Question Bank Part 1- Sample Copy.pdf",
      pdfUrl: "/samples/Question Bank Part 1- Sample Copy.pdf",
      samplePdfUrl: "/samples/Question Bank Part 1- Sample Copy.pdf",
      description: "Official watermarked free sample preview of CA Foundation Smart Revision Question Bank Part 1.",
      isSample: true,
      status: "Published",
      display_order: 1,
      order: 1,
      is_active: true,
      pages: "Sample Copy",
      previewPagesLimit: 10,
    },
    {
      id: "res-ca-qbank-part2-sample",
      course_id: "course-ca-qbank",
      courseId: "course-ca-qbank",
      course: "ca-qbank",
      actName: "Question Bank Part 2",
      chapterNumber: 2,
      title: "Smart Revision Question Bank Part 2 (Free Sample Copy)",
      type: "practice",
      file_or_url: "/samples/Part 2_Sample Copy.pdf",
      pdfUrl: "/samples/Part 2_Sample Copy.pdf",
      samplePdfUrl: "/samples/Part 2_Sample Copy.pdf",
      description: "Official watermarked free sample preview of CA Foundation Smart Revision Question Bank Part 2.",
      isSample: true,
      status: "Published",
      display_order: 2,
      order: 2,
      is_active: true,
      pages: "Sample Copy",
      previewPagesLimit: 10,
    },
    {
      id: "res-ca-qbank-part1-final",
      course_id: "course-ca-qbank",
      courseId: "course-ca-qbank",
      course: "ca-qbank",
      actName: "Question Bank Part 1",
      chapterNumber: 1,
      title: "Smart Revision Question Bank Part 1 (Final Copy)",
      type: "practice",
      file_or_url: "/notes/Question Bank_Part1 Final Copy.pdf",
      pdfUrl: "/notes/Question Bank_Part1 Final Copy.pdf",
      samplePdfUrl: "/samples/Question Bank Part 1- Sample Copy.pdf",
      description: "Full final edition of Part 1 Question Bank.",
      isSample: false,
      status: "Published",
      display_order: 3,
      order: 3,
      is_active: true,
      pages: "Complete Codex",
      previewPagesLimit: 5,
    },
    {
      id: "res-ca-qbank-part2-final",
      course_id: "course-ca-qbank",
      courseId: "course-ca-qbank",
      course: "ca-qbank",
      actName: "Question Bank Part 2",
      chapterNumber: 2,
      title: "Smart Revision Question Bank Part 2 (Final Copy)",
      type: "practice",
      file_or_url: "/notes/Question Bank Part 2_Final Copy.pdf",
      pdfUrl: "/notes/Question Bank Part 2_Final Copy.pdf",
      samplePdfUrl: "/samples/Part 2_Sample Copy.pdf",
      description: "Full final edition of Part 2 Question Bank.",
      isSample: false,
      status: "Published",
      display_order: 4,
      order: 4,
      is_active: true,
      pages: "Complete Codex",
      previewPagesLimit: 5,
    },
  ];

  // 6. QUESTION BANK PRODUCT DEFINITION
  const qbankProduct = {
    id: "course-ca-qbank",
    title: "CA Foundation Question Bank (Part 1 & 2)",
    subtitle: "Complete Exam Practice Question Bank • Part 1 & Part 2 Included",
    category: "CA Foundation",
    format: "Digital Codex (In-Web DRM)",
    price: 349,
    originalPrice: 699,
    pages: "250+ Pages",
    status: "Active",
    pdfUrl: "/samples/Question Bank Part 1- Sample Copy.pdf",
    description:
      "Official CA Foundation Paper 2 Smart Revision Question Bank — Complete Volume 1 & Volume 2 Final Copies with ICAI model answers.",
    units: [
      "Question Bank Part 1 (Final Volume)",
      "Question Bank Part 2 (Final Volume)",
    ],
    highlights: [
      "Both Part 1 & Part 2 Final Volumes Included (₹349)",
      "Official exam practice questions & ICAI model answers",
      "Interactive DRM Protected In-Web Reader",
      "RTPs, MTPs & past examination questions solved",
    ],
    cover_image: "/assets/ca-cs-hero-books-sharp.png",
    isSample: true,
    previewPagesLimit: 10,
    samplePagesRange: "1-10",
  };

  // 7. QUESTION BANK SUBSCRIPTION PLAN DEFINITION
  const qbankSubscription = {
    id: "sub-ca-qbank",
    name: "CA Foundation Question Bank (Part 1 & 2)",
    title: "CA Foundation Question Bank (Part 1 & 2)",
    slug: "ca-foundation-smart-revision-question-bank",
    price: 349,
    mrp: 699,
    duration_days: 180,
    courses_included: ["course-ca-qbank"],
    description: "Complete digital access to CA Foundation Question Bank Part 1 & Part 2 in DRM Reader.",
    badge: "Question Bank • Part 1 & 2 Included",
    is_active: true,
    is_popular: true,
    features: [
      "Both Part 1 & Part 2 Complete Question Banks Included",
      "Official Volume 1 & Volume 2 Final Copies",
      "RTPs, MTPs & suggested model answers",
      "In-Web DRM Watermarked Reader Access (180 Days)",
    ],
  };

  // Deprecated QBank item IDs that must NOT be in CA Foundation or Question Bank course content
  const legacyQBankItemIds = [
    "ci-qbank-part1-final",
    "ci-qbank-part1-sample",
    "ci-qbank-part2-final",
    "ci-qbank-part2-sample",
    "ci-ca-qbank-part1-sample",
    "ci-ca-qbank-part2-sample",
    "res-ca-qbank-part1-final",
    "res-ca-qbank-part2-final",
  ];

  // Final items that students must NOT have access to unless they bought the new course
  const finalPdfItemIds = new Set([
    "ci-qbank-part1-final",
    "ci-qbank-part2-final",
    "ci-ca-qbank-part1-final",
    "ci-ca-qbank-part2-final",
    "res-ca-qbank-part1-final",
    "res-ca-qbank-part2-final",
    "Question Bank_Part1 Final Copy.pdf",
    "Question Bank Part 2_Final Copy.pdf",
  ]);

  // A. UPDATE MONGODB ATLAS
  if (mongoLive) {
    console.log("\n[MongoDB Atlas] Updating database entities...");

    // 1. Remove old QBank act from CA Foundation
    await Act.deleteMany({
      $or: [
        { id: "act-qbank" },
        { id: "act-ca-qbank" },
        { title: { $regex: /question bank/i }, courseId: "course-ca-foundation" },
      ],
    });
    console.log("✓ Removed old Question Bank act from CA Foundation in Mongo");

    // 2. Remove legacy QBank units
    await Unit.deleteMany({
      $or: [
        { id: "unit-qbank-part1" },
        { id: "unit-qbank-part2" },
        { id: "unit-ca-qbank-part1" },
        { id: "unit-ca-qbank-part2" },
      ],
    });
    console.log("✓ Removed old Question Bank units in Mongo");

    // 3. Remove old content items associated with old units
    await ContentItem.deleteMany({
      $or: [
        { id: { $in: legacyQBankItemIds } },
        { id: { $in: qbankContentItems.map((c) => c.id) } },
      ],
    });

    // 4. Update CA Foundation Course in Mongo (20 units across 4 acts)
    await Course.updateOne(
      { id: "course-ca-foundation" },
      {
        $set: {
          units_count: 20,
          description:
            "Comprehensive CA Foundation Paper 2 Business Laws master curriculum covering Indian Contract Act 1872, Sale of Goods Act 1930, Indian Partnership Act 1932, Limited Liability Partnership Act 2008, LDR Flowcharts, and case studies.",
          highlights: [
            "Unit-wise detailed statutory notes & case studies across 4 Acts (20 Units)",
            "LDR Flowcharts & visual infographic codices",
            "RTP, MTP & past examination suggested answers",
            "Examiner-tested 3-step ICAI model answer techniques",
            "In-web secure watermarked reader with zero downloads",
          ],
        },
      }
    );
    console.log("✓ Updated CA Foundation Course to 20 units (excluding Question Bank) in Mongo");

    // 5. Insert or Replace Standalone Question Bank Course in Mongo
    await Course.deleteOne({ id: qbankCourse.id });
    await Course.create(qbankCourse);
    console.log(`✓ Inserted course: ${qbankCourse.title} (Price: ₹${qbankCourse.price}) in Mongo`);

    // 6. Insert Question Bank Act, Units, ContentItems
    await Act.create(qbankAct);
    console.log("✓ Inserted Question Bank Act in Mongo");

    await Unit.insertMany(qbankUnits);
    console.log(`✓ Inserted ${qbankUnits.length} Question Bank Units in Mongo`);

    await ContentItem.insertMany(qbankContentItems);
    console.log(`✓ Inserted ${qbankContentItems.length} Question Bank ContentItems in Mongo`);

    // 7. Insert Question Bank Resources
    await Resource.deleteMany({
      $or: [{ id: { $in: qbankResources.map((r) => r.id) } }, { course_id: qbankCourse.id }],
    });
    await Resource.insertMany(qbankResources);
    console.log(`✓ Inserted ${qbankResources.length} Question Bank Resources in Mongo`);

    // 8. Insert Question Bank Product & Subscription
    await Product.deleteOne({ id: qbankProduct.id });
    await Product.create(qbankProduct);
    console.log("✓ Inserted Question Bank Product in Mongo");

    await Subscription.deleteOne({ id: qbankSubscription.id });
    await Subscription.create(qbankSubscription);
    console.log("✓ Inserted Question Bank Subscription Plan in Mongo");

    // 9. Update existing CA Foundation Product
    await Product.updateOne(
      { id: "course-ca-foundation" },
      {
        $set: {
          units: [
            "The Indian Contract Act, 1872",
            "The Sale of Goods Act, 1930",
            "The Indian Partnership Act, 1932",
            "The Limited Liability Partnership Act, 2008",
          ],
          highlights: [
            "All 4 Statutory Acts Included (20 Units)",
            "Unit-wise Detailed Notes & Flowcharts",
            "Interactive DRM Protected In-Web Reader",
            "Model Answers & Exam Practice Questions",
          ],
          description:
            "Complete CA Foundation Business Laws curriculum including Indian Contract Act, Sale of Goods Act, Partnership Act, LLP Act, and LDR Flowcharts.",
          pdfUrl: "/notes/Unit 1 - Nature of Contracts.pdf",
        },
      }
    );
    console.log("✓ Updated CA Foundation Product in Mongo");

    // 10. Revoke Question Bank final PDF access from existing students in Mongo
    const allUsers = await User.find({ role: "student" });
    let revokedCount = 0;
    for (const user of allUsers) {
      // Check if user has an active entitlement for course-ca-qbank
      const hasQBankEntitlement = await Entitlement.findOne({
        user_id: user.id || String(user._id),
        courseId: "course-ca-qbank",
        status: "active",
      });

      if (!hasQBankEntitlement && Array.isArray(user.unlockedItemIds) && user.unlockedItemIds.length > 0) {
        const filtered = user.unlockedItemIds.filter((itemId) => !finalPdfItemIds.has(itemId));
        if (filtered.length !== user.unlockedItemIds.length) {
          user.unlockedItemIds = filtered;
          await user.save();
          revokedCount++;
        }
      }
    }
    console.log(`✓ Audited student users in Mongo: revoked Question Bank final access from ${revokedCount} students.`);
  }

  // B. UPDATE LOCAL JSON DATABASE
  console.log("\n[Local JSON DB] Updating local database...");
  const dbPath = path.join(__dirname, "../../data/lawkaksha_db.json");
  let db = {};
  if (fs.existsSync(dbPath)) {
    try {
      db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    } catch {
      db = {};
    }
  }

  // 1. Update CA Foundation in local db
  db.courses = (db.courses || []).map((c) => {
    if (c.id === "course-ca-foundation") {
      return {
        ...c,
        units_count: 20,
        description:
          "Comprehensive CA Foundation Paper 2 Business Laws master curriculum covering Indian Contract Act 1872, Sale of Goods Act 1930, Indian Partnership Act 1932, Limited Liability Partnership Act 2008, LDR Flowcharts, and case studies.",
        highlights: [
          "Unit-wise detailed statutory notes & case studies across 4 Acts (20 Units)",
          "LDR Flowcharts & visual infographic codices",
          "RTP, MTP & past examination suggested answers",
          "Examiner-tested 3-step ICAI model answer techniques",
          "In-web secure watermarked reader with zero downloads",
        ],
      };
    }
    return c;
  });

  // Remove old course-ca-qbank if present, then add new qbankCourse
  db.courses = db.courses.filter((c) => c.id !== qbankCourse.id);
  db.courses.push(qbankCourse);

  // 2. Remove old QBank act from CA Foundation in local db, add qbankAct
  db.acts = (db.acts || []).filter(
    (a) =>
      a.id !== "act-qbank" &&
      a.id !== "act-ca-qbank" &&
      !(a.courseId === "course-ca-foundation" && (a.title || "").toLowerCase().includes("question bank"))
  );
  db.acts.push(qbankAct);

  // 3. Update Units
  db.units = (db.units || []).filter(
    (u) =>
      u.id !== "unit-qbank-part1" &&
      u.id !== "unit-qbank-part2" &&
      u.id !== "unit-ca-qbank-part1" &&
      u.id !== "unit-ca-qbank-part2"
  );
  db.units.push(...qbankUnits);

  // 4. Update Content Items
  const qbCiIds = new Set(qbankContentItems.map((c) => c.id));
  db.content_items = (db.content_items || []).filter(
    (c) => !legacyQBankItemIds.includes(c.id) && !qbCiIds.has(c.id)
  );
  db.content_items.push(...qbankContentItems);

  // 5. Update Resources
  const qbResIds = new Set(qbankResources.map((r) => r.id));
  db.resources = (db.resources || []).filter(
    (r) => !legacyQBankItemIds.includes(r.id) && !qbResIds.has(r.id) && r.course_id !== qbankCourse.id
  );
  db.resources.push(...qbankResources);

  // 6. Update Products
  db.products = (db.products || []).filter((p) => p.id !== qbankProduct.id);
  db.products.push(qbankProduct);

  // Also update CA Foundation product
  db.products = db.products.map((p) => {
    if (p.id === "course-ca-foundation") {
      return {
        ...p,
        units: [
          "The Indian Contract Act, 1872",
          "The Sale of Goods Act, 1930",
          "The Indian Partnership Act, 1932",
          "The Limited Liability Partnership Act, 2008",
        ],
        highlights: [
          "All 4 Statutory Acts Included (20 Units)",
          "Unit-wise Detailed Notes & Flowcharts",
          "Interactive DRM Protected In-Web Reader",
          "Model Answers & Exam Practice Questions",
        ],
        description:
          "Complete CA Foundation Business Laws curriculum including Indian Contract Act, Sale of Goods Act, Partnership Act, LLP Act, and LDR Flowcharts.",
        pdfUrl: "/notes/Unit 1 - Nature of Contracts.pdf",
      };
    }
    return p;
  });

  // 7. Update Subscriptions
  db.subscriptions = (db.subscriptions || []).filter((s) => s.id !== qbankSubscription.id);
  db.subscriptions.push(qbankSubscription);

  db.subscription_plans = (db.subscription_plans || []).filter((s) => s.id !== qbankSubscription.id);
  db.subscription_plans.push(qbankSubscription);

  // 8. Revoke Question Bank final PDF access from local users
  let localRevoked = 0;
  db.users = (db.users || []).map((u) => {
    if (u.role === "student" && Array.isArray(u.unlockedItemIds)) {
      // Check if user has active qbank entitlement
      const userEntitlements = (db.entitlements || []).filter(
        (e) => e.user_id === u.id && e.courseId === "course-ca-qbank" && e.status === "active"
      );
      if (userEntitlements.length === 0) {
        const filtered = u.unlockedItemIds.filter((itemId) => !finalPdfItemIds.has(itemId));
        if (filtered.length !== u.unlockedItemIds.length) {
          localRevoked++;
          return { ...u, unlockedItemIds: filtered };
        }
      }
    }
    return u;
  });
  console.log(`✓ Audited student users in local db: revoked Question Bank final access from ${localRevoked} students.`);

  // Write local db file
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
  console.log("✓ Saved updated state to lawkaksha_db.json");

  console.log("\n=================================================");
  console.log("Question Bank Course Separation Successfully Completed!");
  console.log(`- New Course: ${qbankCourse.title} (₹${qbankCourse.price})`);
  console.log(`- Units: ${qbankUnits.length}`);
  console.log(`- Content Items: ${qbankContentItems.length}`);
  console.log(`- CA Foundation Units: 20 Units across 4 Acts`);
  console.log("=================================================");

  process.exit(0);
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
