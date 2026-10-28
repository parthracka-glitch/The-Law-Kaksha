"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Scale,
  Award,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  ShoppingBag,
} from "lucide-react";
import { SecurePdfReader } from "./SecurePdfReader";
import { apiRequest } from "@/lib/api";
import { useCart } from "@/context/CartContext";

interface SampleResource {
  id: string;
  part: string;
  badge: string;
  title: string;
  subtitle: string;
  actName?: string;
  description: string;
  highlights: string[];
  pages: string;
  fileSize: string;
  fileName: string;
  pdfUrl: string;
  downloadUrl: string;
  gradientTheme: string;
  borderTheme: string;
  accentBadge: string;
  pillColor: string;
  courseTag: "ca" | "cseet";
}

const SAMPLE_RESOURCES: SampleResource[] = [
  {
    id: "res-ca-qbank-part1-sample",
    part: "QUESTION BANK PART 1",
    badge: "FREE SAMPLE PREVIEW",
    title: "Smart Revision Question Bank Part 1 (Free Sample Copy)",
    subtitle: "CA Foundation Paper 2 Smart Revision Question Bank",
    actName: "Question Bank Part 1",
    courseTag: "ca",
    description:
      "Official free sample preview copy of CA Foundation Smart Revision Question Bank Part 1. Exam-pattern practice questions with RTPs, MTPs & suggested answers.",
    highlights: [
      "Official Question Bank Part 1 Sample Preview",
      "Curriculum: CA Foundation Paper 2 Business Laws",
      "Examiner-Tested 3-Step ICAI Model Answers",
      "Instant In-Browser DRM Reading Vault Access",
    ],
    pages: "Sample Copy",
    fileSize: "910 KB",
    fileName: "Question Bank Part 1- Sample Copy.pdf",
    pdfUrl: "/samples/Question Bank Part 1- Sample Copy.pdf",
    downloadUrl: "/samples/Question Bank Part 1- Sample Copy.pdf",
    gradientTheme: "from-[#F0FDF4] via-white to-white",
    borderTheme: "border-[#BBF7D0] hover:border-[#16A34A]",
    accentBadge: "bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]",
    pillColor: "bg-[#16A34A] text-white",
  },
  {
    id: "res-ca-qbank-part2-sample",
    part: "QUESTION BANK PART 2",
    badge: "FREE SAMPLE PREVIEW",
    title: "Smart Revision Question Bank Part 2 (Free Sample Copy)",
    subtitle: "CA Foundation Paper 2 Smart Revision Question Bank",
    actName: "Question Bank Part 2",
    courseTag: "ca",
    description:
      "Official free sample preview copy of CA Foundation Smart Revision Question Bank Part 2. Exam-pattern practice questions with RTPs, MTPs & suggested answers.",
    highlights: [
      "Official Question Bank Part 2 Sample Preview",
      "Curriculum: CA Foundation Paper 2 Business Laws",
      "Examiner-Tested 3-Step ICAI Model Answers",
      "Instant In-Browser DRM Reading Vault Access",
    ],
    pages: "Sample Copy",
    fileSize: "5.5 MB",
    fileName: "Part 2_Sample Copy.pdf",
    pdfUrl: "/samples/Part 2_Sample Copy.pdf",
    downloadUrl: "/samples/Part 2_Sample Copy.pdf",
    gradientTheme: "from-[#EFF6FF] via-white to-white",
    borderTheme: "border-[#BFDBFE] hover:border-[#005A9C]",
    accentBadge: "bg-[#EFF6FF] text-[#005A9C] border-[#BFDBFE]",
    pillColor: "bg-[#005A9C] text-white",
  },
];

