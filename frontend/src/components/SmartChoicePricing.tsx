"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Eye,
  GraduationCap,
  FileText,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { EnhancedSampleChapterModal } from "./EnhancedSampleChapterModal";

interface CoursePlan {
  id: string;
  title: string;
  badge: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  duration: string;
  popular?: boolean;
  coreModules: { title: string; topics: string[] }[];
  features: string[];
  ctaText: string;
}

const CA_FOUNDATION_PLAN: CoursePlan = {
  id: "ca-foundation-sub",
  title: "CA Foundation Business Laws",
  badge: "Paper 2 • 7 Chapters",
  subtitle: "Full Syllabus Coverage • 3 Weekly Case Studies • 1.5-Day LDR Notes",
  price: 99,
  originalPrice: 299,
  duration: "Per Month (Launch Offer)",
  popular: true,
  coreModules: [
    {
      title: "All 7 ICAI Foundation Chapters",
      topics: [
        "1. Indian Regulatory Framework",
        "2. Indian Contract Act, 1872 (General Principles, Consideration & Breach)",
        "3. Sale of Goods Act, 1930 (Conditions, Warranties & Unpaid Seller)",
        "4. Indian Partnership Act, 1932 (General Nature, Relations & Dissolution)",
        "5. Limited Liability Partnership Act, 2008 (Incorporation & Partners)",
        "6. Companies Act, 2013 (Incorporation, MOA/AOA & Corporate Veil)",
        "7. Negotiable Instruments Act, 1881 (Promissory Notes, Bills & Cheques)",
      ],
    },
  ],
  features: [
    "Full Notes for all 7 ICAI Chapters (PDF & Interactive)",
    "Free Partnership Act 3-Unit Sample PDFs included",
    "Weekly 3 Case Studies (Monster Monday, Midweek Law Madness, Final Boss Friday)",
    "Weekly Practice Leaderboard on Platform",
    "1.5-Day Exam LDR Flowcharts & Penalty Code Tables",
  ],
  ctaText: "Subscribe @ ₹99/mo",
};

const CSEET_PLAN: CoursePlan = {
  id: "cseet-sub",
  title: "CSEET Business Law & Management",
  badge: "ICSI • 8 Units",
  subtitle: "8 Units Syllabus • Weekly 30-Q MCQ Tests • Concept Question Bank",
  price: 99,
  originalPrice: 299,
  duration: "Per Month (Launch Offer)",
  popular: false,
  coreModules: [
    {
      title: "All 8 ICSI Exam Units",
      topics: [
        "1. Indian Contract Act, 1872",
        "2. Sale of Goods Act, 1930",
        "3. Indian Partnership Act, 1932",
        "4. Limited Liability Partnership Act, 2008",
        "5. Companies Act, 2013 Overview",
        "6. Negotiable Instruments Act, 1881",
        "7. General Principles of Management",
        "8. Business Environment & Ethics",
      ],
    },
  ],
  features: [
    "Full Notes for all 8 ICSI Units (PDF & Interactive)",
    "Sample Management Notes PDF included",
    "Weekly 30-Question MCQ Tests with Real-Time Timers",
    "Chapter-wise MCQ Bank with Detailed Explanations",
    "Quick Revision Flowchart Deck & Exam Summary",
  ],
  ctaText: "Subscribe @ ₹99/mo",
};

