"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  BookOpen,
  GraduationCap,
  Sparkles,
  Truck,
  Zap,
  ShieldCheck,
  Star,
  Check,
  Layers,
  Award,
  Briefcase,
  Building2,
  FileSpreadsheet,
  Eye,
} from "lucide-react";
import { useCart, BookFormat } from "@/context/CartContext";
import { EnhancedSampleChapterModal } from "./EnhancedSampleChapterModal";

type PricingMode = "books" | "courses";

export function SmartChoicePricing() {
  const [activeMode, setActiveMode] = useState<PricingMode>("books");
  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [sampleBook, setSampleBook] = useState({
    title: "Volume 1: CA Law Codex",
    id: "ca-book-vol-1",
    price: 249,
  });
  const { addToCart } = useCart();

  const handleOpenSample = (title: string, id: string, price: number) => {
    setSampleBook({ title, id, price });
    setSampleModalOpen(true);
  };

  // 1. The 4 CA Book Options (Volume 1, Volume 2, Both Volumes Digital, and Hardcopies of Both Volumes)
  const bookPackages = [
    {
      id: "ca-book-vol-1",
      title: "Volume 1: CA Law Codex",
      subtitle: "Case Scenarios, Section Notes & 1,200+ MCQs",
      price: 249,
      originalPrice: 449,
      discount: "45% OFF",
      format: "pdf" as BookFormat,
      badge: "Volume 1 Only",
      popular: false,
      includedVolumes: [
        { vol: "Vol. 1", name: "Companies Act 2013 & Other Laws 1,200+ Case Scenarios & MCQs (540 Pgs)" },
      ],
      features: [
        "Immediate PDF delivery to student portal vault",
        "Section-by-section breakdown for 30-mark MCQs",
        "Annotatable high-res DRM PDF for iPad & PC",
        "Updated for ICAI 2026-2027 examination syllabus",
      ],
      ctaText: "Get Volume 1 PDF",
    },
    {
      id: "ca-book-vol-2",
      title: "Volume 2: Solved RTP/MTPs",
      subtitle: "9-Attempt Solved Papers & Descriptive Models",
      price: 249,
      originalPrice: 449,
      discount: "45% OFF",
      format: "pdf" as BookFormat,
      badge: "Volume 2 Only",
      popular: false,
      includedVolumes: [
        { vol: "Vol. 2", name: "Past 9-Attempt Solved RTPs, MTPs & Examiner Scoring Rubrics (490 Pgs)" },
      ],
      features: [
        "Immediate PDF delivery to student portal vault",
        "Step-by-step scoring keywords for 70-mark descriptive",
        "Annotatable high-res DRM PDF for iPad & PC",
        "1.5-day exam day quick revision summaries",
      ],
      ctaText: "Get Volume 2 PDF",
    },
    {
      id: "ca-books-both-digital",
      title: "Both Volumes (Digital PDF)",
      subtitle: "Complete Digital 2-Book Bundle (Vol 1 + Vol 2)",
      price: 399,
      originalPrice: 799,
      discount: "50% OFF",
      format: "pdf" as BookFormat,
      badge: "Best Value • Digital",
      popular: false,
      includedVolumes: [
        { vol: "Vol. 1", name: "Case Scenarios & Objective MCQ Codex (540 Pgs)" },
        { vol: "Vol. 2", name: "9-Attempt Solved RTPs, MTPs & Model Answers (490 Pgs)" },
      ],
      features: [
        "Instant access to both Vol 1 & Vol 2 in student vault",
        "100% exam coverage (30-mark MCQs + 70-mark Descriptive)",
        "Searchable & annotatable high-res DRM PDFs",
        "Free statutory MCA circulars & amendment updates",
      ],
      ctaText: "Get Both Volumes (Digital)",
    },
    {
      id: "ca-books-both-hardcopies",
      title: "Hardcopies: Both Volumes",
      subtitle: "Physical 2-Book Box Set to Doorstep",
      price: 699,
      originalPrice: 1199,
      discount: "42% OFF",
      format: "paperback" as BookFormat,
      badge: "Most Popular • Printed Set",
      popular: true,
      includedVolumes: [
        { vol: "Printed 1", name: "Physical Book: Volume 1 Case Scenarios & MCQs (540 Pgs)" },
        { vol: "Printed 2", name: "Physical Book: Volume 2 RTPs & Descriptive Codex (490 Pgs)" },
      ],
      features: [
        "Both physical books shipped in a protective box set",
        "Free express air courier with live AWB tracking across India",
        "Premium 80 GSM paper with wide margins for case notes",
        "Includes instant digital PDF access while books are in transit",
      ],
      ctaText: "Order Both Hardcopies",
    },
  ];

  // 2. The 2 Specialized Subscription Plans (CA Business Law Main Notes vs CS MCQs)
  const coursePlans = [
    {
      id: "ca-business-law-plan",
      title: "CA Business Law Main Notes Subscription",
      targetExam: "CA Foundation & Intermediate (ICAI Scheme)",
      tagline: "Comprehensive in-depth conceptual notes, statutory sections, case analysis & model answers across 5 core business law acts.",
      duration: "6 Months All-Access Batch",
      price: 1999,
      originalPrice: 3499,
      discount: "43% OFF",
      badge: "CA Flagship • Main Notes",
      popular: true,
      icon: Building2,
      coreModules: [
        {
          title: "5 Core Business Law Subjects (Different Notes):",
          topics: [
            "1. ICA — Indian Contract Act, 1872 (Special Contracts, Indemnity, Bailment & Agency)",
            "2. LLP — Limited Liability Partnership Act, 2008 (Incorporation & Governance)",
            "3. Co.s Act — The Companies Act, 2013 (Sec 1-148, Share Capital, Audit & CSR §135)",
            "4. SOGA — Sale of Goods Act, 1930 (Conditions, Warranties, Unpaid Seller Rights)",
            "5. NI Act — Negotiable Instruments Act, 1881 (Promissory Notes, Bills, Dishonour)",
          ],
        },
      ],
      features: [
        "Dedicated separate notes for all 5 statutory Acts (ICA, LLP, Co.s Act, SOGA, NI Act)",
        "120+ Hours HD Video Masterclasses & Chapter-wise Case Law Digests",
        "30-Mark Mandatory Case-Scenario MCQs + 70-Mark Descriptive Models",
        "2-Volume Deluxe Physical Books Delivered to Doorstep (Free Courier)",
        "1-on-1 Evaluated Answer Copies with CA Ranker Feedback",
      ],
      ctaText: "Buy this Course",
    },
    {
      id: "cs-mcq-mastery-plan",
      title: "CS MCQ Mastery Specialization Subscription",
      targetExam: "CS Executive & CSEET (ICSI Scheme)",
      tagline: "Dedicated high-yield objective MCQ test bank & sectional speed drills across Business Law, Business Management & Business Communication.",
      duration: "6 Months Unlimited MCQ Access",
      price: 1499,
      originalPrice: 2799,
      discount: "46% OFF",
      badge: "CS Specialization • MCQs Focus",
      popular: false,
      icon: FileSpreadsheet,
      coreModules: [
        {
          title: "3 Core CS MCQ Test Bank Modules:",
          topics: [
            "1. Business Law (MCQs) — Companies Act, Commercial Laws & Legal Aptitude MCQs",
            "2. Business Management (Business Mgt. MCQs) — Principles, Planning, Governance & Leadership",
            "3. Business Communication (Business Comm. MCQs) — Corporate Correspondence & Verbal Drills",
          ],
        },
      ],
      features: [
        "2,500+ Curated High-Yield MCQs with instant step-by-step rationales",
        "Topic-wise timed speed drills for Business Law, Business Mgt & Business Comm",
        "Simulated ICSI-pattern examination engine with negative marking analytics",
        "Previous 8-attempt solved CS objective papers scanner",
        "Instant digital vault access with downloadable 1.5-day MCQ cheat sheets",
      ],
      ctaText: "Buy this Course",
    },
  ];

  return (
    <section id="pricing" className="py-8 sm:py-10 bg-white text-slate-800 border-b border-slate-200/80 relative overflow-hidden">
      {/* Ambient background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-gradient-to-b from-sky-100/40 via-sky-50/20 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-[11px] font-semibold text-[#0284C7] mb-2 shadow-xs">
            <Sparkles className="w-3 h-3 text-[#0284C7]" />
            <span className="uppercase tracking-wider">Choose Your CA Study Plan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
            Transparent Options for <span className="text-[#0284C7]">CA Aspirants</span>
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
            Select between our acclaimed <strong>2-Volume CA Law Book Sets</strong> or specialized <strong>CA Course Subscriptions</strong>.
          </p>
        </div>

        {/* Master Mode Switcher (2-Volume Books vs CA Course Subscriptions) */}
        <div className="flex justify-center mb-7">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 gap-1 shadow-xs max-w-md w-full sm:w-auto">
            <button
              onClick={() => setActiveMode("books")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                activeMode === "books"
                  ? "bg-white text-slate-900 font-bold shadow-xs border border-slate-200/90 text-[#0284C7]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#0284C7]" />
              <span>2-Volume CA Books (2 Books)</span>
            </button>

            <button
              onClick={() => setActiveMode("courses")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                activeMode === "courses"
                  ? "bg-white text-slate-900 font-bold shadow-xs border border-slate-200/90 text-[#0284C7]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[#0284C7]" />
              <span>CA &amp; CS Subscriptions (CA Notes vs CS MCQs)</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* OPTION 1: 2-VOLUME CA BOOK EDITIONS (4 OPTIONS)          */}
        {/* ======================================================== */}
        {activeMode === "books" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 2-Volume Highlight Banner */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-sky-50/60 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0284C7] text-white flex items-center justify-center font-serif font-black text-xs shrink-0 shadow-xs">
                  2V
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    The Law Kaksha 2-Volume CA Flagship Law Reviewer (Single Volumes &amp; Box Sets)
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Choose between <strong>Volume 1 (MCQs)</strong>, <strong>Volume 2 (RTPs &amp; Solved)</strong>, <strong>Both Volumes Digital</strong>, or <strong>Physical Hardcopies</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-semibold text-[#0284C7] bg-white px-3 py-1 rounded-lg border border-sky-200 shrink-0">
                <Truck className="w-3.5 h-3.5" />
                <span>Free Pan-India Courier on Physical Sets</span>
              </div>
            </div>

            {/* 4 Book Format Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
              {bookPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 relative ${
                    pkg.popular
                      ? "bg-white border-2 border-[#0284C7] shadow-[0_8px_28px_-6px_rgba(2,132,199,0.12)]"
                      : "bg-white border border-slate-200/90 hover:border-slate-300"
                  }`}
                >
                  <div>
                    {/* Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                          pkg.popular
                            ? "bg-sky-50 text-[#0284C7] border border-sky-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {pkg.badge}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        {pkg.discount}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 mb-1">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">{pkg.subtitle}</p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 py-2.5 border-y border-slate-100 mb-3.5">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                        ₹{pkg.price}
                      </span>
                      <span className="text-xs text-slate-400 line-through font-mono">
                        ₹{pkg.originalPrice}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-auto">One-time purchase</span>
                    </div>

                    {/* Included Volumes Box */}
                    <div className="space-y-1.5 mb-3.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Included in this Edition:
                      </p>
                      {pkg.includedVolumes.map((v, vIdx) => (
                        <div key={vIdx} className="flex items-start gap-1.5 text-xs text-slate-700">
                          <span className="font-bold text-[#0284C7] shrink-0 text-[11px]">{v.vol}:</span>
                          <span className="text-[11px] leading-tight">{v.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2 text-xs text-slate-600 mb-5">
                      {pkg.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Dual Action Strip: Preview & Buy */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenSample(pkg.title, pkg.id, pkg.price)}
                      className="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-slate-700 bg-slate-50 hover:bg-sky-50 hover:text-[#0284C7] border border-slate-200 hover:border-sky-300"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>Preview Sample PDF</span>
                    </button>

                    <button
                      onClick={() =>
                        addToCart({
                          id: pkg.id,
                          title: pkg.title,
                          format: pkg.format,
                          price: pkg.price,
                          originalPrice: pkg.originalPrice,
                          category: "2-Volume CA Book Set",
                          badge: pkg.badge,
                        })
                      }
                      className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs ${
                        pkg.popular
                          ? "bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-md shadow-sky-500/20"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{pkg.ctaText}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* OPTION 2: CA & CS COURSE SUBSCRIPTION PLANS (2 PLANS)    */}
        {/* ======================================================== */}
        {activeMode === "courses" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Course Subscription Banner */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-sky-50/60 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0284C7] text-white flex items-center justify-center font-serif font-black text-xs shrink-0 shadow-xs">
                  🎓
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Targeted CA Business Law (Main Notes) &amp; CS Specialization (MCQs Bank)
                  </p>
                  <p className="text-[11px] text-slate-600">
                    <strong>CA Plan:</strong> 5 statutory acts (ICA, LLP, Companies Act, SOGA, NI Act) &bull; <strong>CS Plan:</strong> Comprehensive MCQs in Business Law, Management &amp; Communication.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-semibold text-[#0284C7] bg-white px-3 py-1 rounded-lg border border-sky-200 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ICAI &amp; ICSI Curriculum Certified</span>
              </div>
            </div>

            {/* 2-Column Grid for CA Plan & CS Plan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch">
              {coursePlans.map((plan) => {
                const PlanIcon = plan.icon;
                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 relative ${
                      plan.popular
                        ? "bg-white border-2 border-[#0284C7] shadow-[0_8px_30px_-6px_rgba(2,132,199,0.12)]"
                        : "bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs"
                    }`}
                  >
                    <div>
                      {/* Top Row: Icon, Badge & Discount */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${plan.popular ? "bg-sky-100 text-[#0284C7]" : "bg-slate-100 text-slate-700"}`}>
                            <PlanIcon className="w-4 h-4" />
                          </div>
                          <span
                            className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                              plan.popular
                                ? "bg-sky-50 text-[#0284C7] border border-sky-200"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {plan.badge}
                          </span>
                        </div>

                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          {plan.discount}
                        </span>
                      </div>

                      {/* Title & Target */}
                      <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 mb-0.5">
                        {plan.title}
                      </h3>
                      <p className="text-xs font-semibold text-[#0284C7] mb-2">{plan.targetExam}</p>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-2">{plan.tagline}</p>

                      {/* Price Strip */}
                      <div className="flex items-baseline gap-2 py-2.5 border-y border-slate-100 mb-3.5">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                          ₹{plan.price}
                        </span>
                        <span className="text-xs text-slate-400 line-through font-mono">
                          ₹{plan.originalPrice}
                        </span>
                        <span className="text-[11px] font-semibold text-[#0284C7] ml-auto">
                          {plan.duration}
                        </span>
                      </div>

                      {/* Core Modules Breakdown Box */}
                      <div className="space-y-2 mb-3.5 p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/80">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                          <Layers className="w-3 h-3 text-[#0284C7]" />
                          <span>ICAI Syllabus Modules:</span>
                        </p>

                        {plan.coreModules.map((mod, mIdx) => (
                          <div key={mIdx} className="space-y-1">
                            <span className="text-[11px] font-bold text-slate-800 block">
                              {mod.title}
                            </span>
                            <ul className="space-y-0.5 pl-1">
                              {mod.topics.map((top, tIdx) => (
                                <li key={tIdx} className="text-[10.5px] text-slate-600 flex items-start gap-1 leading-snug">
                                  <span className="text-[#0284C7] font-bold">•</span>
                                  <span>{top}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Features Checklist */}
                      <div className="space-y-1.5 mb-5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Course Inclusions:
                        </p>
                        {plan.features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                            <span className="leading-snug">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dual Action: Sample & Enroll */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleOpenSample(plan.title, plan.id, plan.price)}
                        className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-slate-700 bg-slate-50 hover:bg-sky-50 hover:text-[#0284C7] border border-slate-200 hover:border-sky-300"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#0284C7]" />
                        <span>Preview Sample PDF</span>
                      </button>

                      <button
                        onClick={() =>
                          addToCart({
                            id: plan.id,
                            title: plan.title,
                            format: "combo",
                            price: plan.price,
                            originalPrice: plan.originalPrice,
                            category: "CA Course Subscription",
                            badge: plan.badge,
                          })
                        }
                        className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs ${
                          plan.popular
                            ? "bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-md shadow-sky-500/20"
                            : "bg-slate-900 hover:bg-slate-800 text-white"
                        }`}
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>{plan.ctaText}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
