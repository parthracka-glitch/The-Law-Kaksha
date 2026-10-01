"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BookOpen, CheckCircle2, FileText, Eye, Flame,
  Bookmark, Clock, LogOut, Sparkles, ArrowRight, LayoutDashboard,
  Lock, BookMarked, Calendar, Edit3, User, Menu, X,
} from "lucide-react";
import { EnhancedSampleChapterModal } from "@/components/EnhancedSampleChapterModal";
import { SecurePdfReader } from "@/components/SecurePdfReader";
import { StudentProfileModal, StudentProfileData } from "@/components/StudentProfileModal";
import { StreakCalendarModal } from "@/components/StreakCalendarModal";

interface ChapterItem {
  id: string; name: string; code: string; weightage: string; description: string;
  units?: { unitNumber: number; title: string; pdfUrl: string; summary: string; pages: string; isSample?: boolean; }[];
  mcqCount: number; caseCount: number;
}

const CA_FOUNDATION_CHAPTERS: ChapterItem[] = [
  { id: "ca-ch1", name: "Indian Regulatory Framework", code: "Chapter 1", weightage: "5 - 10 M", description: "Overview of Indian Legal System, Sources of Law, Hierarchy of Courts, Role of Regulatory Bodies.", mcqCount: 25, caseCount: 4, units: [{ unitNumber: 1, title: "Overview of Indian Legal System & Hierarchy of Courts", pdfUrl: "/notes/ca-foundation-framework-notes.pdf", summary: "Structure of Legislative, Executive & Judiciary in India.", pages: "18 Pages" }] },
  { id: "ca-ch2", name: "The Indian Contract Act, 1872", code: "Chapter 2", weightage: "20 - 25 M", description: "Nature of Contracts, Offer & Acceptance, Consideration, Free Consent, Performance, Breach & Remedies.", mcqCount: 65, caseCount: 18, units: [{ unitNumber: 1, title: "Nature & Essentials of Valid Contract (Sec 1-10)", pdfUrl: "/notes/contract-act-unit-1.pdf", summary: "Offer, Acceptance, Intention to create Legal Relationship.", pages: "34 Pages" }, { unitNumber: 2, title: "Consideration & Capacity to Contract (Sec 11-25)", pdfUrl: "/notes/contract-act-unit-2.pdf", summary: "Minor's agreements, Doctrine of Privity of Contract.", pages: "28 Pages" }, { unitNumber: 3, title: "Free Consent, Performance & Breach of Contract", pdfUrl: "/notes/contract-act-unit-3.pdf", summary: "Coercion, Undue Influence, Fraud, Damages under Section 73.", pages: "42 Pages" }] },
  { id: "ca-ch3", name: "The Sale of Goods Act, 1930", code: "Chapter 3", weightage: "15 - 20 M", description: "Formation of Contract of Sale, Conditions & Warranties, Transfer of Ownership, Unpaid Seller Rights.", mcqCount: 45, caseCount: 12, units: [{ unitNumber: 1, title: "Formation of Contract of Sale & Subject Matter", pdfUrl: "/notes/sale-of-goods-unit-1.pdf", summary: "Sale vs Agreement to Sell, Ascertained vs Unascertained Goods.", pages: "22 Pages" }, { unitNumber: 2, title: "Conditions, Warranties & Caveat Emptor (Sec 11-17)", pdfUrl: "/notes/sale-of-goods-unit-2.pdf", summary: "Implied conditions of fitness & Priest v. Last.", pages: "26 Pages" }, { unitNumber: 3, title: "Transfer of Property & Rights of Unpaid Seller", pdfUrl: "/notes/sale-of-goods-unit-3.pdf", summary: "Nemo dat quod non habet, Lien & Stoppage in Transit.", pages: "30 Pages" }] },
  { id: "ca-ch4", name: "The Indian Partnership Act, 1932", code: "Chapter 4", weightage: "15 - 20 M", description: "General Nature of Partnership, Relations of Partners, Registration and Dissolution of Firm.", mcqCount: 50, caseCount: 14, units: [{ unitNumber: 1, title: "Unit 1: General Nature of Partnership", pdfUrl: "/notes/unit-1-general-nature-of-partnership.pdf", summary: "Definition of Partnership, Mutual Agency, True Test (Cox v. Hickman).", pages: "24 Pages (Full Sample PDF)", isSample: true }, { unitNumber: 2, title: "Unit 2: Relations of Partners", pdfUrl: "/notes/unit-2-relations-of-partners.pdf", summary: "Rights, Duties, Implied Authority, Holding Out, Minor as Beneficiary.", pages: "28 Pages (Full Sample PDF)", isSample: true }, { unitNumber: 3, title: "Unit 3: Registration and Dissolution of Firm", pdfUrl: "/notes/unit-3-registration-and-dissolution-of-firm.pdf", summary: "Effect of Non-Registration, Modes of Dissolution, Settlement of Accounts.", pages: "32 Pages (Full Sample PDF)", isSample: true }] },
  { id: "ca-ch5", name: "The Limited Liability Partnership Act, 2008", code: "Chapter 5", weightage: "5 - 10 M", description: "LLP Concept, Salient Features, Incorporation, Designated Partners, Conversion & Annual Filings.", mcqCount: 30, caseCount: 6, units: [{ unitNumber: 1, title: "LLP Architecture & Comparison with Traditional Firm", pdfUrl: "/notes/llp-act-notes.pdf", summary: "Separate legal identity, perpetual succession, Designated Partners compliance.", pages: "20 Pages" }] },
  { id: "ca-ch6", name: "The Companies Act, 2013", code: "Chapter 6", weightage: "15 - 20 M", description: "Meaning & Characteristics of Company, Corporate Veil, Types of Companies, MOA & AOA, Doctrine of Ultra Vires.", mcqCount: 55, caseCount: 15, units: [{ unitNumber: 1, title: "Essential Characteristics & Lifting of Corporate Veil", pdfUrl: "/notes/companies-act-unit-1.pdf", summary: "Salomon v. Salomon, Private vs Public vs One Person Company.", pages: "36 Pages" }, { unitNumber: 2, title: "Memorandum & Articles of Association (MOA / AOA)", pdfUrl: "/notes/companies-act-unit-2.pdf", summary: "Doctrine of Ultra Vires, Constructive Notice & Indoor Management.", pages: "30 Pages" }] },
  { id: "ca-ch7", name: "The Negotiable Instruments Act, 1881", code: "Chapter 7", weightage: "10 - 15 M", description: "Promissory Notes, Bills of Exchange, Cheques, Negotiation & Endorsement, Dishonour of Cheques.", mcqCount: 40, caseCount: 8, units: [{ unitNumber: 1, title: "Promissory Notes, Bills of Exchange & Cheques", pdfUrl: "/notes/negotiable-instruments-unit-1.pdf", summary: "Holder in Due Course, Section 138 Dishonour penalties.", pages: "26 Pages" }] },
];

