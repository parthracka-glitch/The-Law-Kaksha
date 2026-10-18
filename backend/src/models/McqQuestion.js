const mongoose = require("mongoose");

const McqQuestionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    subject: { type: String, default: "Indian Contract Act" },
    section: { type: String, default: "Section 10" },
    question: { type: String, required: true },
    options: [{ type: String }],
    correctOption: { type: Number, default: 0 },
    explanation: { type: String, default: "" },
    courseId: { type: String, default: "course-cseet" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.McqQuestion || mongoose.model("McqQuestion", McqQuestionSchema);
