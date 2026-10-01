const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    studentName: { type: String, required: true },
    studentRoll: { type: String, default: "" },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, default: "" },
    item: { type: String, required: true },
    targetExam: { type: String, default: "CA Foundation Paper 2" },
    amount: { type: String, required: true },
    date: { type: String, default: () => new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
    paymentMode: { type: String, default: "UPI / Razorpay" },
    accessStatus: { type: String, enum: ["Active", "Pending", "Revoked"], default: "Active" },
    unlockedItemIds: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema);
