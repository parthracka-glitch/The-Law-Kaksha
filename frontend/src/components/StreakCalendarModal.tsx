"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  X,
  Flame,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy,
  CheckCircle2,
  Clock,
  BookOpen,
  CalendarCheck,
  CheckSquare,
  Square,
  ArrowRight,
  Target,
} from "lucide-react";

interface StreakCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  onStreakUpdate?: (newStreak: number) => void;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface StudyDayLog {
  title: string;
  topic: string;
  duration: string;
  items: string[];
  completedItems?: boolean[];
  note?: string;
  timestamp?: string;
}

const DEFAULT_TOPICS_BY_DAY: Record<number, StudyDayLog> = {
  0: {
    title: "Contract Act & Restitution",
    topic: "Indian Contract Act, 1872 — Section 1 to 10 (Offer, Acceptance & Consideration)",
    duration: "50 mins",
    items: ["Offer & Acceptance legal rules", "Consideration & Privity exceptions", "15 Practice MCQs"],
    completedItems: [true, true, true],
  },
  1: {
    title: "Sale of Goods Principles",
    topic: "Sale of Goods Act, 1930 — Section 16 & Caveat Emptor Doctrine",
    duration: "45 mins",
    items: ["Priest v. Last implied fitness", "Section 16 exceptions", "Unpaid seller lien & stoppage"],
    completedItems: [true, true, true],
  },
  2: {
    title: "Partnership & Mutual Agency",
    topic: "Indian Partnership Act, 1932 — True Test of Partnership (Sec 6)",
    duration: "60 mins",
    items: ["Cox v. Hickman sharing of profits", "Section 28 Holding Out liability", "Non-registration effects (Sec 69)"],
    completedItems: [true, true, true],
  },
  3: {
    title: "Company Law & Corporate Veil",
    topic: "Companies Act, 2013 — Corporate Personality & Ultra Vires",
    duration: "40 mins",
    items: ["Salomon v. Salomon doctrine", "Lifting of Corporate Veil grounds", "Ultra Vires borrowing remedies"],
    completedItems: [true, true, true],
  },
  4: {
    title: "General Management & Fayol",
    topic: "Management Principles — Henri Fayol 14 Principles & FW Taylor",
    duration: "35 mins",
    items: ["Division of work & Unity of command", "F.W. Taylor Scientific Management", "Management vs Administration"],
    completedItems: [true, true, true],
  },
  5: {
    title: "Weekly MCQ Speed Test",
    topic: "Timed Mock Evaluation — 30 High-Yield Questions",
    duration: "30 mins",
    items: ["Scored 27/30 Marks (90%)", "Reviewed 3 incorrect question explanations", "Flagged key case precedents"],
    completedItems: [true, true, true],
  },
  6: {
    title: "Last Day Revision Deck",
    topic: "Visual Recall Flowcharts & Summary Matrix",
    duration: "45 mins",
    items: ["Section 73 damages formula", "Section 138 cheque dishonour penalties", "1-Page Act summary review"],
    completedItems: [true, true, true],
  },
};

