"use client";

import React, { useState } from "react";
import { Flame, ChevronLeft, ChevronRight, Trophy, Clock, Zap, Sparkles, CheckCircle2 } from "lucide-react";

interface StudentRightSidebarProps {
  streak: number;
  longestStreak?: number;
  studentName: string;
  studyHours?: number;
  userRank?: number;
  onOpenStreakLog?: () => void;
}

const WEEKLY_LEADERBOARD = [
  { rank: 1, name: "Suman Jana", time: "1767 hr", color: "text-[#D97706]", medal: "🥇" },
  { rank: 2, name: "Lopamudra Padhy", time: "1327 hr", color: "text-[#64748B]", medal: "🥈" },
  { rank: 3, name: "Prateek Vasanth", time: "469 hr", color: "text-[#B45309]", medal: "🥉" },
  { rank: 4, name: "Fakruddin Syed", time: "467 hr", color: "text-[#374151]", medal: "#4" },
];

const OVERALL_LEADERBOARD = [
  { rank: 1, name: "Suman Jana", time: "2480 hr", color: "text-[#D97706]", medal: "🥇" },
  { rank: 2, name: "Lopamudra Padhy", time: "1920 hr", color: "text-[#64748B]", medal: "🥈" },
  { rank: 3, name: "Prateek Vasanth", time: "1450 hr", color: "text-[#B45309]", medal: "🥉" },
  { rank: 4, name: "Fakruddin Syed", time: "1190 hr", color: "text-[#374151]", medal: "#4" },
];

