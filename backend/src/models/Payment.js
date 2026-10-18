const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    order_id: { type: String, required: true, index: true },
    gateway: { type: String, default: "razorpay" },
    gateway_order_id: { type: String, default: "", index: true },
    gateway_payment_id: { type: String, default: "", index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["pending", "success", "failed", "refunded"], default: "pending", index: true },
    method: { type: String, default: "UPI" },
    paid_at: { type: Date },
    raw_payload: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
