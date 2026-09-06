"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  Bookmark,
  Bell,
  Check,
  ChevronRight,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Briefcase,
  Building2,
} from "lucide-react";

interface ExamTimer {
  id: string;
  name: string;
  tagline: string;
  targetDate: string;
  seats: string;
  status: string;
  colorTag: string;
}

const EXAMS: ExamTimer[] = [
  {
    id: "ca-inter-sept",
    name: "CA Inter Paper 2 (Law) - Sept 2026",
    tagline: "Group 1 Flagship Paper",
    targetDate: "2026-09-16T14:00:00",
    seats: "ICAI Admit Cards Active",
    status: "RTP & MTP Solved Capsule Live",
    colorTag: "CA Intermediate",
  },
  {
    id: "ca-final-nov",
    name: "CA Final Corp & Economic Law - Nov 2026",
    tagline: "Group 1 / Corporate Multi-Disciplinary",
    targetDate: "2026-11-05T14:00:00",
    seats: "National ICAI Batch Aligned",
    status: "IBC & SEBI Master Bank Ready",
    colorTag: "CA Final",
  },
  {
    id: "ca-foundation-dec",
    name: "CA Foundation Business Law - Dec 2026",
    tagline: "Paper 2 Descriptive 100M",
    targetDate: "2026-12-18T14:00:00",
    seats: "Foundation Dec'26 Batch",
    status: "Contract Act Caselet Drills",
    colorTag: "CA Foundation",
  },
  {
    id: "ca-inter-jan",
    name: "CA Inter Paper 2 (Law) - Jan 2027",
    tagline: "Winter 2027 Attempt",
    targetDate: "2027-01-14T14:00:00",
    seats: "ICAI New Scheme Synced",
    status: "2026-2027 Amendments Synced",
    colorTag: "CA Intermediate",
  },
];

interface MCQItem {
  id: string;
  subject: string;
  statutoryRef: string;
  question: string;
  options: { text: string; pct: number; isCorrect?: boolean }[];
  explanationTitle: string;
  explanation: string;
  keyDistinction: string;
}

const MCQ_POOL: MCQItem[] = [
  {
    id: "ca-csr-135",
    subject: "Companies Act, 2013 • Corporate Social Responsibility",
    statutoryRef: "Section 135(1), Companies Act 2013",
    question:
      "A private limited company has a Net Profit of ₹6.2 Crores, Net Worth of ₹350 Crores, and Turnover of ₹480 Crores during FY 2025-26. Under Section 135 of the Companies Act 2013, which condition makes CSR Committee constitution mandatory?",
    options: [
      { text: "Company is exempt from CSR as turnover is below ₹500 Crores.", pct: 14 },
      { text: "Mandatory because Net Profit exceeds ₹5 Crores during the immediately preceding financial year.", pct: 78, isCorrect: true },
      { text: "Mandatory only if the proposed CSR expenditure exceeds ₹50 Lakhs in that year.", pct: 5 },
      { text: "CSR provisions apply exclusively to Listed Public Companies.", pct: 3 },
    ],
    explanationTitle: "ICAI Case Scenario Rule: Section 135(1) Thresholds",
    explanation:
      "Under Section 135(1) of the Companies Act 2013, every company (including private companies) fulfilling any ONE of three criteria during the immediately preceding financial year must constitute a CSR Committee: (i) Net Worth >= ₹500 Cr, OR (ii) Turnover >= ₹1,000 Cr, OR (iii) Net Profit >= ₹5 Cr.",
    keyDistinction:
      "Threshold applies on an 'any one condition' basis for the immediately preceding FY, not cumulatively across all parameters.",
  },
  {
    id: "ca-ibc-7",
    subject: "Insolvency & Bankruptcy Code, 2016 (IBC)",
    statutoryRef: "Section 7 & Section 4 Proviso, IBC 2016",
    question:
      "Under Section 7 of the Insolvency & Bankruptcy Code (IBC) 2016, what is the mandatory threshold default amount required for a Financial Creditor to initiate Corporate Insolvency Resolution Process (CIRP)?",
    options: [
      { text: "₹1 Lakh as originally enacted under Section 4 of the Code.", pct: 9 },
      { text: "₹1 Crore minimum default amount as notified by the Central Government.", pct: 84, isCorrect: true },
      { text: "₹50 Lakhs for MSME corporate debtors.", pct: 4 },
      { text: "10% of the total outstanding debt owed to the financial creditor.", pct: 3 },
    ],
    explanationTitle: "Statutory Default Threshold under Section 4",
    explanation:
      "The Central Government, by notification under Section 4 proviso of IBC 2016, enhanced the minimum default threshold for initiating CIRP under Section 7 or Section 9 from ₹1 Lakh to ₹1 Crore to prevent frivolous insolvency proceedings against viable corporate debtors.",
    keyDistinction:
      "Section 7 applies to Financial Creditors; Section 9 applies to Operational Creditors. The ₹1 Crore threshold applies equally to both.",
  },
  {
    id: "ca-contract-25",
    subject: "Indian Contract Act, 1872 • General Principles",
    statutoryRef: "Section 25(3), Indian Contract Act 1872",
    question:
      "Under Section 25(3) of the Indian Contract Act 1872, an agreement made without consideration is valid and enforceable if it is a promise to pay a time-barred debt, provided which statutory requirement is satisfied?",
    options: [
      { text: "The promise is made orally in the presence of two independent witnesses.", pct: 6 },
      { text: "The promise is made in writing and signed by the debtor or their authorized agent.", pct: 88, isCorrect: true },
      { text: "The creditor obtains prior validation from the National Company Law Tribunal (NCLT).", pct: 4 },
      { text: "The debt must not be older than 5 years from date of limitation expiry.", pct: 2 },
    ],
    explanationTitle: "Exception to 'Ex Nudo Pacto Non Oritur Actio'",
    explanation:
      "Under Section 25(3) of the Indian Contract Act 1872, an agreement to pay a debt barred by limitation is enforceable without fresh consideration only if it is expressed in writing and signed by the person to be charged therewith or their authorized agent.",
    keyDistinction:
      "Oral promises to pay a time-barred debt remain completely void for want of consideration.",
  },
];