const CSEET_UNITS: ChapterItem[] = [
  { id: "cs-u1", name: "Indian Contract Act, 1872", code: "Unit 1", weightage: "15 - 20 M", description: "Essentials of Contract, Offer, Acceptance, Consideration, Free Consent, Void Agreements, Remedies.", mcqCount: 45, caseCount: 6, units: [{ unitNumber: 1, title: "Contract Essentials & Types of Contracts", pdfUrl: "/notes/cseet-contract-act.pdf", summary: "Core concept notes with 40 objective questions.", pages: "24 Pages" }] },
  { id: "cs-u2", name: "Sale of Goods Act, 1930", code: "Unit 2", weightage: "10 - 15 M", description: "Contract of Sale, Conditions & Warranties, Passing of Property, Rights of Unpaid Seller.", mcqCount: 35, caseCount: 4, units: [{ unitNumber: 1, title: "Sale of Goods Principles & Caveat Emptor", pdfUrl: "/notes/cseet-sale-of-goods.pdf", summary: "Essential rules, Section 16 exceptions, unpaid seller.", pages: "20 Pages" }] },
  { id: "cs-u3", name: "Indian Partnership Act, 1932", code: "Unit 3", weightage: "10 - 15 M", description: "General Nature, Relations of Partners, Registration and Dissolution.", mcqCount: 35, caseCount: 4, units: [{ unitNumber: 1, title: "General Nature, Relations & Dissolution of Firm", pdfUrl: "/notes/unit-1-general-nature-of-partnership.pdf", summary: "Mutual agency, holding out, minor's status, effects of non-registration.", pages: "24 Pages (Sample PDF)", isSample: true }] },
  { id: "cs-u4", name: "Limited Liability Partnership Act, 2008", code: "Unit 4", weightage: "8 - 12 M", description: "LLP Features, Formation, Designated Partners, Conversion.", mcqCount: 25, caseCount: 3, units: [{ unitNumber: 1, title: "LLP Framework & Key Distinctions", pdfUrl: "/notes/cseet-llp-notes.pdf", summary: "Comparison between LLP, Company and Traditional Partnership.", pages: "16 Pages" }] },
  { id: "cs-u5", name: "Elements of Company Law", code: "Unit 5", weightage: "15 - 20 M", description: "Company Meaning, Types, Corporate Veil, MOA, AOA, Ultra Vires.", mcqCount: 50, caseCount: 8, units: [{ unitNumber: 1, title: "Company Formation & Constitutional Documents", pdfUrl: "/notes/cseet-company-law.pdf", summary: "Private vs Public Company, Section 8, Corporate Veil cases.", pages: "30 Pages" }] },
  { id: "cs-u6", name: "Negotiable Instruments Act, 1881", code: "Unit 6", weightage: "10 - 15 M", description: "Promissory Notes, Bills of Exchange, Cheques, Negotiation, Section 138.", mcqCount: 30, caseCount: 4, units: [{ unitNumber: 1, title: "Negotiable Instruments Core Concepts", pdfUrl: "/notes/cseet-negotiable-instruments.pdf", summary: "Instruments, Parties, Crossing of Cheques, Bouncing liabilities.", pages: "22 Pages" }] },
  { id: "cs-u7", name: "General Principles of Management", code: "Unit 7", weightage: "15 - 20 M", description: "Planning, Organising, Directing, Controlling, Fayol's 14 Principles, Scientific Management.", mcqCount: 50, caseCount: 6, units: [{ unitNumber: 1, title: "Management Principles, Functions & Theories", pdfUrl: "/notes/management-principles-sample-notes.pdf", summary: "Henry Fayol vs FW Taylor, Strategic Planning, Motivation Theories.", pages: "28 Pages (Sample PDF)", isSample: true }] },
  { id: "cs-u8", name: "Business Environment & Ethics", code: "Unit 8", weightage: "10 - 15 M", description: "PESTLE Analysis, Ease of Doing Business, Corporate Ethics & CSR.", mcqCount: 30, caseCount: 4, units: [{ unitNumber: 1, title: "Business Environment & Corporate Governance", pdfUrl: "/notes/cseet-business-environment.pdf", summary: "Macro/Micro factors, Ethical decision-making in business.", pages: "18 Pages" }] },
];

