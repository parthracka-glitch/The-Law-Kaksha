"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
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
  ShoppingBag,
  GraduationCap,
  Crown,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export interface UnsubscribedCourseItem {
  id: string;
  courseType: "ca" | "cs" | "all-access" | "volume";
  title: string;
  badge: string;
  category: string;
  examBody: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  discount: string;
  savings: string;
  highlights: string[];
  bannerGradient: string;
  borderTheme: string;
  accentColor: string;
  buttonGradient: string;
  iconBg: string;
  icon: string;
  validityTag: string;
  cartPayload?: {
    id: string;
    title: string;
    price: number;
    originalPrice: number;
    category: string;
    badge: string;
  };
}

export const ALL_COURSES_CATALOG: UnsubscribedCourseItem[] = [
  {
    id: "prod-combo",
    courseType: "all-access",
    title: "All-Access Dual Codex Combo Pass",
    badge: "⭐ BEST VALUE • 64% OFF",
    category: "Full Curriculum Dual Pass",
    examBody: "ICAI & ICSI Dual Coverage",
    subtitle: "Complete access to BOTH CA Foundation & CSEET statutory codices, case study vaults & mock simulators.",
    price: 180,
    originalPrice: 499,
    discount: "64% OFF",
    savings: "Save ₹319",
    highlights: [
      "All 15 Chapters & Units across CA Foundation + CSEET",
      "Dual In-Web 3D DRM Reader with instant soft-copy activation",
      "Ranker Fellowship Guarantee: 100% fee reimbursement eligibility",
      "Weekly Monster Monday cases + 30-question live MCQ simulator",
    ],
    bannerGradient: "from-[#2E1065] via-[#4C1D95] to-[#581C87]",
    borderTheme: "border-[#7E22CE]/40 hover:border-[#A855F7]",
    accentColor: "text-amber-300",
    buttonGradient: "bg-gradient-to-r from-[#9333EA] to-[#7E22CE] hover:from-[#A855F7] hover:to-[#9333EA] text-white shadow-purple-950/40",
    iconBg: "bg-white/10 text-white",
    icon: "👑",
    validityTag: "Dual Pass • Instant Access",
    cartPayload: {
      id: "prod-combo",
      title: "All-Access Dual Codex Pass (CA Foundation + CSEET)",
      price: 180,
      originalPrice: 499,
      category: "Full Course Subscription",
      badge: "Dual Pass • 15 Chapters",
    },
  },
  {
    id: "course-ca-foundation-sub",
    courseType: "ca",
    title: "CA Foundation Business Laws Master Pass",
    badge: "🔥 ICAI NEW SCHEME • PAPER 2",
    category: "Paper 2 • Complete 7 Acts",
    examBody: "ICAI 2026 Curriculum",
    subtitle: "Comprehensive preparation covering Contract Act, Sale of Goods, Partnership, LLP, Companies & NI Act.",
    price: 99,
    originalPrice: 299,
    discount: "67% OFF",
    savings: "Save ₹200",
    highlights: [
      "All 7 Legislative Chapters simplified with section flowcharts",
      "3 High-Yield Weekly Case Studies: Monster Monday & Final Boss",
      "ICAI Answer Drafting Framework & Step-by-Step Scoring Templates",
      "Instant In-Web DRM 3D Reader on mobile, tablet & laptop",
    ],
    bannerGradient: "from-[#451A03] via-[#78350F] to-[#92400E]",
    borderTheme: "border-[#F59E0B]/40 hover:border-[#FBBF24]",
    accentColor: "text-amber-300",
    buttonGradient: "bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#F59E0B] hover:to-[#D97706] text-white shadow-amber-950/40",
    iconBg: "bg-white/10 text-white",
    icon: "⚖️",
    validityTag: "Paper 2 Pass • Instant Activation",
    cartPayload: {
      id: "course-ca-foundation-sub",
      title: "CA Foundation Business Laws Master Pass",
      price: 99,
      originalPrice: 299,
      category: "Full Course Subscription",
      badge: "Paper 2 • 7 Chapters",
    },
  },
  {
    id: "course-cseet-sub",
    courseType: "cs",
    title: "CSEET Business Law & Management Master Pass",
    badge: "⚡ ICSI SYLLABUS • 8 UNITS",
    category: "ICSI Paper 2 • Complete Syllabus",
    examBody: "ICSI Executive Entrance",
    subtitle: "Full Legal Aptitude, Henri Fayol/Taylor Management Theories & Timed Live Mock Drills.",
    price: 99,
    originalPrice: 299,
    discount: "67% OFF",
    savings: "Save ₹200",
    highlights: [
      "All 8 units: Constitution of India, Torts, Company Law & Contracts",
      "Henri Fayol 14 Principles, Scientific Management & Business Ethics",
      "Weekly timed mock test with instant score report & leaderboard",
      "Last Day Revision (LDR) Mindmaps & Concept Memory Flowcharts",
    ],
    bannerGradient: "from-[#082F49] via-[#075985] to-[#0284C7]",
    borderTheme: "border-[#38BDF8]/40 hover:border-[#7DD3FC]",
    accentColor: "text-sky-300",
    buttonGradient: "bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#38BDF8] hover:to-[#0284C7] text-white shadow-sky-950/40",
    iconBg: "bg-white/10 text-white",
    icon: "📜",
    validityTag: "CSEET Pass • Instant Activation",
    cartPayload: {
      id: "course-cseet-sub",
      title: "CSEET Business Law & Management Master Pass",
      price: 99,
      originalPrice: 299,
      category: "Full Course Subscription",
      badge: "ICSI • 8 Units",
    },
  },
  {
    id: "prod-vol1",
    courseType: "volume",
    title: "Volume 1: Statutory Law Codex & Case Bank",
    badge: "📚 BARE ACT CODEX",
    category: "Bare Act & Precedent Repository",
    examBody: "ICAI & ICSI",
    subtitle: "Complete statutory codex with landmark Supreme Court & High Court precedent rulings and trap-avoidance notes.",
    price: 99,
    originalPrice: 249,
    discount: "60% OFF",
    savings: "Save ₹150",
    highlights: [
      "180+ pages of simplified bare-act wordings & visual section flowcharts",
      "Landmark rulings: Balfour v. Balfour, Carlill, Salomon, Chinnaya",
      "Section-by-section exam answer templates for maximum score",
      "In-browser 3D reader with offline bookmarking support",
    ],
    bannerGradient: "from-[#7C2D12] via-[#9A3412] to-[#C2410C]",
    borderTheme: "border-[#FB923C]/40 hover:border-[#FDBA74]",
    accentColor: "text-orange-200",
    buttonGradient: "bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#F97316] hover:to-[#EA580C] text-white shadow-orange-950/40",
    iconBg: "bg-white/10 text-white",
    icon: "📖",
    validityTag: "180+ Pages • Digital Codex",
    cartPayload: {
      id: "prod-vol1",
      title: "Volume 1: Business Law (CA Foundation & CSEET)",
      price: 99,
      originalPrice: 249,
      category: "Digital Codex",
      badge: "Bare Act • 180+ Pages",
    },
  },
  {
    id: "prod-vol2",
    courseType: "volume",
    title: "Volume 2: Management & Corporate Environment",
    badge: "💼 MANAGEMENT MASTER",
    category: "Management, CSR & Corporate Ethics",
    examBody: "ICSI CSEET",
    subtitle: "In-depth study codex for Henri Fayol, F.W. Taylor, PESTLE analysis, Corporate Social Responsibility & Ethics.",
    price: 99,
    originalPrice: 249,
    discount: "60% OFF",
    savings: "Save ₹150",
    highlights: [
      "Complete 14 Principles of Fayol & Taylor Scientific Management",
      "Business environment models, Corporate Governance & CSR",
      "Chapter-wise conceptual MCQs with detailed explanations for options",
      "High-scoring mnemonic summaries for rapid last-day revision",
    ],
    bannerGradient: "from-[#14532D] via-[#166534] to-[#15803D]",
    borderTheme: "border-[#4ADE80]/40 hover:border-[#86EFAC]",
    accentColor: "text-emerald-200",
    buttonGradient: "bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#22C55E] hover:to-[#16A34A] text-white shadow-emerald-950/40",
    iconBg: "bg-white/10 text-white",
    icon: "🌐",
    validityTag: "120+ Pages • Digital Codex",
    cartPayload: {
      id: "prod-vol2",
      title: "Volume 2: Business Law & Management (CSEET)",
      price: 99,
      originalPrice: 249,
      category: "Digital Codex",
      badge: "Management • 120+ Pages",
    },
  },
];

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
  purchasedBooks?: string[];
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
  purchasedBooks = [],
}: StudentDashboardHomeProps) {
  const { addToCart, setIsCartOpen, setCheckoutStep } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const carouselRef = useRef<HTMLDivElement>(null);
  const promoCarouselRef = useRef<HTMLDivElement>(null);
  const quizSectionRef = useRef<HTMLDivElement>(null);
  const [promoSlideIndex, setPromoSlideIndex] = useState(0);

  // Dynamic enrolled courses reflecting actual purchase state
  const dynamicCourses: EnrolledCourseItem[] = useMemo(() => {
    return [
      {
        id: "ca-foundation-course",
        courseType: "ca",
        title: "Data Structures & Law Notes",
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
        title: "MERN Stack & Business Law",
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
        title: "Solved Cases & MCQ Drills",
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

  // Compute Unsubscribed Courses for high-conversion marketing carousel
  const unsubscribedCourses = useMemo(() => {
    return ALL_COURSES_CATALOG.filter((item) => {
      // 1. All-access pass
      if (item.courseType === "all-access") {
        return !(isCaUnlocked && isCsUnlocked);
      }
      // 2. CA Foundation
      if (item.courseType === "ca") {
        return !isCaUnlocked;
      }
      // 3. CSEET
      if (item.courseType === "cs") {
        return !isCsUnlocked;
      }
      // 4. Volume 1 product
      if (item.id === "prod-vol1") {
        if (isAllAccessUnlocked || isCaUnlocked) return false;
        const owns = (purchasedBooks || []).some(
          (b) => b.toLowerCase().includes("vol1") || b.toLowerCase().includes("vol-1")
        );
        return !owns;
      }
      // 5. Volume 2 product
      if (item.id === "prod-vol2") {
        if (isAllAccessUnlocked || isCsUnlocked) return false;
        const owns = (purchasedBooks || []).some(
          (b) => b.toLowerCase().includes("vol2") || b.toLowerCase().includes("vol-2")
        );
        return !owns;
      }
      return true;
    });
  }, [isCaUnlocked, isCsUnlocked, isAllAccessUnlocked, purchasedBooks]);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const offset = direction === "left" ? -320 : 320;
      carouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const scrollPromoCarousel = (direction: "left" | "right") => {
    if (promoCarouselRef.current) {
      const scrollAmount = promoCarouselRef.current.clientWidth >= 640 ? 410 : 330;
      const offset = direction === "left" ? -scrollAmount : scrollAmount;
      promoCarouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const handlePromoScroll = () => {
    if (promoCarouselRef.current) {
      const scrollLeft = promoCarouselRef.current.scrollLeft;
      const cardWidth = promoCarouselRef.current.clientWidth >= 640 ? 410 : 330;
      const index = Math.round(scrollLeft / cardWidth);
      setPromoSlideIndex(Math.max(0, Math.min(index, unsubscribedCourses.length - 1)));
    }
  };

  const handleBuyItem = (course: UnsubscribedCourseItem) => {
    if (course.courseType === "all-access" && onBuyCourse) {
      onBuyCourse("all-access");
    } else if (course.courseType === "ca" && onBuyCourse) {
      onBuyCourse("ca");
    } else if (course.courseType === "cs" && onBuyCourse) {
      onBuyCourse("cs");
    } else if (course.cartPayload) {
      addToCart({
        id: course.cartPayload.id,
        title: course.cartPayload.title,
        format: "pdf",
        price: course.cartPayload.price,
        originalPrice: course.cartPayload.originalPrice,
        category: course.cartPayload.category,
        badge: course.cartPayload.badge,
      });
      setIsCartOpen(true);
      setCheckoutStep("details");
    } else if (onBuyCourse) {
      onBuyCourse("all-access");
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

  return (
    <div className="space-y-6 text-[#221D1D] select-none font-sans relative">
      {/* ========================================================================= */}
      {/* 1. MARKETING CAROUSEL: COURSES NOT SUBSCRIBED YET                        */}
      {/* Dynamic marketing showcase of unowned master passes & high-yield codices  */}
      {/* ========================================================================= */}
      {unsubscribedCourses.length > 0 ? (
        <section className="space-y-3.5 bg-gradient-to-b from-[#FAF5FF]/70 via-white to-white rounded-3xl border border-[#EDE9FE] p-4 sm:p-5 shadow-xs">
          {/* Header Row: Marketing Badge, Title & Navigation Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#F3E8FF] text-[#7E22CE] border border-[#DDD6FE]">
                  <Sparkles className="w-3 h-3 text-[#9333EA] animate-pulse" />
                  <span>Curriculum Upgrades • Flash Launch Pricing</span>
                </span>
                <span className="text-[11px] font-bold text-[#6B7280]">
                  {unsubscribedCourses.length} {unsubscribedCourses.length === 1 ? "pass" : "passes"} available
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#1F2937] tracking-tight">
                Courses You Haven&apos;t Unlocked Yet
              </h2>
              <p className="text-xs text-[#6B7280] max-w-2xl leading-relaxed">
                Unlock statutory question banks, landmark precedent codices &amp; live MCQ drills at special student launch rates. Instant DRM access on all your devices.
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <Link
                href="/courses"
                className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-[#7E22CE] hover:text-[#581C87] px-3 py-1.5 rounded-full hover:bg-[#F3E8FF]/60 transition-colors"
              >
                <span>Browse All</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              {/* Carousel Prev/Next Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollPromoCarousel("left")}
                  className="w-8 h-8 rounded-full border border-[#D1D5DB] bg-white hover:bg-[#F3E8FF] hover:border-[#7E22CE] text-[#4B5563] hover:text-[#7E22CE] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                  aria-label="Previous Course"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollPromoCarousel("right")}
                  className="w-8 h-8 rounded-full border border-[#D1D5DB] bg-white hover:bg-[#F3E8FF] hover:border-[#7E22CE] text-[#4B5563] hover:text-[#7E22CE] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                  aria-label="Next Course"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Smooth Horizontal Carousel */}
          <div
            ref={promoCarouselRef}
            onScroll={handlePromoScroll}
            className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-2 pt-1 scroll-smooth snap-x snap-mandatory no-scrollbar touch-pan-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {unsubscribedCourses.map((course) => (
              <div
                key={course.id}
                className={`w-[310px] sm:w-[370px] lg:w-[410px] shrink-0 snap-start flex flex-col justify-between rounded-3xl bg-gradient-to-br ${course.bannerGradient} border ${course.borderTheme} p-5 sm:p-6 text-white shadow-xs hover:shadow-lg transition-all duration-300 relative overflow-hidden group`}
              >
                {/* Decorative Radial Glow */}
                <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

                <div className="space-y-3.5 relative z-10">
                  {/* Top Bar: Badges & Discount */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white border border-white/25">
                        {course.badge}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                        {course.discount}
                      </span>
                    </div>
                    <div className={`w-8 h-8 rounded-xl ${course.iconBg} backdrop-blur-xs flex items-center justify-center text-base shrink-0 shadow-2xs`}>
                      {course.icon}
                    </div>
                  </div>

                  {/* Title & Exam Scope */}
                  <div>
                    <span className="text-[11px] font-semibold text-white/70 block mb-0.5">
                      {course.category} • {course.examBody}
                    </span>
                    <h3 className="text-base sm:text-lg font-black leading-snug text-white tracking-tight">
                      {course.title}
                    </h3>
                    <p className="text-xs text-white/80 line-clamp-2 mt-1 leading-relaxed">
                      {course.subtitle}
                    </p>
                  </div>

                  {/* High-Yield Highlights Checklist */}
                  <div className="space-y-1.5 pt-1">
                    {course.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-white/90 font-medium leading-tight">
                        <span className="w-3.5 h-3.5 rounded-full bg-white/20 text-emerald-300 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span className="line-clamp-1">{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price & Savings Row */}
                  <div className="flex items-baseline justify-between pt-2.5 border-t border-white/15">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-semibold text-white/70">Launch:</span>
                      <span className="text-2xl sm:text-3xl font-black text-white">
                        ₹{course.price}
                      </span>
                      <span className="text-xs text-white/60 line-through font-mono">
                        ₹{course.originalPrice}
                      </span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-400 text-amber-950 font-sans shadow-2xs">
                        {course.savings}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-white/75 truncate max-w-[120px]">
                      {course.validityTag}
                    </span>
                  </div>
                </div>

                {/* Primary CTA Button */}
                <div className="pt-4 space-y-2 relative z-10">
                  <button
                    onClick={() => handleBuyItem(course)}
                    className={`w-full py-2.5 sm:py-3 px-4 rounded-xl ${course.buttonGradient} font-black text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-md hover:shadow-lg`}
                  >
                    <ShoppingBag className="w-4 h-4 shrink-0" />
                    <span>Unlock Pass • ₹{course.price}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-1" />
                  </button>

                  <div className="flex items-center justify-between text-[10px] text-white/70 px-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-300" />
                      <span>Razorpay Verified</span>
                    </span>
                    <button
                      onClick={() => onExploreCourse(course.courseType === "all-access" ? "all-access" : course.courseType)}
                      className="hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      Preview Syllabus &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          {unsubscribedCourses.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {unsubscribedCourses.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (promoCarouselRef.current) {
                      const cardWidth = promoCarouselRef.current.clientWidth >= 640 ? 410 : 330;
                      promoCarouselRef.current.scrollTo({ left: idx * cardWidth, behavior: "smooth" });
                    }
                  }}
                  className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    promoSlideIndex === idx ? "w-6 bg-[#7E22CE]" : "w-1.5 bg-[#DDD6FE] hover:bg-[#C084FC]"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        /* Fully Subscribed VIP Scholar Status Card */
        <div className="rounded-3xl bg-gradient-to-br from-[#FAF5FF] via-[#F3E8FF] to-[#EDE9FE] border border-[#DDD6FE] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#7E22CE] text-white shadow-2xs">
              <Crown className="w-3 h-3 text-amber-300" />
              <span>Ranker Scholar Fellowship Active</span>
            </span>
            <h2 className="text-lg sm:text-xl font-black text-[#1F2937]">
              All Curriculum Master Passes Unlocked! 🏆
            </h2>
            <p className="text-xs text-[#4B5563] max-w-xl">
              You have complete, unrestricted access to both CA Foundation &amp; CSEET statutory codices, live question banks, and mentor answer rubrics.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onExploreCourse(activeCourse)}
              className="px-5 py-2.5 rounded-xl bg-[#7E22CE] hover:bg-[#6B21A8] text-white text-xs font-black transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>Continue Studying</span>
            </button>
          </div>
        </div>
      )}

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
