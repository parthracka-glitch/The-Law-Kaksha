"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Scale,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Maximize2,
  X,
} from "lucide-react";
import type { WeeklyCaseHomeItem } from "./StudentDashboardHome";

interface StudentCaseStudyHeroCarouselProps {
  studentName?: string;
  cases?: WeeklyCaseHomeItem[];
  hasAccess?: boolean;
  onContinueLearning?: () => void;
  onBuyCourse?: (courseType: string) => void;
  awardXp?: (amount: number, reason: string) => void;
}

export function StudentCaseStudyHeroCarousel({
  studentName = "Student",
  cases = [],
  hasAccess = true,
  onContinueLearning,
  onBuyCourse,
  awardXp,
}: StudentCaseStudyHeroCarouselProps) {
  // Ensure we have at least 1 case to display
  const activeCases = useMemo(() => {
    if (Array.isArray(cases) && cases.length > 0) {
      return cases.slice(0, 5); // support up to 5 cases
    }
    return [
      {
        id: "case-demo-1",
        day: "Monster Monday",
        badge: "High Difficulty",
        subject: "Indian Contract Act, 1872",
        title: "Performance and Discharge of Contract",
        scenario:
          "Apex Manufacturing Ltd. entered into a contract with Orion Infrastructure Ltd. on 1st January 2026 for the supply and installation of 500 industrial generators by 31st March 2026. Orion agreed to pay 30% advance within 15 days, which they failed to pay. Can Apex refuse performance and claim damages?",
        modelAnswer:
          "Question 1 – Rights and obligations of Apex and Orion:\n(a) Reciprocal Promises under Section 51 & 54 of ICA 1872: When a contract consists of reciprocal promises, and the order in which they are to be performed is fixed or implied, the party who fails to perform the prior promise cannot claim performance from the other party.\n(b) Since Orion failed to pay the agreed 30% advance within 15 days, Apex is legally justified in refusing delivery and installation.\n(c) Apex can rescind the contract and claim damages for breach under Section 73.",
        precedent: "State of West Bengal v. B.K. Mondal & Sons (AIR 1962 SC 779)",
        marks: "6/6 Marks",
      },
      {
        id: "case-demo-2",
        day: "Tricky Tuesday",
        badge: "ICAI Exam Favorite",
        subject: "The Companies Act, 2013",
        title: "Lifting the Corporate Veil & Fraudulent Trading",
        scenario:
          "D formed a private company in which he held 99.9% of shares. He transferred his loss-making personal timber business to the company at an inflated valuation and insured the company's timber inventory under his personal name rather than the company name. A fire destroyed the timber. Can D claim the insurance indemnity?",
        modelAnswer:
          "1. Separate Legal Entity Doctrine: Under Salomon v. Salomon & Co. Ltd. [1897] AC 22, a company is a separate statutory person distinct from its members.\n2. Insurable Interest Principle: Under Macaura v. Northern Assurance Co. Ltd. [1925] AC 619, a shareholder—even if holding virtually all shares—has no insurable interest in the assets of the company.\n3. Conclusion: The insurance policy was held in D's personal name, but the timber belonged to the company. The insurer is not liable to indemnify D.",
        precedent: "Macaura v. Northern Assurance Co. Ltd. [1925] AC 619",
        marks: "6/6 Marks",
      },
      {
        id: "case-demo-3",
        day: "Wildcard Wednesday",
        badge: "Medium Difficulty",
        subject: "The Sale of Goods Act, 1930",
        title: "Implied Condition as to Quality & Fitness (Caveat Emptor)",
        scenario:
          "R bought a hot water bottle from a chemist, asking for a bottle that could stand boiling water. The chemist sold an American vulcanized rubber bottle without warning. On the fifth day of use, the bottle burst while being used by R's wife and scalded her. Can R recover damages?",
        modelAnswer:
          "1. Statutory Principle: Section 16(1) of Sale of Goods Act 1930 establishes an exception to Caveat Emptor when the buyer expressly informs the seller of the particular purpose and relies on the seller's skill/judgment.\n2. Application: R expressly informed the chemist of the purpose (hot water) and relied on his skill. The bottle was unfit for ordinary use.\n3. Landmark Authority: Priest v. Last [1903] 2 KB 148 held the chemist liable for breach of implied condition of fitness.\n4. Conclusion: R is entitled to recover medical expenses and consequential damages.",
        precedent: "Priest v. Last [1903] 2 KB 148",
        marks: "6/6 Marks",
      },
    ];
  }, [cases]);

  // Active slide index
  const [currentIndex, setCurrentIndex] = useState(0);
  // Track open answers per case ID (collapsed by default to prevent long dashboard scrolling)
  const [openAnswers, setOpenAnswers] = useState<Record<string, boolean>>({});
  // Track practiced cases
  const [practicedCases, setPracticedCases] = useState<string[]>([]);
  // Full-screen solution pop-up modal state
  const [solutionModalOpen, setSolutionModalOpen] = useState(false);

  // Clean greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const displayName = useMemo(() => {
    if (!studentName || studentName.toLowerCase() === "user") return "Student";
    const cleaned = studentName.replace(/^administrator\s+/i, "").trim();
    return cleaned.split(" ")[0] || "Student";
  }, [studentName]);

  const totalCases = activeCases.length;
  const currentCase = activeCases[currentIndex] || activeCases[0];
  const caseId = currentCase.id || `case-${currentIndex}`;
  const isAnswerOpen = Boolean(openAnswers[caseId]); // Collapsed by default to keep dashboard neat
  const isPracticed = practicedCases.includes(caseId);

  // Navigation handlers (Manual forward / back)
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalCases);
  }, [totalCases]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalCases) % totalCases);
  }, [totalCases]);

  const handleGoTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return (
    <div className="space-y-2">
      {/* 1. Compact Top Greeting & Quick Continue Learning Link */}
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <h2 className="text-sm sm:text-base font-extrabold text-[#111827] tracking-tight truncate">
            {greeting}, {displayName}!
          </h2>
          <span className="text-sm select-none" role="img" aria-label="sun">
            ☀️
          </span>
          <span className="text-[11px] text-[#64748B] hidden md:inline truncate">
            • 3 Weekly Solved Case Studies
          </span>
        </div>

        {onContinueLearning && (
          <button
            type="button"
            onClick={onContinueLearning}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#3558F0] hover:bg-[#2546D8] active:scale-95 text-white text-[11px] font-semibold shadow-2xs transition-all cursor-pointer shrink-0"
          >
            <span>Continue</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 2. Main Ultra-Compact Case Study Hero Card (Image 1 Design, Max ~200px Height) */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl border-2 border-[#BFDBFE] p-3 sm:p-4 md:p-4.5 shadow-[0_4px_20px_rgba(59,130,246,0.06)] flex flex-col gap-2.5 transition-all duration-200 overflow-hidden">
        {/* Row 1: Unified Badges Bar (Case #, Day, Difficulty, Marks) */}
        <div className="flex items-center justify-between gap-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
              <span role="img" aria-label="star" className="text-amber-500">
                ⭐
              </span>
              <span>CASE #{currentIndex + 1}</span>
            </span>

            <span className="text-xs sm:text-sm font-black text-[#005A9C] uppercase tracking-wide flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#E11D48]" />
              <span>{currentCase.day || `Case #${currentIndex + 1}`}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]">
              {currentCase.badge || "High Difficulty"}
            </span>
            <span className="text-[11px] font-mono font-semibold text-[#64748B]">
              {currentCase.marks || "6/6 Marks"}
            </span>
          </div>
        </div>

        {/* Row 2: Statutory Eyebrow & Title */}
        <div className="space-y-0.5">
          <span className="text-[11px] sm:text-xs font-semibold text-[#64748B] block truncate">
            {currentCase.subject || "Indian Contract Act, 1872"}
          </span>
          <h3 className="text-sm sm:text-base font-extrabold text-[#0F172A] leading-snug truncate">
            {currentCase.title}
          </h3>
        </div>

        {/* Row 3: Compact Scenario Preview Box (Clickable, Clamped to 2 lines) */}
        <div
          onClick={() => setSolutionModalOpen(true)}
          className="p-2 sm:p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-2xs hover:bg-[#F1F5F9] transition-colors cursor-pointer group"
          title="Click to view full factual scenario and 4-step answer"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs sm:text-[12.5px] text-[#334155] italic leading-relaxed line-clamp-2 break-words [overflow-wrap:anywhere]">
              &ldquo;{currentCase.scenario}&rdquo;
            </p>
            <span className="text-[10px] font-bold text-[#005A9C] shrink-0 group-hover:underline flex items-center gap-0.5 pt-0.5">
              <span>Read</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>

        {/* Row 4: Consolidated Bottom Controls (Prev/Next on left, Solution + Practice on right) */}
        <div className="pt-2 border-t border-slate-100 flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2">
          {/* Left Navigation: Prev / Next buttons */}
          <div className="flex items-center justify-between xs:justify-start gap-1.5 w-full xs:w-auto">
            {totalCases > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-0.5 shadow-2xs transition-all cursor-pointer active:scale-95 touch-manipulation min-h-[34px]"
                  aria-label="Previous Case"
                  title="Previous Case"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                <span className="text-[11px] font-semibold text-slate-500 px-1.5 shrink-0">
                  {currentIndex + 1} of {totalCases}
                </span>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-2.5 py-1.5 rounded-lg border border-[#005A9C] bg-[#EBF5FF] hover:bg-[#005A9C] text-[#005A9C] hover:text-white text-xs font-bold inline-flex items-center gap-0.5 shadow-2xs transition-all cursor-pointer active:scale-95 touch-manipulation min-h-[34px]"
                  aria-label="Next Case"
                  title="Next Case"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Right Actions: 4-Step Solution Popup & Practice (+30 XP) */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full xs:w-auto justify-end">
            {hasAccess ? (
              <>
                {/* 4-Step Model Answer Trigger */}
                <button
                  type="button"
                  onClick={() => setSolutionModalOpen(true)}
                  className="flex-1 xs:flex-initial px-3 py-1.5 rounded-xl border border-emerald-300 bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#065F46] text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs touch-manipulation min-h-[34px]"
                >
                  <Scale className="w-3.5 h-3.5 text-emerald-700" />
                  <span>4-Step Solution</span>
                </button>

                {/* Practice Button */}
                <button
                  type="button"
                  disabled={isPracticed}
                  onClick={() => {
                    if (!isPracticed) {
                      awardXp?.(30, `Practiced Weekly Case: ${currentCase.title}`);
                      setPracticedCases((prev) => [...prev, caseId]);
                    }
                  }}
                  className={`flex-1 xs:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 touch-manipulation min-h-[34px] ${
                    isPracticed
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default"
                      : "bg-[#005A9C] hover:bg-[#004F8A] text-white"
                  }`}
                >
                  {isPracticed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Practiced</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                      <span>Practice (+30 XP)</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => onBuyCourse?.("ca")}
                className="w-full xs:w-auto px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] hover:opacity-95 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 touch-manipulation min-h-[34px]"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock Solution Pass</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. FULL 4-STEP SOLUTION POP-UP READER DIALOG (PREVENTS LONG PAGE SCROLL)   */}
      {/* ========================================================================= */}
      {solutionModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSolutionModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-4 xs:px-5 py-3.5 bg-gradient-to-r from-[#0F2557] to-[#1E3A8A] text-white flex items-center justify-between gap-3 shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950">
                    Case #{currentIndex + 1}
                  </span>
                  <span className="text-xs font-semibold text-sky-200 truncate">
                    {currentCase.subject}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white truncate mt-1">
                  {currentCase.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSolutionModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="p-4 xs:p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed [scrollbar-width:thin]">
              {/* Factual Scenario */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-[#005A9C]" />
                  <span>Case Scenario</span>
                </span>
                <p className="italic text-[#334155] leading-relaxed break-words [overflow-wrap:anywhere]">
                  &ldquo;{currentCase.scenario}&rdquo;
                </p>
              </div>

              {/* Model 4-Step Solution */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#F0FDF4] to-[#ECFDF5] border border-[#BBF7D0] text-[#14532D] space-y-3">
                <div className="flex items-center justify-between border-b border-[#BBF7D0] pb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#14532D] flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-[#15803D]" />
                    <span>Model Answer (4-Step Statutory Structure)</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-[#15803D]">
                    {currentCase.marks || "6/6 Marks"}
                  </span>
                </div>

                <p className="whitespace-pre-line leading-relaxed text-[#14532D] font-normal break-words [overflow-wrap:anywhere]">
                  {currentCase.modelAnswer}
                </p>

                {currentCase.precedent && (
                  <div className="pt-2.5 border-t border-[#BBF7D0] flex flex-col xs:flex-row xs:items-start gap-1 xs:gap-2 text-xs font-medium text-[#166534] bg-white/80 p-3 rounded-xl border border-[#86EFAC]/50">
                    <span className="font-bold shrink-0 text-[#14532D]">⚖️ Landmark Precedent:</span>
                    <span className="italic break-words [overflow-wrap:anywhere]">{currentCase.precedent}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 xs:px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] text-slate-500 font-medium">
                Case {currentIndex + 1} of {totalCases}
              </span>
              <button
                type="button"
                onClick={() => setSolutionModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-[#005A9C] hover:bg-[#004F8A] text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

