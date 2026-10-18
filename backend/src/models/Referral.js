const mongoose = require("mongoose");

const ReferralSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    referrer_user_id: { type: String, required: true, index: true },
    referred_user_id: { type: String, required: true, index: true },
    first_order_id: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "qualified", "rewarded"],
      default: "pending",
      index: true,
    },
    reward_type: { type: String, enum: ["xp_bonus", "coupon", "feature_unlock"], default: "xp_bonus" },
    reward_value: { type: mongoose.Schema.Types.Mixed, default: 50 },
    reward_claimed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Referral || mongoose.model("Referral", ReferralSchema);
