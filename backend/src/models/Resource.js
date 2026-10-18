const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    course_id: { type: String, default: "course-ca-foundation", index: true },
    course: { type: String, default: "ca-foundation", index: true },
    actName: { type: String, default: "Contract Act" },
    chapterNumber: { type: Number, default: 1 },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["video", "pdf", "notes", "link", "flowchart", "practice", "pyq", "case_study", "ldr", "infographic"],
      default: "pdf",
      index: true,
    },
    file_or_url: { type: String, default: "" },
    pdfUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    samplePdfUrl: { type: String, default: "" },
    isSample: { type: Boolean, default: false },
    status: { type: String, enum: ["Published", "Draft", "Coming Soon"], default: "Published" },
    display_order: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true, index: true },
    pages: { type: String, default: "10-30 Pages" },
    previewPagesLimit: { type: Number, default: 5 },
    cloudinaryPublicId: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Resource || mongoose.model("Resource", ResourceSchema);
