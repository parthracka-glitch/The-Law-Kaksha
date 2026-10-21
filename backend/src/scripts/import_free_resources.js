/**
 * Upload watermarked free resources to Cloudinary and sync them to MongoDB/local DB.
 *
 * Usage:
 *   node src/scripts/import_free_resources.js --source "<folder>" [--apply] [--force]
 *
 * The source folder must contain one PDF per resource ID, e.g.
 *   res-ca-qb-part1-sample.pdf
 */

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Database = require("../db/database");
const { connectMongo, isConnected } = require("../db/mongo");
const { uploadToStorage } = require("../utils/cloudinary");
const Resource = require("../models/Resource");

const COURSE_ID = "course-ca-foundation";
const COURSE = "ca-foundation";
const STATE_FILE = path.join(__dirname, "../../data/free_resources_import_state.json");
const APPLY = process.argv.includes("--apply");
const FORCE = process.argv.includes("--force");
const sourceIndex = process.argv.indexOf("--source");
const SOURCE_DIR =
  sourceIndex !== -1 && process.argv[sourceIndex + 1]
    ? path.resolve(process.argv[sourceIndex + 1])
    : null;

const resources = [
  {
    id: "res-ca-qb-part1-sample",
    actName: "CA Foundation Business Laws - Full Syllabus",
    chapterNumber: 7,
    type: "practice",
    title: "Question Bank Part 1 - Free Sample",
    description: "Watermarked free sample of the CA Foundation Business Laws Question Bank Part 1.",
    pages: "30 Pages",
    order: 1,
  },
  {
    id: "res-ca-qb-part2-sample",
    actName: "CA Foundation Business Laws - Full Syllabus",
    chapterNumber: 8,
    type: "practice",
    title: "Question Bank Part 2 - Free Sample",
    description: "Watermarked free sample of the CA Foundation Business Laws Question Bank Part 2.",
    pages: "45 Pages",
    order: 3,
  },
  {
    id: "res-ca-partnership-free-notes-1",
    actName: "The Indian Partnership Act, 1932",
    chapterNumber: 3,
    type: "notes",
    title: "Partnership Act - Unit 1 Free Notes",
    description: "Watermarked notes on the general nature of partnership, the true test, and mutual agency.",
    pages: "10 Pages",
    order: 1,
  },
  {
    id: "res-ca-contract-free-notes-3",
    actName: "The Indian Contract Act, 1872",
    chapterNumber: 1,
    type: "notes",
    title: "Contract Act - Unit 3 Free Notes",
    description: "Watermarked notes on other essential elements of a valid contract, capacity, free consent, and legality.",
    pages: "17 Pages",
    order: 1,
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

async function uploadPdf(state, id) {
  if (!FORCE && state[id]?.publicId) {
    console.log(`[reuse] ${id} -> ${state[id].publicId}`);
    return state[id];
  }

  const absolute = path.join(SOURCE_DIR, `${id}.pdf`);
  if (!fs.existsSync(absolute)) {
    throw new Error(`Missing watermarked source PDF: ${absolute}`);
  }

  const stat = fs.statSync(absolute);
  if (stat.size > 10 * 1024 * 1024) {
    throw new Error(
      `PDF exceeds Cloudinary's 10 MB limit (${(stat.size / 1024 / 1024).toFixed(2)} MB): ${absolute}`
    );
  }

  console.log(`[upload] ${id} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
  const result = await uploadToStorage(absolute, {
    folder: "thelawkaksha/pdfs/ca-foundation/free-resources",
    resource_type: "raw",
    public_id: `free-${id}`,
    extension: ".pdf",
  });

  if (result.isLocal) {
    throw new Error(`Cloudinary upload fell back to local storage for ${id}`);
  }

  state[id] = {
    publicId: result.publicId,
    url: result.url,
    bytes: result.bytes || stat.size,
    fileName: path.basename(absolute),
    uploadedAt: new Date().toISOString(),
  };
  saveState(state);
  return state[id];
}

function localUpsert(record) {
  const table = Database.table("resources");
  if (table.findOne((item) => item.id === record.id)) {
    table.update(record.id, record);
  } else {
    table.insert(record);
  }
}

async function mongoUpsert(record) {
  if (!isConnected()) return null;
  return Resource.findOneAndUpdate(
    { id: record.id },
    { $set: record },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function main() {
  if (!SOURCE_DIR) {
    throw new Error('Missing --source "<folder containing watermarked PDFs>".');
  }
  if (!fs.existsSync(SOURCE_DIR)) {
    throw new Error(`Source folder not found: ${SOURCE_DIR}`);
  }

  if (process.env.NODE_ENV !== "test") {
    await connectMongo();
  }

  console.log(`Source: ${SOURCE_DIR}`);
  console.log(`Mode: ${APPLY ? "APPLY" : "DRY RUN"}`);
  console.log(`Mongo: ${isConnected() ? "connected" : "local fallback"}`);

  if (!APPLY) {
    console.log(`Would import ${resources.length} free resources.`);
    console.log("Re-run with --apply to upload and write.");
    return;
  }

  const state = loadState();
  for (const resource of resources) {
    const asset = await uploadPdf(state, resource.id);
    const record = {
      id: resource.id,
      course_id: COURSE_ID,
      course: COURSE,
      actName: resource.actName,
      chapterNumber: resource.chapterNumber,
      type: resource.type,
      title: resource.title,
      description: resource.description,
      pdfUrl: asset.url,
      samplePdfUrl: "",
      isSample: true,
      status: "Published",
      display_order: resource.order,
      order: resource.order,
      is_active: true,
      pages: resource.pages,
      previewPagesLimit: 999,
      cloudinaryPublicId: asset.publicId,
    };
    await mongoUpsert(record);
    localUpsert(record);
  }

  Database.forceSave();
  console.log("Free resources import complete.");
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