export function ExamCountdownsAndQOTD() {
  const [selectedExamId, setSelectedExamId] = useState<string>("ca-inter-sept");
  const [alertSet, setAlertSet] = useState<{ [key: string]: boolean }>({});
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [bookmarkedList, setBookmarkedList] = useState<{ [key: string]: boolean }>({});

  const activeExam = EXAMS.find((e) => e.id === selectedExamId) || EXAMS[0];
  const activeMCQ = MCQ_POOL[activeQuestionIdx];

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(activeExam.targetDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [activeExam.targetDate]);

  const toggleAlert = (examId: string) => {
    setAlertSet((prev) => ({
      ...prev,
      [examId]: !prev[examId],
    }));
  };

  const toggleBookmark = (qId: string) => {
    setBookmarkedList((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setActiveQuestionIdx((prev) => (prev + 1) % MCQ_POOL.length);
  };

  const handleResetQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
  };

  return (
    <section id="countdown-qotd" className="py-7 sm:py-9 bg-gradient-to-b from-[#F0F9FF]/90 via-[#F8FAFC] to-[#F0F9FF]/90 border-y border-sky-200/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          
          {/* ======================================================== */}
          {/* LEFT: ICAI CA EXAM COUNTDOWNS & RADAR                   */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(2,132,199,0.06)] flex flex-col justify-between space-y-4">
            
            {/* Header: Title + Alert Button */}
            <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0284C7]"></span>
                </span>
                <h3 className="text-xs sm:text-sm font-serif font-bold uppercase tracking-wider text-slate-900">
                  ICAI CA Exam Timers 2026-27
                </h3>
              </div>

              <button
                onClick={() => toggleAlert(selectedExamId)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  alertSet[selectedExamId]
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-sky-50 text-[#0284C7] hover:bg-sky-100/80 border border-sky-200/80"
                }`}
                title="Receive ICAI calendar alerts"
              >
                {alertSet[selectedExamId] ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Alert Set</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Alert Me</span>
                  </>
                )}
              </button>
            </div>

            {/* 2x2 Exam Selector Grid */}
            <div className="grid grid-cols-2 gap-2">
              {EXAMS.map((exam) => {
                const isSelected = exam.id === selectedExamId;
                return (
                  <button
                    key={exam.id}
                    onClick={() => setSelectedExamId(exam.id)}
                    className={`text-left p-2.5 sm:p-3 rounded-xl border transition-all duration-200 relative ${
                      isSelected
                        ? "bg-sky-50/60 border-[#0284C7] shadow-xs ring-1 ring-[#0284C7]/20"
                        : "bg-white border-slate-200/90 text-slate-600 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <p
                        className={`text-xs font-bold leading-snug line-clamp-1 ${
                          isSelected ? "text-slate-900" : "text-slate-700"
                        }`}
                      >
                        {exam.name}
                      </p>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] shrink-0 mt-1"></span>
                      )}
                    </div>
                    <p
                      className={`text-[11px] mt-0.5 ${
                        isSelected ? "text-[#0284C7] font-semibold" : "text-slate-500"
                      }`}
                    >
                      {exam.tagline}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Countdown Display Card */}
            <div className="rounded-xl bg-slate-50/80 border border-slate-200/80 p-3.5 sm:p-4 text-center space-y-3">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600">
                <Clock className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>
                  Time Remaining for{" "}
                  <strong className="text-slate-900 font-semibold">{activeExam.name}</strong>
                </span>
              </div>

              {/* 4 Digit Boxes */}
              <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                <div className="bg-white rounded-xl border border-slate-200/80 py-2 px-1 shadow-xs">
                  <span className="block text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                    {String(timeLeft.days).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5 block">
                    Days
                  </span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200/80 py-2 px-1 shadow-xs">
                  <span className="block text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5 block">
                    Hours
                  </span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200/80 py-2 px-1 shadow-xs">
                  <span className="block text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5 block">
                    Mins
                  </span>
                </div>

                <div className="bg-white rounded-xl border border-sky-200/90 py-2 px-1 shadow-xs">
                  <span className="block text-2xl sm:text-3xl font-black text-[#0284C7] font-mono tracking-tight">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] mt-0.5 block">
                    Secs
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Status Footer */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
              <span className="font-medium text-slate-700">{activeExam.seats}</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284C7]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0284C7]"></span>
                {activeExam.status}
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT: DAILY ICAI CASE SCENARIO MCQ CHALLENGE           */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(2,132,199,0.06)] space-y-3.5">
            
            {/* Header: Title + Subject Tag + Bookmark Button */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0284C7]" />
                <h3 className="text-xs sm:text-sm font-serif font-bold uppercase tracking-wider text-slate-900">
                  Daily CA Case-Scenario MCQ
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleBookmark(activeMCQ.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    bookmarkedList[activeMCQ.id]
                      ? "bg-sky-50 text-[#0284C7] border border-sky-200"
                      : "bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                  }`}
                  title="Bookmark for Last Day Revision (LDR)"
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 ${
                      bookmarkedList[activeMCQ.id] ? "fill-current text-[#0284C7]" : "text-slate-400"
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
              <span className="inline-flex items-center text-[11px] font-semibold text-[#0284C7] bg-sky-50 border border-sky-100 px-2.5 py-0.5 rounded-md">
                {activeMCQ.subject}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>
                  Q{activeQuestionIdx + 1} of {MCQ_POOL.length}
                </span>
                <button
                  onClick={handleNextQuestion}
                  className="text-slate-600 hover:text-[#0284C7] p-1 rounded hover:bg-slate-100 transition-colors"
                  title="Next CA Scenario"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Question Text */}
            <h4 className="text-xs sm:text-sm font-serif font-medium text-slate-900 leading-relaxed">
              {activeMCQ.question}
            </h4>

            {/* MCQ Options with Percentage Bars */}
            <div className="space-y-2">
              {activeMCQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const letter = String.fromCharCode(65 + idx);

                let cardClasses =
                  "relative overflow-hidden w-full text-left p-2.5 sm:p-3 rounded-xl border text-xs transition-all duration-200 cursor-pointer ";

                if (!isAnswered) {
                  cardClasses +=
                    "bg-white border-slate-200/90 text-slate-800 hover:border-sky-300 hover:bg-sky-50/30";
                } else {
                  if (opt.isCorrect) {
                    cardClasses +=
                      "bg-emerald-50/80 border-emerald-400 text-emerald-950 font-semibold";
                  } else if (isSelected && !opt.isCorrect) {
                    cardClasses +=
                      "bg-rose-50/80 border-rose-400 text-rose-950 font-semibold";
                  } else {
                    cardClasses +=
                      "bg-slate-50/60 border-slate-200 text-slate-500 opacity-80";
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
                        className={`absolute top-0 bottom-0 left-0 transition-all duration-700 opacity-20 ${
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
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shrink-0 transition-colors ${
                            isAnswered
                              ? opt.isCorrect
                                ? "bg-emerald-600 text-white"
                                : isSelected
                                ? "bg-rose-600 text-white"
                                : "bg-slate-200 text-slate-600"
                              : "bg-slate-100 text-slate-700 border border-slate-300"
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="leading-snug">{opt.text}</span>
                      </div>

                      {/* Right feedback icon & percentage */}
                      {isAnswered && (
                        <div className="flex items-center gap-1.5 shrink-0 pl-2">
                          <span className="text-[11px] font-mono font-semibold">
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
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span className="text-xs font-bold font-serif text-slate-900">
                      {activeMCQ.explanationTitle}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded border border-sky-100 font-semibold">
                    {activeMCQ.statutoryRef}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeMCQ.explanation}
                </p>

                <div className="pt-1 text-[11px] text-slate-600 border-t border-slate-200/70 flex items-start gap-1.5">
                  <span className="font-semibold text-slate-800 shrink-0">ICAI Examiner Rule:</span>
                  <span>{activeMCQ.keyDistinction}</span>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                  <button
                    onClick={handleResetQuestion}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Try Again</span>
                  </button>

                  <button
                    onClick={handleNextQuestion}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0284C7] hover:text-sky-700 transition-colors"
                  >
                    <span>Next CA Case Scenario</span>
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
