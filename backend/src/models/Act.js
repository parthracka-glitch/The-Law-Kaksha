const mongoose = require("mongoose");

const ActSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    courseId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    availability: { type: String, enum: ["live", "coming_soon"], default: "live", index: true },
    isComingSoon: { type: Boolean, default: false },
    status: { type: String, default: "Live" },
    order: { type: Number, default: 0 },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

ActSchema.index({ courseId: 1, order: 1 });

module.exports = mongoose.models.Act || mongoose.model("Act", ActSchema);
