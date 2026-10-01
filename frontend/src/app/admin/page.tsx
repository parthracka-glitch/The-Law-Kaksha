"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  UploadCloud,
  FileText,
  Layers,
  FileUp,
  RefreshCw,
  Scale,
  Eye,
  AlertTriangle,
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

export interface ResourceItem {
  id: string;
  course: "ca-foundation" | "cseet" | string;
  actName: string;
  chapterNumber: number;
  type: "notes" | "flowchart" | "practice" | "pyq" | "case_study" | "ldr";
  title: string;
  description: string;
  pdfUrl: string;
  samplePdfUrl?: string;
  isSample: boolean;
  status: "Published" | "Coming soon" | "Draft";
  order: number;
  pages: string;
  cloudinaryPublicId?: string;
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
  accessStatus: "Active" | "Pending" | "Revoked" | "Expired";
  expiryDate?: string;
  daysRemaining?: number;
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

export interface Section16ComparisonSetting {
  act: string;
  section: string;
  marks: string;
  topic: string;
  question: string;
  aspirantScore: string;
  aspirantTitle: string;
  aspirantAnswer: string;
  aspirantIssues: string[];
  modelScore: string;
  modelTitle: string;
  modelAnswer: string;
}

// --- INITIAL SEED DATA ---
const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: "prod-vol1",
    title: "CA Foundation Business Laws Codex",
    subtitle: "Complete 7 Chapters Study Notes & Case Problem Bank",
    category: "CA Foundation",
    format: "Digital Codex (In-Web DRM)",
    price: 99,
    originalPrice: 299,
    pages: "250+ Pages",
    status: "Active",
    pdfUrl: "/notes/unit-1-general-nature-of-partnership.pdf",
    description: "Comprehensive preparation platform for CA Foundation Paper 2 (ICAI New Scheme). Includes chapter-wise notes for all 7 Acts, practice questions, and model solutions.",
    units: ["Indian Regulatory Framework", "Indian Contract Act, 1872", "Sale of Goods Act, 1930", "Indian Partnership Act, 1932", "LLP Act, 2008", "Companies Act, 2013", "Negotiable Instruments Act, 1881"],
  },
  {
    id: "prod-vol2",
    title: "CSEET Business Law & Management Codex",
    subtitle: "8 Units Comprehensive Notes & MCQ Practice Bank",
    category: "CSEET",
    format: "Digital Codex (In-Web DRM)",
    price: 99,
    originalPrice: 299,
    pages: "300+ Pages",
    status: "Active",
    pdfUrl: "/notes/cseet-management-full.pdf",
    description: "Complete preparation platform for CSEET Paper 2 (ICSI Syllabus). Includes unit-wise notes, conceptual MCQs with explanations, and timed mock drills.",
    units: ["Indian Contract Act", "Sale of Goods Act", "Partnership Act", "LLP Act", "Company Law", "Negotiable Instruments", "Principles of Management", "Business Environment & Ethics"],
  },
];

