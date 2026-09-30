"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  Award,
  Truck,
  Users,
  BookOpen,
  Video,
  Layers,
  FileText,
  HelpCircle,
  Percent,
  ShieldCheck,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Printer,
  X,
  Send,
  Eye,
  Lock,
  Unlock,
  RotateCcw,
  BarChart3,
  Calendar,
  DollarSign,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";
import { LawKakshaLogo } from "@/components/LawKakshaLogo";
import { AdminDispatchSlipModal, DispatchOrder } from "@/components/AdminDispatchSlipModal";
import { apiRequest } from "@/lib/api";

// Product / Course Interface
interface ProductItem {
  id: string;
  title: string;
  type: "book" | "course" | "mcq" | "evaluation";
  category: string;
  format: string;
  price: number;
  originalPrice: number;
  pagesOrHours: string;
  stockOrSeats: string;
  status: "Active" | "Draft" | "Archived";
  features: string[];
}

// Student User Interface
interface StudentItem {
  id: string;
  student_id: string;
  name: string;
  email: string;
  phone: string;
  target_exam: string;
  is_active: number;
  deviceStatus: string;
  device: string;
  enrolledPlan: string;
}

// Academic Batch Interface
interface AcademicBatch {
  id: string;
  name: string;
  level: string;
  target_attempt: string;
  status: "ACTIVE" | "UPCOMING" | "COMPLETED";
  enrolled_count: number;
  schedule: string;
}

// Live Session Interface
interface LiveSession {
  id: string;
  batch_name: string;
  topic: string;
  date: string;
  time: string;
  duration_minutes: number;
  meeting_link: string;
  status: "UPCOMING" | "LIVE" | "COMPLETED";
}

// Answer Copy Submission Interface
interface AnswerSubmission {
  id: string;
  studentName: string;
  studentRoll: string;
  testTitle: string;
  submittedOn: string;
  totalMarks: number;
  scoredMarks: number | null;
  status: "Pending Review" | "Evaluated & Sent";
  feedback?: string;
}

// Admin Quiz Interfaces
interface AdminQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_option_index: number;
  bare_act_citation: string;
  explanation: string;
}

interface AdminQuizItem {
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
  status: string;
  question_count?: number;
  attempts_count?: number;
  average_score?: number;
  questions?: AdminQuizQuestion[];
}

