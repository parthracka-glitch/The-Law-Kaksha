"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  Lock,
  ArrowRight,
  FileText,
  Sparkles,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export interface SamplePageContent {
  pageNumber: number;
  pageTitle: string;
  badge?: string;
  content: React.ReactNode;
}

export interface BookSampleData {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  price: number;
  originalPrice: number;
  totalPagesInFullBook: number;
  pages: SamplePageContent[];
}

// =========================================================================
// BOOK SAMPLES REGISTRY (Opens strictly the exact book clicked)
// =========================================================================
const BOOK_SAMPLES: Record<string, (price: number) => BookSampleData> = {
  // 1. CA INTER VOLUME 1 (Companies Act & Other Laws)
  "ca-inter": (price) => ({
    id: "ca-inter",
    title: "Volume 1: CA Inter Corporate & Other Laws",
    subtitle: "Companies Act 2013 (Sec 1-148), General Clauses Act & Interpretation",
    category: "CA Intermediate • Paper 2 (Group 1)",
    price: price || 249,
    originalPrice: (price || 249) + 200,
    totalPagesInFullBook: 540,
    pages: [
      {
        pageNumber: 1,
        pageTitle: "Executive Blueprint & ICAI Syllabus Weightage",
        badge: "Syllabus Blueprint",
        content: (
          <div className="space-y-5 font-sans">
            <div className="text-center p-5 rounded-2xl bg-sky-50 border border-sky-100 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] font-mono">
                ICAI 2026-2027 Master Examination Scheme
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
                Volume 1: CA Inter Corporate &amp; Other Laws
              </h2>
              <p className="text-xs text-slate-600 max-w-lg mx-auto">
                Comprehensive Statutory Analysis, 1,200+ Solved MCQs &amp; Scenarios, Bare Act Decoding &amp; Examiner Margin Notes.
              </p>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
                Chapter-Wise ICAI Weightage Matrix:
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-200 text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 font-bold">Chapter &amp; Provisions</th>
                      <th className="py-2.5 px-3 font-bold">Category</th>
                      <th className="py-2.5 px-3 font-bold">Marks</th>
                      <th className="py-2.5 px-3 font-bold">Yield</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">Management &amp; Administration (§88–122)</td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">Cat A</span></td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#0284C7]">14 – 18 M</td>
                      <td className="py-2.5 px-3 text-slate-600">10/10 Attempts</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">Accounts of Companies &amp; CSR (§128–138)</td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">Cat A</span></td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#0284C7]">12 – 16 M</td>
                      <td className="py-2.5 px-3 text-slate-600">Sec 135 CSR Rules</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">Audit &amp; Auditors (§139–148)</td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">Cat A</span></td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#0284C7]">10 – 14 M</td>
                      <td className="py-2.5 px-3 text-slate-600">Rotation &amp; Disqualification</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">General Clauses Act &amp; Interpretation</td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-sky-50 text-[#0284C7] font-bold text-[10px]">Cat B</span></td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#0284C7]">8 – 12 M</td>
                      <td className="py-2.5 px-3 text-slate-600">Mandatory Caselet</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ),
      },
      {
        pageNumber: 2,
        pageTitle: "Section 96 to 103: AGM & Quorum Mandates",
        badge: "Statutory Law",
        content: (
          <div className="space-y-4 text-xs leading-relaxed text-slate-700 font-sans">
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#0284C7]">Chapter VII (§88–122)</span>
                <h3 className="text-sm font-serif font-bold text-slate-900">Section 96 to 103: Annual General Meeting &amp; Quorum</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Cat A</span>
            </div>

            <p><strong>Section 96(1) AGM Timelines:</strong> Every company (other than OPC) must hold an AGM within <strong>6 months</strong> from FY closing, gap between 2 AGMs &le; <strong>15 months</strong>. First AGM must be within <strong>9 months</strong> from closing of first FY.</p>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block">Members &le; 1,000</span>
                <span className="text-base font-black text-[#0284C7] font-mono">5 Present</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block">Members 1,001–5,000</span>
                <span className="text-base font-black text-[#0284C7] font-mono">15 Present</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block">Members &gt; 5,000</span>
                <span className="text-base font-black text-[#0284C7] font-mono">30 Present</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
              <strong>⚠️ Examiner Warning:</strong> Proxies are NOT counted for quorum under Section 103. ROC has no power to extend the time for the first AGM.
            </div>
          </div>
        ),
      },
      {
        pageNumber: 3,
        pageTitle: "MCA Notifications & Rules 18, 20 & 22 Matrix",
        badge: "MCA Rules",
        content: (
          <div className="space-y-4 text-xs font-sans">
            <h3 className="text-sm font-serif font-bold text-slate-900 border-b pb-1 border-slate-200">
              Companies (Management &amp; Administration) Rules 2014 Matrix
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3 font-bold">Rule</th>
                    <th className="py-2 px-3 font-bold">Mandate</th>
                    <th className="py-2 px-3 font-bold">Penalty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px] text-slate-700">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Rule 18 (Electronic Notice)</td>
                    <td className="py-2.5 px-3">Notice via email address registered with company/depository with PDF safeguard.</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-red-600">₹50,000 fine</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Rule 20 (Mandatory E-Voting)</td>
                    <td className="py-2.5 px-3">Listed companies &amp; unlisted public with &ge; 1,000 shareholders.</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-red-600">Voidable</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">Rule 22 (Postal Ballot)</td>
                    <td className="py-2.5 px-3">Alteration of MOA objects, buy-back of shares, change of registered office.</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-red-600">₹1,00,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ),
      },
      {
        pageNumber: 4,
        pageTitle: "9-Attempt Past ICAI Exam Questions & Scoring",
        badge: "ICAI PYQs",
        content: (
          <div className="space-y-3 text-xs font-sans">
            <h3 className="text-sm font-serif font-bold text-slate-900 border-b pb-1 border-slate-200">
              ICAI Question Trends (May 2018 – Nov 2025)
            </h3>
            {[
              { attempt: "Nov 2024 Exam (6 Marks)", topic: "Section 103: Quorum Shortfall & Chairman Postponement", avg: "2.4 / 6 Marks" },
              { attempt: "May 2024 Exam (5 Marks)", topic: "Section 96: ROC Power to Grant Extension for First AGM", avg: "1.8 / 5 Marks" },
              { attempt: "Nov 2023 Exam (6 Marks)", topic: "Section 108: Remote E-Voting Scrutinizer Report Deadlines", avg: "3.1 / 6 Marks" },
            ].map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#0284C7]">{item.attempt}</span>
                  <p className="font-semibold text-slate-900">{item.topic}</p>
                </div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                  Avg: {item.avg}
                </span>
              </div>
            ))}
          </div>
        ),
      },
      {
        pageNumber: 5,
        pageTitle: "5-Pillar Descriptive Model Answer (6/6 Marks)",
        badge: "Model Answer",
        content: (
          <div className="space-y-3 text-xs font-sans">
            <div className="border-b border-slate-200 pb-1.5 flex items-center justify-between">
              <h3 className="text-sm font-serif font-bold text-slate-900">ICAI 6-Mark Problem: Section 103 Quorum</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Score: 6/6</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] italic text-slate-700">
              &ldquo;Apex Industrial Solutions Ltd. (2,400 members) held AGM at 11 AM. By 11:30 AM only 11 members were present. Chairman adjourned to 3 PM same day and passed resolution. Examine validity.&rdquo;
            </div>
            <div className="space-y-1.5 text-slate-800 text-[11px]">
              <p><strong>1. Provision:</strong> Under Sec 103(1)(a)(ii), quorum for 2,400 members is <strong>15 members personally present</strong>.</p>
              <p><strong>2. Adjournment:</strong> Under Sec 103(2), meeting stands adjourned to <strong>same day next week</strong>.</p>
              <p><strong>3. Conclusion:</strong> Chairman&apos;s adjournment to 3:00 PM same day is <strong>illegal &amp; void ab initio</strong>.</p>
            </div>
          </div>
        ),
      },
    ],
  }),

  // 2. CA INTER VOLUME 2 (Solved RTPs, MTPs & Model Answers)
  "ca-book-vol-2": (price) => ({
    id: "ca-book-vol-2",
    title: "Volume 2: Solved RTPs, MTPs & Model Answers",
    subtitle: "9-Attempt Past Solved Papers, Examiner Scoring Rubrics & 1.5-Day LDR Maps",
    category: "CA Intermediate • Paper 2 (Volume 2)",
    price: price || 249,
    originalPrice: (price || 249) + 200,
    totalPagesInFullBook: 490,
    pages: [
      {
        pageNumber: 1,
        pageTitle: "Volume 2: 9-Attempt Solved Compendium Overview",
        badge: "RTP/MTP Overview",
        content: (
          <div className="space-y-5 font-sans">
            <div className="text-center p-5 rounded-2xl bg-sky-50 border border-sky-100 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] font-mono">
                Volume 2 Special Edition
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
                Volume 2: Solved RTPs, MTPs &amp; Model Answers
              </h2>
              <p className="text-xs text-slate-600 max-w-lg mx-auto">
                Step-by-step scoring keywords for 70-mark descriptive, 30-mark case scenario MCQs &amp; 1.5-day last day revision maps.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-slate-900">What's Inside Volume 2:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="font-bold text-[#0284C7]">📚 9-Attempt Solved RTPs &amp; MTPs</p>
                  <p className="text-slate-600 mt-0.5">May 2018 to Nov 2025 examination questions fully answered with ICAI suggested answers.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="font-bold text-[#0284C7]">🎯 Examiner Step-Marking Guidelines</p>
                  <p className="text-slate-600 mt-0.5">Exact keywords and phrase anchors evaluators look for during paper checking.</p>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        pageNumber: 2,
        pageTitle: "Case-Scenario MCQ Drill with Statutory Citations",
        badge: "MCQ Solvers",
        content: (
          <div className="space-y-3 text-xs leading-relaxed text-slate-700 font-sans">
            <h3 className="text-sm font-serif font-bold text-slate-900 border-b pb-1 border-slate-200">
              Integrated 30-Mark Case Scenario MCQ Drill
            </h3>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-[11px]">
              <p className="font-bold text-slate-900">Scenario: Zenex Logistics Ltd. (CSR &amp; Audit Rotation)</p>
              <p>Zenex Logistics Ltd. had Net Worth of ₹450 Cr, Turnover of ₹1,200 Cr and Net Profit of ₹4.2 Cr in FY 2024-25.</p>
              <p><strong>Q1: Is Zenex required to constitute a CSR Committee under Section 135(1)?</strong></p>
              <p className="text-emerald-700 font-semibold">✓ Answer: Yes, because its Turnover exceeds ₹1,000 Crore threshold.</p>
            </div>
          </div>
        ),
      },
      {
        pageNumber: 3,
        pageTitle: "1.5-Day Last Day Revision (LDR) Penalty Chart",
        badge: "LDR Fast Track",
        content: (
          <div className="space-y-3 text-xs font-sans">
            <h3 className="text-sm font-serif font-bold text-slate-900 border-b pb-1 border-slate-200">
              Exam Eve Fast-Track Penalty &amp; Threshold Sheet
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3 font-bold">Section</th>
                    <th className="py-2 px-3 font-bold">Nature of Default</th>
                    <th className="py-2 px-3 font-bold">Monetary Penalty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900">Section 86</td>
                    <td className="py-2 px-3">Failure to register charge</td>
                    <td className="py-2 px-3 font-mono font-bold text-red-600">Company: ₹5,00,000</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900">Section 92(5)</td>
                    <td className="py-2 px-3">Annual Return filing default</td>
                    <td className="py-2 px-3 font-mono font-bold text-red-600">₹10,000 + ₹100/day</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900">Section 137(3)</td>
                    <td className="py-2 px-3">Failure to file Financial Statements</td>
                    <td className="py-2 px-3 font-mono font-bold text-red-600">Company: ₹10,000 + ₹100/day</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ),
      },
      {
        pageNumber: 4,
        pageTitle: "Model Answer Writing Rubric for Mandatory Question 1",
        badge: "Answer Writing",
        content: (
          <div className="space-y-3 text-xs leading-relaxed text-slate-700 font-sans">
            <h3 className="text-sm font-serif font-bold text-slate-900 border-b pb-1 border-slate-200">
              ICAI Examiner Marking Structure (5-Pillar Rubric)
            </h3>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-[11px]">
              <p><strong>Pillar 1:</strong> Exact Section Number &amp; Relevant Statutory Rule (1.5 Marks)</p>
              <p><strong>Pillar 2:</strong> Substantive Legal Principles &amp; Relevant Exceptions (1.5 Marks)</p>
              <p><strong>Pillar 3:</strong> Application of Law to the Case Facts (2.0 Marks)</p>
              <p><strong>Pillar 4:</strong> Explicit Conclusive Opinion (1.0 Mark)</p>
            </div>
          </div>
        ),
      },
      {
        pageNumber: 5,
        pageTitle: "Solved RTP Practice Case Study",
        badge: "RTP Practice",
        content: (
          <div className="space-y-3 text-xs leading-relaxed text-slate-700 font-sans">
            <h3 className="text-sm font-serif font-bold text-slate-900 border-b pb-1 border-slate-200">
              RTP May 2025: Section 138 Internal Audit Applicability
            </h3>
            <p><strong>Problem:</strong> Sunrise Agro Ltd., an unlisted public company, has Paid-up Capital of ₹40 Cr and Turnover of ₹220 Cr. Determine if Internal Audit is mandatory.</p>
            <p className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-semibold text-[11px]">
              ✓ Conclusion: Mandatory under Section 138 read with Rule 13, since Turnover exceeds ₹200 Crore limit.
            </p>
          </div>
        ),
      },
    ],
  }),

  // 3. CA FOUNDATION BUSINESS LAWS
  "ca-foundation": (price) => ({
    id: "ca-foundation",
    title: "CA Foundation Business Laws Master Codex",
    subtitle: "Indian Contract Act 1872, Sale of Goods 1930, Partnership 1932, LLP 2008 & Companies Act",
    category: "CA Foundation • Paper 2",
    price: price || 249,
    originalPrice: (price || 249) + 150,
    totalPagesInFullBook: 420,
    pages: [
      {
        pageNumber: 1,
        pageTitle: "CA Foundation Syllabus & Chapter Blueprint",
        badge: "Foundation Blueprint",
        content: (
          <div className="space-y-5 font-sans">
            <div className="text-center p-5 rounded-2xl bg-sky-50 border border-sky-100 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] font-mono">
                ICAI CA Foundation Pattern
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
                CA Foundation Business Laws Master Codex
              </h2>
              <p className="text-xs text-slate-600 max-w-lg mx-auto">
                Step-by-step case study decoding for Indian Contract Act 1872, Sale of Goods 1930, Partnership 1932 &amp; Companies Act.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3 font-bold">Act / Subject</th>
                    <th className="py-2 px-3 font-bold">Weightage</th>
                    <th className="py-2 px-3 font-bold">Key Chapters</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900">Indian Contract Act, 1872</td>
                    <td className="py-2 px-3 font-mono font-bold text-[#0284C7]">20 – 25 M</td>
                    <td className="py-2 px-3 text-slate-600">Consideration, Free Consent, Breach</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900">Sale of Goods Act, 1930</td>
                    <td className="py-2 px-3 font-mono font-bold text-[#0284C7]">15 – 20 M</td>
                    <td className="py-2 px-3 text-slate-600">Caveat Emptor, Unpaid Seller</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900">Indian Partnership Act, 1932</td>
                    <td className="py-2 px-3 font-mono font-bold text-[#0284C7]">15 – 20 M</td>
                    <td className="py-2 px-3 text-slate-600">Mutual Agency, Minor's Rights</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ),
      },
      {
        pageNumber: 2,
        pageTitle: "Indian Contract Act 1872: Essentials & Case Laws",
        badge: "Contract Act",
        content: (
          <div className="space-y-3 text-xs leading-relaxed text-slate-700 font-sans">
            <h3 className="text-sm font-serif font-bold text-slate-900 border-b pb-1 border-slate-200">
              Section 10: Essentials of a Valid Contract &amp; Precedents
            </h3>
            <p><strong>Section 10 Mandate:</strong> Agreements made with free consent of competent parties for lawful consideration and lawful object.</p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-[11px]">
              <p>• <strong>Balfour v. Balfour (1919):</strong> Social agreements lack legal intention and are not contracts.</p>
              <p>• <strong>Carlill v. Carbolic Smoke Ball Co. (1893):</strong> General offers can be accepted by performance.</p>
            </div>
          </div>
        ),
      },
      {
        pageNumber: 3,
        pageTitle: "Sale of Goods 1930: Caveat Emptor & Exceptions",
        badge: "Sale of Goods",
        content: (
          <div className="space-y-3 text-xs leading-relaxed text-slate-700 font-sans">
            <h3 className="text-sm font-serif font-bold text-slate-900 border-b pb-1 border-slate-200">
              Section 16: Doctrine of Caveat Emptor
            </h3>
            <p><strong>Rule:</strong> &ldquo;Let the buyer beware.&rdquo; Buyer takes risk regarding quality and fitness.</p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-[11px]">
              <p>1. Buyer informs purpose and relies on seller's skill [§16(1)].</p>
              <p>2. Goods bought by description from regular dealer [§16(2)].</p>
            </div>
          </div>
        ),
      },
      {
        pageNumber: 4,
        pageTitle: "Indian Partnership Act 1932: Mutual Agency & Minors",
        badge: "Partnership Act",
        content: (
          <div className="space-y-3 text-xs leading-relaxed text-slate-700 font-sans">
            <h3 className="text-sm font-serif font-bold text-slate-900 border-b pb-1 border-slate-200">
              Section 4 &amp; 30: Cardinal Tests of Partnership
            </h3>
            <p>• <strong>Mutual Agency:</strong> Each partner is both principal and agent (<em>Cox v. Hickman</em>).</p>
            <p>• <strong>Minor (§30):</strong> May be admitted to benefits of firm with unanimous consent; not personally liable.</p>
          </div>
        ),
      },
      {
        pageNumber: 5,
        pageTitle: "Practical Problem Solver on Privity of Contract",
        badge: "Model Solution",
        content: (
          <div className="space-y-3 text-xs leading-relaxed text-slate-700 font-sans">
            <h3 className="text-sm font-serif font-bold text-slate-900 border-b pb-1 border-slate-200">
              Caselet: Doctrine of Privity of Contract &amp; Exceptions
            </h3>
            <p><strong>Rule:</strong> A stranger to a contract cannot sue, but a stranger to consideration can sue (<em>Chinnaya v. Ramayya</em>).</p>
            <p className="p-2.5 rounded-xl bg-slate-50 text-slate-800 text-[11px]">
              Exceptions: Trust/beneficiaries, family settlement, marriage contracts, estoppel/acknowledgment.
            </p>
          </div>
        ),
      },
    ],
  }),

  // 4. CA FINAL CORPORATE & ECONOMIC LAWS
  "ca-final": (price) => ({
    id: "ca-final",
    title: "CA Final Corporate & Economic Laws Master Codex",
    subtitle: "Insolvency & Bankruptcy Code 2016, SEBI LODR, FEMA 1999 & PMLA",
    category: "CA Final • Group 1",
    price: price || 349,
    originalPrice: (price || 349) + 200,
    totalPagesInFullBook: 620,
    pages: [
      {
        pageNumber: 1,
        pageTitle: "CA Final Economic & Securities Laws Blueprint",
        badge: "Final Blueprint",
        content: (
          <div className="space-y-5 font-sans">
            <div className="text-center p-5 rounded-2xl bg-sky-50 border border-sky-100 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] font-mono">
                CA Final Master Edition
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
                CA Final Corporate &amp; Economic Laws
              </h2>
              <p className="text-xs text-slate-600 max-w-lg mx-auto">
                Exhaustive case-scenario solver covering IBC 2016, SEBI LODR, FEMA 1999, PMLA &amp; Companies Act 2013.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3 font-bold">Statute</th>
                    <th className="py-2 px-3 font-bold">Marks</th>
                    <th className="py-2 px-3 font-bold">Core Focus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900">Insolvency &amp; Bankruptcy Code 2016</td>
                    <td className="py-2 px-3 font-mono font-bold text-[#0284C7]">20 – 25 M</td>
                    <td className="py-2 px-3 text-slate-600">CIRP, Moratorium, Waterfall (§53)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900">SEBI (LODR) Regulations 2015</td>
                    <td className="py-2 px-3 font-mono font-bold text-[#0284C7]">15 – 20 M</td>
                    <td className="py-2 px-3 text-slate-600">Board Composition, Audit Committee</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900">FEMA 1999</td>
                    <td className="py-2 px-3 font-mono font-bold text-[#0284C7]">12 – 16 M</td>
                    <td className="py-2 px-3 text-slate-600">Current vs Capital Account, ODI</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ),
      },
      {
        pageNumber: 2,
        pageTitle: "Insolvency & Bankruptcy Code 2016: CIRP Process",
        badge: "IBC 2016",
        content: (
          <div className="space-y-3 text-xs leading-relaxed text-slate-700 font-sans">
            <h3 className="text-sm font-serif font-bold text-slate-900 border-b pb-1 border-slate-200">
              Section 7, 9 &amp; 10: CIRP Initiation &amp; Moratorium
            </h3>
            <p><strong>Threshold:</strong> Minimum default amount is <strong>₹1 Crore</strong>.</p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-[11px]">
              <p>• <strong>Sec 7 (Financial Creditors):</strong> Apply directly upon default.</p>
              <p>• <strong>Sec 9 (Operational Creditors):</strong> Mandatory 10-day demand notice under Sec 8.</p>
              <p>• <strong>Sec 14 (Moratorium):</strong> Absolute stay on recovery &amp; litigation.</p>
            </div>
          </div>
        ),
      },
      {
        pageNumber: 3,
        pageTitle: "SEBI (LODR) Regulations 2015: Board Committees",
        badge: "SEBI LODR",
        content: (
          <div className="space-y-3 text-xs leading-relaxed text-slate-700 font-sans">
            <h3 className="text-sm font-serif font-bold text-slate-900 border-b pb-1 border-slate-200">
              Regulation 17 &amp; 18: Board Governance Mandates
            </h3>
            <p>• Top 1,000 / 2,000 entities: Min 6 directors with at least 1 independent woman director.</p>
            <p>• Audit Committee (Reg 18): Min 3 directors; 2/3rd independent; all financially literate.</p>
          </div>
        ),
      },
      {
        pageNumber: 4,
        pageTitle: "FEMA 1999: Transactions & Overseas Investment",
        badge: "FEMA 1999",
        content: (
          <div className="space-y-3 text-xs leading-relaxed text-slate-700 font-sans">
            <h3 className="text-sm font-serif font-bold text-slate-900 border-b pb-1 border-slate-200">
              Section 5 &amp; 6: Current vs Capital Account Framework
            </h3>
            <p>• Current Account (§5): Permitted unless specifically restricted.</p>
            <p>• Capital Account (§6): Prohibited unless specifically permitted by RBI regulations.</p>
          </div>
        ),
      },
      {
        pageNumber: 5,
        pageTitle: "IBC Section 53 Waterfall Priority Resolution",
        badge: "IBC Waterfall",
        content: (
          <div className="space-y-3 text-xs leading-relaxed text-slate-700 font-sans">
            <h3 className="text-sm font-serif font-bold text-slate-900 border-b pb-1 border-slate-200">
              Section 53: Distribution of Liquidation Proceeds
            </h3>
            <p>1. CIRP &amp; Liquidation costs in full</p>
            <p>2. Workmen dues (24 months) &amp; Secured Creditors pari passu</p>
            <p>3. Employee wages (12 months)</p>
            <p>4. Unsecured financial creditors</p>
          </div>
        ),
      },
    ],
  }),

  // 5. JUDICIARY PRELIMS (BNS/BNSS 2023)
  "judiciary-prelims": (price) => ({
    id: "judiciary-prelims",
    title: "Judiciary (PCS-J) Prelims Reviewer",
    subtitle: "Civil & Criminal Major Acts with parallel BNS/BNSS 2023 Section Index",
    category: "Judiciary PCS-J",
    price: price || 249,
    originalPrice: (price || 249) + 150,
    totalPagesInFullBook: 480,
    pages: [
      {
        pageNumber: 1,
        pageTitle: "Judiciary Prelims Codex Blueprint (BNS, BNSS, BSA Ready)",
        badge: "PCS-J Blueprint",
        content: (
          <div className="space-y-5 text-center p-5 rounded-2xl bg-sky-50 border border-sky-100 font-sans">
            <span className="text-[10px] font-mono font-bold uppercase text-[#0284C7]">2026-2027 Edition</span>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900">Judiciary (PCS-J) Prelims Reviewer</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Civil &amp; Criminal Major Acts with past 10-year question breakdown, Parallel BNS/BNSS 2023 section index, and 3,500+ objective questions.
            </p>
          </div>
        ),
      },
      {
        pageNumber: 2,
        pageTitle: "Bharatiya Nyaya Sanhita (BNS 2023) Parallel Transition",
        badge: "BNS 2023",
        content: (
          <div className="space-y-3 text-xs leading-relaxed text-slate-700 font-sans">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-1 border-slate-200">BNS 2023 vs IPC 1860 Key Section Conversion</h3>
            <p>• Section 103 BNS: Murder (corresponds to Sec 302 IPC).</p>
            <p>• Section 115 BNS: Voluntarily Causing Hurt (corresponds to Sec 323 IPC).</p>
            <p>• Section 303 BNS: Theft &amp; Aggravated Forms (corresponds to Sec 379 IPC).</p>
          </div>
        ),
      },
      {
        pageNumber: 3,
        pageTitle: "BNSS 2023 Procedural Mandates",
        badge: "BNSS 2023",
        content: (
          <div className="space-y-3 text-xs leading-relaxed text-slate-700 font-sans">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-1 border-slate-200">Arrest, Custody &amp; Forensic Procedures</h3>
            <p>• Section 35 BNSS: Mandatory designated police officer for arrest logs.</p>
            <p>• Section 187 BNSS: Police remand in parts across first 40/60 days.</p>
          </div>
        ),
      },
      {
        pageNumber: 4,
        pageTitle: "Bharatiya Sakshya Adhiniyam (BSA 2023) Evidence Law",
        badge: "BSA 2023",
        content: (
          <div className="space-y-3 text-xs leading-relaxed text-slate-700 font-sans">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-1 border-slate-200">Section 61–63: Electronic &amp; Digital Records</h3>
            <p>• Primary vs Secondary electronic evidence standards codified.</p>
            <p>• Mandatory certificate for digital forensics admissibility.</p>
          </div>
        ),
      },
      {
        pageNumber: 5,
        pageTitle: "CPC 1908: Res Judicata & Inherent Powers",
        badge: "CPC 1908",
        content: (
          <div className="space-y-3 text-xs leading-relaxed text-slate-700 font-sans">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-1 border-slate-200">Section 11 &amp; Section 151 Mandates</h3>
            <p>• Res Judicata (§11): Issue directly and substantially in issue in former suit between same parties.</p>
            <p>• Inherent Powers (§151): For ends of justice or to prevent abuse of process of court.</p>
          </div>
        ),
      },
    ],
  }),
};

interface SampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle?: string;
  bookId?: string;
  bookPrice?: number;
}

export function EnhancedSampleChapterModal({
  isOpen,
  onClose,
  bookTitle,
  bookId = "ca-inter",
  bookPrice = 249,
}: SampleModalProps) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const { addToCart } = useCart();

  // Match the exact book clicked
  const normalizedId = bookId.toLowerCase();
  let bookDataBuilder = BOOK_SAMPLES[normalizedId];

  if (!bookDataBuilder) {
    if (normalizedId.includes("foundation")) {
      bookDataBuilder = BOOK_SAMPLES["ca-foundation"];
    } else if (normalizedId.includes("final")) {
      bookDataBuilder = BOOK_SAMPLES["ca-final"];
    } else if (normalizedId.includes("judiciary")) {
      bookDataBuilder = BOOK_SAMPLES["judiciary-prelims"];
    } else if (normalizedId.includes("vol-2") || normalizedId.includes("rtp")) {
      bookDataBuilder = BOOK_SAMPLES["ca-book-vol-2"];
    } else {
      bookDataBuilder = BOOK_SAMPLES["ca-inter"];
    }
  }

  const bookData = bookDataBuilder(bookPrice);
  const displayTitle = bookTitle || bookData.title;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/40 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Main Minimalist Modal Window */}
      <div className="relative w-full max-w-4xl bg-white border border-black/[0.08] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] flex flex-col h-[92vh] overflow-hidden text-[#1D1D1F] animate-in zoom-in-95 duration-200">
        
        {/* MINIMAL TOP HEADER */}
        <div className="px-6 py-4 border-b border-black/[0.05] flex items-center justify-between gap-3 bg-white shrink-0">
          <div className="min-w-0 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black/[0.04] border border-black/[0.06] flex items-center justify-center text-[#0071E3] shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0071E3] font-mono block">
                Official Sample Preview • 6 Continuous Pages
              </span>
              <h3 className="text-xs sm:text-sm font-semibold text-[#1D1D1F] truncate">
                {displayTitle}
              </h3>
            </div>
          </div>

          {/* Controls: Zoom & Close */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Zoom Controls */}
            <div className="flex items-center bg-[#F5F5F7] rounded-full p-0.5 text-xs border border-black/[0.04]">
              <button
                onClick={() => setZoomLevel((z) => Math.max(85, z - 15))}
                className="p-1 text-[#6E6E73] hover:text-[#1D1D1F] rounded-full hover:bg-black/[0.04] cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-[10px] font-mono text-[#6E6E73]">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(130, z + 15))}
                className="p-1 text-[#6E6E73] hover:text-[#1D1D1F] rounded-full hover:bg-black/[0.04] cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors ml-1 cursor-pointer"
              aria-label="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CONTINUOUS VERTICALLY SCROLLABLE 6-PAGE DOCUMENT CANVAS */}
        <div
          className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#F5F5F7] space-y-6 sm:space-y-8 flex flex-col items-center selection:bg-sky-100"
          style={{ fontSize: `${(zoomLevel / 100) * 14}px` }}
        >
          {/* PAGES 1 TO 5 (Content Sheets) */}
          {bookData.pages.map((p) => (
            <div
              key={p.pageNumber}
              className="w-full max-w-3xl bg-white border border-black/[0.08] rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 sm:p-10 font-serif leading-relaxed text-slate-800 relative transition-transform"
            >
              {/* Running Header On Every Page */}
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-black/[0.05] text-[10px] font-sans text-[#86868B]">
                <span className="font-semibold text-[#0071E3] uppercase tracking-wider">
                  The Law Kaksha • {bookData.category}
                </span>
                <span className="font-mono font-medium text-[#86868B]">
                  Page {p.pageNumber} of 6
                </span>
              </div>

              {/* Page Body */}
              {p.content}

              {/* Running Footer On Every Page */}
              <div className="mt-8 pt-4 border-t border-black/[0.05] flex items-center justify-between text-[10px] font-sans text-[#86868B]">
                <span>Official Academic Sample Codex</span>
                <span>Page {p.pageNumber} of 6</span>
              </div>
            </div>
          ))}

          {/* PAGE 6 (FINAL UNLOCK SHEET) */}
          <div className="w-full max-w-3xl bg-white border border-black/[0.08] rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 sm:p-10 font-serif leading-relaxed text-slate-800 relative">
            {/* Header for Page 6 */}
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-black/[0.05] text-[10px] font-sans text-[#86868B]">
              <span className="font-semibold text-[#0071E3] uppercase tracking-wider">
                The Law Kaksha • {bookData.category}
              </span>
              <span className="font-mono font-medium text-[#86868B]">
                Page 6 of 6 (Preview Completed)
              </span>
            </div>

            {/* Page 6 Unlock Card */}
            <div className="text-center py-6 space-y-4 font-sans">
              <div className="w-12 h-12 rounded-full bg-[#0071E3]/[0.08] border border-[#0071E3]/20 flex items-center justify-center text-[#0071E3] mx-auto">
                <Lock className="w-5 h-5" />
              </div>

              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0071E3] bg-[#0071E3]/[0.08] px-3 py-1 rounded-full border border-[#0071E3]/20">
                  End of Free Sample Pages (6 / {bookData.totalPagesInFullBook} Pages)
                </span>
                <h3 className="text-xl sm:text-2xl font-semibold text-[#1D1D1F] mt-2.5">
                  Unlock All {bookData.totalPagesInFullBook} Pages of {displayTitle}
                </h3>
                <p className="text-xs text-[#6E6E73] max-w-md mx-auto mt-1 leading-relaxed">
                  Get instant lifetime access to the full book with 1,200+ case scenarios, solved MCQs, 9-attempt past papers, and high-res DRM reader sync.
                </p>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => {
                    addToCart({
                      id: bookData.id,
                      title: displayTitle,
                      format: "pdf",
                      price: bookData.price,
                      originalPrice: bookData.originalPrice,
                      category: "CA Law Book",
                    });
                    onClose();
                  }}
                  className="px-6 py-3 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium flex items-center gap-2 shadow-[0_2px_8px_rgba(0,113,227,0.25)] transition-all active:scale-95 cursor-pointer"
                >
                  <span>Unlock Full Edition • ₹{bookData.price}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Footer for Page 6 */}
            <div className="mt-8 pt-4 border-t border-black/[0.05] flex items-center justify-between text-[10px] font-sans text-[#86868B]">
              <span>The Law Kaksha DRM Protected</span>
              <span>Page 6 of 6</span>
            </div>
          </div>
        </div>

        {/* MINIMAL BOTTOM ACTION BAR */}
        <div className="px-6 py-3.5 border-t border-black/[0.05] bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#6E6E73]">Full 2-Volume Edition:</span>
            <span className="text-lg font-bold text-[#1D1D1F]">₹{bookData.price}</span>
            <span className="text-xs text-[#86868B] line-through">₹{bookData.originalPrice}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                addToCart({
                  id: bookData.id,
                  title: displayTitle,
                  format: "pdf",
                  price: bookData.price,
                  originalPrice: bookData.originalPrice,
                  category: "CA Law Book",
                });
                onClose();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Unlock Full {bookData.totalPagesInFullBook} Pages (₹{bookData.price})</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
