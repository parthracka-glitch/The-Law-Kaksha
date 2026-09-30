"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
      title: "Part 1: The Indian Contract Act",
      subtitle: "Units 1 - 9 • Smart Revision Question Bank",
      coverImage: "/covers/vol1-codex.webp",
      price: 249,
      originalPrice: 449,
      discount: "45% OFF",
      format: "pdf" as BookFormat,
      badge: "Volume 1 Only",
      popular: false,
      includedVolumes: [
        { vol: "Part 1", name: "The Indian Contract Act 1872 (Units 1-9), Model Answers & Exam Framework (540 Pgs)" },
      ],
      features: [
        "Official The Law कक्षा Smart Revision Question Bank",
        "Application-based questions & ICAI model answers",
        "Annotatable high-res DRM PDF for iPad, tablet & PC",
        "Updated for CA Foundation Paper 2 Business Laws (2026-2027)",
      ],
      ctaText: "Get Part 1 PDF",
    },
    {
      id: "ca-book-vol-2",
      title: "Part 2: Rest of the Acts",
      subtitle: "Examiner's Answer-Writing Framework",
      coverImage: "/covers/vol2-codex.webp",
      price: 249,
      originalPrice: 449,
      discount: "45% OFF",
      format: "pdf" as BookFormat,
      badge: "Volume 2 Only",
      popular: false,
      includedVolumes: [
        { vol: "Part 2", name: "Sale of Goods, Partnership, LLP & Companies Act Question Bank (490 Pgs)" },
      ],
      features: [
        "Official The Law कक्षा Smart Revision Question Bank",
        "Questions from previous ICAI exams with keywords",
        "Annotatable high-res DRM PDF for iPad, tablet & PC",
        "1.5-day exam day quick revision & practice framework",
      ],
      ctaText: "Get Part 2 PDF",
    },
    {
      id: "ca-books-both-digital",
      title: "Both Volumes (Digital PDF)",
      subtitle: "Complete 2-Volume Smart Revision Question Bank",
      coverImage: "/covers/combo-codex.webp",
      price: 399,
      originalPrice: 799,
      discount: "50% OFF",
      format: "pdf" as BookFormat,
      badge: "Best Value • Digital",
      popular: false,
      includedVolumes: [
        { vol: "Part 1", name: "The Indian Contract Act 1872 Units 1-9 (540 Pgs)" },
        { vol: "Part 2", name: "Rest of the Acts & Previous Exams Compendium (490 Pgs)" },
      ],
      features: [
        "Instant access to both Part 1 & Part 2 in student vault",
        "100% syllabus coverage (Application questions + Model answers)",
        "Searchable & annotatable high-res DRM PDFs",
        "Free statutory amendment & circular updates",
      ],
      ctaText: "Get Both Volumes (Digital)",
    },
    {
      id: "ca-books-both-hardcopies",
      title: "Hardcopies: Both Volumes",
      subtitle: "Physical 2-Book Box Set to Doorstep",
      coverImage: "/covers/combo-codex.webp",
      price: 699,
      originalPrice: 1199,
      discount: "42% OFF",
      format: "paperback" as BookFormat,
      badge: "Most Popular • Printed Set",
      popular: true,
      includedVolumes: [
        { vol: "Part 1", name: "Printed Book: The Indian Contract Act 1872 (540 Pgs)" },
        { vol: "Part 2", name: "Printed Book: Rest of the Acts & Question Bank (490 Pgs)" },
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
    <section id="pricing" className="py-10 sm:py-16 bg-white text-[#1D1D1F] border-b border-black/[0.05] relative overflow-hidden">
      {/* Minimal ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gradient-to-b from-sky-50/40 via-slate-50/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F5F5F7] border border-black/[0.06] text-xs font-medium text-[#1D1D1F] mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0071E3]" />
            <span className="tracking-[-0.01em]">Choose Your CA Study Plan</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
            Transparent Options for <span className="text-[#0071E3]">CA Aspirants</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
            Select between our acclaimed <strong>2-Volume CA Law Book Sets</strong> or specialized <strong>CA Course Subscriptions</strong>.
          </p>
        </div>

        {/* Apple Segmented Control Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-full bg-[#F5F5F7] border border-black/[0.06] gap-1 shadow-2xs max-w-md w-full sm:w-auto">
            <button
              onClick={() => setActiveMode("books")}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-full text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeMode === "books"
                  ? "bg-white text-[#1D1D1F] shadow-xs border border-black/[0.04]"
                  : "text-[#6E6E73] hover:text-[#1D1D1F]"
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#0071E3]" />
              <span>2-Volume CA Books (2 Books)</span>
            </button>

            <button
              onClick={() => setActiveMode("courses")}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-full text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeMode === "courses"
                  ? "bg-white text-[#1D1D1F] shadow-xs border border-black/[0.04]"
                  : "text-[#6E6E73] hover:text-[#1D1D1F]"
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[#0071E3]" />
              <span>CA &amp; CS Subscriptions</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* OPTION 1: 2-VOLUME CA BOOK EDITIONS (4 OPTIONS)          */}
        {/* ======================================================== */}
        {activeMode === "books" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 2-Volume Highlight Banner */}
            <div className="p-4 rounded-2xl bg-[#FBFBFD] border border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0071E3] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  2V
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1D1D1F]">
                    The Law Kaksha 2-Volume CA Flagship Law Reviewer (Single Volumes &amp; Box Sets)
                  </p>
                  <p className="text-[11px] text-[#6E6E73]">
                    Choose between <strong>Volume 1 (MCQs)</strong>, <strong>Volume 2 (RTPs &amp; Solved)</strong>, <strong>Both Volumes Digital</strong>, or <strong>Physical Hardcopies</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-medium text-[#0071E3] bg-white px-3.5 py-1.5 rounded-full border border-black/[0.06] shadow-2xs shrink-0">
                <Truck className="w-3.5 h-3.5" />
                <span>Free Pan-India Courier on Physical Sets</span>
              </div>
            </div>

            {/* 4 Book Format Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
              {bookPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative bg-white ${
                    pkg.popular
                      ? "border-2 border-[#0071E3] shadow-[0_12px_36px_-6px_rgba(0,113,227,0.14)]"
                      : "border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-black/[0.16] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
                  }`}
                >
                  <div>
                    {/* Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full ${
                          pkg.popular
                            ? "bg-[#0071E3]/[0.08] text-[#0071E3] border border-[#0071E3]/20"
                            : "bg-black/[0.04] text-[#6E6E73]"
                        }`}
                      >
                        {pkg.badge}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {pkg.discount}
                      </span>
                    </div>

                    {/* Book Front Cover 3D Display */}
                    <div className="relative mx-auto mb-4 w-full flex items-center justify-center py-1">
                      <div className="relative group/book rounded-2xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-black/[0.06] bg-white transition-all duration-300 hover:shadow-[0_16px_32px_rgba(0,113,227,0.18)] hover:-translate-y-1">
                        {/* 3D Spine Lighting highlight */}
                        <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/20 via-white/20 to-transparent z-10 pointer-events-none" />
                        <Image
                          src={pkg.coverImage}
                          alt={pkg.title}
                          width={260}
                          height={390}
                          className="h-44 sm:h-48 w-auto object-cover object-top transition-transform duration-300 group-hover/book:scale-[1.02]"
                        />
                      </div>
                    </div>

                    <h3 className="text-base font-semibold text-[#1D1D1F] mb-1 leading-snug">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-[#86868B] mb-3 leading-relaxed">{pkg.subtitle}</p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 py-2.5 border-y border-black/[0.05] mb-3.5">
                      <span className="text-2xl font-bold text-[#1D1D1F] tracking-tight">
                        ₹{pkg.price}
                      </span>
                      <span className="text-xs text-[#86868B] line-through">
                        ₹{pkg.originalPrice}
                      </span>
                      <span className="text-[10px] text-[#86868B] ml-auto">One-time purchase</span>
                    </div>

                    {/* Included Volumes Box */}
                    <div className="space-y-1.5 mb-3.5 p-3 rounded-2xl bg-[#F5F5F7] border border-black/[0.04]">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#86868B]">
                        Included in this Edition:
                      </p>
                      {pkg.includedVolumes.map((v, vIdx) => (
                        <div key={vIdx} className="flex items-start gap-1.5 text-xs text-[#424245]">
                          <span className="font-semibold text-[#0071E3] shrink-0 text-[11px]">{v.vol}:</span>
                          <span className="text-[11px] leading-tight">{v.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2 text-xs text-[#6E6E73] mb-5">
                      {pkg.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0071E3] shrink-0 mt-0.5" />
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
                      className="w-full py-2 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 transition-all text-[#1D1D1F] bg-black/[0.04] hover:bg-black/[0.07] border border-black/[0.06] cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#0071E3]" />
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
                      className={`w-full py-2.5 rounded-full text-xs font-medium flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-xs cursor-pointer ${
                        pkg.popular
                          ? "bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-[0_2px_8px_rgba(0,113,227,0.3)]"
                          : "bg-[#1D1D1F] hover:bg-[#2D2D2F] text-white"
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
            <div className="p-4 rounded-2xl bg-[#FBFBFD] border border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0071E3] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  🎓
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1D1D1F]">
                    Targeted CA Business Law (Main Notes) &amp; CS Specialization (MCQs Bank)
                  </p>
                  <p className="text-[11px] text-[#6E6E73]">
                    <strong>CA Plan:</strong> 5 statutory acts (ICA, LLP, Companies Act, SOGA, NI Act) &bull; <strong>CS Plan:</strong> Comprehensive MCQs in Business Law, Management &amp; Communication.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-medium text-[#0071E3] bg-white px-3.5 py-1.5 rounded-full border border-black/[0.06] shadow-2xs shrink-0">
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
                    className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative bg-white ${
                      plan.popular
                        ? "border-2 border-[#0071E3] shadow-[0_12px_36px_-6px_rgba(0,113,227,0.14)]"
                        : "border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-black/[0.16] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
                    }`}
                  >
                    <div>
                      {/* Top Row: Icon, Badge & Discount */}
                      <div className="flex items-center justify-between gap-2 mb-3.5">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-xl ${plan.popular ? "bg-[#0071E3]/[0.08] text-[#0071E3]" : "bg-black/[0.04] text-[#424245]"}`}>
                            <PlanIcon className="w-4 h-4" />
                          </div>
                          <span
                            className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full ${
                              plan.popular
                                ? "bg-[#0071E3]/[0.08] text-[#0071E3] border border-[#0071E3]/20"
                                : "bg-black/[0.04] text-[#6E6E73]"
                            }`}
                          >
                            {plan.badge}
                          </span>
                        </div>

                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {plan.discount}
                        </span>
                      </div>

                      {/* Title & Target */}
                      <h3 className="text-lg font-semibold text-[#1D1D1F] mb-0.5">
                        {plan.title}
                      </h3>
                      <p className="text-xs font-medium text-[#0071E3] mb-2">{plan.targetExam}</p>
                      <p className="text-xs text-[#6E6E73] leading-relaxed mb-3.5 line-clamp-2">{plan.tagline}</p>

                      {/* Price Strip */}
                      <div className="flex items-baseline gap-2 py-2.5 border-y border-black/[0.05] mb-3.5">
                        <span className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] tracking-tight">
                          ₹{plan.price}
                        </span>
                        <span className="text-xs text-[#86868B] line-through">
                          ₹{plan.originalPrice}
                        </span>
                        <span className="text-[11px] font-medium text-[#0071E3] ml-auto">
                          {plan.duration}
                        </span>
                      </div>

                      {/* Core Modules Breakdown Box */}
                      <div className="space-y-2 mb-3.5 p-3 rounded-2xl bg-[#F5F5F7] border border-black/[0.04]">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#86868B] flex items-center gap-1">
                          <Layers className="w-3 h-3 text-[#0071E3]" />
                          <span>ICAI Syllabus Modules:</span>
                        </p>

                        {plan.coreModules.map((mod, mIdx) => (
                          <div key={mIdx} className="space-y-1">
                            <span className="text-[11px] font-semibold text-[#1D1D1F] block">
                              {mod.title}
                            </span>
                            <ul className="space-y-0.5 pl-1">
                              {mod.topics.map((top, tIdx) => (
                                <li key={tIdx} className="text-[10.5px] text-[#424245] flex items-start gap-1 leading-snug">
                                  <span className="text-[#0071E3] font-bold">•</span>
                                  <span>{top}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Features Checklist */}
                      <div className="space-y-1.5 mb-5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#86868B]">
                          Course Inclusions:
                        </p>
                        {plan.features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-[#6E6E73]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0071E3] shrink-0 mt-0.5" />
                            <span className="leading-snug">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dual Action: Sample & Enroll */}
                    <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => handleOpenSample(plan.title, plan.id, plan.price)}
                        className="flex-1 py-2.5 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 transition-all text-[#1D1D1F] bg-black/[0.04] hover:bg-black/[0.07] border border-black/[0.06] cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#0071E3]" />
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
                        className={`flex-1 py-2.5 rounded-full text-xs font-medium flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-xs cursor-pointer ${
                          plan.popular
                            ? "bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-[0_2px_8px_rgba(0,113,227,0.3)]"
                            : "bg-[#1D1D1F] hover:bg-[#2D2D2F] text-white"
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
