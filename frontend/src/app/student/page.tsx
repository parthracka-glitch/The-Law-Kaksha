"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Award,
  CheckCircle2,
  Search,
  ChevronRight,
  Flame,
  Check,
  Video,
  Lock,
  ShoppingCart,
  CheckCircle,
  Edit3,
  LogOut,
  CreditCard,
  QrCode,
  Eye,
  MessageSquare,
  Send,
  HelpCircle,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { LawKakshaLogo } from "@/components/LawKakshaLogo";
import { SecurePdfReaderModal } from "@/components/SecurePdfReaderModal";
import { MasterclassVideoModal, MasterclassLesson } from "@/components/MasterclassVideoModal";
import { MainsEvaluationDeskModal } from "@/components/MainsEvaluationDeskModal";
import { EnhancedSampleChapterModal } from "@/components/EnhancedSampleChapterModal";
import { useCart } from "@/context/CartContext";
import { apiRequest } from "@/lib/api";

interface StudentProfile {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  targetExam: string;
  unlockedItemIds: string[];
  streakDays: number;
  examCountdownDays: number;
  avatarInitials: string;
}

const DEFAULT_STUDENT: StudentProfile = {
  id: "LK-STU-2026",
  name: "Rohan Deshmukh",
  rollNumber: "CRO-0689421",
  email: "rohan.deshmukh@gmail.com",
  targetExam: "CA Intermediate Paper 2: Corporate & Other Laws (Nov'26)",
  unlockedItemIds: ["book-vol-1", "book-mcq"],
  streakDays: 14,
  examCountdownDays: 68,
  avatarInitials: "RD",
};

interface StudyItem {
  id: string;
  type: "book" | "mcq" | "video" | "evaluation";
  title: string;
  subtitle: string;
  pagesOrDuration: string;
  price: number;
  originalPrice: number;
  badge: string;
  description: string;
  sampleBookId?: string;
  highlights: string[];
}

const ALL_STUDY_ITEMS: StudyItem[] = [
  {
    id: "book-vol-1",
    type: "book",
    title: "Volume 1: CA Corporate Law Master Codex (2026-2027)",
    subtitle: "Companies Act 2013 (Sections 1 to 148) with full Bare Act synthesis.",
    pagesOrDuration: "540 Pages",
    price: 399,
    originalPrice: 699,
    badge: "Primary Textbook",
    description: "Complete line-by-line coverage of Companies Act 2013 with 45+ ROC circulars and past 10 attempts solved questions.",
    sampleBookId: "ca-inter",
    highlights: ["Complete Sections 1 to 148", "ROC Circulars & Notifications", "ICAI Model Solved Questions"],
  },
  {
    id: "book-vol-2",
    type: "book",
    title: "Volume 2: Economic & Other Business Laws Codex",
    subtitle: "General Clauses Act, Interpretation of Statutes & Foreign Contribution (FCRA).",
    pagesOrDuration: "480 Pages",
    price: 349,
    originalPrice: 599,
    badge: "High-Yield Notes",
    description: "Master statutory interpretation rules, General Clauses Act presumption principles, and FCRA regulations.",
    sampleBookId: "ca-inter-vol2",
    highlights: ["General Clauses Act deep-dive", "Interpretation of Statutes rules", "Past exam descriptive answers"],
  },
  {
    id: "book-mcq",
    type: "mcq",
    title: "ICAI Case Scenarios & 30-Mark MCQ Bank (1,200+ Qs)",
    subtitle: "Mandatory 30-mark section with detailed reasoning for each option.",
    pagesOrDuration: "260 Pages",
    price: 249,
    originalPrice: 449,
    badge: "Practice Drill",
    description: "Practice chapter-wise ICAI case scenarios, negative marking prevention drills, and MCA amendment MCQs.",
    sampleBookId: "ca-inter",
    highlights: ["1,200+ ICAI curated MCQs", "Reasoning for all 4 options", "30-Mark Integrated Case Studies"],
  },
  {
    id: "book-ldr",
    type: "book",
    title: "1.5-Day Last Day Revision (LDR) Section Maps",
    subtitle: "Summary Flowcharts, Limit Tables & Penalty Code Tables for the last 36 hours.",
    pagesOrDuration: "180 Pages",
    price: 199,
    originalPrice: 349,
    badge: "Quick Revision",
    description: "Ultra-condensed visual flowcharts and penalty summary tables designed specifically for the final 36 hours.",
    sampleBookId: "ca-inter",
    highlights: ["Penalty code tables", "Time limit summary charts", "1.5-day exam eve checklist"],
  },
  {
    id: "video-classes",
    type: "video",
    title: "HD Video Masterclasses: Full Law Lecture Series",
    subtitle: "32 in-depth chapter masterclasses with timestamped notes and faculty drafting rubrics.",
    pagesOrDuration: "45+ Hours",
    price: 999,
    originalPrice: 1899,
    badge: "Video Course",
    description: "Detailed video breakdown of tricky corporate law sections with practical boardroom case studies.",
    highlights: ["32 chapter masterclasses", "Timestamped digital notes", "Faculty drafting rubrics & 1.25x/1.5x player"],
  },
  {
    id: "mains-evaluation",
    type: "evaluation",
    title: "1-on-1 Descriptive Test Series & Copy Checking Desk",
    subtitle: "Submit your handwritten answer sheets for 5-pillar faculty grading and audio feedback.",
    pagesOrDuration: "8 Full Papers",
    price: 699,
    originalPrice: 1299,
    badge: "Copy Checking",
    description: "Get detailed line-by-line checking of your law descriptive papers within 48 hours to boost scores to 70+.",
    highlights: ["8 full ICAI model test papers", "5-pillar rubric grading", "Detailed audio feedback from CA faculty"],
  },
];

