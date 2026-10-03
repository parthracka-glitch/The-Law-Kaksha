"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BookOpen, CheckCircle2, FileText, Eye, Flame,
  Bookmark, Clock, LogOut, Sparkles, ArrowRight, LayoutDashboard,
  Lock, BookMarked, Calendar, Edit3, User, Menu, X,
  Trophy, Award, Zap, ChevronRight, Search, CheckSquare,
  Square, BarChart3, HelpCircle, ShieldCheck, Share2, PlayCircle, Star, ExternalLink,
  ShoppingBag, CreditCard
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { EnhancedSampleChapterModal } from "@/components/EnhancedSampleChapterModal";
import { SecurePdfReader } from "@/components/SecurePdfReader";
import { StudentProfileModal, StudentProfileData } from "@/components/StudentProfileModal";
import { StreakCalendarModal } from "@/components/StreakCalendarModal";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { StudentDashboardHome } from "@/components/student/StudentDashboardHome";
import { StudentRightSidebar } from "@/components/student/StudentRightSidebar";

interface ChapterUnit {
  unitNumber: number;
  title: string;
  pdfUrl: string;
  summary: string;
  pages: string;
  isSample?: boolean;
}

export interface GoogleFormTestItem {
  id: string;
  title: string;
  course: "ca" | "cs" | "both";
  subject: string;
  formUrl: string;
  questionCount: number;
  duration: number; // in minutes
  totalMarks: number;
  status: "Active" | "Draft";
  instructions: string;
  peerAttempts?: number;
}

interface ChapterItem {
  id: string;
  name: string;
  code: string;
  weightage: string;
  description: string;
  units?: ChapterUnit[];
  mcqCount: number;
  caseCount: number;
  peerReaders?: number;
}

const CA_FOUNDATION_CHAPTERS: ChapterItem[] = [
  {
    id: "ca-ch1",
    name: "Indian Regulatory Framework",
    code: "Chapter 1",
    weightage: "5 - 10 M",
    description: "Overview of Indian Legal System, Sources of Law, Hierarchy of Courts, Role of Regulatory Bodies (SEBI, RBI, MCA).",
    mcqCount: 25,
    caseCount: 4,
    peerReaders: 94,
    units: [
      { unitNumber: 1, title: "Overview of Indian Legal System & Hierarchy of Courts", pdfUrl: "/notes/ca-foundation-framework-notes.pdf", summary: "Structure of Legislative, Executive & Judiciary in India.", pages: "18 Pages" }
    ]
  },
  {
    id: "ca-ch2",
    name: "The Indian Contract Act, 1872",
    code: "Chapter 2",
    weightage: "20 - 25 M",
    description: "Nature of Contracts, Offer & Acceptance, Consideration, Free Consent, Performance, Breach & Remedies.",
    mcqCount: 65,
    caseCount: 18,
    peerReaders: 186,
    units: [
      { unitNumber: 1, title: "Nature & Essentials of Valid Contract (Sec 1-10)", pdfUrl: "/notes/contract-act-unit-1.pdf", summary: "Offer, Acceptance, Intention to create Legal Relationship.", pages: "34 Pages" },
      { unitNumber: 2, title: "Consideration & Capacity to Contract (Sec 11-25)", pdfUrl: "/notes/contract-act-unit-2.pdf", summary: "Minor's agreements, Doctrine of Privity of Contract.", pages: "28 Pages" },
      { unitNumber: 3, title: "Free Consent, Performance & Breach of Contract", pdfUrl: "/notes/contract-act-unit-3.pdf", summary: "Coercion, Undue Influence, Fraud, Damages under Section 73.", pages: "42 Pages" }
    ]
  },
  {
    id: "ca-ch3",
    name: "The Sale of Goods Act, 1930",
    code: "Chapter 3",
    weightage: "15 - 20 M",
    description: "Formation of Contract of Sale, Conditions & Warranties, Transfer of Ownership, Unpaid Seller Rights.",
    mcqCount: 45,
    caseCount: 12,
    peerReaders: 142,
    units: [
      { unitNumber: 1, title: "Formation of Contract of Sale & Subject Matter", pdfUrl: "/notes/sale-of-goods-unit-1.pdf", summary: "Sale vs Agreement to Sell, Ascertained vs Unascertained Goods.", pages: "22 Pages" },
      { unitNumber: 2, title: "Conditions, Warranties & Caveat Emptor (Sec 11-17)", pdfUrl: "/notes/sale-of-goods-unit-2.pdf", summary: "Implied conditions of fitness & Priest v. Last.", pages: "26 Pages" },
      { unitNumber: 3, title: "Transfer of Property & Rights of Unpaid Seller", pdfUrl: "/notes/sale-of-goods-unit-3.pdf", summary: "Nemo dat quod non habet, Lien & Stoppage in Transit.", pages: "30 Pages" }
    ]
  },
  {
    id: "ca-ch4",
    name: "The Indian Partnership Act, 1932",
    code: "Chapter 4",
    weightage: "15 - 20 M",
    description: "General Nature of Partnership, Relations of Partners, Registration and Dissolution of Firm.",
    mcqCount: 50,
    caseCount: 14,
    peerReaders: 158,
    units: [
      { unitNumber: 1, title: "Unit 1: General Nature of Partnership", pdfUrl: "/notes/unit-1-general-nature-of-partnership.pdf", summary: "Definition of Partnership, Mutual Agency, True Test (Cox v. Hickman).", pages: "24 Pages (Full Sample PDF)", isSample: true },
      { unitNumber: 2, title: "Unit 2: Relations of Partners", pdfUrl: "/notes/unit-2-relations-of-partners.pdf", summary: "Rights, Duties, Implied Authority, Holding Out, Minor as Beneficiary.", pages: "28 Pages (Full Sample PDF)", isSample: true },
      { unitNumber: 3, title: "Unit 3: Registration and Dissolution of Firm", pdfUrl: "/notes/unit-3-registration-and-dissolution-of-firm.pdf", summary: "Effect of Non-Registration, Modes of Dissolution, Settlement of Accounts.", pages: "32 Pages (Full Sample PDF)", isSample: true }
    ]
  },
  {
    id: "ca-ch5",
    name: "The Limited Liability Partnership Act, 2008",
    code: "Chapter 5",
    weightage: "5 - 10 M",
    description: "LLP Concept, Salient Features, Incorporation, Designated Partners, Conversion & Annual Filings.",
    mcqCount: 30,
    caseCount: 6,
    peerReaders: 82,
    units: [
      { unitNumber: 1, title: "LLP Architecture & Comparison with Traditional Firm", pdfUrl: "/notes/llp-act-notes.pdf", summary: "Separate legal identity, perpetual succession, Designated Partners compliance.", pages: "20 Pages" }
    ]
  },
  {
    id: "ca-ch6",
    name: "The Companies Act, 2013",
    code: "Chapter 6",
    weightage: "15 - 20 M",
    description: "Meaning & Characteristics of Company, Corporate Veil, Types of Companies, MOA & AOA, Doctrine of Ultra Vires.",
    mcqCount: 55,
    caseCount: 15,
    peerReaders: 175,
    units: [
      { unitNumber: 1, title: "Essential Characteristics & Lifting of Corporate Veil", pdfUrl: "/notes/companies-act-unit-1.pdf", summary: "Salomon v. Salomon, Private vs Public vs One Person Company.", pages: "36 Pages" },
      { unitNumber: 2, title: "Memorandum & Articles of Association (MOA / AOA)", pdfUrl: "/notes/companies-act-unit-2.pdf", summary: "Doctrine of Ultra Vires, Constructive Notice & Indoor Management.", pages: "30 Pages" }
    ]
  },
  {
    id: "ca-ch7",
    name: "The Negotiable Instruments Act, 1881",
    code: "Chapter 7",
    weightage: "10 - 15 M",
    description: "Promissory Notes, Bills of Exchange, Cheques, Negotiation & Endorsement, Dishonour of Cheques.",
    mcqCount: 40,
    caseCount: 8,
    peerReaders: 110,
    units: [
      { unitNumber: 1, title: "Promissory Notes, Bills of Exchange & Cheques", pdfUrl: "/notes/negotiable-instruments-unit-1.pdf", summary: "Holder in Due Course, Section 138 Dishonour penalties.", pages: "26 Pages" }
    ]
  },
];

const CSEET_UNITS: ChapterItem[] = [
  {
    id: "cs-u1",
    name: "Indian Contract Act, 1872",
    code: "Unit 1",
    weightage: "15 - 20 M",
    description: "Essentials of Contract, Offer, Acceptance, Consideration, Free Consent, Void Agreements, Remedies.",
    mcqCount: 45,
    caseCount: 6,
    peerReaders: 130,
    units: [{ unitNumber: 1, title: "Contract Essentials & Types of Contracts", pdfUrl: "/notes/cseet-contract-act.pdf", summary: "Core concept notes with 40 objective questions.", pages: "24 Pages" }]
  },
  {
    id: "cs-u2",
    name: "Sale of Goods Act, 1930",
    code: "Unit 2",
    weightage: "10 - 15 M",
    description: "Contract of Sale, Conditions & Warranties, Passing of Property, Rights of Unpaid Seller.",
    mcqCount: 35,
    caseCount: 4,
    peerReaders: 88,
    units: [{ unitNumber: 1, title: "Sale of Goods Principles & Caveat Emptor", pdfUrl: "/notes/cseet-sale-of-goods.pdf", summary: "Essential rules, Section 16 exceptions, unpaid seller.", pages: "20 Pages" }]
  },
  {
    id: "cs-u3",
    name: "Indian Partnership Act, 1932",
    code: "Unit 3",
    weightage: "10 - 15 M",
    description: "General Nature, Relations of Partners, Registration and Dissolution.",
    mcqCount: 35,
    caseCount: 4,
    peerReaders: 104,
    units: [{ unitNumber: 1, title: "General Nature, Relations & Dissolution of Firm", pdfUrl: "/notes/unit-1-general-nature-of-partnership.pdf", summary: "Mutual agency, holding out, minor's status, effects of non-registration.", pages: "24 Pages (Sample PDF)", isSample: true }]
  },
  {
    id: "cs-u4",
    name: "Limited Liability Partnership Act, 2008",
    code: "Unit 4",
    weightage: "8 - 12 M",
    description: "LLP Features, Formation, Designated Partners, Conversion.",
    mcqCount: 25,
    caseCount: 3,
    peerReaders: 76,
    units: [{ unitNumber: 1, title: "LLP Framework & Key Distinctions", pdfUrl: "/notes/cseet-llp-notes.pdf", summary: "Comparison between LLP, Company and Traditional Partnership.", pages: "16 Pages" }]
  },
  {
    id: "cs-u5",
    name: "Elements of Company Law",
    code: "Unit 5",
    weightage: "15 - 20 M",
    description: "Company Meaning, Types, Corporate Veil, MOA, AOA, Ultra Vires.",
    mcqCount: 50,
    caseCount: 8,
    peerReaders: 145,
    units: [{ unitNumber: 1, title: "Company Formation & Constitutional Documents", pdfUrl: "/notes/cseet-company-law.pdf", summary: "Private vs Public Company, Section 8, Corporate Veil cases.", pages: "30 Pages" }]
  },
  {
    id: "cs-u6",
    name: "Negotiable Instruments Act, 1881",
    code: "Unit 6",
    weightage: "10 - 15 M",
    description: "Promissory Notes, Bills of Exchange, Cheques, Negotiation, Section 138.",
    mcqCount: 30,
    caseCount: 4,
    peerReaders: 82,
    units: [{ unitNumber: 1, title: "Negotiable Instruments Core Concepts", pdfUrl: "/notes/cseet-negotiable-instruments.pdf", summary: "Instruments, Parties, Crossing of Cheques, Bouncing liabilities.", pages: "22 Pages" }]
  },
  {
    id: "cs-u7",
    name: "General Principles of Management",
    code: "Unit 7",
    weightage: "15 - 20 M",
    description: "Planning, Organising, Directing, Controlling, Fayol's 14 Principles, Scientific Management.",
    mcqCount: 50,
    caseCount: 6,
    peerReaders: 160,
    units: [{ unitNumber: 1, title: "Management Principles, Functions & Theories", pdfUrl: "/notes/management-principles-sample-notes.pdf", summary: "Henry Fayol vs FW Taylor, Strategic Planning, Motivation Theories.", pages: "28 Pages (Sample PDF)", isSample: true }]
  },
  {
    id: "cs-u8",
    name: "Business Environment & Ethics",
    code: "Unit 8",
    weightage: "10 - 15 M",
    description: "PESTLE Analysis, Ease of Doing Business, Corporate Ethics & CSR.",
    mcqCount: 30,
    caseCount: 4,
    peerReaders: 95,
    units: [{ unitNumber: 1, title: "Business Environment & Corporate Governance", pdfUrl: "/notes/cseet-business-environment.pdf", summary: "Macro/Micro factors, Ethical decision-making in business.", pages: "18 Pages" }]
  },
];

