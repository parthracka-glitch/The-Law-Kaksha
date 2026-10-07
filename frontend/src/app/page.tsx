import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { SubscriptionCarousel } from "@/components/SubscriptionCarousel";
import { SubscriptionOverview } from "@/components/SubscriptionOverview";
import { ExamCountdownsAndQOTD } from "@/components/ExamCountdownsAndQOTD";
import { Section16ComparisonBlock } from "@/components/Section16ComparisonBlock";
import { DigitalBookshelf } from "@/components/DigitalBookshelf";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { Sparkles, Scale, Gift, ArrowRight, BookOpen, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#221D1D] flex flex-col antialiased selection:bg-[#BFAFE5]/40 selection:text-[#221D1D]">
      {/* 1. Navigation Bar */}
      <Navbar />

      {/* 2. Top Highlights Carousel (A1) */}
      <SubscriptionCarousel />

      {/* 3. Hero Section with 3D CA & CS Codex Visual & Quick Sample Reader */}
      <HeroSection />

      {/* 4. Live Subscription Passes Overview (A2) */}
      <SubscriptionOverview />

      {/* 5. Streamlined Exam Countdowns & Daily High-Yield Case Scenarios */}
      <ExamCountdownsAndQOTD />

      {/* 6. Case Studies & Offers Highlight Banner */}
      <section className="py-14 bg-[#F7F7F5] border-y border-[#E7E4E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Case Studies Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#E7E4E7] shadow-[0_4px_20px_rgba(34,29,29,0.04)] hover:shadow-[0_12px_36px_rgba(34,29,29,0.08)] hover:border-[#AED7E9] flex flex-col justify-between transition-all duration-300">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#C4E1EC] text-[#221D1D] border border-[#AED7E9]">
                    <Scale className="w-3.5 h-3.5 text-[#4B8097]" />
                    Legal Jurisprudence
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-black text-[#221D1D] mb-2">
                  High-Yield Case Studies Library
                </h3>
                <p className="text-sm text-[#4D433F] leading-relaxed mb-6">
                  Explore landmark precedents like Mohoribibee v. Dharmodas Ghose and Salomon v. Salomon with ICAI/ICSI model answers and facts breakdown.
                </p>
              </div>
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#221D1D] hover:text-[#4B8097] transition-colors"
              >
                <span>Browse All Case Studies</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>

            {/* Active Offers Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 border-[#AED7E9] shadow-[0_8px_30px_rgba(174,215,233,0.3)] flex flex-col justify-between relative overflow-hidden transition-all duration-300">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#C4E1EC]/40 rounded-bl-full pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#BFAFE5] text-[#221D1D] border border-[#A08DC9]">
                    <Gift className="w-3.5 h-3.5 text-[#221D1D]" />
                    Limited Time Offer
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-black text-[#221D1D] mb-2">
                  Launch Passes Starting @ ₹99
                </h3>
                <p className="text-sm text-[#4D433F] leading-relaxed mb-6">
                  Save up to 67% on your first monthly subscription with coupon code <strong className="text-[#221D1D] font-mono bg-[#F7F7F5] border border-[#E7E4E7] px-2 py-0.5 rounded-lg">LAUNCH99</strong>. Includes single-device watermarked DRM access.
                </p>
              </div>
              <div className="relative z-10">
                <Link
                  href="/offers"
                  className="inline-flex items-center justify-center gap-2 text-sm font-bold bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] px-6 py-3 rounded-full shadow-[0_2px_8px_rgba(191,175,229,0.35)] transition-all duration-200 active:scale-95 cursor-pointer"
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

      {/* 8. Interactive Digital Bookshelf */}
      <DigitalBookshelf />

      {/* 9. Frequently Asked Questions */}
      <FaqSection />

      {/* 10. Minimalist Luxury Footer */}
      <Footer />
    </main>
  );
}
