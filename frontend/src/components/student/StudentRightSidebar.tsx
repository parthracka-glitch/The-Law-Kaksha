"use client";

import React, { useState } from "react";
import { Flame, ChevronLeft, ChevronRight, Trophy, Clock } from "lucide-react";

interface StudentRightSidebarProps {
  streak: number;
  longestStreak?: number;
  studentName: string;
  studyHours?: number;
  userRank?: number;
  onOpenStreakLog?: () => void;
}

const WEEKLY_LEADERBOARD = [
  { rank: 1, name: "Suman Jana", time: "1767 hr", color: "text-[#D97706]" },
  { rank: 2, name: "Lopamudra Padhy", time: "1327 hr", color: "text-[#64748B]" },
  { rank: 3, name: "Prateek Vasanth", time: "469 hr", color: "text-[#B45309]" },
  { rank: 4, name: "Fakruddin Syed", time: "467 hr", color: "text-[#374151]" },
];

const OVERALL_LEADERBOARD = [
  { rank: 1, name: "Suman Jana", time: "2480 hr", color: "text-[#D97706]" },
  { rank: 2, name: "Lopamudra Padhy", time: "1920 hr", color: "text-[#64748B]" },
  { rank: 3, name: "Prateek Vasanth", time: "1450 hr", color: "text-[#B45309]" },
  { rank: 4, name: "Fakruddin Syed", time: "1190 hr", color: "text-[#374151]" },
];

export function StudentRightSidebar({
  streak = 0,
  longestStreak = 4,
  studentName = "Parth Racka",
  studyHours = 10,
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

  // Calendar for October 2026:
  // Oct 1, 2026 is a Thursday (Index 3 if starting Monday: M=0, T=1, W=2, T=3, F=4, S=5, S=6)
  const weekdays = ["M", "T", "W", "T", "F", "S", "S"];
  const startDayOffset = 3; // Thursday
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
    <aside className="w-full xl:w-80 shrink-0 space-y-4 text-[#221D1D] select-none font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP STREAK CARDS (SIDE BY SIDE EXACTLY AS IN SCREENSHOT)               */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Learning Streak Card */}
        <div
          onClick={onOpenStreakLog}
          className="bg-white rounded-2xl p-4 border border-[#E7E4E7] shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
          title="Click to view your daily streak"
        >
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4B5563]">
            <Flame className="w-4 h-4 text-[#F97316] shrink-0 fill-[#F97316]" />
            <span className="truncate text-xs">Learning Streak!</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#111827] leading-none">
              {streak}
            </span>
            <span className="text-xs font-bold text-[#6B7280]">Days</span>
          </div>
        </div>

        {/* Longest Streak Card */}
        <div
          onClick={onOpenStreakLog}
          className="bg-white rounded-2xl p-4 border border-[#E7E4E7] shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
          title="Click to view streak log"
        >
          <div className="text-xs font-semibold text-[#4B5563] truncate">
            Longest Streak!
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#111827] leading-none">
              {longestStreak}
            </span>
            <span className="text-xs font-bold text-[#6B7280]">Days</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CALENDAR WIDGET (EXACT MONTH & DAY 2 CIRCLED)                          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E7E4E7] shadow-2xs">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-3 text-sm font-bold text-[#221D1D]">
          <button
            onClick={() => setCurrentMonthIndex((prev) => (prev > 0 ? prev - 1 : 11))}
            className="p-1 rounded-lg hover:bg-[#F3E8FF] text-[#9CA3AF] hover:text-[#221D1D] transition-colors cursor-pointer"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-bold text-base tracking-tight text-[#1F2937]">
            {months[currentMonthIndex]}
          </span>

          <button
            onClick={() => setCurrentMonthIndex((prev) => (prev < 11 ? prev + 1 : 0))}
            className="p-1 rounded-lg hover:bg-[#F3E8FF] text-[#9CA3AF] hover:text-[#221D1D] transition-colors cursor-pointer"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Weekday Initials: M T W T F S S */}
        <div className="grid grid-cols-7 text-center mb-1">
          {weekdays.map((w, idx) => (
            <span key={idx} className="text-xs font-medium text-[#9CA3AF] py-1">
              {w}
            </span>
          ))}
        </div>

        {/* Days Grid (Day 2 Circled in Black Border) */}
        <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-7 w-7" />;
            }
            const isToday = day === 2; // In screenshot, Day 2 is circled with dark outline
            const isSelected = selectedDay === day;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`h-7 w-7 mx-auto rounded-full flex items-center justify-center text-xs transition-all cursor-pointer ${
                  isToday
                    ? "border-2 border-[#111827] text-[#111827] font-extrabold"
                    : isSelected
                    ? "bg-[#9333EA] text-white font-bold"
                    : "text-[#4B5563] hover:bg-[#F3E8FF] hover:text-[#9333EA]"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. LEADERBOARD WIDGET (EXACT TUTEDUDE STYLING & RANK PILL)                 */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E7E4E7] shadow-2xs space-y-3">
        {/* Leaderboard Header & [Weekly] [Overall] Switcher */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-extrabold text-base text-[#111827] tracking-tight">
            Leaderboard
          </h3>

          <div className="flex items-center p-0.5 rounded-lg bg-[#FAF5FF] border border-[#F3E8FF] text-xs font-semibold">
            <button
              onClick={() => setSelectedLeaderboard("weekly")}
              className={`px-3 py-1 rounded-md text-xs transition-all cursor-pointer ${
                selectedLeaderboard === "weekly"
                  ? "bg-[#7E22CE] text-white font-bold shadow-2xs"
                  : "text-[#7E22CE] hover:text-[#581C87]"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setSelectedLeaderboard("overall")}
              className={`px-3 py-1 rounded-md text-xs transition-all cursor-pointer ${
                selectedLeaderboard === "overall"
                  ? "bg-[#7E22CE] text-white font-bold shadow-2xs"
                  : "text-[#7E22CE] hover:text-[#581C87]"
              }`}
            >
              Overall
            </button>
          </div>
        </div>

        {/* Top 4 Ranked Students */}
        <div className="space-y-2 pt-1">
          {activeLeaderboard.map((entry) => (
            <div
              key={entry.rank}
              className="flex items-center justify-between py-1 px-1 rounded-lg text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-4 text-center text-sm shrink-0">
                  {entry.rank === 1 ? (
                    "🏆"
                  ) : entry.rank === 2 ? (
                    "🏆"
                  ) : entry.rank === 3 ? (
                    "🏆"
                  ) : (
                    <span className="text-[#6B7280] font-bold text-xs">#{entry.rank}</span>
                  )}
                </span>
                <span className={`font-bold truncate ${entry.color}`}>
                  {entry.name}
                </span>
              </div>

              <div className="flex items-center gap-1 font-mono text-[#EA580C] text-xs font-bold shrink-0">
                <Clock className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>{entry.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Your Rank Box (Tinted Lavender Container Matching Screenshot) */}
        <div className="mt-3 pt-2.5 bg-[#FAF5FF] rounded-2xl p-3 border border-[#F3E8FF] space-y-1">
          <div className="flex items-center justify-between text-[11px] text-[#7E22CE] font-bold">
            <span>Your Rank!</span>
            <span className="text-[10px] text-[#6B7280] font-normal">Course watch time</span>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-xs font-black text-[#7E22CE]">
              #{userRank}{" "}
              <span className="text-[#1F2937] font-semibold">{studentName}</span>
            </span>

            <div className="flex items-center gap-1 font-mono text-[#EA580C] text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>{studyHours} hr</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
