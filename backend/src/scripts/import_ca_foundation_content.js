/**
 * CA Foundation content importer.
 *
 * Uploads the approved Drive PDFs to Cloudinary and creates/updates the
 * course -> act -> unit -> content-item hierarchy plus act-wise resources.
 *
 * Dry run by default. Pass --apply to upload files and write data.
 *
 * Usage:
 *   node src/scripts/import_ca_foundation_content.js --source "path/to/drive-copy"
 *   node src/scripts/import_ca_foundation_content.js --source "path/to/drive-copy" --apply
 */

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

const Database = require("../db/database");
const { connectMongo, isConnected, mongoose } = require("../db/mongo");
const { uploadToStorage } = require("../utils/cloudinary");

const Course = require("../models/Course");
const Act = require("../models/Act");
const Unit = require("../models/Unit");
const ContentItem = require("../models/ContentItem");
const Resource = require("../models/Resource");

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const FORCE_UPLOAD = args.includes("--force-upload");
const sourceIndex = args.indexOf("--source");
const SOURCE_ROOT = path.resolve(
  sourceIndex >= 0 && args[sourceIndex + 1]
    ? args[sourceIndex + 1]
    : path.join(__dirname, "../../import-assets/ca-foundation")
);
const STATE_FILE = path.join(__dirname, "../../data/ca_foundation_import_state.json");

const COURSE_ID = "course-ca-foundation";
const CSEET_COURSE_ID = "course-cseet";

const courseData = {
  id: COURSE_ID,
  title: "CA Foundation Business Laws",
  slug: "ca-foundation-business-laws",
  availability: "live",
  price: 99,
  mrp: 299,
  accessDays: 30,
  description:
    "Complete CA Foundation Paper 2 Business Laws preparation with unit-wise notes, act-wise practice questions, LDR flowcharts, infographics and full question bank.",
  thumbnail: "/assets/ca-cs-hero-books-sharp.png",
  kind: "core",
  is_active: true,
  order: 1,
  display_order: 1,
  exam_body: "ICAI",
  units_count: 8,
  highlights: [
    "Unit-wise notes for Sale of Goods, Partnership and LLP",
    "Act-wise practice questions, PYQs, LDR charts and infographics",
    "Question Bank Part 1 and Part 2 with detailed solutions",
    "Companies Act and Negotiable Instruments Act coming soon",
  ],
};

const cseetCourseData = {
  id: CSEET_COURSE_ID,
  title: "CSEET Business Laws and Management",
  slug: "cseet-business-laws-management",
  availability: "coming_soon",
  price: 99,
  mrp: 299,
  accessDays: 30,
  description:
    "CSEET Business Laws and Management preparation platform. Unit-wise notes and practice will be released soon.",
  thumbnail: "/assets/ca-cs-hero-books-sharp.png",
  kind: "core",
  is_active: true,
  order: 2,
  display_order: 2,
  exam_body: "ICSI",
  units_count: 0,
  highlights: [
    "Business Laws and Management syllabus coverage",
    "Unit-wise notes and practice questions",
    "Launching soon",
  ],
};

const acts = [
  {
    id: "act-ca-contract",
    courseId: COURSE_ID,
    title: "The Indian Contract Act, 1872",
    availability: "coming_soon",
    order: 1,
    description: "Coming soon. The nine unit notes will be added when supplied.",
  },
  {
    id: "act-ca-soga",
    courseId: COURSE_ID,
    title: "The Sale of Goods Act, 1930",
    availability: "live",
    order: 2,
    description: "Formation, conditions and warranties, transfer of ownership and unpaid seller.",
  },
  {
    id: "act-ca-partnership",
    courseId: COURSE_ID,
    title: "The Indian Partnership Act, 1932",
    availability: "live",
    order: 3,
    description: "Nature of partnership, relations of partners, registration and dissolution.",
  },
  {
    id: "act-ca-llp",
    courseId: COURSE_ID,
    title: "The Limited Liability Partnership Act, 2008",
    availability: "live",
    order: 4,
    description: "Complete LLP Act notes, practice questions, LDR flowcharts and infographics.",
  },
  {
    id: "act-ca-companies",
    courseId: COURSE_ID,
    title: "The Companies Act, 2013",
    availability: "coming_soon",
    order: 5,
    description: "Coming soon.",
  },
  {
    id: "act-ca-negotiable",
    courseId: COURSE_ID,
    title: "The Negotiable Instruments Act, 1881",
    availability: "coming_soon",
    order: 6,
    description: "Coming soon.",
  },
];

