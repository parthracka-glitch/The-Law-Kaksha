/**
 * The Law Kaksha — CA Foundation Master Seed & Data Population Script
 * Uploads and synchronizes all CA Foundation course data, acts, units, content items, resources,
 * catalog product, and subscription plan across MongoDB Atlas AND local JSON database.
 */

const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const mongoose = require("mongoose");
const { connectMongo, isConnected } = require("../db/mongo");
const Database = require("../db/database");

const Course = require("../models/Course");
const Act = require("../models/Act");
const Unit = require("../models/Unit");
const ContentItem = require("../models/ContentItem");
const Resource = require("../models/Resource");
const Product = require("../models/Product");
const Subscription = require("../models/Subscription");

// Helper to get file size in bytes
function getFileSize(fileName) {
  const possiblePaths = [
    path.join(__dirname, "../../../frontend/public/notes", fileName),
    path.join(__dirname, "../../../frontend/public/samples", fileName),
    path.join(__dirname, "../../uploads", fileName),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return fs.statSync(p).size;
    }
  }
  return 0;
}

async function seed() {
  console.log("=================================================");
  console.log("The Law Kaksha — CA Foundation Seeding Started");
  console.log("=================================================");

  try {
    await connectMongo();
  } catch (err) {
    console.warn("MongoDB connection warning:", err.message);
  }

  const mongoLive = isConnected();
  console.log(`Target Storage: ${mongoLive ? "MongoDB Atlas + Local JSON" : "Local JSON"}`);

  // 1. COURSE DEFINITION
  const caFoundationCourse = {
    id: "course-ca-foundation",
    title: "CA Foundation — Business Laws",
    slug: "ca-foundation-business-laws-monthly-access",
    availability: "live",
    price: 99,
    mrp: 299,
    accessDays: 30,
    description:
      "Comprehensive CA Foundation Paper 2 Business Laws master curriculum covering Indian Contract Act 1872, Sale of Goods Act 1930, Indian Partnership Act 1932, Limited Liability Partnership Act 2008, LDR Flowcharts, and Smart Question Banks.",
    thumbnail: "/assets/ca-cs-hero-books-sharp.png",
    kind: "core",
    is_active: true,
    order: 1,
    display_order: 1,
    exam_body: "ICAI",
    units_count: 22,
    highlights: [
      "Unit-wise detailed statutory notes & case studies",
      "LDR Flowcharts & visual infographic codices",
      "Smart revision question banks & practice sets",
      "RTP, MTP & past examination suggested answers",
      "In-web secure watermarked reader with zero downloads",
    ],
  };

  // 2. ACTS DEFINITION
  const acts = [
    {
      id: "act-contract",
      courseId: "course-ca-foundation",
      title: "The Indian Contract Act, 1872",
      availability: "live",
      order: 1,
      description:
        "Units 1 to 9 covering nature of contract, consideration, other essentials, performance, breach, contingent & quasi contracts, indemnity, guarantee, bailment, pledge & agency.",
    },
    {
      id: "act-soga",
      courseId: "course-ca-foundation",
      title: "The Sale of Goods Act, 1930",
      availability: "live",
      order: 2,
      description:
        "Units 1 to 4 covering formation of contract of sale, conditions & warranties, transfer of ownership & delivery of goods, and unpaid seller.",
    },
    {
      id: "act-partnership",
      courseId: "course-ca-foundation",
      title: "The Indian Partnership Act, 1932",
      availability: "live",
      order: 3,
      description:
        "Units 1 to 3 covering general nature of partnership, relations of partners, registration & dissolution of firm, with LDR charts & RTP/MTP practice questions.",
    },
    {
      id: "act-llp",
      courseId: "course-ca-foundation",
      title: "The Limited Liability Partnership Act, 2008",
      availability: "live",
      order: 4,
      description:
        "Salient features, incorporation, designated partners, financial disclosures, LDR flowchart book & infographics.",
    },
    {
      id: "act-qbank",
      courseId: "course-ca-foundation",
      title: "Smart Revision Question Banks",
      availability: "live",
      order: 5,
      description:
        "Comprehensive Part 1 and Part 2 Question Banks with exam-pattern practice questions, RTPs, MTPs & suggested answers.",
    },
  ];

  // 3. UNITS DEFINITION
  const units = [
    // --- Contract Act Units ---
    {
      id: "unit-contract-1",
      actId: "act-contract",
      title: "Unit 1: Nature of Contracts",
      order: 1,
      summary: "Essential elements of a contract, offer and acceptance, legal relationship, void and voidable agreements.",
    },
    {
      id: "unit-contract-2",
      actId: "act-contract",
      title: "Unit 2: Consideration",
      order: 2,
      summary: "Definition of consideration, legal rules regarding consideration, doctrine of privity of contract.",
    },
    {
      id: "unit-contract-3",
      actId: "act-contract",
      title: "Unit 3: Other Essential Elements of Contract",
      order: 3,
      summary: "Capacity of parties, free consent, coercion, undue influence, fraud, misrepresentation, mistake, lawful object.",
    },
    {
      id: "unit-contract-4",
      actId: "act-contract",
      title: "Unit 4: Performance of Contract",
      order: 4,
      summary: "By whom contracts must be performed, time and place of performance, reciprocal promises, appropriation.",
    },
    {
      id: "unit-contract-5",
      actId: "act-contract",
      title: "Unit 5: Breach of Contract and its Remedies",
      order: 5,
      summary: "Anticipatory breach, actual breach, compensation for loss or damage, liquidated damages and penalty.",
    },
    {
      id: "unit-contract-6",
      actId: "act-contract",
      title: "Unit 6: Contingent and Quasi Contracts",
      order: 6,
      summary: "Rules relating to enforcement of contingent contracts, quasi contracts, finder of lost goods, quantum meruit.",
    },
    {
      id: "unit-contract-7",
      actId: "act-contract",
      title: "Unit 7: Contract of Indemnity and Guarantee",
      order: 7,
      summary: "Rights of indemnity holder, nature and extent of surety's liability, continuing guarantee, discharge of surety.",
    },
    {
      id: "unit-contract-8",
      actId: "act-contract",
      title: "Unit 8: Bailment and Pledge",
      order: 8,
      summary: "Duties and rights of bailor and bailee, termination of bailment, finder of goods, pledge by non-owners.",
    },
    {
      id: "unit-contract-9",
      actId: "act-contract",
      title: "Unit 9: Agency",
      order: 9,
      summary: "Creation of agency, sub-agent and substituted agent, rights and duties of agent, termination of agency.",
    },
    {
      id: "unit-contract-supplementary",
      actId: "act-contract",
      title: "Contract Act: Flowcharts & Practice Questions",
      order: 10,
      summary: "LDR Flowchart book and comprehensive statutory practice questions.",
    },

    // --- SOGA Units ---
    {
      id: "unit-soga-1",
      actId: "act-soga",
      title: "Unit 1: Formation of the Contract of Sale",
      order: 1,
      summary: "Sale and agreement to sell, subject matter of contract of sale, price, ascertainment of price.",
    },
    {
      id: "unit-soga-2",
      actId: "act-soga",
      title: "Unit 2: Conditions & Warranties",
      order: 2,
      summary: "Stipulations as to time, condition and warranty, express and implied conditions and warranties, caveat emptor.",
    },
    {
      id: "unit-soga-3",
      actId: "act-soga",
      title: "Unit 3: Transfer of Ownership and Delivery of Goods",
      order: 3,
      summary: "Passing of property, sale by non-owners (nemo dat quod non habet), rules regarding delivery of goods.",
    },
    {
      id: "unit-soga-4",
      actId: "act-soga",
      title: "Unit 4: Unpaid Seller and his Rights",
      order: 4,
      summary: "Rights of unpaid seller against the goods (lien, stoppage in transit, resale), rights against buyer personally.",
    },

    // --- Partnership Act Units ---
    {
      id: "unit-partnership-1",
      actId: "act-partnership",
      title: "Unit 1: General Nature of a Partnership",
      order: 1,
      summary: "Definition of partnership, essential elements, true test of partnership, partnership vs other associations.",
    },
    {
      id: "unit-partnership-2",
      actId: "act-partnership",
      title: "Unit 2: Relations of Partners",
      order: 2,
      summary: "Rights and duties of partners, mutual agency, implied authority of partner, position of minor in partnership.",
    },
    {
      id: "unit-partnership-3",
      actId: "act-partnership",
      title: "Unit 3: Registration and Dissolution of a Firm",
      order: 3,
      summary: "Registration of firms, effects of non-registration, modes of dissolution of a firm, consequences of dissolution.",
    },
    {
      id: "unit-partnership-supplementary",
      actId: "act-partnership",
      title: "Partnership: Charts, Infographics & Questions",
      order: 4,
      summary: "LDR Charts, Infographics, Practice Questions and RTP/MTP/PYP Questions.",
    },

    // --- LLP Act Units ---
    {
      id: "unit-llp-1",
      actId: "act-llp",
      title: "Unit 1: The Limited Liability Partnership Act, 2008",
      order: 1,
      summary: "Salient features, incorporation, designated partners, partner's mutual rights and duties, conversion to LLP.",
    },
    {
      id: "unit-llp-supplementary",
      actId: "act-llp",
      title: "LLP: LDR Flowcharts, Infographics & Question Set",
      order: 2,
      summary: "LDR Flowchart book, infographics, and practice question sets.",
    },

    // --- Question Banks Units ---
    {
      id: "unit-qbank-part1",
      actId: "act-qbank",
      title: "Smart Revision Question Bank — Part 1",
      order: 1,
      summary: "Exam-oriented Question Bank covering Indian Contract Act & Sale of Goods Act with sample preview.",
    },
    {
      id: "unit-qbank-part2",
      actId: "act-qbank",
      title: "Smart Revision Question Bank — Part 2",
      order: 2,
      summary: "Exam-oriented Question Bank covering Partnership Act & LLP Act with sample preview.",
    },
  ];

  // 4. CONTENT ITEMS DEFINITION
  const contentItems = [
    // Contract Act Items
    {
      id: "ci-contract-unit-1",
      unitId: "unit-contract-1",
      type: "notes",
      title: "Unit 1 — Nature of Contracts (Detailed Notes)",
      fileName: "Unit 1 - Nature of Contracts.pdf",
      fileSize: getFileSize("Unit 1 - Nature of Contracts.pdf"),
      isSample: true,
      sampleFromPage: 1,
      sampleToPage: 5,
      isPublished: true,
      order: 1,
      description: "Comprehensive notes with statutory provisions, case law precedents, and diagrammatic explanations.",
    },
    {
      id: "ci-contract-unit-2",
      unitId: "unit-contract-2",
      type: "notes",
      title: "Unit 2 — Consideration (Notes)",
      fileName: "Unit 2 Consideration.pdf",
      fileSize: getFileSize("Unit 2 Consideration.pdf"),
      isSample: false,
      isPublished: true,
      order: 1,
      description: "Doctrine of privity of contract, exceptions to consideration rule, and legal rules.",
    },
    {
      id: "ci-contract-unit-3",
      unitId: "unit-contract-3",
      type: "notes",
      title: "Unit 3 — Other Essential Elements of Contract (Notes)",
      fileName: "Unit 3 Other essential Elements of Contract.pdf",
      fileSize: getFileSize("Unit 3 Other essential Elements of Contract.pdf"),
      isSample: false,
      isPublished: true,
      order: 1,
      description: "Capacity to contract, minor's agreements, free consent (coercion, undue influence, fraud, misrepresentation).",
    },
    {
      id: "ci-contract-unit-4",
      unitId: "unit-contract-4",
      type: "notes",
      title: "Unit 4 — Performance of Contract (Notes)",
      fileName: "Unit 4 Performance of Contract.pdf",
      fileSize: getFileSize("Unit 4 Performance of Contract.pdf"),
      isSample: false,
      isPublished: true,
      order: 1,
      description: "Reciprocal promises, time and place of performance, appropriation of payments.",
    },
    {
      id: "ci-contract-unit-5",
      unitId: "unit-contract-5",
      type: "notes",
      title: "Unit 5 — Breach of Contract (Notes)",
      fileName: "Unit 5 Breach of Contract.pdf",
      fileSize: getFileSize("Unit 5 Breach of Contract.pdf"),
      isSample: false,
      isPublished: true,
      order: 1,
      description: "Anticipatory & actual breach, Hadley v Baxendale rules, liquidated damages vs penalty.",
    },
    {
      id: "ci-contract-unit-6",
      unitId: "unit-contract-6",
      type: "notes",
      title: "Unit 6 — Contingent and Quasi Contract (Notes)",
      fileName: "Unit 6 Contingent and Quasi Contract.pdf",
      fileSize: getFileSize("Unit 6 Contingent and Quasi Contract.pdf"),
      isSample: false,
      isPublished: true,
      order: 1,
      description: "Rules for contingent contracts, quasi contracts, quantum meruit, finder of lost goods.",
    },
    {
      id: "ci-contract-unit-7",
      unitId: "unit-contract-7",
      type: "notes",
      title: "Unit 7 — Indemnity and Guarantee (Notes)",
      fileName: "Unit 7 Indemnity and Guarantee.pdf",
      fileSize: getFileSize("Unit 7 Indemnity and Guarantee.pdf"),
      isSample: false,
      isPublished: true,
      order: 1,
      description: "Rights of indemnity-holder, continuing guarantee, rights and discharge of surety.",
    },
    {
      id: "ci-contract-unit-8",
      unitId: "unit-contract-8",
      type: "notes",
      title: "Unit 8 — Bailment and Pledge (Notes)",
      fileName: "Unit 8 Bailment and Pledge.pdf",
      fileSize: getFileSize("Unit 8 Bailment and Pledge.pdf"),
      isSample: false,
      isPublished: true,
      order: 1,
      description: "Bailment duties, pledge by non-owners, rights of finder of goods.",
    },
    {
      id: "ci-contract-unit-9",
      unitId: "unit-contract-9",
      type: "notes",
      title: "Unit 9 — Agency (Notes)",
      fileName: "Unit 9 Agency.pdf",
      fileSize: getFileSize("Unit 9 Agency.pdf"),
      isSample: false,
      isPublished: true,
      order: 1,
      description: "Creation of agency, personal liability of agent, sub-agent vs substituted agent.",
    },
    {
      id: "ci-contract-ldr",
      unitId: "unit-contract-supplementary",
      type: "flowchart",
      title: "Indian Contract Act LDR Flowchart Book",
      fileName: "Indian_Contract_Act_LDR_Flowchart Book.pdf",
      fileSize: getFileSize("Indian_Contract_Act_LDR_Flowchart Book.pdf"),
      isSample: false,
      isPublished: true,
      order: 1,
      description: "Exam-eve visual mind maps and flowcharts for rapid revision of all 9 units.",
    },
    {
      id: "ci-contract-practice",
      unitId: "unit-contract-supplementary",
      type: "practice",
      title: "Indian Contract Act Practice Questions",
      fileName: "Indian Contract Act_Practice Questions.pdf",
      fileSize: getFileSize("Indian Contract Act_Practice Questions.pdf"),
      isSample: false,
      isPublished: true,
      order: 2,
      description: "Descriptive questions with ICAI 5-pillar model answers and scoring keywords.",
    },

    // SOGA Items
    {
      id: "ci-soga-unit-1",
      unitId: "unit-soga-1",
      type: "notes",
      title: "SOGA Unit 1 — Formation of Contract of Sale (Notes)",
      fileName: "SOGA Unit 1 .pdf",
      fileSize: getFileSize("SOGA Unit 1 .pdf"),
      isSample: true,
      sampleFromPage: 1,
      sampleToPage: 5,
      isPublished: true,
      order: 1,
      description: "Essentials of contract of sale, sale vs agreement to sell, destruction of goods.",
    },
    {
      id: "ci-soga-unit-2",
      unitId: "unit-soga-2",
      type: "notes",
      title: "SOGA Unit 2 — Conditions & Warranties (Notes)",
      fileName: "SOGA Unit 2.pdf",
      fileSize: getFileSize("SOGA Unit 2.pdf"),
      isSample: false,
      isPublished: true,
      order: 1,
      description: "Express and implied conditions, doctrine of caveat emptor and its modern exceptions.",
    },
    {
      id: "ci-soga-unit-3",
      unitId: "unit-soga-3",
      type: "notes",
      title: "SOGA Unit 3 — Transfer of Ownership & Delivery (Notes)",
      fileName: "SOGA Unit 3.pdf",
      fileSize: getFileSize("SOGA Unit 3.pdf"),
      isSample: false,
      isPublished: true,
      order: 1,
      description: "Passing of property in specific vs unascertained goods, nemo dat exceptions, delivery rules.",
    },
    {
      id: "ci-soga-unit-4",
      unitId: "unit-soga-4",
      type: "notes",
      title: "SOGA Unit 4 — Unpaid Seller (Notes)",
      fileName: "SOGA Unit 4.pdf",
      fileSize: getFileSize("SOGA Unit 4.pdf"),
      isSample: false,
      isPublished: true,
      order: 1,
      description: "Rights against goods (lien, stoppage in transit, resale), rights against buyer personally.",
    },

    // Partnership Act Items
    {
      id: "ci-partnership-unit-1",
      unitId: "unit-partnership-1",
      type: "notes",
      title: "Unit 1 — General Nature of Partnership (Notes)",
      fileName: "UNIT 1 GENERAL NATURE OF PARTNERSHIP.pdf",
      fileSize: getFileSize("UNIT 1 GENERAL NATURE OF PARTNERSHIP.pdf"),
      isSample: true,
      sampleFromPage: 1,
      sampleToPage: 5,
      isPublished: true,
      order: 1,
      description: "Definition of partnership, true test of partnership (KD Kamath case), types of partners.",
    },
    {
      id: "ci-partnership-unit-2",
      unitId: "unit-partnership-2",
      type: "notes",
      title: "Unit 2 — Relations of Partners (Notes)",
      fileName: "Unit 2 RELATIONS OF PARTNERS.pdf",
      fileSize: getFileSize("Unit 2 RELATIONS OF PARTNERS.pdf"),
      isSample: false,
      isPublished: true,
      order: 1,
      description: "Mutual rights and duties, implied authority, Section 30 minor admitted to benefits.",
    },
    {
      id: "ci-partnership-unit-3",
      unitId: "unit-partnership-3",
      type: "notes",
      title: "Unit 3 — Registration & Dissolution of Firm (Notes)",
      fileName: "Unit 3 REGISTRATION AND DISSOLUTION OF FIRM.pdf",
      fileSize: getFileSize("Unit 3 REGISTRATION AND DISSOLUTION OF FIRM.pdf"),
      isSample: false,
      isPublished: true,
      order: 1,
      description: "Effects of non-registration, compulsory vs voluntary dissolution, settlement of accounts.",
    },
    {
      id: "ci-partnership-ldr",
      unitId: "unit-partnership-supplementary",
      type: "flowchart",
      title: "Partnership LDR Charts",
      fileName: "Partnership LDR Charts.pdf",
      fileSize: getFileSize("Partnership LDR Charts.pdf"),
      isSample: false,
      isPublished: true,
      order: 1,
      description: "Exam-eve last day revision charts for the Indian Partnership Act.",
    },
    {
      id: "ci-partnership-infographics",
      unitId: "unit-partnership-supplementary",
      type: "revision",
      title: "Partnership Infographics",
      fileName: "Partnership Infogarphics.pdf",
      fileSize: getFileSize("Partnership Infogarphics.pdf"),
      isSample: false,
      isPublished: true,
      order: 2,
      description: "Visual infographic summaries of crucial partnership rules, rights, and liabilities.",
    },
    {
      id: "ci-partnership-practice",
      unitId: "unit-partnership-supplementary",
      type: "practice",
      title: "Indian Partnership Practice Questions — Law Kaksha",
      fileName: "Indian Partnership Practice Questions_Law Kaksha.pdf",
      fileSize: getFileSize("Indian Partnership Practice Questions_Law Kaksha.pdf"),
      isSample: false,
      isPublished: true,
      order: 3,
      description: "Case study scenarios and problem-based questions with model answers.",
    },
    {
      id: "ci-partnership-rtp-mtp-pyp",
      unitId: "unit-partnership-supplementary",
      type: "pyq",
      title: "Indian Partnership Act RTP, MTP, PYP Practice Questions",
      fileName: "_Indian Partnership Act, 1932 RTP, MTP, PYP Practice Questions.pdf",
      fileSize: getFileSize("_Indian Partnership Act, 1932 RTP, MTP, PYP Practice Questions.pdf"),
      isSample: false,
      isPublished: true,
      order: 4,
      description: "Past ICAI examination compilations with examiner scoring rubrics.",
    },

    // LLP Act Items
    {
      id: "ci-llp-notes",
      unitId: "unit-llp-1",
      type: "notes",
      title: "The Limited Liability Partnership Act, 2008 (Complete Notes)",
      fileName: "THE LIMITED LIABILITY PARTNERSHIP ACT, 2008.pdf",
      fileSize: getFileSize("THE LIMITED LIABILITY PARTNERSHIP ACT, 2008.pdf"),
      isSample: false,
      isPublished: true,
      order: 1,
      description: "Full statutory notes on LLP structure, incorporation, partners, and compliance.",
    },
    {
      id: "ci-llp-ldr",
      unitId: "unit-llp-supplementary",
      type: "flowchart",
      title: "LLP LDR Flowchart Book",
      fileName: "LDR_Flowchart_Book.pdf",
      fileSize: getFileSize("LDR_Flowchart_Book.pdf"),
      isSample: false,
      isPublished: true,
      order: 1,
      description: "Flowchart revision book for rapid memory retention of LLP provisions.",
    },
    {
      id: "ci-llp-infographics",
      unitId: "unit-llp-supplementary",
      type: "revision",
      title: "LLP Infographics",
      fileName: "LLP Infogarphics .pdf",
      fileSize: getFileSize("LLP Infogarphics .pdf"),
      isSample: false,
      isPublished: true,
      order: 2,
      description: "Visual infographics detailing LLP penalties, thresholds, and partner obligations.",
    },
    {
      id: "ci-llp-practice",
      unitId: "unit-llp-supplementary",
      type: "practice",
      title: "LLP Practice Question Set",
      fileName: "LLP Practice Question Set.pdf",
      fileSize: getFileSize("LLP Practice Question Set.pdf"),
      isSample: false,
      isPublished: true,
      order: 3,
      description: "Targeted question set covering high-frequency ICAI exam questions.",
    },

    // Question Bank Items
    {
      id: "ci-qbank-part1-final",
      unitId: "unit-qbank-part1",
      type: "practice",
      title: "Question Bank Part 1 — Final Copy",
      fileName: "Question Bank_Part1 Final Copy.pdf",
      fileSize: getFileSize("Question Bank_Part1 Final Copy.pdf"),
      isSample: false,
      isPublished: true,
      order: 1,
      description: "Complete final edition of Part 1 Question Bank covering Contract Act & Sale of Goods Act.",
    },
    {
      id: "ci-qbank-part1-sample",
      unitId: "unit-qbank-part1",
      type: "practice",
      title: "Question Bank Part 1 — Free Sample Copy",
      fileName: "Question Bank Part 1- Sample Copy.pdf",
      fileSize: getFileSize("Question Bank Part 1- Sample Copy.pdf"),
      isSample: true,
      sampleFromPage: 1,
      sampleToPage: 10,
      isPublished: true,
      order: 2,
      description: "Official free sample preview copy of Smart Revision Question Bank Part 1.",
    },
    {
      id: "ci-qbank-part2-final",
      unitId: "unit-qbank-part2",
      type: "practice",
      title: "Question Bank Part 2 — Final Copy",
      fileName: "Question Bank Part 2_Final Copy.pdf",
      fileSize: getFileSize("Question Bank Part 2_Final Copy.pdf"),
      isSample: false,
      isPublished: true,
      order: 1,
      description: "Complete final edition of Part 2 Question Bank covering Partnership Act & LLP Act.",
    },
    {
      id: "ci-qbank-part2-sample",
      unitId: "unit-qbank-part2",
      type: "practice",
      title: "Question Bank Part 2 — Free Sample Copy",
      fileName: "Part 2_Sample Copy.pdf",
      fileSize: getFileSize("Part 2_Sample Copy.pdf"),
      isSample: true,
      sampleFromPage: 1,
      sampleToPage: 10,
      isPublished: true,
      order: 2,
      description: "Official free sample preview copy of Smart Revision Question Bank Part 2.",
    },
  ];

  // 5. RESOURCES DEFINITION (Manageable in Admin Dashboard)
  const resources = [
    {
      id: "res-ca-qbank-part1-sample",
      course_id: "course-ca-foundation",
      course: "ca-foundation",
      actName: "Indian Contract Act & SOGA",
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
      course_id: "course-ca-foundation",
      course: "ca-foundation",
      actName: "Partnership Act & LLP",
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
      id: "res-ca-contract-unit1",
      course_id: "course-ca-foundation",
      course: "ca-foundation",
      actName: "The Indian Contract Act, 1872",
      chapterNumber: 1,
      title: "Unit 1: Nature of Contracts (Sample Notes)",
      type: "notes",
      file_or_url: "/notes/Unit 1 - Nature of Contracts.pdf",
      pdfUrl: "/notes/Unit 1 - Nature of Contracts.pdf",
      samplePdfUrl: "/notes/Unit 1 - Nature of Contracts.pdf?sample=true",
      description: "Essential elements of a contract, offer and acceptance with landmark judicial rulings.",
      isSample: true,
      status: "Published",
      display_order: 3,
      order: 3,
      is_active: true,
      pages: "35 Pages",
      previewPagesLimit: 5,
    },
    {
      id: "res-ca-soga-unit1",
      course_id: "course-ca-foundation",
      course: "ca-foundation",
      actName: "The Sale of Goods Act, 1930",
      chapterNumber: 2,
      title: "SOGA Unit 1: Formation of Contract of Sale (Sample Notes)",
      type: "notes",
      file_or_url: "/notes/SOGA Unit 1 .pdf",
      pdfUrl: "/notes/SOGA Unit 1 .pdf",
      samplePdfUrl: "/notes/SOGA Unit 1 .pdf?sample=true",
      description: "Sale vs agreement to sell, contract formation, ascertainment of price.",
      isSample: true,
      status: "Published",
      display_order: 4,
      order: 4,
      is_active: true,
      pages: "25 Pages",
      previewPagesLimit: 5,
    },
    {
      id: "res-ca-partnership-unit1",
      course_id: "course-ca-foundation",
      course: "ca-foundation",
      actName: "The Indian Partnership Act, 1932",
      chapterNumber: 3,
      title: "Unit 1: General Nature of Partnership (Sample Notes)",
      type: "notes",
      file_or_url: "/notes/UNIT 1 GENERAL NATURE OF PARTNERSHIP.pdf",
      pdfUrl: "/notes/UNIT 1 GENERAL NATURE OF PARTNERSHIP.pdf",
      samplePdfUrl: "/notes/UNIT 1 GENERAL NATURE OF PARTNERSHIP.pdf?sample=true",
      description: "Definition of partnership, essential elements and true test of mutual agency.",
      isSample: true,
      status: "Published",
      display_order: 5,
      order: 5,
      is_active: true,
      pages: "12 Pages",
      previewPagesLimit: 5,
    },
    {
      id: "res-ca-contract-ldr",
      course_id: "course-ca-foundation",
      course: "ca-foundation",
      actName: "The Indian Contract Act, 1872",
      chapterNumber: 1,
      title: "Indian Contract Act LDR Flowchart Book",
      type: "flowchart",
      file_or_url: "/notes/Indian_Contract_Act_LDR_Flowchart Book.pdf",
      pdfUrl: "/notes/Indian_Contract_Act_LDR_Flowchart Book.pdf",
      samplePdfUrl: "/notes/Indian_Contract_Act_LDR_Flowchart Book.pdf?sample=true",
      description: "Complete visual LDR flowchart book for all 9 units of the Indian Contract Act.",
      isSample: false,
      status: "Published",
      display_order: 6,
      order: 6,
      is_active: true,
      pages: "LDR Book",
      previewPagesLimit: 5,
    },
    {
      id: "res-ca-contract-practice",
      course_id: "course-ca-foundation",
      course: "ca-foundation",
      actName: "The Indian Contract Act, 1872",
      chapterNumber: 1,
      title: "Indian Contract Act Practice Questions",
      type: "practice",
      file_or_url: "/notes/Indian Contract Act_Practice Questions.pdf",
      pdfUrl: "/notes/Indian Contract Act_Practice Questions.pdf",
      samplePdfUrl: "/notes/Indian Contract Act_Practice Questions.pdf?sample=true",
      description: "Exam-oriented statutory practice questions with step-wise model answers.",
      isSample: false,
      status: "Published",
      display_order: 7,
      order: 7,
      is_active: true,
      pages: "Practice Set",
      previewPagesLimit: 5,
    },
    {
      id: "res-ca-partnership-ldr",
      course_id: "course-ca-foundation",
      course: "ca-foundation",
      actName: "The Indian Partnership Act, 1932",
      chapterNumber: 3,
      title: "Partnership LDR Charts",
      type: "flowchart",
      file_or_url: "/notes/Partnership LDR Charts.pdf",
      pdfUrl: "/notes/Partnership LDR Charts.pdf",
      samplePdfUrl: "/notes/Partnership LDR Charts.pdf?sample=true",
      description: "Quick revision charts for partners' mutual rights, implied authority, and firm dissolution.",
      isSample: false,
      status: "Published",
      display_order: 8,
      order: 8,
      is_active: true,
      pages: "LDR Charts",
      previewPagesLimit: 5,
    },
    {
      id: "res-ca-partnership-infographics",
      course_id: "course-ca-foundation",
      course: "ca-foundation",
      actName: "The Indian Partnership Act, 1932",
      chapterNumber: 3,
      title: "Partnership Infographics",
      type: "infographic",
      file_or_url: "/notes/Partnership Infogarphics.pdf",
      pdfUrl: "/notes/Partnership Infogarphics.pdf",
      samplePdfUrl: "/notes/Partnership Infogarphics.pdf?sample=true",
      description: "Visual infographics depicting complex partnership sections and exceptions.",
      isSample: false,
      status: "Published",
      display_order: 9,
      order: 9,
      is_active: true,
      pages: "Infographics",
      previewPagesLimit: 5,
    },
    {
      id: "res-ca-partnership-questions",
      course_id: "course-ca-foundation",
      course: "ca-foundation",
      actName: "The Indian Partnership Act, 1932",
      chapterNumber: 3,
      title: "Indian Partnership Practice Questions — Law Kaksha",
      type: "practice",
      file_or_url: "/notes/Indian Partnership Practice Questions_Law Kaksha.pdf",
      pdfUrl: "/notes/Indian Partnership Practice Questions_Law Kaksha.pdf",
      samplePdfUrl: "/notes/Indian Partnership Practice Questions_Law Kaksha.pdf?sample=true",
      description: "Handcrafted practice questions reflecting ICAI new examination guidelines.",
      isSample: false,
      status: "Published",
      display_order: 10,
      order: 10,
      is_active: true,
      pages: "Practice Questions",
      previewPagesLimit: 5,
    },
    {
      id: "res-ca-partnership-rtp",
      course_id: "course-ca-foundation",
      course: "ca-foundation",
      actName: "The Indian Partnership Act, 1932",
      chapterNumber: 3,
      title: "Indian Partnership Act RTP, MTP, PYP Practice Questions",
      type: "pyq",
      file_or_url: "/notes/_Indian Partnership Act, 1932 RTP, MTP, PYP Practice Questions.pdf",
      pdfUrl: "/notes/_Indian Partnership Act, 1932 RTP, MTP, PYP Practice Questions.pdf",
      samplePdfUrl: "/notes/_Indian Partnership Act, 1932 RTP, MTP, PYP Practice Questions.pdf?sample=true",
      description: "Curated RTP, MTP and past exam question compilation with examiner notes.",
      isSample: false,
      status: "Published",
      display_order: 11,
      order: 11,
      is_active: true,
      pages: "Past Papers",
      previewPagesLimit: 5,
    },
    {
      id: "res-ca-llp-notes",
      course_id: "course-ca-foundation",
      course: "ca-foundation",
      actName: "The Limited Liability Partnership Act, 2008",
      chapterNumber: 4,
      title: "The Limited Liability Partnership Act, 2008 (Full Notes)",
      type: "notes",
      file_or_url: "/notes/THE LIMITED LIABILITY PARTNERSHIP ACT, 2008.pdf",
      pdfUrl: "/notes/THE LIMITED LIABILITY PARTNERSHIP ACT, 2008.pdf",
      samplePdfUrl: "/notes/THE LIMITED LIABILITY PARTNERSHIP ACT, 2008.pdf?sample=true",
      description: "Exhaustive statutory notes on LLP structure, incorporation, partners, and filings.",
      isSample: false,
      status: "Published",
      display_order: 12,
      order: 12,
      is_active: true,
      pages: "Complete Notes",
      previewPagesLimit: 5,
    },
    {
      id: "res-ca-llp-ldr",
      course_id: "course-ca-foundation",
      course: "ca-foundation",
      actName: "The Limited Liability Partnership Act, 2008",
      chapterNumber: 4,
      title: "LLP LDR Flowchart Book",
      type: "flowchart",
      file_or_url: "/notes/LDR_Flowchart_Book.pdf",
      pdfUrl: "/notes/LDR_Flowchart_Book.pdf",
      samplePdfUrl: "/notes/LDR_Flowchart_Book.pdf?sample=true",
      description: "LLP Last Day Revision flowchart codex.",
      isSample: false,
      status: "Published",
      display_order: 13,
      order: 13,
      is_active: true,
      pages: "LDR Book",
      previewPagesLimit: 5,
    },
    {
      id: "res-ca-llp-infographics",
      course_id: "course-ca-foundation",
      course: "ca-foundation",
      actName: "The Limited Liability Partnership Act, 2008",
      chapterNumber: 4,
      title: "LLP Infographics",
      type: "infographic",
      file_or_url: "/notes/LLP Infogarphics .pdf",
      pdfUrl: "/notes/LLP Infogarphics .pdf",
      samplePdfUrl: "/notes/LLP Infogarphics .pdf?sample=true",
      description: "Visual infographics on LLP legal requirements and partner rules.",
      isSample: false,
      status: "Published",
      display_order: 14,
      order: 14,
      is_active: true,
      pages: "Infographics",
      previewPagesLimit: 5,
    },
    {
      id: "res-ca-llp-practice",
      course_id: "course-ca-foundation",
      course: "ca-foundation",
      actName: "The Limited Liability Partnership Act, 2008",
      chapterNumber: 4,
      title: "LLP Practice Question Set",
      type: "practice",
      file_or_url: "/notes/LLP Practice Question Set.pdf",
      pdfUrl: "/notes/LLP Practice Question Set.pdf",
      samplePdfUrl: "/notes/LLP Practice Question Set.pdf?sample=true",
      description: "Exam-oriented practice questions on LLP provisions.",
      isSample: false,
      status: "Published",
      display_order: 15,
      order: 15,
      is_active: true,
      pages: "Practice Set",
      previewPagesLimit: 5,
    },
    {
      id: "res-ca-qbank-part1-final",
      course_id: "course-ca-foundation",
      course: "ca-foundation",
      actName: "Smart Revision Question Banks",
      chapterNumber: 5,
      title: "Smart Revision Question Bank Part 1 (Final Copy)",
      type: "practice",
      file_or_url: "/notes/Question Bank_Part1 Final Copy.pdf",
      pdfUrl: "/notes/Question Bank_Part1 Final Copy.pdf",
      samplePdfUrl: "/samples/Question Bank Part 1- Sample Copy.pdf",
      description: "Full final edition of Part 1 Question Bank covering Contract Act & Sale of Goods Act.",
      isSample: false,
      status: "Published",
      display_order: 16,
      order: 16,
      is_active: true,
      pages: "Complete Codex",
      previewPagesLimit: 5,
    },
    {
      id: "res-ca-qbank-part2-final",
      course_id: "course-ca-foundation",
      course: "ca-foundation",
      actName: "Smart Revision Question Banks",
      chapterNumber: 5,
      title: "Smart Revision Question Bank Part 2 (Final Copy)",
      type: "practice",
      file_or_url: "/notes/Question Bank Part 2_Final Copy.pdf",
      pdfUrl: "/notes/Question Bank Part 2_Final Copy.pdf",
      samplePdfUrl: "/samples/Part 2_Sample Copy.pdf",
      description: "Full final edition of Part 2 Question Bank covering Partnership Act & LLP Act.",
      isSample: false,
      status: "Published",
      display_order: 17,
      order: 17,
      is_active: true,
      pages: "Complete Codex",
      previewPagesLimit: 5,
    },
  ];

  // 6. PRODUCT DEFINITION (For Catalog & Course Box Free Sample)
  const product = {
    id: "course-ca-foundation",
    title: "CA Foundation Business Laws",
    subtitle: "Paper 2 Master Codex & Complete Notes",
    category: "CA Foundation",
    format: "Digital Codex (In-Web DRM)",
    price: 99,
    originalPrice: 299,
    pages: "350+ Pages",
    status: "Active",
    pdfUrl: "/samples/Question Bank Part 1- Sample Copy.pdf", // Accessible directly from course box
    description:
      "Complete CA Foundation Business Laws curriculum including Indian Contract Act, Sale of Goods Act, Partnership Act, LLP Act, LDR Flowcharts & Question Banks.",
    units: [
      "The Indian Contract Act, 1872",
      "The Sale of Goods Act, 1930",
      "The Indian Partnership Act, 1932",
      "The Limited Liability Partnership Act, 2008",
      "Smart Revision Question Banks",
    ],
    highlights: [
      "All 4 Acts + Question Banks Included",
      "Unit-wise Detailed Notes & Flowcharts",
      "Interactive DRM Protected In-Web Reader",
      "Model Answers & Exam Practice Questions",
    ],
    cover_image: "/covers/ca-foundation-cover.jpg",
    isSample: true,
    previewPagesLimit: 10,
    samplePagesRange: "1-10",
  };

  // 7. SUBSCRIPTION PLAN DEFINITION
  const subscriptionPlan = {
    id: "sub-ca-foundation-monthly",
    title: "CA Foundation Business Laws Monthly Pass",
    slug: "ca-foundation-business-laws-monthly-access",
    short_desc: "All-Inclusive 30-Day Access to CA Foundation Paper 2 Business Laws",
    description:
      "Full access to all 4 Acts, 22 Units, Flowcharts, Infographics, Practice Questions and Question Banks.",
    price: 99,
    mrp: 299,
    duration_days: 30,
    thumbnail: "/assets/ca-cs-hero-books-sharp.png",
    features: [
      "Full access to Indian Contract Act (9 Units)",
      "Full access to Sale of Goods Act (4 Units)",
      "Full access to Indian Partnership Act (3 Units)",
      "Full access to Limited Liability Partnership Act",
      "LDR Flowchart Books & Infographics",
      "Smart Revision Question Banks Part 1 & Part 2",
      "In-web secure reader with progress tracking",
    ],
    course_ids: ["course-ca-foundation"],
    display_order: 1,
    is_active: true,
  };

  // =========================================================================
  // PERSISTENCE EXECUTION
  // =========================================================================

  // A. MongoDB Atlas
  if (mongoLive) {
    console.log("\n[MongoDB Atlas] Writing entities...");
    await Course.deleteMany({ id: caFoundationCourse.id });
    await Course.create(caFoundationCourse);
    console.log("✓ Course inserted in Mongo");

    await Act.deleteMany({ courseId: caFoundationCourse.id });
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
    await Resource.deleteMany({ $or: [{ id: { $in: resIds } }, { course_id: caFoundationCourse.id }] });
    await Resource.insertMany(resources);
    console.log(`✓ ${resources.length} Resources inserted in Mongo`);

    await Product.deleteMany({ id: product.id });
    await Product.create(product);
    console.log("✓ Product inserted in Mongo");

    await Subscription.deleteMany({ id: subscriptionPlan.id });
    await Subscription.create(subscriptionPlan);
    console.log("✓ Subscription Plan inserted in Mongo");
  }

  // B. Local JSON Database
  console.log("\n[Local JSON DB] Writing entities...");
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
  db.courses = (db.courses || []).filter((c) => c.id !== caFoundationCourse.id);
  db.courses.push(caFoundationCourse);

  const actIdSet = new Set(acts.map((a) => a.id));
  db.acts = (db.acts || []).filter((a) => !actIdSet.has(a.id) && a.courseId !== caFoundationCourse.id);
  db.acts.push(...acts);

  const unitIdSet = new Set(units.map((u) => u.id));
  db.units = (db.units || []).filter((u) => !unitIdSet.has(u.id) && !actIdSet.has(u.actId));
  db.units.push(...units);

  const ciIdSet = new Set(contentItems.map((c) => c.id));
  db.content_items = (db.content_items || []).filter((c) => !ciIdSet.has(c.id) && !unitIdSet.has(c.unitId));
  db.content_items.push(...contentItems);

  const resIdSet = new Set(resources.map((r) => r.id));
  db.resources = (db.resources || []).filter((r) => !resIdSet.has(r.id) && r.course_id !== caFoundationCourse.id);
  db.resources.push(...resources);

  db.products = (db.products || []).filter((p) => p.id !== product.id);
  db.products.push(product);

  db.subscription_plans = (db.subscription_plans || []).filter((s) => s.id !== subscriptionPlan.id);
  db.subscription_plans.push(subscriptionPlan);

  db.subscriptions = (db.subscriptions || []).filter((s) => s.id !== subscriptionPlan.id);
  db.subscriptions.push(subscriptionPlan);

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
  console.log("✓ All entities saved to lawkaksha_db.json");

  console.log("\n=================================================");
  console.log("CA Foundation Seed Completed Successfully!");
  console.log(`- Course: ${caFoundationCourse.title}`);
  console.log(`- Acts: ${acts.length}`);
  console.log(`- Units: ${units.length}`);
  console.log(`- Content Items: ${contentItems.length}`);
  console.log(`- Resources: ${resources.length}`);
  console.log(`- Free Sample PDF: ${product.pdfUrl}`);
  console.log("=================================================");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed with error:", err);
  process.exit(1);
});
