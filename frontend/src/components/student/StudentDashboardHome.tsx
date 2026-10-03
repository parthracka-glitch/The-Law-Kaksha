"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  Play,
  Info,
  Sparkles,
  ArrowRight,
  BookOpen,
  Code2,
  Cpu,
  Layers,
  CheckCircle2,
  Zap,
  Flame,
  Trophy,
  Award,
  Gift,
  Calendar,
  Target,
  Check,
  ShieldCheck,
  TrendingUp,
  Lock,
} from "lucide-react";
import { type PromoPassCard, type PromoBannersSetting, DEFAULT_PROMO_BANNERS } from "@/types/promo";

interface EnrolledCourseItem {
  id: string;
  courseType: "ca" | "cs" | "shared";
  title: string;
  category: string;
  enrolledDate: string;
  progress: number;
  pdfUrl: string;
  iconBg: string;
  iconType: "yellow" | "dark" | "blue";
  isFavorite?: boolean;
  isUnlocked: boolean;
  price?: number;
}

interface LevelInfo {
  level: number;
  title: string;
  badge: string;
  nextXp: number;
  minXp: number;
  progress: number;
}

interface StudentDashboardHomeProps {
  studentName?: string;
  streak?: number;
  longestStreak?: number;
  lawXp?: number;
  levelInfo?: LevelInfo;
  awardXp?: (amount: number, reason: string) => void;
  onOpenStreakLog?: () => void;
  onOpenBadgesModal?: () => void;
  onOpenPdf: (url: string, title: string, subtitle?: string, courseType?: "ca" | "cs") => void;
  onExploreCourse: (courseId: string) => void;
  activeCourse?: "ca" | "cs";
  qotdData: any;
  qotdSelected: number | null;
  qotdSubmitted: boolean;
  onSelectQotdOption: (idx: number) => void;
  onSubmitQotd: () => void;
  completedUnitsCount: number;
  totalUnitsCount: number;
  isCaUnlocked?: boolean;
  isCsUnlocked?: boolean;
  isAllAccessUnlocked?: boolean;
  onBuyCourse?: (courseType: "ca" | "cs" | "all-access") => void;
}

interface RecommendedCourseItem {
  num: string;
  courseType: "ca" | "cs" | "shared";
  title: string;
  subtitle: string;
  duration: string;
  streamLabel: string;
  icon: any;
  iconBg: string;
  pdfUrl: string;
}

const RECOMMENDED_COURSES: RecommendedCourseItem[] = [
  {
    num: "1",
    courseType: "ca",
    title: "Contract Act, 1872 Masterclass",
    subtitle: "Simple bare-act rules with landmark precedents",
    duration: "35h 48m",
    streamLabel: "CA Foundation",
    icon: Code2,
    iconBg: "bg-[#0F172A]",
    pdfUrl: "/notes/contract-act-unit-1.pdf",
  },
  {
    num: "2",
    courseType: "shared",
    title: "System Design & Corporate Veil",
    subtitle: "Salomon v. Salomon & ultra-vires doctrines",
    duration: "28h 31m",
    streamLabel: "CA & CS Shared",
    icon: Layers,
    iconBg: "bg-[#1E293B]",
    pdfUrl: "/notes/unit-1-general-nature-of-partnership.pdf",
  },
  {
    num: "3",
    courseType: "cs",
    title: "CSEET Management & Corporate Ethics",
    subtitle: "Henri Fayol, F.W. Taylor & PESTLE framework",
    duration: "29h 57m",
    streamLabel: "CSEET",
    icon: Cpu,
    iconBg: "bg-[#0284C7]",
    pdfUrl: "/api/pdf/cseet-business-law-full.pdf",
  },
];

