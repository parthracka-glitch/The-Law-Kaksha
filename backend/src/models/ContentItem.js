const mongoose = require("mongoose");

const ContentItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    unitId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ["notes", "practice", "case_study", "flowchart", "pyq", "revision"],
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    cloudinaryPublicId: { type: String, default: "" }, // PRIVATE: Paid/full PDF asset ID on Cloudinary
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

// Required composite index for fast content queries
ContentItemSchema.index({ unitId: 1, type: 1, isPublished: 1 });

module.exports = mongoose.models.ContentItem || mongoose.model("ContentItem", ContentItemSchema);
