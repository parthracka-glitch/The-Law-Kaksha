"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Calendar,
  Sparkles,
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowRight,
  Flame,
  Award,
  ChevronRight,
  Bookmark,
  Share2,
  RotateCcw,
} from "lucide-react";

interface ExamTarget {
  id: string;
  name: string;
  level: string;
  targetDate: string;
  syllabusCoverage: number;
  totalHoursNeeded: number;
}

const EXAM_TARGETS: ExamTarget[] = [
  {
    id: "ca-found",
    name: "CA Foundation Business Laws",
    level: "ICAI Paper 2 • 7 Chapters",
    targetDate: "2026-12-15T09:00:00",
    syllabusCoverage: 100,
    totalHoursNeeded: 120,
  },
  {
    id: "cseet",
    name: "CSEET Business Law & Management",
    level: "ICSI • 8 Units",
    targetDate: "2026-11-08T10:00:00",
    syllabusCoverage: 100,
    totalHoursNeeded: 80,
  },
];

interface MCQScenario {
  id: string;
  subject: string;
  statutoryRef: string;
  question: string;
  options: { text: string; isCorrect: boolean; pct: number }[];
  explanationTitle: string;
  explanation: string;
  keyDistinction: string;
}

const MCQ_POOL: MCQScenario[] = [
  {
    id: "mcq-1",
    subject: "Sale of Goods Act, 1930",
    statutoryRef: "Section 16(1) • Caveat Emptor",
    question:
      "A buyer purchased a hot water bottle from a chemist. Upon first usage, it burst and scalded the buyer's wife. Buyer did not state any special purpose. Can the buyer claim damages under Section 16(1)?",
    options: [
      {
        text: "No, because the doctrine of Caveat Emptor strictly applies to all goods.",
        isCorrect: false,
        pct: 18,
      },
      {
        text: "Yes, implied condition of fitness applies by implication since the good has only one obvious purpose.",
        isCorrect: true,
        pct: 72,
      },
      {
        text: "No, because the chemist gave no express written warranty.",
        isCorrect: false,
        pct: 6,
      },
      {
        text: "Yes, but only under the law of torts, not under Sale of Goods Act.",
        isCorrect: false,
        pct: 4,
      },
    ],
    explanationTitle: "Rule in Priest v. Last (1903)",
    explanation:
      "Where goods are capable of only one normal use (like a hot water bottle), the purpose for which they are required is communicated by implication. Relying on seller's skill/judgment triggers Section 16(1) implied condition as to fitness.",
    keyDistinction:
      "ICAI Tip: Don't forget to quote Priest v. Last along with Section 16(1) to secure full 6/6 marks.",
  },
  {
    id: "mcq-2",
    subject: "Indian Partnership Act, 1932",
    statutoryRef: "Section 28 • Holding Out",
    question:
      "Rajesh retired from M/s Apex Traders without giving public notice. Creditor Amit lends ₹5,00,000 believing Rajesh is still a partner. Is Rajesh liable to Amit?",
    options: [
      {
        text: "No, retirement automatically ends all partner liabilities.",
        isCorrect: false,
        pct: 12,
      },
      {
        text: "Yes, doctrine of holding out makes him liable until public notice is published in the Official Gazette.",
        isCorrect: true,
        pct: 81,
      },
      {
        text: "Only if he signed the loan promissory note personally.",
        isCorrect: false,
        pct: 4,
      },
      {
        text: "Only to the extent of his remaining capital in the firm.",
        isCorrect: false,
        pct: 3,
      },
    ],
    explanationTitle: "Doctrine of Holding Out (§28)",
    explanation:
      "Under Section 28 & 32(3) of Indian Partnership Act, an outgoing partner continues to be liable to third parties for firm acts unless public notice of retirement is duly published.",
    keyDistinction:
      "Notice requirement does not apply to a dormant/sleeping partner not known to the third party.",
  },
  {
    id: "mcq-3",
    subject: "Companies Act, 2013",
    statutoryRef: "Section 8 • Non-Profit Entities",
    question:
      "Can a Section 8 Non-Profit Company pay dividends to its members from accumulated surplus reserves?",
    options: [
      {
        text: "Yes, up to 10% with prior Central Government approval.",
        isCorrect: false,
        pct: 14,
      },
      {
        text: "No, Section 8(1)(c) explicitly prohibits payment of any dividend to members.",
        isCorrect: true,
        pct: 79,
      },
      {
        text: "Yes, by passing a unanimous special resolution in AGM.",
        isCorrect: false,
        pct: 5,
      },
      {
        text: "Yes, upon conversion into a private limited company.",
        isCorrect: false,
        pct: 2,
      },
    ],
    explanationTitle: "Section 8(1)(c) Statutory Prohibition",
    explanation:
      "Section 8 companies must apply their profits in promoting their objects (commerce, art, science, sports, education, research, charity) and are strictly prohibited from paying dividends to members.",
    keyDistinction:
      "Violation of Section 8 terms can lead to license revocation and fine up to ₹1 Crore for the company.",
  },
];

