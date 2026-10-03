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
    title: "Contract Act Made Simple",
    subtitle: "Simple rules with real-life examples",
    duration: "35h 48m",
    streamLabel: "CA Foundation",
    icon: Code2,
    iconBg: "bg-[#0F172A]",
    pdfUrl: "/notes/contract-act-unit-1.pdf",
  },
  {
    num: "2",
    courseType: "shared",
    title: "Important Case Studies",
    subtitle: "5-minute summaries for exam writing",
    duration: "28h 31m",
    streamLabel: "CA & CS Shared",
    icon: Layers,
    iconBg: "bg-[#1E293B]",
    pdfUrl: "/notes/unit-1-general-nature-of-partnership.pdf",
  },
  {
    num: "3",
    courseType: "cs",
    title: "CSEET Law & Business Practice",
    subtitle: "Exam-pattern practice questions with solutions",
    duration: "29h 57m",
    streamLabel: "CSEET",
    icon: Cpu,
    iconBg: "bg-[#0284C7]",
    pdfUrl: "/api/pdf/cseet-business-law-full.pdf",
  },
];


const WEEK_DAYS = [
  { label: "M", name: "Mon" },
  { label: "T", name: "Tue" },
  { label: "W", name: "Wed" },
  { label: "T", name: "Thu" },
  { label: "F", name: "Fri" },
  { label: "S", name: "Sat" },
  { label: "S", name: "Sun" },
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

  const dynamicCourses: EnrolledCourseItem[] = useMemo(() => {
    return [
      {
        id: "ca-foundation-course",
        courseType: "ca",
        title: "CA Foundation Law Notes",
        category: "Full Course • 7 Chapters",
        enrolledDate: isCaUnlocked ? "Active Enrollment" : "Not Enrolled",
        progress: isCaUnlocked ? Math.min(100, Math.max(25, completedUnitsCount * 14)) : 0,
        pdfUrl: "/notes/unit-1-general-nature-of-partnership.pdf",
        iconBg: "from-[#9333EA] to-[#6B21A8]",
        iconType: "yellow",
        isUnlocked: Boolean(isCaUnlocked),
        price: 99,
      },
      {
        id: "cseet-course",
        courseType: "cs",
        title: "CSEET Law & Business",
        category: "Full Course • 8 Units",
        enrolledDate: isCsUnlocked ? "Active Enrollment" : "Not Enrolled",
        progress: isCsUnlocked ? Math.min(100, Math.max(15, completedUnitsCount * 12)) : 0,
        pdfUrl: "/api/pdf/cseet-business-law-full.pdf",
        iconBg: "from-[#3B0764] to-[#1E1B4B]",
        iconType: "dark",
        isUnlocked: Boolean(isCsUnlocked),
        price: 99,
      },
      {
        id: "cases-course",
        courseType: "shared",
        title: "Solved Case Studies & Answers",
        category: "Important Exam Questions",
        enrolledDate: (isCaUnlocked || isCsUnlocked) ? "Active Enrollment" : "Requires Course Pass",
        progress: (isCaUnlocked || isCsUnlocked) ? 45 : 0,
        pdfUrl: "/notes/contract-act-unit-3.pdf",
        iconBg: "from-[#0F172A] to-[#334155]",
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

  const [bonusClaimed, setBonusClaimed] = useState(false);
  const [readSummaryDone, setReadSummaryDone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedPromoStream, setSelectedPromoStream] = useState<"ca" | "cs">(activeCourse);
  const carouselRef = useRef<HTMLDivElement>(null);
  const quizSectionRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (activeCourse) {
      setSelectedPromoStream(activeCourse);
    }
  }, [activeCourse]);

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

    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key === "lawkaksha_admin_promo_banners") {
        try {
          const saved = localStorage.getItem("lawkaksha_admin_promo_banners");
          if (saved) setPromoData(JSON.parse(saved));
        } catch (err) {}
      }
    };

    window.addEventListener("lawkaksha_promo_updated", handlePromoUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("lawkaksha_promo_updated", handlePromoUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

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


  // Initialize bonusClaimed from localStorage based on today's date
  useEffect(() => {
    try {
      const todayStr = new Date().toDateString();
      const claimedDate = localStorage.getItem("lawkaksha_streak_claimed_date");
      if (claimedDate === todayStr) {
        setBonusClaimed(true);
      }
      const storedReadDone = localStorage.getItem("lawkaksha_quest_read_done");
      if (storedReadDone === todayStr) {
        setReadSummaryDone(true);
      }
    } catch (e) {}
  }, []);

  const handleClaimBonus = () => {
    if (bonusClaimed) return;
    setBonusClaimed(true);
    setShowConfetti(true);
    try {
      const todayStr = new Date().toDateString();
      localStorage.setItem("lawkaksha_streak_claimed_date", todayStr);
    } catch (e) {}

    if (awardXp) {
      awardXp(20, "Daily Streak Bonus Claimed! 🔥 Keep the fire burning!");
    }

    setTimeout(() => {
      setShowConfetti(false);
    }, 3500);
  };

  const handleReadSummaryQuest = () => {
    const todayStr = new Date().toDateString();
    setReadSummaryDone(true);
    try {
      localStorage.setItem("lawkaksha_quest_read_done", todayStr);
    } catch (e) {}
    if (awardXp) {
      awardXp(10, "Daily Summary Completed! 📖 (+10 Points)");
    }
    onOpenPdf(
      "/notes/unit-1-general-nature-of-partnership.pdf",
      "The Indian Partnership Act, 1932",
      "5-Minute Quick Read Summary",
      "ca"
    );
  };

  const scrollToQuiz = () => {
    if (quizSectionRef.current) {
      quizSectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

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

  // Calculate day of week (0 = Monday, 6 = Sunday)
  const todayDayIndex = (new Date().getDay() + 6) % 7;

  // Calculate completed daily quests count
  const quest1Done = bonusClaimed;
  const quest2Done = readSummaryDone;
  const quest3Done = qotdSubmitted;
  const completedQuestsCount = (quest1Done ? 1 : 0) + (quest2Done ? 1 : 0) + (quest3Done ? 1 : 0);
  const allQuestsDone = completedQuestsCount === 3;

  const firstName = studentName?.split(" ")[0] || "Student";

  return (
    <div className="space-y-6 text-[#221D1D] select-none font-sans relative">
      {/* ========================================================================= */}
      {/* KEYFRAME ANIMATIONS & CELEBRATION STYLES                                   */}
      {/* ========================================================================= */}
      <style jsx>{`
        @keyframes flamePulse {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            filter: drop-shadow(0 0 16px rgba(249, 115, 22, 0.7));
          }
          50% {
            transform: scale(1.08) rotate(2deg);
            filter: drop-shadow(0 0 26px rgba(249, 115, 22, 0.95));
          }
        }
        @keyframes emberFloat {
          0% {
            transform: translateY(0px) scale(0.8);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-8px) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translateY(-16px) scale(0.6);
            opacity: 0;
          }
        }
        @keyframes shimmerSweep {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-flame-pulse {
          animation: flamePulse 2s ease-in-out infinite;
        }
        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmerSweep 3s infinite linear;
        }
      `}</style>

      {/* CONFETTI BURST OVERLAY */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 40 }).map((_, idx) => {
            const colors = [
              "#9333EA",
              "#F59E0B",
              "#EC4899",
              "#10B981",
              "#3B82F6",
              "#EF4444",
            ];
            const color = colors[idx % colors.length];
            const left = Math.random() * 100;
            const animDuration = 1.5 + Math.random() * 1.5;
            const size = 8 + Math.random() * 10;
            return (
              <span
                key={idx}
                className="absolute rounded-full animate-bounce"
                style={{
                  top: "-20px",
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  animation: `bounce ${animDuration}s cubic-bezier(0.25, 1, 0.5, 1) infinite, spin 2s linear infinite`,
                  boxShadow: `0 0 8px ${color}`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. MAIN PANEL HERO: GAMIFIED STREAK, LEVEL & DAILY QUEST COMMAND CENTER   */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FAF5FF] via-[#F3E8FF] to-[#EDE9FE] border-2 border-[#D8B4FE] p-5 sm:p-7 shadow-sm transition-all">
        {/* Decorative background glow blobs */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#C084FC]/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-[#FDBA74]/25 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-stretch justify-between gap-6">
          {/* LEFT SIDE: ANIMATED FLAME, STREAK DAYS & WEEKLY TRACKER */}
          <div className="flex-1 space-y-4">
            {/* Top Badge & Welcome */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#7E22CE] text-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>STUDY STREAK ACTIVE</span>
              </span>
              <span className="text-xs font-bold text-[#6B21A8]">
                Namaste, {firstName}! 🌟
              </span>
            </div>

            {/* Streak Number + Animated Fire */}
            <div className="flex items-center gap-4">
              {/* Pulsing Animated Flame Icon */}
              <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-[#EA580C] via-[#F97316] to-[#FBBF24] shadow-[0_0_30px_rgba(249,115,22,0.55)] text-white shrink-0 animate-flame-pulse cursor-pointer">
                <Flame className="w-10 h-10 sm:w-12 sm:h-12 fill-amber-100 text-amber-50" />
                {/* Floating flame embers */}
                <span className="absolute -top-1 -right-1 text-sm font-bold animate-ping">
                  ✨
                </span>
                <span className="absolute -bottom-1 -left-1 text-xs">🔥</span>
              </div>

              {/* Big Bold Streak Details */}
              <div className="space-y-0.5">
                <div className="flex items-baseline gap-2">
                  <h1 className="text-3xl sm:text-4xl font-black text-[#1F2937] tracking-tight">
                    {streak}
                  </h1>
                  <span className="text-lg sm:text-xl font-extrabold text-[#7E22CE]">
                    Days Streak!
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[#4B5563] leading-snug">
                  You are studying regularly! Keep studying today to hit{" "}
                  <strong className="text-[#9333EA] font-extrabold">
                    {streak + 1} Days
                  </strong>
                  .
                </p>
                <p className="text-[11px] text-[#6B7280] font-medium">
                  Longest Streak Record:{" "}
                  <strong className="text-[#1F2937]">
                    {Math.max(streak, longestStreak)} Days
                  </strong>
                </p>
              </div>
            </div>

            {/* WEEKLY STREAK TRACKER PILLS (Mon -> Sun) */}
            <div className="pt-1">
              <p className="text-[11px] font-bold text-[#6B21A8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>This Week&apos;s Learning Tracker</span>
              </p>

              <div className="grid grid-cols-7 gap-1.5 sm:gap-2 max-w-sm">
                {WEEK_DAYS.map((d, idx) => {
                  const isPast = idx < todayDayIndex;
                  const isToday = idx === todayDayIndex;
                  const isFuture = idx > todayDayIndex;

                  let pillStyle =
                    "bg-white/80 border-[#E9DDF5] text-[#6B7280] hover:bg-white";
                  let badgeContent = <span className="text-xs">{d.label}</span>;

                  if (isPast) {
                    pillStyle =
                      "bg-[#D1FAE5] border-[#10B981] text-[#065F46] font-bold shadow-2xs";
                    badgeContent = (
                      <Check className="w-3.5 h-3.5 text-[#059669] stroke-[3]" />
                    );
                  } else if (isToday) {
                    pillStyle =
                      "bg-gradient-to-b from-[#F97316] to-[#EA580C] border-[#EA580C] text-white font-extrabold shadow-md scale-105";
                    badgeContent = (
                      <Flame className="w-3.5 h-3.5 fill-white text-white animate-pulse" />
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-1"
                      title={`${d.name}: ${
                        isToday ? "Today (Active)" : isPast ? "Studied ✓" : "Upcoming"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center transition-all ${pillStyle}`}
                      >
                        {badgeContent}
                      </div>
                      <span
                        className={`text-[10px] font-bold ${
                          isToday ? "text-[#EA580C]" : "text-[#6B7280]"
                        }`}
                      >
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ACTION BUTTONS: CLAIM BONUS + OPEN CALENDAR */}
            <div className="pt-2 flex items-center gap-2.5 flex-wrap">
              {!bonusClaimed ? (
                <button
                  onClick={handleClaimBonus}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#9333EA] via-[#A855F7] to-[#7E22CE] hover:from-[#7E22CE] hover:to-[#6B21A8] text-white text-xs font-black transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <Gift className="w-4 h-4 text-amber-300 animate-bounce" />
                  <span>Claim Daily Streak Bonus (+20 Points)</span>
                </button>
              ) : (
                <div className="px-4 py-2 rounded-2xl bg-[#D1FAE5] border border-[#10B981] text-[#065F46] text-xs font-bold flex items-center gap-2 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>Daily Bonus Claimed (+20 Points)</span>
                </div>
              )}

              {onOpenStreakLog && (
                <button
                  onClick={onOpenStreakLog}
                  className="px-4 py-2 rounded-2xl bg-white hover:bg-[#F3E8FF] text-[#581C87] border border-[#D8B4FE] text-xs font-bold transition-all shadow-2xs hover:shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#9333EA]" />
                  <span>View Streak Calendar</span>
                </button>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: LEVEL & XP PROGRESSION + BADGES UNLOCKED */}
          <div className="w-full lg:w-[320px] bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-[#E9DDF5] shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Level & Points Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center font-black shadow-2xs">
                    <Trophy className="w-5 h-5 text-[#9333EA]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wide">
                      Your Level &amp; Rank
                    </h3>
                    <h4 className="text-sm font-black text-[#1F2937]">
                      Level {levelInfo.level}: {levelInfo.title}
                    </h4>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] text-xs font-black flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current text-amber-500" />
                  <span>{lawXp} XP</span>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#4B5563]">
                  <span>Progress to Level {levelInfo.level + 1}</span>
                  <span className="text-[#9333EA]">{levelInfo.progress}%</span>
                </div>
                <div className="w-full bg-[#E5E7EB] rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#9333EA] to-[#C084FC] h-full rounded-full transition-all duration-700 animate-shimmer"
                    style={{ width: `${Math.min(100, Math.max(5, levelInfo.progress))}%` }}
                  />
                </div>
                <p className="text-[10px] text-[#6B7280] font-medium">
                  Earn{" "}
                  <strong className="text-[#1F2937]">
                    {Math.max(0, levelInfo.nextXp - lawXp)} more points
                  </strong>{" "}
                  to level up!
                </p>
              </div>

              {/* Unlocked Badges Preview */}
              <div className="pt-2 border-t border-[#F3F4F6] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#4B5563]">
                    Milestone Badges
                  </span>
                  {onOpenBadgesModal && (
                    <button
                      onClick={onOpenBadgesModal}
                      className="text-[11px] font-extrabold text-[#9333EA] hover:underline cursor-pointer"
                    >
                      View All 🏆
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div
                    className={`p-2 rounded-xl border text-center transition-all ${
                      streak >= 3
                        ? "bg-[#FEF3C7] border-[#FDE68A] text-[#92400E]"
                        : "bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF] opacity-60"
                    }`}
                    title="Novice Advocate: 3-Day Study Streak"
                  >
                    <div className="text-base">🥉</div>
                    <p className="text-[9px] font-bold truncate mt-0.5">3-Day</p>
                    <span className="text-[8px] font-semibold">
                      {streak >= 3 ? "Unlocked" : "Locked"}
                    </span>
                  </div>

                  <div
                    className={`p-2 rounded-xl border text-center transition-all ${
                      qotdSubmitted
                        ? "bg-[#D1FAE5] border-[#A7F3D0] text-[#065F46]"
                        : "bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF] opacity-60"
                    }`}
                    title="Quiz Star: Daily 1-Minute Quiz completed"
                  >
                    <div className="text-base">⚡</div>
                    <p className="text-[9px] font-bold truncate mt-0.5">Quizzer</p>
                    <span className="text-[8px] font-semibold">
                      {qotdSubmitted ? "Unlocked" : "Locked"}
                    </span>
                  </div>

                  <div
                    className={`p-2 rounded-xl border text-center transition-all ${
                      streak >= 7
                        ? "bg-[#E0E7FF] border-[#C7D2FE] text-[#3730A3]"
                        : "bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF] opacity-60"
                    }`}
                    title="Law Champion: 7-Day Study Streak"
                  >
                    <div className="text-base">🛡️</div>
                    <p className="text-[9px] font-bold truncate mt-0.5">7-Day</p>
                    <span className="text-[8px] font-semibold">
                      {streak >= 7 ? "Unlocked" : `${Math.max(0, 7 - streak)}d left`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick motivative tag */}
            <div className="p-2.5 rounded-xl bg-[#F6EFFD] border border-[#E9DDF5] flex items-center gap-2 text-xs font-semibold text-[#581C87]">
              <TrendingUp className="w-4 h-4 text-[#9333EA] shrink-0" />
              <span>Leaderboard Rank: #48 (Top 15%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TODAY'S EASY DAILY STUDY GOALS (GAMIFIED QUESTS FOR 10TH PASSOUT)       */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-[#E7E4E7] p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F3F4F6] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#7E22CE] flex items-center justify-center font-bold">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1F2937]">
                Today&apos;s Easy Study Goals
              </h3>
              <p className="text-xs text-[#6B7280]">
                Complete all 3 easy tasks daily to build habits &amp; earn extra XP!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black ${
                allQuestsDone
                  ? "bg-[#D1FAE5] text-[#065F46] border border-[#10B981]"
                  : "bg-[#F3E8FF] text-[#7E22CE] border border-[#D8B4FE]"
              }`}
            >
              {completedQuestsCount} of 3 Goals Done
            </span>
          </div>
        </div>

        {/* 3 Interactive Daily Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Task 1: Daily Login Streak */}
          <div
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
              quest1Done
                ? "bg-[#F0FDF4] border-[#86EFAC]"
                : "bg-[#FAFAFA] border-[#E5E7EB] hover:border-[#9333EA]"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔥</span>
                <div>
                  <h4 className="text-xs font-bold text-[#1F2937]">
                    1. Check-In Today
                  </h4>
                  <p className="text-[11px] text-[#6B7280]">
                    Log in and claim streak
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-[#7E22CE] bg-[#F3E8FF] px-2 py-0.5 rounded-full">
                +20 XP
              </span>
            </div>

            <div>
              {quest1Done ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#059669]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Done for Today</span>
                </div>
              ) : (
                <button
                  onClick={handleClaimBonus}
                  className="px-3 py-1.5 rounded-xl bg-[#9333EA] hover:bg-[#7E22CE] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  Claim Bonus
                </button>
              )}
            </div>
          </div>

          {/* Task 2: Read 1 Summary Note */}
          <div
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
              quest2Done
                ? "bg-[#F0FDF4] border-[#86EFAC]"
                : "bg-[#FAFAFA] border-[#E5E7EB] hover:border-[#9333EA]"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">📖</span>
                <div>
                  <h4 className="text-xs font-bold text-[#1F2937]">
                    2. Read 1 Summary
                  </h4>
                  <p className="text-[11px] text-[#6B7280]">
                    5-min notes reading
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-[#7E22CE] bg-[#F3E8FF] px-2 py-0.5 rounded-full">
                +10 XP
              </span>
            </div>

            <div>
              {quest2Done ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#059669]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Read Complete</span>
                </div>
              ) : (
                <button
                  onClick={handleReadSummaryQuest}
                  className="px-3 py-1.5 rounded-xl bg-[#9333EA] hover:bg-[#7E22CE] text-white text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Read Now</span>
                  <Play className="w-3 h-3 fill-current" />
                </button>
              )}
            </div>
          </div>

          {/* Task 3: Complete 1 Daily Quiz */}
          <div
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
              quest3Done
                ? "bg-[#F0FDF4] border-[#86EFAC]"
                : "bg-[#FAFAFA] border-[#E5E7EB] hover:border-[#9333EA]"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <div>
                  <h4 className="text-xs font-bold text-[#1F2937]">
                    3. Daily Quiz Question
                  </h4>
                  <p className="text-[11px] text-[#6B7280]">
                    Answer 1 simple question
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-[#7E22CE] bg-[#F3E8FF] px-2 py-0.5 rounded-full">
                +15 XP
              </span>
            </div>

            <div>
              {quest3Done ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#059669]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Quiz Answered</span>
                </div>
              ) : (
                <button
                  onClick={scrollToQuiz}
                  className="px-3 py-1.5 rounded-xl bg-[#9333EA] hover:bg-[#7E22CE] text-white text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Solve Question</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {allQuestsDone && (
          <div className="p-3 bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] rounded-2xl border border-[#F59E0B] text-xs font-bold text-[#92400E] flex items-center justify-between animate-bounce duration-1000">
            <span className="flex items-center gap-2">
              <span>🎉</span>
              <span>
                Superb job, {firstName}! All 3 daily goals completed today!
              </span>
            </span>
            <span className="bg-[#B45309] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black">
              +45 Total XP Won!
            </span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. CODEX PASSES (MINIMAL & WELL-DEFINED ARCHITECTURE)                      */}
      {/* ========================================================================= */}
      {promoData.enabled !== false && (() => {
        const leftCard: PromoPassCard = (selectedPromoStream === "ca" ? promoData.caCard : promoData.csCard) || DEFAULT_PROMO_BANNERS.caCard;
        const rightCard: PromoPassCard = promoData.comboCard || DEFAULT_PROMO_BANNERS.comboCard;

        return (
          <div className="space-y-3">
            {/* Minimal & Well-Defined Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div>
                <h3 className="text-base font-bold text-[#1F2937] tracking-tight flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#9333EA]" />
                  <span>{promoData.sectionTitle || "Law Kaksha Codex Passes"}</span>
                </h3>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Select your syllabus stream or get the all-access bundle pass
                </p>
              </div>

              {/* Sleek Segmented Control */}
              <div className="inline-flex p-1 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] text-xs font-bold self-start sm:self-auto shadow-2xs">
                <button
                  onClick={() => setSelectedPromoStream("ca")}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    selectedPromoStream === "ca"
                      ? "bg-white text-[#1F2937] shadow-xs"
                      : "text-[#6B7280] hover:text-[#1F2937]"
                  }`}
                >
                  CA Foundation
                </button>
                <button
                  onClick={() => setSelectedPromoStream("cs")}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    selectedPromoStream === "cs"
                      ? "bg-white text-[#1F2937] shadow-xs"
                      : "text-[#6B7280] hover:text-[#1F2937]"
                  }`}
                >
                  CSEET
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Individual Stream Pass (CA Foundation or CSEET) */}
              {leftCard.enabled !== false && (() => {
                const isStreamUnlocked = selectedPromoStream === "ca" ? isCaUnlocked : isCsUnlocked;

                return (
                  <div className="bg-white rounded-3xl border border-[#E7E4E7] p-5 sm:p-6 shadow-xs hover:border-[#D8B4FE] hover:shadow-sm transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Top Meta: Stream Category & Status/Price */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#7E22CE]">
                          <BookOpen className="w-3.5 h-3.5 text-[#9333EA]" />
                          <span>
                            {leftCard.streamBadge ||
                              (selectedPromoStream === "ca"
                                ? "CA Foundation • Paper 2"
                                : "CSEET • Business Law")}
                          </span>
                        </div>

                        {isStreamUnlocked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Active Pass</span>
                          </span>
                        ) : (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-black text-[#1F2937]">
                              ₹{leftCard.price}
                            </span>
                            {leftCard.originalPrice && leftCard.originalPrice > leftCard.price && (
                              <span className="text-xs text-[#9CA3AF] line-through font-mono">
                                ₹{leftCard.originalPrice}
                              </span>
                            )}
                            {leftCard.saveText && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                {leftCard.saveText}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Title & One-Line Description */}
                      <div className="space-y-1">
                        <h4 className="text-base sm:text-lg font-bold text-[#1F2937] leading-snug">
                          {leftCard.title}
                          {leftCard.subtitle && (
                            <span className="text-[#6B7280] font-medium block sm:inline sm:ml-1 text-sm">
                              • {leftCard.subtitle}
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2">
                          {leftCard.description ||
                            "All statutory chapters in simple English, weekly solved case studies & 1.5-day LDR flowcharts."}
                        </p>
                      </div>

                      {/* Minimal Features List */}
                      {leftCard.features && leftCard.features.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-[#4B5563]">
                          {leftCard.features.map((feat, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 bg-[#F9FAFB] px-2.5 py-1 rounded-lg border border-[#E5E7EB] font-medium"
                            >
                              <Check className="w-3 h-3 text-[#9333EA]" />
                              <span>{feat}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom CTA Row */}
                    <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between gap-3">
                      <span className="text-[11px] text-[#9CA3AF] font-medium">
                        {isStreamUnlocked ? "In-Web Reader Ready" : "Full statutory access"}
                      </span>

                      {isStreamUnlocked ? (
                        <button
                          onClick={() => onExploreCourse(selectedPromoStream)}
                          className="px-4 py-2 rounded-xl bg-[#9333EA] hover:bg-[#7E22CE] text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <span>Open Notes</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (onBuyCourse) {
                              onBuyCourse(selectedPromoStream);
                            } else {
                              handleCardClick(leftCard);
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-[#221D1D] hover:bg-[#383130] text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Lock className="w-3.5 h-3.5 text-[#AED7E9]" />
                          <span>Unlock Pass • ₹{leftCard.price}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Card 2: All-Access Dual Codex Pass (CA + CSEET Combo) */}
              {rightCard.enabled !== false && (() => {
                const isComboUnlocked = isCaUnlocked && isCsUnlocked;

                return (
                  <div className="relative overflow-hidden bg-white rounded-3xl border-2 border-[#D8B4FE]/80 p-5 sm:p-6 shadow-xs hover:border-[#9333EA] hover:shadow-sm transition-all flex flex-col justify-between space-y-4">
                    {/* Subtle Top Gradient Accent Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9333EA] via-[#A855F7] to-[#C084FC]" />

                    <div className="space-y-3">
                      {/* Top Meta: Value Badge & Status/Price */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#7E22CE]">
                          <Sparkles className="w-3.5 h-3.5 text-[#9333EA]" />
                          <span>{rightCard.streamBadge || "Dual Pass • Best Value"}</span>
                        </div>

                        {isComboUnlocked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>All-Access Active</span>
                          </span>
                        ) : (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-black text-[#1F2937]">
                              ₹{rightCard.price}
                            </span>
                            {rightCard.originalPrice && rightCard.originalPrice > rightCard.price && (
                              <span className="text-xs text-[#9CA3AF] line-through font-mono">
                                ₹{rightCard.originalPrice}
                              </span>
                            )}
                            {rightCard.saveText && (
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                {rightCard.saveText}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Title & One-Line Description */}
                      <div className="space-y-1">
                        <h4 className="text-base sm:text-lg font-bold text-[#1F2937] leading-snug">
                          {rightCard.title}
                          {rightCard.subtitle && (
                            <span className="text-[#6B7280] font-medium block sm:inline sm:ml-1 text-sm">
                              • {rightCard.subtitle}
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2">
                          {rightCard.description ||
                            "Unlimited access to both CA Foundation & CSEET notes, weekly solved cases and timed practice drills."}
                        </p>
                      </div>

                      {/* Minimal Features List */}
                      {rightCard.features && rightCard.features.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-[#4B5563]">
                          {rightCard.features.map((feat, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 bg-[#FAF5FF] px-2.5 py-1 rounded-lg border border-[#EDE9FE] font-medium text-[#6B21A8]"
                            >
                              <Check className="w-3 h-3 text-[#9333EA]" />
                              <span>{feat}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom CTA Row */}
                    <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between gap-3">
                      <span className="text-[11px] text-[#9CA3AF] font-medium">
                        {isComboUnlocked ? "Both CA & CS Unlocked" : "Includes both CA & CSEET"}
                      </span>

                      {isComboUnlocked ? (
                        <button
                          onClick={() => onExploreCourse(activeCourse)}
                          className="px-4 py-2 rounded-xl bg-[#9333EA] hover:bg-[#7E22CE] text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <span>Browse All Notes</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (onBuyCourse) {
                              onBuyCourse("all-access");
                            } else {
                              handleCardClick(rightCard);
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7E22CE] to-[#9333EA] hover:from-[#6B21A8] hover:to-[#7E22CE] text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                          <span>{rightCard.buttonText || `Unlock All-Access • ₹${rightCard.price}`}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* 4. ENROLLED COURSES SECTION (EXACT SCREENSHOT LAYOUT & BUTTONS)           */}
      {/* ========================================================================= */}
      <div className="space-y-3.5">
        {/* Header with Search and Navigation Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-[#221D1D] tracking-tight">
            Enrolled Courses
          </h3>

          <div className="flex items-center gap-2">
            {/* Search courses input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-3 pr-3 py-1.5 text-xs rounded-lg bg-white border border-[#E7E4E7] focus:outline-none focus:border-[#9333EA] w-48 sm:w-56 transition-all text-[#221D1D]"
              />
            </div>

            {/* Prev & Next Arrow Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => scrollCarousel("left")}
                className="w-7 h-7 rounded-full border border-[#D1D5DB] bg-white hover:bg-[#F3E8FF] text-[#221D1D] flex items-center justify-center transition-colors cursor-pointer text-xs"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                className="w-7 h-7 rounded-full border border-[#D1D5DB] bg-white hover:bg-[#F3E8FF] text-[#221D1D] flex items-center justify-center transition-colors cursor-pointer text-xs"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Courses Row */}
        <div
          ref={carouselRef}
          className="flex items-stretch gap-4 overflow-x-auto pb-2 scroll-smooth no-scrollbar touch-pan-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {filteredCourses.map((c) => (
            <div
              key={c.id}
              onClick={() => {
                if (!c.isUnlocked) {
                  if (onBuyCourse) {
                    onBuyCourse(c.courseType === "shared" ? "all-access" : c.courseType);
                  } else {
                    onExploreCourse(c.courseType === "shared" ? "all-access" : c.courseType);
                  }
                }
              }}
              className={`w-[275px] sm:w-[305px] shrink-0 bg-white rounded-3xl border p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                c.isUnlocked ? "border-[#E7E4E7]" : "border-amber-200/70 hover:border-amber-300 cursor-pointer"
              }`}
            >
              <div className="space-y-3">
                {/* Course Header: Icon + Title + Status Pill + Star */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* App Icon matching theme */}
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${c.iconBg} flex items-center justify-center text-white shrink-0 shadow-2xs`}
                    >
                      <BookOpen className="w-6 h-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {c.isUnlocked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Enrolled</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
                            <Lock className="w-3 h-3 text-amber-700" />
                            <span>Locked • ₹{c.price || 99}</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-[#221D1D] truncate leading-tight">
                        {c.title}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-[#77716E] mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>Self Paced</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(c.id);
                    }}
                    className="text-[#9CA3AF] hover:text-[#F59E0B] p-1 cursor-pointer shrink-0"
                    aria-label="Favorite"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        c.isFavorite ? "fill-[#F59E0B] text-[#F59E0B]" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Enrollment / Access Status */}
                {c.isUnlocked ? (
                  <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] flex items-center justify-center font-bold">
                      ✓
                    </span>
                    <span>Full Syllabus Pass Active</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-amber-800 font-medium flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-100 text-amber-800 text-[9px] flex items-center justify-center font-bold">
                      🔒
                    </span>
                    <span>Course Pass Required to Study</span>
                  </p>
                )}

                {/* Course Progress with Info Icon and % */}
                <div className="space-y-1 pt-1">
                  <div className="w-full bg-[#E5E7EB] rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`${c.isUnlocked ? "bg-[#10B981]" : "bg-gray-300"} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#77716E]">
                    <span className="flex items-center gap-1">
                      {c.isUnlocked ? (
                        <>
                          <span className="w-3.5 h-3.5 rounded-full bg-[#9333EA] text-white text-[9px] flex items-center justify-center font-bold">
                            i
                          </span>
                          <span>Course Progress</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 text-[#9CA3AF]" />
                          <span>Enrollment Required</span>
                        </>
                      )}
                    </span>
                    <span className="font-bold text-[#221D1D]">{c.progress}%</span>
                  </div>
                </div>
              </div>

              {/* Action Button: Resume if purchased vs Unlock Pass if locked */}
              <div className="pt-4">
                {c.isUnlocked ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPdf(
                        c.pdfUrl,
                        c.title,
                        c.category,
                        c.courseType === "shared" ? activeCourse : c.courseType
                      );
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#9333EA] hover:bg-[#7E22CE] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>Resume Reading</span>
                    <Play className="w-3.5 h-3.5 fill-current text-white" />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onBuyCourse) {
                        onBuyCourse(c.courseType === "shared" ? "all-access" : c.courseType);
                      } else {
                        onExploreCourse(c.courseType === "shared" ? "all-access" : c.courseType);
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#221D1D] hover:bg-[#383130] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98 hover:scale-[1.01]"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#AED7E9]" />
                    <span>Unlock Course • ₹{c.price || 99}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. RECOMMENDED FOR YOU (PURCHASE-GATED WITH CLEAN MINIMAL DESIGN)         */}
      {/* ========================================================================= */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#221D1D] tracking-tight">
            Recommended for You
          </h3>
          <span className="text-xs text-[#77716E]">Official Study Material</span>
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
                className={`relative bg-white rounded-3xl border p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group ${
                  isItemUnlocked ? "border-[#E7E4E7]" : "border-amber-200/70 hover:border-amber-300"
                }`}
              >
                {/* Large Faint Number in Top-Right Corner */}
                <span className="absolute top-3 right-5 text-3xl font-extrabold text-[#E5E7EB] select-none pointer-events-none group-hover:text-[#D1D5DB] transition-colors">
                  {item.num}
                </span>

                <div className="space-y-3 pr-8">
                  <div className="flex items-center gap-2">
                    {/* Dark Square Icon */}
                    <div
                      className={`w-10 h-10 rounded-2xl ${item.iconBg} text-white flex items-center justify-center shadow-xs shrink-0`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div>
                      {isItemUnlocked ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Ready to Study</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80">
                          <Lock className="w-3 h-3 text-amber-700" />
                          <span>Pass Required • ₹99</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#221D1D] group-hover:text-[#9333EA] transition-colors leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#77716E] mt-1 leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-[#F3F4F6] flex items-center justify-between text-xs text-[#77716E]">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-[#9CA3AF]" />
                    <span>Duration: {item.duration}</span>
                  </span>
                  {isItemUnlocked ? (
                    <span className="text-[#9333EA] font-bold text-xs group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      <span>Open Notes</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="text-amber-800 font-bold text-xs group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-700" />
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
      {/* 6. DAILY 1-MINUTE PRACTICE QUIZ (SUPER SIMPLE FOR 10TH PASSOUT)           */}
      {/* ========================================================================= */}
      <div
        ref={quizSectionRef}
        className="bg-white rounded-3xl border border-[#E7E4E7] p-5 sm:p-6 shadow-2xs space-y-3.5 scroll-mt-20"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#D97706] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-[#D97706]" />
              <span>Daily 1-Minute Quiz (+15 Points)</span>
            </span>
          </div>
          <span className="text-xs font-bold text-[#9333EA]">Simple Law Question</span>
        </div>

        <p className="text-sm font-semibold text-[#221D1D] leading-relaxed">
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
              btnStyle = "bg-[#F3E8FF] border-[#9333EA] text-[#581C87] font-bold";
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
          <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] text-xs text-[#374151] leading-relaxed">
            <p className="font-bold text-[#111827]">Explanation in Simple Words:</p>
            <p className="mt-0.5">{qotdData?.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
