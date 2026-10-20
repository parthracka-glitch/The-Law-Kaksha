import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { SubscriptionCarousel } from "@/components/SubscriptionCarousel";
import { SubscriptionOverview } from "@/components/SubscriptionOverview";
import { ExamCountdownsAndQOTD } from "@/components/ExamCountdownsAndQOTD";
import { Section16ComparisonBlock } from "@/components/Section16ComparisonBlock";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#0A192F] flex flex-col antialiased selection:bg-[#DBEAFE] selection:text-[#0A192F]">
      {/* 1. Navigation Bar */}
      <Navbar />

      {/* 2. Hero Section with 3D Interactive Books & Quick Sample Reader */}
      <HeroSection />

      {/* 3. Top Highlights Carousel (Featured Codices) */}
      <SubscriptionCarousel />

      {/* 4. Live Subscription Passes Overview (Pricing & Passes) */}
      <SubscriptionOverview />

      {/* 5. Streamlined Exam Countdowns & Daily High-Yield Case Scenarios */}
      <ExamCountdownsAndQOTD />

      {/* 6. ICAI Section 16(1) Model Answer Comparison */}
      <Section16ComparisonBlock />

      {/* 7. Frequently Asked Questions */}
      <FaqSection />

      {/* 8. Minimalist Luxury Footer */}
      <Footer />
    </main>
  );
}
