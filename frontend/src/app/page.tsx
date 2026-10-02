import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ExamCountdownsAndQOTD } from "@/components/ExamCountdownsAndQOTD";
import { Section16ComparisonBlock } from "@/components/Section16ComparisonBlock";
import { SmartChoicePricing } from "@/components/SmartChoicePricing";
import { DigitalBookshelf } from "@/components/DigitalBookshelf";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#221D1D] flex flex-col antialiased selection:bg-[#C4E1EC] selection:text-[#221D1D]">
      {/* 1. Clean Navigation Bar */}
      <Navbar />

      {/* 2. Hero Section with 3D CA & CS Book Graphic & Quick Sample Reader */}
      <HeroSection />

      {/* 3. Streamlined Exam Countdowns & Daily High-Yield Case Scenarios */}
      <ExamCountdownsAndQOTD />

      {/* 4. ICAI Section 16(1) Model Answer vs 2/6 Average Aspirant Interactive Comparison */}
      <Section16ComparisonBlock />

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

