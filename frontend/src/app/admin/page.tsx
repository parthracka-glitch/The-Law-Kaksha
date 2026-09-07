"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  ShoppingBag,
  TrendingUp,
  FileText,
  CheckCircle,
  Clock,
  Truck,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Bell,
  Settings,
  Shield,
  Layers,
  Sparkles,
  DollarSign,
  Download,
  AlertCircle,
  GraduationCap,
  ChevronRight,
  BookOpen,
  Printer,
  Smartphone,
  Check,
  X,
  Upload,
  BarChart3,
  HelpCircle,
  Lock,
  RefreshCw,
  Award,
  BookMarked,
  MessageSquare,
  ArrowRight,
  Send,
  ExternalLink,
  CreditCard,
  Calendar,
  Key,
  ShieldCheck,
  RotateCcw
} from "lucide-react";
import { LawKakshaLogo } from "@/components/LawKakshaLogo";
import { AdminDispatchSlipModal, DispatchOrder } from "@/components/AdminDispatchSlipModal";

// Product / Course Interface for Owner Editing
interface ProductItem {
  id: string;
  title: string;
  type: "book" | "course" | "mcq";
  category: string;
  format: string;
  price: number;
  originalPrice: number;
  pagesOrHours: string;
  stockOrSeats: string;
  activeSubscribers: number;
  fileOrVaultName: string;
  status: "Active" | "Draft" | "Archived";
  features: string[];
}

