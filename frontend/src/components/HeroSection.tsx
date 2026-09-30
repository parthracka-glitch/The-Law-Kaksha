"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  Briefcase,
  Star,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  BookOpen,
  ShieldCheck,
  Sparkles,
  Download,
} from "lucide-react";
import { EnhancedSampleChapterModal } from "./EnhancedSampleChapterModal";

interface CarouselSlide {
  id: string;
  categoryTag: string;
  level: "foundation" | "inter" | "final";
  badge: string;
  editionBadge: string;
  icon: any;
  title: string;
  subtitle: string;
  features: string[];
  price: number;
  originalPrice: number;
  sampleBookId: string;
  coverImage: string;
}

const HERO_SLIDES: CarouselSlide[] = [
  {
    id: "slide-ca-inter",
    categoryTag: "CA Intermediate • Paper 2 Corporate & Other Laws",
    level: "inter",
    badge: "2026-2027 Master Edition",
    editionBadge: "ICAI New Scheme Aligned",
    icon: Building2,
    title: "CA Inter Corporate & Other Laws",
    subtitle:
      "Complete Chapter-wise Companies Act 2013 (Sec 1-148), General Clauses Act, Interpretation of Statutes & FCRA with 10-Attempt Solved RTPs/MTPs.",
    features: [
      "Companies Act 2013 Management, Administration, Accounts & Audit Sections",
      "30-Mark Mandatory Case-Scenario MCQs + 70-Mark Descriptive Model Answers",
      "Section 135 CSR & MCA 2026-2027 Notifications Fully Integrated",
    ],
    price: 299,
    originalPrice: 499,
    sampleBookId: "ca-inter",
    coverImage: "/assets/bookcover.png",
  },
  {
    id: "slide-ca-final",
    categoryTag: "CA Final • Corporate, Securities & Economic Laws",
    level: "final",
    badge: "Nov'26 & May'27 Batch",
    editionBadge: "Comprehensive Codex",
    icon: Briefcase,
    title: "CA Final Corporate & Economic Laws",
    subtitle:
      "Exhaustive case-scenario solver covering Companies Act 2013, IBC 2016, SEBI LODR/ICDR Regulations, FEMA 1999 & PMLA with Model Answers.",
    features: [
      "Insolvency & Bankruptcy Code 2016 (CIRP, Pre-Pack, Liquidation Ratios)",
      "SEBI LODR Regulations & Practical Board Compliance Caselets",
      "Past 10 Attempts Solved RTPs, MTPs & ICAI Suggested Answers",
    ],
    price: 349,
    originalPrice: 549,
    sampleBookId: "ca-final",
    coverImage: "/covers/vol2-codex.webp",
  },
  {
    id: "slide-ca-foundation",
    categoryTag: "CA Foundation • Paper 2 Business Laws",
    level: "foundation",
    badge: "Foundation Accelerator",
    editionBadge: "ICAI Pattern Ready",
    icon: FileSpreadsheet,
    title: "CA Foundation Business Laws Master Codex",
    subtitle:
      "Step-by-step case study decoding for Indian Contract Act 1872, Sale of Goods 1930, Indian Partnership 1932, LLP 2008 & Companies Act.",
    features: [
      "Indian Regulatory Framework & Landmark Contract Case Law Blueprints",
      "Examiner Fact-Based Problem Solving & Structured Model Conclusions",
      "600+ Objective Drill Questions & Chapter Recap Mind Maps",
    ],
    price: 249,
    originalPrice: 399,
    sampleBookId: "ca-foundation",
    coverImage: "/covers/vol1-codex.webp",
  },
];

