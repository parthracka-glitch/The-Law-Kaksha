const mongoose = require("mongoose");

const XpEventSchema = new mongoose.Schema({
  type: { type: String, required: true }, // daily_checkin, resource_completed, live_session, streak_milestone
  points: { type: Number, required: true },
  ref_type: { type: String, default: "" },
  ref_id: { type: String, default: "" },
  created_at: { type: Date, default: Date.now },
});

const UserStatsSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    user_id: { type: String, required: true, unique: true, index: true },
    xp_total: { type: Number, default: 0 },
    current_streak: { type: Number, default: 0 },
    longest_streak: { type: Number, default: 0 },
    last_active_date: { type: String, default: "" }, // YYYY-MM-DD
    events: [XpEventSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.models.UserStats || mongoose.model("UserStats", UserStatsSchema);
