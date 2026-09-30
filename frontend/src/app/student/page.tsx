"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  BookOpen,
  GraduationCap,
  Award,
  Video,
  Calendar,
  CreditCard,
  HelpCircle,
  ShieldCheck,
  Search,
  Bell,
  CheckCircle2,
  Clock,
  Lock,
  Unlock,
  Eye,
  Send,
  ExternalLink,
  Layers,
  BarChart3,
  Play,
  RotateCcw,
  LogOut,
  X,
  FileText,
  Printer,
  Truck,
  Check,
  Smartphone,
  ChevronRight,
  Flame,
  AlertCircle,
  Download,
  Filter,
} from "lucide-react";
import { LawKakshaLogo } from "@/components/LawKakshaLogo";
import { SecurePdfReaderModal } from "@/components/SecurePdfReaderModal";
import { MasterclassVideoModal, MasterclassLesson } from "@/components/MasterclassVideoModal";
import { MainsEvaluationDeskModal } from "@/components/MainsEvaluationDeskModal";
import { EnhancedSampleChapterModal } from "@/components/EnhancedSampleChapterModal";
import { QuizTakingModal, QuizResult } from "@/components/student/QuizTakingModal";
import { useCart } from "@/context/CartContext";
import { apiRequest } from "@/lib/api";

const DEFAULT_LESSON: MasterclassLesson = {
  id: "lesson-01",
  title: "Companies Act 2013: Section 135 Corporate Social Responsibility (CSR)",
  duration: "45 Mins",
  faculty: "The Law Kaksha Faculty",
  summary: "Comprehensive breakdown of CSR eligibility limits, committee composition, unspent CSR account treatment, and penalty calculations under ICAI syllabus.",
  keyTakeaways: [
    "Net worth ₹500 Cr, Turnover ₹1000 Cr or Net Profit ₹5 Cr threshold rules.",
    "Section 135(5) Ongoing Projects transfer within 30 days to Special Account.",
    "Penal liabilities under Section 135(7) for default in transfer.",
  ],
  bareActRefs: ["Section 135", "Section 198", "Companies (CSR Policy) Rules"],
  timestampNotes: [
    { time: "02:15", note: "Threshold limits analysis under Sec 135(1)" },
    { time: "14:40", note: "Treatment of surplus arising out of CSR activities" },
    { time: "28:10", note: "Ongoing vs Non-ongoing project fund allocation" },
  ],
};

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
  deviceBound: string;
  isEnrolled: boolean;
}

const DEFAULT_STUDENT: StudentProfile = {
  id: "usr-student-001",
  name: "Enrolled Candidate",
  rollNumber: "LK-STU-084201",
  email: "candidate@lawkaksha.edu",
  targetExam: "CA Intermediate Paper 2: Corporate & Other Laws (Nov 2026)",
  unlockedItemIds: ["book-vol-1", "book-mcq"],
  streakDays: 14,
  examCountdownDays: 68,
  avatarInitials: "CA",
  deviceBound: "Windows PC (Hardware ID: LK-W11-8842)",
  isEnrolled: true,
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
  coverImage: string;
  isPhysical?: boolean;
}

const ALL_STUDY_ITEMS: StudyItem[] = [
  {
    id: "book-vol-1",
    type: "book",
    title: "Volume 1: The Indian Contract Act & Companies Act (Sec 1-148)",
    subtitle: "Complete Section-by-Section Smart Revision Question Bank",
    coverImage: "/covers/vol1-codex.webp",
    pagesOrDuration: "540 Pages",
    price: 249,
    originalPrice: 449,
    badge: "Volume 1",
    description: "Official The Law Kaksha Smart Revision Question Bank for Companies Act 2013 with practical boardroom case studies and model answers.",
    sampleBookId: "ca-inter",
    highlights: ["Sections 1 to 148 In-Depth", "10-Attempt RTP & MTP Solved Papers", "Examiner Keyword Scoring Rubric"],
    isPhysical: true,
  },
  {
    id: "book-vol-2",
    type: "book",
    title: "Volume 2: General Clauses Act & Interpretation of Statutes",
    subtitle: "General Clauses, Interpretation of Statutes & FCRA Codex",
    coverImage: "/covers/vol2-codex.webp",
    pagesOrDuration: "480 Pages",
    price: 249,
    originalPrice: 449,
    badge: "Volume 2",
    description: "Exhaustive legal interpretation guidelines, presumption rules, and previous ICAI descriptive examination questions.",
    sampleBookId: "ca-inter-vol2",
    highlights: ["General Clauses Act 1897", "Rules of Statutory Interpretation", "Previous 10 Attempts Questions"],
    isPhysical: true,
  },
  {
    id: "book-mcq",
    type: "mcq",
    title: "ICAI Case Scenarios & 30-Mark MCQ Bank (1,200+ Qs)",
    subtitle: "Mandatory 30-mark section with detailed statutory reasoning",
    coverImage: "/covers/vol1-codex.webp",
    pagesOrDuration: "260 Pages",
    price: 249,
    originalPrice: 449,
    badge: "Practice Drill",
    description: "Practice chapter-wise ICAI case scenarios, negative marking prevention drills, and MCA amendment MCQs.",
    sampleBookId: "ca-inter",
    highlights: ["1,200+ Curated Caselet MCQs", "Statutory Reasoning for All Options", "30-Mark Integrated Case Studies"],
  },
  {
    id: "video-classes",
    type: "video",
    title: "HD Video Masterclasses: Full Law Lecture Series",
    subtitle: "32 in-depth chapter masterclasses with timestamped notes",
    coverImage: "/covers/vol2-codex.webp",
    pagesOrDuration: "45+ Hours",
    price: 999,
    originalPrice: 1899,
    badge: "Video Course",
    description: "Detailed video breakdown of tricky corporate law sections with practical boardroom case studies.",
    highlights: ["32 Chapter Masterclasses", "Timestamped Digital Notes", "1.25x / 1.5x Playback"],
  },
  {
    id: "mains-evaluation",
    type: "evaluation",
    title: "1-on-1 Descriptive Test Series & Copy Checking Desk",
    subtitle: "Submit handwritten answer sheets for 5-pillar ICAI rubric grading",
    coverImage: "/covers/vol1-codex.webp",
    pagesOrDuration: "8 Full Papers",
    price: 699,
    originalPrice: 1299,
    badge: "Copy Checking",
    description: "Get detailed line-by-line checking of your law descriptive papers within 48 hours to boost scores.",
    highlights: ["8 Full ICAI Model Papers", "5-Pillar Rubric Grading", "Detailed Evaluator Feedback Notes"],
  },
];

