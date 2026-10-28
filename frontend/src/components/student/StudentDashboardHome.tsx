"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Zap,
  Gift,
  ShieldCheck,
  ShoppingBag,
  RefreshCw,
  Lock,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getApiBaseUrl } from "@/lib/api";
import { StudentHeroCard } from "./StudentHeroCard";
import { StudentMetricStats } from "./StudentMetricStats";
import { StudentMyCoursesList, StudentCourseProgressItem } from "./StudentMyCoursesList";
import { type PromoBannersSetting, DEFAULT_PROMO_BANNERS } from "@/types/promo";

export interface ShowcaseResourceItem {
  id: string;
  courseType: "ca" | "cs" | "all-access" | "volume";
  title: string;
  badge: string;
  category: string;
  examBody: string;
  subtitle: string;
  coverImage: string;
  price: number;
  originalPrice: number;
  discount: string;
  savings: string;
  highlights: string[];
  bannerGradient: string;
  borderTheme: string;
  accentColor: string;
  buttonGradient: string;
  validityTag: string;
  comingSoon?: boolean;
  cartPayload?: {
    id: string;
    title: string;
    price: number;
    originalPrice: number;
    category: string;
    badge: string;
  };
}

const SHOWCASE_STYLE_PRESETS = [
  {
    bannerGradient: "from-[#451A03] via-[#78350F] to-[#92400E]",
    borderTheme: "border-[#F59E0B]/40 hover:border-[#FBBF24]",
    accentColor: "text-amber-300",
    buttonGradient: "bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#F59E0B] hover:to-[#D97706] text-white shadow-amber-950/40",
    coverImage: "/covers/vol1-codex.webp",
  },
  {
    bannerGradient: "from-[#082F49] via-[#075985] to-[#0284C7]",
    borderTheme: "border-[#38BDF8]/40 hover:border-[#7DD3FC]",
    accentColor: "text-sky-300",
    buttonGradient: "bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#38BDF8] hover:to-[#0284C7] text-white shadow-sky-950/40",
    coverImage: "/covers/vol2-codex.webp",
  },
  {
    bannerGradient: "from-[#7C2D12] via-[#9A3412] to-[#C2410C]",
    borderTheme: "border-[#FB923C]/40 hover:border-[#FDBA74]",
    accentColor: "text-orange-200",
    buttonGradient: "bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#F97316] hover:to-[#EA580C] text-white shadow-orange-950/40",
    coverImage: "/covers/vol1-codex.webp",
  },
  {
    bannerGradient: "from-[#14532D] via-[#166534] to-[#15803D]",
    borderTheme: "border-[#4ADE80]/40 hover:border-[#86EFAC]",
    accentColor: "text-emerald-200",
    buttonGradient: "bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#22C55E] hover:to-[#16A34A] text-white shadow-emerald-950/40",
    coverImage: "/covers/vol2-codex.webp",
  },
];

interface CatalogProduct {
  id?: string;
  title?: string;
  price?: number | string;
  original_price?: number | string;
  originalPrice?: number | string;
  courseId?: string;
  category?: string;
  badge?: string;
  examBody?: string;
  subtitle?: string;
  description?: string;
  cover_image?: string;
  highlights?: string[];
  pages_or_duration?: string;
  pages?: string;
  comingSoon?: boolean;
  isComingSoon?: boolean;
  availability?: string;
  status?: string;
}

function buildShowcaseResource(product: CatalogProduct, index: number): ShowcaseResourceItem | null {
  const productId = product?.id;
  const productTitle = product?.title;
  if (!productId || !productTitle) return null;

  const preset = SHOWCASE_STYLE_PRESETS[index % SHOWCASE_STYLE_PRESETS.length];
  const price = Number(product.price) || 0;
  const originalPrice = Number(product.original_price ?? product.originalPrice) || price;
  const isCs =
    String(product.courseId || "").toLowerCase().includes("cseet") ||
    String(product.category || "").toLowerCase().includes("cseet");
  const category = product.category || (isCs ? "CSEET" : "CA Foundation");
  const badge = product.badge || (isCs ? "ICSI CSEET" : "ICAI CA FOUNDATION");
  const discount = originalPrice > price
    ? `${Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF`
    : "AVAILABLE NOW";

  return {
    id: productId,
    courseType: isCs ? "cs" : "ca",
    title: productTitle,
    badge,
    category,
    examBody: product.examBody || (isCs ? "ICSI" : "ICAI"),
    subtitle: product.subtitle || product.description || "",
    ...preset,
    coverImage: product.cover_image || preset.coverImage,
    price,
    originalPrice,
    discount,
    savings: originalPrice > price ? `Save ₹${originalPrice - price}` : "Available Now",
    highlights: Array.isArray(product.highlights) && product.highlights.length > 0
      ? product.highlights
      : [
          product.description || "Live study material",
          product.pages_or_duration || product.pages || "Digital codex",
          "Instant access in your student dashboard",
        ],
    validityTag: product.pages_or_duration || product.pages || "Digital Codex",
    comingSoon: Boolean(product.comingSoon),
    cartPayload: {
      id: productId,
      title: productTitle,
      price,
      originalPrice,
      category,
      badge,
    },
  };
}

export const SHOWCASE_RESOURCES: ShowcaseResourceItem[] = [];

interface LevelInfo {
  level: number;
  title: string;
  badge: string;
  nextXp: number;
  minXp: number;
  progress: number;
}

interface QotdData {
  id?: string;
  subject?: string;
  section?: string;
  question?: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
  xpReward?: number;
}

interface CourseUnitContentItem {
  id?: string;
}

interface CourseUnit {
  id?: string;
  title?: string;
  contentItems?: CourseUnitContentItem[];
}

interface CourseAct {
  id?: string;
  title?: string;
  order?: number;
  isComingSoon?: boolean;
  units?: CourseUnit[];
}

