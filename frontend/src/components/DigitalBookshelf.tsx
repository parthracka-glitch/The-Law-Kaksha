"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, Sparkles, Eye, Lock, ChevronRight } from "lucide-react";
import { SecurePdfReader } from "@/components/SecurePdfReader";
import { useCart } from "@/context/CartContext";

interface BookSpine {
  id: string;
  actName: string;
  shortTitle: string;
  year: string;
  exam: "ICAI" | "ICSI" | "ICAI & ICSI";
  chapters: string;
  topics: string[];
  spineGradient: string;
  textColor: string;
  accentColor: string;
  heightPx: number;
  isFeatured?: boolean;
  isSample?: boolean;
  pdfUrl: string;
  previewPagesLimit?: number;
  price: number;
}

const STATUTORY_BOOKS: BookSpine[] = [
  {
    id: "ca-regulatory",
    actName: "Indian Regulatory Framework",
    shortTitle: "Regulatory",
    year: "Ch.1",
    exam: "ICAI",
    chapters: "Sources of Law & Court Hierarchy",
    topics: ["Sources of Indian Law", "Hierarchy of Courts", "Regulatory Bodies (SEBI, RBI, MCA)"],
    spineGradient: "from-[#7BB8CE] to-[#4B8097]",
    textColor: "text-white",
    accentColor: "#AED7E9",
    heightPx: 180,
    pdfUrl: "/notes/sale-of-goods-unit-1.pdf",
    previewPagesLimit: 5,
    price: 99,
  },
  {
    id: "ca-contract",
    actName: "Indian Contract Act",
    shortTitle: "Contract Act",
    year: "1872",
    exam: "ICAI",
    chapters: "Offer, Acceptance & Special Contracts",
    topics: ["Essentials of Valid Contract", "Free Consent & Consideration", "Special Contracts (Agency, Bailment)"],
    spineGradient: "from-[#221D1D] to-[#3D3533]",
    textColor: "text-white",
    accentColor: "#BFAFE5",
    heightPx: 210,
    isFeatured: true,
    pdfUrl: "/notes/sale-of-goods-unit-1.pdf",
    previewPagesLimit: 5,
    price: 99,
  },
  {
    id: "ca-soga",
    actName: "Sale of Goods Act",
    shortTitle: "Sale of Goods",
    year: "1930",
    exam: "ICAI",
    chapters: "Conditions, Warranties & Caveat Emptor",
    topics: ["Formation of Contract of Sale", "Implied Conditions & Warranties", "Transfer of Property & Unpaid Seller"],
    spineGradient: "from-[#AED7E9] to-[#7BB8CE]",
    textColor: "text-[#221D1D]",
    accentColor: "#4B8097",
    heightPx: 190,
    isSample: true,
    pdfUrl: "/notes/sale-of-goods-unit-1.pdf",
    previewPagesLimit: 5,
    price: 99,
  },
  {
    id: "ca-partnership",
    actName: "Indian Partnership Act",
    shortTitle: "Partnership",
    year: "1932",
    exam: "ICAI",
    chapters: "Mutual Agency, Relations & Dissolution",
    topics: ["General Nature of Partnership", "Relations of Partners", "Registration & Dissolution of Firm"],
    spineGradient: "from-[#BFAFE5] to-[#9B7FD4]",
    textColor: "text-[#221D1D]",
    accentColor: "#8B5CF6",
    heightPx: 200,
    isSample: true,
    pdfUrl: "/notes/unit-1-general-nature-of-partnership.pdf",
    previewPagesLimit: 5,
    price: 99,
  },
  {
    id: "ca-llp",
    actName: "LLP Act",
    shortTitle: "LLP Act",
    year: "2008",
    exam: "ICAI & ICSI",
    chapters: "LLP Formation & Governance",
    topics: ["LLP vs Traditional Partnership", "Incorporation & Designated Partners", "Conversion & Annual Filings"],
    spineGradient: "from-[#C4E1EC] to-[#98C5D8]",
    textColor: "text-[#221D1D]",
    accentColor: "#4B8097",
    heightPx: 170,
    pdfUrl: "/notes/unit-2-relations-of-partners.pdf",
    previewPagesLimit: 5,
    price: 99,
  },
  {
    id: "ca-companies",
    actName: "Companies Act",
    shortTitle: "Companies Act",
    year: "2013",
    exam: "ICAI & ICSI",
    chapters: "Corporate Veil, MOA, AOA & Sec 8",
    topics: ["Salomon v. Salomon — Corporate Veil", "Memorandum & Articles of Association", "Doctrine of Ultra Vires"],
    spineGradient: "from-[#DDA994] to-[#C35F3B]",
    textColor: "text-white",
    accentColor: "#F4C5C0",
    heightPx: 220,
    isFeatured: true,
    pdfUrl: "/notes/sale-of-goods-unit-2.pdf",
    previewPagesLimit: 5,
    price: 99,
  },
  {
    id: "ca-ni",
    actName: "Negotiable Instruments Act",
    shortTitle: "NI Act",
    year: "1881",
    exam: "ICAI & ICSI",
    chapters: "Cheques, Bills of Exchange & Sec 138",
    topics: ["Promissory Notes & Bills of Exchange", "Crossing of Cheques & Holder in Due Course", "Section 138 — Dishonour Liability"],
    spineGradient: "from-[#4D433F] to-[#221D1D]",
    textColor: "text-white",
    accentColor: "#AED7E9",
    heightPx: 185,
    pdfUrl: "/notes/unit-3-registration-and-dissolution-of-firm.pdf",
    previewPagesLimit: 5,
    price: 99,
  },
  {
    id: "cs-management",
    actName: "Principles of Management",
    shortTitle: "Management",
    year: "ICSI",
    exam: "ICSI",
    chapters: "Fayol, Taylor & Business Ethics",
    topics: ["Fayol's 14 Principles of Management", "F.W. Taylor — Scientific Management", "Business Environment & Corporate Ethics"],
    spineGradient: "from-[#B8DDCA] to-[#5FA882]",
    textColor: "text-[#221D1D]",
    accentColor: "#2D7A5A",
    heightPx: 195,
    pdfUrl: "/notes/cseet-management-full.pdf",
    previewPagesLimit: 5,
    price: 99,
  },
];

