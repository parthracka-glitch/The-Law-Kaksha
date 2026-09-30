"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EnhancedSampleChapterModal } from "@/components/EnhancedSampleChapterModal";
import { useCart, BookFormat } from "@/context/CartContext";
import { apiRequest } from "@/lib/api";
import {
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
  ArrowRight,
  Eye,
  ShoppingBag,
  Sparkles,
  Zap,
  ShieldCheck,
  Star,
} from "lucide-react";

interface Product {
  id: string;
  slug: string;
  type: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  original_price: number;
  badge: string;
  category: string;
  pages_or_duration: string;
  highlights: string[];
  cover_image?: string;
}

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "book-vol-1",
    slug: "volume-1-ca-foundation-business-laws-contract-act",
    type: "book",
    title: "Part 1: The Indian Contract Act, 1872",
    subtitle: "Units 1 - 9 • Smart Revision Question Bank",
    cover_image: "/covers/vol1-codex.webp",
    pages_or_duration: "540 Pages",
    price: 249,
    original_price: 449,
    badge: "Volume 1",
    category: "CA Foundation Paper 2",
    description: "Official The Law कक्षा Smart Revision Question Bank for The Indian Contract Act 1872 with Application-based questions and model answers.",
    highlights: ["Units 1 to 9 Comprehensive Coverage", "Application-Based Questions & Answers", "Examiner Answer-Writing Framework"],
  },
  {
    id: "book-vol-2",
    slug: "volume-2-ca-foundation-business-laws-rest-of-acts",
    type: "book",
    title: "Part 2: Rest of the Acts",
    subtitle: "Examiner's Answer-Writing Framework",
    cover_image: "/covers/vol2-codex.webp",
    pages_or_duration: "480 Pages",
    price: 249,
    original_price: 449,
    badge: "Volume 2",
    category: "CA Foundation Paper 2",
    description: "Sale of Goods, Partnership, LLP & Companies Act Question Bank with previous exam questions and scoring keyword rubrics.",
    highlights: ["Rest of the Business Law Acts", "Questions from Previous ICAI Exams", "Revision & Practice Framework"],
  },
  {
    id: "book-mcq",
    slug: "icai-case-scenarios-30-mark-mcq-bank",
    type: "mcq",
    title: "ICAI Case Scenarios & 30-Mark MCQ Bank (1,200+ Qs)",
    subtitle: "Mandatory 30-mark section with detailed reasoning for each option.",
    pages_or_duration: "260 Pages",
    price: 249,
    original_price: 449,
    badge: "Practice Drill",
    category: "Practice Question Bank",
    description: "Practice chapter-wise ICAI case scenarios, negative marking prevention drills, and MCA amendment MCQs.",
    highlights: ["1,200+ ICAI curated MCQs", "Reasoning for all 4 options", "30-Mark Integrated Case Studies"],
  },
  {
    id: "book-ldr",
    slug: "1-5-day-last-day-revision-ldr-maps",
    type: "book",
    title: "1.5-Day Last Day Revision (LDR) Section Maps",
    subtitle: "Summary Flowcharts, Limit Tables & Penalty Code Tables for the last 36 hours.",
    pages_or_duration: "180 Pages",
    price: 199,
    original_price: 349,
    badge: "Quick Revision",
    category: "CA Exam Eve Maps",
    description: "Ultra-condensed visual flowcharts and penalty summary tables designed specifically for the final 36 hours.",
    highlights: ["Penalty code tables", "Time limit summary charts", "1.5-day exam eve checklist"],
  },
  {
    id: "video-classes",
    slug: "hd-video-masterclasses-full-law-lecture-series",
    type: "video",
    title: "HD Video Masterclasses: Full Law Lecture Series",
    subtitle: "32 in-depth chapter masterclasses with timestamped notes and faculty drafting rubrics.",
    pages_or_duration: "45+ Hours",
    price: 999,
    original_price: 1899,
    badge: "Video Course",
    category: "CA Foundation & Inter",
    description: "Detailed video breakdown of tricky corporate law sections with practical boardroom case studies.",
    highlights: ["32 chapter masterclasses", "Timestamped digital notes", "Faculty drafting rubrics & 1.25x/1.5x player"],
  },
  {
    id: "mains-evaluation",
    slug: "1-on-1-descriptive-test-series-copy-checking",
    type: "evaluation",
    title: "1-on-1 Descriptive Test Series & Copy Checking Desk",
    subtitle: "Submit your handwritten answer sheets for 5-pillar faculty grading and audio feedback.",
    pages_or_duration: "8 Full Papers",
    price: 699,
    original_price: 1299,
    badge: "Copy Checking",
    category: "CA Mains Evaluation",
    description: "Get detailed line-by-line checking of your law descriptive papers within 48 hours to boost scores to 70+.",
    highlights: ["8 full ICAI model test papers", "5-pillar rubric grading", "Detailed audio feedback from CA faculty"],
  },
];

