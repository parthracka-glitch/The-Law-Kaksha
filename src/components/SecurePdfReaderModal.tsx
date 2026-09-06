"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  BookOpen,
  Lock,
  Shield,
  Search,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Sparkles,
  Scale,
  FileText,
  AlertTriangle,
  Highlighter,
  Sun,
  Moon,
  Layers,
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

export function SecurePdfReaderModal({
  isOpen,
  onClose,
  book,
  student,
}: SecurePdfReaderProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 18;
  const [zoomLevel, setZoomLevel] = useState(100);
  const [themeMode, setThemeMode] = useState<"light" | "sepia" | "dark">("light");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [bookmarkedPages, setBookmarkedPages] = useState<number[]>([1, 4]);
  const [activeTab, setActiveTab] = useState<"toc" | "search" | "notes">("toc");
  const [antiPiracyAlert, setAntiPiracyAlert] = useState(false);

  // Dynamic live watermark details
  const sessionIp = "103.21.144.92";
  const timestamp = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Intercept Copy, Print, and Screenshot key commands & enable smooth keyboard reading
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Intercept Ctrl+P, Ctrl+S, Ctrl+C, Ctrl+U, PrintScreen
      if (
        (e.ctrlKey && (e.key === "p" || e.key === "s" || e.key === "c" || e.key === "u")) ||
        (e.metaKey && (e.key === "p" || e.key === "s" || e.key === "c" || e.key === "u")) ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault();
        setAntiPiracyAlert(true);
        setTimeout(() => setAntiPiracyAlert(false), 3500);
        return;
      }

      // Smooth keyboard reading navigation
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setCurrentPage((p) => Math.max(1, p - 1));
      } else if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        setCurrentPage((p) => Math.min(totalPages, p + 1));
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleBookmark = (page: number) => {
    if (bookmarkedPages.includes(page)) {
      setBookmarkedPages(bookmarkedPages.filter((p) => p !== page));
    } else {
      setBookmarkedPages([...bookmarkedPages, page]);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md select-none p-2 sm:p-4"
      onContextMenu={(e) => {
        e.preventDefault();
        setAntiPiracyAlert(true);
        setTimeout(() => setAntiPiracyAlert(false), 3500);
      }}
    >
      {/* Anti-Piracy Security Toast */}
      {antiPiracyAlert && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-60 bg-red-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-red-400 flex items-center gap-3 text-xs font-bold animate-in zoom-in-95">
          <AlertTriangle className="w-5 h-5 text-white shrink-0" />
          <div>
            <p className="font-serif uppercase tracking-wider">DRM Copyright Shield Active</p>
            <p className="text-[11px] text-red-100 font-normal">
              Copying, printing, and file extraction are strictly prohibited. Your session is cryptographically watermarked with ID {student.rollNumber}.
            </p>
          </div>
        </div>
      )}

      {/* Main DRM Reader Window */}
      <div className="relative w-full max-w-6xl h-[94vh] bg-white border border-sky-200 rounded-3xl text-slate-900 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Header & Security Banner */}
        <div className="px-4 py-3 bg-white border-b border-sky-100 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] shrink-0">
              <BookOpen className="w-5 h-5 text-[#0284C7]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>IN-APP DRM • DEVICE 1 OF 2</span>
                </span>
                <span className="text-[11px] text-[#0284C7] font-mono hidden sm:inline font-semibold">
                  LICENSED TO: {student.rollNumber}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-serif font-black text-slate-900 truncate mt-0.5">
                {book.title}
              </h3>
            </div>
          </div>

          {/* Reader Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Toggle */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setThemeMode("light")}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  themeMode === "light" ? "bg-white text-[#0284C7] font-bold shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
                title="Pristine Light Mode"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setThemeMode("sepia")}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  themeMode === "sepia" ? "bg-[#fbf0d9] text-[#2b2416] font-bold shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
                title="Eye-Care Sepia"
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setThemeMode("dark")}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  themeMode === "dark" ? "bg-slate-900 text-sky-400 font-bold shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
                title="Night Mode"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center bg-sky-50 px-2 py-1 rounded-xl border border-sky-200 text-xs">
              <button
                onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
                className="p-1 text-slate-500 hover:text-[#0284C7]"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 font-mono text-[11px] text-[#0284C7] font-bold">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
                className="p-1 text-slate-500 hover:text-[#0284C7]"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors ml-1 border border-slate-200"
              aria-label="Close Secure Reader"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Workspace (Sidebar + Document Canvas) */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Navigation Sidebar */}
          <div className="w-64 bg-slate-50/90 border-r border-sky-100 hidden lg:flex flex-col justify-between shrink-0">
            <div className="p-4 space-y-4 overflow-y-auto">
              {/* Sidebar Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-white rounded-xl border border-sky-200 text-[10px] font-bold">
                <button
                  onClick={() => setActiveTab("toc")}
                  className={`py-1.5 rounded-lg transition-all ${
                    activeTab === "toc" ? "bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Chapters
                </button>
                <button
                  onClick={() => setActiveTab("search")}
                  className={`py-1.5 rounded-lg transition-all ${
                    activeTab === "search" ? "bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Search
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`py-1.5 rounded-lg transition-all ${
                    activeTab === "notes" ? "bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Bookmarks
                </button>
              </div>

              {/* TAB 1: CHAPTERS TOC */}
              {activeTab === "toc" && (
                <div className="space-y-1.5 text-xs">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] mb-2">
                    Table of Contents (ICAI 2026-2027):
                  </p>
                  {[
                    { page: 1, title: "Chapter 1: Preliminary & Incorporation (§1-§22)" },
                    { page: 3, title: "Chapter 2: Prospectus & Allotment (§23-§42)" },
                    { page: 6, title: "Chapter 3: Management & Administration (§88-§122)" },
                    { page: 9, title: "Chapter 4: CSR & Accounts of Companies (§128-§138)" },
                    { page: 13, title: "Chapter 5: 9-Attempt Solved RTPs & MTP Models" },
                    { page: 16, title: "Chapter 6: 1.5-Day Last Day Revision (LDR) Maps" },
                  ].map((ch) => (
                    <button
                      key={ch.page}
                      onClick={() => setCurrentPage(ch.page)}
                      className={`w-full text-left p-2 rounded-lg transition-all flex items-center justify-between text-[11px] ${
                        currentPage === ch.page
                          ? "bg-white text-[#0284C7] font-bold border border-sky-300 shadow-xs"
                          : "text-slate-600 hover:bg-white hover:text-slate-900"
                      }`}
                    >
                      <span className="truncate">{ch.title}</span>
                      <span className="text-[10px] font-mono text-[#0284C7] font-bold">P.{ch.page}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* TAB 2: SEARCH IN BOOK */}
              {activeTab === "search" && (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#0284C7] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="Search sections, MCA circulars..."
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0284C7] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-[10px] text-[#0284C7] font-bold uppercase">Quick Lookups:</p>
                    {["Section 103 Quorum", "Section 135 CSR Rules", "Section 96 AGM Timelines", "Postal Ballot §110", "Section 180 Board Limits"].map(
                      (kw, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSearchKeyword(kw);
                            setCurrentPage(6);
                          }}
                          className="block w-full text-left py-1 text-slate-600 hover:text-[#0284C7] hover:underline text-xs"
                        >
                          🔍 {kw}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: BOOKMARKS */}
              {activeTab === "notes" && (
                <div className="space-y-2 text-xs">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7]">
                    Saved Revision Markers ({bookmarkedPages.length}):
                  </p>
                  {bookmarkedPages.map((pg) => (
                    <button
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      className="w-full text-left p-2 rounded-lg bg-white border border-sky-200 text-slate-800 font-semibold flex items-center justify-between hover:border-[#0284C7] transition-colors shadow-xs"
                    >
                      <span>Bookmark on Page {pg}</span>
                      <Bookmark className="w-3.5 h-3.5 fill-[#0284C7] text-[#0284C7]" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Anti-Piracy Notice at Sidebar Bottom */}
            <div className="p-3 bg-white border-t border-sky-100 text-[10px] text-slate-500 space-y-1">
              <p className="font-bold text-[#0284C7] flex items-center gap-1">
                <Shield className="w-3 h-3 text-[#0284C7]" /> Digital Anti-Piracy DRM
              </p>
              <p>Device 1 of 2 Active • Hardware IP: {sessionIp}</p>
              <p>Direct PDF downloads &amp; file sharing are blocked.</p>
            </div>
          </div>

          {/* Center Document Canvas with Dynamic Multi-Layer Watermark */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-100 relative">
            
            {/* Book Page Surface */}
            <div
              className={`relative w-full max-w-3xl shadow-xl rounded-2xl p-6 sm:p-12 transition-all overflow-hidden ${
                themeMode === "light"
                  ? "bg-white text-slate-900 border border-slate-200"
                  : themeMode === "sepia"
                  ? "bg-[#fbf0d9] text-[#2b2416] border border-[#d6c59c]"
                  : "bg-slate-900 text-slate-100 border border-slate-800"
              }`}
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
            >
              {/* FORENSIC ANTI-PIRACY REPEATING DIAGONAL WATERMARK OVERLAY */}
              <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-around overflow-hidden opacity-10 rotate-[-25deg] scale-125">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="text-center font-mono font-black text-xs sm:text-sm tracking-widest uppercase text-[#0284C7] whitespace-nowrap">
                    CONFIDENTIAL • {student.name.toUpperCase()} • {student.rollNumber} • IP: {sessionIp} • {timestamp}
                  </div>
                ))}
              </div>

              {/* Document Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 relative z-10">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#0284C7]" />
                  <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-[#0284C7]">
                    The Law Kaksha • ICAI CA Law Reviewer Codex
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleBookmark(currentPage)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:border-[#0284C7] transition-colors"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        bookmarkedPages.includes(currentPage)
                          ? "fill-[#0284C7] text-[#0284C7]"
                          : "text-slate-400"
                      }`}
                    />
                  </button>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0284C7] border border-sky-200">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              </div>

              {/* Dynamic Page Content Based on Current Page */}
              <div className="space-y-6 text-xs sm:text-sm leading-relaxed font-serif relative z-10">
                {currentPage === 1 && (
                  <>
                    <div className="text-center py-4 border-b border-slate-200">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#0284C7] font-sans">
                        Chapter 1 • Sectional Codex
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black font-serif mt-1 text-slate-900">
                        Companies Act, 2013: Statutory Scheme &amp; Definitions
                      </h2>
                      <p className="text-xs text-slate-500 font-sans mt-1">
                        Sections 1 to 22: Classification, MOA/AOA Doctrines &amp; Corporate Personality
                      </p>
                    </div>

                    <p>
                      <strong>1. Separate Legal Entity &amp; Lifting the Veil:</strong> Under Section 9 of the Companies Act 2013, upon registration, the subscribers to the memorandum become a body corporate capable of exercising all corporate functions. In <strong>Salomon v. Salomon &amp; Co. Ltd.</strong> and the Indian landmark <strong>Tata Engineering &amp; Locomotive Co. Ltd. v. State of Bihar</strong>, courts reaffirmed that a company is an independent juristic person distinct from its members.
                    </p>

                    <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs font-sans space-y-2">
                      <p className="font-bold text-[#0284C7] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" /> ICAI High-Yield Statutory Highlight:
                      </p>
                      <p className="text-slate-700">
                        Section 8 Companies are prohibited from distributing dividend to members and must apply profits solely in promoting statutory objects (commerce, art, science, sports, education, research, social welfare, religion, charity, protection of environment).
                      </p>
                    </div>

                    <p>
                      <strong>2. Doctrine of Indoor Management (Turquand's Rule):</strong> Persons dealing with the company are presumed to have read public documents (MOA &amp; AOA) under constructive notice, but are entitled to assume that internal statutory procedures have been regularly performed (<strong>Royal British Bank v. Turquand</strong>).
                    </p>
                  </>
                )}

                {currentPage > 1 && (
                  <>
                    <div className="border-b border-slate-200 pb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#0284C7] font-sans">
                        Page {currentPage} • 5-Pillar Answer Framework
                      </span>
                      <h3 className="text-lg font-black font-serif mt-1 text-slate-900">
                        Section 103: Quorum for General Meetings &amp; Solved Case Scenarios
                      </h3>
                    </div>

                    <p>
                      <strong>Statutory Quorum Matrix for Public Companies:</strong>
                    </p>

                    <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-2 font-sans text-xs">
                      <p className="font-bold text-[#0284C7]">Section 103(1)(a) Public Company Requirements:</p>
                      <ul className="list-disc pl-4 space-y-1 text-slate-700">
                        <li><strong>Up to 1,000 members:</strong> 5 members personally present.</li>
                        <li><strong>1,001 to 5,000 members:</strong> 15 members personally present.</li>
                        <li><strong>Exceeding 5,000 members:</strong> 30 members personally present.</li>
                        <li><strong>Private Company (§103(1)(b)):</strong> 2 members personally present unless AOA requires more.</li>
                      </ul>
                    </div>

                    <p>
                      <strong>Adjournment Rule (§103(2)):</strong> If quorum is not present within 30 minutes from the time appointed: (a) If called upon requisition of members under §100, the meeting stands cancelled; (b) in any other case, it stands adjourned to the same day in the next week at the same time and place.
                    </p>
                  </>
                )}
              </div>

              {/* Document Footer */}
              <div className="mt-12 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500 relative z-10 font-sans">
                <span>The Law Kaksha CA Reviewer Series</span>
                <span className="text-[#0284C7] font-bold">Watermarked: {student.rollNumber}</span>
                <span>Page {currentPage}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Pagination Bar */}
        <div className="px-5 py-3 bg-white border-t border-sky-100 flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 disabled:opacity-40 hover:bg-slate-200 text-slate-800 font-semibold flex items-center gap-1 transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-[#0284C7]" />
              <span>Previous Page</span>
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 disabled:opacity-40 hover:bg-slate-200 text-slate-800 font-semibold flex items-center gap-1 transition-all"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4 text-[#0284C7]" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
              Viewing Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 px-3 py-1 rounded-xl text-[#0284C7] font-bold text-[11px]">
              <Shield className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Anti-Piracy Shield Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
