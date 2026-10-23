require("dotenv").config();
const mongoose = require("mongoose");

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Course = mongoose.model("Course", new mongoose.Schema({}, { strict: false }));
  const CarouselSlide = mongoose.model("CarouselSlide", new mongoose.Schema({}, { strict: false }));

  // 1. Restore CA Foundation thumbnail to official book artwork
  await Course.updateOne(
    { id: "course-ca-foundation" },
    { $set: { thumbnail: "/assets/crop_ca_foundation_book.png" } }
  );
  console.log("Restored CA Foundation thumbnail");

  // 2. Seed canonical slides in Atlas
  const canonicalSlides = [
    {
      id: "slide-1",
      placement: "website",
      title: "Master CA Foundation Business Laws",
      subtitle: "Complete codified ICAI syllabus notes, high-yield visual flowcharts & daily exam-calibrated case studies.",
      image: "/assets/crop_ca_foundation_book.png",
      cta_label: "Explore CA Foundation Pass",
      cta_link: "/courses",
      badge: "MOST POPULAR • PAPER 2",
      rating: "4.9/5 Rating (1,200+ Candidates)",
      subscription_id: "sub-ca-foundation-monthly",
      display_order: 1,
      order: 1,
      is_active: true,
    },
    {
      id: "slide-2",
      placement: "website",
      title: "CSEET Business Law and Management",
      subtitle: "Interactive 3D digital codices, ICSI unit MCQs, and weekly live Google Meet doubt clearing sessions.",
      image: "/assets/ca-cs-hero-books-sharp.png",
      cta_label: "Explore CSEET Pass",
      cta_link: "/courses",
      badge: "ICSI SYLLABUS • 8 UNITS",
      rating: "100% ICSI Exam Aligned",
      subscription_id: "sub-cseet-monthly",
      display_order: 2,
      order: 2,
      is_active: true,
    },
  ];

  for (const s of canonicalSlides) {
    await CarouselSlide.findOneAndUpdate({ id: s.id }, { $set: s }, { upsert: true });
  }
  console.log("Upserted canonical slides into Atlas");

  const afterCourses = await Course.find({}).lean();
  const afterSlides = await CarouselSlide.find({}).lean();
  console.log("UPDATED COURSES:", afterCourses.map(c => ({ id: c.id, title: c.title, thumbnail: c.thumbnail })));
  console.log("UPDATED SLIDES:", afterSlides.map(s => ({ id: s.id, title: s.title, image: s.image })));

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
