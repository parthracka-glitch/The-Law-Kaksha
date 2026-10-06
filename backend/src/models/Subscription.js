const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    // Plan specification fields (§5)
    title: { type: String, required: true },
    slug: { type: String, default: "", index: true },
    short_desc: { type: String, default: "" },
    description: { type: String, default: "" },
    price: { type: Number, default: 99 },
    mrp: { type: Number, default: 299 },
    duration_days: { type: Number, default: 30 },
    thumbnail: { type: String, default: "/assets/ca-cs-hero-books-v2.png" },
    features: [{ type: String }],
    course_ids: [{ type: String }],
    display_order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true, index: true },

    // Backwards-compatible fields for student enrollment records
    studentName: { type: String, default: "" },
    studentRoll: { type: String, default: "" },
    email: { type: String, lowercase: true, trim: true, index: true },
    phone: { type: String, default: "" },
    item: { type: String, default: "" },
    targetExam: { type: String, default: "CA Foundation Paper 2" },
    amount: { type: String, default: "" },
    date: { type: String, default: "" },
    paymentMode: { type: String, default: "UPI / Razorpay" },
    accessStatus: { type: String, enum: ["Active", "Pending", "Revoked"], default: "Active" },
    unlockedItemIds: [{ type: String }],
  },
  { timestamps: true }
);

SubscriptionSchema.index({ email: 1, accessStatus: 1 });
SubscriptionSchema.index({ slug: 1, is_active: 1 });

module.exports = mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema);
