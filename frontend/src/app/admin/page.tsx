"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  BookOpen,
  Users,
  Flame,
  Sparkles,
  Percent,
  Calendar,
  Search,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  X,
  Lock,
  Unlock,
  LogOut,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  ExternalLink,
  BookMarked,
  Key,
  Menu,
} from "lucide-react";

// --- DATA INTERFACES ---
export interface ProductItem {
  id: string;
  title: string;
  subtitle: string;
  category: "CA Foundation" | "CSEET" | "Both";
  format: "Digital Codex (In-Web DRM)" | "Complete Access Pass";
  price: number;
  originalPrice: number;
  pages: string;
  status: "Active" | "Draft";
  pdfUrl: string;
  description: string;
  units: string[];
}

export interface SubscriptionRecord {
  id: string;
  studentName: string;
  studentRoll: string;
  email: string;
  phone: string;
  item: string;
  targetExam: string;
  amount: string;
  date: string;
  paymentMode: string;
  accessStatus: "Active" | "Pending" | "Revoked";
}

export interface StudentRecord {
  id: string;
  student_id: string;
  name: string;
  email: string;
  phone: string;
  target_exam: string;
  is_active: boolean;
  drm_access: boolean;
  enrolled_books: string[];
  joined_date: string;
}

export interface CaseStudyItem {
  id: string;
  day: string;
  badge: string;
  subject: string;
  title: string;
  scenario: string;
  modelAnswer: string;
  precedent: string;
  marks: string;
}

export interface McqQuestionItem {
  id: string;
  subject: string;
  section: string;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

export interface CouponRecord {
  id: string;
  code: string;
  discountPercent: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  expiryDate: string;
  status: "Active" | "Expired" | "Disabled";
}

export interface ExamCountdownSetting {
  id: string;
  exam: string;
  date: string;
  session: string;
}

export interface QotdSetting {
  id: string;
  question: string;
  act: string;
  section: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

// --- INITIAL SEED DATA (100% DIGITAL IN-WEB STUDY PLATFORM) ---
const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: "prod-vol1",
    title: "Business Law (CSEET & CA Foundation)",
    subtitle: "Volume 1 • Digital Statutory Codex (Units 1 to 6)",
    category: "CSEET",
    format: "Digital Codex (In-Web DRM)",
    price: 249,
    originalPrice: 499,
    pages: "180+ Pages",
    status: "Active",
    pdfUrl: "/api/pdf/cseet-business-law-full.pdf",
    description: "Complete master codex covering Indian Contract Act 1872, Sale of Goods Act 1930, Indian Partnership Act 1932, LLP Act 2008, Companies Act 2013, and Negotiable Instruments Act 1881 with DRM in-web reader access.",
    units: ["Indian Contract Act, 1872", "Sale of Goods Act, 1930", "Indian Partnership Act, 1932", "LLP Act, 2008", "Companies Act, 2013", "Negotiable Instruments Act, 1881"],
  },
  {
    id: "prod-vol2",
    title: "Business Law & Management",
    subtitle: "Volume 2 • Digital Management Codex (Units 7 & 8)",
    category: "CSEET",
    format: "Digital Codex (In-Web DRM)",
    price: 249,
    originalPrice: 499,
    pages: "120+ Pages",
    status: "Active",
    pdfUrl: "/api/pdf/cseet-management-full.pdf",
    description: "In-depth study codex for General Principles of Management (Henri Fayol & FW Taylor) and Business Environment & Corporate Ethics (PESTLE & CSR).",
    units: ["General Principles of Management", "Business Environment & Ethics"],
  },
  {
    id: "prod-combo",
    title: "Complete 2-Volume Master Digital Access Pass",
    subtitle: "Volume 1 & 2 Full Study Codices + In-Web DRM Reader Access",
    category: "Both",
    format: "Complete Access Pass",
    price: 449,
    originalPrice: 899,
    pages: "300+ Pages",
    status: "Active",
    pdfUrl: "/api/pdf/cseet-business-law-full.pdf",
    description: "All 8 statutory law acts + management theories + case studies & MCQ evaluation tests with instant in-web reader access.",
    units: ["All 8 Units • CA Foundation & CSEET"],
  },
];

const INITIAL_SUBSCRIPTIONS: SubscriptionRecord[] = [
  {
    id: "LK-SUB-2026-9901",
    studentName: "Aarav Sharma",
    studentRoll: "LRK-2026-004182",
    email: "aarav.sharma@thelawkaksha.com",
    phone: "+91 98765 43210",
    item: "Volume 1 & 2 Master Digital Pass",
    targetExam: "CA Foundation Paper 2",
    amount: "₹449",
    date: "28 Sep 2026",
    paymentMode: "UPI / Razorpay",
    accessStatus: "Active",
  },
  {
    id: "LK-SUB-2026-9902",
    studentName: "Ananya Verma",
    studentRoll: "LRK-2026-009821",
    email: "ananya.verma@thelawkaksha.com",
    phone: "+91 98123 45678",
    item: "Volume 1: Business Law Digital Codex",
    targetExam: "CSEET Law & Management",
    amount: "₹249",
    date: "29 Sep 2026",
    paymentMode: "Card / Netbanking",
    accessStatus: "Active",
  },
  {
    id: "LK-SUB-2026-9903",
    studentName: "Priya Kulkarni",
    studentRoll: "LRK-2026-005541",
    email: "priya.kulkarni@thelawkaksha.com",
    phone: "+91 97654 32109",
    item: "Volume 2: Management & Ethics Digital Codex",
    targetExam: "CSEET Law & Management",
    amount: "₹249",
    date: "26 Sep 2026",
    paymentMode: "UPI / GPay",
    accessStatus: "Active",
  },
  {
    id: "LK-SUB-2026-9904",
    studentName: "Rohan Mehta",
    studentRoll: "LRK-2026-003319",
    email: "rohan.mehta@thelawkaksha.com",
    phone: "+91 98333 11223",
    item: "Volume 1 & 2 Master Digital Pass",
    targetExam: "CA Foundation Paper 2",
    amount: "₹449",
    date: "30 Sep 2026",
    paymentMode: "UPI / Paytm",
    accessStatus: "Active",
  },
];

const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: "std-1",
    student_id: "LRK-2026-004182",
    name: "Aarav Sharma",
    email: "aarav.sharma@thelawkaksha.com",
    phone: "+91 98765 43210",
    target_exam: "CA Foundation Paper 2",
    is_active: true,
    drm_access: true,
    enrolled_books: ["Business Law (Volume 1)", "Business Law & Management (Volume 2)"],
    joined_date: "15 Aug 2026",
  },
  {
    id: "std-2",
    student_id: "LRK-2026-009821",
    name: "Ananya Verma",
    email: "ananya.verma@thelawkaksha.com",
    phone: "+91 98123 45678",
    target_exam: "CSEET Law & Management",
    is_active: true,
    drm_access: true,
    enrolled_books: ["Business Law (Volume 1)"],
    joined_date: "20 Aug 2026",
  },
  {
    id: "std-3",
    student_id: "LRK-2026-003319",
    name: "Rohan Mehta",
    email: "rohan.mehta@thelawkaksha.com",
    phone: "+91 98333 11223",
    target_exam: "CA Foundation Paper 2",
    is_active: true,
    drm_access: true,
    enrolled_books: ["Business Law (Volume 1)", "Business Law & Management (Volume 2)"],
    joined_date: "01 Sep 2026",
  },
  {
    id: "std-4",
    student_id: "LRK-2026-005541",
    name: "Priya Kulkarni",
    email: "priya.kulkarni@thelawkaksha.com",
    phone: "+91 97654 32109",
    target_exam: "CSEET Law & Management",
    is_active: true,
    drm_access: true,
    enrolled_books: ["Business Law & Management (Volume 2)"],
    joined_date: "10 Sep 2026",
  },
];

