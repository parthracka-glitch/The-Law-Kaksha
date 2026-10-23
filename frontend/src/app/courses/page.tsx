"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SecurePdfReader } from "@/components/SecurePdfReader";
import { useCart } from "@/context/CartContext";
import { apiRequest, isUserAuthenticated } from "@/lib/api";
import {
  Search,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Eye,
  ShoppingBag,
  GraduationCap,
  Clock,
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
  paymentType?: "monthly" | "one-time";
  accentColor?: string;
  iconEmoji?: string;
  comingSoon?: boolean;
}

interface FreeResource {
  id: string;
  title: string;
  description?: string;
  type: string;
  actName: string;
  pages?: string;
  sampleUrl?: string;
  fileUrl?: string;
}

const FALLBACK_PRODUCTS: Product[] = [];

function CoursesCatalogContent() {
  const router = useRouter();
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
  const [freeResources, setFreeResources] = useState<FreeResource[]>([]);
  const [freePreview, setFreePreview] = useState({
    open: false,
    title: "",
    pdfUrl: "",
  });

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
        const fetched = (res.data.products || res.data.items || []).filter(
          (p) =>
            p.id !== "prod-vol1" &&
            p.id !== "prod-vol2" &&
            !p.title.includes("Volume 1: Business Law") &&
            !p.title.includes("Volume 2: CSEET")
        );
        if (Array.isArray(fetched)) {
          setProducts(fetched);
        }
      }
    }
    loadCatalog();
  }, []);

  useEffect(() => {
    async function loadFreeResources() {
      const res = await apiRequest<{ resources?: FreeResource[] }>(
        "/api/resources?course=ca-foundation&sampleOnly=true"
      );
      if (res.success && Array.isArray(res.data?.resources)) {
        setFreeResources(res.data.resources);
      }
    }
    loadFreeResources();
  }, []);

  const filteredProducts = products.filter((p) => {
    // Explicitly exclude discontinued Volume 1 & Volume 2 courses
    if (
      p.id === "prod-vol1" ||
      p.id === "prod-vol2" ||
      p.title.includes("Volume 1: Business Law") ||
      p.title.includes("Volume 2: CSEET")
    ) {
      return false;
    }

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

  const filteredFreeResources =
    selectedCourse === "course-cseet"
      ? []
      : freeResources.filter((resource) => {
          const query = search.trim().toLowerCase();
          if (!query) return true;
          return [resource.title, resource.description, resource.actName]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(query));
        });

  const handleOpenPreview = (product: Product) => {
    const defaultPdf = product.id.includes("cseet") || product.courseId === "course-cseet"
      ? "/notes/cseet-management-full.pdf"
      : "/notes/sale-of-goods-unit-1.pdf";
    const rawPdf = product.pdfUrl || defaultPdf;
    const samplePdfUrl = rawPdf.includes("sample=true") ? rawPdf : `${rawPdf}?sample=true`;
    setPreviewState({
      open: true,
      title: product.title,
      pdfUrl: samplePdfUrl,
      previewLimit: product.previewPagesLimit || 5,
      price: product.price,
      product,
    });
  };

  const handleSubscribeNow = (product: Product) => {
    if (!isUserAuthenticated()) {
      router.push("/login?redirect=/checkout");
      return;
    }
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      originalPrice: product.original_price,
      format: "pdf",
      category: product.category,
      badge: product.badge,
    });
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF]/30 flex flex-col justify-between text-[#0A192F]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full space-y-10">
        {/* 1. Header & Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#005A9C] text-xs font-semibold mb-1 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-[#005A9C]" />
            <span>Curriculum &amp; Study Notes</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A192F] tracking-tight">
            Courses, Smart Question Banks &amp; Study Notes
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed max-w-2xl mx-auto">
            Browse all available statutory question banks, unit-wise notes, weekly case studies, and examination test series for CA Foundation and CSEET.
          </p>
        </div>

        {/* 2. Minimal Filter & Search Bar */}
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-[#DBEAFE] shadow-sm">
          {/* Program Toggle */}
          <div className="flex p-1 bg-[#F0F7FF] rounded-xl w-full sm:w-auto gap-1 overflow-x-auto no-scrollbar scrollbar-none touch-pan-x border border-[#DBEAFE]">
            <button
              onClick={() => setSelectedCourse("all")}
              className={`flex-1 sm:flex-initial shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-[40px] flex items-center justify-center active:scale-95 ${
                selectedCourse === "all"
                  ? "bg-[#005A9C] text-white font-bold shadow-xs"
                  : "text-[#64748B] hover:text-[#0A192F]"
              }`}
            >
              All ({products.length})
            </button>
            <button
              onClick={() => setSelectedCourse("course-ca-foundation")}
              className={`flex-1 sm:flex-initial shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5 active:scale-95 ${
                selectedCourse === "course-ca-foundation"
                  ? "bg-[#005A9C] text-white font-bold shadow-xs"
                  : "text-[#64748B] hover:text-[#0A192F]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>CA Foundation</span>
            </button>
            <button
              onClick={() => setSelectedCourse("course-cseet")}
              className={`flex-1 sm:flex-initial shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5 active:scale-95 ${
                selectedCourse === "course-cseet"
                  ? "bg-[#005A9C] text-white font-bold shadow-xs"
                  : "text-[#64748B] hover:text-[#0A192F]"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>CSEET</span>
            </button>
          </div>

          {/* Simple Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search curriculum..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DBEAFE] bg-[#F0F7FF] focus:outline-none focus:ring-2 focus:ring-[#005A9C] focus:bg-white text-[#0A192F] placeholder-[#64748B] transition"
            />
          </div>
        </div>

        {/* 3. The Dedicated Course Cards */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-[#DBEAFE] rounded-3xl p-12 text-center space-y-4 shadow-sm max-w-xl mx-auto">
            <BookOpen className="w-10 h-10 text-[#64748B] mx-auto" />
            <h3 className="text-base font-bold text-[#0A192F]">No course found</h3>
            <p className="text-xs text-[#64748B]">
              Clear your search keyword to view the CA Foundation and CSEET courses.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCourse("all");
              }}
              className="px-5 py-2.5 rounded-full bg-[#005A9C] hover:bg-[#004F8A] text-white text-xs font-bold cursor-pointer shadow-xs active:scale-95 transition"
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
                  className="bg-white border border-[#DBEAFE] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs hover:border-[#005A9C]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 relative group hover:-translate-y-1"
                >
                  <div className="space-y-5">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FDF8E8] text-[#8C6D1F] border border-[#E8D8A6]">
                        {product.badge || "Launch Offer @ ₹99/mo"}
                      </span>
                      <span className="text-xs font-medium text-[#64748B] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#005A9C]" />
                        <span>{product.pages_or_duration}</span>
                      </span>
                    </div>

                    {/* Academic Visual Banner */}
                    <div className={`w-full rounded-2xl bg-gradient-to-br ${product.accentColor || "from-[#0A192F] via-[#102A4C] to-[#004275]"} p-5 sm:p-6 flex items-center justify-between gap-4 border border-white/10 shadow-inner`}>
                      <div className="space-y-1.5">
                        <div className="text-3xl">{product.iconEmoji || "📘"}</div>
                        <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">{product.category}</p>
                        <p className="text-sm font-semibold text-white leading-snug max-w-[220px]">{product.subtitle}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 text-[10px] font-bold text-white uppercase tracking-wider">
                          {product.examBody}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold text-white/90">
                          {product.pages_or_duration}
                        </span>
                        {product.paymentType === "one-time" && (
                          <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[10px] font-bold text-[#FDF8E8]">
                            Lifetime Access
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Course Title & Overview */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#005A9C] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#DBEAFE]">
                          {product.examBody}
                        </span>
                        <span className="text-xs text-[#64748B] font-medium">
                          {product.category}
                        </span>
                      </div>

                      <Link href={`/product/${product.id}`} className="block group-hover:text-[#005A9C] transition-colors">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#0A192F] leading-snug font-serif">
                          {product.title}
                        </h2>
                      </Link>

                      <p className="text-xs sm:text-sm text-[#334155] leading-relaxed mt-2 font-normal">
                        {product.description}
                      </p>
                    </div>

                    {/* Key Highlights Checklist */}
                    <div className="space-y-2 pt-4 border-t border-[#DBEAFE]">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                        Everything Included in Plan:
                      </h4>
                      {(product.highlights || []).map((hl, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#334155]">
                          <CheckCircle2 className="w-4 h-4 text-[#005A9C] shrink-0 mt-0.5" />
                          <span className="leading-snug">{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & CTA Controls */}
                  <div className="space-y-4 pt-5 border-t border-[#DBEAFE]">
                    <div className="flex items-baseline justify-between">
                      {product.comingSoon ? (
                        <span className="text-2xl font-extrabold text-[#64748B] tracking-tight font-serif">
                          Launching Soon
                        </span>
                      ) : (
                        <div>
                          <span className="text-3xl font-extrabold text-[#0A192F] tracking-tight font-serif">
                            ₹{product.price}
                          </span>
                          <span className="text-xs font-bold text-[#64748B] ml-1">
                            {product.paymentType === "one-time" ? "one-time" : "/month"}
                          </span>
                          {product.original_price > product.price && (
                            <span className="ml-2 text-xs text-[#94A3B8] line-through">
                              ₹{product.original_price}
                            </span>
                          )}
                        </div>
                      )}
                      <span className="text-[11px] font-bold text-[#005A9C] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#DBEAFE]">
                        {product.comingSoon
                          ? "Enrolment Opening Soon"
                          : product.paymentType === "one-time"
                            ? "Lifetime Access • One-Time"
                            : "Monthly Access • Cancel Anytime"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => product.pdfUrl && handleOpenPreview(product)}
                        disabled={!product.pdfUrl || product.comingSoon}
                        className="py-3 px-4 rounded-full border border-[#0A192F] hover:bg-[#F0F7FF] hover:border-[#005A9C] hover:text-[#005A9C] bg-white text-[#0A192F] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#0A192F]"
                      >
                        <Eye className="w-4 h-4" />
                        <span>{product.comingSoon ? "Sample Coming Soon" : product.pdfUrl ? "Free Sample" : "Sample Coming Soon"}</span>
                      </button>

                      <Link
                        href={`/product/${product.id}`}
                        className="py-3 px-4 rounded-full bg-[#F0F7FF] hover:bg-[#DBEAFE] border border-[#DBEAFE] text-[#005A9C] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                    {product.comingSoon ? (
                      <button
                        type="button"
                        disabled
                        className="w-full py-3.5 px-4 rounded-full bg-[#F1F5F9] text-[#94A3B8] text-xs font-bold border border-[#E2E8F0] flex items-center justify-center gap-2 cursor-not-allowed"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Coming Soon</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSubscribeNow(product)}
                        className="w-full py-3.5 px-4 rounded-full bg-[#005A9C] hover:bg-[#004F8A] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                      >
                        <ShoppingBag className="w-4 h-4 text-white" />
                        <span>
                          {product.paymentType === "one-time"
                            ? `Buy Now (₹${product.price} One-Time)`
                            : `Enroll Now (₹${product.price}/mo)`}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Free Watermarked Resources */}
        {filteredFreeResources.length > 0 && (
          <section className="max-w-5xl mx-auto space-y-5 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
                  <Eye className="w-3.5 h-3.5" />
                  Free Watermarked Resources
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0A192F] mt-2">
                  Read Free Samples
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                  Every page is watermarked and protected in our secure reader. Downloading, copying, and printing are disabled.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#64748B] bg-white border border-[#DBEAFE] rounded-full px-3 py-1.5">
                {filteredFreeResources.length} free files
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredFreeResources.map((resource) => (
                <div
                  key={resource.id}
                  className="bg-white border border-[#DBEAFE] rounded-2xl p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                        {resource.type === "practice" ? "Question Bank" : "Study Notes"}
                      </span>
                      <span className="text-[10px] font-semibold text-[#64748B]">
                        {resource.pages || "Free Sample"}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-[#0A192F] leading-snug">
                      {resource.title}
                    </h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      {resource.description || "Watermarked free study resource from The Law Kaksha."}
                    </p>
                    <p className="text-[10px] font-semibold text-[#005A9C]">
                      {resource.actName}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const rawUrl = resource.sampleUrl || resource.fileUrl;
                      if (rawUrl) {
                        const url = rawUrl.includes("sample=true") ? rawUrl : `${rawUrl}?sample=true`;
                        setFreePreview({
                          open: true,
                          title: resource.title,
                          pdfUrl: url,
                        });
                      }
                    }}
                    className="w-full py-2.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Read Free (Watermarked)</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
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

      <SecurePdfReader
        isOpen={freePreview.open}
        onClose={() => setFreePreview((prev) => ({ ...prev, open: false }))}
        pdfUrl={freePreview.pdfUrl}
        title={freePreview.title}
        isPurchased
        price={0}
        studentName="Free Resource"
        studentRoll="PUBLIC-SAMPLE"
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

