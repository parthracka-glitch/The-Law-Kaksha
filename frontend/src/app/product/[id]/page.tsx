"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EnhancedSampleChapterModal } from "@/components/EnhancedSampleChapterModal";
import { useCart, BookFormat, FORMAT_PRICING } from "@/context/CartContext";
import { apiRequest } from "@/lib/api";
import {
  CheckCircle2,
  ArrowRight,
  Eye,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Star,
  BookOpen,
  ChevronRight,
  Truck,
  Zap,
  Lock,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const { addToCart, setIsCartOpen, setCheckoutStep } = useCart();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState<BookFormat>("pdf");
  const [sampleModalOpen, setSampleModalOpen] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      const res = await apiRequest(`/api/catalog/${productId}`);
      if (res.success && res.data) {
        setProduct(res.data.product || res.data.item);
      }
      setLoading(false);
    }
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto px-4 py-20 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h1 className="text-xl font-bold text-slate-900">Product Not Found</h1>
          <p className="text-sm text-slate-500">The requested course or book does not exist or has been archived.</p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
          >
            <span>Back to All Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate format adjusted pricing
  const basePrice = product.price;
  let currentPrice = basePrice;
  let originalPrice = product.original_price || Math.round(basePrice * 1.6);

  if (selectedFormat === "paperback") {
    currentPrice = Math.round(basePrice * 1.8);
    originalPrice = Math.round(currentPrice * 1.5);
  } else if (selectedFormat === "combo") {
    currentPrice = Math.round(basePrice * 2.2);
    originalPrice = Math.round(currentPrice * 1.6);
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: `${product.title} (${selectedFormat.toUpperCase()})`,
      price: currentPrice,
      originalPrice: originalPrice,
      format: selectedFormat,
      category: product.category,
      badge: product.badge,
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setCheckoutStep("shipping");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/courses" className="hover:text-slate-900">Courses</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-xs">
          {/* Left Column: Cover & Preview Trigger */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl bg-slate-50/80 border border-slate-200/90 p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-xs">
              <div className="relative group/book rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(2,132,199,0.18)] border border-slate-200 bg-white max-w-[320px] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(2,132,199,0.25)] hover:-translate-y-1">
                {/* 3D Spine Lighting highlight */}
                <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/25 via-white/20 to-transparent z-10 pointer-events-none" />
                <Image
                  src={
                    product.id.includes("vol-2")
                      ? "/covers/vol2-codex.webp"
                      : product.id.includes("combo") || product.id.includes("both")
                      ? "/covers/combo-codex.webp"
                      : "/covers/vol1-codex.webp"
                  }
                  alt={product.title}
                  width={340}
                  height={510}
                  className="w-full h-auto object-cover object-top"
                  priority
                />
              </div>
            </div>

            {/* 2-Page Sample Preview Trigger */}
            <button
              onClick={() => setSampleModalOpen(true)}
              className="w-full py-3 px-4 rounded-xl border border-sky-200 bg-sky-50/70 hover:bg-sky-100 text-[#0284C7] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Read 2-3 Page Free Sample Chapter</span>
            </button>
          </div>

          {/* Right Column: Details & Purchase Options */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
                  {product.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif mt-1">
                  {product.title}
                </h1>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Format Switcher */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Format
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedFormat("pdf")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedFormat === "pdf"
                        ? "border-[#0284C7] bg-sky-50/60 ring-2 ring-[#0284C7]/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-900">Encrypted PDF</div>
                    <div className="text-[11px] text-slate-500">Instant Student Vault</div>
                    <div className="font-extrabold text-xs text-[#0284C7] mt-1">₹{basePrice}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedFormat("paperback")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedFormat === "paperback"
                        ? "border-[#0284C7] bg-sky-50/60 ring-2 ring-[#0284C7]/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-900">Deluxe Book</div>
                    <div className="text-[11px] text-slate-500">Doorstep Dispatch</div>
                    <div className="font-extrabold text-xs text-[#0284C7] mt-1">₹{Math.round(basePrice * 1.8)}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedFormat("combo")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedFormat === "combo"
                        ? "border-[#0284C7] bg-sky-50/60 ring-2 ring-[#0284C7]/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-900">Mastermind Combo</div>
                    <div className="text-[11px] text-slate-500">PDF + Book + Mock Pass</div>
                    <div className="font-extrabold text-xs text-[#0284C7] mt-1">₹{Math.round(basePrice * 2.2)}</div>
                  </button>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  What&apos;s Included
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(product.highlights || []).map((hl: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Action CTA */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-slate-900">
                    ₹{currentPrice}
                  </span>
                  <span className="ml-2 text-sm text-slate-400 line-through">
                    ₹{originalPrice}
                  </span>
                  <span className="ml-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Save ₹{originalPrice - currentPrice}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-slate-400" /> Free Pan-India Delivery
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-4 rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#0284C7]" />
                  <span>Add to Basket</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:from-[#0369A1] hover:to-[#0284C7] text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Chapter Syllabus */}
        {product.syllabus && product.syllabus.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-serif">
                  Chapter-Wise Table of Contents
                </h3>
                <p className="text-xs text-slate-500">
                  Comprehensive Bare Act synthesis &amp; statutory breakdown
                </p>
              </div>
              <span className="text-xs font-bold text-[#0284C7] bg-sky-50 px-2.5 py-1 rounded-full">
                {product.syllabus.length} Chapters / Modules
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {product.syllabus.map((ch: any, idx: number) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-[#0284C7] w-20 shrink-0">
                      {ch.chapter}
                    </span>
                    <span className="font-medium text-slate-800">{ch.title}</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
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
