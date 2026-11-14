"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Scale,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  BookOpen,
  ChevronRight,
  Layers,
  Eye,
  Zap,
  Check,
  FileCheck2,
  ListFilter,
} from "lucide-react";

interface DiagnosticCase {
  id: string;
  act: string;
  section: string;
  marks: string;
  topic: string;
  question: string;
  aspirantScore: string;
  aspirantTitle: string;
  aspirantAnswer: string;
  aspirantIssues: string[];
  aspirantDeductions: { reason: string; penalty: string }[];
  modelScore: string;
  modelTitle: string;
  modelAnswerSections: {
    stepNum: number;
    stepName: string;
    heading: string;
    text?: string;
    bullets?: string[];
    markAward?: string;
  }[];
  rubricPoints: {
    component: string;
    marks: string;
    desc: string;
  }[];
}

const DIAGNOSTIC_CASES: DiagnosticCase[] = [
  {
    id: "soga-sec16",
    act: "Sale of Goods Act, 1930",
    section: "Section 16(1)",
    marks: "6 Marks (ICAI Standard)",
    topic: "Caveat Emptor & Implied Condition as to Quality or Fitness",
    question:
      "Under Section 16(1) of the Sale of Goods Act, 1930, explain the conditions under which an implied condition as to quality or fitness applies even when not expressly stated by the buyer.",
    aspirantScore: "2 / 6 Marks",
    aspirantTitle: "Typical 2/6 Marks Aspirant Answer",
    aspirantAnswer:
      "\"Caveat Emptor means let the buyer beware. The buyer should inspect goods himself before buying. However, if the buyer told the seller why he is buying and seller is in business, seller is responsible. In Priest v Last, hot water bottle burst so seller had to pay money to the buyer.\"",
    aspirantDeductions: [
      { reason: "Missing 3-Prong Cumulative Legal Test", penalty: "-2.0" },
      { reason: "Omitted 'Purpose by necessary implication'", penalty: "-1.0" },
      { reason: "Completely skipped Patent/Trade Name Proviso", penalty: "-1.0" },
    ],
    aspirantIssues: [
      "Vague conversational paraphrasing without the 3-element statutory architecture.",
      "Fails to state 'Communication of purpose by implication' for single-use goods.",
      "Completely skipped the Proviso exception regarding patent / trade name sales.",
      "Lacks point-wise ICAI Suggested Answer format that fetches step marks.",
    ],
    modelScore: "6 / 6 Marks",
    modelTitle: "The Law कक्षा 6/6 Model Legal Answer",
    modelAnswerSections: [
      {
        stepNum: 1,
        stepName: "Statutory Rule",
        heading: "1. Overriding Statutory Principle",
        text: "Under Section 16(1) of The Sale of Goods Act, 1930, the common-law rule of 'Caveat Emptor' is displaced, and an implied condition of fitness arises when three cumulative conditions are met:",
        markAward: "+1.0 Mark",
      },
      {
        stepNum: 2,
        stepName: "3-Prong Test",
        heading: "2. The 3-Prong Statutory Test",
        bullets: [
          "(a) Communication: Buyer makes known (expressly or by implication) the particular purpose.",
          "(b) Reliance: Buyer relies on seller's professional skill or judgment.",
          "(c) Course of Business: Goods are of description seller supplies in regular trade.",
        ],
        markAward: "+2.0 Marks",
      },
      {
        stepNum: 3,
        stepName: "Precedent",
        heading: "3. Landmark Authority: Priest v. Last (1903)",
        text: "Where goods have only one natural use (e.g. a hot water bottle), disclosure of purpose is made by implication. The seller remains liable for latent defects even without express statement.",
        markAward: "+2.0 Marks",
      },
      {
        stepNum: 4,
        stepName: "Proviso",
        heading: "4. Section 16(1) Proviso Defense",
        text: "In contracts for sale of specified articles under a patent or trade name, there is no implied condition as to fitness for any particular purpose.",
        markAward: "+1.0 Mark",
      },
    ],
    rubricPoints: [
      { component: "Statutory 3-Prong Test", marks: "2.0 Marks", desc: "Explicitly citing (a) Communication (express/implied), (b) Reliance on skill, (c) Course of business." },
      { component: "Application & Landmark Precedent", marks: "2.0 Marks", desc: "Citing Priest v. Last with reasoning on purpose by necessary implication." },
      { component: "Section 16(1) Proviso Exception", marks: "1.0 Marks", desc: "Highlighting patent/trade name sales where Caveat Emptor still applies." },
      { component: "Legal Structuring & Phrasing", marks: "1.0 Marks", desc: "Point-wise presentation aligning with ICAI evaluation scheme." },
    ],
  },
  {
    id: "ica-sec2d",
    act: "Indian Contract Act, 1872",
    section: "Section 2(d)",
    marks: "6 Marks (ICAI Standard)",
    topic: "Privity of Consideration vs Privity of Contract",
    question:
      "A mother by deed of gift gifted properties to her daughter with a direction to pay annuity to her maternal uncle. On the same day, the daughter agreed with the uncle to pay the annuity. She subsequently refused. Can the uncle enforce the promise?",
    aspirantScore: "2 / 6 Marks",
    aspirantTitle: "Typical 2/6 Marks Aspirant Answer",
    aspirantAnswer:
      "\"Yes, the uncle can get the money because daughter promised him. Even though uncle gave no money, contract is valid. In Chinnaya case, court said uncle can recover from niece because gift deed had condition.\"",
    aspirantDeductions: [
      { reason: "Failed to cite Section 2(d) phrasing 'Promisee or any other person'", penalty: "-2.0" },
      { reason: "Conflated Privity of Contract with Privity of Consideration", penalty: "-1.0" },
      { reason: "No step-wise Conclusion with judicial decree citation", penalty: "-1.0" },
    ],
    aspirantIssues: [
      "No statutory definition of Consideration under Section 2(d).",
      "Failed to distinguish 'Privity of Contract' (stranger cannot sue) vs 'Privity of Consideration' (stranger can furnish consideration).",
      "Lacks the legal maxim and English Law vs Indian Law comparative analysis.",
    ],
    modelScore: "6 / 6 Marks",
    modelTitle: "The Law कक्षा 6/6 Model Legal Answer",
    modelAnswerSections: [
      {
        stepNum: 1,
        stepName: "Definition",
        heading: "1. Statutory Definition: Section 2(d)",
        text: "Under Section 2(d), consideration is valid when at the desire of the promisor, the promisee 'OR ANY OTHER PERSON' has done or abstained from doing something.",
        markAward: "+1.5 Marks",
      },
      {
        stepNum: 2,
        stepName: "Doctrine",
        heading: "2. Privity of Consideration (Indian Position)",
        text: "Unlike English Law where consideration must move strictly from the promisee (Tweddle v. Atkinson), Indian Law allows consideration to move from a third-party stranger.",
        markAward: "+1.5 Marks",
      },
      {
        stepNum: 3,
        stepName: "Precedent",
        heading: "3. Landmark Authority: Chinnaya v. Ramayya (1882)",
        text: "The Madras High Court held that the gift by the mother constituted sufficient consideration for the promise to pay annuity. The uncle is a stranger to consideration, not a stranger to contract.",
        markAward: "+2.0 Marks",
      },
      {
        stepNum: 4,
        stepName: "Conclusion",
        heading: "4. Conclusion & Examiner Decree",
        text: "The daughter is legally bound to pay the annuity; the maternal uncle is entitled to file a suit to enforce recovery.",
        markAward: "+1.0 Mark",
      },
    ],
    rubricPoints: [
      { component: "Section 2(d) Statutory Phrasing", marks: "1.5 Marks", desc: "Identifying 'promisee or any other person' as foundation of third-party consideration." },
      { component: "Privity of Contract vs Consideration", marks: "1.5 Marks", desc: "Drawing clear dichotomy between English common law and Indian statutory framework." },
      { component: "Citation of Chinnaya v. Ramayya (1882)", marks: "2.0 Marks", desc: "Connecting facts of the case to maternal gift as valid consideration." },
      { component: "Definitive Legal Conclusion", marks: "1.0 Marks", desc: "Unambiguous conclusion with specific right of recovery." },
    ],
  },
  {
    id: "ipa-sec28",
    act: "Indian Partnership Act, 1932",
    section: "Section 28",
    marks: "6 Marks (ICAI Standard)",
    topic: "Doctrine of Holding Out & Partner by Estoppel",
    question:
      "Mr. Mohan retired from M/s Star Enterprises without giving public notice in the Official Gazette. Thereafter, firm took a loan of ₹10,00,000 from Bank of India. Is Mohan liable to repay the loan?",
    aspirantScore: "2.5 / 6 Marks",
    aspirantTitle: "Typical 2.5/6 Marks Aspirant Answer",
    aspirantAnswer:
      "\"Mohan is liable because he didn't inform bank. Public notice is compulsory when partner leaves. If not given, he is treated as continuing partner under Section 28 holding out. So bank can take money from him.\"",
    aspirantDeductions: [
      { reason: "Missed Section 32(3) & 32(4) retired partner liability link", penalty: "-1.5" },
      { reason: "Failed to mention Section 72 mode of public notice", penalty: "-1.0" },
      { reason: "Did not analyze whether bank had knowledge of retirement", penalty: "-1.0" },
    ],
    aspirantIssues: [
      "Didn't correlate Section 28 (Holding Out) with Section 32(3) (Retirement liability).",
      "Omitted mandatory statutory requirements of Section 72 (Official Gazette + vernacular newspaper).",
      "Ignored dormant/sleeping partner exception where public notice is not required.",
    ],
    modelScore: "6 / 6 Marks",
    modelTitle: "The Law कक्षा 6/6 Model Legal Answer",
    modelAnswerSections: [
      {
        stepNum: 1,
        stepName: "General Rule",
        heading: "1. General Statutory Rule: Section 32(3)",
        text: "Under Section 32(3), a retired partner continues to be liable to third parties for acts of the firm done after retirement until public notice is given.",
        markAward: "+1.5 Marks",
      },
      {
        stepNum: 2,
        stepName: "Estoppel",
        heading: "2. Doctrine of Holding Out: Section 28(1)",
        text: "Section 28 embodies the principle of estoppel: anyone who knowingly permits himself to be represented as a partner is liable to creditors who gave credit on faith of such representation.",
        markAward: "+1.5 Marks",
      },
      {
        stepNum: 3,
        stepName: "Public Notice",
        heading: "3. Mandatory Compliance of Public Notice: Section 72",
        text: "Under Section 72, notice must be published in the Official Gazette and at least one vernacular newspaper circulating in the firm's principal place of business.",
        markAward: "+1.5 Marks",
      },
      {
        stepNum: 4,
        stepName: "Decree",
        heading: "4. Application & Final Decree",
        text: "Since Mr. Mohan failed to give public notice under Section 72, he is jointly and severally liable for the loan of ₹10,00,000.",
        markAward: "+1.5 Marks",
      },
    ],
    rubricPoints: [
      { component: "Section 32(3) & Section 28 Link", marks: "1.5 Marks", desc: "Correlating retirement liability with holding out estoppel." },
      { component: "Section 72 Modalities of Notice", marks: "1.5 Marks", desc: "Mentioning Official Gazette and regional vernacular newspaper publication." },
      { component: "Reliance on Representation Element", marks: "1.5 Marks", desc: "Showing lender acted on faith of Mohan being an active partner." },
      { component: "Joint & Several Liability Decree", marks: "1.5 Marks", desc: "Explicitly stating Mohan's enforceable liability." },
    ],
  },
];