const units = [
  {
    id: "unit-ca-soga-1",
    actId: "act-ca-soga",
    title: "Unit 1: Formation of Contract of Sale",
    order: 1,
    summary: "Purpose of the Act, contract of sale, agreement to sell and essential elements.",
  },
  {
    id: "unit-ca-soga-2",
    actId: "act-ca-soga",
    title: "Unit 2: Conditions and Warranties",
    order: 2,
    summary: "Stipulations as to time, conditions, warranties and caveat emptor.",
  },
  {
    id: "unit-ca-soga-3",
    actId: "act-ca-soga",
    title: "Unit 3: Transfer of Ownership and Delivery of Goods",
    order: 3,
    summary: "Passing of property, risk, delivery and acceptance of goods.",
  },
  {
    id: "unit-ca-soga-4",
    actId: "act-ca-soga",
    title: "Unit 4: Unpaid Seller",
    order: 4,
    summary: "Rights of an unpaid seller, lien, stoppage in transit and resale.",
  },
  {
    id: "unit-ca-partnership-1",
    actId: "act-ca-partnership",
    title: "Unit 1: General Nature of Partnership",
    order: 1,
    summary: "Definition, essential elements, true test and types of partners.",
  },
  {
    id: "unit-ca-partnership-2",
    actId: "act-ca-partnership",
    title: "Unit 2: Relations of Partners",
    order: 2,
    summary: "Mutual rights and duties, authority, liability and reconstitution.",
  },
  {
    id: "unit-ca-partnership-3",
    actId: "act-ca-partnership",
    title: "Unit 3: Registration and Dissolution of Firm",
    order: 3,
    summary: "Registration, effects of non-registration, dissolution and settlement of accounts.",
  },
  {
    id: "unit-ca-llp-1",
    actId: "act-ca-llp",
    title: "Unit 1: Complete LLP Act, 2008",
    order: 1,
    summary: "LLP architecture, incorporation, partners, governance and conversion.",
  },
];

const contentItems = [
  {
    id: "item-ca-soga-notes-1",
    unitId: "unit-ca-soga-1",
    title: "Unit 1: Formation of Contract of Sale",
    type: "notes",
    order: 1,
    file: "SOGA/SOGA Unit 1 .pdf",
    compressedFile: "_compressed/SOGA Unit 1.pdf",
  },
  {
    id: "item-ca-soga-notes-2",
    unitId: "unit-ca-soga-2",
    title: "Unit 2: Conditions and Warranties",
    type: "notes",
    order: 1,
    file: "SOGA/SOGA Unit 2.pdf",
  },
  {
    id: "item-ca-soga-notes-3",
    unitId: "unit-ca-soga-3",
    title: "Unit 3: Transfer of Ownership and Delivery of Goods",
    type: "notes",
    order: 1,
    file: "SOGA/SOGA Unit 3.pdf",
  },
  {
    id: "item-ca-soga-notes-4",
    unitId: "unit-ca-soga-4",
    title: "Unit 4: Unpaid Seller",
    type: "notes",
    order: 1,
    file: "SOGA/SOGA Unit 4.pdf",
  },
  {
    id: "item-ca-partnership-notes-1",
    unitId: "unit-ca-partnership-1",
    title: "Unit 1: General Nature of Partnership",
    type: "notes",
    order: 1,
    file: "Indian Partnership Act/UNIT 1 GENERAL NATURE OF PARTNERSHIP.pdf",
  },
  {
    id: "item-ca-partnership-notes-2",
    unitId: "unit-ca-partnership-2",
    title: "Unit 2: Relations of Partners",
    type: "notes",
    order: 1,
    file: "Indian Partnership Act/Unit 2 RELATIONS OF PARTNERS.pdf",
  },
  {
    id: "item-ca-partnership-notes-3",
    unitId: "unit-ca-partnership-3",
    title: "Unit 3: Registration and Dissolution of Firm",
    type: "notes",
    order: 1,
    file: "Indian Partnership Act/Unit 3 REGISTRATION AND DISSOLUTION OF FIRM.pdf",
  },
  {
    id: "item-ca-llp-notes-1",
    unitId: "unit-ca-llp-1",
    title: "Complete LLP Act, 2008 Notes",
    type: "notes",
    order: 1,
    file: "LLP/THE LIMITED LIABILITY PARTNERSHIP ACT, 2008.pdf",
  },
];

