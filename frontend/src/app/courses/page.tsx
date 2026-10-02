"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SecurePdfReader } from "@/components/SecurePdfReader";
import { useCart } from "@/context/CartContext";
import { apiRequest } from "@/lib/api";
import {
  Search,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Eye,
  ShoppingBag,
  Zap,
  GraduationCap,
  Layers,
  FileText,
  Clock,
  Check,
} from "lucide-react";

interface Product {
  id: string;
  slug: string;
  type: string;
  courseId?: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  original_price: number;
  badge: string;
  category: string;
  examBody?: string;
  pages_or_duration: string;
  highlights: string[];
  cover_image?: string;
  previewPagesLimit?: number;
  samplePagesRange?: string;
  pdfUrl?: string;
}

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "course-ca-foundation-sub",
    slug: "ca-foundation-business-laws-monthly-access",
    type: "course",
    courseId: "course-ca-foundation",
    title: "CA Foundation Business Laws",
    subtitle: "Complete 7 Chapters Study Notes, Case Studies & Question Bank",
    description: "Comprehensive preparation platform for CA Foundation Paper 2 (ICAI New Scheme). Includes chapter-wise notes, practice questions, weekly case problems, and model solutions.",
    price: 99,
    original_price: 299,
    badge: "₹99 / Month",
    category: "CA Foundation Paper 2",
    examBody: "ICAI",
    pages_or_duration: "7 Chapters (ICAI Scheme)",
    cover_image: "/assets/ca-cs-hero-books-v2.png",
    highlights: [
      "Chapter-wise notes for all 7 Acts (Contract, Sale of Goods, Partnership, LLP, Companies, NI Act)",
      "Weekly descriptive case study practice with model solutions",
      "Downloadable DRM-protected study PDFs",
      "ICAI answer drafting rubrics & Last Day Revision (LDR) maps",
    ],
  },
  {
    id: "course-cseet-sub",
    slug: "cseet-business-law-management-monthly-access",
    type: "course",
    courseId: "course-cseet",
    title: "CSEET Business Law & Management",
    subtitle: "8 Units Study Notes, Chapter-wise MCQs & Mock Tests",
    description: "Complete preparation platform for CSEET Paper 2 (ICSI Syllabus). Includes unit-wise notes, conceptual MCQs with detailed explanations, and timed mock drills.",
    price: 99,
    original_price: 299,
    badge: "₹99 / Month",
    category: "CSEET Paper 2",
    examBody: "ICSI",
    pages_or_duration: "8 Units (ICSI Syllabus)",
    cover_image: "/assets/ca-cs-hero-books-v2.png",
    highlights: [
      "Comprehensive notes for all 8 Business Law and Management units",
      "Chapter-wise practice MCQs with explanations for each option",
      "Weekly timed mock tests with instant score reports",
      "Last Day Revision (LDR) summaries and concept flowcharts",
    ],
  },
];