export default function CoursesCatalogPage() {
  const { addToCart, setIsCartOpen, setCheckoutStep } = useCart();
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");

  // Sample Modal state
  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [sampleBook, setSampleBook] = useState({
    title: "Volume 1: CA Corporate Law Master Codex",
    id: "ca-book-vol-1",
    price: 399,
  });

  // Fetch catalog from backend API
  useEffect(() => {
    async function loadCatalog() {
      const res = await apiRequest<{ items?: Product[]; products?: Product[] }>("/api/catalog");
      if (res.success && res.data) {
        const fetched = res.data.products || res.data.items;
        if (Array.isArray(fetched) && fetched.length > 0) {
          setProducts(fetched);
        }
      }
    }
    loadCatalog();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesType = selectedType === "all" || p.type === selectedType;
    const matchesSearch =
      search.trim() === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (sortBy === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const handleOpenPreview = (product: Product) => {
    setSampleBook({
      title: product.title,
      id: product.id,
      price: product.price,
    });
    setSampleModalOpen(true);
  };

  const handleBuyNow = (product: Product) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      originalPrice: product.original_price,
      format: "pdf",
      category: product.category,
      badge: product.badge,
    });
    setIsCartOpen(true);
    setCheckoutStep("shipping");
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex flex-col justify-between text-[#1D1D1F]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F5F5F7] border border-black/[0.06] text-[#0071E3] text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" /> ICAI 2026-2027 Scheme Aligned
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
            CA Law Question Banks, Books &amp; Test Series
          </h1>
          <p className="text-sm text-[#6E6E73] leading-relaxed">
            Master CA Corporate &amp; Other Laws with comprehensive statutory codices, examination question banks, and 1-on-1 copy evaluations.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-black/[0.08] rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868B]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by topic, section, or subject..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-black/[0.08] bg-[#FBFBFD] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] text-xs sm:text-sm text-[#1D1D1F]"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className="text-xs text-[#86868B] font-medium whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-2 rounded-full border border-black/[0.08] text-xs font-medium text-[#1D1D1F] bg-[#FBFBFD] focus:outline-none focus:border-[#0071E3]"
              >
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-4 py-1.5 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedType === "all"
                  ? "bg-[#1D1D1F] text-white shadow-2xs"
                  : "bg-black/[0.04] text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.08]"
              }`}
            >
              All Items ({products.length})
            </button>
            <button
              onClick={() => setSelectedType("book")}
              className={`px-4 py-1.5 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedType === "book"
                  ? "bg-[#1D1D1F] text-white shadow-2xs"
                  : "bg-black/[0.04] text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.08]"
              }`}
            >
              Statutory Codices &amp; Revision Maps
            </button>
            <button
              onClick={() => setSelectedType("mcq")}
              className={`px-4 py-1.5 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedType === "mcq"
                  ? "bg-[#1D1D1F] text-white shadow-2xs"
                  : "bg-black/[0.04] text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.08]"
              }`}
            >
              1,200+ MCQ Banks
            </button>
            <button
              onClick={() => setSelectedType("video")}
              className={`px-4 py-1.5 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedType === "video"
                  ? "bg-[#1D1D1F] text-white shadow-2xs"
                  : "bg-black/[0.04] text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.08]"
              }`}
            >
              HD Video Masterclasses
            </button>
            <button
              onClick={() => setSelectedType("evaluation")}
              className={`px-4 py-1.5 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedType === "evaluation"
                  ? "bg-[#1D1D1F] text-white shadow-2xs"
                  : "bg-black/[0.04] text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.08]"
              }`}
            >
              Mains Copy Checking Desk
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-black/[0.08] rounded-3xl p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-[#86868B] mx-auto" />
            <h3 className="text-base font-semibold text-[#1D1D1F]">No courses or books matched your filter</h3>
            <p className="text-xs text-[#6E6E73]">Try searching with a different keyword or reset the category filters.</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedType("all");
              }}
              className="px-5 py-2 rounded-full bg-[#1D1D1F] text-white text-xs font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-black/[0.08] rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:border-black/[0.16] transition-all duration-300 flex flex-col justify-between space-y-5 hover:-translate-y-1 relative group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0071E3]/[0.08] text-[#0071E3] border border-[#0071E3]/15 text-[11px] font-medium">
                      {product.badge || "Featured"}
                    </span>
                    <span className="text-xs font-medium text-[#86868B]">
                      {product.pages_or_duration}
                    </span>
                  </div>

                  {product.cover_image && (
                    <div className="relative mx-auto my-1.5 w-full flex items-center justify-center py-1">
                      <div className="relative group/book rounded-2xl overflow-hidden shadow-[0_6px_18px_rgba(0,0,0,0.08)] border border-black/[0.06] bg-white transition-all duration-300 group-hover:shadow-[0_12px_24px_rgba(0,113,227,0.18)]">
                        <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/20 via-white/20 to-transparent z-10 pointer-events-none" />
                        <Image
                          src={product.cover_image}
                          alt={product.title}
                          width={240}
                          height={360}
                          className="h-44 w-auto object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      </div>
                    </div>
                  )}

                  <Link href={`/product/${product.id}`} className="block group-hover:text-[#0071E3] transition-colors">
                    <h3 className="text-base font-semibold text-[#1D1D1F] leading-snug">
                      {product.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-[#6E6E73] line-clamp-2 leading-relaxed">
                    {product.subtitle}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-black/[0.05]">
                    {(product.highlights || []).slice(0, 3).map((hl, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#424245]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0071E3] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-black/[0.05]">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-bold text-[#1D1D1F] tracking-tight">
                        ₹{product.price}
                      </span>
                      {product.original_price > product.price && (
                        <span className="ml-2 text-xs text-[#86868B] line-through">
                          ₹{product.original_price}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Instant Access
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleOpenPreview(product)}
                      className="py-2.5 px-3 rounded-full border border-black/[0.08] hover:border-black/[0.18] bg-black/[0.02] hover:bg-black/[0.06] text-[#1D1D1F] text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#0071E3]" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => handleBuyNow(product)}
                      className="py-2.5 px-3 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span>Buy Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 2-3 Page Sample Preview Modal */}
      <EnhancedSampleChapterModal
        isOpen={sampleModalOpen}
        onClose={() => setSampleModalOpen(false)}
        bookTitle={sampleBook.title}
        bookId={sampleBook.id}
        bookPrice={sampleBook.price}
      />

      <Footer />
    </div>
  );
}
