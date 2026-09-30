import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ExamCountdownsAndQOTD } from "@/components/ExamCountdownsAndQOTD";
import { PublicLeaderboardSection } from "@/components/PublicLeaderboardSection";
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

      {/* 2. Prestigious Hero Section with instant Sample Chapter modal trigger */}
      <HeroSection />

      {/* 3. Streamlined Exam Countdowns & Daily High-Yield MCQ Challenge */}
      <ExamCountdownsAndQOTD />

      {/* 4. All-India Daily Legal Challenge Leaderboard */}
      <PublicLeaderboardSection />

      {/* 5. Study Packages: 2-Volume Flagship Books & Course Subscriptions */}
      <SmartChoicePricing />

      {/* 6. Interactive 5-Pillar Model Legal Answer Builder */}
      <MainsAnswerInspector />

      {/* 7. Toppers Testimonials */}
      <Testimonials />

      {/* 8. Frequently Asked Questions */}
      <FaqSection />

      {/* 9. Minimalist Footer */}
      <Footer />
    </main>
  );
}
