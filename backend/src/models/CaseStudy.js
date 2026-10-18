const mongoose = require("mongoose");

const CaseStudySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    summary: { type: String, default: "" },
    content: { type: String, default: "" },
    cover_image: { type: String, default: "/assets/ca-cs-hero-books-v2.png" },
    act_name: { type: String, default: "Contract Act" },
    marks_weight: { type: Number, default: 6 },
    show_on_website: { type: Boolean, default: true, index: true },
    show_on_dashboard: { type: Boolean, default: true, index: true },
    is_published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.CaseStudy || mongoose.model("CaseStudy", CaseStudySchema);
