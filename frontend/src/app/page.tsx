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
    <main className="min-h-screen bg-[#FDFBF7] text-[#0B192C] flex flex-col antialiased selection:bg-[#C5A880]/30 selection:text-[#0B192C]">
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
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Case Studies Card */}
            <div className="bg-[#FDFBF7] rounded-3xl p-8 border border-[#C5A880]/30 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Scale className="w-5 h-5 text-[#C5A880]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0B192C]">
                    Legal Jurisprudence
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#0B192C] mb-2">
                  High-Yield Case Studies Library
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Explore landmark precedents like Mohoribibee v. Dharmodas Ghose and Salomon v. Salomon with ICAI/ICSI model answers and facts breakdown.
                </p>
              </div>
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0B192C] hover:text-[#C5A880] transition-colors"
              >
                <span>Browse All Case Studies</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Active Offers Card */}
            <div className="bg-[#0B192C] text-white rounded-3xl p-8 border border-[#C5A880]/40 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A880]/15 rounded-bl-full pointer-events-none" />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Gift className="w-5 h-5 text-[#C5A880]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E5D0B5]">
                    Limited Time Offer
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#FDFBF7] mb-2">
                  Launch Passes Starting @ ₹99
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Save up to 67% on your first monthly subscription with coupon code <strong className="text-[#C5A880] font-mono">LAUNCH99</strong>. Includes single-device watermarked DRM access.
                </p>
              </div>
              <Link
                href="/offers"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#C5A880] hover:text-[#FDFBF7] transition-colors"
              >
                <span>View All Active Coupons</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
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
