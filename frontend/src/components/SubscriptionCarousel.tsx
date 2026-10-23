"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  BookOpen,
  Star,
  Zap,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { EnhancedSampleChapterModal } from "./EnhancedSampleChapterModal";

export interface FeaturedCourseData {
  id: string;
  categoryTag: string;
  tagColor: string;
  title: string;
  subtitle: string;
  price: number;
  mrp: number;
  discount: string;
  image: string;
  bookId: "ca-foundation" | "cseet";
  sampleTitle: string;
  rating: string;
  studentCount: string;
  features: string[];
  ctaLink: string;
  isBestseller?: boolean;
  isNew?: boolean;
  isComingSoon?: boolean;
}

const FEATURED_COURSES: FeaturedCourseData[] = [
  {
    id: "ca-foundation",
    categoryTag: "🔥 #1 BESTSELLER • ICAI NEW SCHEME",
    tagColor: "bg-amber-50 text-amber-800 border-amber-200",
    title: "CA Foundation Business Laws Master Codex",
    subtitle:
      "Complete 7 Acts codified notes, high-yield visual flowcharts, landmark case laws, and ICAI Section 16(1) model answers.",
    price: 99,
    mrp: 299,
    discount: "67% OFF",
    image: "/assets/crop_ca_foundation_book.png",
    bookId: "ca-foundation",
    sampleTitle: "CA Foundation Business Laws Master Codex",
    rating: "4.9 / 5.0",
    studentCount: "1,240+ Enrolled",
    features: [
      "All 7 CA Foundation Acts Fully Codified",
      "45+ Landmark Case Studies with Model Answers",
      "Unit-wise Practice Tests & Chapter Mindmaps",
      "Single-Device Watermarked DRM Security",
      "Weekly Live Google Meet Doubt Clearing",
    ],
    ctaLink: "/product/course-ca-foundation-sub",
    isBestseller: true,
  },
  {
    id: "cseet-law",
    categoryTag: "⏳ COMING SOON • 2026 ICSI SYLLABUS",
    tagColor: "bg-slate-100 text-slate-600 border-slate-200",
    title: "CSEET Business Law and Management",
    subtitle:
      "Master all 8 Units under latest ICSI Syllabus with timed MCQ drills, conceptual flowcharts & statutory precedents deck.",
    price: 99,
    mrp: 299,
    discount: "67% OFF",
    image: "/assets/bookcover.png",
    bookId: "cseet",
    sampleTitle: "CSEET Business Laws and Management Codex",
    rating: "4.9 / 5.0",
    studentCount: "Launching Soon",
    features: [
      "Full 8 Units Legal Aptitude & Business Mgt",
      "High-Yield Timed MCQ Drills with Analytics",
      "Statutory Definitions & Judicial Precedents",
      "Interactive 3D Digital Codex Reader",
      "Live Strategy Sessions & Doubt Support",
    ],
    ctaLink: "/courses",
    isComingSoon: true,
  },
];

