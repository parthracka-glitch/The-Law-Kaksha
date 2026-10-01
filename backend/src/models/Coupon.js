const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    code: { type: String, required: true, uppercase: true, trim: true, unique: true },
    discountPercent: { type: Number, required: true },
    minOrder: { type: Number, default: 0 },
    maxUses: { type: Number, default: 500 },
    usedCount: { type: Number, default: 0 },
    expiryDate: { type: String, default: "2026-12-31" },
    status: { type: String, enum: ["Active", "Expired", "Disabled"], default: "Active" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
