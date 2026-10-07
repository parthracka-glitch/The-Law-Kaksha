"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  BookOpen,
  Star,
  Award,
  Zap,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

export interface CarouselSlideData {
  id: string;
  placement: string;
  title: string;
  subtitle: string;
  image: string;
  cta_label: string;
  cta_link?: string;
  subscription_id?: string;
  badge?: string;
  is_active: boolean;
  order: number;
  rating?: string;
  glowGradient?: string;
  badgeColor?: string;
}

const FALLBACK_SLIDES: CarouselSlideData[] = [
  {
    id: "slide-1",
    placement: "homepage_top",
    title: "Master CA Foundation Business Laws",
    subtitle: "Complete codified ICAI syllabus notes, high-yield visual flowcharts & daily exam-calibrated case studies.",
    image: "/images/hero_ca_foundation.jpg",
    cta_label: "Explore CA Foundation Pass",
    cta_link: "/courses",
    badge: "MOST POPULAR • PAPER 2",
    badgeColor: "bg-[#BFAFE5]/40 text-[#221D1D] border-[#BFAFE5]",
    is_active: true,
    order: 1,
    rating: "4.9/5 Rating (1,200+ Candidates)",
    glowGradient: "radial-gradient(ellipse at 80% 35%, rgba(191,175,229,0.35) 0%, rgba(254,240,138,0.2) 45%, transparent 75%)",
  },
  {
    id: "slide-2",
    placement: "homepage_top",
    title: "CSEET Legal Aptitude & Management",
    subtitle: "Interactive 3D digital codices, ICSI unit MCQs, and weekly live Google Meet doubt clearing sessions.",
    image: "/images/hero_cseet_law.jpg",
    cta_label: "Explore CSEET Pass",
    cta_link: "/courses",
    badge: "ICSI SYLLABUS • 8 UNITS",
    badgeColor: "bg-[#AED7E9]/50 text-[#221D1D] border-[#AED7E9]",
    is_active: true,
    order: 2,
    rating: "100% ICSI Exam Aligned",
    glowGradient: "radial-gradient(ellipse at 80% 35%, rgba(174,215,233,0.45) 0%, rgba(196,225,236,0.25) 45%, transparent 75%)",
  },
  {
    id: "slide-3",
    placement: "homepage_top",
    title: "Dual Foundation + CSEET All-Access Pass",
    subtitle: "One unified pass for comprehensive commerce law mastery. Complete statutory library at special launch pricing.",
    image: "/images/hero_dual_combo.jpg",
    cta_label: "Get Dual All-Access Pass @ ₹180",
    cta_link: "/courses",
    badge: "BEST VALUE • LAUNCH SPECIAL",
    badgeColor: "bg-[#FEF08A]/70 text-[#854D0E] border-[#FDE047]",
    is_active: true,
    order: 3,
    rating: "Dual Course Master Bundle",
    glowGradient: "radial-gradient(ellipse at 80% 35%, rgba(216,180,254,0.4) 0%, rgba(253,224,71,0.25) 45%, transparent 75%)",
  },
];

