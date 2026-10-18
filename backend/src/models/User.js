const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    student_id: { type: String, default: "", index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true, index: true },
    phone: { type: String, default: "", index: true },
    password_hash: { type: String },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    target_exam: { type: String, default: "CA Foundation Paper 2" },
    is_active: { type: Boolean, default: true },
    drm_access: { type: Boolean, default: true },
    enrolled_books: [{ type: String }],
    unlockedItemIds: [{ type: String }],
    streakDays: { type: Number, default: 1 },
    lawXp: { type: Number, default: 120 },
    completedUnits: [{ type: String }],
    bookmarks: [{ type: String }],
    lastRead: {
      title: { type: String, default: "Indian Partnership Act, 1932 (Unit 1)" },
      url: { type: String, default: "/notes/unit-1-general-nature-of-partnership.pdf" },
      date: { type: String, default: "Just now" },
      progress: { type: Number, default: 45 },
    },
    todayMinutes: { type: Number, default: 0 },
    todayGoalMinutes: { type: Number, default: 45 },
    joined_date: { type: String, default: "Today" },
    // Single Device Session Security Fields
    activeDeviceId: { type: String, default: "" },
    activeDeviceName: { type: String, default: "" },
    activeSessionToken: { type: String, default: "" },
    lastActiveAt: { type: Date, default: Date.now },
    tempPassword: { type: String, default: "" },
    boundGmail: { type: String, default: "" },
    googleId: { type: String, default: "" },
    google_id: { type: String, default: "" },
    picture: { type: String, default: "" },
    avatar_url: { type: String, default: "" },
    referral_code: { type: String, default: "", index: true },
    referred_by_user_id: { type: String, default: null },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    resetPasswordToken: { type: String, default: "" },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
