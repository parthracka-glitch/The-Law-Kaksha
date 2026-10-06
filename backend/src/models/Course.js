const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, default: "" },
    description: { type: String, default: "" },
    thumbnail: { type: String, default: "/assets/ca-cs-hero-books-v2.png" },
    kind: { type: String, enum: ["core", "extra"], default: "core", index: true },
    price: { type: Number, default: 0 },
    mrp: { type: Number, default: 0 },
    show_on_website: { type: Boolean, default: true },
    is_active: { type: Boolean, default: true, index: true },
    display_order: { type: Number, default: 0 },
    exam_body: { type: String, default: "ICAI" },
    units_count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Course || mongoose.model("Course", CourseSchema);