export function FreeResourceModule() {
  const { addToCart, setIsCartOpen } = useCart();
  const [resources, setResources] = useState<SampleResource[]>(SAMPLE_RESOURCES);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "ca" | "cseet">("all");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(2);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleBuyQuestionBank = () => {
    addToCart({
      id: "course-ca-qbank",
      title: "CA Foundation Question Bank (Part 1 & 2)",
      price: 349,
      originalPrice: 699,
      format: "pdf",
      category: "CA Foundation",
      badge: "Part 1 & 2 Included • ₹349",
    });
    setIsCartOpen(true);
  };

  const [activeReader, setActiveReader] = useState<{
    isOpen: boolean;
    pdfUrl: string;
    title: string;
  }>({
    isOpen: false,
    pdfUrl: "",
    title: "",
  });

  // Track responsive cards per view (1 on mobile/tablet < 1024px, 2 on desktop >= 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setCardsPerView(window.innerWidth < 1024 ? 1 : 2);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadDynamicResources() {
      try {
        const res = await apiRequest<{
          resources?: Array<{
            id: string;
            title: string;
            actName?: string;
            description?: string;
            isSample?: boolean;
            pages?: string;
            fileSize?: string;
            fileName?: string;
            fileUrl?: string;
            sampleUrl?: string;
          }>;
        }>("/api/resources?sampleOnly=true");

        if (isMounted && res.success && Array.isArray(res.data?.resources)) {
          const dynamicItems = res.data.resources;

          if (dynamicItems.length > 0) {
            const mappedDynamic: SampleResource[] = dynamicItems.map((item, idx) => {
              const text = `${item.id} ${item.title} ${item.actName || ""}`.toLowerCase();
              const isCs = text.includes("cseet") || text.includes("management");

              return {
                id: item.id,
                part: `SAMPLE ${idx + 1}`,
                badge: isCs ? "ICSI CSEET SAMPLE" : "FREE STUDY CODEX",
                title: item.title,
                subtitle: item.actName || "Study Notes & Curriculum Sample",
                actName: item.actName,
                courseTag: isCs ? "cseet" : "ca",
                description:
                  item.description ||
                  `Official free study material for ${item.actName || "CA Foundation"}. Read sample preview online.`,
                highlights: [
                  `Official study codex: ${item.title}`,
                  `Curriculum: ${item.actName || (isCs ? "Business Management" : "CA Foundation Business Laws")}`,
                  "Examiner-Tested Legal Writing & Structured Model Notes",
                  "Instant In-Browser DRM Reading Vault Access",
                ],
                pages: item.pages || "Official PDF",
                fileSize: item.fileSize || "PDF",
                fileName: item.fileName || `${item.title}.pdf`,
                pdfUrl: item.sampleUrl || item.fileUrl || `/api/content/${item.id}/file?sample=true`,
                downloadUrl: item.fileUrl || `/api/content/${item.id}/file`,
                gradientTheme:
                  isCs
                    ? "from-[#FAF5FF] via-white to-white"
                    : idx % 2 === 0
                    ? "from-[#F0FDF4] via-white to-white"
                    : "from-[#EFF6FF] via-white to-white",
                borderTheme:
                  isCs
                    ? "border-[#E9D5FF] hover:border-[#9333EA]"
                    : idx % 2 === 0
                    ? "border-[#BBF7D0] hover:border-[#16A34A]"
                    : "border-[#BFDBFE] hover:border-[#005A9C]",
                accentBadge:
                  isCs
                    ? "bg-[#F3E8FF] text-[#7E22CE] border-[#D8B4FE]"
                    : idx % 2 === 0
                    ? "bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]"
                    : "bg-[#EFF6FF] text-[#005A9C] border-[#BFDBFE]",
                pillColor:
                  isCs
                    ? "bg-[#9333EA] text-white"
                    : idx % 2 === 0
                    ? "bg-[#16A34A] text-white"
                    : "bg-[#005A9C] text-white",
              };
            });

            const seen = new Set<string>();
            const merged: SampleResource[] = [];
            for (const item of [...SAMPLE_RESOURCES, ...mappedDynamic]) {
              const key = (item.fileName || item.id).toLowerCase();
              if (!seen.has(key)) {
                seen.add(key);
                merged.push(item);
              }
            }
            setResources(merged);
          }
        }
      } catch (err) {
        console.warn("[FreeResourceModule] Error loading dynamic resources:", err);
      }
    }
    loadDynamicResources();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter items based on active category tab
  const filteredResources = useMemo(() => {
    if (selectedCategory === "ca") {
      return resources.filter((r) => r.courseTag === "ca");
    }
    if (selectedCategory === "cseet") {
      return resources.filter((r) => r.courseTag === "cseet");
    }
    return resources;
  }, [resources, selectedCategory]);

  // Counts for category badges
  const caCount = useMemo(() => resources.filter((r) => r.courseTag === "ca").length, [resources]);
  const cseetCount = useMemo(() => resources.filter((r) => r.courseTag === "cseet").length, [resources]);

  // Chunk items into slides according to cardsPerView
  const slides = useMemo(() => {
    const pages: SampleResource[][] = [];
    for (let i = 0; i < filteredResources.length; i += cardsPerView) {
      pages.push(filteredResources.slice(i, i + cardsPerView));
    }
    return pages;
  }, [filteredResources, cardsPerView]);

  const totalSlides = slides.length;

  // Reset to first slide whenever category changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [selectedCategory, cardsPerView]);

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Touch Swipe handlers
  const minSwipeDistance = 45;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

  const handleOpenReader = (resource: SampleResource) => {
    setActiveReader({
      isOpen: true,
      pdfUrl: resource.pdfUrl,
      title: resource.title,
    });
  };

  if (resources.length === 0) {
    return null;
  }

  return (
    <section
      id="free-resources"
      className="py-16 sm:py-20 bg-gradient-to-b from-[#F0F7FF] via-white to-[#F8FAFC] border-y border-[#DBEAFE] relative overflow-hidden"
    >
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#DBEAFE]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#EFF6FF]/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Module Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#005A9C] border border-[#BFDBFE] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#005A9C]" />
            <span>100% Free Resources • No Login Required</span>
          </div>

          <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-[#0A192F] tracking-tight leading-[1.15]">
            Official Free Sample Codices &amp; Notes
          </h2>

          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
            CA Foundation &amp; CSEET Paper 2. Preview the exact statutory notes, chapter codices, and examiner-tested model answer frameworks before you enroll.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-1 text-xs font-semibold text-[#475569]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              In-Browser Reading Vault
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              In-Browser DRM Reader
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              ICAI &amp; ICSI Exam Aligned
            </span>
          </div>
        </div>

        {/* Filter Tabs & Slide Navigation Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-[#DBEAFE] shadow-xs">
          
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === "all"
                  ? "bg-[#005A9C] text-white shadow-xs"
                  : "bg-[#F8FAFC] text-[#475569] hover:bg-[#EFF6FF] hover:text-[#005A9C] border border-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Samples</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedCategory === "all" ? "bg-white/20 text-white" : "bg-slate-200 text-[#475569]"}`}>
                {resources.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory("ca")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === "ca"
                  ? "bg-[#005A9C] text-white shadow-xs"
                  : "bg-[#F8FAFC] text-[#475569] hover:bg-[#EFF6FF] hover:text-[#005A9C] border border-slate-200"
              }`}
            >
              <span>CA Foundation</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedCategory === "ca" ? "bg-white/20 text-white" : "bg-slate-200 text-[#475569]"}`}>
                {caCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory("cseet")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === "cseet"
                  ? "bg-[#005A9C] text-white shadow-xs"
                  : "bg-[#F8FAFC] text-[#475569] hover:bg-[#EFF6FF] hover:text-[#005A9C] border border-slate-200"
              }`}
            >
              <span>CSEET</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedCategory === "cseet" ? "bg-white/20 text-white" : "bg-slate-200 text-[#475569]"}`}>
                {cseetCount}
              </span>
            </button>
          </div>

          {/* Navigation Controls & Counter */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#64748B] tracking-tight">
              Slide <strong className="text-[#0A192F] font-bold">{currentSlide + 1}</strong> of {totalSlides || 1}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={prevSlide}
                disabled={totalSlides <= 1}
                className="w-9 h-9 rounded-full border border-[#BFDBFE] bg-white text-[#005A9C] hover:bg-[#005A9C] hover:text-white hover:border-[#005A9C] disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                disabled={totalSlides <= 1}
                className="w-9 h-9 rounded-full border border-[#BFDBFE] bg-white text-[#005A9C] hover:bg-[#005A9C] hover:text-white hover:border-[#005A9C] disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Card Sliding Section Container */}
        <div
          className="relative"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Floating Left Arrow for Desktop */}
          {totalSlides > 1 && (
            <button
              type="button"
              onClick={prevSlide}
              className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md border border-[#BFDBFE] text-[#005A9C] hover:bg-[#005A9C] hover:text-white hover:border-[#005A9C] shadow-lg items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
              aria-label="Previous card slide"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}

          {/* Floating Right Arrow for Desktop */}
          {totalSlides > 1 && (
            <button
              type="button"
              onClick={nextSlide}
              className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md border border-[#BFDBFE] text-[#005A9C] hover:bg-[#005A9C] hover:text-white hover:border-[#005A9C] shadow-lg items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
              aria-label="Next card slide"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}

          {/* Overflow-Hidden Slider Viewport */}
          <div className="overflow-hidden rounded-3xl p-1">
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slideItems, slideIdx) => (
                <div
                  key={slideIdx}
                  className="w-full shrink-0 px-1"
                >
                  <div className={`grid ${cardsPerView === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-6 lg:gap-8 items-stretch`}>
                    {slideItems.map((resource) => (
                      <div
                        key={resource.id}
                        className={`rounded-3xl border-2 ${resource.borderTheme} bg-gradient-to-br ${resource.gradientTheme} p-6 sm:p-8 shadow-[0_10px_35px_rgba(10,25,47,0.06)] hover:shadow-[0_16px_48px_rgba(0,90,156,0.12)] transition-all duration-300 flex flex-col justify-between group relative h-full`}
                      >
                        <div className="space-y-6">
                          
                          {/* Header row with badges */}
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className={`text-[11px] font-black tracking-wider px-3 py-1 rounded-full ${resource.pillColor}`}>
                                {resource.part}
                              </span>
                              <span className={`text-[11px] font-bold px-3 py-1 rounded-full border shadow-2xs ${resource.accentBadge}`}>
                                {resource.badge}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs font-bold text-[#64748B] bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-200">
                              <FileText className="w-3.5 h-3.5 text-[#005A9C]" />
                              <span>{resource.pages}</span>
                              <span className="text-slate-300">•</span>
                              <span>{resource.fileSize}</span>
                            </div>
                          </div>

                          {/* Title & Subtitle */}
                          <div>
                            {resource.actName && (
                              <span className="text-xs font-bold uppercase tracking-wider text-[#005A9C] block mb-1">
                                {resource.actName}
                              </span>
                            )}
                            <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#0A192F] group-hover:text-[#005A9C] transition-colors leading-snug line-clamp-2">
                              {resource.title}
                            </h3>
                            <p className="text-sm font-semibold text-[#475569] mt-1.5">
                              {resource.subtitle}
                            </p>
                            <p className="text-xs sm:text-sm text-[#64748B] mt-3 leading-relaxed line-clamp-2">
                              {resource.description}
                            </p>
                          </div>

                          {/* Key Syllabus Highlights */}
                          <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-2.5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A192F] flex items-center gap-2">
                              <Award className="w-4 h-4 text-[#005A9C]" />
                              What&apos;s Included In This Free Sample:
                            </h4>
                            <ul className="space-y-2 text-xs text-[#334155] leading-relaxed">
                              {resource.highlights.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2.5">
                                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                                  <span className="line-clamp-1">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-6 mt-6 border-t border-slate-200/70 space-y-3">
                          {/* Primary CTA: Open Interactive Reader */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <button
                              type="button"
                              onClick={() => handleOpenReader(resource)}
                              className="w-full inline-flex items-center justify-center gap-2 bg-[#005A9C] hover:bg-[#004F8A] text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
                            >
                              <BookOpen className="w-4 h-4" />
                              <span>Read Sample</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleBuyQuestionBank}
                              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
                            >
                              <ShoppingBag className="w-4 h-4" />
                              <span>Buy Full @ ₹349</span>
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-[#64748B] px-1">
                            <span className="flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#005A9C]" />
                              <span>Instant reader with zoom &amp; dark mode</span>
                            </span>
                            <Link
                              href={`/reader?file=${encodeURIComponent(resource.fileName)}&title=${encodeURIComponent(resource.title)}&sample=true`}
                              className="text-[#005A9C] hover:underline font-bold flex items-center gap-0.5"
                            >
                              <span>Dedicated Reader Page</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Placeholder filler when odd count in 2-card desktop view */}
                    {cardsPerView === 2 && slideItems.length === 1 && (
                      <div className="rounded-3xl border-2 border-dashed border-[#DBEAFE] bg-white/50 p-8 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#005A9C] flex items-center justify-center shadow-2xs">
                          <BookOpen className="w-6 h-6 text-[#005A9C]" />
                        </div>
                        <div className="max-w-xs space-y-1">
                          <h4 className="font-bold text-sm text-[#0A192F]">Explore Full Catalog</h4>
                          <p className="text-xs text-[#64748B]">All complete codices and question banks are available in our official course catalog.</p>
                        </div>
                        <Link
                          href="/courses"
                          className="px-5 py-2.5 rounded-full bg-[#005A9C] hover:bg-[#004880] text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5"
                        >
                          <span>View Courses Catalog</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Pagination Dots */}
          {totalSlides > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    currentSlide === idx
                      ? "w-8 h-2.5 bg-[#005A9C] shadow-xs"
                      : "w-2.5 h-2.5 bg-[#CBD5E1] hover:bg-[#94A3B8]"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Banner with Full Subscription Upsell */}
        <div className="mt-12 bg-white rounded-3xl border border-[#DBEAFE] p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#005A9C] flex items-center justify-center md:justify-start gap-1.5">
              <Scale className="w-4 h-4 text-[#005A9C]" />
              Need The Complete Question Bank?
            </span>
            <h4 className="text-xl sm:text-2xl font-serif font-black text-[#0A192F]">
              Complete Smart Revision Question Bank (Part 1 &amp; Part 2)
            </h4>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-xl">
              Get unrestricted access to both Part 1 and Part 2 Question Banks covering all 4 Statutory Acts with RTPs, MTPs and examiner-evaluated ICAI model answers for just ₹349.
            </p>
          </div>

          <button
            type="button"
            onClick={handleBuyQuestionBank}
            className="inline-flex items-center justify-center gap-2 bg-[#005A9C] hover:bg-[#004F8A] text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer shrink-0"
          >
            <span>Buy Full Question Bank @ ₹349</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Interactive DRM In-Browser Reader Modal */}
      <SecurePdfReader
        isOpen={activeReader.isOpen}
        onClose={() => setActiveReader({ isOpen: false, pdfUrl: "", title: "" })}
        pdfUrl={activeReader.pdfUrl}
        title={activeReader.title}
        isPurchased={true}
        studentName="CA Foundation Student"
        studentRoll="LK-FREE-SAMPLE"
        price={99}
      />
    </section>
  );
}