const WEEKLY_CASES = [
  { id: "monster-monday", day: "Monster Monday", badge: "High Difficulty", badgeColor: "bg-[#F4C5C0] text-[#221D1D] border-[#C35F3B]/30", subject: "Indian Contract Act, 1872", title: "The Anticipatory Breach & Measure of Damages", scenario: "A agreed to supply 500 MT of industrial chemicals to B at Rs.20,000/MT on 1st November. On 15th October, A informed B that he would not deliver. Market price on 15th October was Rs.22,000/MT but B waited until 1st November when market price surged to Rs.26,000/MT. B sued for Rs.30,00,000 damages. Decide the quantum of damages under Section 73.", modelAnswer: "Under Section 73 of Indian Contract Act 1872 (and Frost v. Knight), B has two options: (1) Treat contract as rescinded on 15th Oct and claim difference (Rs.2,000/MT = Rs.10 Lakhs), OR (2) Keep contract alive till 1st Nov and claim difference on date of performance (Rs.6,000/MT = Rs.30 Lakhs). Since contract was kept alive, B is entitled to Rs.30 Lakhs.", precedent: "Frost v. Knight (1872) L.R. 7 Ex. 111" },
  { id: "midweek-madness", day: "Midweek Law Madness", badge: "Statutory Trap", badgeColor: "bg-[#F7892A]/15 text-[#221D1D] border-[#F7892A]/30", subject: "Indian Partnership Act, 1932", title: "Retirement without Notice & Doctrine of Holding Out", scenario: "Karan, partner in M/s Apex Builders, retired in January but no public notice was given in the Official Gazette. In March, firm borrowed Rs.15 Lakhs from Indus Bank. Karan was unaware. Is Karan personally liable to Indus Bank?", modelAnswer: "Under Section 32(3) read with Section 28 of Indian Partnership Act 1932, a retired partner continues to be liable to third parties unless public notice is published in the Official Gazette and at least one local language newspaper. Karan is personally liable to Indus Bank under the doctrine of Holding Out.", precedent: "Scarf v. Jardine (1882) 7 App Cas 345" },
  { id: "final-boss-friday", day: "Final Boss Friday", badge: "Exam Simulation", badgeColor: "bg-[#BFAFE5]/30 text-[#221D1D] border-[#BFAFE5]", subject: "Companies Act, 2013", title: "Ultra Vires Borrowing & Subrogation Remedy", scenario: "A company's MOA authorizes borrowing up to Rs.1 Crore. The Directors borrowed Rs.2.5 Crores from a private financier without member approval. The entire Rs.2.5 Crores was used to pay off lawful trade debts of the company. Can the lender recover money from the company?", modelAnswer: "The loan is Ultra Vires the borrowing powers of the company and void ab initio (Ashbury Railway Carriage Co. v. Riche). However, under the equitable doctrine of Subrogation (Sinclair v. Brougham), since the money was used to discharge lawful intra-vires liabilities, the lender stands in shoes of discharged creditors and can recover the debt.", precedent: "Sinclair v. Brougham [1914] AC 398" },
];

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
    coverGradient: "from-[#AED7E9] to-[#98C5D8]",
    tagBg: "bg-[#AED7E9]/40 text-[#221D1D] border-[#AED7E9]",
    pdfUrl: "/api/pdf/cseet-business-law-full.pdf",
    totalPages: "180+ Pages",
    peerCount: 210,
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
    peerCount: 165,
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
    peerCount: 340,
  },
];

const DEFAULT_GOOGLE_TESTS: GoogleFormTestItem[] = [
  {
    id: "gtest-1",
    title: "Weekly Mock Test 1 — Indian Contract Act (Sec 1-75)",
    course: "ca",
    subject: "The Indian Contract Act, 1872",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLScD9L8n4n5v7x9m0/viewform",
    questionCount: 30,
    duration: 30,
    totalMarks: 30,
    status: "Active",
    instructions: "Strict 30-minute timed evaluation. 0.25 negative marking applies for incorrect attempts as per ICAI guidelines.",
    peerAttempts: 142,
  },
  {
    id: "gtest-2",
    title: "Unit Test 2 — Sale of Goods Act & Caveat Emptor",
    course: "ca",
    subject: "The Sale of Goods Act, 1930",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLScD9L8n4n5v7x9m1/viewform",
    questionCount: 25,
    duration: 25,
    totalMarks: 25,
    status: "Active",
    instructions: "High-yield Section 16 implied condition exceptions, Priest v. Last, and unpaid seller remedies.",
    peerAttempts: 98,
  },
  {
    id: "gtest-3",
    title: "Unit Test 3 — Indian Partnership Act True Test & Dissolution",
    course: "ca",
    subject: "The Indian Partnership Act, 1932",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLScD9L8n4n5v7x9m2/viewform",
    questionCount: 30,
    duration: 30,
    totalMarks: 30,
    status: "Active",
    instructions: "Cox v. Hickman sharing of profit tests, Section 28 holding out, and non-registration effects.",
    peerAttempts: 115,
  },
  {
    id: "gtest-4",
    title: "CSEET Paper 2 Master Mock Drill — 8 Units",
    course: "cs",
    subject: "Business Law & General Management",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLScD9L8n4n5v7x9m3/viewform",
    questionCount: 40,
    duration: 40,
    totalMarks: 50,
    status: "Active",
    instructions: "Comprehensive 8-unit simulation for CSEET legal aptitude & business management paper.",
    peerAttempts: 160,
  },
];

// DAILY QUESTION OF THE DAY (QOTD)
const DAILY_QOTD_DATA = {
  id: "qotd-today",
  subject: "Sale of Goods Act, 1930",
  section: "Section 16(1)",
  question: "Under Section 16(1) of the Sale of Goods Act, 1930, when is an implied condition as to quality or fitness created without an express declaration by the buyer?",
  options: [
    "When the good is capable of only one obvious normal use and buyer relies on seller's judgment.",
    "Whenever the goods are purchased from any retail grocery store.",
    "Only when a written warranty card is stamped by the manufacturer.",
    "Never, because Caveat Emptor applies strictly to all commercial sales."
  ],
  correctIndex: 0,
  explanation: "Under Section 16(1) (Priest v. Last), when the buyer informs the purpose or when goods have only one purpose, relying on the seller's judgment creates an implied condition of fitness.",
  xpReward: 15,
};

type TabType = "home" | "chapters" | "mastery" | "cases" | "mcqtest" | "ldr" | "certificates" | "refer" | "purchases";

const NAV_ITEMS: { id: TabType; label: string; icon: any; badge?: string }[] = [
  { id: "home", label: "Dashboard", icon: LayoutDashboard },
  { id: "chapters", label: "Chapter Notes", icon: BookOpen },
  { id: "mastery", label: "My Progress", icon: CheckSquare, badge: "Progress" },
  { id: "cases", label: "Case Studies", icon: Flame },
  { id: "mcqtest", label: "Practice Tests", icon: Sparkles },
  { id: "ldr", label: "Build Resume", icon: FileText },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "refer", label: "Refer and Earn", icon: Share2 },
  { id: "purchases", label: "Purchase History", icon: CreditCard },
];

