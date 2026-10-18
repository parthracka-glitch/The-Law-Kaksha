const mongoose = require("mongoose");

const SupportTicketSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    student_id: { type: String, required: true, index: true },
    student_name: { type: String, default: "Student" },
    student_email: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    category: { type: String, default: "General Support" },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    admin_reply: { type: String, default: "" },
    admin_replied_at: { type: Date },
    admin_id: { type: String },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.SupportTicket || mongoose.model("SupportTicket", SupportTicketSchema);
