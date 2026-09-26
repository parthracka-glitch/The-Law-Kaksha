import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TenthPassInteractiveHub } from "@/components/TenthPassInteractiveHub";
import { ExamCountdownsAndQOTD } from "@/components/ExamCountdownsAndQOTD";
import { SmartChoicePricing } from "@/components/SmartChoicePricing";
import { MainsAnswerInspector } from "@/components/MainsAnswerInspector";
import { Testimonials } from "@/components/Testimonials";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900 flex flex-col antialiased selection:bg-sky-200 selection:text-slate-900">
      {/* 1. Clean Navigation Bar & Announcement */}
      <Navbar />

      {/* 2. Prestigious Hero Section with instant Sample Chapter modal trigger & Audience Toggle */}
      <HeroSection />

      {/* 3. Dedicated Flagship Interactive Studio for Class 10/12 Pass Students */}
      <TenthPassInteractiveHub />

      {/* 4. Streamlined Exam Countdowns & Daily High-Yield MCQ Challenge */}
      <ExamCountdownsAndQOTD />

      {/* 4. Study Packages: 2-Volume Flagship Books & Course Subscriptions */}
      <SmartChoicePricing />

      {/* 5. Interactive 5-Pillar Model Legal Answer Builder */}
      <MainsAnswerInspector />

      {/* 6. Toppers Testimonials */}
      <Testimonials />

      {/* 7. Frequently Asked Questions */}
      <FaqSection />

      {/* 8. Minimalist Footer */}
      <Footer />
    </main>
  );
}
