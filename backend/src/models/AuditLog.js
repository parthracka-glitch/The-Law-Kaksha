const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    action: { type: String, required: true, index: true },
    admin_id: { type: String, index: true },
    admin_email: { type: String },
    target_user_id: { type: String, index: true },
    target_user_email: { type: String },
    order_id: { type: String, index: true },
    details: { type: mongoose.Schema.Types.Mixed },
    ip_address: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