export function StudentDashboardHome({
  studentName = "Parth Racka",
  streak = 3,
  longestStreak = 4,
  lawXp = 180,
  levelInfo = {
    level: 2,
    title: "Junior Associate",
    badge: "🥈 Associate",
    nextXp: 400,
    minXp: 150,
    progress: 45,
  },
  awardXp,
  onOpenStreakLog,
  onOpenBadgesModal,
  onOpenPdf,
  activeCourse = "ca",
  onExploreCourse,
  qotdData,
  qotdSelected,
  qotdSubmitted,
  onSelectQotdOption,
  onSubmitQotd,
  completedUnitsCount = 0,
  totalUnitsCount = 15,
  isCaUnlocked = false,
  isCsUnlocked = false,
  isAllAccessUnlocked = false,
  onBuyCourse,
}: StudentDashboardHomeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const carouselRef = useRef<HTMLDivElement>(null);
  const quizSectionRef = useRef<HTMLDivElement>(null);

  const [selectedPromoStream, setSelectedPromoStream] = useState<"ca" | "cs">(activeCourse);

  useEffect(() => {
    if (activeCourse) {
      setSelectedPromoStream(activeCourse);
    }
  }, [activeCourse]);

  // Dynamic enrolled courses reflecting actual purchase state
  const dynamicCourses: EnrolledCourseItem[] = useMemo(() => {
    return [
      {
        id: "ca-foundation-course",
        courseType: "ca",
        title: "CA Foundation: Business Laws",
        category: "ICAI Paper 2 • 7 Chapters",
        enrolledDate: "Enrolled On 16th Jul 2026",
        progress: isCaUnlocked ? Math.min(100, Math.max(6, completedUnitsCount * 14)) : 0,
        pdfUrl: "/notes/unit-1-general-nature-of-partnership.pdf",
        iconBg: "from-[#F59E0B] via-[#D97706] to-[#B45309]",
        iconType: "yellow",
        isUnlocked: Boolean(isCaUnlocked),
        price: 99,
      },
      {
        id: "cseet-course",
        courseType: "cs",
        title: "CSEET: Legal Aptitude & Mgmt",
        category: "ICSI Paper 2 • 8 Units",
        enrolledDate: "Enrolled On 16th Jul 2026",
        progress: isCsUnlocked ? Math.min(100, Math.max(0, completedUnitsCount * 12)) : 0,
        pdfUrl: "/api/pdf/cseet-business-law-full.pdf",
        iconBg: "from-[#1E293B] to-[#0F172A]",
        iconType: "dark",
        isUnlocked: Boolean(isCsUnlocked),
        price: 99,
      },
      {
        id: "cases-course",
        courseType: "shared",
        title: "Solved Case Studies & Answers",
        category: "Weekly Exam Drills",
        enrolledDate: "Enrolled On 16th Jul 2026",
        progress: (isCaUnlocked || isCsUnlocked) ? 45 : 0,
        pdfUrl: "/notes/contract-act-unit-3.pdf",
        iconBg: "from-[#3B0764] to-[#1E1B4B]",
        iconType: "blue",
        isUnlocked: Boolean(isCaUnlocked || isCsUnlocked),
        price: 99,
      },
    ];
  }, [isCaUnlocked, isCsUnlocked, completedUnitsCount]);

  const [courses, setCourses] = useState<EnrolledCourseItem[]>(dynamicCourses);

  useEffect(() => {
    setCourses(dynamicCourses);
  }, [dynamicCourses]);

  const [promoData, setPromoData] = useState<PromoBannersSetting>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("lawkaksha_admin_promo_banners");
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_PROMO_BANNERS;
  });

  // Sync Promo Banners from API & live admin broadcast events
  useEffect(() => {
    const fetchPromoBanners = async () => {
      try {
        const res = await fetch("/api/promo-banners");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.promoBanners) {
            setPromoData(json.promoBanners);
            try {
              localStorage.setItem("lawkaksha_admin_promo_banners", JSON.stringify(json.promoBanners));
            } catch (e) {}
          }
        }
      } catch (err) {}
    };
    fetchPromoBanners();

    const handlePromoUpdate = (e: any) => {
      if (e.detail) {
        setPromoData(e.detail);
      } else {
        try {
          const saved = localStorage.getItem("lawkaksha_admin_promo_banners");
          if (saved) setPromoData(JSON.parse(saved));
        } catch (err) {}
      }
    };

    window.addEventListener("lawkaksha_promo_updated", handlePromoUpdate);
    return () => {
      window.removeEventListener("lawkaksha_promo_updated", handlePromoUpdate);
    };
  }, []);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const offset = direction === "left" ? -320 : 320;
      carouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const toggleFavorite = (id: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const leftCard: PromoPassCard = promoData.comboCard || DEFAULT_PROMO_BANNERS.comboCard;
  const rightCard: PromoPassCard = (selectedPromoStream === "ca" ? promoData.caCard : promoData.csCard) || DEFAULT_PROMO_BANNERS.caCard;

  const handleCardClick = (card: PromoPassCard) => {
    if (card.actionType === "ca") {
      onExploreCourse("ca");
    } else if (card.actionType === "cs") {
      onExploreCourse("cs");
    } else if (card.actionType === "all-access") {
      onExploreCourse("all-access");
    } else if (card.actionType === "custom" && card.customUrl) {
      window.open(card.customUrl, "_blank");
    } else {
      onExploreCourse(selectedPromoStream);
    }
  };

  return (
    <div className="space-y-6 text-[#221D1D] select-none font-sans relative">
      {/* ========================================================================= */}
      {/* 1. TOP BANNER PROMO CARDS (EXACT 2-CARD LAYOUT AS IN SCREENSHOT)           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT CARD (WIDER): SOFT LILAC ALL-ACCESS PACK WITH STUDENT ILLUSTRATION */}
        <div className="lg:col-span-7 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FAF5FF] via-[#F4EBFC] to-[#EDE9FE] border border-[#E9DDF5] p-5 sm:p-6 shadow-xs flex flex-col justify-between group transition-all hover:shadow-md">
          {/* DISCOUNT CORNER RIBBON */}
          <div className="absolute top-0 right-0">
            <div className="bg-[#4C1D95] text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl shadow-xs tracking-wider">
              {leftCard.discountBadge || "47% OFF"}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-stretch justify-between gap-4">
            {/* Left Copy & Actions */}
            <div className="space-y-3 flex-1 min-w-0">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-[#1F2937] leading-tight">
                  Accelerate your Career by <br />
                  <span className="text-[#7E22CE]">
                    {leftCard.title || "All access pack"}
                  </span>
                </h2>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-2 pt-0.5">
                <span className="text-xs font-semibold text-[#4B5563]">Price :</span>
                <span className="text-base font-extrabold text-[#7E22CE]">
                  ₹{leftCard.price || 3999}
                </span>
                <span className="text-xs text-[#9CA3AF] line-through font-mono">
                  ₹{leftCard.originalPrice || 45435}
                </span>
              </div>

              {/* Sub-benefit with subtle star */}
              <div className="flex items-center gap-1.5 text-[11px] text-[#4B5563] font-medium">
                <span className="w-3.5 h-3.5 rounded-sm bg-[#EDE9FE] text-[#7E22CE] flex items-center justify-center text-[10px] font-bold shrink-0">
                  ✓
                </span>
                <span className="truncate">
                  {leftCard.saveText ? `Get Refund Validity to Lifetime* • ${leftCard.saveText}` : "Get Refund Validity to Lifetime*"}
                </span>
              </div>

              {/* Explore Now Button (White Pill with Purple Text matching screenshot) */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (isAllAccessUnlocked) {
                      onExploreCourse(activeCourse);
                    } else if (onBuyCourse) {
                      onBuyCourse("all-access");
                    } else {
                      handleCardClick(leftCard);
                    }
                  }}
                  className="px-5 py-2.5 rounded-full bg-white hover:bg-[#FAF5FF] text-[#7E22CE] border border-[#E9DDF5] text-xs font-bold transition-all shadow-xs hover:shadow-sm inline-flex items-center gap-1.5 cursor-pointer active:scale-95 group-hover:border-[#D8B4FE]"
                >
                  <span>{isAllAccessUnlocked ? "Browse Codex" : "Explore now"}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#7E22CE] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Graphic: Student with Laptop & Floating Subject Icons */}
            <div className="w-36 sm:w-44 h-36 shrink-0 relative flex items-center justify-center">
              {/* Floating Subject Icons Pill */}
              <div className="absolute top-1 left-2 flex items-center gap-1 p-1 bg-white/90 rounded-full shadow-2xs border border-purple-100">
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-600 text-[10px] flex items-center justify-center font-bold">⚛</span>
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[10px] flex items-center justify-center font-bold">🐍</span>
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 text-[10px] flex items-center justify-center font-bold">⚖️</span>
              </div>

              {/* Modern Vector Law Student Illustration */}
              <svg viewBox="0 0 160 140" className="w-full h-full object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Soft backdrop circle */}
                <circle cx="80" cy="70" r="55" fill="#EDE9FE" />
                <circle cx="120" cy="40" r="16" fill="#FDE68A" fillOpacity="0.4" />
                {/* Desk */}
                <rect x="20" y="112" width="120" height="6" rx="3" fill="#D8B4FE" />
                {/* Character Torso & Clothes */}
                <path d="M52 112 C52 88, 62 82, 80 82 C98 82, 108 88, 108 112 Z" fill="#FBBF24" />
                {/* Neck */}
                <rect x="74" y="68" width="12" height="16" rx="2" fill="#D97706" fillOpacity="0.3" />
                {/* Head */}
                <circle cx="80" cy="56" r="18" fill="#FCD34D" />
                {/* Hair */}
                <path d="M62 52 C62 38, 70 34, 80 34 C92 34, 98 40, 98 52 C98 55, 96 64, 96 64 C92 56, 88 56, 80 56 C72 56, 68 56, 64 64 Z" fill="#1F2937" />
                <path d="M62 50 C58 56, 56 68, 62 76" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" />
                <path d="M98 50 C102 56, 104 68, 98 76" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" />
                {/* Glasses / Face details */}
                <circle cx="75" cy="54" r="3" fill="#1F2937" />
                <circle cx="85" cy="54" r="3" fill="#1F2937" />
                <path d="M78 62 Q80 65 82 62" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" />
                {/* Laptop on desk */}
                <rect x="58" y="94" width="44" height="20" rx="3" fill="#E5E7EB" stroke="#CBD5E1" strokeWidth="1.5" />
                <polygon points="50,114 110,114 104,111 56,111" fill="#94A3B8" />
                {/* Floating Law Kaksha Codex Book */}
                <rect x="110" y="88" width="22" height="24" rx="2" fill="#7E22CE" />
                <rect x="113" y="91" width="16" height="18" rx="1" fill="#FAF5FF" />
                <line x1="116" y1="96" x2="126" y2="96" stroke="#7E22CE" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="116" y1="100" x2="124" y2="100" stroke="#7E22CE" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* RIGHT CARD: RICH ROYAL PURPLE SKILLS / COURSES PACK */}
        <div className="lg:col-span-5 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#7E22CE] via-[#6B21A8] to-[#4C1D95] border border-[#7E22CE] p-5 sm:p-6 text-white shadow-xs flex flex-col justify-between group transition-all hover:shadow-md">
          {/* Subtle background glow */}
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-purple-400/20 blur-2xl pointer-events-none" />

          <div className="space-y-3 relative z-10">
            {/* Title matching screenshot vibe */}
            <div>
              <h2 className="text-lg sm:text-xl font-black leading-tight text-white">
                Maximize your skills <br />
                <span className="text-amber-200">
                  on {selectedPromoStream === "ca" ? "CA Foundation Law" : "CSEET Business Law"}
                </span>
              </h2>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="text-xs font-semibold text-purple-200">Price :</span>
              <span className="text-base font-extrabold text-white">
                ₹{rightCard.price || 799}
              </span>
              <span className="text-xs text-purple-300 line-through font-mono">
                ₹{rightCard.originalPrice || 2100}
              </span>
            </div>

            {/* Subtitle / Feature */}
            <div className="flex items-center gap-1.5 text-[11px] text-purple-100 font-medium">
              <span className="w-3.5 h-3.5 rounded-sm bg-white/20 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                ✓
              </span>
              <span className="truncate">
                {rightCard.saveText ? `Increase Refund Validity by 1 Years* • ${rightCard.saveText}` : "Increase Refund Validity by 1 Years*"}
              </span>
            </div>
          </div>

          {/* Explore now CTA Button matching screenshot */}
          <div className="pt-4 relative z-10">
            <button
              onClick={() => {
                if ((selectedPromoStream === "ca" && isCaUnlocked) || (selectedPromoStream === "cs" && isCsUnlocked)) {
                  onExploreCourse(selectedPromoStream);
                } else if (onBuyCourse) {
                  onBuyCourse(selectedPromoStream);
                } else {
                  handleCardClick(rightCard);
                }
              }}
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer active:scale-95 backdrop-blur-xs"
            >
              <span>
                {(selectedPromoStream === "ca" && isCaUnlocked) || (selectedPromoStream === "cs" && isCsUnlocked)
                  ? "Open Syllabus"
                  : "Explore now"}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ENROLLED COURSES (EXACT HEADER, SEARCH, ARROWS & CAROUSEL CARDS)        */}
      {/* ========================================================================= */}
      <div className="space-y-3.5">
        {/* Header with Search and Navigation Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-xl font-black text-[#1F2937] tracking-tight">
            Enrolled Courses
          </h3>

          <div className="flex items-center gap-2.5">
            {/* Search courses input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-3.5 pr-3 py-1.5 text-xs rounded-xl bg-white border border-[#E7E4E7] focus:outline-none focus:border-[#7E22CE] w-48 sm:w-60 transition-all text-[#221D1D] shadow-2xs"
              />
            </div>

            {/* Circular Carousel Prev & Next Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollCarousel("left")}
                className="w-8 h-8 rounded-full border border-[#D1D5DB] bg-white hover:bg-[#FAF5FF] hover:border-[#7E22CE] text-[#4B5563] hover:text-[#7E22CE] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                className="w-8 h-8 rounded-full border border-[#D1D5DB] bg-white hover:bg-[#FAF5FF] hover:border-[#7E22CE] text-[#4B5563] hover:text-[#7E22CE] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Carousel Row */}
        <div
          ref={carouselRef}
          className="flex items-stretch gap-4 overflow-x-auto pb-2 scroll-smooth no-scrollbar touch-pan-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {filteredCourses.map((c) => (
            <div
              key={c.id}
              className="w-[280px] sm:w-[315px] shrink-0 bg-white rounded-3xl border border-[#E7E4E7] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Course Header: Icon + Title + Star */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* App Icon matching screenshot aesthetics */}
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${c.iconBg} flex items-center justify-center text-white shrink-0 shadow-xs`}
                    >
                      {c.iconType === "yellow" ? (
                        <span className="text-xl">⚖️</span>
                      ) : c.iconType === "dark" ? (
                        <span className="text-xl">📜</span>
                      ) : (
                        <span className="text-xl">💼</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-[#1F2937] truncate leading-snug">
                        {c.title}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-[#6B7280] mt-0.5">
                        <Clock className="w-3 h-3 text-[#9CA3AF]" />
                        <span>Self Paced</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFavorite(c.id)}
                    className="text-[#9CA3AF] hover:text-[#F59E0B] p-1 cursor-pointer shrink-0 transition-colors"
                    aria-label="Favorite"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        c.isFavorite ? "fill-[#F59E0B] text-[#F59E0B]" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Enrollment Date */}
                <p className="text-[11px] text-[#6B7280] font-medium flex items-center gap-1.5 pt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />
                  <span>{c.enrolledDate}</span>
                </p>

                {/* Course Progress with Info Icon and % */}
                <div className="space-y-1.5 pt-1">
                  <div className="w-full bg-[#E5E7EB] rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`${c.isUnlocked ? "bg-[#10B981]" : "bg-gray-300"} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
                    <span className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#7E22CE] text-white text-[9px] flex items-center justify-center font-bold">
                        i
                      </span>
                      <span>Course Progress</span>
                    </span>
                    <span className="font-bold text-[#1F2937]">{c.progress}%</span>
                  </div>
                </div>
              </div>

              {/* Full-Width Action Button: Vibrant Purple Resume ▶ */}
              <div className="pt-4">
                {c.isUnlocked ? (
                  <button
                    onClick={() => {
                      onOpenPdf(
                        c.pdfUrl,
                        c.title,
                        c.category,
                        c.courseType === "shared" ? activeCourse : c.courseType
                      );
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#7E22CE] hover:bg-[#6B21A8] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>Resume</span>
                    <Play className="w-3.5 h-3.5 fill-current text-white" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (onBuyCourse) {
                        onBuyCourse(c.courseType === "shared" ? "all-access" : c.courseType);
                      } else {
                        onExploreCourse(c.courseType === "shared" ? "all-access" : c.courseType);
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#221D1D] hover:bg-[#383130] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#AED7E9]" />
                    <span>Unlock Pass • ₹{c.price || 99}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. RECOMMENDED FOR YOU (WATERMARK 1, 2, 3 CARDS AS IN SCREENSHOT)         */}
      {/* ========================================================================= */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-[#1F2937] tracking-tight">
            Recommended for You
          </h3>
          <span className="text-xs text-[#6B7280]">Curated Study Material</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RECOMMENDED_COURSES.map((item) => {
            const IconComponent = item.icon;
            const isItemUnlocked =
              item.courseType === "ca"
                ? Boolean(isCaUnlocked)
                : item.courseType === "cs"
                ? Boolean(isCsUnlocked)
                : Boolean(isCaUnlocked || isCsUnlocked);

            return (
              <div
                key={item.num}
                onClick={() => {
                  if (isItemUnlocked) {
                    onOpenPdf(
                      item.pdfUrl,
                      item.title,
                      item.subtitle,
                      item.courseType === "shared" ? activeCourse : item.courseType
                    );
                  } else {
                    if (onBuyCourse) {
                      onBuyCourse(item.courseType === "shared" ? "all-access" : item.courseType);
                    } else {
                      onOpenPdf(
                        item.pdfUrl,
                        item.title,
                        item.subtitle,
                        item.courseType === "shared" ? activeCourse : item.courseType
                      );
                    }
                  }
                }}
                className="relative bg-white rounded-3xl border border-[#E7E4E7] p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group overflow-hidden"
              >
                {/* Large Faint Watermark Number in Top-Right Corner */}
                <span className="absolute top-2 right-4 text-5xl font-black text-[#F3F4F6] select-none pointer-events-none group-hover:text-[#EDE9FE] transition-colors">
                  {item.num}
                </span>

                <div className="space-y-3 relative z-10 pr-6">
                  {/* Dark App Icon Square */}
                  <div
                    className={`w-11 h-11 rounded-2xl ${item.iconBg} text-white flex items-center justify-center shadow-xs shrink-0`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#1F2937] group-hover:text-[#7E22CE] transition-colors leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#6B7280] mt-1 leading-relaxed line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-[#F3F4F6] flex items-center justify-between text-xs text-[#6B7280] relative z-10">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-[#9CA3AF]" />
                    <span>Duration: {item.duration}</span>
                  </span>
                  {isItemUnlocked ? (
                    <span className="text-[#7E22CE] font-bold text-xs group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      <span>Open</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="text-[#B45309] font-bold text-xs group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#B45309]" />
                      <span>Unlock Pass</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. DAILY PRACTICE & STUDY DRILL (CLEAN & MINIMAL GAMIFICATION)             */}
      {/* ========================================================================= */}
      <div
        ref={quizSectionRef}
        className="bg-white rounded-3xl border border-[#E7E4E7] p-5 sm:p-6 shadow-2xs space-y-3.5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#D97706] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-[#D97706]" />
              <span>Daily 1-Minute Quiz (+15 Points)</span>
            </span>
          </div>
          <span className="text-xs font-bold text-[#7E22CE]">ICAI / ICSI Pattern</span>
        </div>

        <p className="text-sm font-semibold text-[#1F2937] leading-relaxed">
          {qotdData?.question ||
            "Under Section 16(1) of Sale of Goods Act, when is a product expected to work properly for the buyer?"}
        </p>

        <div className="space-y-2 pt-1">
          {qotdData?.options?.map((opt: string, idx: number) => {
            const isChosen = qotdSelected === idx;
            const isCorrect = idx === qotdData.correctIndex;
            let btnStyle =
              "bg-[#F9FAFB] border-[#E5E7EB] text-[#374151] hover:bg-white";

            if (qotdSubmitted) {
              if (isCorrect)
                btnStyle = "bg-[#D1FAE5] border-[#10B981] text-[#065F46] font-bold";
              else if (isChosen)
                btnStyle = "bg-[#FEE2E2] border-[#EF4444] text-[#991B1B]";
              else btnStyle = "bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF]";
            } else if (isChosen) {
              btnStyle = "bg-[#FAF5FF] border-[#7E22CE] text-[#581C87] font-bold";
            }

            return (
              <button
                key={idx}
                disabled={qotdSubmitted}
                onClick={() => onSelectQotdOption(idx)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white border border-[#D1D5DB] text-[10px] font-bold flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>
                {qotdSubmitted && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {qotdSubmitted && (
          <div className="p-3 bg-[#FAF5FF] rounded-xl border border-[#E9DDF5] text-xs text-[#374151] leading-relaxed">
            <p className="font-bold text-[#1F2937]">Explanation in Simple Words:</p>
            <p className="mt-0.5 text-[#4B5563]">{qotdData?.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