const WEEKLY_CASES = [
  { id: "monster-monday", day: "Monster Monday", badge: "High Difficulty", badgeColor: "bg-rose-100 text-rose-700 border-rose-200", subject: "Indian Contract Act, 1872", title: "The Anticipatory Breach & Measure of Damages", scenario: "A agreed to supply 500 MT of industrial chemicals to B at Rs.20,000/MT on 1st November. On 15th October, A informed B that he would not deliver. Market price on 15th October was Rs.22,000/MT but B waited until 1st November when market price surged to Rs.26,000/MT. B sued for Rs.30,00,000 damages. Decide the quantum of damages under Section 73.", modelAnswer: "Under Section 73 of Indian Contract Act 1872 (and Frost v. Knight), B has two options: (1) Treat contract as rescinded on 15th Oct and claim difference (Rs.2,000/MT = Rs.10 Lakhs), OR (2) Keep contract alive till 1st Nov and claim difference on date of performance (Rs.6,000/MT = Rs.30 Lakhs). Since contract was kept alive, B is entitled to Rs.30 Lakhs.", precedent: "Frost v. Knight (1872) L.R. 7 Ex. 111" },
  { id: "midweek-madness", day: "Midweek Law Madness", badge: "Statutory Trap", badgeColor: "bg-amber-100 text-amber-700 border-amber-200", subject: "Indian Partnership Act, 1932", title: "Retirement without Notice & Doctrine of Holding Out", scenario: "Karan, partner in M/s Apex Builders, retired in January but no public notice was given in the Official Gazette. In March, firm borrowed Rs.15 Lakhs from Indus Bank. Karan was unaware. Is Karan personally liable to Indus Bank?", modelAnswer: "Under Section 32(3) read with Section 28 of Indian Partnership Act 1932, a retired partner continues to be liable to third parties unless public notice is published in the Official Gazette and at least one local language newspaper. Karan is personally liable to Indus Bank under the doctrine of Holding Out.", precedent: "Scarf v. Jardine (1882) 7 App Cas 345" },
  { id: "final-boss-friday", day: "Final Boss Friday", badge: "Exam Simulation", badgeColor: "bg-violet-100 text-violet-700 border-violet-200", subject: "Companies Act, 2013", title: "Ultra Vires Borrowing & Subrogation Remedy", scenario: "A company's MOA authorizes borrowing up to Rs.1 Crore. The Directors borrowed Rs.2.5 Crores from a private financier without member approval. The entire Rs.2.5 Crores was used to pay off lawful trade debts of the company. Can the lender recover money from the company?", modelAnswer: "The loan is Ultra Vires the borrowing powers of the company and void ab initio (Ashbury Railway Carriage Co. v. Riche). However, under the equitable doctrine of Subrogation (Sinclair v. Brougham), since the money was used to discharge lawful intra-vires liabilities, the lender stands in shoes of discharged creditors and can recover the debt.", precedent: "Sinclair v. Brougham [1914] AC 398" },
];

// The 2 books available for in-web reading
const CSEET_BOOKS = [
  {
    id: "cseet-business-law",
    title: "Business Law",
    volume: "Volume 1",
    subtitle: "CSEET Paper 2 • Units 1 to 6",
    badge: "Volume 1 • 6 Acts",
    description: "Complete master study notes covering Indian Contract Act 1872, Sale of Goods Act 1930, Indian Partnership Act 1932, LLP Act 2008, Elements of Company Law 2013 & Negotiable Instruments Act 1881.",
    unitsList: [
      "Unit 1: Indian Contract Act, 1872",
      "Unit 2: Sale of Goods Act, 1930",
      "Unit 3: Indian Partnership Act, 1932",
      "Unit 4: Limited Liability Partnership Act, 2008",
      "Unit 5: Elements of Company Law (Companies Act 2013)",
      "Unit 6: Negotiable Instruments Act, 1881"
    ],
    coverImage: "/covers/vol1-codex.png",
    coverGradient: "from-violet-600 to-indigo-700",
    tagBg: "bg-violet-50 text-violet-700 border-violet-100",
    pdfUrl: "/api/pdf/cseet-business-law-full.pdf",
    totalPages: "180+ Pages",
  },
  {
    id: "cseet-management",
    title: "Business Law & Management",
    volume: "Volume 2",
    subtitle: "CSEET Paper 2 • Units 7 & 8",
    badge: "Volume 2 • Management & Ethics",
    description: "In-depth conceptual notes covering General Principles of Management (Henri Fayol's 14 Principles, F.W. Taylor Scientific Management) and Business Environment & Corporate Ethics (PESTLE analysis & CSR).",
    unitsList: [
      "Unit 7: General Principles of Management",
      "Unit 8: Business Environment & Ethics"
    ],
    coverImage: "/covers/vol2-codex.png",
    coverGradient: "from-sky-600 to-blue-700",
    tagBg: "bg-sky-50 text-sky-700 border-sky-100",
    pdfUrl: "/api/pdf/cseet-management-full.pdf",
    totalPages: "120+ Pages",
  },
];

