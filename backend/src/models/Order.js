const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  item_type: { type: String, enum: ["subscription", "extra_course", "course", "product"], default: "subscription" },
  item_id: { type: String, required: true },
  title: { type: String, default: "" },
  price_at_purchase: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    order_no: { type: String, required: true, unique: true, index: true },
    user_id: { type: String, required: true, index: true },
    personal_details: {
      name: { type: String, required: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      phone: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    coupon_id: { type: String, default: null },
    coupon_code: { type: String, default: "" },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "COMPLETED", "FAILED", "PENDING"],
      default: "pending",
      index: true,
    },
    payment_id: { type: String, default: "" },
    gateway_order_id: { type: String, default: "" },
    // Backwards compatibility aliases
    orderId: { type: String },
    studentId: { type: String },
    userEmail: { type: String },
    amount: { type: Number },
    currency: { type: String, default: "INR" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model("Order", OrderSchema);
