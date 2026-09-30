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
  Check,
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
      <div className="min-h-screen bg-[#FBFBFD] flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#0071E3] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto px-4 py-24 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-black/[0.03] border border-black/[0.06] flex items-center justify-center mx-auto text-[#86868B]">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-[#1D1D1F]">Product Not Found</h1>
          <p className="text-sm text-[#86868B]">The requested course or book does not exist or has been archived.</p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#1D1D1F] hover:bg-black text-white text-xs font-medium transition-all active:scale-[0.98]"
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
    <div className="min-h-screen bg-[#FBFBFD] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#86868B]">
          <Link href="/" className="hover:text-[#1D1D1F] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-black/30" />
          <Link href="/courses" className="hover:text-[#1D1D1F] transition-colors">Courses &amp; Codices</Link>
          <ChevronRight className="w-3 h-3 text-black/30" />
          <span className="text-[#1D1D1F] font-medium truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          {/* Left Column: Cover & Preview Trigger */}
          <div className="lg:col-span-5 space-y-5 flex flex-col items-center">
            <div className="w-full rounded-3xl bg-[#F5F5F7] border border-black/[0.04] p-8 sm:p-10 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="relative group/book rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-black/[0.06] bg-white max-w-[280px] sm:max-w-[320px] transition-all duration-300 hover:shadow-[0_28px_50px_rgba(0,0,0,0.16)] hover:-translate-y-1">
                {/* 3D Spine Lighting highlight */}
                <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/20 via-white/20 to-transparent z-10 pointer-events-none" />
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
              className="w-full py-3 px-5 rounded-full border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.06] text-[#1D1D1F] font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
            >
              <Eye className="w-4 h-4 text-[#0071E3]" />
              <span>Read 2-3 Page Free Sample Chapter</span>
            </button>
          </div>

          {/* Right Column: Details & Purchase Options */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <span className="text-[11px] font-semibold text-[#0071E3] tracking-wide uppercase">
                  {product.category}
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1D1D1F] tracking-tight mt-1.5 leading-tight">
                  {product.title}
                </h1>
                <p className="text-sm text-[#86868B] mt-2.5 leading-relaxed font-normal">
                  {product.description}
                </p>
              </div>

              {/* Format Switcher */}
              <div className="space-y-2.5 pt-4 border-t border-black/[0.06]">
                <label className="block text-xs font-semibold text-[#1D1D1F] tracking-tight">
                  Select Format Edition
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedFormat("pdf")}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedFormat === "pdf"
                        ? "border-[#0071E3] bg-[#0071E3]/[0.03] ring-1 ring-[#0071E3]"
                        : "border-black/[0.08] hover:border-black/[0.16] bg-white"
                    }`}
                  >
                    <div className="font-semibold text-xs text-[#1D1D1F]">Encrypted PDF</div>
                    <div className="text-[11px] text-[#86868B] mt-0.5">Instant Student Vault</div>
                    <div className="font-semibold text-xs text-[#0071E3] mt-2">₹{basePrice}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedFormat("paperback")}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedFormat === "paperback"
                        ? "border-[#0071E3] bg-[#0071E3]/[0.03] ring-1 ring-[#0071E3]"
                        : "border-black/[0.08] hover:border-black/[0.16] bg-white"
                    }`}
                  >
                    <div className="font-semibold text-xs text-[#1D1D1F]">Deluxe Book</div>
                    <div className="text-[11px] text-[#86868B] mt-0.5">Doorstep Dispatch</div>
                    <div className="font-semibold text-xs text-[#0071E3] mt-2">₹{Math.round(basePrice * 1.8)}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedFormat("combo")}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedFormat === "combo"
                        ? "border-[#0071E3] bg-[#0071E3]/[0.03] ring-1 ring-[#0071E3]"
                        : "border-black/[0.08] hover:border-black/[0.16] bg-white"
                    }`}
                  >
                    <div className="font-semibold text-xs text-[#1D1D1F]">Mastermind Combo</div>
                    <div className="text-[11px] text-[#86868B] mt-0.5">PDF + Book + Pass</div>
                    <div className="font-semibold text-xs text-[#0071E3] mt-2">₹{Math.round(basePrice * 2.2)}</div>
                  </button>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-2.5 pt-4 border-t border-black/[0.06]">
                <label className="block text-xs font-semibold text-[#1D1D1F] tracking-tight">
                  What&apos;s Included
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(product.highlights || []).map((hl: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#515154]">
                      <Check className="w-3.5 h-3.5 text-[#0071E3] shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Action CTA */}
            <div className="space-y-4 pt-6 border-t border-black/[0.06]">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
                    ₹{currentPrice}
                  </span>
                  <span className="ml-2.5 text-sm text-[#86868B] line-through">
                    ₹{originalPrice}
                  </span>
                  <span className="ml-2.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Save ₹{originalPrice - currentPrice}
                  </span>
                </div>
                <div className="text-xs text-[#86868B] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#86868B]" /> Free Pan-India Delivery
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-4 rounded-full border border-black/[0.1] hover:bg-black/[0.04] text-[#1D1D1F] text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4 text-[#0071E3]" />
                  <span>Add to Bag</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-3 px-4 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs sm:text-sm font-medium shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
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
          <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#1D1D1F] tracking-tight">
                  Chapter-Wise Table of Contents
                </h3>
                <p className="text-xs text-[#86868B] mt-0.5">
                  Comprehensive Bare Act synthesis &amp; statutory breakdown
                </p>
              </div>
              <span className="self-start sm:self-auto text-xs font-medium text-[#0071E3] bg-[#0071E3]/[0.08] px-3 py-1 rounded-full">
                {product.syllabus.length} Chapters / Modules
              </span>
            </div>

            <div className="divide-y divide-black/[0.04]">
              {product.syllabus.map((ch: any, idx: number) => (
                <div key={idx} className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs font-semibold text-[#0071E3] w-24 shrink-0">
                      {ch.chapter}
                    </span>
                    <span className="font-medium text-[#1D1D1F]">{ch.title}</span>
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