interface StudentCoursePayload {
  id?: string;
  title?: string;
  description?: string;
  price?: number;
  isEnrolled?: boolean;
  acts?: CourseAct[];
}

interface StudentDashboardHomeProps {
  studentName?: string;
  streak?: number;
  longestStreak?: number;
  lawXp?: number;
  levelInfo?: LevelInfo;
  awardXp?: (amount: number, reason: string) => void;
  onOpenStreakLog?: () => void;
  onOpenBadgesModal?: () => void;
  onOpenPdf: (url: string, title: string, subtitle?: string, courseType?: "ca" | "cs" | string, isFreeSample?: boolean) => void;
  onExploreCourse: (courseId: string) => void;
  activeCourse?: "ca" | "cs";
  qotdData: QotdData;
  qotdSelected: number | null;
  qotdSubmitted: boolean;
  onSelectQotdOption: (idx: number) => void;
  onSubmitQotd: () => void;
  completedUnitsCount: number;
  totalUnitsCount: number;
  isCaUnlocked?: boolean;
  isCsUnlocked?: boolean;
  isQBankUnlocked?: boolean;
  isAllAccessUnlocked?: boolean;
  onBuyCourse?: (courseType: "ca" | "cs" | "all-access" | string) => void;
  purchasedBooks?: string[];
  studentCourses?: StudentCoursePayload[];
  completedUnits?: string[];
  catalogProducts?: CatalogProduct[];
  promoBanners?: PromoBannersSetting;
}

export interface FreeResourceItem {
  id: string;
  actName: string;
  unitNumber: number;
  title: string;
  subtitle: string;
  badge: string;
  pages: string;
  pdfUrl: string;
  courseType: "ca" | "cs";
  gradient: string;
  borderTheme: string;
  accentBadge: string;
}

export const FREE_STUDY_RESOURCES: FreeResourceItem[] = [];

