const mongoose = require("mongoose");

const SiteSettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.SiteSetting || mongoose.model("SiteSetting", SiteSettingSchema);
