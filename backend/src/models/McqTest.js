const mongoose = require("mongoose");

const McqTestSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    course: { type: String, enum: ["ca", "cs", "both"], default: "ca" },
    subject: { type: String, default: "The Indian Contract Act, 1872" },
    formUrl: { type: String, required: true },
    questionCount: { type: Number, default: 30 },
    duration: { type: Number, default: 30 }, // in minutes
    totalMarks: { type: Number, default: 30 },
    status: { type: String, enum: ["Active", "Draft"], default: "Active" },
    instructions: { type: String, default: "Attempt all questions in one sitting. Follow official exam guidelines." },
  },
  { timestamps: true }
);

module.exports = mongoose.models.McqTest || mongoose.model("McqTest", McqTestSchema);
