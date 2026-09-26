"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
}

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "book-vol-1",
    slug: "volume-1-ca-corporate-law-master-codex",
    type: "book",
    title: "Volume 1: CA Corporate Law Master Codex (2026-2027)",
    subtitle: "Companies Act 2013 (Sections 1 to 148) with full Bare Act synthesis.",
    pages_or_duration: "540 Pages",
    price: 399,
    original_price: 699,
    badge: "Primary Textbook",
    category: "CA Intermediate & Final",
    description: "Complete line-by-line coverage of Companies Act 2013 with 45+ ROC circulars and past 10 attempts solved questions.",
    highlights: ["Complete Sections 1 to 148", "ROC Circulars & Notifications", "ICAI Model Solved Questions"],
  },
  {
    id: "book-vol-2",
    slug: "volume-2-economic-and-other-business-laws",
    type: "book",
    title: "Volume 2: Economic & Other Business Laws Codex",
    subtitle: "General Clauses Act, Interpretation of Statutes & Foreign Contribution (FCRA).",
    pages_or_duration: "480 Pages",
    price: 349,
    original_price: 599,
    badge: "High-Yield Notes",
    category: "CA Intermediate Paper 2",
    description: "Master statutory interpretation rules, General Clauses Act presumption principles, and FCRA regulations.",
    highlights: ["General Clauses Act deep-dive", "Interpretation of Statutes rules", "Past exam descriptive answers"],
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-[#0284C7] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> ICAI 2026-2027 Scheme Aligned
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
            CA Law Question Banks, Books &amp; Test Series
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Master CA Corporate &amp; Other Laws with Pearl Dsouza Ma&apos;am&apos;s exam-tested materials, statutory codices, and 1-on-1 copy evaluations.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by topic, section, or subject..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7] text-xs sm:text-sm text-slate-900 bg-white"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-[#0284C7]"
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
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedType === "all"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Items ({products.length})
            </button>
            <button
              onClick={() => setSelectedType("book")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedType === "book"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Statutory Codices &amp; Revision Maps
            </button>
            <button
              onClick={() => setSelectedType("mcq")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedType === "mcq"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              1,200+ MCQ Banks
            </button>
            <button
              onClick={() => setSelectedType("video")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedType === "video"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              HD Video Masterclasses
            </button>
            <button
              onClick={() => setSelectedType("evaluation")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedType === "evaluation"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Mains Copy Checking Desk
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No courses or books matched your filter</h3>
            <p className="text-xs text-slate-500">Try searching with a different keyword or reset the category filters.</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedType("all");
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-sky-100 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 hover:-translate-y-1 relative group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0284C7] border border-sky-200 text-[11px] font-bold">
                      {product.badge || "Featured"}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {product.pages_or_duration}
                    </span>
                  </div>

                  <Link href={`/product/${product.id}`} className="block group-hover:text-[#0284C7] transition-colors">
                    <h3 className="text-base font-bold text-slate-900 leading-snug font-serif">
                      {product.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {product.subtitle}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    {(product.highlights || []).slice(0, 3).map((hl, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-extrabold text-slate-900">
                        ₹{product.price}
                      </span>
                      {product.original_price > product.price && (
                        <span className="ml-2 text-xs text-slate-400 line-through">
                          ₹{product.original_price}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Instant Access
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleOpenPreview(product)}
                      className="py-2 px-3 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => handleBuyNow(product)}
                      className="py-2 px-3 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:from-[#0369A1] hover:to-[#0284C7] text-white text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
