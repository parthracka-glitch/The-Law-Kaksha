const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    category: { type: String, enum: ["CA Foundation", "CSEET", "Both"], default: "CA Foundation" },
    format: { type: String, default: "Digital Codex (In-Web DRM)" },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: 499 },
    pages: { type: String, default: "150+ Pages" },
    status: { type: String, enum: ["Active", "Draft"], default: "Active" },
    pdfUrl: { type: String, default: "/api/pdf/cseet-business-law-full.pdf" },
    description: { type: String, default: "" },
    units: [{ type: String }],
    highlights: [{ type: String }],
    cover_image: { type: String, default: "/assets/ca-cs-hero-books-v2.png" },
    isSample: { type: Boolean, default: false },
    previewPagesLimit: { type: Number, default: 5 },
    samplePagesRange: { type: String, default: "1-5" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Product || mongoose.model("Product", ProductSchema);