interface QuizAttemptItem {
  id: string;
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

interface DoubtTicket {
  id: string;
  studentName: string;
  studentRoll: string;
  subject: string;
  section: string;
  question: string;
  status: "Under Review" | "Resolved";
  date: string;
  facultyAnswer?: string;
}

interface CouponItem {
  id: string;
  code: string;
  discountPercent: number;
  maxUses: number;
  usedCount: number;
  expiryDate: string;
  status: "Active" | "Expired" | "Disabled";
}

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "quizzes" | "orders" | "students" | "catalog" | "batches" | "evaluations" | "doubts" | "coupons" | "system"
  >("overview");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Orders State
  const [ordersList, setOrdersList] = useState<DispatchOrder[]>([
    {
      id: "LK-ORD-2026-9901",
      customer: "Candidate A. Sharma",
      phone: "+91 98765 43210",
      item: "Volume 1 & 2 Physical Book Combo + Digital Codex Access",
      state: "Maharashtra",
      address: "Flat 402, Shanti Heights, Senapati Bapat Road, Pune",
      pincode: "411016",
      amount: "₹498",
      date: "28 Sep 2026",
      status: "Dispatched",
      tracking: "DEL-88421092",
      courier: "Delhivery Express",
    },
    {
      id: "LK-ORD-2026-9902",
      customer: "Candidate R. Verma",
      phone: "+91 98123 45678",
      item: "ICAI Case Scenarios & 30-Mark MCQ Practice Bank",
      state: "Delhi NCR",
      address: "B-12, Sector 62, Noida",
      pincode: "201309",
      amount: "₹249",
      date: "27 Sep 2026",
      status: "Processing",
      tracking: "Pending Assignment",
      courier: "BlueDart Express",
    },
    {
      id: "LK-ORD-2026-9903",
      customer: "Candidate P. Kulkarni",
      phone: "+91 97654 32109",
      item: "Volume 1: Companies Act 2013 (Sec 1-148) Physical Codex",
      state: "Karnataka",
      address: "88, 4th Cross, Indiranagar, Bengaluru",
      pincode: "560038",
      amount: "₹249",
      date: "26 Sep 2026",
      status: "Delivered",
      tracking: "DEL-88421000",
      courier: "Delhivery Express",
    },
  ]);
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);

  // Quizzes State
  const [adminQuizzes, setAdminQuizzes] = useState<AdminQuizItem[]>([
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
      status: "PUBLISHED",
      question_count: 15,
      attempts_count: 420,
      average_score: 22.4,
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
      status: "PUBLISHED",
      question_count: 10,
      attempts_count: 285,
      average_score: 15.8,
    },
  ]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttemptItem[]>([
    {
      id: "att-001",
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
      id: "att-002",
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
  ]);
  const [newQuizModalOpen, setNewQuizModalOpen] = useState(false);
  const [quizForm, setQuizForm] = useState({
    title: "",
    subtitle: "",
    level: "CA Intermediate",
    subject: "Corporate & Other Laws",
    chapter: "",
    time_limit_minutes: 20,
    positive_marks: 2,
    negative_marks: 0.5,
    is_free: 0,
  });
  const [newQuizQuestions, setNewQuizQuestions] = useState<AdminQuizQuestion[]>([
    {
      id: "q-1",
      question: "Under Section 101 of the Companies Act 2013, how many clear days notice is required for calling an Annual General Meeting (AGM)?",
      options: ["14 Clear Days", "21 Clear Days", "30 Clear Days", "7 Clear Days"],
      correct_option_index: 1,
      bare_act_citation: "Section 101(1) of the Companies Act, 2013",
      explanation: "A general meeting of a company may be called by giving not less than clear twenty-one days notice in writing or through electronic mode.",
    },
  ]);

  // Students Roster State
  const [studentsList, setStudentsList] = useState<StudentItem[]>([
    {
      id: "std-001",
      student_id: "LK-STU-084201",
      name: "Candidate A. Sharma",
      email: "candidate.sharma@lawkaksha.edu",
      phone: "+91 98765 43210",
      target_exam: "CA Intermediate (Nov 2026)",
      is_active: 1,
      deviceStatus: "Bound",
      device: "Windows PC (HWID: LK-W11-8842)",
      enrolledPlan: "Volume 1 & 2 Combo",
    },
    {
      id: "std-002",
      student_id: "LK-STU-084202",
      name: "Candidate R. Verma",
      email: "candidate.verma@lawkaksha.edu",
      phone: "+91 98123 45678",
      target_exam: "CA Intermediate (Nov 2026)",
      is_active: 1,
      deviceStatus: "Bound",
      device: "MacBook Pro M2 (HWID: LK-MAC-9912)",
      enrolledPlan: "Full Video + Question Bank",
    },
    {
      id: "std-003",
      student_id: "LK-STU-084203",
      name: "Candidate P. Kulkarni",
      email: "candidate.kulkarni@lawkaksha.edu",
      phone: "+91 97654 32109",
      target_exam: "CA Final (May 2027)",
      is_active: 1,
      deviceStatus: "Unbound Request",
      device: "Windows Laptop (HWID: LK-W10-4410)",
      enrolledPlan: "CA Final Corporate & Economic Laws",
    },
  ]);
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    phone: "",
    target_exam: "CA Intermediate (Nov 2026)",
    enrolledPlan: "Volume 1 & 2 Combo",
  });

  // Catalog State
  const [catalogList, setCatalogList] = useState<ProductItem[]>([
    {
      id: "book-vol-1",
      title: "Volume 1: Companies Act 2013 (Sec 1-148) Master Codex",
      type: "book",
      category: "CA Intermediate",
      format: "Physical Book + Digital DRM",
      price: 249,
      originalPrice: 449,
      pagesOrHours: "540 Pages",
      stockOrSeats: "1,450 Units",
      status: "Active",
      features: ["Sections 1-148 Solved", "10-Attempt RTP/MTPs", "Examiner Rubric"],
    },
    {
      id: "book-vol-2",
      title: "Volume 2: General Clauses & Interpretation of Statutes",
      type: "book",
      category: "CA Intermediate",
      format: "Physical Book + Digital DRM",
      price: 249,
      originalPrice: 449,
      pagesOrHours: "480 Pages",
      stockOrSeats: "1,200 Units",
      status: "Active",
      features: ["General Clauses Act 1897", "Interpretation Rules", "Past Questions"],
    },
    {
      id: "book-mcq",
      title: "ICAI Case Scenarios & 30-Mark MCQ Practice Bank",
      type: "mcq",
      category: "CA Intermediate",
      format: "Digital Interactive Vault",
      price: 249,
      originalPrice: 449,
      pagesOrHours: "260 Pages",
      stockOrSeats: "Unlimited Cloud",
      status: "Active",
      features: ["1,200+ Caselet MCQs", "Reasoning for 4 Options", "30-Mark Drills"],
    },
    {
      id: "video-classes",
      title: "HD Video Masterclasses: Full Law Lecture Series",
      type: "course",
      category: "CA Intermediate",
      format: "45+ Hours Streaming",
      price: 999,
      originalPrice: 1899,
      pagesOrHours: "45+ Hours",
      stockOrSeats: "500 Seats",
      status: "Active",
      features: ["32 Chapter Masterclasses", "Timestamped Notes", "1.5x Playback"],
    },
  ]);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    title: "",
    type: "book" as "book" | "course" | "mcq" | "evaluation",
    category: "CA Intermediate",
    format: "Physical Book + Digital DRM",
    price: 249,
    originalPrice: 449,
    pagesOrHours: "500 Pages",
    stockOrSeats: "1000 Units",
  });

  // Batches & Live Masterclasses State
  const [batchesList, setBatchesList] = useState<AcademicBatch[]>([
    {
      id: "batch-ca-inter-nov26",
      name: "CA Intermediate Regular Master Batch (Nov 2026)",
      level: "CA Intermediate",
      target_attempt: "November 2026",
      status: "ACTIVE",
      enrolled_count: 342,
      schedule: "Tuesday & Thursday • 07:00 PM - 09:00 PM",
    },
    {
      id: "batch-ca-final-may27",
      name: "CA Final Corporate & Economic Laws Fast Track",
      level: "CA Final",
      target_attempt: "May 2027",
      status: "UPCOMING",
      enrolled_count: 184,
      schedule: "Saturday & Sunday • 10:00 AM - 01:00 PM",
    },
  ]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([
    {
      id: "sess-101",
      batch_name: "CA Intermediate Regular Master Batch",
      topic: "Section 135 CSR Ratios & Practical Compliance Calculations",
      date: "04 Oct 2026",
      time: "07:00 PM IST",
      duration_minutes: 90,
      meeting_link: "https://classroom.lawkaksha.edu/live/session-101",
      status: "UPCOMING",
    },
    {
      id: "sess-102",
      batch_name: "CA Intermediate Regular Master Batch",
      topic: "Management & Administration (Sec 88-122) Problem Solving",
      date: "28 Sep 2026",
      time: "07:00 PM IST",
      duration_minutes: 120,
      meeting_link: "https://classroom.lawkaksha.edu/live/session-102",
      status: "COMPLETED",
    },
  ]);
  const [newSessionModalOpen, setNewSessionModalOpen] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    batch_name: "CA Intermediate Regular Master Batch",
    topic: "",
    date: "",
    time: "",
    duration_minutes: 90,
    meeting_link: "",
  });

  // Mains Evaluation Desk State
  const [evaluationsList, setEvaluationsList] = useState<AnswerSubmission[]>([
    {
      id: "eval-001",
      studentName: "Candidate A. Sharma",
      studentRoll: "LK-STU-084201",
      testTitle: "Test Paper 1: Corporate Law Descriptive (100 Marks)",
      submittedOn: "28 Sep 2026",
      totalMarks: 100,
      scoredMarks: 76,
      status: "Evaluated & Sent",
      feedback: "Strong statutory citation. Improve sub-headings under Section 135 calculation.",
    },
    {
      id: "eval-002",
      studentName: "Candidate R. Verma",
      studentRoll: "LK-STU-084202",
      testTitle: "Test Paper 2: General Clauses & Interpretation (50 Marks)",
      submittedOn: "29 Sep 2026",
      totalMarks: 50,
      scoredMarks: null,
      status: "Pending Review",
    },
  ]);
  const [evaluateModalOpen, setEvaluateModalOpen] = useState(false);
  const [activeEvalItem, setActiveEvalItem] = useState<AnswerSubmission | null>(null);
  const [evalScoreInput, setEvalScoreInput] = useState("");
  const [evalFeedbackInput, setEvalFeedbackInput] = useState("");

  // Doubts State
  const [adminDoubts, setAdminDoubts] = useState<DoubtTicket[]>([
    {
      id: "dbt-101",
      studentName: "Candidate A. Sharma",
      studentRoll: "LK-STU-084201",
      subject: "Companies Act 2013",
      section: "Section 135 (CSR)",
      question: "Is CSR spending mandatory if net profit before tax is exactly ₹5 Crore in preceding financial year?",
      status: "Resolved",
      date: "28 Sep 2026",
      facultyAnswer: "Under Section 135(1), the net profit threshold of ₹5 Crore refers to 'net profit' calculated in accordance with Section 198. If it equals or exceeds ₹5 Crore, CSR committee constitution and 2% CSR allocation become mandatory.",
    },
    {
      id: "dbt-102",
      studentName: "Candidate R. Verma",
      studentRoll: "LK-STU-084202",
      subject: "General Clauses Act 1897",
      section: "Section 6 (Effect of Repeal)",
      question: "How does repeal of a statute affect pending investigation under the repealed enactment?",
      status: "Under Review",
      date: "29 Sep 2026",
    },
  ]);
  const [replyDoubtModalOpen, setReplyDoubtModalOpen] = useState(false);
  const [selectedDoubtForReply, setSelectedDoubtForReply] = useState<DoubtTicket | null>(null);
  const [doubtReplyText, setDoubtReplyText] = useState("");

  // Coupons State
  const [couponsList, setCouponsList] = useState<CouponItem[]>([
    {
      id: "cpn-1",
      code: "ICAI2026",
      discountPercent: 15,
      maxUses: 500,
      usedCount: 248,
      expiryDate: "31 Dec 2026",
      status: "Active",
    },
    {
      id: "cpn-2",
      code: "EARLYBIRD",
      discountPercent: 20,
      maxUses: 200,
      usedCount: 198,
      expiryDate: "15 Oct 2026",
      status: "Active",
    },
    {
      id: "cpn-3",
      code: "RANKER10",
      discountPercent: 10,
      maxUses: 1000,
      usedCount: 812,
      expiryDate: "30 Nov 2026",
      status: "Active",
    },
  ]);
  const [newCouponModalOpen, setNewCouponModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: "",
    discountPercent: 15,
    maxUses: 500,
    expiryDate: "31 Dec 2026",
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers
  const handleAddQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizForm.title.trim()) return;
    const newQuiz: AdminQuizItem = {
      id: `quiz-${Date.now()}`,
      title: quizForm.title,
      subtitle: quizForm.subtitle || "ICAI Pattern Objective Caselet Drill",
      level: quizForm.level,
      subject: quizForm.subject,
      chapter: quizForm.chapter || "Corporate Law Section",
      time_limit_minutes: Number(quizForm.time_limit_minutes) || 20,
      total_marks: newQuizQuestions.length * Number(quizForm.positive_marks),
      positive_marks: Number(quizForm.positive_marks),
      negative_marks: Number(quizForm.negative_marks),
      is_free: Number(quizForm.is_free),
      status: "PUBLISHED",
      question_count: newQuizQuestions.length,
      attempts_count: 0,
      average_score: 0,
      questions: newQuizQuestions,
    };
    setAdminQuizzes([newQuiz, ...adminQuizzes]);
    setNewQuizModalOpen(false);
    triggerToast("New quiz published successfully.");
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name.trim()) return;
    const newStd: StudentItem = {
      id: `std-${Date.now()}`,
      student_id: `LK-STU-0${Math.floor(10000 + Math.random() * 90000)}`,
      name: studentForm.name,
      email: studentForm.email,
      phone: studentForm.phone,
      target_exam: studentForm.target_exam,
      is_active: 1,
      deviceStatus: "Bound",
      device: "Pending First Login",
      enrolledPlan: studentForm.enrolledPlan,
    };
    setStudentsList([newStd, ...studentsList]);
    setAddStudentModalOpen(false);
    triggerToast("Student enrolled and credentials generated.");
  };

  const handleUnbindDevice = (studentId: string) => {
    setStudentsList((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, deviceStatus: "Unbound", device: "None (Reset by Admin)" } : s))
    );
    triggerToast("Single-device hardware lock reset successfully.");
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title.trim()) return;
    const newProd: ProductItem = {
      id: `prod-${Date.now()}`,
      title: productForm.title,
      type: productForm.type,
      category: productForm.category,
      format: productForm.format,
      price: Number(productForm.price),
      originalPrice: Number(productForm.originalPrice),
      pagesOrHours: productForm.pagesOrHours,
      stockOrSeats: productForm.stockOrSeats,
      status: "Active",
      features: ["ICAI Aligned", "Official Editorial Content"],
    };
    setCatalogList([newProd, ...catalogList]);
    setAddProductModalOpen(false);
    triggerToast("Product added to catalog.");
  };

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionForm.topic.trim()) return;
    const newSess: LiveSession = {
      id: `sess-${Date.now()}`,
      batch_name: sessionForm.batch_name,
      topic: sessionForm.topic,
      date: sessionForm.date || "Tomorrow",
      time: sessionForm.time || "07:00 PM IST",
      duration_minutes: Number(sessionForm.duration_minutes) || 90,
      meeting_link: sessionForm.meeting_link || "https://classroom.lawkaksha.edu/live/new",
      status: "UPCOMING",
    };
    setLiveSessions([newSess, ...liveSessions]);
    setNewSessionModalOpen(false);
    triggerToast("Live Masterclass scheduled.");
  };

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEvalItem) return;
    setEvaluationsList((prev) =>
      prev.map((ev) =>
        ev.id === activeEvalItem.id
          ? {
              ...ev,
              scoredMarks: Number(evalScoreInput),
              status: "Evaluated & Sent",
              feedback: evalFeedbackInput,
            }
          : ev
      )
    );
    setEvaluateModalOpen(false);
    triggerToast(`Evaluation score ${evalScoreInput}/${activeEvalItem.totalMarks} sent to candidate.`);
  };

  const handleSendDoubtReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoubtForReply || !doubtReplyText.trim()) return;
    setAdminDoubts((prev) =>
      prev.map((d) =>
        d.id === selectedDoubtForReply.id
          ? { ...d, status: "Resolved", facultyAnswer: doubtReplyText }
          : d
      )
    );
    setReplyDoubtModalOpen(false);
    setDoubtReplyText("");
    triggerToast("Official statutory opinion published to candidate doubt desk.");
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code.trim()) return;
    const newCpn: CouponItem = {
      id: `cpn-${Date.now()}`,
      code: couponForm.code.toUpperCase(),
      discountPercent: Number(couponForm.discountPercent),
      maxUses: Number(couponForm.maxUses),
      usedCount: 0,
      expiryDate: couponForm.expiryDate,
      status: "Active",
    };
    setCouponsList([newCpn, ...couponsList]);
    setNewCouponModalOpen(false);
    triggerToast(`Promo code ${couponForm.code.toUpperCase()} activated.`);
  };

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
              <span>Admin Portal</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="System Online" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
            {[
              { id: "overview", label: "Overview", icon: Home },
              { id: "quizzes", label: "Quizzes & Tests", icon: Award, badge: `${adminQuizzes.length}` },
              { id: "orders", label: "Orders & Dispatches", icon: Truck, badge: `${ordersList.length}` },
              { id: "students", label: "Students & DRM", icon: Users, badge: `${studentsList.length}` },
              { id: "catalog", label: "Catalog & Books", icon: BookOpen, badge: `${catalogList.length}` },
              { id: "batches", label: "Batches & Live Classes", icon: Video },
              { id: "evaluations", label: "Mains Copy Checking", icon: FileText, badge: `${evaluationsList.filter((e) => e.status === "Pending Review").length}` },
              { id: "doubts", label: "Doubt Clearance Desk", icon: HelpCircle, badge: `${adminDoubts.filter((d) => d.status === "Under Review").length}` },
              { id: "coupons", label: "Coupons & Discounts", icon: Percent },
              { id: "system", label: "System Status & Logs", icon: ShieldCheck },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
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

          {/* Admin User Card in Sidebar */}
          <div className="p-3 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#0A192F] text-white font-bold text-xs flex items-center justify-center shrink-0">
                AD
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate">Administrator</p>
                <p className="text-[10px] text-slate-500 truncate">Academic Controller</p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
              <span className="text-emerald-700 font-semibold">100% Operational</span>
              <Link href="/student" className="text-[#005A9C] font-semibold hover:underline">
                Student View →
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Top Header Bar */}
          <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-base sm:text-lg font-bold text-[#0A192F]">
                {activeTab === "overview" && "Executive Command Center"}
                {activeTab === "quizzes" && "Quizzes, Case Scenarios & Test Engine"}
                {activeTab === "orders" && "Physical Orders & Courier Dispatch Desk"}
                {activeTab === "students" && "Enrolled Students & Single-Device DRM Registry"}
                {activeTab === "catalog" && "Course Books, Video Lectures & Catalog"}
                {activeTab === "batches" && "Academic Batches & Live Masterclasses"}
                {activeTab === "evaluations" && "Mains Descriptive Copy Checking Desk"}
                {activeTab === "doubts" && "Student Doubt Clearance Queue"}
                {activeTab === "coupons" && "Promotional Coupons & Discount Codes"}
                {activeTab === "system" && "Platform Security & System Health"}
              </h1>
              <p className="text-xs text-slate-500">
                The Law Kaksha Institutional Administration
              </p>
            </div>

            {/* Top Search & Live Pill */}
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

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-md text-xs font-semibold text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>ICAI Server Active</span>
              </div>
            </div>
          </header>

          {/* Canvas Body */}
          <div className="p-6 space-y-6 flex-1">
            {/* 1. OVERVIEW DESK */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* 4 Matte Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-xs font-medium text-slate-500 block">Total Registered Candidates</span>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-[#0A192F]">{studentsList.length * 1280 + 38400}</span>
                      <Users className="w-5 h-5 text-[#005A9C]" />
                    </div>
                    <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Active across India</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-xs font-medium text-slate-500 block">Active Quizzes &amp; Drills</span>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-[#0A192F]">{adminQuizzes.length}</span>
                      <Award className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">705 attempts today</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-xs font-medium text-slate-500 block">Orders Pending Dispatch</span>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-amber-700">
                        {ordersList.filter((o) => o.status === "Processing").length}
                      </span>
                      <Truck className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">Courier waybill ready</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-xs font-medium text-slate-500 block">Pending Doubts</span>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-[#0A192F]">
                        {adminDoubts.filter((d) => d.status === "Under Review").length}
                      </span>
                      <HelpCircle className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">Avg response: 3.2 hrs</span>
                  </div>
                </div>

                {/* Dispatch Queue + Recent Quiz Attempts */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Dispatch Action Card */}
                  <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-[#0A192F] flex items-center gap-2">
                        <Truck className="w-4 h-4 text-[#005A9C]" />
                        <span>Logistics &amp; Dispatch Desk</span>
                      </h3>
                      <button
                        onClick={() => setDispatchModalOpen(true)}
                        className="px-3 py-1.5 rounded-md bg-[#0A192F] hover:bg-[#005A9C] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Shipping Slips</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {ordersList.slice(0, 3).map((ord) => (
                        <div key={ord.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-800">{ord.customer}</p>
                            <p className="text-slate-500 text-[11px] truncate max-w-xs">{ord.item}</p>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ord.status === "Dispatched"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : ord.status === "Processing"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Quiz Attempts */}
                  <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-[#0A192F] flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span>Live Quiz Submissions</span>
                      </h3>
                      <button
                        onClick={() => setActiveTab("quizzes")}
                        className="text-xs font-semibold text-[#005A9C] hover:underline"
                      >
                        View All Submissions →
                      </button>
                    </div>

                    <div className="space-y-3">
                      {quizAttempts.slice(0, 3).map((att) => (
                        <div key={att.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-800">{att.candidate_name}</p>
                            <p className="text-slate-500 text-[11px] truncate max-w-xs">{att.quiz_title}</p>
                          </div>
                          <span className="font-bold text-[#005A9C] font-mono">
                            {att.score}/{att.total_marks} ({att.accuracy}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. QUIZZES & TESTS DESK */}
            {activeTab === "quizzes" && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#0A192F]">ICAI Timed Quizzes &amp; Objective Case Scenarios</h2>
                    <p className="text-xs text-slate-500">Create, edit, publish and evaluate chapter-wise test drills.</p>
                  </div>
                  <button
                    onClick={() => setNewQuizModalOpen(true)}
                    className="px-4 py-2 rounded-md bg-[#005A9C] hover:bg-[#00487D] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Quiz</span>
                  </button>
                </div>

                {/* Quizzes Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Quiz Title</th>
                          <th className="py-3 px-4">Level &amp; Chapter</th>
                          <th className="py-3 px-4">Questions</th>
                          <th className="py-3 px-4">Time Limit</th>
                          <th className="py-3 px-4">Attempts</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {adminQuizzes.map((q) => (
                          <tr key={q.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900">{q.title}</td>
                            <td className="py-3.5 px-4">
                              <span className="block font-semibold text-slate-700">{q.level}</span>
                              <span className="text-[11px] text-slate-500">{q.chapter}</span>
                            </td>
                            <td className="py-3.5 px-4 font-mono">{q.question_count || 15} Qs</td>
                            <td className="py-3.5 px-4 font-mono">{q.time_limit_minutes} Mins</td>
                            <td className="py-3.5 px-4 font-mono">{q.attempts_count || 0}</td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {q.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-2">
                              <button
                                onClick={() => {
                                  triggerToast("Quiz edit loaded.");
                                }}
                                className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                                title="Edit Quiz"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setAdminQuizzes(adminQuizzes.filter((x) => x.id !== q.id));
                                  triggerToast("Quiz deleted.");
                                }}
                                className="p-1.5 rounded text-rose-600 hover:bg-rose-50 cursor-pointer"
                                title="Delete Quiz"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ORDERS & DISPATCHES DESK */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#0A192F]">Physical Orders &amp; Waybill Dispatch Management</h2>
                    <p className="text-xs text-slate-500">Track shipments, generate official Delhivery/BlueDart shipping slips.</p>
                  </div>
                  <button
                    onClick={() => setDispatchModalOpen(true)}
                    className="px-4 py-2 rounded-md bg-[#0A192F] hover:bg-[#005A9C] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Batch Shipping Slips</span>
                  </button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Order ID</th>
                          <th className="py-3 px-4">Customer Name &amp; Contact</th>
                          <th className="py-3 px-4">Purchased Items</th>
                          <th className="py-3 px-4">Amount</th>
                          <th className="py-3 px-4">Courier &amp; AWB</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {ordersList.map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-[#005A9C]">{ord.id}</td>
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-slate-900">{ord.customer}</p>
                              <p className="text-[11px] text-slate-500 font-mono">{ord.phone}</p>
                            </td>
                            <td className="py-3.5 px-4 text-slate-700 max-w-xs">{ord.item}</td>
                            <td className="py-3.5 px-4 font-bold text-slate-900">{ord.amount}</td>
                            <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                              {ord.courier} • {ord.tracking}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  ord.status === "Dispatched"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : ord.status === "Processing"
                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                    : "bg-slate-100 text-slate-700 border border-slate-200"
                                }`}
                              >
                                {ord.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => {
                                  setOrdersList((prev) =>
                                    prev.map((o) =>
                                      o.id === ord.id
                                        ? { ...o, status: "Dispatched", tracking: "DEL-88421099" }
                                        : o
                                    )
                                  );
                                  triggerToast(`Order ${ord.id} marked as Dispatched.`);
                                }}
                                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold cursor-pointer"
                              >
                                Mark Dispatched
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 4. STUDENTS & DRM DESK */}
            {activeTab === "students" && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#0A192F]">Student Registry &amp; DRM Hardware ID Management</h2>
                    <p className="text-xs text-slate-500">Monitor active student licenses, reset single-device locks, add students.</p>
                  </div>
                  <button
                    onClick={() => setAddStudentModalOpen(true)}
                    className="px-4 py-2 rounded-md bg-[#005A9C] hover:bg-[#00487D] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Student</span>
                  </button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Roll Number</th>
                          <th className="py-3 px-4">Student Name</th>
                          <th className="py-3 px-4">Email &amp; Phone</th>
                          <th className="py-3 px-4">Target Exam</th>
                          <th className="py-3 px-4">Hardware Binding</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {studentsList.map((std) => (
                          <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-[#005A9C]">{std.student_id}</td>
                            <td className="py-3.5 px-4 font-bold text-slate-900">{std.name}</td>
                            <td className="py-3.5 px-4">
                              <p className="text-slate-800">{std.email}</p>
                              <p className="text-[11px] text-slate-500 font-mono">{std.phone}</p>
                            </td>
                            <td className="py-3.5 px-4 text-slate-700">{std.target_exam}</td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  std.deviceStatus === "Bound"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}
                              >
                                {std.deviceStatus}
                              </span>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate max-w-xs">{std.device}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                                Active
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-2">
                              <button
                                onClick={() => handleUnbindDevice(std.id)}
                                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold cursor-pointer"
                                title="Reset Single Device Binding"
                              >
                                Unbind HWID
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 5. CATALOG & BOOKS DESK */}
            {activeTab === "catalog" && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#0A192F]">Course Books &amp; Study Resources Catalog</h2>
                    <p className="text-xs text-slate-500">Manage pricing, inventory, digital vault codex files.</p>
                  </div>
                  <button
                    onClick={() => setAddProductModalOpen(true)}
                    className="px-4 py-2 rounded-md bg-[#005A9C] hover:bg-[#00487D] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Course / Book</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {catalogList.map((prod) => (
                    <div key={prod.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#005A9C] uppercase">
                          {prod.category}
                        </span>
                        <span className="text-xs font-bold text-slate-900">₹{prod.price}</span>
                      </div>
                      <h3 className="text-sm font-bold text-[#0A192F]">{prod.title}</h3>
                      <p className="text-xs text-slate-500">{prod.format} • {prod.pagesOrHours} • Stock: {prod.stockOrSeats}</p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          {prod.status}
                        </span>
                        <button
                          onClick={() => triggerToast(`Product ${prod.title} updated.`)}
                          className="text-xs font-semibold text-[#005A9C] hover:underline cursor-pointer"
                        >
                          Edit Pricing &amp; Stock
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. BATCHES & LIVE CLASSES DESK */}
            {activeTab === "batches" && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#0A192F]">Academic Batches &amp; Live Masterclasses</h2>
                    <p className="text-xs text-slate-500">Manage CA Intermediate &amp; CA Final academic batches and schedule live rooms.</p>
                  </div>
                  <button
                    onClick={() => setNewSessionModalOpen(true)}
                    className="px-4 py-2 rounded-md bg-[#005A9C] hover:bg-[#00487D] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Schedule Masterclass</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {batchesList.map((batch) => (
                    <div key={batch.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#005A9C]">
                          {batch.level}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {batch.enrolled_count} Candidates Enrolled
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#0A192F]">{batch.name}</h3>
                      <p className="text-xs text-slate-500">{batch.schedule}</p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          {batch.status}
                        </span>
                        <button
                          onClick={() => triggerToast(`Batch ${batch.name} schedule updated.`)}
                          className="text-xs font-semibold text-[#005A9C] hover:underline cursor-pointer"
                        >
                          Manage Batch Roster
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. MAINS EVALUATION DESK */}
            {activeTab === "evaluations" && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#0A192F]">Mains Descriptive Test Series Copy Checking Desk</h2>
                    <p className="text-xs text-slate-500">Grade handwritten student test papers using ICAI 5-pillar rubric.</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    {evaluationsList.filter((e) => e.status === "Pending Review").length} Papers Pending Evaluation
                  </span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Student Name</th>
                          <th className="py-3 px-4">Test Title</th>
                          <th className="py-3 px-4">Submitted Date</th>
                          <th className="py-3 px-4">Score</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {evaluationsList.map((ev) => (
                          <tr key={ev.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-slate-900">{ev.studentName}</p>
                              <p className="text-[11px] text-slate-500 font-mono">{ev.studentRoll}</p>
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-800">{ev.testTitle}</td>
                            <td className="py-3.5 px-4 text-slate-500">{ev.submittedOn}</td>
                            <td className="py-3.5 px-4 font-bold text-[#005A9C]">
                              {ev.scoredMarks !== null ? `${ev.scoredMarks} / ${ev.totalMarks}` : "—"}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  ev.status === "Evaluated & Sent"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}
                              >
                                {ev.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => {
                                  setActiveEvalItem(ev);
                                  setEvalScoreInput(ev.scoredMarks !== null ? String(ev.scoredMarks) : "");
                                  setEvalFeedbackInput(ev.feedback || "");
                                  setEvaluateModalOpen(true);
                                }}
                                className="px-3 py-1.5 rounded bg-[#005A9C] text-white text-xs font-semibold hover:bg-[#00487D] cursor-pointer"
                              >
                                Evaluate Paper
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 8. DOUBT DESK */}
            {activeTab === "doubts" && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#0A192F]">Student Legal Doubt Clearance Queue</h2>
                    <p className="text-xs text-slate-500">Review and answer legal interpretation questions from enrolled candidates.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {adminDoubts.map((dbt) => (
                    <div key={dbt.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 text-xs">{dbt.studentName} ({dbt.studentRoll})</span>
                          <span className="text-xs text-[#005A9C] ml-3 font-semibold">{dbt.section}</span>
                        </div>
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

                      <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {dbt.question}
                      </p>

                      {dbt.facultyAnswer && (
                        <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-xs text-slate-700">
                          <span className="font-bold text-[#005A9C] block mb-0.5">Faculty Statutory Opinion:</span>
                          <p>{dbt.facultyAnswer}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => {
                            setSelectedDoubtForReply(dbt);
                            setDoubtReplyText(dbt.facultyAnswer || "");
                            setReplyDoubtModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer"
                        >
                          {dbt.status === "Resolved" ? "Update Opinion" : "Reply to Candidate"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. COUPONS DESK */}
            {activeTab === "coupons" && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#0A192F]">Promotional Coupons &amp; Discount Codes</h2>
                    <p className="text-xs text-slate-500">Configure promotional discounts and maximum usage limits.</p>
                  </div>
                  <button
                    onClick={() => setNewCouponModalOpen(true)}
                    className="px-4 py-2 rounded-md bg-[#005A9C] hover:bg-[#00487D] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Promo Code</span>
                  </button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Coupon Code</th>
                          <th className="py-3 px-4">Discount %</th>
                          <th className="py-3 px-4">Usage Count</th>
                          <th className="py-3 px-4">Expiry Date</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {couponsList.map((cpn) => (
                          <tr key={cpn.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-[#005A9C] text-sm">{cpn.code}</td>
                            <td className="py-3.5 px-4 font-bold text-slate-900">{cpn.discountPercent}% OFF</td>
                            <td className="py-3.5 px-4 font-mono">{cpn.usedCount} / {cpn.maxUses}</td>
                            <td className="py-3.5 px-4 text-slate-500">{cpn.expiryDate}</td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {cpn.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => {
                                  setCouponsList(couponsList.filter((c) => c.id !== cpn.id));
                                  triggerToast(`Promo code ${cpn.code} deactivated.`);
                                }}
                                className="p-1.5 rounded text-rose-600 hover:bg-rose-50 cursor-pointer"
                                title="Delete Coupon"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 10. SYSTEM STATUS & LOGS DESK */}
            {activeTab === "system" && (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <h2 className="text-sm font-bold text-[#0A192F]">Platform Security &amp; Database Health</h2>
                  <p className="text-xs text-slate-500 mt-0.5">System status, DRM cryptography, daily database backup integrity.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                    <h3 className="text-xs font-bold text-[#005A9C] uppercase tracking-wider">System Services</h3>
                    <div className="space-y-2 text-xs">
                      {[
                        { name: "PostgreSQL Production DB", status: "ONLINE", uptime: "99.99%" },
                        { name: "Single-Device DRM Hardware Token Service", status: "ACTIVE", uptime: "100.0%" },
                        { name: "Live Leaderboard Score Ingestion", status: "ONLINE", uptime: "99.98%" },
                        { name: "Delhivery Logistics Webhook API", status: "CONNECTED", uptime: "99.95%" },
                      ].map((srv, idx) => (
                        <div key={idx} className="p-2.5 rounded bg-slate-50 flex items-center justify-between">
                          <span className="font-semibold text-slate-800">{srv.name}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                            {srv.status} ({srv.uptime})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                    <h3 className="text-xs font-bold text-[#005A9C] uppercase tracking-wider">Audit Actions</h3>
                    <p className="text-xs text-slate-600">Perform maintenance checks and automated database snapshot exports.</p>
                    <div className="pt-2 space-y-2">
                      <button
                        onClick={() => triggerToast("Database snapshot initiated and encrypted.")}
                        className="w-full py-2.5 rounded-md bg-[#0A192F] text-white text-xs font-semibold hover:bg-[#005A9C] transition-colors cursor-pointer"
                      >
                        Create Encrypted Backup Snapshot
                      </button>
                      <button
                        onClick={() => triggerToast("DRM token cache purged and re-indexed.")}
                        className="w-full py-2.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                      >
                        Purge Stale Hardware DRM Sessions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODALS */}
      {/* 1. Dispatch Shipping Slip Modal */}
      <AdminDispatchSlipModal
        isOpen={dispatchModalOpen}
        onClose={() => setDispatchModalOpen(false)}
        orders={ordersList}
      />

      {/* 2. Create New Quiz Modal */}
      {newQuizModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0A192F]">Create New ICAI Pattern Mock Quiz</h3>
              <button onClick={() => setNewQuizModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddQuiz} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Quiz Title</label>
                  <input
                    type="text"
                    required
                    value={quizForm.title}
                    onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                    placeholder="Enter quiz title..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#005A9C]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Chapter / Statutory Section</label>
                  <input
                    type="text"
                    required
                    value={quizForm.chapter}
                    onChange={(e) => setQuizForm({ ...quizForm, chapter: e.target.value })}
                    placeholder="Enter chapter name..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#005A9C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Time Limit (Mins)</label>
                  <input
                    type="number"
                    value={quizForm.time_limit_minutes}
                    onChange={(e) => setQuizForm({ ...quizForm, time_limit_minutes: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#005A9C]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Positive Marks</label>
                  <input
                    type="number"
                    value={quizForm.positive_marks}
                    onChange={(e) => setQuizForm({ ...quizForm, positive_marks: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#005A9C]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Free Trial Access</label>
                  <select
                    value={quizForm.is_free}
                    onChange={(e) => setQuizForm({ ...quizForm, is_free: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#005A9C]"
                  >
                    <option value={0}>Enrolled Only</option>
                    <option value={1}>Free for All</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">Question 1 Definition</span>
                <textarea
                  rows={2}
                  value={newQuizQuestions[0].question}
                  onChange={(e) => {
                    const q = [...newQuizQuestions];
                    q[0].question = e.target.value;
                    setNewQuizQuestions(q);
                  }}
                  className="w-full p-2 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:border-[#005A9C]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNewQuizModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#005A9C] text-white font-semibold rounded-md hover:bg-[#00487D] cursor-pointer"
                >
                  Publish Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add Student Modal */}
      {addStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0A192F]">Register New Candidate</h3>
              <button onClick={() => setAddStudentModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  placeholder="Enter full name..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#005A9C]"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Registered Email</label>
                <input
                  type="email"
                  required
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  placeholder="Enter registered email address..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#005A9C]"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mobile Number</label>
                <input
                  type="text"
                  required
                  value={studentForm.phone}
                  onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                  placeholder="Enter 10-digit mobile number..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#005A9C]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddStudentModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#005A9C] text-white font-semibold rounded-md hover:bg-[#00487D] cursor-pointer"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Add Product Modal */}
      {addProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0A192F]">Add Course / Book to Catalog</h3>
              <button onClick={() => setAddProductModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  placeholder="Enter book or course title..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#005A9C]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#005A9C]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#005A9C]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#005A9C] text-white font-semibold rounded-md hover:bg-[#00487D] cursor-pointer"
                >
                  Add to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Mains Evaluation Score Modal */}
      {evaluateModalOpen && activeEvalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0A192F]">Evaluate Candidate Answer Sheet</h3>
              <button onClick={() => setEvaluateModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvaluation} className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="font-bold text-slate-900">{activeEvalItem.studentName}</p>
                <p className="text-slate-500">{activeEvalItem.testTitle}</p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Marks Awarded (Out of {activeEvalItem.totalMarks})
                </label>
                <input
                  type="number"
                  required
                  value={evalScoreInput}
                  onChange={(e) => setEvalScoreInput(e.target.value)}
                  placeholder="Enter marks awarded..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#005A9C]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Evaluator Feedback Notes</label>
                <textarea
                  rows={3}
                  value={evalFeedbackInput}
                  onChange={(e) => setEvalFeedbackInput(e.target.value)}
                  placeholder="Enter detailed statutory citation and answer presentation feedback..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#005A9C]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEvaluateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#005A9C] text-white font-semibold rounded-md hover:bg-[#00487D] cursor-pointer"
                >
                  Submit Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Reply to Doubt Modal */}
      {replyDoubtModalOpen && selectedDoubtForReply && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0A192F]">Provide Official Statutory Opinion</h3>
              <button onClick={() => setReplyDoubtModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendDoubtReply} className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <p className="font-bold text-slate-900">{selectedDoubtForReply.studentName} • {selectedDoubtForReply.section}</p>
                <p className="text-slate-700">{selectedDoubtForReply.question}</p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Faculty Opinion &amp; Bare Act Citation</label>
                <textarea
                  rows={4}
                  required
                  value={doubtReplyText}
                  onChange={(e) => setDoubtReplyText(e.target.value)}
                  placeholder="Enter official statutory analysis, case law citations, and practical guidance..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#005A9C]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyDoubtModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#005A9C] text-white font-semibold rounded-md hover:bg-[#00487D] cursor-pointer"
                >
                  Publish Opinion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Create Coupon Modal */}
      {newCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0A192F]">Create Promo Discount Code</h3>
              <button onClick={() => setNewCouponModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                  placeholder="Enter coupon code (e.g. DISCOUNT20)..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#005A9C] uppercase font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Discount %</label>
                  <input
                    type="number"
                    required
                    value={couponForm.discountPercent}
                    onChange={(e) => setCouponForm({ ...couponForm, discountPercent: Number(e.target.value) })}
                    placeholder="Enter discount percentage..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#005A9C]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Max Usages</label>
                  <input
                    type="number"
                    required
                    value={couponForm.maxUses}
                    onChange={(e) => setCouponForm({ ...couponForm, maxUses: Number(e.target.value) })}
                    placeholder="Enter maximum uses..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#005A9C]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNewCouponModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#005A9C] text-white font-semibold rounded-md hover:bg-[#00487D] cursor-pointer"
                >
                  Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
