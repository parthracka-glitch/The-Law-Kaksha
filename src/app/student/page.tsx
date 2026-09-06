"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  FileText,
  Award,
  Clock,
  CheckCircle2,
  TrendingUp,
  PlayCircle,
  Search,
  User,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Flame,
  Zap,
  Star,
  Check,
  Smartphone,
  Video,
  ExternalLink,
  BookMarked,
  Shield,
  Upload,
  Calendar,
  Lock,
  PlusCircle,
  ShoppingCart,
  CheckCircle,
} from "lucide-react";
import { LawKakshaLogo } from "@/components/LawKakshaLogo";
import { SecurePdfReaderModal } from "@/components/SecurePdfReaderModal";
import { MasterclassVideoModal, MasterclassLesson } from "@/components/MasterclassVideoModal";
import { MainsEvaluationDeskModal } from "@/components/MainsEvaluationDeskModal";

// Pre-configured Student Plans for Testing
interface StudentProfile {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  targetExam: string;
  activePlanTitle: string;
  unlockedItemIds: string[];
  streakDays: number;
  todayMinutes: number;
  todayGoalMinutes: number;
  examCountdownDays: number;
  avatarInitials: string;
}

const PRESET_PROFILES: StudentProfile[] = [
  {
    id: "STU-MCQ-ONLY",
    name: "Rohan Deshmukh",
    rollNumber: "CRO-0689421",
    email: "rohan.d@gmail.com",
    targetExam: "CA Intermediate Paper 2 (Nov'26)",
    activePlanTitle: "ICAI Case Scenarios & MCQ Question Bank (1,200+ Qs)",
    unlockedItemIds: ["book-mcq"],
    streakDays: 14,
    todayMinutes: 40,
    todayGoalMinutes: 45,
    examCountdownDays: 68,
    avatarInitials: "RD",
  },
  {
    id: "STU-NOTES-ONLY",
    name: "Ayushi Singhania",
    rollNumber: "NRO-0742190",
    email: "ayushi.singhania@outlook.com",
    targetExam: "CA Inter Group 1 (Sept'26)",
    activePlanTitle: "Volume 1 & Volume 2 Law Notes Master Set",
    unlockedItemIds: ["book-vol-1", "book-vol-2"],
    streakDays: 28,
    todayMinutes: 55,
    todayGoalMinutes: 60,
    examCountdownDays: 24,
    avatarInitials: "AS",
  },
  {
    id: "STU-ALL-ACCESS",
    name: "Tanvi Kulkarni",
    rollNumber: "WRO-0812455",
    email: "tanvi.kulkarni@gmail.com",
    targetExam: "CA Intermediate All-Access Batch",
    activePlanTitle: "Full All-Access Fellowship (Notes + MCQs + Classes + Tests)",
    unlockedItemIds: ["book-vol-1", "book-vol-2", "book-ldr", "book-mcq", "video-classes", "mains-evaluation"],
    streakDays: 9,
    todayMinutes: 30,
    todayGoalMinutes: 60,
    examCountdownDays: 95,
    avatarInitials: "TK",
  },
];

// All Catalog Study Items
interface CatalogItem {
  id: string;
  type: "book" | "video" | "evaluation";
  title: string;
  category: string;
  subtitle: string;
  pagesOrDuration: string;
  fileSize?: string;
  price: number;
  originalPrice: number;
  badge: string;
  description: string;
}