function CoursesCatalogContent() {
  const searchParams = useSearchParams();
  const initialCourse = searchParams.get("course");

  const { addToCart, setIsCartOpen, setCheckoutStep } = useCart();
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [selectedCourse, setSelectedCourse] = useState<string>(
    initialCourse === "ca"
      ? "course-ca-foundation"
      : initialCourse === "cs"
      ? "course-cseet"
      : "all"
  );
  const [search, setSearch] = useState("");

  // Preview Reader state (DRM-protected with preview page limits)
  const [previewState, setPreviewState] = useState<{
    open: boolean;
    title: string;
    pdfUrl: string;
    previewLimit: number;
    price: number;
    product?: Product;
  }>({
    open: false,
    title: "",
    pdfUrl: "",
    previewLimit: 5,
    price: 99,
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
    const matchesCourse =
      selectedCourse === "all" ||
      p.courseId === selectedCourse ||
      (selectedCourse === "course-ca-foundation" && (p.category.includes("CA") || p.id.includes("ca"))) ||
      (selectedCourse === "course-cseet" && (p.category.includes("CSEET") || p.id.includes("cseet")));

    const matchesSearch =
      search.trim() === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());

    return matchesCourse && matchesSearch;
  });

  const handleOpenPreview = (product: Product) => {
    const defaultPdf = product.id.includes("cseet") || product.courseId === "course-cseet"
      ? "/notes/management-principles-sample-notes.pdf"
      : "/notes/unit-1-general-nature-of-partnership.pdf";
    setPreviewState({
      open: true,
      title: product.title,
      pdfUrl: product.pdfUrl || defaultPdf,
      previewLimit: product.previewPagesLimit || 5,
      price: product.price,
      product,
    });
  };

  const handleSubscribeNow = (product: Product) => {
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
    setCheckoutStep("details");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between text-[#221D1D]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full space-y-10">
        {/* 1. Header & Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C4E1EC]/60 border border-[#AED7E9] text-[#221D1D] text-xs font-semibold mb-1">
            <BookOpen className="w-3.5 h-3.5 text-[#4B8097]" />
            <span>Curriculum &amp; Study Notes</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#221D1D] tracking-tight">
            Courses, Smart Question Banks &amp; Study Notes
          </h1>
          <p className="text-sm sm:text-base text-[#4D433F] leading-relaxed max-w-2xl mx-auto">
            Browse all available statutory question banks, unit-wise notes, weekly case studies, and examination test series for CA Foundation and CSEET.
          </p>
        </div>

        {/* 2. Simple Minimal Filter & Search Bar */}
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-[#E7E4E7] shadow-xs">
          {/* Program Toggle */}
          <div className="flex p-1 bg-[#F7F7F5] rounded-xl w-full sm:w-auto gap-1 overflow-x-auto scrollable-tabs border border-[#E7E4E7]">
            <button
              onClick={() => setSelectedCourse("all")}
              className={`flex-1 sm:flex-initial shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-[40px] flex items-center justify-center ${
                selectedCourse === "all"
                  ? "bg-[#AED7E9] text-[#221D1D] font-bold shadow-xs"
                  : "text-[#77716E] hover:text-[#221D1D]"
              }`}
            >
              All ({products.length})
            </button>
            <button
              onClick={() => setSelectedCourse("course-ca-foundation")}
              className={`flex-1 sm:flex-initial shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5 ${
                selectedCourse === "course-ca-foundation"
                  ? "bg-[#AED7E9] text-[#221D1D] font-bold shadow-xs"
                  : "text-[#77716E] hover:text-[#221D1D]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>CA Foundation</span>
            </button>
            <button
              onClick={() => setSelectedCourse("course-cseet")}
              className={`flex-1 sm:flex-initial shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5 ${
                selectedCourse === "course-cseet"
                  ? "bg-[#AED7E9] text-[#221D1D] font-bold shadow-xs"
                  : "text-[#77716E] hover:text-[#221D1D]"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>CSEET</span>
            </button>
          </div>

          {/* Simple Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#77716E]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search curriculum..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#E7E4E7] bg-[#F7F7F5] focus:outline-none focus:ring-2 focus:ring-[#BFAFE5] focus:border-transparent text-[#221D1D]"
            />
          </div>
        </div>

        {/* 3. The 2 Dedicated Course Cards */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-[#E7E4E7] rounded-3xl p-12 text-center space-y-4 shadow-xs max-w-xl mx-auto">
            <BookOpen className="w-10 h-10 text-[#77716E] mx-auto" />
            <h3 className="text-base font-bold text-[#221D1D]">No course found</h3>
            <p className="text-xs text-[#77716E]">
              Clear your search keyword to view the CA Foundation and CSEET courses.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCourse("all");
              }}
              className="px-5 py-2 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-semibold cursor-pointer shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            {filteredProducts.map((product) => {
              return (
                <div
                  key={product.id}
                  className="bg-white border border-[#E7E4E7] rounded-3xl p-7 sm:p-8 shadow-xs hover:border-[#AED7E9] hover:shadow-sm transition-all duration-300 flex flex-col justify-between space-y-6 relative group"
                >
                  <div className="space-y-5">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#BFAFE5]/40 text-[#221D1D] border border-[#BFAFE5]">
                        {product.badge || "Launch Offer @ ₹99/mo"}
                      </span>
                      <span className="text-xs font-medium text-[#77716E] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#4B8097]" />
                        <span>{product.pages_or_duration}</span>
                      </span>
                    </div>

                    {/* Course Graphic & Icon */}
                    <Link href={`/product/${product.id}`} className="block">
                      <div className="w-full bg-[#F7F7F5] rounded-2xl border border-[#E7E4E7] p-6 flex items-center justify-center group-hover:bg-[#F7F7F5]/80 transition-colors">
                        <div className="relative rounded-xl overflow-hidden shadow-xs max-w-[180px] sm:max-w-[200px]">
                          <Image
                            src={product.cover_image || "/assets/ca-cs-hero-books-v2.png"}
                            alt={product.title}
                            width={220}
                            height={280}
                            className="h-44 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      </div>
                    </Link>

                    {/* Course Title & Overview */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#221D1D] bg-[#C4E1EC]/60 px-2 py-0.5 rounded-full border border-[#AED7E9]">
                          {product.examBody}
                        </span>
                        <span className="text-xs text-[#77716E] font-medium">
                          {product.category}
                        </span>
                      </div>

                      <Link href={`/product/${product.id}`} className="block group-hover:text-[#4B8097] transition-colors">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#221D1D] leading-snug font-serif">
                          {product.title}
                        </h2>
                      </Link>

                      <p className="text-xs sm:text-sm text-[#4D433F] leading-relaxed mt-2 font-normal">
                        {product.description}
                      </p>
                    </div>

                    {/* Key Highlights Checklist */}
                    <div className="space-y-2 pt-4 border-t border-[#E7E4E7]">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#77716E]">
                        Everything Included in Plan:
                      </h4>
                      {(product.highlights || []).map((hl, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#4D433F]">
                          <CheckCircle2 className="w-4 h-4 text-[#4B8097] shrink-0 mt-0.5" />
                          <span className="leading-snug">{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & CTA Controls */}
                  <div className="space-y-4 pt-5 border-t border-[#E7E4E7]">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-3xl font-extrabold text-[#221D1D] tracking-tight font-serif">
                          ₹{product.price}
                        </span>
                        <span className="text-xs font-bold text-[#77716E] ml-1">/month</span>
                        {product.original_price > product.price && (
                          <span className="ml-2 text-xs text-[#77716E] line-through">
                            ₹{product.original_price}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-[#221D1D] bg-[#AED7E9]/40 px-2.5 py-0.5 rounded-full border border-[#AED7E9]">
                        Monthly Access • Cancel Anytime
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => handleOpenPreview(product)}
                        className="py-3 px-4 rounded-full border border-[#221D1D] hover:bg-[#F7F7F5] bg-white text-[#221D1D] text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Eye className="w-4 h-4 text-[#221D1D]" />
                        <span>Free Sample</span>
                      </button>

                      <Link
                        href={`/product/${product.id}`}
                        className="py-3 px-4 rounded-full bg-[#F7F7F5] hover:bg-[#E7E4E7] border border-[#E7E4E7] text-[#221D1D] text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                    <button
                      onClick={() => handleSubscribeNow(product)}
                      className="w-full py-3.5 px-4 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#221D1D]" />
                      <span>Enroll Now (₹{product.price}/mo)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Real DRM Protected Canvas PDF Reader with Preview Limit Enforcement */}
      <SecurePdfReader
        isOpen={previewState.open}
        onClose={() => setPreviewState((prev) => ({ ...prev, open: false }))}
        pdfUrl={previewState.pdfUrl}
        title={previewState.title}
        previewPagesLimit={previewState.previewLimit}
        isPurchased={false}
        price={previewState.price}
        onBuy={() => {
          if (previewState.product) {
            handleSubscribeNow(previewState.product);
          }
          setPreviewState((prev) => ({ ...prev, open: false }));
        }}
      />

      <Footer />
    </div>
  );
}

export default function CoursesCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex flex-col justify-between">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#AED7E9] border-t-transparent rounded-full animate-spin" />
          </div>
          <Footer />
        </div>
      }
    >
      <CoursesCatalogContent />
    </Suspense>
  );
}

