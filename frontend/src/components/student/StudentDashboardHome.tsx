"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Scale,
  Landmark,
  FileText,
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
  RefreshCw,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getApiBaseUrl } from "@/lib/api";
import { StudentHeroCard } from "./StudentHeroCard";
import { StudentMetricStats } from "./StudentMetricStats";
import { StudentMyCoursesList, StudentCourseProgressItem } from "./StudentMyCoursesList";

export interface ShowcaseResourceItem {
  id: string;
  courseType: "ca" | "cs" | "all-access" | "volume";
  title: string;
  badge: string;
  category: string;
  examBody: string;
  subtitle: string;
  coverImage: string;
  price: number;
  originalPrice: number;
  discount: string;
  savings: string;
  highlights: string[];
  bannerGradient: string;
  borderTheme: string;
  accentColor: string;
  buttonGradient: string;
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

export const SHOWCASE_RESOURCES: ShowcaseResourceItem[] = [
  {
    id: "prod-combo",
    courseType: "all-access",
    title: "All-Access Dual Codex Combo Pass",
    badge: "⭐ BEST VALUE • 64% OFF",
    category: "Full Curriculum Dual Pass",
    examBody: "ICAI & ICSI Dual Coverage",
    subtitle: "Complete access to BOTH CA Foundation & CSEET statutory codices, case study vaults & mock simulators.",
    coverImage: "/covers/combo-codex.webp",
    price: 180,
    originalPrice: 499,
    discount: "64% OFF",
    savings: "Save ₹319",
    highlights: [
      "All 15 Chapters & Units across CA Foundation + CSEET",
      "Dual In-Web 3D DRM Reader with instant soft-copy activation",
      "Ranker Fellowship Guarantee: 100% fee reimbursement eligibility",
    ],
    bannerGradient: "from-[#2E1065] via-[#4C1D95] to-[#581C87]",
    borderTheme: "border-[#7E22CE]/40 hover:border-[#C084FC]",
    accentColor: "text-amber-300",
    buttonGradient: "bg-gradient-to-r from-[#9333EA] to-[#7E22CE] hover:from-[#A855F7] hover:to-[#9333EA] text-white shadow-purple-950/40",
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
    coverImage: "/covers/vol1-codex.webp",
    price: 99,
    originalPrice: 299,
    discount: "67% OFF",
    savings: "Save ₹200",
    highlights: [
      "All 7 Legislative Chapters simplified with section flowcharts",
      "3 High-Yield Weekly Case Studies: Monster Monday & Final Boss",
      "ICAI Answer Drafting Framework & Step-by-Step Scoring Templates",
    ],
    bannerGradient: "from-[#451A03] via-[#78350F] to-[#92400E]",
    borderTheme: "border-[#F59E0B]/40 hover:border-[#FBBF24]",
    accentColor: "text-amber-300",
    buttonGradient: "bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#F59E0B] hover:to-[#D97706] text-white shadow-amber-950/40",
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
    coverImage: "/covers/vol2-codex.webp",
    price: 99,
    originalPrice: 299,
    discount: "67% OFF",
    savings: "Save ₹200",
    highlights: [
      "All 8 units: Constitution of India, Torts, Company Law & Contracts",
      "Henri Fayol 14 Principles, Scientific Management & Business Ethics",
      "Weekly timed mock test with instant score report & leaderboard",
    ],
    bannerGradient: "from-[#082F49] via-[#075985] to-[#0284C7]",
    borderTheme: "border-[#38BDF8]/40 hover:border-[#7DD3FC]",
    accentColor: "text-sky-300",
    buttonGradient: "bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#38BDF8] hover:to-[#0284C7] text-white shadow-sky-950/40",
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
    title: "Volume 1: Statutory Bare Act Codex & Case Bank",
    badge: "📚 BARE ACT CODEX",
    category: "Bare Act & Precedent Repository",
    examBody: "ICAI & ICSI",
    subtitle: "Complete statutory codex with landmark Supreme Court & High Court precedent rulings and trap-avoidance notes.",
    coverImage: "/covers/vol1-codex.webp",
    price: 99,
    originalPrice: 249,
    discount: "60% OFF",
    savings: "Save ₹150",
    highlights: [
      "180+ pages of simplified bare-act wordings & visual section flowcharts",
      "Landmark rulings: Balfour v. Balfour, Carlill, Salomon, Chinnaya",
      "Section-by-section exam answer templates for maximum score",
    ],
    bannerGradient: "from-[#7C2D12] via-[#9A3412] to-[#C2410C]",
    borderTheme: "border-[#FB923C]/40 hover:border-[#FDBA74]",
    accentColor: "text-orange-200",
    buttonGradient: "bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#F97316] hover:to-[#EA580C] text-white shadow-orange-950/40",
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
    title: "Volume 2: Management Theories & Corporate Environment",
    badge: "💼 MANAGEMENT MASTER",
    category: "Management, CSR & Corporate Ethics",
    examBody: "ICSI CSEET",
    subtitle: "In-depth study codex for Henri Fayol, F.W. Taylor, PESTLE analysis, Corporate Social Responsibility & Ethics.",
    coverImage: "/covers/vol2-codex.webp",
    price: 99,
    originalPrice: 249,
    discount: "60% OFF",
    savings: "Save ₹150",
    highlights: [
      "Complete 14 Principles of Fayol & Taylor Scientific Management",
      "Business environment models, Corporate Governance & CSR",
      "Chapter-wise conceptual MCQs with detailed explanations for options",
    ],
    bannerGradient: "from-[#14532D] via-[#166534] to-[#15803D]",
    borderTheme: "border-[#4ADE80]/40 hover:border-[#86EFAC]",
    accentColor: "text-emerald-200",
    buttonGradient: "bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#22C55E] hover:to-[#16A34A] text-white shadow-emerald-950/40",
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
  {
    id: "prod-cases-vault",
    courseType: "volume",
    title: "High-Yield Practical Case Studies Bank (250+ Scenarios)",
    badge: "🎯 EXAM SCENARIOS & ANSWER RUBRICS",
    category: "Exam Scoring Bank",
    examBody: "ICAI Exam Standard",
    subtitle: "250+ application-based practical cases with step-by-step model answers and ICAI marking rubrics.",
    coverImage: "/assets/ca-cs-hero-books-sharp.png",
    price: 79,
    originalPrice: 199,
    discount: "60% OFF",
    savings: "Save ₹120",
    highlights: [
      "Monster Monday, Midweek Madness & Final Boss Friday problems",
      "Section 73 damages & Section 16 implied conditions trap cases",
      "Model answer drafting rubrics that examiners award full marks for",
    ],
    bannerGradient: "from-[#881337] via-[#9F1239] to-[#BE123C]",
    borderTheme: "border-[#FB7185]/40 hover:border-[#FDA4AF]",
    accentColor: "text-rose-200",
    buttonGradient: "bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:from-[#F43F5E] hover:to-[#E11D48] text-white shadow-rose-950/40",
    validityTag: "250+ Cases • Exam Scoring Vault",
    cartPayload: {
      id: "prod-cases-vault",
      title: "High-Yield Practical Case Studies Bank (250+ Scenarios)",
      price: 79,
      originalPrice: 199,
      category: "Question Bank",
      badge: "250+ Cases • Solved",
    },
  },
  {
    id: "prod-mcq-simulator",
    courseType: "cs",
    title: "CSEET 30-Question Live MCQ Timed Mock Simulator",
    badge: "⏱️ LIVE MOCK SIMULATOR",
    category: "Timed Practice Series",
    examBody: "ICSI CSEET Pattern",
    subtitle: "Full-length timed MCQ mock drills with instant negative marking calculation and platform rankings.",
    coverImage: "/images/foundation_testseries_card.webp",
    price: 49,
    originalPrice: 149,
    discount: "67% OFF",
    savings: "Save ₹100",
    highlights: [
      "Real-time countdown timer simulating actual ICSI exam software",
      "Instant percentile score, question-by-question rationale analysis",
      "Leaderboard ranking against thousands of peers across India",
    ],
    bannerGradient: "from-[#1E1B4B] via-[#312E81] to-[#4338CA]",
    borderTheme: "border-[#818CF8]/40 hover:border-[#A5B4FC]",
    accentColor: "text-indigo-200",
    buttonGradient: "bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:from-[#818CF8] hover:to-[#6366F1] text-white shadow-indigo-950/40",
    validityTag: "Live Simulator • Mock Tests",
    cartPayload: {
      id: "prod-mcq-simulator",
      title: "CSEET 30-Question Live MCQ Timed Mock Simulator",
      price: 49,
      originalPrice: 149,
      category: "Mock Test Series",
      badge: "ICSI Pattern • Timed",
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
  iconType: "yellow" | "dark" | "blue" | "emerald";
  iconEmoji: string;
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
  onOpenPdf: (url: string, title: string, subtitle?: string, courseType?: "ca" | "cs", isFreeSample?: boolean) => void;
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

export interface FreeResourceItem {
  id: string;
  actName: string;
  unitNumber: number;
  title: string;
  subtitle: string;
  badge: string;
  pages: string;
  pdfUrl: string;
  courseType: "ca" | "cs";
  gradient: string;
  borderTheme: string;
  accentBadge: string;
}

export const FREE_STUDY_RESOURCES: FreeResourceItem[] = [
  {
    id: "free-soga-1",
    actName: "The Sale of Goods Act, 1930",
    unitNumber: 1,
    title: "Unit 1: Formation of Contract of Sale & Subject Matter",
    subtitle: "Sale vs Agreement to Sell, Ascertained vs Unascertained Goods & Formalities",
    badge: "🎁 FREE STUDY RESOURCE",
    pages: "12 Pages",
    pdfUrl: "/notes/sale-of-goods-unit-1.pdf",
    courseType: "ca",
    gradient: "from-[#F0FDF4] via-white to-white",
    borderTheme: "border-[#BBF7D0] hover:border-[#16A34A]",
    accentBadge: "bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]",
  },
  {
    id: "free-soga-2",
    actName: "The Sale of Goods Act, 1930",
    unitNumber: 2,
    title: "Unit 2: Conditions and Warranties (Sec 11-17)",
    subtitle: "Stipulations, Implied Conditions of Fitness & Landmark Case Priest v. Last",
    badge: "🎁 FREE STUDY RESOURCE",
    pages: "10 Pages",
    pdfUrl: "/notes/sale-of-goods-unit-2.pdf",
    courseType: "ca",
    gradient: "from-[#F0FDFA] via-white to-white",
    borderTheme: "border-[#99F6E4] hover:border-[#0D9488]",
    accentBadge: "bg-[#CCFBF1] text-[#0F766E] border-[#5EEAD4]",
  },
  {
    id: "free-partner-1",
    actName: "The Indian Partnership Act, 1932",
    unitNumber: 1,
    title: "Unit 1: General Nature of Partnership",
    subtitle: "Definition, Mutual Agency, True Test of Partnership (Cox v. Hickman)",
    badge: "🎁 FREE STUDY RESOURCE",
    pages: "24 Pages",
    pdfUrl: "/notes/unit-1-general-nature-of-partnership.pdf",
    courseType: "ca",
    gradient: "from-[#FFFBEB] via-white to-white",
    borderTheme: "border-[#FDE68A] hover:border-[#D97706]",
    accentBadge: "bg-[#FEF3C7] text-[#B45309] border-[#FCD34D]",
  },
  {
    id: "free-partner-2",
    actName: "The Indian Partnership Act, 1932",
    unitNumber: 2,
    title: "Unit 2: Relations of Partners",
    subtitle: "Rights, Duties, Implied Authority, Holding Out & Minor as Beneficiary",
    badge: "🎁 FREE STUDY RESOURCE",
    pages: "28 Pages",
    pdfUrl: "/notes/unit-2-relations-of-partners.pdf",
    courseType: "ca",
    gradient: "from-[#FAF5FF] via-white to-white",
    borderTheme: "border-[#E9D5FF] hover:border-[#7E22CE]",
    accentBadge: "bg-[#F3E8FF] text-[#7E22CE] border-[#D8B4FE]",
  },
  {
    id: "free-partner-3",
    actName: "The Indian Partnership Act, 1932",
    unitNumber: 3,
    title: "Unit 3: Registration & Dissolution of Firm",
    subtitle: "Section 69 Disabilities, Modes of Dissolution (Sec 40-44) & Account Settlement",
    badge: "🎁 FREE STUDY RESOURCE",
    pages: "32 Pages",
    pdfUrl: "/notes/unit-3-registration-and-dissolution-of-firm.pdf",
    courseType: "ca",
    gradient: "from-[#F0FDF4] via-white to-white",
    borderTheme: "border-[#BBF7D0] hover:border-[#16A34A]",
    accentBadge: "bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]",
  },
  {
    id: "free-partner-ldr",
    actName: "The Indian Partnership Act, 1932",
    unitNumber: 4,
    title: "Partnership Act: LDR Revision Flowcharts & Matrix",
    subtitle: "High-speed visual recall aids for the final 36 hours before your examination",
    badge: "🗺️ LDR FLOWCHARTS",
    pages: "18 Pages",
    pdfUrl: "/notes/partnership-ldr-charts.pdf",
    courseType: "ca",
    gradient: "from-[#EFF6FF] via-white to-white",
    borderTheme: "border-[#BFDBFE] hover:border-[#2563EB]",
    accentBadge: "bg-[#DBEAFE] text-[#1D4ED8] border-[#93C5FD]",
  },
  {
    id: "free-partner-infographics",
    actName: "The Indian Partnership Act, 1932",
    unitNumber: 5,
    title: "Partnership Act: Visual Infographics Deck",
    subtitle: "High-retention infographics on Mutual Agency, Minor Beneficiary & Dissolution",
    badge: "🎨 VISUAL INFOGRAPHICS",
    pages: "12 Posters",
    pdfUrl: "/notes/partnership-infographics.pdf",
    courseType: "ca",
    gradient: "from-[#FAF5FF] via-white to-white",
    borderTheme: "border-[#E9D5FF] hover:border-[#9333EA]",
    accentBadge: "bg-[#F3E8FF] text-[#7E22CE] border-[#D8B4FE]",
  },
  {
    id: "free-partner-practice",
    actName: "The Indian Partnership Act, 1932",
    unitNumber: 6,
    title: "Partnership Act: Practice Questions & Problem Drills",
    subtitle: "ICAI pattern chapter-wise questions with step-by-step model legal answers",
    badge: "📝 PRACTICE QUESTIONS",
    pages: "25 Pages",
    pdfUrl: "/notes/indian-partnership-act-practice-questions.pdf",
    courseType: "ca",
    gradient: "from-[#FFF7ED] via-white to-white",
    borderTheme: "border-[#FFEDD5] hover:border-[#EA580C]",
    accentBadge: "bg-[#FFEDD5] text-[#C2410C] border-[#FDBA74]",
  },
  {
    id: "free-partner-qbank",
    actName: "The Indian Partnership Act, 1932",
    unitNumber: 7,
    title: "Smart Revision Question Bank (Part 1)",
    subtitle: "Exhaustive application scenarios, case-based questions & model test papers",
    badge: "📚 QUESTION BANK",
    pages: "65+ Pages",
    pdfUrl: "/notes/smart-revision-question-bank-part-1.pdf",
    courseType: "ca",
    gradient: "from-[#FEF2F2] via-white to-white",
    borderTheme: "border-[#FECACA] hover:border-[#DC2626]",
    accentBadge: "bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5]",
  },
  {
    id: "free-partner-paper-analysis",
    actName: "The Indian Partnership Act, 1932",
    unitNumber: 8,
    title: "September 2026 Examination Paper Analysis",
    subtitle: "Provision mapping, examiner keyword checklist & suggested solutions",
    badge: "📊 EXAM PAPER ANALYSIS",
    pages: "16 Pages",
    pdfUrl: "/notes/september-2026-paper-analysis.pdf",
    courseType: "ca",
    gradient: "from-[#F0FDF4] via-white to-white",
    borderTheme: "border-[#DCFCE7] hover:border-[#16A34A]",
    accentBadge: "bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]",
  },
];

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
  isFree?: boolean;
}

const RECOMMENDED_COURSES: RecommendedCourseItem[] = [
  {
    num: "1",
    courseType: "ca",
    title: "The Sale of Goods Act, 1930 Masterclass",
    subtitle: "Formation of contract of sale, goods classification, conditions & warranties",
    duration: "2 Units • 22 Pages",
    streamLabel: "ICAI CA Foundation",
    icon: Scale,
    iconBg: "bg-[#7E22CE]",
    pdfUrl: "/notes/sale-of-goods-unit-1.pdf",
    isFree: true,
  },
  {
    num: "2",
    courseType: "ca",
    title: "Conditions & Warranties Codex (Sec 11-17)",
    subtitle: "Implied conditions of fitness, Priest v. Last, Caveat Emptor & landmark case law",
    duration: "Unit 2 • 10 Pages",
    streamLabel: "ICAI CA Foundation",
    icon: Landmark,
    iconBg: "bg-[#0F172A]",
    pdfUrl: "/notes/sale-of-goods-unit-2.pdf",
    isFree: true,
  },
  {
    num: "3",
    courseType: "cs",
    title: "CSEET Management & Corporate Governance",
    subtitle: "Henri Fayol's 14 principles, Taylor's scientific management & CSR ethics framework",
    duration: "8 Units • 120 Pages",
    streamLabel: "ICSI CSEET",
    icon: GraduationCap,
    iconBg: "bg-[#0284C7]",
    pdfUrl: "/notes/cseet-management-full.pdf",
    isFree: false,
  },
];

export function StudentDashboardHome({
  studentName = "Student",
  streak = 0,
  longestStreak = 0,
  lawXp = 0,
  levelInfo = {
    level: 1,
    title: "Legal Intern",
    badge: "🥉 Intern",
    nextXp: 100,
    minXp: 0,
    progress: 0,
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
  const freeNotesCarouselRef = useRef<HTMLDivElement>(null);
  const quizSectionRef = useRef<HTMLDivElement>(null);
  const [promoSlideIndex, setPromoSlideIndex] = useState(0);
  const [isReconciling, setIsReconciling] = useState(false);

  const handleReconcileAccess = async () => {
    try {
      setIsReconciling(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("lawkaksha_token") || localStorage.getItem("token") : null;
      if (!token) {
        alert("Please login first to check your payment status.");
        return;
      }
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/api/orders/reconcile-my-access`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || "Payment reconciliation complete.");
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      } else {
        alert(data.message || "No pending payment found to restore.");
      }
    } catch (e: any) {
      alert("Error checking access status: " + e.message);
    } finally {
      setIsReconciling(false);
    }
  };

  // Dynamic enrolled courses strictly reflecting student's subscribed stream
  const dynamicCourses: EnrolledCourseItem[] = useMemo(() => {
    const list: EnrolledCourseItem[] = [];

    // Show CA Foundation if student subscribed to CA or dual access, or active in CA
    if (isCaUnlocked || (!isCsUnlocked && activeCourse === "ca")) {
      list.push({
        id: "ca-foundation-course",
        courseType: "ca",
        title: "CA Foundation Business Laws Codex",
        category: "ICAI Paper 2 • 7 Chapters",
        enrolledDate: `Active ${new Date().getFullYear()} Batch • ICAI`,
        progress: isCaUnlocked ? Math.min(100, Math.max(0, completedUnitsCount * 14)) : 0,
        pdfUrl: "/notes/sale-of-goods-unit-1.pdf",
        iconBg: "from-[#F59E0B] via-[#D97706] to-[#B45309]",
        iconType: "yellow",
        iconEmoji: "⚖️",
        isUnlocked: Boolean(isCaUnlocked),
        price: 99,
      });
    }

    // Show CSEET if student subscribed to CSEET or dual access, or active in CS
    if (isCsUnlocked || (!isCaUnlocked && activeCourse === "cs")) {
      list.push({
        id: "cseet-course",
        courseType: "cs",
        title: "CSEET Legal Aptitude & Management",
        category: "ICSI Paper 2 • 8 Units",
        enrolledDate: `Active ${new Date().getFullYear()} Batch • ICSI`,
        progress: isCsUnlocked ? Math.min(100, Math.max(0, completedUnitsCount * 12)) : 0,
        pdfUrl: "/notes/cseet-management-full.pdf",
        iconBg: "from-[#1E293B] to-[#0F172A]",
        iconType: "dark",
        iconEmoji: "📜",
        isUnlocked: Boolean(isCsUnlocked),
        price: 99,
      });
    }

    // Shared Study Vaults
    list.push({
      id: "cases-course",
      courseType: "shared",
      title: "Landmark Case Laws & Solved Precedents",
      category: activeCourse === "ca" ? "ICAI Problem Vault" : "ICSI Problem Vault",
      enrolledDate: `Active ${new Date().getFullYear()} Batch`,
      progress: (isCaUnlocked || isCsUnlocked) ? Math.min(100, completedUnitsCount * 10) : 0,
      pdfUrl: "/notes/sale-of-goods-unit-2.pdf",
      iconBg: "from-[#3B0764] to-[#1E1B4B]",
      iconType: "blue",
      iconEmoji: "🏛️",
      isUnlocked: Boolean(isCaUnlocked || isCsUnlocked),
      price: 99,
    });

    list.push({
      id: "mcq-simulator-course",
      courseType: "shared",
      title: "Timed MCQ Mock Test Simulators",
      category: activeCourse === "ca" ? "ICAI Pattern Test Series" : "ICSI Pattern Test Series",
      enrolledDate: `Active ${new Date().getFullYear()} Batch`,
      progress: (isCaUnlocked || isCsUnlocked) ? Math.min(100, completedUnitsCount * 10) : 0,
      pdfUrl: "/notes/sale-of-goods-unit-1.pdf",
      iconBg: "from-[#047857] to-[#064E3B]",
      iconType: "emerald",
      iconEmoji: "🎯",
      isUnlocked: Boolean(isCaUnlocked || isCsUnlocked),
      price: 49,
    });

    return list;
  }, [isCaUnlocked, isCsUnlocked, activeCourse, completedUnitsCount]);

  const [courses, setCourses] = useState<EnrolledCourseItem[]>(dynamicCourses);

  useEffect(() => {
    setCourses(dynamicCourses);
  }, [dynamicCourses]);

  // Helper to determine if a course / codex / pass is already owned or subscribed to by the student
  const isResourceOwned = useCallback(
    (resource: ShowcaseResourceItem): boolean => {
      if (isAllAccessUnlocked) return true;

      if (resource.courseType === "all-access" || resource.id === "prod-combo") {
        return Boolean(
          (isCaUnlocked && isCsUnlocked) ||
          purchasedBooks.includes("prod-combo") ||
          purchasedBooks.includes("all-access")
        );
      }

      if (resource.courseType === "ca" || resource.id === "course-ca-foundation-sub") {
        return Boolean(
          isCaUnlocked ||
          purchasedBooks.includes("course-ca-foundation-sub") ||
          purchasedBooks.includes("ca-foundation") ||
          purchasedBooks.includes("ca-foundation-business-laws") ||
          purchasedBooks.includes("prod-combo") ||
          purchasedBooks.includes("all-access")
        );
      }

      if (resource.courseType === "cs" || resource.id === "course-cseet-sub") {
        return Boolean(
          isCsUnlocked ||
          purchasedBooks.includes("course-cseet-sub") ||
          purchasedBooks.includes("cseet") ||
          purchasedBooks.includes("cseet-business-law") ||
          purchasedBooks.includes("cseet-management") ||
          purchasedBooks.includes("prod-combo") ||
          purchasedBooks.includes("all-access")
        );
      }

      if (resource.id === "prod-vol1") {
        return Boolean(
          isCaUnlocked ||
          purchasedBooks.includes("prod-vol1") ||
          purchasedBooks.includes("book-vol-1") ||
          purchasedBooks.includes("ca-book-vol-1") ||
          purchasedBooks.includes("course-ca-foundation-sub") ||
          purchasedBooks.includes("all-access")
        );
      }

      if (resource.id === "prod-vol2") {
        return Boolean(
          isCsUnlocked ||
          purchasedBooks.includes("prod-vol2") ||
          purchasedBooks.includes("book-vol-2") ||
          purchasedBooks.includes("ca-book-vol-2") ||
          purchasedBooks.includes("course-cseet-sub") ||
          purchasedBooks.includes("all-access")
        );
      }

      if (resource.id === "prod-cases-vault") {
        return Boolean(
          purchasedBooks.includes("prod-cases-vault") ||
          purchasedBooks.includes("book-ldr") ||
          purchasedBooks.includes("cases-course") ||
          (isCaUnlocked && isCsUnlocked)
        );
      }

      if (resource.id === "prod-mcq-simulator") {
        return Boolean(
          purchasedBooks.includes("prod-mcq-simulator") ||
          purchasedBooks.includes("book-mcq") ||
          purchasedBooks.includes("mcq-simulator-course") ||
          isCsUnlocked
        );
      }

      return Boolean(
        purchasedBooks.includes(resource.id) ||
        (resource.cartPayload && purchasedBooks.includes(resource.cartPayload.id))
      );
    },
    [isCaUnlocked, isCsUnlocked, isAllAccessUnlocked, purchasedBooks]
  );

  // ONLY show courses/passes that the student HAS NOT subscribed to yet
  const unsubscribedShowcaseResources = useMemo(() => {
    return SHOWCASE_RESOURCES.filter((resource) => !isResourceOwned(resource));
  }, [isResourceOwned]);

  const [isHovered, setIsHovered] = useState(false);

  // Live Auto-Scroll timer (fast 2.2s auto-advance, paused on hover/touch)
  useEffect(() => {
    if (isHovered || unsubscribedShowcaseResources.length <= 1) return;

    const interval = setInterval(() => {
      if (promoCarouselRef.current) {
        const container = promoCarouselRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        // Dynamically compute exact card width + gap for pixel-perfect slide alignment
        const firstCard = container.querySelector<HTMLElement>(":scope > div");
        const cardStep = firstCard
          ? firstCard.offsetWidth + 16
          : container.clientWidth >= 640
          ? 480
          : 300;

        const nextScroll = container.scrollLeft + cardStep;
        if (nextScroll >= maxScroll - 15) {
          container.scrollTo({ left: 0, behavior: "smooth" });
          setPromoSlideIndex(0);
        } else {
          container.scrollTo({ left: nextScroll, behavior: "smooth" });
          const newIdx = Math.round(nextScroll / cardStep);
          setPromoSlideIndex(Math.min(newIdx, unsubscribedShowcaseResources.length - 1));
        }
      }
    }, 2200);

    return () => clearInterval(interval);
  }, [isHovered, unsubscribedShowcaseResources.length]);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const firstCard = container.querySelector<HTMLElement>(":scope > div");
      const offset = (firstCard ? firstCard.offsetWidth + 16 : 300) * (direction === "left" ? -1 : 1);
      carouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const scrollFreeNotes = (direction: "left" | "right") => {
    if (freeNotesCarouselRef.current) {
      const container = freeNotesCarouselRef.current;
      const offset = 290 * (direction === "left" ? -1 : 1);
      container.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const scrollPromoCarousel = (direction: "left" | "right") => {
    if (promoCarouselRef.current) {
      const container = promoCarouselRef.current;
      const firstCard = container.querySelector<HTMLElement>(":scope > div");
      const cardStep = firstCard
        ? firstCard.offsetWidth + 16
        : container.clientWidth >= 640
        ? 480
        : 300;
      const offset = direction === "left" ? -cardStep : cardStep;
      promoCarouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const scrollToPromoSlide = (idx: number) => {
    if (promoCarouselRef.current) {
      const container = promoCarouselRef.current;
      const firstCard = container.querySelector<HTMLElement>(":scope > div");
      const cardStep = firstCard
        ? firstCard.offsetWidth + 16
        : container.clientWidth >= 640
        ? 480
        : 300;
      container.scrollTo({ left: idx * cardStep, behavior: "smooth" });
      setPromoSlideIndex(idx);
    }
  };

  const handlePromoScroll = () => {
    if (promoCarouselRef.current) {
      const container = promoCarouselRef.current;
      const scrollLeft = container.scrollLeft;
      const firstCard = container.querySelector<HTMLElement>(":scope > div");
      const cardStep = firstCard
        ? firstCard.offsetWidth + 16
        : container.clientWidth >= 640
        ? 480
        : 300;
      const index = Math.round(scrollLeft / cardStep);
      setPromoSlideIndex(Math.max(0, Math.min(index, unsubscribedShowcaseResources.length - 1)));
    }
  };

  // Direct In-Dashboard Buy Action: adds product to cart and immediately triggers instant checkout
  const handleBuyItem = (course: ShowcaseResourceItem) => {
    const itemToBuy = course.cartPayload || {
      id: course.id,
      title: course.title,
      price: course.price,
      originalPrice: course.originalPrice,
      category: course.category,
      badge: course.badge,
    };

    addToCart({
      id: itemToBuy.id,
      title: itemToBuy.title,
      format: "pdf",
      price: itemToBuy.price,
      originalPrice: itemToBuy.originalPrice,
      category: itemToBuy.category,
      badge: itemToBuy.badge,
    });
    setIsCartOpen(true);
    setCheckoutStep("details");
  };

  const toggleFavorite = (id: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const studentCourseList: StudentCourseProgressItem[] = useMemo(() => {
    if (activeCourse === "cs") {
      return [
        {
          id: "cs-u1",
          name: "Indian Contract Act, 1872",
          code: "Unit 1",
          weightage: "15 - 20 M",
          description: "Essentials of Contract, Offer & Acceptance",
          totalLessons: 4,
          completedLessons: isCsUnlocked ? Math.min(4, Math.max(1, completedUnitsCount)) : 1,
          progressPercent: isCsUnlocked ? 65 : 25,
          pdfUrl: "/notes/sale-of-goods-unit-1.pdf",
          isUnlocked: Boolean(isCsUnlocked),
          category: "cs",
        },
        {
          id: "cs-u2",
          name: "Sale of Goods Act, 1930",
          code: "Unit 2",
          weightage: "10 - 15 M",
          description: "Contract of Sale, Conditions & Warranties",
          totalLessons: 3,
          completedLessons: isCsUnlocked ? 2 : 1,
          progressPercent: isCsUnlocked ? 50 : 20,
          pdfUrl: "/notes/sale-of-goods-unit-2.pdf",
          isUnlocked: Boolean(isCsUnlocked),
          category: "cs",
        },
        {
          id: "cs-u7",
          name: "General Principles of Management",
          code: "Unit 7",
          weightage: "15 - 20 M",
          description: "Henri Fayol 14 Principles, Scientific Management",
          totalLessons: 8,
          completedLessons: isCsUnlocked ? 6 : 2,
          progressPercent: isCsUnlocked ? 75 : 25,
          pdfUrl: "/notes/cseet-management-full.pdf",
          isUnlocked: Boolean(isCsUnlocked),
          category: "cs",
        },
      ];
    }

    return [
      {
        id: "ca-ch2",
        name: "The Indian Contract Act, 1872",
        code: "Chapter 2",
        weightage: "20 - 25 M",
        description: "Nature of Contracts, Offer & Acceptance, Consideration",
        totalLessons: 12,
        completedLessons: isCaUnlocked ? 8 : 4,
        progressPercent: isCaUnlocked ? 65 : 30,
        pdfUrl: "/notes/sale-of-goods-unit-1.pdf",
        isUnlocked: Boolean(isCaUnlocked),
        category: "ca",
      },
      {
        id: "ca-ch6",
        name: "The Companies Act, 2013",
        code: "Chapter 6",
        weightage: "15 - 20 M",
        description: "Meaning & Characteristics, Corporate Veil, MOA & AOA",
        totalLessons: 12,
        completedLessons: isCaUnlocked ? 5 : 2,
        progressPercent: isCaUnlocked ? 40 : 15,
        pdfUrl: "/notes/sale-of-goods-unit-2.pdf",
        isUnlocked: Boolean(isCaUnlocked),
        category: "ca",
      },
      {
        id: "ca-ch3",
        name: "The Sale of Goods Act, 1930",
        code: "Chapter 3",
        weightage: "15 - 20 M",
        description: "Formation of Contract of Sale, Conditions & Warranties",
        totalLessons: 12,
        completedLessons: isCaUnlocked ? 3 : 1,
        progressPercent: isCaUnlocked ? 25 : 10,
        pdfUrl: "/notes/sale-of-goods-unit-1.pdf",
        isUnlocked: true,
        category: "ca",
      },
      {
        id: "ca-ch4",
        name: "The Indian Partnership Act, 1932",
        code: "Chapter 4",
        weightage: "15 - 20 M",
        description: "General Nature, Relations of Partners, Registration & Dissolution",
        totalLessons: 10,
        completedLessons: isCaUnlocked ? 8 : 3,
        progressPercent: isCaUnlocked ? 80 : 30,
        pdfUrl: "/notes/unit-1-general-nature-of-partnership.pdf",
        isUnlocked: true,
        category: "ca",
      },
    ];
  }, [activeCourse, isCaUnlocked, isCsUnlocked, completedUnitsCount]);

  const handleContinueLearning = () => {
    const targetPdf = activeCourse === "ca" 
      ? "/notes/sale-of-goods-unit-1.pdf" 
      : "/notes/cseet-management-full.pdf";
    const targetTitle = activeCourse === "ca"
      ? "The Indian Contract Act, 1872"
      : "CSEET Management & Corporate Governance";
    onOpenPdf(targetPdf, targetTitle, "Unit 1: Formation of Contract", activeCourse, true);
  };

  const handleOpenStudentCourse = (courseItem: StudentCourseProgressItem) => {
    if (courseItem.isUnlocked) {
      onOpenPdf(courseItem.pdfUrl, courseItem.name, courseItem.code, courseItem.category, true);
    } else {
      if (onBuyCourse) {
        onBuyCourse(courseItem.category);
      }
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7 text-[#13264F] select-none font-sans relative">
      {/* ========================================================================= */}
      {/* 1. HERO GREETING CARD (MATCHING SVG PHONE 1 EXACT THEME & VECTOR ART)     */}
      {/* ========================================================================= */}
      <StudentHeroCard
        studentName={studentName}
        lastReadTitle={activeCourse === "ca" ? "The Indian Contract Act, 1872" : "General Principles of Management"}
        lastReadSubtitle={activeCourse === "ca" ? "Unit 1: Essentials of Valid Contract" : "Unit 7: Henri Fayol 14 Principles"}
        onContinueLearning={handleContinueLearning}
      />

      {/* ========================================================================= */}
      {/* 2. THREE STAT CARDS (COURSES, LESSONS, CERTIFICATES - SVG EXACT DESIGN)    */}
      {/* ========================================================================= */}
      <StudentMetricStats
        coursesCount={activeCourse === "ca" ? 7 : 8}
        lessonsCount={activeCourse === "ca" ? 15 : 12}
        certificatesCount={2}
        onViewCourses={() => onExploreCourse && onExploreCourse("ca-foundation")}
        onViewLessons={() => onExploreCourse && onExploreCourse("ca-foundation")}
        onViewCertificates={() => onExploreCourse && onExploreCourse("ca-foundation")}
      />

      {/* ========================================================================= */}
      {/* 3. MY COURSES SECTION (SEARCH, FILTERS, PROGRESS BARS MATCHING SVG)        */}
      {/* ========================================================================= */}
      <section className="space-y-3.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h3 className="text-lg sm:text-xl font-extrabold text-[#13264F] tracking-tight">
            My Courses
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReconcileAccess}
              disabled={isReconciling}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-700 shadow-xs cursor-pointer transition-colors"
              title="Click here if you completed payment but cannot access course material"
            >
              <RefreshCw className={`w-3 h-3 text-slate-500 ${isReconciling ? "animate-spin" : ""}`} />
              <span>{isReconciling ? "Checking Access..." : "I paid but can't access"}</span>
            </button>
            <button
              onClick={() => onExploreCourse && onExploreCourse("ca-foundation")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#3558E8] hover:underline cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <StudentMyCoursesList
          courses={studentCourseList}
          onOpenCourse={handleOpenStudentCourse}
          showSearchAndFilters={true}
        />
      </section>

      {/* ========================================================================= */}
      {/* 4. LIVE FAST AUTO-SCROLLING RESOURCE & MASTER PASS MARKETING CAROUSEL      */}
      {/* ========================================================================= */}
      {unsubscribedShowcaseResources.length === 0 ? (
        <section className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#31104B] border border-[#A855F7]/30 p-4 sm:p-6 text-white shadow-md relative overflow-hidden group">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#A855F7]/15 blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#9333EA]/20 border border-[#C084FC]/40 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                🎓
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>All Curriculum Passes Unlocked</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  You Have Full Access to All Master Codices &amp; Courses!
                </h3>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  All statutory bare act codices, CA Foundation &amp; CSEET curriculum materials, case study question banks, and timed mock simulators are active in your student dashboard.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                if (onOpenPdf) {
                  onOpenPdf("/notes/sale-of-goods-unit-1.pdf", "Volume 1: Statutory Bare Act Codex", "Bare Act Codex", "ca", false);
                } else if (onExploreCourse) {
                  onExploreCourse("ca");
                }
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shrink-0 shadow-md cursor-pointer active:scale-98"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Study In Codex Reader</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      ) : (
        <section
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          className="space-y-3 bg-gradient-to-b from-[#FAF5FF]/80 via-white to-white rounded-2xl sm:rounded-3xl border border-[#EDE9FE] p-3 sm:p-5 shadow-xs relative group/showcase"
        >
          {/* Header Row: Live Pulse Indicator, Title & Navigation Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
            <div className="space-y-0.5 sm:space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-[#F3E8FF] text-[#7E22CE] border border-[#DDD6FE]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9333EA] animate-ping" />
                  <span className="hidden xs:inline">Available Master Passes &amp; Codices</span>
                  <span className="xs:hidden">Available Passes</span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#6B7280]">
                  {isHovered ? "Paused" : "Auto-scrolling"}
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-[#7E22CE] bg-[#F3E8FF] px-2 py-0.5 rounded-full">
                  {unsubscribedShowcaseResources.length} Unsubscribed
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-[#1F2937] tracking-tight">
                Curriculum Codices &amp; Master Passes
              </h2>
              <p className="text-[11px] sm:text-xs text-[#6B7280] max-w-2xl leading-relaxed hidden xs:block">
                Directly unlock statutory codices, case study question banks &amp; timed mock test passes into your student dashboard.
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <Link
                href="/courses"
                className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-[#7E22CE] hover:text-[#581C87] px-3 py-1.5 rounded-full hover:bg-[#F3E8FF]/60 transition-colors"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              {/* Carousel Prev/Next Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollPromoCarousel("left")}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D1D5DB] bg-white hover:bg-[#F3E8FF] hover:border-[#7E22CE] text-[#4B5563] hover:text-[#7E22CE] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                  aria-label="Previous Item"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => scrollPromoCarousel("right")}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D1D5DB] bg-white hover:bg-[#F3E8FF] hover:border-[#7E22CE] text-[#4B5563] hover:text-[#7E22CE] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                  aria-label="Next Item"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Smooth Horizontal Carousel Track: Unsubscribed Items Only */}
          <div
            ref={promoCarouselRef}
            onScroll={handlePromoScroll}
            className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto pb-2 pt-0.5 scroll-smooth snap-x snap-mandatory no-scrollbar touch-pan-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {unsubscribedShowcaseResources.map((resource) => (
              <div
                key={resource.id}
                className={`w-[86vw] xs:w-[350px] sm:w-[460px] lg:w-[490px] max-w-[500px] shrink-0 snap-start flex flex-row items-stretch gap-2.5 xs:gap-3 sm:gap-4 justify-between rounded-2xl sm:rounded-3xl bg-gradient-to-br ${resource.bannerGradient} border ${resource.borderTheme} p-3 sm:p-4 text-white shadow-xs hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
              >
                {/* Decorative Subtle Background Radial Glow */}
                <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

                {/* Left Column: 3D Book Cover Image Mockup */}
                <div className="relative w-24 xs:w-28 sm:w-36 md:w-40 self-stretch shrink-0 flex flex-col items-center justify-between rounded-xl sm:rounded-2xl bg-black/25 border border-white/10 p-2 sm:p-3 overflow-hidden shadow-inner group-hover:border-white/20 transition-all">
                  {/* Top discount / status tag */}
                  <div className="w-full flex items-center justify-between gap-1 z-10">
                    <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-amber-300 border border-amber-300/30">
                      {resource.discount}
                    </span>
                    <span className="text-[8px] xs:text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-amber-400 text-amber-950 shadow-2xs">
                      Unlock
                    </span>
                  </div>

                  {/* 3D Book Cover Image */}
                  <div className="relative w-16 xs:w-20 sm:w-28 md:w-32 h-24 xs:h-28 sm:h-36 md:h-40 my-1 sm:my-2 drop-shadow-2xl transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={resource.coverImage}
                      alt={resource.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 110px, 140px"
                    />
                  </div>

                  {/* Format tag */}
                  <span className="text-[8px] sm:text-[9px] font-bold text-white/70 uppercase tracking-wider z-10 text-center">
                    Digital Codex
                  </span>
                </div>

                {/* Right Column: Resource Details, Pricing & Direct Buy CTA */}
                <div className="flex-1 min-w-0 flex flex-col justify-between space-y-1.5 sm:space-y-3 relative z-10">
                  <div className="space-y-1 sm:space-y-1.5">
                    {/* Badge & Exam Category */}
                    <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-xs text-white border border-white/20 truncate max-w-full">
                        {resource.badge}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-semibold text-white/70 truncate hidden xs:inline">
                        {resource.examBody}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <h3 className="text-xs xs:text-sm sm:text-base font-black leading-snug text-white tracking-tight line-clamp-2">
                        {resource.title}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-white/80 line-clamp-1 sm:line-clamp-2 mt-0.5 leading-relaxed hidden xs:block">
                        {resource.subtitle}
                      </p>
                    </div>

                    {/* Highlights bullet list */}
                    <div className="space-y-0.5 sm:space-y-1 pt-0.5">
                      {resource.highlights.slice(0, 3).map((h, i) => (
                        <div
                          key={i}
                          className={`flex items-start gap-1 sm:gap-1.5 text-[9px] xs:text-[10px] sm:text-[11px] text-white/90 font-medium leading-tight ${i >= 2 ? "hidden sm:flex" : ""}`}
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-300 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom: Price row & Direct Buy CTA */}
                  <div className="space-y-1.5 sm:space-y-2 pt-1 sm:pt-2 border-t border-white/15">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1 sm:gap-1.5">
                        <span className="text-base sm:text-2xl font-black text-white">
                          ₹{resource.price}
                        </span>
                        <span className="text-[10px] sm:text-xs text-white/60 line-through font-mono">
                          ₹{resource.originalPrice}
                        </span>
                        <span className="text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-400 text-amber-950 font-sans shadow-2xs">
                          {resource.savings}
                        </span>
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-medium text-white/70 hidden sm:inline">
                        {resource.validityTag}
                      </span>
                    </div>

                    {/* Direct Buy Button: Instant In-Dashboard Checkout */}
                    <div className="space-y-1 sm:space-y-1.5">
                      <button
                        onClick={() => handleBuyItem(resource)}
                        className={`w-full py-2 sm:py-2.5 px-3 rounded-lg sm:rounded-xl ${resource.buttonGradient} font-black text-[11px] sm:text-xs transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 shadow-md hover:shadow-lg`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                        <span className="truncate">Buy Now • ₹{resource.price}</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform group-hover:translate-x-1" />
                      </button>

                      <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-white/70 px-0.5">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-300" />
                          <span>Instant Auto-Unlock</span>
                        </span>
                        <button
                          onClick={() => onExploreCourse && onExploreCourse(resource.courseType === "all-access" ? "all-access" : resource.courseType)}
                          className="hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
                        >
                          Syllabus &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Navigation Indicators with touch-friendly tap targets */}
          <div className="flex items-center justify-center gap-0.5 sm:gap-1 pt-0.5">
            {unsubscribedShowcaseResources.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToPromoSlide(idx)}
                className="p-1.5 sm:p-1 cursor-pointer flex items-center justify-center"
                aria-label={`Slide ${idx + 1}`}
              >
                <span
                  className={`h-1.5 rounded-full transition-all duration-200 block ${
                    promoSlideIndex === idx ? "w-5 sm:w-6 bg-[#7E22CE]" : "w-1.5 bg-[#DDD6FE] hover:bg-[#C084FC]"
                  }`}
                />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 2. FREE STUDY RESOURCES & SAMPLE NOTES (HORIZONTAL SCROLLABLE CAROUSEL)    */}
      {/* ========================================================================= */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Gift className="w-3 h-3 text-emerald-700" />
                <span>Free Study Resources</span>
              </span>
              <span className="text-[11px] font-semibold text-[#6B7280]">
                100% Free • Direct In-Web DRM Reader
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-[#1F2937] tracking-tight mt-1">
              Free Chapter Notes &amp; Statutory Samples
            </h3>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-xs text-[#6B7280] hidden md:block">
              Scroll to explore all 8 sample units
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollFreeNotes("left")}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D1D5DB] bg-white hover:bg-[#FAF5FF] hover:border-[#7E22CE] text-[#4B5563] hover:text-[#7E22CE] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                aria-label="Previous note"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollFreeNotes("right")}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D1D5DB] bg-white hover:bg-[#FAF5FF] hover:border-[#7E22CE] text-[#4B5563] hover:text-[#7E22CE] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                aria-label="Next note"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={freeNotesCarouselRef}
          className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth no-scrollbar snap-x touch-pan-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {FREE_STUDY_RESOURCES.map((res) => (
            <div
              key={res.id}
              className={`w-[260px] sm:w-[285px] shrink-0 snap-start rounded-2xl sm:rounded-3xl border ${res.borderTheme} bg-gradient-to-br ${res.gradient} p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border shadow-2xs ${res.accentBadge}`}>
                    {res.badge}
                  </span>
                  <span className="text-[10px] font-semibold text-[#6B7280] bg-white/80 px-2 py-0.5 rounded-md border border-gray-200">
                    {res.pages}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                    {res.actName}
                  </span>
                  <h4 className="text-sm font-bold text-[#1F2937] leading-snug group-hover:text-[#7E22CE] transition-colors mt-0.5 line-clamp-1">
                    {res.title}
                  </h4>
                  <p className="text-[11px] text-[#4B5563] mt-1 line-clamp-2 leading-relaxed">
                    {res.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>Free Full PDF</span>
                </span>

                <button
                  onClick={() => onOpenPdf(res.pdfUrl, res.actName, res.title, res.courseType, true)}
                  className="px-3 py-1.5 rounded-xl bg-[#7E22CE] hover:bg-[#6B21A8] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Note</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. RECOMMENDED FOR YOU (WATERMARK 1, 2, 3 COMPACT ROW)                    */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-black text-[#1F2937] tracking-tight">
            Recommended for You
          </h3>
          <span className="text-[11px] sm:text-xs text-[#6B7280]">Curated Study Material</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-3.5">
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
                  if (isItemUnlocked || item.isFree) {
                    onOpenPdf(
                      item.pdfUrl,
                      item.title,
                      item.subtitle,
                      item.courseType === "shared" ? activeCourse : item.courseType,
                      item.isFree
                    );
                  } else {
                    if (onBuyCourse) {
                      onBuyCourse(item.courseType === "shared" ? "all-access" : item.courseType);
                    } else {
                      onOpenPdf(
                        item.pdfUrl,
                        item.title,
                        item.subtitle,
                        item.courseType === "shared" ? activeCourse : item.courseType,
                        false
                      );
                    }
                  }
                }}
                className="relative bg-white rounded-2xl border border-[#E7E4E7] p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group overflow-hidden"
              >
                {/* Large Faint Watermark Number in Top-Right Corner */}
                <span className="absolute top-2 right-3 text-4xl font-black text-[#F3F4F6] select-none pointer-events-none group-hover:text-[#EDE9FE] transition-colors">
                  {item.num}
                </span>

                <div className="space-y-2 relative z-10 pr-4">
                  {/* Dark App Icon Square */}
                  <div
                    className={`w-9 h-9 rounded-xl ${item.iconBg} text-white flex items-center justify-center shadow-xs shrink-0`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#1F2937] group-hover:text-[#7E22CE] transition-colors leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[#6B7280] mt-0.5 leading-relaxed line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-2.5 mt-2 border-t border-[#F3F4F6] flex items-center justify-between text-xs text-[#6B7280] relative z-10">
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#4B5563]">
                    <BookOpen className="w-3 h-3 text-[#7E22CE]" />
                    <span>{item.duration}</span>
                  </span>
                  {isItemUnlocked || item.isFree ? (
                    <span className="text-[#7E22CE] font-bold text-xs group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      <span>{item.isFree ? "Free Read" : "Open"}</span>
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
        className="bg-white rounded-2xl sm:rounded-3xl border border-[#E7E4E7] p-4 sm:p-6 shadow-2xs space-y-3 sm:space-y-3.5"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-[#FEF3C7] text-[#D97706] flex items-center gap-1">
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#D97706]" />
              <span>Daily 1-Min Quiz (+15 Pts)</span>
            </span>
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-[#7E22CE]">ICAI / ICSI Pattern</span>
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
