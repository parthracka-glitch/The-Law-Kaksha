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
  // Track open answers per case ID
  const [openAnswers, setOpenAnswers] = useState<Record<string, boolean>>({});
  // Track practiced cases
  const [practicedCases, setPracticedCases] = useState<string[]>([]);

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
  const isAnswerOpen = openAnswers[caseId] !== false; // open by default
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
    <div className="space-y-2.5">
      {/* Top Greeting & Student Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-[#111827] tracking-tight">
            {greeting}, {displayName}!
          </h2>
          <span className="text-base sm:text-lg select-none animate-pulse" role="img" aria-label="sun">
            ☀️
          </span>
          <span className="text-xs text-[#5B6B8A] hidden md:inline">
            • 3 Solved Weekly Case Studies with 4-Step Answers
          </span>
        </div>

        {onContinueLearning && (
          <button
            type="button"
            onClick={onContinueLearning}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#3558F0] hover:bg-[#2546D8] active:scale-95 text-white text-xs font-semibold shadow-[0_2px_10px_rgba(53,88,240,0.3)] transition-all cursor-pointer"
          >
            <span>Continue Learning</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Hero Card Matching Image 1 Design (Static, Manual Navigation) */}
      <div className="relative bg-white rounded-3xl sm:rounded-[32px] border-2 border-[#BFDBFE] p-5 sm:p-7 md:p-8 shadow-[0_10px_35px_rgba(59,130,246,0.08)] flex flex-col justify-between gap-4 sm:gap-5 transition-all duration-300 overflow-hidden group/hero">
        {/* ========================================================================= */}
        {/* 1. TOP PILLS: CASE # OF THE WEEK + DIFFICULTY BADGE + NEXT BUTTON         */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5">
          {/* Case # Pill (Matching Image 1) */}
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] shadow-2xs">
            <span role="img" aria-label="star" className="text-amber-500">
              ⭐
            </span>
            <span>
              CASE #{currentIndex + 1} OF {totalCases}
            </span>
          </span>

          {/* Difficulty Pill & Forward Button */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] shadow-2xs">
              {currentCase.badge || "High Difficulty"}
            </span>

            {/* Top Quick Next / Forward Button */}
            {totalCases > 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-[#005A9C] bg-[#EFF6FF] hover:bg-[#005A9C] hover:text-white border border-[#BFDBFE] transition-all cursor-pointer shadow-2xs active:scale-95"
                title="View Next Case Study"
              >
                <span>Next Case</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. DAY HEADER & MARKS ALLOTMENT                                           */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <span className="text-sm sm:text-base font-black text-[#005A9C] uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#E11D48]" />
            <span>{currentCase.day || `Case #${currentIndex + 1}`}</span>
          </span>
          <span className="text-xs sm:text-sm font-mono font-semibold text-[#64748B]">
            {currentCase.marks || "6/6 Marks"}
          </span>
        </div>

        {/* ========================================================================= */}
        {/* 3. STATUTORY SUBJECT & CASE TITLE                                         */}
        {/* ========================================================================= */}
        <div className="space-y-1">
          <span className="text-xs sm:text-sm font-semibold text-[#64748B] block tracking-wide">
            {currentCase.subject || "Indian Contract Act, 1872"}
          </span>
          <h3 className="text-base sm:text-xl md:text-2xl font-extrabold text-[#0F172A] leading-snug tracking-tight">
            {currentCase.title}
          </h3>
        </div>

        {/* ========================================================================= */}
        {/* 4. SCENARIO BUBBLE (MATCHING IMAGE 1 EXACT LOOK)                         */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-2xs space-y-1.5">
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-[#005A9C]" />
            <span>Case Scenario:</span>
          </div>
          <p className="text-xs sm:text-sm text-[#334155] italic leading-relaxed break-words">
            &ldquo;{currentCase.scenario}&rdquo;
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 5. MODEL ANSWER (4-STEP STRUCTURE) VIEW & EXPANDER                        */}
        {/* ========================================================================= */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#005A9C] flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#005A9C]" />
              <span>MODEL ANSWER (4-STEP):</span>
            </span>

            {hasAccess && (
              <button
                type="button"
                onClick={() => setOpenAnswers((prev) => ({ ...prev, [caseId]: !isAnswerOpen }))}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#64748B] hover:text-[#005A9C] px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <span>{isAnswerOpen ? "Hide Solution" : "Show 4-Step Solution"}</span>
                {isAnswerOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          {hasAccess ? (
            isAnswerOpen && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#F0FDF4] to-[#ECFDF5] border border-[#BBF7D0] text-xs sm:text-[13px] text-[#14532D] space-y-3 leading-relaxed shadow-xs animate-in fade-in duration-200">
                {currentCase.modelAnswer?.trim() ? (
                  <p className="whitespace-pre-line leading-relaxed text-[#14532D] font-normal break-words">
                    {currentCase.modelAnswer}
                  </p>
                ) : (
                  <p className="text-xs text-[#15803D] italic">
                    Faculty model answer is currently being prepared for this weekly case study.
                  </p>
                )}

                {currentCase.precedent && (
                  <div className="pt-2.5 border-t border-[#BBF7D0] flex items-start gap-2 text-xs font-medium text-[#166534] bg-white/75 p-2.5 sm:p-3 rounded-xl border border-[#86EFAC]/40">
                    <span className="font-bold shrink-0 text-[#14532D]">⚖️ Landmark Precedent:</span>
                    <span className="italic break-words">{currentCase.precedent}</span>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="relative p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden">
              <p className="text-xs text-[#64748B] filter blur-[3.5px] select-none pointer-events-none line-clamp-3">
                {currentCase.modelAnswer ||
                  "Legal principle applies under statutory authority, where doctrine protects buyers from latent defects..."}
              </p>
              <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2 p-3 text-center">
                <div className="flex items-center gap-1.5 text-[#DC2626] font-bold text-xs sm:text-sm">
                  <Lock className="w-4 h-4" />
                  <span>Enrolled Students Only</span>
                </div>
                <p className="text-xs text-[#64748B] max-w-sm">
                  Purchase a course pass to unlock weekly model answers and grading rubrics.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 6. BOTTOM NAVIGATION (PREVIOUS / FORWARD) & PRACTICE BUTTON              */}
        {/* ========================================================================= */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Navigation Controls: Prev, Dots, Next/Forward Button */}
          <div className="flex items-center gap-2 self-center sm:self-auto flex-wrap justify-center">
            {totalCases > 1 && (
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-1 shadow-2xs hover:border-[#BFDBFE] transition-all cursor-pointer active:scale-95"
                  aria-label="Previous Case"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>

                {/* Slide Indicator Dots */}
                <div className="flex items-center gap-1.5 px-1">
                  {activeCases.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleGoTo(idx)}
                      className="p-1 cursor-pointer flex items-center justify-center"
                      aria-label={`Go to case ${idx + 1}`}
                      title={`Go to Case #${idx + 1}`}
                    >
                      <span
                        className={`h-2 rounded-full transition-all duration-300 block ${
                          currentIndex === idx
                            ? "w-6 bg-[#005A9C]"
                            : "w-2 bg-slate-300 hover:bg-slate-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Forward / Next Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-3.5 py-1.5 rounded-xl border border-[#005A9C] bg-[#EBF5FF] hover:bg-[#005A9C] text-[#005A9C] hover:text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95"
                  aria-label="Next Case"
                >
                  <span>Next Case</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <span className="text-[11px] font-semibold text-slate-500 pl-1">
              Case {currentIndex + 1} of {totalCases}
            </span>
          </div>

          {/* Right Action: Practice (+30 XP) */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {hasAccess ? (
              <button
                type="button"
                disabled={isPracticed}
                onClick={() => {
                  if (!isPracticed) {
                    awardXp?.(30, `Practiced Weekly Case: ${currentCase.title}`);
                    setPracticedCases((prev) => [...prev, caseId]);
                  }
                }}
                className={`px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs active:scale-95 ${
                  isPracticed
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default"
                    : "bg-[#005A9C] hover:bg-[#004F8A] text-white"
                }`}
              >
                {isPracticed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Practiced (+30 XP)</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>Practice (+30 XP)</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onBuyCourse?.("ca")}
                className="px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#D97706] to-[#B45309] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Lock className="w-4 h-4" />
                <span>Unlock Full Solution Pass</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