interface QuizItem {
  id: string;
  title: string;
  subtitle: string;
  level: string;
  subject: string;
  chapter: string;
  time_limit_minutes: number;
  total_marks: number;
  positive_marks: number;
  negative_marks: number;
  is_free: number;
  question_count: number;
  status: string;
}

interface LeaderboardItem {
  rank: number;
  badge: string;
  attempt_id: string;
  quiz_id: string;
  quiz_title: string;
  candidate_name: string;
  student_id: string;
  score: number;
  total_marks: number;
  accuracy: number;
  time_taken_seconds: number;
  created_at: string;
}

interface DoubtItem {
  id: string;
  subject: string;
  section: string;
  question: string;
  status: "Resolved" | "Under Review";
  date: string;
  facultyAnswer?: string;
}

export default function StudentDashboardPage() {
  const { addToCart, setIsCartOpen } = useCart();

  // Navigation State
  const [activeNav, setActiveNav] = useState<
    "home" | "library" | "quizzes" | "leaderboard" | "curricula" | "live" | "schedule" | "invoices" | "doubts" | "security"
  >("home");

  const [student, setStudent] = useState<StudentProfile>(DEFAULT_STUDENT);
  const [unlockedItemIds, setUnlockedItemIds] = useState<string[]>(DEFAULT_STUDENT.unlockedItemIds);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [libraryFilter, setLibraryFilter] = useState<"all" | "book" | "mcq" | "video" | "evaluation">("all");

  // Quizzes & Leaderboard Data
  const [quizzesList, setQuizzesList] = useState<QuizItem[]>([]);
  const [leaderboardList, setLeaderboardList] = useState<LeaderboardItem[]>([]);
  const [selectedQuizIdForTaking, setSelectedQuizIdForTaking] = useState<string | null>(null);
  const [quizModalOpen, setQuizModalOpen] = useState(false);

  // Modals & Triggers
  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [sampleBookId, setSampleBookId] = useState("ca-inter");
  const [samplePrice, setSamplePrice] = useState(249);
  const [doubtText, setDoubtText] = useState("");
  const [doubtSection, setDoubtSection] = useState("Companies Act 2013 - Section 135 (CSR)");
  const [doubtsList, setDoubtsList] = useState<DoubtItem[]>([
    {
      id: "dbt-101",
      subject: "Companies Act 2013",
      section: "Section 135 (CSR)",
      question: "Is CSR spending mandatory if net profit before tax is exactly ₹5 Crore in preceding financial year?",
      status: "Resolved",
      date: "28 Sep 2026",
      facultyAnswer: "Under Section 135(1), the net profit threshold of ₹5 Crore refers to 'net profit' calculated in accordance with Section 198. If it equals or exceeds ₹5 Crore, CSR committee constitution and 2% CSR allocation become mandatory.",
    },
    {
      id: "dbt-102",
      subject: "General Clauses Act 1897",
      section: "Section 6 (Effect of Repeal)",
      question: "How does repeal of a statute affect pending investigation under the repealed enactment?",
      status: "Resolved",
      date: "25 Sep 2026",
      facultyAnswer: "As per Section 6(e) of The General Clauses Act, repeal does not affect any investigation, legal proceeding or remedy in respect of any right, privilege, obligation, liability, penalty or forfeiture unless a different intention appears.",
    },
  ]);

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
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  // Fetch live quizzes & leaderboard on mount
  useEffect(() => {
    async function loadData() {
      try {
        const qRes = await apiRequest<{ success: boolean; data: QuizItem[] }>("/api/quizzes");
        if (qRes && qRes.success && Array.isArray(qRes.data)) {
          setQuizzesList(qRes.data);
        } else {
          // Fallback static quizzes
          setQuizzesList([
            {
              id: "quiz-companies-act-1",
              title: "Companies Act 2013: Management & Administration (Sec 88-122)",
              subtitle: "ICAI Case-Scenario MCQs on AGMs, Quorum, Postal Ballot & Resolutions",
              level: "CA Intermediate",
              subject: "Corporate & Other Laws",
              chapter: "Chapter 7: Management & Administration",
              time_limit_minutes: 25,
              total_marks: 30,
              positive_marks: 2,
              negative_marks: 0.5,
              is_free: 1,
              question_count: 15,
              status: "PUBLISHED",
            },
            {
              id: "quiz-general-clauses-1",
              title: "General Clauses Act 1897 & Interpretation of Statutes",
              subtitle: "Statutory Definitions, Repeal Effects & Harmonious Construction",
              level: "CA Intermediate",
              subject: "Corporate & Other Laws",
              chapter: "Other Laws: General Clauses Act",
              time_limit_minutes: 20,
              total_marks: 20,
              positive_marks: 2,
              negative_marks: 0.5,
              is_free: 0,
              question_count: 10,
              status: "PUBLISHED",
            },
            {
              id: "quiz-contract-act-1",
              title: "Indian Contract Act 1872: Special Contracts (Indemnity & Guarantee)",
              subtitle: "Surety Rights, Discharge of Surety & Bailment Ratios",
              level: "CA Intermediate",
              subject: "Corporate & Other Laws",
              chapter: "Special Contracts: Indemnity & Guarantee",
              time_limit_minutes: 25,
              total_marks: 25,
              positive_marks: 2,
              negative_marks: 0.5,
              is_free: 0,
              question_count: 12,
              status: "PUBLISHED",
            },
          ]);
        }

        const lRes = await apiRequest<{ success: boolean; data: LeaderboardItem[] }>("/api/leaderboard");
        if (lRes && lRes.success && Array.isArray(lRes.data)) {
          setLeaderboardList(lRes.data);
        } else {
          // Fallback static leaderboard
          setLeaderboardList([
            {
              rank: 1,
              badge: "GOLD",
              attempt_id: "att-001",
              quiz_id: "quiz-companies-act-1",
              quiz_title: "Companies Act 2013: Management & Administration",
              candidate_name: "Candidate A. Sharma",
              student_id: "LK-STU-9921",
              score: 30,
              total_marks: 30,
              accuracy: 100,
              time_taken_seconds: 480,
              created_at: "2026-09-30T10:00:00Z",
            },
            {
              rank: 2,
              badge: "SILVER",
              attempt_id: "att-002",
              quiz_id: "quiz-companies-act-1",
              quiz_title: "Companies Act 2013: Management & Administration",
              candidate_name: "Candidate R. Verma",
              student_id: "LK-STU-8842",
              score: 28,
              total_marks: 30,
              accuracy: 93,
              time_taken_seconds: 520,
              created_at: "2026-09-30T11:15:00Z",
            },
            {
              rank: 3,
              badge: "BRONZE",
              attempt_id: "att-003",
              quiz_id: "quiz-companies-act-1",
              quiz_title: "Companies Act 2013: Management & Administration",
              candidate_name: "Candidate P. Kulkarni",
              student_id: "LK-STU-7721",
              score: 26,
              total_marks: 30,
              accuracy: 87,
              time_taken_seconds: 610,
              created_at: "2026-09-30T12:00:00Z",
            },
          ]);
        }
      } catch (err) {
        console.error("Dashboard init error:", err);
      }
    }
    loadData();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStartQuiz = (quizId: string) => {
    setSelectedQuizIdForTaking(quizId);
    setQuizModalOpen(true);
  };

  const handleSubmitDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim()) return;
    const newDoubt: DoubtItem = {
      id: `dbt-${Date.now()}`,
      subject: "Companies Act 2013",
      section: doubtSection,
      question: doubtText,
      status: "Under Review",
      date: "Just now",
      facultyAnswer: "Your legal doubt has been submitted to The Law Kaksha Academic Board. A senior corporate law evaluator will post the statutory analysis within 4 to 6 working hours.",
    };
    setDoubtsList([newDoubt, ...doubtsList]);
    setDoubtText("");
    triggerToast("Doubt submitted successfully to Academic Desk.");
  };

  const filteredLibrary = ALL_STUDY_ITEMS.filter((item) => {
    if (libraryFilter !== "all" && item.type !== libraryFilter) return false;
    if (searchQuery.trim()) {
      return (
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A192F] flex flex-col antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A192F] text-white px-5 py-3 rounded-lg shadow-lg border border-slate-700 text-sm font-medium flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar - Clean Matte Design */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 shrink-0 flex flex-col">
          {/* Logo & Platform Info */}
          <div className="p-4 border-b border-slate-200">
            <Link href="/" className="inline-block">
              <LawKakshaLogo size="sm" showTagline={false} />
            </Link>
            <div className="mt-2.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 flex items-center justify-between">
              <span>Student Portal</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="System Online" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
            {[
              { id: "home", label: "Overview", icon: Home },
              { id: "library", label: "My Library & Vault", icon: BookOpen },
              { id: "quizzes", label: "Quizzes & Tests", icon: Award, badge: quizzesList.length ? `${quizzesList.length}` : undefined },
              { id: "leaderboard", label: "All-India Ranks", icon: BarChart3 },
              { id: "curricula", label: "Curricula & Modules", icon: Layers },
              { id: "live", label: "Live Masterclasses", icon: Video },
              { id: "schedule", label: "Study Timetable", icon: Calendar },
              { id: "invoices", label: "Orders & Invoices", icon: CreditCard },
              { id: "doubts", label: "Doubt Desk", icon: HelpCircle, badge: doubtsList.length ? `${doubtsList.length}` : undefined },
              { id: "security", label: "Device & Security", icon: ShieldCheck },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#0A192F] text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Student Status Card in Sidebar */}
          <div className="p-3 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#005A9C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                {student.avatarInitials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate">{student.name}</p>
                <p className="text-[10px] text-slate-500 font-mono truncate">{student.rollNumber}</p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
              <span>{student.isEnrolled ? "Enrolled Candidate" : "Free Trial Mode"}</span>
              <button
                onClick={() => {
                  setStudent((prev) => ({ ...prev, isEnrolled: !prev.isEnrolled }));
                  triggerToast(
                    student.isEnrolled ? "Switched to Free Account preview." : "Switched to Enrolled Candidate mode."
                  );
                }}
                className="text-[#005A9C] font-semibold hover:underline cursor-pointer"
              >
                Switch Mode
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Top Header Bar */}
          <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-base sm:text-lg font-bold text-[#0A192F]">
                {activeNav === "home" && "Student Dashboard Overview"}
                {activeNav === "library" && "My Study Vault & Book Shelf"}
                {activeNav === "quizzes" && "Timed ICAI Mock Tests & Case Scenarios"}
                {activeNav === "leaderboard" && "All-India Candidate Leaderboard"}
                {activeNav === "curricula" && "Syllabus Tracker & Section Index"}
                {activeNav === "live" && "Live Case Study Masterclasses"}
                {activeNav === "schedule" && "Exam Timetable & Daily Study Checklist"}
                {activeNav === "invoices" && "Tax Invoices & Dispatch Orders"}
                {activeNav === "doubts" && "Academic Doubt Clearance Desk"}
                {activeNav === "security" && "Hardware ID & DRM Protection"}
              </h1>
              <p className="text-xs text-slate-500">
                Target: {student.targetExam}
              </p>
            </div>

            {/* Top Search & Actions */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter search query..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005A9C] w-48 sm:w-64"
                />
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md text-xs font-semibold text-[#005A9C]">
                <Clock className="w-3.5 h-3.5" />
                <span>{student.examCountdownDays} Days to ICAI Exam</span>
              </div>
            </div>
          </header>

          {/* Canvas Body */}
          <div className="p-6 space-y-6 flex-1">
            {/* 1. OVERVIEW / HOME TAB */}
            {activeNav === "home" && (
              <div className="space-y-6">
                {/* 4 Matte Stat Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-xs font-medium text-slate-500 block">Current Daily Streak</span>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-[#0A192F]">{student.streakDays} Days</span>
                      <Flame className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Consistent study record</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-xs font-medium text-slate-500 block">Unlocked Study Materials</span>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-[#0A192F]">{unlockedItemIds.length} / {ALL_STUDY_ITEMS.length}</span>
                      <BookOpen className="w-5 h-5 text-[#005A9C]" />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">Full Codex access ready</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-xs font-medium text-slate-500 block">All-India Rank Position</span>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-[#0A192F]">Top 5%</span>
                      <Award className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">National Percentile: 95.8%</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-xs font-medium text-slate-500 block">Hardware DRM Binding</span>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-sm font-bold text-emerald-700">Verified Secure</span>
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">Single device active</span>
                  </div>
                </div>

                {/* Main Feature Highlight Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Active Course Codex Progress */}
                  <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[11px] font-bold text-[#005A9C] uppercase tracking-wider block">
                          Current Active Module
                        </span>
                        <h2 className="text-base font-bold text-[#0A192F] mt-0.5">
                          Companies Act 2013 (Management, Administration & Audit)
                        </h2>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-blue-50 text-[#005A9C] text-xs font-bold font-mono">
                        72% Completed
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#005A9C] h-full rounded-full" style={{ width: "72%" }} />
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      You are currently revising Chapter 7 (Management &amp; Administration, Sections 88 to 122). Complete the 15-question case scenario drill to maintain your streak.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedBookForReader({
                            id: "book-vol-1",
                            title: "Volume 1: CA Corporate Law Master Codex (2026-2027)",
                            subject: "Companies Act 2013 (Sections 1 to 148)",
                            pages: "540 Pages",
                            fileSize: "19.2 MB",
                          });
                          setReaderOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#0A192F] hover:bg-[#005A9C] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Open Codex Reader</span>
                      </button>

                      <button
                        onClick={() => handleStartQuiz(quizzesList[0]?.id || "quiz-companies-act-1")}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-50 hover:bg-blue-100 text-[#005A9C] border border-blue-200 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Play className="w-4 h-4" />
                        <span>Take Chapter Quiz</span>
                      </button>

                      <button
                        onClick={() => setVideoModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Video className="w-4 h-4" />
                        <span>Watch Masterclass</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Notice Board */}
                  <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-[#0A192F] flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#005A9C]" />
                        <span>Academic Announcements</span>
                      </h3>
                      <div className="mt-3 space-y-3">
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                          <p className="text-xs font-bold text-slate-800">ICAI Nov 2026 RTP Released</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            All statutory amendments for Companies Act included in Volume 1.
                          </p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                          <p className="text-xs font-bold text-slate-800">Sunday Live Case Study Session</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Focus: Section 185 Loans to Directors &amp; Section 186 Investments.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveNav("schedule")}
                      className="w-full py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer text-center"
                    >
                      View Full Schedule
                    </button>
                  </div>
                </div>

                {/* Leaderboard Podium Preview */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#0A192F]">All-India Top Performers (Mock Drills)</h3>
                      <p className="text-xs text-slate-500">Live rankings based on accuracy, score &amp; completion speed</p>
                    </div>
                    <button
                      onClick={() => setActiveNav("leaderboard")}
                      className="text-xs font-semibold text-[#005A9C] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Full Leaderboard</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                    {leaderboardList.slice(0, 3).map((lb) => (
                      <div
                        key={lb.rank}
                        className={`p-4 rounded-xl border ${
                          lb.rank === 1
                            ? "bg-amber-50/50 border-amber-200"
                            : lb.rank === 2
                            ? "bg-slate-50 border-slate-200"
                            : "bg-orange-50/40 border-orange-200"
                        } flex items-center gap-3.5`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center shrink-0 ${
                            lb.rank === 1
                              ? "bg-amber-500 text-white"
                              : lb.rank === 2
                              ? "bg-slate-400 text-white"
                              : "bg-amber-700 text-white"
                          }`}
                        >
                          #{lb.rank}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">{lb.candidate_name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            Score: {lb.score}/{lb.total_marks} ({lb.accuracy}%)
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. MY LIBRARY & VAULT TAB */}
            {activeNav === "library" && (
              <div className="space-y-6">
                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="inline-flex p-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium">
                    {[
                      { id: "all", label: "All Items" },
                      { id: "book", label: "Books & Question Banks" },
                      { id: "mcq", label: "MCQ Drills" },
                      { id: "video", label: "Video Classes" },
                      { id: "evaluation", label: "Test Series" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setLibraryFilter(tab.id as any)}
                        className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                          libraryFilter === tab.id
                            ? "bg-[#0A192F] text-white font-semibold"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <span className="text-xs text-slate-500">
                    Showing {filteredLibrary.length} study resources
                  </span>
                </div>

                {/* Library Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLibrary.map((item) => {
                    const isUnlocked = unlockedItemIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between"
                      >
                        <div>
                          {/* Card Header & Badge */}
                          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#005A9C] border border-blue-100">
                              {item.badge}
                            </span>
                            <span className="text-xs text-slate-500">{item.pagesOrDuration}</span>
                          </div>

                          {/* Body */}
                          <div className="p-4 space-y-3">
                            <h3 className="text-sm font-bold text-[#0A192F] leading-snug">
                              {item.title}
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {item.description}
                            </p>

                            <div className="space-y-1.5 pt-1">
                              {item.highlights.map((h, hIdx) => (
                                <div key={hIdx} className="flex items-center gap-2 text-[11px] text-slate-600">
                                  <Check className="w-3.5 h-3.5 text-[#005A9C] shrink-0" />
                                  <span className="truncate">{h}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Card Action Footer */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
                          {isUnlocked ? (
                            <div className="w-full flex items-center justify-between gap-2">
                              <button
                                onClick={() => {
                                  if (item.type === "video") {
                                    setVideoModalOpen(true);
                                  } else if (item.type === "evaluation") {
                                    setMainsEvalModalOpen(true);
                                  } else {
                                    setSelectedBookForReader({
                                      id: item.id,
                                      title: item.title,
                                      subject: item.subtitle,
                                      pages: item.pagesOrDuration,
                                      fileSize: "18.4 MB",
                                    });
                                    setReaderOpen(true);
                                  }
                                }}
                                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-md bg-[#0A192F] hover:bg-[#005A9C] text-white text-xs font-semibold transition-colors cursor-pointer"
                              >
                                <Unlock className="w-3.5 h-3.5" />
                                <span>{item.type === "video" ? "Watch Video" : item.type === "evaluation" ? "Open Desk" : "Open Reader"}</span>
                              </button>

                              {item.isPhysical && (
                                <button
                                  onClick={() => setTrackingModalOpen(true)}
                                  className="p-2 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
                                  title="Track Courier Delivery"
                                >
                                  <Truck className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="w-full flex items-center justify-between gap-2">
                              <button
                                onClick={() => {
                                  setSampleBookId(item.sampleBookId || "ca-inter");
                                  setSamplePrice(item.price);
                                  setSampleModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1 py-2 px-3 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Preview</span>
                              </button>

                              <button
                                onClick={() => {
                                  addToCart({
                                    id: item.id,
                                    title: item.title,
                                    format: item.type === "book" ? "combo" : "pdf",
                                    category: "CA Intermediate",
                                    price: item.price,
                                    originalPrice: item.originalPrice,
                                    badge: item.badge,
                                  });
                                  setIsCartOpen(true);
                                }}
                                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-md bg-[#005A9C] hover:bg-[#00487D] text-white text-xs font-semibold transition-colors cursor-pointer"
                              >
                                <Lock className="w-3.5 h-3.5" />
                                <span>Enroll ₹{item.price}</span>
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

            {/* 3. QUIZZES & TESTS TAB */}
            {activeNav === "quizzes" && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#0A192F]">ICAI Pattern Timed MCQ Practice Drills</h2>
                    <p className="text-xs text-slate-500">
                      Standard format: +2 marks for correct answer, -0.5 negative marking per ICAI guidelines.
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded bg-blue-50 text-[#005A9C] border border-blue-200">
                    {quizzesList.length} Active Drills Available
                  </span>
                </div>

                <div className="space-y-4">
                  {quizzesList.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                    >
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                            {quiz.level}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#005A9C]">
                            {quiz.chapter}
                          </span>
                          {quiz.is_free === 1 && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Free Trial
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-[#0A192F]">{quiz.title}</h3>
                        <p className="text-xs text-slate-500">{quiz.subtitle}</p>

                        <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {quiz.time_limit_minutes} Minutes
                          </span>
                          <span>•</span>
                          <span>{quiz.question_count} Questions</span>
                          <span>•</span>
                          <span>{quiz.total_marks} Marks</span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <button
                          onClick={() => handleStartQuiz(quiz.id)}
                          className="px-5 py-2.5 rounded-md bg-[#005A9C] hover:bg-[#00487D] text-white text-xs font-semibold shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <Play className="w-4 h-4" />
                          <span>Start Timed Drill</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. ALL-INDIA LEADERBOARD TAB */}
            {activeNav === "leaderboard" && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#0A192F]">National All-India Candidate Hall of Fame</h2>
                    <p className="text-xs text-slate-500">Live rankings updated across all registered Chartered Accountancy candidates.</p>
                  </div>
                  <div className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded text-xs font-semibold">
                    ICAI Evaluation Matrix Active
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Rank</th>
                          <th className="py-3 px-4">Candidate Name</th>
                          <th className="py-3 px-4">Quiz / Module Title</th>
                          <th className="py-3 px-4">Score</th>
                          <th className="py-3 px-4">Accuracy</th>
                          <th className="py-3 px-4">Time Taken</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {leaderboardList.map((row) => (
                          <tr key={row.rank} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-4 font-bold">
                              <span
                                className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                  row.rank === 1
                                    ? "bg-amber-400 text-white"
                                    : row.rank === 2
                                    ? "bg-slate-300 text-slate-800"
                                    : row.rank === 3
                                    ? "bg-amber-600 text-white"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {row.rank}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-900">{row.candidate_name}</td>
                            <td className="py-3.5 px-4 text-slate-600">{row.quiz_title}</td>
                            <td className="py-3.5 px-4 font-bold text-[#005A9C]">
                              {row.score} / {row.total_marks}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold font-mono">
                                {row.accuracy}%
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-500">
                              {Math.floor(row.time_taken_seconds / 60)}m {row.time_taken_seconds % 60}s
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 5. CURRICULA & MODULES TAB */}
            {activeNav === "curricula" && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <h2 className="text-sm font-bold text-[#0A192F]">ICAI Corporate &amp; Other Laws Syllabus Tracker</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Structured mapping of all statutory sections, MCA amendment notifications, and study units.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      part: "Part I: Companies Act, 2013 (70 Marks)",
                      chapters: [
                        { name: "Chapter 1: Preliminary (Sec 1-2)", done: true },
                        { name: "Chapter 2: Incorporation of Company (Sec 3-22)", done: true },
                        { name: "Chapter 3: Prospectus and Allotment (Sec 23-42)", done: true },
                        { name: "Chapter 4: Share Capital and Debentures (Sec 43-72)", done: true },
                        { name: "Chapter 5: Acceptance of Deposits (Sec 73-76A)", done: true },
                        { name: "Chapter 6: Registration of Charges (Sec 77-87)", done: true },
                        { name: "Chapter 7: Management and Administration (Sec 88-122)", done: false },
                        { name: "Chapter 8: Declaration of Dividend (Sec 123-127)", done: false },
                        { name: "Chapter 9: Accounts of Companies (Sec 128-138)", done: false },
                        { name: "Chapter 10: Audit and Auditors (Sec 139-148)", done: false },
                        { name: "Chapter 11: Companies Incorporated Outside India", done: false },
                      ],
                    },
                    {
                      part: "Part II: Other Laws (30 Marks)",
                      chapters: [
                        { name: "The General Clauses Act, 1897", done: true },
                        { name: "Interpretation of Statutes, Deeds and Documents", done: true },
                        { name: "The Foreign Exchange Management Act, 1999 (FEMA)", done: false },
                        { name: "The Limited Liability Partnership Act, 2008 (LLP)", done: false },
                      ],
                    },
                  ].map((group, gIdx) => (
                    <div key={gIdx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                      <h3 className="text-xs font-bold text-[#005A9C] uppercase tracking-wider pb-2 border-b border-slate-100">
                        {group.part}
                      </h3>
                      <div className="space-y-2">
                        {group.chapters.map((ch, cIdx) => (
                          <div
                            key={cIdx}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 transition-colors text-xs"
                          >
                            <span className="text-slate-800 font-medium">{ch.name}</span>
                            {ch.done ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                                Completed
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold">
                                In Progress
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. LIVE MASTERCLASSES TAB */}
            {activeNav === "live" && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#0A192F]">Live Interactive Legal Masterclasses</h2>
                    <p className="text-xs text-slate-500">Live problem-solving sessions and past session archive.</p>
                  </div>
                  <button
                    onClick={() => setVideoModalOpen(true)}
                    className="px-4 py-2 rounded-md bg-[#005A9C] hover:bg-[#00487D] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4" />
                    <span>Launch Classroom Player</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Live Masterclass: Sec 135 CSR Ratios & Penalty Case Laws",
                      date: "Upcoming • Sunday, 10:00 AM",
                      duration: "90 Minutes",
                      status: "SCHEDULED",
                    },
                    {
                      title: "Archive: Section 185 Loans to Directors & Inter-Corporate Loans",
                      date: "Completed • Recorded HD Available",
                      duration: "75 Minutes",
                      status: "RECORDED",
                    },
                    {
                      title: "Archive: Statutory Presumptions in General Clauses Act 1897",
                      date: "Completed • Recorded HD Available",
                      duration: "60 Minutes",
                      status: "RECORDED",
                    },
                    {
                      title: "Live Masterclass: Examiner Drafting Workshop (Descriptive Answers)",
                      date: "Upcoming • Wednesday, 7:00 PM",
                      duration: "120 Minutes",
                      status: "SCHEDULED",
                    },
                  ].map((sess, sIdx) => (
                    <div key={sIdx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            sess.status === "SCHEDULED"
                              ? "bg-blue-50 text-[#005A9C] border border-blue-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {sess.status}
                        </span>
                        <span className="text-xs text-slate-500">{sess.duration}</span>
                      </div>
                      <h3 className="text-sm font-bold text-[#0A192F]">{sess.title}</h3>
                      <p className="text-xs text-slate-500">{sess.date}</p>
                      <button
                        onClick={() => setVideoModalOpen(true)}
                        className="w-full py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer text-center"
                      >
                        {sess.status === "SCHEDULED" ? "Add to Calendar" : "Watch Recording"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. STUDY TIMETABLE TAB */}
            {activeNav === "schedule" && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <h2 className="text-sm font-bold text-[#0A192F]">60-Day ICAI Examination Revision Schedule</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Recommended daily discipline for scoring 70+ in CA Law papers.
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs divide-y divide-slate-100">
                  {[
                    { day: "Day 1 - 10", topic: "Companies Act Sections 1 to 72 (Incorporation, Prospectus, Capital & Debentures)", status: "Completed" },
                    { day: "Day 11 - 25", topic: "Companies Act Sections 73 to 122 (Deposits, Charges, Management & AGMs)", status: "Completed" },
                    { day: "Day 26 - 38", topic: "Companies Act Sections 123 to 148 (Dividends, Accounts, CSR & Audit)", status: "In Progress" },
                    { day: "Day 39 - 48", topic: "Other Laws (General Clauses Act 1897 & Interpretation of Statutes)", status: "Pending" },
                    { day: "Day 49 - 55", topic: "Foreign Exchange Management Act 1999 (FEMA) & LLP Act 2008", status: "Pending" },
                    { day: "Day 56 - 60", topic: "Full 100-Mark Model Exam Mock Papers (3 Rounds)", status: "Pending" },
                  ].map((sch, idx) => (
                    <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <span className="font-bold text-[#005A9C] font-mono block">{sch.day}</span>
                        <p className="text-slate-800 font-medium">{sch.topic}</p>
                      </div>
                      <span
                        className={`self-start sm:self-center px-2.5 py-1 rounded text-[11px] font-bold ${
                          sch.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : sch.status === "In Progress"
                            ? "bg-blue-50 text-[#005A9C] border border-blue-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {sch.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. ORDERS & INVOICES TAB */}
            {activeNav === "invoices" && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#0A192F]">GST Tax Invoices &amp; Physical Dispatches</h2>
                    <p className="text-xs text-slate-500">Official tax invoices and courier tracking records.</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs divide-y divide-slate-100">
                  {[
                    {
                      orderId: "LK-ORD-2026-9901",
                      item: "Volume 1 & 2 Physical Book Combo + Digital Codex Access",
                      date: "24 Sep 2026",
                      amount: 498,
                      taxGst: "₹89.64 (18% GST)",
                      status: "Dispatched",
                      courier: "Delhivery Express (AWB: DEL-88421092)",
                    },
                    {
                      orderId: "LK-ORD-2026-8812",
                      item: "ICAI Case Scenarios & 30-Mark MCQ Practice Bank",
                      date: "12 Sep 2026",
                      amount: 249,
                      taxGst: "₹44.82 (18% GST)",
                      status: "Delivered",
                      courier: "BlueDart Express (AWB: BLU-90214811)",
                    },
                  ].map((inv, idx) => (
                    <div key={idx} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#005A9C]">{inv.orderId}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {inv.status}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-800">{inv.item}</h3>
                        <p className="text-xs text-slate-500">
                          Ordered on {inv.date} • {inv.courier}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-base font-bold text-[#0A192F] block">₹{inv.amount}</span>
                          <span className="text-[10px] text-slate-400">{inv.taxGst}</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedInvoice(inv);
                            triggerToast("Generating printable GST receipt...");
                          }}
                          className="px-3.5 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. DOUBT DESK TAB */}
            {activeNav === "doubts" && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <h2 className="text-sm font-bold text-[#0A192F]">Academic Legal Doubt Clearance Desk</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ask any statutory interpretation or case study question. Evaluated directly by the Academic Board.
                  </p>
                </div>

                {/* Submit New Doubt Form */}
                <form onSubmit={handleSubmitDoubt} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-[#005A9C] uppercase tracking-wider">Submit New Legal Query</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Select Act / Section</label>
                      <select
                        value={doubtSection}
                        onChange={(e) => setDoubtSection(e.target.value)}
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:border-[#005A9C]"
                      >
                        <option value="Companies Act 2013 - Section 135 (CSR)">Companies Act 2013 - Section 135 (CSR)</option>
                        <option value="Companies Act 2013 - Section 185 (Loans to Directors)">Companies Act 2013 - Section 185 (Loans to Directors)</option>
                        <option value="Companies Act 2013 - Section 186 (Investments)">Companies Act 2013 - Section 186 (Investments)</option>
                        <option value="General Clauses Act 1897 - Section 6 (Repeal)">General Clauses Act 1897 - Section 6 (Repeal)</option>
                        <option value="Indian Contract Act 1872 - Section 124 (Indemnity)">Indian Contract Act 1872 - Section 124 (Indemnity)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Your Question / Doubt Details</label>
                    <textarea
                      rows={3}
                      value={doubtText}
                      onChange={(e) => setDoubtText(e.target.value)}
                      placeholder="Enter legal doubt details, case study facts or specific statutory query..."
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005A9C]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-md bg-[#005A9C] hover:bg-[#00487D] text-white text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Query to Academic Board</span>
                  </button>
                </form>

                {/* Submitted Doubts List */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Submitted Questions</h3>
                  {doubtsList.map((dbt) => (
                    <div key={dbt.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#005A9C]">{dbt.section}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400">{dbt.date}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              dbt.status === "Resolved"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {dbt.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs font-medium text-slate-900">{dbt.question}</p>

                      {dbt.facultyAnswer && (
                        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                          <span className="font-bold text-slate-900 block">Faculty Statutory Opinion:</span>
                          <p className="leading-relaxed">{dbt.facultyAnswer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 10. DEVICE & DRM SECURITY TAB */}
            {activeNav === "security" && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <h2 className="text-sm font-bold text-[#0A192F]">Single-Device DRM Hardware Binding Status</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    To prevent illicit PDF dumping and protect institutional copyright, your student license is bound to one hardware device.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4 max-w-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Current Bound Hardware</h3>
                      <p className="text-xs text-slate-500">{student.deviceBound}</p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 space-y-2 text-xs text-slate-600">
                    <p>• Watermarking with Roll No ({student.rollNumber}) and IP is applied on all viewing sessions.</p>
                    <p>• Only 1 device transfer request is permitted per academic semester.</p>
                  </div>

                  <button
                    onClick={() => triggerToast("Hardware unbind request submitted to Admin Desk.")}
                    className="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Request Device Unbind / Migration
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODALS */}
      {/* 1. Timed Quiz Taking Modal */}
      {selectedQuizIdForTaking && (
        <QuizTakingModal
          isOpen={quizModalOpen}
          onClose={() => setQuizModalOpen(false)}
          quizId={selectedQuizIdForTaking}
          candidateName={student.name}
          studentId={student.rollNumber}
          onComplete={(res?: QuizResult) => {
            if (res) {
              triggerToast(`Drill completed! Scored ${res.score}/${res.total_marks} (${res.accuracy}% accuracy)`);
            } else {
              triggerToast("Drill completed!");
            }
          }}
        />
      )}

      {/* 2. Sample Chapter Reader Modal */}
      <EnhancedSampleChapterModal
        isOpen={sampleModalOpen}
        onClose={() => setSampleModalOpen(false)}
        bookTitle="The Law Kaksha Smart Revision Codex"
        bookId={sampleBookId}
        bookPrice={samplePrice}
      />

      {/* 3. Secure DRM PDF Reader Modal */}
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

      {/* 4. Video Masterclass Player Modal */}
      <MasterclassVideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        courseTitle="CA Corporate Law Masterclass Series (2026-2027)"
        activeLesson={DEFAULT_LESSON}
        studentName={student.name}
        rollNumber={student.rollNumber}
      />

      {/* 5. Mains Evaluation Desk Modal */}
      <MainsEvaluationDeskModal
        isOpen={mainsEvalModalOpen}
        onClose={() => setMainsEvalModalOpen(false)}
        studentName={student.name}
        rollNumber={student.rollNumber}
      />

      {/* 6. Physical Courier Tracking Modal */}
      {trackingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0A192F] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#005A9C]" />
                <span>Live Courier Tracking</span>
              </h3>
              <button
                onClick={() => setTrackingModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <p className="font-bold text-slate-900">Delhivery Express Surface</p>
              <p className="font-mono text-slate-500">AWB: DEL-88421092 • Volume 1 &amp; 2 Books</p>
            </div>

            {/* Timeline */}
            <div className="space-y-3 pt-2 text-xs">
              {[
                { time: "28 Sep, 02:30 PM", text: "Out for Delivery at Destination Hub", done: true },
                { time: "26 Sep, 08:15 PM", text: "In Transit from Central Warehouse", done: true },
                { time: "24 Sep, 11:00 AM", text: "Dispatched from The Law Kaksha Logistics Center", done: true },
                { time: "24 Sep, 09:30 AM", text: "Order Packed & Shipping Label Generated", done: true },
              ].map((step, sIdx) => (
                <div key={sIdx} className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">{step.text}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setTrackingModalOpen(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 7. Printable GST Receipt Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-[#0A192F]">Tax Invoice / Official Receipt</h3>
                <p className="text-[11px] font-mono text-slate-500">{selectedInvoice.orderId}</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-800">{student.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Roll Number:</span>
                <span className="font-mono text-slate-800">{student.rollNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Item Purchased:</span>
                <span className="font-medium text-slate-800 text-right">{selectedInvoice.item}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm">
                <span>Total Amount Paid (Incl. GST):</span>
                <span className="text-[#005A9C]">₹{selectedInvoice.amount}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-[#005A9C] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Tax Invoice</span>
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