const INITIAL_CASES: CaseStudyItem[] = [
  {
    id: "case-1",
    day: "Monster Monday",
    badge: "High Difficulty",
    subject: "Indian Contract Act, 1872",
    title: "The Anticipatory Breach & Measure of Damages",
    scenario: "A agreed to supply 500 MT of industrial chemicals to B at Rs.20,000/MT on 1st November. On 15th October, A informed B that he would not deliver. Market price on 15th October was Rs.22,000/MT but B waited until 1st November when market price surged to Rs.26,000/MT. B sued for Rs.30,00,000 damages. Decide quantum of damages under Section 73.",
    modelAnswer: "Under Section 73 of Indian Contract Act 1872 (and Frost v. Knight), B has two options: (1) Treat contract as rescinded on 15th Oct and claim difference (Rs.2,000/MT = Rs.10 Lakhs), OR (2) Keep contract alive till 1st Nov and claim difference on date of performance (Rs.6,000/MT = Rs.30 Lakhs). Since contract was kept alive, B is entitled to Rs.30 Lakhs.",
    precedent: "Frost v. Knight (1872) L.R. 7 Ex. 111",
    marks: "6/6 Marks",
  },
  {
    id: "case-2",
    day: "Midweek Law Madness",
    badge: "Statutory Trap",
    subject: "Indian Partnership Act, 1932",
    title: "Retirement without Notice & Doctrine of Holding Out",
    scenario: "Karan, partner in M/s Apex Builders, retired in January but no public notice was given in the Official Gazette. In March, firm borrowed Rs.15 Lakhs from Indus Bank. Karan was unaware. Is Karan personally liable to Indus Bank?",
    modelAnswer: "Under Section 32(3) read with Section 28 of Indian Partnership Act 1932, a retired partner continues to be liable to third parties unless public notice is published in the Official Gazette and at least one local language newspaper. Karan is personally liable to Indus Bank under the doctrine of Holding Out.",
    precedent: "Scarf v. Jardine (1882) 7 App Cas 345",
    marks: "6/6 Marks",
  },
  {
    id: "case-3",
    day: "Final Boss Friday",
    badge: "Exam Simulation",
    subject: "Companies Act, 2013",
    title: "Ultra Vires Borrowing & Subrogation Remedy",
    scenario: "A company's MOA authorizes borrowing up to Rs.1 Crore. The Directors borrowed Rs.2.5 Crores from a private financier without member approval. The entire Rs.2.5 Crores was used to pay off lawful trade debts of the company. Can the lender recover money from the company?",
    modelAnswer: "The loan is Ultra Vires the borrowing powers of the company and void ab initio (Ashbury Railway Carriage Co. v. Riche). However, under the equitable doctrine of Subrogation (Sinclair v. Brougham), since the money was used to discharge lawful intra-vires liabilities, the lender stands in shoes of discharged creditors and can recover the debt.",
    precedent: "Sinclair v. Brougham [1914] AC 398",
    marks: "6/6 Marks",
  },
];

const INITIAL_MCQS: McqQuestionItem[] = [
  {
    id: "mcq-1",
    subject: "Sale of Goods Act, 1930",
    section: "Section 16(1)",
    question: "Under Section 16(1) of the Sale of Goods Act, 1930, when is an implied condition as to quality or fitness created without an express declaration by the buyer?",
    options: [
      "When the good is capable of only one obvious normal use and buyer relies on seller's judgment.",
      "Whenever the goods are purchased from any retail store.",
      "Only when a written warranty card is stamped by the manufacturer.",
      "Never, because Caveat Emptor applies strictly to all sales.",
    ],
    correctOption: 0,
    explanation: "Under Priest v. Last, where goods have only one customary use, disclosure of purpose is implied, creating an exception to Caveat Emptor.",
  },
  {
    id: "mcq-2",
    subject: "Indian Contract Act, 1872",
    section: "Section 2(d)",
    question: "According to the Indian Contract Act 1872, consideration may move from:",
    options: [
      "The promisee only.",
      "The promisor only.",
      "The promisee or any other third person (Chinnaya v. Ramayya).",
      "Only a person with registered power of attorney.",
    ],
    correctOption: 2,
    explanation: "In India, unlike English Law, consideration can proceed from a stranger to the contract (Chinnaya v. Ramayya), though a stranger to contract cannot sue.",
  },
  {
    id: "mcq-3",
    subject: "Companies Act, 2013",
    section: "Section 8",
    question: "What is the minimum paid-up share capital requirement for incorporating a Section 8 (Non-Profit) Company?",
    options: [
      "Rs. 1,00,000",
      "Rs. 5,00,000",
      "No minimum paid-up capital prescribed",
      "Rs. 10,00,000",
    ],
    correctOption: 2,
    explanation: "The Companies Act 2013 removed minimum paid-up capital requirements for Private, Public, and Section 8 companies.",
  },
];

const INITIAL_COUPONS: CouponRecord[] = [
  { id: "cp-1", code: "EXEMPTION2026", discountPercent: 20, minOrder: 200, maxUses: 500, usedCount: 142, expiryDate: "2026-12-31", status: "Active" },
  { id: "cp-2", code: "FIRST50", discountPercent: 15, minOrder: 150, maxUses: 100, usedCount: 88, expiryDate: "2026-11-30", status: "Active" },
  { id: "cp-3", code: "RANKERS", discountPercent: 25, minOrder: 400, maxUses: 50, usedCount: 47, expiryDate: "2026-10-31", status: "Active" },
];