export function ExamCountdownsAndQOTD() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const [examTargets, setExamTargets] = useState<ExamTarget[]>(EXAM_TARGETS);
  const [mcqList, setMcqList] = useState<MCQScenario[]>(MCQ_POOL);
  const [selectedExamId, setSelectedExamId] = useState<string>("ca-found");
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [bookmarkedList, setBookmarkedList] = useState<Record<string, boolean>>({});

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Fetch live exam countdowns and QOTD from MongoDB Atlas
  useEffect(() => {
    async function fetchLiveSiteData() {
      try {
        const res = await fetch(`${API_URL}/api/public/site-data`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success) {
          if (Array.isArray(data.examSettings) && data.examSettings.length > 0) {
            setExamTargets(data.examSettings);
            if (!data.examSettings.some((e: any) => e.id === selectedExamId)) {
              setSelectedExamId(data.examSettings[0].id);
            }
          }
          if (data.qotd && data.qotd.question) {
            const formattedLiveQotd: MCQScenario = {
              id: "live-qotd",
              subject: data.qotd.subject || "Daily Legal Drill",
              statutoryRef: data.qotd.statutoryRef || "High Yield Topic",
              question: data.qotd.question,
              options: Array.isArray(data.qotd.options)
                ? data.qotd.options.map((opt: any, idx: number) => ({
                    text: typeof opt === "string" ? opt : opt.text,
                    isCorrect: idx === (data.qotd.correctOption ?? 0) || Boolean(opt.isCorrect),
                    pct: typeof opt === "object" && opt.pct ? opt.pct : (idx === (data.qotd.correctOption ?? 0) ? 78 : 7),
                  }))
                : MCQ_POOL[0].options,
              explanationTitle: data.qotd.explanationTitle || "Concept Rationale",
              explanation: data.qotd.explanation || "Direct statutory interpretation.",
              keyDistinction: data.qotd.keyDistinction || "Admin Verified Practice Question.",
            };
            setMcqList([formattedLiveQotd, ...MCQ_POOL]);
          }
        }
      } catch (e) {
        // Fallback silently to pre-bundled local data
      }
    }
    fetchLiveSiteData();
  }, [API_URL]);

  const activeExam =
    examTargets.find((e) => e.id === selectedExamId) || examTargets[0] || EXAM_TARGETS[0];
  const activeMCQ = mcqList[activeQuestionIdx] || MCQ_POOL[0];

  // Dynamic Countdown Timer Calculation
  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(activeExam.targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [activeExam]);

  const handleToggleBookmark = (id: string) => {
    setBookmarkedList((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setActiveQuestionIdx((prev) => (prev + 1) % mcqList.length);
  };

  const handleResetQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
  };

  return (
    <section
      id="countdown-qotd"
      className="py-12 md:py-16 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] border border-black/[0.06] text-[#1D1D1F] text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>Exam Timelines &amp; Daily Practice</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight">
            Stay on Track for Your Upcoming Attempt
          </h2>
          <p className="text-xs sm:text-sm text-[#86868B]">
            Check your remaining preparation days and practice law questions daily.
          </p>
        </div>

        {/* 2-Column Responsive Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ======================================================== */}
          {/* 1. LEFT CARD: EXAM COUNTDOWN & TIMELINE TRACKER (5 Cols) */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 rounded-3xl bg-white border border-black/[0.06] p-5 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5 sm:space-y-6">
            
            {/* Header & Course Switcher */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">
                  Target Exam
                </span>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Live Countdown
                </span>
              </div>

              {/* Course Selection Tabs */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[#F5F5F7] border border-black/[0.04]">
                {examTargets.map((exam) => (
                  <button
                    key={exam.id}
                    onClick={() => setSelectedExamId(exam.id)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer text-center truncate min-h-[44px] flex items-center justify-center ${
                      selectedExamId === exam.id
                        ? "bg-white text-[#1D1D1F] shadow-xs font-semibold"
                        : "text-[#6E6E73] hover:text-[#1D1D1F]"
                    }`}
                  >
                    {exam.name.includes("CA") ? "CA Foundation" : "CSEET Law"}
                  </button>
                ))}
              </div>
            </div>

            {/* Exam Title & Details */}
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-semibold text-[#1D1D1F] tracking-tight">
                {activeExam.name}
              </h3>
              <p className="text-xs text-[#86868B]">{activeExam.level}</p>
            </div>

            {/* 4-Digit Timer Block matching Apple Aesthetic */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-[#F5F5F7] border border-black/[0.04]">
                <div className="text-xl sm:text-3xl font-semibold text-[#1D1D1F] font-mono tracking-tight">
                  {timeLeft.days}
                </div>
                <div className="text-[10px] uppercase font-semibold text-[#86868B] tracking-wider mt-0.5">
                  Days
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-2xl bg-[#F5F5F7] border border-black/[0.04]">
                <div className="text-xl sm:text-3xl font-semibold text-[#1D1D1F] font-mono tracking-tight">
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <div className="text-[10px] uppercase font-semibold text-[#86868B] tracking-wider mt-0.5">
                  Hours
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-2xl bg-[#F5F5F7] border border-black/[0.04]">
                <div className="text-xl sm:text-3xl font-semibold text-[#1D1D1F] font-mono tracking-tight">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <div className="text-[10px] uppercase font-semibold text-[#86868B] tracking-wider mt-0.5">
                  Mins
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-2xl bg-[#F5F5F7] border border-black/[0.04]">
                <div className="text-xl sm:text-3xl font-semibold text-[#0071E3] font-mono tracking-tight">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </div>
                <div className="text-[10px] uppercase font-semibold text-[#86868B] tracking-wider mt-0.5">
                  Secs
                </div>
              </div>
            </div>

            {/* Preparation Roadmap Progress */}
            <div className="space-y-3 pt-2 border-t border-black/[0.05]">
              <div className="flex items-center justify-between text-xs text-[#6E6E73]">
                <span>Syllabus Coverage:</span>
                <span className="font-semibold text-[#1D1D1F]">
                  100% Comprehensive
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#F5F5F7] overflow-hidden">
                <div className="h-full bg-[#0071E3] rounded-full w-full" />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Link
                  href="/student"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-[#1D1D1F] hover:bg-[#2D2D2F] text-white text-xs font-medium transition-all shadow-xs min-h-[44px]"
                >
                  <span>Open Student Learning Desk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* 2. RIGHT CARD: DAILY HIGH-YIELD MCQ CHALLENGE (7 Cols)   */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 rounded-3xl bg-white border border-black/[0.06] p-5 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4 sm:space-y-5">
            
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0071E3] animate-pulse" />
                <span className="text-xs font-semibold text-[#1D1D1F]">
                  Daily High-Yield Case Challenge
                </span>
              </div>

              {/* Bookmark for LDR Button */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleBookmark(activeMCQ.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer min-h-[36px] ${
                    bookmarkedList[activeMCQ.id]
                      ? "bg-[#0071E3]/[0.08] text-[#0071E3] border border-[#0071E3]/20"
                      : "bg-black/[0.04] text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.08] border border-black/[0.06]"
                  }`}
                  title="Bookmark for Last Day Revision (LDR)"
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 ${
                      bookmarkedList[activeMCQ.id] ? "fill-current text-[#0071E3]" : "text-[#86868B]"
                    }`}
                  />
                  <span>
                    {bookmarkedList[activeMCQ.id] ? "Bookmarked LDR" : "Bookmark LDR"}
                  </span>
                </button>
              </div>
            </div>

            {/* Subject Pill & Question Index Switcher */}
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center text-[11px] font-medium text-[#0071E3] bg-[#0071E3]/[0.08] border border-[#0071E3]/15 px-2.5 py-0.5 rounded-full">
                {activeMCQ.subject}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-[#86868B]">
                <span>
                  Q{activeQuestionIdx + 1} of {MCQ_POOL.length}
                </span>
                <button
                  onClick={handleNextQuestion}
                  className="text-[#6E6E73] hover:text-[#0071E3] p-1 rounded-full hover:bg-black/[0.04] transition-colors cursor-pointer"
                  title="Next Case Scenario"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Question Text */}
            <h4 className="text-xs sm:text-sm font-medium text-[#1D1D1F] leading-relaxed">
              {activeMCQ.question}
            </h4>

            {/* MCQ Options with Percentage Bars */}
            <div className="space-y-2">
              {activeMCQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const letter = String.fromCharCode(65 + idx);

                let cardClasses =
                  "relative overflow-hidden w-full text-left p-3 sm:p-3 rounded-2xl border text-xs transition-all duration-200 cursor-pointer min-h-[44px] ";

                if (!isAnswered) {
                  cardClasses +=
                    "bg-white border-black/[0.08] text-[#1D1D1F] hover:border-black/[0.2] hover:bg-[#FBFBFD]";
                } else {
                  if (opt.isCorrect) {
                    cardClasses +=
                      "bg-emerald-50/80 border-emerald-500/40 text-emerald-950 font-medium";
                  } else if (isSelected && !opt.isCorrect) {
                    cardClasses +=
                      "bg-rose-50/80 border-rose-500/40 text-rose-950 font-medium";
                  } else {
                    cardClasses +=
                      "bg-[#F5F5F7] border-black/[0.04] text-[#86868B] opacity-75";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => {
                      setSelectedOption(idx);
                      setIsAnswered(true);
                    }}
                    className={cardClasses}
                  >
                    {/* Background Poll Bar when answered */}
                    {isAnswered && (
                      <div
                        className={`absolute top-0 bottom-0 left-0 transition-all duration-700 opacity-15 ${
                          opt.isCorrect
                            ? "bg-emerald-500"
                            : isSelected
                            ? "bg-rose-500"
                            : "bg-slate-400"
                        }`}
                        style={{ width: `${opt.pct}%` }}
                      />
                    )}

                    <div className="relative z-10 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 transition-colors ${
                            isAnswered
                              ? opt.isCorrect
                                ? "bg-emerald-600 text-white"
                                : isSelected
                                ? "bg-rose-600 text-white"
                                : "bg-black/[0.08] text-[#6E6E73]"
                              : "bg-black/[0.04] text-[#424245] border border-black/[0.08]"
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="leading-snug">{opt.text}</span>
                      </div>

                      {/* Right feedback icon & percentage */}
                      {isAnswered && (
                        <div className="flex items-center gap-1.5 shrink-0 pl-2">
                          <span className="text-[11px] font-mono font-medium">
                            {opt.pct}%
                          </span>
                          {opt.isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : isSelected ? (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Statutory Explanation Card */}
            {isAnswered && (
              <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.06] space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#0071E3]" />
                    <span className="text-xs font-semibold text-[#1D1D1F]">
                      {activeMCQ.explanationTitle}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#0071E3] bg-[#0071E3]/[0.08] px-2 py-0.5 rounded-full border border-[#0071E3]/15 font-medium">
                    {activeMCQ.statutoryRef}
                  </span>
                </div>

                <p className="text-xs text-[#424245] leading-relaxed">
                  {activeMCQ.explanation}
                </p>

                <div className="pt-1.5 text-[11px] text-[#6E6E73] border-t border-black/[0.05] flex items-start gap-1.5">
                  <span className="font-semibold text-[#1D1D1F] shrink-0">Examiner Rule:</span>
                  <span>{activeMCQ.keyDistinction}</span>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-black/[0.05]">
                  <button
                    onClick={handleResetQuestion}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer min-h-[44px] px-2"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Try Again</span>
                  </button>

                  <button
                    onClick={handleNextQuestion}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0071E3] hover:text-[#0077ED] transition-colors cursor-pointer min-h-[44px] px-2"
                  >
                    <span>Next Case Scenario</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
