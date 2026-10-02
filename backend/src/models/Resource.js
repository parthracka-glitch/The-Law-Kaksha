const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    course: { type: String, enum: ["ca-foundation", "cseet"], default: "ca-foundation", index: true },
    actName: { type: String, required: true },
    chapterNumber: { type: Number, default: 1 },
    type: {
      type: String,
      enum: ["notes", "flowchart", "practice", "pyq", "case_study", "ldr"],
      default: "notes",
      index: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    pdfUrl: { type: String, required: true },
    samplePdfUrl: { type: String, default: "" },
    isSample: { type: Boolean, default: false },
    status: { type: String, enum: ["Published", "Draft", "Coming Soon"], default: "Published" },
    order: { type: Number, default: 0 },
    pages: { type: String, default: "10-30 Pages" },
    previewPagesLimit: { type: Number, default: 5 },
    cloudinaryPublicId: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Resource || mongoose.model("Resource", ResourceSchema);
