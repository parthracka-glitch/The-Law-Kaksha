const mongoose = require("mongoose");

const EntitlementSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    user_id: { type: String, required: true, index: true },
    user_email: { type: String, index: true },
    item_type: { type: String, enum: ["subscription", "extra_course", "course", "product"], default: "subscription" },
    item_id: { type: String, required: true, index: true },
    order_id: { type: String, required: true },
    starts_at: { type: Date, default: Date.now },
    expires_at: { type: Date, required: true, index: true },
    status: { type: String, enum: ["active", "expired", "revoked"], default: "active", index: true },
  },
  { timestamps: true }
);

EntitlementSchema.index({ user_id: 1, item_id: 1, status: 1 });
EntitlementSchema.index({ user_email: 1, status: 1 });

module.exports = mongoose.models.Entitlement || mongoose.model("Entitlement", EntitlementSchema);
