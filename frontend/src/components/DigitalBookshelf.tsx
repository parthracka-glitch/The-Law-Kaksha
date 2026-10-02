"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { SecurePdfReader } from "@/components/SecurePdfReader";
import { useCart } from "@/context/CartContext";

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
  pdfUrl?: string;
  previewPagesLimit?: number;
  price?: number;
  badge?: string;
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
    pdfUrl: "/notes/contract-act-unit-1.pdf",
    previewPagesLimit: 5,
    price: 99,
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
    pdfUrl: "/notes/sale-of-goods-unit-2.pdf",
    previewPagesLimit: 5,
    price: 99,
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
    pdfUrl: "/notes/unit-1-general-nature-of-partnership.pdf",
    previewPagesLimit: 5,
    price: 99,
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
    pdfUrl: "/notes/llp-act-notes.pdf",
    previewPagesLimit: 5,
    price: 99,
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
    pdfUrl: "/notes/companies-act-unit-1.pdf",
    previewPagesLimit: 5,
    price: 99,
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
    pdfUrl: "/notes/negotiable-instruments-unit-1.pdf",
    previewPagesLimit: 5,
    price: 99,
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
    pdfUrl: "/notes/ca-foundation-framework-notes.pdf",
    previewPagesLimit: 5,
    price: 99,
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
    pdfUrl: "/notes/management-principles-sample-notes.pdf",
    previewPagesLimit: 5,
    price: 99,
  },
];

export function DigitalBookshelf() {
  const { addToCart, setIsCartOpen, setCheckoutStep } = useCart();
  const [booksList, setBooksList] = useState<BookSpine[]>(STATUTORY_BOOKS);

  // Secure DRM Reader state
  const [readerState, setReaderState] = useState<{
    open: boolean;
    title: string;
    pdfUrl: string;
    previewLimit: number;
    price: number;
    bookId: string;
    badge?: string;
  }>({
    open: false,
    title: "",
    pdfUrl: "",
    previewLimit: 5,
    price: 99,
    bookId: "",
  });

  // Load any dynamic products added from admin
  useEffect(() => {
    async function loadDynamicCodices() {
      try {
        let dynamicList: any[] = [];
        const res = await fetch("/api/catalog");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.products)) {
            dynamicList = json.products;
          }
        }
        if (dynamicList.length === 0 && typeof window !== "undefined") {
          const localAdmin = localStorage.getItem("lawkaksha_admin_products");
          if (localAdmin) {
            dynamicList = JSON.parse(localAdmin);
          }
        }

        if (dynamicList.length > 0) {
          // Merge dynamic products with unique IDs
          const customSpines: BookSpine[] = dynamicList
            .filter((p: any) => p.status === "Active" || !p.status)
            .map((p: any, idx: number) => {
              const spinePalettes = [
                { spineColor: "bg-[#BFAFE5]", textColor: "text-[#221D1D]", borderColor: "border-[#A08DC9]" },
                { spineColor: "bg-[#AED7E9]", textColor: "text-[#221D1D]", borderColor: "border-[#98C5D8]" },
                { spineColor: "bg-[#C4E1EC]", textColor: "text-[#221D1D]", borderColor: "border-[#AED7E9]" },
                { spineColor: "bg-[#DDA994]", textColor: "text-[#221D1D]", borderColor: "border-[#C35F3B]" },
                { spineColor: "bg-[#221D1D]", textColor: "text-white", borderColor: "border-[#4D433F]" },
              ];
              const palette = spinePalettes[idx % spinePalettes.length];
              return {
                id: p.id || `custom-book-${idx}`,
                actName: p.title,
                shortTitle: p.title.length > 22 ? p.title.slice(0, 20) + "..." : p.title,
                year: p.category?.includes("CS") ? "ICSI" : "ICAI",
                exam: p.category?.includes("CS") ? "ICSI" : ("ICAI" as const),
                chapters: p.subtitle || p.description || "Digital Codex",
                spineColor: palette.spineColor,
                textColor: palette.textColor,
                borderColor: palette.borderColor,
                heightClass: idx % 2 === 0 ? "h-32 sm:h-40" : "h-28 sm:h-36",
                pdfUrl: p.pdfUrl || `/api/pdf/${p.slug || p.id}.pdf`,
                previewPagesLimit: Number(p.previewPagesLimit) || 5,
                price: Number(p.price) || 99,
                badge: p.badge || `₹${p.price || 99}`,
              };
            });

          // Deduplicate based on id or actName
          const existingIds = new Set(STATUTORY_BOOKS.map((b) => b.id));
          const additions = customSpines.filter((c) => !existingIds.has(c.id));
          if (additions.length > 0) {
            setBooksList([...STATUTORY_BOOKS, ...additions]);
          }
        }
      } catch (e) {
        // Fallback to default statutory list
      }
    }
    loadDynamicCodices();
  }, []);

  const handleOpenBookSample = (book: BookSpine) => {
    setReaderState({
      open: true,
      title: book.actName,
      pdfUrl: book.pdfUrl || "/notes/unit-1-general-nature-of-partnership.pdf",
      previewLimit: book.previewPagesLimit || 5,
      price: book.price || 99,
      bookId: book.id,
      badge: book.badge,
    });
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
              {booksList.map((book) => {
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

      {/* Real DRM Protected Canvas PDF Reader with Preview Limit Enforcement */}
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
            badge: readerState.badge || `₹${readerState.price}`,
          });
          setReaderState((prev) => ({ ...prev, open: false }));
          setIsCartOpen(true);
          setCheckoutStep("details");
        }}
      />
    </section>
  );
}