const MASTERCLASS_LESSONS: MasterclassLesson[] = [
  {
    id: "l-1",
    title: "Companies Act 2013: Section 96 to 103 (AGM, EGM & Quorum Rules)",
    duration: "48 Mins",
    faculty: "CA / CS Rahul Sharma Sir",
    summary: "Deep dive into AGM deadlines, ROC extension limitations, Section 103 public vs private company quorum calculation, and practical ICAI case scenarios.",
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
];

export default function StudentDashboardPage() {
  const { addToCart, isCartOpen, setIsCartOpen, totalItemCount } = useCart();

  const [student, setStudent] = useState<StudentProfile>(DEFAULT_STUDENT);
  const [unlockedItemIds, setUnlockedItemIds] = useState<string[]>(DEFAULT_STUDENT.unlockedItemIds);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Simple 2-Tab Navigation: "library" (My Enrolled Items) vs "store" (Buy More)
  const [activeTab, setActiveTab] = useState<"library" | "store">("library");

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // 6-Page Sample Preview Modal
  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [sampleBookId, setSampleBookId] = useState("ca-inter");
  const [samplePrice, setSamplePrice] = useState(249);

  // Ask Doubt / Support Modal
  const [doubtModalOpen, setDoubtModalOpen] = useState(false);
  const [doubtText, setDoubtText] = useState("");
  const [doubtSubmitted, setDoubtSubmitted] = useState(false);

  // Reader & Player Modals
  const [readerOpen, setReaderOpen] = useState(false);
  const [selectedBookForReader, setSelectedBookForReader] = useState({
    id: "book-vol-1",
    title: "Volume 1: CA Corporate Law Master Codex (2026-2027)",
    subject: "Companies Act 2013 (Sections 1 to 148)",
    pages: "540 Pages",
    fileSize: "19.2 MB",
  });

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [mainsEvalModalOpen, setMainsEvalModalOpen] = useState(false);

  // Profile Edit Modal
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editExam, setEditExam] = useState("");

  // Normalize any course or book ID alias to canonical IDs
  const normalizeUnlockId = (id: string): string[] => {
    const clean = (id || "").toLowerCase();
    if (clean === "ca-book-vol-1" || clean === "book-vol-1") return ["book-vol-1"];
    if (clean === "ca-book-vol-2" || clean === "book-vol-2") return ["book-vol-2"];
    if (clean === "book-mcq" || clean.includes("mcq")) return ["book-mcq"];
    if (clean === "book-ldr" || clean.includes("ldr") || clean.includes("revision")) return ["book-ldr"];
    if (clean === "video-classes" || clean.includes("video") || clean.includes("masterclass") || clean.includes("lecture")) return ["video-classes"];
    if (clean === "mains-evaluation" || clean.includes("evaluation") || clean.includes("desk")) return ["mains-evaluation"];
    if (clean.includes("both") || clean.includes("combo")) return ["book-vol-1", "book-vol-2"];
    if (clean.includes("business-law")) return ["book-vol-1", "book-vol-2", "video-classes"];
    return [id];
  };

  // Load saved session on mount, fetch server session and listen to storage and custom events
  const syncSession = async () => {
    if (typeof window !== "undefined") {
      let localUnlocked: string[] = [];

      // 1. Check local session first
      const saved = localStorage.getItem("lawkaksha_active_student");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed) {
            if (Array.isArray(parsed.unlockedItemIds)) {
              localUnlocked = parsed.unlockedItemIds.flatMap(normalizeUnlockId);
            }
            setStudent((prev) => ({
              ...prev,
              name: parsed.name || prev.name,
              rollNumber: parsed.student_id || parsed.rollNumber || prev.rollNumber,
              email: parsed.email || prev.email,
              targetExam: parsed.targetExam || prev.targetExam,
              unlockedItemIds: localUnlocked.length > 0 ? localUnlocked : prev.unlockedItemIds,
              avatarInitials: parsed.avatarInitials || (parsed.name ? parsed.name.slice(0, 2).toUpperCase() : prev.avatarInitials),
            }));
            if (localUnlocked.length > 0) {
              setUnlockedItemIds(Array.from(new Set(localUnlocked)));
            }
          }
        } catch (e) {}
      }

      // 2. Fetch server-verified profile and enrollments
      const res = await apiRequest("/api/auth/me");
      if (res.success && res.data) {
        const user = res.data.user;
        const serverEnrolled = (res.data.enrolledProductIds || []).flatMap(normalizeUnlockId);
        if (user) {
          const combinedUnlocked = Array.from(new Set([...localUnlocked, ...serverEnrolled]));
          setStudent((prev) => ({
            ...prev,
            name: user.name,
            rollNumber: user.student_id || prev.rollNumber,
            email: user.email,
            targetExam: user.target_exam || prev.targetExam,
            unlockedItemIds: combinedUnlocked.length > 0 ? combinedUnlocked : prev.unlockedItemIds,
          }));
          if (combinedUnlocked.length > 0) {
            setUnlockedItemIds(combinedUnlocked);
            // Keep localStorage updated with the combined set
            if (saved) {
              try {
                const p = JSON.parse(saved);
                p.unlockedItemIds = combinedUnlocked;
                localStorage.setItem("lawkaksha_active_student", JSON.stringify(p));
              } catch (e) {}
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    syncSession();
    window.addEventListener("storage", syncSession);
    window.addEventListener("lawkaksha_student_updated", syncSession);
    window.addEventListener("focus", syncSession);
    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("lawkaksha_student_updated", syncSession);
      window.removeEventListener("focus", syncSession);
    };
  }, []);

  // Re-sync when switching between tabs
  useEffect(() => {
    syncSession();
  }, [activeTab]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open the selected study item with server-side authorization check
  const handleOpenItem = async (item: StudyItem) => {
    // Check if enrolled
    const isEnrolled = isItemUnlocked(item.id);
    if (!isEnrolled) {
      showToast(`⛔ Access Denied: "${item.title}" has not been purchased.`);
      return;
    }

    // Server-side entitlement check
    const authRes = await apiRequest(`/api/content/${item.id}/access`);
    if (!authRes.success && authRes.error === "ACCESS_DENIED") {
      showToast("⛔ Server Access Denied: Enrollment not verified.");
      return;
    }

    if (item.type === "book" || item.type === "mcq") {
      setSelectedBookForReader({
        id: item.id,
        title: item.title,
        subject: item.subtitle,
        pages: item.pagesOrDuration,
        fileSize: "18 MB",
      });
      setReaderOpen(true);
    } else if (item.type === "video") {
      setVideoModalOpen(true);
    } else if (item.type === "evaluation") {
      setMainsEvalModalOpen(true);
    }
  };

  // Add Item to Basket & Trigger Checkout Drawer
  const handleAddItemToCart = (item: StudyItem) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      originalPrice: item.originalPrice,
      format: "pdf",
      category: item.badge,
      badge: item.badge,
    });
    setIsCartOpen(true);
    showToast(`🛒 "${item.title}" added to your basket.`);
  };

  // Save Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    const updated = {
      ...student,
      name: editName.trim(),
      targetExam: editExam.trim() || student.targetExam,
      avatarInitials: editName.trim().slice(0, 2).toUpperCase(),
    };
    setStudent(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("lawkaksha_active_student", JSON.stringify(updated));
    }
    setProfileModalOpen(false);
    showToast("Profile updated successfully!");
  };

  // Submit Doubt
  const handleSendDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim()) return;
    setDoubtSubmitted(true);
    setTimeout(() => {
      setDoubtSubmitted(false);
      setDoubtText("");
      setDoubtModalOpen(false);
      showToast("Question sent to faculty! Answer will be posted shortly.");
    }, 1500);
  };

  // Flatten and normalize all unlocked IDs so all purchased items are recognized
  const allNormalizedUnlockedIds = Array.from(
    new Set(unlockedItemIds.flatMap(normalizeUnlockId))
  );

  const isItemUnlocked = (itemId: string) => {
    return (
      allNormalizedUnlockedIds.includes(itemId) ||
      unlockedItemIds.includes(itemId) ||
      allNormalizedUnlockedIds.some((uid) => uid === itemId || uid.includes(itemId) || itemId.includes(uid))
    );
  };

  // Split items into owned vs available
  const myEnrolledItems = ALL_STUDY_ITEMS.filter((item) => isItemUnlocked(item.id));
  const availableItems = ALL_STUDY_ITEMS.filter((item) => !isItemUnlocked(item.id));

  // Filtered lists by search
  const filteredEnrolled = myEnrolledItems.filter((i) =>
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStore = ALL_STUDY_ITEMS.filter((i) =>
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 antialiased font-sans">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-top-3">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. CLEAN TOP NAVIGATION                                  */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand */}
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity shrink-0">
            <LawKakshaLogo variant="light" />
          </Link>

          {/* 2 Primary Clean Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab("library")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "library"
                  ? "bg-white text-[#0284C7] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>My Enrolled Books &amp; Notes</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-100 text-[#0284C7] font-extrabold">
                {myEnrolledItems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("store")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "store"
                  ? "bg-white text-[#0284C7] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Buy More Materials</span>
              {availableItems.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-extrabold">
                  +{availableItems.length} New
                </span>
              )}
            </button>
          </div>

          {/* Right: Cart, Ask Doubt & Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Basket / Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 transition-all flex items-center gap-1.5 shadow-2xs relative"
              title="View Basket"
            >
              <ShoppingBag className="w-4 h-4 text-[#0284C7]" />
              <span className="hidden sm:inline">Basket</span>
              {totalItemCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#0284C7] text-white text-[10px] font-mono flex items-center justify-center font-bold">
                  {totalItemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setDoubtModalOpen(true)}
              className="hidden sm:flex px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0284C7] text-xs font-bold border border-sky-200 transition-all items-center gap-1.5 shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Doubt</span>
            </button>

            {/* Profile Pill */}
            <button
              onClick={() => {
                setEditName(student.name);
                setEditExam(student.targetExam);
                setProfileModalOpen(true);
              }}
              className="flex items-center gap-2 pl-2 sm:pl-3 sm:border-l border-slate-200 hover:opacity-80 transition-opacity"
              title="Edit Profile"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {student.avatarInitials}
              </div>
              <div className="hidden md:block leading-tight text-left">
                <span className="text-xs font-bold text-slate-900 block">{student.name}</span>
                <span className="text-[10px] text-slate-500 font-mono block">{student.rollNumber}</span>
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. MAIN DASHBOARD CONTENT                                */}
      {/* ======================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
        
        {/* ======================================================== */}
        {/* TAB 1: MY ENROLLED BOOKS & NOTES (LIBRARY)               */}
        {/* ======================================================== */}
        {activeTab === "library" && (
          <div className="space-y-6">
            
            {/* Welcome Banner */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-sky-100/50 via-sky-50/20 to-transparent rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-[#0284C7] text-xs font-bold">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                    <span>{student.streakDays}-Day Daily Study Streak</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
                    Welcome back, <span className="text-[#0284C7]">{student.name}</span>!
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-600">
                    You have <strong className="text-[#0284C7] font-bold">{myEnrolledItems.length} active study materials</strong> unlocked on your account. Click any item below to open and read.
                  </p>
                </div>

                {/* Quick 2-Pill Stats */}
                <div className="flex items-center gap-3">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center min-w-[100px]">
                    <span className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider block">Exam Target</span>
                    <span className="text-sm font-bold text-slate-900 mt-0.5 block">{student.examCountdownDays} Days Left</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center min-w-[100px]">
                    <span className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider block">Enrolled</span>
                    <span className="text-sm font-bold text-[#0284C7] mt-0.5 block">{myEnrolledItems.length} Items</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enrolled Materials Grid Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Your Study Library ({myEnrolledItems.length})</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Click "Read Now" or "Start MCQs" to open your material in the high-speed continuous reader.
                </p>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your materials..."
                  className="pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] w-52"
                />
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredEnrolled.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border-2 border-sky-200/90 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0284C7] border border-sky-200">
                        {item.badge}
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-slate-500">
                        {item.pagesOrDuration}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {item.subtitle}
                      </p>
                    </div>

                    <div className="space-y-1 pt-1 text-[11px] text-slate-600">
                      {item.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Unlocked &amp; Ready</span>
                    </span>

                    <button
                      onClick={() => handleOpenItem(item)}
                      className="px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <span>
                        {item.type === "video"
                          ? "Watch Video"
                          : item.type === "evaluation"
                          ? "Open Desk"
                          : item.type === "mcq"
                          ? "Start Practice"
                          : "Read Book Now"}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Store Prompt */}
            {availableItems.length > 0 && (
              <div className="bg-gradient-to-r from-sky-50 via-white to-sky-50 rounded-3xl border border-sky-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-[#0284C7] flex items-center justify-center font-bold shrink-0">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Want to unlock more CA Law notes or question banks?
                    </h4>
                    <p className="text-xs text-slate-500">
                      You have {availableItems.length} additional study items available to add to your library.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("store")}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-[#0284C7] text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-2xs"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Explore Available Materials →</span>
                </button>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: STORE / BUY MORE MATERIALS                        */}
        {/* ======================================================== */}
        {activeTab === "store" && (
          <div className="space-y-6">
            
            {/* Store Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-[#0C4A6E] to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
              <div className="space-y-2 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30">
                  <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                  <span>The Law Kaksha Store</span>
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white">
                  Add More Study Materials to Your Library
                </h1>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Add any book or question bank to your basket. After 1-click checkout, the material is <strong>instantly unlocked</strong> in your library under your account.
                </p>
              </div>
            </div>

            {/* Store Grid Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-serif">
                  All Academy Offerings ({ALL_STUDY_ITEMS.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Preview 6 sample pages before buying or add to your basket.
                </p>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter store catalog..."
                  className="pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] w-52"
                />
              </div>
            </div>

            {/* Store Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredStore.map((item) => {
                const isOwned = isItemUnlocked(item.id);

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-3xl border p-5 shadow-2xs flex flex-col justify-between space-y-4 transition-all ${
                      isOwned
                        ? "border-emerald-200 bg-emerald-50/20"
                        : "border-slate-200 hover:border-sky-300 hover:shadow-xs"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            isOwned
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {item.badge}
                        </span>

                        {isOwned ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <Check className="w-3 h-3" />
                            <span>In Your Library</span>
                          </span>
                        ) : (
                          <div className="text-right">
                            <span className="text-base font-black font-mono text-slate-900">
                              ₹{item.price}
                            </span>
                            <span className="text-[10.5px] text-slate-400 line-through font-normal ml-1.5">
                              ₹{item.originalPrice}
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="space-y-1 pt-1 text-[11px] text-slate-600">
                        {item.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-[#0284C7] shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-slate-400">
                        {item.pagesOrDuration}
                      </span>

                      {isOwned ? (
                        <button
                          onClick={() => {
                            setActiveTab("library");
                            handleOpenItem(item);
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Open in Library</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          {item.sampleBookId && (
                            <button
                              onClick={() => {
                                setSampleBookId(item.sampleBookId!);
                                setSamplePrice(item.price);
                                setSampleModalOpen(true);
                              }}
                              className="px-2.5 py-2 rounded-xl border border-slate-200 hover:border-sky-300 text-slate-600 hover:text-[#0284C7] text-xs font-semibold transition-all flex items-center gap-1"
                              title="Preview 6 sample pages"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Sample</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleAddItemToCart(item)}
                            className="px-3.5 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Buy for ₹{item.price}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* MODAL: ASK FACULTY DOUBT                                 */}
      {/* ======================================================== */}
      {doubtModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-black text-slate-900">Ask Faculty Doubt</h3>
                  <p className="text-[11px] text-slate-500">Direct response from CA / CS faculty</p>
                </div>
              </div>
              <button
                onClick={() => setDoubtModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendDoubt} className="space-y-4 pt-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Your Law Question or Section Doubt:
                </label>
                <textarea
                  rows={4}
                  required
                  value={doubtText}
                  onChange={(e) => setDoubtText(e.target.value)}
                  placeholder="e.g. In Section 103 AGM quorum rules, do proxies count towards quorum for public companies?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDoubtModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-semibold text-xs hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={doubtSubmitted}
                  className="flex-1 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  {doubtSubmitted ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Send Question</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT PROFILE                                      */}
      {/* ======================================================== */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-black text-slate-900">Student Profile</h3>
                  <p className="text-[11px] text-slate-500">Roll: {student.rollNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setProfileModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 pt-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Target Exam
                </label>
                <input
                  type="text"
                  required
                  value={editExam}
                  onChange={(e) => setEditExam(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-semibold text-xs hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Save Changes</span>
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SAMPLE CHAPTER 6-PAGE PREVIEW                     */}
      {/* ======================================================== */}
      <EnhancedSampleChapterModal
        isOpen={sampleModalOpen}
        onClose={() => setSampleModalOpen(false)}
        bookId={sampleBookId}
        bookPrice={samplePrice}
      />

      {/* ======================================================== */}
      {/* MODAL: SECURE PDF READER                                 */}
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
      {/* MODAL: MASTERCLASS VIDEO PLAYER                          */}
      {/* ======================================================== */}
      <MasterclassVideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        courseTitle={student.targetExam}
        activeLesson={MASTERCLASS_LESSONS[0]}
        allLessons={MASTERCLASS_LESSONS}
        studentName={student.name}
        rollNumber={student.rollNumber}
      />

      {/* ======================================================== */}
      {/* MODAL: MAINS EVALUATION DESK                             */}
      {/* ======================================================== */}
      <MainsEvaluationDeskModal
        isOpen={mainsEvalModalOpen}
        onClose={() => setMainsEvalModalOpen(false)}
        studentName={student.name}
        rollNumber={student.rollNumber}
      />

    </div>
  );
}
