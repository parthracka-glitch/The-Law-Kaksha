"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  Scale,
  FileText,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

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
  const { addToCart } = useCart();

  const currentCase =
    MAINS_CASES.find((c) => c.id === activeCaseId) || MAINS_CASES[0];

  return (
    <section id="mains-inspector" className="py-8 sm:py-10 bg-white text-slate-800 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] font-serif block mb-1">
            Answer Writing Evaluation
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
            Mains Answer Architecture
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
            Compare average answers with The Law Kaksha 5-pillar model solution to understand examiner scoring rubrics.
          </p>
        </div>

        {/* Topic Selector Tabs */}
        <div className="flex justify-center gap-2 mb-5">
          {MAINS_CASES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCaseId(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
                activeCaseId === c.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{c.subject}</span>
            </button>
          ))}
        </div>

        {/* Question Prompt Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-5">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-800">Prompt ({currentCase.marks})</span>
            <span className="text-[11px] font-mono">{currentCase.topic}</span>
          </div>
          <p className="text-xs sm:text-sm font-serif font-medium text-slate-900 leading-relaxed">
            &ldquo;{currentCase.question}&rdquo;
          </p>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* LEFT: AVERAGE ANSWER */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-rose-700 uppercase">Average Aspirant Draft</span>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                  {currentCase.averageAnswer.score}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 text-xs text-slate-600 leading-relaxed font-sans whitespace-pre-line">
                {currentCase.averageAnswer.text}
              </div>

              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Examiner Critique:</p>
                {currentCase.averageAnswer.critiquePoints.map((critique, idx) => (
                  <p key={idx} className="text-xs text-rose-700">
                    {critique}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: THE LAW KAKSHA MODEL SOLUTION */}
          <div className="rounded-2xl bg-white border border-sky-200 p-6 flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                <span className="text-xs font-bold text-[#0284C7] uppercase">The Law Kaksha Model Solution</span>
                <span className="text-xs font-bold text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {currentCase.lawKakshaAnswer.score}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-sky-50/40 border border-sky-100">
                  <strong className="text-slate-900 block mb-0.5">1. Formulated Legal Issue:</strong>
                  <p className="text-slate-700">{currentCase.lawKakshaAnswer.issue}</p>
                </div>

                <div className="p-3 rounded-lg bg-sky-50/40 border border-sky-100">
                  <strong className="text-slate-900 block mb-0.5">2. Statutory Framework:</strong>
                  <p className="text-slate-700">{currentCase.lawKakshaAnswer.statutoryBasis}</p>
                </div>

                <div className="p-3 rounded-lg bg-sky-50/40 border border-sky-100">
                  <strong className="text-slate-900 block mb-0.5">3. Supreme Court Precedents:</strong>
                  {currentCase.lawKakshaAnswer.landmarkCases.map((cs, idx) => (
                    <p key={idx} className="text-slate-700">
                      <strong>{cs.name}</strong> <span className="font-mono text-[10px] text-slate-500">({cs.citation})</span>: {cs.rule}
                    </p>
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-sky-50/40 border border-sky-100">
                  <strong className="text-slate-900 block mb-0.5">4. Conclusion &amp; Ruling:</strong>
                  <p className="text-slate-700">{currentCase.lawKakshaAnswer.conclusion}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
