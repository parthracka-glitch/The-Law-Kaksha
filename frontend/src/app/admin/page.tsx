"use client";

import React, { useState, useEffect, useMemo, useRef, useTransition, useCallback } from "react";
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
  X,
  Lock,
  Unlock,
  LogOut,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
  Key,
  Menu,
  UploadCloud,
  Layers,
  RefreshCw,
  Eye,
  AlertTriangle,
  Download,
  MessageCircle,
  Megaphone,
  Send,
  Share2,
  ArrowRight,
  DollarSign,
  FileSpreadsheet,
  Settings,
} from "lucide-react";
import { SecurePdfReader } from "@/components/SecurePdfReader";
import { type PromoPassCard, type PromoBannersSetting, DEFAULT_PROMO_BANNERS } from "@/types/promo";
import { getApiBaseUrl } from "@/lib/api";
import { AdminOrdersTab } from "@/components/admin/AdminOrdersTab";
import { AdminCarouselTab } from "@/components/admin/AdminCarouselTab";
import { AdminExpensesTab } from "@/components/admin/AdminExpensesTab";
import { AdminOffersTab } from "@/components/admin/AdminOffersTab";
import { AdminPaymentsTab } from "@/components/admin/AdminPaymentsTab";
import { AdminSettingsTab } from "@/components/admin/AdminSettingsTab";
import { AdminExamCountdownAndQOTDTab } from "@/components/admin/AdminExamCountdownAndQOTDTab";
import { AdminBroadcastTab } from "@/components/admin/AdminBroadcastTab";
import { AdminCoursesContentTab } from "@/components/admin/AdminCoursesContentTab";

const SHOW_MCQ_TAB = false;

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
  cover_image?: string;
  isSample?: boolean;
  previewPagesLimit?: number;
  samplePagesRange?: string;
}

export interface ResourceItem {
  id: string;
  course: "ca-foundation" | "cseet" | string;
  actName: string;
  chapterNumber: number;
  type: "notes" | "flowchart" | "practice" | "pyq" | "case_study" | "ldr" | "infographic";
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

function normalizeUnits(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[];
  if (typeof value === "string") return value.split(",").map((s) => s.trim());
  return ["Chapter 1"];
}

// --- INITIAL SEED DATA ---
const INITIAL_PRODUCTS: ProductItem[] = [];

const INITIAL_RESOURCES: ResourceItem[] = [];

const INITIAL_SUBSCRIPTIONS: SubscriptionRecord[] = [];

const INITIAL_STUDENTS: StudentRecord[] = [];

const INITIAL_CASES: CaseStudyItem[] = [];

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

  type TabType =
    | "overview"
    | "orders"
    | "subscriptions"
    | "books_and_notes"
    | "carousel"
    | "expenses"
    | "offers"
    | "students"
    | "cases"
    | "mcq"
    | "coupons"
    | "payments"
    | "settings"
    | "qotd"
    | "exam_countdown_qotd"
    | "promo_banners"
    | "broadcast";
  const [activeTab, _setActiveTab] = useState<TabType>("overview");
  const [, startTabTransition] = useTransition();

