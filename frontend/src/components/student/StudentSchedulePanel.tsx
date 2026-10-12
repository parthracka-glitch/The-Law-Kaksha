"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, CheckCircle2, Clock, Calendar, PlayCircle, Award, FileText } from "lucide-react";

interface LiveClassScheduleItem {
  id: string;
  subject: string;
  topic: string;
  timeLabel: string;
  status: "ongoing" | "upcoming";
  link?: string;
  instructor?: string;
}

interface RecentActivityItem {
  id: string;
  subject: string;
  actionText: string;
  timeAgo: string;
  type: "completed_lesson" | "submitted_quiz" | "passed_test";
}

const DEFAULT_UPCOMING_CLASSES: LiveClassScheduleItem[] = [
  {
    id: "live-1",
    subject: "The Indian Contract Act, 1872",
    topic: "Section 73 Damages & Anticipatory Breach",
    timeLabel: "Today, 10:00 AM",
    status: "ongoing",
    instructor: "Advocate Faculty",
  },
  {
    id: "live-2",
    subject: "The Sale of Goods Act, 1930",
    topic: "Caveat Emptor & Priest v. Last Case Law",
    timeLabel: "Tomorrow, 02:00 PM",
    status: "upcoming",
    instructor: "Law Kaksha Faculty",
  },
  {
    id: "live-3",
    subject: "The Companies Act, 2013",
    topic: "Corporate Veil & Lifting of Veil Exceptions",
    timeLabel: "Oct 15, 11:00 AM",
    status: "upcoming",
    instructor: "Law Kaksha Faculty",
  },
];

const DEFAULT_RECENT_ACTIVITIES: RecentActivityItem[] = [
  {
    id: "act-1",
    subject: "The Indian Contract Act, 1872",
    actionText: "Completed lesson: Essentials of Valid Contract (Sec 1-10)",
    timeAgo: "2h ago",
    type: "completed_lesson",
  },
  {
    id: "act-2",
    subject: "Practice Question Bank",
    actionText: "Submitted mock test: Indian Regulatory Framework",
    timeAgo: "1 day ago",
    type: "submitted_quiz",
  },
  {
    id: "act-3",
    subject: "The Companies Act, 2013",
    actionText: "Passed quiz: Salomon v. Salomon Precedent Drill",
    timeAgo: "2 days ago",
    type: "passed_test",
  },
];

interface StudentSchedulePanelProps {
  onSelectClass?: (item: LiveClassScheduleItem) => void;
  onViewAllClasses?: () => void;
  onViewAllActivity?: () => void;
}

export function StudentSchedulePanel({
  onSelectClass,
  onViewAllClasses,
  onViewAllActivity,
}: StudentSchedulePanelProps) {
  // Current calendar month state (e.g. October 2026)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 12)); // Oct 12, 2026
  const [selectedDay, setSelectedDay] = useState(12);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // First day of month and total days
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  return (
    <div className="space-y-5 sm:space-y-6 text-[#13264F]">
      {/* 1. Monthly Calendar Card matching SVG Phone 3 */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E7ECF7] p-4 sm:p-5 shadow-[0_2px_8px_rgba(30,58,138,0.06)]">
        {/* Month Header with Navigation */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-bold text-[#13264F]">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="w-7 h-7 rounded-full bg-[#F4F7FC] hover:bg-[#E4EBF8] text-[#13264F] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="w-7 h-7 rounded-full bg-[#F4F7FC] hover:bg-[#E4EBF8] text-[#13264F] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#4B5675] mb-2">
          {weekdays.map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="py-1.5 text-gray-300" />
          ))}

          {/* Actual days in month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const isSelected = dayNum === selectedDay;

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDay(dayNum)}
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#3550E8] text-white font-bold shadow-md shadow-blue-500/25 scale-105"
                    : "text-[#1C2A4F] hover:bg-[#EEF3FB]"
                }`}
              >
                {dayNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Upcoming Classes List matching SVG Phone 3 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-[#13264F]">
            Upcoming Classes
          </h3>
          {onViewAllClasses && (
            <button
              onClick={onViewAllClasses}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#3558E8] hover:underline cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          {DEFAULT_UPCOMING_CLASSES.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectClass && onSelectClass(item)}
              className="bg-white rounded-2xl border border-[#E7ECF7] p-3 sm:p-3.5 shadow-[0_2px_8px_rgba(30,58,138,0.06)] hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              {/* Left icon / art */}
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#173684] to-[#2546A3] flex items-center justify-center text-white shrink-0 shadow-2xs">
                <PlayCircle className="w-5 h-5 text-amber-300" />
              </div>

              {/* Title & Time */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <h4 className="text-xs sm:text-sm font-bold text-[#13264F] truncate group-hover:text-[#3558E8] transition-colors">
                  {item.subject}
                </h4>
                <p className="text-[11px] text-[#6C7893] truncate">
                  Live Class • {item.topic}
                </p>
                <p className="text-[10px] font-semibold text-[#5B6788]">
                  {item.timeLabel}
                </p>
              </div>

              {/* Status Pill matching SVG (Green On Going vs Blue Upcoming) */}
              <div className="shrink-0 flex items-center gap-1.5">
                {item.status === "ongoing" ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#DDF5E6] text-[#22A05A] shadow-2xs animate-pulse">
                    On Going
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E2E9FC] text-[#3552E0]">
                    Upcoming
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-[#6C7893] group-hover:text-[#3558E8] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recent Activity Feed matching SVG Phone 3 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-[#13264F]">
            Recent Activity
          </h3>
          {onViewAllActivity && (
            <button
              onClick={onViewAllActivity}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#3558E8] hover:underline cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E7ECF7] p-3.5 sm:p-4.5 shadow-[0_2px_8px_rgba(30,58,138,0.06)] space-y-3.5">
          {DEFAULT_RECENT_ACTIVITIES.map((act) => {
            return (
              <div key={act.id} className="flex items-start gap-3">
                {/* Circle Icon Badge */}
                {act.type === "completed_lesson" && (
                  <div className="w-8 h-8 rounded-full bg-[#3DBF6E] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
                {act.type === "submitted_quiz" && (
                  <div className="w-8 h-8 rounded-full bg-[#FDE8AE] flex items-center justify-center text-[#F5A623] shrink-0 mt-0.5 shadow-2xs">
                    <FileText className="w-4 h-4" />
                  </div>
                )}
                {act.type === "passed_test" && (
                  <div className="w-8 h-8 rounded-full bg-[#D6F2E0] flex items-center justify-center text-[#27A862] shrink-0 mt-0.5 shadow-2xs">
                    <Award className="w-4 h-4" />
                  </div>
                )}

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h5 className="text-xs font-bold text-[#13264F] truncate">
                      {act.subject}
                    </h5>
                    <span className="text-[10px] text-[#7A859F] shrink-0">
                      {act.timeAgo}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6C7893] leading-snug mt-0.5">
                    {act.actionText}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
