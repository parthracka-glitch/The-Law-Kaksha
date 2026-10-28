"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import {
  BookOpen,
  ChevronRight,
  ChevronDown,
  Lock,
  Clock,
  FileText,
  Workflow,
  Bookmark,
  CheckCircle2,
  Circle,
  Eye,
  Layers,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles,
  Scale,
  Landmark,
  Award,
  HelpCircle,
  Check,
  X,
  ExternalLink,
  ChevronLeft,
  Zap,
  Flame,
  Star,
  GraduationCap,
  Compass,
} from "lucide-react";
import { getApiBaseUrl, type JsonObject } from "@/lib/api";

export interface HierarchicalContentItem {
  id: string;
  title: string;
  contentType: "notes" | "flowchart" | "infographic" | "practice" | "pyq" | "ldr" | "video";
  description?: string;
  duration?: string;
  pages?: string;
  isFreeSample?: boolean;
  isLocked?: boolean;
  samplePagesRange?: string;
  fileUrl?: string;
  order?: number;
}

export interface HierarchicalUnit {
  id: string;
  title: string;
  order: number;
  contentItems: HierarchicalContentItem[];
}

export interface HierarchicalAct {
  id: string;
  title: string;
  order: number;
  isComingSoon?: boolean;
  units: HierarchicalUnit[];
}

export interface HierarchicalCourse {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  price?: number;
  accessDays?: number;
  isEnrolled?: boolean;
  acts: HierarchicalAct[];
}

interface HierarchyBookmark {
  id: string;
  title?: string;
  contentType?: string;
  type?: string;
  fileUrl?: string;
  url?: string;
}

interface MyCoursesPayload extends JsonObject {
  success?: boolean;
  courses?: HierarchicalCourse[];
}

interface StudentCoursesHierarchyTabProps {
  onOpenReader: (url: string, title: string, isPurchased?: boolean, previewPagesLimit?: number) => void;
  completedUnits: string[];
  onToggleUnitComplete: (unitId: string) => void;
  bookmarks: HierarchyBookmark[];
  onToggleBookmark: (item: HierarchyBookmark) => void;
  onExploreMore?: () => void;
  onBuyCourse?: (courseId: string) => void;
  initialCourseId?: string;
  studentName?: string;
  initials?: string;
  onOpenProfile?: () => void;
}

type MaterialCategory = "all" | "ldr" | "notes" | "practice" | "infographic";