const ALL_CATALOG_ITEMS: CatalogItem[] = [
  {
    id: "book-mcq",
    type: "book",
    title: "ICAI Case Scenarios & 30-Mark MCQ Bank (1,200+ Qs)",
    category: "Objective Practice",
    subtitle: "Mandatory 30-mark section with detailed reasoning for each option.",
    pagesOrDuration: "260 Pages",
    fileSize: "12.6 MB",
    price: 249,
    originalPrice: 449,
    badge: "Practice Drill",
    description: "Includes chapter-wise ICAI case scenarios, negative marking tips, and MCA circular updates.",
  },
  {
    id: "book-vol-1",
    type: "book",
    title: "Volume 1: CA Corporate Law Master Codex (2026-2027)",
    category: "Primary Text",
    subtitle: "Companies Act 2013 (Sections 1 to 148) with full bare act synthesis.",
    pagesOrDuration: "540 Pages",
    fileSize: "19.2 MB",
    price: 399,
    originalPrice: 699,
    badge: "Primary Study Text",
    description: "Comprehensive textbook covering Companies Act, ROC circulars, and landmark NCLT/Supreme Court rulings.",
  },
  {
    id: "book-vol-2",
    type: "book",
    title: "Volume 2: Economic & Business Laws Solved Codex",
    category: "High-Yield Notes",
    subtitle: "General Clauses Act, Interpretation of Statutes & Foreign Contribution (FCRA).",
    pagesOrDuration: "480 Pages",
    fileSize: "16.8 MB",
    price: 349,
    originalPrice: 599,
    badge: "High-Yield Notes",
    description: "Master General Clauses Act principles, statutory presumption rules, and solved past-exam questions.",
  },
  {
    id: "book-ldr",
    type: "book",
    title: "1.5-Day Last Day Revision (LDR) Section Maps",
    category: "Exam-Eve Booster",
    subtitle: "Summary Flowcharts, Limit Tables & Penalty Code Tables for the last 36 hours.",
    pagesOrDuration: "180 Pages",
    fileSize: "10.4 MB",
    price: 199,
    originalPrice: 349,
    badge: "Quick Revision",
    description: "Condensed memory maps designed specifically for rapid retention before the CA examination day.",
  },
  {
    id: "video-classes",
    type: "video",
    title: "HD Video Masterclasses: Full Law Lecture Series",
    category: "Video Course",
    subtitle: "32 in-depth chapter masterclasses with timestamped notes and faculty drafting rubrics.",
    pagesOrDuration: "45+ Hours",
    price: 999,
    originalPrice: 1899,
    badge: "HD Video Course",
    description: "Watch CA/CS faculty break down tricky corporate law sections with real-world corporate boardroom examples.",
  },
  {
    id: "mains-evaluation",
    type: "evaluation",
    title: "1-on-1 Descriptive Test Series & Copy Checking Desk",
    category: "Mains Evaluation",
    subtitle: "Submit your handwritten answer sheets for 5-pillar faculty grading and audio feedback.",
    pagesOrDuration: "8 Full Test Papers",
    price: 699,
    originalPrice: 1299,
    badge: "Copy Evaluation",
    description: "Get detailed line-by-line checking of your law descriptive papers within 48 hours to boost scores to 70+.",
  },
];

// Video Masterclass Lessons
const MASTERCLASS_LESSONS: MasterclassLesson[] = [
  {
    id: "l-1",
    title: "Companies Act 2013: Section 96 to 103 (AGM, EGM & Quorum Rules)",
    duration: "48 Mins",
    faculty: "CA / CS Rahul Sharma Sir",
    summary:
      "Deep dive into AGM deadlines, ROC extension limitations, Section 103 public vs private company quorum calculation, and practical ICAI case scenarios.",
    keyTakeaways: [
      "First AGM 9-month rule with no ROC extension",
      "Quorum calculation without counting proxies",
      "Postal ballot mandatory items under Section 110",
    ],
    bareActRefs: ["Section 96", "Section 100 (EGM)", "Section 103 (Quorum)", "Section 110"],
    timestampNotes: [
      { time: "05:12", note: "Section 96 AGM Timelines & Default Penalties" },
      { time: "21:40", note: "Section 103 Quorum Calculations for Public Companies" },
      { time: "38:15", note: "Drafting the 6-Mark ICAI Model Descriptive Answer" },
    ],
  },
  {
    id: "l-2",
    title: "Section 135: Corporate Social Responsibility (CSR) Provisions",
    duration: "52 Mins",
    faculty: "CA / CS Rahul Sharma Sir",
    summary:
      "Detailed analysis of the 3 threshold criteria (Net Worth ₹500 Cr, Turnover ₹1000 Cr, Net Profit ₹5 Cr), CSR Committee composition, and unspent CSR account rules.",
    keyTakeaways: [
      "2% average net profit calculation of preceding 3 financial years",
      "Unspent CSR account transfer within 30 days of FY closure",
      "Penalty under Section 135(7) for non-compliance",
    ],
    bareActRefs: ["Section 135(1)", "Section 135(5)", "Section 135(6)", "Schedule VII"],
    timestampNotes: [
      { time: "04:15", note: "Threshold limits & mandatory CSR triggers" },
      { time: "22:30", note: "Ongoing vs Non-Ongoing CSR projects" },
      { time: "41:10", note: "Past 5 years ICAI exam questions analysis" },
    ],
  },
];

