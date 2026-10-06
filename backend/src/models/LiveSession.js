const mongoose = require("mongoose");

const LiveSessionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    subscription_id: { type: String, default: null, index: true },
    course_id: { type: String, default: null, index: true },
    title: { type: String, required: true },
    starts_at: { type: Date, required: true, index: true },
    ends_at: { type: Date, required: true },
    meet_link: { type: String, required: true },
    notes: { type: String, default: "" },
    is_active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.LiveSession || mongoose.model("LiveSession", LiveSessionSchema);
