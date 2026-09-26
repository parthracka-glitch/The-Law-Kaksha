"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  FileText,
} from "lucide-react";

interface ModelAnswerCase {
  id: string;
  subject: string;
  topic: string;
  question: string;
  marks: string;
  averageAnswer: {
    text: string;
    critiquePoints: string[];
    score: string;
  };
  lawKakshaAnswer: {
    issue: string;
    statutoryBasis: string;
    landmarkCases: { name: string; citation: string; rule: string }[];
    factualApplication: string;
    conclusion: string;
    examinerRemarks: string;
    score: string;
  };
}

const MAINS_CASES: ModelAnswerCase[] = [
  {
    id: "ca-inter-corp",
    subject: "CA Inter: Companies Act 2013",
    topic: "Section 103 Quorum & Chairman Adjournment Power",
    question:
      "A public company having 2,400 members scheduled its Annual General Meeting on 30th Sept at 11:00 AM. By 11:30 AM, only 11 members were personally present. The Chairman adjourned the meeting to the same day in the next week. A shareholder challenges this adjournment in court claiming proxies were present. Examine the validity under Section 103. (6 Marks - ICAI Past Paper)",
    marks: "6 Marks",
    averageAnswer: {
      text: `In this case the company has 2,400 members and only 11 members came to the AGM on time. Under Companies Act, a public company needs enough members to start the meeting.
      
Since there were 11 members, the Chairman can adjourn the meeting because quorum was not there. Proxies are not allowed. So Chairman's decision is valid in law.`,
      critiquePoints: [
        "❌ Failed to cite exact Section 103(1)(a)(ii) statutory threshold (15 members for 1,001–5,000 members).",
        "❌ Missed mentioning the mandatory 30-minute statutory waiting window under Section 103(2).",
        "❌ Failed to state the rule that proxies are excluded under Section 103(1) unless specifically permitted.",
      ],
      score: "2.0 / 6 Marks",
    },
    lawKakshaAnswer: {
      issue:
        "Whether the Chairman's action in adjourning the AGM is legally sustainable under Section 103(1) and Section 103(2) of the Companies Act, 2013 for lack of statutory quorum.",
      statutoryBasis:
        "Under Section 103(1)(a)(ii), the mandatory quorum for a public company having more than 1,000 but up to 5,000 members is 15 members personally present within 30 minutes from the appointed time. Proxies are excluded from quorum calculation.",
      landmarkCases: [
        {
          name: "Companies (Management & Administration) Rules, 2014",
          citation: "Rule 18 / MCA Guidelines",
          rule: "Proxies cannot be counted towards quorum in general meetings.",
        },
      ],
      factualApplication:
        "Total membership is 2,400 (triggering the 15-member requirement). Since only 11 members were personally present within 30 minutes, statutory quorum was deficit.",
      conclusion:
        "Held: The Chairman's adjournment of the meeting to the same day, time, and place in next week under Section 103(2) is completely valid and legally unassailable.",
      examinerRemarks:
        "⭐ 6/6 ICAI Ranker Model: Precise statutory section, mathematical threshold bracket, and airtight 3-pillar conclusion.",
      score: "6.0 / 6 Marks",
    },
  },
  {
    id: "ca-final-ibc",
    subject: "CA Final: IBC 2016 & Corporate Laws",
    topic: "Section 7 CIRP Trigger & Financial Debt Default",
    question:
      "A financial creditor filed a Section 7 CIRP application before the NCLT against a Corporate Debtor for default of ₹1.2 Crore. The Corporate Debtor claims a pre-existing dispute regarding interest calculation. Advise the Adjudicating Authority (NCLT) on admission under the Insolvency and Bankruptcy Code, 2016. (8 Marks)",
    marks: "8 Marks",
    averageAnswer: {
      text: `Under IBC 2016, if there is a default of more than 1 Crore, the financial creditor can go to NCLT under Section 7. The debtor says there is a dispute on interest. 
      
However, for financial creditors, pre-existing dispute does not matter like Section 9. So NCLT will admit the CIRP application.`,
      critiquePoints: [
        "❌ Missed citing Innoventive Industries v. ICICI Bank landmark Supreme Court ratio.",
        "❌ Did not explain the statutory distinction between Section 7 (Financial) vs Section 9 (Operational Creditor).",
        "❌ Failed to mention the 14-day statutory admission/rejection window under Section 7(4).",
      ],
      score: "3.0 / 8 Marks",
    },
    lawKakshaAnswer: {
      issue:
        "Whether the defense of 'pre-existing dispute' is available to a Corporate Debtor against a Section 7 CIRP application by a Financial Creditor under IBC 2016.",
      statutoryBasis:
        "Under Section 7(5)(a) of IBC 2016, the NCLT must ascertain default. Unlike Section 9 (Operational Debt), 'pre-existing dispute' is not a ground to reject a Section 7 petition if debt and default are established.",
      landmarkCases: [
        {
          name: "Innoventive Industries Ltd. v. ICICI Bank",
          citation: "(2018) 1 SCC 407",
          rule: "The moment the Adjudicating Authority is satisfied that a default has occurred, the Section 7 application must be admitted.",
        },
      ],
      factualApplication:
        "The debt is ₹1.2 Cr (exceeding the ₹1 Cr Section 4 threshold) and default is evidenced by NESL information utility records. Dispute on quantum of interest cannot stall admission.",
      conclusion:
        "Held: The NCLT is statutorily bound to admit the Section 7 application and declare a Moratorium under Section 14 IBC.",
      examinerRemarks:
        "⭐ Full Marks Model: Perfect Supreme Court citation, statutory threshold check, and exact NCLT procedure.",
      score: "8.0 / 8 Marks",
    },
  },
];

