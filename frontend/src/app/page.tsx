import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { SubscriptionCarousel } from "@/components/SubscriptionCarousel";
import { SubscriptionOverview } from "@/components/SubscriptionOverview";
import { BooksAndNotesShowcase } from "@/components/BooksAndNotesShowcase";
import { ExamCountdownsAndQOTD } from "@/components/ExamCountdownsAndQOTD";
import { Section16ComparisonBlock } from "@/components/Section16ComparisonBlock";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { Sparkles, Scale, Gift, ArrowRight, BookOpen, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#0A192F] flex flex-col antialiased selection:bg-[#DBEAFE] selection:text-[#0A192F]">
      {/* 1. Navigation Bar */}
      <Navbar />

      {/* 2. Hero Section with 3D Interactive Books & Quick Sample Reader */}
      <HeroSection />

      {/* 3. Top Highlights Carousel (A1) */}
      <SubscriptionCarousel />

      {/* 4. Live Subscription Passes Overview (A2) */}
      <SubscriptionOverview />

      {/* 5. Live Books & PDF Notes Library Showcase */}
      <BooksAndNotesShowcase />

      {/* 6. Streamlined Exam Countdowns & Daily High-Yield Case Scenarios */}
      <ExamCountdownsAndQOTD />

      {/* 6. Case Studies & Offers Highlight Banner */}
      <section className="py-14 bg-[#F0F7FF] border-y border-[#DBEAFE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Case Studies Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#DBEAFE] shadow-sm hover:shadow-md hover:border-[#005A9C] flex flex-col justify-between transition-all duration-300">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE]">
                    <Scale className="w-3.5 h-3.5 text-[#005A9C]" />
                    Legal Jurisprudence
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0A192F] mb-2">
                  High-Yield Case Studies Library
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed mb-6">
                  Explore landmark precedents like Mohoribibee v. Dharmodas Ghose and Salomon v. Salomon with ICAI/ICSI model answers and facts breakdown.
                </p>
              </div>
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#005A9C] hover:text-[#004F8A] transition-colors"
              >
                <span>Browse All Case Studies</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>

            {/* Active Offers Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 border-[#005A9C] shadow-[0_8px_30px_rgba(0,90,156,0.12)] flex flex-col justify-between relative overflow-hidden transition-all duration-300">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#EFF6FF]/60 rounded-bl-full pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE]">
                    <Gift className="w-3.5 h-3.5 text-[#005A9C]" />
                    Limited Time Offer
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-black text-[#0A192F] mb-2">
                  Launch Passes Starting @ ₹99
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed mb-6">
                  Save up to 67% on your first monthly subscription with coupon code <strong className="text-[#005A9C] font-mono bg-[#EFF6FF] border border-[#DBEAFE] px-2 py-0.5 rounded-lg">LAUNCH99</strong>. Includes single-device watermarked DRM access.
                </p>
              </div>
              <div className="relative z-10">
                <Link
                  href="/offers"
                  className="inline-flex items-center justify-center gap-2 text-sm font-bold bg-[#005A9C] hover:bg-[#004F8A] text-white px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <span>View All Active Coupons</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ICAI Section 16(1) Model Answer Comparison */}
      <Section16ComparisonBlock />

      {/* 8. Frequently Asked Questions */}
      <FaqSection />

      {/* 10. Minimalist Luxury Footer */}
      <Footer />
    </main>
  );
}