export function SubscriptionCarousel() {
  const [slides, setSlides] = useState<CarouselSlideData[]>(FALLBACK_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch live slides from backend, falling back gracefully
  useEffect(() => {
    let isMounted = true;
    async function loadSlides() {
      try {
        const res = await apiRequest<any>("/api/carousel-slides");
        const rawSlides = Array.isArray(res.data)
          ? res.data
          : Array.isArray((res.data as any)?.slides)
          ? (res.data as any).slides
          : Array.isArray((res.data as any)?.data)
          ? (res.data as any).data
          : [];

        if (rawSlides.length > 0 && isMounted) {
          // Merge with local fallback styling / images if remote image is placeholder
          const enhanced = rawSlides.map((item: any, idx: number) => ({
            ...item,
            image:
              item.image && (item.image.startsWith("/images/") || item.image.startsWith("http"))
                ? item.image
                : FALLBACK_SLIDES[idx % FALLBACK_SLIDES.length].image,
            glowGradient: FALLBACK_SLIDES[idx % FALLBACK_SLIDES.length].glowGradient,
            badgeColor: FALLBACK_SLIDES[idx % FALLBACK_SLIDES.length].badgeColor,
            rating: item.rating || FALLBACK_SLIDES[idx % FALLBACK_SLIDES.length].rating,
          }));
          setSlides(enhanced);
        }
      } catch (e) {
        // Fallback remains
      }
    }
    loadSlides();
    return () => {
      isMounted = false;
    };
  }, []);

  const total = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-rotation every 5 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused || total <= 1) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, total, nextSlide]);

  if (total === 0) return null;
  const current = slides[currentIndex];

  return (
    <section
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Subscription Highlights Carousel"
    >
      <div className="relative overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-white border border-[#E7E4E7] text-[#221D1D] shadow-[0_15px_50px_rgba(34,29,29,0.08)] min-h-[420px] sm:min-h-[460px] flex items-center transition-all duration-500">
        
        {/* Dynamic ambient radiant aura */}
        <div
          className="absolute inset-0 rounded-3xl md:rounded-[2.5rem] pointer-events-none transition-all duration-700 blur-3xl opacity-60"
          style={{
            background:
              current.glowGradient ||
              "radial-gradient(ellipse at 80% 35%, rgba(191,175,229,0.35) 0%, rgba(174,215,233,0.3) 45%, transparent 75%)",
          }}
        />

        {/* Subtle mesh background grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#221D1D_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.025] pointer-events-none" />

        {/* Slide Content Grid */}
        <div
          key={current.id || currentIndex}
          className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center px-6 sm:px-12 md:px-14 lg:px-16 py-8 sm:py-12 w-full animate-in fade-in duration-500"
        >
          {/* Left Text Column (safe margin ensures chevron arrows never overlap) */}
          <div className="md:col-span-7 lg:col-span-7 space-y-4 sm:space-y-5 text-center md:text-left">
            {current.badge && (
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase border shadow-2xs ${
                    current.badgeColor || "bg-[#C4E1EC] text-[#221D1D] border-[#AED7E9]"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{current.badge}</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#77716E]">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>4.9 / 5 Rated</span>
                </span>
              </div>
            )}

            <h2 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-serif font-black text-[#221D1D] tracking-tight leading-[1.18]">
              {current.title}
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-[#4D433F] max-w-xl leading-relaxed mx-auto md:mx-0">
              {current.subtitle}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-2.5 pt-1 text-xs text-[#221D1D]">
              <span className="inline-flex items-center gap-1.5 bg-[#F7F7F5] hover:bg-white border border-[#E7E4E7] px-3 sm:px-3.5 py-1.5 rounded-full font-semibold transition-colors shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4B8097]" />
                <span>Watermarked DRM</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#F7F7F5] hover:bg-white border border-[#E7E4E7] px-3 sm:px-3.5 py-1.5 rounded-full font-semibold transition-colors shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-[#4B8097]" />
                <span>30 Days Full Access</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#F7F7F5] hover:bg-white border border-[#E7E4E7] px-3 sm:px-3.5 py-1.5 rounded-full font-semibold transition-colors shadow-2xs">
                <BookOpen className="w-3.5 h-3.5 text-[#4B8097]" />
                <span>ICAI / ICSI Aligned</span>
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 sm:pt-3 flex flex-wrap justify-center md:justify-start items-center gap-3 sm:gap-4">
              <Link
                href={current.cta_link || (current.subscription_id ? `/subscriptions/${current.subscription_id}` : "/courses")}
                className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 rounded-full font-bold text-sm sm:text-base bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] shadow-[0_4px_14px_rgba(191,175,229,0.45)] hover:shadow-[0_6px_20px_rgba(191,175,229,0.6)] transition-all duration-200 active:scale-95 cursor-pointer min-h-[46px]"
              >
                <span>{current.cta_label || "Explore Subscription"}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <Link
                href="/student/login"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-full font-bold text-sm sm:text-base bg-white border border-[#221D1D] text-[#221D1D] hover:bg-[#F7F7F5] shadow-2xs transition-all duration-200 active:scale-95 cursor-pointer min-h-[46px]"
              >
                <span>Student Portal</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 3D Showcase Presentation Graphic */}
          <div className="md:col-span-5 lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[370px] aspect-square rounded-[2.25rem] p-3 bg-gradient-to-br from-white via-white/80 to-[#F7F7F5] border-2 border-white shadow-[0_20px_50px_rgba(34,29,29,0.12)] backdrop-blur-md group transition-all duration-500">
              
              {/* Backlight Glow Behind Book Container */}
              <div className="absolute inset-0 rounded-[2.25rem] bg-gradient-to-tr from-[#AED7E9]/40 via-[#BFAFE5]/30 to-amber-200/20 blur-xl -z-10 group-hover:scale-110 transition-transform duration-700" />

              {/* High-Definition 3D Image */}
              <div className="relative w-full h-full rounded-[1.85rem] overflow-hidden shadow-inner bg-[#1A1614]">
                <Image
                  src={current.image || "/images/hero_ca_foundation.jpg"}
                  alt={current.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                  priority
                />

                {/* Subtle Glass Reflection Gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/15 pointer-events-none" />

                {/* Floating Top Pill */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/92 backdrop-blur-md border border-white/60 text-[#221D1D] text-[10px] sm:text-[11px] font-bold shadow-md">
                    <Sparkles className="w-3 h-3 text-[#BFAFE5]" />
                    <span>{current.rating || "Official 2026 Edition"}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#221D1D]/85 backdrop-blur-md border border-white/20 text-[#AED7E9] text-[10px] font-mono font-bold shadow-md">
                    DRM-PROTECTED
                  </span>
                </div>

                {/* Floating Bottom Status Pill */}
                <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
                  <div className="px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-white/80 shadow-lg flex items-center justify-between text-[#221D1D]">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span className="text-[11px] font-bold">In-Browser Instant Access</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-[#4B8097] uppercase tracking-wider">
                      Live
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Navigation Chevrons (Positioned cleanly on large screens with ample clearance) */}
        {total > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white border border-[#E7E4E7] text-[#221D1D] shadow-md items-center justify-center backdrop-blur-md transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white border border-[#E7E4E7] text-[#221D1D] shadow-md items-center justify-center backdrop-blur-md transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Docked Bottom Control Pill: Prev, Live Progress Pills, Next */}
        {total > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E7E4E7] shadow-sm">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="w-6 h-6 rounded-full hover:bg-[#F7F7F5] text-[#221D1D] flex items-center justify-center transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Interactive Animated Auto-Play Indicators */}
            <div className="flex items-center gap-1.5">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer overflow-hidden ${
                    idx === currentIndex
                      ? "w-8 bg-[#221D1D]"
                      : "w-2.5 bg-[#AED7E9]/70 hover:bg-[#AED7E9]"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="w-6 h-6 rounded-full hover:bg-[#F7F7F5] text-[#221D1D] flex items-center justify-center transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