export function MainsAnswerInspector() {
  const [activeCaseId, setActiveCaseId] = useState<string>("ca-inter-corp");

  const currentCase =
    MAINS_CASES.find((c) => c.id === activeCaseId) || MAINS_CASES[0];

  return (
    <section id="mains-inspector" className="py-12 sm:py-16 bg-white text-slate-800 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100/80 text-[11px] font-semibold tracking-wide uppercase text-[#0284C7] mb-3">
            <Sparkles className="w-3 h-3 text-[#0284C7]" />
            ICAI Scoring Rubric Matrix
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
            Mains Answer Architecture
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
            See the exact difference between an average draft and a rank-grade 4-pillar model solution evaluated against ICAI examiner rubrics.
          </p>
        </div>

        {/* Minimalist Segmented Tabs */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 bg-slate-100/90 rounded-2xl border border-slate-200/60 shadow-xs">
            {MAINS_CASES.map((c) => {
              const isActive = activeCaseId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCaseId(c.id)}
                  className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
                >
                  <FileText className={`w-3.5 h-3.5 ${isActive ? "text-[#0284C7]" : "text-slate-400"}`} />
                  <span>{c.subject}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Prompt Card */}
        <div className="rounded-2xl bg-slate-50/70 border border-slate-200/80 p-5 sm:p-6 mb-8 transition-colors">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200/60">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                ICAI Exam Problem
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-800 text-[11px] font-semibold">
                {currentCase.marks}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-white/80 px-2.5 py-1 rounded-md border border-slate-200/60">
              {currentCase.topic}
            </span>
          </div>
          <blockquote className="border-l-2 border-slate-300 pl-3.5 my-1">
            <p className="text-xs sm:text-sm text-slate-800 font-serif leading-relaxed italic">
              &ldquo;{currentCase.question}&rdquo;
            </p>
          </blockquote>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* LEFT: AVERAGE ASPIRANT DRAFT */}
          <div className="rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-[10px]">
                    Comparative Draft
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    Average Aspirant Draft
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold">
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span>{currentCase.averageAnswer.score}</span>
                </div>
              </div>

              {/* Draft text */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 text-xs text-slate-600 leading-relaxed font-sans whitespace-pre-line">
                {currentCase.averageAnswer.text}
              </div>

              {/* Examiner Critique List */}
              <div className="space-y-2.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
                  Examiner Critique &amp; Negative Deductions:
                </span>
                <div className="space-y-2">
                  {currentCase.averageAnswer.critiquePoints.map((critique, idx) => {
                    const cleanText = critique.replace(/^❌\s*/, "");
                    return (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{cleanText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: THE LAW KAKSHA MODEL SOLUTION */}
          <div className="rounded-2xl bg-gradient-to-b from-sky-50/30 via-white to-white border border-sky-200/80 p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:border-sky-300 transition-colors">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] block text-[10px]">
                    ICAI Ranker Framework
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    The Law Kaksha Model Solution
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{currentCase.lawKakshaAnswer.score}</span>
                </div>
              </div>

              {/* 4-Pillar Breakdown */}
              <div className="space-y-2.5 text-xs">
                
                {/* Pillar 1 */}
                <div className="p-3 rounded-xl bg-white border border-slate-200/70 shadow-2xs hover:border-sky-200 transition-colors">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-4 h-4 rounded-full bg-sky-100 text-[#0284C7] text-[10px] font-bold flex items-center justify-center">
                      1
                    </span>
                    <strong className="text-slate-900 font-semibold">Formulated Legal Issue</strong>
                  </div>
                  <p className="text-slate-600 pl-5.5 leading-relaxed">
                    {currentCase.lawKakshaAnswer.issue}
                  </p>
                </div>

                {/* Pillar 2 */}
                <div className="p-3 rounded-xl bg-white border border-slate-200/70 shadow-2xs hover:border-sky-200 transition-colors">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-4 h-4 rounded-full bg-sky-100 text-[#0284C7] text-[10px] font-bold flex items-center justify-center">
                      2
                    </span>
                    <strong className="text-slate-900 font-semibold">Statutory Framework</strong>
                  </div>
                  <p className="text-slate-600 pl-5.5 leading-relaxed">
                    {currentCase.lawKakshaAnswer.statutoryBasis}
                  </p>
                </div>

                {/* Pillar 3 */}
                <div className="p-3 rounded-xl bg-white border border-slate-200/70 shadow-2xs hover:border-sky-200 transition-colors">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-4 h-4 rounded-full bg-sky-100 text-[#0284C7] text-[10px] font-bold flex items-center justify-center">
                      3
                    </span>
                    <strong className="text-slate-900 font-semibold">Supreme Court Precedents &amp; Rules</strong>
                  </div>
                  <div className="pl-5.5 space-y-1">
                    {currentCase.lawKakshaAnswer.landmarkCases.map((cs, idx) => (
                      <p key={idx} className="text-slate-600 leading-relaxed">
                        <strong className="text-slate-800">{cs.name}</strong>{" "}
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1 py-0.5 rounded">
                          {cs.citation}
                        </span>
                        : {cs.rule}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Pillar 4 */}
                <div className="p-3 rounded-xl bg-sky-50/50 border border-sky-200/80 shadow-2xs">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-4 h-4 rounded-full bg-[#0284C7] text-white text-[10px] font-bold flex items-center justify-center">
                      4
                    </span>
                    <strong className="text-slate-900 font-semibold">Conclusion &amp; Ruling</strong>
                  </div>
                  <p className="text-slate-700 pl-5.5 leading-relaxed font-medium">
                    {currentCase.lawKakshaAnswer.conclusion}
                  </p>
                </div>

              </div>

              {/* Examiner Remarks Note */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-600 flex items-center gap-2">
                <span className="text-amber-500 font-bold">★</span>
                <span>{currentCase.lawKakshaAnswer.examinerRemarks.replace(/^⭐\s*/, "")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