export function SmartChoicePricing() {
  const [activeTab, setActiveTab] = useState<"ca" | "cs">("ca");
  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [sampleBook, setSampleBook] = useState<{ id: string; title: string; price: number }>({
    id: "ca-foundation",
    title: "CA Foundation Business Laws Master Codex",
    price: 99,
  });

  const { addToCart } = useCart();

  const handleOpenSample = (title: string, id: string, price: number) => {
    setSampleBook({ title, id: "ca-foundation", price });
    setSampleModalOpen(true);
  };

  const currentPlan = activeTab === "ca" ? CA_FOUNDATION_PLAN : CSEET_PLAN;

  return (
    <section id="pricing" className="pt-4 sm:pt-6 pb-12 md:pb-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] border border-black/[0.06] text-[#1D1D1F] text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>Course Subscription</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
            Simple &amp; Affordable Monthly Access
          </h2>
          <p className="text-xs sm:text-sm text-[#86868B] max-w-lg mx-auto">
            Choose your course to access study notes, practice questions, and weekly tests.
          </p>

          {/* Course Tabs Toggle */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex max-w-full p-1 rounded-2xl sm:rounded-full bg-[#F5F5F7] border border-black/[0.04]">
              <button
                type="button"
                onClick={() => setActiveTab("ca")}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer min-h-[44px] ${
                  activeTab === "ca"
                    ? "bg-white text-[#1D1D1F] shadow-xs font-semibold"
                    : "text-[#6E6E73] hover:text-[#1D1D1F]"
                }`}
              >
                <span className="sm:hidden">CA Foundation</span>
                <span className="hidden sm:inline">CA Foundation (Paper 2)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("cs")}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer min-h-[44px] ${
                  activeTab === "cs"
                    ? "bg-white text-[#1D1D1F] shadow-xs font-semibold"
                    : "text-[#6E6E73] hover:text-[#1D1D1F]"
                }`}
              >
                <span className="sm:hidden">CSEET Law</span>
                <span className="hidden sm:inline">CSEET (Business Law &amp; Mgt)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          
          {/* 1. CA Foundation Card */}
          <div
            className={`rounded-3xl bg-white border p-5 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
              activeTab === "ca"
                ? "border-[#0071E3]/50 shadow-[0_8px_30px_rgba(0,113,227,0.08)] ring-1 ring-[#0071E3]/20"
                : "border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-black/[0.14]"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#0071E3]/[0.08] text-[#0071E3] border border-[#0071E3]/15">
                  {CA_FOUNDATION_PLAN.badge}
                </span>
                <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Launch Offer
                </span>
              </div>

              <h3 className="text-xl font-semibold text-[#1D1D1F] tracking-tight mb-1">
                {CA_FOUNDATION_PLAN.title}
              </h3>
              <p className="text-xs text-[#86868B] mb-4">
                {CA_FOUNDATION_PLAN.subtitle}
              </p>

              {/* Price Row */}
              <div className="flex items-baseline justify-between flex-wrap gap-2 mb-5 pb-4 border-b border-black/[0.06]">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
                    ₹{CA_FOUNDATION_PLAN.price}
                  </span>
                  <span className="text-xs text-[#86868B] line-through font-normal">
                    ₹{CA_FOUNDATION_PLAN.originalPrice}
                  </span>
                </div>
                <span className="text-xs font-medium text-[#0071E3]">
                  {CA_FOUNDATION_PLAN.duration}
                </span>
              </div>

              {/* Modules Box */}
              <div className="space-y-2 mb-5 p-3.5 rounded-2xl bg-[#F5F5F7] border border-black/[0.04]">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#86868B] flex items-center gap-1">
                  <Layers className="w-3 h-3 text-[#0071E3]" />
                  <span>7 ICAI Chapters Included:</span>
                </p>
                <ul className="space-y-1 text-xs text-[#424245]">
                  {CA_FOUNDATION_PLAN.coreModules[0].topics.slice(0, 4).map((top, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 leading-snug">
                      <span className="text-[#0071E3] font-bold">•</span>
                      <span className="truncate">{top}</span>
                    </li>
                  ))}
                  <li className="text-[11px] text-[#0071E3] font-medium pt-0.5">
                    + Limited Liability, Companies &amp; Negotiable Instruments
                  </li>
                </ul>
              </div>

              {/* Features List */}
              <div className="space-y-2 mb-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#86868B]">
                  Course Inclusions:
                </p>
                {CA_FOUNDATION_PLAN.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#6E6E73]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0071E3] shrink-0 mt-0.5" />
                    <span className="leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-black/[0.05]">
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenSample(CA_FOUNDATION_PLAN.title, CA_FOUNDATION_PLAN.id, CA_FOUNDATION_PLAN.price)}
                  className="w-full sm:flex-1 py-2.5 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 text-[#1D1D1F] bg-black/[0.04] hover:bg-black/[0.07] border border-black/[0.06] transition-all cursor-pointer min-h-[44px]"
                >
                  <Eye className="w-3.5 h-3.5 text-[#0071E3]" />
                  <span>Preview Sample</span>
                </button>

                <Link
                  href="/register?course=ca-foundation"
                  className="w-full sm:flex-1 py-2.5 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 text-white bg-[#0071E3] hover:bg-[#0077ED] transition-all shadow-xs active:scale-95 min-h-[44px]"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Subscribe @ ₹99</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 2. CSEET Card */}
          <div
            className={`rounded-3xl bg-white border p-5 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
              activeTab === "cs"
                ? "border-[#0071E3]/50 shadow-[0_8px_30px_rgba(0,113,227,0.08)] ring-1 ring-[#0071E3]/20"
                : "border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-black/[0.14]"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-black/[0.05] text-[#1D1D1F] border border-black/[0.08]">
                  {CSEET_PLAN.badge}
                </span>
                <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Launch Offer
                </span>
              </div>

              <h3 className="text-xl font-semibold text-[#1D1D1F] tracking-tight mb-1">
                {CSEET_PLAN.title}
              </h3>
              <p className="text-xs text-[#86868B] mb-4">
                {CSEET_PLAN.subtitle}
              </p>

              {/* Price Row */}
              <div className="flex items-baseline justify-between flex-wrap gap-2 mb-5 pb-4 border-b border-black/[0.06]">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
                    ₹{CSEET_PLAN.price}
                  </span>
                  <span className="text-xs text-[#86868B] line-through font-normal">
                    ₹{CSEET_PLAN.originalPrice}
                  </span>
                </div>
                <span className="text-xs font-medium text-[#0071E3]">
                  {CSEET_PLAN.duration}
                </span>
              </div>

              {/* Modules Box */}
              <div className="space-y-2 mb-5 p-3.5 rounded-2xl bg-[#F5F5F7] border border-black/[0.04]">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#86868B] flex items-center gap-1">
                  <Layers className="w-3 h-3 text-[#0071E3]" />
                  <span>8 ICSI Units Included:</span>
                </p>
                <ul className="space-y-1 text-xs text-[#424245]">
                  {CSEET_PLAN.coreModules[0].topics.slice(0, 4).map((top, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 leading-snug">
                      <span className="text-[#0071E3] font-bold">•</span>
                      <span className="truncate">{top}</span>
                    </li>
                  ))}
                  <li className="text-[11px] text-[#0071E3] font-medium pt-0.5">
                    + Management Principles, NI Act &amp; Business Environment
                  </li>
                </ul>
              </div>

              {/* Features List */}
              <div className="space-y-2 mb-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#86868B]">
                  Course Inclusions:
                </p>
                {CSEET_PLAN.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#6E6E73]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0071E3] shrink-0 mt-0.5" />
                    <span className="leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-black/[0.05]">
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenSample(CSEET_PLAN.title, CSEET_PLAN.id, CSEET_PLAN.price)}
                  className="w-full sm:flex-1 py-2.5 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 text-[#1D1D1F] bg-black/[0.04] hover:bg-black/[0.07] border border-black/[0.06] transition-all cursor-pointer min-h-[44px]"
                >
                  <Eye className="w-3.5 h-3.5 text-[#0071E3]" />
                  <span>Preview Sample</span>
                </button>

                <Link
                  href="/register?course=cseet"
                  className="w-full sm:flex-1 py-2.5 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 text-white bg-[#1D1D1F] hover:bg-[#2D2D2F] transition-all shadow-xs active:scale-95 min-h-[44px]"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Subscribe @ ₹99</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Official Statutory Disclaimers */}
        <div className="mt-12 max-w-3xl mx-auto p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.04] text-[#86868B] text-xs leading-relaxed space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-[#1D1D1F]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>Statutory Academic Disclaimers</span>
          </div>
          <p>
            <strong>CA Foundation Business Laws:</strong> This platform is a supplementary practice resource. Refer to the latest applicable ICAI syllabus and official study material for your examination attempt.
          </p>
          <p>
            <strong>CSEET Business Law &amp; Management:</strong> This platform is a supplementary practice resource. Follow the latest applicable ICSI syllabus and official study material for your examination attempt.
          </p>
        </div>

      </div>

      {/* Enhanced Sample Chapter Preview Modal */}
      <EnhancedSampleChapterModal
        isOpen={sampleModalOpen}
        onClose={() => setSampleModalOpen(false)}
        bookTitle={sampleBook.title}
        bookId={sampleBook.id}
        bookPrice={sampleBook.price}
      />
    </section>
  );
}
