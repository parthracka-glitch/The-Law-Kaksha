"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  FileText,
  Search,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Eye,
  ShoppingBag,
  Clock,
  Layers,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { SecurePdfReader } from "./SecurePdfReader";

interface ProductItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  category: string;
  format?: string;
  price: number;
  originalPrice?: number;
  original_price?: number;
  pages?: string;
  pages_or_duration?: string;
  status?: string;
  pdfUrl?: string;
  units?: string[];
  highlights?: string[];
  cover_image?: string;
}

interface ResourceItem {
  id: string;
  title: string;
  actName?: string;
  chapterNumber?: number | string;
  chapter_number?: number | string;
  course?: string;
  course_id?: string;
  type?: string;
  file_or_url?: string;
  fileUrl?: string;
  status?: string;
  pages?: string;
}

export function BooksAndNotesShowcase() {
  const { addToCart, setIsCartOpen, setCheckoutStep } = useCart();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "books" | "notes">("all");
  const [selectedCourse, setSelectedCourse] = useState<"all" | "ca" | "cs">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Reader modal state for DRM viewing
  const [readerState, setReaderState] = useState<{
    open: boolean;
    title: string;
    pdfUrl: string;
    previewLimit: number;
    price: number;
  }>({
    open: false,
    title: "",
    pdfUrl: "",
    previewLimit: 5,
    price: 99,
  });

  useEffect(() => {
    fetch("/api/public/site-data")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          if (Array.isArray(data.products)) setProducts(data.products);
          if (Array.isArray(data.resources)) setResources(data.resources);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const isCA =
      p.category?.toLowerCase().includes("ca") ||
      p.title?.toLowerCase().includes("ca ") ||
      p.category === "Both";
    const isCS =
      p.category?.toLowerCase().includes("cs") ||
      p.title?.toLowerCase().includes("cseet") ||
      p.category === "Both";

    const matchesCourse =
      selectedCourse === "all" ||
      (selectedCourse === "ca" && isCA) ||
      (selectedCourse === "cs" && isCS);

    const matchesSearch =
      searchQuery.trim() === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCourse && matchesSearch;
  });

  // Filter resources
  const filteredResources = resources.filter((r) => {
    const courseStr = (r.course || r.course_id || "").toLowerCase();
    const isCA = courseStr.includes("ca") || courseStr.includes("foundation");
    const isCS = courseStr.includes("cs") || courseStr.includes("cseet");

    const matchesCourse =
      selectedCourse === "all" ||
      (selectedCourse === "ca" && isCA) ||
      (selectedCourse === "cs" && isCS);

    const matchesSearch =
      searchQuery.trim() === "" ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.actName && r.actName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCourse && matchesSearch;
  });

  const handleOpenPdf = (title: string, url?: string, price = 99) => {
    if (!url || !url.trim()) {
      alert("This document is being prepared with single-device DRM watermarking. Please check back shortly.");
      return;
    }
    setReaderState({
      open: true,
      title,
      pdfUrl: url,
      previewLimit: 5,
      price,
    });
  };

  const handleAddToCart = (product: ProductItem) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      originalPrice: product.originalPrice || product.original_price || 499,
      format: "pdf",
      category: product.category,
      badge: "In-Web DRM",
    });
    setIsCartOpen(true);
    setCheckoutStep("details");
  };

  const totalMaterials = products.length + resources.length;

  return (
    <>
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white via-[#F0F7FF]/50 to-white border-t border-[#DBEAFE] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#005A9C]" />
                <span>Live Digital Curriculum &amp; Library</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#0A192F] tracking-tight">
                Books, Codices &amp; PDF Study Notes
              </h2>
              <p className="text-sm sm:text-base text-[#64748B] mt-2 max-w-2xl leading-relaxed">
                Explore official statutory codices, high-yield revision blueprints, and chapter notes. All materials feature single-device DRM watermarking.
              </p>
            </div>

            {/* Quick Stat Counter */}
            <div className="flex items-center gap-3">
              <div className="bg-white border border-[#DBEAFE] rounded-2xl px-4 py-2.5 shadow-xs">
                <span className="text-xs text-[#64748B] block font-medium">Full Codices</span>
                <span className="text-xl font-serif font-bold text-[#005A9C]">{products.length} Active</span>
              </div>
              <div className="bg-white border border-[#DBEAFE] rounded-2xl px-4 py-2.5 shadow-xs">
                <span className="text-xs text-[#64748B] block font-medium">Chapter Notes</span>
                <span className="text-xl font-serif font-bold text-[#005A9C]">{resources.length} Notes</span>
              </div>
            </div>
          </div>

          {/* Controls Bar (Tabs, Course Filter, Search) */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#DBEAFE] p-4 sm:p-5 shadow-sm mb-10 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
            
            {/* View Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "all"
                    ? "bg-[#005A9C] text-white shadow-xs"
                    : "bg-[#F8FAFC] text-[#64748B] hover:text-[#0A192F] border border-[#E2E8F0]"
                }`}
              >
                All Materials ({totalMaterials})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("books")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "books"
                    ? "bg-[#005A9C] text-white shadow-xs"
                    : "bg-[#F8FAFC] text-[#64748B] hover:text-[#0A192F] border border-[#E2E8F0]"
                }`}
              >
                Books &amp; Codices ({products.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("notes")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "notes"
                    ? "bg-[#005A9C] text-white shadow-xs"
                    : "bg-[#F8FAFC] text-[#64748B] hover:text-[#0A192F] border border-[#E2E8F0]"
                }`}
              >
                PDF Notes &amp; Flowcharts ({resources.length})
              </button>
            </div>

            {/* Course Filter & Search */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSelectedCourse("all")}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    selectedCourse === "all" ? "bg-white text-[#005A9C] shadow-2xs" : "text-[#64748B]"
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCourse("ca")}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    selectedCourse === "ca" ? "bg-white text-[#005A9C] shadow-2xs" : "text-[#64748B]"
                  }`}
                >
                  CA Foundation
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCourse("cs")}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    selectedCourse === "cs" ? "bg-white text-[#005A9C] shadow-2xs" : "text-[#64748B]"
                  }`}
                >
                  CSEET
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books &amp; notes..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#005A9C] focus:bg-white text-[#0A192F]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 1: FULL BOOKS & CODICES */}
          {(activeTab === "all" || activeTab === "books") && (
            <div className="mb-14">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#005A9C]" />
                  <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0A192F]">
                    Full Study Books &amp; Codices
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#64748B]">
                  {filteredProducts.length} Available
                </span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white border border-[#DBEAFE] rounded-2xl p-8 text-center text-[#64748B] text-sm">
                  No books match your current course or search filter.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((book) => {
                    const discount =
                      book.originalPrice && book.price && book.originalPrice > book.price
                        ? `${Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% off`
                        : null;

                    return (
                      <div
                        key={book.id}
                        className="bg-white border border-[#DBEAFE] rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-[#005A9C] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                      >
                        <div className="space-y-4">
                          {/* Badges */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE]">
                              {book.category}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Sparkles className="w-2.5 h-2.5" />
                              Active Live
                            </span>
                          </div>

                          {/* Book Title & Subtitle */}
                          <div>
                            <Link href={`/product/${book.id}`} className="block group-hover:text-[#005A9C] transition-colors">
                              <h4 className="text-lg sm:text-xl font-serif font-black text-[#0A192F] leading-snug">
                                {book.title}
                              </h4>
                            </Link>
                            {book.subtitle && (
                              <p className="text-xs text-[#005A9C] font-semibold mt-1">
                                {book.subtitle}
                              </p>
                            )}
                            {book.description && (
                              <p className="text-xs text-[#64748B] leading-relaxed mt-2 line-clamp-2">
                                {book.description}
                              </p>
                            )}
                          </div>

                          {/* Included Chapters */}
                          {Array.isArray(book.units) && book.units.length > 0 && (
                            <div className="pt-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1.5">
                                Included Chapters:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {book.units.map((unit, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#334155] text-[11px] font-medium"
                                  >
                                    {unit}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Bottom Pricing & CTAs */}
                        <div className="pt-6 mt-6 border-t border-[#F1F5F9] space-y-4">
                          <div className="flex items-baseline justify-between">
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-serif font-black text-[#0A192F]">
                                ₹{book.price}
                              </span>
                              {book.originalPrice && (
                                <span className="text-xs text-[#94A3B8] line-through">
                                  ₹{book.originalPrice}
                                </span>
                              )}
                              {discount && (
                                <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                  {discount}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-medium text-[#64748B]">
                              {book.pages || "150+ Pages"} • DRM
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenPdf(book.title, book.pdfUrl, book.price)}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-[#F0F7FF] hover:bg-[#E0F0FE] text-[#005A9C] border border-[#DBEAFE] transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Read Sample</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleAddToCart(book)}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-[#005A9C] hover:bg-[#004F8A] text-white shadow-2xs hover:shadow-xs transition-colors cursor-pointer"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Get Codex</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: CHAPTER PDF NOTES & FLOWCHARTS */}
          {(activeTab === "all" || activeTab === "notes") && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#005A9C]" />
                  <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0A192F]">
                    Chapter PDF Notes &amp; Revision Blueprints
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#64748B]">
                  {filteredResources.length} Available
                </span>
              </div>

              {filteredResources.length === 0 ? (
                <div className="bg-white border border-[#DBEAFE] rounded-2xl p-8 text-center text-[#64748B] text-sm">
                  No chapter notes match your current course or search filter.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResources.map((res) => {
                    const courseLabel = (res.course || res.course_id || "").toLowerCase().includes("cs")
                      ? "CSEET"
                      : "CA Foundation";

                    return (
                      <div
                        key={res.id}
                        className="bg-white border border-[#E2E8F0] hover:border-[#005A9C] rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE]">
                              {courseLabel}
                            </span>
                            <span className="text-[10px] font-medium text-[#64748B] flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-[#005A9C]" />
                              In-Web DRM
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-[#0A192F] leading-snug line-clamp-2">
                            {res.title}
                          </h4>

                          {res.actName && (
                            <p className="text-xs text-[#005A9C] font-semibold">
                              {res.actName}
                            </p>
                          )}
                        </div>

                        <div className="pt-4 mt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                          <span className="text-[11px] text-[#94A3B8]">
                            PDF Study Note
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenPdf(res.title, res.file_or_url || res.fileUrl)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#005A9C] hover:text-[#004F8A] transition-colors cursor-pointer"
                          >
                            <span>Read In Browser</span>
                            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* In-Browser Secure PDF Reader Modal */}
      <SecurePdfReader
        isOpen={readerState.open}
        onClose={() => setReaderState((prev) => ({ ...prev, open: false }))}
        title={readerState.title}
        pdfUrl={readerState.pdfUrl}
        previewPagesLimit={readerState.previewLimit}
        price={readerState.price}
      />
    </>
  );
}
