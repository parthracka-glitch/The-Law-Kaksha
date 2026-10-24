const mongoose = require("mongoose");

const LiveSessionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    meet_url: { type: String, required: true },
    target_exam: { type: String, default: "All Exams" },
    faculty_name: { type: String, default: "Faculty" },
    scheduled_at: { type: Date, required: true, default: Date.now },
    duration_minutes: { type: Number, default: 60 },
    is_active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.LiveSession || mongoose.model("LiveSession", LiveSessionSchema);
