const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    student_id: { type: String, default: "" },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, default: "" },
    password_hash: { type: String },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    target_exam: { type: String, default: "CA Foundation Paper 2" },
    is_active: { type: Boolean, default: true },
    drm_access: { type: Boolean, default: true },
    enrolled_books: [{ type: String }],
    unlockedItemIds: [{ type: String }],
    streakDays: { type: Number, default: 1 },
    todayMinutes: { type: Number, default: 0 },
    todayGoalMinutes: { type: Number, default: 45 },
    joined_date: { type: String, default: "Today" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