const AUTO_PLAY_INTERVAL = 5500;

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPaused) {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    const stepMs = 50;
    const increment = (stepMs / AUTO_PLAY_INTERVAL) * 100;

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((curr) => (curr + 1) % HERO_SLIDES.length);
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPaused, currentSlide]);

  const selectSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setProgress(0);
  };

  const active = HERO_SLIDES[currentSlide];
  const IconComponent = active.icon;

  return (
    <>
      <section className="relative overflow-hidden bg-slate-50/70 border-b border-slate-200/80 pt-8 pb-14 md:pt-14 md:pb-20">
        {/* Subtle Watermark Element Motif from assets/element lawkaksha.png */}
        <div className="absolute right-[-60px] top-[-60px] w-[460px] h-[460px] opacity-[0.045] pointer-events-none select-none -z-0">
          <Image
            src="/assets/element lawkaksha.png"
            alt="The Law Kaksha Motif"
            width={460}
            height={460}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="absolute left-[-80px] bottom-[-60px] w-[360px] h-[360px] opacity-[0.03] pointer-events-none select-none -z-0">
          <Image
            src="/assets/element lawkaksha.png"
            alt="The Law Kaksha Motif"
            width={360}
            height={360}
            className="w-full h-full object-contain rotate-45"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Level Switcher Tabs: CA Foundation | CA Inter | CA Final */}
          <div className="flex justify-center lg:justify-start mb-6">
            <div className="inline-flex p-1 rounded-full bg-slate-200/70 border border-slate-300/80 text-xs font-medium text-slate-700">
              {HERO_SLIDES.map((slide, idx) => {
                const isActive = currentSlide === idx;
                return (
                  <button
                    key={slide.id}
                    onClick={() => selectSlide(idx)}
                    className={`px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#0A192F] text-white shadow-xs font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-300/50"
                    }`}
                  >
                    {slide.level === "foundation"
                      ? "CA Foundation"
                      : slide.level === "inter"
                      ? "CA Intermediate"
                      : "CA Final"}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Authoritative Editorial Copy */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              {/* Matte Badge Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-semibold text-[#005A9C]">
                <span className="w-2 h-2 rounded-full bg-[#005A9C] shrink-0" />
                <span className="tracking-tight">{active.categoryTag}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-bold text-[#0A192F] tracking-tight leading-[1.14] font-serif">
                Master CA Law &amp; Regulations with{" "}
                <span className="text-[#005A9C] underline decoration-blue-300 decoration-2 underline-offset-4">
                  Supreme Precision.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {active.subtitle}
              </p>

              {/* Core Highlight Bullets with Matte Checkmarks */}
              <div className="space-y-2 pt-1 max-w-xl mx-auto lg:mx-0 text-left">
                {active.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#005A9C] shrink-0 mt-0.5" />
                    <span className="font-medium leading-snug">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-3">
                <button
                  onClick={() => setSampleModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-[#005A9C] hover:bg-[#00487D] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-lg shadow-xs transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Read Free Sample Chapter (6-Page Codex)</span>
                </button>

                <Link
                  href="#pricing"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-[#0A192F] border border-slate-300 text-xs sm:text-sm font-semibold px-6 py-3 rounded-lg shadow-2xs transition-all duration-200 active:scale-95"
                >
                  <span>Enroll in Full Course</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-center lg:justify-start gap-3 pt-2 text-xs text-slate-500">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span>
                  Rated <strong className="text-slate-800 font-bold">4.9/5</strong> by 38,000+ Chartered Accountancy Aspirants Across India
                </span>
              </div>
            </div>

            {/* Right Column: Clean 3D Matte Book Codex Showcase */}
            <div
              className="lg:col-span-5 flex flex-col items-center"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="w-full max-w-md relative group">
                {/* Clean Matte Card with Crisp 1px Border */}
                <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-sm p-6">
                  {/* Top Bar: Badge & Slide Index */}
                  <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-blue-50 border border-blue-100 text-[#005A9C]">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-[#0A192F]">
                        {active.editionBadge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-[#005A9C] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/60 font-mono">
                        {active.badge}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        0{currentSlide + 1} / 0{HERO_SLIDES.length}
                      </span>
                    </div>
                  </div>

                  {/* 3D Realistic Book Graphic Display */}
                  <div className="relative my-2 py-4 flex items-center justify-center bg-slate-50/80 rounded-xl border border-slate-100 overflow-hidden">
                    <div className="relative w-44 h-60 sm:w-48 sm:h-64 transition-transform duration-300 group-hover:scale-105 shadow-md rounded-md overflow-hidden bg-white border border-slate-200">
                      <Image
                        src={active.coverImage}
                        alt={active.title}
                        fill
                        className="object-cover"
                        priority
                      />
                      {/* Realistic book spine shadow */}
                      <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/25 via-black/10 to-transparent pointer-events-none" />
                    </div>

                    {/* Quick Preview Hover Trigger */}
                    <button
                      onClick={() => setSampleModalOpen(true)}
                      className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0A192F] hover:bg-[#005A9C] text-white text-[11px] font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                  </div>

                  {/* Dynamic Slide Title & Description */}
                  <div className="mt-3">
                    <h3 className="text-base sm:text-lg font-bold text-[#0A192F] leading-snug">
                      {active.title}
                    </h3>
                  </div>

                  {/* Price & Action Strip */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                        Institutional Edition
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-[#0A192F] tracking-tight">
                          ₹{active.price}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          ₹{active.originalPrice}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSampleModalOpen(true)}
                        className="p-2 rounded-lg text-slate-600 hover:text-[#005A9C] hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
                        title="Read Free Sample Chapter"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <Link
                        href="#pricing"
                        className="px-4 py-2 rounded-lg bg-[#005A9C] hover:bg-[#00487D] text-white text-xs font-semibold shadow-2xs transition-all active:scale-95 flex items-center gap-1.5"
                      >
                        <span>Select Plan</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Slide Navigation Dots with Live Progress Fill */}
                  <div className="mt-4 pt-3 flex items-center justify-between gap-3 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={prevSlide}
                        className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Previous Slide"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Next Slide"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Progress Bars for all 3 slides */}
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      {HERO_SLIDES.map((slide, idx) => {
                        const isCurrent = currentSlide === idx;
                        return (
                          <button
                            key={slide.id}
                            onClick={() => selectSlide(idx)}
                            className="relative h-1.5 rounded-full overflow-hidden bg-slate-200 transition-all cursor-pointer"
                            style={{ width: isCurrent ? "40px" : "16px" }}
                            aria-label={`Go to slide ${idx + 1}`}
                          >
                            {isCurrent && (
                              <div
                                className="absolute top-0 bottom-0 left-0 bg-[#005A9C] rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Reader Modal */}
        <EnhancedSampleChapterModal
          isOpen={sampleModalOpen}
          onClose={() => setSampleModalOpen(false)}
          bookTitle={active.title}
          bookId={active.sampleBookId}
          bookPrice={active.price}
        />
      </section>
    </>
  );
}
