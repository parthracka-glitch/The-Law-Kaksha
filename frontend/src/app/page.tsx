import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { SubscriptionCarousel } from "@/components/SubscriptionCarousel";
import { FreeResourceModule } from "@/components/FreeResourceModule";
import { SubscriptionOverview } from "@/components/SubscriptionOverview";
import { ExamCountdownsAndQOTD } from "@/components/ExamCountdownsAndQOTD";
import { Section16ComparisonBlock } from "@/components/Section16ComparisonBlock";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "The Law Kaksha | CA Foundation Business Laws & CSEET Academy",
  description:
    "India's dedicated learning platform for CA Foundation Paper 2 Business Laws and CSEET. Instant soft copy PDF access to Smart Revision Question Banks Part 1 & Part 2, chapter-wise notes, landmark case studies, and 3-step ICAI model answer writing frameworks.",
  alternates: {
    canonical: "https://lawkaksha.in",
  },
  openGraph: {
    title: "The Law Kaksha | CA Foundation Business Laws & CSEET Academy",
    description:
      "Master CA Foundation Paper 2 Business Laws & CSEET with Part 1 & Part 2 Smart Question Banks, landmark case studies, and ICAI model answer techniques.",
    url: "https://lawkaksha.in",
    siteName: "The Law Kaksha",
    images: [
      {
        url: "/images/hero_legal_codex_books.jpg",
        width: 1200,
        height: 630,
        alt: "The Law Kaksha - CA Foundation Business Laws Smart Question Bank",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#0A192F] flex flex-col antialiased selection:bg-[#DBEAFE] selection:text-[#0A192F]">
      {/* 1. Navigation Bar */}
      <Navbar />

      {/* 2. Hero Section with 3D Interactive Books & Quick Sample Reader */}
      <HeroSection />

      {/* 3. Top Highlights Carousel (Featured Codices) */}
      <SubscriptionCarousel />

      {/* 4. Free Resources & Sample Question Banks Module */}
      <FreeResourceModule />

      {/* 5. Live Subscription Passes Overview (Pricing & Passes) */}
      <SubscriptionOverview />

      {/* 6. Streamlined Exam Countdowns & Daily High-Yield Case Scenarios */}
      <ExamCountdownsAndQOTD />

      {/* 7. ICAI Section 16(1) Model Answer Comparison */}
      <Section16ComparisonBlock />

      {/* 8. Frequently Asked Questions */}
      <FaqSection />

      {/* 9. Minimalist Luxury Footer */}
      <Footer />
    </main>
  );
}