const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: "res-ca-1",
    course: "ca-foundation",
    actName: "Indian Regulatory Framework",
    chapterNumber: 1,
    type: "notes",
    title: "Overview of Indian Legal System & Hierarchy of Courts",
    description: "Structure of Legislative, Executive & Judiciary in India with constitutional jurisdiction.",
    pdfUrl: "/notes/ca-foundation-framework-notes.pdf",
    isSample: false,
    status: "Published",
    order: 1,
    pages: "18 Pages",
  },
  {
    id: "res-ca-2",
    course: "ca-foundation",
    actName: "The Indian Contract Act, 1872",
    chapterNumber: 2,
    type: "notes",
    title: "Nature & Essentials of Valid Contract (Sec 1-10)",
    description: "Offer, Acceptance, Intention to create Legal Relationship with landmark English & Indian precedents.",
    pdfUrl: "/notes/contract-act-unit-1.pdf",
    isSample: false,
    status: "Published",
    order: 1,
    pages: "34 Pages",
  },
  {
    id: "res-ca-3",
    course: "ca-foundation",
    actName: "The Sale of Goods Act, 1930",
    chapterNumber: 3,
    type: "notes",
    title: "Conditions, Warranties & Caveat Emptor (Sec 11-17)",
    description: "Implied conditions of fitness, Priest v. Last, Grant v. Australian Knitting Mills & Merchantable quality.",
    pdfUrl: "/notes/sale-of-goods-unit-2.pdf",
    isSample: false,
    status: "Published",
    order: 2,
    pages: "26 Pages",
  },
  {
    id: "res-ca-4",
    course: "ca-foundation",
    actName: "The Indian Partnership Act, 1932",
    chapterNumber: 4,
    type: "notes",
    title: "Unit 1: General Nature of Partnership",
    description: "Definition of Partnership, Mutual Agency, True Test (Cox v. Hickman) & Partnership vs Co-ownership.",
    pdfUrl: "/notes/unit-1-general-nature-of-partnership.pdf",
    samplePdfUrl: "/notes/unit-1-general-nature-of-partnership.pdf",
    isSample: true,
    status: "Published",
    order: 1,
    pages: "24 Pages (Sample PDF)",
  },
  {
    id: "res-ca-5",
    course: "ca-foundation",
    actName: "The Indian Partnership Act, 1932",
    chapterNumber: 4,
    type: "notes",
    title: "Unit 2: Relations of Partners",
    description: "Rights, Duties, Implied Authority, Holding Out, Minor as Beneficiary.",
    pdfUrl: "/notes/unit-2-relations-of-partners.pdf",
    samplePdfUrl: "/notes/unit-2-relations-of-partners.pdf",
    isSample: true,
    status: "Published",
    order: 2,
    pages: "28 Pages (Sample PDF)",
  },
  {
    id: "res-ca-6",
    course: "ca-foundation",
    actName: "The Indian Partnership Act, 1932",
    chapterNumber: 4,
    type: "notes",
    title: "Unit 3: Registration and Dissolution of Firm",
    description: "Effect of Non-Registration (Sec 69), Modes of Dissolution, Settlement of Accounts (Sec 48).",
    pdfUrl: "/notes/unit-3-registration-and-dissolution-of-firm.pdf",
    samplePdfUrl: "/notes/unit-3-registration-and-dissolution-of-firm.pdf",
    isSample: true,
    status: "Published",
    order: 3,
    pages: "32 Pages (Sample PDF)",
  },
  {
    id: "res-ca-7",
    course: "ca-foundation",
    actName: "The Limited Liability Partnership Act, 2008",
    chapterNumber: 5,
    type: "notes",
    title: "LLP Architecture & Comparison with Traditional Firm",
    description: "Separate legal identity, perpetual succession, Designated Partners compliance & Amendment Act 2021.",
    pdfUrl: "/notes/llp-act-notes.pdf",
    isSample: false,
    status: "Published",
    order: 1,
    pages: "20 Pages",
  },
  {
    id: "res-ca-8",
    course: "ca-foundation",
    actName: "The Companies Act, 2013",
    chapterNumber: 6,
    type: "notes",
    title: "Essential Characteristics & Lifting of Corporate Veil",
    description: "Salomon v. Salomon, Private vs Public vs One Person Company, Section 8 Non-profit companies.",
    pdfUrl: "/notes/companies-act-unit-1.pdf",
    isSample: false,
    status: "Published",
    order: 1,
    pages: "36 Pages",
  },
  {
    id: "res-ca-9",
    course: "ca-foundation",
    actName: "The Negotiable Instruments Act, 1881",
    chapterNumber: 7,
    type: "notes",
    title: "Promissory Notes, Bills of Exchange & Cheques",
    description: "Holder in Due Course, Section 138 Dishonour penalties, statutory notice timeline & defences.",
    pdfUrl: "/notes/negotiable-instruments-unit-1.pdf",
    isSample: false,
    status: "Published",
    order: 1,
    pages: "26 Pages",
  },
  {
    id: "res-cs-1",
    course: "cseet",
    actName: "General Principles of Management",
    chapterNumber: 7,
    type: "notes",
    title: "Management Principles, Functions & Theories",
    description: "Henry Fayol 14 Principles vs FW Taylor Scientific Management, PESTLE Analysis & Corporate Governance.",
    pdfUrl: "/notes/cseet-management-full.pdf",
    samplePdfUrl: "/notes/cseet-management-full.pdf",
    isSample: true,
    status: "Published",
    order: 1,
    pages: "120+ Pages",
  },
];

const INITIAL_SUBSCRIPTIONS: SubscriptionRecord[] = [];

const INITIAL_STUDENTS: StudentRecord[] = [];

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
];

const INITIAL_COUPONS: CouponRecord[] = [
  { id: "cp-1", code: "EXEMPTION2026", discountPercent: 20, minOrder: 99, maxUses: 500, usedCount: 142, expiryDate: "2026-12-31", status: "Active" },
  { id: "cp-2", code: "FIRST50", discountPercent: 15, minOrder: 99, maxUses: 100, usedCount: 88, expiryDate: "2026-11-30", status: "Active" },
];