  const setActiveTab = useCallback((action: TabType | ((prev: TabType) => TabType)) => {
    startTabTransition(() => {
      _setActiveTab(action);
    });
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [, setMaterialSubTab] = useState<"all" | "books" | "notes">("all");
  const [subFilterTab, setSubFilterTab] = useState<"all" | "active" | "expiring_soon" | "revoked">("all");
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [studentStatusFilter, setStudentStatusFilter] = useState<"all" | "active" | "blocked">("all");

  const handleToggleStudentDrm = async (std: StudentRecord) => {
    try {
      const nextDrm = !std.drm_access;
      const updated = students.map((s) => (s.id === std.id ? { ...s, drm_access: nextDrm } : s));
      setStudents(updated);
      localStorage.setItem("lawkaksha_admin_students", JSON.stringify(updated));
      showToast(`DRM Access ${nextDrm ? "Activated" : "Blocked"} for ${std.name}`);
      await adminFetch(`/api/admin/students/${std.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drm_access: nextDrm }),
      });
    } catch {
      showToast("Access updated locally.");
    }
  };

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
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>(INITIAL_SUBSCRIPTIONS);
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [cases, setCases] = useState<CaseStudyItem[]>(INITIAL_CASES);
  const [mcqTests, setMcqTests] = useState<GoogleFormTestItem[]>(INITIAL_MCQ_TESTS);
  const [coupons, setCoupons] = useState<CouponRecord[]>(INITIAL_COUPONS);
  const [, setExamSettings] = useState<ExamCountdownSetting[]>([
    { id: "ex-1", exam: "CSEET Business Laws and Management", date: "2026-11-12", session: "November 2026 Attempt" },
    { id: "ex-2", exam: "CA Foundation Paper 2 (Business Laws)", date: "2026-12-20", session: "December 2026 Attempt" },
  ]);
  const [, setQotd] = useState<QotdSetting>({
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
  const thumbnailFileInputRef = useRef<HTMLInputElement>(null);
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

  const API_URL = getApiBaseUrl();
  const [isAtlasConnected, setIsAtlasConnected] = useState<boolean>(true);

  // Authenticated Admin API Fetch Helper with Bearer Token Injection
  const adminFetch = useCallback((endpoint: string, init?: RequestInit) => {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage.getItem("lawkaksha_token") || "";
      if (!token) {
        try {
          const sess = JSON.parse(localStorage.getItem("lawkaksha_admin_session") || "{}");
          token = sess.token || "";
        } catch {}
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
  }, [API_URL]);

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
        } catch {}
      }

      if (!isValidAdmin) {
        setIsAuthorized(false);
        setIsCheckingAuth(false);
        router.push("/login?redirect=/admin");
        return;
      }

      setIsAuthorized(true);
      setIsCheckingAuth(false);


      // Load live data from MongoDB Atlas
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

          if (pRes.status === "fulfilled" && Array.isArray(pRes.value?.products)) {
            setProducts(pRes.value.products);
            localStorage.setItem("lawkaksha_admin_products", JSON.stringify(pRes.value.products));
          }
          if (rRes.status === "fulfilled" && Array.isArray(rRes.value?.resources)) {
            setResources(rRes.value.resources);
            localStorage.setItem("lawkaksha_admin_resources", JSON.stringify(rRes.value.resources));
          }
          if (sRes.status === "fulfilled" && Array.isArray(sRes.value?.subscriptions)) {
            setSubscriptions(sRes.value.subscriptions);
            localStorage.setItem("lawkaksha_admin_subs", JSON.stringify(sRes.value.subscriptions));
          }
          if (stdRes.status === "fulfilled" && Array.isArray(stdRes.value?.students)) {
            setStudents(stdRes.value.students);
            localStorage.setItem("lawkaksha_admin_students", JSON.stringify(stdRes.value.students));
          }
          if (cRes.status === "fulfilled" && Array.isArray(cRes.value?.cases)) {
            setCases(cRes.value.cases);
            localStorage.setItem("lawkaksha_admin_cases", JSON.stringify(cRes.value.cases));
          }
          if (mRes.status === "fulfilled" && Array.isArray(mRes.value?.tests)) {
            setMcqTests(mRes.value.tests);
            localStorage.setItem("lawkaksha_admin_mcqs", JSON.stringify(mRes.value.tests));
          }
          if (cpRes.status === "fulfilled" && Array.isArray(cpRes.value?.coupons)) {
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
  }, [router, API_URL, adminFetch]);

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
    } catch (err) {
      showToast("Upload error: " + (err instanceof Error ? err.message : String(err)));
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
      window.dispatchEvent(new CustomEvent("lawkaksha_announcement_updated", { detail: announcement }));
      await adminFetch(`/api/admin/announcement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ announcement }),
      });
      showToast("Live broadcast announcement updated!");
    } catch {
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
    } catch {
      showToast("Saved to local cache.");
    } finally {
      setIsSavingPromo(false);
    }
  };

  if (isCheckingAuth || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-9 h-9 border-2 border-[#AED7E9] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-[#221D1D]">Verifying Admin Dashboard authorization...</p>
      </div>
    );
  }

  const MATERIALS_TABS: TabType[] = ["books_and_notes", "cases", "mcq", "qotd"];
  const SALES_TABS: TabType[] = ["orders", "subscriptions", "coupons", "payments", "expenses"];
  const WEBSITE_TABS: TabType[] = ["broadcast", "carousel", "promo_banners", "settings", "offers"];

  type HubId = "overview" | "students" | "materials" | "sales" | "website";

  const activeHub: HubId =
    activeTab === "overview"
      ? "overview"
      : activeTab === "students"
      ? "students"
      : MATERIALS_TABS.includes(activeTab)
      ? "materials"
      : SALES_TABS.includes(activeTab)
      ? "sales"
      : "website";

  const SHORTLISTED_NAV = [
    {
      id: "overview" as HubId,
      label: "Admin Dashboard",
      description: "Quick stats & revenue ledger",
      icon: LayoutDashboard,
      badge: undefined,
      defaultTab: "overview" as TabType,
    },
    {
      id: "students" as HubId,
      label: "Students",
      description: "Directory & DRM access",
      icon: Users,
      badge: students.length,
      defaultTab: "students" as TabType,
    },
    {
      id: "materials" as HubId,
      label: "Study Materials",
      description: "Notes, tests & live classes",
      icon: BookOpen,
      badge: products.length + resources.length,
      defaultTab: "books_and_notes" as TabType,
    },
    {
      id: "sales" as HubId,
      label: "Orders & Sales",
      description: "Subscriptions & revenue",
      icon: CreditCard,
      badge: subscriptions.length,
      defaultTab: "orders" as TabType,
    },
    {
      id: "website" as HubId,
      label: "Website & Branding",
      description: "Broadcast bar, hero & passes",
      icon: Settings,
      badge: announcement.enabled ? "LIVE" : undefined,
      defaultTab: "broadcast" as TabType,
    },
  ];

  const HUB_HEADERS: Record<HubId, { title: string; subtitle: string }> = {
    overview: {
      title: "Admin Dashboard",
      subtitle: "Welcome back! Here is your live platform summary and quick revenue metrics.",
    },
    students: {
      title: "Students Directory",
      subtitle: "View registered students, instant search, and 1-click DRM permissions.",
    },
    materials: {
      title: "Study Materials & Courseware",
      subtitle: "Manage digital codices, chapter notes, live batches, case studies, and tests.",
    },
    sales: {
      title: "Orders, Passes & Revenue",
      subtitle: "Student transactions, active subscriptions, discount coupons, and financial ledger.",
    },
    website: {
      title: "Website & Brand Customization",
      subtitle: "Live broadcast announcement bar, homepage hero carousel, and student dashboard settings.",
    },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-full bg-[#0A192F] text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* MOBILE SIDEBAR BACKDROP */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 1. SHORTLISTED MINIMAL SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 bg-white border-r border-[#CBD5E1] flex flex-col min-h-screen transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* LOGO & ADMIN BADGE */}
        <div className="px-4 pt-5 pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className="flex items-center shrink-0">
              <div className="relative h-8 w-28">
                <Image src="/assets/logo-transparent.png" alt="The Law Kaksha" fill className="object-contain object-left" priority />
              </div>
            </Link>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#005A9C]" />
              <span className="text-[11px] font-bold text-[#005A9C]">Admin Dashboard</span>
            </div>
          </div>
        </div>

        {/* 5 SHORTLISTED NAVIGATION HUBS */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {SHORTLISTED_NAV.map((nav) => {
            const Icon = nav.icon;
            const isNavActive = activeHub === nav.id;
            return (
              <button
                key={nav.id}
                type="button"
                onClick={() => {
                  if (nav.id === "materials") {
                    setActiveTab((prev) => (MATERIALS_TABS.includes(prev) ? prev : nav.defaultTab));
                  } else if (nav.id === "sales") {
                    setActiveTab((prev) => (SALES_TABS.includes(prev) ? prev : nav.defaultTab));
                  } else if (nav.id === "website") {
                    setActiveTab((prev) => (WEBSITE_TABS.includes(prev) ? prev : nav.defaultTab));
                  } else {
                    setActiveTab(nav.defaultTab);
                  }
                  setSearchQuery("");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150 cursor-pointer text-left min-h-[46px] ${
                  isNavActive
                    ? "bg-[#EFF6FF] text-[#005A9C] font-bold border border-[#BFDBFE] shadow-xs"
                    : "text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0A192F]"
                }`}
              >
                <Icon className={`shrink-0 ${isNavActive ? "text-[#005A9C]" : "text-[#64748B]"}`} style={{ width: 18, height: 18 }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold leading-tight">{nav.label}</p>
                  <p className={`text-[11px] font-medium truncate mt-0.5 ${isNavActive ? "text-[#005A9C]" : "text-[#64748B]"}`}>{nav.description}</p>
                </div>
                {nav.badge !== undefined && (typeof nav.badge === "number" ? nav.badge > 0 : Boolean(nav.badge)) && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    nav.badge === "LIVE"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : isNavActive
                      ? "bg-[#DBEAFE] text-[#005A9C]"
                      : "bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1]"
                  }`}>
                    {nav.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* BOTTOM ADMIN PROFILE */}
        <div className="p-3.5 border-t border-[#E2E8F0]">
          <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#005A9C] text-xs font-bold flex items-center justify-center shrink-0 shadow-xs border border-[#BFDBFE]">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#0A192F] truncate">The Law Kaksha</p>
              <p className="text-[11px] text-[#475569] font-medium leading-none mt-0.5">Admin Dashboard</p>
            </div>
            <button
              onClick={handleLogout}
              title="Log Out"
              className="p-1.5 rounded-xl text-[#64748B] hover:text-[#DC2626] hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* STICKY TOP HEADER */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#CBD5E1] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white border border-[#CBD5E1] text-[#0A192F] hover:bg-[#F8FAFC] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-[#0A192F]">
                {HUB_HEADERS[activeHub]?.title || "Admin Dashboard"}
              </h1>
              <p className="text-xs text-[#475569] font-medium leading-none mt-1">
                {HUB_HEADERS[activeHub]?.subtitle || "The Law Kaksha Admin Control Center"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isAtlasConnected
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : "bg-amber-50 text-amber-800 border-amber-300"
            }`}>
              <span className={`w-2 h-2 rounded-full shrink-0 ${isAtlasConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
              <span className="hidden sm:inline font-bold">{isAtlasConnected ? "Database Connected" : "Local Sync Active"}</span>
              <span className="sm:hidden font-bold">{isAtlasConnected ? "Live DB" : "Sync"}</span>
            </div>
          </div>
        </header>

        {/* TAB WORKSPACES */}
        <div className="p-3 sm:p-6 space-y-6 max-w-6xl">

          {/* SUB-NAV PILLS FOR STUDY MATERIALS */}
          {activeHub === "materials" && (
            <div className="bg-white rounded-2xl border border-[#CBD5E1] p-1.5 shadow-2xs flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none touch-pan-x">
              <button
                type="button"
                onClick={() => setActiveTab("books_and_notes")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === "books_and_notes"
                    ? "bg-[#EFF6FF] text-[#005A9C] font-bold shadow-xs border border-[#BFDBFE]"
                    : "text-[#475569] hover:text-[#0A192F] hover:bg-[#F8FAFC]"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#005A9C]" />
                <span>Books & Notes</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#F1F5F9] text-[#1E293B] border border-[#CBD5E1]">
                  {products.length + resources.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("cases")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === "cases"
                    ? "bg-[#EFF6FF] text-[#005A9C] font-bold shadow-xs border border-[#BFDBFE]"
                    : "text-[#475569] hover:text-[#0A192F] hover:bg-[#F8FAFC]"
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-[#005A9C]" />
                <span>Case Studies</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#F1F5F9] text-[#1E293B] border border-[#CBD5E1]">
                  {cases.length}
                </span>
              </button>
              {SHOW_MCQ_TAB && (
                <button
                  type="button"
                  onClick={() => setActiveTab("mcq")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    activeTab === "mcq"
                      ? "bg-[#EFF6FF] text-[#005A9C] font-bold shadow-xs border border-[#BFDBFE]"
                      : "text-[#475569] hover:text-[#0A192F] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#005A9C]" />
                  <span>MCQ Tests</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#F1F5F9] text-[#1E293B] border border-[#CBD5E1]">
                    {mcqTests.length}
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveTab("exam_countdown_qotd")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === "exam_countdown_qotd" || activeTab === "qotd"
                    ? "bg-[#EFF6FF] text-[#005A9C] font-bold shadow-xs border border-[#BFDBFE]"
                    : "text-[#475569] hover:text-[#0A192F] hover:bg-[#F8FAFC]"
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-[#005A9C]" />
                <span>Exam Dates &amp; QOTD</span>
              </button>
            </div>
          )}

          {/* SUB-NAV PILLS FOR ORDERS & SALES */}
          {activeHub === "sales" && (
            <div className="bg-white rounded-2xl border border-[#CBD5E1] p-1.5 shadow-2xs flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none touch-pan-x">
              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === "orders"
                    ? "bg-[#EFF6FF] text-[#005A9C] font-bold shadow-xs border border-[#BFDBFE]"
                    : "text-[#475569] hover:text-[#0A192F] hover:bg-[#F8FAFC]"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-[#005A9C]" />
                <span>Orders & Bookings</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("subscriptions")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === "subscriptions"
                    ? "bg-[#EFF6FF] text-[#005A9C] font-bold shadow-xs border border-[#BFDBFE]"
                    : "text-[#475569] hover:text-[#0A192F] hover:bg-[#F8FAFC]"
                }`}
              >
                <Key className="w-3.5 h-3.5 text-[#005A9C]" />
                <span>Subscriptions</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#F1F5F9] text-[#1E293B] border border-[#CBD5E1]">
                  {subscriptions.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("coupons")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === "coupons"
                    ? "bg-[#EFF6FF] text-[#005A9C] font-bold shadow-xs border border-[#BFDBFE]"
                    : "text-[#475569] hover:text-[#0A192F] hover:bg-[#F8FAFC]"
                }`}
              >
                <Percent className="w-3.5 h-3.5 text-[#005A9C]" />
                <span>Coupons</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#F1F5F9] text-[#1E293B] border border-[#CBD5E1]">
                  {coupons.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("payments")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === "payments"
                    ? "bg-[#EFF6FF] text-[#005A9C] font-bold shadow-xs border border-[#BFDBFE]"
                    : "text-[#475569] hover:text-[#0A192F] hover:bg-[#F8FAFC]"
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#005A9C]" />
                <span>Payments Ledger</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("expenses")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === "expenses"
                    ? "bg-[#EFF6FF] text-[#005A9C] font-bold shadow-xs border border-[#BFDBFE]"
                    : "text-[#475569] hover:text-[#0A192F] hover:bg-[#F8FAFC]"
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-[#005A9C]" />
                <span>Expenses & P&L</span>
              </button>
            </div>
          )}

          {/* SUB-NAV PILLS FOR WEBSITE & BRANDING */}
          {activeHub === "website" && (
            <div className="bg-white rounded-2xl border border-[#CBD5E1] p-1.5 shadow-2xs flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none touch-pan-x">
              <button
                type="button"
                onClick={() => setActiveTab("broadcast")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === "broadcast"
                    ? "bg-[#EFF6FF] text-[#005A9C] font-bold shadow-xs border border-[#BFDBFE]"
                    : "text-[#475569] hover:text-[#0A192F] hover:bg-[#F8FAFC]"
                }`}
              >
                <Megaphone className="w-3.5 h-3.5 text-[#005A9C]" />
                <span>Live Broadcast Bar</span>
                {announcement.enabled && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("carousel")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === "carousel"
                    ? "bg-[#EFF6FF] text-[#005A9C] font-bold shadow-xs border border-[#BFDBFE]"
                    : "text-[#475569] hover:text-[#0A192F] hover:bg-[#F8FAFC]"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#005A9C]" />
                <span>Homepage Hero Carousel</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("promo_banners")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === "promo_banners"
                    ? "bg-[#EFF6FF] text-[#005A9C] font-bold shadow-xs border border-[#BFDBFE]"
                    : "text-[#475569] hover:text-[#0A192F] hover:bg-[#F8FAFC]"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#005A9C]" />
                <span>Student Codex Passes</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === "settings"
                    ? "bg-[#EFF6FF] text-[#005A9C] font-bold shadow-xs border border-[#BFDBFE]"
                    : "text-[#475569] hover:text-[#0A192F] hover:bg-[#F8FAFC]"
                }`}
              >
                <Settings className="w-3.5 h-3.5 text-[#005A9C]" />
                <span>Platform Settings</span>
              </button>
            </div>
          )}

          {/* COMPACT BROADCAST STATUS STRIP (VISIBLE ON OTHER WEBSITE SUB-TABS) */}
          {activeHub === "website" && activeTab !== "broadcast" && (
            <div className="bg-white rounded-2xl border border-[#CBD5E1] p-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs animate-in fade-in">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${
                    announcement.enabled
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                      : "bg-[#F1F5F9] border-[#CBD5E1] text-[#64748B]"
                  }`}
                >
                  <Megaphone className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                  <span className="font-bold text-[#0A192F] shrink-0">Live Broadcast Bar:</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      announcement.enabled
                        ? "bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]"
                        : "bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]"
                    }`}
                  >
                    {announcement.enabled ? "● Live / Active" : "○ Hidden"}
                  </span>
                  <span className="text-[#334155] truncate max-w-sm sm:max-w-md font-medium">
                    {announcement.enabled
                      ? (announcement.text || "Announcement active")
                      : "No announcement currently showing on the website"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={async () => {
                    const updated = { ...announcement, enabled: !announcement.enabled };
                    setAnnouncement(updated);
                    localStorage.setItem("lawkaksha_admin_announcement", JSON.stringify(updated));
                    window.dispatchEvent(
                      new CustomEvent("lawkaksha_announcement_updated", { detail: updated })
                    );
                    try {
                      await adminFetch(`/api/admin/announcement`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ announcement: updated }),
                      });
                      showToast(updated.enabled ? "Live broadcast turned ON!" : "Live broadcast turned OFF!");
                    } catch {
                      showToast("Saved locally");
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#0A192F] cursor-pointer transition-colors"
                >
                  {announcement.enabled ? "Quick Turn Off" : "Quick Turn On"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("broadcast")}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#005A9C] border border-[#BFDBFE] flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                >
                  <span>Edit Broadcast</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB WORKSPACE CONTENT WITH SMOOTH TRANSITION */}
          <div key={activeTab} className="tab-panel-smooth">
            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
            <div className="space-y-6">
              {/* TOP HERO BANNER */}
              <div className="rounded-3xl bg-gradient-to-r from-[#EFF6FF] via-[#E0F2FE] to-[#DBEAFE] p-6 text-[#0A192F] border border-[#BFDBFE] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#005A9C] bg-white px-2.5 py-0.5 rounded-full border border-[#BFDBFE]">Admin Operations Portal</span>
                  <h2 className="text-2xl font-bold text-[#0A192F] mt-1">Dashboard Overview</h2>
                  <p className="text-[#334155] text-xs sm:text-sm font-medium leading-relaxed max-w-lg">
                    Real-time overview of active student passes, DRM codices, daily case studies, and live revenue.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-center bg-white/95 rounded-2xl p-4 min-w-[100px] border border-[#BFDBFE] shadow-xs">
                    <TrendingUp className="w-5 h-5 text-[#005A9C] mx-auto mb-1" />
                    <p className="text-xl font-bold text-[#0A192F]">₹{totalRevenue.toLocaleString()}</p>
                    <p className="text-[10px] text-[#475569] uppercase tracking-wide font-bold">Total Sales</p>
                  </div>
                  <div className="text-center bg-white/95 rounded-2xl p-4 min-w-[100px] border border-[#BFDBFE] shadow-xs">
                    <Key className="w-5 h-5 text-[#005A9C] mx-auto mb-1" />
                    <p className="text-xl font-bold text-[#0A192F]">{activeSubsCount}</p>
                    <p className="text-[10px] text-[#475569] uppercase tracking-wide font-bold">Active Passes</p>
                  </div>
                </div>
              </div>

              {/* QUICK OWNER SHORTCUTS */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#CBD5E1] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#005A9C] shrink-0">
                    <Sparkles className="w-4 h-4 text-[#005A9C]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0A192F]">Owner Quick Shortcuts</h4>
                    <p className="text-[11px] text-[#475569] font-medium">Fastest actions for everyday management.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setStudentModal({ open: true, mode: "add", data: { is_active: true, drm_access: true, target_exam: "CA Foundation Paper 2" } })}
                    className="px-3.5 py-2 rounded-full bg-[#005A9C] hover:bg-[#004F8A] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("books_and_notes");
                      setMaterialSubTab("books");
                    }}
                    className="px-3.5 py-2 rounded-full bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#0A192F] text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#005A9C]" />
                    <span>Upload Notes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("coupons");
                      setCouponModal({ open: true, mode: "add", data: { status: "Active", discountPercent: 15, minOrder: 99, maxUses: 100 } });
                    }}
                    className="px-3.5 py-2 rounded-full bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#0A192F] text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                  >
                    <Percent className="w-3.5 h-3.5 text-[#005A9C]" />
                    <span>New Coupon</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("carousel")}
                    className="px-3.5 py-2 rounded-full bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#0A192F] text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#005A9C]" />
                    <span>Homepage Carousel</span>
                  </button>
                </div>
              </div>

              {/* STAT CARDS - CLICKABLE WITH HOVER */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("books_and_notes")}
                  className="bg-white rounded-3xl p-5 border border-[#CBD5E1] hover:border-[#005A9C] hover:shadow-md text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] text-[#005A9C] flex items-center justify-center border border-[#BFDBFE] group-hover:bg-[#DBEAFE] transition-colors">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:text-[#005A9C] group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-xs text-[#475569] font-bold uppercase tracking-wider">Study Materials</p>
                  <h3 className="text-xl font-bold text-[#0A192F] mt-0.5">{products.length + resources.length} Items</h3>
                  <p className="text-[11px] text-[#005A9C] font-semibold mt-1">{products.length} Books • {resources.length} Notes</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("subscriptions")}
                  className="bg-white rounded-3xl p-5 border border-[#CBD5E1] hover:border-[#005A9C] hover:shadow-md text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] text-[#005A9C] flex items-center justify-center border border-[#BFDBFE] group-hover:bg-[#DBEAFE] transition-colors">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:text-[#005A9C] group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-xs text-[#475569] font-bold uppercase tracking-wider">Subscriptions</p>
                  <h3 className="text-xl font-bold text-[#0A192F] mt-0.5">{subscriptions.length} Passes</h3>
                  <p className="text-[11px] text-[#005A9C] font-semibold mt-1">{activeSubsCount} Active Passes</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("students")}
                  className="bg-white rounded-3xl p-5 border border-[#CBD5E1] hover:border-[#005A9C] hover:shadow-md text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] text-[#005A9C] flex items-center justify-center border border-[#BFDBFE] group-hover:bg-[#DBEAFE] transition-colors">
                      <Users className="w-5 h-5" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:text-[#005A9C] group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-xs text-[#475569] font-bold uppercase tracking-wider">Students Directory</p>
                  <h3 className="text-xl font-bold text-[#0A192F] mt-0.5">{students.length} Registered</h3>
                  <p className="text-[11px] text-[#005A9C] font-semibold mt-1">{activeStudentsCount} Active Access</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("students")}
                  className="bg-white rounded-3xl p-5 border border-[#CBD5E1] hover:border-[#005A9C] hover:shadow-md text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] text-[#005A9C] flex items-center justify-center border border-[#BFDBFE] group-hover:bg-[#DBEAFE] transition-colors">
                      <ShieldCheck className="w-5 h-5 text-[#005A9C]" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:text-[#005A9C] group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-xs text-[#475569] font-bold uppercase tracking-wider">DRM Protection</p>
                  <h3 className="text-xl font-bold text-[#0A192F] mt-0.5">Active</h3>
                  <p className="text-[11px] text-[#005A9C] font-semibold mt-1">1-Click Toggle Mode</p>
                </button>
              </div>

              {/* LIVE ANNOUNCEMENT STATUS SHORTCUT IN OVERVIEW */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#CBD5E1] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                      announcement.enabled
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                        : "bg-[#F1F5F9] border-[#CBD5E1] text-[#64748B]"
                    }`}
                  >
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#0A192F]">Live Website Announcement Bar</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          announcement.enabled
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]"
                        }`}
                      >
                        {announcement.enabled ? "● Active & Visible" : "○ Currently Hidden"}
                      </span>
                    </div>
                    <p className="text-xs text-[#475569] font-medium mt-0.5">
                      {announcement.enabled
                        ? (announcement.text || "Your marquee announcement is broadcasting across the site.")
                        : "Announcement bar is turned off. Turn it on to show broadcast ticker to students."}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab("broadcast")}
                    className="px-4 py-2 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] hover:bg-[#DBEAFE] text-[#005A9C] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Configure Broadcast</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
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

                const updateCardField = <K extends keyof PromoPassCard>(field: K, val: PromoPassCard[K]) => {
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
                          onChange={(e) => updateCardField("actionType", e.target.value as PromoPassCard["actionType"])}
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
                  <h2 className="text-xl font-bold text-[#0A192F]">Subscriptions &amp; Student Passes</h2>
                  <p className="text-xs text-[#475569] font-medium mt-0.5">Manage 30-day monthly passes, renewals, and WhatsApp reminder triggers.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportSubscriptions}
                    className="px-4 py-2 rounded-full bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#0A192F] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    title="Export all subscriptions as CSV file"
                  >
                    <Download className="w-3.5 h-3.5 text-[#005A9C]" />
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
                    className="px-4 py-2 rounded-full bg-[#005A9C] hover:bg-[#004F8A] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span>Add Subscription</span>
                  </button>
                </div>
              </div>

              {/* EXPIRING SOON ALERT BANNER */}
              {expiringSoonCount > 0 && (
                <div className="p-4 rounded-3xl bg-amber-50 border border-amber-300 text-[#0A192F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 border border-amber-200">
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0A192F]">
                        {expiringSoonCount} Student Pass{expiringSoonCount > 1 ? "es" : ""} Expiring Soon (≤ 5 Days)
                      </p>
                      <p className="text-[#475569] text-[11px] font-medium mt-0.5">
                        Click the green WhatsApp button next to any student to send an instant pre-formatted renewal link.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSubFilterTab("expiring_soon")}
                    className="px-3.5 py-1.5 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-xs shrink-0 transition-colors cursor-pointer"
                  >
                    View {expiringSoonCount} Expiring
                  </button>
                </div>
              )}

              {/* SEARCH & SUB-FILTERS */}
              <div className="bg-white rounded-2xl p-3.5 border border-[#CBD5E1] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-xl overflow-x-auto border border-[#CBD5E1]">
                  <button
                    onClick={() => setSubFilterTab("all")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      subFilterTab === "all" ? "bg-white text-[#0A192F] font-bold shadow-xs border border-[#CBD5E1]" : "text-[#475569] hover:text-[#0A192F]"
                    }`}
                  >
                    All Passes ({subscriptions.length})
                  </button>
                  <button
                    onClick={() => setSubFilterTab("active")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      subFilterTab === "active" ? "bg-emerald-100 text-emerald-900 font-bold shadow-xs border border-emerald-300" : "text-[#475569] hover:text-[#0A192F]"
                    }`}
                  >
                    Active ({activeSubsCount})
                  </button>
                  <button
                    onClick={() => setSubFilterTab("expiring_soon")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      subFilterTab === "expiring_soon" ? "bg-amber-100 text-amber-900 font-bold shadow-xs border border-amber-300" : "text-[#475569] hover:text-[#0A192F]"
                    }`}
                  >
                    Expiring Soon ({expiringSoonCount})
                  </button>
                  <button
                    onClick={() => setSubFilterTab("revoked")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      subFilterTab === "revoked" ? "bg-rose-100 text-rose-900 font-bold shadow-xs border border-rose-300" : "text-[#475569] hover:text-[#0A192F]"
                    }`}
                  >
                    Revoked ({subscriptions.filter((s) => s.accessStatus === "Revoked").length})
                  </button>
                </div>

                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-[#CBD5E1] w-full sm:w-64 shadow-2xs">
                  <Search className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                  <input
                    type="text"
                    placeholder="Search student, roll, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs text-[#0A192F] bg-transparent outline-none placeholder:text-[#64748B] font-medium"
                  />
                </div>
              </div>

              {/* SUBSCRIPTIONS LIST */}
              <div className="bg-white rounded-3xl border border-[#CBD5E1] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[720px]">
                    <thead className="bg-[#F8FAFC] border-b border-[#CBD5E1] text-[#1E293B] font-bold text-[11px] uppercase tracking-wider">
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
                    <tbody className="divide-y divide-[#E2E8F0]">
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
                            <tr key={sub.id} className="hover:bg-[#F8FAFC] transition-colors">
                              <td className="py-3.5 px-4">
                                <p className="font-mono font-bold text-[#0A192F]">{sub.id}</p>
                                <p className="text-[11px] text-[#475569] font-medium">{sub.date}</p>
                              </td>
                              <td className="py-3.5 px-4">
                                <p className="font-bold text-[#0A192F]">{sub.studentName}</p>
                                <p className="text-[11px] text-[#005A9C] font-mono bg-[#EFF6FF] px-2 py-0.5 rounded-md inline-block mt-0.5 border border-[#BFDBFE] font-bold">{sub.studentRoll}</p>
                                <p className="text-[11px] text-[#475569] font-medium">{sub.email}</p>
                                {sub.phone && <p className="text-[11px] text-[#475569] font-mono font-medium">{sub.phone}</p>}
                              </td>
                              <td className="py-3.5 px-4">
                                <p className="text-[#0A192F] font-bold">{sub.item}</p>
                                <p className="text-[11px] text-[#475569] font-medium">{sub.targetExam}</p>
                              </td>
                              <td className="py-3.5 px-4">
                                <p className="text-xs font-bold font-serif text-[#0A192F]">{sub.amount}</p>
                                <p className="text-[11px] text-[#475569] font-medium">{sub.paymentMode}</p>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  isExpiring
                                    ? "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
                                    : "bg-[#EFF6FF] text-[#005A9C] border-[#BFDBFE]"
                                }`}>
                                  {sub.daysRemaining !== undefined ? `${sub.daysRemaining} days left` : "30 days"}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <button
                                  onClick={async () => {
                                    const nextStatus: SubscriptionRecord["accessStatus"] = sub.accessStatus === "Active" ? "Revoked" : "Active";
                                    const updated = subscriptions.map((item) => (item.id === sub.id ? { ...item, accessStatus: nextStatus } : item));
                                    setSubscriptions(updated);
                                    localStorage.setItem("lawkaksha_admin_subs", JSON.stringify(updated));
                                    showToast(`Access ${nextStatus} for ${sub.studentName}`);
                                    try {
                                      await adminFetch(`/api/admin/subscriptions/${sub.id}`, {
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ accessStatus: nextStatus }),
                                      });
                                    } catch {}
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
                                      } catch {}
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
                                        } catch {}
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

          {/* TAB 3: COURSES & CONTENT (STRUCTURED HIERARCHY - P5) */}
          {activeTab === "books_and_notes" && (
            <AdminCoursesContentTab
              adminFetch={adminFetch}
              showToast={showToast}
              onPreviewPdf={(item) =>
                setPreviewPdfModal({
                  open: true,
                  title: item.title,
                  pdfUrl: item.pdfUrl,
                  isSample: item.isSample,
                })
              }
            />
          )}

          {/* TAB 4: STUDENTS */}
          {activeTab === "students" && (() => {
            const activeCount = students.filter((s) => s.drm_access).length;
            const blockedCount = students.filter((s) => !s.drm_access).length;
            const query = studentSearchQuery.trim().toLowerCase();

            const filteredStudents = students.filter((std) => {
              const matchesSearch =
                !query ||
                std.name?.toLowerCase().includes(query) ||
                std.student_id?.toLowerCase().includes(query) ||
                std.email?.toLowerCase().includes(query) ||
                std.phone?.toLowerCase().includes(query) ||
                std.target_exam?.toLowerCase().includes(query);

              const matchesStatus =
                studentStatusFilter === "all" ||
                (studentStatusFilter === "active" && std.drm_access) ||
                (studentStatusFilter === "blocked" && !std.drm_access);

              return matchesSearch && matchesStatus;
            });

            return (
              <div className="space-y-5">
                {/* DIRECTORY HEADER & PRIMARY ACTIONS */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#0A192F]">Students Directory</h2>
                    <p className="text-xs text-[#334155] font-medium mt-0.5">
                      Effortlessly search students, toggle DRM permissions in 1-click, and manage registrations.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportStudents}
                      className="px-3.5 py-2 rounded-full bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#0A192F] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      title="Export all students as CSV file"
                    >
                      <Download className="w-3.5 h-3.5 text-[#005A9C]" />
                      <span>Export CSV</span>
                    </button>
                    <button
                      onClick={() => setStudentModal({ open: true, mode: "add", data: { is_active: true, drm_access: true, target_exam: "CA Foundation Paper 2" } })}
                      className="px-4 py-2 rounded-full bg-[#005A9C] hover:bg-[#004F8A] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4 text-white" />
                      <span>Add Student</span>
                    </button>
                  </div>
                </div>

                {/* SEARCH & FILTER CONTROLS */}
                <div className="bg-white rounded-2xl border border-[#CBD5E1] p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* SEARCH BAR */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                    <input
                      type="text"
                      value={studentSearchQuery}
                      onChange={(e) => setStudentSearchQuery(e.target.value)}
                      placeholder="Search by name, roll no, email, or mobile..."
                      className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-white border border-[#CBD5E1] focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/20 text-[#0A192F] placeholder-[#64748B] font-medium outline-none transition-all shadow-2xs"
                    />
                    {studentSearchQuery && (
                      <button
                        onClick={() => setStudentSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer"
                        title="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* STATUS FILTER PILLS & COUNT */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-xl border border-[#CBD5E1]">
                      <button
                        type="button"
                        onClick={() => setStudentStatusFilter("all")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          studentStatusFilter === "all"
                            ? "bg-white text-[#0A192F] shadow-xs font-bold border border-[#CBD5E1]"
                            : "text-[#475569] hover:text-[#0A192F]"
                        }`}
                      >
                        All ({students.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setStudentStatusFilter("active")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          studentStatusFilter === "active"
                            ? "bg-emerald-100 text-emerald-900 shadow-xs font-bold border border-emerald-300"
                            : "text-[#475569] hover:text-[#0A192F]"
                        }`}
                      >
                        Active ({activeCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setStudentStatusFilter("blocked")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          studentStatusFilter === "blocked"
                            ? "bg-rose-100 text-rose-900 shadow-xs font-bold border border-rose-300"
                            : "text-[#475569] hover:text-[#0A192F]"
                        }`}
                      >
                        Blocked ({blockedCount})
                      </button>
                    </div>

                    <span className="text-xs text-[#334155] px-1 font-semibold">
                      Showing {filteredStudents.length} of {students.length}
                    </span>
                  </div>
                </div>

                {/* STUDENTS TABLE */}
                <div className="bg-white rounded-3xl border border-[#CBD5E1] shadow-sm overflow-hidden">
                  {filteredStudents.length === 0 ? (
                    <div className="py-12 px-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-[#F8FAFC] border border-[#CBD5E1] mx-auto flex items-center justify-center text-[#64748B] mb-3">
                        <Users className="w-5 h-5 text-[#005A9C]" />
                      </div>
                      <h3 className="text-sm font-bold text-[#0A192F]">No students found</h3>
                      <p className="text-xs text-[#475569] font-medium mt-1 max-w-sm mx-auto">
                        {studentSearchQuery
                          ? `No student matching "${studentSearchQuery}" in ${studentStatusFilter} status.`
                          : "No students registered under the selected status filter."}
                      </p>
                      {(studentSearchQuery || studentStatusFilter !== "all") && (
                        <button
                          onClick={() => {
                            setStudentSearchQuery("");
                            setStudentStatusFilter("all");
                          }}
                          className="mt-3.5 px-4 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-bold text-[#005A9C] hover:bg-[#DBEAFE] transition-colors cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs min-w-[720px]">
                        <thead className="bg-[#F8FAFC] border-b border-[#CBD5E1] text-[#1E293B] font-bold text-[11px] uppercase tracking-wider">
                          <tr>
                            <th className="py-3 px-4">Student &amp; Roll No.</th>
                            <th className="py-3 px-4">Contact Info</th>
                            <th className="py-3 px-4">Target Exam</th>
                            <th className="py-3 px-4">Enrolled Courses</th>
                            <th className="py-3 px-4">DRM Access (1-Click Toggle)</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0]">
                          {filteredStudents.map((std) => (
                            <tr key={std.id} className="hover:bg-[#F8FAFC] transition-colors">
                              <td className="py-3.5 px-4">
                                <p className="font-bold text-[#0A192F] text-sm">{std.name}</p>
                                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-[#EFF6FF] text-[#005A9C] text-[11px] font-mono font-bold border border-[#BFDBFE]">
                                  {std.student_id}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <p className="text-[#0A192F] font-semibold text-xs">{std.email}</p>
                                <p className="text-[11px] text-[#475569] font-medium mt-0.5">{std.phone}</p>
                              </td>
                              <td className="py-3.5 px-4 font-semibold text-[#0A192F] text-xs">
                                {std.target_exam}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="flex flex-wrap gap-1">
                                  {std.enrolled_books && std.enrolled_books.length > 0 ? (
                                    std.enrolled_books.map((b, i) => (
                                      <span key={i} className="text-[11px] bg-[#F1F5F9] text-[#0A192F] font-semibold px-2.5 py-0.5 rounded-md border border-[#CBD5E1]">
                                        {b}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-[11px] text-[#475569] font-medium bg-[#F8FAFC] px-2.5 py-0.5 rounded border border-[#E2E8F0]">Standard Pass</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <button
                                  type="button"
                                  onClick={() => handleToggleStudentDrm(std)}
                                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                                    std.drm_access
                                      ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300"
                                      : "bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300"
                                  }`}
                                  title={`Click to ${std.drm_access ? "revoke/block" : "grant"} DRM access`}
                                >
                                  {std.drm_access ? (
                                    <>
                                      <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Active</span>
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="w-3.5 h-3.5 text-rose-600" />
                                      <span>Blocked</span>
                                    </>
                                  )}
                                </button>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setStudentModal({ open: true, mode: "edit", data: std })}
                                    className="p-1.5 rounded-xl bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#0A192F] transition-colors cursor-pointer"
                                    title="Edit Student Details"
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
                                        } catch {}
                                        showToast("Student deleted.");
                                      }
                                    }}
                                    className="p-1.5 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 hover:border-rose-300 transition-colors cursor-pointer"
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
                  )}
                </div>
              </div>
            );
          })()}

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
                              } catch {}
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

          {/* TAB 6: GOOGLE FORM MCQ TESTS (DORMANT BEHIND FEATURE FLAG) */}
          {SHOW_MCQ_TAB && activeTab === "mcq" && (
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
                                } catch {}
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
                            } catch {}
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

          {/* WEBSITE EDIT: EXAM COUNTDOWN & DAILY MCQ CHALLENGE */}
          {(activeTab === "exam_countdown_qotd" || activeTab === "qotd") && (
            <AdminExamCountdownAndQOTDTab adminFetch={adminFetch} showToast={showToast} />
          )}

          {/* MODULE B1: ORDERS & BOOKINGS MANAGEMENT */}
          {activeTab === "orders" && (
            <AdminOrdersTab adminFetch={adminFetch} showToast={showToast} />
          )}

          {/* MODULE B3: LIVE BROADCAST ANNOUNCEMENT BAR */}
          {activeTab === "broadcast" && (
            <AdminBroadcastTab
              announcement={announcement}
              setAnnouncement={setAnnouncement}
              handleSaveAnnouncement={handleSaveAnnouncement}
              isSavingAnnouncement={isSavingAnnouncement}
              showToast={showToast}
            />
          )}

          {/* MODULE B4: CAROUSEL SLIDES EDITOR */}
          {activeTab === "carousel" && (
            <AdminCarouselTab adminFetch={adminFetch} showToast={showToast} />
          )}

          {/* MODULE B6: EXPENSES TRACKER & P&L */}
          {activeTab === "expenses" && (
            <AdminExpensesTab adminFetch={adminFetch} showToast={showToast} />
          )}

          {/* MODULE B7: PROMOTIONAL OFFERS */}
          {activeTab === "offers" && (
            <AdminOffersTab adminFetch={adminFetch} showToast={showToast} />
          )}

          {/* MODULE B10: PAYMENTS LEDGER & CSV EXPORTS */}
          {activeTab === "payments" && (
            <AdminPaymentsTab adminFetch={adminFetch} showToast={showToast} />
          )}

          {/* MODULE B11: PLATFORM SETTINGS */}
          {activeTab === "settings" && (
            <AdminSettingsTab adminFetch={adminFetch} showToast={showToast} />
          )}

          </div>

        </div>
      </main>

      {/* --- CRUD MODALS --- */}

      {/* 1. RESOURCE ADD / EDIT MODAL */}
      {resourceModal.open && (
        <div className="fixed inset-0 z-50 bg-[#221D1D]/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-lg w-full shadow-2xl border border-[#E7E4E7] space-y-4 max-h-[92vh] overflow-y-auto">
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
                    onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, type: e.target.value as ResourceItem["type"] } })}
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] bg-white text-[#221D1D]"
                  >
                    <option value="notes">Chapter Notes</option>
                    <option value="flowchart">Flowchart</option>
                    <option value="infographic">Visual Infographics</option>
                    <option value="practice">Practice Questions</option>
                    <option value="pyq">PYQ Drill</option>
                    <option value="ldr">Last Day Revision (LDR)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Status</label>
                  <select
                    value={resourceModal.data.status || "Published"}
                    onChange={(e) => setResourceModal({ ...resourceModal, data: { ...resourceModal.data, status: e.target.value as ResourceItem["status"] } })}
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

                {/* Quick PDF presets */}
                <div className="mt-2 pt-1 border-t border-[#F3F4F6] space-y-1">
                  <p className="text-[10px] font-semibold text-[#77716E]">Quick Select Standard PDF:</p>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { label: "Partnership LDR Charts", url: "/notes/partnership-ldr-charts.pdf", type: "ldr", title: "Partnership Act — Last Day Revision (LDR) Flowcharts", pages: "18 Pages (LDR Revision Charts)" },
                      { label: "Partnership Infographics", url: "/notes/partnership-infographics.pdf", type: "infographic", title: "Partnership Act — Visual Infographics & Concept Mind Maps", pages: "12 Infographic Sheets" },
                      { label: "Partnership Practice Questions", url: "/notes/indian-partnership-act-practice-questions.pdf", type: "practice", title: "Indian Partnership Act — Practice Questions & Case Problems", pages: "25 Pages" },
                      { label: "Smart Revision Question Bank (Part 1)", url: "/notes/smart-revision-question-bank-part-1.pdf", type: "practice", title: "Smart Revision Question Bank (Part 1) — With Detailed Solutions", pages: "65+ Pages" },
                      { label: "September 2026 Paper Analysis", url: "/notes/september-2026-paper-analysis.pdf", type: "pyq", title: "September 2026 Paper Analysis & Detailed Model Answers", pages: "16 Pages" },
                      { label: "Partnership Unit 1 Notes", url: "/notes/unit-1-general-nature-of-partnership.pdf", type: "notes", title: "Unit 1: General Nature of Partnership", pages: "24 Pages" },
                      { label: "Partnership Unit 2 Notes", url: "/notes/unit-2-relations-of-partners.pdf", type: "notes", title: "Unit 2: Relations of Partners", pages: "28 Pages" },
                      { label: "Partnership Unit 3 Notes", url: "/notes/unit-3-registration-and-dissolution-of-firm.pdf", type: "notes", title: "Unit 3: Registration and Dissolution of Firm", pages: "32 Pages" },
                    ].map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => {
                          setResourceModal((prev) => ({
                            ...prev,
                            data: {
                              ...prev.data,
                              pdfUrl: preset.url,
                              samplePdfUrl: preset.url,
                              isSample: true,
                              type: (preset.type as ResourceItem["type"]) || prev.data.type,
                              title: prev.data.title || preset.title,
                              pages: preset.pages || prev.data.pages,
                              actName: "The Indian Partnership Act, 1932",
                              chapterNumber: 4,
                            },
                          }));
                        }}
                        className="px-2 py-0.5 rounded-lg text-[10px] bg-[#F7F7F5] hover:bg-[#C4E1EC]/60 border border-[#E7E4E7] text-[#221D1D] transition-colors cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
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
                  } catch {
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
        <div className="fixed inset-0 z-50 bg-[#221D1D]/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-lg w-full shadow-2xl border border-[#E7E4E7] space-y-4 max-h-[92vh] overflow-y-auto">
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
                  <option value="CSEET Business Laws and Management (Monthly Access)">CSEET Business Laws and Management (₹99/Month)</option>
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
                  } catch {
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
        <div className="fixed inset-0 z-50 bg-[#221D1D]/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-xl w-full shadow-2xl border border-[#E7E4E7] space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E4E7]">
              <div>
                <h3 className="text-base font-serif font-bold text-[#221D1D]">
                  {productModal.mode === "add" ? "Add Digital Codex / Book" : "Edit Course / Book"}
                </h3>
                <p className="text-[11px] text-[#77716E]">
                  This PDF will be published live on the website catalog for students to purchase.
                </p>
              </div>
              <button onClick={() => setProductModal({ open: false, mode: "add", data: {} })} className="p-2 rounded-xl hover:bg-[#F7F7F5] cursor-pointer">
                <X className="w-5 h-5 text-[#77716E]" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Title & Subtitle */}
              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">Codex / Book Title *</label>
                <input
                  type="text"
                  value={productModal.data.title || ""}
                  onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, title: e.target.value } })}
                  placeholder="e.g. CA Foundation Contract Act Crash Codex"
                  className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs text-[#221D1D] bg-[#F7F7F5] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">Subtitle / Key Highlight</label>
                <input
                  type="text"
                  value={productModal.data.subtitle || ""}
                  onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, subtitle: e.target.value } })}
                  placeholder="e.g. High-speed revision notes with 50 practical questions"
                  className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs text-[#221D1D] bg-[#F7F7F5] focus:bg-white transition"
                />
              </div>

              {/* Target Stream (Who can access) & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Target Exam (Who can access) *</label>
                  <select
                    value={productModal.data.category || "CA Foundation"}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, category: e.target.value as ProductItem["category"] } })}
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] bg-white text-[#221D1D] font-medium"
                  >
                    <option value="CA Foundation">CA Foundation Students</option>
                    <option value="CSEET">CSEET Students</option>
                    <option value="Both">Both (Dual Pass / All-Access)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Publishing Status *</label>
                  <select
                    value={productModal.data.status || "Active"}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, status: e.target.value as ProductItem["status"] } })}
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] bg-white text-[#221D1D] font-medium"
                  >
                    <option value="Active">Active (Live on Website)</option>
                    <option value="Draft">Draft (Hidden from Catalog)</option>
                  </select>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    value={productModal.data.price || 99}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, price: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs font-bold text-[#221D1D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Original Price / MRP (₹)</label>
                  <input
                    type="number"
                    value={productModal.data.originalPrice || 299}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, originalPrice: Number(e.target.value) } })}
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs text-[#77716E]"
                  />
                </div>
              </div>

              {/* Thumbnail / Cover Image */}
              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">Cover Image / Thumbnail</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 rounded-xl border border-[#E7E4E7] bg-[#F7F7F5] overflow-hidden relative shrink-0 flex items-center justify-center">
                    {productModal.data.cover_image ? (
                      <Image
                        src={productModal.data.cover_image}
                        alt="Thumbnail"
                        fill
                        unoptimized
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpen className="w-5 h-5 text-[#BFAFE5]" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={productModal.data.cover_image || ""}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, cover_image: e.target.value } })}
                    placeholder="/assets/ca-cs-hero-books-sharp.png"
                    className="flex-1 p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs font-mono text-[#221D1D]"
                  />
                  <input
                    type="file"
                    ref={thumbnailFileInputRef}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, (url) => {
                          setProductModal((prev) => ({
                            ...prev,
                            data: { ...prev.data, cover_image: url },
                          }));
                        });
                      }
                    }}
                  />
                  <button
                    type="button"
                    disabled={isUploadingFile}
                    onClick={() => thumbnailFileInputRef.current?.click()}
                    className="px-3 py-2 bg-[#F7F7F5] hover:bg-[#E7E4E7] text-[#221D1D] border border-[#E7E4E7] rounded-2xl text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload Cover</span>
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">Codex Description</label>
                <textarea
                  rows={3}
                  value={productModal.data.description || ""}
                  onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, description: e.target.value } })}
                  placeholder="Enter detailed description of what this PDF codex covers, why students should study from it, etc..."
                  className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs text-[#221D1D] bg-[#F7F7F5] focus:bg-white transition"
                />
              </div>

              {/* Pages & Units */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Total Pages</label>
                  <input
                    type="text"
                    value={productModal.data.pages || "150+ Pages"}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, pages: e.target.value } })}
                    placeholder="e.g. 150+ Pages"
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs text-[#221D1D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Units / Chapters Covered</label>
                  <input
                    type="text"
                    value={Array.isArray(productModal.data.units) ? productModal.data.units.join(", ") : (productModal.data.units || "")}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, units: e.target.value.split(",").map(s => s.trim()) } })}
                    placeholder="e.g. Unit 1, Unit 2, Unit 3"
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs text-[#221D1D]"
                  />
                </div>
              </div>

              {/* Preview Page Limit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Free Preview Limit (Pages)</label>
                  <input
                    type="number"
                    value={productModal.data.previewPagesLimit || 5}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, previewPagesLimit: Number(e.target.value) } })}
                    placeholder="e.g. 5"
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs font-bold text-[#4B8097]"
                  />
                  <span className="text-[10px] text-[#77716E]">Restricts free preview to first N pages before purchase lock</span>
                </div>
                <div>
                  <label className="block font-semibold text-[#4D433F] mb-1">Sample Page Range Label</label>
                  <input
                    type="text"
                    value={productModal.data.samplePagesRange || "1-5"}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, samplePagesRange: e.target.value } })}
                    placeholder="e.g. 1-5"
                    className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] outline-none focus:border-[#BFAFE5] text-xs font-mono text-[#221D1D]"
                  />
                  <span className="text-[10px] text-[#77716E]">Display badge text for free sample</span>
                </div>
              </div>

              {/* PDF Document Upload */}
              <div>
                <label className="block font-semibold text-[#4D433F] mb-1">PDF File * (Upload or select existing)</label>
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
                    className="px-3.5 py-2 bg-[#C4E1EC]/60 hover:bg-[#C4E1EC] text-[#221D1D] border border-[#AED7E9] rounded-2xl text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{isUploadingFile ? "Uploading..." : "Upload PDF"}</span>
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
                    pages: productModal.data.pages || "150+ Pages",
                    status: productModal.data.status || "Active",
                    pdfUrl: productModal.data.pdfUrl || "/notes/sale-of-goods-unit-1.pdf",
                    cover_image: productModal.data.cover_image || "/assets/ca-cs-hero-books-sharp.png",
                    description: productModal.data.description || "",
                    units: normalizeUnits(productModal.data.units),
                    previewPagesLimit: Number(productModal.data.previewPagesLimit) || 5,
                    samplePagesRange: productModal.data.samplePagesRange || "1-5",
                  };
                  const next = isAdd ? [...products, payload] : products.map((p) => (p.id === payload.id ? payload : p));
                  setProducts(next);
                  localStorage.setItem("lawkaksha_admin_products", JSON.stringify(next));
                  setProductModal({ open: false, mode: "add", data: {} });
                  showToast(isAdd ? "Adding codex to website..." : "Updating codex...");
                  try {
                    await adminFetch(`/api/admin/products${!isAdd ? "/" + payload.id : ""}`, {
                      method: isAdd ? "POST" : "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    showToast("Codex published live!");
                  } catch {
                    showToast("Saved locally (offline mode)");
                  }
                }}
                className="px-5 py-2.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{productModal.mode === "add" ? "Publish Codex Live" : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. STUDENT MODAL */}
      {studentModal.open && (
        <div className="fixed inset-0 z-50 bg-[#0A192F]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-md w-full shadow-2xl border border-[#CBD5E1] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-base font-bold text-[#0A192F]">
                {studentModal.mode === "add" ? "Add Student" : "Edit Student"}
              </h3>
              <button onClick={() => setStudentModal({ open: false, mode: "add", data: {} })} className="p-2 rounded-xl hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0A192F] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#1E293B] mb-1">Student Name *</label>
                <input
                  type="text"
                  value={studentModal.data.name || ""}
                  onChange={(e) => setStudentModal({ ...studentModal, data: { ...studentModal.data, name: e.target.value } })}
                  placeholder="e.g. Student Name"
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] outline-none focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/20 text-xs font-semibold text-[#0A192F] placeholder-[#64748B]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1E293B] mb-1">Student / Roll ID *</label>
                <input
                  type="text"
                  value={studentModal.data.student_id || ""}
                  onChange={(e) => setStudentModal({ ...studentModal, data: { ...studentModal.data, student_id: e.target.value } })}
                  placeholder="LRK-2026-001234"
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] outline-none focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/20 font-mono text-xs font-bold text-[#005A9C] placeholder-[#64748B]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1E293B] mb-1">Email Address *</label>
                <input
                  type="email"
                  value={studentModal.data.email || ""}
                  onChange={(e) => setStudentModal({ ...studentModal, data: { ...studentModal.data, email: e.target.value } })}
                  placeholder="student@thelawkaksha.com"
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] outline-none focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/20 text-xs font-semibold text-[#0A192F] placeholder-[#64748B]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1E293B] mb-1">Target Exam</label>
                <select
                  value={studentModal.data.target_exam || "CA Foundation Paper 2"}
                  onChange={(e) => setStudentModal({ ...studentModal, data: { ...studentModal.data, target_exam: e.target.value } })}
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] outline-none focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/20 bg-white text-xs font-semibold text-[#0A192F]"
                >
                  <option value="CA Foundation Paper 2">CA Foundation Paper 2 (Business Laws)</option>
                  <option value="CSEET Business Laws and Management">CSEET Business Laws and Management</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
              <button
                onClick={() => setStudentModal({ open: false, mode: "add", data: {} })}
                className="px-4 py-2 rounded-full text-xs font-bold text-[#475569] hover:bg-[#F1F5F9] cursor-pointer"
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
                  } catch {}
                  showToast(isAdd ? "Student added!" : "Student updated!");
                }}
                className="px-5 py-2 rounded-full bg-[#005A9C] hover:bg-[#004F8A] text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
              >
                {studentModal.mode === "add" ? "Create Student" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. CASE STUDY MODAL */}
      {caseModal.open && (
        <div className="fixed inset-0 z-50 bg-[#221D1D]/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-lg w-full shadow-2xl border border-[#E7E4E7] space-y-4 max-h-[92vh] overflow-y-auto">
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
                  } catch {}
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
        <div className="fixed inset-0 z-50 bg-[#221D1D]/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-lg w-full shadow-2xl border border-[#E7E4E7] space-y-4 max-h-[92vh] overflow-y-auto">
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
                    onChange={(e) => setMcqModal({ ...mcqModal, data: { ...mcqModal.data, course: e.target.value as GoogleFormTestItem["course"] } })}
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
                    onChange={(e) => setMcqModal({ ...mcqModal, data: { ...mcqModal.data, status: e.target.value as GoogleFormTestItem["status"] } })}
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
                    course: mcqModal.data.course || "ca",
                    subject: mcqModal.data.subject || "Business Laws",
                    formUrl: mcqModal.data.formUrl || "",
                    questionCount: Number(mcqModal.data.questionCount) || 30,
                    duration: Number(mcqModal.data.duration) || 30,
                    totalMarks: Number(mcqModal.data.totalMarks) || 30,
                    status: mcqModal.data.status || "Active",
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
                  } catch {
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
        <div className="fixed inset-0 z-50 bg-[#221D1D]/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-md w-full shadow-2xl border border-[#E7E4E7] space-y-4">
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
                  onChange={(e) => setCouponModal({ ...couponModal, data: { ...couponModal.data, status: e.target.value as CouponRecord["status"] } })}
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
                  } catch {}
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
        <div className="fixed inset-0 z-50 bg-[#221D1D]/50 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-4xl shadow-2xl border border-[#E7E4E7] flex flex-col max-h-[94vh] sm:max-h-[92vh] overflow-hidden">
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