const CA_FOUNDATION_BOOKS = [
  {
    id: "ca-foundation-business-laws",
    title: "CA Foundation Business Laws Codex",
    volume: "Volume 1",
    subtitle: "ICAI Paper 2 • 7 Chapters Complete",
    badge: "Paper 2 • 7 Acts",
    description: "Complete master curriculum notes covering Contract Act 1872, Sale of Goods Act 1930, Partnership Act 1932, LLP Act 2008, Companies Act 2013, Negotiable Instruments Act 1881 & Regulatory Framework.",
    unitsList: [
      "Chapter 1: Indian Regulatory Framework",
      "Chapter 2: The Indian Contract Act, 1872",
      "Chapter 3: The Sale of Goods Act, 1930",
      "Chapter 4: The Indian Partnership Act, 1932",
      "Chapter 5: The Limited Liability Partnership Act, 2008",
      "Chapter 6: The Companies Act, 2013",
      "Chapter 7: The Negotiable Instruments Act, 1881"
    ],
    coverImage: "/covers/vol1-codex.png",
    coverGradient: "from-amber-600 to-orange-700",
    tagBg: "bg-amber-50 text-amber-700 border-amber-100",
    pdfUrl: "/notes/unit-1-general-nature-of-partnership.pdf",
    totalPages: "250+ Pages",
  },
];

