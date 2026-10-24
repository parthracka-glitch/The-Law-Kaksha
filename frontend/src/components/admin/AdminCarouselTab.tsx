"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  EyeOff,
  Eye,
  CheckCircle2,
  X,
  ArrowRight,
  ArrowUpRight,
  UploadCloud,
  ImageIcon,
  Loader2,
} from "lucide-react";

export interface SlideData {
  id: string;
  placement: string;
  title: string;
  subtitle: string;
  image: string;
  cta_label: string;
  cta_link?: string;
  badge?: string;
  rating?: string;
  is_active: boolean;
  order: number;
  display_order?: number;
}

interface CarouselApiResponse {
  success?: boolean;
  message?: string;
  data?: SlideData[];
  slides?: SlideData[];
}

const FALLBACK_SLIDE_IMAGE = "/images/hero_ca_foundation.jpg";

function SlideImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [fallbackApplied, setFallbackApplied] = useState(false);
  const resolvedSrc = fallbackApplied ? FALLBACK_SLIDE_IMAGE : (src || FALLBACK_SLIDE_IMAGE);
  const isExternalOrData =
    resolvedSrc.startsWith("http://") ||
    resolvedSrc.startsWith("https://") ||
    resolvedSrc.startsWith("data:") ||
    resolvedSrc.startsWith("blob:");

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      fill
      className={className}
      onError={() => setFallbackApplied(true)}
      unoptimized={isExternalOrData}
    />
  );
}

export const CANONICAL_HERO_SLIDES: SlideData[] = [
  {
    id: "slide-1",
    placement: "website",
    title: "Master CA Foundation Business Laws",
    subtitle: "Complete codified ICAI syllabus notes, high-yield visual flowcharts & daily exam-calibrated case studies.",
    image: "/images/hero_ca_foundation.jpg",
    cta_label: "Explore CA Foundation Pass",
    cta_link: "/courses",
    badge: "MOST POPULAR • PAPER 2",
    rating: "4.9/5 Rating (1,200+ Candidates)",
    is_active: true,
    order: 1,
    display_order: 1,
  },
  {
    id: "slide-2",
    placement: "website",
    title: "CSEET Business Law and Management",
    subtitle: "Interactive 3D digital codices, ICSI unit MCQs, and weekly live Google Meet doubt clearing sessions.",
    image: "/images/hero_cseet_law.jpg",
    cta_label: "Explore CSEET Pass",
    cta_link: "/courses",
    badge: "ICSI SYLLABUS • 8 UNITS",
    rating: "100% ICSI Exam Aligned",
    is_active: true,
    order: 2,
    display_order: 2,
  },
  {
    id: "slide-3",
    placement: "website",
    title: "Dual Foundation + CSEET All-Access Pass",
    subtitle: "One unified pass for comprehensive commerce law mastery. Complete statutory library at special launch pricing.",
    image: "/images/hero_dual_combo.jpg",
    cta_label: "Get Dual All-Access Pass @ ₹180",
    cta_link: "/courses",
    badge: "BEST VALUE • LAUNCH SPECIAL",
    rating: "Dual Course Master Bundle",
    is_active: true,
    order: 3,
    display_order: 3,
  },
];

const PRESET_ARTWORKS = [
  {
    label: "CA Foundation 3D Codex",
    src: "/images/hero_ca_foundation.jpg",
  },
  {
    label: "CSEET Law & Aptitude 3D",
    src: "/images/hero_cseet_law.jpg",
  },
  {
    label: "Dual Combo All-Access 3D",
    src: "/images/hero_dual_combo.jpg",
  },
];

