const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true, index: true }, // Hosting, Content, Marketing, Legal, Software, Operations
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    expense_date: { type: Date, default: Date.now, index: true },
    notes: { type: String, default: "" },
    receipt_url: { type: String, default: "" },
    created_by: { type: String, default: "admin" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);
