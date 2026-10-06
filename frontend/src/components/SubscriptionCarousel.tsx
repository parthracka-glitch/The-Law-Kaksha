"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Clock, BookOpen } from "lucide-react";
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
}

const FALLBACK_SLIDES: CarouselSlideData[] = [
  {
    id: "slide-1",
    placement: "homepage_top",
    title: "Master CA Foundation Business Laws",
    subtitle: "Complete ICAI Syllabus notes, visual flowcharts & daily high-yield case studies.",
    image: "/brand/study-carousel-ca.jpg",
    cta_label: "Explore CA Subscription",
    cta_link: "/subscriptions/ca-foundation-monthly",
    badge: "MOST POPULAR",
    is_active: true,
    order: 1,
  },
  {
    id: "slide-2",
    placement: "homepage_top",
    title: "CSEET Legal Aptitude & Management",
    subtitle: "Interactive 3D digital codices, chapter MCQs, and live Google Meet doubt clearing.",
    image: "/brand/study-carousel-cs.jpg",
    cta_label: "Explore CSEET Subscription",
    cta_link: "/subscriptions/cseet-monthly",
    badge: "ICSI SYLLABUS",
    is_active: true,
    order: 2,
  },
  {
    id: "slide-3",
    placement: "homepage_top",
    title: "Dual Foundation + CSEET Combo Access",
    subtitle: "One pass for complete commerce law mastery. Launch offer at ₹99/month.",
    image: "/brand/study-carousel-combo.jpg",
    cta_label: "Get Dual Pass",
    cta_link: "/subscriptions/ca-cs-combo-monthly",
    badge: "LAUNCH OFFER ₹99",
    is_active: true,
    order: 3,
  },
];

export function SubscriptionCarousel() {
  const [slides, setSlides] = useState<CarouselSlideData[]>(FALLBACK_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch live slides from backend
  useEffect(() => {
    let isMounted = true;
    async function loadSlides() {
      try {
        const res = await apiRequest<CarouselSlideData[]>("/api/carousel-slides");
        if (res.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
          if (isMounted) setSlides(res.data);
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

  // Auto-rotation every 5 seconds
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
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Subscription Highlights Carousel"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B192C] via-[#11233D] to-[#0A1422] text-white shadow-2xl border border-[#C5A880]/30 min-h-[380px] sm:min-h-[420px] flex items-center">
        {/* Ambient luxury lighting */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#C5A880]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#1E3E62]/30 rounded-full blur-3xl pointer-events-none" />

        {/* Slide Content */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-8 sm:p-12 w-full">
          {/* Text Column */}
          <div className="md:col-span-7 lg:col-span-8 space-y-5">
            {current.badge && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#C5A880]/20 text-[#E5D0B5] border border-[#C5A880]/40 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                {current.badge}
              </span>
            )}

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#FDFBF7] tracking-tight leading-tight">
              {current.title}
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {current.subtitle}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 pt-2 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                Watermarked DRM
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                <Clock className="w-4 h-4 text-[#C5A880]" />
                30 Days Full Access
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                <BookOpen className="w-4 h-4 text-[#C5A880]" />
                ICAI/ICSI Aligned
              </span>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href={current.cta_link || (current.subscription_id ? `/subscriptions/${current.subscription_id}` : "/courses")}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm sm:text-base bg-gradient-to-r from-[#C5A880] to-[#E5D0B5] text-[#0B192C] hover:from-[#d6bd99] hover:to-[#f0dfc8] transition-all duration-200 shadow-lg shadow-[#C5A880]/20 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {current.cta_label || "Explore Subscription"}
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/student/login"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm sm:text-base bg-white/10 text-white hover:bg-white/15 border border-white/20 transition-all duration-200 backdrop-blur-sm"
              >
                Student Portal
              </Link>
            </div>
          </div>

          {/* Graphic Column */}
          <div className="md:col-span-5 lg:col-span-4 flex justify-center items-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl bg-gradient-to-tr from-[#1E3E62]/40 to-[#C5A880]/20 p-4 border border-[#C5A880]/30 shadow-inner flex flex-col justify-center items-center text-center backdrop-blur-md">
              <div className="w-20 h-20 rounded-2xl bg-[#0B192C] border border-[#C5A880]/50 flex items-center justify-center text-[#C5A880] mb-4 shadow-xl">
                <BookOpen className="w-10 h-10" />
              </div>
              <p className="font-serif font-bold text-xl text-[#FDFBF7]">The Law Kaksha</p>
              <p className="text-xs text-[#C5A880] tracking-widest uppercase font-semibold mt-1">Study Codex Edition</p>
              <div className="mt-4 px-3 py-1 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/30 text-[11px] text-[#E5D0B5]">
                Instant In-Browser Unlocking
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {total > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all duration-150 focus:outline-none"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all duration-150 focus:outline-none"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Indicator Dots */}
        {total > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full h-2 ${
                  idx === currentIndex ? "w-8 bg-[#C5A880]" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