export function StudentCoursesHierarchyTab({
  onOpenReader,
  completedUnits = [],
  onToggleUnitComplete,
  bookmarks = [],
  onToggleBookmark,
  onExploreMore,
  onBuyCourse,
  initialCourseId,
  studentName = "Parth",
  initials = "PR",
  onOpenProfile,
}: StudentCoursesHierarchyTabProps) {
  const API_URL = getApiBaseUrl();
  const [courses, setCourses] = useState<HierarchicalCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId || "");
  const [selectedActId, setSelectedActId] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<MaterialCategory>("all");
  const [actDetailFilter, setActDetailFilter] = useState<"all" | "ldr" | "notes" | "practice" | "infographic">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const initialCourseIdRef = useRef(initialCourseId);

  useEffect(() => {
    initialCourseIdRef.current = initialCourseId;
  }, [initialCourseId]);

  // Dynamic greeting based on student's local hour
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  // Sync initialCourseId prop
  useEffect(() => {
    if (initialCourseId && courses.length > 0) {
      const match = courses.find((c) => c.id === initialCourseId || c.slug === initialCourseId);
      if (match) {
        setSelectedCourseId(match.id);
      }
    }
  }, [initialCourseId, courses]);

  // Fetch student courses with enrollment status
  useEffect(() => {
    let isMounted = true;
    async function fetchMyCourses() {
      try {
        setLoading(true);
        setError(null);
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("lawkaksha_student_token") ||
              localStorage.getItem("lawkaksha_token") ||
              localStorage.getItem("token")
            : null;
        let emailQuery = "";
        let localUnlocked: string[] = [];
        if (typeof window !== "undefined") {
          try {
            const pb = JSON.parse(localStorage.getItem("lawkaksha_purchased_books") || "[]");
            if (Array.isArray(pb)) localUnlocked.push(...pb);
            const sess = JSON.parse(
              localStorage.getItem("lawkaksha_student_session") ||
              localStorage.getItem("lawkaksha_active_student") ||
              "{}"
            );
            if (Array.isArray(sess.unlockedItemIds)) localUnlocked.push(...sess.unlockedItemIds);
            if (sess.target_exam || sess.targetExam) localUnlocked.push(sess.target_exam || sess.targetExam);
            if (sess.email) {
              emailQuery = `?email=${encodeURIComponent(sess.email)}&studentId=${encodeURIComponent(sess.student_id || "")}`;
            }
          } catch {}
        }

        const isQBankPurchased = localUnlocked.some((id) => {
          const l = String(id || "").toLowerCase();
          return (
            l === "course-ca-qbank" ||
            l === "ca-foundation-qbank" ||
            l === "ca-qbank" ||
            l === "sub-ca-qbank" ||
            l === "prod-qbank" ||
            l.includes("question-bank") ||
            l.includes("question bank") ||
            l.includes("qbank")
          );
        });

        const isCaPurchased = localUnlocked.some((id) => {
          const l = String(id || "").toLowerCase();
          if (l.includes("qbank") || l.includes("question-bank") || l.includes("question bank")) return false;
          return l.includes("ca") || l.includes("foundation") || l.includes("paper 2") || l.includes("vol1");
        });
        const isCsPurchased = localUnlocked.some((id) => {
          const l = String(id || "").toLowerCase();
          return l.includes("cs") || l.includes("cseet") || l.includes("vol2");
        });

        const res = await fetch(`${API_URL}/api/student/my-courses${emailQuery}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data: MyCoursesPayload = await res.json();
        if (isMounted) {
          if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
            const enriched = data.courses.map((c) => {
              const cId = String(c.id || "").toLowerCase();
              const cTitle = String(c.title || "").toLowerCase();
              const isQBank = cId === "course-ca-qbank" || cId.includes("qbank") || cTitle.includes("question bank");
              const isCa = !isQBank && (cId.includes("ca") || cTitle.includes("ca") || cId.includes("foundation") || cTitle.includes("foundation"));
              const isCs = cId.includes("cs") || cTitle.includes("cseet");
              const enrolled = isQBank
                ? Boolean(c.isEnrolled || isQBankPurchased)
                : Boolean(c.isEnrolled || (isCa && isCaPurchased) || (isCs && isCsPurchased));
              return {
                ...c,
                isEnrolled: enrolled,
              };
            });

            // Sort courses
            const validCourses = [...enriched].sort((a, b) => {
              if (a.isEnrolled && !b.isEnrolled) return -1;
              if (!a.isEnrolled && b.isEnrolled) return 1;
              const actsA = a.acts?.length || 0;
              const actsB = b.acts?.length || 0;
              return actsB - actsA;
            });
            setCourses(validCourses);

            const requestedCourseId = initialCourseIdRef.current;
            const targetCourse =
              (requestedCourseId &&
                validCourses.find((c) => c.id === requestedCourseId || c.slug === requestedCourseId)) ||
              validCourses.find((c) => c.isEnrolled) ||
              validCourses[0];

            if (targetCourse) {
              setSelectedCourseId(targetCourse.id);
            }
          } else {
            setCourses([]);
            setSelectedCourseId("");
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load courses");
          setCourses([]);
          setSelectedCourseId("");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchMyCourses();
    return () => {
      isMounted = false;
    };
  }, [API_URL]);

  const activeCourse = useMemo(() => {
    return courses.find((c) => c.id === selectedCourseId) || courses[0] || null;
  }, [courses, selectedCourseId]);

  const isBookmarked = (itemId: string) => {
    return bookmarks.some((b) => b.id === itemId);
  };

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  // Helper for Act visual themes (colors & icons) matching the screenshot
  const getActVisualMeta = (act: HierarchicalAct) => {
    const l = (act.title || "").toLowerCase();
    const id = (act.id || "").toLowerCase();

    if (l.includes("contract") || id.includes("contract")) {
      return {
        icon: BookOpen,
        colorBg: "bg-[#EBF3FB]",
        colorText: "text-[#005A9C]",
        gradientPill: "from-[#005A9C] to-[#0284C7]",
        borderHover: "hover:border-[#005A9C]/40",
        progressColor: "bg-[#005A9C]",
        badgeCategory: "Business Laws • 25-35% Weightage",
        arrowBg: "bg-[#F0F5FA] hover:bg-[#005A9C] text-[#005A9C] hover:text-white",
        accentRing: "ring-[#005A9C]/20",
        lightBg: "bg-[#F4F9FD]",
      };
    }
    if (l.includes("partnership") || id.includes("partnership")) {
      return {
        icon: Scale,
        colorBg: "bg-[#EAF6ED]",
        colorText: "text-[#059669]",
        gradientPill: "from-[#059669] to-[#10B981]",
        borderHover: "hover:border-[#059669]/40",
        progressColor: "bg-[#059669]",
        badgeCategory: "Business Laws • 20-25% Weightage",
        arrowBg: "bg-[#F0F7F2] hover:bg-[#059669] text-[#059669] hover:text-white",
        accentRing: "ring-[#059669]/20",
        lightBg: "bg-[#F4FAF6]",
      };
    }
    if (l.includes("sale of goods") || l.includes("soga") || id.includes("soga")) {
      return {
        icon: FileText,
        colorBg: "bg-[#F3EFFB]",
        colorText: "text-[#7C3AED]",
        gradientPill: "from-[#7C3AED] to-[#8B5CF6]",
        borderHover: "hover:border-[#7C3AED]/40",
        progressColor: "bg-[#7C3AED]",
        badgeCategory: "Business Laws • 20-25% Weightage",
        arrowBg: "bg-[#F6F2FB] hover:bg-[#7C3AED] text-[#7C3AED] hover:text-white",
        accentRing: "ring-[#7C3AED]/20",
        lightBg: "bg-[#F9F6FE]",
      };
    }
    if (l.includes("liability") || l.includes("llp") || id.includes("llp")) {
      return {
        icon: Landmark,
        colorBg: "bg-[#E6F7F8]",
        colorText: "text-[#0D9488]",
        gradientPill: "from-[#0D9488] to-[#14B8A6]",
        borderHover: "hover:border-[#0D9488]/40",
        progressColor: "bg-[#0D9488]",
        badgeCategory: "Business Laws • 10-15% Weightage",
        arrowBg: "bg-[#EBF7F8] hover:bg-[#0D9488] text-[#0D9488] hover:text-white",
        accentRing: "ring-[#0D9488]/20",
        lightBg: "bg-[#F2FBFA]",
      };
    }
    if (l.includes("question bank") || id.includes("qbank")) {
      return {
        icon: Award,
        colorBg: "bg-[#FEF6E7]",
        colorText: "text-[#D97706]",
        gradientPill: "from-[#D97706] to-[#F59E0B]",
        borderHover: "hover:border-[#D97706]/40",
        progressColor: "bg-[#D97706]",
        badgeCategory: "Smart Question Bank • Solved Volumes",
        arrowBg: "bg-[#FFF9EE] hover:bg-[#D97706] text-[#D97706] hover:text-white",
        accentRing: "ring-[#D97706]/20",
        lightBg: "bg-[#FFFBF5]",
      };
    }
    return {
      icon: Layers,
      colorBg: "bg-[#EFF6FF]",
      colorText: "text-[#005A9C]",
      gradientPill: "from-[#005A9C] to-[#0284C7]",
      borderHover: "hover:border-[#005A9C]/40",
      progressColor: "bg-[#005A9C]",
      badgeCategory: "Curriculum Act",
      arrowBg: "bg-[#F0F5FA] hover:bg-[#005A9C] text-[#005A9C] hover:text-white",
      accentRing: "ring-[#005A9C]/20",
      lightBg: "bg-[#F8FAFC]",
    };
  };

  // Content type badge styling
  const getContentTypeBadge = (type: string) => {
    switch (type) {
      case "ldr":
      case "flowchart":
        return { label: "LDR Flowchart", bg: "bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]", icon: Workflow };
      case "infographic":
      case "revision":
        return { label: "Infographic", bg: "bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]", icon: Sparkles };
      case "practice":
        return { label: "Practice Qs", bg: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]", icon: HelpCircle };
      case "pyq":
        return { label: "Past Exam PYQ", bg: "bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]", icon: Award };
      default:
        return { label: "Study Notes", bg: "bg-[#EFF6FF] text-[#005A9C] border-[#DBEAFE]", icon: FileText };
    }
  };

  // Collect all segregated material across the active course
  const segregatedStats = useMemo(() => {
    let ldrCount = 0;
    let notesCount = 0;
    let practiceCount = 0;
    let infographicCount = 0;
    const allLdrItems: { act: HierarchicalAct; item: HierarchicalContentItem }[] = [];
    const allNotesItems: { act: HierarchicalAct; item: HierarchicalContentItem }[] = [];
    const allPracticeItems: { act: HierarchicalAct; item: HierarchicalContentItem }[] = [];
    const allInfographicItems: { act: HierarchicalAct; item: HierarchicalContentItem }[] = [];

    (activeCourse?.acts || []).forEach((act) => {
      (act.units || []).forEach((u) => {
        (u.contentItems || []).forEach((ci) => {
          const type = (ci.contentType || "").toLowerCase();
          const title = (ci.title || "").toLowerCase();
          const isLdr = type === "ldr" || type === "flowchart" || title.includes("ldr") || title.includes("flowchart");
          const isPractice = type === "practice" || type === "pyq" || title.includes("practice") || title.includes("question bank");
          const isInfo = type === "infographic" || type === "revision" || title.includes("infographic");

          if (isLdr) {
            ldrCount++;
            allLdrItems.push({ act, item: ci });
          } else if (isPractice) {
            practiceCount++;
            allPracticeItems.push({ act, item: ci });
          } else if (isInfo) {
            infographicCount++;
            allInfographicItems.push({ act, item: ci });
          } else {
            notesCount++;
            allNotesItems.push({ act, item: ci });
          }
        });
      });
    });

    return {
      ldrCount,
      notesCount,
      practiceCount,
      infographicCount,
      allLdrItems,
      allNotesItems,
      allPracticeItems,
      allInfographicItems,
    };
  }, [activeCourse]);

  // Filter acts based on search query
  const filteredActs = useMemo(() => {
    if (!activeCourse?.acts) return [];
    if (!searchQuery.trim()) return activeCourse.acts;
    const q = searchQuery.toLowerCase().trim();
    return activeCourse.acts.filter((act) => {
      if (act.title.toLowerCase().includes(q)) return true;
      return (act.units || []).some((u) => {
        if (u.title.toLowerCase().includes(q)) return true;
        return (u.contentItems || []).some((ci) => ci.title.toLowerCase().includes(q));
      });
    });
  }, [activeCourse, searchQuery]);

  // Selected act for deep-dive inspection
  const currentDrilledAct = useMemo(() => {
    if (!selectedActId || !activeCourse?.acts) return null;
    return activeCourse.acts.find((a) => a.id === selectedActId) || null;
  }, [selectedActId, activeCourse]);

  // Breakdown of materials inside the selected act
  const drilledActMaterials = useMemo(() => {
    if (!currentDrilledAct) {
      return { ldrList: [], notesUnits: [], practiceList: [], infographicList: [] };
    }
    const ldrList: HierarchicalContentItem[] = [];
    const notesUnits: { unit: HierarchicalUnit; items: HierarchicalContentItem[] }[] = [];
    const practiceList: HierarchicalContentItem[] = [];
    const infographicList: HierarchicalContentItem[] = [];

    (currentDrilledAct.units || []).forEach((u) => {
      const uTitle = (u.title || "").toLowerCase();
      const isSupplementaryUnit = uTitle.includes("flowchart") || uTitle.includes("supplementary") || uTitle.includes("questions");

      const unitTheoryItems: HierarchicalContentItem[] = [];

      (u.contentItems || []).forEach((ci) => {
        const type = (ci.contentType || "").toLowerCase();
        const title = (ci.title || "").toLowerCase();
        const isLdr = type === "ldr" || type === "flowchart" || title.includes("ldr") || title.includes("flowchart");
        const isPractice = type === "practice" || type === "pyq" || title.includes("practice") || title.includes("question bank");
        const isInfo = type === "infographic" || type === "revision" || title.includes("infographic");

        if (isLdr) {
          ldrList.push(ci);
        } else if (isPractice) {
          practiceList.push(ci);
        } else if (isInfo) {
          infographicList.push(ci);
        } else {
          unitTheoryItems.push(ci);
        }
      });

      if (!isSupplementaryUnit || unitTheoryItems.length > 0) {
        notesUnits.push({ unit: u, items: unitTheoryItems.length > 0 ? unitTheoryItems : u.contentItems });
      }
    });

    return { ldrList, notesUnits, practiceList, infographicList };
  }, [currentDrilledAct]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-3 border-[#005A9C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-[#64748B]">Loading your courses &amp; codices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. TOP GREETING & SEARCH BAR SECTION (MATCHING SCREENSHOT) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0A192F] tracking-tight flex items-center gap-1.5">
            <span>{greeting}, {studentName}</span>
            <span className="text-xl">👋</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Keep going! You&apos;re building your future.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* SEARCH BAR (EXACT MATCH TO SCREENSHOT) */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search your courses, acts, flowcharts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-full border border-[#E2E8F0] bg-white text-xs sm:text-sm font-medium text-[#0A192F] placeholder-[#94A3B8] shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#005A9C]/20 focus:border-[#005A9C] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0A192F] p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* USER AVATAR PILL (EXACT MATCH TO SCREENSHOT) */}
          <button
            type="button"
            onClick={onOpenProfile}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white border border-[#E2E8F0] hover:border-[#005A9C]/40 text-xs font-bold text-[#005A9C] shadow-2xs transition-all cursor-pointer group shrink-0"
            title="Open Profile"
          >
            <div className="w-7 h-7 rounded-full bg-[#E0EEF9] text-[#005A9C] font-bold text-xs flex items-center justify-center">
              {initials}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#005A9C] transition-colors" />
          </button>
        </div>
      </div>

      {/* 2. HERO BANNER: SOFT BLUE GRADIENT WITH REAL LAW BOOKS & GAVEL (EXACT MATCH TO SCREENSHOT) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EBF3FA] via-[#F1F6FD] to-[#E3EEF8] border border-[#D8E5F2] shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 md:p-10 gap-6">
          {/* LEFT TEXT COLUMN */}
          <div className="space-y-3 z-10 max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5A738E] block">
              YOUR COURSES
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-extrabold text-[#0D2144] tracking-tight">
              {activeCourse?.id === "course-ca-qbank"
                ? "Question Bank"
                : activeCourse?.id === "course-cseet"
                ? "CSEET"
                : "CA Foundation"}
            </h1>
            <p className="text-xs sm:text-sm text-[#47607B] leading-relaxed">
              {activeCourse?.id === "course-ca-qbank"
                ? "Comprehensive Part 1 & 2 final volumes with ICAI model answers."
                : activeCourse?.id === "course-cseet"
                ? "Master Legal Aptitude & Business Communication for CSEET."
                : "Build strong concepts. Master the fundamentals."}
            </p>
            <div className="w-12 h-0.5 bg-[#005A9C] rounded-full mt-2" />

            {/* COURSE SWITCHER PILLS */}
            {courses.length > 1 && (
              <div className="flex items-center gap-2 pt-3 flex-wrap">
                {courses.map((c) => {
                  const isQBank = c.id === "course-ca-qbank" || c.id.includes("qbank");
                  const isSelected = c.id === selectedCourseId;
                  const label = isQBank
                    ? "Question Bank (Part 1 & 2)"
                    : c.id === "course-cseet"
                    ? "CSEET"
                    : "CA Foundation";

                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedCourseId(c.id);
                        setSelectedActId(null);
                        setActiveCategoryFilter("all");
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-[#005A9C] text-white font-bold shadow-xs"
                          : "bg-white/80 hover:bg-white text-[#475569] border border-[#CBD5E1]"
                      }`}
                    >
                      {c.isEnrolled ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Lock className="w-3 h-3 text-amber-500" />
                      )}
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT HERO IMAGE COLUMN (REAL PHOTOREALISTIC LAW BOOKS & GAVEL) */}
          <div className="relative w-full md:w-[360px] lg:w-[420px] h-[160px] sm:h-[180px] md:h-[200px] shrink-0 flex items-center justify-center">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm border border-white/60">
              <Image
                src="/assets/student-courses-hero.jpg"
                alt="Law Books with Gavel"
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#EBF3FA]/30 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. MATERIAL TYPE GLOBAL SEGREGATION BAR */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-2.5 sm:p-3 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider px-2 shrink-0 hidden sm:inline">
            Quick Filter:
          </span>

          <button
            type="button"
            onClick={() => {
              setActiveCategoryFilter("all");
              setSelectedActId(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeCategoryFilter === "all" && !selectedActId
                ? "bg-[#005A9C] text-white shadow-2xs"
                : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0A192F]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Statutory Codices</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveCategoryFilter("ldr");
              setSelectedActId(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeCategoryFilter === "ldr"
                ? "bg-[#0284C7] text-white shadow-2xs"
                : "text-[#0284C7] bg-[#E0F2FE]/70 hover:bg-[#E0F2FE]"
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>⚡ LDR Flowcharts ({segregatedStats.ldrCount})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveCategoryFilter("notes");
              setSelectedActId(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeCategoryFilter === "notes"
                ? "bg-[#005A9C] text-white shadow-2xs"
                : "text-[#005A9C] bg-[#EFF6FF] hover:bg-[#DBEAFE]"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>📑 Study Notes ({segregatedStats.notesCount})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveCategoryFilter("practice");
              setSelectedActId(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeCategoryFilter === "practice"
                ? "bg-[#D97706] text-white shadow-2xs"
                : "text-[#D97706] bg-[#FEF3C7] hover:bg-[#FDE68A]"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>📝 Practice &amp; Q-Bank ({segregatedStats.practiceCount})</span>
          </button>

          {segregatedStats.infographicCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setActiveCategoryFilter("infographic");
                setSelectedActId(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeCategoryFilter === "infographic"
                  ? "bg-[#7C3AED] text-white shadow-2xs"
                  : "text-[#7C3AED] bg-[#F3E8FF] hover:bg-[#E9D5FF]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>🎨 Infographics ({segregatedStats.infographicCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. SEGREGATED FILTERED VIEW ACROSS ALL ACTS */}
      {activeCategoryFilter !== "all" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0A192F] flex items-center gap-2">
              {activeCategoryFilter === "ldr" && (
                <>
                  <Workflow className="w-4 h-4 text-[#0284C7]" />
                  <span>Last Day Revision (LDR) Flowcharts &amp; Visual Mindmaps</span>
                </>
              )}
              {activeCategoryFilter === "notes" && (
                <>
                  <FileText className="w-4 h-4 text-[#005A9C]" />
                  <span>Comprehensive Chapter-by-Chapter Study Notes</span>
                </>
              )}
              {activeCategoryFilter === "practice" && (
                <>
                  <HelpCircle className="w-4 h-4 text-[#D97706]" />
                  <span>Exam Practice Questions &amp; Solved Model Answers</span>
                </>
              )}
              {activeCategoryFilter === "infographic" && (
                <>
                  <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                  <span>Visual Infographics &amp; Concept Precedents</span>
                </>
              )}
            </h3>

            <button
              type="button"
              onClick={() => setActiveCategoryFilter("all")}
              className="text-xs font-bold text-[#005A9C] hover:underline"
            >
              Back to Overview
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(() => {
              const items =
                activeCategoryFilter === "ldr"
                  ? segregatedStats.allLdrItems
                  : activeCategoryFilter === "notes"
                  ? segregatedStats.allNotesItems
                  : activeCategoryFilter === "practice"
                  ? segregatedStats.allPracticeItems
                  : segregatedStats.allInfographicItems;

              if (items.length === 0) {
                return (
                  <div className="col-span-2 p-8 text-center bg-white rounded-3xl border border-[#E2E8F0] text-[#64748B]">
                    <p className="text-sm font-semibold">No materials found in this category.</p>
                  </div>
                );
              }

              return items.map(({ act, item }) => {
                const bookmarked = isBookmarked(item.id);
                const canOpenFull = Boolean(activeCourse?.isEnrolled);
                const canOpenSample = Boolean(item.isFreeSample);

                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-3xl bg-white border border-[#E2E8F0] hover:border-[#005A9C]/40 hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                          {act.title}
                        </span>
                        {item.pages && (
                          <span className="text-[11px] font-mono text-[#64748B]">
                            {item.pages}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-[#0A192F] group-hover:text-[#005A9C] transition-colors">
                        {item.title}
                      </h4>

                      {item.description && (
                        <p className="text-xs text-[#64748B] mt-1.5 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9]">
                      <button
                        type="button"
                        onClick={() => onToggleBookmark(item)}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                          bookmarked
                            ? "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]"
                            : "border-[#E2E8F0] text-[#64748B] hover:text-[#005A9C] hover:bg-[#F0F7FF]"
                        }`}
                        title={bookmarked ? "Remove Bookmark" : "Bookmark this item"}
                      >
                        <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
                      </button>

                      <div className="flex items-center gap-2">
                        {canOpenFull ? (
                          <button
                            type="button"
                            onClick={() => onOpenReader(item.fileUrl || `/api/content/${item.id}/file`, item.title, true)}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#005A9C] hover:bg-[#004080] text-white transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Open Reader</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            {canOpenSample && (
                              <button
                                type="button"
                                onClick={() => onOpenReader(item.fileUrl || `/api/content/${item.id}/file`, item.title, false, 10)}
                                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#047857] hover:bg-[#065F46] text-white transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Read Sample</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => onBuyCourse?.(activeCourse?.id || "") || onExploreMore?.()}
                              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>Unlock</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* 5. ACT MASTERY STATION: DEEP-DIVE WITH PROPER SEGREGATED BOXES */}
      {selectedActId && currentDrilledAct && activeCategoryFilter === "all" && (
        <div className="space-y-6 animate-fadeIn">
          {/* ACT HEADER & ACT SWITCHER BAR */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => setSelectedActId(null)}
                  className="p-2.5 rounded-2xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0A192F] transition-colors cursor-pointer shrink-0"
                  title="Back to all acts"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-[#005A9C] uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#EFF6FF] border border-[#DBEAFE]">
                      {activeCourse?.title}
                    </span>
                    <span className="text-xs text-[#64748B]">Act Mastery Station</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-serif font-extrabold text-[#0D2144] mt-1">
                    {currentDrilledAct.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedActId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#005A9C] bg-[#EFF6FF] hover:bg-[#DBEAFE] transition-colors self-start sm:self-auto cursor-pointer flex items-center gap-1.5"
              >
                <span>View All Acts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* QUICK ACT SWITCHER CHIPS */}
            {activeCourse?.acts && activeCourse.acts.length > 1 && (
              <div className="pt-2 border-t border-[#F1F5F9] flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-[11px] font-bold text-[#94A3B8] uppercase shrink-0">Switch Act:</span>
                {activeCourse.acts.map((a) => {
                  const isCurrent = a.id === selectedActId;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        setSelectedActId(a.id);
                        setActDetailFilter("all");
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        isCurrent
                          ? "bg-[#005A9C] text-white shadow-2xs"
                          : "bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0A192F]"
                      }`}
                    >
                      {a.title.split(",")[0].replace("The ", "")}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ACT DETAILS FILTER PILLS */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setActDetailFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                actDetailFilter === "all" ? "bg-[#0A192F] text-white shadow-2xs" : "bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Segregated Boxes</span>
            </button>

            {drilledActMaterials.ldrList.length > 0 && (
              <button
                type="button"
                onClick={() => setActDetailFilter("ldr")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  actDetailFilter === "ldr" ? "bg-[#0284C7] text-white shadow-2xs" : "bg-white text-[#0284C7] border border-[#BAE6FD] hover:bg-[#E0F2FE]/40"
                }`}
              >
                <Workflow className="w-3.5 h-3.5" />
                <span>⚡ LDR Flowcharts ({drilledActMaterials.ldrList.length})</span>
              </button>
            )}

            {drilledActMaterials.notesUnits.length > 0 && (
              <button
                type="button"
                onClick={() => setActDetailFilter("notes")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  actDetailFilter === "notes" ? "bg-[#005A9C] text-white shadow-2xs" : "bg-white text-[#005A9C] border border-[#BFDBFE] hover:bg-[#EFF6FF]"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>📑 Chapter Notes ({drilledActMaterials.notesUnits.length} Units)</span>
              </button>
            )}

            {drilledActMaterials.practiceList.length > 0 && (
              <button
                type="button"
                onClick={() => setActDetailFilter("practice")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  actDetailFilter === "practice" ? "bg-[#D97706] text-white shadow-2xs" : "bg-white text-[#D97706] border border-[#FDE68A] hover:bg-[#FEF3C7]/50"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>📝 Practice Vault ({drilledActMaterials.practiceList.length})</span>
              </button>
            )}

            {drilledActMaterials.infographicList.length > 0 && (
              <button
                type="button"
                onClick={() => setActDetailFilter("infographic")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  actDetailFilter === "infographic" ? "bg-[#7C3AED] text-white shadow-2xs" : "bg-white text-[#7C3AED] border border-[#E9D5FF] hover:bg-[#F3E8FF]/50"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>🎨 Infographics ({drilledActMaterials.infographicList.length})</span>
              </button>
            )}
          </div>

          {/* ========================================================================= */}
          {/* BOX 1: ⚡ THE LDR FLOWCHART VAULT (PROPER HIGH-ENERGY BOX)                  */}
          {/* ========================================================================= */}
          {(actDetailFilter === "all" || actDetailFilter === "ldr") && drilledActMaterials.ldrList.length > 0 && (
            <div className="rounded-3xl bg-gradient-to-br from-[#E0F2FE]/70 via-[#F0F9FF] to-white border-2 border-[#7DD3FC] p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center shadow-xs shrink-0">
                    <Workflow className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#0284C7] text-white">
                        ⚡ Quick Visual Revision
                      </span>
                      <span className="text-xs text-[#0369A1] font-semibold">High-Yield Flowcharts</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-[#0F172A] mt-0.5">
                      Last Day Revision (LDR) Flowchart Codex
                    </h4>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#0284C7] bg-white px-3 py-1.5 rounded-xl border border-[#BAE6FD] self-start sm:self-auto">
                  {drilledActMaterials.ldrList.length} Flowchart Book Available
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {drilledActMaterials.ldrList.map((item) => {
                  const bookmarked = isBookmarked(item.id);
                  const canOpen = Boolean(activeCourse?.isEnrolled);

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-[#BAE6FD] p-5 hover:border-[#0284C7] hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]">
                            Visual Mindmap
                          </span>
                          <span className="text-xs font-mono text-[#64748B]">Complete Act Codex</span>
                        </div>
                        <h5 className="text-base font-bold text-[#0F172A] group-hover:text-[#0284C7] transition-colors">
                          {item.title}
                        </h5>
                        <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                          Condensed visual node trees mapping out statutory sections, precedents, and flowchart paths for rapid recall before exams.
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#F0F9FF]">
                        <button
                          type="button"
                          onClick={() => onToggleBookmark(item)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            bookmarked ? "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]" : "border-[#E2E8F0] text-[#64748B] hover:text-[#0284C7]"
                          }`}
                          title="Bookmark Flowchart"
                        >
                          <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (canOpen) {
                              onOpenReader(item.fileUrl || `/api/content/${item.id}/file`, item.title, true);
                            } else {
                              onOpenReader(item.fileUrl || `/api/content/${item.id}/file`, item.title, false, 10);
                            }
                          }}
                          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white shadow-xs cursor-pointer flex items-center gap-2 transition-all hover:scale-[1.02]"
                        >
                          <Eye className="w-4 h-4" />
                          <span>{canOpen ? "Launch LDR Flowchart Reader" : "Preview Free LDR Sample"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* BOX 2: 📑 UNIT-BY-UNIT CHAPTER CODEX (PROPER BENTO GRID TILES)             */}
          {/* ========================================================================= */}
          {(actDetailFilter === "all" || actDetailFilter === "notes") && drilledActMaterials.notesUnits.length > 0 && (
            <div className="rounded-3xl bg-white border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#005A9C] flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#005A9C]">
                      📑 Curriculum Chapters &amp; Units
                    </span>
                    <h4 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                      Substantive Theory Codices
                    </h4>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#64748B]">
                  {drilledActMaterials.notesUnits.length} Statutory Units
                </span>
              </div>

              {/* GRID OF UNIT BOXES (NO LONGER BORING TEXT ACCORDIONS!) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drilledActMaterials.notesUnits.map(({ unit, items }, idx) => {
                  const isCompleted = completedUnits.includes(unit.id);
                  const firstItem = items[0];

                  return (
                    <div
                      key={unit.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 group ${
                        isCompleted
                          ? "bg-[#F0FDF4] border-[#BBF7D0]"
                          : "bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#005A9C]/40 hover:bg-white hover:shadow-sm"
                      }`}
                    >
                      <div>
                        {/* UNIT NUMBER PILL & COMPLETION CHECKBOX */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                              isCompleted ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#EFF6FF] text-[#005A9C]"
                            }`}
                          >
                            UNIT {String(idx + 1).padStart(2, "0")}
                          </span>

                          <button
                            type="button"
                            onClick={() => onToggleUnitComplete(unit.id)}
                            className="flex items-center gap-1 text-[11px] font-semibold text-[#64748B] hover:text-[#005A9C] cursor-pointer"
                            title={isCompleted ? "Completed! Click to undo" : "Mark as finished"}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-[#15803D]" />
                            ) : (
                              <Circle className="w-5 h-5 text-[#CBD5E1]" />
                            )}
                          </button>
                        </div>

                        <h5 className="text-sm font-bold text-[#0F172A] group-hover:text-[#005A9C] transition-colors line-clamp-2">
                          {unit.title.replace(/^Unit \d+:\s*/i, "")}
                        </h5>

                        <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2">
                          Complete statutory commentary, case examples, and section analysis.
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                        {firstItem && (
                          <button
                            type="button"
                            onClick={() => {
                              const canOpen = Boolean(activeCourse?.isEnrolled);
                              onOpenReader(
                                firstItem.fileUrl || `/api/content/${firstItem.id}/file`,
                                firstItem.title,
                                canOpen,
                                canOpen ? undefined : 5
                              );
                            }}
                            className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-[#005A9C] hover:bg-[#004080] text-white flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Read Unit Notes</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* BOX 3: 📝 PRACTICE QUESTIONS & SOLVED RTP/MTP (PROPER GOLD BOX)            */}
          {/* ========================================================================= */}
          {(actDetailFilter === "all" || actDetailFilter === "practice") && drilledActMaterials.practiceList.length > 0 && (
            <div className="rounded-3xl bg-gradient-to-br from-[#FEF3C7]/60 via-[#FFFBEB] to-white border border-[#FCD34D] p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#D97706] text-white flex items-center justify-center shadow-xs shrink-0">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#B45309]">
                      📝 Exam Question Vault
                    </span>
                    <h4 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                      Practice Questions &amp; RTP/MTP Model Answers
                    </h4>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#B45309] bg-white px-3 py-1.5 rounded-xl border border-[#FDE68A] self-start sm:self-auto">
                  {drilledActMaterials.practiceList.length} Question Sets
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {drilledActMaterials.practiceList.map((item) => {
                  const bookmarked = isBookmarked(item.id);
                  const canOpen = Boolean(activeCourse?.isEnrolled);

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-[#FDE68A] p-5 hover:border-[#D97706] hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                            Solved ICAI Papers
                          </span>
                          <span className="text-xs font-mono text-[#64748B]">Model Answers</span>
                        </div>
                        <h5 className="text-base font-bold text-[#0F172A] group-hover:text-[#D97706] transition-colors">
                          {item.title}
                        </h5>
                        <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                          Comprehensive problem-based scenarios with step-marking schemes, examiner comments, and model answers.
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#FEF3C7]">
                        <button
                          type="button"
                          onClick={() => onToggleBookmark(item)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            bookmarked ? "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]" : "border-[#E2E8F0] text-[#64748B] hover:text-[#D97706]"
                          }`}
                          title="Bookmark Question Set"
                        >
                          <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onOpenReader(
                              item.fileUrl || `/api/content/${item.id}/file`,
                              item.title,
                              canOpen,
                              canOpen ? undefined : 5
                            );
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#D97706] hover:bg-[#B45309] text-white shadow-xs cursor-pointer flex items-center gap-1.5 transition-all hover:scale-[1.02]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{canOpen ? "Open Question Codex" : "Preview Questions"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* BOX 4: 🎨 INFOGRAPHICS & LANDMARK PRECEDENTS (PROPER PURPLE BOX)           */}
          {/* ========================================================================= */}
          {(actDetailFilter === "all" || actDetailFilter === "infographic") && drilledActMaterials.infographicList.length > 0 && (
            <div className="rounded-3xl bg-gradient-to-br from-[#F3E8FF]/60 via-[#FAF5FF] to-white border border-[#D8B4FE] p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center shadow-xs shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#6B21A8]">
                      ⚖️ Visual Precedent Maps
                    </span>
                    <h4 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                      Landmark Judicial Cases &amp; Infographics
                    </h4>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#6B21A8] bg-white px-3 py-1.5 rounded-xl border border-[#E9D5FF] self-start sm:self-auto">
                  {drilledActMaterials.infographicList.length} Infographics
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {drilledActMaterials.infographicList.map((item) => {
                  const bookmarked = isBookmarked(item.id);
                  const canOpen = Boolean(activeCourse?.isEnrolled);

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-[#E9D5FF] p-5 hover:border-[#7C3AED] hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F3E8FF] text-[#6B21A8] border border-[#E9D5FF]">
                            Visual Diagram
                          </span>
                          <span className="text-xs font-mono text-[#64748B]">Case Laws</span>
                        </div>
                        <h5 className="text-base font-bold text-[#0F172A] group-hover:text-[#7C3AED] transition-colors">
                          {item.title}
                        </h5>
                        <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                          High-clarity visual infographics dissecting case facts, judicial reasoning, and core principles.
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#F3E8FF]">
                        <button
                          type="button"
                          onClick={() => onToggleBookmark(item)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            bookmarked ? "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]" : "border-[#E2E8F0] text-[#64748B] hover:text-[#7C3AED]"
                          }`}
                          title="Bookmark Infographic"
                        >
                          <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onOpenReader(
                              item.fileUrl || `/api/content/${item.id}/file`,
                              item.title,
                              canOpen,
                              canOpen ? undefined : 5
                            );
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-xs cursor-pointer flex items-center gap-1.5 transition-all hover:scale-[1.02]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{canOpen ? "View Infographic" : "Preview Infographic"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. ENROLLED COURSES 2-COLUMN GRID (WITH RICH TACTILE BENTO BOXES ON EACH CARD!) */}
      {!selectedActId && activeCategoryFilter === "all" && (
        <div className="space-y-4">
          {/* SECTION HEADER (EXACT MATCH TO SCREENSHOT) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h3 className="text-lg sm:text-xl font-bold text-[#0A192F] tracking-tight">
                Enrolled Courses
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EBF3FB] text-[#005A9C] border border-[#D0E2F4]">
                {filteredActs.length} {filteredActs.length === 1 ? "Course" : "Courses"}
              </span>
            </div>

            <button
              type="button"
              onClick={onExploreMore}
              className="text-xs sm:text-sm font-semibold text-[#005A9C] hover:text-[#004080] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2-COLUMN GRID OF BEAUTIFUL ACT CARDS */}
          {filteredActs.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#E2E8F0] text-[#64748B]">
              <BookOpen className="w-10 h-10 text-[#94A3B8] mx-auto mb-2" />
              <p className="text-sm font-bold text-[#0A192F]">No courses match your search.</p>
              <p className="text-xs text-[#64748B] mt-1">Try searching with a different term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {filteredActs.map((act) => {
                const meta = getActVisualMeta(act);
                const ActIcon = meta.icon;
                const units = act.units || [];
                const totalUnits = units.length;
                const completedInAct = units.filter((u) => completedUnits.includes(u.id)).length;
                const percent = totalUnits > 0 ? Math.round((completedInAct / totalUnits) * 100) : 0;

                // Segregated counts inside this act
                let ldrInAct = 0;
                let notesInAct = 0;
                let practiceInAct = 0;
                let infoInAct = 0;
                let ldrItem: HierarchicalContentItem | null = null;
                let firstNoteItem: HierarchicalContentItem | null = null;
                let practiceItem: HierarchicalContentItem | null = null;

                units.forEach((u) => {
                  (u.contentItems || []).forEach((ci) => {
                    const t = (ci.contentType || "").toLowerCase();
                    const tit = (ci.title || "").toLowerCase();
                    if (t === "ldr" || t === "flowchart" || tit.includes("ldr") || tit.includes("flowchart")) {
                      ldrInAct++;
                      if (!ldrItem) ldrItem = ci;
                    } else if (t === "practice" || t === "pyq" || tit.includes("practice") || tit.includes("question bank")) {
                      practiceInAct++;
                      if (!practiceItem) practiceItem = ci;
                    } else if (t === "infographic" || t === "revision" || tit.includes("infographic")) {
                      infoInAct++;
                    } else {
                      notesInAct++;
                      if (!firstNoteItem) firstNoteItem = ci;
                    }
                  });
                });

                return (
                  <div
                    key={act.id}
                    className={`rounded-3xl bg-white border border-[#EAEFF5] p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-5 group ${meta.borderHover}`}
                  >
                    {/* TOP ROW: ICON CIRCLE + TITLE & SUBTITLE + ARROW BUTTON */}
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className="flex items-center gap-3.5 min-w-0 cursor-pointer"
                        onClick={() => setSelectedActId(act.id)}
                      >
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${meta.colorBg} ${meta.colorText}`}
                        >
                          <ActIcon className="w-6 h-6" />
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-sm sm:text-base font-bold text-[#0A192F] group-hover:text-[#005A9C] transition-colors truncate">
                            {act.title}
                          </h4>
                          <p className="text-xs text-[#64748B] mt-0.5">
                            {totalUnits} Units • {meta.badgeCategory}
                          </p>
                        </div>
                      </div>

                      {/* ARROW BUTTON TO DRILL DOWN */}
                      <button
                        type="button"
                        onClick={() => setSelectedActId(act.id)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${meta.arrowBg}`}
                        aria-label="View Act Details"
                      >
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>

                    {/* MIDDLE ROW: PROPER INTERACTIVE SEGREGATION BOXES INSIDE THE CARD! */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {/* MINI-BOX 1: LDR FLOWCHART */}
                      {ldrInAct > 0 ? (
                        <div
                          onClick={() => {
                            if (ldrItem) {
                              onOpenReader(ldrItem.fileUrl || `/api/content/${ldrItem.id}/file`, ldrItem.title, Boolean(activeCourse?.isEnrolled));
                            } else {
                              setSelectedActId(act.id);
                              setActDetailFilter("ldr");
                            }
                          }}
                          className="p-2.5 rounded-xl bg-gradient-to-br from-[#E0F2FE]/70 to-[#BAE6FD]/30 border border-[#BAE6FD] hover:border-[#0284C7] hover:shadow-2xs transition-all cursor-pointer group/box"
                        >
                          <div className="flex items-center gap-1.5 text-[#0284C7] mb-1">
                            <Workflow className="w-3.5 h-3.5 shrink-0 group-hover/box:scale-110 transition-transform" />
                            <span className="text-[11px] font-bold">LDR Flowchart</span>
                          </div>
                          <p className="text-[10px] text-[#0369A1] font-semibold line-clamp-1">
                            ⚡ Quick Mindmap Book
                          </p>
                        </div>
                      ) : (
                        <div
                          onClick={() => setSelectedActId(act.id)}
                          className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5 text-[#64748B] mb-1">
                            <Layers className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[11px] font-bold">Curriculum Units</span>
                          </div>
                          <p className="text-[10px] text-[#64748B] font-semibold">
                            {totalUnits} Units Enrolled
                          </p>
                        </div>
                      )}

                      {/* MINI-BOX 2: STUDY NOTES */}
                      <div
                        onClick={() => {
                          setSelectedActId(act.id);
                          setActDetailFilter("notes");
                        }}
                        className="p-2.5 rounded-xl bg-gradient-to-br from-[#EFF6FF]/70 to-[#DBEAFE]/30 border border-[#DBEAFE] hover:border-[#005A9C] hover:shadow-2xs transition-all cursor-pointer group/box"
                      >
                        <div className="flex items-center gap-1.5 text-[#005A9C] mb-1">
                          <FileText className="w-3.5 h-3.5 shrink-0 group-hover/box:scale-110 transition-transform" />
                          <span className="text-[11px] font-bold">Study Notes</span>
                        </div>
                        <p className="text-[10px] text-[#005A9C] font-semibold">
                          📑 {notesInAct || totalUnits} Chapter Codices
                        </p>
                      </div>

                      {/* MINI-BOX 3: PRACTICE VAULT */}
                      {practiceInAct > 0 && (
                        <div
                          onClick={() => {
                            if (practiceItem) {
                              onOpenReader(practiceItem.fileUrl || `/api/content/${practiceItem.id}/file`, practiceItem.title, Boolean(activeCourse?.isEnrolled));
                            } else {
                              setSelectedActId(act.id);
                              setActDetailFilter("practice");
                            }
                          }}
                          className="p-2.5 rounded-xl bg-gradient-to-br from-[#FEF3C7]/70 to-[#FDE68A]/30 border border-[#FDE68A] hover:border-[#D97706] hover:shadow-2xs transition-all cursor-pointer group/box"
                        >
                          <div className="flex items-center gap-1.5 text-[#D97706] mb-1">
                            <HelpCircle className="w-3.5 h-3.5 shrink-0 group-hover/box:scale-110 transition-transform" />
                            <span className="text-[11px] font-bold">Practice Qs</span>
                          </div>
                          <p className="text-[10px] text-[#92400E] font-semibold line-clamp-1">
                            📝 Solved RTP/MTP
                          </p>
                        </div>
                      )}

                      {/* MINI-BOX 4: INFOGRAPHICS OR QUICK ACTION */}
                      {infoInAct > 0 ? (
                        <div
                          onClick={() => {
                            setSelectedActId(act.id);
                            setActDetailFilter("infographic");
                          }}
                          className="p-2.5 rounded-xl bg-gradient-to-br from-[#F3E8FF]/70 to-[#E9D5FF]/30 border border-[#E9D5FF] hover:border-[#7C3AED] hover:shadow-2xs transition-all cursor-pointer group/box"
                        >
                          <div className="flex items-center gap-1.5 text-[#7C3AED] mb-1">
                            <Sparkles className="w-3.5 h-3.5 shrink-0 group-hover/box:scale-110 transition-transform" />
                            <span className="text-[11px] font-bold">Infographics</span>
                          </div>
                          <p className="text-[10px] text-[#6B21A8] font-semibold line-clamp-1">
                            ⚖️ Visual Precedents
                          </p>
                        </div>
                      ) : (
                        <div
                          onClick={() => setSelectedActId(act.id)}
                          className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#005A9C] hover:bg-[#EFF6FF] transition-all cursor-pointer flex items-center justify-center text-xs font-bold text-[#005A9C]"
                        >
                          <span>Explore All Boxes →</span>
                        </div>
                      )}
                    </div>

                    {/* BOTTOM ROW: PROGRESS INFO & PROGRESS BAR (EXACT SCREENSHOT LAYOUT) */}
                    <div className="space-y-2 pt-1 border-t border-[#F8FAFC]">
                      <div className="flex items-center justify-between text-xs text-[#64748B] font-medium">
                        <span>
                          {completedInAct} / {totalUnits} Units Completed
                        </span>
                        <span className="font-semibold text-[#0A192F]">{percent}%</span>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-[#EEF2F6] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${meta.progressColor}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* INSPIRATIONAL MOTIVATIONAL CARD (EXACT MATCH TO REFERENCE SCREENSHOT) */}
              <div className="rounded-3xl bg-gradient-to-br from-[#F5F8FC] via-[#F8FAFD] to-[#EDF4FA] border border-[#E2EAF2] p-6 sm:p-7 shadow-2xs flex flex-col justify-between gap-4 relative overflow-hidden group">
                <div className="space-y-1.5 z-10 max-w-[240px]">
                  <p className="text-xs text-[#64748B] font-serif italic">
                    Consistency
                  </p>
                  <h4 className="text-base sm:text-lg font-extrabold text-[#0D2144] leading-tight">
                    today creates
                    <br />
                    the success of tomorrow.
                  </h4>
                  <div className="w-10 h-0.5 bg-[#005A9C]/40 rounded-full mt-2" />
                </div>

                {/* DECORATIVE SCALES OF JUSTICE & LAUREL LEAVES ILLUSTRATION */}
                <div className="absolute right-3 bottom-2 sm:right-5 sm:bottom-4 opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none">
                  <svg
                    width="140"
                    height="120"
                    viewBox="0 0 140 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#005A9C]"
                  >
                    <path
                      d="M70 15V105M70 15L25 35M70 15L115 35"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="70" cy="12" r="4" fill="currentColor" />
                    <rect x="52" y="103" width="36" height="5" rx="2" fill="currentColor" />
                    <path
                      d="M10 50C10 50 25 65 40 50"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line x1="25" y1="35" x2="10" y2="50" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="25" y1="35" x2="40" y2="50" stroke="currentColor" strokeWidth="1.5" />
                    <path
                      d="M100 50C100 50 115 65 130 50"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line x1="115" y1="35" x2="100" y2="50" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="115" y1="35" x2="130" y2="50" stroke="currentColor" strokeWidth="1.5" />
                    <path
                      d="M125 90C128 85 132 82 135 78M130 96C133 93 136 90 138 86"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="z-10 pt-2">
                  <span className="text-[11px] font-bold text-[#005A9C] flex items-center gap-1">
                    <span>Keep up the daily momentum</span>
                    <Sparkles className="w-3 h-3 text-[#D97706]" />
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