export function AdminCarouselTab({
  adminFetch,
  showToast,
}: {
  adminFetch: (url: string, init?: RequestInit) => Promise<Response>;
  showToast: (msg: string) => void;
}) {
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentSlide, setCurrentSlide] = useState<Partial<SlideData>>({
    placement: "website",
    title: "",
    subtitle: "",
    image: "/images/hero_ca_foundation.jpg",
    cta_label: "Explore Subscription",
    cta_link: "/courses",
    badge: "FEATURED COURSE",
    is_active: true,
    order: 1,
  });

  const fetchSlides = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminFetch("/api/admin/carousel");
      const data: CarouselApiResponse = await res.json();
      const rawList: SlideData[] = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.slides)
        ? data.slides
        : [];

      if (rawList && rawList.length > 0) {
        setSlides(
          rawList.map((s, idx) => ({
            ...s,
            order: s.order || s.display_order || idx + 1,
            image: s.image || CANONICAL_HERO_SLIDES[idx % CANONICAL_HERO_SLIDES.length].image,
            badge: s.badge || "",
            cta_link: s.cta_link || "/courses",
          }))
        );
      } else {
        setSlides(CANONICAL_HERO_SLIDES);
      }
    } catch {
      setSlides(CANONICAL_HERO_SLIDES);
    } finally {
      setLoading(false);
    }
  }, [adminFetch]);

  const fetchSlidesRef = useRef(fetchSlides);
  useEffect(() => {
    fetchSlidesRef.current = fetchSlides;
  }, [fetchSlides]);

  useEffect(() => {
    fetchSlidesRef.current();
  }, []);

  const handleSyncWithLiveWebsite = async () => {
    try {
      setSyncing(true);
      const res = await adminFetch("/api/admin/carousel/sync-defaults", {
        method: "POST",
      });
      const data: CarouselApiResponse = await res.json();
      if (data.success && (Array.isArray(data.data) || Array.isArray(data.slides))) {
        setSlides(data.data || data.slides || []);
        showToast("Synchronized with current live website hero carousel!");
      } else {
        setSlides(CANONICAL_HERO_SLIDES);
        showToast("Synchronized with live website hero carousel defaults.");
      }
    } catch {
      setSlides(CANONICAL_HERO_SLIDES);
      showToast("Applied live website carousel hero defaults.");
    } finally {
      setSyncing(false);
    }
  };

  const handleDeviceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showToast("Image exceeds 15MB limit. Please select a smaller image.");
      return;
    }

    setIsUploadingImage(true);
    showToast("Uploading image from your device...");

    // Immediate preview for instant visual feedback
    const localPreview = URL.createObjectURL(file);
    setCurrentSlide((prev) => ({ ...prev, image: localPreview }));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await adminFetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setCurrentSlide((prev) => ({ ...prev, image: data.url }));
        showToast("Image uploaded successfully from device!");
      } else {
        // Fallback to base64 Data URL so user is never blocked
        const reader = new FileReader();
        reader.onloadend = () => {
          const resStr = typeof reader.result === "string" ? reader.result : "";
          if (resStr) {
            setCurrentSlide((prev) => ({ ...prev, image: resStr }));
          }
        };
        reader.readAsDataURL(file);
        showToast("Image loaded from device!");
      }
    } catch {
      // Offline / network fallback to base64 Data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const resStr = typeof reader.result === "string" ? reader.result : "";
        if (resStr) {
          setCurrentSlide((prev) => ({ ...prev, image: resStr }));
        }
      };
      reader.readAsDataURL(file);
      showToast("Image loaded from device!");
    } finally {
      setIsUploadingImage(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleToggleActive = async (slide: SlideData) => {
    try {
      const nextActive = !slide.is_active;
      const res = await adminFetch(`/api/admin/carousel/${slide.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: nextActive }),
      });
      const data: CarouselApiResponse = await res.json();
      if (data.success) {
        showToast(`Slide "${slide.title}" is now ${nextActive ? "Active" : "Hidden"}.`);
        setSlides((prev) =>
          prev.map((s) => (s.id === slide.id ? { ...s, is_active: nextActive } : s))
        );
      }
    } catch {
      alert("Failed to toggle visibility status.");
    }
  };

  const handleSave = async (e: React.FormEvent, andRedirect: boolean = false) => {
    e.preventDefault();
    try {
      const isEdit = !!currentSlide.id;
      const url = isEdit ? `/api/admin/carousel/${currentSlide.id}` : "/api/admin/carousel";
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        ...currentSlide,
        placement: "website",
        display_order: Number(currentSlide.order || 1),
      };

      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: CarouselApiResponse = await res.json();
      if (data.success) {
        showToast(isEdit ? "Slide updated successfully. Live on website!" : "Slide created successfully. Live on website!");
        setModalOpen(false);
        fetchSlides();
        if (andRedirect) {
          window.open("/", "_blank");
        }
      } else {
        alert(data.message || "Failed to save slide.");
      }
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this carousel slide?")) return;
    try {
      const res = await adminFetch(`/api/admin/carousel/${id}`, { method: "DELETE" });
      const data: CarouselApiResponse = await res.json();
      if (data.success) {
        showToast("Slide removed from carousel.");
        fetchSlides();
      } else {
        alert(data.message || "Delete failed.");
      }
    } catch {
      alert("Delete failed.");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-[#E7E4E7] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#BFAFE5]/30 text-[#221D1D] border border-[#BFAFE5]/50">
              Homepage Showcase
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {slides.length} {slides.length === 1 ? "Slide" : "Slides"}
            </span>
          </div>
          <h2 className="text-xl font-serif font-bold text-[#221D1D] mt-1">
            Website Carousel Slide Editor
          </h2>
          <p className="text-xs text-[#77716E] mt-0.5">
            Configure homepage hero carousel slides, statutory 3D artworks, promotion badges, and CTA destinations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#005A9C] text-xs font-bold shadow-2xs transition-all cursor-pointer"
            title="Open live homepage in a new tab to see carousel changes"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Website</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>

          <button
            onClick={handleSyncWithLiveWebsite}
            disabled={syncing}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            title="Reset or synchronize with current live homepage slides"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-[#4B8097]" : "text-slate-500"}`} />
            <span>{syncing ? "Syncing..." : "Sync with Website"}</span>
          </button>

          <button
            onClick={() => {
              setCurrentSlide({
                placement: "website",
                title: "",
                subtitle: "",
                image: "/images/hero_ca_foundation.jpg",
                cta_label: "Explore Plan",
                cta_link: "/courses",
                badge: "NEW LAUNCH",
                is_active: true,
                order: slides.length + 1,
              });
              setModalOpen(true);
            }}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#221D1D] hover:bg-black text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Slide</span>
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && slides.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-[#E7E4E7] animate-pulse space-y-4">
              <div className="w-full h-36 bg-slate-100 rounded-2xl" />
              <div className="h-4 bg-slate-100 rounded-md w-3/4" />
              <div className="h-3 bg-slate-100 rounded-md w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((s) => (
          <div
            key={s.id}
            className={`bg-white rounded-3xl p-5 border shadow-xs flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
              s.is_active ? "border-[#E7E4E7]" : "border-dashed border-slate-300 opacity-80"
            }`}
          >
            <div>
              {/* Image Preview with Badges */}
              <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-slate-100 border border-[#E7E4E7] mb-4">
                <SlideImage
                  key={s.image || FALLBACK_SLIDE_IMAGE}
                  src={s.image || FALLBACK_SLIDE_IMAGE}
                  alt={s.title}
                  className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                />

                {/* Badge Overlay */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-white/95 text-[#221D1D] shadow-xs backdrop-blur-xs border border-white/50">
                    Slide #{s.order}
                  </span>
                  {s.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-[#BFAFE5] text-[#221D1D] shadow-xs">
                      {s.badge}
                    </span>
                  )}
                </div>

                {/* Status Toggle in Corner */}
                <button
                  type="button"
                  onClick={() => handleToggleActive(s)}
                  className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs transition-colors ${
                    s.is_active
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                      : "bg-slate-800/80 text-white backdrop-blur-xs"
                  }`}
                  title={s.is_active ? "Click to Hide" : "Click to Make Active"}
                >
                  {s.is_active ? (
                    <>
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      <span>Live</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-2.5 h-2.5 text-slate-300" />
                      <span>Hidden</span>
                    </>
                  )}
                </button>
              </div>

              {/* Slide Meta Copy */}
              <div>
                <h3 className="font-serif font-bold text-base text-[#221D1D] line-clamp-1 mb-1" title={s.title}>
                  {s.title}
                </h3>
                <p className="text-xs text-[#77716E] line-clamp-2 leading-relaxed mb-4" title={s.subtitle}>
                  {s.subtitle || "No subtitle provided."}
                </p>
              </div>
            </div>

            {/* Bottom Actions and CTA */}
            <div className="pt-3.5 border-t border-[#E7E4E7] space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 font-semibold text-[#221D1D] bg-[#F7F7F5] px-2.5 py-1 rounded-lg border border-[#E7E4E7] max-w-[200px] truncate">
                  <span className="truncate">{s.cta_label || "Explore"}</span>
                  <ArrowRight className="w-3 h-3 shrink-0 text-slate-500" />
                </div>
                <span className="text-[10px] font-mono text-slate-400 truncate max-w-[100px]">
                  {s.cta_link || "/courses"}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => {
                    setCurrentSlide(s);
                    setModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                  title="Delete Slide"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full p-4 sm:p-8 shadow-2xl border border-[#E7E4E7] space-y-5 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 sm:right-6 top-4 sm:top-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#BFAFE5]/40 text-[#221D1D]">
                  {currentSlide.id ? "Edit Slide" : "New Slide"}
                </span>
              </div>
              <h3 className="text-lg font-serif font-bold text-[#221D1D]">
                {currentSlide.id ? "Configure Carousel Slide" : "Add Website Hero Slide"}
              </h3>
              <p className="text-xs text-[#77716E]">
                Customize high-impact headline text, select 3D statutory artwork, and specify the CTA button.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  value={currentSlide.title || ""}
                  onChange={(e) => setCurrentSlide({ ...currentSlide, title: e.target.value })}
                  placeholder="e.g. Master CA Foundation Business Laws"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#221D1D] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 transition"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subtitle Description</label>
                <textarea
                  rows={2}
                  value={currentSlide.subtitle || ""}
                  onChange={(e) => setCurrentSlide({ ...currentSlide, subtitle: e.target.value })}
                  placeholder="Complete codified syllabus notes, high-yield visual flowcharts..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#221D1D] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 transition leading-relaxed"
                />
              </div>

              {/* 3D Statutory Artwork & Device Upload */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#005A9C]" />
                    <span>3D Statutory Artwork Image</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-normal">Choose preset or upload from device</span>
                </div>

                {/* Hidden File Input for Device Upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleDeviceImageUpload}
                />

                {/* Prominent Upload Image from Device Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="w-full group flex items-center justify-between px-4 py-3 rounded-xl border-2 border-dashed border-[#005A9C]/40 hover:border-[#005A9C] bg-[#EFF6FF] hover:bg-[#DBEAFE]/70 text-[#005A9C] transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#005A9C] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      {isUploadingImage ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <UploadCloud className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-xs text-[#0A192F] flex items-center gap-2">
                        <span>{isUploadingImage ? "Uploading from Device..." : "Upload Image from Device"}</span>
                        <span className="px-1.5 py-0.5 rounded-md bg-[#005A9C]/10 text-[#005A9C] text-[9px] font-bold">
                          Direct Phone / PC Upload
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B]">
                        Choose any JPG, PNG, or WebP photo directly from your files
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-[#005A9C] bg-white px-2.5 py-1.5 rounded-lg border border-[#005A9C]/20 shadow-2xs">
                    <span>Browse Device</span>
                  </div>
                </button>

                {/* Current Active Preview Banner */}
                {currentSlide.image && (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="relative w-14 h-12 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={currentSlide.image}
                        alt="Current selected artwork"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-[#0A192F]">Selected Artwork</span>
                        {PRESET_ARTWORKS.some((p) => p.src === currentSlide.image) ? (
                          <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 text-[9px] font-semibold">
                            Official 3D Preset
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-semibold">
                            Uploaded from Device
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate font-mono mt-0.5" title={currentSlide.image}>
                        {currentSlide.image}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-semibold transition cursor-pointer shrink-0"
                    >
                      Change
                    </button>
                  </div>
                )}

                {/* Preset Artwork Buttons */}
                <div>
                  <span className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                    Or choose from official 3D statutory presets:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_ARTWORKS.map((preset) => {
                      const isSelected = currentSlide.image === preset.src;
                      return (
                        <button
                          type="button"
                          key={preset.src}
                          onClick={() => setCurrentSlide({ ...currentSlide, image: preset.src })}
                          className={`p-2 rounded-xl border text-left flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#005A9C] bg-[#EFF6FF] ring-2 ring-[#005A9C]/20 shadow-xs"
                              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className="relative w-full h-14 rounded-lg overflow-hidden bg-slate-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={preset.src}
                              alt={preset.label}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className={`text-[10px] font-semibold text-center line-clamp-1 ${
                            isSelected ? "text-[#005A9C] font-bold" : "text-[#221D1D]"
                          }`}>
                            {preset.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom URL Input */}
                <div>
                  <span className="block text-[10px] text-slate-400 mb-1">
                    Or custom image path or URL:
                  </span>
                  <input
                    type="text"
                    value={currentSlide.image || ""}
                    onChange={(e) => setCurrentSlide({ ...currentSlide, image: e.target.value })}
                    placeholder="Custom image path or URL (e.g. /images/hero_ca_foundation.jpg or https://...)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#221D1D] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/20 transition font-mono"
                  />
                </div>
              </div>

              {/* Badge & Order */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={currentSlide.badge || ""}
                    onChange={(e) => setCurrentSlide({ ...currentSlide, badge: e.target.value })}
                    placeholder="e.g. MOST POPULAR • PAPER 2"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#221D1D] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 transition"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Display Order (1, 2, 3...)</label>
                  <input
                    type="number"
                    min={1}
                    value={currentSlide.order || 1}
                    onChange={(e) => setCurrentSlide({ ...currentSlide, order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#221D1D] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 transition font-mono"
                  />
                </div>
              </div>

              {/* CTA Label & Link */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Button CTA Text</label>
                  <input
                    type="text"
                    value={currentSlide.cta_label || ""}
                    onChange={(e) => setCurrentSlide({ ...currentSlide, cta_label: e.target.value })}
                    placeholder="e.g. Explore CA Foundation Pass"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#221D1D] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 transition"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Link Destination</label>
                  <input
                    type="text"
                    value={currentSlide.cta_link || ""}
                    onChange={(e) => setCurrentSlide({ ...currentSlide, cta_link: e.target.value })}
                    placeholder="e.g. /courses or /subscriptions"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#221D1D] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 transition font-mono"
                  />
                </div>
              </div>

              {/* Visibility Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="slide-active-checkbox"
                  checked={currentSlide.is_active ?? true}
                  onChange={(e) => setCurrentSlide({ ...currentSlide, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-[#221D1D] focus:ring-[#BFAFE5] border-slate-300 cursor-pointer"
                />
                <label htmlFor="slide-active-checkbox" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  Make slide active and visible on live website carousel
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#221D1D] hover:bg-black text-white font-semibold shadow-xs cursor-pointer transition"
                >
                  Save Slide
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSave(e, true)}
                  className="px-5 py-2.5 rounded-xl bg-[#005A9C] hover:bg-[#004F8A] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition"
                  title="Save slide and immediately open live website to see it"
                >
                  <span>Save &amp; View Live</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
