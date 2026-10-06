const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    banner: { type: String, default: "" },
    coupon_id: { type: String, default: null },
    coupon_code: { type: String, default: "" },
    valid_from: { type: Date, default: Date.now },
    valid_to: { type: Date },
    display_order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Offer || mongoose.model("Offer", OfferSchema);
