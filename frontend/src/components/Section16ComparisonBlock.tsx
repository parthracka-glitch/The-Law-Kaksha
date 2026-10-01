"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Award, Scale, HelpCircle, BookOpen, ArrowRight, Sparkles, AlertTriangle } from "lucide-react";

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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
    <section className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-600 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-600 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Badge & Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold tracking-wide uppercase">
            <Scale className="w-3.5 h-3.5" />
            <span>ICAI Answer Writing Diagnostic</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Why 82% of CA Foundation Aspirants <br className="hidden sm:inline" />
            Lose Marks in Descriptive Law
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Legal evaluation is not based on general paragraphs. See the exact difference between a{" "}
            <span className="text-rose-400 font-bold">2/6 average answer</span> and{" "}
            <span className="text-emerald-400 font-bold">The Law कक्षा 6/6 structured answer</span> under Section 16(1).
          </p>
        </div>

        {/* Practical Question Prompt Banner */}
        <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-lg backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
                {comparisonData.act}
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">{comparisonData.section}</span>
            </div>
            <span className="text-xs font-bold text-slate-400">{comparisonData.marks}</span>
          </div>

          <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
            <span className="text-amber-400 font-bold mr-1">ICAI Past Exam Problem:</span> {comparisonData.question}
          </p>
        </div>

        {/* Toggle between Side-by-Side and Marking Rubric */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 rounded-xl bg-slate-800 border border-slate-700">
            <button
              onClick={() => setActiveTab("side_by_side")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "side_by_side"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Side-by-Side Answer Comparison
            </button>
            <button
              onClick={() => setActiveTab("rubric")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "rubric"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              ICAI Step-by-Step Mark Rubric
            </button>
          </div>
        </div>

        {/* Content based on Tab */}
        {activeTab === "side_by_side" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* LEFT: 2/6 MARKS ASPIRANT ANSWER */}
            <div className="rounded-3xl bg-slate-800/60 border-2 border-rose-500/30 p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Common Trap</span>
                    <h3 className="text-base font-bold text-white">{comparisonData.aspirantTitle}</h3>
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-extrabold text-sm flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>{comparisonData.aspirantScore}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 text-xs sm:text-sm italic leading-relaxed">
                  {comparisonData.aspirantAnswer}
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Why Evaluator Cuts 4 Marks:</span>
                  </p>
                  <ul className="space-y-2">
                    {comparisonData.aspirantIssues.map((issue, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/60 text-center">
                <span className="text-[11px] text-slate-400">
                  Result: Concept known, but 0 statutory structuring = Low aggregate in Paper 2.
                </span>
              </div>
            </div>

            {/* RIGHT: 6/6 MARKS THE LAW KAKSHA ANSWER */}
            <div className="rounded-3xl bg-gradient-to-b from-blue-950/80 to-slate-900/90 border-2 border-emerald-500/40 p-6 flex flex-col justify-between relative shadow-xl backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>ICAI Suggested Model Standard</span>
                    </span>
                    <h3 className="text-base font-bold text-white">{comparisonData.modelTitle}</h3>
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{comparisonData.modelScore}</span>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm text-slate-200">
                  {comparisonData.modelAnswerSections.map((sec, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="font-bold text-amber-300 text-xs">{sec.heading}</p>
                      {sec.text && <p className="text-slate-300 text-xs leading-relaxed">{sec.text}</p>}
                      {sec.bullets && (
                        <div className="space-y-1 pl-2 border-l-2 border-emerald-500/40 my-1">
                          {sec.bullets.map((b, bIdx) => (
                            <p key={bIdx} className="text-xs text-slate-200 leading-snug">
                              {b}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between gap-3 flex-wrap">
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Exact statutory phrasing taught across all 7 Acts in The Law कक्षा</span>
                </span>
                <a
                  href="/student"
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>Practice Case Studies</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* RUBRIC TAB */
          <div className="bg-slate-800/70 rounded-3xl border border-slate-700 p-6 space-y-4">
            <h3 className="text-base font-bold text-white mb-2">ICAI 6-Marks Step-Wise Marking Rubric (Sec 16(1))</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400">
                    <th className="py-2.5 px-3">Answer Component</th>
                    <th className="py-2.5 px-3">ICAI Weightage</th>
                    <th className="py-2.5 px-3">Evaluator Expectation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {comparisonData.rubricPoints.map((rubric, idx) => (
                    <tr key={idx} className="hover:bg-slate-700/30">
                      <td className="py-3 px-3 font-semibold text-white">{rubric.component}</td>
                      <td className="py-3 px-3 font-bold text-emerald-400 font-mono">{rubric.marks}</td>
                      <td className="py-3 px-3 text-slate-300 text-xs">{rubric.desc}</td>
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
