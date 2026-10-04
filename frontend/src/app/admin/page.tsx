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
  Eye,
  AlertTriangle,
  Download,
  MessageCircle,
  Megaphone,
  Send,
  Share2,
  ArrowRight,
} from "lucide-react";
import { SecurePdfReader } from "@/components/SecurePdfReader";
import { type PromoPassCard, type PromoBannersSetting, DEFAULT_PROMO_BANNERS } from "@/types/promo";

export interface AnnouncementSetting {
  enabled: boolean;
  text: string;
  badge: string;
  link?: string;
  target?: "all" | "students" | "homepage";
}


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
  previewPagesLimit?: number;
  samplePagesRange?: string;
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
  previewPagesLimit?: number;
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
    pdfUrl: "/notes/sale-of-goods-unit-1.pdf",
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
    id: "res-ca-soga-1",
    course: "ca-foundation",
    actName: "The Sale of Goods Act, 1930",
    chapterNumber: 3,
    type: "notes",
    title: "Unit 1: Formation of Contract of Sale & Subject Matter",
    description: "Sale vs Agreement to Sell, Ascertained vs Unascertained Goods, Formalities & Statutory Rules.",
    pdfUrl: "/notes/sale-of-goods-unit-1.pdf",
    samplePdfUrl: "/notes/sale-of-goods-unit-1.pdf",
    isSample: true,
    status: "Published",
    order: 1,
    pages: "12 Pages (Free Sample PDF)",
  },
  {
    id: "res-ca-3",
    course: "ca-foundation",
    actName: "The Sale of Goods Act, 1930",
    chapterNumber: 3,
    type: "notes",
    title: "Unit 2: Conditions and Warranties (Sec 11-17)",
    description: "Implied conditions of fitness, Priest v. Last, Grant v. Australian Knitting Mills & Caveat Emptor.",
    pdfUrl: "/notes/sale-of-goods-unit-2.pdf",
    samplePdfUrl: "/notes/sale-of-goods-unit-2.pdf",
    isSample: true,
    status: "Published",
    order: 2,
    pages: "10 Pages (Free Sample PDF)",
  },
  {
    id: "res-ca-1",
    course: "ca-foundation",
    actName: "Indian Regulatory Framework",
    chapterNumber: 1,
    type: "notes",
    title: "Overview of Indian Legal System & Hierarchy of Courts",
    description: "Structure of Legislative, Executive & Judiciary in India with constitutional jurisdiction.",
    pdfUrl: "/notes/sale-of-goods-unit-1.pdf",
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
    pdfUrl: "/notes/sale-of-goods-unit-1.pdf",
    isSample: false,
    status: "Published",
    order: 1,
    pages: "34 Pages",
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
    pdfUrl: "/notes/unit-2-relations-of-partners.pdf",
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
    pdfUrl: "/notes/sale-of-goods-unit-2.pdf",
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
    pdfUrl: "/notes/unit-3-registration-and-dissolution-of-firm.pdf",
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

const INITIAL_MCQ_TESTS: GoogleFormTestItem[] = [
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
    instructions: "Strict 30-minute timed evaluation. 0.25 negative marking applies for incorrect attempts under ICAI guidelines.",
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
    instructions: "High-yield Section 16 implied condition exceptions and unpaid seller rights.",
  },
  {
    id: "gtest-3",
    title: "CSEET Paper 2 Master Mock Drill — 8 Units",
    course: "cs",
    subject: "Business Law & General Management",
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLScD9L8n4n5v7x9m2/viewform",
    questionCount: 40,
    duration: 40,
    totalMarks: 50,
    status: "Active",
    instructions: "Full 8-unit simulation for CSEET legal aptitude & business management paper.",
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

  type TabType = "overview" | "promo_banners" | "subscriptions" | "books_and_notes" | "students" | "cases" | "mcq" | "coupons" | "qotd";
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [materialSubTab, setMaterialSubTab] = useState<"all" | "books" | "notes">("all");
  const [subFilterTab, setSubFilterTab] = useState<"all" | "active" | "expiring_soon" | "revoked">("all");

  // Announcement Banner state
  const [announcement, setAnnouncement] = useState<AnnouncementSetting>({
    enabled: true,
    text: "⚡ Special CA Foundation & CSEET Study Passes available at introductory ₹99/month!",
    badge: "OFFER",
    link: "/courses",
    target: "all",
  });
  const [isSavingAnnouncement, setIsSavingAnnouncement] = useState<boolean>(false);

  // Student Dashboard Promo Codex Passes state
  const [promoBanners, setPromoBanners] = useState<PromoBannersSetting>(DEFAULT_PROMO_BANNERS);
  const [isSavingPromo, setIsSavingPromo] = useState<boolean>(false);
  const [activePromoCardTab, setActivePromoCardTab] = useState<"ca" | "cs" | "combo">("ca");
  const [promoPreviewStream, setPromoPreviewStream] = useState<"ca" | "cs">("ca");

  // In-App PDF Preview Inspector Modal state
  const [previewPdfModal, setPreviewPdfModal] = useState<{
    open: boolean;
    title: string;
    pdfUrl: string;
    category?: string;
    actName?: string;
    pages?: string;
    isSample?: boolean;
  }>({ open: false, title: "", pdfUrl: "" });

  const [admin3dReader, setAdmin3dReader] = useState<{ open: boolean; title: string; pdfUrl: string }>({
    open: false,
    title: "",
    pdfUrl: "",
  });

  // Entities state
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [resources, setResources] = useState<ResourceItem[]>(INITIAL_RESOURCES);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("all");
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>(INITIAL_SUBSCRIPTIONS);
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [cases, setCases] = useState<CaseStudyItem[]>(INITIAL_CASES);
  const [mcqTests, setMcqTests] = useState<GoogleFormTestItem[]>(INITIAL_MCQ_TESTS);
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
  const [mcqModal, setMcqModal] = useState<{ open: boolean; mode: "add" | "edit"; data: Partial<GoogleFormTestItem> }>({ open: false, mode: "add", data: {} });
  const [previewFormModal, setPreviewFormModal] = useState<{ open: boolean; url: string; title: string }>({ open: false, url: "", title: "" });
  const [couponModal, setCouponModal] = useState<{ open: boolean; mode: "add" | "edit"; data: Partial<CouponRecord> }>({ open: false, mode: "add", data: {} });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const [isAtlasConnected, setIsAtlasConnected] = useState<boolean>(true);

  // Authenticated Admin API Fetch Helper with Bearer Token Injection
  const adminFetch = (endpoint: string, init?: RequestInit) => {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage.getItem("lawkaksha_token") || "";
      if (!token) {
        try {
          const sess = JSON.parse(localStorage.getItem("lawkaksha_admin_session") || "{}");
          token = sess.token || "";
        } catch (e) {}
      }
    }
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    if (init?.headers) {
      if (init.headers instanceof Headers) {
        init.headers.forEach((val, key) => {
          headers[key] = val;
        });
      } else if (Array.isArray(init.headers)) {
        init.headers.forEach(([key, val]) => {
          headers[key] = val;
        });
      } else {
        Object.assign(headers, init.headers);
      }
    }
    return fetch(`${API_URL}${endpoint}`, {
      ...init,
      headers,
    });
  };

  // Load initial cache and sync with MongoDB Atlas
  useEffect(() => {
    if (typeof window !== "undefined") {
      const adminSessionStr = localStorage.getItem("lawkaksha_admin_session");
      let isValidAdmin = false;
      if (adminSessionStr) {
        try {
          const parsed = JSON.parse(adminSessionStr);
          if (parsed && parsed.role === "admin") {
            isValidAdmin = true;
          }
        } catch (e) {}
      }

      if (!isValidAdmin) {
        setIsAuthorized(false);
        setIsCheckingAuth(false);
        router.push("/login?redirect=/admin");
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
        if (m) setMcqTests(JSON.parse(m));
        const cp = localStorage.getItem("lawkaksha_admin_coupons");
        if (cp) setCoupons(JSON.parse(cp));
        const ann = localStorage.getItem("lawkaksha_admin_announcement");
        if (ann) setAnnouncement(JSON.parse(ann));
        const pb = localStorage.getItem("lawkaksha_admin_promo_banners");
        if (pb) setPromoBanners(JSON.parse(pb));
      } catch (e) {}

      // 2. Live fetch from MongoDB Atlas
      const syncWithAtlas = async () => {
        try {
          const [pRes, rRes, sRes, stdRes, cRes, mRes, cpRes, exRes, qRes, annRes, pbRes] = await Promise.allSettled([
            adminFetch(`/api/admin/products`).then((r) => r.json()),
            adminFetch(`/api/admin/resources`).then((r) => r.json()),
            adminFetch(`/api/admin/subscriptions`).then((r) => r.json()),
            adminFetch(`/api/admin/students`).then((r) => r.json()),
            adminFetch(`/api/admin/cases`).then((r) => r.json()),
            adminFetch(`/api/admin/mcq-tests`).then((r) => r.json()),
            adminFetch(`/api/admin/coupons`).then((r) => r.json()),
            adminFetch(`/api/admin/exam-settings`).then((r) => r.json()),
            adminFetch(`/api/admin/qotd`).then((r) => r.json()),
            adminFetch(`/api/admin/announcement`).then((r) => r.json()),
            adminFetch(`/api/admin/promo-banners`).then((r) => r.json()),
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
          if (mRes.status === "fulfilled" && mRes.value?.tests?.length) {
            setMcqTests(mRes.value.tests);
            localStorage.setItem("lawkaksha_admin_mcqs", JSON.stringify(mRes.value.tests));
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
          if (annRes.status === "fulfilled" && annRes.value?.announcement) {
            setAnnouncement(annRes.value.announcement);
            localStorage.setItem("lawkaksha_admin_announcement", JSON.stringify(annRes.value.announcement));
          }
          if (pbRes.status === "fulfilled" && pbRes.value?.promoBanners) {
            setPromoBanners(pbRes.value.promoBanners);
            localStorage.setItem("lawkaksha_admin_promo_banners", JSON.stringify(pbRes.value.promoBanners));
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
      const res = await adminFetch(`/api/admin/upload`, {
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
  
  const expiringSoonCount = useMemo(() => {
    return subscriptions.filter(
      (s) => s.accessStatus === "Active" && s.daysRemaining !== undefined && s.daysRemaining <= 5
    ).length;
  }, [subscriptions]);

  // 1-Click CSV Export Utility (Hardened against CSV Formula / DDE Injection)
  const exportToCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const sanitizeCell = (cell: string | number) => {
      let str = String(cell ?? "");
      // Neutralize CSV / Excel formula injection (starts with =, +, -, @, tab, cr)
      if (/^[=+\-@\t\r]/.test(str)) {
        str = "'" + str;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        headers.map((h) => sanitizeCell(h)).join(","),
        ...rows.map((row) => row.map((cell) => sanitizeCell(cell)).join(",")),
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded ${filename}.csv`);
  };

  const handleExportSubscriptions = () => {
    const headers = ["ID", "Date", "Student Name", "Roll Number", "Email", "Phone", "Course Item", "Target Exam", "Amount", "Payment Mode", "Days Remaining", "Status"];
    const rows = subscriptions.map((s) => [
      s.id,
      s.date,
      s.studentName,
      s.studentRoll,
      s.email,
      s.phone,
      s.item,
      s.targetExam,
      s.amount,
      s.paymentMode,
      s.daysRemaining ?? 30,
      s.accessStatus,
    ]);
    exportToCsv("thelawkaksha_subscriptions", headers, rows);
  };

  const handleExportStudents = () => {
    const headers = ["Student ID", "Name", "Email", "Phone", "Target Exam", "Joined Date", "DRM Access", "Active Status", "Enrolled Books"];
    const rows = students.map((s) => [
      s.student_id || s.id,
      s.name,
      s.email,
      s.phone,
      s.target_exam,
      s.joined_date,
      s.drm_access ? "Granted" : "Restricted",
      s.is_active ? "Active" : "Inactive",
      (s.enrolled_books || []).join(" | "),
    ]);
    exportToCsv("thelawkaksha_students", headers, rows);
  };

  // 1-Click WhatsApp Renewal Reminder Generator
  const getWhatsAppReminderUrl = (sub: SubscriptionRecord) => {
    const cleanPhone = (sub.phone || "").replace(/[^0-9]/g, "");
    const daysText = sub.daysRemaining !== undefined ? `${sub.daysRemaining} days` : "soon";
    const message = `Hello ${sub.studentName}! 👋\n\nYour 30-Day Study Pass for *${sub.item}* at *The Law Kaksha* is expiring in ${daysText}.\n\nRenew your pass for ₹99 now to keep your DRM in-web notes, PYQs, and cases active:\n👉 https://thelawkaksha.com/checkout?renew=true&student=${encodeURIComponent(sub.studentRoll || sub.studentName)}\n\nBest regards,\nThe Law Kaksha Academic Team`;
    return `https://wa.me/${cleanPhone.length >= 10 ? (cleanPhone.startsWith("91") ? cleanPhone : "91" + cleanPhone) : ""}?text=${encodeURIComponent(message)}`;
  };

  // Broadcast Announcement Save Handler
  const handleSaveAnnouncement = async () => {
    setIsSavingAnnouncement(true);
    try {
      localStorage.setItem("lawkaksha_admin_announcement", JSON.stringify(announcement));
      await adminFetch(`/api/admin/announcement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ announcement }),
      });
      showToast("Live broadcast announcement updated!");
    } catch (e) {
      showToast("Saved to local cache.");
    } finally {
      setIsSavingAnnouncement(false);
    }
  };

  // Student Dashboard Promo Codex Passes Save Handler
  const handleSavePromoBanners = async () => {
    setIsSavingPromo(true);
    try {
      localStorage.setItem("lawkaksha_admin_promo_banners", JSON.stringify(promoBanners));
      window.dispatchEvent(new CustomEvent("lawkaksha_promo_updated", { detail: promoBanners }));
      window.dispatchEvent(new Event("storage"));
      await adminFetch(`/api/admin/promo-banners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promoBanners }),
      });
      showToast("Student dashboard codex passes updated live!");
    } catch (e) {
      showToast("Saved to local cache.");
    } finally {
      setIsSavingPromo(false);
    }
  };

  if (isCheckingAuth || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-9 h-9 border-2 border-[#AED7E9] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-[#221D1D]">Verifying administrator authorization...</p>
      </div>
    );
  }

  const NAV_TABS = [
    { id: "overview" as TabType, label: "Overview", icon: LayoutDashboard },
    { id: "promo_banners" as TabType, label: "Codex Passes", icon: Megaphone },
    { id: "subscriptions" as TabType, label: "Subscriptions", icon: CreditCard, badge: subscriptions.length },
    { id: "books_and_notes" as TabType, label: "Books & Notes", icon: BookOpen, badge: products.length + resources.length },
    { id: "students" as TabType, label: "Students", icon: Users, badge: students.length },
    { id: "cases" as TabType, label: "Case Studies", icon: Flame },
    { id: "mcq" as TabType, label: "MCQ Tests", icon: Sparkles, badge: mcqTests.length },
    { id: "coupons" as TabType, label: "Coupons", icon: Percent },
    { id: "qotd" as TabType, label: "Exam Dates & QOTD", icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-full bg-[#221D1D] text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#4B8097]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* MOBILE SIDEBAR BACKDROP */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 1. SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 bg-white border-r border-[#E7E4E7] flex flex-col min-h-screen transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* LOGO & ADMIN BADGE */}
        <div className="px-4 pt-5 pb-4 border-b border-[#E7E4E7]">
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className="flex items-center shrink-0">
              <div className="relative h-8 w-28">
                <Image src="/assets/logo-transparent.png" alt="The Law Kaksha" fill className="object-contain object-left" priority />
              </div>
            </Link>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C4E1EC]/60 border border-[#AED7E9]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#221D1D]" />
              <span className="text-[11px] font-bold text-[#221D1D]">Admin</span>
            </div>
          </div>
        </div>

        {/* NAVIGATION ITEMS */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150 cursor-pointer text-left min-h-[44px] ${
                  isActive
                    ? "bg-[#AED7E9]/40 text-[#221D1D] font-bold border border-[#AED7E9] shadow-xs"
                    : "text-[#4D433F] hover:bg-[#F7F7F5] hover:text-[#221D1D]"
                }`}
              >
                <Icon className={`shrink-0 ${isActive ? "text-[#4B8097]" : "text-[#77716E]"}`} style={{ width: 17, height: 17 }} />
                <span className="truncate">{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? "bg-[#AED7E9] text-[#221D1D]" : "bg-[#F7F7F5] text-[#4D433F] border border-[#E7E4E7]"
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* BOTTOM ADMIN PROFILE */}
        <div className="p-3.5 border-t border-[#E7E4E7]">
          <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7]">
            <div className="w-8 h-8 rounded-full bg-[#AED7E9] text-[#221D1D] text-xs font-bold flex items-center justify-center shrink-0 shadow-xs border border-[#98C5D8]">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#221D1D] truncate">Academic Admin</p>
              <p className="text-[10px] text-[#77716E] leading-none mt-0.5">The Law Kaksha Hub</p>
            </div>
            <button
              onClick={handleLogout}
              title="Log Out"
              className="p-1.5 rounded-xl text-[#77716E] hover:text-[#C35F3B] hover:bg-[#F4C5C0]/30 transition-colors cursor-pointer"
            >
              <LogOut style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* STICKY TOP HEADER */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#E7E4E7] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white border border-[#E7E4E7] text-[#221D1D] hover:bg-[#F7F7F5] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-serif font-bold text-[#221D1D]">
                {NAV_TABS.find((t) => t.id === activeTab)?.label || "Admin Console"}
              </h1>
              <p className="text-[11px] text-[#77716E] leading-none mt-0.5">
                Cloudinary Storage, DRM Rights, Student Passes &amp; Act-Wise Resources
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
              isAtlasConnected
                ? "bg-[#AED7E9]/40 text-[#221D1D] border-[#AED7E9]"
                : "bg-[#F4C5C0]/30 text-[#C35F3B] border-[#F4C5C0]"
            }`}>
              <span className={`w-2 h-2 rounded-full ${isAtlasConnected ? "bg-[#4B8097] animate-pulse" : "bg-[#F7892A]"}`} />
              <span>{isAtlasConnected ? "MongoDB Atlas Active" : "Local Sync Active"}</span>
            </div>

            <Link
              href="/student"
              target="_blank"
              className="px-4 py-1.5 rounded-full bg-white border border-[#E7E4E7] text-xs font-semibold text-[#221D1D] hover:bg-[#F7F7F5] shadow-xs flex items-center gap-1.5 transition-all"
            >
              <span>Student View</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#77716E]" />
            </Link>
          </div>
        </header>

        {/* TAB WORKSPACES */}
        <div className="p-4 sm:p-6 space-y-6 max-w-6xl">

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* TOP HERO BANNER */}
              <div className="rounded-3xl bg-[#AED7E9] p-6 text-[#221D1D] border border-[#98C5D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#4D433F] bg-white/60 px-2.5 py-0.5 rounded-full border border-[#AED7E9]">Admin Operations Portal</span>
                  <h2 className="text-2xl font-serif font-bold text-[#221D1D] mt-1">Dashboard Overview</h2>
                  <p className="text-[#4D433F] text-xs sm:text-sm leading-relaxed max-w-lg">
                    Real-time overview of active student passes, DRM codices, daily case studies, and live revenue.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-center bg-white/80 backdrop-blur-xs rounded-2xl p-4 min-w-[100px] border border-[#E7E4E7]">
                    <TrendingUp className="w-5 h-5 text-[#221D1D] mx-auto mb-1" />
                    <p className="text-xl font-bold font-serif text-[#221D1D]">₹{totalRevenue.toLocaleString()}</p>
                    <p className="text-[10px] text-[#4D433F] uppercase tracking-wide font-semibold">Total Sales</p>
                  </div>
                  <div className="text-center bg-white/80 backdrop-blur-xs rounded-2xl p-4 min-w-[100px] border border-[#E7E4E7]">
                    <Key className="w-5 h-5 text-[#4B8097] mx-auto mb-1" />
                    <p className="text-xl font-bold font-serif text-[#221D1D]">{activeSubsCount}</p>
                    <p className="text-[10px] text-[#4D433F] uppercase tracking-wide font-semibold">Active Passes</p>
                  </div>
                </div>
              </div>

              {/* STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-3xl p-5 border border-[#E7E4E7] shadow-sm">
                  <div className="w-10 h-10 rounded-2xl bg-[#C4E1EC]/60 text-[#221D1D] flex items-center justify-center mb-3 border border-[#AED7E9]">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-[#77716E] font-medium">Books &amp; Notes</p>
                  <h3 className="text-xl font-bold font-serif text-[#221D1D] mt-0.5">{products.length + resources.length} Materials</h3>
                  <p className="text-[11px] text-[#4B8097] font-semibold mt-1">{products.length} Books • {resources.length} Notes</p>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-[#E7E4E7] shadow-sm">
                  <div className="w-10 h-10 rounded-2xl bg-[#BFAFE5]/40 text-[#221D1D] flex items-center justify-center mb-3 border border-[#BFAFE5]">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-[#77716E] font-medium">Subscriptions</p>
                  <h3 className="text-xl font-bold font-serif text-[#221D1D] mt-0.5">{subscriptions.length} Passes</h3>
                  <p className="text-[11px] text-[#221D1D] font-semibold mt-1">{activeSubsCount} Active Passes</p>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-[#E7E4E7] shadow-sm">
                  <div className="w-10 h-10 rounded-2xl bg-[#AED7E9]/40 text-[#221D1D] flex items-center justify-center mb-3 border border-[#AED7E9]">
                    <Users className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-[#77716E] font-medium">Students</p>
                  <h3 className="text-xl font-bold font-serif text-[#221D1D] mt-0.5">{students.length} Registered</h3>
                  <p className="text-[11px] text-[#4B8097] font-semibold mt-1">{activeStudentsCount} Active Access</p>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-[#E7E4E7] shadow-sm">
                  <div className="w-10 h-10 rounded-2xl bg-[#AED7E9]/40 text-[#221D1D] flex items-center justify-center mb-3 border border-[#AED7E9]">
                    <ShieldCheck className="w-5 h-5 text-[#4B8097]" />
                  </div>
                  <p className="text-xs text-[#77716E] font-medium">DRM Protection</p>
                  <h3 className="text-xl font-bold font-serif text-[#221D1D] mt-0.5">Active</h3>
                  <p className="text-[11px] text-[#4B8097] font-semibold mt-1">Secure Read Mode</p>
                </div>
              </div>

              {/* BROADCAST ANNOUNCEMENT BANNER MANAGER */}
              <div className="bg-white rounded-3xl p-6 border border-[#E7E4E7] shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E7E4E7]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#C4E1EC]/60 border border-[#AED7E9] flex items-center justify-center text-[#221D1D]">
                      <Megaphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#221D1D]">Live Broadcast Announcement Bar</h3>
                      <p className="text-[11px] text-[#77716E]">Display instant real-time alerts across the homepage and student portal.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#4D433F] select-none">
                      <span>Status:</span>
                      <button
                        type="button"
                        onClick={() => setAnnouncement((prev: AnnouncementSetting) => ({ ...prev, enabled: !prev.enabled }))}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          announcement.enabled
                            ? "bg-[#AED7E9]/40 text-[#221D1D] border border-[#AED7E9]"
                            : "bg-[#F7F7F5] text-[#77716E] border border-[#E7E4E7]"
                        }`}
                      >
                        {announcement.enabled ? "● Live / Active" : "○ Hidden / Disabled"}
                      </button>
                    </label>
                  </div>
                </div>

                {/* LIVE PREVIEW STRIP */}
                {announcement.enabled && (
                  <div className="p-3.5 rounded-2xl bg-[#AED7E9] text-[#221D1D] border border-[#98C5D8] flex items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/60 text-[#221D1D] border border-[#AED7E9] uppercase tracking-wider shrink-0">
                        {announcement.badge || "ANNOUNCEMENT"}
                      </span>
                      <p className="font-semibold truncate">{announcement.text || "No announcement text entered"}</p>
                    </div>
                    {announcement.link && (
                      <span className="text-[10px] font-bold underline shrink-0 flex items-center gap-1 opacity-90 text-[#221D1D]">
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                )}

                {/* EDIT FIELDS */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                  <div className="md:col-span-2">
                    <label className="block font-semibold text-[#221D1D] mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={announcement.badge}
                      onChange={(e) => setAnnouncement({ ...announcement, badge: e.target.value.toUpperCase() })}
                      placeholder="e.g. OFFER, LIVE, ALERT"
                      className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] text-xs font-bold outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 bg-[#F7F7F5] focus:bg-white uppercase text-[#221D1D]"
                    />
                  </div>
                  <div className="md:col-span-6">
                    <label className="block font-semibold text-[#221D1D] mb-1">Announcement Message *</label>
                    <input
                      type="text"
                      value={announcement.text}
                      onChange={(e) => setAnnouncement({ ...announcement, text: e.target.value })}
                      placeholder="e.g. CA Foundation Business Laws Marathon session this Sunday!"
                      className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] text-xs outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 bg-[#F7F7F5] focus:bg-white text-[#221D1D]"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block font-semibold text-[#221D1D] mb-1">Target Action Link (Optional)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={announcement.link || ""}
                        onChange={(e) => setAnnouncement({ ...announcement, link: e.target.value })}
                        placeholder="e.g. /courses or /student"
                        className="flex-1 p-2.5 rounded-2xl border border-[#E7E4E7] text-xs outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 bg-[#F7F7F5] focus:bg-white text-[#221D1D]"
                      />
                      <button
                        onClick={handleSaveAnnouncement}
                        disabled={isSavingAnnouncement}
                        className="px-4 py-2.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSavingAnnouncement ? "Saving..." : "Save"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* STUDENT DASHBOARD PROMO BANNERS QUICK SHORTCUT IN OVERVIEW */}
              <div className="bg-white rounded-3xl border border-[#E7E4E7] p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#F6EFFD] text-[#9333EA] flex items-center justify-center shrink-0 border border-[#D8B4FE]">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#221D1D]">Student Dashboard Codex Passes Banner</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${promoBanners.enabled ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#FEE2E2] text-[#991B1B]"}`}>
                        {promoBanners.enabled ? "Active on /student" : "Hidden"}
                      </span>
                    </div>
                    <p className="text-xs text-[#77716E] mt-0.5">
                      Card 1: <strong>{promoBanners.caCard.title} (₹{promoBanners.caCard.price})</strong> • Card 2: <strong>{promoBanners.comboCard.title} (₹{promoBanners.comboCard.price})</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("promo_banners")}
                  className="px-5 py-2.5 rounded-full bg-[#221D1D] hover:bg-[#383130] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#AED7E9]" />
                  <span>Configure Codex Passes</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: CODEX PROMO BANNERS / PASSES EDITOR                                  */}
          {/* ========================================================================= */}
          {activeTab === "promo_banners" && (
            <div className="space-y-6 animate-in fade-in">
              {/* TOP HEADER & CONTROLS */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E4E7]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#AED7E9]/40 text-[#221D1D] border border-[#AED7E9]">
                      Student Dashboard Banners
                    </span>
                    <span className="text-xs text-[#77716E]">Live Synced with /student</span>
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#221D1D] mt-1 flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-[#9333EA]" />
                    <span>Codex Promo Passes Editor</span>
                  </h2>
                  <p className="text-xs text-[#77716E] mt-0.5">
                    Customize the 2 main promo cards shown to students when they open their dashboard. Edit prices, badges, titles, descriptions, and buttons.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    onClick={() => {
                      if (confirm("Reset promo passes to default Law Kaksha settings?")) {
                        setPromoBanners(DEFAULT_PROMO_BANNERS);
                        showToast("Reset to default Law Kaksha passes.");
                      }
                    }}
                    className="px-4 py-2 rounded-full bg-white border border-[#E7E4E7] hover:bg-[#F7F7F5] text-[#77716E] hover:text-[#221D1D] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    Reset Defaults
                  </button>

                  <button
                    onClick={handleSavePromoBanners}
                    disabled={isSavingPromo}
                    className="px-5 py-2 rounded-full bg-[#9333EA] hover:bg-[#7E22CE] text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSavingPromo ? "Saving Passes..." : "Save All Changes"}</span>
                  </button>
                </div>
              </div>

              {/* MASTER SECTION TOGGLE & SECTION TITLE */}
              <div className="bg-white rounded-3xl border border-[#E7E4E7] p-5 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPromoBanners({ ...promoBanners, enabled: !promoBanners.enabled })}
                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        promoBanners.enabled ? "bg-[#10B981] justify-end" : "bg-[#D1D5DB] justify-start"
                      }`}
                    >
                      <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                    </button>
                    <div>
                      <h4 className="text-xs font-bold text-[#221D1D]">
                        Show Codex Passes Section on Student Dashboard
                      </h4>
                      <p className="text-[11px] text-[#77716E]">
                        {promoBanners.enabled ? "Section is currently LIVE and visible to students" : "Section is HIDDEN from student dashboard"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-[#221D1D] shrink-0">Section Header:</label>
                    <input
                      type="text"
                      value={promoBanners.sectionTitle}
                      onChange={(e) => setPromoBanners({ ...promoBanners, sectionTitle: e.target.value })}
                      placeholder="e.g. LAW KAKSHA CODEX PASSES"
                      className="px-3 py-1.5 rounded-xl border border-[#E7E4E7] text-xs font-bold uppercase tracking-wider text-[#9333EA] bg-[#F7F7F5] focus:bg-white outline-none focus:border-[#9333EA] w-56 sm:w-64"
                    />
                  </div>
                </div>
              </div>

              {/* CARD SELECTOR SUB-TABS */}
              <div className="flex items-center gap-2 border-b border-[#E7E4E7] pb-1 overflow-x-auto">
                <button
                  onClick={() => setActivePromoCardTab("ca")}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activePromoCardTab === "ca"
                      ? "bg-[#F6EFFD] text-[#581C87] border border-[#D8B4FE] shadow-2xs"
                      : "text-[#77716E] hover:text-[#221D1D] hover:bg-white"
                  }`}
                >
                  <span>📖 Card 1: CA Foundation Stream (Left)</span>
                  <span className="text-[10px] bg-[#EDE9FE] px-2 py-0.5 rounded-full text-[#7E22CE]">₹{promoBanners.caCard.price}</span>
                </button>

                <button
                  onClick={() => setActivePromoCardTab("cs")}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activePromoCardTab === "cs"
                      ? "bg-[#F6EFFD] text-[#581C87] border border-[#D8B4FE] shadow-2xs"
                      : "text-[#77716E] hover:text-[#221D1D] hover:bg-white"
                  }`}
                >
                  <span>🎯 Card 2: CSEET Stream (Alternate Left)</span>
                  <span className="text-[10px] bg-[#EDE9FE] px-2 py-0.5 rounded-full text-[#7E22CE]">₹{promoBanners.csCard.price}</span>
                </button>

                <button
                  onClick={() => setActivePromoCardTab("combo")}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activePromoCardTab === "combo"
                      ? "bg-[#581C87] text-white border border-[#581C87] shadow-2xs"
                      : "text-[#77716E] hover:text-[#221D1D] hover:bg-white"
                  }`}
                >
                  <span>👑 Card 3: All-Access Dual Pass (Right)</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-[#FDE68A]">₹{promoBanners.comboCard.price}</span>
                </button>
              </div>

              {/* CARD EDITING FORM */}
              {(() => {
                const currentCardKey = activePromoCardTab === "ca" ? "caCard" : activePromoCardTab === "cs" ? "csCard" : "comboCard";
                const card = promoBanners[currentCardKey];

                const updateCardField = (field: keyof PromoPassCard, val: any) => {
                  setPromoBanners({
                    ...promoBanners,
                    [currentCardKey]: {
                      ...card,
                      [field]: val,
                    },
                  });
                };

                return (
                  <div className="bg-white rounded-3xl border border-[#E7E4E7] p-5 sm:p-6 shadow-2xs space-y-5">
                    <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-[#221D1D] flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-[#9333EA]" />
                          <span>
                            Editing: {activePromoCardTab === "ca" ? "CA Foundation Pass" : activePromoCardTab === "cs" ? "CSEET Pass" : "All-Access Dual Combo Pass"}
                          </span>
                        </h3>
                        <p className="text-[11px] text-[#77716E]">
                          Update headings, pricing, discount badges, and tags for this card.
                        </p>
                      </div>

                      <span className="text-xs font-bold text-[#9333EA] bg-[#F6EFFD] px-3 py-1 rounded-full border border-[#D8B4FE]">
                        Theme: {card.theme === "lavender" ? "Soft Lavender Card" : "Royal Purple Card"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      {/* Course Title */}
                      <div className="space-y-1">
                        <label className="font-bold text-[#221D1D]">Main Title *</label>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => updateCardField("title", e.target.value)}
                          placeholder="e.g. CA Foundation Business Laws"
                          className="w-full p-2.5 rounded-xl border border-[#E7E4E7] text-xs font-semibold outline-none focus:border-[#9333EA] bg-[#F7F7F5] focus:bg-white text-[#221D1D]"
                        />
                      </div>

                      {/* Subtitle / Codex Highlight */}
                      <div className="space-y-1">
                        <label className="font-bold text-[#221D1D]">Subtitle / Highlight *</label>
                        <input
                          type="text"
                          value={card.subtitle}
                          onChange={(e) => updateCardField("subtitle", e.target.value)}
                          placeholder="e.g. Complete Codex Notes"
                          className="w-full p-2.5 rounded-xl border border-[#E7E4E7] text-xs font-semibold outline-none focus:border-[#9333EA] bg-[#F7F7F5] focus:bg-white text-[#221D1D]"
                        />
                      </div>

                      {/* Stream Badge */}
                      <div className="space-y-1">
                        <label className="font-bold text-[#221D1D]">Stream / Category Badge *</label>
                        <input
                          type="text"
                          value={card.streamBadge}
                          onChange={(e) => updateCardField("streamBadge", e.target.value)}
                          placeholder="e.g. Paper 2 • 7 Chapters"
                          className="w-full p-2.5 rounded-xl border border-[#E7E4E7] text-xs font-semibold outline-none focus:border-[#9333EA] bg-[#F7F7F5] focus:bg-white text-[#221D1D]"
                        />
                      </div>

                      {/* Discount Badge */}
                      <div className="space-y-1">
                        <label className="font-bold text-[#221D1D]">Top Discount Ribbon *</label>
                        <input
                          type="text"
                          value={card.discountBadge}
                          onChange={(e) => updateCardField("discountBadge", e.target.value)}
                          placeholder="e.g. 67% OFF"
                          className="w-full p-2.5 rounded-xl border border-[#E7E4E7] text-xs font-bold uppercase outline-none focus:border-[#9333EA] bg-[#F7F7F5] focus:bg-white text-[#221D1D]"
                        />
                      </div>

                      {/* Selling Price */}
                      <div className="space-y-1">
                        <label className="font-bold text-[#221D1D]">Selling Price (₹) *</label>
                        <input
                          type="number"
                          value={card.price}
                          onChange={(e) => updateCardField("price", parseInt(e.target.value) || 0)}
                          placeholder="99"
                          className="w-full p-2.5 rounded-xl border border-[#E7E4E7] text-xs font-bold outline-none focus:border-[#9333EA] bg-[#F7F7F5] focus:bg-white text-[#221D1D]"
                        />
                      </div>

                      {/* Original Strikethrough Price */}
                      <div className="space-y-1">
                        <label className="font-bold text-[#221D1D]">Original Price (₹) *</label>
                        <input
                          type="number"
                          value={card.originalPrice}
                          onChange={(e) => updateCardField("originalPrice", parseInt(e.target.value) || 0)}
                          placeholder="299"
                          className="w-full p-2.5 rounded-xl border border-[#E7E4E7] text-xs font-semibold outline-none focus:border-[#9333EA] bg-[#F7F7F5] focus:bg-white text-[#221D1D]"
                        />
                      </div>

                      {/* Save Pill Text */}
                      <div className="space-y-1">
                        <label className="font-bold text-[#221D1D]">Savings Pill Text *</label>
                        <input
                          type="text"
                          value={card.saveText}
                          onChange={(e) => updateCardField("saveText", e.target.value)}
                          placeholder="e.g. Save ₹200"
                          className="w-full p-2.5 rounded-xl border border-[#E7E4E7] text-xs font-semibold outline-none focus:border-[#9333EA] bg-[#F7F7F5] focus:bg-white text-[#221D1D]"
                        />
                      </div>

                      {/* Button Label */}
                      <div className="space-y-1">
                        <label className="font-bold text-[#221D1D]">Button Label *</label>
                        <input
                          type="text"
                          value={card.buttonText}
                          onChange={(e) => updateCardField("buttonText", e.target.value)}
                          placeholder="e.g. Explore CA Notes"
                          className="w-full p-2.5 rounded-xl border border-[#E7E4E7] text-xs font-semibold outline-none focus:border-[#9333EA] bg-[#F7F7F5] focus:bg-white text-[#221D1D]"
                        />
                      </div>

                      {/* Action Type */}
                      <div className="space-y-1">
                        <label className="font-bold text-[#221D1D]">Click Action *</label>
                        <select
                          value={card.actionType}
                          onChange={(e) => updateCardField("actionType", e.target.value as any)}
                          className="w-full p-2.5 rounded-xl border border-[#E7E4E7] text-xs font-semibold outline-none focus:border-[#9333EA] bg-[#F7F7F5] focus:bg-white text-[#221D1D] cursor-pointer"
                        >
                          <option value="ca">Open CA Foundation Notes (ca)</option>
                          <option value="cs">Open CSEET Notes (cs)</option>
                          <option value="all-access">Add All-Access to Cart (all-access)</option>
                          <option value="custom">Custom External Link</option>
                        </select>
                      </div>

                      {/* Feature Tags (Comma Separated) */}
                      <div className="space-y-1 md:col-span-2 lg:col-span-3">
                        <label className="font-bold text-[#221D1D]">
                          Feature Tags (Comma-Separated) *
                        </label>
                        <input
                          type="text"
                          value={(card.features || []).join(", ")}
                          onChange={(e) => {
                            const tags = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                            updateCardField("features", tags);
                          }}
                          placeholder="e.g. 📖 7 Chapters, ⚖️ Solved Cases, ⚡ LDR Notes"
                          className="w-full p-2.5 rounded-xl border border-[#E7E4E7] text-xs font-semibold outline-none focus:border-[#9333EA] bg-[#F7F7F5] focus:bg-white text-[#221D1D]"
                        />
                        <p className="text-[10px] text-[#77716E]">
                          Separate each tag with a comma. You can use emojis (e.g. 📖, ⚖️, ⚡, 🎯).
                        </p>
                      </div>

                      {/* Description */}
                      <div className="space-y-1 md:col-span-2 lg:col-span-3">
                        <label className="font-bold text-[#221D1D]">Course Description *</label>
                        <textarea
                          rows={2}
                          value={card.description}
                          onChange={(e) => updateCardField("description", e.target.value)}
                          placeholder="e.g. All 7 Chapters in simple English, 3 weekly solved cases & 1.5-day LDR flowcharts"
                          className="w-full p-2.5 rounded-xl border border-[#E7E4E7] text-xs outline-none focus:border-[#9333EA] bg-[#F7F7F5] focus:bg-white text-[#221D1D]"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleSavePromoBanners}
                        disabled={isSavingPromo}
                        className="px-6 py-2.5 rounded-full bg-[#9333EA] hover:bg-[#7E22CE] text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSavingPromo ? "Saving Passes..." : "Save Passes Live"}</span>
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* LIVE 1:1 PREVIEW OF STUDENT DASHBOARD CODEX PASSES */}
              <div className="bg-[#F7F7F5] rounded-3xl border border-[#E7E4E7] p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E4E7] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#221D1D] flex items-center gap-2">
                      <Eye className="w-4 h-4 text-[#9333EA]" />
                      <span>Live 1:1 Student Dashboard Preview</span>
                    </h3>
                    <p className="text-[11px] text-[#77716E]">
                      This is exactly how students will see the passes on their main panel.
                    </p>
                  </div>

                  {/* Preview Switcher */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#77716E]">Simulate Student Stream:</span>
                    <div className="inline-flex p-0.5 rounded-xl bg-white border border-[#E7E4E7] text-xs font-bold shadow-2xs">
                      <button
                        onClick={() => setPromoPreviewStream("ca")}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          promoPreviewStream === "ca" ? "bg-[#9333EA] text-white shadow-xs" : "text-[#77716E]"
                        }`}
                      >
                        CA Foundation
                      </button>
                      <button
                        onClick={() => setPromoPreviewStream("cs")}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          promoPreviewStream === "cs" ? "bg-[#9333EA] text-white shadow-xs" : "text-[#77716E]"
                        }`}
                      >
                        CSEET
                      </button>
                    </div>
                  </div>
                </div>

                {/* 1:1 Student Cards Render */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6B21A8] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#9333EA]" />
                      <span>{promoBanners.sectionTitle || "LAW KAKSHA CODEX PASSES"}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Card Preview */}
                    {(() => {
                      const leftCard = promoPreviewStream === "ca" ? promoBanners.caCard : promoBanners.csCard;
                      return (
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#F6EFFD] via-[#F3E8FC] to-[#ECE0F8] border border-[#E9DDF5] p-5 sm:p-6 shadow-2xs flex flex-col justify-between min-h-[190px]">
                          <div className="absolute top-0 right-6 bg-[#4A0E4E] text-[#FDE68A] text-[10px] font-extrabold uppercase px-3 py-1 rounded-b-lg shadow-xs tracking-wider">
                            {leftCard.discountBadge}
                          </div>

                          <div className="space-y-1.5 pr-10">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7E22CE] bg-[#EDE9FE] px-2 py-0.5 rounded-md inline-block">
                              {leftCard.streamBadge}
                            </span>

                            <h4 className="text-base sm:text-lg font-black text-[#581C87] leading-snug">
                              {leftCard.title} <br />
                              <span className="text-[#9333EA]">{leftCard.subtitle}</span>
                            </h4>

                            <div className="flex items-baseline gap-2 pt-0.5">
                              <span className="text-sm sm:text-base font-black text-[#221D1D]">
                                Price : ₹{leftCard.price}
                              </span>
                              <span className="text-xs text-[#77716E] line-through font-mono">
                                ₹{leftCard.originalPrice}
                              </span>
                              <span className="text-[10px] font-bold text-[#059669] bg-[#D1FAE5] px-2 py-0.5 rounded-full">
                                {leftCard.saveText}
                              </span>
                            </div>

                            <p className="text-[11px] text-[#4B5563] font-medium leading-tight">
                              {leftCard.description}
                            </p>

                            <div className="flex items-center gap-1.5 pt-1 flex-wrap text-[10px] font-bold text-[#581C87]">
                              {(leftCard.features || []).map((f: string, i: number) => (
                                <span key={i} className="bg-white/80 px-2 py-0.5 rounded-md border border-[#E9DDF5]">
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-3">
                            <span className="px-5 py-2 rounded-full bg-white text-[#581C87] text-xs font-black border border-[#D8B4FE] shadow-2xs inline-flex items-center gap-1.5">
                              <span>{leftCard.buttonText}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-[#581C87]" />
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Right Card Preview */}
                    {(() => {
                      const rightCard = promoBanners.comboCard;
                      return (
                        <div
                          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3B0764] via-[#581C87] to-[#7E22CE] text-white p-5 sm:p-6 shadow-xs flex flex-col justify-between min-h-[190px] border border-[#9333EA]/30"
                          style={{ color: "#FFFFFF" }}
                        >
                          <div className="absolute top-0 right-6 bg-[#F59E0B] text-[#78350F] text-[10px] font-extrabold uppercase px-3 py-1 rounded-b-lg shadow-xs tracking-wider">
                            {rightCard.discountBadge}
                          </div>

                          <div className="space-y-1.5 pr-10">
                            <span
                              className="text-[10px] font-extrabold uppercase tracking-wider text-[#FDE68A] bg-white/15 px-2.5 py-0.5 rounded-md border border-white/20 inline-block"
                              style={{ color: "#FDE68A" }}
                            >
                              {rightCard.streamBadge}
                            </span>

                            <h4
                              className="text-base sm:text-lg font-black leading-snug text-white"
                              style={{ color: "#FFFFFF" }}
                            >
                              {rightCard.title} <br />
                              <span className="text-[#FDE68A]" style={{ color: "#FDE68A" }}>
                                {rightCard.subtitle}
                              </span>
                            </h4>

                            <div className="flex items-baseline gap-2 pt-0.5">
                              <span className="text-sm sm:text-base font-black text-white" style={{ color: "#FFFFFF" }}>
                                Price : ₹{rightCard.price}
                              </span>
                              <span className="text-xs text-white/60 line-through font-mono" style={{ color: "rgba(255,255,255,0.6)" }}>
                                ₹{rightCard.originalPrice}
                              </span>
                              <span className="text-[10px] font-bold text-[#FDE68A] bg-white/15 px-2 py-0.5 rounded-full border border-white/20" style={{ color: "#FDE68A" }}>
                                {rightCard.saveText}
                              </span>
                            </div>

                            <p className="text-[11px] text-white/90 font-medium leading-tight" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                              {rightCard.description}
                            </p>

                            <div className="flex items-center gap-1.5 pt-1 flex-wrap text-[10px] font-bold">
                              {(rightCard.features || []).map((f: string, i: number) => (
                                <span
                                  key={i}
                                  className="bg-white/15 px-2 py-0.5 rounded-md border border-white/20 text-white"
                                  style={{ color: "#FFFFFF" }}
                                >
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-3">
                            <span className="px-5 py-2 rounded-full bg-white text-[#581C87] text-xs font-black shadow-md inline-flex items-center gap-1.5">
                              <span>{rightCard.buttonText}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-[#581C87]" />
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUBSCRIPTIONS */}
          {activeTab === "subscriptions" && (
            <div className="space-y-6">
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#221D1D]">Subscriptions &amp; Student Passes</h2>
                  <p className="text-xs text-[#4D433F] mt-0.5">Manage 30-day monthly passes, renewals, and WhatsApp reminder triggers.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportSubscriptions}
                    className="px-4 py-2 rounded-full bg-white border border-[#E7E4E7] hover:bg-[#F7F7F5] text-[#221D1D] text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    title="Export all subscriptions as CSV file"
                  >
                    <Download className="w-3.5 h-3.5 text-[#77716E]" />
                    <span>Export CSV</span>
                  </button>
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
                    className="px-4 py-2 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Subscription</span>
                  </button>
                </div>
              </div>

              {/* EXPIRING SOON ALERT BANNER */}
              {expiringSoonCount > 0 && (
                <div className="p-4 rounded-3xl bg-[#F7892A]/10 border border-[#F7892A]/30 text-[#221D1D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-2xl bg-[#F7892A]/20 flex items-center justify-center text-[#C35F3B] shrink-0">
                      <AlertTriangle className="w-4 h-4 text-[#C35F3B]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#221D1D]">
                        {expiringSoonCount} Student Pass{expiringSoonCount > 1 ? "es" : ""} Expiring Soon (≤ 5 Days)
                      </p>
                      <p className="text-[#4D433F] text-[11px] mt-0.5">
                        Click the green WhatsApp button next to any student to send an instant pre-formatted renewal link.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSubFilterTab("expiring_soon")}
                    className="px-3.5 py-1.5 rounded-full bg-[#AED7E9] hover:bg-[#98C5D8] text-[#221D1D] font-bold text-xs shrink-0 transition-colors cursor-pointer"
                  >
                    View {expiringSoonCount} Expiring
                  </button>
                </div>
              )}

              {/* SEARCH & SUB-FILTERS */}
              <div className="bg-white rounded-3xl p-4 border border-[#E7E4E7] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1 p-1 bg-[#F7F7F5] rounded-full overflow-x-auto border border-[#E7E4E7]">
                  <button
                    onClick={() => setSubFilterTab("all")}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      subFilterTab === "all" ? "bg-[#AED7E9] text-[#221D1D] font-bold shadow-xs" : "text-[#4D433F] hover:text-[#221D1D]"
                    }`}
                  >
                    All Passes ({subscriptions.length})
                  </button>
                  <button
                    onClick={() => setSubFilterTab("active")}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      subFilterTab === "active" ? "bg-[#AED7E9] text-[#221D1D] font-bold shadow-xs" : "text-[#4D433F] hover:text-[#221D1D]"
                    }`}
                  >
                    Active ({activeSubsCount})
                  </button>
                  <button
                    onClick={() => setSubFilterTab("expiring_soon")}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      subFilterTab === "expiring_soon" ? "bg-[#AED7E9] text-[#221D1D] font-bold shadow-xs" : "text-[#4D433F] hover:text-[#221D1D]"
                    }`}
                  >
                    Expiring Soon ({expiringSoonCount})
                  </button>
                  <button
                    onClick={() => setSubFilterTab("revoked")}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      subFilterTab === "revoked" ? "bg-[#C35F3B] text-white shadow-xs" : "text-[#4D433F] hover:text-[#221D1D]"
                    }`}
                  >
                    Revoked ({subscriptions.filter((s) => s.accessStatus === "Revoked").length})
                  </button>
                </div>

                <div className="flex items-center gap-2 bg-[#F7F7F5] px-3.5 py-2.5 rounded-2xl border border-[#E7E4E7] w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-[#77716E] shrink-0" />
                  <input
                    type="text"
                    placeholder="Search student, roll, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs text-[#221D1D] bg-transparent outline-none placeholder:text-[#77716E]"
                  />
                </div>
              </div>

              {/* SUBSCRIPTIONS LIST */}
              <div className="bg-white rounded-3xl border border-[#E7E4E7] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F7F5] border-b border-[#E7E4E7] text-[#221D1D] font-semibold">
                      <tr>
                        <th className="py-3 px-4">ID &amp; Date</th>
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Course</th>
                        <th className="py-3 px-4">Fee</th>
                        <th className="py-3 px-4">Validity</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E4E7]">
                      {subscriptions
                        .filter((s) => {
                          if (subFilterTab === "active") return s.accessStatus === "Active";
                          if (subFilterTab === "expiring_soon") return s.accessStatus === "Active" && s.daysRemaining !== undefined && s.daysRemaining <= 5;
                          if (subFilterTab === "revoked") return s.accessStatus === "Revoked";
                          return true;
                        })
                        .filter((s) =>
                          s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.studentRoll.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((sub) => {
                          const isExpiring = sub.accessStatus === "Active" && sub.daysRemaining !== undefined && sub.daysRemaining <= 5;
                          return (
                            <tr key={sub.id} className="hover:bg-[#F7F7F5]/60 transition-colors">
                              <td className="py-3.5 px-4">
                                <p className="font-mono font-bold text-[#221D1D]">{sub.id}</p>
                                <p className="text-[10px] text-[#77716E]">{sub.date}</p>
                              </td>
                              <td className="py-3.5 px-4">
                                <p className="font-bold text-[#221D1D]">{sub.studentName}</p>
                                <p className="text-[11px] text-[#221D1D] font-mono bg-[#BFAFE5]/30 px-1.5 py-0.5 rounded-md inline-block mt-0.5">{sub.studentRoll}</p>
                                <p className="text-[10px] text-[#77716E]">{sub.email}</p>
                                {sub.phone && <p className="text-[10px] text-[#77716E] font-mono">{sub.phone}</p>}
                              </td>
                              <td className="py-3.5 px-4">
                                <p className="text-[#221D1D] font-semibold">{sub.item}</p>
                                <p className="text-[10px] text-[#77716E]">{sub.targetExam}</p>
                              </td>
                              <td className="py-3.5 px-4">
                                <p className="text-xs font-bold font-serif text-[#221D1D]">{sub.amount}</p>
                                <p className="text-[10px] text-[#77716E]">{sub.paymentMode}</p>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  isExpiring
                                    ? "bg-[#F7892A]/15 text-[#C35F3B] border-[#F7892A]/40 animate-pulse"
                                    : "bg-[#C4E1EC]/60 text-[#221D1D] border-[#AED7E9]"
                                }`}>
                                  {sub.daysRemaining !== undefined ? `${sub.daysRemaining} days left` : "30 days"}
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
                                      await adminFetch(`/api/admin/subscriptions/${sub.id}`, {
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
                                  <span>{sub.accessStatus === "Active" ? "Active" : "Revoked"}</span>
                                </button>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* WHATSAPP 1-CLICK RENEWAL TRIGGER */}
                                  <a
                                    href={getWhatsAppReminderUrl(sub)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Send WhatsApp Renewal Reminder"
                                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors flex items-center justify-center cursor-pointer"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                                  </a>

                                  {/* RENEW 30 DAYS */}
                                  <button
                                    onClick={async () => {
                                      const renewed = subscriptions.map((item) =>
                                        item.id === sub.id ? { ...item, daysRemaining: 30, accessStatus: "Active" as const } : item
                                      );
                                      setSubscriptions(renewed);
                                      localStorage.setItem("lawkaksha_admin_subs", JSON.stringify(renewed));
                                      showToast(`Renewed 30 days for ${sub.studentName}`);
                                      try {
                                        await adminFetch(`/api/admin/subscriptions/${sub.id}`, {
                                          method: "PUT",
                                          headers: { "Content-Type": "application/json" },
                                          body: JSON.stringify({ daysRemaining: 30, accessStatus: "Active" }),
                                        });
                                      } catch (e) {}
                                    }}
                                    title="Renew 30 Days"
                                    className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 transition-colors cursor-pointer"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setSubModal({ open: true, mode: "edit", data: sub })}
                                    title="Edit Subscription"
                                    className="p-1.5 rounded-lg bg-[#F7F7F5] hover:bg-[#E7E4E7] text-[#221D1D] transition-colors cursor-pointer border border-[#E7E4E7]"
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
                                          await adminFetch(`/api/admin/subscriptions/${sub.id}`, { method: "DELETE" });
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
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BOOKS & NOTES (UNIFIED) */}
          {activeTab === "books_and_notes" && (
            <div className="space-y-6">
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Books &amp; PDF Notes</h2>
                  <p className="text-xs text-[#4D433F] mt-0.5">
                    Manage study books, subject codices, and chapter PDF notes with in-app PDF inspector.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setProductModal({
                      open: true,
                      mode: "add",
                      data: { status: "Active", format: "Digital Codex (In-Web DRM)", category: "CA Foundation", price: 99, originalPrice: 299 }
                    })}
                    className="px-4 py-2 rounded-full bg-white border border-[#E7E4E7] text-[#221D1D] hover:bg-[#F7F7F5] text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Book</span>
                  </button>
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
                    className="px-4 py-2 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add PDF Note</span>
                  </button>
                </div>
              </div>

              {/* SUB-VIEW SWITCHER & FILTERS */}
              <div className="bg-white rounded-3xl p-4 border border-[#E7E4E7] shadow-sm flex flex-wrap items-center justify-between gap-3">
                {/* View Selector Pills */}
                <div className="flex items-center gap-1 p-1 bg-[#F7F7F5] rounded-full border border-[#E7E4E7]">
                  <button
                    onClick={() => setMaterialSubTab("all")}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      materialSubTab === "all" ? "bg-[#AED7E9] text-[#221D1D] font-bold shadow-xs" : "text-[#4D433F] hover:text-[#221D1D]"
                    }`}
                  >
                    All Material ({products.length + resources.length})
                  </button>
                  <button
                    onClick={() => setMaterialSubTab("books")}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      materialSubTab === "books" ? "bg-[#AED7E9] text-[#221D1D] font-bold shadow-xs" : "text-[#4D433F] hover:text-[#221D1D]"
                    }`}
                  >
                    Books &amp; Courses ({products.length})
                  </button>
                  <button
                    onClick={() => setMaterialSubTab("notes")}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      materialSubTab === "notes" ? "bg-[#AED7E9] text-[#221D1D] font-bold shadow-xs" : "text-[#4D433F] hover:text-[#221D1D]"
                    }`}
                  >
                    PDF Notes ({resources.length})
                  </button>
                </div>

                {/* Course & Type Dropdown Filters */}
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#4D433F]">Course:</span>
                    <select
                      value={selectedCourseFilter}
                      onChange={(e) => setSelectedCourseFilter(e.target.value)}
                      className="p-2 rounded-2xl border border-[#E7E4E7] text-xs font-semibold text-[#221D1D] outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 bg-[#F7F7F5] focus:bg-white"
                    >
                      <option value="all">All Courses</option>
                      <option value="ca-foundation">CA Foundation</option>
                      <option value="cseet">CSEET</option>
                    </select>
                  </div>

                  {materialSubTab !== "books" && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-[#4D433F]">Type:</span>
                      <select
                        value={selectedTypeFilter}
                        onChange={(e) => setSelectedTypeFilter(e.target.value)}
                        className="p-2 rounded-2xl border border-[#E7E4E7] text-xs font-semibold text-[#221D1D] outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 bg-[#F7F7F5] focus:bg-white"
                      >
                        <option value="all">All Types</option>
                        <option value="notes">Chapter Notes</option>
                        <option value="flowchart">Flowchart</option>
                        <option value="practice">Practice Questions</option>
                        <option value="pyq">PYQ Drill</option>
                        <option value="ldr">Last Day Revision (LDR)</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* 1. BOOKS & CODICES SECTION */}
              {(materialSubTab === "all" || materialSubTab === "books") && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#4B8097]" />
                      <h3 className="text-sm font-bold text-[#221D1D] uppercase tracking-wider font-serif">Full Books &amp; Codices</h3>
                    </div>
                    <span className="text-xs font-medium text-[#77716E]">{products.length} active</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {products
                      .filter((p) => {
                        if (selectedCourseFilter === "all") return true;
                        if (selectedCourseFilter === "ca-foundation") return p.category.includes("CA Foundation");
                        if (selectedCourseFilter === "cseet") return p.category.includes("CSEET");
                        return true;
                      })
                      .map((prod) => (
                        <div key={prod.id} className="bg-white rounded-3xl border border-[#E7E4E7] shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                          <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#C4E1EC]/60 text-[#221D1D] border border-[#AED7E9]">
                                {prod.category}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#AED7E9]/40 text-[#221D1D] border border-[#AED7E9]">
                                {prod.status}
                              </span>
                            </div>

                            <div>
                              <h4 className="text-base font-serif font-bold text-[#221D1D] leading-snug">{prod.title}</h4>
                              <p className="text-xs text-[#77716E] font-medium mt-0.5">{prod.subtitle}</p>
                            </div>

                            <p className="text-xs text-[#4D433F] leading-relaxed line-clamp-2">
                              {prod.description}
                            </p>

                            <div className="pt-2 border-t border-slate-100 space-y-1">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Included Chapters</p>
                              <div className="flex flex-wrap gap-1">
                                {prod.units?.map((u, i) => (
                                  <span key={i} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100">
                                    {u}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-[#F7F7F5] border-t border-[#E7E4E7] flex items-center justify-between">
                            <div>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-base font-bold text-[#221D1D]">₹{prod.price}</span>
                                <span className="text-xs text-[#77716E] line-through">₹{prod.originalPrice}</span>
                                {prod.originalPrice > prod.price && (
                                  <span className="text-[10px] text-[#4B8097] font-semibold">
                                    {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% off
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-[#77716E]">{prod.pages} • In-Web DRM</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {/* IN-APP PDF INSPECTOR */}
                              <button
                                onClick={() => setPreviewPdfModal({
                                  open: true,
                                  title: prod.title,
                                  pdfUrl: prod.pdfUrl,
                                  category: prod.category,
                                  pages: prod.pages,
                                  isSample: false,
                                })}
                                className="p-2 rounded-2xl bg-[#C4E1EC]/60 text-[#221D1D] hover:bg-[#C4E1EC] border border-[#AED7E9] text-xs font-semibold transition-all cursor-pointer"
                                title="Inspect & Preview PDF in Admin"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setProductModal({ open: true, mode: "edit", data: prod })}
                                className="p-2 rounded-2xl bg-white border border-[#E7E4E7] text-[#221D1D] hover:bg-[#F7F7F5] text-xs font-semibold transition-all cursor-pointer"
                                title="Edit Book"
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
                                      await adminFetch(`/api/admin/products/${prod.id}`, { method: "DELETE" });
                                    } catch (e) {}
                                    showToast("Product deleted.");
                                  }
                                }}
                                className="p-2 rounded-2xl bg-white border border-[#F4C5C0] text-[#C35F3B] hover:bg-[#F4C5C0]/30 text-xs font-semibold transition-all cursor-pointer"
                                title="Delete Book"
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

              {/* 2. CHAPTER NOTES & PDFS SECTION */}
              {(materialSubTab === "all" || materialSubTab === "notes") && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#4B8097]" />
                      <h3 className="text-sm font-bold text-[#221D1D] uppercase tracking-wider font-serif">Chapter Notes &amp; PDF Resources</h3>
                    </div>
                    <span className="text-xs font-medium text-[#77716E]">{resources.length} notes</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resources
                      .filter((r) => selectedCourseFilter === "all" || r.course === selectedCourseFilter)
                      .filter((r) => selectedTypeFilter === "all" || r.type === selectedTypeFilter)
                      .map((res) => (
                        <div key={res.id} className="bg-white rounded-3xl border border-[#E7E4E7] shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#C4E1EC]/60 text-[#221D1D] border border-[#AED7E9]">
                                {res.course === "ca-foundation" ? "CA Foundation" : "CSEET"} • Ch {res.chapterNumber}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                                res.status === "Published" ? "bg-[#AED7E9]/40 text-[#221D1D] border border-[#AED7E9]" : "bg-[#F7892A]/15 text-[#C35F3B] border border-[#F7892A]/40"
                              }`}>
                                {res.status}
                              </span>
                            </div>

                            <div>
                              <p className="text-[10px] font-bold text-[#77716E]">{res.actName}</p>
                              <h4 className="text-xs font-bold text-[#221D1D] leading-snug mt-0.5">{res.title}</h4>
                            </div>

                            <p className="text-[11px] text-[#4D433F] leading-relaxed line-clamp-2">
                              {res.description}
                            </p>

                            <div className="pt-2 border-t border-[#E7E4E7] flex items-center justify-between text-[10px] text-[#77716E]">
                              <span className="font-mono text-[#221D1D]">{res.pages}</span>
                              {res.isSample && (
                                <span className="text-[10px] font-bold text-[#221D1D] bg-[#AED7E9]/40 px-2 py-0.5 rounded-full border border-[#AED7E9]">
                                  Sample PDF
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="pt-3 mt-3 border-t border-[#E7E4E7] flex items-center justify-between">
                            <span className="text-[10px] text-[#77716E] truncate max-w-[100px]" title={res.pdfUrl}>
                              {res.pdfUrl.split("/").pop()}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {/* IN-APP PDF INSPECTOR */}
                              <button
                                onClick={() => setPreviewPdfModal({
                                  open: true,
                                  title: res.title,
                                  pdfUrl: res.pdfUrl,
                                  category: res.course === "ca-foundation" ? "CA Foundation" : "CSEET",
                                  actName: res.actName,
                                  pages: res.pages,
                                  isSample: res.isSample,
                                })}
                                className="p-2 rounded-2xl bg-[#C4E1EC]/60 text-[#221D1D] hover:bg-[#C4E1EC] border border-[#AED7E9] text-xs font-semibold transition-colors cursor-pointer"
                                title="Inspect & Preview PDF in Admin"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setResourceModal({ open: true, mode: "edit", data: res })}
                                className="p-2 rounded-2xl bg-white border border-[#E7E4E7] text-[#221D1D] hover:bg-[#F7F7F5] transition-colors cursor-pointer"
                                title="Edit Note"
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
                                      await adminFetch(`/api/admin/resources/${res.id}`, { method: "DELETE" });
                                    } catch (e) {}
                                    showToast("Resource deleted.");
                                  }
                                }}
                                className="p-2 rounded-2xl bg-white border border-[#F4C5C0] text-[#C35F3B] hover:bg-[#F4C5C0]/30 transition-colors cursor-pointer"
                                title="Delete Note"
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
            </div>
          )}

          {/* TAB 4: STUDENTS */}
          {activeTab === "students" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#221D1D]">Students Directory</h2>
                  <p className="text-xs text-[#4D433F] mt-0.5">View registered students, DRM permissions, and export contact roster.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportStudents}
                    className="px-4 py-2 rounded-full bg-white border border-[#E7E4E7] hover:bg-[#F7F7F5] text-[#221D1D] text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    title="Export all students as CSV file"
                  >
                    <Download className="w-3.5 h-3.5 text-[#77716E]" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => setStudentModal({ open: true, mode: "add", data: { is_active: true, drm_access: true, target_exam: "CA Foundation Paper 2" } })}
                    className="px-4 py-2 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Student</span>
                  </button>
                </div>
              </div>

              {/* STUDENTS LIST */}
              <div className="bg-white rounded-3xl border border-[#E7E4E7] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F7F5] border-b border-[#E7E4E7] text-[#77716E] font-semibold">
                      <tr>
                        <th className="py-3 px-4">Student &amp; Roll No.</th>
                        <th className="py-3 px-4">Contact Info</th>
                        <th className="py-3 px-4">Target Exam</th>
                        <th className="py-3 px-4">Enrolled Courses</th>
                        <th className="py-3 px-4">Access Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E4E7]">
                      {students.map((std) => (
                        <tr key={std.id} className="hover:bg-[#F7F7F5]/50 transition-colors">
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-[#221D1D]">{std.name}</p>
                            <p className="text-[10px] text-[#4B8097] font-mono">{std.student_id}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="text-[#4D433F]">{std.email}</p>
                            <p className="text-[10px] text-[#77716E]">{std.phone}</p>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-[#4D433F]">
                            {std.target_exam}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1">
                              {std.enrolled_books?.map((b, i) => (
                                <span key={i} className="text-[10px] bg-[#F7F7F5] text-[#4D433F] px-2 py-0.5 rounded-full border border-[#E7E4E7]">
                                  {b}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              std.drm_access ? "bg-[#AED7E9]/40 text-[#221D1D] border border-[#AED7E9]" : "bg-[#F4C5C0]/40 text-[#C35F3B] border border-[#F4C5C0]"
                            }`}>
                              {std.drm_access ? "Active" : "Blocked"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setStudentModal({ open: true, mode: "edit", data: std })}
                                className="p-1.5 rounded-xl bg-white border border-[#E7E4E7] hover:bg-[#F7F7F5] text-[#221D1D] transition-colors cursor-pointer"
                                title="Edit Student"
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
                                      await adminFetch(`/api/admin/students/${std.id}`, { method: "DELETE" });
                                    } catch (e) {}
                                    showToast("Student deleted.");
                                  }
                                }}
                                className="p-1.5 rounded-xl bg-white border border-[#F4C5C0] hover:bg-[#F4C5C0]/30 text-[#C35F3B] transition-colors cursor-pointer"
                                title="Delete Student"
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
                  <h2 className="text-xl font-serif font-bold text-[#221D1D]">Weekly Case Studies</h2>
                  <p className="text-xs text-[#4D433F] mt-0.5">Manage weekly practice cases, scenarios, and model answers.</p>
                </div>
                <button
                  onClick={() => setCaseModal({ open: true, mode: "add", data: { day: "Monster Monday", badge: "High Difficulty", subject: "Indian Contract Act, 1872", marks: "6/6 Marks" } })}
                  className="px-4 py-2 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Case Study</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cases.map((cs) => (
                  <div key={cs.id} className="bg-white rounded-3xl border border-[#E7E4E7] shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#4B8097] uppercase">{cs.day}</span>
                        <span className="text-[10px] font-bold bg-[#F4C5C0]/40 text-[#C35F3B] px-2 py-0.5 rounded-full border border-[#F4C5C0]">{cs.badge}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#77716E] block">{cs.subject}</span>
                        <h3 className="text-sm font-bold text-[#221D1D] leading-snug">{cs.title}</h3>
                      </div>
                      <p className="text-xs text-[#4D433F] italic bg-[#F7F7F5] p-3 rounded-2xl border border-[#E7E4E7] line-clamp-3">
                        &ldquo;{cs.scenario}&rdquo;
                      </p>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#4B8097] block mb-0.5">Model Solution</span>
                        <p className="text-xs text-[#77716E] line-clamp-3">{cs.modelAnswer}</p>
                      </div>
                    </div>

                    <div className="pt-3 mt-4 border-t border-[#E7E4E7] flex items-center justify-between">
                      <span className="text-[10px] text-[#77716E] truncate max-w-[150px]">{cs.precedent}</span>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setCaseModal({ open: true, mode: "edit", data: cs })} className="p-1.5 rounded-xl bg-white border border-[#E7E4E7] hover:bg-[#F7F7F5] text-[#221D1D]" title="Edit Case">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm(`Delete case scenario ${cs.title}?`)) {
                              const next = cases.filter((c) => c.id !== cs.id);
                              setCases(next);
                              localStorage.setItem("lawkaksha_admin_cases", JSON.stringify(next));
                              try {
                                await adminFetch(`/api/admin/cases/${cs.id}`, { method: "DELETE" });
                              } catch (e) {}
                              showToast("Case deleted.");
                            }
                          }}
                          className="p-1.5 rounded-xl bg-white border border-[#F4C5C0] hover:bg-[#F4C5C0]/30 text-[#C35F3B]"
                          title="Delete Case"
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

          {/* TAB 6: GOOGLE FORM MCQ TESTS */}
          {activeTab === "mcq" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#221D1D]">Google Form MCQ Tests</h2>
                  <p className="text-xs text-[#4D433F] mt-0.5">
                    Directly attach &amp; publish Google Form MCQ quizzes, chapter mock drills, and full-length exam papers.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setMcqModal({
                      open: true,
                      mode: "add",
                      data: {
                        course: "ca",
                        subject: "The Indian Contract Act, 1872",
                        questionCount: 30,
                        duration: 30,
                        totalMarks: 30,
                        status: "Active",
                        formUrl: "",
                        instructions: "Attempt all questions in one sitting. Follow official exam guidelines.",
                      },
                    })
                  }
                  className="px-4 py-2.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Google Form Test</span>
                </button>
              </div>

              {/* TESTS LIST */}
              {mcqTests.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#E7E4E7] p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#C4E1EC]/60 text-[#221D1D] flex items-center justify-center mx-auto border border-[#AED7E9]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-[#221D1D]">No Google Form Tests Added Yet</h3>
                  <p className="text-xs text-[#77716E] max-w-sm mx-auto">
                    Click &quot;Add Google Form Test&quot; above to paste your Google Form link and make it available to enrolled students.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {mcqTests.map((test) => (
                    <div
                      key={test.id}
                      className="bg-white rounded-3xl border border-[#E7E4E7] shadow-xs p-5 flex flex-col justify-between hover:shadow-md transition-all space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              test.course === "ca"
                                ? "bg-[#F7892A]/15 text-[#221D1D] border-[#F7892A]/40"
                                : test.course === "cs"
                                ? "bg-[#C4E1EC]/60 text-[#221D1D] border-[#AED7E9]"
                                : "bg-[#BFAFE5]/30 text-[#221D1D] border-[#BFAFE5]"
                            }`}
                          >
                            {test.course === "ca" ? "CA Foundation" : test.course === "cs" ? "CSEET" : "All Courses"}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              test.status === "Active"
                                ? "bg-[#AED7E9]/40 text-[#221D1D] border border-[#AED7E9]"
                                : "bg-[#F7F7F5] text-[#77716E] border border-[#E7E4E7]"
                            }`}
                          >
                            {test.status}
                          </span>
                        </div>

                        <div>
                          <span className="text-[11px] text-[#4B8097] font-semibold block">{test.subject}</span>
                          <h3 className="text-sm font-bold text-[#221D1D] leading-snug mt-0.5">{test.title}</h3>
                        </div>

                        {/* Test Spec Pills */}
                        <div className="flex items-center gap-2 flex-wrap text-[11px]">
                          <span className="px-2.5 py-1 rounded-full bg-[#F7F7F5] border border-[#E7E4E7] font-semibold text-[#4D433F]">
                            📝 {test.questionCount || 30} Questions
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-[#F7F7F5] border border-[#E7E4E7] font-semibold text-[#4D433F]">
                            ⏱️ {test.duration || 30} Mins
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-[#F7F7F5] border border-[#E7E4E7] font-semibold text-[#4D433F]">
                            🎯 {test.totalMarks || 30} Marks
                          </span>
                        </div>

                        {test.instructions && (
                          <p className="text-xs text-[#77716E] bg-[#F7F7F5] p-2.5 rounded-2xl border border-[#E7E4E7] leading-relaxed line-clamp-2">
                            {test.instructions}
                          </p>
                        )}

                        {/* URL snippet */}
                        <div className="p-2 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7] flex items-center justify-between gap-2 text-xs">
                          <span className="text-[#77716E] truncate font-mono text-[11px] flex-1">
                            {test.formUrl || "No Google Form URL provided"}
                          </span>
                          <button
                            onClick={() => {
                              if (test.formUrl) {
                                navigator.clipboard.writeText(test.formUrl);
                                showToast("Google Form link copied to clipboard!");
                              }
                            }}
                            className="p-1 rounded-lg text-[#77716E] hover:text-[#221D1D] transition-colors"
                            title="Copy Form URL"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-3 border-t border-[#E7E4E7] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPreviewFormModal({ open: true, url: test.formUrl, title: test.title })}
                            className="px-3 py-1.5 rounded-full bg-[#C4E1EC]/60 hover:bg-[#C4E1EC] text-[#221D1D] text-xs font-semibold flex items-center gap-1.5 border border-[#AED7E9] transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview Form</span>
                          </button>
                          {test.formUrl && (
                            <a
                              href={test.formUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-full hover:bg-[#F7F7F5] text-[#77716E] hover:text-[#221D1D] transition-colors"
                              title="Open in new tab"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setMcqModal({ open: true, mode: "edit", data: test })}
                            className="p-1.5 rounded-xl bg-white border border-[#E7E4E7] hover:bg-[#F7F7F5] text-[#221D1D]"
                            title="Edit Test"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Delete test "${test.title}"?`)) {
                                const next = mcqTests.filter((t) => t.id !== test.id);
                                setMcqTests(next);
                                localStorage.setItem("lawkaksha_admin_mcqs", JSON.stringify(next));
                                try {
                                  await adminFetch(`/api/admin/mcq-tests/${test.id}`, { method: "DELETE" });
                                } catch (e) {}
                                showToast("Test deleted.");
                              }
                            }}
                            className="p-1.5 rounded-xl bg-white border border-[#F4C5C0] hover:bg-[#F4C5C0]/30 text-[#C35F3B]"
                            title="Delete Test"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: COUPONS */}
          {activeTab === "coupons" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#221D1D]">Discount Coupons</h2>
                  <p className="text-xs text-[#4D433F] mt-0.5">Create and manage discount promo codes for subscriptions.</p>
                </div>
                <button
                  onClick={() => setCouponModal({ open: true, mode: "add", data: { status: "Active", discountPercent: 20, minOrder: 99, maxUses: 500, usedCount: 0, expiryDate: "2026-12-31" } })}
                  className="px-4 py-2 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Coupon</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {coupons.map((cp) => (
                  <div key={cp.id} className="bg-white rounded-3xl border border-[#E7E4E7] shadow-sm p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-extrabold font-mono text-[#221D1D] bg-[#BFAFE5]/40 px-3 py-1 rounded-xl border border-[#BFAFE5]">
                        {cp.code}
                      </span>
                      <span className="text-[10px] font-bold text-[#221D1D] bg-[#AED7E9]/40 px-2.5 py-0.5 rounded-full border border-[#AED7E9]">
                        {cp.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-[#4D433F]">
                      <p><strong>Discount:</strong> {cp.discountPercent}% OFF</p>
                      <p><strong>Min Order:</strong> ₹{cp.minOrder}</p>
                      <p><strong>Redeemed:</strong> {cp.usedCount} / {cp.maxUses} times</p>
                      <p><strong>Expires:</strong> {cp.expiryDate}</p>
                    </div>
                    <div className="pt-3 border-t border-[#E7E4E7] flex items-center justify-end gap-1.5">
                      <button onClick={() => setCouponModal({ open: true, mode: "edit", data: cp })} className="p-1.5 rounded-xl bg-white border border-[#E7E4E7] hover:bg-[#F7F7F5] text-[#221D1D]" title="Edit Coupon">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete coupon ${cp.code}?`)) {
                            const next = coupons.filter((c) => c.id !== cp.id);
                            setCoupons(next);
                            localStorage.setItem("lawkaksha_admin_coupons", JSON.stringify(next));
                            try {
                              await adminFetch(`/api/admin/coupons/${cp.id}`, { method: "DELETE" });
                            } catch (e) {}
                            showToast("Coupon deleted.");
                          }
                        }}
                        className="p-1.5 rounded-xl bg-white border border-[#F4C5C0] hover:bg-[#F4C5C0]/30 text-[#C35F3B]"
                        title="Delete Coupon"
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
              <div className="bg-white rounded-3xl border border-[#E7E4E7] shadow-sm p-6 space-y-4">
                <h3 className="text-sm font-serif font-bold text-[#221D1D]">Exam Countdown Dates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {examSettings.map((ex, idx) => (
                    <div key={ex.id || idx} className="p-4 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7] space-y-2">
                      <p className="text-xs font-bold text-[#221D1D]">{ex.exam}</p>
                      <p className="text-[11px] text-[#77716E]">{ex.session}</p>
                      <div className="pt-1">
                        <input
                          type="date"
                          value={ex.date}
                          onChange={async (e) => {
                            const next = [...examSettings];
                            next[idx].date = e.target.value;
                            setExamSettings(next);
                            try {
                              await adminFetch(`/api/admin/exam-settings`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ examSettings: next }),
                              });
                              showToast("Updated exam date!");
                            } catch (err) {}
                          }}
                          className="px-3 py-1.5 rounded-xl border border-[#E7E4E7] bg-white text-xs font-semibold text-[#221D1D] outline-none focus:border-[#BFAFE5]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* QUESTION OF THE DAY EDIT */}
              <div className="bg-white rounded-3xl border border-[#E7E4E7] shadow-sm p-6 space-y-4">
                <h3 className="text-sm font-serif font-bold text-[#221D1D]">Question of the Day (QOTD)</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#4D433F] mb-1">Question Text</label>
                    <textarea
                      rows={2}
                      value={qotd.question}
                      onChange={(e) => setQotd({ ...qotd, question: e.target.value })}
                      className="w-full p-3 rounded-2xl border border-[#E7E4E7] text-xs text-[#221D1D] outline-none focus:border-[#BFAFE5] bg-[#F7F7F5]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#4D433F] mb-1">Act / Subject</label>
                      <input
                        type="text"
                        value={qotd.act}
                        onChange={(e) => setQotd({ ...qotd, act: e.target.value })}
                        className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] text-xs text-[#221D1D] outline-none focus:border-[#BFAFE5] bg-[#F7F7F5]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#4D433F] mb-1">Section</label>
                      <input
                        type="text"
                        value={qotd.section}
                        onChange={(e) => setQotd({ ...qotd, section: e.target.value })}
                        className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] text-xs text-[#221D1D] outline-none focus:border-[#BFAFE5] bg-[#F7F7F5]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#4D433F] mb-1">Explanation</label>
                    <textarea
                      rows={2}
                      value={qotd.explanation}
                      onChange={(e) => setQotd({ ...qotd, explanation: e.target.value })}
                      className="w-full p-3 rounded-2xl border border-[#E7E4E7] text-xs text-[#221D1D] outline-none focus:border-[#BFAFE5] bg-[#F7F7F5]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={async () => {
                        showToast("Saving QOTD to MongoDB Atlas...");
                        try {
                          await adminFetch(`/api/admin/qotd`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ qotd }),
                          });
                          showToast("Question of the Day updated!");
                        } catch (err) {
                          showToast("Saved locally (offline mode)");
                        }
                      }}
                      className="px-5 py-2.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] font-bold text-xs shadow-xs cursor-pointer"
                    >
                      Save Question of the Day
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* --- CRUD MODALS --- */}

      {/* 1. RESOURCE ADD / EDIT MODAL */}
      {resourceModal.open && (
        <div className="fixed inset-0 z-50 bg-[#221D1D]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#E7E4E7] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E4E7]">
              <h3 className="text-sm font-serif font-bold text-[#221D1D]">
                {resourceModal.mode === "add" ? "Add PDF Note" : "Edit PDF Note"}
              </h3>
              <button onClick={() => setResourceModal({ open: false, mode: "add", data: {} })} className="p-2 rounded-xl hover:bg-[#F7F7F5] cursor-pointer">
                <X className="w-5 h-5 text-[#77716E]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Course *</label>
                  <select
                    value={resourceModal.data.course || "ca-foundation"}
                    onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, course: e.target.value } })}
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] bg-white text-[#221D1D]"
                  >
                    <option value="ca-foundation">CA Foundation</option>
                    <option value="cseet">CSEET</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Chapter Number *</label>
                  <input
                    type="number"
                    value={resourceModal.data.chapterNumber || 1}
                    onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, chapterNumber: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-[#221D1D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">Act / Subject Name *</label>
                <input
                  type="text"
                  value={resourceModal.data.actName || ""}
                  onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, actName: e.target.value } })}
                  placeholder="e.g. The Indian Partnership Act, 1932"
                  className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-[#221D1D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">Note Title *</label>
                <input
                  type="text"
                  value={resourceModal.data.title || ""}
                  onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, title: e.target.value } })}
                  placeholder="e.g. Unit 1: General Nature of Partnership"
                  className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-[#221D1D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Type</label>
                  <select
                    value={resourceModal.data.type || "notes"}
                    onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, type: e.target.value as any } })}
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] bg-white text-[#221D1D]"
                  >
                    <option value="notes">Chapter Notes</option>
                    <option value="flowchart">Flowchart</option>
                    <option value="practice">Practice Questions</option>
                    <option value="pyq">PYQ Drill</option>
                    <option value="ldr">Last Day Revision (LDR)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Status</label>
                  <select
                    value={resourceModal.data.status || "Published"}
                    onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, status: e.target.value as any } })}
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] bg-white text-[#221D1D]"
                  >
                    <option value="Published">Published (Active)</option>
                    <option value="Coming soon">Coming soon</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">PDF File / Cloudinary URL *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={resourceModal.data.pdfUrl || ""}
                    onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, pdfUrl: e.target.value } })}
                    placeholder="/notes/sale-of-goods-unit-1.pdf"
                    className="flex-1 p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] font-mono text-xs text-[#221D1D]"
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
                    className="px-3 py-2 bg-[#C4E1EC]/60 hover:bg-[#C4E1EC] text-[#221D1D] border border-[#AED7E9] rounded-2xl text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{isUploadingFile ? "Uploading..." : "Upload PDF"}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="res-sample-checkbox"
                    checked={Boolean(resourceModal.data.isSample)}
                    onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, isSample: e.target.checked } })}
                    className="rounded-md border-[#E7E4E7] text-[#4B8097] focus:ring-[#BFAFE5] w-4 h-4 cursor-pointer accent-[#4B8097]"
                  />
                  <label htmlFor="res-sample-checkbox" className="font-semibold text-[#4D433F] cursor-pointer text-xs">
                    Free Sample Preview
                  </label>
                </div>

                <div className="flex items-center gap-1.5">
                  <label className="text-[#77716E] text-[11px] font-semibold">Preview Limit:</label>
                  <input
                    type="number"
                    value={resourceModal.data.previewPagesLimit || 5}
                    onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, previewPagesLimit: Number(e.target.value) } })}
                    className="w-14 p-1.5 rounded-xl border border-[#E7E4E7] text-xs font-bold text-[#4B8097] text-center"
                    placeholder="5"
                  />
                  <span className="text-[10px] text-[#77716E]">Pages</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E7E4E7] flex items-center justify-end gap-2">
              <button
                onClick={() => setResourceModal({ open: false, mode: "add", data: {} })}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#4D433F] hover:bg-[#F7F7F5] cursor-pointer"
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
                    previewPagesLimit: Number(resourceModal.data.previewPagesLimit) || 5,
                  };

                  const next = isAdd ? [...resources, payload] : resources.map((r) => (r.id === payload.id ? payload : r));
                  setResources(next);
                  localStorage.setItem("lawkaksha_admin_resources", JSON.stringify(next));
                  setResourceModal({ open: false, mode: "add", data: {} });
                  showToast("Saving resource to MongoDB Atlas...");
                  try {
                    await adminFetch(`/api/admin/resources${!isAdd ? "/" + payload.id : ""}`, {
                      method: isAdd ? "POST" : "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    showToast("PDF Note saved!");
                  } catch (e) {
                    showToast("Saved locally (offline mode)");
                  }
                }}
                className="px-5 py-2 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-bold shadow-xs cursor-pointer"
              >
                Save PDF Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SUBSCRIPTION ADD / EDIT MODAL */}
      {subModal.open && (
        <div className="fixed inset-0 z-50 bg-[#221D1D]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#E7E4E7] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E4E7]">
              <h3 className="text-sm font-serif font-bold text-[#221D1D]">
                {subModal.mode === "add" ? "Add Subscription" : "Edit Subscription"}
              </h3>
              <button onClick={() => setSubModal({ open: false, mode: "add", data: {} })} className="p-2 rounded-xl hover:bg-[#F7F7F5] cursor-pointer">
                <X className="w-5 h-5 text-[#77716E]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Student Name *</label>
                  <input
                    type="text"
                    value={subModal.data.studentName || ""}
                    onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, studentName: e.target.value } })}
                    placeholder="e.g. Student Name"
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs text-[#221D1D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Roll / Student ID *</label>
                  <input
                    type="text"
                    value={subModal.data.studentRoll || ""}
                    onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, studentRoll: e.target.value } })}
                    placeholder="LRK-2026-004182"
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] font-mono text-xs text-[#221D1D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={subModal.data.email || ""}
                    onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, email: e.target.value } })}
                    placeholder="student@thelawkaksha.com"
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs text-[#221D1D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={subModal.data.phone || ""}
                    onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, phone: e.target.value } })}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] font-mono text-xs text-[#221D1D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">Course / Pass *</label>
                <select
                  value={subModal.data.item || "CA Foundation Business Laws (Monthly Access)"}
                  onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, item: e.target.value } })}
                  className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] bg-white text-xs text-[#221D1D]"
                >
                  <option value="CA Foundation Business Laws (Monthly Access)">CA Foundation Business Laws (₹99/Month)</option>
                  <option value="CSEET Business Law & Management (Monthly Access)">CSEET Business Law &amp; Management (₹99/Month)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Fee Amount (₹)</label>
                  <input
                    type="text"
                    value={subModal.data.amount || "₹99"}
                    onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, amount: e.target.value } })}
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] font-bold text-xs text-[#221D1D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Payment Method</label>
                  <select
                    value={subModal.data.paymentMode || "UPI / Razorpay"}
                    onChange={(e) => setSubModal({ ...subModal, data: { ...subModal.data, paymentMode: e.target.value } })}
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] bg-white text-xs text-[#221D1D]"
                  >
                    <option value="UPI / Razorpay">UPI / Razorpay</option>
                    <option value="Razorpay / Cards">Razorpay / Cards</option>
                    <option value="Admin Direct Grant (Free)">Admin Direct Grant (Free)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E7E4E7] flex items-center justify-end gap-2">
              <button
                onClick={() => setSubModal({ open: false, mode: "add", data: {} })}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#4D433F] hover:bg-[#F7F7F5] cursor-pointer"
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
                  showToast(isAdd ? "Adding subscription..." : "Updating subscription...");
                  try {
                    await adminFetch(`/api/admin/subscriptions${!isAdd ? "/" + payload.id : ""}`, {
                      method: isAdd ? "POST" : "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    showToast("Subscription saved!");
                  } catch (e) {
                    showToast("Saved locally (offline mode)");
                  }
                }}
                className="px-5 py-2 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. PRODUCT / COURSE MODAL */}
      {productModal.open && (
        <div className="fixed inset-0 z-50 bg-[#221D1D]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#E7E4E7] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E4E7]">
              <h3 className="text-sm font-serif font-bold text-[#221D1D]">
                {productModal.mode === "add" ? "Add Course / Book" : "Edit Course / Book"}
              </h3>
              <button onClick={() => setProductModal({ open: false, mode: "add", data: {} })} className="p-2 rounded-xl hover:bg-[#F7F7F5] cursor-pointer">
                <X className="w-5 h-5 text-[#77716E]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">Course Title *</label>
                <input
                  type="text"
                  value={productModal.data.title || ""}
                  onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, title: e.target.value } })}
                  placeholder="e.g. CA Foundation Business Laws"
                  className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs text-[#221D1D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">Subtitle *</label>
                <input
                  type="text"
                  value={productModal.data.subtitle || ""}
                  onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, subtitle: e.target.value } })}
                  placeholder="e.g. Complete 7 Chapters Study Notes &amp; Cases"
                  className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs text-[#221D1D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Monthly Price (₹) *</label>
                  <input
                    type="number"
                    value={productModal.data.price || 99}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, price: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs text-[#221D1D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={productModal.data.originalPrice || 299}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, originalPrice: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs text-[#221D1D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Preview Page Limit (Sample)</label>
                  <input
                    type="number"
                    value={productModal.data.previewPagesLimit || 5}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, previewPagesLimit: Number(e.target.value) } })}
                    placeholder="e.g. 5"
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs font-bold text-[#4B8097]"
                  />
                  <span className="text-[10px] text-[#77716E]">Restricts free preview to first N pages</span>
                </div>
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Sample Page Range</label>
                  <input
                    type="text"
                    value={productModal.data.samplePagesRange || "1-5"}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, samplePagesRange: e.target.value } })}
                    placeholder="e.g. 1-5"
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs font-mono text-[#221D1D]"
                  />
                  <span className="text-[10px] text-[#77716E]">Display label for free sample</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">PDF URL / Upload</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={productModal.data.pdfUrl || ""}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, pdfUrl: e.target.value } })}
                    placeholder="/notes/sale-of-goods-unit-1.pdf"
                    className="flex-1 p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs font-mono text-[#221D1D]"
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
                    className="px-3 py-2 bg-[#C4E1EC]/60 hover:bg-[#C4E1EC] text-[#221D1D] border border-[#AED7E9] rounded-2xl text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload PDF</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E7E4E7] flex items-center justify-end gap-2">
              <button
                onClick={() => setProductModal({ open: false, mode: "add", data: {} })}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#4D433F] hover:bg-[#F7F7F5] cursor-pointer"
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
                    previewPagesLimit: Number(productModal.data.previewPagesLimit) || 5,
                    samplePagesRange: productModal.data.samplePagesRange || "1-5",
                  };
                  const next = isAdd ? [...products, payload] : products.map((p) => (p.id === payload.id ? payload : p));
                  setProducts(next);
                  localStorage.setItem("lawkaksha_admin_products", JSON.stringify(next));
                  setProductModal({ open: false, mode: "add", data: {} });
                  showToast(isAdd ? "Adding course..." : "Updating course...");
                  try {
                    await adminFetch(`/api/admin/products${!isAdd ? "/" + payload.id : ""}`, {
                      method: isAdd ? "POST" : "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    showToast("Course saved!");
                  } catch (e) {
                    showToast("Saved locally (offline mode)");
                  }
                }}
                className="px-5 py-2 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. STUDENT MODAL */}
      {studentModal.open && (
        <div className="fixed inset-0 z-50 bg-[#221D1D]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#E7E4E7] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E4E7]">
              <h3 className="text-sm font-serif font-bold text-[#221D1D]">
                {studentModal.mode === "add" ? "Add Student" : "Edit Student"}
              </h3>
              <button onClick={() => setStudentModal({ open: false, mode: "add", data: {} })} className="p-2 rounded-xl hover:bg-[#F7F7F5] cursor-pointer">
                <X className="w-5 h-5 text-[#77716E]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">Student Name *</label>
                <input
                  type="text"
                  value={studentModal.data.name || ""}
                  onChange={(e) => setStudentModal({ ...studentModal, data: { ...studentModal.data, name: e.target.value } })}
                  placeholder="e.g. Student Name"
                  className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs text-[#221D1D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">Student / Roll ID *</label>
                <input
                  type="text"
                  value={studentModal.data.student_id || ""}
                  onChange={(e) => setStudentModal({ ...studentModal, data: { ...studentModal.data, student_id: e.target.value } })}
                  placeholder="LRK-2026-001234"
                  className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] font-mono text-xs text-[#221D1D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">Email Address *</label>
                <input
                  type="email"
                  value={studentModal.data.email || ""}
                  onChange={(e) => setStudentModal({ ...studentModal, data: { ...studentModal.data, email: e.target.value } })}
                  placeholder="student@thelawkaksha.com"
                  className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs text-[#221D1D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">Target Exam</label>
                <select
                  value={studentModal.data.target_exam || "CA Foundation Paper 2"}
                  onChange={(e) => setStudentModal({ ...studentModal, data: { ...studentModal.data, target_exam: e.target.value } })}
                  className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] bg-white text-xs text-[#221D1D]"
                >
                  <option value="CA Foundation Paper 2">CA Foundation Paper 2 (Business Laws)</option>
                  <option value="CSEET Law & Management">CSEET Paper 2 (Business Law &amp; Management)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E7E4E7] flex items-center justify-end gap-2">
              <button
                onClick={() => setStudentModal({ open: false, mode: "add", data: {} })}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#4D433F] hover:bg-[#F7F7F5] cursor-pointer"
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
                    await adminFetch(`/api/admin/students${!isAdd ? "/" + payload.id : ""}`, {
                      method: isAdd ? "POST" : "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    showToast("Student saved!");
                  } catch (e) {}
                }}
                className="px-5 py-2 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. CASE STUDY MODAL */}
      {caseModal.open && (
        <div className="fixed inset-0 z-50 bg-[#221D1D]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#E7E4E7] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E4E7]">
              <h3 className="text-sm font-serif font-bold text-[#221D1D]">
                {caseModal.mode === "add" ? "Add Case Study" : "Edit Case Study"}
              </h3>
              <button onClick={() => setCaseModal({ open: false, mode: "add", data: {} })} className="p-2 rounded-xl hover:bg-[#F7F7F5] cursor-pointer">
                <X className="w-5 h-5 text-[#77716E]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Day Tag</label>
                  <select
                    value={caseModal.data.day || "Monster Monday"}
                    onChange={(e) => setCaseModal({ ...caseModal, data: { ...caseModal.data, day: e.target.value } })}
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] bg-white text-[#221D1D]"
                  >
                    <option value="Monster Monday">Monster Monday</option>
                    <option value="Midweek Law Madness">Midweek Law Madness</option>
                    <option value="Final Boss Friday">Final Boss Friday</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Difficulty Badge</label>
                  <input
                    type="text"
                    value={caseModal.data.badge || "High Difficulty"}
                    onChange={(e) => setCaseModal({ ...caseModal, data: { ...caseModal.data, badge: e.target.value } })}
                    placeholder="e.g. High Difficulty"
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-[#221D1D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">Subject / Act *</label>
                <input
                  type="text"
                  value={caseModal.data.subject || ""}
                  onChange={(e) => setCaseModal({ ...caseModal, data: { ...caseModal.data, subject: e.target.value } })}
                  placeholder="e.g. Indian Contract Act, 1872"
                  className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-[#221D1D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">Case Title *</label>
                <input
                  type="text"
                  value={caseModal.data.title || ""}
                  onChange={(e) => setCaseModal({ ...caseModal, data: { ...caseModal.data, title: e.target.value } })}
                  placeholder="e.g. Anticipatory Breach &amp; Measure of Damages"
                  className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-[#221D1D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">Scenario Problem *</label>
                <textarea
                  rows={3}
                  value={caseModal.data.scenario || ""}
                  onChange={(e) => setCaseModal({ ...caseModal, data: { ...caseModal.data, scenario: e.target.value } })}
                  placeholder="Enter the case study problem scenario..."
                  className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] bg-[#F7F7F5] text-[#221D1D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">Model Solution *</label>
                <textarea
                  rows={3}
                  value={caseModal.data.modelAnswer || ""}
                  onChange={(e) => setCaseModal({ ...caseModal, data: { ...caseModal.data, modelAnswer: e.target.value } })}
                  placeholder="Enter the model legal analysis and solution..."
                  className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] bg-[#F7F7F5] text-[#221D1D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Case Law Precedent</label>
                  <input
                    type="text"
                    value={caseModal.data.precedent || ""}
                    onChange={(e) => setCaseModal({ ...caseModal, data: { ...caseModal.data, precedent: e.target.value } })}
                    placeholder="e.g. Frost v. Knight"
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-[#221D1D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Marks Weightage</label>
                  <input
                    type="text"
                    value={caseModal.data.marks || "6/6 Marks"}
                    onChange={(e) => setCaseModal({ ...caseModal, data: { ...caseModal.data, marks: e.target.value } })}
                    placeholder="e.g. 6/6 Marks"
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-[#221D1D]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E7E4E7] flex items-center justify-end gap-2">
              <button
                onClick={() => setCaseModal({ open: false, mode: "add", data: {} })}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#4D433F] hover:bg-[#F7F7F5] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!caseModal.data.title) return alert("Please enter case title");
                  const isAdd = caseModal.mode === "add";
                  const payload: CaseStudyItem = {
                    id: caseModal.data.id || `case-${Date.now()}`,
                    day: caseModal.data.day || "Monster Monday",
                    badge: caseModal.data.badge || "High Difficulty",
                    subject: caseModal.data.subject || "Business Laws",
                    title: caseModal.data.title || "",
                    scenario: caseModal.data.scenario || "",
                    modelAnswer: caseModal.data.modelAnswer || "",
                    precedent: caseModal.data.precedent || "",
                    marks: caseModal.data.marks || "6/6 Marks",
                  };
                  const next = isAdd ? [...cases, payload] : cases.map((c) => (c.id === payload.id ? payload : c));
                  setCases(next);
                  localStorage.setItem("lawkaksha_admin_cases", JSON.stringify(next));
                  setCaseModal({ open: false, mode: "add", data: {} });
                  try {
                    await adminFetch(`/api/admin/cases${!isAdd ? "/" + payload.id : ""}`, {
                      method: isAdd ? "POST" : "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    showToast("Case study saved!");
                  } catch (e) {}
                }}
                className="px-5 py-2 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Case Study
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. GOOGLE FORM MCQ TEST MODAL */}
      {mcqModal.open && (
        <div className="fixed inset-0 z-50 bg-[#221D1D]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#E7E4E7] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E4E7]">
              <h3 className="text-sm font-serif font-bold text-[#221D1D]">
                {mcqModal.mode === "add" ? "Add Google Form MCQ Test" : "Edit Google Form MCQ Test"}
              </h3>
              <button onClick={() => setMcqModal({ open: false, mode: "add", data: {} })} className="p-2 rounded-xl hover:bg-[#F7F7F5] cursor-pointer">
                <X className="w-5 h-5 text-[#77716E]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">Test Title *</label>
                <input
                  type="text"
                  value={mcqModal.data.title || ""}
                  onChange={(e) => setMcqModal({ ...mcqModal, data: { ...mcqModal.data, title: e.target.value } })}
                  placeholder="e.g. Weekly Mock Test 1 — Indian Contract Act (Sec 1-75)"
                  className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] font-semibold text-[#221D1D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Target Course *</label>
                  <select
                    value={mcqModal.data.course || "ca"}
                    onChange={(e) => setMcqModal({ ...mcqModal, data: { ...mcqModal.data, course: e.target.value as any } })}
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] bg-white text-[#221D1D]"
                  >
                    <option value="ca">CA Foundation (Paper 2)</option>
                    <option value="cs">CSEET (Paper 2)</option>
                    <option value="both">Both Courses</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Status</label>
                  <select
                    value={mcqModal.data.status || "Active"}
                    onChange={(e) => setMcqModal({ ...mcqModal, data: { ...mcqModal.data, status: e.target.value as any } })}
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] bg-white text-[#221D1D]"
                  >
                    <option value="Active">Active (Published to Students)</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">Subject / Act Name *</label>
                <input
                  type="text"
                  value={mcqModal.data.subject || ""}
                  onChange={(e) => setMcqModal({ ...mcqModal, data: { ...mcqModal.data, subject: e.target.value } })}
                  placeholder="e.g. The Indian Contract Act, 1872"
                  className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-[#221D1D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">Google Form URL / Embed Link *</label>
                <input
                  type="text"
                  value={mcqModal.data.formUrl || ""}
                  onChange={(e) => setMcqModal({ ...mcqModal, data: { ...mcqModal.data, formUrl: e.target.value } })}
                  placeholder="https://docs.google.com/forms/d/e/.../viewform or https://forms.gle/..."
                  className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] font-mono text-[11px] text-[#221D1D]"
                />
                <p className="text-[10px] text-[#77716E] mt-1">
                  Paste the Google Form share link. Students will be able to take the test directly.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Questions</label>
                  <input
                    type="number"
                    value={mcqModal.data.questionCount || 30}
                    onChange={(e) => setMcqModal({ ...mcqModal, data: { ...mcqModal.data, questionCount: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-[#221D1D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={mcqModal.data.duration || 30}
                    onChange={(e) => setMcqModal({ ...mcqModal, data: { ...mcqModal.data, duration: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-[#221D1D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={mcqModal.data.totalMarks || 30}
                    onChange={(e) => setMcqModal({ ...mcqModal, data: { ...mcqModal.data, totalMarks: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-[#221D1D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">Test Guidelines &amp; Instructions</label>
                <textarea
                  rows={2}
                  value={mcqModal.data.instructions || ""}
                  onChange={(e) => setMcqModal({ ...mcqModal, data: { ...mcqModal.data, instructions: e.target.value } })}
                  placeholder="e.g. Negative marking 0.25 applies as per ICAI guidelines. Complete in one sitting."
                  className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] bg-[#F7F7F5] text-[#221D1D]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#E7E4E7] flex items-center justify-end gap-2">
              <button
                onClick={() => setMcqModal({ open: false, mode: "add", data: {} })}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#4D433F] hover:bg-[#F7F7F5] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!mcqModal.data.title) return alert("Please enter test title");
                  if (!mcqModal.data.formUrl) return alert("Please enter Google Form URL");
                  const isAdd = mcqModal.mode === "add";
                  const payload: GoogleFormTestItem = {
                    id: mcqModal.data.id || `gtest-${Date.now()}`,
                    title: mcqModal.data.title || "Weekly Google Form Mock Test",
                    course: (mcqModal.data.course as any) || "ca",
                    subject: mcqModal.data.subject || "Business Laws",
                    formUrl: mcqModal.data.formUrl || "",
                    questionCount: Number(mcqModal.data.questionCount) || 30,
                    duration: Number(mcqModal.data.duration) || 30,
                    totalMarks: Number(mcqModal.data.totalMarks) || 30,
                    status: (mcqModal.data.status as any) || "Active",
                    instructions: mcqModal.data.instructions || "Attempt in one continuous sitting.",
                  };
                  const next = isAdd ? [payload, ...mcqTests] : mcqTests.map((t) => (t.id === payload.id ? payload : t));
                  setMcqTests(next);
                  localStorage.setItem("lawkaksha_admin_mcqs", JSON.stringify(next));
                  setMcqModal({ open: false, mode: "add", data: {} });
                  showToast(isAdd ? "Adding Google Form test..." : "Updating test...");
                  try {
                    await adminFetch(`/api/admin/mcq-tests${!isAdd ? "/" + payload.id : ""}`, {
                      method: isAdd ? "POST" : "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    showToast("Google Form test saved to MongoDB Atlas!");
                  } catch (e) {
                    showToast("Saved locally (offline mode)");
                  }
                }}
                className="px-5 py-2 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Google Form Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. GOOGLE FORM IN-APP PREVIEW MODAL */}
      {previewFormModal.open && (
        <div className="fixed inset-0 z-50 bg-[#221D1D]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full h-[85vh] shadow-2xl border border-[#E7E4E7] flex flex-col overflow-hidden animate-in fade-in">
            <div className="px-5 py-3.5 border-b border-[#E7E4E7] flex items-center justify-between bg-[#F7F7F5]">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-4 h-4 text-[#4B8097]" />
                <h3 className="text-xs font-bold text-[#221D1D] truncate font-serif">{previewFormModal.title}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#BFAFE5]/40 text-[#221D1D] shrink-0 border border-[#BFAFE5]">
                  Google Form Live Preview
                </span>
              </div>
              <div className="flex items-center gap-2">
                {previewFormModal.url && (
                  <a
                    href={previewFormModal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-full bg-white border border-[#E7E4E7] text-[#221D1D] hover:bg-[#F7F7F5] text-xs font-semibold flex items-center gap-1 shadow-xs"
                  >
                    <span>Open in Tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  onClick={() => setPreviewFormModal({ open: false, url: "", title: "" })}
                  className="p-1.5 rounded-xl hover:bg-[#E7E4E7] text-[#77716E] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full bg-[#F7F7F5] relative">
              {previewFormModal.url ? (
                <iframe
                  src={previewFormModal.url.includes("embedded=true") ? previewFormModal.url : `${previewFormModal.url}?embedded=true`}
                  className="w-full h-full border-none"
                  title="Google Form Preview"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[#77716E] p-6 text-center">
                  <AlertTriangle className="w-8 h-8 mb-2 text-[#C35F3B]" />
                  <p className="text-xs font-semibold">No valid Google Form URL provided.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 8. COUPON MODAL */}
      {couponModal.open && (
        <div className="fixed inset-0 z-50 bg-[#221D1D]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#E7E4E7] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E4E7]">
              <h3 className="text-sm font-serif font-bold text-[#221D1D]">
                {couponModal.mode === "add" ? "Add Coupon" : "Edit Coupon"}
              </h3>
              <button onClick={() => setCouponModal({ open: false, mode: "add", data: {} })} className="p-2 rounded-xl hover:bg-[#F7F7F5] cursor-pointer">
                <X className="w-5 h-5 text-[#77716E]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">Coupon Code *</label>
                <input
                  type="text"
                  value={couponModal.data.code || ""}
                  onChange={(e) => setCouponModal({ ...couponModal, data: { ...couponModal.data, code: e.target.value.toUpperCase() } })}
                  placeholder="e.g. EXAM2026"
                  className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] font-mono font-bold uppercase text-xs text-[#221D1D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Discount % *</label>
                  <input
                    type="number"
                    value={couponModal.data.discountPercent || 20}
                    onChange={(e) => setCouponModal({ ...couponModal, data: { ...couponModal.data, discountPercent: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs text-[#221D1D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    value={couponModal.data.minOrder || 99}
                    onChange={(e) => setCouponModal({ ...couponModal, data: { ...couponModal.data, minOrder: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs text-[#221D1D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Max Uses</label>
                  <input
                    type="number"
                    value={couponModal.data.maxUses || 500}
                    onChange={(e) => setCouponModal({ ...couponModal, data: { ...couponModal.data, maxUses: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs text-[#221D1D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={couponModal.data.expiryDate || "2026-12-31"}
                    onChange={(e) => setCouponModal({ ...couponModal, data: { ...couponModal.data, expiryDate: e.target.value } })}
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs text-[#221D1D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">Status</label>
                <select
                  value={couponModal.data.status || "Active"}
                  onChange={(e) => setCouponModal({ ...couponModal, data: { ...couponModal.data, status: e.target.value as any } })}
                  className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] bg-white text-xs text-[#221D1D]"
                >
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E7E4E7] flex items-center justify-end gap-2">
              <button
                onClick={() => setCouponModal({ open: false, mode: "add", data: {} })}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#4D433F] hover:bg-[#F7F7F5] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!couponModal.data.code) return alert("Please enter coupon code");
                  const isAdd = couponModal.mode === "add";
                  const payload: CouponRecord = {
                    id: couponModal.data.id || `cp-${Date.now()}`,
                    code: (couponModal.data.code || "").toUpperCase(),
                    discountPercent: Number(couponModal.data.discountPercent) || 20,
                    minOrder: Number(couponModal.data.minOrder) || 99,
                    maxUses: Number(couponModal.data.maxUses) || 500,
                    usedCount: Number(couponModal.data.usedCount) || 0,
                    expiryDate: couponModal.data.expiryDate || "2026-12-31",
                    status: couponModal.data.status || "Active",
                  };
                  const next = isAdd ? [...coupons, payload] : coupons.map((c) => (c.id === payload.id ? payload : c));
                  setCoupons(next);
                  localStorage.setItem("lawkaksha_admin_coupons", JSON.stringify(next));
                  setCouponModal({ open: false, mode: "add", data: {} });
                  try {
                    await adminFetch(`/api/admin/coupons${!isAdd ? "/" + payload.id : ""}`, {
                      method: isAdd ? "POST" : "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    showToast("Coupon saved!");
                  } catch (e) {}
                }}
                className="px-5 py-2 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Coupon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. IN-APP PDF PREVIEW INSPECTOR MODAL */}
      {previewPdfModal.open && (
        <div className="fixed inset-0 z-50 bg-[#221D1D]/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-[#E7E4E7] flex flex-col max-h-[92vh] overflow-hidden">
            {/* MODAL HEADER */}
            <div className="px-5 py-4 border-b border-[#E7E4E7] flex items-center justify-between gap-3 bg-[#F7F7F5]">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C4E1EC]/60 text-[#221D1D] border border-[#AED7E9]">
                    {previewPdfModal.category || "Study Resource"}
                  </span>
                  {previewPdfModal.isSample && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#AED7E9]/40 text-[#221D1D] border border-[#AED7E9]">
                      Free Preview
                    </span>
                  )}
                  {previewPdfModal.pages && (
                    <span className="text-[11px] text-[#77716E] font-mono">
                      {previewPdfModal.pages}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-[#221D1D] truncate mt-1 font-serif">
                  {previewPdfModal.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAdmin3dReader({
                      open: true,
                      title: previewPdfModal.title,
                      pdfUrl: previewPdfModal.pdfUrl,
                    });
                    setPreviewPdfModal({ open: false, title: "", pdfUrl: "" });
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  title="Open in 3D Hardcover Codex Reader"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Launch 3D Reader</span>
                </button>
                <a
                  href={`/reader?file=${encodeURIComponent(previewPdfModal.pdfUrl.split('/').pop() || '')}&title=${encodeURIComponent(previewPdfModal.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-white border border-[#E7E4E7] text-[#221D1D] hover:bg-[#F7F7F5] text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                  title="Open in The Law Kaksha DRM Reader (Download Restricted)"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#4B8097]" />
                  <span className="hidden sm:inline">Open Reader in Tab</span>
                </a>
                <button
                  onClick={() => setPreviewPdfModal({ open: false, title: "", pdfUrl: "" })}
                  className="p-1.5 rounded-xl text-[#77716E] hover:text-[#221D1D] hover:bg-[#E7E4E7] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* MODAL BODY (SECURE DRM VIEWER EMBED) */}
            <div className="flex-1 p-4 bg-[#F7F7F5] overflow-hidden relative flex flex-col">
              <div className="relative flex-1 w-full rounded-2xl overflow-hidden border border-[#E7E4E7] bg-white shadow-inner flex flex-col">
                <iframe
                  src={`/reader?file=${encodeURIComponent(previewPdfModal.pdfUrl.split('/').pop() || '')}&title=${encodeURIComponent(previewPdfModal.title)}&embedded=true`}
                  title={previewPdfModal.title}
                  className="w-full h-full min-h-[50vh] sm:min-h-[60vh] border-0"
                />

                {/* SIMULATED DRM WATERMARK STRIP */}
                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-[#221D1D]/90 backdrop-blur-md text-white text-[11px] font-mono pointer-events-none flex items-center gap-2 border border-white/10 shadow-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#4B8097]" />
                  <span>The Law Kaksha DRM Protected • Direct Download Disabled</span>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="px-5 py-3 border-t border-[#E7E4E7] flex items-center justify-between text-xs text-[#77716E] bg-white">
              <div className="flex items-center gap-1.5 text-[11px] text-[#4B8097] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>DRM Protection Active • Direct PDF Download Disabled</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAdmin3dReader({
                      open: true,
                      title: previewPdfModal.title,
                      pdfUrl: previewPdfModal.pdfUrl,
                    });
                    setPreviewPdfModal({ open: false, title: "", pdfUrl: "" });
                  }}
                  className="px-4 py-1.5 rounded-full bg-[#AED7E9] hover:bg-[#98C5D8] text-[#221D1D] font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Experience 3D Flipbook</span>
                </button>
                <button
                  onClick={() => setPreviewPdfModal({ open: false, title: "", pdfUrl: "" })}
                  className="px-4 py-1.5 rounded-full bg-[#221D1D] hover:bg-[#383130] text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. REAL 3D CODEX READER IN ADMIN PANEL */}
      <SecurePdfReader
        isOpen={admin3dReader.open}
        onClose={() => setAdmin3dReader({ open: false, title: "", pdfUrl: "" })}
        pdfUrl={admin3dReader.pdfUrl}
        title={admin3dReader.title}
        isPurchased={true}
        studentName="Administrator"
        studentRoll="LK-ADMIN-CHIEF"
      />

    </div>
  );
}
