"use client";

import React, { useState } from "react";
import {
  X,
  BookOpen,
  FileText,
  Download,
  CheckCircle2,
  Building2,
  Sparkles,
  ArrowRight,
  Bookmark,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

interface SampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  bookId?: string;
  bookPrice?: number;
}

export function EnhancedSampleChapterModal({
  isOpen,
  onClose,
  bookTitle,
  bookId = "ca-inter",
  bookPrice = 299,
}: SampleModalProps) {
  const [activeTab, setActiveTab] = useState<"synopsis" | "matrix" | "frequency" | "mains">("synopsis");
  const [zoomLevel, setZoomLevel] = useState(100);
  const { addToCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Window */}
      <div className="relative w-full max-w-4xl bg-white border border-sky-200 rounded-3xl text-slate-900 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-white border-b border-sky-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] shrink-0">
              <Building2 className="w-5 h-5 text-[#0284C7]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                Official CA Law Sample Chapter
              </span>
              <h3 className="text-sm sm:text-base font-serif font-black text-slate-900 line-clamp-1 mt-0.5">
                {bookTitle || "CA Intermediate Corporate & Other Laws Master Codex"}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(90, prev - 10))}
              className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-[#0284C7]"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-[#0284C7] font-bold hidden sm:inline">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(130, prev + 10))}
              className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-[#0284C7]"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 ml-2 transition-colors border border-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-sky-100 bg-slate-50 px-4 overflow-x-auto gap-2 sm:gap-4 text-xs font-semibold">
          {[
            { id: "synopsis", label: "1. Section Synopsis & Rules", icon: FileText },
            { id: "matrix", label: "2. MCA Notification Matrix", icon: Building2 },
            { id: "frequency", label: "3. 9-Attempt ICAI Frequency", icon: Layers },
            { id: "mains", label: "4. ICAI Model Descriptive Answer", icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isActive
                    ? "border-[#0284C7] text-[#0284C7] bg-white font-bold shadow-xs"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Reader Document Content Area */}
        <div
          className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#F8FAFC] space-y-6 relative selection:bg-sky-200 selection:text-slate-900 font-serif"
          style={{ fontSize: `${(zoomLevel / 100) * 14}px` }}
        >
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Building2 className="w-96 h-96 text-[#0284C7]" />
          </div>

          {/* TAB 1: SECTION SYNOPSIS */}
          {activeTab === "synopsis" && (
            <div className="space-y-6 max-w-3xl mx-auto relative z-10 font-sans">
              <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-[#0284C7] font-mono tracking-wider">
                    Chapter VII: Management &amp; Administration (Companies Act 2013)
                  </span>
                  <span className="text-[10px] text-[#0284C7] font-bold bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                    Category A • 12-16 Marks
                  </span>
                </div>
                <h4 className="text-lg font-serif font-black text-slate-900">
                  Section 96 to 103: Annual General Meeting (AGM) &amp; Quorum Mandates
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Complete statutory analysis cross-referenced with Companies (Management &amp; Administration) Rules 2014.
                </p>
              </div>

              {/* Annotated Content Box */}
              <div className="p-6 rounded-2xl bg-white border border-sky-100 shadow-sm space-y-4 text-slate-700 leading-relaxed text-xs sm:text-sm">
                <p>
                  <strong>Section 96(1) AGM Timelines: </strong>
                  Every company (other than OPC) shall hold an AGM within{" "}
                  <mark className="bg-sky-100 text-[#0284C7] px-1.5 py-0.5 rounded font-semibold border border-sky-200">
                    6 months from the closing of the financial year
                  </mark>
                  , and the gap between two AGMs shall not exceed{" "}
                  <mark className="bg-sky-100 text-[#0284C7] px-1.5 py-0.5 rounded font-semibold border border-sky-200">
                    15 months
                  </mark>
                  .
                </p>

                <p>
                  <strong>Section 103(1) Quorum for Public Companies: </strong>
                  Unless articles provide for a larger number: (i) 5 members personally present if members &lt;= 1,000; (ii) 15 members if members &gt; 1,000 but &lt;= 5,000; (iii) 30 members if members &gt; 5,000.
                </p>

                <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs space-y-2">
                  <p className="font-bold text-[#0284C7] font-serif flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
                    The Law Kaksha CA Examiner Margin Anchor:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li>First AGM must be held within 9 months from closing of the first FY (No ROC extension allowed).</li>
                    <li>Subsequent AGMs can receive a maximum 3-month ROC extension for special reasons.</li>
                    <li>Proxies are NOT counted for quorum calculation under Section 103 unless specifically authorized by statute.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MCA NOTIFICATION MATRIX */}
          {activeTab === "matrix" && (
            <div className="space-y-4 max-w-3xl mx-auto font-sans relative z-10">
              <h4 className="text-base font-serif font-bold text-slate-900">
                Companies Act 2013 Key Section Thresholds Matrix (2026 Edition)
              </h4>
              <div className="overflow-x-auto rounded-2xl border border-sky-100 bg-white shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-sky-50 text-[#0284C7] uppercase text-[10px] tracking-wider border-b border-sky-100">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Section &amp; Provision</th>
                      <th className="py-3 px-4 font-semibold">Statutory Trigger</th>
                      <th className="py-3 px-4 font-semibold">ICAI Past Frequency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-900">Section 135: CSR Committee</td>
                      <td className="py-3 px-4 text-slate-600">Net Worth &gt;= ₹500 Cr OR Turnover &gt;= ₹1,000 Cr OR Net Profit &gt;= ₹5 Cr</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-600">9 Out of 10 Attempts (Cat A)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-900">Section 138: Internal Audit</td>
                      <td className="py-3 px-4 text-slate-600">Unlisted Public: Deposits &gt;= 25 Cr, Paid up &gt;= 50 Cr, Borrowings &gt;= 100 Cr, Turnover &gt;= 200 Cr</td>
                      <td className="py-3 px-4 font-mono font-bold text-sky-600">6 Attempts (Cat B)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-900">Section 149(4): Independent Directors</td>
                      <td className="py-3 px-4 text-slate-600">Public Co: Paid up &gt;= 10 Cr OR Turnover &gt;= 100 Cr OR Borrowings &gt; 50 Cr (Min 2 IDs)</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-600">8 Attempts (Cat A)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: 9-ATTEMPT ICAI FREQUENCY */}
          {activeTab === "frequency" && (
            <div className="space-y-4 max-w-3xl mx-auto font-sans relative z-10">
              <h4 className="text-base font-serif font-bold text-slate-900">
                ICAI 9-Attempt Chapter-wise Weightage Analysis
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-sm space-y-2">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    Category A (Must Master • 60% Weightage)
                  </span>
                  <p className="text-xs text-slate-700 font-semibold">
                    Management &amp; Administration (Sec 88-122), Accounts &amp; CSR (Sec 128-138), Audit &amp; Auditors (Sec 139-148).
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-sm space-y-2">
                  <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                    Category B (High Yield • 25% Weightage)
                  </span>
                  <p className="text-xs text-slate-700 font-semibold">
                    General Clauses Act 1897, Share Capital &amp; Debentures (Sec 43-72), Charges (Sec 77-87).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ICAI MODEL DESCRIPTIVE ANSWER */}
          {activeTab === "mains" && (
            <div className="space-y-4 max-w-3xl mx-auto font-sans relative z-10">
              <div className="p-5 rounded-2xl bg-white border border-sky-100 shadow-sm space-y-3 text-xs leading-relaxed">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    ICAI Past Exam Problem (6 Marks Caselet)
                  </span>
                  <span className="font-mono text-[#0284C7] font-semibold">
                    Suggested Model Answer
                  </span>
                </div>
                <p className="text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                  &ldquo;A public company with 2,400 members held its AGM where only 11 members were personally present. The Chairman adjourned the meeting for want of quorum. Examine the validity under Section 103.&rdquo;
                </p>

                <div className="space-y-2 pt-2 text-slate-700">
                  <p>
                    <strong className="text-slate-900">1. Applicable Statutory Provision: </strong>
                    Under Section 103(1)(a)(ii) of the Companies Act 2013, for a public company having more than 1,000 but up to 5,000 members, the mandatory quorum is 15 members personally present.
                  </p>
                  <p>
                    <strong className="text-slate-900">2. Factual Application: </strong>
                    Here, the total membership is 2,400, requiring 15 members. Since only 11 were present within 30 minutes, the statutory quorum requirement is not satisfied.
                  </p>
                  <p>
                    <strong className="text-slate-900">3. Conclusion: </strong>
                    The Chairman&apos;s action in adjourning the AGM to the same day in the next week under Section 103(2) is completely valid in law.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Full 2-Volume Edition:</span>
            <span className="text-xl font-black text-slate-900 font-mono">₹{bookPrice}</span>
            <span className="text-xs text-slate-400 line-through font-mono">₹{bookPrice + 200}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                addToCart({
                  id: bookId,
                  title: bookTitle,
                  format: "pdf",
                  price: bookPrice,
                  originalPrice: bookPrice + 200,
                  category: "CA Law Book",
                });
                onClose();
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unlock Full 2-Volume Edition</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
