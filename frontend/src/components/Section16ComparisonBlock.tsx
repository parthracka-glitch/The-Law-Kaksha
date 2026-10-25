"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Scale,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Award,
  BookOpen,
  ChevronRight,
  HelpCircle,
  Eye,
  Check,
  Zap,
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/api";

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
    act: "The Sale of Goods Act, 1930",
    section: "Section 16(1)",
    marks: "6 Marks (ICAI Standard)",
    topic: "Doctrine of Caveat Emptor & Implied Condition as to Quality or Fitness",
    question:
      "Under Section 16(1) of the Sale of Goods Act, 1930, explain the conditions under which an implied condition as to quality or fitness applies even when not expressly stated by the buyer.",
    aspirantScore: "2 / 6 Marks",
    aspirantTitle: "Typical 2/6 Marks Aspirant Answer",
    aspirantAnswer:
      "\"Caveat Emptor means let the buyer beware. The buyer should inspect goods himself before buying. However, if the buyer told the seller why he is buying and seller is in business, seller is responsible. In Priest v Last, hot water bottle burst so seller had to pay money to the buyer.\"",
    aspirantDeductions: [
      { reason: "Missing 3-Prong Cumulative Legal Test", penalty: "-2.0 Marks" },
      { reason: "Omitted 'Purpose by necessary implication'", penalty: "-1.0 Mark" },
      { reason: "Completely skipped Patent/Trade Name Proviso", penalty: "-1.0 Mark" },
    ],
    aspirantIssues: [
      "Vague paraphrasing without statutory 3-element legal architecture.",
      "Fails to explain 'Communication of purpose by implication' (when goods have only one single purpose).",
      "Completely missed the Proviso exception regarding patent / trade name sales.",
      "Lacks point-wise ICAI Suggested Answer format that fetches evaluation marks.",
    ],
    modelScore: "6 / 6 Marks",
    modelTitle: "The Law कक्षा 6/6 Model Legal Answer",
    modelAnswerSections: [
      {
        heading: "1. Statutory Rule & Overriding Principle",
        text: "Under Section 16(1) of The Sale of Goods Act, 1930, the fundamental common-law rule of 'Caveat Emptor' (let the buyer beware) is displaced, and an implied condition that goods shall be reasonably fit for a particular purpose arises when the following three cumulative conditions are satisfied:",
        markAward: "+1.0 Mark (Principle)",
      },
      {
        heading: "2. The 3-Prong Statutory Test",
        bullets: [
          "(a) Communication of Purpose: The buyer, expressly or by implication, makes known to the seller the particular purpose for which goods are required.",
          "(b) Reliance on Skill/Judgment: The buyer relies on the seller's skill or judgment.",
          "(c) Course of Seller's Business: The goods are of a description which it is in the course of the seller's business to supply (whether manufacturer or trader).",
        ],
        markAward: "+2.0 Marks (Cumulative Test)",
      },
      {
        heading: "3. Landmark Case Precedent: Priest v. Last (1903)",
        text: "Where goods are capable of only one normal use (e.g., a hot water bottle), disclosure of purpose is made by implication. The seller is liable for latent defects even if no express statement was given.",
        markAward: "+2.0 Marks (Judicial Reasoning)",
      },
      {
        heading: "4. Statutory Proviso Exception",
        text: "Provided that in the case of a contract for the sale of a specified article under its patent or other trade name, there is no implied condition as to its fitness for any particular purpose.",
        markAward: "+1.0 Mark (Proviso Defense)",
      },
    ],
    rubricPoints: [
      { component: "Statutory 3-Prong Test Citation", marks: "2.0 Marks", desc: "Explicitly citing (a) Communication (express/implied), (b) Reliance on skill, (c) Course of business." },
      { component: "Application & Landmark Precedent", marks: "2.0 Marks", desc: "Citing Priest v. Last with reasoning on purpose by necessary implication." },
      { component: "Section 16(1) Proviso (Patent/Trade Name)", marks: "1.0 Marks", desc: "Highlighting the statutory exception where Caveat Emptor still applies." },
      { component: "Legal Structuring & Statutory Phrasing", marks: "1.0 Marks", desc: "Point-wise presentation aligning with ICAI Evaluation Guidelines." },
    ],
  },
  {
    id: "ica-sec2d",
    act: "The Indian Contract Act, 1872",
    section: "Section 2(d)",
    marks: "6 Marks (ICAI Standard)",
    topic: "Doctrine of Privity of Consideration vs Privity of Contract",
    question:
      "A mother by deed of gift gifted properties to her daughter with a direction to pay annuity to her maternal uncle. On the same day, the daughter entered into an agreement with the uncle to pay the annuity. She subsequently refused. Can the uncle enforce the promise?",
    aspirantScore: "2 / 6 Marks",
    aspirantTitle: "Typical 2/6 Marks Aspirant Answer",
    aspirantAnswer:
      "\"Yes, the uncle can get the money because daughter promised him. Even though uncle gave no money, contract is valid. In Chinnaya case, court said uncle can recover from niece because gift deed had condition.\"",
    aspirantDeductions: [
      { reason: "Failed to cite Section 2(d) phrasing 'Promisee or any other person'", penalty: "-2.0 Marks" },
      { reason: "Conflated Privity of Contract with Privity of Consideration", penalty: "-1.0 Mark" },
      { reason: "No step-wise Conclusion with judicial decree citation", penalty: "-1.0 Mark" },
    ],
    aspirantIssues: [
      "No statutory definition of Consideration under Section 2(d).",
      "Failed to distinguish between 'Privity of Contract' (stranger cannot sue) vs 'Privity of Consideration' (stranger can furnish consideration).",
      "Lacks the legal maxim and English Law vs Indian Law comparative analysis.",
    ],
    modelScore: "6 / 6 Marks",
    modelTitle: "The Law कक्षा 6/6 Model Legal Answer",
    modelAnswerSections: [
      {
        heading: "1. Statutory Definition: Section 2(d)",
        text: "Under Section 2(d) of the Indian Contract Act, 1872, consideration is valid when at the desire of the promisor, the promisee 'OR ANY OTHER PERSON' has done or abstained from doing something.",
        markAward: "+1.5 Marks (Statutory Provision)",
      },
      {
        heading: "2. Doctrine of Privity of Consideration (Indian Position)",
        text: "Unlike English Law where consideration must move strictly from the promisee (Tweddle v. Atkinson), Indian Law allows consideration to move from a third party stranger to the contract.",
        markAward: "+1.5 Marks (Jurisprudential Distinction)",
      },
      {
        heading: "3. Landmark Authority: Chinnaya v. Ramayya (1882)",
        text: "The Madras High Court held that the gift by the mother to the daughter constituted sufficient consideration for the promise to pay annuity to the maternal uncle. The uncle is a stranger to consideration, not a stranger to the contract.",
        markAward: "+2.0 Marks (Landmark Authority)",
      },
      {
        heading: "4. Conclusion & Examiner Decree",
        text: "Therefore, the daughter is legally bound to pay the annuity, and the maternal uncle is entitled to file a suit to enforce recovery.",
        markAward: "+1.0 Mark (Precise Legal Conclusion)",
      },
    ],
    rubricPoints: [
      { component: "Section 2(d) Core Statutory Phrasing", marks: "1.5 Marks", desc: "Identifying 'promisee or any other person' as foundation of third-party consideration." },
      { component: "Privity of Contract vs Privity of Consideration", marks: "1.5 Marks", desc: "Drawing clear dichotomy between English common law and Indian statutory framework." },
      { component: "Citation of Chinnaya v. Ramayya (1882)", marks: "2.0 Marks", desc: "Connecting facts of the case to maternal gift as valid consideration." },
      { component: "Definitive Legal Conclusion", marks: "1.0 Marks", desc: "Unambiguous conclusion with specific right of recovery." },
    ],
  },
  {
    id: "ipa-sec28",
    act: "The Indian Partnership Act, 1932",
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
      { reason: "Missed Section 32(3) & 32(4) retired partner liability link", penalty: "-1.5 Marks" },
      { reason: "Failed to mention Section 72 mode of public notice", penalty: "-1.0 Mark" },
      { reason: "Did not analyze whether bank had knowledge of retirement", penalty: "-1.0 Mark" },
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
        heading: "1. General Statutory Rule: Section 32(3)",
        text: "Under Section 32(3) of the Indian Partnership Act, 1932, a retired partner continues to be liable to third parties for acts of the firm done after his retirement until public notice is given.",
        markAward: "+1.5 Marks (Section 32(3) Rule)",
      },
      {
        heading: "2. Doctrine of Holding Out: Section 28(1)",
        text: "Section 28 embodies the principle of estoppel: anyone who knowingly permits himself to be represented as a partner is liable to anyone who on the faith of such representation gave credit to the firm.",
        markAward: "+1.5 Marks (Estoppel & Representation)",
      },
      {
        heading: "3. Mandatory Compliance of Public Notice: Section 72",
        text: "Under Section 72, public notice of retirement must be published in the Official Gazette and at least one vernacular newspaper circulating in the district where the firm has its principal place of business.",
        markAward: "+1.5 Marks (Section 72 Modalities)",
      },
      {
        heading: "4. Application & Final Decree",
        text: "Since Mr. Mohan failed to give public notice under Section 72, third-party lenders gave credit believing him to be an active partner. Mohan is jointly and severally liable for the loan of ₹10,00,000.",
        markAward: "+1.5 Marks (Application & Decree)",
      },
    ],
    rubricPoints: [
      { component: "Section 32(3) & Section 28 Simultaneous Citation", marks: "1.5 Marks", desc: "Correlating retirement liability with holding out estoppel." },
      { component: "Section 72 Modalities of Notice", marks: "1.5 Marks", desc: "Mentioning Official Gazette and regional vernacular newspaper publication." },
      { component: "Reliance on Representation Element", marks: "1.5 Marks", desc: "Showing lender acted on faith of Mohan being an active partner." },
      { component: "Joint & Several Liability Decree", marks: "1.5 Marks", desc: "Explicitly stating Mohan's enforceable liability." },
    ],
  },
];

