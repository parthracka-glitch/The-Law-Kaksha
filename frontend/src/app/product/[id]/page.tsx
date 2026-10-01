"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EnhancedSampleChapterModal } from "@/components/EnhancedSampleChapterModal";
import { useCart } from "@/context/CartContext";
import { apiRequest } from "@/lib/api";
import {
  CheckCircle2,
  ArrowRight,
  Eye,
  ShoppingBag,
  Sparkles,
  BookOpen,
  ChevronRight,
  Lock,
  Check,
  FileText,
} from "lucide-react";

const FALLBACK_CATALOG: Record<string, any> = {
  "course-ca-foundation-sub": {
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
    syllabus: [
      { chapter: "Chapter 1", title: "Indian Regulatory Framework & Sources of Law" },
      { chapter: "Chapter 2", title: "The Indian Contract Act, 1872 (Units 1 to 9)" },
      { chapter: "Chapter 3", title: "The Sale of Goods Act, 1930 (Conditions, Warranties & Unpaid Seller)" },
      { chapter: "Chapter 4", title: "The Indian Partnership Act, 1932 (Units 1, 2 & 3)" },
      { chapter: "Chapter 5", title: "The Limited Liability Partnership Act, 2008" },
      { chapter: "Chapter 6", title: "The Companies Act, 2013 (Essential Features & Incorporation)" },
      { chapter: "Chapter 7", title: "The Negotiable Instruments Act, 1881 (Promissory Notes, Cheques & Sec 138)" },
    ],
  },
  "ca-foundation": {
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
    syllabus: [
      { chapter: "Chapter 1", title: "Indian Regulatory Framework & Sources of Law" },
      { chapter: "Chapter 2", title: "The Indian Contract Act, 1872 (Units 1 to 9)" },
      { chapter: "Chapter 3", title: "The Sale of Goods Act, 1930 (Conditions, Warranties & Unpaid Seller)" },
      { chapter: "Chapter 4", title: "The Indian Partnership Act, 1932 (Units 1, 2 & 3)" },
      { chapter: "Chapter 5", title: "The Limited Liability Partnership Act, 2008" },
      { chapter: "Chapter 6", title: "The Companies Act, 2013 (Essential Features & Incorporation)" },
      { chapter: "Chapter 7", title: "The Negotiable Instruments Act, 1881 (Promissory Notes, Cheques & Sec 138)" },
    ],
  },
  "ca-foundation-business-laws-monthly-access": {
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
    syllabus: [
      { chapter: "Chapter 1", title: "Indian Regulatory Framework & Sources of Law" },
      { chapter: "Chapter 2", title: "The Indian Contract Act, 1872 (Units 1 to 9)" },
      { chapter: "Chapter 3", title: "The Sale of Goods Act, 1930 (Conditions, Warranties & Unpaid Seller)" },
      { chapter: "Chapter 4", title: "The Indian Partnership Act, 1932 (Units 1, 2 & 3)" },
      { chapter: "Chapter 5", title: "The Limited Liability Partnership Act, 2008" },
      { chapter: "Chapter 6", title: "The Companies Act, 2013 (Essential Features & Incorporation)" },
      { chapter: "Chapter 7", title: "The Negotiable Instruments Act, 1881 (Promissory Notes, Cheques & Sec 138)" },
    ],
  },
  "course-cseet-sub": {
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
    syllabus: [
      { chapter: "Unit 1", title: "Indian Contract Act, 1872 (Essentials & Enforceability)" },
      { chapter: "Unit 2", title: "Sale of Goods Act, 1930 (Conditions & Warranties)" },
      { chapter: "Unit 3", title: "Indian Partnership Act, 1932 (Mutual Agency & Dissolution)" },
      { chapter: "Unit 4", title: "Limited Liability Partnership Act, 2008 (Governance)" },
      { chapter: "Unit 5", title: "Companies Act, 2013 (Basics, MoA & AoA)" },
      { chapter: "Unit 6", title: "Negotiable Instruments Act, 1881 (Banking Instruments)" },
      { chapter: "Unit 7", title: "General Principles of Management (Fayol & Taylor Theories)" },
      { chapter: "Unit 8", title: "Business Environment & Corporate Ethics" },
    ],
  },
  "cseet": {
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
    syllabus: [
      { chapter: "Unit 1", title: "Indian Contract Act, 1872 (Essentials & Enforceability)" },
      { chapter: "Unit 2", title: "Sale of Goods Act, 1930 (Conditions & Warranties)" },
      { chapter: "Unit 3", title: "Indian Partnership Act, 1932 (Mutual Agency & Dissolution)" },
      { chapter: "Unit 4", title: "Limited Liability Partnership Act, 2008 (Governance)" },
      { chapter: "Unit 5", title: "Companies Act, 2013 (Basics, MoA & AoA)" },
      { chapter: "Unit 6", title: "Negotiable Instruments Act, 1881 (Banking Instruments)" },
      { chapter: "Unit 7", title: "General Principles of Management (Fayol & Taylor Theories)" },
      { chapter: "Unit 8", title: "Business Environment & Corporate Ethics" },
    ],
  },
  "cseet-business-law-management-monthly-access": {
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
    syllabus: [
      { chapter: "Unit 1", title: "Indian Contract Act, 1872 (Essentials & Enforceability)" },
      { chapter: "Unit 2", title: "Sale of Goods Act, 1930 (Conditions & Warranties)" },
      { chapter: "Unit 3", title: "Indian Partnership Act, 1932 (Mutual Agency & Dissolution)" },
      { chapter: "Unit 4", title: "Limited Liability Partnership Act, 2008 (Governance)" },
      { chapter: "Unit 5", title: "Companies Act, 2013 (Basics, MoA & AoA)" },
      { chapter: "Unit 6", title: "Negotiable Instruments Act, 1881 (Banking Instruments)" },
      { chapter: "Unit 7", title: "General Principles of Management (Fayol & Taylor Theories)" },
      { chapter: "Unit 8", title: "Business Environment & Corporate Ethics" },
    ],
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const { addToCart, setIsCartOpen, setCheckoutStep } = useCart();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [sampleModalOpen, setSampleModalOpen] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      const res = await apiRequest(`/api/catalog/${productId}`);
      if (res.success && res.data) {
        setProduct(res.data.product || res.data.item);
      } else if (FALLBACK_CATALOG[productId]) {
        setProduct(FALLBACK_CATALOG[productId]);
      }
      setLoading(false);
    }
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#005FD8] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto px-4 py-24 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-500">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-serif">Resource Not Found</h1>
          <p className="text-sm text-slate-500">The requested course does not exist or has been moved.</p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#004B99] text-white text-xs font-semibold shadow-xs"
          >
            <span>Back to All Courses &amp; Notes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentPrice = product.price || 99;
  const originalPrice = product.original_price || 299;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: currentPrice,
      originalPrice: originalPrice,
      format: "pdf",
      category: product.category,
      badge: product.badge,
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setCheckoutStep("details");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/courses" className="hover:text-slate-900 transition-colors">Courses &amp; Notes</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          {/* Left Column: Visual Cover & Preview Trigger */}
          <div className="lg:col-span-5 space-y-5 flex flex-col items-center">
            <div className="w-full rounded-3xl bg-slate-50/80 border border-slate-100 p-8 sm:p-10 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="relative group/book rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white max-w-[240px] sm:max-w-[280px] transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <Image
                  src={product.cover_image || "/assets/ca-cs-hero-books-v2.png"}
                  alt={product.title}
                  width={340}
                  height={510}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </div>

            {/* Free Sample Preview Trigger */}
            <button
              onClick={() => setSampleModalOpen(true)}
              className="w-full py-3 px-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Eye className="w-4 h-4 text-[#005FD8]" />
              <span>Read Free Sample Chapter (Watermarked PDF)</span>
            </button>
          </div>

            {/* Right Column: Details & Subscription Options */}
            <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold text-[#005FD8] tracking-wide uppercase bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                      {product.examBody || "ICAI"} • {product.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {product.pages_or_duration}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1E40] tracking-tight leading-tight font-serif">
                    {product.title}
                  </h1>
                  <p className="text-sm text-slate-600 mt-2.5 leading-relaxed font-normal">
                    {product.description}
                  </p>
                </div>

                {/* Material Format Edition */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-slate-800 tracking-tight">
                    Select Material Format Edition
                  </label>
                  <div className="p-4 rounded-2xl border-2 border-[#005FD8] bg-blue-50/40 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#005FD8] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        <FileText className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">Encrypted PDF</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                            Instant Access
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">Instant Digital Vault • Online Browser Reading</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-[#0B1E40] font-serif">₹{currentPrice}</span>
                      <span className="text-[10px] text-slate-400 block">/month</span>
                    </div>
                  </div>
                </div>

                {/* What's Included */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-800 tracking-tight">
                    What&apos;s Included in this Module
                  </label>
                  <div className="space-y-2">
                    {(product.highlights || []).map((hl: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-[#005FD8] shrink-0 mt-0.5" />
                        <span className="leading-snug">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action CTA */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
                      ₹{currentPrice}
                    </span>
                    {originalPrice > currentPrice && (
                      <span className="ml-2.5 text-sm text-slate-400 line-through">
                        ₹{originalPrice}
                      </span>
                    )}
                    {originalPrice > currentPrice && (
                      <span className="ml-2.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Save ₹{originalPrice - currentPrice}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                    <Lock className="w-3.5 h-3.5 text-[#005FD8]" />
                    <span>Instant Access • Online Browser Reading</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={handleBuyNow}
                    className="order-1 sm:order-2 py-3.5 px-4 rounded-xl bg-[#004B99] hover:bg-[#003D7A] text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 min-h-[48px]"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="order-2 sm:order-1 py-3.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 min-h-[48px]"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#005FD8]" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        {/* Detailed Chapter Syllabus */}
        {product.syllabus && product.syllabus.length > 0 && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#0B1E40] tracking-tight font-serif">
                  Curriculum &amp; Table of Contents
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete legislative mapping and chapter breakdown
                </p>
              </div>
              <span className="self-start sm:self-auto text-xs font-bold text-[#005FD8] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                {product.syllabus.length} Chapters / Modules Covered
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {product.syllabus.map((ch: any, idx: number) => (
                <div key={idx} className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs font-bold text-[#005FD8] w-28 shrink-0">
                      {ch.chapter}
                    </span>
                    <span className="font-medium text-slate-800">{ch.title}</span>
                  </div>
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <EnhancedSampleChapterModal
        isOpen={sampleModalOpen}
        onClose={() => setSampleModalOpen(false)}
        bookTitle={product.title}
        bookId={product.id}
        bookPrice={currentPrice}
      />

      <Footer />
    </div>
  );
}

