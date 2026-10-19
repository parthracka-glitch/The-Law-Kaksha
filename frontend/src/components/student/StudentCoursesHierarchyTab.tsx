"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  ChevronRight,
  ChevronDown,
  Lock,
  Clock,
  FileText,
  Workflow,
  Sparkles,
  HelpCircle,
  Bookmark,
  CheckCircle2,
  Circle,
  Eye,
  AlertCircle,
  Layers,
  ArrowRight,
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/api";

export interface HierarchicalContentItem {
  id: string;
  title: string;
  contentType: "notes" | "flowchart" | "infographic" | "practice" | "pyq" | "ldr" | "video";
  description?: string;
  duration?: string;
  pages?: string;
  isFreeSample?: boolean;
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
  acts: HierarchicalAct[];
}

const FALLBACK_CA_COURSE: HierarchicalCourse = {
  id: "ca-foundation",
  title: "CA Foundation — Business Laws",
  description: "ICAI New Syllabus comprehensive study notes, LDR charts, and case problems.",
  price: 1499,
  accessDays: 365,
  acts: [
    {
      id: "act-ca-contract",
      title: "The Indian Contract Act, 1872",
      order: 1,
      isComingSoon: false,
      units: [
        {
          id: "unit-ca-contract-1",
          title: "Unit 1: Nature of Contracts & Essentials of Valid Offer",
          order: 1,
          contentItems: [
            {
              id: "item-ca-contract-1",
              title: "Comprehensive Study Notes — Section 1-10",
              contentType: "notes",
              pages: "34 Pages",
              isFreeSample: true,
              samplePagesRange: "1-5",
              fileUrl: "/notes/sale-of-goods-unit-1.pdf",
            },
            {
              id: "item-ca-contract-ldr",
              title: "LDR Flowchart & Statutory Revision Matrix",
              contentType: "ldr",
              pages: "12 Pages",
              isFreeSample: true,
              fileUrl: "/notes/partnership-ldr-charts.pdf",
            },
          ],
        },
        {
          id: "unit-ca-contract-2",
          title: "Unit 2: Consideration & Capacity to Contract",
          order: 2,
          contentItems: [
            {
              id: "item-ca-contract-2",
              title: "Study Notes — Doctrine of Privity & Minor Capacity",
              contentType: "notes",
              pages: "28 Pages",
              fileUrl: "/notes/sale-of-goods-unit-2.pdf",
            },
          ],
        },
      ],
    },
    {
      id: "act-ca-soga",
      title: "The Sale of Goods Act, 1930",
      order: 2,
      isComingSoon: false,
      units: [
        {
          id: "unit-ca-soga-1",
          title: "Unit 1: Formation of Contract of Sale & Subject Matter",
          order: 1,
          contentItems: [
            {
              id: "item-ca-soga-1",
              title: "Study Notes — Sale vs Agreement to Sell (Sec 4-10)",
              contentType: "notes",
              pages: "22 Pages",
              isFreeSample: true,
              samplePagesRange: "1-5",
              fileUrl: "/notes/sale-of-goods-unit-1.pdf",
            },
          ],
        },
        {
          id: "unit-ca-soga-2",
          title: "Unit 2: Conditions and Warranties (Sec 11-17)",
          order: 2,
          contentItems: [
            {
              id: "item-ca-soga-2",
              title: "Study Notes — Caveat Emptor & Priest v. Last Rules",
              contentType: "notes",
              pages: "18 Pages",
              fileUrl: "/notes/sale-of-goods-unit-2.pdf",
            },
          ],
        },
      ],
    },
    {
      id: "act-ca-partnership",
      title: "The Indian Partnership Act, 1932",
      order: 3,
      isComingSoon: false,
      units: [
        {
          id: "unit-ca-partnership-1",
          title: "Unit 1: General Nature of Partnership & True Test",
          order: 1,
          contentItems: [
            {
              id: "item-ca-part-1",
              title: "Complete Master Notes & Landmark Rulings",
              contentType: "notes",
              pages: "24 Pages",
              isFreeSample: true,
              fileUrl: "/notes/unit-1-general-nature-of-partnership.pdf",
            },
          ],
        },
      ],
    },
    {
      id: "act-ca-llp",
      title: "The Limited Liability Partnership Act, 2008",
      order: 4,
      isComingSoon: false,
      units: [
        {
          id: "unit-ca-llp-1",
          title: "Unit 1: Salient Features & Incorporation of LLP",
          order: 1,
          contentItems: [
            {
              id: "item-ca-llp-1",
              title: "LLP Overview & Comparison Matrix",
              contentType: "notes",
              pages: "16 Pages",
              isFreeSample: true,
              fileUrl: "/notes/unit-2-relations-of-partners.pdf",
            },
          ],
        },
      ],
    },
    {
      id: "act-ca-companies",
      title: "The Companies Act, 2013 (Foundation Level)",
      order: 5,
      isComingSoon: false,
      units: [
        {
          id: "unit-ca-comp-1",
          title: "Unit 1: Company Meaning, Features & Corporate Veil",
          order: 1,
          contentItems: [
            {
              id: "item-ca-comp-1",
              title: "Essential Concepts of Company Law",
              contentType: "notes",
              pages: "30 Pages",
              isFreeSample: true,
              fileUrl: "/notes/cseet-business-law-full.pdf",
            },
          ],
        },
      ],
    },
  ],
};

