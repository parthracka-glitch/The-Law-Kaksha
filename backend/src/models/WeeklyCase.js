const mongoose = require("mongoose");

const WeeklyCaseSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    day: { type: String, default: "Monday" },
    badge: { type: String, default: "Contract Act 1872" },
    subject: { type: String, default: "Indian Contract Act" },
    title: { type: String, required: true },
    scenario: { type: String, default: "" },
    modelAnswer: { type: String, default: "" },
    precedent: { type: String, default: "" },
    marks: { type: String, default: "6 Marks" },
    courseId: { type: String, default: "course-ca-foundation" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.WeeklyCase || mongoose.model("WeeklyCase", WeeklyCaseSchema);
