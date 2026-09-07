"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  BookOpen,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  Sparkles,
  Scale,
  Sun,
  Moon,
  CheckCircle2,
  FileText,
} from "lucide-react";

interface SecurePdfReaderProps {
  isOpen: boolean;
  onClose: () => void;
  book: {
    id: string;
    title: string;
    subject: string;
    pages: string;
    fileSize: string;
  };
  student: {
    name: string;
    rollNumber: string;
    email: string;
  };
}

const CHAPTERS_LIST = [
  { page: 1, title: "Ch 1: Preliminary & Incorporation (§1–§22)" },
  { page: 3, title: "Ch 2: Prospectus & Allotment of Securities (§23–§42)" },
  { page: 6, title: "Ch 3: Share Capital & Debentures (§43–§72)" },
  { page: 9, title: "Ch 4: Management & Administration (§88–§122)" },
  { page: 12, title: "Ch 5: Accounts of Companies & CSR (§128–§138)" },
  { page: 15, title: "Ch 6: Audit & Auditors (§139–§148)" },
  { page: 17, title: "Ch 7: 9-Attempt Solved RTPs/MTPs & Model Answers" },
];

export function SecurePdfReaderModal({
  isOpen,
  onClose,
  book,
  student,
}: SecurePdfReaderProps) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const totalPages = 18;

  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Intercept Copy, Print, and Screenshot key commands
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === "p" || e.key === "s" || e.key === "c" || e.key === "u")) ||
        (e.metaKey && (e.key === "p" || e.key === "s" || e.key === "c" || e.key === "u")) ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault();
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Smooth scroll to chapter/page
  const scrollToPage = (pageNumber: number) => {
    if (pageRefs.current[pageNumber - 1]) {
      pageRefs.current[pageNumber - 1]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs select-none p-2 sm:p-4 animate-in fade-in duration-150"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Main Ultra-Clean Reader Window */}
      <div
        className={`relative w-full max-w-5xl h-[94vh] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border transition-colors ${
          isDarkMode
            ? "bg-[#0b1120] text-slate-100 border-slate-800"
            : "bg-white text-slate-900 border-slate-200"
        }`}
      >
        {/* MINIMAL TOP HEADER */}
        <div
          className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between gap-3 shrink-0 ${
            isDarkMode ? "bg-[#0f172a] border-slate-800" : "bg-white border-slate-100"
          }`}
        >
          {/* Book Title & Student Badge */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] font-mono">
                  Student Edition
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                  • Licensed to {student.name || student.rollNumber}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-serif font-black truncate max-w-xs sm:max-w-md">
                {book.title}
              </h3>
            </div>
          </div>

          {/* Quick Chapter Selector, Zoom, Dark Mode, & Close */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Chapter Jump Dropdown */}
            <div className="relative hidden md:block">
              <select
                onChange={(e) => scrollToPage(Number(e.target.value))}
                className={`text-xs font-semibold py-1.5 pl-3 pr-7 rounded-xl border focus:outline-none focus:border-sky-500 cursor-pointer appearance-none ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-700 text-slate-200"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
                defaultValue=""
              >
                <option value="" disabled>
                  Jump to Chapter...
                </option>
                {CHAPTERS_LIST.map((ch) => (
                  <option key={ch.page} value={ch.page}>
                    {ch.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Zoom Controls */}
            <div
              className={`flex items-center rounded-xl border px-1 py-0.5 text-xs ${
                isDarkMode ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
              }`}
            >
              <button
                onClick={() => setZoomLevel((z) => Math.max(85, z - 15))}
                className="p-1 text-slate-500 hover:text-sky-500"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 text-[10px] font-mono font-bold text-[#0284C7]">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(130, z + 15))}
                className="p-1 text-slate-500 hover:text-sky-500"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-1.5 rounded-xl border transition-colors ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-sky-400"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-red-950/50 transition-colors ml-1"
              aria-label="Close Reader"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CONTINUOUS SCROLLABLE DOCUMENT CANVAS */}
        <div
          ref={containerRef}
          className={`flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8 flex flex-col items-center selection:bg-sky-100 ${
            isDarkMode ? "bg-[#030712]" : "bg-slate-100/70"
          }`}
          style={{ fontSize: `${(zoomLevel / 100) * 14}px` }}
        >
          {/* ALL CHAPTER PAGES IN SEQUENTIAL CONTINUOUS SCROLL */}
          {[
            {
              page: 1,
              chapter: "Chapter 1 • Sectional Codex",
              title: "Companies Act, 2013: Statutory Scheme & Definitions (§1–§22)",
              content: (
                <div className="space-y-4">
                  <p>
                    <strong>1. Separate Legal Entity &amp; Lifting the Veil:</strong> Under Section 9 of the Companies Act 2013, upon registration, the subscribers to the memorandum become a body corporate capable of exercising all corporate functions. In <em>Salomon v. Salomon &amp; Co. Ltd.</em> and the Indian landmark <em>Tata Engineering &amp; Locomotive Co. Ltd. v. State of Bihar</em>, courts reaffirmed that a company is an independent juristic person distinct from its members.
                  </p>
                  <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs space-y-1.5 font-sans">
                    <p className="font-bold text-[#0284C7] dark:text-sky-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Section 8 Companies (Non-Profit Objects):
                    </p>
                    <p className="text-slate-700 dark:text-slate-300">
                      Section 8 Companies are prohibited from distributing dividend to members and must apply profits solely in promoting statutory objects (commerce, art, science, sports, education, research, social welfare, charity, protection of environment).
                    </p>
                  </div>
                </div>
              ),
            },
            {
              page: 2,
              chapter: "Chapter 1 • MOA & AOA Doctrines",
              title: "Doctrine of Ultra Vires & Indoor Management (Turquand's Rule)",
              content: (
                <div className="space-y-4">
                  <p>
                    <strong>2. Doctrine of Ultra Vires:</strong> Any act done beyond the scope of the Memorandum of Association (MOA) is ultra vires the company and is wholly void and incapable of ratification even by unanimous consent of all shareholders (<em>Ashbury Railway Carriage and Iron Co. Ltd. v. Riche</em>).
                  </p>
                  <p>
                    <strong>3. Doctrine of Indoor Management (Turquand's Rule):</strong> Persons dealing with the company are presumed to have read public documents (MOA &amp; AOA) under constructive notice, but are entitled to assume that internal statutory procedures have been regularly performed (<em>Royal British Bank v. Turquand</em>).
                  </p>
                </div>
              ),
            },
            {
              page: 3,
              chapter: "Chapter 2 • Securities Prospectus",
              title: "Prospectus & Allotment of Securities (§23 to §42)",
              content: (
                <div className="space-y-4">
                  <p>
                    <strong>Section 23 Public Offer:</strong> A public company may issue securities: (a) to public through prospectus; (b) through private placement (§42); (c) through rights issue or bonus issue.
                  </p>
                  <p>
                    <strong>Shelf Prospectus [§31]:</strong> Any class or classes of companies, as SEBI may provide by regulations, may file a shelf prospectus with the Registrar at the first offer stage with validity not exceeding <strong>1 year</strong>.
                  </p>
                  <p>
                    <strong>Private Placement [§42]:</strong> Offer made to a select group of persons not exceeding <strong>200 in a financial year</strong> (excluding QIBs and employees under ESOP).
                  </p>
                </div>
              ),
            },
            {
              page: 6,
              chapter: "Chapter 3 • Share Capital & Debentures",
              title: "Section 43 to 72: Share Capital, Sweat Equity & Buy-Back",
              content: (
                <div className="space-y-4">
                  <p>
                    <strong>Section 54 Sweat Equity Shares:</strong> Issued to directors/employees at a discount or for non-cash consideration for know-how or value additions. Requires Special Resolution valid for allotment within 12 months.
                  </p>
                  <p>
                    <strong>Section 68 Buy-Back of Securities:</strong> Buy-back must be authorized by AOA, special resolution (or Board resolution up to 10%), and post buy-back debt-equity ratio shall not exceed <strong>2:1</strong>.
                  </p>
                </div>
              ),
            },
            {
              page: 9,
              chapter: "Chapter 4 • Management & Administration",
              title: "Section 96 & 103: AGM Timelines & Quorum Mandates",
              content: (
                <div className="space-y-4">
                  <p>
                    <strong>Section 96(1) AGM Timelines:</strong> AGM shall be held within <strong>6 months</strong> from FY closing, gap between 2 AGMs &le; <strong>15 months</strong>. First AGM must be within <strong>9 months</strong> from closing of first FY (No ROC extension allowed).
                  </p>
                  <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 font-sans text-xs space-y-1">
                    <p className="font-bold text-[#0284C7] dark:text-sky-400">Public Company Quorum Mandates [§103(1)(a)]:</p>
                    <p>• Up to 1,000 members: <strong>5 members personally present</strong></p>
                    <p>• 1,001 to 5,000 members: <strong>15 members personally present</strong></p>
                    <p>• Exceeding 5,000 members: <strong>30 members personally present</strong></p>
                  </div>
                </div>
              ),
            },
            {
              page: 12,
              chapter: "Chapter 5 • Accounts & CSR",
              title: "Section 135: Corporate Social Responsibility (CSR) Mandates",
              content: (
                <div className="space-y-4">
                  <p>
                    <strong>Statutory CSR Thresholds [§135(1)]:</strong> Every company having Net Worth &ge; <strong>₹500 Cr</strong> OR Turnover &ge; <strong>₹1,000 Cr</strong> OR Net Profit &ge; <strong>₹5 Cr</strong> during the preceding FY shall constitute a CSR Committee.
                  </p>
                  <p>
                    <strong>CSR Mandatory Spending [§135(5)]:</strong> Board must ensure that the company spends at least <strong>2% of average net profits</strong> of 3 preceding financial years on Schedule VII activities.
                  </p>
                </div>
              ),
            },
            {
              page: 15,
              chapter: "Chapter 6 • Audit & Auditors",
              title: "Section 139 & 141: Appointment, Rotation & Disqualifications",
              content: (
                <div className="space-y-4">
                  <p>
                    <strong>Section 139(2) Mandatory Rotation:</strong> Listed and prescribed unlisted companies shall not appoint an individual auditor for more than <strong>1 term of 5 years</strong>, and an audit firm for more than <strong>2 terms of 5 years</strong> (5-year cooling period applies).
                  </p>
                  <p>
                    <strong>Section 141(3) Disqualifications:</strong> A person whose relative is a director or in employment of the company, or holding securities exceeding face value of ₹1,00,000.
                  </p>
                </div>
              ),
            },
            {
              page: 17,
              chapter: "Chapter 7 • RTPs & MTPs Solved",
              title: "5-Pillar Descriptive Model Answers & Scoring Rubrics",
              content: (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-sans space-y-1.5 text-slate-800 dark:text-slate-200">
                    <p className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      5-Pillar Descriptive Answer Framework (6/6 Marks):
                    </p>
                    <p>1. Exact Statutory Section &amp; Rule Citation</p>
                    <p>2. Relevant Substantive Legal Principles &amp; Exceptions</p>
                    <p>3. Application of Law to the Factual Matrix</p>
                    <p>4. Decided Case Law / Secretarial Standard SS-2 Reference</p>
                    <p>5. Explicit Reasoned Legal Conclusion</p>
                  </div>
                </div>
              ),
            },
          ].map((pData) => (
            <div
              key={pData.page}
              ref={(el) => {
                pageRefs.current[pData.page - 1] = el;
              }}
              className={`w-full max-w-3xl rounded-2xl p-6 sm:p-10 font-serif leading-relaxed shadow-sm border relative transition-all ${
                isDarkMode
                  ? "bg-[#0f172a] text-slate-100 border-slate-800"
                  : "bg-white text-slate-900 border-slate-200"
              }`}
            >
              {/* Running Header */}
              <div
                className={`flex items-center justify-between pb-3 mb-4 border-b text-[10px] font-sans ${
                  isDarkMode ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-400"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span className="font-bold uppercase tracking-wider text-[#0284C7]">
                    The Law Kaksha • Master Codex
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-500">
                  Page {pData.page} of {totalPages}
                </span>
              </div>

              {/* Chapter Badge & Title */}
              <div className="mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0284C7] font-sans">
                  {pData.chapter}
                </span>
                <h3 className="text-base sm:text-lg font-black font-serif mt-0.5">
                  {pData.title}
                </h3>
              </div>

              {/* Page Body */}
              <div className="text-xs sm:text-sm leading-relaxed space-y-3">
                {pData.content}
              </div>

              {/* Running Footer */}
              <div
                className={`mt-8 pt-3 border-t flex items-center justify-between text-[10px] font-sans text-slate-400 ${
                  isDarkMode ? "border-slate-800" : "border-slate-100"
                }`}
              >
                <span>Student Digital Edition</span>
                <span>Page {pData.page}</span>
              </div>
            </div>
          ))}
        </div>

        {/* MINIMAL BOTTOM BAR */}
        <div
          className={`px-5 py-2.5 border-t flex items-center justify-between text-xs shrink-0 ${
            isDarkMode ? "bg-[#0f172a] border-slate-800 text-slate-400" : "bg-white border-slate-100 text-slate-500"
          }`}
        >
          <span className="text-[11px] font-medium">
            Continuous Scroll Active • 18 Pages Loaded
          </span>
          <span className="font-mono text-[10px] font-bold text-[#0284C7]">
            License ID: {student.rollNumber}
          </span>
        </div>
      </div>
    </div>
  );
}
