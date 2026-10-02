"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { EnhancedSampleChapterModal } from "@/components/EnhancedSampleChapterModal";

interface BookSpine {
  id: string;
  actName: string;
  shortTitle: string;
  year?: string;
  exam: "ICAI" | "ICSI" | "ICAI & ICSI";
  chapters: string;
  spineColor: string;
  textColor: string;
  borderColor: string;
  heightClass: string;
  isFeatured?: boolean;
}

const STATUTORY_BOOKS: BookSpine[] = [
  {
    id: "ca-contract",
    actName: "The Indian Contract Act",
    shortTitle: "Indian Contract Act",
    year: "1872",
    exam: "ICAI",
    chapters: "Units 1 to 9 • Essentials & Special Contracts",
    spineColor: "bg-[#AED7E9]",
    textColor: "text-[#221D1D]",
    borderColor: "border-[#98C5D8]",
    heightClass: "h-28 sm:h-36",
  },
  {
    id: "ca-soga",
    actName: "The Sale of Goods Act",
    shortTitle: "Sale of Goods Act",
    year: "1930",
    exam: "ICAI",
    chapters: "Conditions, Warranties & Unpaid Seller",
    spineColor: "bg-[#221D1D]",
    textColor: "text-white",
    borderColor: "border-[#4D433F]",
    heightClass: "h-26 sm:h-32",
  },
  {
    id: "ca-partnership",
    actName: "The Indian Partnership Act",
    shortTitle: "Partnership Act",
    year: "1932",
    exam: "ICAI",
    chapters: "Units 1, 2 & 3 • Mutual Agency & Dissolution",
    spineColor: "bg-[#C4E1EC]",
    textColor: "text-[#221D1D]",
    borderColor: "border-[#AED7E9]",
    heightClass: "h-28 sm:h-36",
  },
  {
    id: "ca-llp",
    actName: "Limited Liability Partnership Act",
    shortTitle: "LLP Act",
    year: "2008",
    exam: "ICAI & ICSI",
    chapters: "LLP Incorporation & Governance",
    spineColor: "bg-[#98C5D8]",
    textColor: "text-[#221D1D]",
    borderColor: "border-[#6799AE]",
    heightClass: "h-26 sm:h-34",
  },
  {
    id: "ca-companies",
    actName: "The Companies Act",
    shortTitle: "Companies Act",
    year: "2013",
    exam: "ICAI & ICSI",
    chapters: "Essential Features, MoA, AoA & Sec 8",
    spineColor: "bg-[#BFAFE5]",
    textColor: "text-[#221D1D]",
    borderColor: "border-[#A08DC9]",
    heightClass: "h-32 sm:h-40",
    isFeatured: true,
  },
  {
    id: "ca-ni",
    actName: "Negotiable Instruments Act",
    shortTitle: "Negotiable Instruments",
    year: "1881",
    exam: "ICAI & ICSI",
    chapters: "Promissory Notes, Cheques & Sec 138",
    spineColor: "bg-[#AED7E9]",
    textColor: "text-[#221D1D]",
    borderColor: "border-[#C4E1EC]",
    heightClass: "h-28 sm:h-36",
  },
  {
    id: "ca-regulatory",
    actName: "Indian Regulatory Framework",
    shortTitle: "Regulatory Framework",
    year: "ICAI",
    exam: "ICAI",
    chapters: "Sources of Law, Court Systems & Tribunals",
    spineColor: "bg-[#DDA994]",
    textColor: "text-[#221D1D]",
    borderColor: "border-[#C35F3B]",
    heightClass: "h-26 sm:h-32",
  },
  {
    id: "cs-management",
    actName: "General Principles of Management",
    shortTitle: "Principles of Management",
    year: "ICSI",
    exam: "ICSI",
    chapters: "Fayol & Taylor Theories, Planning & Ethics",
    spineColor: "bg-[#4D433F]",
    textColor: "text-white",
    borderColor: "border-[#221D1D]",
    heightClass: "h-28 sm:h-36",
  },
];