export default function StudentDashboardPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Session & Auth
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [activeCourse, setActiveCourse] = useState<"ca" | "cs">("ca");
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [selectedChapterId, setSelectedChapterId] = useState<string>("ca-ch4");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals
  const [sampleModalOpen, setSampleModalOpen] = useState<boolean>(false);
  const [sampleBookTitle, setSampleBookTitle] = useState<string>("Indian Partnership Act 1932 Master Notes");
  const [sampleBookId, setSampleBookId] = useState<string>("ca-foundation");
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [streakModalOpen, setStreakModalOpen] = useState<boolean>(false);
  const [badgesModalOpen, setBadgesModalOpen] = useState<boolean>(false);
  const [pdfViewer, setPdfViewer] = useState<{
    open: boolean;
    url: string;
    title: string;
    previewPagesLimit?: number;
    isPurchased?: boolean;
    price?: number;
    onBuy?: () => void;
  }>({ open: false, url: "", title: "", isPurchased: true });
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [lockedPrompt, setLockedPrompt] = useState<{ open: boolean; courseName: string } | null>(null);

  // Student Profile & Gamification Stats
  const [studentName, setStudentName] = useState("Student");
  const [studentProfile, setStudentProfile] = useState<StudentProfileData>({
    name: "Student",
    email: "",
    targetExam: "CA Foundation / CSEET",
    student_id: "",
    avatarColor: "violet",
  });
  const [streak, setStreak] = useState<number>(1);
  const [lawXp, setLawXp] = useState<number>(180);
  const [completedUnits, setCompletedUnits] = useState<string[]>(["ca-ch1-u1", "ca-ch4-u1"]);
  const [bookmarkedUnits, setBookmarkedUnits] = useState<string[]>(["ca-ch2-u3"]);
  const [xpToast, setXpToast] = useState<{ show: boolean; msg: string; xp: number } | null>(null);

  // Last Read State for Quick Resume
  const [lastRead, setLastRead] = useState<{
    title: string;
    subtitle: string;
    pdfUrl: string;
    progress: number;
    date: string;
  }>({
    title: "The Indian Partnership Act, 1932",
    subtitle: "Unit 1: General Nature of Partnership (Cox v. Hickman)",
    pdfUrl: "/notes/unit-1-general-nature-of-partnership.pdf",
    progress: 55,
    date: "Today at 9:30 AM",
  });

  // Daily QOTD Interactive State
  const [qotdSelected, setQotdSelected] = useState<number | null>(null);
  const [qotdSubmitted, setQotdSubmitted] = useState<boolean>(false);

  // Live Atlas & Catalog data
  const [purchasedBooks, setPurchasedBooks] = useState<string[]>([]);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [liveCases, setLiveCases] = useState<any[]>(WEEKLY_CASES);
  const [liveMcqTests, setLiveMcqTests] = useState<GoogleFormTestItem[]>(DEFAULT_GOOGLE_TESTS);
  const [activeFormModal, setActiveFormModal] = useState<{
    open: boolean;
    url: string;
    title: string;
    subject: string;
    duration: number;
  } | null>(null);

  const { addToCart, setIsCartOpen, setCheckoutStep } = useCart();

  // Purchase-Based Access Control: determines if active course stream is unlocked
  const isCaUnlocked = useMemo(() => {
    if (isAdminUser) return true;
    return purchasedBooks.some(id => {
      const lower = (id || "").toLowerCase();
      return (
        lower === "course-ca-foundation-sub" ||
        lower === "ca-foundation-sub" ||
        lower === "ca-foundation-business-laws" ||
        lower === "ca-foundation" ||
        lower === "book-vol-1" ||
        lower === "prod-vol1" ||
        lower === "prod-combo" ||
        lower === "all-access" ||
        lower.includes("foundation") ||
        lower.includes("ca-") ||
        lower.includes("question-bank")
      );
    });
  }, [isAdminUser, purchasedBooks]);

  const isCsUnlocked = useMemo(() => {
    if (isAdminUser) return true;
    return purchasedBooks.some(id => {
      const lower = (id || "").toLowerCase();
      return (
        lower === "course-cseet-sub" ||
        lower === "cseet-sub" ||
        lower === "cseet-business-law" ||
        lower === "cseet-management" ||
        lower === "cseet" ||
        lower === "book-vol-2" ||
        lower === "prod-vol2" ||
        lower === "prod-combo" ||
        lower === "all-access" ||
        lower.includes("cseet") ||
        lower.includes("cs-")
      );
    });
  }, [isAdminUser, purchasedBooks]);

  const hasActiveCourseAccess = activeCourse === "ca" ? isCaUnlocked : isCsUnlocked;
  const activeCourseName = activeCourse === "ca" ? "CA Foundation Business Laws" : "CSEET Business Law & Management";

  const handleBuyCourse = (courseType: "ca" | "cs" | "all-access") => {
    if (courseType === "all-access") {
      addToCart({
        id: "prod-combo",
        title: "All-Access Dual Codex Pass (CA Foundation + CSEET)",
        format: "pdf",
        price: 180,
        originalPrice: 499,
        category: "Full Course Subscription",
        badge: "Dual Pass • 15 Chapters",
      });
      setIsCartOpen(true);
      setCheckoutStep("details");
    } else if (courseType === "ca") {
      addToCart({
        id: "course-ca-foundation-sub",
        title: "CA Foundation Business Laws Master Pass",
        format: "pdf",
        price: 99,
        originalPrice: 299,
        category: "Full Course Subscription",
        badge: "Paper 2 • 7 Chapters",
      });
      setIsCartOpen(true);
      setCheckoutStep("details");
    } else {
      addToCart({
        id: "course-cseet-sub",
        title: "CSEET Business Law & Management Master Pass",
        format: "pdf",
        price: 99,
        originalPrice: 299,
        category: "Full Course Subscription",
        badge: "ICSI • 8 Units",
      });
      setIsCartOpen(true);
      setCheckoutStep("details");
    }
  };

  // Trigger XP Reward Toast
  const awardXp = (amount: number, reason: string) => {
    const newXp = lawXp + amount;
    setLawXp(newXp);
    setXpToast({ show: true, msg: reason, xp: amount });
    try {
      localStorage.setItem("lawkaksha_xp", String(newXp));
      // Sync with MongoDB backend in background
      if (studentProfile.email || studentProfile.student_id) {
        fetch(`${API_URL}/api/student/sync-progress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: studentProfile.email,
            studentId: studentProfile.student_id,
            xpTotal: newXp,
            streakDays: streak,
            completedUnits,
            lastRead,
          }),
        }).catch(() => {});
      }
    } catch (e) {}
    setTimeout(() => setXpToast(null), 4000);
  };

  // Toggle Unit Completion
  const toggleUnitCompleted = (unitId: string, unitTitle: string) => {
    const isDone = completedUnits.includes(unitId);
    let updated: string[];
    if (isDone) {
      updated = completedUnits.filter((id) => id !== unitId);
    } else {
      updated = [...completedUnits, unitId];
      awardXp(20, `Completed: ${unitTitle}`);
    }
    setCompletedUnits(updated);
    try {
      localStorage.setItem("lawkaksha_completed_units", JSON.stringify(updated));
    } catch (e) {}
  };

  // Toggle Bookmark
  const toggleBookmark = (unitId: string) => {
    const isBookmarked = bookmarkedUnits.includes(unitId);
    const updated = isBookmarked ? bookmarkedUnits.filter((id) => id !== unitId) : [...bookmarkedUnits, unitId];
    setBookmarkedUnits(updated);
    try {
      localStorage.setItem("lawkaksha_bookmarks", JSON.stringify(updated));
    } catch (e) {}
  };

  // Open PDF & track Last Read (with purchase-based access control and custom preview page limits)
  const handleOpenPdf = (
    url: string,
    title: string,
    subtitle: string,
    bypassLock?: boolean,
    isSamplePreview?: boolean,
    previewPagesLimit?: number,
    price?: number,
    onBuy?: () => void,
    courseType?: "ca" | "cs" | "shared"
  ) => {
    // Gate: require active course purchase (unless sample / admin bypass)
    const stream = courseType && courseType !== "shared" ? courseType : activeCourse;
    const isUnlocked =
      isAdminUser ||
      bypassLock ||
      (courseType === "shared"
        ? (isCaUnlocked || isCsUnlocked)
        : (stream === "ca" ? isCaUnlocked : isCsUnlocked));

    if (!isUnlocked && !isSamplePreview) {
      setLockedPrompt({
        open: true,
        courseName: stream === "ca" ? "CA Foundation Business Laws" : "CSEET Business Law & Management",
      });
      return;
    }
    const newLastRead = {
      title,
      subtitle,
      pdfUrl: url,
      progress: 35,
      date: "Just now",
    };
    setLastRead(newLastRead);
    try {
      localStorage.setItem("lawkaksha_last_read", JSON.stringify(newLastRead));
    } catch (e) {}
    setPdfViewer({
      open: true,
      url,
      title: `${title} - ${subtitle}`,
      previewPagesLimit: isUnlocked ? undefined : (previewPagesLimit || 5),
      isPurchased: isUnlocked,
      price: price || 99,
      onBuy: onBuy || (() => handleBuyCourse(stream === "ca" ? "ca" : "cs")),
    });
    awardXp(10, `Reading Session: ${title}`);
  };

  // Session & Local Storage Loading
  useEffect(() => {
    if (typeof window !== "undefined") {
      const studentSession = localStorage.getItem("lawkaksha_student_session");
      const adminSession = localStorage.getItem("lawkaksha_admin_session");
      if (!studentSession && !adminSession) {
        setIsAuthorized(false);
        setIsCheckingAuth(false);
        router.push("/login");
        return;
      }
      setIsAuthorized(true);
      setIsCheckingAuth(false);
      if (adminSession) setIsAdminUser(true);

      const params = new URLSearchParams(window.location.search);
      const courseParam = params.get("course");
      if (courseParam === "cs") {
        setActiveCourse("cs");
        setSelectedChapterId("cs-u7");
      } else if (courseParam === "ca") {
        setActiveCourse("ca");
        setSelectedChapterId("ca-ch4");
      }

      let initialUnlocked: string[] = [];
      if (studentSession) {
        try {
          const p = JSON.parse(studentSession);
          if (p.name) setStudentName(p.name);
          setStudentProfile((prev) => ({ ...prev, ...p }));
          if (Array.isArray(p.unlockedItemIds)) {
            initialUnlocked.push(...p.unlockedItemIds);
          }
        } catch (e) {}
      } else if (adminSession) {
        try {
          const p = JSON.parse(adminSession);
          if (p.name) setStudentName(p.name);
          setStudentProfile((prev) => ({ ...prev, ...p }));
        } catch (e) {}
      }

      const activeStudent = localStorage.getItem("lawkaksha_active_student");
      if (activeStudent) {
        try {
          const act = JSON.parse(activeStudent);
          if (Array.isArray(act.unlockedItemIds)) {
            initialUnlocked.push(...act.unlockedItemIds);
          }
        } catch (e) {}
      }

      if (initialUnlocked.length > 0) {
        setPurchasedBooks((prev) => Array.from(new Set([...prev, ...initialUnlocked])));
      }

      // Listen for instant purchase unlocks from CartDrawer
      const handleStudentUpdated = (e: any) => {
        const detail = e?.detail;
        if (Array.isArray(detail)) {
          setPurchasedBooks((prev) => Array.from(new Set([...prev, ...detail])));
        } else {
          try {
            const act = localStorage.getItem("lawkaksha_active_student");
            if (act) {
              const parsed = JSON.parse(act);
              if (Array.isArray(parsed.unlockedItemIds)) {
                setPurchasedBooks((prev) => Array.from(new Set([...prev, ...parsed.unlockedItemIds])));
              }
            }
          } catch (err) {}
        }
      };

      window.addEventListener("lawkaksha_student_updated", handleStudentUpdated);
      window.addEventListener("storage", handleStudentUpdated);

      // Load XP, streak, completed units, bookmarks, last read
      try {
        const storedXp = localStorage.getItem("lawkaksha_xp");
        if (storedXp) setLawXp(parseInt(storedXp));

        const storedUnits = localStorage.getItem("lawkaksha_completed_units");
        if (storedUnits) setCompletedUnits(JSON.parse(storedUnits));

        const storedBm = localStorage.getItem("lawkaksha_bookmarks");
        if (storedBm) setBookmarkedUnits(JSON.parse(storedBm));

        const storedLastRead = localStorage.getItem("lawkaksha_last_read");
        if (storedLastRead) setLastRead(JSON.parse(storedLastRead));

        const storedStreak = localStorage.getItem("lawkaksha_streak");
        const lastLogin = localStorage.getItem("lawkaksha_last_login");
        const today = new Date().toDateString();
        if (lastLogin === today) {
          setStreak(storedStreak ? parseInt(storedStreak) : 1);
        } else {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const isConsecutive = lastLogin === yesterday.toDateString();
          const newStreak = isConsecutive ? (storedStreak ? parseInt(storedStreak) + 1 : 1) : 1;
          setStreak(newStreak);
          localStorage.setItem("lawkaksha_streak", String(newStreak));
          localStorage.setItem("lawkaksha_last_login", today);
        }
        const storedProducts = localStorage.getItem("lawkaksha_admin_products");
        if (storedProducts) {
          try {
            setAvailableProducts(JSON.parse(storedProducts));
          } catch (e) {}
        }
      } catch (e) {
        setStreak(1);
      }

      return () => {
        window.removeEventListener("lawkaksha_student_updated", handleStudentUpdated);
        window.removeEventListener("storage", handleStudentUpdated);
      };
    }
  }, [router]);

  // Sync Atlas Data
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
          if (Array.isArray(data.availableProducts) && data.availableProducts.length > 0) {
            setAvailableProducts(data.availableProducts);
          }
          if (Array.isArray(data.cases) && data.cases.length > 0) {
            setLiveCases(data.cases);
          }
          if (Array.isArray(data.mcqTests) && data.mcqTests.length > 0) {
            setLiveMcqTests(data.mcqTests);
          }
          if (typeof data.lawXp === "number" && data.lawXp > lawXp) {
            setLawXp(data.lawXp);
          }
          if (Array.isArray(data.completedUnits) && data.completedUnits.length > 0) {
            setCompletedUnits(data.completedUnits);
          }
          if (data.lastRead && data.lastRead.title) {
            setLastRead(data.lastRead);
          }
        }
      } catch (err) {}
    }
    syncAtlasData();
  }, [studentProfile.email, studentProfile.student_id, API_URL]);

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      try {
        const token = localStorage.getItem("lawkaksha_token");
        const devId = localStorage.getItem("lawkaksha_device_id");
        if (token) {
          fetch(`${API_URL}/api/auth/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ deviceId: devId }),
          }).catch(() => null);
        }
      } catch (e) {}

      localStorage.removeItem("lawkaksha_student_session");
      localStorage.removeItem("lawkaksha_active_student");
      localStorage.removeItem("lawkaksha_token");
      window.dispatchEvent(new Event("storage"));
      router.push("/login");
    }
  };

  // DRM & Security Listeners
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ["p", "s", "u", "c", "x"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if (e.key === "PrintScreen") {
        e.preventDefault();
        try { navigator.clipboard.writeText(""); } catch (err) {}
      }
    };
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

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

  // Level Calculations
  const levelInfo = useMemo(() => {
    if (lawXp >= 1500) {
      return { level: 5, title: "High Court Jurist", badge: "👑 Jurist", nextXp: 2500, minXp: 1500, progress: Math.min(100, Math.round(((lawXp - 1500) / 1000) * 100)) };
    }
    if (lawXp >= 800) {
      return { level: 4, title: "Senior Advocate", badge: "💎 Advocate", nextXp: 1500, minXp: 800, progress: Math.round(((lawXp - 800) / 700) * 100) };
    }
    if (lawXp >= 400) {
      return { level: 3, title: "Case Law Scholar", badge: "🥇 Scholar", nextXp: 800, minXp: 400, progress: Math.round(((lawXp - 400) / 400) * 100) };
    }
    if (lawXp >= 150) {
      return { level: 2, title: "Junior Associate", badge: "🥈 Associate", nextXp: 400, minXp: 150, progress: Math.round(((lawXp - 150) / 250) * 100) };
    }
    return { level: 1, title: "Legal Intern", badge: "🥉 Intern", nextXp: 150, minXp: 0, progress: Math.round((lawXp / 150) * 100) };
  }, [lawXp]);

  const chaptersList = activeCourse === "ca" ? CA_FOUNDATION_CHAPTERS : CSEET_UNITS;
  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return chaptersList;
    const q = searchQuery.toLowerCase();
    return chaptersList.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.units?.some((u) => u.title.toLowerCase().includes(q) || u.summary.toLowerCase().includes(q))
    );
  }, [chaptersList, searchQuery]);

  // Overall Mastery %
  const totalUnitsCount = useMemo(() => {
    return chaptersList.reduce((acc, ch) => acc + (ch.units?.length || 1), 0);
  }, [chaptersList]);

  const completedCount = useMemo(() => {
    return completedUnits.filter((id) => id.startsWith(activeCourse)).length;
  }, [completedUnits, activeCourse]);

  const masteryPercent = Math.min(100, Math.round((completedCount / (totalUnitsCount || 1)) * 100));

  if (isCheckingAuth || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-3 border-[#AED7E9] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-[#221D1D]">Verifying secure student access...</p>
      </div>
    );
  }

  const formatTimer = (secs: number) => `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
  const initials = studentName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "AS";

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex select-none text-[#4D433F]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }} onContextMenu={(e) => e.preventDefault()}>
      {/* CSS DRM SECURITY PRINT BLOCKER */}
      <style jsx global>{`
        @media print {
          body, html, * {
            display: none !important;
            visibility: hidden !important;
          }
        }
      `}</style>

      {/* FLOATING LAW-XP CELEBRATION TOAST */}
      {xpToast && (
        <div className="fixed top-5 right-5 z-50 animate-bounce bg-[#221D1D] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/20">
          <div className="w-8 h-8 rounded-full bg-[#BFAFE5] text-[#221D1D] flex items-center justify-center font-bold text-xs shadow-xs">
            +{xpToast.xp}
          </div>
          <div>
            <p className="text-xs font-bold leading-tight flex items-center gap-1">
              <span>LawXP Gained!</span> <Sparkles className="w-3 h-3 text-[#F7892A]" />
            </p>
            <p className="text-[11px] text-[#E7E4E7]">{xpToast.msg}</p>
          </div>
        </div>
      )}

      {/* TUTEDUDE STYLE PREMIUM STUDENT SIDEBAR */}
      <StudentSidebar
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId as TabType)}
        studentName={studentName}
        initials={initials}
        onOpenProfile={() => setProfileModalOpen(true)}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* HEADER BAR */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#E7E4E7] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white border border-[#E7E4E7] text-[#221D1D] hover:bg-[#F7F7F5] transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-serif font-bold text-[#221D1D] flex items-center gap-2">
                <span>{NAV_ITEMS.find((n) => n.id === activeTab)?.label || "Dashboard"}</span>
              </h1>
              <p className="text-[11px] text-[#77716E] leading-none mt-0.5">
                {activeCourse === "ca" ? "CA Foundation Paper 2: Business Laws" : "CSEET Paper 2: Business Law & Management"}
              </p>
            </div>
          </div>

          {/* COURSE SWITCHER PILL */}
          <div className="inline-flex p-1 rounded-full bg-[#F7F7F5] border border-[#E7E4E7] shadow-xs shrink-0">
            <button
              type="button"
              onClick={() => { setActiveCourse("ca"); setSelectedChapterId("ca-ch4"); }}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCourse === "ca" ? "bg-[#AED7E9] text-[#221D1D] font-bold shadow-xs" : "text-[#4D433F] hover:text-[#221D1D]"
              }`}
            >
              {isCaUnlocked ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4B8097]" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-[#77716E]" />
              )}
              <span className="sm:hidden">CA</span>
              <span className="hidden sm:inline">CA Foundation</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveCourse("cs"); setSelectedChapterId("cs-u7"); }}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCourse === "cs" ? "bg-[#AED7E9] text-[#221D1D] font-bold shadow-xs" : "text-[#4D433F] hover:text-[#221D1D]"
              }`}
            >
              {isCsUnlocked ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4B8097]" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-[#77716E]" />
              )}
              <span>CSEET</span>
            </button>
          </div>
        </header>

        <div className={`p-4 sm:p-6 pb-24 lg:pb-12 space-y-6 ${activeTab === "home" ? "w-full max-w-[1600px] mx-auto" : "max-w-6xl"}`}>

          {/* COURSE ACCESS STATUS BANNER */}
          {!hasActiveCourseAccess && (
            <div className="rounded-3xl bg-linear-to-r from-[#F4C5C0]/40 via-amber-50 to-[#AED7E9]/30 border border-[#F4C5C0] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#F4C5C0] text-[#C35F3B] flex items-center justify-center shrink-0 shadow-xs">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C35F3B] text-white">
                      Locked Stream
                    </span>
                    <span className="text-xs font-bold text-[#221D1D]">
                      Previewing {activeCourseName}
                    </span>
                  </div>
                  <p className="text-xs text-[#4D433F] mt-1 leading-relaxed">
                    You have not purchased access to <strong>{activeCourseName}</strong>. Codex notes, case study model answers, MCQ mock tests, and LDR revision flowcharts are locked. Unlock now to access everything!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleBuyCourse(activeCourse)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#221D1D] hover:bg-[#383130] text-white text-xs font-bold shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#AED7E9]" />
                  <span>Buy {activeCourse === "ca" ? "CA Foundation" : "CSEET"} • ₹99</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: DASHBOARD HOME (3-COLUMN TUTEDUDE EDTECH SUITE AS REQUESTED)        */}
          {/* ========================================================================= */}
          {activeTab === "home" && (
            <div className="flex flex-col xl:flex-row gap-6 items-start w-full">
              {/* CENTER COLUMN: PROMO BANNERS, ENROLLED COURSES CAROUSEL & RECOMMENDED */}
              <div className="flex-1 min-w-0 space-y-6 w-full">
                <StudentDashboardHome
                  studentName={studentName}
                  streak={streak}
                  longestStreak={Math.max(streak, 4)}
                  lawXp={lawXp}
                  levelInfo={levelInfo}
                  awardXp={awardXp}
                  onOpenStreakLog={() => setStreakModalOpen(true)}
                  onOpenBadgesModal={() => setBadgesModalOpen(true)}
                  onOpenPdf={(url, title, subtitle, courseType) => {
                    const stream = courseType || activeCourse;
                    const isUnlocked =
                      isAdminUser ||
                      (stream === "ca"
                        ? isCaUnlocked
                        : stream === "cs"
                        ? isCsUnlocked
                        : isCaUnlocked || isCsUnlocked);

                    if (isUnlocked) {
                      handleOpenPdf(url, title, subtitle || "", true, false, undefined, undefined, undefined, stream);
                    } else {
                      setLockedPrompt({
                        open: true,
                        courseName: stream === "ca" ? "CA Foundation Business Laws" : "CSEET Business Law & Management",
                      });
                    }
                  }}
                  activeCourse={activeCourse}
                  onExploreCourse={(courseId) => {
                    if (courseId === "all-access") {
                      handleBuyCourse("all-access");
                    } else if (courseId.includes("ca")) {
                      setActiveCourse("ca");
                      setActiveTab("chapters");
                    } else {
                      setActiveCourse("cs");
                      setActiveTab("chapters");
                    }
                  }}
                  qotdData={DAILY_QOTD_DATA}
                  qotdSelected={qotdSelected}
                  qotdSubmitted={qotdSubmitted}
                  onSelectQotdOption={(idx) => {
                    setQotdSelected(idx);
                    setQotdSubmitted(true);
                    if (idx === DAILY_QOTD_DATA.correctIndex) {
                      awardXp(DAILY_QOTD_DATA.xpReward, "QOTD Answered Correctly! 🎉");
                    } else {
                      awardXp(5, "QOTD Attempted (+5 XP)");
                    }
                  }}
                  onSubmitQotd={() => {}}
                  completedUnitsCount={completedCount}
                  totalUnitsCount={totalUnitsCount}
                  isCaUnlocked={isCaUnlocked}
                  isCsUnlocked={isCsUnlocked}
                  isAllAccessUnlocked={isCaUnlocked && isCsUnlocked}
                  onBuyCourse={(courseType) => handleBuyCourse(courseType)}
                />
              </div>

              {/* RIGHT COLUMN: STREAK CARDS, INTERACTIVE CALENDAR & LIVE LEADERBOARD */}
              <div className="w-full xl:w-[320px] 2xl:w-[350px] shrink-0">
                <StudentRightSidebar
                  streak={streak}
                  longestStreak={Math.max(streak, 4)}
                  studentName={studentName}
                  studyHours={Math.max(10, Math.round(lawXp / 25))}
                  userRank={57479}
                  onOpenStreakLog={() => setStreakModalOpen(true)}
                />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: CHAPTER NOTES & STUDY BOOKS (SEARCH & PEER ENGAGEMENT)             */}
          {/* ========================================================================= */}
          {activeTab === "chapters" && (
            <div className="space-y-6">
              {/* HEADER & SEARCH BAR */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E4E7]">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#221D1D]">Chapter Notes &amp; Study Books</h2>
                  <p className="text-xs text-[#4D433F] mt-0.5">
                    Read complete statutory codices with precedent notes inside the secure in-web DRM reader.
                  </p>
                </div>

                {/* Instant Act Search */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-[#77716E] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Acts, Sections, Topics..."
                    className="w-full pl-9 pr-3 py-2 rounded-full bg-white border border-[#E7E4E7] text-xs text-[#221D1D] focus:outline-none focus:border-[#BFAFE5] shadow-xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#77716E] hover:text-[#221D1D]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 2 MAIN CURRICULUM BOOKS */}
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
                      className="bg-white rounded-3xl border border-[#E7E4E7] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col justify-between"
                    >
                      <div className="h-2 w-full bg-[#AED7E9]" />
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-start gap-4">
                          <div className="relative w-20 h-28 shrink-0 rounded-2xl overflow-hidden shadow-sm border border-[#E7E4E7] bg-[#F7F7F5]">
                            <Image src={book.coverImage} alt={book.title} fill className="object-cover" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C4E1EC]/60 text-[#221D1D] border border-[#AED7E9]">
                                {book.badge}
                              </span>
                              {isBookUnlocked ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-[#AED7E9]/40 text-[#221D1D] border-[#AED7E9] flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-[#4B8097]" /> Enrolled
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-[#F4C5C0]/40 text-[#C35F3B] border-[#F4C5C0] flex items-center gap-1">
                                  <Lock className="w-3 h-3" /> Locked
                                </span>
                              )}
                              <span className="text-[10px] font-medium text-[#77716E]">
                                {book.totalPages}
                              </span>
                            </div>
                            <h3 className="text-base font-serif font-bold text-[#221D1D] leading-snug">
                              {book.title}
                            </h3>
                            <p className="text-xs text-[#4B8097] font-semibold mt-0.5">
                              {book.subtitle}
                            </p>
                            <p className="text-[11px] text-[#4D433F] font-semibold mt-1 flex items-center gap-1">
                              <Flame className="w-3 h-3 text-[#F7892A]" />
                              <span>{book.peerCount}+ students actively reading</span>
                            </p>
                          </div>
                        </div>

                        <p className="text-xs text-[#4D433F] leading-relaxed mt-4 flex-1">
                          {book.description}
                        </p>

                        <div className="mt-4 pt-3 border-t border-[#E7E4E7]">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#77716E] mb-2">
                            Included in this Master Volume
                          </p>
                          <div className="space-y-1">
                            {book.unitsList.map((unit, uIdx) => (
                              <div key={uIdx} className="flex items-center gap-2 text-xs text-[#4D433F]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#4B8097] shrink-0" />
                                <span className="truncate">{unit}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-5 mt-4 border-t border-[#E7E4E7] flex items-center justify-between gap-3">
                          <div className="flex items-center gap-1.5 text-[11px] text-[#77716E]">
                            <Lock className="w-3.5 h-3.5 text-[#77716E] shrink-0" />
                            <span>{isBookUnlocked ? "In-Web Reader Ready" : "DRM Encrypted"}</span>
                          </div>
                          {isBookUnlocked ? (
                            <button
                              onClick={() => handleOpenPdf(book.pdfUrl, book.title, book.subtitle)}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-bold transition-all shadow-xs cursor-pointer"
                            >
                              <BookOpen className="w-4 h-4" />
                              Read Now
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                handleBuyCourse(activeCourse);
                              }}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#221D1D] hover:bg-[#383130] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                            >
                              <Lock className="w-4 h-4 text-[#AED7E9]" /> Unlock Course (₹99)
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DYNAMIC DIGITAL CODICES (ADMIN UPLOADED & CATALOG) */}
              {availableProducts.length > 0 && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#4B8097]" />
                      <h3 className="text-base font-serif font-bold text-[#221D1D]">
                        Digital Codices &amp; Supplementary Materials ({availableProducts.length})
                      </h3>
                    </div>
                    <span className="text-xs text-[#77716E]">Encrypted In-Web DRM Reader</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {availableProducts.map((prod: any) => {
                      const isProdUnlocked =
                        isAdminUser ||
                        purchasedBooks.includes(prod.id) ||
                        purchasedBooks.includes(prod._id) ||
                        (prod.courseId === "course-ca-foundation" && isCaUnlocked) ||
                        (prod.courseId === "course-cseet" && isCsUnlocked) ||
                        (prod.category?.includes("CA") && isCaUnlocked) ||
                        (prod.category?.includes("CS") && isCsUnlocked);

                      const previewLimit = Number(prod.previewPagesLimit) || 5;
                      const pdfPath = prod.pdfUrl || `/api/pdf/${prod.slug || prod.id}.pdf`;

                      return (
                        <div
                          key={prod.id || prod._id}
                          className="bg-white rounded-3xl border border-[#E7E4E7] shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
                        >
                          <div className="h-2 w-full bg-[#BFAFE5]" />
                          <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C4E1EC]/60 text-[#221D1D] border border-[#AED7E9]">
                                    {prod.category || "Study Material"}
                                  </span>
                                  {isProdUnlocked ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-[#AED7E9]/40 text-[#221D1D] border-[#AED7E9] flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-[#4B8097]" /> Enrolled • Full Access
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-[#F7892A]/15 text-[#C35F3B] border-[#F7892A]/30 flex items-center gap-1">
                                      <Lock className="w-3 h-3" /> Preview ({previewLimit} Pages)
                                    </span>
                                  )}
                                  {prod.pages && (
                                    <span className="text-[10px] font-medium text-[#77716E]">
                                      {prod.pages}
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-base font-serif font-bold text-[#221D1D] leading-snug">
                                  {prod.title}
                                </h4>
                                {prod.subtitle && (
                                  <p className="text-xs text-[#4B8097] font-semibold mt-0.5">
                                    {prod.subtitle}
                                  </p>
                                )}
                              </div>
                              <span className="text-sm font-bold text-[#221D1D] bg-[#F7F7F5] px-2.5 py-1 rounded-xl border border-[#E7E4E7] shrink-0">
                                ₹{prod.price || 99}
                              </span>
                            </div>

                            {prod.description && (
                              <p className="text-xs text-[#4D433F] leading-relaxed mt-3 flex-1">
                                {prod.description}
                              </p>
                            )}

                            {Array.isArray(prod.units) && prod.units.length > 0 && (
                              <div className="mt-3 pt-2.5 border-t border-[#E7E4E7]">
                                <div className="space-y-1">
                                  {prod.units.slice(0, 3).map((u: string, uIdx: number) => (
                                    <div key={uIdx} className="flex items-center gap-2 text-xs text-[#4D433F]">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4B8097] shrink-0" />
                                      <span className="truncate">{u}</span>
                                    </div>
                                  ))}
                                  {prod.units.length > 3 && (
                                    <span className="text-[10px] text-[#77716E] pl-5 block">
                                      +{prod.units.length - 3} more units included
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="pt-4 mt-4 border-t border-[#E7E4E7] flex items-center justify-between gap-3">
                              <span className="text-[10px] font-mono text-[#77716E] truncate max-w-[120px]">
                                {pdfPath.split("/").pop()}
                              </span>
                              <div className="flex items-center gap-2">
                                {isProdUnlocked ? (
                                  <button
                                    onClick={() => handleOpenPdf(pdfPath, prod.title, prod.subtitle || "Full Edition", true)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-bold transition-all shadow-xs cursor-pointer"
                                  >
                                    <BookOpen className="w-3.5 h-3.5" />
                                    <span>Read Full Codex</span>
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleOpenPdf(
                                          pdfPath,
                                          prod.title,
                                          prod.subtitle || "Free Preview",
                                          false,
                                          true,
                                          previewLimit,
                                          prod.price || 99,
                                          () => {
                                            addToCart({
                                              id: prod.id,
                                              title: prod.title,
                                              price: prod.price || 99,
                                              originalPrice: prod.originalPrice || 299,
                                              format: "pdf",
                                              category: prod.category || "Digital Codex",
                                              badge: prod.badge || `₹${prod.price || 99}`,
                                            });
                                            setIsCartOpen(true);
                                            setCheckoutStep("details");
                                          }
                                        )
                                      }
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#AED7E9] text-[#221D1D] hover:bg-[#C4E1EC]/40 text-xs font-semibold transition-all cursor-pointer"
                                    >
                                      <Eye className="w-3.5 h-3.5 text-[#4B8097]" />
                                      <span>Sample ({previewLimit} pgs)</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        addToCart({
                                          id: prod.id,
                                          title: prod.title,
                                          price: prod.price || 99,
                                          originalPrice: prod.originalPrice || 299,
                                          format: "pdf",
                                          category: prod.category || "Digital Codex",
                                          badge: prod.badge || `₹${prod.price || 99}`,
                                        });
                                        setIsCartOpen(true);
                                        setCheckoutStep("details");
                                      }}
                                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#221D1D] hover:bg-[#383130] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                                    >
                                      <ShoppingBag className="w-3.5 h-3.5 text-[#AED7E9]" />
                                      <span>Buy (₹{prod.price || 99})</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CHAPTER-BY-CHAPTER UNITS LIST */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-serif font-bold text-[#221D1D]">
                    Act-by-Act Comprehensive Unit Notes ({filteredChapters.length})
                  </h3>
                  <span className="text-xs text-[#77716E]">Click unit to launch in DRM Reader</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredChapters.map((ch) => {
                    const isSelected = selectedChapterId === ch.id;
                    return (
                      <div
                        key={ch.id}
                        className={`bg-white rounded-3xl border p-5 transition-all shadow-xs space-y-3 ${
                          isSelected ? "border-[#AED7E9] ring-2 ring-[#AED7E9]/40" : "border-[#E7E4E7] hover:border-[#AED7E9]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4B8097]">{ch.code}</span>
                            <h4 className="text-sm font-serif font-bold text-[#221D1D] leading-snug mt-0.5">{ch.name}</h4>
                          </div>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F7F7F5] text-[#221D1D] border border-[#E7E4E7] shrink-0">
                            {ch.weightage}
                          </span>
                        </div>

                        <p className="text-xs text-[#4D433F] leading-relaxed line-clamp-2">
                          {ch.description}
                        </p>

                        <div className="flex items-center gap-2 text-[10.5px] font-semibold text-[#4D433F]">
                          <Flame className="w-3 h-3 text-[#F7892A]" />
                          <span>{ch.peerReaders || 120}+ peers currently reading this act</span>
                        </div>

                        {/* Units inside this chapter */}
                        {ch.units && ch.units.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-[#E7E4E7]">
                            {ch.units.map((unit) => {
                              const unitId = `${ch.id}-u${unit.unitNumber}`;
                              const isCompleted = completedUnits.includes(unitId);
                              const isBookmarked = bookmarkedUnits.includes(unitId);
                              const isAccessible = hasActiveCourseAccess || unit.isSample;

                              return (
                                <div
                                  key={unit.unitNumber}
                                  className="p-2.5 rounded-2xl bg-[#F7F7F5] hover:bg-[#E7E4E7]/40 border border-[#E7E4E7] flex items-center justify-between gap-2 transition-colors"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    <button
                                      type="button"
                                      onClick={() => toggleUnitCompleted(unitId, unit.title)}
                                      title={isCompleted ? "Mark Incomplete" : "Mark as Completed"}
                                      className="text-[#77716E] hover:text-[#4B8097] cursor-pointer"
                                    >
                                      {isCompleted ? (
                                        <CheckCircle2 className="w-4 h-4 text-[#4B8097]" />
                                      ) : (
                                        <Square className="w-4 h-4 text-[#D8D4D8]" />
                                      )}
                                    </button>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-xs font-semibold text-[#221D1D] truncate">{unit.title}</p>
                                      <p className="text-[10px] text-[#77716E] truncate">{unit.pages} • {unit.summary}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      onClick={() => toggleBookmark(unitId)}
                                      title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                                      className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                                        isBookmarked ? "text-[#F7892A] bg-[#F7892A]/15" : "text-[#77716E] hover:text-[#221D1D]"
                                      }`}
                                    >
                                      <Bookmark className="w-3.5 h-3.5" />
                                    </button>
                                    {isAccessible ? (
                                      <button
                                        onClick={() => handleOpenPdf(unit.pdfUrl, ch.name, unit.title, unit.isSample)}
                                        className="px-3 py-1.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-[11px] font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1"
                                      >
                                        {unit.isSample && !hasActiveCourseAccess && <Sparkles className="w-3 h-3 text-[#4B8097]" />}
                                        <span>{unit.isSample && !hasActiveCourseAccess ? "Sample Note" : "Read Note"}</span>
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => setLockedPrompt({ open: true, courseName: activeCourseName })}
                                        className="px-3 py-1.5 rounded-full bg-[#221D1D] hover:bg-[#383130] text-white text-[11px] font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1"
                                      >
                                        <Lock className="w-3 h-3 text-[#AED7E9]" />
                                        <span>Unlock</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: SYLLABUS MASTERY RADAR (CHECKLIST & PROGRESS %)                   */}
          {/* ========================================================================= */}
          {activeTab === "mastery" && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-[#E7E4E7] p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1.5 text-center sm:text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4B8097]">Curriculum Progress</span>
                  <h2 className="text-2xl font-serif font-bold text-[#221D1D]">
                    {activeCourse === "ca" ? "CA Foundation Law Mastery" : "CSEET Law & Management Mastery"}
                  </h2>
                  <p className="text-xs text-[#4D433F] max-w-md">
                    Track your preparation journey across statutory notes, case study practice, and timed MCQ drills.
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 bg-[#F7F7F5] p-4 rounded-2xl border border-[#E7E4E7]">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-[#E7E4E7]"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#AED7E9]"
                        strokeDasharray={`${masteryPercent}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute font-black text-sm text-[#221D1D]">{masteryPercent}%</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#221D1D]">{completedCount} of {totalUnitsCount} Units</p>
                    <p className="text-[10.5px] text-[#77716E]">Completed &amp; Verified</p>
                  </div>
                </div>
              </div>

              {/* ACT-BY-ACT CHECKLIST */}
              <div className="space-y-3">
                {chaptersList.map((ch, idx) => {
                  const chUnitIds = ch.units?.map((u) => `${ch.id}-u${u.unitNumber}`) || [`${ch.id}-u1`];
                  const chCompletedCount = chUnitIds.filter((id) => completedUnits.includes(id)).length;
                  const chPercent = Math.round((chCompletedCount / chUnitIds.length) * 100);

                  return (
                    <div key={ch.id} className="bg-white rounded-3xl border border-[#E7E4E7] p-5 shadow-xs space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-2xl bg-[#C4E1EC]/60 text-[#221D1D] border border-[#AED7E9] font-bold text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="text-sm font-serif font-bold text-[#221D1D]">{ch.name}</h4>
                            <p className="text-[11px] text-[#77716E]">{ch.code} • Weightage: {ch.weightage}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#221D1D] bg-[#AED7E9]/40 px-2.5 py-1 rounded-full border border-[#AED7E9]">
                          {chPercent}% Complete
                        </span>
                      </div>

                      {/* 3 Milestones per Chapter */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#E7E4E7]">
                        <div className="p-2.5 rounded-2xl bg-[#F7F7F5] flex items-center justify-between text-xs text-[#4D433F]">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-[#4B8097]" />
                            <span>Notes Read</span>
                          </span>
                          {chCompletedCount > 0 ? (
                            <CheckCircle2 className="w-4 h-4 text-[#4B8097]" />
                          ) : (
                            <span className="text-[10px] text-[#77716E]">Pending</span>
                          )}
                        </div>

                        <div className="p-2.5 rounded-2xl bg-[#F7F7F5] flex items-center justify-between text-xs text-[#4D433F]">
                          <span className="flex items-center gap-1.5">
                            <Flame className="w-3.5 h-3.5 text-[#C35F3B]" />
                            <span>Case Precedent</span>
                          </span>
                          <span className="text-[10px] text-[#4B8097] font-bold">Practiced</span>
                        </div>

                        <div className="p-2.5 rounded-2xl bg-[#F7F7F5] flex items-center justify-between text-xs text-[#4D433F]">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#F7892A]" />
                            <span>{ch.mcqCount} MCQs</span>
                          </span>
                          <span className="text-[10px] text-[#4B8097] font-bold">Cleared (90%)</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: CASE STUDIES (WEEKLY HIGH-YIELD DRILLS)                            */}
          {/* ========================================================================= */}
          {activeTab === "cases" && (
            <div className="space-y-6">
              <div className="max-w-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4B8097]">Weekly Feature</span>
                <h2 className="text-2xl font-serif font-bold text-[#221D1D] mt-1">High-Yield Case Studies</h2>
                <p className="text-sm text-[#4D433F] mt-1">Master the 4-step answer structure: Monster Monday, Midweek Law Madness &amp; Final Boss Friday.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {(liveCases && liveCases.length > 0 ? liveCases : WEEKLY_CASES).map((cs: any) => (
                  <div key={cs.id || cs._id} className="bg-white rounded-3xl border border-[#E7E4E7] shadow-xs p-5 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#4B8097] uppercase tracking-wide">{cs.day}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F4C5C0]/40 text-[#C35F3B] border border-[#F4C5C0]">{cs.badge || "Live Case"}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#77716E] block mb-1">{cs.subject}</span>
                      <h3 className="text-sm font-serif font-bold text-[#221D1D] leading-snug">{cs.title}</h3>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7] text-xs text-[#4D433F] leading-relaxed italic flex-1">&ldquo;{cs.scenario}&rdquo;</div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#4B8097] block mb-1">Model Answer</span>
                      {hasActiveCourseAccess ? (
                        <p className="text-xs text-[#77716E] leading-relaxed">{cs.modelAnswer}</p>
                      ) : (
                        <div className="relative p-3 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7] overflow-hidden">
                          <p className="text-xs text-[#77716E] filter blur-[3px] select-none pointer-events-none line-clamp-3">
                            {cs.modelAnswer}
                          </p>
                          <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px] flex items-center justify-center gap-1.5 p-2 text-center">
                            <Lock className="w-3.5 h-3.5 text-[#C35F3B]" />
                            <span className="text-[11px] font-bold text-[#221D1D]">Enrolled Students Only</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="pt-3 border-t border-[#E7E4E7] flex items-center justify-between text-[11px]">
                      <span className="font-mono text-[#77716E]">{cs.precedent || "Direct Statutory Analysis"}</span>
                      {hasActiveCourseAccess ? (
                        <button
                          onClick={() => awardXp(30, `Practiced Case: ${cs.title}`)}
                          className="text-[#4B8097] font-bold hover:underline cursor-pointer"
                        >
                          6/6 Marks (+30 XP)
                        </button>
                      ) : (
                        <button
                          onClick={() => setLockedPrompt({ open: true, courseName: activeCourseName })}
                          className="text-[#C35F3B] font-bold hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Lock className="w-3 h-3" />
                          <span>Unlock Case Drill</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: GOOGLE FORM MCQ TESTS & MOCK DRILLS                                 */}
          {/* ========================================================================= */}
          {activeTab === "mcqtest" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4B8097]">Live Examination Desk</span>
                  <h2 className="text-2xl font-serif font-bold text-[#221D1D] mt-0.5">Google Form MCQ Tests &amp; Mock Drills</h2>
                  <p className="text-xs text-[#4D433F] mt-1 max-w-xl">
                    Solve official examination standard chapter quizzes and timed mock tests directly inside the portal with instant feedback and score submissions.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F7892A]/15 border border-[#F7892A]/40 text-[#221D1D] text-xs font-bold self-start sm:self-auto">
                  <Sparkles className="w-3.5 h-3.5 text-[#F7892A] fill-[#F7892A]" />
                  <span>Earn +50 LawXP per Test Completed</span>
                </div>
              </div>

              {/* TESTS GRID */}
              {(() => {
                const filteredTests = liveMcqTests.filter(
                  (t) => t.course === activeCourse || t.course === "both" || !t.course
                );

                if (filteredTests.length === 0) {
                  return (
                    <div className="bg-white rounded-3xl border border-[#E7E4E7] p-12 text-center space-y-3 shadow-xs">
                      <div className="w-12 h-12 rounded-2xl bg-[#C4E1EC]/60 text-[#221D1D] border border-[#AED7E9] flex items-center justify-center mx-auto">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold text-[#221D1D]">No Tests Scheduled For This Stream Yet</h3>
                      <p className="text-xs text-[#77716E] max-w-sm mx-auto">
                        New weekly mock drills are uploaded regularly by academic administrators.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredTests.map((test) => (
                      <div
                        key={test.id}
                        className="bg-white rounded-3xl border border-[#E7E4E7] shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition-all space-y-4"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-[#C4E1EC]/60 text-[#221D1D] border border-[#AED7E9]">
                              {test.subject}
                            </span>
                            <span className="text-[10.5px] font-bold text-[#221D1D] bg-[#AED7E9]/40 px-2.5 py-0.5 rounded-full border border-[#AED7E9] flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-[#4B8097]" /> Ready
                            </span>
                          </div>

                          <h3 className="text-base font-serif font-bold text-[#221D1D] leading-snug">
                            {test.title}
                          </h3>

                          {/* Chips */}
                          <div className="flex items-center gap-2 flex-wrap text-xs">
                            <span className="px-2.5 py-1 rounded-full bg-[#F7F7F5] border border-[#E7E4E7] font-semibold text-[#4D433F]">
                              📝 {test.questionCount || 30} Questions
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-[#F7F7F5] border border-[#E7E4E7] font-semibold text-[#4D433F] flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#4B8097]" />
                              <span>{test.duration || 30} Mins</span>
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-[#F7F7F5] border border-[#E7E4E7] font-semibold text-[#4D433F]">
                              🎯 {test.totalMarks || 30} Marks
                            </span>
                          </div>

                          {test.instructions && (
                            <p className="text-xs text-[#77716E] bg-[#F7F7F5] p-3 rounded-2xl border border-[#E7E4E7] leading-relaxed">
                              {test.instructions}
                            </p>
                          )}

                          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#4D433F] pt-1">
                            <Flame className="w-3.5 h-3.5 text-[#F7892A]" />
                            <span>👥 {test.peerAttempts || 89}+ students completed this mock test</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-4 border-t border-[#E7E4E7] flex items-center justify-between gap-3">
                          {hasActiveCourseAccess ? (
                            <>
                              <button
                                onClick={() => {
                                  setActiveFormModal({
                                    open: true,
                                    url: test.formUrl,
                                    title: test.title,
                                    subject: test.subject,
                                    duration: test.duration || 30,
                                  });
                                  awardXp(50, `Started Google Form Mock Drill: ${test.title} 🏆`);
                                }}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-bold shadow-xs transition-all cursor-pointer"
                              >
                                <Sparkles className="w-4 h-4" />
                                <span>Take Test (In-Portal)</span>
                              </button>

                              {test.formUrl && (
                                <a
                                  href={test.formUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => awardXp(50, `Launched Form Test: ${test.title}`)}
                                  className="p-2.5 rounded-full bg-[#F7F7F5] hover:bg-[#E7E4E7] text-[#4D433F] hover:text-[#221D1D] transition-colors border border-[#E7E4E7]"
                                  title="Open Google Form in separate tab"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                            </>
                          ) : (
                            <button
                              onClick={() => setLockedPrompt({ open: true, courseName: activeCourseName })}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#221D1D] hover:bg-[#383130] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                            >
                              <Lock className="w-3.5 h-3.5 text-[#AED7E9]" />
                              <span>Unlock Course to Take Test</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: LAST DAY REVISION (LDR FLOWCHARTS & SUMMARY MATRIX)                 */}
          {/* ========================================================================= */}
          {activeTab === "ldr" && (
            <div className="space-y-6">
              <div className="max-w-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4B8097]">Last Day Revision</span>
                <h2 className="text-2xl font-serif font-bold text-[#221D1D] mt-1">Exam Flowcharts &amp; Quick Notes</h2>
                <p className="text-sm text-[#4D433F] mt-1">High-speed visual recall aids for the final 36 hours before your law exam (Protected DRM In-Web View).</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { title: "Indian Partnership Act Summary Deck", desc: "One-page flowchart covering Section 4, Section 6 True Test (Cox v. Hickman), Section 28 Holding Out, and Section 69 Non-Registration disabilities.", url: "/notes/unit-1-general-nature-of-partnership.pdf", label: "Open Flowchart", badge: "Partnership Act", badgeColor: "bg-[#C4E1EC]/60 text-[#221D1D] border-[#AED7E9]" },
                  { title: "Sale of Goods Act - Section 16 Matrix", desc: "Caveat Emptor exceptions chart, Priest v. Last, Grant v. Australian Knitting Mills, and Section 54 Unpaid Seller Resale rules.", url: "/notes/unit-2-relations-of-partners.pdf", label: "Open Matrix", badge: "Sale of Goods", badgeColor: "bg-[#F7892A]/15 text-[#221D1D] border-[#F7892A]/40" },
                  { title: "Companies Act - Corporate Veil Doctrine", desc: "Salomon v. Salomon case, exceptions to corporate veil, Doctrine of Ultra Vires and Indoor Management rule (Royal British Bank v. Turquand).", url: "/notes/companies-act-unit-1.pdf", label: "Open Notes", badge: "Companies Act", badgeColor: "bg-[#BFAFE5]/40 text-[#221D1D] border-[#BFAFE5]" },
                  { title: "Contract Act - Essential Checklist", desc: "Quick reference for Section 2 definitions, valid/void/voidable contracts, and 8 essential elements checklist for exam speed.", url: "/notes/contract-act-unit-1.pdf", label: "Open Checklist", badge: "Contract Act", badgeColor: "bg-[#F4C5C0]/40 text-[#C35F3B] border-[#F4C5C0]" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white rounded-3xl border border-[#E7E4E7] shadow-xs p-5 space-y-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${item.badgeColor}`}>{item.badge}</div>
                        <div className="flex items-center gap-1 text-[10px] text-[#77716E] font-medium">
                          <Lock className="w-3 h-3 text-[#4B8097]" />
                          <span>DRM Protected</span>
                        </div>
                      </div>
                      <h3 className="text-sm font-serif font-bold text-[#221D1D]">{item.title}</h3>
                      <p className="text-xs text-[#4D433F] leading-relaxed mt-1">{item.desc}</p>
                    </div>
                    <div className="pt-2">
                      {hasActiveCourseAccess ? (
                        <button
                          onClick={() => handleOpenPdf(item.url, item.title, "LDR Quick Deck")}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-bold transition-all cursor-pointer shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{item.label} (Secure Reader)</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setLockedPrompt({ open: true, courseName: activeCourseName })}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#221D1D] hover:bg-[#383130] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                        >
                          <Lock className="w-3.5 h-3.5 text-[#AED7E9]" />
                          <span>Unlock LDR Flowchart</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: CERTIFICATES (OFFICIAL CREDENTIALS & ACHIEVEMENTS)                   */}
          {/* ========================================================================= */}
          {activeTab === "certificates" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E4E7]">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#221D1D] flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#4B8097]" />
                    <span>Academic Certificates &amp; Verifiable Credentials</span>
                  </h2>
                  <p className="text-xs text-[#77716E] mt-0.5">
                    Official completion credentials issued by The Law Kaksha for mastery of Indian Statutory Laws.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Certificate 1: CA Foundation Business Laws */}
                <div className="bg-white rounded-3xl border border-[#E7E4E7] p-6 shadow-2xs flex flex-col justify-between hover:border-[#221D1D] transition-all">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#AED7E9]/40 text-[#221D1D] border border-[#AED7E9]">
                        Verified Credential
                      </span>
                      <span className="text-xs font-mono text-[#77716E]">TLK-CA-2026-8942</span>
                    </div>
                    <div>
                      <h3 className="text-base font-serif font-bold text-[#221D1D]">
                        CA Foundation Paper 2: Business Laws Master
                      </h3>
                      <p className="text-xs text-[#77716E] mt-1 leading-relaxed">
                        Awarded to <strong className="text-[#221D1D]">{studentName}</strong> for successful completion of the codified curriculum including Contract Act 1872, Sale of Goods 1930, and Partnership 1932.
                      </p>
                    </div>
                    <div className="p-3 bg-[#F7F7F5] rounded-2xl border border-[#E7E4E7] text-[11px] text-[#221D1D] flex items-center justify-between font-medium">
                      <span>Curriculum Score: 94%</span>
                      <span className="text-[#77716E]">Issued: 2nd October 2026</span>
                    </div>
                  </div>
                  <div className="pt-5 mt-5 border-t border-[#E7E4E7] flex items-center gap-3">
                    <button
                      onClick={() => alert("Certificate verified cryptographically on The Law Kaksha student ledger.")}
                      className="flex-1 py-2.5 rounded-full bg-[#221D1D] hover:bg-[#383130] text-white text-xs font-bold transition-all cursor-pointer shadow-xs text-center"
                    >
                      Verify Credential
                    </button>
                    <button
                      onClick={() => alert("Generating official watermarked PDF certificate...")}
                      className="px-4 py-2.5 rounded-full bg-[#F7F7F5] hover:bg-[#E7E4E7] text-[#221D1D] border border-[#E7E4E7] text-xs font-bold transition-all cursor-pointer"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>

                {/* Certificate 2: CSEET Stream */}
                <div className="bg-white rounded-3xl border border-[#E7E4E7] p-6 shadow-2xs flex flex-col justify-between hover:border-[#221D1D] transition-all">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                        In Progress (85%)
                      </span>
                      <span className="text-xs font-mono text-[#77716E]">TLK-CS-PENDING</span>
                    </div>
                    <div>
                      <h3 className="text-base font-serif font-bold text-[#221D1D]">
                        CSEET Legal Aptitude &amp; General Management
                      </h3>
                      <p className="text-xs text-[#77716E] mt-1 leading-relaxed">
                        Covers all 8 Units including Company Law 2013, Negotiable Instruments 1881, and Henri Fayol&apos;s Principles. Complete remaining mock drills to unlock.
                      </p>
                    </div>
                    <div className="w-full bg-[#F7F7F5] rounded-full h-2 overflow-hidden border border-[#E7E4E7]">
                      <div className="bg-[#221D1D] h-full rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>
                  <div className="pt-5 mt-5 border-t border-[#E7E4E7]">
                    <button
                      onClick={() => { setActiveCourse("cs"); setActiveTab("chapters"); }}
                      className="w-full py-2.5 rounded-full bg-[#221D1D] hover:bg-[#383130] text-white text-xs font-bold transition-all cursor-pointer shadow-xs text-center"
                    >
                      Complete Remaining Units (15% Left)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: REFER AND EARN (REWARD CODES & SCHOLARSHIPS)                         */}
          {/* ========================================================================= */}
          {activeTab === "refer" && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-gradient-to-br from-[#AED7E9]/25 via-white to-[#AED7E9]/15 p-6 sm:p-8 border border-[#AED7E9] text-[#221D1D] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-lg">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#221D1D] text-[#AED7E9] shadow-xs">
                    Peer Scholarship Program
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#221D1D]">
                    Invite Peers. Earn 1 Month Free All-Access Pass!
                  </h2>
                  <p className="text-xs sm:text-sm text-[#4D433F] leading-relaxed">
                    When your study group joins with your unique code, they receive a 20% scholarship discount on any Master Codex Pass, and you receive ₹100 learning credits or a 1-month free extension!
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#AED7E9] space-y-3 shrink-0 sm:w-72">
                  <p className="text-[11px] font-bold text-[#77716E] uppercase tracking-wider">Your Referral Code</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-[#F7F7F5] border border-[#E7E4E7] rounded-xl font-mono text-sm font-bold text-[#221D1D] text-center select-all">
                      LAWKAKSHA-{initials}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`LAWKAKSHA-${initials}`);
                        alert("Referral code copied to clipboard!");
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#221D1D] hover:bg-[#383130] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              {/* 3 Step Process */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-3xl border border-[#E7E4E7] p-5 shadow-2xs">
                  <div className="w-10 h-10 rounded-2xl bg-[#AED7E9]/40 text-[#221D1D] border border-[#AED7E9] flex items-center justify-center font-bold text-sm mb-3">
                    1
                  </div>
                  <h4 className="text-sm font-serif font-bold text-[#221D1D]">Share your link or code</h4>
                  <p className="text-xs text-[#77716E] mt-1">Send your invite code to classmates preparing for CA Foundation or CSEET.</p>
                </div>

                <div className="bg-white rounded-3xl border border-[#E7E4E7] p-5 shadow-2xs">
                  <div className="w-10 h-10 rounded-2xl bg-[#BFAFE5]/40 text-[#221D1D] border border-[#BFAFE5] flex items-center justify-center font-bold text-sm mb-3">
                    2
                  </div>
                  <h4 className="text-sm font-serif font-bold text-[#221D1D]">Peer Gets 20% Off</h4>
                  <p className="text-xs text-[#77716E] mt-1">They immediately get 20% off when subscribing to any curriculum codex.</p>
                </div>

                <div className="bg-white rounded-3xl border border-[#E7E4E7] p-5 shadow-2xs">
                  <div className="w-10 h-10 rounded-2xl bg-[#F4C5C0]/40 text-[#C35F3B] border border-[#F4C5C0] flex items-center justify-center font-bold text-sm mb-3">
                    3
                  </div>
                  <h4 className="text-sm font-serif font-bold text-[#221D1D]">Unlock Free Learning Month</h4>
                  <p className="text-xs text-[#77716E] mt-1">You automatically earn 1 free month access and ₹100 wallet credits.</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: PURCHASE HISTORY (TAX INVOICES & CODEX PASSES)                        */}
          {/* ========================================================================= */}
          {activeTab === "purchases" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E4E7]">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#221D1D] flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#4B8097]" />
                    <span>Purchase History &amp; Official Invoices</span>
                  </h2>
                  <p className="text-xs text-[#77716E] mt-0.5">
                    Download GST tax receipts and review active curriculum subscriptions.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-[#E7E4E7] shadow-2xs overflow-hidden">
                <div className="divide-y divide-[#E7E4E7]">
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F7F7F5] transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#AED7E9]/40 text-[#221D1D] border border-[#AED7E9]">
                          Active Pass
                        </span>
                        <span className="text-xs font-mono text-[#77716E]">INV-TLK-2026-1049</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#221D1D]">CA Foundation Business Laws Master Codex Pass</h4>
                      <p className="text-xs text-[#77716E]">Subscribed on 16th Jul 2026 • Lifetime In-Web DRM Reader Access</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-sm font-bold text-[#221D1D]">₹99.00</span>
                      <button
                        onClick={() => alert("Downloading Tax Invoice PDF #INV-TLK-2026-1049...")}
                        className="px-3.5 py-1.5 rounded-full bg-[#F7F7F5] hover:bg-[#E7E4E7] text-[#221D1D] border border-[#E7E4E7] text-xs font-semibold transition-all cursor-pointer"
                      >
                        Download Invoice
                      </button>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F7F7F5] transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#BFAFE5]/40 text-[#221D1D] border border-[#BFAFE5]">
                          Completed
                        </span>
                        <span className="text-xs font-mono text-[#77716E]">INV-TLK-2026-0812</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#221D1D]">All-Access Dual Codex Pass (CA Foundation + CSEET)</h4>
                      <p className="text-xs text-[#77716E]">Subscribed on 15th Aug 2026 • Razorpay Transaction ID: pay_982Fhs9201</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-sm font-bold text-[#221D1D]">₹180.00</span>
                      <button
                        onClick={() => alert("Downloading Tax Invoice PDF #INV-TLK-2026-0812...")}
                        className="px-3.5 py-1.5 rounded-full bg-[#F7F7F5] hover:bg-[#E7E4E7] text-[#221D1D] border border-[#E7E4E7] text-xs font-semibold transition-all cursor-pointer"
                      >
                        Download Invoice
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav
        aria-label="Student Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E7E4E7] px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.06)] safe-bottom"
      >
        {NAV_ITEMS.slice(0, 5).map((item) => {
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
                isActive ? "text-[#221D1D] font-bold" : "text-[#77716E] hover:text-[#221D1D]"
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${isActive ? "bg-[#AED7E9]/40 text-[#221D1D]" : ""}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight leading-none mt-0.5 truncate max-w-[62px]">
                {item.id === "home" ? "Home" : item.id === "chapters" ? "Notes" : item.id === "mastery" ? "Mastery" : item.id === "cases" ? "Cases" : item.id === "mcqtest" ? "Tests" : item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ========================================================================= */}
      {/* MODALS & OVERLAYS                                                         */}
      {/* ========================================================================= */}

      {/* 1. BADGES & XP PROGRESSION MODAL */}
      {badgesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#221D1D]/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-[#E7E4E7]">
            <div className="flex items-center justify-between border-b border-[#E7E4E7] pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#F7892A]" />
                <h3 className="text-base font-serif font-bold text-[#221D1D]">LawXP &amp; Milestone Badges</h3>
              </div>
              <button onClick={() => setBadgesModalOpen(false)} className="text-[#77716E] hover:text-[#221D1D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#AED7E9] text-[#221D1D] space-y-2 border border-[#98C5D8]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4D433F]">Current Rank</span>
                <span className="text-xs font-bold bg-white/60 px-2.5 py-0.5 rounded-full text-[#221D1D]">{lawXp} LawXP</span>
              </div>
              <h4 className="text-lg font-serif font-bold text-[#221D1D]">Level {levelInfo.level}: {levelInfo.title}</h4>
              <div className="w-full bg-white/60 rounded-full h-2 overflow-hidden">
                <div className="bg-[#BFAFE5] h-full rounded-full" style={{ width: `${levelInfo.progress}%` }} />
              </div>
              <p className="text-[11px] text-[#4D433F] font-medium">
                Earn {levelInfo.nextXp - lawXp} more XP to unlock the next title.
              </p>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Novice Advocate", tier: "3-Day Streak", unlocked: streak >= 3, icon: "🥉", xp: "+50 XP" },
                { name: "Statutory Master", tier: "7-Day Streak", unlocked: streak >= 7, icon: "⚡", xp: "+100 XP" },
                { name: "Precedent Shield", tier: "14-Day Streak", unlocked: streak >= 14, icon: "🛡️", xp: "+250 XP" },
                { name: "Bar Council Jurist", tier: "30-Day Streak", unlocked: streak >= 30, icon: "👑", xp: "+500 XP" },
              ].map((badge, bIdx) => (
                <div
                  key={bIdx}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                    badge.unlocked ? "bg-[#AED7E9]/40 border-[#AED7E9] text-[#221D1D]" : "bg-[#F7F7F5] border-[#E7E4E7] text-[#77716E] opacity-70"
                  }`}
                >
                  <div className="text-2xl">{badge.icon}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate">{badge.name}</p>
                    <p className="text-[10px] leading-tight text-[#77716E]">{badge.tier}</p>
                    <span className="text-[9px] font-bold text-[#4B8097]">{badge.xp}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setBadgesModalOpen(false)}
              className="w-full py-2.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-bold transition-all cursor-pointer"
            >
              Continue Learning
            </button>
          </div>
        </div>
      )}

      <EnhancedSampleChapterModal
        isOpen={sampleModalOpen}
        onClose={() => setSampleModalOpen(false)}
        bookTitle={sampleBookTitle}
        bookId={sampleBookId}
        bookPrice={99}
      />

      <SecurePdfReader
        isOpen={pdfViewer.open}
        onClose={() => setPdfViewer((prev) => ({ ...prev, open: false }))}
        pdfUrl={pdfViewer.url}
        title={pdfViewer.title}
        previewPagesLimit={pdfViewer.previewPagesLimit}
        isPurchased={pdfViewer.isPurchased}
        price={pdfViewer.price}
        onBuy={pdfViewer.onBuy}
        studentName={studentName}
        studentRoll={studentProfile.student_id}
      />

      <StudentProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onProfileUpdated={(updated) => {
          setStudentName(updated.name);
          setStudentProfile(updated);
        }}
        streak={streak}
      />

      <StreakCalendarModal
        isOpen={streakModalOpen}
        onClose={() => setStreakModalOpen(false)}
        streak={streak}
        onStreakUpdate={(newStreak) => setStreak(newStreak)}
      />

      {/* 5. GOOGLE FORM IN-PORTAL TEST TAKING MODAL */}
      {activeFormModal?.open && (
        <div className="fixed inset-0 z-50 bg-[#221D1D]/50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] shadow-2xl border border-[#E7E4E7] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-[#E7E4E7] flex items-center justify-between gap-3 bg-[#F7F7F5]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#C4E1EC]/60 text-[#221D1D] border border-[#AED7E9] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-[#4B8097]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-serif font-bold text-[#221D1D] truncate">{activeFormModal.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-[#77716E] mt-0.5">
                    <span className="font-semibold text-[#4B8097]">{activeFormModal.subject}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono text-[#4D433F]">
                      <Clock className="w-3 h-3 text-[#4B8097]" />
                      {activeFormModal.duration} Mins Timed Mock
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {activeFormModal.url && (
                  <a
                    href={activeFormModal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-full bg-white border border-[#E7E4E7] text-[#221D1D] hover:bg-[#F7F7F5] text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <span>Full Screen</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  onClick={() => setActiveFormModal(null)}
                  className="p-1.5 rounded-xl text-[#77716E] hover:text-[#221D1D] hover:bg-[#E7E4E7] transition-colors cursor-pointer"
                  title="Close Test"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Frame Body */}
            <div className="flex-1 w-full bg-[#F7F7F5] relative">
              {activeFormModal.url ? (
                <iframe
                  src={
                    activeFormModal.url.includes("embedded=true")
                      ? activeFormModal.url
                      : `${activeFormModal.url}?embedded=true`
                  }
                  className="w-full h-full border-none"
                  title={activeFormModal.title}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[#77716E] p-6 text-center">
                  <p className="text-xs font-semibold">Test link is not configured properly.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-[#E7E4E7] flex items-center justify-between text-xs bg-white">
              <div className="flex items-center gap-2 text-[#4D433F] font-medium">
                <Flame className="w-4 h-4 text-[#F7892A]" />
                <span>Submit your answers inside Google Form above, then click Finish.</span>
              </div>
              <button
                onClick={() => {
                  setActiveFormModal(null);
                  awardXp(20, `Completed Test Review: ${activeFormModal.title}`);
                }}
                className="px-5 py-2 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] font-bold text-xs shadow-xs cursor-pointer"
              >
                Finish &amp; Close Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. COURSE PURCHASE & ACCESS CONTROL PROMPT MODAL */}
      {lockedPrompt?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#221D1D]/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-[#E7E4E7] relative">
            <button
              onClick={() => setLockedPrompt(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-[#77716E] hover:text-[#221D1D] hover:bg-[#F7F7F5] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F4C5C0] text-[#C35F3B] flex items-center justify-center shrink-0 shadow-xs">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C35F3B]">
                  Course Enrollment Required
                </span>
                <h3 className="text-lg font-serif font-bold text-[#221D1D]">
                  Unlock {lockedPrompt.courseName}
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#4D433F] leading-relaxed">
              This unit note, case study model answer, mock test, or revision flowchart requires an active <strong>{lockedPrompt.courseName}</strong> enrollment pass. Enrolling unlocks all content instantly in your dashboard.
            </p>

            {/* Course Value Props Box */}
            <div className="p-4 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#221D1D]">Included with Your Pass:</span>
                <span className="text-xs font-bold text-[#4B8097]">Launch Special @ ₹99/mo</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-[#4D433F]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4B8097] shrink-0" />
                  <span>Full Codified Notes (All Chapters)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4B8097] shrink-0" />
                  <span>In-Web DRM Protected Reader</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4B8097] shrink-0" />
                  <span>Weekly High-Yield Case Studies</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4B8097] shrink-0" />
                  <span>Timed Google Form MCQ Mock Drills</span>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4B8097] shrink-0" />
                  <span>1.5-Day Last Day Revision Flowchart Deck</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  const courseType = activeCourse;
                  setLockedPrompt(null);
                  handleBuyCourse(courseType);
                }}
                className="w-full py-3.5 rounded-full bg-[#221D1D] hover:bg-[#383130] text-white text-xs font-bold shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#AED7E9]" />
                <span>Buy {lockedPrompt.courseName} Pass — ₹99/mo</span>
              </button>

              <button
                onClick={() => {
                  setLockedPrompt(null);
                  handleBuyCourse("all-access");
                }}
                className="w-full py-2.5 rounded-full bg-[#BFAFE5]/40 hover:bg-[#BFAFE5]/70 text-[#221D1D] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#BFAFE5]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#221D1D]" />
                <span>Or Get All-Access Dual Pass (CA + CS) @ ₹180</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