const formatDateKey = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export function StreakCalendarModal({
  isOpen,
  onClose,
  streak,
  onStreakUpdate,
}: StreakCalendarModalProps) {
  // Real live system date reference
  const [currentRealTime, setCurrentRealTime] = useState<Date>(() => new Date());
  const [viewDate, setViewDate] = useState<Date>(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [studyHistory, setStudyHistory] = useState<Record<string, StudyDayLog>>({});
  const [loggedToday, setLoggedToday] = useState(false);

  // Synchronize with real date & load local persistent history
  const syncWithRealDate = useCallback(() => {
    const now = new Date();
    setCurrentRealTime(now);
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now);

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("lawkaksha_study_history");
        const parsed: Record<string, StudyDayLog> = raw ? JSON.parse(raw) : {};
        setStudyHistory(parsed);

        const todayKey = formatDateKey(now);
        if (parsed[todayKey]) {
          setLoggedToday(true);
        } else {
          setLoggedToday(false);
        }
      } catch (e) {
        // ignore parse error
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      syncWithRealDate();
    }
  }, [isOpen, syncWithRealDate]);

  // Keep live time ticking while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentRealTime(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Real today key
  const realTodayKey = formatDateKey(currentRealTime);

  // Calculate real consecutive streak dates ending at realToday
  const activeStreakKeys = useMemo(() => {
    const keys = new Set<string>();
    const count = Math.max(streak, 1);
    for (let i = 0; i < count; i++) {
      const d = new Date(currentRealTime);
      d.setDate(currentRealTime.getDate() - i);
      keys.add(formatDateKey(d));
    }
    // Also include any other dates explicitly recorded in studyHistory
    Object.keys(studyHistory).forEach((k) => keys.add(k));
    return keys;
  }, [currentRealTime, streak, studyHistory]);

  // Viewed Year and Month
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Days in viewed month
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon ...
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Navigation handlers
  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const jumpToToday = () => {
    const now = new Date();
    setCurrentRealTime(now);
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now);
  };

  // Mark / Log study for a particular date (today or past date)
  const handleLogStudyForDate = (targetDate: Date) => {
    const targetKey = formatDateKey(targetDate);
    const dayOfWeek = targetDate.getDay();
    const defaultTemplate = DEFAULT_TOPICS_BY_DAY[dayOfWeek];

    const newLog: StudyDayLog = {
      title: defaultTemplate.title,
      topic: defaultTemplate.topic,
      duration: defaultTemplate.duration,
      items: [...defaultTemplate.items],
      completedItems: defaultTemplate.items.map(() => true),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedHistory = {
      ...studyHistory,
      [targetKey]: newLog,
    };

    setStudyHistory(updatedHistory);

    if (targetKey === realTodayKey) {
      setLoggedToday(true);
      const newStreak = streak + 1;
      if (typeof window !== "undefined") {
        localStorage.setItem("lawkaksha_streak", String(newStreak));
        localStorage.setItem("lawkaksha_last_login", currentRealTime.toDateString());
        localStorage.setItem("lawkaksha_study_history", JSON.stringify(updatedHistory));
        window.dispatchEvent(new Event("storage"));
      }
      if (onStreakUpdate) onStreakUpdate(newStreak);
    } else {
      if (typeof window !== "undefined") {
        localStorage.setItem("lawkaksha_study_history", JSON.stringify(updatedHistory));
        window.dispatchEvent(new Event("storage"));
      }
    }
  };

  // Toggle individual checklist items
  const handleToggleCheckItem = (itemIndex: number) => {
    const key = formatDateKey(selectedDate);
    const existing = studyHistory[key] || DEFAULT_TOPICS_BY_DAY[selectedDate.getDay()];
    const completed = existing.completedItems
      ? [...existing.completedItems]
      : existing.items.map(() => true);

    completed[itemIndex] = !completed[itemIndex];

    const updatedLog: StudyDayLog = {
      ...existing,
      completedItems: completed,
    };

    const updatedHistory = {
      ...studyHistory,
      [key]: updatedLog,
    };

    setStudyHistory(updatedHistory);
    if (typeof window !== "undefined") {
      localStorage.setItem("lawkaksha_study_history", JSON.stringify(updatedHistory));
      window.dispatchEvent(new Event("storage"));
    }
  };

  if (!isOpen) return null;

  // Selected date status & logs
  const selectedDateKey = formatDateKey(selectedDate);
  const isSelectedToday = selectedDateKey === realTodayKey;
  const isSelectedInStreak = activeStreakKeys.has(selectedDateKey);
  const isSelectedFuture = selectedDate > currentRealTime && !isSelectedToday;
  const isSelectedPast = selectedDate < currentRealTime && !isSelectedToday;

  const selectedLog: StudyDayLog =
    studyHistory[selectedDateKey] ||
    DEFAULT_TOPICS_BY_DAY[selectedDate.getDay()];

  const selectedFormattedTitle = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const realTodayFormatted = currentRealTime.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Calculate total study sessions logged
  const totalDaysLogged = Object.keys(studyHistory).length + (activeStreakKeys.size > 0 ? 0 : 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#E7E4E7] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* FLAME HERO HEADER */}
        <div className="relative bg-[#AED7E9] p-6 text-[#221D1D] text-center shrink-0 overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/60 hover:bg-white/80 flex items-center justify-center text-[#221D1D] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Real-Date Live Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-[#221D1D] text-[11px] font-semibold border border-[#98C5D8] mb-3 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#BFAFE5] animate-ping" />
            <span>Synced Real Date: {realTodayFormatted}</span>
          </div>

          {/* Flame Badge */}
          <div className="relative inline-flex items-center justify-center mb-2 block mx-auto">
            <div className="relative w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-md flex items-center justify-center shadow-md border border-[#98C5D8]">
              <Flame className="w-8 h-8 text-[#F7892A]" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#221D1D] tracking-tight font-serif">
            {streak} Day Study Streak!
          </h2>
          <p className="text-[#4D433F] text-xs font-medium mt-1 max-w-md mx-auto">
            Synchronized live with real calendar dates &amp; active study milestones.
          </p>

          {/* Summary Pills */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#98C5D8]">
            <div className="p-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-[#98C5D8]">
              <p className="text-base font-bold text-[#221D1D]">{streak} {streak === 1 ? "Day" : "Days"}</p>
              <p className="text-[10px] text-[#4D433F] font-semibold uppercase tracking-wider">Current Streak</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-[#98C5D8]">
              <p className="text-base font-bold text-[#221D1D]">{Math.max(streak, 14)} Days</p>
              <p className="text-[10px] text-[#4D433F] font-semibold uppercase tracking-wider">Best Record</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-[#98C5D8]">
              <p className="text-base font-bold text-[#221D1D]">{loggedToday ? "Complete ✓" : "In Progress"}</p>
              <p className="text-[10px] text-[#4D433F] font-semibold uppercase tracking-wider">Today&apos;s Status</p>
            </div>
          </div>
        </div>

        {/* CALENDAR BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white">
          
          {/* MONTH & YEAR HEADER WITH REAL-TIME NAVIGATION */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#AED7E9]/40 flex items-center justify-center text-[#4B8097]">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#221D1D]">
                  {MONTH_NAMES[month]} {year}
                </h3>
                <p className="text-[10px] text-[#77716E] font-medium">Real-Time Calendar View</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={jumpToToday}
                className="px-2.5 py-1 rounded-lg bg-[#F7F7F5] hover:bg-[#E7E4E7] text-[#221D1D] text-[11px] font-semibold transition-colors cursor-pointer mr-1 flex items-center gap-1 border border-[#E7E4E7]"
                title="Jump to Today's Real Date"
              >
                <Target className="w-3 h-3 text-[#4B8097]" />
                Today
              </button>
              <button
                type="button"
                onClick={prevMonth}
                className="w-7 h-7 rounded-lg bg-[#F7F7F5] hover:bg-[#E7E4E7] flex items-center justify-center text-[#77716E] transition-colors cursor-pointer border border-[#E7E4E7]"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="w-7 h-7 rounded-lg bg-[#F7F7F5] hover:bg-[#E7E4E7] flex items-center justify-center text-[#77716E] transition-colors cursor-pointer border border-[#E7E4E7]"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* COMPLETE CALENDAR MATRIX WITH REAL OVERFLOW DATES */}
          <div className="border border-[#E7E4E7] rounded-2xl p-3 bg-[#F7F7F5]">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {WEEKDAYS.map((w, i) => (
                <span
                  key={i}
                  className="text-[11px] font-semibold uppercase tracking-wider text-[#77716E] py-1"
                >
                  {w}
                </span>
              ))}
            </div>

            {/* Day cells matrix */}
            <div className="grid grid-cols-7 gap-1">
              
              {/* Previous Month Overflow Days */}
              {Array.from({ length: firstWeekday }).map((_, idx) => {
                const prevDayNum = daysInPrevMonth - firstWeekday + idx + 1;
                const prevDate = new Date(year, month - 1, prevDayNum);
                const prevKey = formatDateKey(prevDate);
                const isPrevInStreak = activeStreakKeys.has(prevKey);
                const isPrevSelected = prevKey === selectedDateKey;

                return (
                  <button
                    key={`prev-${idx}`}
                    type="button"
                    onClick={() => {
                      setViewDate(new Date(year, month - 1, 1));
                      setSelectedDate(prevDate);
                    }}
                    className={`h-10 rounded-xl text-xs font-medium flex flex-col items-center justify-center transition-all cursor-pointer opacity-40 hover:opacity-80 ${
                      isPrevSelected
                        ? "ring-2 ring-[#AED7E9] shadow-xs"
                        : ""
                    } ${
                      isPrevInStreak
                        ? "bg-[#AED7E9]/40 text-[#221D1D] font-bold"
                        : "bg-white text-[#77716E] border border-[#E7E4E7]"
                    }`}
                    title={`Previous month: ${prevDate.toLocaleDateString()}`}
                  >
                    <span>{prevDayNum}</span>
                    {isPrevInStreak && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#AED7E9] mt-0.5" />
                    )}
                  </button>
                );
              })}

              {/* Current Month Days (1 to End of Month) */}
              {Array.from({ length: daysInCurrentMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const cellDate = new Date(year, month, dayNum);
                const cellKey = formatDateKey(cellDate);
                const isToday = cellKey === realTodayKey;
                const isInStreak = activeStreakKeys.has(cellKey);
                const isSelected = cellKey === selectedDateKey;
                const isFuture = cellDate > currentRealTime && !isToday;

                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => setSelectedDate(cellDate)}
                    className={`h-10 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer relative group ${
                      isSelected
                        ? "ring-2 ring-[#AED7E9] shadow-xs z-10 scale-[1.03]"
                        : "hover:bg-white"
                    } ${
                      isToday
                        ? "bg-[#AED7E9] text-[#221D1D] font-bold shadow-xs border border-[#98C5D8]"
                        : isInStreak
                        ? "bg-[#C4E1EC]/50 text-[#221D1D] border border-[#AED7E9] font-bold"
                        : isFuture
                        ? "bg-white text-[#77716E] border border-dashed border-[#E7E4E7]"
                        : "bg-white text-[#221D1D] border border-[#E7E4E7]"
                    }`}
                  >
                    <span>{dayNum}</span>
                    {isToday ? (
                      <Flame className="w-2.5 h-2.5 text-[#F7892A] mt-0.5" />
                    ) : isInStreak ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4B8097] mt-0.5" />
                    ) : null}
                  </button>
                );
              })}

              {/* Next Month Overflow Days */}
              {(() => {
                const totalCellsUsed = firstWeekday + daysInCurrentMonth;
                const remainder = totalCellsUsed % 7;
                const trailingDays = remainder === 0 ? 0 : 7 - remainder;

                return Array.from({ length: trailingDays }).map((_, idx) => {
                  const nextDayNum = idx + 1;
                  const nextDate = new Date(year, month + 1, nextDayNum);
                  const nextKey = formatDateKey(nextDate);
                  const isNextSelected = nextKey === selectedDateKey;

                  return (
                    <button
                      key={`next-${idx}`}
                      type="button"
                      onClick={() => {
                        setViewDate(new Date(year, month + 1, 1));
                        setSelectedDate(nextDate);
                      }}
                      className={`h-10 rounded-xl text-xs font-medium flex flex-col items-center justify-center transition-all cursor-pointer opacity-40 hover:opacity-80 ${
                        isNextSelected ? "ring-2 ring-[#AED7E9] shadow-xs" : ""
                      } bg-white text-[#77716E] border border-[#E7E4E7]`}
                      title={`Next month: ${nextDate.toLocaleDateString()}`}
                    >
                      <span>{nextDayNum}</span>
                    </button>
                  );
                });
              })()}
            </div>
          </div>

          {/* REAL DATE DETAILS / ACTIVITY CARD */}
          <div className="p-4 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7] flex items-start gap-3.5 animate-in fade-in duration-150">
            <div className="w-11 h-11 rounded-xl bg-[#AED7E9] text-[#221D1D] text-xs font-bold flex flex-col items-center justify-center shrink-0 shadow-xs border border-[#98C5D8]">
              <span className="text-[9px] uppercase leading-none opacity-80">
                {MONTH_NAMES[selectedDate.getMonth()].slice(0, 3)}
              </span>
              <span className="text-base font-bold leading-none mt-0.5">
                {selectedDate.getDate()}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <h4 className="text-xs font-bold text-[#221D1D]">
                    {selectedFormattedTitle}
                  </h4>
                  <p className="text-[11px] text-[#4B8097] font-semibold">
                    {selectedLog.title}
                  </p>
                </div>

                {isSelectedToday ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#BFAFE5] text-[#221D1D] text-[10px] font-semibold flex items-center gap-1 shrink-0 shadow-xs">
                    <Flame className="w-3 h-3 text-[#F7892A]" />
                    Today • Active Session
                  </span>
                ) : isSelectedInStreak ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#AED7E9]/40 text-[#221D1D] text-[10px] font-semibold flex items-center gap-1 shrink-0 border border-[#AED7E9]">
                    <CheckCircle2 className="w-3 h-3 text-[#4B8097]" />
                    Streak Verified
                  </span>
                ) : isSelectedFuture ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-[#77716E] text-[10px] font-semibold flex items-center gap-1 shrink-0 border border-[#E7E4E7]">
                    <Clock className="w-3 h-3 text-[#77716E]" />
                    Upcoming Target
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-[#77716E] text-[10px] font-semibold flex items-center gap-1 shrink-0 border border-[#E7E4E7]">
                    <CalendarCheck className="w-3 h-3 text-[#77716E]" />
                    Past Study Day
                  </span>
                )}
              </div>

              {/* Topic & duration */}
              <div className="mt-2.5 space-y-1.5">
                <div className="flex items-center gap-2 text-[11px] text-[#4D433F]">
                  <BookOpen className="w-3.5 h-3.5 text-[#4B8097] shrink-0" />
                  <span className="truncate font-medium">{selectedLog.topic}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#77716E]">
                  <Clock className="w-3.5 h-3.5 text-[#77716E] shrink-0" />
                  <span>Target Session: {selectedLog.duration}</span>
                </div>
              </div>

              {/* Interactive checklist */}
              {selectedLog.items && selectedLog.items.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-[#E7E4E7] space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#77716E]">
                    Study Checklist &amp; Milestones
                  </p>
                  <div className="space-y-1">
                    {selectedLog.items.map((item, idx) => {
                      const isChecked = selectedLog.completedItems
                        ? selectedLog.completedItems[idx] ?? true
                        : true;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleToggleCheckItem(idx)}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#F7F7F5] border border-[#E7E4E7] text-left text-[11px] font-medium text-[#4D433F] transition-colors cursor-pointer group"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-3.5 h-3.5 text-[#4B8097] shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-[#77716E] group-hover:text-[#221D1D] shrink-0" />
                          )}
                          <span className={isChecked ? "line-through text-[#77716E]" : "text-[#221D1D]"}>
                            {item}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Backfill or log button for past/today dates */}
              {!isSelectedInStreak && (
                <div className="mt-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleLogStudyForDate(selectedDate)}
                    className="px-3 py-1.5 rounded-lg bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#221D1D]" />
                    Record Study Session for {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* DAILY MOTIVATION & REAL-TIME LOG BUTTON */}
          <div className="p-4 rounded-2xl bg-[#C4E1EC]/40 border border-[#AED7E9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#AED7E9] flex items-center justify-center text-[#221D1D] shrink-0">
                <Trophy className="w-5 h-5 text-[#221D1D]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#221D1D]">
                  Real-Date Study Progress
                </p>
                <p className="text-[11px] text-[#4D433F]">
                  Today is {realTodayFormatted} · Active Session
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleLogStudyForDate(currentRealTime)}
              disabled={loggedToday}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 shadow-xs flex items-center gap-1.5 ${
                loggedToday
                  ? "bg-[#AED7E9] text-[#221D1D] cursor-default"
                  : "bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D]"
              }`}
            >
              {loggedToday ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#221D1D]" />
                  Logged for Today ✓
                </>
              ) : (
                <>
                  <Flame className="w-3.5 h-3.5 text-[#F7892A]" />
                  Log Today&apos;s Study
                </>
              )}
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-[#F7F7F5] border-t border-[#E7E4E7] flex items-center justify-between text-xs text-[#77716E] shrink-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="flex items-center gap-1 font-semibold text-[#4B8097]">
              <span className="w-2 h-2 rounded-full bg-[#AED7E9]" /> Active Streak
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-semibold text-[#221D1D]">
              <Flame className="w-3 h-3 text-[#F7892A]" /> Today
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#77716E]">
              <span className="w-2 h-2 rounded-full bg-[#E7E4E7]" /> Planned Target
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-white border border-[#221D1D] text-[#221D1D] text-xs font-semibold hover:bg-[#F7F7F5] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

