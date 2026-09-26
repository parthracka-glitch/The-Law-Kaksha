"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  Briefcase,
  Star,
  Sparkles,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
} from "lucide-react";
import { EnhancedSampleChapterModal } from "./EnhancedSampleChapterModal";

interface CarouselSlide {
  id: string;
  categoryTag: string;
  badge: string;
  icon: any;
  title: string;
  subtitle: string;
  editionBadge: string;
  features: string[];
  price: number;
  originalPrice: number;
  sampleBookId: string;
}

const HERO_SLIDES: CarouselSlide[] = [
  {
    id: "slide-ca-inter",
    categoryTag: "CA Intermediate • Paper 2 Corporate & Other Laws",
    badge: "2026-2027 Master Edition",
    editionBadge: "ICAI New Scheme Aligned",
    icon: Building2,
    title: "CA Inter Corporate & Other Laws",
    subtitle: "Complete Chapter-wise Companies Act 2013 (Sec 1-148), General Clauses Act, Interpretation of Statutes & FCRA with 10-Attempt Solved RTPs/MTPs.",
    features: [
      "Companies Act 2013 Management, Administration, Accounts & Audit Sections",
      "30-Mark Mandatory Case-Scenario MCQs + 70-Mark Descriptive Model Answers",
      "Section 135 CSR & MCA 2026-2027 Notifications Fully Integrated",
    ],
    price: 299,
    originalPrice: 499,
    sampleBookId: "ca-inter",
  },
  {
    id: "slide-ca-final",
    categoryTag: "CA Final • Corporate, Securities & Economic Laws",
    badge: "Nov'26 & May'27 Batch",
    editionBadge: "Comprehensive Codex",
    icon: Briefcase,
    title: "CA Final Corporate & Economic Laws",
    subtitle: "Exhaustive case-scenario solver covering Companies Act 2013, IBC 2016, SEBI LODR/ICDR Regulations, FEMA 1999 & PMLA with Model Answers.",
    features: [
      "Insolvency & Bankruptcy Code 2016 (CIRP, Pre-Pack, Liquidation Ratios)",
      "SEBI LODR Regulations & Practical Board Compliance Caselets",
      "Past 10 Attempts Solved RTPs, MTPs & ICAI Suggested Answers",
    ],
    price: 349,
    originalPrice: 549,
    sampleBookId: "ca-final",
  },
  {
    id: "slide-ca-foundation",
    categoryTag: "CA Foundation • Paper 2 Business Laws",
    badge: "Foundation Accelerator",
    editionBadge: "ICAI Pattern Ready",
    icon: FileSpreadsheet,
    title: "CA Foundation Business Laws Master Codex",
    subtitle: "Step-by-step case study decoding for Indian Contract Act 1872, Sale of Goods 1930, Indian Partnership 1932, LLP 2008 & Companies Act.",
    features: [
      "Indian Regulatory Framework & Landmark Contract Case Law Blueprints",
      "Examiner Fact-Based Problem Solving & Structured Model Conclusions",
      "600+ Objective Drill Questions & Chapter Recap Mind Maps",
    ],
    price: 249,
    originalPrice: 399,
    sampleBookId: "ca-foundation",
  },
];

const AUTO_PLAY_INTERVAL = 4500;

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
      <section className="relative overflow-hidden bg-white pt-6 pb-8 md:pt-8 md:pb-10 border-b border-slate-100">
        
        {/* Soft, clean ambient gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[400px] bg-gradient-to-b from-sky-50/70 via-sky-50/20 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            
            {/* Left Column: Authoritative Editorial Copy */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              
              {/* Dynamic Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-[#0284C7] shadow-xs transition-all duration-300">
                <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse" />
                <span className="tracking-wide">ICAI 2026 Master Series: {active.categoryTag}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-5.5xl font-serif font-black text-slate-900 tracking-tight leading-[1.14]">
                Master CA Law &amp; Regulations with{" "}
                <span className="text-[#0284C7]">Supreme Precision.</span>
              </h1>

              {/* Concise Subtitle */}
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Engineered exclusively for <strong className="text-slate-900 font-semibold">CA Foundation, CA Intermediate &amp; CA Final</strong> aspirants. 
                Integrating <strong className="text-slate-800 font-semibold">10-attempt solved RTPs, MTPs &amp; Suggested Answers</strong>, Companies Act 2013 sections, MCA notifications, IBC 2016, and ICAI examiner scoring rubrics.
              </p>

              {/* Dual Clean CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-1">
                <Link
                  href="#pricing"
                  className="inline-flex items-center gap-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl shadow-xs transition-all hover:shadow-md hover:shadow-sky-500/20 active:scale-95"
                >
                  <span>Explore CA Books &amp; Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setSampleModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-sky-300 text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl transition-all shadow-xs active:scale-95"
                >
                  <Eye className="w-4 h-4 text-[#0284C7]" />
                  <span>View Sample Chapter</span>
                </button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-center lg:justify-start gap-3 pt-1 text-xs text-slate-500">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span>Rated <strong>4.9/5</strong> by 38,000+ Chartered Accountancy Aspirants Across India</span>
              </div>
            </div>

            {/* Right Column: Clean Minimal 3D Card Showcase */}
            <div
              className="lg:col-span-5 flex flex-col items-center"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="w-full relative group">
                
                {/* Minimal Card with Subtle 3D Hover Lift */}
                <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-[0_8px_30px_rgba(2,132,199,0.06)] p-5 sm:p-6 card-3d-minimal">
                  
                  {/* Top Bar: Edition & Slide Indicators */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-sky-50 border border-sky-200 text-[#0284C7]">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-900 font-serif">
                        {active.editionBadge}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-[#0284C7] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100 font-mono">
                        {active.badge}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        0{currentSlide + 1} / 0{HERO_SLIDES.length}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Slide Title & Description */}
                  <div className="min-h-[135px] flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-serif font-black text-slate-900 leading-snug tracking-tight">
                        {active.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {active.subtitle}
                      </p>
                    </div>

                    {/* 3 Core Highlight Bullets */}
                    <div className="mt-2.5 space-y-1.5 py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100">
                      {active.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-[11px] text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action Strip */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">
                        ICAI Law Reviewer
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-black text-slate-900 font-mono">
                          ₹{active.price}
                        </span>
                        <span className="text-xs text-slate-400 line-through font-mono">
                          ₹{active.originalPrice}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSampleModalOpen(true)}
                        className="p-2 rounded-xl text-slate-600 hover:text-[#0284C7] hover:bg-sky-50 transition-colors border border-slate-200 shadow-2xs"
                        title="Instant Preview Sample"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <Link
                        href="#pricing"
                        className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
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
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        aria-label="Previous Slide"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        aria-label="Next Slide"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
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
                            style={{ width: isCurrent ? "44px" : "18px" }}
                            aria-label={`Go to slide ${idx + 1}`}
                          >
                            {isCurrent && (
                              <div
                                className="absolute top-0 bottom-0 left-0 bg-[#0284C7] rounded-full transition-all"
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

        {/* Enhanced Sample Reader Modal */}
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