const resources = [
  {
    id: "res-ca-partnership-practice",
    actName: "The Indian Partnership Act, 1932",
    chapterNumber: 1,
    type: "practice",
    title: "Indian Partnership Act — Practice Questions",
    description: "Chapter-wise practice questions and case problems for the Indian Partnership Act, 1932.",
    pages: "34 Pages",
    order: 1,
    file: "Indian Partnership Act/Indian Partnership Practice Questions_Law Kaksha.pdf",
  },
  {
    id: "res-ca-partnership-pyq",
    actName: "The Indian Partnership Act, 1932",
    chapterNumber: 1,
    type: "pyq",
    title: "Indian Partnership Act — RTP, MTP and Past Year Questions",
    description: "RTP, MTP and past-year question practice for the Indian Partnership Act, 1932.",
    pages: "16 Pages",
    order: 2,
    file: "Indian Partnership Act/_Indian Partnership Act, 1932 RTP, MTP, PYP Practice Questions.pdf",
  },
  {
    id: "res-ca-partnership-ldr",
    actName: "The Indian Partnership Act, 1932",
    chapterNumber: 1,
    type: "ldr",
    title: "Partnership Act — LDR Flowcharts",
    description: "Last Day Revision flowcharts for the Indian Partnership Act, 1932.",
    pages: "47 Pages",
    order: 3,
    file: "Indian Partnership Act/Partnership LDR Charts.pdf",
  },
  {
    id: "res-ca-partnership-infographic",
    actName: "The Indian Partnership Act, 1932",
    chapterNumber: 1,
    type: "infographic",
    title: "Partnership Act — Infographics",
    description: "Visual infographics and concept maps for the Indian Partnership Act, 1932.",
    pages: "10 Infographic Sheets",
    order: 4,
    file: "Indian Partnership Act/Partnership Infogarphics.pdf",
  },
  {
    id: "res-ca-llp-practice",
    actName: "The Limited Liability Partnership Act, 2008",
    chapterNumber: 1,
    type: "practice",
    title: "LLP Act — Practice Question Set",
    description: "Practice question set for the Limited Liability Partnership Act, 2008.",
    pages: "10 Pages",
    order: 1,
    file: "LLP/LLP Practice Question Set.pdf",
  },
  {
    id: "res-ca-llp-ldr",
    actName: "The Limited Liability Partnership Act, 2008",
    chapterNumber: 1,
    type: "ldr",
    title: "LLP Act — LDR Flowchart Book",
    description: "Last Day Revision flowcharts for the Limited Liability Partnership Act, 2008.",
    pages: "36 Pages",
    order: 2,
    file: "LLP/LDR_Flowchart_Book.pdf",
  },
  {
    id: "res-ca-llp-infographic",
    actName: "The Limited Liability Partnership Act, 2008",
    chapterNumber: 1,
    type: "infographic",
    title: "LLP Act — Infographics",
    description: "Visual infographic charts for the Limited Liability Partnership Act, 2008.",
    pages: "5 Infographic Sheets",
    order: 3,
    file: "LLP/LLP Infogarphics .pdf",
    compressedFile: "_compressed/LLP Infographics.pdf",
  },
  {
    id: "res-ca-qb-part1-sample",
    actName: "CA Foundation Business Laws — Full Syllabus",
    chapterNumber: 7,
    type: "practice",
    title: "Question Bank Part 1 — Free Sample",
    description: "Free sample of the CA Foundation Business Laws Question Bank Part 1.",
    pages: "31 Pages",
    order: 1,
    isSample: true,
    file: "Question Bank FINAL pdf/Question Bank Part 1- Sample Copy.pdf",
  },
  {
    id: "res-ca-qb-part1",
    actName: "CA Foundation Business Laws — Full Syllabus",
    chapterNumber: 7,
    type: "practice",
    title: "Question Bank Part 1 — Full Edition",
    description: "Full CA Foundation Business Laws Question Bank Part 1 with detailed solutions.",
    pages: "148 Pages",
    order: 2,
    file: "Question Bank FINAL pdf/Question Bank_Part1 Final Copy.pdf",
  },
  {
    id: "res-ca-qb-part2-sample",
    actName: "CA Foundation Business Laws — Full Syllabus",
    chapterNumber: 8,
    type: "practice",
    title: "Question Bank Part 2 — Free Sample",
    description: "Free sample of the CA Foundation Business Laws Question Bank Part 2.",
    pages: "45 Pages",
    order: 3,
    isSample: true,
    file: "Question Bank FINAL pdf/Part 2_Sample Copy.pdf",
  },
  {
    id: "res-ca-qb-part2",
    actName: "CA Foundation Business Laws — Full Syllabus",
    chapterNumber: 8,
    type: "practice",
    title: "Question Bank Part 2 — Full Edition",
    description: "Full CA Foundation Business Laws Question Bank Part 2 with detailed solutions.",
    pages: "197 Pages",
    order: 4,
    file: "Question Bank FINAL pdf/Question Bank Part 2_Final Copy.pdf",
  },
];

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch (_) {
    return {};
  }
}

function saveState(state) {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf8");
}

