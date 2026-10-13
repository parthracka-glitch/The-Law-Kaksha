"use client";

import React from "react";
import { Flame, Zap, Sparkles } from "lucide-react";
import { StudentSchedulePanel } from "./StudentSchedulePanel";

interface StudentRightSidebarProps {
  streak: number;
  longestStreak?: number;
  studentName?: string;
  studyHours?: number;
  userRank?: number;
}

export function StudentRightSidebar({
  streak = 1,
  longestStreak = 14,
  studentName = "Parth Racka",
  studyHours = 11,
  userRank = 57479,
}: StudentRightSidebarProps) {
  return (
    <aside className="w-full space-y-4 text-[#221D1D] select-none font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP STREAK CARDS (SIMPLE INFORMATIVE BOXES)                             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 gap-3">
        {/* Learning Streak Card */}
        <div
          className="relative overflow-hidden bg-gradient-to-br from-[#FFFBEB] via-white to-[#FEF3C7]/40 rounded-3xl p-4 border border-[#FDE68A] shadow-xs flex flex-col justify-between cursor-default"
        >
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#92400E]">
              <span className="relative flex items-center justify-center">
                <Flame className="w-4 h-4 text-[#EA580C] fill-[#EA580C] animate-pulse" />
              </span>
              <span className="truncate">Learning Streak!</span>
            </div>
          </div>

          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-[#1F2937] leading-none tracking-tight">
              {streak}
            </span>
            <span className="text-xs font-bold text-[#D97706]">{streak === 1 ? "Day" : "Days"}</span>
          </div>

          <div className="mt-2 pt-1.5 border-t border-amber-200/50 flex items-center justify-between text-[10px] font-bold text-[#B45309]">
            <span>Active Today</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
        </div>

        {/* Longest Streak Card */}
        <div
          className="relative overflow-hidden bg-gradient-to-br from-[#FAF5FF] via-white to-[#EDE9FE]/50 rounded-3xl p-4 border border-[#E9D5FF] shadow-xs flex flex-col justify-between cursor-default"
        >
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#7E22CE]">
              <Zap className="w-4 h-4 text-[#9333EA] fill-[#9333EA]" />
              <span className="truncate">Longest Streak!</span>
            </div>
          </div>

          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-[#1F2937] leading-none tracking-tight">
              {longestStreak}
            </span>
            <span className="text-xs font-bold text-[#7E22CE]">Days</span>
          </div>

          <div className="mt-2 pt-1.5 border-t border-purple-200/50 flex items-center justify-between text-[10px] font-bold text-[#7E22CE]">
            <span>Personal Best</span>
            <Sparkles className="w-3 h-3 text-[#A855F7]" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CALENDAR & SCHEDULE WIDGET                                             */}
      {/* ========================================================================= */}
      <StudentSchedulePanel />
    </aside>
  );
}