// Daily Quick MCQ
const DAILY_QUIZ = {
  question:
    "Under Section 135(1) of the Companies Act 2013, which of the following is NOT one of the criteria triggering mandatory constitution of a CSR Committee?",
  options: [
    "Net Worth of ₹500 Crore or more during the immediately preceding financial year",
    "Turnover of ₹1,000 Crore or more during the immediately preceding financial year",
    "Net Profit of ₹5 Crore or more during the immediately preceding financial year",
    "Paid-up Share Capital of ₹50 Crore or more during the immediately preceding financial year",
  ],
  correct: 3,
  explanation:
    "Paid-up Share Capital is NOT a criteria under Section 135(1). The three statutory triggers are Net Worth (₹500 Cr), Turnover (₹1,000 Cr), or Net Profit (₹5 Cr) in the preceding FY.",
};

export default function StudentPortalPage() {
  const [student, setStudent] = useState<StudentProfile>(PRESET_PROFILES[0]);
  const [unlockedItemIds, setUnlockedItemIds] = useState<string[]>(PRESET_PROFILES[0].unlockedItemIds);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filter state for study materials
  const [materialSearch, setMaterialSearch] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<"all" | "book" | "video" | "evaluation">("all");

  // Profile Menu state
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // In-Dashboard Fast Upgrade Modal
  const [upgradeItem, setUpgradeItem] = useState<CatalogItem | null>(null);
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState(false);

  // Modals
  const [readerOpen, setReaderOpen] = useState(false);
  const [selectedBookForReader, setSelectedBookForReader] = useState({
    id: "book-mcq",
    title: "ICAI Case Scenarios & 30-Mark MCQ Bank (1,200+ Qs)",
    subject: "Mandatory Objective Section Practice Bank",
    pages: "260 Pages",
    fileSize: "12.6 MB",
  });

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeLesson, setActiveLesson] = useState<MasterclassLesson>(MASTERCLASS_LESSONS[0]);

  const [mainsEvalModalOpen, setMainsEvalModalOpen] = useState(false);

  // Student Login Modal State
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginInput, setLoginInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Daily MCQ State
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Check localStorage on mount for active purchased student session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSession = localStorage.getItem("lawkaksha_active_student");
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          if (parsed && parsed.unlockedItemIds) {
            setStudent((prev) => ({
              ...prev,
              name: parsed.name || prev.name,
              rollNumber: parsed.rollNumber || prev.rollNumber,
              email: parsed.email || prev.email,
              targetExam: parsed.targetExam || prev.targetExam,
              activePlanTitle: parsed.activePlanTitle || prev.activePlanTitle,
              avatarInitials: parsed.avatarInitials || prev.avatarInitials,
            }));
            setUnlockedItemIds(parsed.unlockedItemIds);
          }
        } catch (e) {
          console.error("Error parsing saved student session", e);
        }
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Switch Active Preset Profile
  const handleSelectProfile = (p: StudentProfile) => {
    setStudent(p);
    setUnlockedItemIds(p.unlockedItemIds);
    if (typeof window !== "undefined") {
      localStorage.setItem("lawkaksha_active_student", JSON.stringify(p));
    }
    showToast(`Switched view to: ${p.name} (${p.activePlanTitle})`);
  };

  // Student Roll Number & Account Login Lookup
  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const query = loginInput.trim().toLowerCase();
    if (!query) {
      setLoginError("Please enter your Student ID, Roll Number, or Email.");
      return;
    }

    // 1. Check in saved session from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lawkaksha_active_student");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (
            parsed.rollNumber?.toLowerCase().includes(query) ||
            parsed.id?.toLowerCase().includes(query) ||
            parsed.email?.toLowerCase().includes(query) ||
            parsed.name?.toLowerCase().includes(query)
          ) {
            setStudent(parsed);
            setUnlockedItemIds(parsed.unlockedItemIds || ["book-mcq"]);
            setLoginModalOpen(false);
            setLoginInput("");
            showToast(`Welcome back, ${parsed.name}! Your workspace is unlocked.`);
            return;
          }
        } catch (e) {}
      }
    }

    // 2. Check in PRESET_PROFILES
    const matchedPreset = PRESET_PROFILES.find(
      (p) =>
        p.rollNumber.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query) ||
        p.name.toLowerCase().includes(query)
    );

    if (matchedPreset) {
      handleSelectProfile(matchedPreset);
      setLoginModalOpen(false);
      setLoginInput("");
      showToast(`Welcome back, ${matchedPreset.name}!`);
      return;
    }

    // 3. Fallback: Authenticate as new dynamic student session
    const formattedName = loginInput.includes("@")
      ? loginInput.split("@")[0].toUpperCase()
      : loginInput.toUpperCase();
    const newStudentProfile: StudentProfile = {
      id: `LK-2026-CA-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formattedName,
      rollNumber:
        loginInput.startsWith("LK") || loginInput.startsWith("CRO") || loginInput.startsWith("WRO")
          ? loginInput.toUpperCase()
          : `LK-2026-CA-${Math.floor(1000 + Math.random() * 9000)}`,
      email: loginInput.includes("@") ? loginInput : `${loginInput.toLowerCase()}@student.lawkaksha.com`,
      targetExam: "CA Intermediate Paper 2 (Nov'26)",
      activePlanTitle: "ICAI Case Scenarios & MCQ Question Bank (1,200+ Qs)",
      unlockedItemIds: ["book-mcq", "book-vol-1"],
      streakDays: 1,
      todayMinutes: 15,
      todayGoalMinutes: 45,
      examCountdownDays: 68,
      avatarInitials: formattedName.slice(0, 2),
    };

    setStudent(newStudentProfile);
    setUnlockedItemIds(newStudentProfile.unlockedItemIds);
    if (typeof window !== "undefined") {
      localStorage.setItem("lawkaksha_active_student", JSON.stringify(newStudentProfile));
    }
    setLoginModalOpen(false);
    setLoginInput("");
    showToast(`Access Verified! Workspace opened for ${newStudentProfile.name}.`);
  };

  // Instant In-Dashboard Purchase / Unlock simulation
  const handleUnlockItem = (item: CatalogItem) => {
    if (unlockedItemIds.includes(item.id)) return;
    const nextUnlocked = [...unlockedItemIds, item.id];
    setUnlockedItemIds(nextUnlocked);

    if (typeof window !== "undefined") {
      const savedSession = localStorage.getItem("lawkaksha_active_student");
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          parsed.unlockedItemIds = nextUnlocked;
          localStorage.setItem("lawkaksha_active_student", JSON.stringify(parsed));
        } catch (e) {}
      }
    }
    showToast(`🎉 Razorpay payment verified! Unlocked "${item.title}".`);
  };

  // Filtered Unlocked vs Available items
  const myUnlockedItems = ALL_CATALOG_ITEMS.filter((item) => unlockedItemIds.includes(item.id));
  const filteredUnlockedItems = myUnlockedItems.filter((item) => {
    if (selectedCategoryFilter !== "all" && item.type !== selectedCategoryFilter) return false;
    if (materialSearch.trim()) {
      const q = materialSearch.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const otherAvailableItems = ALL_CATALOG_ITEMS.filter((item) => !unlockedItemIds.includes(item.id));

  // Open appropriate reader / modal
  const handleOpenUnlockedResource = (item: CatalogItem) => {
    if (item.type === "book") {
      setSelectedBookForReader({
        id: item.id,
        title: item.title,
        subject: item.subtitle,
        pages: item.pagesOrDuration,
        fileSize: item.fileSize || "15 MB",
      });
      setReaderOpen(true);
    } else if (item.type === "video") {
      setActiveLesson(MASTERCLASS_LESSONS[0]);
      setVideoModalOpen(true);
    } else if (item.type === "evaluation") {
      setMainsEvalModalOpen(true);
    }
  };

  const hasMcqBank = unlockedItemIds.includes("book-mcq");

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 antialiased font-sans selection:bg-sky-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-top-3 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. TOP MINIMAL NAVIGATION BAR                            */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand & Portal Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <LawKakshaLogo variant="dark" />
            </Link>
            
            <div className="hidden sm:block h-5 w-px bg-slate-200" />
            
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] animate-pulse" />
              <span>Student Workspace</span>
            </span>
          </div>

          {/* Right: Plan Switcher & Profile & Login Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Minimal Segmented Plan Selector */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Plan:
              </span>
              {PRESET_PROFILES.map((p) => {
                const isSelected = student.id === p.id;
                const label =
                  p.id === "STU-MCQ-ONLY"
                    ? "Question Bank"
                    : p.id === "STU-NOTES-ONLY"
                    ? "Notes (Vol 1+2)"
                    : "All-Access";

                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectProfile(p)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-white text-[#0284C7] font-bold shadow-xs border border-slate-200/60"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Mobile Plan Dropdown Selector */}
            <div className="md:hidden">
              <select
                value={student.id}
                onChange={(e) => {
                  const found = PRESET_PROFILES.find((p) => p.id === e.target.value);
                  if (found) handleSelectProfile(found);
                }}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#0284C7]"
              >
                <option value="STU-MCQ-ONLY">Question Bank Plan</option>
                <option value="STU-NOTES-ONLY">Notes Set (Vol 1+2)</option>
                <option value="STU-ALL-ACCESS">All-Access Plan</option>
              </select>
            </div>

            {/* Student Login / Lookup Button */}
            <button
              onClick={() => setLoginModalOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-[#0284C7] bg-white text-xs font-semibold transition-all shadow-2xs flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-[#0284C7]" />
              <span className="hidden sm:inline">Student Login</span>
            </button>

            {/* Student Profile Pill with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 pl-2 sm:pl-3 sm:border-l border-slate-200 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {student.avatarInitials}
                </div>
                <div className="hidden lg:block leading-tight text-left">
                  <span className="text-xs font-bold text-slate-900 block">{student.name}</span>
                  <span className="text-[10px] text-slate-500 font-medium block">{student.rollNumber}</span>
                </div>
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 text-xs animate-in zoom-in-95 duration-150">
                  <div className="pb-2 mb-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900">{student.name}</p>
                    <p className="text-[11px] font-mono text-slate-500">{student.email}</p>
                    <p className="text-[10px] text-[#0284C7] font-semibold mt-0.5">Roll: {student.rollNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Quick Switch Profile:</p>
                    {PRESET_PROFILES.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          handleSelectProfile(p);
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          student.id === p.id ? "bg-sky-50 text-[#0284C7] font-bold" : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span>{p.name.split(" ")[0]} ({p.id.replace("STU-", "").replace("-ONLY", "")})</span>
                        {student.id === p.id && <Check className="w-3.5 h-3.5 text-[#0284C7]" />}
                      </button>
                    ))}
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          localStorage.removeItem("lawkaksha_active_student");
                        }
                        setProfileDropdownOpen(false);
                        handleSelectProfile(PRESET_PROFILES[0]);
                        showToast("Session reset to default student profile.");
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-rose-600 hover:bg-rose-50 font-semibold transition-colors"
                    >
                      Reset Session
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. MAIN DASHBOARD CONTENT                                */}
      {/* ======================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7">
        
        {/* ======================================================== */}
        {/* HERO BANNER: PERSONALIZED TO ACTIVE PURCHASE             */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-sky-100/60 via-sky-50/20 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Left: Greeting & Active Purchase Details */}
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-[#0284C7] text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                <span>{student.streakDays}-Day Daily Study Streak</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
                Welcome back, <span className="text-[#0284C7]">{student.name}</span>!
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your Active Enrolled Plan: <strong className="text-slate-900">{student.activePlanTitle}</strong>. You have unlocked <strong className="text-[#0284C7] font-bold">{myUnlockedItems.length} resource{myUnlockedItems.length > 1 ? "s" : ""}</strong> on your dashboard.
              </p>
            </div>

            {/* Right: Quick Daily Study Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                <span className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider block">Exam Countdown</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{student.examCountdownDays} Days Left</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                <span className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider block">Unlocked</span>
                <span className="text-sm font-bold text-[#0284C7] mt-0.5 block">{myUnlockedItems.length} Active Items</span>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                <span className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider block">Daily Target</span>
                <span className="text-sm font-bold text-emerald-600 mt-0.5 block">{student.todayMinutes}m / {student.todayGoalMinutes}m</span>
              </div>
            </div>

          </div>

          {/* 1-Click Continue Card (Tailored to what is unlocked) */}
          <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-sky-50/70 p-4 rounded-2xl border border-sky-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0284C7] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                {hasMcqBank ? <Award className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#0284C7] uppercase tracking-wider block">
                  {hasMcqBank ? "Continue MCQ Practice" : "Continue Reading"}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                  {hasMcqBank
                    ? "ICAI Case Scenarios & MCQs: Chapter 7 (Management & Administration)"
                    : "Companies Act 2013: Section 96 to 103 (AGM, Quorum & Proxies)"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleOpenUnlockedResource(myUnlockedItems[0])}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <span>{hasMcqBank ? "Start Question Bank" : "Open Notes Reader"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* SECTION 1: MY ACTIVE STUDY MATERIALS (UNLOCKED ONLY)     */}
        {/* ======================================================== */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>My Active Study Materials ({myUnlockedItems.length})</span>
              </h2>
              <p className="text-xs text-slate-500">
                These are the study resources currently unlocked on your account. Click to access immediately.
              </p>
            </div>

            {/* Quick Search & Category Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={materialSearch}
                  onChange={(e) => setMaterialSearch(e.target.value)}
                  placeholder="Filter unlocked items..."
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] w-48"
                />
              </div>

              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[11px] font-semibold">
                {(["all", "book", "video", "evaluation"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg transition-all capitalize ${
                      selectedCategoryFilter === cat
                        ? "bg-white text-[#0284C7] font-bold shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {cat === "all" ? "All" : cat === "book" ? "Books" : cat === "video" ? "Classes" : "Desk"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredUnlockedItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500 space-y-2">
              <Search className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="font-semibold text-slate-700">No unlocked materials match "{materialSearch}"</p>
              <button
                onClick={() => {
                  setMaterialSearch("");
                  setSelectedCategoryFilter("all");
                }}
                className="text-[#0284C7] font-bold hover:underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUnlockedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border-2 border-sky-200/80 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0284C7] border border-sky-200">
                        {item.badge}
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-slate-500">{item.pagesOrDuration}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <Check className="w-3.5 h-3.5" />
                      <span>Full Access Ready</span>
                    </span>

                    <button
                      onClick={() => handleOpenUnlockedResource(item)}
                      className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <span>{item.type === "video" ? "Watch Video" : item.type === "evaluation" ? "Open Desk" : "Read Now"}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Daily 1-Minute MCQ Brain Teaser (If MCQ Bank or All Access is owned) */}
        {hasMcqBank && (
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Question Bank Daily Drill
                </span>
                <h3 className="text-sm font-bold text-slate-900 font-serif">
                  {DAILY_QUIZ.question}
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-400 shrink-0">1-Minute Daily Quiz</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {DAILY_QUIZ.options.map((opt, idx) => {
                const isSelected = selectedQuizAnswer === idx;
                const isCorrect = idx === DAILY_QUIZ.correct;

                let btnStyle = "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/50 text-slate-800";
                if (showQuizResult) {
                  if (isCorrect) {
                    btnStyle = "border-emerald-300 bg-emerald-50 text-emerald-900 font-bold";
                  } else if (isSelected) {
                    btnStyle = "border-rose-300 bg-rose-50 text-rose-900";
                  } else {
                    btnStyle = "border-slate-100 bg-slate-50 text-slate-400";
                  }
                } else if (isSelected) {
                  btnStyle = "border-[#0284C7] bg-sky-50 text-[#0284C7] font-bold";
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={showQuizResult}
                    onClick={() => {
                      setSelectedQuizAnswer(idx);
                      setShowQuizResult(true);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-mono text-[11px] shrink-0 font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {showQuizResult && (
              <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-[#0284C7] block">
                  {selectedQuizAnswer === DAILY_QUIZ.correct ? "🎉 Correct Answer!" : "💡 Statutory Explanation:"}
                </span>
                <p className="leading-relaxed">{DAILY_QUIZ.explanation}</p>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION 2: EXPLORE & UPGRADE STUDY MATERIALS             */}
        {/* ======================================================== */}
        {otherAvailableItems.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-[#0284C7]" />
                  <span>Available Upgrades &amp; Additional Materials</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Want access to textbook codexes, full video masterclasses, or answer checking? Click to unlock below.
                </p>
              </div>

              <Link
                href="/#courses"
                className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>View Full Store Catalog</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherAvailableItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between relative group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {item.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-900">
                        ₹{item.price} <span className="text-[10px] text-slate-400 line-through font-normal">₹{item.originalPrice}</span>
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-[11.5px] text-slate-500 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.pagesOrDuration}</span>
                    </span>

                    <button
                      onClick={() => handleUnlockItem(item)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-[#0284C7] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Unlock for ₹{item.price}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Motivational Credo Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0C4A6E] to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-sky-300 block">The Law Kaksha Aspirant Credo</span>
            <p className="text-xs sm:text-sm font-serif italic text-slate-100">
              "Section by Section, Step by Step towards your Chartered Accountant dream."
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all"
            >
              Browse All Book Editions
            </Link>
          </div>
        </div>

      </main>

      {/* ======================================================== */}
      {/* MODALS: SECURE PDF READER                                */}
      {/* ======================================================== */}
      <SecurePdfReaderModal
        isOpen={readerOpen}
        onClose={() => setReaderOpen(false)}
        book={selectedBookForReader}
        student={{
          name: student.name,
          rollNumber: student.rollNumber,
          email: student.email,
        }}
      />

      {/* ======================================================== */}
      {/* MODALS: MASTERCLASS VIDEO PLAYER                         */}
      {/* ======================================================== */}
      <MasterclassVideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        courseTitle={student.targetExam}
        activeLesson={activeLesson}
        allLessons={MASTERCLASS_LESSONS}
        onSelectLesson={(lesson) => setActiveLesson(lesson)}
        studentName={student.name}
        rollNumber={student.rollNumber}
      />

      {/* ======================================================== */}
      {/* MODALS: MAINS EVALUATION DESK                            */}
      {/* ======================================================== */}
      <MainsEvaluationDeskModal
        isOpen={mainsEvalModalOpen}
        onClose={() => setMainsEvalModalOpen(false)}
        studentName={student.name}
        rollNumber={student.rollNumber}
      />

      {/* ======================================================== */}
      {/* MODALS: STUDENT ROLL NUMBER & ACCOUNT LOGIN LOOKUP       */}
      {/* ======================================================== */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setLoginModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7]">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-black text-slate-900">Student Portal Login</h3>
                  <p className="text-[11px] text-slate-500">Access your DRM books &amp; courses</p>
                </div>
              </div>
              <button
                onClick={() => setLoginModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <Lock className="w-4 h-4 sr-only" />
                ✕
              </button>
            </div>

            <form onSubmit={handleStudentLogin} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Student Roll No, Email or Registered Mobile
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={loginInput}
                  onChange={(e) => {
                    setLoginInput(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  placeholder="e.g. LK-2026-CA-0842 or rohan.d@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0284C7] font-mono"
                />
                <p className="text-[10.5px] text-slate-400 mt-1">
                  Enter credentials generated upon purchase or your ICAI roll number.
                </p>
              </div>

              {loginError && (
                <p className="text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-[11px] font-semibold">
                  {loginError}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLoginModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-semibold text-xs hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Verify &amp; Open Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
