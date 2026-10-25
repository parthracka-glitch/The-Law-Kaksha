"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  Gift,
  ArrowRight,
  ShieldCheck,
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

// Curated Free Resources for all students
export interface FreeStudentResource {
  id: string;
  title: string;
  category: string;
  pages: string;
  badge: string;
  pdfUrl: string;
  description: string;
}

export const FREE_STUDENT_RESOURCES: FreeStudentResource[] = [];

interface StudentCoursesHierarchyTabProps {
  onOpenReader: (url: string, title: string, isPurchased?: boolean, previewPagesLimit?: number) => void;
  completedUnits: string[];
  onToggleUnitComplete: (unitId: string) => void;
  bookmarks: HierarchyBookmark[];
  onToggleBookmark: (item: HierarchyBookmark) => void;
  onExploreMore?: () => void;
  onBuyCourse?: (courseId: string) => void;
  initialCourseId?: string;
}

export function StudentCoursesHierarchyTab({
  onOpenReader,
  completedUnits = [],
  onToggleUnitComplete,
  bookmarks = [],
  onToggleBookmark,
  onExploreMore,
  onBuyCourse,
  initialCourseId,
}: StudentCoursesHierarchyTabProps) {
  const API_URL = getApiBaseUrl();
  const [courses, setCourses] = useState<HierarchicalCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId || "");
  const [expandedActs, setExpandedActs] = useState<Record<string, boolean>>({});
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const initialCourseIdRef = useRef(initialCourseId);

  useEffect(() => {
    initialCourseIdRef.current = initialCourseId;
  }, [initialCourseId]);

  // Sync initialCourseId prop
  useEffect(() => {
    if (initialCourseId && courses.length > 0) {
      const match = courses.find((c) => c.id === initialCourseId || c.slug === initialCourseId);
      if (match) {
        setSelectedCourseId(match.id);
        if (match.acts && match.acts.length > 0) {
          const firstLiveAct = match.acts.find((a) => !a.isComingSoon) || match.acts[0];
          if (firstLiveAct) {
            setExpandedActs((prev) => ({ ...prev, [firstLiveAct.id]: true }));
            if (firstLiveAct.units && firstLiveAct.units.length > 0) {
              setExpandedUnits((prev) => ({ ...prev, [firstLiveAct.units[0].id]: true }));
            }
          }
        }
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
        const res = await fetch(`${API_URL}/api/student/my-courses`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data: MyCoursesPayload = await res.json();
        if (isMounted) {
          if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
            // Sort so enrolled courses come first
            const validCourses = [...data.courses].sort((a, b) => {
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
              if (targetCourse.acts && targetCourse.acts.length > 0) {
                const firstLiveAct =
                  targetCourse.acts.find((a) => !a.isComingSoon) || targetCourse.acts[0];
                if (firstLiveAct) {
                  setExpandedActs({ [firstLiveAct.id]: true });
                  if (firstLiveAct.units && firstLiveAct.units.length > 0) {
                    setExpandedUnits({ [firstLiveAct.units[0].id]: true });
                  }
                }
              }
            }
          } else {
            setCourses([]);
            setSelectedCourseId("");
            setExpandedActs({});
            setExpandedUnits({});
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

  const hasAnyEnrolledCourse = useMemo(() => {
    return courses.some((c) => c.isEnrolled);
  }, [courses]);

  const toggleAct = (actId: string) => {
    setExpandedActs((prev) => ({ ...prev, [actId]: !prev[actId] }));
  };

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  const isBookmarked = (itemId: string) => {
    return bookmarks.some((b) => b.id === itemId);
  };

  const getContentTypeBadge = (type: string) => {
    switch (type) {
      case "ldr":
        return { label: "LDR Flowchart", bg: "bg-[#AED7E9]/40 text-[#005A9C] border-[#AED7E9]" };
      case "infographic":
        return { label: "Infographic", bg: "bg-[#BFAFE5]/40 text-[#432874] border-[#BFAFE5]" };
      case "practice":
        return { label: "Practice Qs", bg: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]" };
      case "pyq":
        return { label: "Past Exam PYQ", bg: "bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]" };
      case "video":
        return { label: "Video Lecture", bg: "bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]" };
      default:
        return { label: "Study Notes", bg: "bg-[#EFF6FF] text-[#005A9C] border-[#DBEAFE]" };
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="w-10 h-10 border-3 border-[#005A9C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-[#64748B]">Loading your curriculum codices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. FREE RESOURCES MODULE: DISPLAYED FOR UNPURCHASED USERS OR GENERAL ACCESS */}
      {!hasAnyEnrolledCourse && FREE_STUDENT_RESOURCES.length > 0 && (
        <div className="bg-gradient-to-br from-[#EFF6FF] via-[#F8FAFC] to-white rounded-3xl border border-[#BFDBFE] p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#DBEAFE] text-[#1E40AF] border border-[#BFDBFE] mb-2">
                <Gift className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Complimentary Student Access</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A192F] tracking-tight">
                Free Sample Codices &amp; Revision Material
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] mt-1 leading-relaxed">
                As a registered student, you have immediate access to all sample codices, LDR charts, and examiner model answers below in our in-browser DRM reader with your student watermark.
              </p>
            </div>
            {onExploreMore && (
              <button
                onClick={onExploreMore}
                className="px-4 py-2 rounded-xl bg-[#005A9C] hover:bg-[#004080] text-white text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
              >
                Browse All Courses
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {FREE_STUDENT_RESOURCES.map((res) => (
              <div
                key={res.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-4 hover:border-[#005A9C]/40 transition-all hover:shadow-sm flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                      {res.badge}
                    </span>
                    <span className="text-[11px] font-mono text-[#64748B]">{res.pages}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-[#005A9C] transition-colors line-clamp-1">
                    {res.title}
                  </h4>
                  <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
                  <span className="text-[10px] font-bold text-[#059669] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#059669]" />
                    <span>Free Access</span>
                  </span>

                  <button
                    onClick={() => onOpenReader(res.pdfUrl, res.title, false, 5)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#005A9C] hover:bg-[#004080] text-white flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Read Free Sample</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. UNLOCK FULL COURSE CALLOUT CARDS (IF USER DOES NOT OWN BOTH COURSES) */}
      {courses.some((c) => !c.isEnrolled) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses
            .filter((c) => !c.isEnrolled)
            .map((c) => (
              <div
                key={c.id}
                className="rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-white/10 p-5 text-white shadow-md flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>Curriculum Pass Required</span>
                    </span>
                    <span className="text-sm font-extrabold text-emerald-400">₹{c.price || 99}</span>
                  </div>
                  <h3 className="text-base font-black text-white">{c.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {c.description || "Unlock all statutory acts, comprehensive unit codices, LDR charts, and examiner marking traps."}
                  </p>
                </div>

                <button
                  onClick={() => onBuyCourse?.(c.id) || onExploreMore?.()}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:scale-[1.01]"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Unlock Full Course • ₹{c.price || 99}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
        </div>
      )}

      {/* 3. HEADER SECTION WITH MULTI-COURSE STACK SWITCHER */}
      <div className="bg-white rounded-2xl border border-[#E7ECF7] p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE] mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Hierarchical Learning Architecture</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0A192F] tracking-tight">
              My Courses &amp; Statutory Codices
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Course → Statutory Act → Curriculum Unit → Verified Study Notes &amp; LDR Charts
            </p>
          </div>

          {courses.length > 1 && (
            <div className="flex items-center gap-2">
              <label htmlFor="course-select" className="text-xs font-bold text-[#64748B] shrink-0">
                Select Course:
              </label>
              <select
                id="course-select"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-[#DBEAFE] bg-[#F8FAFC] text-xs font-bold text-[#0A192F] focus:outline-hidden focus:ring-2 focus:ring-[#005A9C] cursor-pointer"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} {c.isEnrolled ? "✓ (Enrolled)" : "🔒 (Locked)"}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* EMPTY STATE IF NO COURSES EXIST */}
      {courses.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#E7ECF7] p-8 text-center text-[#64748B]">
          <BookOpen className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0A192F]">No Courses Available</h3>
          <p className="text-xs text-[#64748B] mt-1">There are currently no courses or curriculum codices published.</p>
        </div>
      )}

      {/* 4. ACTIVE COURSE HIERARCHY ACCORDION */}
      {activeCourse && (
        <div className="space-y-4">
          {/* COURSE STATUS HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <h3 className="text-sm font-black text-[#0A192F] tracking-wide uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#005A9C]" />
              <span>{activeCourse.title}</span>
            </h3>

            <div>
              {activeCourse.isEnrolled ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Enrolled • Full Access Unlocked</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                  <Lock className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Sample Preview Mode</span>
                </span>
              )}
            </div>
          </div>

          {/* ACTS ACCORDION */}
          <div className="space-y-3">
            {(!activeCourse.acts || activeCourse.acts.length === 0) ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#E7ECF7] text-[#64748B]">
                <p className="text-sm font-semibold">No statutory acts found for this course.</p>
              </div>
            ) : (
              activeCourse.acts.map((act) => {
                const isActExpanded = Boolean(expandedActs[act.id]);
                const isComingSoon = Boolean(act.isComingSoon);

                return (
                  <div
                    key={act.id}
                    className="rounded-2xl border border-[#E7ECF7] bg-white overflow-hidden shadow-2xs transition-all"
                  >
                    {/* ACT HEADER */}
                    <div
                      onClick={() => !isComingSoon && toggleAct(act.id)}
                      className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors ${
                        isComingSoon
                          ? "bg-[#F8FAFC] opacity-75 cursor-not-allowed"
                          : "cursor-pointer hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isComingSoon
                              ? "bg-slate-100 text-slate-400"
                              : "bg-[#EFF6FF] text-[#005A9C]"
                          }`}
                        >
                          {isComingSoon ? <Clock className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm sm:text-base font-black text-[#0A192F] truncate">
                              {act.title}
                            </h4>
                            {isComingSoon && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                                Coming Soon
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#64748B]">
                            {act.units?.length || 0} Statutory Unit(s)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!isComingSoon && (
                          <div className="w-7 h-7 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#64748B]">
                            {isActExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* UNITS UNDER ACT */}
                    {isActExpanded && !isComingSoon && (
                      <div className="border-t border-[#F0F4F8] p-4 bg-[#F8FAFC] space-y-3">
                        {(!act.units || act.units.length === 0) ? (
                          <p className="text-xs text-[#64748B] italic py-2 text-center">
                            Curriculum units for this statutory act are being uploaded.
                          </p>
                        ) : (
                          act.units.map((unit) => {
                            const isUnitExpanded = Boolean(expandedUnits[unit.id]);
                            const isUnitCompleted = completedUnits.includes(unit.id);

                            return (
                              <div
                                key={unit.id}
                                className="rounded-xl border border-[#E7ECF7] bg-white overflow-hidden shadow-2xs"
                              >
                                {/* UNIT HEADER */}
                                <div
                                  onClick={() => toggleUnit(unit.id)}
                                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleUnitComplete(unit.id);
                                      }}
                                      className="text-[#64748B] hover:text-[#005A9C] transition-colors cursor-pointer shrink-0"
                                      title={isUnitCompleted ? "Mark as Incomplete" : "Mark as Completed"}
                                    >
                                      {isUnitCompleted ? (
                                        <CheckCircle2 className="w-5 h-5 text-[#047857]" />
                                      ) : (
                                        <Circle className="w-5 h-5 text-[#CBD5E1]" />
                                      )}
                                    </button>

                                    <div className="min-w-0">
                                      <h5 className="text-xs sm:text-sm font-bold text-[#0A192F] truncate">
                                        {unit.title}
                                      </h5>
                                      <p className="text-[11px] text-[#64748B]">
                                        {unit.contentItems?.length || 0} Content Material(s)
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[11px] font-semibold text-[#005A9C]">
                                      {isUnitExpanded ? "Hide Material" : "View Material"}
                                    </span>
                                    {isUnitExpanded ? (
                                      <ChevronDown className="w-4 h-4 text-[#005A9C]" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4 text-[#64748B]" />
                                    )}
                                  </div>
                                </div>

                                {/* CONTENT ITEMS UNDER UNIT */}
                                {isUnitExpanded && (
                                  <div className="border-t border-[#F0F4F8] p-3 sm:p-4 bg-[#F8FAFC] space-y-2.5">
                                    {(!unit.contentItems || unit.contentItems.length === 0) ? (
                                      <p className="text-xs text-[#64748B] italic py-1">
                                        Study material for this unit is being rendered.
                                      </p>
                                    ) : (
                                      unit.contentItems.map((item) => {
                                        const badge = getContentTypeBadge(item.contentType);
                                        const bookmarked = isBookmarked(item.id);
                                        const canOpenFull = Boolean(activeCourse.isEnrolled);
                                        const canOpenSample = Boolean(item.isFreeSample);

                                        return (
                                          <div
                                            key={item.id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white border border-[#E7ECF7] hover:border-[#005A9C]/40 transition-all hover:shadow-xs"
                                          >
                                            <div className="flex items-start sm:items-center gap-3 min-w-0">
                                              <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#005A9C] shrink-0 mt-0.5 sm:mt-0">
                                                {item.contentType === "ldr" ? (
                                                  <Workflow className="w-4 h-4" />
                                                ) : (
                                                  <FileText className="w-4 h-4" />
                                                )}
                                              </div>

                                              <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                  <span
                                                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg}`}
                                                  >
                                                    {badge.label}
                                                  </span>

                                                  {item.isFreeSample && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                                                      Free Sample ({item.samplePagesRange || "Preview"})
                                                    </span>
                                                  )}

                                                  {!canOpenFull && !item.isFreeSample && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                                                      <Lock className="w-2.5 h-2.5" />
                                                      <span>Pass Required</span>
                                                    </span>
                                                  )}

                                                  {item.pages && (
                                                    <span className="text-[11px] text-[#64748B]">
                                                      {item.pages}
                                                    </span>
                                                  )}
                                                </div>

                                                <p className="text-xs sm:text-sm font-bold text-[#0A192F] mt-1">
                                                  {item.title}
                                                </p>
                                              </div>
                                            </div>

                                            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                              {/* BOOKMARK BUTTON */}
                                              <button
                                                type="button"
                                                onClick={() => onToggleBookmark(item)}
                                                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                                                  bookmarked
                                                    ? "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]"
                                                    : "border-[#E7ECF7] text-[#64748B] hover:text-[#005A9C] hover:bg-[#F0F7FF]"
                                                }`}
                                                title={bookmarked ? "Remove Bookmark" : "Bookmark this item"}
                                                aria-label="Bookmark item"
                                              >
                                                <Bookmark
                                                  className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`}
                                                />
                                              </button>

                                              {/* ACTION BUTTON */}
                                              {canOpenFull ? (
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    onOpenReader(
                                                      item.fileUrl || `/api/content/${item.id}/file`,
                                                      item.title,
                                                      true
                                                    )
                                                  }
                                                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#005A9C] hover:bg-[#004080] text-white transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                                                >
                                                  <Eye className="w-3.5 h-3.5" />
                                                  <span>Open Reader</span>
                                                </button>
                                              ) : canOpenSample ? (
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    onOpenReader(
                                                      item.fileUrl || `/api/content/${item.id}/file`,
                                                      item.title,
                                                      false,
                                                      5
                                                    )
                                                  }
                                                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#047857] hover:bg-[#065F46] text-white transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                                                >
                                                  <Eye className="w-3.5 h-3.5" />
                                                  <span>Read Free Sample</span>
                                                </button>
                                              ) : (
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    onBuyCourse?.(activeCourse.id) || onExploreMore?.()
                                                  }
                                                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                                                >
                                                  <Lock className="w-3.5 h-3.5" />
                                                  <span>Unlock Course</span>
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