export function SubscriptionCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sample Chapter Reader Modal state
  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [modalBookId, setModalBookId] = useState<"ca-foundation" | "cseet">("ca-foundation");
  const [modalTitle, setModalTitle] = useState("");

  const total = FEATURED_COURSES.length;
  const current = FEATURED_COURSES[currentIndex];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-play timer (6 seconds, pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  const handleOpenSample = (bookId: "ca-foundation" | "cseet", title: string) => {
    setModalBookId(bookId);
    setModalTitle(title);
    setSampleModalOpen(true);
  };

  return (
    <>
      <section
        className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 sm:my-10 select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-label="Featured Academy Courses Showcase"
      >
        {/* Section Header with Category Switcher Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#005A9C]" />
              <span>Official 2026 Curriculum</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#0A192F]">
              Featured &amp; Best-Selling Codices
            </h2>
          </div>

          {/* Course Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {FEATURED_COURSES.map((course, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={course.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-2xs ${
                    isActive
                      ? "bg-[#005A9C] text-white shadow-sm scale-102"
                      : "bg-white text-[#64748B] hover:text-[#0A192F] border border-[#DBEAFE] hover:bg-[#F0F7FF]"
                  }`}
                >
                  {course.isBestseller && <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                  {course.isNew && <Sparkles className="w-3.5 h-3.5 text-sky-400" />}
                  {course.isComingSoon && <Clock className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{course.id === "ca-foundation" ? "Best Seller (CA)" : "CSEET (Coming Soon)"}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Spotlight Card */}
        <div className="relative overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-white border-2 border-[#DBEAFE] text-[#0A192F] shadow-[0_15px_50px_rgba(0,90,156,0.08)] min-h-[690px] sm:min-h-[620px] lg:min-h-[550px] flex flex-col justify-between">
          {/* Radiant Background Aura */}
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-40 transition-opacity duration-500"
            style={{
              background: "radial-gradient(circle, rgba(0,90,156,0.25) 0%, rgba(174,215,233,0.15) 50%, transparent 70%)",
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-10 lg:p-12 grow">
            
            {/* Left Column: Course Details & CTAs */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left order-2 lg:order-1 flex flex-col justify-between">
              {/* Category Status & Live Rating */}
              <div className="flex flex-wrap items-center gap-2.5 min-h-[30px]">
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase border shadow-2xs ${current.tagColor}`}
                >
                  {current.isBestseller && <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                  {current.isNew && <Sparkles className="w-3.5 h-3.5 text-[#005A9C]" />}
                  {current.isComingSoon && <Clock className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{current.categoryTag}</span>
                </span>

                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F0F7FF] border border-[#DBEAFE] text-xs font-bold text-[#0A192F]">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{current.rating}</span>
                  <span className="w-1 h-1 rounded-full bg-[#CBD5E1] mx-0.5" />
                  <span className="text-[#64748B] font-medium">{current.studentCount}</span>
                </div>
              </div>

              {/* Course Title - Fixed height container so titles never cause layout shift */}
              <div className="min-h-[3.75rem] sm:min-h-[4.5rem] lg:min-h-[5.25rem] flex items-center">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-[#0A192F] tracking-tight leading-tight">
                  {current.title}
                </h3>
              </div>

              {/* Subtitle - Fixed height container */}
              <div className="min-h-[3.75rem] sm:min-h-[3.25rem] flex items-center">
                <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                  {current.subtitle}
                </p>
              </div>

              {/* Key Features Grid - Fixed min-height to accommodate all 5 features across all slides */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 min-h-[6.5rem] sm:min-h-[4.75rem] content-start">
                {current.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#0A192F] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#005A9C] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Price Tag Callout */}
              <div className="flex items-baseline gap-3 pt-2 h-[44px]">
                {current.isComingSoon ? (
                  <span className="text-xl sm:text-2xl font-serif font-black text-slate-500">
                    Launching Soon
                  </span>
                ) : (
                  <>
                    <span className="text-3xl sm:text-4xl font-serif font-black text-[#0A192F]">
                      ₹{current.price}
                    </span>
                    <span className="text-xs text-[#64748B]">/ month</span>
                    <span className="text-base text-[#94A3B8] line-through">₹{current.mrp}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {current.discount}
                    </span>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {current.isComingSoon ? (
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed min-h-[46px]"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Coming Soon</span>
                  </button>
                ) : (
                  <Link
                    href={current.ctaLink}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm bg-[#005A9C] hover:bg-[#004F8A] text-white shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer min-h-[46px]"
                  >
                    <span>Enroll in Course</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => handleOpenSample(current.bookId, current.sampleTitle)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm bg-white border border-[#005A9C] text-[#005A9C] hover:bg-[#EFF6FF] transition-all duration-200 active:scale-95 cursor-pointer min-h-[46px]"
                >
                  <BookOpen className="w-4 h-4 text-[#005A9C]" />
                  <span>Preview Free Chapter</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-[#64748B] min-h-[20px]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#005A9C]" />
                  <span>Single-Device Watermarked DRM</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Instant Portal Activation</span>
                </span>
              </div>
            </div>

            {/* Right Column: 3D Hardbound Book Showcase Card */}
            <div className="lg:col-span-5 flex justify-center items-center order-1 lg:order-2">
              <div
                onClick={() => handleOpenSample(current.bookId, current.sampleTitle)}
                className="relative w-full max-w-[320px] sm:max-w-[340px] h-[340px] sm:h-[370px] rounded-3xl p-6 bg-gradient-to-b from-[#F0F7FF] via-white to-[#F0F7FF] border border-[#DBEAFE] shadow-[0_15px_40px_rgba(0,90,156,0.10)] flex flex-col items-center justify-center cursor-pointer group hover:border-[#005A9C] transition-colors duration-200"
              >
                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-[#005A9C] border border-[#DBEAFE] shadow-2xs">
                    {current.isBestseller ? "🔥 #1 Best Seller" : current.isComingSoon ? "⏳ Coming Soon" : "✨ New 2026 Edition"}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0A192F] text-white">
                    DRM-PROTECTED
                  </span>
                </div>

                {/* 3D Book Graphic */}
                <div className="relative w-full h-[70%] my-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={current.image}
                    alt={current.title}
                    fill
                    className="object-contain drop-shadow-[0_15px_20px_rgba(10,25,47,0.18)]"
                    sizes="340px"
                    priority
                  />
                </div>

                {/* Floating Bottom Status */}
                <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
                  <div className="px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#DBEAFE] shadow-xs flex items-center justify-between text-xs font-bold text-[#0A192F]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px]">Click Book to Read Sample</span>
                    </div>
                    <BookOpen className="w-3.5 h-3.5 text-[#005A9C]" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            aria-label="Previous course"
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 hover:bg-white border border-[#DBEAFE] text-[#0A192F] hover:text-[#005A9C] shadow-md items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next course"
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 hover:bg-white border border-[#DBEAFE] text-[#0A192F] hover:text-[#005A9C] shadow-md items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Auto-Rotation Progress Bar */}
          <div className="h-1 w-full bg-[#EFF6FF] flex">
            {FEATURED_COURSES.map((_, idx) => (
              <div
                key={idx}
                className="flex-1 h-full cursor-pointer relative"
                onClick={() => setCurrentIndex(idx)}
              >
                <div
                  className={`h-full transition-all duration-300 ${
                    idx === currentIndex ? "bg-[#005A9C]" : "bg-transparent"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Sample Chapter Modal */}
      <EnhancedSampleChapterModal
        isOpen={sampleModalOpen}
        onClose={() => setSampleModalOpen(false)}
        bookTitle={modalTitle}
        bookId={modalBookId}
        bookPrice={99}
      />
    </>
  );
}
