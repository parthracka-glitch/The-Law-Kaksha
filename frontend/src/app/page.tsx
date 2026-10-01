import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ExamCountdownsAndQOTD } from "@/components/ExamCountdownsAndQOTD";
import { PublicLeaderboardSection } from "@/components/PublicLeaderboardSection";
import { SmartChoicePricing } from "@/components/SmartChoicePricing";
import { DigitalBookshelf } from "@/components/DigitalBookshelf";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900 flex flex-col antialiased selection:bg-sky-200 selection:text-slate-900">
      {/* 1. Clean Navigation Bar */}
      <Navbar />

      {/* 2. Hero Section with 3D CA & CS Book Graphic & Quick Sample Reader */}
      <HeroSection />

      {/* 3. Streamlined Exam Countdowns & Daily High-Yield Case Scenarios */}
      <ExamCountdownsAndQOTD />

      {/* 4. Weekly Test Leaderboard */}
      <PublicLeaderboardSection />

      {/* 5. Subscription Pricing (@ ₹99/Month Launch Offer) */}
      <SmartChoicePricing />

      {/* 6. Interactive Digital Bookshelf */}
      <DigitalBookshelf />

      {/* 7. Frequently Asked Questions */}
      <FaqSection />

      {/* 8. Minimalist Footer & Disclaimers */}
      <Footer />
    </main>
  );
}