export function DigitalBookshelf() {
  const { addToCart, setIsCartOpen, setCheckoutStep } = useCart();
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  const [readerState, setReaderState] = useState<{
    open: boolean; title: string; pdfUrl: string;
    previewLimit: number; price: number; bookId: string;
  }>({ open: false, title: "", pdfUrl: "", previewLimit: 5, price: 99, bookId: "" });

  const handleOpenBook = (book: BookSpine) => {
    setReaderState({
      open: true,
      title: book.actName,
      pdfUrl: book.pdfUrl,
      previewLimit: book.previewPagesLimit || 5,
      price: book.price,
      bookId: book.id,
    });
  };

  return (
    <section id="bookshelf" className="py-12 sm:py-16 overflow-hidden" style={{ background: "linear-gradient(180deg, #FAFAF9 0%, #F3F0ED 100%)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#BFAFE5]/30 border border-[#BFAFE5] text-[#221D1D] text-[11px] font-bold tracking-wider uppercase">
            <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
            <span>Your Study Arsenal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#221D1D] tracking-tight font-serif leading-tight">
            Every Act. Every Chapter.<br className="hidden sm:block" />
            <span className="text-[#4B8097]"> All in One Place.</span>
          </h2>
          <p className="text-sm text-[#4D433F] leading-relaxed">
            The complete statutory library for CA Foundation & CSEET — chapter-wise notes, case studies, and question banks. Tap any book to read a free sample.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-10">
          {[
            { label: "Active Students", value: "1,200+", icon: Users },
            { label: "Acts Covered", value: "8 Acts", icon: BookOpen },
            { label: "Free Samples", value: "3 Units Free", icon: Eye },
            { label: "DRM Protected", value: "Exam-Safe", icon: Lock },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#AED7E9]/30 border border-[#AED7E9] flex items-center justify-center">
                <stat.icon className="w-3.5 h-3.5 text-[#4B8097]" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#221D1D]">{stat.value}</div>
                <div className="text-[10px] text-[#77716E] font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* The Bookshelf */}
        <div className="relative">
          {/* Shelf Background */}
          <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden" style={{ background: "linear-gradient(180deg, #1C1817 0%, #2A2221 60%, #1A1614 100%)" }}>

            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(174,215,233,0.08)_0%,_transparent_60%)] pointer-events-none" />

            {/* Top label */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/30">The Law कक्षा — Statutory Library</span>
              <span className="text-[10px] font-mono text-white/25">CA Foundation + CSEET · 2026</span>
            </div>

            {/* Books Row */}
            <div className="flex items-end justify-start sm:justify-center gap-1.5 sm:gap-2 px-4 sm:px-8 pt-4 overflow-x-auto pb-0 scroll-container-x">
              {STATUTORY_BOOKS.map((book) => {
                const isHovered = hoveredBook === book.id;
                return (
                  <div
                    key={book.id}
                    className="relative shrink-0 cursor-pointer group"
                    onMouseEnter={() => setHoveredBook(book.id)}
                    onMouseLeave={() => setHoveredBook(null)}
                    onClick={() => handleOpenBook(book)}
                  >
                    {/* Hover Tooltip Card */}
                    {isHovered && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-52 bg-white rounded-2xl shadow-2xl border border-[#E7E4E7] p-4 z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#77716E]">{book.exam}</p>
                            <h3 className="text-sm font-bold text-[#221D1D] leading-tight mt-0.5">{book.actName} {book.year !== "ICAI" && book.year !== "ICSI" ? `(${book.year})` : ""}</h3>
                          </div>
                          {book.isSample && (
                            <span className="shrink-0 px-1.5 py-0.5 rounded-full bg-[#AED7E9]/40 border border-[#AED7E9] text-[9px] font-bold text-[#221D1D]">FREE</span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#4D433F] font-medium mb-2">{book.chapters}</p>
                        <div className="space-y-1 border-t border-[#E7E4E7] pt-2">
                          {book.topics.map((t, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-[10px] text-[#4D433F]">
                              <ChevronRight className="w-3 h-3 text-[#4B8097] shrink-0 mt-px" />
                              <span>{t}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-2 border-t border-[#E7E4E7] flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#4B8097]">Tap to read sample →</span>
                          {book.isFeatured && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#BFAFE5]/40 border border-[#BFAFE5] text-[#221D1D] font-bold">HIGH YIELD</span>}
                        </div>
                        {/* Arrow pointing down */}
                        <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-[#E7E4E7] rotate-45" />
                      </div>
                    )}

                    {/* Book Spine */}
                    <div
                      className="relative rounded-t-lg overflow-hidden transition-all duration-300"
                      style={{
                        width: "48px",
                        height: `${book.heightPx}px`,
                        transform: isHovered ? "translateY(-12px) scale(1.06)" : "translateY(0) scale(1)",
                        boxShadow: isHovered
                          ? `0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.15), 0 0 20px ${book.accentColor}40`
                          : "0 4px 12px rgba(0,0,0,0.4)",
                      }}
                    >
                      {/* Gradient fill */}
                      <div className={`absolute inset-0 bg-gradient-to-b ${book.spineGradient}`} />

                      {/* Spine top highlight */}
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/30" />
                      <div className="absolute top-1 left-1 right-1 h-px bg-white/20" />

                      {/* Vertical title text */}
                      <div className={`absolute inset-0 flex flex-col items-center justify-center ${book.textColor}`}>
                        <div
                          className="text-[9px] font-bold tracking-wider leading-none whitespace-nowrap"
                          style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)", letterSpacing: "0.08em" }}
                        >
                          {book.shortTitle}
                        </div>
                        <div
                          className="text-[8px] font-mono mt-1 opacity-60 whitespace-nowrap"
                          style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}
                        >
                          {book.year}
                        </div>
                      </div>

                      {/* Featured ribbon */}
                      {book.isFeatured && (
                        <div className="absolute top-2 left-0 right-0 flex justify-center">
                          <div className="w-1 h-1 rounded-full bg-white/60" />
                        </div>
                      )}

                      {/* Sample badge dot */}
                      {book.isSample && (
                        <div className="absolute top-2 right-1 w-1.5 h-1.5 rounded-full bg-[#AED7E9] shadow-sm" />
                      )}

                      {/* Bottom page edge effect */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20" />
                    </div>

                    {/* Exam tag below spine */}
                    <div className={`text-center mt-1.5 text-[8px] font-bold tracking-wide transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0"}`}
                      style={{ color: book.accentColor }}>
                      {book.exam}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Physical Shelf Board */}
            <div className="mx-4 sm:mx-8 mt-1 h-4 rounded-b-lg" style={{ background: "linear-gradient(180deg, #5C4A3E 0%, #3D2E27 100%)", boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }} />
            <div className="mx-2 sm:mx-6 h-1.5 rounded-b-xl" style={{ background: "#2A1F1A", boxShadow: "0 6px 16px rgba(0,0,0,0.7)" }} />

            {/* Bottom CTA inside shelf */}
            <div className="px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-white/50 text-xs font-medium">Includes free sample chapters for Indian Partnership Act</p>
                <p className="text-white/25 text-[10px] mt-0.5">All notes are DRM-protected · For in-app reading only</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/courses"
                  className="px-5 py-2.5 rounded-full bg-[#AED7E9] hover:bg-[#98C5D8] text-[#221D1D] text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span>Explore All Notes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/student"
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span>Student Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {[
            "✅ Free Sample — Partnership Act (3 Units)",
            "📖 Chapter-wise breakdowns",
            "⚖️ ICAI & ICSI Covered",
            "🔒 DRM-Protected Reader",
            "📱 Mobile Friendly",
          ].map((chip) => (
            <span key={chip} className="px-3 py-1.5 rounded-full bg-white border border-[#E7E4E7] text-[11px] font-medium text-[#4D433F] shadow-xs">
              {chip}
            </span>
          ))}
        </div>

      </div>

      {/* DRM Reader */}
      <SecurePdfReader
        isOpen={readerState.open}
        onClose={() => setReaderState((prev) => ({ ...prev, open: false }))}
        pdfUrl={readerState.pdfUrl}
        title={readerState.title}
        previewPagesLimit={readerState.previewLimit}
        isPurchased={false}
        price={readerState.price}
        onBuy={() => {
          addToCart({
            id: readerState.bookId,
            title: readerState.title,
            price: readerState.price,
            originalPrice: 299,
            format: "pdf",
            category: "Digital Codex",
            badge: `₹${readerState.price}`,
          });
          setReaderState((prev) => ({ ...prev, open: false }));
          setIsCartOpen(true);
          setCheckoutStep("details");
        }}
      />
    </section>
  );
}