interface StudentCoursesHierarchyTabProps {
  onOpenReader: (url: string, title: string, isPurchased?: boolean, previewPagesLimit?: number) => void;
  completedUnits: string[];
  onToggleUnitComplete: (unitId: string) => void;
  bookmarks: any[];
  onToggleBookmark: (item: any) => void;
  onExploreMore?: () => void;
  initialCourseId?: string;
}

export function StudentCoursesHierarchyTab({
  onOpenReader,
  completedUnits = [],
  onToggleUnitComplete,
  bookmarks = [],
  onToggleBookmark,
  onExploreMore,
  initialCourseId,
}: StudentCoursesHierarchyTabProps) {
  const API_URL = getApiBaseUrl();
  const [courses, setCourses] = useState<HierarchicalCourse[]>([FALLBACK_CA_COURSE]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId || "ca-foundation");
  const [expandedActs, setExpandedActs] = useState<Record<string, boolean>>({ "act-ca-contract": true });
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({ "unit-ca-contract-1": true });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync initialCourseId prop
  useEffect(() => {
    if (initialCourseId && courses.length > 0) {
      const match = courses.find((c) => c.id === initialCourseId || c.slug === initialCourseId);
      if (match) {
        setSelectedCourseId(match.id);
        if (match.acts && match.acts.length > 0) {
          const firstLiveAct = match.acts.find((a: any) => !a.isComingSoon) || match.acts[0];
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

  // Fetch student courses
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
        const data = await res.json();
        if (isMounted) {
          if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
            // Sort so courses with acts come first
            const validCourses = [...data.courses].sort((a, b) => {
              const actsA = a.acts?.length || 0;
              const actsB = b.acts?.length || 0;
              return actsB - actsA;
            });
            setCourses(validCourses);

            const targetCourse =
              (initialCourseId &&
                validCourses.find((c) => c.id === initialCourseId || c.slug === initialCourseId)) ||
              validCourses.find((c) => c.acts && c.acts.length > 0) ||
              validCourses[0];

            if (targetCourse) {
              setSelectedCourseId(targetCourse.id);
              if (targetCourse.acts && targetCourse.acts.length > 0) {
                const firstLiveAct =
                  targetCourse.acts.find((a: any) => !a.isComingSoon) || targetCourse.acts[0];
                if (firstLiveAct) {
                  setExpandedActs({ [firstLiveAct.id]: true });
                  if (firstLiveAct.units && firstLiveAct.units.length > 0) {
                    setExpandedUnits({ [firstLiveAct.units[0].id]: true });
                  }
                }
              }
            }
          } else {
            // Fallback: If no courses purchased yet, load default CA Foundation hierarchy
            setCourses([FALLBACK_CA_COURSE]);
            setSelectedCourseId(FALLBACK_CA_COURSE.id);
            setExpandedActs({ "act-ca-contract": true });
            setExpandedUnits({ "unit-ca-contract-1": true });
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to load courses");
          setCourses([FALLBACK_CA_COURSE]);
          setSelectedCourseId(FALLBACK_CA_COURSE.id);
          setExpandedActs({ "act-ca-contract": true });
          setExpandedUnits({ "unit-ca-contract-1": true });
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
        <p className="text-xs font-semibold text-[#64748B]">Loading your structured course curriculum...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER SECTION WITH COURSE SWITCHER */}
      <div className="bg-white rounded-2xl border border-[#E7ECF7] p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE] mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Hierarchical Learning Architecture</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0A192F] tracking-tight">
              My Courses & Statutory Codices
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Course → Statutory Act → Curriculum Unit → Verified Study Notes & LDR Charts
            </p>
          </div>

          {courses.length > 1 && (
            <div className="flex items-center gap-2">
              <label htmlFor="course-select" className="text-xs font-bold text-[#64748B] shrink-0">
                Course:
              </label>
              <select
                id="course-select"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#DBEAFE] bg-[#F8FAFC] text-xs font-bold text-[#0A192F] focus:outline-hidden focus:ring-2 focus:ring-[#005A9C]"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ACTIVE COURSE HIERARCHY ACCORDION */}
      {activeCourse && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-[#0A192F] tracking-wide uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#005A9C]" />
              <span>{activeCourse.title}</span>
            </h3>
            <span className="text-xs font-semibold text-[#64748B]">
              {activeCourse.acts?.length || 0} Acts / Modules
            </span>
          </div>

          {/* ACTS LIST */}
          <div className="space-y-3">
            {activeCourse.acts?.map((act, actIndex) => {
              const isExpanded = Boolean(expandedActs[act.id]);
              const isComingSoon = Boolean(act.isComingSoon);

              return (
                <div
                  key={act.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isComingSoon
                      ? "bg-[#F8FAFC] border-[#E2E8F0] opacity-85"
                      : isExpanded
                      ? "bg-white border-[#005A9C]/40 shadow-xs"
                      : "bg-white border-[#E7ECF7] hover:border-[#DBEAFE]"
                  }`}
                >
                  {/* ACT HEADER BAR */}
                  <div
                    onClick={() => {
                      if (!isComingSoon) toggleAct(act.id);
                    }}
                    className={`p-4 sm:p-5 flex items-center justify-between gap-3 ${
                      isComingSoon
                        ? "cursor-not-allowed bg-[#F1F5F9]/50"
                        : "cursor-pointer hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-xs sm:text-sm border ${
                          isComingSoon
                            ? "bg-[#E2E8F0] text-[#64748B] border-[#CBD5E1]"
                            : "bg-[#EFF6FF] text-[#005A9C] border-[#DBEAFE]"
                        }`}
                      >
                        {actIndex + 1}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm sm:text-base font-bold text-[#0A192F] truncate">
                            {act.title}
                          </h4>

                          {/* COMING SOON BADGE */}
                          {isComingSoon ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] animate-pulse">
                              <Clock className="w-3 h-3" />
                              <span>Coming Soon</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                              <span>Live Module</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#64748B] mt-0.5">
                          {isComingSoon
                            ? "Under review & alignment with the latest statutory guidelines."
                            : `${act.units?.length || 0} Units • Full Curriculum Available`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isComingSoon ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-[#64748B] bg-[#E2E8F0]/60 border border-[#CBD5E1]">
                          <Lock className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Locked</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#005A9C] transition-colors"
                          aria-label="Toggle act units"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-[#005A9C]" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* UNITS LIST (WHEN EXPANDED AND NOT COMING SOON) */}
                  {!isComingSoon && isExpanded && (
                    <div className="border-t border-[#F0F4F8] bg-[#FAFCFF] p-4 sm:p-5 space-y-4">
                      {(!act.units || act.units.length === 0) ? (
                        <p className="text-xs text-[#64748B] italic py-2">
                          No units published for this act yet. Check back soon.
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

                                            {/* OPEN IN READER BUTTON */}
                                            <button
                                              type="button"
                                              onClick={() =>
                                                onOpenReader(
                                                  item.fileUrl || `/api/content/${item.id}/file`,
                                                  item.title,
                                                  true,
                                                  item.isFreeSample ? 5 : undefined
                                                )
                                              }
                                              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#005A9C] hover:bg-[#004080] text-white transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                                            >
                                              <Eye className="w-3.5 h-3.5" />
                                              <span>Open Reader</span>
                                            </button>
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
            })}
          </div>
        </div>
      )}
    </div>
  );
}