export function StudentRightSidebar({
  streak = 3,
  longestStreak = 4,
  studentName = "Parth Racka",
  studyHours = 11,
  userRank = 57479,
  onOpenStreakLog,
}: StudentRightSidebarProps) {
  const [selectedLeaderboard, setSelectedLeaderboard] = useState<"weekly" | "overall">("overall");
  const [currentMonthIndex, setCurrentMonthIndex] = useState(9); // October (0-indexed = 9)
  const [selectedDay, setSelectedDay] = useState<number>(2); // Default to 2nd October

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Calendar for October 2026: Oct 1 is Thursday (index 3 if M=0, T=1, W=2, T=3, F=4, S=5, S=6)
  const weekdays = ["M", "T", "W", "T", "F", "S", "S"];
  const startDayOffset = 3;
  const totalDaysInMonth = 31;

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startDayOffset; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= totalDaysInMonth; day++) {
    calendarDays.push(day);
  }

  const activeLeaderboard = selectedLeaderboard === "weekly" ? WEEKLY_LEADERBOARD : OVERALL_LEADERBOARD;

  return (
    <aside className="w-full space-y-4 text-[#221D1D] select-none font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP STREAK CARDS (ELEVATED CARDS WITH GLOW & PILLS)                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 gap-3">
        {/* Learning Streak Card */}
        <div
          onClick={onOpenStreakLog}
          className="relative overflow-hidden bg-gradient-to-br from-[#FFFBEB] via-white to-[#FEF3C7]/40 rounded-3xl p-4 border border-[#FDE68A] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to view daily learning streak details"
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
            <span className="text-xs font-bold text-[#D97706]">Days</span>
          </div>

          <div className="mt-2 pt-1.5 border-t border-amber-200/50 flex items-center justify-between text-[10px] font-bold text-[#B45309]">
            <span>Active Today</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
        </div>

        {/* Longest Streak Card */}
        <div
          onClick={onOpenStreakLog}
          className="relative overflow-hidden bg-gradient-to-br from-[#FAF5FF] via-white to-[#EDE9FE]/50 rounded-3xl p-4 border border-[#E9D5FF] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to view personal best streak"
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
      {/* 2. CALENDAR WIDGET (SLEEK LINEAR / APPLE DESIGN)                          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E7E4E7] shadow-xs hover:shadow-md transition-all">
        {/* Month Header with Navigation */}
        <div className="flex items-center justify-between mb-3 text-sm font-bold text-[#1F2937]">
          <button
            onClick={() => setCurrentMonthIndex((prev) => (prev > 0 ? prev - 1 : 11))}
            className="w-7 h-7 rounded-full hover:bg-[#F3E8FF] text-[#6B7280] hover:text-[#7E22CE] flex items-center justify-center transition-all cursor-pointer"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5">
            <span className="font-black text-base tracking-tight text-[#1F2937]">
              {months[currentMonthIndex]}
            </span>
            <span className="text-xs font-bold text-[#9CA3AF]">2026</span>
          </div>

          <button
            onClick={() => setCurrentMonthIndex((prev) => (prev < 11 ? prev + 1 : 0))}
            className="w-7 h-7 rounded-full hover:bg-[#F3E8FF] text-[#6B7280] hover:text-[#7E22CE] flex items-center justify-center transition-all cursor-pointer"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Weekday Initials: M T W T F S S */}
        <div className="grid grid-cols-7 text-center mb-1">
          {weekdays.map((w, idx) => (
            <span key={idx} className="text-[11px] font-bold text-[#9CA3AF] py-1">
              {w}
            </span>
          ))}
        </div>

        {/* Days Grid (Day 2 Circled in Bold Border with subtle glow) */}
        <div className="grid grid-cols-7 gap-y-1.5 text-center text-xs">
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-7 w-7" />;
            }
            const isToday = day === 2; // Matches reference image circled day
            const isSelected = selectedDay === day;
            const hasStudied = day === 1 || day === 2 || day === 3; // Activity indicator dots

            return (
              <div key={day} className="flex flex-col items-center">
                <button
                  onClick={() => setSelectedDay(day)}
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer relative ${
                    isToday
                      ? "ring-2 ring-[#1F2937] text-[#1F2937] font-black bg-amber-50/50 shadow-2xs scale-105"
                      : isSelected
                      ? "bg-[#7E22CE] text-white font-bold shadow-xs scale-105"
                      : "text-[#4B5563] hover:bg-[#F3E8FF] hover:text-[#7E22CE]"
                  }`}
                >
                  {day}
                </button>
                {/* Micro activity dot */}
                {hasStudied && (
                  <span className="w-1 h-1 rounded-full bg-[#10B981] mt-0.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. LEADERBOARD WIDGET (RICH PODIUM, TOGGLE & VIBRANT RANK CARD)            */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E7E4E7] shadow-xs hover:shadow-md transition-all space-y-3.5">
        {/* Leaderboard Header & [Weekly] [Overall] Switcher */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-base text-[#1F2937] tracking-tight">
              Leaderboard
            </h3>
          </div>

          <div className="inline-flex items-center p-1 rounded-xl bg-[#FAF5FF] border border-[#F3E8FF] text-xs font-bold shadow-2xs">
            <button
              onClick={() => setSelectedLeaderboard("weekly")}
              className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                selectedLeaderboard === "weekly"
                  ? "bg-[#7E22CE] text-white font-extrabold shadow-2xs"
                  : "text-[#7E22CE] hover:text-[#581C87]"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setSelectedLeaderboard("overall")}
              className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                selectedLeaderboard === "overall"
                  ? "bg-[#7E22CE] text-white font-extrabold shadow-2xs"
                  : "text-[#7E22CE] hover:text-[#581C87]"
              }`}
            >
              Overall
            </button>
          </div>
        </div>

        {/* Top 4 Ranked Students */}
        <div className="space-y-1.5 pt-1">
          {activeLeaderboard.map((entry) => (
            <div
              key={entry.rank}
              className="flex items-center justify-between py-1.5 px-2 rounded-xl text-xs hover:bg-[#FAF5FF] transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-sm shrink-0 w-5 text-center">
                  {entry.medal}
                </span>

                <span className={`font-bold truncate ${entry.color}`}>
                  {entry.name}
                </span>
              </div>

              <div className="flex items-center gap-1 font-mono text-[#EA580C] text-xs font-bold shrink-0 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
                <Clock className="w-3 h-3 text-[#EA580C]" />
                <span>{entry.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Your Rank Box (Lavish Lavender Banner matching TuteDude with vibrant accents) */}
        <div className="mt-3 bg-gradient-to-r from-[#FAF5FF] via-[#F4EBFC] to-[#EDE9FE] rounded-2xl p-3.5 border border-[#D8B4FE]/80 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#7E22CE] font-extrabold">
            <span className="flex items-center gap-1">
              <Trophy className="w-3 h-3 text-[#7E22CE]" />
              <span>Your Rank!</span>
            </span>
            <span className="text-[10px] text-[#6B7280] font-medium">Course watch time</span>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs font-black text-[#7E22CE]">
                #{userRank}
              </span>
              <span className="text-xs font-bold text-[#1F2937] truncate">
                {studentName || "Nirvanaa Studios"}
              </span>
            </div>

            <div className="flex items-center gap-1 font-mono text-[#EA580C] text-xs font-bold bg-white px-2 py-0.5 rounded-full shadow-2xs border border-amber-200 shrink-0">
              <Clock className="w-3 h-3 text-[#EA580C]" />
              <span>{studyHours} hr</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
