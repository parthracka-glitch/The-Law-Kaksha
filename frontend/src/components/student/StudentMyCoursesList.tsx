"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronRight, BookOpen, Lock, Sparkles, Scale, Landmark, FileText, Briefcase } from "lucide-react";

export interface StudentCourseProgressItem {
  id: string;
  name: string;
  code: string;
  weightage: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  pdfUrl: string;
  isUnlocked: boolean;
  category: "ca" | "cs";
  accentColor?: string;
  iconArt?: "contracts" | "saleOfGoods" | "partnership" | "companies" | "llp" | "negotiable" | "management";
}

interface StudentMyCoursesListProps {
  courses: StudentCourseProgressItem[];
  onOpenCourse: (course: StudentCourseProgressItem) => void;
  onExploreMore?: () => void;
  showSearchAndFilters?: boolean;
}

export function StudentMyCoursesList({
  courses,
  onOpenCourse,
  onExploreMore,
  showSearchAndFilters = true,
}: StudentMyCoursesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "in_progress" | "completed">("all");

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      // Search filter
      const matchesSearch =
        !searchQuery.trim() ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Status filter
      if (activeFilter === "in_progress") {
        return c.progressPercent > 0 && c.progressPercent < 100;
      }
      if (activeFilter === "completed") {
        return c.progressPercent === 100;
      }
      return true;
    });
  }, [courses, searchQuery, activeFilter]);

  // Render thematic subject artwork matching SVG style
  const renderSubjectArtwork = (item: StudentCourseProgressItem) => {
    if (item.name.toLowerCase().includes("contract")) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#0B1840] via-[#173684] to-[#2546A3] rounded-xl flex items-center justify-center relative overflow-hidden text-white p-2">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]" />
          <Scale className="w-6 h-6 text-amber-300 drop-shadow-sm" />
          <span className="absolute bottom-1 right-1.5 text-[8px] font-bold text-sky-200 uppercase tracking-wider">Act 1872</span>
        </div>
      );
    }
    if (item.name.toLowerCase().includes("sale of goods")) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#FBD3EA] via-[#D8B4F8] to-[#BDB4F7] rounded-xl flex items-center justify-center relative overflow-hidden text-[#1F2F86] p-2">
          <Briefcase className="w-6 h-6 text-[#1F2F86] drop-shadow-sm" />
          <span className="absolute bottom-1 right-1.5 text-[8px] font-bold text-[#1F2F86] uppercase tracking-wider">Act 1930</span>
        </div>
      );
    }
    if (item.name.toLowerCase().includes("partnership")) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#1F68DA] via-[#1348A0] to-[#0A2C74] rounded-xl flex items-center justify-center relative overflow-hidden text-white p-2">
          <Landmark className="w-6 h-6 text-emerald-300 drop-shadow-sm" />
          <span className="absolute bottom-1 right-1.5 text-[8px] font-bold text-emerald-200 uppercase tracking-wider">Act 1932</span>
        </div>
      );
    }
    if (item.name.toLowerCase().includes("companies")) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#FFA640] via-[#F25A1E] to-[#C2410C] rounded-xl flex items-center justify-center relative overflow-hidden text-white p-2">
          <FileText className="w-6 h-6 text-white drop-shadow-sm" />
          <span className="absolute bottom-1 right-1.5 text-[8px] font-bold text-amber-100 uppercase tracking-wider">Act 2013</span>
        </div>
      );
    }
    // Default general statutory card
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#13306F] to-[#0A173F] rounded-xl flex items-center justify-center relative overflow-hidden text-white p-2">
        <Scale className="w-6 h-6 text-cyan-300 drop-shadow-sm" />
        <span className="absolute bottom-1 right-1.5 text-[8px] font-bold text-cyan-200 uppercase tracking-wider">{item.code}</span>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Search Bar & Filter Chips (Compact layout) */}
      {showSearchAndFilters && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search chapters or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9.5 pl-9 pr-3 text-xs rounded-xl bg-[#E7EDF8] border border-transparent focus:border-[#3558F0] focus:bg-white text-[#13264F] placeholder-[#6C7893] transition-all outline-hidden shadow-2xs"
            />
            <Search className="w-3.5 h-3.5 text-[#6C7893] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === "all"
                  ? "bg-[#3558F0] text-white shadow-xs"
                  : "bg-[#E4EBF8] text-[#1E3A8A] hover:bg-[#D5E1FA]"
              }`}
            >
              All ({courses.length})
            </button>
            <button
              onClick={() => setActiveFilter("in_progress")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === "in_progress"
                  ? "bg-[#3558F0] text-white shadow-xs"
                  : "bg-[#E4EBF8] text-[#1E3A8A] hover:bg-[#D5E1FA]"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setActiveFilter("completed")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === "completed"
                  ? "bg-[#3558F0] text-white shadow-xs"
                  : "bg-[#E4EBF8] text-[#1E3A8A] hover:bg-[#D5E1FA]"
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      )}

      {/* Course Cards Scrollable Container - Limits vertical height & enables sleek inner scrolling */}
      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1.5 scroll-smooth divide-y divide-[#F1F5F9]/60">
        {filteredCourses.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-2xl border border-[#E7ECF7] text-[#6C7893]">
            <p className="text-xs font-medium">
              {courses.length === 0
                ? "No live courses are available yet."
                : "No courses match your filter."}
            </p>
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => onOpenCourse(course)}
              className="bg-white rounded-2xl border border-[#E7ECF7] p-3 sm:p-3.5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              {/* Left Side: Thumbnail Artwork */}
              <div className="w-16 sm:w-20 h-14 sm:h-16 shrink-0">
                {renderSubjectArtwork(course)}
              </div>

              {/* Middle: Details & Progress */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#13264F] truncate group-hover:text-[#3558F0] transition-colors">
                    {course.name}
                  </h4>
                  <span className="text-[10px] font-semibold text-[#6C7893] shrink-0 hidden sm:inline">
                    {course.code} • {course.weightage}
                  </span>
                </div>

                {/* Progress Bar & Percentage */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-[#1C2A4F]">
                    <div className="w-full bg-[#DCE6F8] rounded-full h-1.5 overflow-hidden mr-2">
                      <div
                        className="bg-gradient-to-r from-[#2F55E8] to-[#4F80F7] h-full rounded-full transition-all duration-500"
                        style={{ width: `${course.progressPercent > 0 ? Math.max(4, course.progressPercent) : 0}%` }}
                      />
                    </div>
                    <span className="shrink-0">{course.progressPercent}%</span>
                  </div>

                  {/* Lessons counter */}
                  <div className="flex items-center justify-between gap-2 text-[10px] text-[#5B6788]">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3 h-3 text-[#3558F0]" />
                      <span>
                        {course.completedLessons} / {course.totalLessons} Lessons
                      </span>
                    </div>
                    {!course.isUnlocked && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-sm border border-amber-200">
                        <Lock className="w-2.5 h-2.5" /> Sample Preview
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Action Chevron */}
              <div className="w-7 h-7 rounded-full bg-[#F4F7FC] group-hover:bg-[#3558F0] text-[#13264F] group-hover:text-white flex items-center justify-center transition-all shrink-0">
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