export function StudentDashboardHome({
  studentName = "Student",
  onOpenPdf,
  activeCourse = "ca",
  onExploreCourse,
  qotdData,
  qotdSelected,
  qotdSubmitted,
  onSelectQotdOption,
  isCaUnlocked = false,
  isCsUnlocked = false,
  isQBankUnlocked = false,
  onBuyCourse,
  purchasedBooks = [],
  studentCourses = [],
  completedUnits = [],
  catalogProducts = [],
  promoBanners = DEFAULT_PROMO_BANNERS,
}: StudentDashboardHomeProps) {
  const { addToCart, setIsCartOpen, setCheckoutStep } = useCart();
  const promoCarouselRef = useRef<HTMLDivElement>(null);
  const freeNotesCarouselRef = useRef<HTMLDivElement>(null);
  const quizSectionRef = useRef<HTMLDivElement>(null);
  const [promoSlideIndex, setPromoSlideIndex] = useState(0);
  const [isReconciling, setIsReconciling] = useState(false);

  const handleReconcileAccess = async () => {
    try {
      setIsReconciling(true);
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("lawkaksha_student_token") ||
            localStorage.getItem("lawkaksha_token") ||
            localStorage.getItem("token")
          : null;
      if (!token) {
        alert("Please login first to check your payment status.");
        return;
      }
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/api/orders/reconcile-my-access`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || "Payment reconciliation complete.");
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      } else {
        alert(data.message || "No pending payment found to restore.");
      }
    } catch (e) {
      alert("Error checking access status: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setIsReconciling(false);
    }
  };

  // Helper to determine if a course / codex / pass is already owned or subscribed to by the student
  const isResourceOwned = useCallback(
    (resource: ShowcaseResourceItem): boolean => {
      // Question Bank is a standalone purchase and is NOT included in CA Foundation or All-Access pass
      if (
        resource.id === "course-ca-qbank" ||
        resource.id === "prod-qbank" ||
        resource.id.includes("qbank") ||
        resource.id.includes("question-bank") ||
        resource.title?.toLowerCase().includes("question bank")
      ) {
        return Boolean(
          isQBankUnlocked ||
          purchasedBooks.includes("course-ca-qbank") ||
          purchasedBooks.includes("ca-foundation-qbank") ||
          purchasedBooks.includes("ca-qbank") ||
          purchasedBooks.includes("sub-ca-qbank") ||
          purchasedBooks.includes("prod-qbank")
        );
      }

      if (resource.courseType === "all-access" || resource.id === "prod-combo") {
        return Boolean(
          (isCaUnlocked && isCsUnlocked) ||
          purchasedBooks.includes("prod-combo") ||
          purchasedBooks.includes("all-access")
        );
      }

      if (resource.courseType === "ca" || resource.id === "course-ca-foundation-sub") {
        return Boolean(
          isCaUnlocked ||
          purchasedBooks.includes("course-ca-foundation-sub") ||
          purchasedBooks.includes("ca-foundation") ||
          purchasedBooks.includes("ca-foundation-business-laws") ||
          purchasedBooks.includes("prod-combo") ||
          purchasedBooks.includes("all-access")
        );
      }

      if (resource.courseType === "cs" || resource.id === "course-cseet-sub") {
        return Boolean(
          isCsUnlocked ||
          purchasedBooks.includes("course-cseet-sub") ||
          purchasedBooks.includes("cseet") ||
          purchasedBooks.includes("cseet-business-law") ||
          purchasedBooks.includes("cseet-management") ||
          purchasedBooks.includes("prod-combo") ||
          purchasedBooks.includes("all-access")
        );
      }

      if (resource.id === "prod-vol1") {
        return Boolean(
          isCaUnlocked ||
          purchasedBooks.includes("prod-vol1") ||
          purchasedBooks.includes("book-vol-1") ||
          purchasedBooks.includes("ca-book-vol-1") ||
          purchasedBooks.includes("course-ca-foundation-sub") ||
          purchasedBooks.includes("all-access")
        );
      }

      if (resource.id === "prod-vol2") {
        return Boolean(
          isCsUnlocked ||
          purchasedBooks.includes("prod-vol2") ||
          purchasedBooks.includes("book-vol-2") ||
          purchasedBooks.includes("ca-book-vol-2") ||
          purchasedBooks.includes("course-cseet-sub") ||
          purchasedBooks.includes("all-access")
        );
      }

      if (resource.id === "prod-cases-vault") {
        return Boolean(
          purchasedBooks.includes("prod-cases-vault") ||
          purchasedBooks.includes("book-ldr") ||
          purchasedBooks.includes("cases-course") ||
          (isCaUnlocked && isCsUnlocked)
        );
      }

      if (resource.id === "prod-mcq-simulator") {
        return Boolean(
          purchasedBooks.includes("prod-mcq-simulator") ||
          purchasedBooks.includes("book-mcq") ||
          purchasedBooks.includes("mcq-simulator-course") ||
          isCsUnlocked
        );
      }

      return Boolean(
        purchasedBooks.includes(resource.id) ||
        (resource.cartPayload && purchasedBooks.includes(resource.cartPayload.id))
      );
    },
    [isCaUnlocked, isCsUnlocked, isQBankUnlocked, purchasedBooks]
  );

  // ONLY show live catalog products that the student has NOT subscribed to yet
  const liveShowcaseResources = useMemo(() => {
    const seen = new Set<string>();
    const resources: ShowcaseResourceItem[] = [];

    catalogProducts.forEach((product, index) => {
      const productId = product?.id;
      if (
        !productId ||
        productId === "prod-vol1" ||
        productId === "prod-vol2" ||
        product.title?.includes("Volume 1: Business Law") ||
        product.title?.includes("Volume 2: CSEET") ||
        product.comingSoon ||
        product.isComingSoon ||
        product.availability === "coming_soon" ||
        product.status === "Draft" ||
        product.status === "Coming Soon"
      ) {
        return;
      }
      if (seen.has(productId)) return;

      const resource = buildShowcaseResource(product, index);
      if (!resource) return;

      seen.add(productId);
      resources.push(resource);
    });

    return resources;
  }, [catalogProducts]);

  const unsubscribedShowcaseResources = useMemo(() => {
    return liveShowcaseResources.filter((resource) => !isResourceOwned(resource));
  }, [isResourceOwned, liveShowcaseResources]);

  const [isHovered, setIsHovered] = useState(false);

  // Live Auto-Scroll timer (fast 2.2s auto-advance, paused on hover/touch)
  useEffect(() => {
    if (isHovered || unsubscribedShowcaseResources.length <= 1) return;

    const interval = setInterval(() => {
      if (promoCarouselRef.current) {
        const container = promoCarouselRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        // Dynamically compute exact card width + gap for pixel-perfect slide alignment
        const firstCard = container.querySelector<HTMLElement>(":scope > div");
        const cardStep = firstCard
          ? firstCard.offsetWidth + 16
          : container.clientWidth >= 640
          ? 480
          : 300;

        const nextScroll = container.scrollLeft + cardStep;
        if (nextScroll >= maxScroll - 15) {
          container.scrollTo({ left: 0, behavior: "smooth" });
          setPromoSlideIndex(0);
        } else {
          container.scrollTo({ left: nextScroll, behavior: "smooth" });
          const newIdx = Math.round(nextScroll / cardStep);
          setPromoSlideIndex(Math.min(newIdx, unsubscribedShowcaseResources.length - 1));
        }
      }
    }, 2200);

    return () => clearInterval(interval);
  }, [isHovered, unsubscribedShowcaseResources.length]);

  const scrollFreeNotes = (direction: "left" | "right") => {
    if (freeNotesCarouselRef.current) {
      const container = freeNotesCarouselRef.current;
      const offset = 290 * (direction === "left" ? -1 : 1);
      container.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const scrollPromoCarousel = (direction: "left" | "right") => {
    if (promoCarouselRef.current) {
      const container = promoCarouselRef.current;
      const firstCard = container.querySelector<HTMLElement>(":scope > div");
      const cardStep = firstCard
        ? firstCard.offsetWidth + 16
        : container.clientWidth >= 640
        ? 480
        : 300;
      const offset = direction === "left" ? -cardStep : cardStep;
      promoCarouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const scrollToPromoSlide = (idx: number) => {
    if (promoCarouselRef.current) {
      const container = promoCarouselRef.current;
      const firstCard = container.querySelector<HTMLElement>(":scope > div");
      const cardStep = firstCard
        ? firstCard.offsetWidth + 16
        : container.clientWidth >= 640
        ? 480
        : 300;
      container.scrollTo({ left: idx * cardStep, behavior: "smooth" });
      setPromoSlideIndex(idx);
    }
  };

  const handlePromoScroll = () => {
    if (promoCarouselRef.current) {
      const container = promoCarouselRef.current;
      const scrollLeft = container.scrollLeft;
      const firstCard = container.querySelector<HTMLElement>(":scope > div");
      const cardStep = firstCard
        ? firstCard.offsetWidth + 16
        : container.clientWidth >= 640
        ? 480
        : 300;
      const index = Math.round(scrollLeft / cardStep);
      setPromoSlideIndex(Math.max(0, Math.min(index, unsubscribedShowcaseResources.length - 1)));
    }
  };

  // Direct In-Dashboard Buy Action: adds product to cart and immediately triggers instant checkout
  const handleBuyItem = (course: ShowcaseResourceItem) => {
    const itemToBuy = course.cartPayload || {
      id: course.id,
      title: course.title,
      price: course.price,
      originalPrice: course.originalPrice,
      category: course.category,
      badge: course.badge,
    };

    addToCart({
      id: itemToBuy.id,
      title: itemToBuy.title,
      format: "pdf",
      price: itemToBuy.price,
      originalPrice: itemToBuy.originalPrice,
      category: itemToBuy.category,
      badge: itemToBuy.badge,
    });
    setIsCartOpen(true);
    setCheckoutStep("details");
  };

  const studentCourseList: StudentCourseProgressItem[] = useMemo(() => {
    const items: StudentCourseProgressItem[] = [];
    const completedSet = new Set<string | undefined>(completedUnits);

    (Array.isArray(studentCourses) ? studentCourses : []).forEach((course) => {
      const courseId = String(course?.id || "").toLowerCase();
      const courseTitle = String(course?.title || "").toLowerCase();
      const isCsCourse =
        courseId.includes("cseet") ||
        courseId.includes("cs-") ||
        courseTitle.includes("cseet");
      const courseCategory: "ca" | "cs" = isCsCourse ? "cs" : "ca";

      if (courseCategory !== activeCourse) return;

      const isQBankCourse =
        courseId === "course-ca-qbank" ||
        courseId.includes("qbank") ||
        courseTitle.includes("question bank");

      const isActuallyEnrolled = isQBankCourse
        ? Boolean(course?.isEnrolled || isQBankUnlocked || purchasedBooks.includes("course-ca-qbank"))
        : Boolean(course?.isEnrolled || (courseCategory === "ca" ? isCaUnlocked : isCsUnlocked));
      if (!isActuallyEnrolled) return;

      (Array.isArray(course?.acts) ? course.acts : []).forEach((act) => {
        if (act?.isComingSoon) return;

        const units = Array.isArray(act?.units) ? act.units : [];
        const totalLessons = units.length;
        const completedLessons = units.filter((unit) => completedSet.has(unit.id)).length;
        const firstContent = units
          .flatMap((unit) => (Array.isArray(unit?.contentItems) ? unit.contentItems : []))
          .find((item) => item?.id);

        items.push({
          id: act.id ?? "",
          name: act.title ?? "",
          code: `Chapter ${act.order || items.length + 1}`,
          weightage: `${totalLessons} ${totalLessons === 1 ? "Unit" : "Units"}`,
          description: units[0]?.title || "Live statutory module",
          totalLessons,
          completedLessons,
          progressPercent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
          pdfUrl: firstContent?.id ? `/api/content/${firstContent.id}/file` : "",
          isUnlocked: true,
          category: courseCategory,
        });
      });
    });

    // Indestructible safety fallback:
    // If student has unlocked CA or CS stream, but studentCourses hasn't loaded acts yet,
    // ensure studentCourseList contains the foundational curriculum chapters so it is never 0/blank!
    if (items.length === 0 && (activeCourse === "ca" ? isCaUnlocked : isCsUnlocked)) {
      if (activeCourse === "ca") {
        const caDefaults: StudentCourseProgressItem[] = [
          {
            id: "act-contract",
            name: "The Indian Contract Act, 1872",
            code: "Chapter 1",
            weightage: "9 Units",
            description: "Unit 1: Essentials of Valid Contract",
            totalLessons: 9,
            completedLessons: completedUnits.filter(u => u && (u.includes("contract") || u.includes("ch1"))).length,
            progressPercent: 30,
            pdfUrl: "/notes/Unit 1 - Nature of Contracts.pdf",
            isUnlocked: true,
            category: "ca",
          },
          {
            id: "act-soga",
            name: "The Sale of Goods Act, 1930",
            code: "Chapter 2",
            weightage: "4 Units",
            description: "Unit 1: Formation of Contract of Sale",
            totalLessons: 4,
            completedLessons: completedUnits.filter(u => u && (u.includes("soga") || u.includes("ch2"))).length,
            progressPercent: 20,
            pdfUrl: "/notes/SOGA Unit 1 .pdf",
            isUnlocked: true,
            category: "ca",
          },
          {
            id: "act-partnership",
            name: "The Indian Partnership Act, 1932",
            code: "Chapter 3",
            weightage: "4 Units",
            description: "Unit 1: General Nature of Partnership",
            totalLessons: 4,
            completedLessons: completedUnits.filter(u => u && (u.includes("partnership") || u.includes("ch3"))).length,
            progressPercent: 45,
            pdfUrl: "/notes/UNIT 1 GENERAL NATURE OF PARTNERSHIP.pdf",
            isUnlocked: true,
            category: "ca",
          },
          {
            id: "act-llp",
            name: "The Limited Liability Partnership Act, 2008",
            code: "Chapter 4",
            weightage: "2 Units",
            description: "Unit 1: Salient Features & Incorporation",
            totalLessons: 2,
            completedLessons: completedUnits.filter(u => u && (u.includes("llp") || u.includes("ch4"))).length,
            progressPercent: 0,
            pdfUrl: "/notes/THE LIMITED LIABILITY PARTNERSHIP ACT, 2008.pdf",
            isUnlocked: true,
            category: "ca",
          },
          {
            id: "act-companies",
            name: "The Companies Act, 2013",
            code: "Chapter 5",
            weightage: "2 Units",
            description: "Unit 1: Essential Characteristics & Types of Companies",
            totalLessons: 2,
            completedLessons: completedUnits.filter(u => u && (u.includes("companies") || u.includes("ch5"))).length,
            progressPercent: 0,
            pdfUrl: "/notes/Indian_Contract_Act_LDR_Flowchart Book.pdf",
            isUnlocked: true,
            category: "ca",
          },
        ];
        items.push(...caDefaults);
      } else {
        const csDefaults: StudentCourseProgressItem[] = [
          {
            id: "act-cseet-mgmt",
            name: "Business Management (Paper 2, Part B)",
            code: "Chapter 1",
            weightage: "4 Units",
            description: "Unit 7: Henri Fayol 14 Principles of Management",
            totalLessons: 4,
            completedLessons: completedUnits.filter(u => u && (u.includes("mgmt") || u.includes("u7"))).length,
            progressPercent: 25,
            pdfUrl: "/notes/Lesson 7 Introduction to Management (Comprehensive Notes).pdf",
            isUnlocked: true,
            category: "cs",
          },
          {
            id: "act-cseet-legal",
            name: "Legal Aptitude and Business Communication",
            code: "Chapter 2",
            weightage: "6 Units",
            description: "Elements of Company Law and Indian Constitution",
            totalLessons: 6,
            completedLessons: completedUnits.filter(u => u && (u.includes("legal") || u.includes("comm"))).length,
            progressPercent: 15,
            pdfUrl: "/notes/Lesson 10 Management Knowledge for CS.pdf",
            isUnlocked: true,
            category: "cs",
          },
        ];
        items.push(...csDefaults);
      }
    }

    return items;
  }, [activeCourse, completedUnits, isCaUnlocked, isCsUnlocked, isQBankUnlocked, purchasedBooks, studentCourses]);

  const unenrolledCourses = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      description: string;
      price: number;
      courseType: "ca" | "cs";
    }> = [];

    const isCaEnrolled = Boolean(
      isCaUnlocked ||
      (Array.isArray(studentCourses) &&
        studentCourses.some((c) => {
          const cId = String(c?.id || "").toLowerCase();
          const cTitle = String(c?.title || "").toLowerCase();
          if (cId === "course-ca-qbank" || cId.includes("qbank") || cTitle.includes("question bank")) return false;
          return (cId.includes("ca") || cTitle.includes("ca") || cId.includes("foundation")) && c?.isEnrolled;
        }))
    );

    const isCsEnrolled = Boolean(
      isCsUnlocked ||
      (Array.isArray(studentCourses) &&
        studentCourses.some((c) => {
          const cId = String(c?.id || "").toLowerCase();
          const cTitle = String(c?.title || "").toLowerCase();
          return (cId.includes("cs") || cTitle.includes("cseet")) && c?.isEnrolled;
        }))
    );

    const isQBankEnrolled = Boolean(
      isQBankUnlocked ||
      purchasedBooks.includes("course-ca-qbank") ||
      (Array.isArray(studentCourses) &&
        studentCourses.some((c) => {
          const cId = String(c?.id || "").toLowerCase();
          return (cId === "course-ca-qbank" || cId.includes("qbank")) && c?.isEnrolled;
        }))
    );

    const caDbCourse = Array.isArray(studentCourses)
      ? studentCourses.find((c) => {
          const cId = String(c?.id || "").toLowerCase();
          const cTitle = String(c?.title || "").toLowerCase();
          if (cId === "course-ca-qbank" || cId.includes("qbank") || cTitle.includes("question bank")) return false;
          return cId.includes("ca") || cId.includes("foundation");
        })
      : undefined;

    const csDbCourse = Array.isArray(studentCourses)
      ? studentCourses.find((c) => {
          const cId = String(c?.id || "").toLowerCase();
          return cId.includes("cs") || cId.includes("cseet");
        })
      : undefined;

    const qbankDbCourse = Array.isArray(studentCourses)
      ? studentCourses.find((c) => {
          const cId = String(c?.id || "").toLowerCase();
          return cId === "course-ca-qbank" || cId.includes("qbank");
        })
      : undefined;

    if (!isCaEnrolled) {
      list.push({
        id: caDbCourse?.id || "ca-foundation",
        title: caDbCourse?.title || "CA Foundation Business Laws",
        description:
          caDbCourse?.description ||
          "Comprehensive CA Foundation Paper 2 Business Laws preparation codex, chapter notes, and examiner traps.",
        price: Number(caDbCourse?.price ?? promoBanners?.caCard?.price ?? 1),
        courseType: "ca",
      });
    }

    if (!isQBankEnrolled) {
      list.push({
        id: "course-ca-qbank",
        title: qbankDbCourse?.title || "CA Foundation Question Bank (Part 1 & 2)",
        description:
          qbankDbCourse?.description ||
          "Smart revision exam question bank codex with comprehensive solutions, Part 1 & 2 included.",
        price: Number(qbankDbCourse?.price ?? 349),
        courseType: "ca",
      });
    }

    if (!isCsEnrolled) {
      list.push({
        id: csDbCourse?.id || "course-cseet",
        title: csDbCourse?.title || "CSEET Business Laws and Management",
        description:
          csDbCourse?.description ||
          "Comprehensive ICSI CSEET Paper 2 Business Laws & Management preparation codex.",
        price: Number(csDbCourse?.price ?? promoBanners?.csCard?.price ?? 1),
        courseType: "cs",
      });
    }

    return list;
  }, [studentCourses, isCaUnlocked, isCsUnlocked, isQBankUnlocked, purchasedBooks, promoBanners]);

  const handleContinueLearning = () => {
    const firstCourse = studentCourseList[0];
    if (firstCourse?.pdfUrl) {
      onOpenPdf(firstCourse.pdfUrl, firstCourse.name, firstCourse.description, firstCourse.category, true);
      return;
    }
    onExploreCourse(activeCourse === "ca" ? "ca-foundation" : "course-cseet");
  };

  const handleOpenStudentCourse = (courseItem: StudentCourseProgressItem) => {
    if (courseItem.isUnlocked && courseItem.pdfUrl) {
      onOpenPdf(courseItem.pdfUrl, courseItem.name, courseItem.code, courseItem.category, true);
    } else if (!courseItem.isUnlocked && onBuyCourse) {
      onBuyCourse(courseItem.category);
    } else {
      onExploreCourse(courseItem.category === "ca" ? "ca-foundation" : "course-cseet");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7 text-[#13264F] select-none font-sans relative">
      {/* ========================================================================= */}
      {/* 1. HERO GREETING CARD (MATCHING SVG PHONE 1 EXACT THEME & VECTOR ART)     */}
      {/* ========================================================================= */}
      <StudentHeroCard
        studentName={studentName}
        lastReadTitle={activeCourse === "ca" ? "The Indian Contract Act, 1872" : "General Principles of Management"}
        lastReadSubtitle={activeCourse === "ca" ? "Unit 1: Essentials of Valid Contract" : "Unit 7: Henri Fayol 14 Principles"}
        onContinueLearning={handleContinueLearning}
      />

      {/* ========================================================================= */}
      {/* 2. THREE STAT CARDS (COURSES, LESSONS, CERTIFICATES - SVG EXACT DESIGN)    */}
      {/* ========================================================================= */}
      <StudentMetricStats
        coursesCount={studentCourseList.length}
        lessonsCount={studentCourseList.reduce((total, course) => total + course.totalLessons, 0)}
        certificatesCount={0}
        onViewCourses={() => onExploreCourse && onExploreCourse("ca-foundation")}
        onViewLessons={() => onExploreCourse && onExploreCourse("ca-foundation")}
        onViewCertificates={() => onExploreCourse && onExploreCourse("ca-foundation")}
      />

      {/* ========================================================================= */}
      {/* 3. MY COURSES SECTION (SEARCH, FILTERS, PROGRESS BARS MATCHING SVG)        */}
      {/* ========================================================================= */}
      <section className="space-y-3.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h3 className="text-lg sm:text-xl font-extrabold text-[#13264F] tracking-tight">
            My Courses
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReconcileAccess}
              disabled={isReconciling}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-700 shadow-xs cursor-pointer transition-colors"
              title="Click here if you completed payment but cannot access course material"
            >
              <RefreshCw className={`w-3 h-3 text-slate-500 ${isReconciling ? "animate-spin" : ""}`} />
              <span>{isReconciling ? "Checking Access..." : "I paid but can't access"}</span>
            </button>
            <button
              onClick={() => onExploreCourse && onExploreCourse("ca-foundation")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#3558E8] hover:underline cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <StudentMyCoursesList
          courses={studentCourseList}
          onOpenCourse={handleOpenStudentCourse}
          onExploreMore={() => onExploreCourse && onExploreCourse("ca-foundation")}
          showSearchAndFilters={true}
        />
      </section>

      {/* ========================================================================= */}
      {/* 3B. ADVERTISEMENT: CURRICULUM PASS REQUIRED (UNENROLLED COURSES)          */}
      {/* ========================================================================= */}
      {unenrolledCourses.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B21A8] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#9333EA]" />
              <span>{promoBanners?.sectionTitle || "LAW KAKSHA CODEX PASSES"}</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
              Instant DRM Auto-Unlock
            </span>
          </div>

          <div className={`grid grid-cols-1 ${unenrolledCourses.length > 1 ? "md:grid-cols-2" : "max-w-2xl"} gap-4`}>
            {unenrolledCourses.map((c) => (
              <div
                key={c.id}
                className="rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-white/10 p-5 sm:p-6 text-white shadow-md flex flex-col justify-between min-h-[190px] gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>Curriculum Pass Required</span>
                    </span>
                    <span className="text-sm font-extrabold text-emerald-400">₹{c.price || 1}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white !text-white leading-snug">{c.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {c.description || "Unlock all statutory acts, comprehensive unit codices, LDR charts, and examiner marking traps."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onBuyCourse) onBuyCourse(c.id === "course-ca-qbank" ? "course-ca-qbank" : c.courseType);
                    else onExploreCourse(c.id);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:scale-[1.01]"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Unlock Full Course • ₹{c.price || 1}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. LIVE FAST AUTO-SCROLLING RESOURCE & MASTER PASS MARKETING CAROUSEL      */}
      {/* ========================================================================= */}
      {unsubscribedShowcaseResources.length === 0 ? (
        <section className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#31104B] border border-[#A855F7]/30 p-4 sm:p-6 text-white shadow-md relative overflow-hidden group">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#A855F7]/15 blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#9333EA]/20 border border-[#C084FC]/40 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                🎓
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>No New Passes Available</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  All Live Curriculum Passes Are Already in Your Dashboard
                </h3>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  New passes will appear here automatically as soon as they are published on the main website.
                </p>
              </div>
            </div>
            <Link
              href="/courses"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shrink-0 shadow-md cursor-pointer active:scale-98"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Browse Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      ) : (
        <section
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          className="space-y-3 bg-gradient-to-b from-[#FAF5FF]/80 via-white to-white rounded-2xl sm:rounded-3xl border border-[#EDE9FE] p-3 sm:p-5 shadow-xs relative group/showcase"
        >
          {/* Header Row: Live Pulse Indicator, Title & Navigation Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
            <div className="space-y-0.5 sm:space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-[#F3E8FF] text-[#7E22CE] border border-[#DDD6FE]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9333EA] animate-ping" />
                  <span className="hidden xs:inline">Available Master Passes &amp; Codices</span>
                  <span className="xs:hidden">Available Passes</span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#6B7280]">
                  {isHovered ? "Paused" : "Auto-scrolling"}
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-[#7E22CE] bg-[#F3E8FF] px-2 py-0.5 rounded-full">
                  {unsubscribedShowcaseResources.length} Unsubscribed
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-[#1F2937] tracking-tight">
                Curriculum Codices &amp; Master Passes
              </h2>
              <p className="text-[11px] sm:text-xs text-[#6B7280] max-w-2xl leading-relaxed hidden xs:block">
                Directly unlock statutory codices, case study question banks &amp; timed mock test passes into your student dashboard.
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <Link
                href="/courses"
                className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-[#7E22CE] hover:text-[#581C87] px-3 py-1.5 rounded-full hover:bg-[#F3E8FF]/60 transition-colors"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              {/* Carousel Prev/Next Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollPromoCarousel("left")}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D1D5DB] bg-white hover:bg-[#F3E8FF] hover:border-[#7E22CE] text-[#4B5563] hover:text-[#7E22CE] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                  aria-label="Previous Item"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => scrollPromoCarousel("right")}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D1D5DB] bg-white hover:bg-[#F3E8FF] hover:border-[#7E22CE] text-[#4B5563] hover:text-[#7E22CE] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                  aria-label="Next Item"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Smooth Horizontal Carousel Track: Unsubscribed Items Only */}
          <div
            ref={promoCarouselRef}
            onScroll={handlePromoScroll}
            className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto pb-2 pt-0.5 scroll-smooth snap-x snap-mandatory no-scrollbar touch-pan-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {unsubscribedShowcaseResources.map((resource) => (
              <div
                key={resource.id}
                className={`w-[86vw] xs:w-[350px] sm:w-[460px] lg:w-[490px] max-w-[500px] shrink-0 snap-start flex flex-row items-stretch gap-2.5 xs:gap-3 sm:gap-4 justify-between rounded-2xl sm:rounded-3xl bg-gradient-to-br ${resource.bannerGradient} border ${resource.borderTheme} p-3 sm:p-4 text-white shadow-xs hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
              >
                {/* Decorative Subtle Background Radial Glow */}
                <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

                {/* Left Column: 3D Book Cover Image Mockup */}
                <div className="relative w-24 xs:w-28 sm:w-36 md:w-40 self-stretch shrink-0 flex flex-col items-center justify-between rounded-xl sm:rounded-2xl bg-black/25 border border-white/10 p-2 sm:p-3 overflow-hidden shadow-inner group-hover:border-white/20 transition-all">
                  {/* Top discount / status tag */}
                  <div className="w-full flex items-center justify-between gap-1 z-10">
                    <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-amber-300 border border-amber-300/30">
                      {resource.discount}
                    </span>
                    <span className="text-[8px] xs:text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-amber-400 text-amber-950 shadow-2xs">
                      Unlock
                    </span>
                  </div>

                  {/* 3D Book Cover Image */}
                  <div className="relative w-16 xs:w-20 sm:w-28 md:w-32 h-24 xs:h-28 sm:h-36 md:h-40 my-1 sm:my-2 drop-shadow-2xl transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={resource.coverImage}
                      alt={resource.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 110px, 140px"
                    />
                  </div>

                  {/* Format tag */}
                  <span className="text-[8px] sm:text-[9px] font-bold text-white/70 uppercase tracking-wider z-10 text-center">
                    Digital Codex
                  </span>
                </div>

                {/* Right Column: Resource Details, Pricing & Direct Buy CTA */}
                <div className="flex-1 min-w-0 flex flex-col justify-between space-y-1.5 sm:space-y-3 relative z-10">
                  <div className="space-y-1 sm:space-y-1.5">
                    {/* Badge & Exam Category */}
                    <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-xs text-white border border-white/20 truncate max-w-full">
                        {resource.badge}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-semibold text-white/70 truncate hidden xs:inline">
                        {resource.examBody}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <h3 className="text-xs xs:text-sm sm:text-base font-black leading-snug text-white tracking-tight line-clamp-2">
                        {resource.title}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-white/80 line-clamp-1 sm:line-clamp-2 mt-0.5 leading-relaxed hidden xs:block">
                        {resource.subtitle}
                      </p>
                    </div>

                    {/* Highlights bullet list */}
                    <div className="space-y-0.5 sm:space-y-1 pt-0.5">
                      {resource.highlights.slice(0, 3).map((h, i) => (
                        <div
                          key={i}
                          className={`flex items-start gap-1 sm:gap-1.5 text-[9px] xs:text-[10px] sm:text-[11px] text-white/90 font-medium leading-tight ${i >= 2 ? "hidden sm:flex" : ""}`}
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-300 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom: Price row & Direct Buy CTA */}
                  <div className="space-y-1.5 sm:space-y-2 pt-1 sm:pt-2 border-t border-white/15">
                    <div className="flex items-baseline justify-between">
                      {resource.comingSoon ? (
                        <span className="text-base sm:text-2xl font-black text-white">
                          Launching Soon
                        </span>
                      ) : (
                        <div className="flex items-baseline gap-1 sm:gap-1.5">
                          <span className="text-base sm:text-2xl font-black text-white">
                            ₹{resource.price}
                          </span>
                          <span className="text-[10px] sm:text-xs text-white/60 line-through font-mono">
                            ₹{resource.originalPrice}
                          </span>
                          <span className="text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-400 text-amber-950 font-sans shadow-2xs">
                            {resource.savings}
                          </span>
                        </div>
                      )}
                      <span className="text-[9px] sm:text-[10px] font-medium text-white/70 hidden sm:inline">
                        {resource.validityTag}
                      </span>
                    </div>

                    {/* Direct Buy Button: Instant In-Dashboard Checkout */}
                    <div className="space-y-1 sm:space-y-1.5">
                      {resource.comingSoon ? (
                        <button
                          type="button"
                          disabled
                          className="w-full py-2 sm:py-2.5 px-3 rounded-lg sm:rounded-xl bg-white/10 border border-white/20 text-white/60 font-black text-[11px] sm:text-xs flex items-center justify-center gap-1.5 cursor-not-allowed"
                        >
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                          <span>Coming Soon</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuyItem(resource)}
                          className={`w-full py-2 sm:py-2.5 px-3 rounded-lg sm:rounded-xl ${resource.buttonGradient} font-black text-[11px] sm:text-xs transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 shadow-md hover:shadow-lg`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                          <span className="truncate">Buy Now • ₹{resource.price}</span>
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform group-hover:translate-x-1" />
                        </button>
                      )}

                      <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-white/70 px-0.5">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-300" />
                          <span>Instant Auto-Unlock</span>
                        </span>
                        <button
                          onClick={() => onExploreCourse && onExploreCourse(resource.courseType === "all-access" ? "all-access" : resource.courseType)}
                          className="hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
                        >
                          Syllabus &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Navigation Indicators with touch-friendly tap targets */}
          <div className="flex items-center justify-center gap-0.5 sm:gap-1 pt-0.5">
            {unsubscribedShowcaseResources.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToPromoSlide(idx)}
                className="p-1.5 sm:p-1 cursor-pointer flex items-center justify-center"
                aria-label={`Slide ${idx + 1}`}
              >
                <span
                  className={`h-1.5 rounded-full transition-all duration-200 block ${
                    promoSlideIndex === idx ? "w-5 sm:w-6 bg-[#7E22CE]" : "w-1.5 bg-[#DDD6FE] hover:bg-[#C084FC]"
                  }`}
                />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 2. FREE STUDY RESOURCES & SAMPLE NOTES (HORIZONTAL SCROLLABLE CAROUSEL)    */}
      {/* ========================================================================= */}
      {FREE_STUDY_RESOURCES.length > 0 && (
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Gift className="w-3 h-3 text-emerald-700" />
                  <span>Free Study Resources</span>
                </span>
                <span className="text-[11px] font-semibold text-[#6B7280]">
                  100% Free • Direct In-Web DRM Reader
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#1F2937] tracking-tight mt-1">
                Free Sample Papers
              </h3>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-xs text-[#6B7280] hidden md:block">
                Preview before you subscribe
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollFreeNotes("left")}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D1D5DB] bg-white hover:bg-[#FAF5FF] hover:border-[#7E22CE] text-[#4B5563] hover:text-[#7E22CE] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                  aria-label="Previous note"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollFreeNotes("right")}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D1D5DB] bg-white hover:bg-[#FAF5FF] hover:border-[#7E22CE] text-[#4B5563] hover:text-[#7E22CE] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                  aria-label="Next note"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>

          <div
            ref={freeNotesCarouselRef}
            className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth no-scrollbar snap-x touch-pan-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {FREE_STUDY_RESOURCES.filter(
              (resource) =>
                resource.id.includes("question-bank") ||
                resource.pdfUrl.includes("Sample") ||
                resource.pdfUrl.includes("sample")
            ).map((res) => (
              <div
                key={res.id}
                className={`w-[260px] sm:w-[285px] shrink-0 snap-start rounded-2xl sm:rounded-3xl border ${res.borderTheme} bg-gradient-to-br ${res.gradient} p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border shadow-2xs ${res.accentBadge}`}>
                      {res.badge}
                    </span>
                    <span className="text-[10px] font-semibold text-[#6B7280] bg-white/80 px-2 py-0.5 rounded-md border border-gray-200">
                      {res.pages}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                      {res.actName}
                    </span>
                    <h4 className="text-sm font-bold text-[#1F2937] leading-snug group-hover:text-[#7E22CE] transition-colors mt-0.5 line-clamp-1">
                      {res.title}
                    </h4>
                    <p className="text-[11px] text-[#4B5563] mt-1 line-clamp-2 leading-relaxed">
                      {res.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Free Full PDF</span>
                  </span>

                  <button
                    onClick={() => onOpenPdf(res.pdfUrl, res.actName, res.title, res.courseType, true)}
                    className="px-3 py-1.5 rounded-xl bg-[#7E22CE] hover:bg-[#6B21A8] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Note</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. DAILY PRACTICE & STUDY DRILL (CLEAN & MINIMAL GAMIFICATION)             */}
      {/* ========================================================================= */}
      <div
        ref={quizSectionRef}
        className="bg-white rounded-2xl sm:rounded-3xl border border-[#E7E4E7] p-4 sm:p-6 shadow-2xs space-y-3 sm:space-y-3.5"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-[#FEF3C7] text-[#D97706] flex items-center gap-1">
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#D97706]" />
              <span>Daily 1-Min Quiz (+15 Pts)</span>
            </span>
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-[#7E22CE]">ICAI / ICSI Pattern</span>
        </div>

        <p className="text-sm font-semibold text-[#1F2937] leading-relaxed">
          {qotdData?.question ||
            "Under Section 16(1) of Sale of Goods Act, when is a product expected to work properly for the buyer?"}
        </p>

        <div className="space-y-2 pt-1">
          {qotdData?.options?.map((opt: string, idx: number) => {
            const isChosen = qotdSelected === idx;
            const isCorrect = idx === qotdData.correctIndex;
            let btnStyle =
              "bg-[#F9FAFB] border-[#E5E7EB] text-[#374151] hover:bg-white";

            if (qotdSubmitted) {
              if (isCorrect)
                btnStyle = "bg-[#D1FAE5] border-[#10B981] text-[#065F46] font-bold";
              else if (isChosen)
                btnStyle = "bg-[#FEE2E2] border-[#EF4444] text-[#991B1B]";
              else btnStyle = "bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF]";
            } else if (isChosen) {
              btnStyle = "bg-[#FAF5FF] border-[#7E22CE] text-[#581C87] font-bold";
            }

            return (
              <button
                key={idx}
                disabled={qotdSubmitted}
                onClick={() => onSelectQotdOption(idx)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white border border-[#D1D5DB] text-[10px] font-bold flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>
                {qotdSubmitted && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {qotdSubmitted && (
          <div className="p-3 bg-[#FAF5FF] rounded-xl border border-[#E9DDF5] text-xs text-[#374151] leading-relaxed">
            <p className="font-bold text-[#1F2937]">Explanation in Simple Words:</p>
            <p className="mt-0.5 text-[#4B5563]">{qotdData?.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