export function Section16ComparisonBlock() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>("soga-sec16");
  const [activeTab, setActiveTab] = useState<"side_by_side" | "rubric">("side_by_side");
  const [showExaminerMarks, setShowExaminerMarks] = useState<boolean>(true);
  const [highlightKeyLegalWords, setHighlightKeyLegalWords] = useState<boolean>(true);

  const activeCase =
    DIAGNOSTIC_CASES.find((c) => c.id === selectedCaseId) || DIAGNOSTIC_CASES[0];

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-[#F0F7FF] via-white to-[#F8FAFC] text-[#0A192F] relative overflow-hidden border-t border-b border-[#DBEAFE]">
      {/* Decorative ambient backdrop */}
      <div className="absolute top-12 left-1/3 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-1/4 w-96 h-96 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HEADER: High-Conversion Problem Statement */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#005A9C] text-xs font-bold tracking-wide uppercase shadow-2xs">
            <Scale className="w-3.5 h-3.5 text-[#005A9C]" />
            <span>ICAI Answer Writing Diagnostic &amp; Evaluator Lens</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A192F] tracking-tight">
            Why 82% of CA Foundation Aspirants <br className="hidden sm:inline" />
            Lose Marks in Descriptive Law
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-[#475569] leading-relaxed max-w-2xl mx-auto">
            ICAI evaluators do not award marks for conversational summaries. See the exact difference between a typical{" "}
            <span className="text-rose-600 font-bold">2/6 marks trap</span> and{" "}
            <span className="text-[#005A9C] font-extrabold underline decoration-[#005A9C] underline-offset-4">
              The Law कक्षा 6/6 structured model standard
            </span>.
          </p>
        </div>

        {/* INTERACTIVE CASE SCENARIO SELECTOR (Customer Attraction Bar) */}
        <div className="mb-6 p-2 rounded-2xl bg-white border border-[#DBEAFE] shadow-xs">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Select ICAI Case Trap to Inspect:</span>
            </span>
            <span className="text-[11px] font-mono text-[#005A9C] font-semibold">
              3 High-Yield Act Scenarios Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {DIAGNOSTIC_CASES.map((item) => {
              const isSelected = selectedCaseId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedCaseId(item.id)}
                  className={`p-3 rounded-xl text-left transition-all duration-200 cursor-pointer flex items-start gap-2.5 ${
                    isSelected
                      ? "bg-[#005A9C] text-white shadow-xs"
                      : "bg-[#F8FAFC] text-[#475569] hover:bg-[#EFF6FF] hover:text-[#005A9C] border border-[#E2E8F0]"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                      isSelected ? "bg-white/20 text-white" : "bg-[#EFF6FF] text-[#005A9C]"
                    }`}
                  >
                    §
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase font-bold tracking-wider truncate">
                        {item.section}
                      </span>
                    </div>
                    <div className="text-xs font-bold truncate">
                      {item.act.split(",")[0]}
                    </div>
                    <div
                      className={`text-[10px] truncate ${
                        isSelected ? "text-slate-200" : "text-[#64748B]"
                      }`}
                    >
                      {item.topic}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CURRENT PROBLEM BANNER */}
        <div className="mb-6 p-5 sm:p-6 rounded-3xl bg-white border border-[#DBEAFE] shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#EFF6FF] text-[#005A9C] text-xs font-bold border border-[#BFDBFE]">
                {activeCase.act}
              </span>
              <span className="text-xs font-mono font-bold text-[#005A9C] bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1 rounded-full">
                {activeCase.section}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#64748B]">
                {activeCase.marks}
              </span>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                Past ICAI Exam Trap
              </span>
            </div>
          </div>

          <p className="font-serif text-sm sm:text-base font-bold text-[#0A192F] leading-relaxed">
            <span className="text-[#005A9C] font-extrabold mr-1.5">ICAI Question:</span>
            {activeCase.question}
          </p>
        </div>

        {/* INTERACTIVE CONTROLS TOOLBAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-white p-2 sm:p-2.5 rounded-2xl border border-[#DBEAFE] shadow-2xs">
          {/* Left: Tab Switcher */}
          <div className="inline-flex max-w-full p-1 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0]">
            <button
              onClick={() => setActiveTab("side_by_side")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "side_by_side"
                  ? "bg-[#005A9C] text-white shadow-xs"
                  : "text-[#64748B] hover:text-[#0A192F]"
              }`}
            >
              Side-by-Side Comparison
            </button>
            <button
              onClick={() => setActiveTab("rubric")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "rubric"
                  ? "bg-[#005A9C] text-white shadow-xs"
                  : "text-[#64748B] hover:text-[#0A192F]"
              }`}
            >
              ICAI Step Mark Rubric
            </button>
          </div>

          {/* Right: Interactive Evaluator Toggles */}
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => setShowExaminerMarks(!showExaminerMarks)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold border transition-all cursor-pointer ${
                showExaminerMarks
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs"
                  : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:text-[#0A192F]"
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>Show Examiner Mark Breakdown</span>
            </button>
          </div>
        </div>

        {/* TAB 1: SIDE-BY-SIDE INTERACTIVE AUDIT */}
        {activeTab === "side_by_side" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            
            {/* 🔴 LEFT CARD: 2/6 MARKS TYPICAL ASPIRANT TRAP */}
            <div className="rounded-3xl bg-white border-2 border-rose-200 p-6 sm:p-7 flex flex-col justify-between relative shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-4">
                
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                  <div>
                    <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      <span>Evaluator Common Trap</span>
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#0A192F]">
                      {activeCase.aspirantTitle}
                    </h3>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-mono font-black text-sm flex items-center gap-1.5 shadow-2xs">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>{activeCase.aspirantScore}</span>
                  </div>
                </div>

                {/* Aspirant's Answer (Conversational Paraphrasing) */}
                <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-rose-100 text-[#475569] text-xs sm:text-sm italic leading-relaxed relative">
                  <span className="text-rose-400 font-mono text-xs block mb-1 uppercase font-bold">
                    Aspirant Submitted Script:
                  </span>
                  {activeCase.aspirantAnswer}
                </div>

                {/* Evaluator Deduction Stamps */}
                {showExaminerMarks && (
                  <div className="bg-[#FFF1F2] rounded-2xl p-3.5 border border-rose-200 space-y-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700 block">
                      Evaluator Red-Pen Penalty:
                    </span>
                    <div className="space-y-1.5">
                      {activeCase.aspirantDeductions.map((ded, dIdx) => (
                        <div
                          key={dIdx}
                          className="flex items-center justify-between text-xs text-rose-900 bg-white/70 px-2.5 py-1 rounded-lg border border-rose-200/60"
                        >
                          <span className="font-medium text-[11px]">{ded.reason}</span>
                          <span className="font-mono font-bold text-rose-600 text-xs shrink-0">
                            {ded.penalty}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed Issues Checklist */}
                <div className="space-y-2 pt-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Fatal Flaws Identified by Examiner:</span>
                  </p>
                  <ul className="space-y-2">
                    {activeCase.aspirantIssues.map((issue, idx) => (
                      <li key={idx} className="text-xs text-[#64748B] flex items-start gap-2">
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Evaluation Verdict */}
              <div className="mt-6 pt-4 border-t border-rose-100 flex items-center justify-between text-xs text-[#64748B]">
                <span className="font-semibold text-rose-700">
                  Result: Concept known, but 0 structure
                </span>
                <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  Paper 2 Failure Trap
                </span>
              </div>
            </div>

            {/* 🟢 RIGHT CARD: 6/6 MARKS THE LAW KAKSHA MODEL ANSWER */}
            <div className="rounded-3xl bg-white border-2 border-[#005A9C] p-6 sm:p-7 flex flex-col justify-between relative shadow-[0_8px_30px_rgba(0,90,156,0.12)] hover:shadow-[0_12px_40px_rgba(0,90,156,0.18)] transition-all">
              <div className="space-y-4">
                
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-[#DBEAFE] pb-3">
                  <div>
                    <span className="text-[10px] font-black text-[#005A9C] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#005A9C]" />
                      <span>ICAI Suggested Model Standard</span>
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#0A192F]">
                      {activeCase.modelTitle}
                    </h3>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-mono font-black text-sm flex items-center gap-1.5 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{activeCase.modelScore}</span>
                  </div>
                </div>

                {/* Structured 6/6 Answer Sections */}
                <div className="space-y-3.5 text-xs sm:text-sm">
                  {activeCase.modelAnswerSections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF]/40 border border-[#DBEAFE] space-y-1.5 relative group hover:border-[#93C5FD] transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-[#0A192F] text-xs font-serif">
                          {sec.heading}
                        </p>
                        {showExaminerMarks && sec.markAward && (
                          <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md shrink-0 border border-emerald-200">
                            {sec.markAward}
                          </span>
                        )}
                      </div>

                      {sec.text && (
                        <p className="text-[#475569] text-xs leading-relaxed">
                          {sec.text}
                        </p>
                      )}

                      {sec.bullets && (
                        <div className="space-y-1.5 pl-2.5 border-l-2 border-[#005A9C] my-1.5">
                          {sec.bullets.map((b, bIdx) => (
                            <p key={bIdx} className="text-xs text-[#334155] leading-snug">
                              {b}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Call to Action Footer */}
              <div className="mt-6 pt-4 border-t border-[#DBEAFE] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <span className="text-xs text-[#005A9C] font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Exact 4-step framework in all 22 units</span>
                </span>

                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#005A9C] hover:bg-[#004880] text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  <span>Unlock Full 6/6 Codices @ ₹99</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        ) : (
          /* TAB 2: STEP-BY-STEP MARKING RUBRIC */
          <div className="bg-white rounded-3xl border border-[#DBEAFE] p-5 sm:p-7 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0A192F]">
                  ICAI 6-Marks Step-Wise Marking Rubric
                </h3>
                <p className="text-xs text-[#64748B]">
                  Official allocation of marks based on statutory phrasing and legal precedents.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                100% Evaluation Standard
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm min-w-[540px]">
                <thead>
                  <tr className="border-b border-[#DBEAFE] text-[#64748B]">
                    <th className="py-3 px-3 font-bold uppercase text-[11px]">Evaluation Parameter</th>
                    <th className="py-3 px-3 font-bold uppercase text-[11px]">Marks Weightage</th>
                    <th className="py-3 px-3 font-bold uppercase text-[11px]">Evaluator Expectation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeCase.rubricPoints.map((rubric, idx) => (
                    <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3.5 px-3 font-bold text-[#0A192F]">
                        {rubric.component}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-[#005A9C]">
                        {rubric.marks}
                      </td>
                      <td className="py-3.5 px-3 text-[#475569] text-xs leading-relaxed">
                        {rubric.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CUSTOMER ATTRACTION POINT: High-Converting Value Proposition */}
        <div className="mt-8 sm:mt-12 rounded-3xl bg-gradient-to-r from-[#0A192F] via-[#0A2244] to-[#0A192F] text-white p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
          {/* Subtle light streak */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold border border-amber-400/30">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>The Law Kaksha Secret to 70+ in Law</span>
              </div>
              <h3
                style={{ color: "#FFFFFF" }}
                className="font-serif text-xl sm:text-2xl font-bold !text-white"
              >
                Stop Leaving 30+ Marks on the Table in Descriptive Law
              </h3>
              <p
                style={{ color: "#CBD5E1" }}
                className="text-xs sm:text-sm !text-slate-300 leading-relaxed"
              >
                Every codex on The Law कक्षा is meticulously formatted in this exact 4-step framework:{" "}
                <strong className="text-white">Provision → Analysis → Landmark Precedent → Conclusion</strong>. 
                Read on phone or laptop with instant DRM watermarked access.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <Link
                href="/courses"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#005A9C] hover:bg-[#004880] text-white text-xs font-bold transition-all shadow-[0_4px_16px_rgba(0,90,156,0.3)] hover:shadow-[0_6px_22px_rgba(0,90,156,0.4)] flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>Unlock All Courses @ ₹99</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="#free-resources"
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#93C5FD]" />
                <span>Read Free Samples First</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