export default function AdminPortalPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  type TabType = "overview" | "subscriptions" | "products" | "resources" | "students" | "cases" | "mcq" | "coupons" | "qotd" | "comparison";
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Entities state
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [resources, setResources] = useState<ResourceItem[]>(INITIAL_RESOURCES);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("all");
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
  const [section16Comparison, setSection16Comparison] = useState<Section16ComparisonSetting>({
    act: "The Sale of Goods Act, 1930",
    section: "Section 16(1)",
    marks: "6 Marks (ICAI Standard)",
    topic: "Doctrine of Caveat Emptor & Implied Condition as to Quality or Fitness",
    question: "Under Section 16(1) of the Sale of Goods Act, 1930, explain the conditions under which an implied condition as to quality or fitness applies even when not expressly stated.",
    aspirantScore: "2 / 6 Marks",
    aspirantTitle: "Typical 2/6 Marks Aspirant Answer",
    aspirantAnswer: "Caveat Emptor means let the buyer beware. The buyer should inspect goods himself before buying. However, if the buyer told the seller why he is buying and seller is in business, seller is responsible. (Priest v. Last)",
    aspirantIssues: [
      "Fails to cite exact statutory 3-element test of Section 16(1)",
      "Missing explanation of 'communication of purpose by implication'",
      "No mention of patent or trade name proviso exception",
    ],
    modelScore: "6 / 6 Marks",
    modelTitle: "The Law कक्षा 6/6 Model Legal Answer",
    modelAnswer: "Under Section 16(1) of the Sale of Goods Act, 1930, the general rule of Caveat Emptor is displaced and an implied condition arises if: (1) Buyer makes known to seller the particular purpose (expressly or by implication), (2) Buyer relies on seller's skill or judgment, (3) Goods are of a description which seller supplies in the course of business. Exception: Proviso to Sec 16(1) provides no implied condition for specified articles sold under patent or trade name.",
  });

  // File Upload State
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resourceFileInputRef = useRef<HTMLInputElement>(null);

  // CRUD Modals
  const [productModal, setProductModal] = useState<{ open: boolean; mode: "add" | "edit"; data: Partial<ProductItem> }>({ open: false, mode: "add", data: {} });
  const [resourceModal, setResourceModal] = useState<{ open: boolean; mode: "add" | "edit"; data: Partial<ResourceItem> }>({ open: false, mode: "add", data: {} });
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

      // 1. Optimistic load from localStorage
      try {
        const p = localStorage.getItem("lawkaksha_admin_products");
        if (p) setProducts(JSON.parse(p));
        const resList = localStorage.getItem("lawkaksha_admin_resources");
        if (resList) setResources(JSON.parse(resList));
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
          const [pRes, rRes, sRes, stdRes, cRes, mRes, cpRes, exRes, qRes, compRes] = await Promise.allSettled([
            fetch(`${API_URL}/api/admin/products`).then((r) => r.json()),
            fetch(`${API_URL}/api/admin/resources`).then((r) => r.json()),
            fetch(`${API_URL}/api/admin/subscriptions`).then((r) => r.json()),
            fetch(`${API_URL}/api/admin/students`).then((r) => r.json()),
            fetch(`${API_URL}/api/admin/cases`).then((r) => r.json()),
            fetch(`${API_URL}/api/admin/mcqs`).then((r) => r.json()),
            fetch(`${API_URL}/api/admin/coupons`).then((r) => r.json()),
            fetch(`${API_URL}/api/admin/exam-settings`).then((r) => r.json()),
            fetch(`${API_URL}/api/admin/qotd`).then((r) => r.json()),
            fetch(`${API_URL}/api/admin/section16-comparison`).then((r) => r.json()),
          ]);

          if (pRes.status === "fulfilled" && pRes.value?.products?.length) {
            setProducts(pRes.value.products);
            localStorage.setItem("lawkaksha_admin_products", JSON.stringify(pRes.value.products));
          }
          if (rRes.status === "fulfilled" && rRes.value?.resources?.length) {
            setResources(rRes.value.resources);
            localStorage.setItem("lawkaksha_admin_resources", JSON.stringify(rRes.value.resources));
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
          if (compRes.status === "fulfilled" && compRes.value?.comparison) {
            setSection16Comparison(compRes.value.comparison);
          }
          setIsAtlasConnected(true);
        } catch (err) {
          console.warn("[Admin] Running in local cache mode:", err);
          setIsAtlasConnected(false);
        }
      };

      syncWithAtlas();
    }
  }, [router, API_URL]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("lawkaksha_admin_session");
      localStorage.removeItem("lawkaksha_token");
      window.dispatchEvent(new Event("storage"));
      router.push("/login");
    }
  };

  // Generic File Upload Handler (Cloudinary CDN / Local fallback)
  const handleFileUpload = async (file: File, onSuccess: (url: string, publicId?: string) => void) => {
    if (!file) return;
    setIsUploadingFile(true);
    showToast("Uploading file to Cloudinary / Storage...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_URL}/api/admin/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        onSuccess(data.url, data.publicId);
        showToast(data.isLocal ? "Uploaded locally!" : "Uploaded directly to Cloudinary CDN!");
      } else {
        showToast("Upload failed: " + (data.message || "Unknown error"));
      }
    } catch (err: any) {
      showToast("Upload error: " + err.message);
    } finally {
      setIsUploadingFile(false);
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
    { id: "subscriptions" as TabType, label: "Monthly Passes & Access", icon: CreditCard, badge: subscriptions.length },
    { id: "products" as TabType, label: "Study Books & Codices", icon: BookOpen, badge: products.length },
    { id: "resources" as TabType, label: "Act-Wise Resources Hub", icon: Layers, badge: resources.length },
    { id: "comparison" as TabType, label: "Sec 16(1) Evaluator", icon: Scale },
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
                Cloudinary Storage, DRM Rights, Student Passes &amp; Act-Wise Resources
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
                  <h2 className="text-2xl font-bold">The Law कक्षा Portal Operations</h2>
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
                  <h3 className="text-xl font-bold text-slate-800 mt-0.5">{products.length} Master Courses</h3>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">₹99/Month Monthly Offer Active</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
                    <Layers className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Act-Wise Resources</p>
                  <h3 className="text-xl font-bold text-slate-800 mt-0.5">{resources.length} Modules</h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">Notes, Flowcharts &amp; LDRs</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Active Monthly Passes</p>
                  <h3 className="text-xl font-bold text-slate-800 mt-0.5">{subscriptions.length} Subscriptions</h3>
                  <p className="text-[11px] text-amber-600 font-medium mt-1">30-Day Auto Expiry Engine</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">DRM In-Web Vault</p>
                  <h3 className="text-xl font-bold text-slate-800 mt-0.5">100% Protected</h3>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">Copy/Print/Download Blocked</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ACT-WISE RESOURCES HUB */}
          {activeTab === "resources" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Act-Wise Curriculum Resources Hub</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage Notes, Concept Flowcharts, PYQs, and LDR summary maps across all 7 CA Foundation Acts &amp; 8 CSEET Units.
                  </p>
                </div>
                <button
                  onClick={() => setResourceModal({
                    open: true,
                    mode: "add",
                    data: {
                      course: "ca-foundation",
                      type: "notes",
                      status: "Published",
                      chapterNumber: 1,
                      actName: "Indian Regulatory Framework",
                      isSample: false,
                    }
                  })}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Resource</span>
                </button>
              </div>

              {/* FILTER BAR */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Filter Course:</span>
                  <select
                    value={selectedCourseFilter}
                    onChange={(e) => setSelectedCourseFilter(e.target.value)}
                    className="p-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:border-violet-500 bg-white"
                  >
                    <option value="all">All Courses</option>
                    <option value="ca-foundation">CA Foundation (7 Acts)</option>
                    <option value="cseet">CSEET (8 Units)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Type:</span>
                  <select
                    value={selectedTypeFilter}
                    onChange={(e) => setSelectedTypeFilter(e.target.value)}
                    className="p-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:border-violet-500 bg-white"
                  >
                    <option value="all">All Types</option>
                    <option value="notes">Chapter Notes</option>
                    <option value="flowchart">Flowchart</option>
                    <option value="practice">Question Bank</option>
                    <option value="pyq">PYQ Drill</option>
                    <option value="ldr">Last Day Revision (LDR)</option>
                  </select>
                </div>
              </div>

              {/* RESOURCES GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {resources
                  .filter((r) => selectedCourseFilter === "all" || r.course === selectedCourseFilter)
                  .filter((r) => selectedTypeFilter === "all" || r.type === selectedTypeFilter)
                  .map((res) => (
                    <div key={res.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-100">
                            {res.course === "ca-foundation" ? "CA Foundation" : "CSEET"} • Ch {res.chapterNumber}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            res.status === "Published" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}>
                            {res.status}
                          </span>
                        </div>

                        <div>
                          <p className="text-[11px] font-bold text-slate-400">{res.actName}</p>
                          <h3 className="text-sm font-bold text-slate-800 leading-snug mt-0.5">{res.title}</h3>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {res.description}
                        </p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <span className="font-mono text-slate-600">{res.pages}</span>
                          {res.isSample && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                              Free Sample PDF
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 truncate max-w-[140px]" title={res.pdfUrl}>
                          {res.pdfUrl.split("/").pop()}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setResourceModal({ open: true, mode: "edit", data: res })}
                            className="p-1.5 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Delete resource: ${res.title}?`)) {
                                const next = resources.filter((r) => r.id !== res.id);
                                setResources(next);
                                localStorage.setItem("lawkaksha_admin_resources", JSON.stringify(next));
                                try {
                                  await fetch(`${API_URL}/api/admin/resources/${res.id}`, { method: "DELETE" });
                                } catch (e) {}
                                showToast("Resource deleted.");
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
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

          {/* TAB: SECTION 16(1) COMPARISON BLOCK EDITOR */}
          {activeTab === "comparison" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Section 16(1) Sale of Goods Answer Writing Diagnostic</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure the interactive "2/6 Marks Average Aspirant vs 6/6 Marks ICAI Model Answer" comparison displayed on the landing page.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Statutory Act</label>
                    <input
                      type="text"
                      value={section16Comparison.act}
                      onChange={(e) => setSection16Comparison({ ...section16Comparison, act: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Section Citation</label>
                    <input
                      type="text"
                      value={section16Comparison.section}
                      onChange={(e) => setSection16Comparison({ ...section16Comparison, section: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">ICAI Weightage Marks</label>
                    <input
                      type="text"
                      value={section16Comparison.marks}
                      onChange={(e) => setSection16Comparison({ ...section16Comparison, marks: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Problem Question Text</label>
                  <textarea
                    rows={2}
                    value={section16Comparison.question}
                    onChange={(e) => setSection16Comparison({ ...section16Comparison, question: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-violet-500"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 space-y-2">
                    <label className="block text-xs font-bold text-rose-800">Average Aspirant Answer (2/6)</label>
                    <textarea
                      rows={4}
                      value={section16Comparison.aspirantAnswer}
                      onChange={(e) => setSection16Comparison({ ...section16Comparison, aspirantAnswer: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-rose-200 text-xs text-slate-800 outline-none focus:border-rose-500 bg-white"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                    <label className="block text-xs font-bold text-emerald-800">Law Kaksha Model Answer (6/6)</label>
                    <textarea
                      rows={4}
                      value={section16Comparison.modelAnswer}
                      onChange={(e) => setSection16Comparison({ ...section16Comparison, modelAnswer: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-emerald-200 text-xs text-slate-800 outline-none focus:border-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={async () => {
                      showToast("Saving comparison block to MongoDB Atlas...");
                      try {
                        await fetch(`${API_URL}/api/admin/section16-comparison`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ comparison: section16Comparison }),
                        });
                        showToast("Section 16(1) comparison block updated in MongoDB Atlas!");
                      } catch (e) {
                        showToast("Saved locally (offline mode)");
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                  >
                    Save Comparison Updates
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MONTHLY SUBSCRIPTIONS & ACCESS PURCHASES */}
          {activeTab === "subscriptions" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Monthly Subscriptions &amp; In-Web DRM Passes</h2>
                  <p className="text-xs text-slate-500 mt-0.5">₹99/Month recurring duration tracking with 30-day active validity control.</p>
                </div>
                <button
                  onClick={() => setSubModal({
                    open: true,
                    mode: "add",
                    data: {
                      accessStatus: "Active",
                      paymentMode: "UPI / Razorpay",
                      targetExam: "CA Foundation Paper 2",
                      amount: "₹99",
                      item: "CA Foundation Business Laws (Monthly Access)",
                    }
                  })}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Grant 30-Day Access Pass</span>
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
                        <th className="py-3 px-4">Enrolled Course / Pass</th>
                        <th className="py-3 px-4">Monthly Fee</th>
                        <th className="py-3 px-4">Validity Remaining</th>
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
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-100">
                                {sub.daysRemaining !== undefined ? `${sub.daysRemaining} days left` : "30 days (Monthly)"}
                              </span>
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
                                  onClick={async () => {
                                    const renewed = subscriptions.map((item) =>
                                      item.id === sub.id ? { ...item, daysRemaining: 30, accessStatus: "Active" as const } : item
                                    );
                                    setSubscriptions(renewed);
                                    localStorage.setItem("lawkaksha_admin_subs", JSON.stringify(renewed));
                                    showToast(`Renewed 30-day pass for ${sub.studentName}`);
                                    try {
                                      await fetch(`${API_URL}/api/admin/subscriptions/${sub.id}`, {
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ daysRemaining: 30, accessStatus: "Active" }),
                                      });
                                    } catch (e) {}
                                  }}
                                  title="Renew 30 Days"
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" />
                                </button>
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
                  onClick={() => setProductModal({ open: true, mode: "add", data: { status: "Active", format: "Digital Codex (In-Web DRM)", category: "CA Foundation", price: 99, originalPrice: 299 } })}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Codex</span>
                </button>
              </div>

              {/* PRODUCT CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Included Statutory Chapters</p>
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
                          <span className="text-[10px] text-emerald-700 font-bold">/ Month</span>
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
                              const next = products.filter((p) => p.id !== prod.id);
                              setProducts(next);
                              localStorage.setItem("lawkaksha_admin_products", JSON.stringify(next));
                              try {
                                await fetch(`${API_URL}/api/admin/products/${prod.id}`, { method: "DELETE" });
                              } catch (e) {}
                              showToast("Product deleted.");
                            }
                          }}
                          className="p-2 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-all cursor-pointer"
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

          {/* TAB 4: STUDENTS & DRM RIGHTS */}
          {activeTab === "students" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Students &amp; In-Web DRM Enrolments</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Manage student identities, target exam goals &amp; DRM vault access authorization.</p>
                </div>
                <button
                  onClick={() => setStudentModal({ open: true, mode: "add", data: { is_active: true, drm_access: true, target_exam: "CA Foundation Paper 2" } })}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enroll New Student</span>
                </button>
              </div>

              {/* STUDENTS LIST */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold">
                      <tr>
                        <th className="py-3 px-4">Student ID &amp; Name</th>
                        <th className="py-3 px-4">Contact Info</th>
                        <th className="py-3 px-4">Target Exam Goal</th>
                        <th className="py-3 px-4">Enrolled Codices</th>
                        <th className="py-3 px-4">DRM Vault Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.map((std) => (
                        <tr key={std.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-800">{std.name}</p>
                            <p className="text-[10px] text-violet-600 font-mono">{std.student_id}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="text-slate-700">{std.email}</p>
                            <p className="text-[10px] text-slate-400">{std.phone}</p>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700">
                            {std.target_exam}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1">
                              {std.enrolled_books?.map((b, i) => (
                                <span key={i} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100">
                                  {b}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              std.drm_access ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                            }`}>
                              {std.drm_access ? "DRM In-Web Active" : "Access Blocked"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setStudentModal({ open: true, mode: "edit", data: std })}
                                className="p-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm(`Delete student ${std.name}?`)) {
                                    const next = students.filter((s) => s.id !== std.id);
                                    setStudents(next);
                                    localStorage.setItem("lawkaksha_admin_students", JSON.stringify(next));
                                    try {
                                      await fetch(`${API_URL}/api/admin/students/${std.id}`, { method: "DELETE" });
                                    } catch (e) {}
                                    showToast("Student deleted.");
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
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

          {/* TAB 5: WEEKLY CASES */}
          {activeTab === "cases" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Weekly High-Yield Case Scenarios</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Manage Monster Monday, Midweek Law Madness &amp; Final Boss Friday problem scenarios.</p>
                </div>
                <button
                  onClick={() => setCaseModal({ open: true, mode: "add", data: { day: "Monster Monday", badge: "High Difficulty", subject: "Indian Contract Act, 1872", marks: "6/6 Marks" } })}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Case Scenario</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cases.map((cs) => (
                  <div key={cs.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-violet-600 uppercase">{cs.day}</span>
                        <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-100">{cs.badge}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block">{cs.subject}</span>
                        <h3 className="text-sm font-bold text-slate-800 leading-snug">{cs.title}</h3>
                      </div>
                      <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100 line-clamp-3">
                        &ldquo;{cs.scenario}&rdquo;
                      </p>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-0.5">Model Solution</span>
                        <p className="text-xs text-slate-500 line-clamp-3">{cs.modelAnswer}</p>
                      </div>
                    </div>

                    <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{cs.precedent}</span>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setCaseModal({ open: true, mode: "edit", data: cs })} className="p-1.5 rounded-lg bg-violet-50 text-violet-700">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm(`Delete case scenario ${cs.title}?`)) {
                              const next = cases.filter((c) => c.id !== cs.id);
                              setCases(next);
                              localStorage.setItem("lawkaksha_admin_cases", JSON.stringify(next));
                              try {
                                await fetch(`${API_URL}/api/admin/cases/${cs.id}`, { method: "DELETE" });
                              } catch (e) {}
                              showToast("Case deleted.");
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600"
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

          {/* TAB 6: MCQ TEST BANK */}
          {activeTab === "mcq" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">MCQ Question Bank</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Manage objective questions, section citations &amp; statutory rationale explanations.</p>
                </div>
                <button
                  onClick={() => setMcqModal({ open: true, mode: "add", data: { correctOption: 0, subject: "Indian Contract Act, 1872", options: ["Option A", "Option B", "Option C", "Option D"] } })}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Question</span>
                </button>
              </div>

              <div className="space-y-4">
                {mcqs.map((mcq, idx) => (
                  <div key={mcq.id || idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-100">{mcq.subject}</span>
                        <span className="text-xs font-mono font-bold text-slate-600">{mcq.section}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setMcqModal({ open: true, mode: "edit", data: mcq })} className="p-1.5 rounded-lg bg-violet-50 text-violet-700">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm("Delete this MCQ?")) {
                              const next = mcqs.filter((m) => m.id !== mcq.id);
                              setMcqs(next);
                              localStorage.setItem("lawkaksha_admin_mcqs", JSON.stringify(next));
                              try {
                                await fetch(`${API_URL}/api/admin/mcqs/${mcq.id}`, { method: "DELETE" });
                              } catch (e) {}
                              showToast("MCQ deleted.");
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">{mcq.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {mcq.options?.map((opt, oIdx) => (
                        <div key={oIdx} className={`p-2.5 rounded-xl border ${oIdx === mcq.correctOption ? "bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold" : "bg-slate-50 border-slate-100 text-slate-600"}`}>
                          <span className="font-bold mr-1.5">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: COUPONS & OFFERS */}
          {activeTab === "coupons" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Coupons &amp; Discount Offers</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Manage promo codes and discount vouchers for student subscriptions.</p>
                </div>
                <button
                  onClick={() => setCouponModal({ open: true, mode: "add", data: { status: "Active", discountPercent: 20, minOrder: 99, maxUses: 500, usedCount: 0, expiryDate: "2026-12-31" } })}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Coupon</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {coupons.map((cp) => (
                  <div key={cp.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-extrabold font-mono text-violet-700 bg-violet-50 px-3 py-1 rounded-xl border border-violet-100">
                        {cp.code}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {cp.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-slate-600">
                      <p><strong>Discount:</strong> {cp.discountPercent}% OFF</p>
                      <p><strong>Min Order:</strong> ₹{cp.minOrder}</p>
                      <p><strong>Redeemed:</strong> {cp.usedCount} / {cp.maxUses} times</p>
                      <p><strong>Expires:</strong> {cp.expiryDate}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5">
                      <button onClick={() => setCouponModal({ open: true, mode: "edit", data: cp })} className="p-1.5 rounded-lg bg-violet-50 text-violet-700">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete coupon ${cp.code}?`)) {
                            const next = coupons.filter((c) => c.id !== cp.id);
                            setCoupons(next);
                            localStorage.setItem("lawkaksha_admin_coupons", JSON.stringify(next));
                            try {
                              await fetch(`${API_URL}/api/admin/coupons/${cp.id}`, { method: "DELETE" });
                            } catch (e) {}
                            showToast("Coupon deleted.");
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: EXAM DATES & QOTD */}
          {activeTab === "qotd" && (
            <div className="space-y-6">
              {/* EXAM COUNTDOWN SETTINGS */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-800">Target Exam Countdown Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {examSettings.map((ex, idx) => (
                    <div key={ex.id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                      <p className="text-xs font-bold text-slate-800">{ex.exam}</p>
                      <p className="text-[11px] text-slate-400">{ex.session}</p>
                      <div className="pt-1">
                        <input
                          type="date"
                          value={ex.date}
                          onChange={async (e) => {
                            const next = [...examSettings];
                            next[idx].date = e.target.value;
                            setExamSettings(next);
                            try {
                              await fetch(`${API_URL}/api/admin/exam-settings`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ examSettings: next }),
                              });
                              showToast("Updated target exam date!");
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
                      className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-sm cursor-pointer"
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

      {/* RESOURCE ADD / EDIT MODAL */}
      {resourceModal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">
                {resourceModal.mode === "add" ? "Add Act-Wise Resource" : "Edit Resource"}
              </h3>
              <button onClick={() => setResourceModal({ open: false, mode: "add", data: {} })} className="p-2 rounded-xl hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Course *</label>
                  <select
                    value={resourceModal.data.course || "ca-foundation"}
                    onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, course: e.target.value } })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 bg-white"
                  >
                    <option value="ca-foundation">CA Foundation (Paper 2)</option>
                    <option value="cseet">CSEET (Paper 2)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chapter / Unit Number *</label>
                  <input
                    type="number"
                    value={resourceModal.data.chapterNumber || 1}
                    onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, chapterNumber: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Act / Unit Name *</label>
                <input
                  type="text"
                  value={resourceModal.data.actName || ""}
                  onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, actName: e.target.value } })}
                  placeholder="e.g. The Indian Partnership Act, 1932"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Resource Title *</label>
                <input
                  type="text"
                  value={resourceModal.data.title || ""}
                  onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, title: e.target.value } })}
                  placeholder="e.g. Unit 1: General Nature of Partnership"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Resource Type</label>
                  <select
                    value={resourceModal.data.type || "notes"}
                    onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, type: e.target.value as any } })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 bg-white"
                  >
                    <option value="notes">Chapter Notes</option>
                    <option value="flowchart">Concept Flowchart</option>
                    <option value="practice">Practice Questions</option>
                    <option value="pyq">PYQ Drill</option>
                    <option value="ldr">Last Day Revision (LDR)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Publish Status</label>
                  <select
                    value={resourceModal.data.status || "Published"}
                    onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, status: e.target.value as any } })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 bg-white"
                  >
                    <option value="Published">Published (Active)</option>
                    <option value="Coming soon">Coming soon</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">PDF Document Stream / Cloudinary URL *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={resourceModal.data.pdfUrl || ""}
                    onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, pdfUrl: e.target.value } })}
                    placeholder="/notes/unit-1-general-nature-of-partnership.pdf"
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 font-mono text-xs"
                  />
                  <input
                    type="file"
                    ref={resourceFileInputRef}
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, (url, publicId) => {
                          setResourceModal((prev) => ({
                            ...prev,
                            data: { ...prev.data, pdfUrl: url, cloudinaryPublicId: publicId },
                          }));
                        });
                      }
                    }}
                  />
                  <button
                    type="button"
                    disabled={isUploadingFile}
                    onClick={() => resourceFileInputRef.current?.click()}
                    className="px-3 py-2 bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{isUploadingFile ? "Uploading..." : "Upload PDF"}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="res-sample-checkbox"
                  checked={Boolean(resourceModal.data.isSample)}
                  onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, isSample: e.target.checked } })}
                  className="rounded border-slate-300 text-violet-600 focus:ring-violet-500 w-4 h-4"
                />
                <label htmlFor="res-sample-checkbox" className="font-semibold text-slate-700 cursor-pointer">
                  Mark as Free Preview Sample (accessible without login)
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setResourceModal({ open: false, mode: "add", data: {} })}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!resourceModal.data.title) return alert("Please enter resource title");
                  const isAdd = resourceModal.mode === "add";
                  const payload: ResourceItem = {
                    id: resourceModal.data.id || `res-${Date.now()}`,
                    course: resourceModal.data.course || "ca-foundation",
                    actName: resourceModal.data.actName || "The Indian Partnership Act, 1932",
                    chapterNumber: Number(resourceModal.data.chapterNumber) || 1,
                    type: resourceModal.data.type || "notes",
                    title: resourceModal.data.title || "Chapter Notes",
                    description: resourceModal.data.description || "",
                    pdfUrl: resourceModal.data.pdfUrl || "/notes/unit-1-general-nature-of-partnership.pdf",
                    samplePdfUrl: resourceModal.data.samplePdfUrl || "",
                    isSample: Boolean(resourceModal.data.isSample),
                    status: resourceModal.data.status || "Published",
                    order: Number(resourceModal.data.order) || 1,
                    pages: resourceModal.data.pages || "20 Pages",
                    cloudinaryPublicId: resourceModal.data.cloudinaryPublicId || "",
                  };

                  const next = isAdd ? [...resources, payload] : resources.map((r) => (r.id === payload.id ? payload : r));
                  setResources(next);
                  localStorage.setItem("lawkaksha_admin_resources", JSON.stringify(next));
                  setResourceModal({ open: false, mode: "add", data: {} });
                  showToast("Saving resource to MongoDB Atlas...");
                  try {
                    await fetch(`${API_URL}/api/admin/resources${!isAdd ? "/" + payload.id : ""}`, {
                      method: isAdd ? "POST" : "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    showToast("Resource saved in MongoDB Atlas!");
                  } catch (e) {
                    showToast("Saved locally (offline mode)");
                  }
                }}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm"
              >
                Save Resource
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBSCRIPTION ADD / EDIT MODAL */}
      {subModal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">
                {subModal.mode === "add" ? "Grant 30-Day Monthly Pass" : "Update Subscription Record"}
              </h3>
              <button onClick={() => setSubModal({ open: false, mode: "add", data: {} })} className="p-2 rounded-xl hover:bg-slate-100">
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
                    placeholder="e.g. Student Name"
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Roll / Student ID *</label>
                  <input
                    type="text"
                    value={subModal.data.studentRoll || ""}
                    onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, studentRoll: e.target.value } })}
                    placeholder="LRK-2026-004182"
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 font-mono text-xs"
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
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={subModal.data.phone || ""}
                    onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, phone: e.target.value } })}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Enrolled Course / Monthly Pass *</label>
                <select
                  value={subModal.data.item || "CA Foundation Business Laws (Monthly Access)"}
                  onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, item: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 bg-white text-xs"
                >
                  <option value="CA Foundation Business Laws (Monthly Access)">CA Foundation Business Laws (Monthly Access - ₹99)</option>
                  <option value="CSEET Business Law & Management (Monthly Access)">CSEET Business Law &amp; Management (Monthly Access - ₹99)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fee Amount (₹)</label>
                  <input
                    type="text"
                    value={subModal.data.amount || "₹99"}
                    onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, amount: e.target.value } })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={subModal.data.paymentMode || "UPI / Razorpay"}
                    onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, paymentMode: e.target.value } })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 bg-white text-xs"
                  >
                    <option value="UPI / Razorpay">UPI / Razorpay</option>
                    <option value="Razorpay / Cards">Razorpay / Cards</option>
                    <option value="Admin Direct Grant (Free)">Admin Direct Grant (Free)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSubModal({ open: false, mode: "add", data: {} })}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
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
                    item: subModal.data.item || "CA Foundation Business Laws (Monthly Access)",
                    targetExam: subModal.data.targetExam || "CA Foundation Paper 2",
                    amount: subModal.data.amount || "₹99",
                    date: subModal.data.date || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
                    paymentMode: subModal.data.paymentMode || "UPI / Razorpay",
                    accessStatus: subModal.data.accessStatus || "Active",
                    daysRemaining: 30,
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
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm"
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
              <button onClick={() => setProductModal({ open: false, mode: "add", data: {} })} className="p-2 rounded-xl hover:bg-slate-100">
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
                  placeholder="e.g. CA Foundation Business Laws Codex"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subtitle / Details *</label>
                <input
                  type="text"
                  value={productModal.data.subtitle || ""}
                  onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, subtitle: e.target.value } })}
                  placeholder="e.g. Complete 7 Chapters Study Notes"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Access Price (₹) *</label>
                  <input
                    type="number"
                    value={productModal.data.price || 99}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, price: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={productModal.data.originalPrice || 299}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, originalPrice: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">In-Web Digital PDF URL / Cloudinary CDN</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={productModal.data.pdfUrl || ""}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, pdfUrl: e.target.value } })}
                    placeholder="/notes/unit-1-general-nature-of-partnership.pdf"
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-xs font-mono"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, (url) => {
                          setProductModal((prev) => ({
                            ...prev,
                            data: { ...prev.data, pdfUrl: url },
                          }));
                        });
                      }
                    }}
                  />
                  <button
                    type="button"
                    disabled={isUploadingFile}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload PDF</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setProductModal({ open: false, mode: "add", data: {} })}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
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
                    category: productModal.data.category || "CA Foundation",
                    format: "Digital Codex (In-Web DRM)",
                    price: Number(productModal.data.price) || 99,
                    originalPrice: Number(productModal.data.originalPrice) || 299,
                    pages: productModal.data.pages || "250 Pages",
                    status: productModal.data.status || "Active",
                    pdfUrl: productModal.data.pdfUrl || "/notes/unit-1-general-nature-of-partnership.pdf",
                    description: productModal.data.description || "",
                    units: productModal.data.units || ["Chapter 1", "Chapter 2"],
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
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm"
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
              <button onClick={() => setStudentModal({ open: false, mode: "add", data: {} })} className="p-2 rounded-xl hover:bg-slate-100">
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
                  placeholder="e.g. Student Name"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student / Roll Number *</label>
                <input
                  type="text"
                  value={studentModal.data.student_id || ""}
                  onChange={(e) => setStudentModal({ ...studentModal, data: { ...studentModal.data, student_id: e.target.value } })}
                  placeholder="LRK-2026-001234"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={studentModal.data.email || ""}
                  onChange={(e) => setStudentModal({ ...studentModal, data: { ...studentModal.data, email: e.target.value } })}
                  placeholder="student@thelawkaksha.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Exam</label>
                <select
                  value={studentModal.data.target_exam || "CA Foundation Paper 2"}
                  onChange={(e) => setStudentModal({ ...studentModal, data: { ...studentModal.data, target_exam: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-500 bg-white text-xs"
                >
                  <option value="CA Foundation Paper 2">CA Foundation Paper 2 (Business Laws)</option>
                  <option value="CSEET Law & Management">CSEET Paper 2 (Business Law &amp; Management)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setStudentModal({ open: false, mode: "add", data: {} })}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
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
                    email: studentModal.data.email || "student@thelawkaksha.com",
                    phone: studentModal.data.phone || "+91 98000 00000",
                    target_exam: studentModal.data.target_exam || "CA Foundation Paper 2",
                    is_active: studentModal.data.is_active !== undefined ? studentModal.data.is_active : true,
                    drm_access: studentModal.data.drm_access !== undefined ? studentModal.data.drm_access : true,
                    enrolled_books: studentModal.data.enrolled_books || ["CA Foundation Business Laws"],
                    joined_date: studentModal.data.joined_date || "Today",
                  };
                  const next = isAdd ? [...students, payload] : students.map((s) => (s.id === payload.id ? payload : s));
                  setStudents(next);
                  localStorage.setItem("lawkaksha_admin_students", JSON.stringify(next));
                  setStudentModal({ open: false, mode: "add", data: {} });
                  try {
                    await fetch(`${API_URL}/api/admin/students${!isAdd ? "/" + payload.id : ""}`, {
                      method: isAdd ? "POST" : "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    showToast("Student saved in Atlas!");
                  } catch (e) {}
                }}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm"
              >
                Save Student
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