export function Section16ComparisonBlock() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>("soga-sec16");
  const [viewMode, setViewMode] = useState<"split" | "trap" | "model" | "rubric">("split");
  const [activeStepFilter, setActiveStepFilter] = useState<number | "all">("all");
  const [showExaminerMarks, setShowExaminerMarks] = useState<boolean>(true);

  const activeCase =
    DIAGNOSTIC_CASES.find((c) => c.id === selectedCaseId) || DIAGNOSTIC_CASES[0];

  return (
    <section className="py-10 sm:py-14 bg-gradient-to-b from-[#F0F7FF] via-white to-[#F8FAFC] text-[#0A192F] relative overflow-hidden border-t border-b border-[#DBEAFE]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* HEADER: Compact, punchy problem statement */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#005A9C] text-[11px] font-bold tracking-wide uppercase shadow-2xs">
            <Scale className="w-3.5 h-3.5 text-[#005A9C]" />
            <span>ICAI Evaluator Diagnostic</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0A192F] tracking-tight leading-snug">
            Why 82% of CA Foundation Aspirants <br className="hidden sm:inline" />
            Lose Marks in Descriptive Law
          </h2>

          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed max-w-xl mx-auto">
            ICAI evaluators test statutory structure over conversational summaries. Compare the{" "}
            <span className="text-rose-600 font-bold">2/6 marks trap</span> with{" "}
            <span className="text-[#005A9C] font-extrabold">The Law कक्षा 6/6 model standard</span>.
          </p>
        </div>

        {/* UNIFIED INTERACTIVE DIAGNOSTIC COCKPIT (Space-saving & Minimal) */}
        <div className="mb-6 bg-white rounded-2xl border border-[#DBEAFE] shadow-xs p-3.5 sm:p-4 space-y-3.5">
          {/* Row 1: Segmented Scenario Selector Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Select ICAI Case Trap:</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 w-full sm:w-auto">
              {DIAGNOSTIC_CASES.map((item) => {
                const isSelected = selectedCaseId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedCaseId(item.id);
                      setActiveStepFilter("all");
                    }}
                    className={`px-3 py-1.5 rounded-xl text-left transition-all duration-150 cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? "bg-[#005A9C] text-white shadow-xs"
                        : "bg-slate-50 text-[#475569] hover:bg-[#EFF6FF] hover:text-[#005A9C] border border-slate-200"
                    }`}
                  >
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                        isSelected ? "bg-white/20 text-white" : "bg-blue-100 text-[#005A9C]"
                      }`}
                    >
                      {item.section}
                    </span>
                    <span className="text-xs font-semibold truncate">
                      {item.act.split(",")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 2: Compact Question Card */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[#005A9C]">{activeCase.act}</span>
                <span className="text-slate-300">•</span>
                <span className="font-mono text-slate-600 font-semibold">{activeCase.section}</span>
                <span className="text-slate-300">•</span>
                <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200">
                  {activeCase.marks}
                </span>
              </div>
              <p className="text-[#1E293B] font-medium leading-relaxed italic line-clamp-2 md:line-clamp-none">
                <span className="font-bold text-[#005A9C] not-italic mr-1">ICAI Question:</span>
                "{activeCase.question}"
              </p>
            </div>
          </div>

          {/* Row 3: Interactive View Mode Switcher + Examiner Marks Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-100">
            {/* View Mode Pills */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs overflow-x-auto max-w-full">
              <button
                onClick={() => setViewMode("split")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  viewMode === "split"
                    ? "bg-[#005A9C] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Split Compare</span>
              </button>

              <button
                onClick={() => setViewMode("trap")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  viewMode === "trap"
                    ? "bg-rose-600 text-white shadow-2xs"
                    : "text-slate-600 hover:text-rose-700"
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>2/6 Trap</span>
              </button>

              <button
                onClick={() => setViewMode("model")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  viewMode === "model"
                    ? "bg-emerald-700 text-white shadow-2xs"
                    : "text-slate-600 hover:text-emerald-700"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>6/6 Model</span>
              </button>

              <button
                onClick={() => setViewMode("rubric")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  viewMode === "rubric"
                    ? "bg-slate-800 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>ICAI Rubric</span>
              </button>
            </div>

            {/* Toggle: Show Examiner Marks */}
            <button
              onClick={() => setShowExaminerMarks(!showExaminerMarks)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer self-start sm:self-auto ${
                showExaminerMarks
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900"
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>{showExaminerMarks ? "Hide Mark Breakdown" : "Show Mark Breakdown"}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN DISPLAY AREA                                                         */}
        {/* ========================================================================= */}

        {/* 1. SPLIT COMPARISON VIEW */}
        {viewMode === "split" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
            {/* 🔴 Left: 2/6 Marks Card (Space-optimized) */}
            <div className="rounded-2xl bg-white border border-rose-200 p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                      Evaluator Trap
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 font-mono font-bold text-xs border border-rose-200">
                    {activeCase.aspirantScore}
                  </span>
                </div>

                {/* Aspirant Script */}
                <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 text-[#475569] text-xs italic leading-relaxed">
                  <span className="text-rose-500 font-mono text-[10px] block mb-0.5 uppercase font-bold not-italic">
                    Aspirant Submitted Script:
                  </span>
                  {activeCase.aspirantAnswer}
                </div>

                {/* Deductions Chips */}
                {showExaminerMarks && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-rose-800 block">
                      Evaluator Red-Pen Penalties:
                    </span>
                    <div className="space-y-1">
                      {activeCase.aspirantDeductions.map((ded, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-[11px] bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200/60"
                        >
                          <span className="text-rose-900 font-medium truncate pr-2">{ded.reason}</span>
                          <span className="font-mono font-bold text-rose-600 shrink-0">{ded.penalty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fatal Flaws Checklist */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">
                    Why Evaluators Cut Marks:
                  </span>
                  <ul className="space-y-1">
                    {activeCase.aspirantIssues.slice(0, 3).map((issue, idx) => (
                      <li key={idx} className="text-xs text-[#64748B] flex items-start gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-rose-700">Conversational writing trap</span>
                <span className="font-mono font-bold text-rose-600">0/6 Structure Award</span>
              </div>
            </div>

            {/* 🟢 Right: 6/6 Marks Model Answer Card (Space-optimized) */}
            <div className="rounded-2xl bg-white border-2 border-[#005A9C] p-4 sm:p-5 flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-bold text-[#005A9C] uppercase tracking-wider">
                      ICAI Model Standard
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-mono font-bold text-xs border border-emerald-300">
                    {activeCase.modelScore}
                  </span>
                </div>

                {/* Steps Section */}
                <div className="space-y-2 text-xs">
                  {activeCase.modelAnswerSections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200/90 space-y-1"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="font-bold text-[#0A192F] text-[11px]">
                          {sec.heading}
                        </span>
                        {showExaminerMarks && sec.markAward && (
                          <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            {sec.markAward}
                          </span>
                        )}
                      </div>

                      {sec.text && (
                        <p className="text-slate-600 leading-relaxed text-[11px]">{sec.text}</p>
                      )}

                      {sec.bullets && (
                        <div className="space-y-0.5 pl-2 border-l-2 border-[#005A9C] my-1 text-[11px]">
                          {sec.bullets.map((b, bIdx) => (
                            <p key={bIdx} className="text-slate-700 leading-tight">
                              {b}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                  <Check className="w-3.5 h-3.5" />
                  Full 4-Step statutory framework
                </span>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-1 text-[#005A9C] hover:text-[#004880] font-bold text-[11px] transition-colors"
                >
                  <span>Explore Codices</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 2. TRAP DEEP DIVE VIEW */}
        {viewMode === "trap" && (
          <div className="bg-white rounded-2xl border border-rose-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-600">
                  Critical Evaluator Red-Pen Trap
                </span>
                <h3 className="font-serif text-lg font-bold text-[#0A192F]">
                  {activeCase.aspirantTitle}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-rose-50 text-rose-700 font-mono font-black text-sm border border-rose-200">
                {activeCase.aspirantScore}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 text-slate-700 text-xs sm:text-sm italic leading-relaxed">
              <span className="font-mono text-[10px] text-rose-600 block mb-1 uppercase font-bold not-italic">
                Submitted Answer:
              </span>
              {activeCase.aspirantAnswer}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-rose-50/40 rounded-xl p-3.5 border border-rose-200/80 space-y-2">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">
                  Mark Deductions:
                </span>
                <div className="space-y-1.5">
                  {activeCase.aspirantDeductions.map((ded, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs bg-white px-3 py-1.5 rounded-lg border border-rose-200"
                    >
                      <span className="text-rose-900 font-medium">{ded.reason}</span>
                      <span className="font-mono font-bold text-rose-600">{ded.penalty} Marks</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Flaws Identified:
                </span>
                <ul className="space-y-1.5">
                  {activeCase.aspirantIssues.map((issue, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                      <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 3. MODEL ANSWER INTERACTIVE STEP VIEW (Interactive step inspector) */}
        {viewMode === "model" && (
          <div className="bg-white rounded-2xl border-2 border-[#005A9C] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-blue-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#005A9C]">
                  The Law Kaksha 6/6 Model Standard
                </span>
                <h3 className="font-serif text-lg font-bold text-[#0A192F]">
                  {activeCase.modelTitle}
                </h3>
              </div>

              {/* Interactive Step Switcher */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs overflow-x-auto">
                <button
                  onClick={() => setActiveStepFilter("all")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    activeStepFilter === "all"
                      ? "bg-[#005A9C] text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All 4 Steps
                </button>
                {activeCase.modelAnswerSections.map((sec) => (
                  <button
                    key={sec.stepNum}
                    onClick={() => setActiveStepFilter(sec.stepNum)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeStepFilter === sec.stepNum
                        ? "bg-[#005A9C] text-white shadow-2xs"
                        : "text-slate-600 hover:text-[#005A9C]"
                    }`}
                  >
                    Step {sec.stepNum}
                  </button>
                ))}
              </div>
            </div>

            {/* Rendered Step(s) */}
            <div className="space-y-3">
              {activeCase.modelAnswerSections
                .filter((sec) => activeStepFilter === "all" || activeStepFilter === sec.stepNum)
                .map((sec) => (
                  <div
                    key={sec.stepNum}
                    className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2 hover:border-[#005A9C]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-[#005A9C] text-white font-mono text-[10px] font-bold flex items-center justify-center">
                          {sec.stepNum}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-[#0A192F]">
                          {sec.heading}
                        </h4>
                      </div>
                      {sec.markAward && (
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {sec.markAward}
                        </span>
                      )}
                    </div>

                    {sec.text && (
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-7">
                        {sec.text}
                      </p>
                    )}

                    {sec.bullets && (
                      <div className="space-y-1 pl-7 my-1 text-xs sm:text-sm">
                        {sec.bullets.map((b, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-2 text-slate-700">
                            <span className="text-[#005A9C] font-bold">•</span>
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 4. MARKING RUBRIC VIEW */}
        {viewMode === "rubric" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#0A192F]">
                ICAI 6-Marks Step-Wise Marking Rubric
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                100% Evaluation Standard
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2.5 px-3 font-bold uppercase text-[10px]">Parameter</th>
                    <th className="py-2.5 px-3 font-bold uppercase text-[10px]">Marks</th>
                    <th className="py-2.5 px-3 font-bold uppercase text-[10px]">Expectation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeCase.rubricPoints.map((rubric, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-[#0A192F]">{rubric.component}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#005A9C]">{rubric.marks}</td>
                      <td className="py-2.5 px-3 text-slate-600 leading-relaxed">{rubric.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COMPACT MINIMAL CTA FOOTER */}
        <div className="mt-6 rounded-2xl bg-[#0A192F] text-white p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border border-slate-800">
          <div className="space-y-0.5 text-center sm:text-left">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Master this 4-step framework across all 22 units</span>
            </h3>
            <p className="text-xs text-slate-300">
              Every chapter in The Law Kaksha codices is formatted in this exact ICAI scoring blueprint.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <Link
              href="/courses"
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#005A9C] hover:bg-[#004880] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <span>Unlock Codices @ ₹99</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