export default function AdminPortalPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  type TabType = "overview" | "subscriptions" | "products" | "students" | "cases" | "mcq" | "coupons" | "qotd";
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Entities state with LocalStorage persistence
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>(INITIAL_SUBSCRIPTIONS);
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [cases, setCases] = useState<CaseStudyItem[]>(INITIAL_CASES);
  const [mcqs, setMcqs] = useState<McqQuestionItem[]>(INITIAL_MCQS);
  const [coupons, setCoupons] = useState<CouponRecord[]>(INITIAL_COUPONS);
  const [examSettings, setExamSettings] = useState<ExamCountdownSetting[]>([
    { id: "ex-1", exam: "CSEET Paper 2 (Business Law & Management)", date: "2026-11-12", session: "November 2026 Attempt" },
    { id: "ex-2", exam: "CA Foundation Paper 2 (Business Laws)", date: "2026-12-20", session: "December 2026 Attempt" },
  ]);
  const [qotd, setQotd] = useState<QotdSetting>({
    id: "qotd-1",
    act: "Indian Partnership Act, 1932",
    section: "Section 28",
    question: "When a retired partner's name is retained on the letterhead without public notice, third parties can sue under:",
    options: ["Doctrine of Subrogation", "Doctrine of Holding Out", "Doctrine of Ultra Vires", "Doctrine of Estoppel in Pais"],
    correctOption: 1,
    explanation: "Under Section 28 of the Indian Partnership Act 1932, anyone who represents or allows himself to be represented as a partner is liable as a partner by Holding Out.",
  });

  // CRUD Modals
  const [productModal, setProductModal] = useState<{ open: boolean; mode: "add" | "edit"; data: Partial<ProductItem> }>({ open: false, mode: "add", data: {} });
  const [studentModal, setStudentModal] = useState<{ open: boolean; mode: "add" | "edit"; data: Partial<StudentRecord> }>({ open: false, mode: "add", data: {} });
  const [subModal, setSubModal] = useState<{ open: boolean; mode: "add" | "edit"; data: Partial<SubscriptionRecord> }>({ open: false, mode: "add", data: {} });
  const [caseModal, setCaseModal] = useState<{ open: boolean; mode: "add" | "edit"; data: Partial<CaseStudyItem> }>({ open: false, mode: "add", data: {} });
  const [mcqModal, setMcqModal] = useState<{ open: boolean; mode: "add" | "edit"; data: Partial<McqQuestionItem> }>({ open: false, mode: "add", data: {} });
  const [couponModal, setCouponModal] = useState<{ open: boolean; mode: "add" | "edit"; data: Partial<CouponRecord> }>({ open: false, mode: "add", data: {} });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const [isAtlasConnected, setIsAtlasConnected] = useState<boolean>(true);

  // Load initial cache and sync with MongoDB Atlas
  useEffect(() => {
    if (typeof window !== "undefined") {
      const adminSession = localStorage.getItem("lawkaksha_admin_session");
      if (!adminSession) {
        setIsAuthorized(false);
        setIsCheckingAuth(false);
        router.push("/login");
        return;
      }
      setIsAuthorized(true);
      setIsCheckingAuth(false);

      // 1. Instant optimistic load from localStorage
      try {
        localStorage.removeItem("lawkaksha_admin_orders");
        const p = localStorage.getItem("lawkaksha_admin_products");
        if (p) setProducts(JSON.parse(p));
        const sub = localStorage.getItem("lawkaksha_admin_subs");
        if (sub) setSubscriptions(JSON.parse(sub));
        const s = localStorage.getItem("lawkaksha_admin_students");
        if (s) setStudents(JSON.parse(s));
        const c = localStorage.getItem("lawkaksha_admin_cases");
        if (c) setCases(JSON.parse(c));
        const m = localStorage.getItem("lawkaksha_admin_mcqs");
        if (m) setMcqs(JSON.parse(m));
        const cp = localStorage.getItem("lawkaksha_admin_coupons");
        if (cp) setCoupons(JSON.parse(cp));
      } catch (e) {}

      // 2. Live fetch from MongoDB Atlas
      const syncWithAtlas = async () => {
        try {
          const [pRes, sRes, stdRes, cRes, mRes, cpRes, exRes, qRes] = await Promise.allSettled([
            fetch(`${API_URL}/api/admin/products`).then((r) => r.json()),
            fetch(`${API_URL}/api/admin/subscriptions`).then((r) => r.json()),
            fetch(`${API_URL}/api/admin/students`).then((r) => r.json()),
            fetch(`${API_URL}/api/admin/cases`).then((r) => r.json()),
            fetch(`${API_URL}/api/admin/mcqs`).then((r) => r.json()),
            fetch(`${API_URL}/api/admin/coupons`).then((r) => r.json()),
            fetch(`${API_URL}/api/admin/exam-settings`).then((r) => r.json()),
            fetch(`${API_URL}/api/admin/qotd`).then((r) => r.json()),
          ]);

          if (pRes.status === "fulfilled" && pRes.value?.products?.length) {
            setProducts(pRes.value.products);
            localStorage.setItem("lawkaksha_admin_products", JSON.stringify(pRes.value.products));
          }
          if (sRes.status === "fulfilled" && sRes.value?.subscriptions?.length) {
            setSubscriptions(sRes.value.subscriptions);
            localStorage.setItem("lawkaksha_admin_subs", JSON.stringify(sRes.value.subscriptions));
          }
          if (stdRes.status === "fulfilled" && stdRes.value?.students?.length) {
            setStudents(stdRes.value.students);
            localStorage.setItem("lawkaksha_admin_students", JSON.stringify(stdRes.value.students));
          }
          if (cRes.status === "fulfilled" && cRes.value?.cases?.length) {
            setCases(cRes.value.cases);
            localStorage.setItem("lawkaksha_admin_cases", JSON.stringify(cRes.value.cases));
          }
          if (mRes.status === "fulfilled" && mRes.value?.mcqs?.length) {
            setMcqs(mRes.value.mcqs);
            localStorage.setItem("lawkaksha_admin_mcqs", JSON.stringify(mRes.value.mcqs));
          }
          if (cpRes.status === "fulfilled" && cpRes.value?.coupons?.length) {
            setCoupons(cpRes.value.coupons);
            localStorage.setItem("lawkaksha_admin_coupons", JSON.stringify(cpRes.value.coupons));
          }
          if (exRes.status === "fulfilled" && exRes.value?.examSettings?.length) {
            setExamSettings(exRes.value.examSettings);
          }
          if (qRes.status === "fulfilled" && qRes.value?.qotd) {
            setQotd(qRes.value.qotd);
          }
          setIsAtlasConnected(true);
        } catch (err) {
          console.warn("[Admin] Running in local cache mode:", err);
          setIsAtlasConnected(false);
        }
      };

      syncWithAtlas();
    }
  }, [router]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("lawkaksha_admin_session");
      localStorage.removeItem("lawkaksha_token");
      window.dispatchEvent(new Event("storage"));
      router.push("/login");
    }
  };

  // Calculations
  const totalRevenue = useMemo(() => {
    return subscriptions.reduce((acc, curr) => {
      const num = parseInt(curr.amount.replace(/[^0-9]/g, "")) || 0;
      return acc + num;
    }, 0);
  }, [subscriptions]);

  const activeStudentsCount = useMemo(() => students.filter((s) => s.is_active).length, [students]);
  const activeSubsCount = useMemo(() => subscriptions.filter((s) => s.accessStatus === "Active").length, [subscriptions]);

  if (isCheckingAuth || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F6F5FF] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-9 h-9 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-700">Verifying administrator authorization...</p>
      </div>
    );
  }

  const NAV_TABS = [
    { id: "overview" as TabType, label: "Overview", icon: LayoutDashboard },
    { id: "subscriptions" as TabType, label: "Subscriptions & Access", icon: CreditCard, badge: subscriptions.length },
    { id: "products" as TabType, label: "Study Books & Codices", icon: BookOpen, badge: products.length },
    { id: "students" as TabType, label: "Students & DRM Rights", icon: Users, badge: students.length },
    { id: "cases" as TabType, label: "Weekly Cases", icon: Flame },
    { id: "mcq" as TabType, label: "MCQ Test Bank", icon: Sparkles },
    { id: "coupons" as TabType, label: "Coupons & Offers", icon: Percent },
    { id: "qotd" as TabType, label: "Exam Dates & QOTD", icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-[#F6F5FF] flex" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* MOBILE SIDEBAR BACKDROP */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 1. SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 bg-white border-r border-slate-100 flex flex-col min-h-screen transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* LOGO & ADMIN BADGE */}
        <div className="px-4 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className="flex items-center shrink-0">
              <div className="relative h-8 w-28">
                <Image src="/assets/logo-transparent.png" alt="The Law Kaksha" fill className="object-contain object-left" priority />
              </div>
            </Link>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-violet-50 border border-violet-100">
              <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
              <span className="text-[11px] font-bold text-violet-900">Admin</span>
            </div>
          </div>
        </div>

        {/* NAVIGATION ITEMS */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchQuery("");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-left min-h-[44px] ${
                  isActive
                    ? "bg-violet-50 text-violet-700 font-semibold"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <Icon className={`shrink-0 ${isActive ? "text-violet-600" : "text-slate-400"}`} style={{ width: 18, height: 18 }} />
                <span className="truncate">{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* BOTTOM ADMIN PROFILE */}
        <div className="p-3.5 border-t border-slate-100">
          <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">Academic Admin</p>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">The Law Kaksha Hub</p>
            </div>
            <button
              onClick={handleLogout}
              title="Log Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* STICKY TOP HEADER */}
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
            <h1 className="text-base font-semibold text-slate-800">
              {NAV_TABS.find((t) => t.id === activeTab)?.label || "Admin Console"}
            </h1>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5">
              DRM Protection, Student Subscriptions, Course Notes &amp; Portal Operations
            </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
              isAtlasConnected
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}>
              <span className={`w-2 h-2 rounded-full ${isAtlasConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
              <span>{isAtlasConnected ? "MongoDB Atlas Active" : "Local Sync Active"}</span>
            </div>

            <Link
              href="/student"
              target="_blank"
              className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-violet-700 hover:border-violet-200 shadow-xs flex items-center gap-1.5 transition-all"
            >
              <span>Student View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* TAB WORKSPACES */}
        <div className="p-4 sm:p-6 space-y-6 max-w-6xl">

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* TOP HERO BANNER */}
              <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md shadow-violet-200">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-violet-200">Executive Control Center</span>
                  <h2 className="text-2xl font-bold">The Law कक्षा Portal Management</h2>
                  <p className="text-violet-100 text-xs sm:text-sm leading-relaxed max-w-lg">
                    100% In-Web DRM digital learning platform for CA Foundation &amp; CSEET statutory law codices and evaluation tests.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 min-w-[90px]">
                    <TrendingUp className="w-5 h-5 text-emerald-300 mx-auto mb-1" />
                    <p className="text-xl font-extrabold">₹{totalRevenue.toLocaleString()}</p>
                    <p className="text-[10px] text-violet-200 uppercase tracking-wide">Gross Subscriptions</p>
                  </div>
                  <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 min-w-[90px]">
                    <Key className="w-5 h-5 text-amber-300 mx-auto mb-1" />
                    <p className="text-xl font-extrabold">{activeSubsCount}</p>
                    <p className="text-[10px] text-violet-200 uppercase tracking-wide">Active DRM Passes</p>
                  </div>
                </div>
              </div>

              {/* STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-3">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Digital Codices</p>
                  <h3 className="text-xl font-bold text-slate-800 mt-0.5">{products.length} Master Books</h3>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">Volumes 1 &amp; 2 Active</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Enrolled Students</p>
                  <h3 className="text-xl font-bold text-slate-800 mt-0.5">{students.length} Candidates</h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">{activeStudentsCount} Active Portals</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Purchased Subscriptions</p>
                  <h3 className="text-xl font-bold text-slate-800 mt-0.5">{subscriptions.length} Passes</h3>
                  <p className="text-[11px] text-amber-600 font-medium mt-1">Instant Vault Activation</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">DRM In-Web Protection</p>
                  <h3 className="text-xl font-bold text-slate-800 mt-0.5">100% Protected</h3>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">Copy/Print Bypasses Blocked</p>
                </div>
              </div>

              {/* RECENT SUBSCRIPTIONS TABLE */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Recent Student Access Grants &amp; Purchases</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Instant online access to statutory codices across CA &amp; CSEET</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("subscriptions")}
                    className="text-xs font-bold text-violet-600 hover:text-violet-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All Subscriptions</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="py-2.5 px-3">Sub ID</th>
                        <th className="py-2.5 px-3">Student Name</th>
                        <th className="py-2.5 px-3">Enrolled Codex / Pass</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Access Status</th>
                        <th className="py-2.5 px-3">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {subscriptions.slice(0, 4).map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3 font-mono font-bold text-slate-700">{sub.id}</td>
                          <td className="py-3 px-3 font-medium text-slate-800">{sub.studentName}</td>
                          <td className="py-3 px-3 text-slate-600 truncate max-w-xs">{sub.item}</td>
                          <td className="py-3 px-3 font-bold text-slate-800">{sub.amount}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              sub.accessStatus === "Active"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-amber-50 text-amber-700 border border-amber-100"
                            }`}>
                              {sub.accessStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-500 font-medium">{sub.paymentMode}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUBSCRIPTIONS & ACCESS PURCHASES */}
          {activeTab === "subscriptions" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Student Subscriptions &amp; In-Web Access Purchases</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Manage digital pass authorizations and grant instant in-web reader access.</p>
                </div>
                <button
                  onClick={() => setSubModal({ open: true, mode: "add", data: { accessStatus: "Active", paymentMode: "UPI / Razorpay", targetExam: "CSEET Law & Management" } })}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Grant Manual Access</span>
                </button>
              </div>

              {/* SEARCH BAR */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by subscription ID, student name, roll number or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
                />
              </div>

              {/* SUBSCRIPTIONS LIST */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold">
                      <tr>
                        <th className="py-3 px-4">Sub ID &amp; Date</th>
                        <th className="py-3 px-4">Student &amp; Roll Number</th>
                        <th className="py-3 px-4">Enrolled Codex / Pass</th>
                        <th className="py-3 px-4">Fee Paid</th>
                        <th className="py-3 px-4">DRM Vault Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {subscriptions
                        .filter((s) =>
                          s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.studentRoll.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((sub) => (
                          <tr key={sub.id} className="hover:bg-slate-50/50">
                            <td className="py-3.5 px-4">
                              <p className="font-mono font-bold text-slate-800">{sub.id}</p>
                              <p className="text-[10px] text-slate-400">{sub.date}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-slate-800">{sub.studentName}</p>
                              <p className="text-[11px] text-violet-600 font-mono">{sub.studentRoll}</p>
                              <p className="text-[10px] text-slate-400">{sub.email}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="text-slate-800 font-semibold">{sub.item}</p>
                              <p className="text-[10px] text-slate-400">{sub.targetExam}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="text-xs font-bold text-violet-700">{sub.amount}</p>
                              <p className="text-[10px] text-slate-400">{sub.paymentMode}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <button
                                onClick={async () => {
                                  const nextStatus = sub.accessStatus === "Active" ? "Revoked" : "Active";
                                  const updated = subscriptions.map((item) => (item.id === sub.id ? { ...item, accessStatus: nextStatus as any } : item));
                                  setSubscriptions(updated);
                                  localStorage.setItem("lawkaksha_admin_subs", JSON.stringify(updated));
                                  showToast(`Access ${nextStatus} for ${sub.studentName}`);
                                  try {
                                    await fetch(`${API_URL}/api/admin/subscriptions/${sub.id}`, {
                                      method: "PUT",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ accessStatus: nextStatus }),
                                    });
                                  } catch (e) {}
                                }}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                  sub.accessStatus === "Active"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-rose-50 text-rose-700 border border-rose-200"
                                }`}
                              >
                                {sub.accessStatus === "Active" ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                <span>{sub.accessStatus === "Active" ? "Active In-Web DRM" : "Access Revoked"}</span>
                              </button>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSubModal({ open: true, mode: "edit", data: sub })}
                                  title="Edit Subscription"
                                  className="p-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 transition-colors cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm(`Delete subscription record for ${sub.studentName}?`)) {
                                      const filtered = subscriptions.filter((s) => s.id !== sub.id);
                                      setSubscriptions(filtered);
                                      localStorage.setItem("lawkaksha_admin_subs", JSON.stringify(filtered));
                                      showToast(`Subscription ${sub.id} deleted.`);
                                      try {
                                        await fetch(`${API_URL}/api/admin/subscriptions/${sub.id}`, { method: "DELETE" });
                                      } catch (e) {}
                                    }
                                  }}
                                  title="Delete Subscription"
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BOOKS & STUDY CODICES */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Master Study Books &amp; In-Web Codices</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Manage in-web DRM digital books, curriculum statutory units, pricing &amp; PDF stream endpoints.</p>
                </div>
                <button
                  onClick={() => setProductModal({ open: true, mode: "add", data: { status: "Active", format: "Digital Codex (In-Web DRM)", category: "CSEET" } })}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Codex</span>
                </button>
              </div>

              {/* PRODUCT CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((prod) => (
                  <div key={prod.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-100">
                          {prod.category}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {prod.status}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-800 leading-snug">{prod.title}</h3>
                        <p className="text-xs text-violet-600 font-medium mt-0.5">{prod.subtitle}</p>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {prod.description}
                      </p>

                      <div className="pt-2 border-t border-slate-100 space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Included Statutory Units</p>
                        <div className="flex flex-wrap gap-1">
                          {prod.units?.map((u, i) => (
                            <span key={i} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100">
                              {u}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* CARD FOOTER */}
                    <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-extrabold text-slate-900">₹{prod.price}</span>
                          <span className="text-xs text-slate-400 line-through">₹{prod.originalPrice}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{prod.pages} • In-Web DRM</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setProductModal({ open: true, mode: "edit", data: prod })}
                          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-violet-700 hover:border-violet-200 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm(`Delete product ${prod.title}?`)) {
                              const filtered = products.filter((p) => p.id !== prod.id);
                              setProducts(filtered);
                              localStorage.setItem("lawkaksha_admin_products", JSON.stringify(filtered));
                              showToast(`Deleted ${prod.title}`);
                              try {
                                await fetch(`${API_URL}/api/admin/products/${prod.id}`, { method: "DELETE" });
                              } catch (e) {}
                            }
                          }}
                          className="p-2 rounded-xl bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: STUDENTS & DRM ENROLLMENTS */}
          {activeTab === "students" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Enrolled Students &amp; DRM Authorizations</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Manage registered candidates, grant in-web book reading rights, and reset student credentials.</p>
                </div>
                <button
                  onClick={() => setStudentModal({ open: true, mode: "add", data: { is_active: true, drm_access: true, target_exam: "CSEET Law & Management" } })}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Student</span>
                </button>
              </div>

              {/* SEARCH BAR */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search students by name, roll number, email or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
                />
              </div>

              {/* STUDENTS TABLE */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold">
                      <tr>
                        <th className="py-3 px-4">Candidate &amp; Roll Number</th>
                        <th className="py-3 px-4">Target Exam</th>
                        <th className="py-3 px-4">Contact Info</th>
                        <th className="py-3 px-4">DRM In-Web Access</th>
                        <th className="py-3 px-4">Enrolled Books</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students
                        .filter((s) =>
                          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((std) => (
                          <tr key={std.id} className="hover:bg-slate-50/50">
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-slate-800">{std.name}</p>
                              <p className="text-[10px] font-mono text-violet-600 font-bold">{std.student_id}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-700 border border-violet-100">
                                {std.target_exam}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="text-slate-700">{std.email}</p>
                              <p className="text-[10px] font-mono text-slate-400">{std.phone}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <button
                                onClick={async () => {
                                  const updated = students.map((s) => (s.id === std.id ? { ...s, drm_access: !s.drm_access } : s));
                                  setStudents(updated);
                                  localStorage.setItem("lawkaksha_admin_students", JSON.stringify(updated));
                                  showToast(`DRM access ${std.drm_access ? "Revoked" : "Granted"} for ${std.name}`);
                                  try {
                                    await fetch(`${API_URL}/api/admin/students/${std.id}`, {
                                      method: "PUT",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ drm_access: !std.drm_access }),
                                    });
                                  } catch (e) {}
                                }}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                  std.drm_access
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-rose-50 text-rose-700 border border-rose-200"
                                }`}
                              >
                                {std.drm_access ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                <span>{std.drm_access ? "Active Codex Access" : "Revoked"}</span>
                              </button>
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="text-[11px] text-slate-600">{std.enrolled_books?.join(", ") || "None"}</p>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setStudentModal({ open: true, mode: "edit", data: std })}
                                  title="Edit Student"
                                  className="p-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 transition-colors cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm(`Delete student record for ${std.name}?`)) {
                                      const filtered = students.filter((s) => s.id !== std.id);
                                      setStudents(filtered);
                                      localStorage.setItem("lawkaksha_admin_students", JSON.stringify(filtered));
                                      showToast(`Deleted student ${std.name}`);
                                      try {
                                        await fetch(`${API_URL}/api/admin/students/${std.id}`, { method: "DELETE" });
                                      } catch (e) {}
                                    }
                                  }}
                                  title="Delete Student"
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WEEKLY CASE STUDIES */}
          {activeTab === "cases" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Weekly High-Yield Case Studies</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Monster Monday, Midweek Law Madness, and Final Boss Friday real-exam problems.</p>
                </div>
                <button
                  onClick={() => setCaseModal({ open: true, mode: "add", data: { day: "Monster Monday", badge: "High Difficulty", marks: "6/6 Marks" } })}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Case Study</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {cases.map((cs) => (
                  <div key={cs.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-violet-600 uppercase tracking-wide">{cs.day}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                        {cs.badge}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">{cs.subject}</span>
                      <h3 className="text-sm font-bold text-slate-800 leading-snug">{cs.title}</h3>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed italic">
                      &ldquo;{cs.scenario}&rdquo;
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">Model Answer</span>
                      <p className="text-xs text-slate-500 leading-relaxed">{cs.modelAnswer}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-400 text-[11px]">{cs.precedent}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCaseModal({ open: true, mode: "edit", data: cs })}
                          className="p-1.5 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm("Delete this case study?")) {
                              const filtered = cases.filter((c) => c.id !== cs.id);
                              setCases(filtered);
                              localStorage.setItem("lawkaksha_admin_cases", JSON.stringify(filtered));
                              showToast("Case study deleted.");
                              try {
                                await fetch(`${API_URL}/api/admin/cases/${cs.id}`, { method: "DELETE" });
                              } catch (e) {}
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: MCQ QUESTION BANK */}
          {activeTab === "mcq" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">MCQ Test Question Bank</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Objective evaluation questions for weekly 30-minute timed mock tests.</p>
                </div>
                <button
                  onClick={() => setMcqModal({ open: true, mode: "add", data: { options: ["", "", "", ""], correctOption: 0 } })}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Question</span>
                </button>
              </div>

              <div className="space-y-4">
                {mcqs.map((q, idx) => (
                  <div key={q.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">Question {idx + 1} • {q.subject}</span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-50 text-violet-700 font-bold">{q.section}</span>
                        <button
                          onClick={() => setMcqModal({ open: true, mode: "edit", data: q })}
                          className="p-1.5 rounded-lg hover:bg-violet-50 text-violet-600 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm("Delete this question?")) {
                              const filtered = mcqs.filter((m) => m.id !== q.id);
                              setMcqs(filtered);
                              localStorage.setItem("lawkaksha_admin_mcqs", JSON.stringify(filtered));
                              showToast("Question deleted.");
                              try {
                                await fetch(`${API_URL}/api/admin/mcqs/${q.id}`, { method: "DELETE" });
                              } catch (e) {}
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-slate-800 font-medium leading-relaxed">{q.question}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                            q.correctOption === oIdx
                              ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-bold"
                              : "bg-slate-50 border-slate-100 text-slate-600"
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center font-bold text-[10px] shadow-xs shrink-0">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="truncate">{opt}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-100">
                      <strong>Bare Act Citation / Explanation:</strong> {q.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: COUPONS & DISCOUNTS */}
          {activeTab === "coupons" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Discount Coupons &amp; Promotions</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Manage promo codes applied at checkout for digital codex access passes.</p>
                </div>
                <button
                  onClick={() => setCouponModal({ open: true, mode: "add", data: { status: "Active", discountPercent: 20, minOrder: 200, maxUses: 100 } })}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Coupon</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {coupons.map((cp) => (
                  <div key={cp.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-violet-100 text-violet-800 font-mono font-extrabold text-sm tracking-wider">
                        {cp.code}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {cp.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-2xl font-extrabold text-slate-800">{cp.discountPercent}% OFF</p>
                      <p className="text-xs text-slate-400">Min. cart order of ₹{cp.minOrder}</p>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <div className="flex justify-between">
                        <span>Used Count:</span>
                        <span className="font-bold text-slate-800">{cp.usedCount} / {cp.maxUses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valid Until:</span>
                        <span className="font-bold text-slate-800">{cp.expiryDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        onClick={() => setCouponModal({ open: true, mode: "edit", data: cp })}
                        className="p-1.5 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete coupon ${cp.code}?`)) {
                            const filtered = coupons.filter((c) => c.id !== cp.id);
                            setCoupons(filtered);
                            localStorage.setItem("lawkaksha_admin_coupons", JSON.stringify(filtered));
                            showToast(`Deleted coupon ${cp.code}`);
                            try {
                              await fetch(`${API_URL}/api/admin/coupons/${cp.id}`, { method: "DELETE" });
                            } catch (e) {}
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: EXAM DATES & QUESTION OF THE DAY (QOTD) */}
          {activeTab === "qotd" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Exam Countdown Dates &amp; Daily QOTD</h2>
                <p className="text-xs text-slate-500 mt-0.5">Configure the countdown clocks and live Question of the Day shown across the homepage.</p>
              </div>

              {/* EXAM DATES */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-800">Target Examination Dates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {examSettings.map((ex, idx) => (
                    <div key={ex.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                      <p className="text-xs font-bold text-slate-800">{ex.exam}</p>
                      <p className="text-[11px] text-slate-400">{ex.session}</p>
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="date"
                          value={ex.date}
                          onChange={async (e) => {
                            const next = [...examSettings];
                            next[idx].date = e.target.value;
                            setExamSettings(next);
                            showToast("Saving exam date to MongoDB Atlas...");
                            try {
                              await fetch(`${API_URL}/api/admin/exam-settings`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ examSettings: next }),
                              });
                              showToast("Updated target exam date in MongoDB Atlas!");
                            } catch (err) {}
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* QUESTION OF THE DAY EDIT */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-800">Live Question of the Day (QOTD)</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Question Text</label>
                    <textarea
                      rows={2}
                      value={qotd.question}
                      onChange={(e) => setQotd({ ...qotd, question: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-violet-500 bg-slate-50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Statutory Act</label>
                      <input
                        type="text"
                        value={qotd.act}
                        onChange={(e) => setQotd({ ...qotd, act: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-violet-500 bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Section Citation</label>
                      <input
                        type="text"
                        value={qotd.section}
                        onChange={(e) => setQotd({ ...qotd, section: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-violet-500 bg-slate-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Explanation</label>
                    <textarea
                      rows={2}
                      value={qotd.explanation}
                      onChange={(e) => setQotd({ ...qotd, explanation: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-violet-500 bg-slate-50"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={async () => {
                        showToast("Saving QOTD to MongoDB Atlas...");
                        try {
                          await fetch(`${API_URL}/api/admin/qotd`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ qotd }),
                          });
                          showToast("Question of the Day updated in MongoDB Atlas!");
                        } catch (err) {
                          showToast("Saved locally (offline mode)");
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                    >
                      Save QOTD Updates
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* --- CRUD MODALS --- */}

      {/* SUBSCRIPTION ADD / EDIT MODAL */}
      {subModal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">
                {subModal.mode === "add" ? "Grant In-Web Access Pass" : "Update Subscription Record"}
              </h3>
              <button onClick={() => setSubModal({ open: false, mode: "add", data: {} })} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-slate-100 cursor-pointer" aria-label="Close modal">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Name *</label>
                  <input
                    type="text"
                    value={subModal.data.studentName || ""}
                    onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, studentName: e.target.value } })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs min-h-[44px] sm:min-h-0"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Roll / Student ID *</label>
                  <input
                    type="text"
                    value={subModal.data.studentRoll || ""}
                    onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, studentRoll: e.target.value } })}
                    placeholder="LRK-2026-004182"
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 font-mono text-base sm:text-xs min-h-[44px] sm:min-h-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={subModal.data.email || ""}
                    onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, email: e.target.value } })}
                    placeholder="student@thelawkaksha.com"
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs min-h-[44px] sm:min-h-0"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={subModal.data.phone || ""}
                    onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, phone: e.target.value } })}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 font-mono text-base sm:text-xs min-h-[44px] sm:min-h-0"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Enrolled Codex / Pass *</label>
                <select
                  value={subModal.data.item || "Volume 1 & 2 Master Digital Pass"}
                  onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, item: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 bg-white text-base sm:text-xs min-h-[44px] sm:min-h-0"
                >
                  <option value="Volume 1 & 2 Master Digital Pass">Volume 1 &amp; 2 Master Digital Pass (All Units)</option>
                  <option value="Volume 1: Business Law Digital Codex">Volume 1: Business Law Digital Codex (Units 1 to 6)</option>
                  <option value="Volume 2: Management & Ethics Digital Codex">Volume 2: Management &amp; Ethics Digital Codex (Units 7 &amp; 8)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fee Amount (₹)</label>
                  <input
                    type="text"
                    value={subModal.data.amount || "₹449"}
                    onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, amount: e.target.value } })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 font-bold text-base sm:text-xs min-h-[44px] sm:min-h-0"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={subModal.data.paymentMode || "UPI / Razorpay"}
                    onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, paymentMode: e.target.value } })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 bg-white text-base sm:text-xs min-h-[44px] sm:min-h-0"
                  >
                    <option value="UPI / Razorpay">UPI / Razorpay</option>
                    <option value="Card / Netbanking">Card / Netbanking</option>
                    <option value="Admin Direct Grant (Free)">Admin Direct Grant (Free)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">DRM In-Web Access Status</label>
                <select
                  value={subModal.data.accessStatus || "Active"}
                  onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, accessStatus: e.target.value as any } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 bg-white text-base sm:text-xs min-h-[44px] sm:min-h-0"
                >
                  <option value="Active">Active (Instant DRM Reader Access)</option>
                  <option value="Pending">Pending Verification</option>
                  <option value="Revoked">Revoked / Suspended</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSubModal({ open: false, mode: "add", data: {} })}
                className="px-4 py-2.5 min-h-[44px] sm:min-h-0 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!subModal.data.studentName) return alert("Please enter student name");
                  const isAdd = subModal.mode === "add";
                  const payload: SubscriptionRecord = {
                    id: subModal.data.id || `LK-SUB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                    studentName: subModal.data.studentName || "",
                    studentRoll: subModal.data.studentRoll || `LRK-2026-00${Math.floor(1000 + Math.random() * 9000)}`,
                    email: subModal.data.email || "student@thelawkaksha.com",
                    phone: subModal.data.phone || "+91 98000 00000",
                    item: subModal.data.item || "Volume 1 & 2 Master Digital Pass",
                    targetExam: subModal.data.targetExam || "CSEET Law & Management",
                    amount: subModal.data.amount || "₹449",
                    date: subModal.data.date || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
                    paymentMode: subModal.data.paymentMode || "UPI / Razorpay",
                    accessStatus: subModal.data.accessStatus || "Active",
                  };
                  const next = isAdd ? [...subscriptions, payload] : subscriptions.map((s) => (s.id === payload.id ? payload : s));
                  setSubscriptions(next);
                  localStorage.setItem("lawkaksha_admin_subs", JSON.stringify(next));
                  setSubModal({ open: false, mode: "add", data: {} });
                  showToast(isAdd ? "Granting pass in MongoDB Atlas..." : "Updating in Atlas...");
                  try {
                    await fetch(`${API_URL}/api/admin/subscriptions${!isAdd ? "/" + payload.id : ""}`, {
                      method: isAdd ? "POST" : "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    showToast(isAdd ? "Access pass granted in MongoDB Atlas!" : "Subscription updated in Atlas!");
                  } catch (e) {
                    showToast("Saved locally (offline mode)");
                  }
                }}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                Save Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT MODAL */}
      {productModal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">
                {productModal.mode === "add" ? "Add New Digital Codex" : "Edit Codex Details"}
              </h3>
              <button onClick={() => setProductModal({ open: false, mode: "add", data: {} })} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-slate-100 cursor-pointer" aria-label="Close modal">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Codex Title *</label>
                <input
                  type="text"
                  value={productModal.data.title || ""}
                  onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, title: e.target.value } })}
                  placeholder="e.g. Business Law (CSEET & CA Foundation)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs min-h-[44px] sm:min-h-0"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subtitle / Volume Details *</label>
                <input
                  type="text"
                  value={productModal.data.subtitle || ""}
                  onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, subtitle: e.target.value } })}
                  placeholder="e.g. Volume 1 • Statutory Codex (Units 1 to 6)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs min-h-[44px] sm:min-h-0"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Access Price (₹) *</label>
                  <input
                    type="number"
                    value={productModal.data.price || 0}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, price: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs min-h-[44px] sm:min-h-0"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={productModal.data.originalPrice || 0}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, originalPrice: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs min-h-[44px] sm:min-h-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Category</label>
                  <select
                    value={productModal.data.category || "CSEET"}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, category: e.target.value as any } })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 bg-white text-base sm:text-xs min-h-[44px] sm:min-h-0"
                  >
                    <option value="CSEET">CSEET</option>
                    <option value="CA Foundation">CA Foundation</option>
                    <option value="Both">Both (ICAI &amp; ICSI)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={productModal.data.status || "Active"}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, status: e.target.value as any } })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 bg-white text-base sm:text-xs min-h-[44px] sm:min-h-0"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={productModal.data.description || ""}
                  onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, description: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">In-Web Digital PDF URL</label>
                <input
                  type="text"
                  value={productModal.data.pdfUrl || ""}
                  onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, pdfUrl: e.target.value } })}
                  placeholder="/api/pdf/cseet-business-law-full.pdf"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs min-h-[44px] sm:min-h-0"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setProductModal({ open: false, mode: "add", data: {} })}
                className="px-4 py-2.5 min-h-[44px] sm:min-h-0 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!productModal.data.title) return alert("Please enter a title");
                  const isAdd = productModal.mode === "add";
                  const payload: ProductItem = {
                    id: productModal.data.id || `prod-${Date.now()}`,
                    title: productModal.data.title || "Untitled Book",
                    subtitle: productModal.data.subtitle || "",
                    category: productModal.data.category || "CSEET",
                    format: "Digital Codex (In-Web DRM)",
                    price: Number(productModal.data.price) || 249,
                    originalPrice: Number(productModal.data.originalPrice) || 499,
                    pages: productModal.data.pages || "150 Pages",
                    status: productModal.data.status || "Active",
                    pdfUrl: productModal.data.pdfUrl || "/api/pdf/cseet-business-law-full.pdf",
                    description: productModal.data.description || "",
                    units: productModal.data.units || ["Unit 1", "Unit 2"],
                  };
                  const next = isAdd ? [...products, payload] : products.map((p) => (p.id === payload.id ? payload : p));
                  setProducts(next);
                  localStorage.setItem("lawkaksha_admin_products", JSON.stringify(next));
                  setProductModal({ open: false, mode: "add", data: {} });
                  showToast(isAdd ? "Adding Codex to MongoDB Atlas..." : "Updating in Atlas...");
                  try {
                    await fetch(`${API_URL}/api/admin/products${!isAdd ? "/" + payload.id : ""}`, {
                      method: isAdd ? "POST" : "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    showToast(isAdd ? "Digital Codex saved to MongoDB Atlas!" : "Codex updated in Atlas!");
                  } catch (e) {
                    showToast("Saved locally (offline mode)");
                  }
                }}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                Save Codex
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT MODAL */}
      {studentModal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">
                {studentModal.mode === "add" ? "Enroll New Student" : "Edit Student Info"}
              </h3>
              <button onClick={() => setStudentModal({ open: false, mode: "add", data: {} })} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-slate-100 cursor-pointer" aria-label="Close modal">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  value={studentModal.data.name || ""}
                  onChange={(e) => setStudentModal({ ...studentModal, data: { ...studentModal.data, name: e.target.value } })}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs min-h-[44px] sm:min-h-0"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student / Roll Number *</label>
                <input
                  type="text"
                  value={studentModal.data.student_id || ""}
                  onChange={(e) => setStudentModal({ ...studentModal, data: { ...studentModal.data, student_id: e.target.value } })}
                  placeholder="LRK-2026-009821"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 font-mono text-base sm:text-xs min-h-[44px] sm:min-h-0"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={studentModal.data.email || ""}
                  onChange={(e) => setStudentModal({ ...studentModal, data: { ...studentModal.data, email: e.target.value } })}
                  placeholder="student@thelawkaksha.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs min-h-[44px] sm:min-h-0"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={studentModal.data.phone || ""}
                  onChange={(e) => setStudentModal({ ...studentModal, data: { ...studentModal.data, phone: e.target.value } })}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs min-h-[44px] sm:min-h-0"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Exam</label>
                <select
                  value={studentModal.data.target_exam || "CSEET Law & Management"}
                  onChange={(e) => setStudentModal({ ...studentModal, data: { ...studentModal.data, target_exam: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 bg-white text-base sm:text-xs min-h-[44px] sm:min-h-0"
                >
                  <option value="CSEET Law & Management">CSEET Law &amp; Management</option>
                  <option value="CA Foundation Paper 2">CA Foundation Paper 2 (Business Laws)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setStudentModal({ open: false, mode: "add", data: {} })}
                className="px-4 py-2.5 min-h-[44px] sm:min-h-0 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!studentModal.data.name) return alert("Please enter student name");
                  const isAdd = studentModal.mode === "add";
                  const payload: StudentRecord = {
                    id: studentModal.data.id || `std-${Date.now()}`,
                    student_id: studentModal.data.student_id || `LRK-2026-00${Math.floor(1000 + Math.random() * 9000)}`,
                    name: studentModal.data.name || "",
                    email: studentModal.data.email || "",
                    phone: studentModal.data.phone || "+91 98000 00000",
                    target_exam: studentModal.data.target_exam || "CSEET Law & Management",
                    is_active: studentModal.data.is_active !== undefined ? studentModal.data.is_active : true,
                    drm_access: studentModal.data.drm_access !== undefined ? studentModal.data.drm_access : true,
                    enrolled_books: studentModal.data.enrolled_books || ["Business Law (Volume 1)", "Business Law & Management (Volume 2)"],
                    joined_date: studentModal.data.joined_date || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
                  };
                  const next = isAdd ? [...students, payload] : students.map((s) => (s.id === payload.id ? payload : s));
                  setStudents(next);
                  localStorage.setItem("lawkaksha_admin_students", JSON.stringify(next));
                  setStudentModal({ open: false, mode: "add", data: {} });
                  showToast(isAdd ? "Enrolling student in MongoDB Atlas..." : "Updating in Atlas...");
                  try {
                    await fetch(`${API_URL}/api/admin/students${!isAdd ? "/" + payload.id : ""}`, {
                      method: isAdd ? "POST" : "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    showToast(isAdd ? "Student enrolled in MongoDB Atlas!" : "Student updated in Atlas!");
                  } catch (e) {
                    showToast("Saved locally (offline mode)");
                  }
                }}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                Save Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CASE STUDY MODAL */}
      {caseModal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">
                {caseModal.mode === "add" ? "Add Weekly Case Study" : "Edit Case Study Problem"}
              </h3>
              <button onClick={() => setCaseModal({ open: false, mode: "add", data: {} })} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-slate-100 cursor-pointer" aria-label="Close modal">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Feature Day</label>
                  <select
                    value={caseModal.data.day || "Monster Monday"}
                    onChange={(e) => setCaseModal({ ...caseModal, data: { ...caseModal.data, day: e.target.value } })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 bg-white text-base sm:text-xs min-h-[44px] sm:min-h-0"
                  >
                    <option value="Monster Monday">Monster Monday</option>
                    <option value="Midweek Law Madness">Midweek Law Madness</option>
                    <option value="Final Boss Friday">Final Boss Friday</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Difficulty Badge</label>
                  <input
                    type="text"
                    value={caseModal.data.badge || "High Difficulty"}
                    onChange={(e) => setCaseModal({ ...caseModal, data: { ...caseModal.data, badge: e.target.value } })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs min-h-[44px] sm:min-h-0"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Statutory Subject / Act *</label>
                <input
                  type="text"
                  value={caseModal.data.subject || ""}
                  onChange={(e) => setCaseModal({ ...caseModal, data: { ...caseModal.data, subject: e.target.value } })}
                  placeholder="e.g. Indian Contract Act, 1872"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs min-h-[44px] sm:min-h-0"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Case Title *</label>
                <input
                  type="text"
                  value={caseModal.data.title || ""}
                  onChange={(e) => setCaseModal({ ...caseModal, data: { ...caseModal.data, title: e.target.value } })}
                  placeholder="e.g. The Anticipatory Breach & Measure of Damages"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs min-h-[44px] sm:min-h-0"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Case Scenario / Problem Statement *</label>
                <textarea
                  rows={3}
                  value={caseModal.data.scenario || ""}
                  onChange={(e) => setCaseModal({ ...caseModal, data: { ...caseModal.data, scenario: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Model Answer (4-Step Statutory Structure) *</label>
                <textarea
                  rows={3}
                  value={caseModal.data.modelAnswer || ""}
                  onChange={(e) => setCaseModal({ ...caseModal, data: { ...caseModal.data, modelAnswer: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Legal Precedent / Citation</label>
                  <input
                    type="text"
                    value={caseModal.data.precedent || ""}
                    onChange={(e) => setCaseModal({ ...caseModal, data: { ...caseModal.data, precedent: e.target.value } })}
                    placeholder="e.g. Frost v. Knight (1872)"
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs min-h-[44px] sm:min-h-0"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Evaluation Marks</label>
                  <input
                    type="text"
                    value={caseModal.data.marks || "6/6 Marks"}
                    onChange={(e) => setCaseModal({ ...caseModal, data: { ...caseModal.data, marks: e.target.value } })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs min-h-[44px] sm:min-h-0"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setCaseModal({ open: false, mode: "add", data: {} })}
                className="px-4 py-2.5 min-h-[44px] sm:min-h-0 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!caseModal.data.title || !caseModal.data.scenario) return alert("Please fill title and scenario");
                  const isAdd = caseModal.mode === "add";
                  const payload: CaseStudyItem = {
                    id: caseModal.data.id || `case-${Date.now()}`,
                    day: caseModal.data.day || "Monster Monday",
                    badge: caseModal.data.badge || "High Difficulty",
                    subject: caseModal.data.subject || "Indian Contract Act, 1872",
                    title: caseModal.data.title || "",
                    scenario: caseModal.data.scenario || "",
                    modelAnswer: caseModal.data.modelAnswer || "",
                    precedent: caseModal.data.precedent || "Standard Citation",
                    marks: caseModal.data.marks || "6/6 Marks",
                  };
                  const next = isAdd ? [...cases, payload] : cases.map((c) => (c.id === payload.id ? payload : c));
                  setCases(next);
                  localStorage.setItem("lawkaksha_admin_cases", JSON.stringify(next));
                  setCaseModal({ open: false, mode: "add", data: {} });
                  showToast(isAdd ? "Adding case to MongoDB Atlas..." : "Updating in Atlas...");
                  try {
                    await fetch(`${API_URL}/api/admin/cases${!isAdd ? "/" + payload.id : ""}`, {
                      method: isAdd ? "POST" : "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    showToast(isAdd ? "Case study saved in MongoDB Atlas!" : "Case study updated in Atlas!");
                  } catch (e) {
                    showToast("Saved locally (offline mode)");
                  }
                }}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                Save Case
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MCQ MODAL */}
      {mcqModal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">
                {mcqModal.mode === "add" ? "Add MCQ Question" : "Edit MCQ Question"}
              </h3>
              <button onClick={() => setMcqModal({ open: false, mode: "add", data: {} })} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-slate-100 cursor-pointer" aria-label="Close modal">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject / Act *</label>
                  <input
                    type="text"
                    value={mcqModal.data.subject || ""}
                    onChange={(e) => setMcqModal({ ...mcqModal, data: { ...mcqModal.data, subject: e.target.value } })}
                    placeholder="e.g. Sale of Goods Act, 1930"
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs min-h-[44px] sm:min-h-0"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Section Reference</label>
                  <input
                    type="text"
                    value={mcqModal.data.section || ""}
                    onChange={(e) => setMcqModal({ ...mcqModal, data: { ...mcqModal.data, section: e.target.value } })}
                    placeholder="e.g. Section 16(1)"
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 font-mono text-base sm:text-xs min-h-[44px] sm:min-h-0"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Question Text *</label>
                <textarea
                  rows={2}
                  value={mcqModal.data.question || ""}
                  onChange={(e) => setMcqModal({ ...mcqModal, data: { ...mcqModal.data, question: e.target.value } })}
                  placeholder="Enter the objective question statement..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-slate-700">Options (Select radio for Correct Option) *</label>
                {[0, 1, 2, 3].map((optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={mcqModal.data.correctOption === optIdx}
                      onChange={() => setMcqModal({ ...mcqModal, data: { ...mcqModal.data, correctOption: optIdx } })}
                      className="w-5 h-5 accent-violet-600 cursor-pointer shrink-0"
                    />
                    <span className="font-bold font-mono w-4">{String.fromCharCode(65 + optIdx)}.</span>
                    <input
                      type="text"
                      value={mcqModal.data.options?.[optIdx] || ""}
                      onChange={(e) => {
                        const nextOpts = [...(mcqModal.data.options || ["", "", "", ""])];
                        nextOpts[optIdx] = e.target.value;
                        setMcqModal({ ...mcqModal, data: { ...mcqModal.data, options: nextOpts } });
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                      className="flex-1 p-2 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs min-h-[44px] sm:min-h-0"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bare Act Citation / Explanation</label>
                <textarea
                  rows={2}
                  value={mcqModal.data.explanation || ""}
                  onChange={(e) => setMcqModal({ ...mcqModal, data: { ...mcqModal.data, explanation: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setMcqModal({ open: false, mode: "add", data: {} })}
                className="px-4 py-2.5 min-h-[44px] sm:min-h-0 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!mcqModal.data.question) return alert("Please enter question text");
                  const isAdd = mcqModal.mode === "add";
                  const payload: McqQuestionItem = {
                    id: mcqModal.data.id || `mcq-${Date.now()}`,
                    subject: mcqModal.data.subject || "Business Law",
                    section: mcqModal.data.section || "General",
                    question: mcqModal.data.question || "",
                    options: mcqModal.data.options || ["", "", "", ""],
                    correctOption: Number(mcqModal.data.correctOption) || 0,
                    explanation: mcqModal.data.explanation || "",
                  };
                  const next = isAdd ? [...mcqs, payload] : mcqs.map((m) => (m.id === payload.id ? payload : m));
                  setMcqs(next);
                  localStorage.setItem("lawkaksha_admin_mcqs", JSON.stringify(next));
                  setMcqModal({ open: false, mode: "add", data: {} });
                  showToast(isAdd ? "Adding MCQ to MongoDB Atlas..." : "Updating in Atlas...");
                  try {
                    await fetch(`${API_URL}/api/admin/mcqs${!isAdd ? "/" + payload.id : ""}`, {
                      method: isAdd ? "POST" : "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    showToast(isAdd ? "MCQ added to MongoDB Atlas!" : "MCQ updated in Atlas!");
                  } catch (e) {
                    showToast("Saved locally (offline mode)");
                  }
                }}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                Save Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COUPON MODAL */}
      {couponModal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">
                {couponModal.mode === "add" ? "Create Discount Coupon" : "Edit Coupon"}
              </h3>
              <button onClick={() => setCouponModal({ open: false, mode: "add", data: {} })} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-slate-100 cursor-pointer" aria-label="Close modal">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coupon Code (e.g. EXEMPTION2026) *</label>
                <input
                  type="text"
                  value={couponModal.data.code || ""}
                  onChange={(e) => setCouponModal({ ...couponModal, data: { ...couponModal.data, code: e.target.value.toUpperCase() } })}
                  placeholder="EXEMPTION2026"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 font-mono font-bold uppercase text-base sm:text-xs min-h-[44px] sm:min-h-0"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount (% Off) *</label>
                  <input
                    type="number"
                    value={couponModal.data.discountPercent || 20}
                    onChange={(e) => setCouponModal({ ...couponModal, data: { ...couponModal.data, discountPercent: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs min-h-[44px] sm:min-h-0"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min. Order (₹)</label>
                  <input
                    type="number"
                    value={couponModal.data.minOrder || 200}
                    onChange={(e) => setCouponModal({ ...couponModal, data: { ...couponModal.data, minOrder: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs min-h-[44px] sm:min-h-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Usages</label>
                  <input
                    type="number"
                    value={couponModal.data.maxUses || 100}
                    onChange={(e) => setCouponModal({ ...couponModal, data: { ...couponModal.data, maxUses: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-base sm:text-xs min-h-[44px] sm:min-h-0"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={couponModal.data.expiryDate || "2026-12-31"}
                    onChange={(e) => setCouponModal({ ...couponModal, data: { ...couponModal.data, expiryDate: e.target.value } })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 bg-white text-base sm:text-xs min-h-[44px] sm:min-h-0"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={couponModal.data.status || "Active"}
                  onChange={(e) => setCouponModal({ ...couponModal, data: { ...couponModal.data, status: e.target.value as any } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 bg-white text-base sm:text-xs min-h-[44px] sm:min-h-0"
                >
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setCouponModal({ open: false, mode: "add", data: {} })}
                className="px-4 py-2.5 min-h-[44px] sm:min-h-0 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!couponModal.data.code) return alert("Please enter coupon code");
                  const isAdd = couponModal.mode === "add";
                  const payload: CouponRecord = {
                    id: couponModal.data.id || `cp-${Date.now()}`,
                    code: (couponModal.data.code || "DISCOUNT").toUpperCase().trim(),
                    discountPercent: Number(couponModal.data.discountPercent) || 20,
                    minOrder: Number(couponModal.data.minOrder) || 200,
                    maxUses: Number(couponModal.data.maxUses) || 100,
                    usedCount: Number(couponModal.data.usedCount) || 0,
                    expiryDate: couponModal.data.expiryDate || "2026-12-31",
                    status: couponModal.data.status || "Active",
                  };
                  const next = isAdd ? [...coupons, payload] : coupons.map((c) => (c.id === payload.id ? payload : c));
                  setCoupons(next);
                  localStorage.setItem("lawkaksha_admin_coupons", JSON.stringify(next));
                  setCouponModal({ open: false, mode: "add", data: {} });
                  showToast(isAdd ? "Adding coupon to MongoDB Atlas..." : "Updating in Atlas...");
                  try {
                    await fetch(`${API_URL}/api/admin/coupons${!isAdd ? "/" + payload.id : ""}`, {
                      method: isAdd ? "POST" : "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    showToast(isAdd ? `Coupon ${payload.code} saved in MongoDB Atlas!` : `Coupon ${payload.code} updated!`);
                  } catch (e) {
                    showToast("Saved locally (offline mode)");
                  }
                }}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                Save Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
