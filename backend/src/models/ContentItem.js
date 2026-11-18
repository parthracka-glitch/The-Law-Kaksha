const mongoose = require("mongoose");

function normalizeContentType(val) {
  if (!val || typeof val !== "string") return "notes";
  const s = val.trim().toLowerCase();
  if (s === "flowchart" || s === "flowcharts" || s === "mindmap" || s === "mindmaps") return "flowchart";
  if (s === "case_study" || s === "case_problems" || s === "case" || s === "cases") return "case_study";
  if (s === "pyq" || s === "pyqs") return "pyq";
  if (s === "practice" || s === "practice_questions" || s === "questions") return "practice";
  if (s === "revision" || s === "ldr" || s === "summary") return "revision";
  if (s === "notes" || s === "chapter_notes") return "notes";
  return s || "notes";
}

const ALLOWED_CONTENT_TYPES = [
  "notes",
  "practice",
  "case_study",
  "flowchart",
  "pyq",
  "revision",
  // Tolerant aliases for UI compatibility:
  "flowcharts",
  "case_problems",
  "pyqs",
  "ldr",
  "mindmap",
  "mindmaps",
  "cases",
  "questions",
];

const ContentItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    unitId: { type: String, required: true, index: true },
    actId: { type: String, default: "", index: true },
    courseId: { type: String, default: "", index: true },
    type: {
      type: String,
      enum: ALLOWED_CONTENT_TYPES,
      set: normalizeContentType,
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    cloudinaryPublicId: { type: String, default: "" }, // PRIVATE: Paid/full PDF asset ID on Cloudinary
    gridfsId: { type: String, default: "", index: true }, // MONGODB ATLAS: Guaranteed cloud-persistent GridFS file ID
    samplePublicId: { type: String, default: "" }, // PUBLIC: Free sample preview PDF asset ID
    isSample: { type: Boolean, default: false },
    sampleFromPage: { type: Number, default: 1 },
    sampleToPage: { type: Number, default: 5 },
    isPublished: { type: Boolean, default: true, index: true },
    publishedAt: { type: Date, default: Date.now, index: true },
    order: { type: Number, default: 0 },
    description: { type: String, default: "" },
    fileName: { type: String, default: "" },
    fileSize: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-normalize type before validation to guarantee canonical storage
ContentItemSchema.pre("validate", function () {
  if (this.type) {
    this.type = normalizeContentType(this.type);
  }
});

// Required composite index for fast content queries
ContentItemSchema.index({ unitId: 1, type: 1, isPublished: 1 });

module.exports = mongoose.models.ContentItem || mongoose.model("ContentItem", ContentItemSchema);
