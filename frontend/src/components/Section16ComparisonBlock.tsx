"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Award, Scale, HelpCircle, BookOpen, ArrowRight, Sparkles, AlertTriangle } from "lucide-react";
import { getApiBaseUrl } from "@/lib/api";

export function Section16ComparisonBlock() {
  const [activeTab, setActiveTab] = useState<"side_by_side" | "rubric">("side_by_side");
  const [comparisonData, setComparisonData] = useState({
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
      },
      {
        heading: "2. The 3-Prong Statutory Test",
        bullets: [
          "(a) Communication of Purpose: The buyer, expressly or by implication, makes known to the seller the particular purpose for which goods are required.",
          "(b) Reliance on Skill/Judgment: The buyer relies on the seller's skill or judgment.",
          "(c) Course of Seller's Business: The goods are of a description which it is in the course of the seller's business to supply (whether manufacturer or trader).",
        ],
      },
      {
        heading: "3. Landmark Case Precedent: Priest v. Last (1903)",
        text: "Where goods are capable of only one normal use (e.g., a hot water bottle), disclosure of purpose is made by implication. The seller is liable for latent defects even if no express statement was given.",
      },
      {
        heading: "4. Statutory Proviso Exception",
        text: "Provided that in the case of a contract for the sale of a specified article under its patent or other trade name, there is no implied condition as to its fitness for any particular purpose.",
      },
    ],
    rubricPoints: [
      { component: "Statutory 3-Prong Test Citation", marks: "2.0 Marks", desc: "Explicitly citing (a) Communication (express/implied), (b) Reliance on skill, (c) Course of business." },
      { component: "Application & Landmark Precedent", marks: "2.0 Marks", desc: "Citing Priest v. Last with reasoning on purpose by necessary implication." },
      { component: "Section 16(1) Proviso (Patent/Trade Name)", marks: "1.0 Marks", desc: "Highlighting the statutory exception where Caveat Emptor still applies." },
      { component: "Legal Structuring & Statutory Phrasing", marks: "1.0 Marks", desc: "Point-wise presentation aligning with ICAI Evaluation Guidelines." },
    ],
  });

  const API_URL = getApiBaseUrl();

  useEffect(() => {
    fetch(`${API_URL}/api/public/section16-comparison`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.comparison) {
          // merge if server has customized version
          setComparisonData((prev) => ({
            ...prev,
            ...data.comparison,
          }));
        }
      })
      .catch(() => {});
  }, [API_URL]);

  return (
    <section className="py-16 sm:py-20 bg-[#AED7E9] text-[#221D1D] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Badge & Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#98C5D8] text-[#221D1D] text-xs font-semibold tracking-wide uppercase shadow-xs">
            <Scale className="w-3.5 h-3.5 text-[#4B8097]" />
            <span>ICAI Answer Writing Diagnostic</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#221D1D] font-serif">
            Why 82% of CA Foundation Aspirants <br className="hidden sm:inline" />
            Lose Marks in Descriptive Law
          </h2>

          <p className="text-sm sm:text-base text-[#4D433F] leading-relaxed font-sans">
            Legal evaluation is not based on general paragraphs. See the exact difference between an average answer and{" "}
            <span className="underline decoration-[#BFAFE5] decoration-2 underline-offset-4 font-bold text-[#221D1D]">The Law कक्षा 6/6 structured answer</span> under Section 16(1).
          </p>
        </div>

        {/* Practical Question Prompt Banner */}
        <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-white text-[#221D1D] border border-[#E7E4E7] shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C4E1EC]/60 text-[#221D1D] text-xs font-semibold border border-[#AED7E9]">
                {comparisonData.act}
              </span>
              <span className="text-xs font-mono font-bold text-[#2B5B70] bg-[#AED7E9]/40 border border-[#AED7E9] px-2 py-0.5 rounded-full">{comparisonData.section}</span>
            </div>
            <span className="text-xs font-semibold text-[#77716E]">{comparisonData.marks}</span>
          </div>

          <p className="text-sm sm:text-base font-semibold text-[#221D1D] leading-relaxed">
            <span className="text-[#C35F3B] font-bold mr-1">ICAI Past Exam Problem:</span> {comparisonData.question}
          </p>
        </div>

        {/* Toggle between Side-by-Side and Marking Rubric */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex max-w-full overflow-x-auto no-scrollbar scrollbar-none p-1 rounded-2xl bg-white/60 border border-[#98C5D8] shadow-xs">
            <button
              onClick={() => setActiveTab("side_by_side")}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === "side_by_side"
                  ? "bg-white text-[#221D1D] shadow-xs"
                  : "text-[#4D433F] hover:text-[#221D1D]"
              }`}
            >
              <span className="hidden sm:inline">Side-by-Side </span>Comparison
            </button>
            <button
              onClick={() => setActiveTab("rubric")}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === "rubric"
                  ? "bg-white text-[#221D1D] shadow-xs"
                  : "text-[#4D433F] hover:text-[#221D1D]"
              }`}
            >
              <span className="hidden sm:inline">ICAI Step </span>Mark Rubric
            </button>
          </div>
        </div>

        {/* Content based on Tab */}
        {activeTab === "side_by_side" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* LEFT: 2/6 MARKS ASPIRANT ANSWER */}
            <div className="rounded-3xl bg-[#F7F7F5] border border-[#F4C5C0] p-6 flex flex-col justify-between relative text-[#221D1D] shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#E7E4E7] pb-3">
                  <div>
                    <span className="text-[11px] font-semibold text-[#C35F3B] uppercase tracking-wider">Common Trap</span>
                    <h3 className="text-base font-bold text-[#221D1D]">{comparisonData.aspirantTitle}</h3>
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-[#F4C5C0]/60 border border-[#F4C5C0] text-[#C35F3B] font-extrabold text-sm flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-[#C35F3B]" />
                    <span>{comparisonData.aspirantScore}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E7E4E7] text-[#4D433F] text-xs sm:text-sm italic leading-relaxed">
                  {comparisonData.aspirantAnswer}
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#C35F3B] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#C35F3B]" />
                    <span>Why Evaluator Cuts 4 Marks:</span>
                  </p>
                  <ul className="space-y-2">
                    {comparisonData.aspirantIssues.map((issue, idx) => (
                      <li key={idx} className="text-xs text-[#4D433F] flex items-start gap-2">
                        <XCircle className="w-3.5 h-3.5 text-[#C35F3B] shrink-0 mt-0.5" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E7E4E7] text-center">
                <span className="text-[11px] text-[#77716E]">
                  Result: Concept known, but 0 statutory structuring = Low aggregate in Paper 2.
                </span>
              </div>
            </div>

            {/* RIGHT: 6/6 MARKS THE LAW KAKSHA ANSWER */}
            <div className="rounded-3xl bg-white border-2 border-[#AED7E9] p-6 flex flex-col justify-between relative shadow-md text-[#221D1D]">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#E7E4E7] pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#4B8097] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#4B8097]" />
                      <span>ICAI Suggested Model Standard</span>
                    </span>
                    <h3 className="text-base font-bold text-[#221D1D]">{comparisonData.modelTitle}</h3>
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-[#AED7E9]/40 border border-[#AED7E9] text-[#221D1D] font-extrabold text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#4B8097]" />
                    <span>{comparisonData.modelScore}</span>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm text-[#4D433F]">
                  {comparisonData.modelAnswerSections.map((sec, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="font-bold text-[#221D1D] text-xs">{sec.heading}</p>
                      {sec.text && <p className="text-[#4D433F] text-xs leading-relaxed">{sec.text}</p>}
                      {sec.bullets && (
                        <div className="space-y-1 pl-2 border-l-2 border-[#AED7E9] my-1">
                          {sec.bullets.map((b, bIdx) => (
                            <p key={bIdx} className="text-xs text-[#4D433F] leading-snug">
                              {b}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E7E4E7] flex items-center justify-between gap-3 flex-wrap">
                <span className="text-[11px] text-[#4B8097] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Exact statutory phrasing taught across all 7 Acts</span>
                </span>
                <a
                  href="/student"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-semibold transition-colors shadow-xs"
                >
                  <span>Practice Case Studies</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* RUBRIC TAB */
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E7E4E7] p-4 sm:p-6 space-y-4 text-[#221D1D] shadow-md">
            <h3 className="text-base font-bold text-[#221D1D] mb-2">ICAI 6-Marks Step-Wise Marking Rubric (Sec 16(1))</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm min-w-[520px]">
                <thead>
                  <tr className="border-b border-[#E7E4E7] text-[#77716E]">
                    <th className="py-2.5 px-3 font-semibold">Answer Component</th>
                    <th className="py-2.5 px-3 font-semibold">ICAI Weightage</th>
                    <th className="py-2.5 px-3 font-semibold">Evaluator Expectation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E4E7]">
                  {comparisonData.rubricPoints.map((rubric, idx) => (
                    <tr key={idx} className="hover:bg-[#F7F7F5]">
                      <td className="py-3 px-3 font-semibold text-[#221D1D]">{rubric.component}</td>
                      <td className="py-3 px-3 font-bold text-[#4B8097] font-mono">{rubric.marks}</td>
                      <td className="py-3 px-3 text-[#4D433F] text-xs">{rubric.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