type TabType = "home" | "chapters" | "cases" | "mcqtest" | "ldr";
const NAV_ITEMS: { id: TabType; label: string; icon: any }[] = [
  { id: "home", label: "Dashboard", icon: LayoutDashboard },
  { id: "chapters", label: "Chapter Notes", icon: BookOpen },
  { id: "cases", label: "Case Studies", icon: Flame },
  { id: "mcqtest", label: "MCQ Test", icon: Sparkles },
  { id: "ldr", label: "Last Day Revision", icon: Bookmark },
];
export default function StudentDashboardPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [activeCourse, setActiveCourse] = useState<"ca" | "cs">("ca");
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [selectedChapterId, setSelectedChapterId] = useState<string>("ca-ch4");
  const [sampleModalOpen, setSampleModalOpen] = useState<boolean>(false);
  const [sampleBookTitle, setSampleBookTitle] = useState<string>("Indian Partnership Act 1932 Master Notes");
  const [sampleBookId, setSampleBookId] = useState<string>("ca-foundation");
  const [testActive, setTestActive] = useState<boolean>(false);
  const [testTimeLeft, setTestTimeLeft] = useState<number>(1800);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [testSubmitted, setTestSubmitted] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(1);
  const [studentName, setStudentName] = useState("Aarav Sharma");
  const [studentProfile, setStudentProfile] = useState<StudentProfileData>({
    name: "Aarav Sharma",
    email: "student@thelawkaksha.com",
    targetExam: "CSEET Law & Management",
    student_id: "LRK-2026-004182",
    avatarColor: "violet",
  });
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [streakModalOpen, setStreakModalOpen] = useState<boolean>(false);
  // purchased books: synced from MongoDB Atlas based on actual purchases / subscriptions
  const [purchasedBooks, setPurchasedBooks] = useState<string[]>(["cseet-business-law", "cseet-management"]);
  // live synced case studies and MCQs from MongoDB Atlas
  const [liveCases, setLiveCases] = useState<any[]>(WEEKLY_CASES);
  const [liveMcqs, setLiveMcqs] = useState<any[]>([]);
  // PDF viewer modal
  const [pdfViewer, setPdfViewer] = useState<{ open: boolean; url: string; title: string }>({ open: false, url: "", title: "" });
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const studentSession = localStorage.getItem("lawkaksha_student_session");
      const adminSession = localStorage.getItem("lawkaksha_admin_session");
      if (!studentSession && !adminSession) { setIsAuthorized(false); setIsCheckingAuth(false); router.push("/login"); return; }
      setIsAuthorized(true); setIsCheckingAuth(false);
      if (adminSession) setIsAdminUser(true);
      const params = new URLSearchParams(window.location.search);
      const courseParam = params.get("course");
      if (courseParam === "cs") { setActiveCourse("cs"); setSelectedChapterId("cs-u7"); }
      else if (courseParam === "ca") { setActiveCourse("ca"); setSelectedChapterId("ca-ch4"); }
      if (studentSession) {
        try {
          const p = JSON.parse(studentSession);
          if (p.name) setStudentName(p.name);
          setStudentProfile((prev) => ({ ...prev, ...p }));
        } catch (e) {}
      } else if (adminSession) {
        try {
          const p = JSON.parse(adminSession);
          if (p.name) setStudentName(p.name);
          setStudentProfile((prev) => ({ ...prev, ...p }));
        } catch (e) {}
      }
      try {
        const storedStreak = localStorage.getItem("lawkaksha_streak");
        const lastLogin = localStorage.getItem("lawkaksha_last_login");
        const today = new Date().toDateString();
        if (lastLogin === today) { setStreak(storedStreak ? parseInt(storedStreak) : 1); }
        else {
          const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
          const isConsecutive = lastLogin === yesterday.toDateString();
          const newStreak = isConsecutive ? (storedStreak ? parseInt(storedStreak) + 1 : 1) : 1;
          setStreak(newStreak);
          localStorage.setItem("lawkaksha_streak", String(newStreak));
          localStorage.setItem("lawkaksha_last_login", today);
        }
      } catch (e) { setStreak(1); }
    }
  }, [router]);

  // Sync entitlements and content live from MongoDB Atlas
  useEffect(() => {
    async function syncAtlasData() {
      if (!studentProfile.email && !studentProfile.student_id) return;
      try {
        const query = new URLSearchParams({
          email: studentProfile.email || "",
          studentId: studentProfile.student_id || "",
        });
        const res = await fetch(`${API_URL}/api/student/dashboard?${query.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success) {
          if (Array.isArray(data.unlockedItemIds) && data.unlockedItemIds.length > 0) {
            setPurchasedBooks((prev) => Array.from(new Set([...prev, ...data.unlockedItemIds])));
          }
          if (Array.isArray(data.cases) && data.cases.length > 0) {
            setLiveCases(data.cases);
          }
          if (Array.isArray(data.mcqs) && data.mcqs.length > 0) {
            setLiveMcqs(data.mcqs);
          }
        }
      } catch (err) {
        // Fallback to local default data
      }
    }
    syncAtlasData();
  }, [studentProfile.email, studentProfile.student_id, API_URL]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("lawkaksha_student_session");
      localStorage.removeItem("lawkaksha_active_student");
      localStorage.removeItem("lawkaksha_token");
      window.dispatchEvent(new Event("storage"));
      router.push("/login");
    }
  };

  useEffect(() => {
    let timer: any = null;
    if (testActive && !testSubmitted && testTimeLeft > 0) { timer = setInterval(() => setTestTimeLeft((p) => p - 1), 1000); }
    return () => clearInterval(timer);
  }, [testActive, testSubmitted, testTimeLeft]);

  // Security & DRM listeners across the student dashboard (No Copy, No Print, No Screenshots)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl/Cmd + P (Print), S (Save), U (View Source), C (Copy), X (Cut)
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "p" || e.key === "s" || e.key === "u" || e.key === "c" || e.key === "x")
      ) {
        e.preventDefault();
        return;
      }
      // Block PrintScreen
      if (e.key === "PrintScreen") {
        e.preventDefault();
        try {
          navigator.clipboard.writeText("");
        } catch (err) {}
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("copy", handleCopy);
    window.addEventListener("cut", handleCopy);
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("copy", handleCopy);
      window.removeEventListener("cut", handleCopy);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  if (isCheckingAuth || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-9 h-9 border-2 border-violet-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-700">Verifying session...</p>
      </div>
    );
  }

  const chaptersList = activeCourse === "ca" ? CA_FOUNDATION_CHAPTERS : CSEET_UNITS;
  const currentChapter = chaptersList.find((c) => c.id === selectedChapterId) || chaptersList[0];
  const formatTimer = (secs: number) => `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
  const initials = studentName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "AS";

  return (
    <div className="min-h-screen bg-[#F6F5FF] flex select-none" style={{ fontFamily: "'Inter', system-ui, sans-serif" }} onContextMenu={(e) => e.preventDefault()}>
      {/* CSS DRM SECURITY PRINT BLOCKER */}
      <style jsx global>{`
        @media print {
          body, html, * {
            display: none !important;
            visibility: hidden !important;
          }
        }
      `}</style>

      {/* MOBILE SIDEBAR BACKDROP */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 bg-white border-r border-slate-100 flex flex-col min-h-screen transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* TOP: LOGO + STUDENT NAME AT THE SIDE */}
        <div className="px-4 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className="flex items-center shrink-0">
              <div className="relative h-8 w-28">
                <Image src="/assets/logo-transparent.png" alt="The Law Kaksha" fill className="object-contain object-left" priority />
              </div>
            </Link>
            <button
              onClick={() => setProfileModalOpen(true)}
              title="Click to view & edit your student profile"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-violet-50 hover:bg-violet-100 border border-violet-100 text-left transition-all cursor-pointer group min-w-0"
            >
              <div className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs">
                {initials}
              </div>
              <span className="text-xs font-bold text-violet-800 truncate max-w-[75px] group-hover:text-violet-950">
                {studentName.split(" ")[0]}
              </span>
            </button>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-left min-h-[44px] ${isActive ? "bg-violet-50 text-violet-700 font-semibold" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}>
                <Icon className={`shrink-0 ${isActive ? "text-violet-600" : "text-slate-400"}`} style={{ width: 18, height: 18 }} />
                <span>{item.label}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500" />}
              </button>
            );
          })}
        </nav>

        {/* BOTTOM SECTION: STREAK CALENDAR BUTTON + DETAILED PROFILE TRIGGER */}
        <div className="p-3.5 border-t border-slate-100 space-y-2.5">
          {/* STREAK CARD WITH ANIMATED POPUP CALENDAR TRIGGER */}
          <button
            type="button"
            onClick={() => setStreakModalOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/80 border border-amber-200/80 hover:border-amber-300 hover:shadow-xs transition-all duration-150 cursor-pointer text-left group"
            title="Click to open Streak Calendar"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4 text-amber-100 animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-amber-900 leading-tight">{streak} Day Streak</p>
                <Calendar className="w-3 h-3 text-amber-600 group-hover:text-amber-800 transition-colors" />
              </div>
              <p className="text-[10px] text-amber-600 leading-none mt-0.5">Keep it going! · View Calendar</p>
            </div>
          </button>

          {/* AS / AARAV SHARMA / ACTIVE STUDENT -> OPENS PROFILE DETAIL & EDIT PAGE */}
          <div
            onClick={() => setProfileModalOpen(true)}
            className="flex items-center gap-2.5 p-2 rounded-2xl hover:bg-violet-50/80 border border-transparent hover:border-violet-100 transition-all duration-150 cursor-pointer group"
            title="Click to view and edit student profile details"
          >
            <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-slate-800 truncate group-hover:text-violet-700 transition-colors">
                  {studentName}
                </p>
                <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">Active Student · Edit Profile</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
              title="Log Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
              aria-label="Log Out"
            >
              <LogOut style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 min-w-0 overflow-auto">
        <header className="sticky top-0 z-20 bg-[#F6F5FF]/80 backdrop-blur-sm border-b border-slate-100 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
            <h1 className="text-base font-semibold text-slate-800">{NAV_ITEMS.find((n) => n.id === activeTab)?.label || "Dashboard"}</h1>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5">{activeCourse === "ca" ? "CA Foundation - Business Laws" : "CSEET - Business Law & Management"}</p>
            </div>
          </div>
          <div className="inline-flex p-1 rounded-full bg-white border border-slate-200 shadow-sm shrink-0">
            <button
              type="button"
              onClick={() => { setActiveCourse("ca"); setSelectedChapterId("ca-ch4"); }}
              className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${activeCourse === "ca" ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <span className="sm:hidden">CA</span>
              <span className="hidden sm:inline">CA Foundation</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveCourse("cs"); setSelectedChapterId("cs-u7"); }}
              className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${activeCourse === "cs" ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              CSEET
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-6 pb-24 lg:pb-8 space-y-6 max-w-6xl">

          {/* HOME */}
          {activeTab === "home" && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md shadow-violet-200">
                <div className="space-y-1">
                  <p className="text-violet-200 text-xs font-medium">Welcome back</p>
                  <h2 className="text-xl font-bold">{studentName}</h2>
                  <p className="text-violet-200 text-sm leading-relaxed max-w-md">{activeCourse === "ca" ? "CA Foundation Business Laws - 7 Chapters ready to explore." : "CSEET Business Law & Management - 8 Units ready to explore."}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-center bg-white/10 rounded-2xl p-4">
                    <Flame className="w-6 h-6 text-amber-300 mx-auto mb-1" />
                    <p className="text-2xl font-bold">{streak}</p>
                    <p className="text-[10px] text-violet-200 uppercase tracking-wide">Day Streak</p>
                  </div>
                  <div className="text-center bg-white/10 rounded-2xl p-4">
                    <BookOpen className="w-6 h-6 text-sky-300 mx-auto mb-1" />
                    <p className="text-2xl font-bold">{chaptersList.length}</p>
                    <p className="text-[10px] text-violet-200 uppercase tracking-wide">Chapters</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {([
                  { tab: "chapters" as TabType, icon: BookOpen, iconBg: "bg-sky-100", iconColor: "text-sky-600", title: "Chapter Notes", desc: `${chaptersList.length} acts & notes` },
                  { tab: "cases" as TabType, icon: Flame, iconBg: "bg-rose-100", iconColor: "text-rose-500", title: "Case Studies", desc: "3 weekly high-yield cases" },
                  { tab: "mcqtest" as TabType, icon: Sparkles, iconBg: "bg-amber-100", iconColor: "text-amber-500", title: "MCQ Test", desc: "30-question timed test" },
                  { tab: "ldr" as TabType, icon: Bookmark, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", title: "Last Day Revision", desc: "Flowcharts & quick notes" },
                ] as const).map((card) => {
                  const Icon = card.icon;
                  return (
                    <button key={card.tab} onClick={() => setActiveTab(card.tab)}
                      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left cursor-pointer group">
                      <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center mb-3`}>
                        <Icon className={`w-5 h-5 ${card.iconColor}`} />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-800 group-hover:text-violet-700 transition-colors">{card.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{card.desc}</p>
                    </button>
                  );
                })}
              </div>

              <div className="bg-white rounded-2xl border border-emerald-100 p-5 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">Subscription Active</p>
                  <p className="text-xs text-slate-400 mt-0.5">Full access to all notes, case studies and MCQ tests.</p>
                </div>
                <button onClick={() => { setSampleBookTitle(activeCourse === "ca" ? "CA Foundation Business Laws Codex" : "CSEET Business Law & Management Codex"); setSampleModalOpen(true); }}
                  className="shrink-0 px-4 py-2 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-semibold transition-colors cursor-pointer">
                  Open Codex
                </button>
              </div>
            </div>
          )}

          {/* CHAPTER NOTES — DIRECT 2 BOOKS DISPLAY */}
          {activeTab === "chapters" && (
            <div className="space-y-6">
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Chapter Notes & Study Books</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Read your complete curriculum books directly in the secure in-web reader.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold self-start sm:self-auto">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>In-Web Reader · Copy & Download Protected</span>
                </div>
              </div>

              {/* 2 BOOKS CARDS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(activeCourse === "ca" ? CA_FOUNDATION_BOOKS : CSEET_BOOKS).map((book) => {
                  const isBookUnlocked =
                    isAdminUser ||
                    purchasedBooks.includes(book.id) ||
                    purchasedBooks.includes("all-access") ||
                    purchasedBooks.includes("course-ca-foundation-sub") ||
                    purchasedBooks.includes("course-cseet-sub") ||
                    (activeCourse === "ca" && (purchasedBooks.includes("ca-foundation-business-laws") || purchasedBooks.includes("ca-foundation"))) ||
                    (activeCourse === "cs" && (purchasedBooks.includes("cseet-business-law") || purchasedBooks.includes("cseet-management") || purchasedBooks.includes("cseet")));

                  return (
                    <div
                      key={book.id}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col justify-between"
                    >
                      {/* Top color gradient banner */}
                      <div className={`h-2.5 w-full bg-gradient-to-r ${book.coverGradient}`} />

                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-start gap-4">
                          {/* Book Cover Thumbnail */}
                          <div className="relative w-20 h-28 shrink-0 rounded-xl overflow-hidden shadow-md border border-slate-200 bg-slate-100">
                            <Image
                              src={book.coverImage}
                              alt={book.title}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${book.tagBg}`}>
                                {book.badge}
                              </span>
                              {isBookUnlocked ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Enrolled
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-amber-50 text-amber-800 border-amber-200 flex items-center gap-1">
                                  <Lock className="w-3 h-3" /> Locked
                                </span>
                              )}
                              <span className="text-[10px] font-medium text-slate-400">
                                {book.totalPages}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-slate-800 leading-snug">
                              {book.title}
                            </h3>
                            <p className="text-xs text-violet-600 font-medium mt-0.5">
                              {book.subtitle}
                            </p>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed mt-4 flex-1">
                          {book.description}
                        </p>

                        {/* Included Units */}
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Included in this Book
                          </p>
                          <div className="space-y-1">
                            {book.unitsList.map((unit, uIdx) => (
                              <div key={uIdx} className="flex items-center gap-2 text-xs text-slate-600">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span className="truncate">{unit}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Read Action Button */}
                        <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{isBookUnlocked ? "Protected In-Web View" : "DRM Encrypted"}</span>
                          </div>
                          {isBookUnlocked ? (
                            <button
                              onClick={() => setPdfViewer({ open: true, url: book.pdfUrl, title: `${book.title} (${book.subtitle})` })}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer hover:shadow-md hover:shadow-violet-200"
                            >
                              <BookOpen className="w-4 h-4" />
                              Read Now
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSampleBookTitle(book.title);
                                setSampleBookId(book.id);
                                setSampleModalOpen(true);
                              }}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer hover:shadow-md hover:shadow-amber-200"
                            >
                              <Lock className="w-4 h-4" />
                              Unlock Course (₹99)
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Security notice banner */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <Lock className="w-4 h-4 text-violet-600 shrink-0" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Digital Rights Protected:</strong> These study books are accessible exclusively inside The Law कक्षा portal for registered students. Copying text, downloading files, or sharing accounts is strictly prohibited.
                </p>
              </div>
            </div>
          )}

          {/* CASE STUDIES */}
          {activeTab === "cases" && (
            <div className="space-y-6">
              <div className="max-w-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-500">Weekly Feature</span>
                <h2 className="text-2xl font-bold text-slate-800 mt-1">High-Yield Case Studies</h2>
                <p className="text-sm text-slate-500 mt-1">Master the 4-step answer structure: Monster Monday, Midweek Law Madness & Final Boss Friday.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {(liveCases && liveCases.length > 0 ? liveCases : WEEKLY_CASES).map((cs: any) => (
                  <div key={cs.id || cs._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-violet-600 uppercase tracking-wide">{cs.day}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${cs.badgeColor || "bg-violet-100 text-violet-700 border-violet-200"}`}>{cs.badge || "Live Case"}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">{cs.subject}</span>
                      <h3 className="text-sm font-bold text-slate-800 leading-snug">{cs.title}</h3>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed italic flex-1">&ldquo;{cs.scenario}&rdquo;</div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">Model Answer</span>
                      <p className="text-xs text-slate-500 leading-relaxed">{cs.modelAnswer}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-slate-400">{cs.precedent || "Direct Statutory Analysis"}</span>
                      <span className="text-emerald-600 font-bold">6/6 Marks</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MCQ TEST */}
          {activeTab === "mcqtest" && (
            <div className="space-y-6">
              <div className="max-w-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-500">Timed Evaluation</span>
                <h2 className="text-2xl font-bold text-slate-800 mt-1">Weekly 30-Question MCQ Test</h2>
                <p className="text-sm text-slate-500 mt-1">Real-time timed examination simulation across all {activeCourse === "ca" ? "7 ICAI" : "8 ICSI"} units.</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 font-mono text-sm font-bold text-slate-800 w-fit">
                    <Clock className="w-4 h-4 text-violet-500" /><span>{formatTimer(testTimeLeft)}</span>
                  </div>
                  {!testActive ? (
                    <button onClick={() => { setTestActive(true); setTestSubmitted(false); setTestTimeLeft(1800); setSelectedAnswers({}); }}
                      className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm">Start 30-Q Test</button>
                  ) : (
                    <button onClick={() => setTestSubmitted(true)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm">Submit & View Result</button>
                  )}
                </div>
                {!testActive ? (
                  <div className="text-center py-10 space-y-4 max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto text-2xl font-bold">30</div>
                    <h3 className="text-lg font-bold text-slate-800">Ready to test your Business Law mastery?</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">30 exam-standard questions - 30 minutes - Instant score on submission.</p>
                    <button onClick={() => { setTestActive(true); setTestSubmitted(false); setTestTimeLeft(1800); setSelectedAnswers({}); }}
                      className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-all cursor-pointer shadow-sm">Start Live Test</button>
                  </div>
                ) : testSubmitted ? (
                  <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-100 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <h3 className="text-lg font-bold text-slate-800">Test Completed!</h3>
                    <p className="text-sm text-slate-500">You scored <strong className="text-slate-800">27 / 30 Marks (90%)</strong></p>
                    <button onClick={() => { setTestActive(false); setTestSubmitted(false); }}
                      className="px-4 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-semibold text-emerald-800 cursor-pointer hover:bg-emerald-50 transition-colors">Close</button>
                  </div>
                ) : (
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-4">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span>Question 1 of 30 - Sale of Goods Act, 1930</span>
                      <span className="text-violet-500">Section 16(1)</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">Under Section 16(1) of the Sale of Goods Act, 1930, when is an implied condition as to quality or fitness created without an express declaration by the buyer?</p>
                    <div className="space-y-2 pt-1">
                      {["When the good is capable of only one obvious normal use and buyer relies on seller's judgment.", "Whenever the goods are purchased from any retail store.", "Only when a written warranty card is stamped by the manufacturer.", "Never, because Caveat Emptor applies strictly to all sales."].map((opt, oIdx) => (
                        <button key={oIdx} onClick={() => setSelectedAnswers((prev) => ({ ...prev, 1: oIdx }))}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${selectedAnswers[1] === oIdx ? "bg-violet-50 border-violet-300 text-violet-800 font-semibold" : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50"}`}>
                          <span className="font-bold mr-2">{String.fromCharCode(65 + oIdx)}.</span>{opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LAST DAY REVISION */}
          {activeTab === "ldr" && (
            <div className="space-y-6">
              <div className="max-w-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-500">Last Day Revision</span>
                <h2 className="text-2xl font-bold text-slate-800 mt-1">Exam Flowcharts & Quick Notes</h2>
                <p className="text-sm text-slate-500 mt-1">High-speed visual recall aids for the final 36 hours before your law exam (Protected DRM In-Web View).</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { title: "Indian Partnership Act Summary Deck", desc: "One-page flowchart covering Section 4, Section 6 True Test (Cox v. Hickman), Section 28 Holding Out, and Section 69 Non-Registration disabilities.", url: "/notes/unit-1-general-nature-of-partnership.pdf", label: "Open Flowchart", badge: "Partnership Act", badgeColor: "bg-sky-100 text-sky-700" },
                  { title: "Sale of Goods Act - Section 16 Matrix", desc: "Caveat Emptor exceptions chart, Priest v. Last, Grant v. Australian Knitting Mills, and Section 54 Unpaid Seller Resale rules.", url: "/notes/unit-2-relations-of-partners.pdf", label: "Open Matrix", badge: "Sale of Goods", badgeColor: "bg-amber-100 text-amber-700" },
                  { title: "Companies Act - Corporate Veil Doctrine", desc: "Salomon v. Salomon case, exceptions to corporate veil, Doctrine of Ultra Vires and Indoor Management rule (Royal British Bank v. Turquand).", url: "/notes/companies-act-unit-1.pdf", label: "Open Notes", badge: "Companies Act", badgeColor: "bg-violet-100 text-violet-700" },
                  { title: "Contract Act - Essential Checklist", desc: "Quick reference for Section 2 definitions, valid/void/voidable contracts, and 8 essential elements checklist for exam speed.", url: "/notes/contract-act-unit-1.pdf", label: "Open Checklist", badge: "Contract Act", badgeColor: "bg-rose-100 text-rose-700" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${item.badgeColor}`}>{item.badge}</div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                          <Lock className="w-3 h-3 text-emerald-600" />
                          <span>DRM Protected</span>
                        </div>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-800">{item.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">{item.desc}</p>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => setPdfViewer({ open: true, url: item.url, title: `${item.title} (Quick Notes)` })}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold transition-all cursor-pointer shadow-xs hover:shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{item.label} (Secure Reader)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav
        aria-label="Student Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.06)] safe-bottom"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all rounded-xl cursor-pointer ${
                isActive ? "text-violet-700 font-bold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${isActive ? "bg-violet-100 text-violet-700" : ""}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight leading-none mt-0.5 truncate max-w-[62px]">
                {item.id === "home" ? "Home" : item.id === "chapters" ? "Notes" : item.id === "cases" ? "Cases" : item.id === "mcqtest" ? "Tests" : "LDR"}
              </span>
            </button>
          );
        })}
      </nav>

      <EnhancedSampleChapterModal isOpen={sampleModalOpen} onClose={() => setSampleModalOpen(false)} bookTitle={sampleBookTitle} bookId={sampleBookId} bookPrice={99} />

      <SecurePdfReader
        isOpen={pdfViewer.open}
        onClose={() => setPdfViewer({ open: false, url: "", title: "" })}
        pdfUrl={pdfViewer.url}
        title={pdfViewer.title}
      />

      {/* DETAILED STUDENT PROFILE EDIT MODAL */}
      <StudentProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onProfileUpdated={(updated) => {
          setStudentName(updated.name);
          setStudentProfile(updated);
        }}
        streak={streak}
      />

      {/* ANIMATED STREAK CALENDAR POPUP MODAL */}
      <StreakCalendarModal
        isOpen={streakModalOpen}
        onClose={() => setStreakModalOpen(false)}
        streak={streak}
        onStreakUpdate={(newStreak) => setStreak(newStreak)}
      />
    </div>
  );
}
