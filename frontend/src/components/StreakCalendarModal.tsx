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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* ANIMATED FLAME HERO HEADER */}
        <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 p-6 text-white text-center shrink-0 overflow-hidden">
          {/* Ambient glow effects */}
          <div className="absolute -top-12 -left-12 w-36 h-36 bg-white/15 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-amber-300/25 rounded-full blur-xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Real-Date Live Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold border border-white/30 mb-3 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            <span>Synced Real Date: {realTodayFormatted}</span>
          </div>

          {/* Animated Flame Badge */}
          <div className="relative inline-flex items-center justify-center mb-2 block mx-auto">
            <div className="absolute inset-0 rounded-2xl bg-amber-300/40 animate-ping opacity-60" />
            <div className="relative w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/35">
              <Flame className="w-8 h-8 text-amber-200 animate-bounce" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            {streak} Day Study Streak!
          </h2>
          <p className="text-amber-100 text-xs font-medium mt-1 max-w-md mx-auto">
            Synchronized live with real calendar dates & active study milestones.
          </p>

          {/* Summary Pills */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/20">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15">
              <p className="text-base font-extrabold text-white">{streak} {streak === 1 ? "Day" : "Days"}</p>
              <p className="text-[10px] text-amber-200 font-bold uppercase tracking-wider">Current Streak</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15">
              <p className="text-base font-extrabold text-white">{Math.max(streak, 14)} Days</p>
              <p className="text-[10px] text-amber-200 font-bold uppercase tracking-wider">Best Record</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15">
              <p className="text-base font-extrabold text-white">{loggedToday ? "Complete ✓" : "In Progress"}</p>
              <p className="text-[10px] text-amber-200 font-bold uppercase tracking-wider">Today&apos;s Status</p>
            </div>
          </div>
        </div>

        {/* CALENDAR BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* MONTH & YEAR HEADER WITH REAL-TIME NAVIGATION */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center text-violet-700">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  {MONTH_NAMES[month]} {year}
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">Real-Time Calendar View</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={jumpToToday}
                className="px-2.5 py-1 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 text-[11px] font-bold transition-colors cursor-pointer mr-1 flex items-center gap-1"
                title="Jump to Today's Real Date"
              >
                <Target className="w-3 h-3 text-violet-600" />
                Today
              </button>
              <button
                type="button"
                onClick={prevMonth}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* COMPLETE CALENDAR MATRIX WITH REAL OVERFLOW DATES */}
          <div className="border border-slate-100 rounded-2xl p-3 bg-slate-50/50">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {WEEKDAYS.map((w, i) => (
                <span
                  key={i}
                  className="text-[11px] font-bold uppercase tracking-wider text-slate-400 py-1"
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
                        ? "ring-2 ring-violet-400 shadow-xs"
                        : ""
                    } ${
                      isPrevInStreak
                        ? "bg-amber-100 text-amber-900 font-bold"
                        : "bg-white text-slate-400 border border-slate-100"
                    }`}
                    title={`Previous month: ${prevDate.toLocaleDateString()}`}
                  >
                    <span>{prevDayNum}</span>
                    {isPrevInStreak && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-0.5" />
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
                        ? "ring-2 ring-violet-500 shadow-sm z-10 scale-[1.03]"
                        : "hover:bg-violet-50/80"
                    } ${
                      isToday
                        ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold shadow-md shadow-amber-200"
                        : isInStreak
                        ? "bg-amber-100/90 text-amber-900 border border-amber-300 font-bold"
                        : isFuture
                        ? "bg-white text-slate-400 border border-dashed border-slate-200"
                        : "bg-white text-slate-700 border border-slate-100"
                    }`}
                  >
                    <span>{dayNum}</span>
                    {isToday ? (
                      <Flame className="w-2.5 h-2.5 text-amber-200 animate-pulse mt-0.5" />
                    ) : isInStreak ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-0.5" />
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
                        isNextSelected ? "ring-2 ring-violet-400 shadow-xs" : ""
                      } bg-white text-slate-400 border border-slate-100`}
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
          <div className="p-4 rounded-2xl bg-violet-50/70 border border-violet-100 flex items-start gap-3.5 animate-in fade-in duration-150">
            <div className="w-11 h-11 rounded-xl bg-violet-600 text-white text-xs font-bold flex flex-col items-center justify-center shrink-0 shadow-sm">
              <span className="text-[9px] uppercase leading-none opacity-80">
                {MONTH_NAMES[selectedDate.getMonth()].slice(0, 3)}
              </span>
              <span className="text-base font-black leading-none mt-0.5">
                {selectedDate.getDate()}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    {selectedFormattedTitle}
                  </h4>
                  <p className="text-[11px] text-violet-700 font-medium">
                    {selectedLog.title}
                  </p>
                </div>

                {isSelectedToday ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center gap-1 shrink-0 shadow-xs">
                    <Flame className="w-3 h-3 text-amber-200 animate-pulse" />
                    Today • Active Session
                  </span>
                ) : isSelectedInStreak ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1 shrink-0 border border-amber-200">
                    <CheckCircle2 className="w-3 h-3 text-amber-600" />
                    Streak Verified
                  </span>
                ) : isSelectedFuture ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Upcoming Study Target
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold flex items-center gap-1 shrink-0">
                    <CalendarCheck className="w-3 h-3 text-slate-500" />
                    Past Study Day
                  </span>
                )}
              </div>

              {/* Topic & duration */}
              <div className="mt-2.5 space-y-1.5">
                <div className="flex items-center gap-2 text-[11px] text-slate-700">
                  <BookOpen className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                  <span className="truncate font-medium">{selectedLog.topic}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Target Session: {selectedLog.duration}</span>
                </div>
              </div>

              {/* Interactive checklist */}
              {selectedLog.items && selectedLog.items.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-violet-100/80 space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Study Checklist & Milestones
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
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/90 hover:bg-white border border-violet-100 text-left text-[11px] font-medium text-slate-700 transition-colors cursor-pointer group"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 shrink-0" />
                          )}
                          <span className={isChecked ? "line-through text-slate-400" : "text-slate-700"}>
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
                    className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Record Study Session for {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* DAILY MOTIVATION & REAL-TIME LOG BUTTON */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-900">
                  Real-Date Study Progress
                </p>
                <p className="text-[11px] text-amber-700">
                  Today is {realTodayFormatted} · Active Session
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleLogStudyForDate(currentRealTime)}
              disabled={loggedToday}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-sm flex items-center gap-1.5 ${
                loggedToday
                  ? "bg-emerald-600 text-white cursor-default"
                  : "bg-amber-600 hover:bg-amber-700 text-white hover:shadow-md hover:shadow-amber-200"
              }`}
            >
              {loggedToday ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Logged for Today ✓
                </>
              ) : (
                <>
                  <Flame className="w-3.5 h-3.5" />
                  Log Today&apos;s Study
                </>
              )}
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="flex items-center gap-1 font-semibold text-amber-700">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Active Streak
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-semibold text-orange-600">
              <Flame className="w-3 h-3 text-orange-500" /> Today
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-slate-300" /> Planned Target
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

