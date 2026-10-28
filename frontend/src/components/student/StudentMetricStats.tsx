"use client";

import React from "react";
import { BookOpen, CheckCircle2, Trophy, ArrowRight } from "lucide-react";

interface StudentMetricStatsProps {
  coursesCount?: number;
  lessonsCount?: number;
  certificatesCount?: number;
  drillsCount?: number;
  onViewCourses: () => void;
  onViewLessons: () => void;
  onViewCertificates?: () => void;
  onViewDrills?: () => void;
}

export function StudentMetricStats({
  coursesCount = 7,
  lessonsCount = 15,
  certificatesCount = 14,
  drillsCount = 14,
  onViewCourses,
  onViewLessons,
  onViewCertificates,
  onViewDrills,
}: StudentMetricStatsProps) {
  const displayDrills = drillsCount || certificatesCount || 14;
  const handleDrillAction = onViewDrills || onViewCertificates || onViewLessons;

  return (
    <div className="grid grid-cols-3 gap-2 xs:gap-3 sm:gap-4 md:gap-5">
      {/* 1. Courses Card */}
      <div className="bg-white rounded-xl xs:rounded-2xl sm:rounded-3xl border border-[#E7ECF7] p-2.5 xs:p-3 sm:p-5 shadow-[0_2px_8px_rgba(30,58,138,0.06)] hover:shadow-md transition-all flex flex-col justify-between group">
        <div>
          {/* Icon Badge */}
          <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-lg xs:rounded-xl sm:rounded-2xl bg-[#E3EBFF] flex items-center justify-center text-[#3558E8] shadow-2xs group-hover:scale-105 transition-transform">
            <BookOpen className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </div>

          {/* Number & Label */}
          <div className="mt-2 xs:mt-3 sm:mt-4">
            <h4 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-extrabold text-[#13264F] tracking-tight leading-none">
              {coursesCount}
            </h4>
            <p className="text-[10px] xs:text-xs sm:text-sm font-medium text-[#34425F] mt-1 truncate">
              Courses
            </p>
          </div>
        </div>

        {/* View all link */}
        <button
          onClick={onViewCourses}
          className="mt-2 sm:mt-4 inline-flex items-center gap-1 text-[9.5px] xs:text-[11px] sm:text-xs font-semibold text-[#3558E8] hover:text-[#1E3EB8] transition-colors cursor-pointer group-hover:underline truncate"
        >
          <span>View all</span>
          <ArrowRight className="w-2.5 h-2.5 xs:w-3 xs:h-3 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>
      </div>

      {/* 2. Lessons Card */}
      <div className="bg-white rounded-xl xs:rounded-2xl sm:rounded-3xl border border-[#E7ECF7] p-2.5 xs:p-3 sm:p-5 shadow-[0_2px_8px_rgba(30,58,138,0.06)] hover:shadow-md transition-all flex flex-col justify-between group">
        <div>
          {/* Icon Badge */}
          <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-lg xs:rounded-xl sm:rounded-2xl bg-[#E3EBFF] flex items-center justify-center text-[#3558E8] shadow-2xs group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </div>

          {/* Number & Label */}
          <div className="mt-2 xs:mt-3 sm:mt-4">
            <h4 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-extrabold text-[#13264F] tracking-tight leading-none">
              {lessonsCount}
            </h4>
            <p className="text-[10px] xs:text-xs sm:text-sm font-medium text-[#34425F] mt-1 truncate">
              Lessons
            </p>
          </div>
        </div>

        {/* View all link */}
        <button
          onClick={onViewLessons}
          className="mt-2 sm:mt-4 inline-flex items-center gap-1 text-[9.5px] xs:text-[11px] sm:text-xs font-semibold text-[#3558E8] hover:text-[#1E3EB8] transition-colors cursor-pointer group-hover:underline truncate"
        >
          <span>View all</span>
          <ArrowRight className="w-2.5 h-2.5 xs:w-3 xs:h-3 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>
      </div>

      {/* 3. Study Drills & Milestones Card */}
      <div className="bg-white rounded-xl xs:rounded-2xl sm:rounded-3xl border border-[#E7ECF7] p-2.5 xs:p-3 sm:p-5 shadow-[0_2px_8px_rgba(30,58,138,0.06)] hover:shadow-md transition-all flex flex-col justify-between group">
        <div>
          {/* Icon Badge */}
          <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-lg xs:rounded-xl sm:rounded-2xl bg-[#FFF0D1] flex items-center justify-center text-[#F6B21A] shadow-2xs group-hover:scale-105 transition-transform">
            <Trophy className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#D97706]" />
          </div>

          {/* Number & Label */}
          <div className="mt-2 xs:mt-3 sm:mt-4">
            <h4 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-extrabold text-[#13264F] tracking-tight leading-none">
              {displayDrills}
            </h4>
            <p className="text-[10px] xs:text-xs sm:text-sm font-medium text-[#34425F] mt-1 truncate">
              Study Drills
            </p>
          </div>
        </div>

        {/* View all link */}
        <button
          onClick={handleDrillAction}
          className="mt-2 sm:mt-4 inline-flex items-center gap-1 text-[9.5px] xs:text-[11px] sm:text-xs font-semibold text-[#D97706] hover:text-[#B45309] transition-colors cursor-pointer group-hover:underline truncate"
        >
          <span>View Drills</span>
          <ArrowRight className="w-2.5 h-2.5 xs:w-3 xs:h-3 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>
      </div>
    </div>
  );
}