function localUpsert(tableName, record) {
  const table = Database.table(tableName);
  if (table.findOne((item) => item.id === record.id)) {
    table.update(record.id, record);
  } else {
    table.insert(record);
  }
}

async function mongoUpsert(Model, record) {
  if (!isConnected()) return null;
  return Model.findOneAndUpdate(
    { id: record.id },
    { $set: record },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function uploadPdf(state, key, relativePath, compressedPath) {
  if (!FORCE_UPLOAD && state[key]?.publicId) {
    console.log(`[reuse] ${key} -> ${state[key].publicId}`);
    return state[key];
  }

  const compressedAbsolute = compressedPath ? path.join(SOURCE_ROOT, compressedPath) : null;
  const absolute = compressedAbsolute && fs.existsSync(compressedAbsolute)
    ? compressedAbsolute
    : path.join(SOURCE_ROOT, relativePath);

  if (!fs.existsSync(absolute)) {
    throw new Error(`Missing source PDF: ${absolute}`);
  }

  const stat = fs.statSync(absolute);
  if (stat.size > 10 * 1024 * 1024) {
    throw new Error(
      `PDF exceeds Cloudinary's 10 MB limit (${(stat.size / 1024 / 1024).toFixed(2)} MB): ${absolute}`
    );
  }

  console.log(`[upload] ${key} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
  const result = await uploadToStorage(absolute, {
    folder: "thelawkaksha/pdfs/ca-foundation",
    resource_type: "raw",
    public_id: key.replace(/[^a-zA-Z0-9_-]/g, "_"),
    extension: ".pdf",
  });

  if (result.isLocal) {
    throw new Error(`Cloudinary upload fell back to local storage for ${key}`);
  }

  state[key] = {
    publicId: result.publicId,
    url: result.url,
    bytes: result.bytes || stat.size,
    fileName: path.basename(relativePath),
    uploadedAt: new Date().toISOString(),
  };
  saveState(state);
  return state[key];
}

async function main() {
  if (process.env.NODE_ENV !== "test") {
    await connectMongo();
  }

  console.log(`Source: ${SOURCE_ROOT}`);
  console.log(`Mode: ${APPLY ? "APPLY" : "DRY RUN"}`);
  console.log(`Mongo: ${isConnected() ? "connected" : "local fallback"}`);

  if (!fs.existsSync(SOURCE_ROOT)) {
    throw new Error(`Source folder not found: ${SOURCE_ROOT}`);
  }

  if (!APPLY) {
    console.log(`Would import: ${acts.length} acts, ${units.length} units, ${contentItems.length} content items, ${resources.length} resources.`);
    console.log("Re-run with --apply to upload and write.");
    return;
  }

  const state = loadState();

  await mongoUpsert(Course, courseData);
  localUpsert("courses", courseData);
  await mongoUpsert(Course, cseetCourseData);
  localUpsert("courses", cseetCourseData);

  for (const act of acts) {
    await mongoUpsert(Act, act);
    localUpsert("acts", act);
  }

  for (const unit of units) {
    await mongoUpsert(Unit, unit);
    localUpsert("units", unit);
  }

  for (const item of contentItems) {
    const asset = await uploadPdf(state, item.id, item.file, item.compressedFile);
    const record = {
      id: item.id,
      unitId: item.unitId,
      type: item.type,
      title: item.title,
      cloudinaryPublicId: asset.publicId,
      samplePublicId: "",
      isSample: false,
      sampleFromPage: 1,
      sampleToPage: 5,
      samplePagesRange: "1-5",
      isPublished: true,
      publishedAt: new Date().toISOString(),
      order: item.order,
      description: "",
      fileName: asset.fileName,
      fileSize: asset.bytes,
    };
    await mongoUpsert(ContentItem, record);
    localUpsert("content_items", record);
  }

  for (const resource of resources) {
    const asset = await uploadPdf(
      state,
      resource.id,
      resource.file,
      resource.compressedFile
    );
    const record = {
      id: resource.id,
      course_id: COURSE_ID,
      course: "ca-foundation",
      actName: resource.actName,
      chapterNumber: resource.chapterNumber,
      type: resource.type,
      title: resource.title,
      description: resource.description,
      pdfUrl: asset.url,
      samplePdfUrl: "",
      isSample: Boolean(resource.isSample),
      status: "Published",
      display_order: resource.order,
      order: resource.order,
      is_active: true,
      pages: resource.pages,
      previewPagesLimit: 5,
      cloudinaryPublicId: asset.publicId,
    };
    await mongoUpsert(Resource, record);
    localUpsert("resources", record);
  }

  Database.forceSave();
  console.log("Import complete.");
}

main()
  .catch((err) => {
    console.error("Import failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (isConnected()) {
      await mongoose.disconnect();
    }
  });
