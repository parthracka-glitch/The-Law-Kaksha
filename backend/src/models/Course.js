const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    availability: { type: String, enum: ["live", "coming_soon"], default: "live", index: true },
    price: { type: Number, default: 99 },
    mrp: { type: Number, default: 0 },
    accessDays: { type: Number, default: 30 },
    description: { type: String, default: "" },
    thumbnail: { type: String, default: "/assets/ca-cs-hero-books-sharp.png" },
    kind: { type: String, enum: ["core", "extra"], default: "core", index: true },
    is_active: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
    display_order: { type: Number, default: 0 },
    exam_body: { type: String, default: "ICAI" },
    units_count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Course || mongoose.model("Course", CourseSchema);
