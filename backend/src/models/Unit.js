const mongoose = require("mongoose");

const UnitSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    actId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    summary: { type: String, default: "" },
  },
  { timestamps: true }
);

UnitSchema.index({ actId: 1, order: 1 });

module.exports = mongoose.models.Unit || mongoose.model("Unit", UnitSchema);
