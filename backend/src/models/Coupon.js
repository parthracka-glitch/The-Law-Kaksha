const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    code: { type: String, required: true, uppercase: true, trim: true, unique: true, index: true },
    discount_type: { type: String, enum: ["percent", "flat"], default: "percent" },
    value: { type: Number, required: true }, // percent or flat amount
    discountPercent: { type: Number }, // legacy backwards compatibility
    max_discount: { type: Number, default: 0 },
    min_order: { type: Number, default: 0 },
    valid_from: { type: Date, default: Date.now },
    valid_to: { type: Date },
    usage_limit: { type: Number, default: 500 },
    used_count: { type: Number, default: 0 },
    per_user_limit: { type: Number, default: 1 },
    applies_to: { type: String, enum: ["all", "specific"], default: "all" },
    applicable_subscriptions: [{ type: String }],
    is_active: { type: Boolean, default: true, index: true },
    status: { type: String, default: "Active" }, // legacy compatibility
  },
  { timestamps: true }
);

module.exports = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