// Subscription Ledger Entry
interface SubscriptionEntry {
  id: string;
  studentName: string;
  studentRoll: string;
  email: string;
  phone: string;
  planName: string;
  planType: "ca" | "cs" | "combo";
  startDate: string;
  expiryDate: string;
  daysRemaining: number;
  amountPaid: string;
  paymentGateway: string;
  txnId: string;
  deviceBound: string;
  status: "Active" | "Expiring Soon" | "Expired" | "Frozen";
}

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = useState<
    "orders" | "catalog" | "subscriptions" | "students" | "evaluations"
  >("orders");

  // Search & Filter States
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogTypeFilter, setCatalogTypeFilter] = useState<string>("all");
  const [subSearch, setSubSearch] = useState("");
  const [subStatusFilter, setSubStatusFilter] = useState<string>("all");
  const [studentSearch, setStudentSearch] = useState("");

  // Modals & Action States
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit / Add Product Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productForm, setProductForm] = useState<ProductItem>({
    id: "",
    title: "",
    type: "book",
    category: "CA Intermediate Paper 2",
    format: "Digital PDF & Hardcopy",
    price: 249,
    originalPrice: 449,
    pagesOrHours: "540 Pages",
    stockOrSeats: "350 In Stock",
    activeSubscribers: 0,
    fileOrVaultName: "ca_law_codex_2026.pdf",
    status: "Active",
    features: [
      "Companies Act 2013 Management & Administration",
      "30-Mark Mandatory Case-Scenario MCQs",
      "Section 135 CSR & MCA Notifications",
    ],
  });

  // Edit Subscription Modal State
  const [selectedSubForEdit, setSelectedSubForEdit] = useState<SubscriptionEntry | null>(null);
  const [subEditDaysToAdd, setSubEditDaysToAdd] = useState("30");
  const [subEditStatus, setSubEditStatus] = useState<"Active" | "Frozen" | "Expired">("Active");

  // Answer Copy Evaluation Modal
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [evalMarks, setEvalMarks] = useState("82");
  const [evalRemarks, setEvalRemarks] = useState("Excellent statutory citation of Companies Act §135. Clear 3-pillar conclusion.");

  // Discount Coupons Manager State
  const [coupons, setCoupons] = useState([
    { code: "CALAW20", discountPct: 20, status: "Active" as const, maxUses: 500, usesCount: 312 },
    { code: "RANKER10", discountPct: 10, status: "Active" as const, maxUses: 1000, usesCount: 540 },
    { code: "FESTIVE25", discountPct: 25, status: "Active" as const, maxUses: 200, usesCount: 198 },
  ]);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState("15");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportOrdersCSV = () => {
    const headers = "Order ID,Customer,Phone,Item,State,Pincode,Address,Amount,Date,Status,Tracking,Courier\n";
    const rows = orders
      .map(
        (o) =>
          `"${o.id}","${o.customer}","${o.phone}","${o.item}","${o.state}","${o.pincode}","${o.address}","${o.amount}","${o.date}","${o.status}","${o.tracking}","${o.courier}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `TheLawKaksha_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported dispatch orders CSV for courier partner!");
  };

  // 1. Catalog Products (Books, PDFs & Subscriptions)
  const [catalog, setCatalog] = useState<ProductItem[]>([
    {
      id: "prod-vol1",
      title: "Volume 1: CA Law Case Scenarios & MCQs Codex",
      type: "book",
      category: "CA Intermediate & Foundation",
      format: "Digital PDF & Deluxe Paperback",
      price: 249,
      originalPrice: 449,
      pagesOrHours: "540 Pages",
      stockOrSeats: "320 Books",
      activeSubscribers: 2450,
      fileOrVaultName: "vol1_ca_law_mcq_codex_2026.pdf",
      status: "Active",
      features: [
        "1,200+ ICAI Pattern Objective MCQs",
        "Companies Act 2013 Chapter VII & IX Decoders",
        "Free statutory MCA updates for 2026-2027",
      ],
    },
    {
      id: "prod-vol2",
      title: "Volume 2: Solved RTPs, MTPs & Model Answers",
      type: "book",
      category: "CA Intermediate & Final",
      format: "Digital PDF & Deluxe Paperback",
      price: 249,
      originalPrice: 449,
      pagesOrHours: "490 Pages",
      stockOrSeats: "280 Books",
      activeSubscribers: 2190,
      fileOrVaultName: "vol2_rtp_mtp_solved_codex_2026.pdf",
      status: "Active",
      features: [
        "9-Attempt Solved RTPs, MTPs & Suggested Answers",
        "3-Step Descriptive Model Answers (Provision, Facts, Conclusion)",
        "1.5-Day Exam Day Quick Revision Mind Maps",
      ],
    },
    {
      id: "prod-both-box",
      title: "Hardcopies: Both Volumes Deluxe Box Set",
      type: "book",
      category: "CA All Levels (Vol 1 + 2)",
      format: "Physical 2-Book Box Set (Doorstep Dispatch)",
      price: 699,
      originalPrice: 1199,
      pagesOrHours: "1,030 Pages (2 Books)",
      stockOrSeats: "145 Sets in Warehouse",
      activeSubscribers: 1840,
      fileOrVaultName: "both_volumes_box_set_awb_bundle",
      status: "Active",
      features: [
        "Both Volume 1 & Volume 2 in protective box set",
        "Premium 80 GSM white paper with annotation margins",
        "Includes instant digital PDF access during courier transit",
      ],
    },
    {
      id: "prod-ca-course-sub",
      title: "CA Business Law Main Notes Subscription",
      type: "course",
      category: "CA Foundation & Intermediate (ICAI)",
      format: "Video Masterclasses + 5 Separate Notes",
      price: 1999,
      originalPrice: 3499,
      pagesOrHours: "120+ Hours HD Video",
      stockOrSeats: "Unlimited Cloud Seats",
      activeSubscribers: 1420,
      fileOrVaultName: "ca_business_law_master_vault_2026",
      status: "Active",
      features: [
        "5 Separate Subject Notes: ICA, LLP, Companies Act, SOGA, NI Act",
        "120+ Hours Video Lectures with Faculty Doubt Forum",
        "2-Volume Deluxe Books Delivered to Doorstep",
      ],
    },
    {
      id: "prod-cs-mcq-sub",
      title: "CS MCQ Mastery Specialization Subscription",
      type: "mcq",
      category: "CS Executive & CSEET (ICSI)",
      format: "2,500+ Objective MCQ Engine",
      price: 1499,
      originalPrice: 2799,
      pagesOrHours: "2,500+ MCQs & Drills",
      stockOrSeats: "Unlimited Cloud Seats",
      activeSubscribers: 890,
      fileOrVaultName: "cs_mcq_speed_engine_vault_2026",
      status: "Active",
      features: [
        "3 Core Modules: Business Law, Business Management, Business Communication",
        "Timed Speed Drills with Negative Marking Analysis",
        "Instant Step-by-Step Rationales & Past 8 Attempts Solved",
      ],
    },
  ]);

  // 2. Subscriptions Ledger State
  const [subscriptions, setSubscriptions] = useState<SubscriptionEntry[]>([
    {
      id: "SUB-CA-9042",
      studentName: "Ayushi Singhania",
      studentRoll: "CA-2026-INTER-0842",
      email: "ayushi.singhania@outlook.com",
      phone: "+91 98111 22334",
      planName: "CA Business Law Main Notes Subscription",
      planType: "ca",
      startDate: "15 Jan 2026",
      expiryDate: "15 Jul 2026",
      daysRemaining: 130,
      amountPaid: "₹1,999",
      paymentGateway: "Razorpay (UPI / GPay)",
      txnId: "pay_N8k19283746",
      deviceBound: "Apple iPad Pro (Safari)",
      status: "Active",
    },
    {
      id: "SUB-CS-8921",
      studentName: "Harshvardhan Mehta",
      studentRoll: "CS-2026-EXEC-0312",
      email: "harsh.mehta@gmail.com",
      phone: "+91 94123 56789",
      planName: "CS MCQ Mastery Specialization Subscription",
      planType: "cs",
      startDate: "28 Jan 2026",
      expiryDate: "28 Jul 2026",
      daysRemaining: 143,
      amountPaid: "₹1,499",
      paymentGateway: "Razorpay (Credit Card)",
      txnId: "pay_K3910284755",
      deviceBound: "MacBook Air M2 (Chrome)",
      status: "Active",
    },
    {
      id: "SUB-CA-8874",
      studentName: "Rohan Deshmukh",
      studentRoll: "CA-2026-FINAL-0199",
      email: "rohan.deshmukh@gmail.com",
      phone: "+91 98765 43210",
      planName: "CA Final Corporate & Economic Laws Pro",
      planType: "ca",
      startDate: "10 Dec 2025",
      expiryDate: "10 Jun 2026",
      daysRemaining: 94,
      amountPaid: "₹3,999",
      paymentGateway: "Razorpay (NetBanking HDFC)",
      txnId: "pay_M9920192841",
      deviceBound: "Windows 11 PC (Chrome)",
      status: "Active",
    },
    {
      id: "SUB-CA-8720",
      studentName: "Pooja Mehta",
      studentRoll: "CA-2026-FND-0914",
      email: "pooja.mehta@yahoo.com",
      phone: "+91 98220 99881",
      planName: "CA Foundation Business Law Sprint",
      planType: "ca",
      startDate: "01 Sep 2025",
      expiryDate: "01 Mar 2026",
      daysRemaining: 0,
      amountPaid: "₹1,999",
      paymentGateway: "Razorpay (PhonePe UPI)",
      txnId: "pay_A8819203912",
      deviceBound: "Android Smartphone",
      status: "Expired",
    },
    {
      id: "SUB-CS-8611",
      studentName: "Divya Raghavan",
      studentRoll: "CS-2026-CSEET-0419",
      email: "divya.r@gmail.com",
      phone: "+91 97654 32109",
      planName: "CS MCQ Mastery Specialization Subscription",
      planType: "cs",
      startDate: "05 Feb 2026",
      expiryDate: "05 Aug 2026",
      daysRemaining: 151,
      amountPaid: "₹1,499",
      paymentGateway: "Razorpay (Paytm UPI)",
      txnId: "pay_D1928374650",
      deviceBound: "Windows 10 Laptop",
      status: "Active",
    },
  ]);

  // 3. Orders State
  const [orders, setOrders] = useState<DispatchOrder[]>([
    {
      id: "CA-ORD-9821",
      customer: "Rohan Deshmukh",
      phone: "+91 98765 43210",
      item: "Hardcopies: Both Volumes Box Set (Vol 1 & 2)",
      state: "Maharashtra",
      address: "Flat 402, ICAI Bhawan Road, Nariman Point, Mumbai",
      pincode: "400021",
      amount: "₹699",
      date: "Today, 10:30 AM",
      status: "Processing",
      tracking: "DTDC-7819203",
      courier: "DTDC Express Air",
    },
    {
      id: "CA-ORD-9820",
      customer: "Ayushi Singhania",
      phone: "+91 98111 22334",
      item: "CA Business Law Main Notes Subscription",
      state: "Delhi NCR",
      address: "Plot 12, Vikas Marg, Laxmi Nagar, East Delhi",
      pincode: "110092",
      amount: "₹1,999",
      date: "Today, 09:15 AM",
      status: "Delivered",
      tracking: "INSTANT-DRM-VAULT",
      courier: "CA Student Portal Stream",
    },
    {
      id: "CA-ORD-9819",
      customer: "Tanvi Kulkarni",
      phone: "+91 99887 76655",
      item: "Hardcopies: Both Volumes Box Set (Vol 1 & 2)",
      state: "Gujarat",
      address: "B-203, Commerce House, Ashram Road, Ahmedabad",
      pincode: "380009",
      amount: "₹699",
      date: "Yesterday",
      status: "Dispatched",
      tracking: "BLUEDART-8829104",
      courier: "BlueDart Air",
    },
    {
      id: "CA-ORD-9818",
      customer: "Harshvardhan Mehta",
      phone: "+91 94123 56789",
      item: "CS MCQ Mastery Specialization Subscription",
      state: "Rajasthan",
      address: "House 54, CA Circle, Malviya Nagar, Jaipur",
      pincode: "302017",
      amount: "₹1,499",
      date: "Yesterday",
      status: "Delivered",
      tracking: "INSTANT-DRM-VAULT",
      courier: "Student Portal Test Pass",
    },
    {
      id: "CA-ORD-9817",
      customer: "Priya Nair",
      phone: "+91 97654 32109",
      item: "Both Volumes (Digital PDF Bundle)",
      state: "Karnataka",
      address: "MG Road, Indiranagar, Bengaluru",
      pincode: "560038",
      amount: "₹399",
      date: "Yesterday",
      status: "Delivered",
      tracking: "INSTANT-DRM-VAULT",
      courier: "Encrypted Cloud Stream",
    },
  ]);

  // 4. Student Accounts & Logins State
  const [students, setStudents] = useState([
    {
      id: "LK-STU-101",
      rollNo: "CA-2026-INTER-0842",
      name: "Rohan Deshmukh",
      email: "rohan.d@gmail.com",
      phone: "+91 98765 43210",
      plan: "Hardcopies: Both Volumes Set",
      exam: "CA Inter Nov'26",
      enrolledOn: "Today",
      device: "Windows 11 Laptop (Chrome)",
      deviceStatus: "Active on Device",
      transfersLeft: 2,
    },
    {
      id: "LK-STU-102",
      rollNo: "CA-2026-SUB-1029",
      name: "Ayushi Singhania",
      email: "ayushi.singhania@outlook.com",
      phone: "+91 98111 22334",
      plan: "CA Business Law Main Notes",
      exam: "CA Inter Group 1",
      enrolledOn: "Today",
      device: "Apple iPad (Safari)",
      deviceStatus: "Active on Device",
      transfersLeft: 3,
    },
    {
      id: "LK-STU-103",
      rollNo: "CS-2026-EXEC-0312",
      name: "Harshvardhan Mehta",
      email: "harsh.mehta@gmail.com",
      phone: "+91 94123 56789",
      plan: "CS MCQ Mastery Specialization",
      exam: "CS Executive Dec'26",
      enrolledOn: "Yesterday",
      device: "MacBook Air (Chrome)",
      deviceStatus: "Active on Device",
      transfersLeft: 1,
    },
  ]);

  // 5. Answer Evaluations State
  const [submissions, setSubmissions] = useState([
    {
      id: "SUB-891",
      studentName: "Ananya Sharma",
      studentRoll: "CA-2026-INTER-0842",
      testTitle: "Test 04: Companies Act 2013 Chapter VII (Management & Administration)",
      submittedOn: "Today, 11:20 AM",
      totalMarks: 100,
      scoredMarks: null,
      status: "Pending Review",
    },
    {
      id: "SUB-890",
      studentName: "Aditya Chopra",
      studentRoll: "CA-2026-FND-0914",
      testTitle: "Test 02: Indian Contract Act 1872 (Special Contracts & Bailment)",
      submittedOn: "Yesterday",
      totalMarks: 50,
      scoredMarks: 42,
      status: "Evaluated & Sent",
    },
  ]);

  // Load real-time orders and students from localStorage
  useEffect(() => {
    const loadRealtimeOrders = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("lawkaksha_admin_orders");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setOrders((prev) => {
                const existingIds = new Set(prev.map((o) => o.id));
                const newOnes = parsed.filter((o: DispatchOrder) => !existingIds.has(o.id));
                return [...newOnes, ...prev];
              });

              // Also reflect new customer records in Students table
              parsed.forEach((ord: any) => {
                if (ord && ord.customer) {
                  setStudents((prev) => {
                    const existingName = prev.some((s) => s.name.toLowerCase() === ord.customer.toLowerCase());
                    if (!existingName) {
                      return [
                        {
                          id: `LK-STU-${Math.floor(100 + Math.random() * 900)}`,
                          rollNo: `CA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                          name: ord.customer,
                          email: `${ord.customer.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
                          phone: ord.phone || "+91 98765 43210",
                          plan: ord.item || "CA Law Master Codex",
                          exam: "CA Intermediate Paper 2",
                          enrolledOn: "Just now",
                          device: "Windows 11 / iOS (Direct Sync)",
                          deviceStatus: "Active on Device",
                          transfersLeft: 3,
                        },
                        ...prev,
                      ];
                    }
                    return prev;
                  });
                }
              });
            }
          } catch (e) {}
        }
      }
    };

    loadRealtimeOrders();
    window.addEventListener("storage", loadRealtimeOrders);
    return () => window.removeEventListener("storage", loadRealtimeOrders);
  }, []);

  // Handlers for Products (Add / Edit)
  const handleOpenAddProduct = () => {
    setIsEditingProduct(false);
    setProductForm({
      id: `prod-${Date.now()}`,
      title: "",
      type: "book",
      category: "CA Intermediate Paper 2",
      format: "Digital PDF & Hardcopy",
      price: 249,
      originalPrice: 449,
      pagesOrHours: "540 Pages",
      stockOrSeats: "300 Units",
      activeSubscribers: 0,
      fileOrVaultName: "new_publication_2026.pdf",
      status: "Active",
      features: [
        "ICAI 2026-2027 Syllabus Certified",
        "High-Resolution Searchable DRM PDF",
        "Includes Chapter-wise Case Scenarios",
      ],
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: ProductItem) => {
    setIsEditingProduct(true);
    setProductForm({ ...prod });
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title.trim()) return;

    if (isEditingProduct) {
      setCatalog((prev) =>
        prev.map((p) => (p.id === productForm.id ? { ...productForm } : p))
      );
      showToast(`Updated "${productForm.title}" successfully!`);
    } else {
      setCatalog([productForm, ...catalog]);
      showToast(`Added new product "${productForm.title}" to store!`);
    }

    setProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string, title: string) => {
    if (confirm(`Are you sure you want to remove "${title}" from the catalog?`)) {
      setCatalog((prev) => prev.filter((p) => p.id !== id));
      showToast(`Removed "${title}" from store.`);
    }
  };

  // Handlers for Subscriptions
  const handleExtendSubscription = (subId: string, days: number) => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === subId
          ? {
              ...s,
              daysRemaining: s.daysRemaining + days,
              status: "Active",
            }
          : s
      )
    );
    showToast(`Extended validity by +${days} days for ${subId}!`);
  };

  const handleSaveSubscriptionEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubForEdit) return;

    const daysToAdd = parseInt(subEditDaysToAdd) || 0;

    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === selectedSubForEdit.id
          ? {
              ...s,
              status: subEditStatus,
              daysRemaining: Math.max(0, s.daysRemaining + daysToAdd),
            }
          : s
      )
    );

    showToast(`Updated subscription terms for ${selectedSubForEdit.studentName}!`);
    setSelectedSubForEdit(null);
  };

  // Orders Status Updater
  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order ${orderId} marked as "${newStatus}"`);
  };

  // Student Device Unlock
  const handleResetDevice = (studentId: string, studentName: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, deviceStatus: "Ready for New Device" } : s))
    );
    showToast(`Access unlocked for ${studentName}. They can now log in on their new phone or laptop.`);
  };

  // Evaluation Submit
  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === selectedSubmission.id
          ? { ...s, status: "Evaluated & Sent", scoredMarks: parseInt(evalMarks) }
          : s
      )
    );

    setSelectedSubmission(null);
    showToast(`Evaluated marks (${evalMarks}/${selectedSubmission.totalMarks}) dispatched to student portal!`);
  };

  // Filtered Lists
  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch);
    const matchStatus = orderStatusFilter === "all" || o.status.toLowerCase() === orderStatusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const filteredCatalog = catalog.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      c.fileOrVaultName.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchType = catalogTypeFilter === "all" || c.type === catalogTypeFilter;
    return matchSearch && matchType;
  });

  const filteredSubscriptions = subscriptions.filter((s) => {
    const matchSearch =
      s.studentName.toLowerCase().includes(subSearch.toLowerCase()) ||
      s.studentRoll.toLowerCase().includes(subSearch.toLowerCase()) ||
      s.planName.toLowerCase().includes(subSearch.toLowerCase()) ||
      s.txnId.toLowerCase().includes(subSearch.toLowerCase());
    const matchStatus =
      subStatusFilter === "all" || s.status.toLowerCase() === subStatusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const filteredStudents = students.filter((s) => {
    const q = studentSearch.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.rollNo.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.phone.includes(studentSearch) ||
      s.plan.toLowerCase().includes(q)
    );
  });

  const pendingDispatchesCount = orders.filter((o) => o.status === "Processing").length;
  const activeSubsCount = subscriptions.filter((s) => s.status === "Active").length;
  const totalRevenueNumeric = subscriptions.reduce((sum, s) => {
    const num = parseInt(s.amountPaid.replace(/[^0-9]/g, "")) || 0;
    return sum + num;
  }, 384000);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 antialiased selection:bg-sky-200">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-top-3 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* TOP EXECUTIVE HEADER BAR                                 */}
      {/* ======================================================== */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <LawKakshaLogo variant="light" />
            </Link>
            <div className="hidden sm:block h-5 w-px bg-slate-200" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 font-serif">
                Owner &amp; Faculty Console
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                Store Live
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/student"
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <span>Student Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#0284C7]" />
            </Link>
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold transition-colors shadow-2xs"
            >
              Website Home
            </Link>
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* ======================================================== */}
        {/* 1. TOP EXECUTIVE FINANCIAL & OPERATIONS METRICS          */}
        {/* ======================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Metric 1: Revenue */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Total Revenue</span>
              <span className="p-1.5 rounded-lg bg-sky-50 text-[#0284C7]">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                ₹{(totalRevenueNumeric / 100000).toFixed(2)}L
              </span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                +19.2%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">From Books &amp; Subscriptions</p>
          </div>

          {/* Metric 2: Active Subscriptions */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Active Subscriptions</span>
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <CreditCard className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {activeSubsCount}
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                100% Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">CA &amp; CS enrolled students</p>
          </div>

          {/* Metric 3: Dispatch Queue */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Dispatch Queue</span>
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Truck className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {pendingDispatchesCount}
              </span>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                Pending AWB
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Physical 2-Volume box orders</p>
          </div>

          {/* Metric 4: Live Published Products */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Store Products</span>
              <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                <BookMarked className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {catalog.length}
              </span>
              <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                Published
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Books, PDFs &amp; Course Batches</p>
          </div>

        </div>

        {/* ======================================================== */}
        {/* 2. STREAMLINED 5-TAB NAVIGATION BAR                      */}
        {/* ======================================================== */}
        <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-x-auto">
          
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "orders"
                ? "bg-[#0284C7] text-white shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Orders &amp; Courier Dispatch</span>
            {pendingDispatchesCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === "orders" ? "bg-white text-[#0284C7]" : "bg-amber-100 text-amber-800"
              }`}>
                {pendingDispatchesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "catalog"
                ? "bg-[#0284C7] text-white shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>Books, PDFs &amp; Course Plans ({catalog.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("subscriptions")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "subscriptions"
                ? "bg-[#0284C7] text-white shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Subscriptions Ledger ({subscriptions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "students"
                ? "bg-[#0284C7] text-white shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Accounts ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("evaluations")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "evaluations"
                ? "bg-[#0284C7] text-white shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Answer Copy Evaluations</span>
          </button>

        </div>

        {/* ======================================================== */}
        {/* TAB 1: ORDERS & COURIER DISPATCH DESK                    */}
        {/* ======================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Action & Filter Strip */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by student name, phone, order ID..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-[#0284C7]"
                >
                  <option value="all">All Statuses</option>
                  <option value="processing">Processing (Needs Shipping)</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportOrdersCSV}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={() => setCouponModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-[#0284C7] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Coupons ({coupons.length})</span>
                </button>

                <button
                  onClick={() => setDispatchModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Courier Slips</span>
                </button>
              </div>

            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10.5px]">
                    <tr>
                      <th className="px-5 py-3">Order ID &amp; Date</th>
                      <th className="px-5 py-3">Student &amp; Phone</th>
                      <th className="px-5 py-3">Item Purchased</th>
                      <th className="px-5 py-3">Destination</th>
                      <th className="px-5 py-3">Amount</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Courier Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                          No orders found matching the filter.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-3.5">
                            <span className="font-mono font-bold text-slate-900 block">{o.id}</span>
                            <span className="text-[11px] text-slate-400">{o.date}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-bold text-slate-900 block">{o.customer}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{o.phone}</span>
                          </td>
                          <td className="px-5 py-3.5 max-w-xs">
                            <span className="line-clamp-1 font-medium">{o.item}</span>
                            <span className="text-[10.5px] text-slate-400">Courier: {o.courier}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="block font-medium">{o.state}</span>
                            <span className="text-[10.5px] text-slate-400 font-mono">Pin: {o.pincode}</span>
                          </td>
                          <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                            {o.amount}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                                o.status === "Delivered"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : o.status === "Dispatched"
                                  ? "bg-sky-50 text-[#0284C7] border border-sky-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {o.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              {o.status === "Processing" ? (
                                <button
                                  onClick={() => updateOrderStatus(o.id, "Dispatched")}
                                  className="px-2.5 py-1 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white text-[11px] font-semibold transition-colors"
                                >
                                  Mark Dispatched
                                </button>
                              ) : o.status === "Dispatched" ? (
                                <button
                                  onClick={() => updateOrderStatus(o.id, "Delivered")}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors"
                                >
                                  Mark Delivered
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-400 font-mono">AWB Verified</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: BOOKS, PDFS & COURSE PLANS (EDIT / ADD PRODUCT)   */}
        {/* ======================================================== */}
        {activeTab === "catalog" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Catalog Control Header */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Search books, PDFs, courses, file names..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                <select
                  value={catalogTypeFilter}
                  onChange={(e) => setCatalogTypeFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-[#0284C7]"
                >
                  <option value="all">All Types</option>
                  <option value="book">Books &amp; Box Sets</option>
                  <option value="course">Course Subscriptions</option>
                  <option value="mcq">MCQ Test Banks</option>
                </select>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Book / Course</span>
              </button>

            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCatalog.map((prod) => (
                <div
                  key={prod.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-sky-300 transition-all group"
                >
                  <div>
                    {/* Badge & Status */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[10.5px] font-bold text-[#0284C7] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                        {prod.category}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          {prod.status}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {prod.type}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold font-serif text-slate-900 leading-snug">
                      {prod.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{prod.format}</p>

                    {/* Metadata Strip */}
                    <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Volume / Scale</span>
                        <strong className="text-slate-800">{prod.pagesOrHours}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Stock / Seats</span>
                        <strong className="text-slate-800">{prod.stockOrSeats}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Active Vaults</span>
                        <strong className="text-slate-800">{prod.activeSubscribers} Students</strong>
                      </div>
                    </div>

                    {/* File / Vault Name */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-sky-50/50 p-2 rounded-lg border border-sky-100/60 mb-3">
                      <Lock className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                      <span className="truncate font-mono">Vault Stream: {prod.fileOrVaultName}</span>
                    </div>

                    {/* Features Snippet */}
                    <ul className="space-y-1 mb-4 text-[11px] text-slate-600">
                      {prod.features.slice(0, 2).map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-1.5 truncate">
                          <Check className="w-3 h-3 text-[#0284C7] shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing & Edit Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Live Price
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base sm:text-lg font-black font-mono text-slate-900">
                          ₹{prod.price}
                        </span>
                        <span className="text-xs font-mono text-slate-400 line-through">
                          ₹{prod.originalPrice}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditProduct(prod)}
                        className="px-3 py-1.5 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Product</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(prod.id, prod.title)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors"
                        title="Delete from Catalog"
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

        {/* ======================================================== */}
        {/* TAB 3: SUBSCRIPTIONS LEDGER (PURCHASED PLANS LIST)       */}
        {/* ======================================================== */}
        {activeTab === "subscriptions" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Subscriptions Filter Header */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={subSearch}
                    onChange={(e) => setSubSearch(e.target.value)}
                    placeholder="Search subscriber name, roll no, transaction ID..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                <select
                  value={subStatusFilter}
                  onChange={(e) => setSubStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-[#0284C7]"
                >
                  <option value="all">All Subscriptions</option>
                  <option value="active">Active Only</option>
                  <option value="expiring soon">Expiring Soon</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast("Exporting subscriptions ledger as CSV...")}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Export CSV</span>
                </button>
              </div>

            </div>

            {/* Subscriptions Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10.5px]">
                    <tr>
                      <th className="px-5 py-3">Subscription ID &amp; Txn</th>
                      <th className="px-5 py-3">Student Name &amp; Roll</th>
                      <th className="px-5 py-3">Subscribed Plan</th>
                      <th className="px-5 py-3">Validity &amp; Expiry</th>
                      <th className="px-5 py-3">Amount &amp; Gateway</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredSubscriptions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                          No subscriptions matching search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredSubscriptions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-3.5">
                            <span className="font-mono font-bold text-slate-900 block">{sub.id}</span>
                            <span className="font-mono text-[10.5px] text-slate-400">{sub.txnId}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-bold text-slate-900 block">{sub.studentName}</span>
                            <span className="text-[11px] text-slate-400 font-mono">{sub.studentRoll}</span>
                          </td>
                          <td className="px-5 py-3.5 max-w-xs font-medium">
                            <span className="line-clamp-1">{sub.planName}</span>
                            <span className="text-[10.5px] text-slate-400">Device: {sub.deviceBound}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="block font-semibold text-slate-900">
                              {sub.daysRemaining > 0 ? `${sub.daysRemaining} Days Left` : "Ended"}
                            </span>
                            <span className="text-[10.5px] text-slate-400">Expires: {sub.expiryDate}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-mono font-bold text-slate-900 block">{sub.amountPaid}</span>
                            <span className="text-[10.5px] text-slate-400">{sub.paymentGateway}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                                sub.status === "Active"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : sub.status === "Expiring Soon"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleExtendSubscription(sub.id, 30)}
                                className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0284C7] text-[11px] font-semibold transition-colors border border-sky-200"
                                title="Add 30 Days Free Extension"
                              >
                                +30 Days
                              </button>

                              <button
                                onClick={() => setSelectedSubForEdit(sub)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                              >
                                Edit Terms
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: STUDENT ACCOUNTS & LOGIN ACCESS                   */}
        {/* ======================================================== */}
        {activeTab === "students" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Header info bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-serif">
                  Student Accounts &amp; Login Access
                </h3>
                <p className="text-xs text-slate-500">
                  View all registered students, their contact details, and help them log in if they switch to a new phone or laptop.
                </p>
              </div>
              <span className="text-xs text-slate-500 font-semibold shrink-0">
                Total Registered: <strong className="text-slate-900 font-bold">{students.length} Students</strong>
              </span>
            </div>

            {/* Search bar */}
            <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search by student name, roll number, email, or phone..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0284C7]"
                />
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10.5px]">
                    <tr>
                      <th className="px-5 py-3">Student Name &amp; Roll No</th>
                      <th className="px-5 py-3">Email &amp; Phone</th>
                      <th className="px-5 py-3">Enrolled Book / Course</th>
                      <th className="px-5 py-3">Logged-in Device</th>
                      <th className="px-5 py-3">Login Status</th>
                      <th className="px-5 py-3 text-right">Help &amp; Support Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                          No student accounts found matching "{studentSearch}".
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((s) => {
                        const isUnlocked = s.deviceStatus.includes("Ready") || s.deviceStatus.includes("Unlocked");
                        return (
                          <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-5 py-3.5">
                              <span className="font-bold text-slate-900 block">{s.name}</span>
                              <span className="font-mono text-[11px] text-slate-400">{s.rollNo}</span>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="block text-slate-800">{s.email}</span>
                              <span className="text-[11px] text-slate-400 font-mono">{s.phone}</span>
                            </td>
                            <td className="px-5 py-3.5 font-medium text-slate-900">
                              {s.plan}
                            </td>
                            <td className="px-5 py-3.5 text-slate-600">
                              <div className="flex items-center gap-1.5">
                                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                                <span>{s.device}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                                  isUnlocked
                                    ? "bg-amber-50 text-amber-800 border border-amber-200"
                                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                }`}
                              >
                                {s.deviceStatus}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <button
                                onClick={() => handleResetDevice(s.id, s.name)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-[#0284C7] text-xs font-semibold transition-colors shadow-2xs"
                                title="Click if this student lost their phone or bought a new laptop"
                              >
                                Unlock Device Login
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: ANSWER COPY EVALUATION DESK                       */}
        {/* ======================================================== */}
        {activeTab === "evaluations" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-serif">
                  1-on-1 Student Answer Paper Evaluations
                </h3>
                <p className="text-xs text-slate-500">
                  Grade uploaded descriptive test series copies with 3-pillar scoring rubrics.
                </p>
              </div>

              <span className="text-xs text-slate-500 font-semibold">
                Pending Review: <strong className="text-slate-900">2 copies</strong>
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10.5px]">
                    <tr>
                      <th className="px-5 py-3">Student Name</th>
                      <th className="px-5 py-3">Test Series Title</th>
                      <th className="px-5 py-3">Submitted On</th>
                      <th className="px-5 py-3">Score</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-3.5">
                          <span className="font-bold text-slate-900 block">{sub.studentName}</span>
                          <span className="font-mono text-[11px] text-slate-400">{sub.studentRoll}</span>
                        </td>
                        <td className="px-5 py-3.5 font-medium max-w-sm">
                          {sub.testTitle}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500">
                          {sub.submittedOn}
                        </td>
                        <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                          {sub.scoredMarks !== null ? `${sub.scoredMarks}/${sub.totalMarks}` : "—"}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                              sub.status === "Evaluated & Sent"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-sky-50 text-[#0284C7] border border-sky-200"
                            }`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => setSelectedSubmission(sub)}
                            className="px-3 py-1.5 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold transition-colors"
                          >
                            {sub.status === "Evaluated & Sent" ? "Re-evaluate" : "Grade & Review"}
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

      </main>

      {/* ======================================================== */}
      {/* MODAL 1: ADD OR EDIT PRODUCT / COURSE PLAN               */}
      {/* ======================================================== */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold font-serif text-slate-900">
                  {isEditingProduct ? "Edit Existing Product / Plan" : "Add New Book or Course Subscription"}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Configure store pricing, PDF vaults, stock &amp; syllabus parameters.
                </p>
              </div>
              <button
                onClick={() => setProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Product / Course Title</label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  placeholder="e.g. Volume 1: CA Law Case Scenarios Codex"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Product Type</label>
                  <select
                    value={productForm.type}
                    onChange={(e) => setProductForm({ ...productForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  >
                    <option value="book">Book / Physical Set</option>
                    <option value="course">Course Subscription</option>
                    <option value="mcq">MCQ Test Engine</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category / Level</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  >
                    <option value="CA Intermediate Paper 2">CA Inter Paper 2</option>
                    <option value="CA Final Corporate Laws">CA Final Corporate Laws</option>
                    <option value="CA Foundation Business Law">CA Foundation Business Law</option>
                    <option value="CS Executive & CSEET">CS Executive &amp; CSEET</option>
                    <option value="CA All Levels (Vol 1 + 2)">CA All Levels</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Store Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Original Cut Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-700 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Page Count / Hours</label>
                  <input
                    type="text"
                    value={productForm.pagesOrHours}
                    onChange={(e) => setProductForm({ ...productForm, pagesOrHours: e.target.value })}
                    placeholder="e.g. 540 Pages or 120 Hours"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Stock / Seat Allocation</label>
                  <input
                    type="text"
                    value={productForm.stockOrSeats}
                    onChange={(e) => setProductForm({ ...productForm, stockOrSeats: e.target.value })}
                    placeholder="e.g. 350 Units or Unlimited"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">DRM PDF File / Stream Key</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={productForm.fileOrVaultName}
                    onChange={(e) => setProductForm({ ...productForm, fileOrVaultName: e.target.value })}
                    placeholder="e.g. ca_inter_law_vol1_2026.pdf"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  />
                  <button
                    type="button"
                    onClick={() => showToast("File uploaded to DRM Cloud Vault!")}
                    className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Publishing Status</label>
                <select
                  value={productForm.status}
                  onChange={(e) => setProductForm({ ...productForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0284C7]"
                >
                  <option value="Active">Active (Visible in Store)</option>
                  <option value="Draft">Draft (Hidden)</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold shadow-xs"
                >
                  {isEditingProduct ? "Save Changes" : "Publish to Store"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EDIT SUBSCRIPTION TERMS MODAL                   */}
      {/* ======================================================== */}
      {selectedSubForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold font-serif text-slate-900">
                  Modify Student Subscription
                </h3>
                <p className="text-[11px] text-slate-500">
                  {selectedSubForEdit.studentName} ({selectedSubForEdit.studentRoll})
                </p>
              </div>
              <button
                onClick={() => setSelectedSubForEdit(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSubscriptionEdit} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Active Plan:</span>
                <p className="font-bold text-slate-900">{selectedSubForEdit.planName}</p>
                <p className="text-[11px] text-slate-500 font-mono">Txn: {selectedSubForEdit.txnId} ({selectedSubForEdit.amountPaid})</p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subscription Status</label>
                <select
                  value={subEditStatus}
                  onChange={(e) => setSubEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0284C7]"
                >
                  <option value="Active">Active (Full Vault Access)</option>
                  <option value="Frozen">Frozen / Suspended</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Add Extra Days of Validity (+Days)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={subEditDaysToAdd}
                    onChange={(e) => setSubEditDaysToAdd(e.target.value)}
                    placeholder="30"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  />
                  <span className="text-slate-500 text-xs">Days</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSubForEdit(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold shadow-xs"
                >
                  Update Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: PRINT DISPATCH SLIPS MODAL                      */}
      {/* ======================================================== */}
      <AdminDispatchSlipModal
        isOpen={dispatchModalOpen}
        onClose={() => setDispatchModalOpen(false)}
        orders={orders}
      />

      {/* ======================================================== */}
      {/* MODAL 4: EVALUATION & GRADING MODAL                      */}
      {/* ======================================================== */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold font-serif text-slate-900">
                  Grade Student Answer Copy
                </h3>
                <p className="text-[11px] text-slate-500">
                  {selectedSubmission.studentName} &bull; {selectedSubmission.studentRoll}
                </p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Assigned Test:</span>
              <p className="font-semibold text-slate-900">{selectedSubmission.testTitle}</p>
            </div>

            <form onSubmit={handleSaveEvaluation} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Marks Awarded (out of {selectedSubmission.totalMarks})
                </label>
                <input
                  type="number"
                  required
                  max={selectedSubmission.totalMarks}
                  min={0}
                  value={evalMarks}
                  onChange={(e) => setEvalMarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono font-bold text-sm focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Examiner Feedback &amp; Rubric Notes
                </label>
                <textarea
                  rows={3}
                  value={evalRemarks}
                  onChange={(e) => setEvalRemarks(e.target.value)}
                  placeholder="Enter constructive feedback for the student..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Feedback to Student</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DISCOUNT COUPONS & PROMOS MANAGER                 */}
      {/* ======================================================== */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setCouponModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-black text-slate-900">Discount Coupons &amp; Promos</h3>
                  <p className="text-[11px] text-slate-500">Manage checkout discount codes for students</p>
                </div>
              </div>
              <button
                onClick={() => setCouponModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Existing Coupons Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Coupon Code</th>
                    <th className="p-3 text-center">Discount</th>
                    <th className="p-3 text-center">Uses</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {coupons.map((cp, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-mono font-bold text-slate-900">{cp.code}</td>
                      <td className="p-3 text-center font-bold text-emerald-600">{cp.discountPct}% OFF</td>
                      <td className="p-3 text-center font-mono text-[11px] text-slate-500">
                        {cp.usesCount} / {cp.maxUses}
                      </td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {cp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Create New Coupon Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCouponCode.trim()) return;
                const newCode = newCouponCode.trim().toUpperCase();
                const discount = parseInt(newCouponDiscount) || 15;
                setCoupons([...coupons, { code: newCode, discountPct: discount, status: "Active", maxUses: 500, usesCount: 0 }]);
                setNewCouponCode("");
                showToast(`Created new promo code "${newCode}" for ${discount}% off!`);
              }}
              className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs"
            >
              <span className="font-bold text-slate-800 block">Create New Promo Code:</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] font-semibold text-slate-600 block mb-1">Code Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CA2026"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 uppercase font-mono font-bold text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] font-semibold text-slate-600 block mb-1">Discount %</label>
                  <input
                    type="number"
                    required
                    min={5}
                    max={80}
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
                >
                  + Add Coupon Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
