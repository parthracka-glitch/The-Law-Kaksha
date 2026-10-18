const mongoose = require("mongoose");

const CarouselSlideSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    placement: { type: String, default: "website", index: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    image: { type: String, default: "" },
    cta_label: { type: String, default: "Explore Plan" },
    cta_link: { type: String, default: "/courses" },
    badge: { type: String, default: "" },
    rating: { type: String, default: "" },
    subscription_id: { type: String, default: null },
    display_order: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.CarouselSlide || mongoose.model("CarouselSlide", CarouselSlideSchema);
