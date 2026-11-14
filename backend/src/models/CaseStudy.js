const mongoose = require("mongoose");

const CaseStudySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    subject: { type: String, default: "The Indian Contract Act, 1872" },
    act_name: { type: String, default: "Contract Act" },
    summary: { type: String, default: "" },
    content: { type: String, default: "" },
    badge: { type: String, default: "ICAI FAVORITE" },
    marks: { type: String, default: "6 Marks" },
    marks_weight: { type: Number, default: 6 },
    precedent: { type: String, default: "" },
    facts: { type: String, default: "" },
    issue: { type: String, default: "" },
    ruling: { type: String, default: "" },
    model_answer: { type: String, default: "" },
    key_takeaways: { type: [String], default: [] },
    cover_image: { type: String, default: "/assets/ca-cs-hero-books-sharp.png" },
    show_on_website: { type: Boolean, default: true, index: true },
    show_on_dashboard: { type: Boolean, default: false, index: true },
    is_published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.CaseStudy || mongoose.model("CaseStudy", CaseStudySchema);