export function DigitalBookshelf() {
  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [activeSampleTitle, setActiveSampleTitle] = useState("CA Foundation Business Laws");
  const [activeSampleId, setActiveSampleId] = useState("ca-foundation");

  const handleOpenBookSample = (book: BookSpine) => {
    setActiveSampleTitle(book.actName);
    setActiveSampleId(book.exam === "ICSI" ? "cseet" : "ca-foundation");
    setSampleModalOpen(true);
  };

  return (
    <section id="bookshelf" className="py-8 sm:py-10 bg-white text-[#221D1D] overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Compact Digital Bookshelf Card */}
        <div className="w-full bg-white border border-[#E7E4E7] rounded-2xl sm:rounded-3xl px-5 py-6 sm:px-8 sm:py-7 shadow-xs flex flex-col items-center relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto space-y-1.5 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C4E1EC]/60 border border-[#AED7E9] text-[#221D1D] text-[11px] font-semibold mb-1">
              <BookOpen className="w-3.5 h-3.5 text-[#4B8097]" />
              <span>Statutory Notes Shelf</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#221D1D] tracking-tight font-serif">
              The digital bookshelf for CA &amp; CS students
            </h2>
            <p className="text-xs sm:text-sm text-[#4D433F] leading-relaxed font-sans max-w-md mx-auto">
              Browse encrypted statutory chapter notes, unit breakdowns, and weekly case problems.
            </p>

            {/* Action Button */}
            <div className="pt-2 flex items-center justify-center">
              <Link
                href="/courses"
                className="px-5 py-2.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Explore All Notes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Virtual Bookshelf with Interactive Book Spines */}
          <div className="w-full pt-6 pb-0 flex flex-col items-center justify-end relative z-10">
            {/* Mobile swipe hint */}
            <span className="text-[11px] text-[#77716E] font-medium sm:hidden block pb-2 tracking-tight">
              Swipe across &amp; tap any volume to read
            </span>

            {/* Row of Books */}
            <div className="flex items-end justify-start sm:justify-center gap-2.5 sm:gap-3 px-2 max-w-full overflow-x-auto pb-1 scroll-container-x">
              {STATUTORY_BOOKS.map((book) => {
                return (
                  <div
                    key={book.id}
                    onClick={() => handleOpenBookSample(book)}
                    className="relative cursor-pointer transition-all duration-300 transform select-none hover:-translate-y-2 hover:scale-105 z-10 hover:z-20 shrink-0"
                    title={`${book.actName} (${book.chapters})`}
                  >
                    {/* Book Spine Container */}
                    <div
                      className={`w-11 sm:w-9 md:w-11 ${book.heightClass} ${book.spineColor} ${book.textColor} border ${book.borderColor} rounded-t-md shadow-sm flex flex-col justify-between py-2.5 px-1 relative overflow-hidden group transition-shadow duration-300`}
                    >
                      {/* Top Spine Accent */}
                      <div className="w-full space-y-0.5 opacity-70">
                        <div className="h-[1.5px] w-full bg-current opacity-60 rounded-full" />
                        <div className="h-[1px] w-full bg-current opacity-30 rounded-full" />
                      </div>

                      {/* Middle Spine Ridge */}
                      <div className="flex-1 flex flex-col items-center justify-center space-y-2 opacity-40">
                        <div className="w-1.5 h-1.5 rounded-full border border-current opacity-50" />
                        <div className="w-0.5 h-5 bg-current opacity-30 rounded-full" />
                      </div>

                      {/* Bottom Spine Accent */}
                      <div className="w-full space-y-0.5 opacity-70">
                        <div className="h-[1px] w-full bg-current opacity-30 rounded-full" />
                        <div className="h-[1.5px] w-full bg-current opacity-60 rounded-full" />
                      </div>

                      {/* Featured Highlight Glow */}
                      {book.isFeatured && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20 pointer-events-none" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modern Shelf Base */}
            <div className="w-full max-w-3xl h-3.5 bg-[#E7E4E7] rounded-full border-t border-[#D8D4D8] shadow-xs mt-[-2px] relative z-0" />
          </div>
        </div>
      </div>

      {/* Free Sample PDF Modal for Book Click */}
      <EnhancedSampleChapterModal
        isOpen={sampleModalOpen}
        onClose={() => setSampleModalOpen(false)}
        bookTitle={activeSampleTitle}
        bookId={activeSampleId}
        bookPrice={99}
      />
    </section>
  );
}


