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
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Subscription Highlights Carousel"
    >
      <div className="relative overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-white border border-[#E7E4E7] text-[#221D1D] shadow-[0_10px_40px_rgba(34,29,29,0.08)] min-h-[360px] sm:min-h-[400px] flex items-center">
        {/* Soft pastel ambient aura */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none -z-0 blur-3xl opacity-40"
          style={{
            background:
              "radial-gradient(circle at 80% 20%, #C4E1EC 0%, #AED7E9 40%, transparent 75%)",
          }}
        />

        {/* Slide Content */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12 w-full">
          {/* Text Column */}
          <div className="md:col-span-7 lg:col-span-8 space-y-4 sm:space-y-5 text-center md:text-left">
            {current.badge && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#C4E1EC] text-[#221D1D] border border-[#AED7E9]">
                <Sparkles className="w-3.5 h-3.5 text-[#221D1D]" />
                {current.badge}
              </span>
            )}

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black text-[#221D1D] tracking-tight leading-tight">
              {current.title}
            </h2>

            <p className="text-base sm:text-lg text-[#4D433F] max-w-2xl leading-relaxed mx-auto md:mx-0">
              {current.subtitle}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2.5 pt-1 text-xs sm:text-sm text-[#221D1D]">
              <span className="inline-flex items-center gap-1.5 bg-[#F7F7F5] border border-[#E7E4E7] px-3.5 py-1.5 rounded-full font-medium">
                <ShieldCheck className="w-4 h-4 text-[#4B8097]" />
                Watermarked DRM
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#F7F7F5] border border-[#E7E4E7] px-3.5 py-1.5 rounded-full font-medium">
                <Clock className="w-4 h-4 text-[#4B8097]" />
                30 Days Full Access
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#F7F7F5] border border-[#E7E4E7] px-3.5 py-1.5 rounded-full font-medium">
                <BookOpen className="w-4 h-4 text-[#4B8097]" />
                ICAI / ICSI Aligned
              </span>
            </div>

            <div className="pt-3 flex flex-wrap justify-center md:justify-start items-center gap-3 sm:gap-4">
              <Link
                href={current.cta_link || (current.subscription_id ? `/subscriptions/${current.subscription_id}` : "/courses")}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm sm:text-base bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] shadow-[0_2px_8px_rgba(191,175,229,0.35)] transition-all duration-200 active:scale-95 cursor-pointer min-h-[46px]"
              >
                <span>{current.cta_label || "Explore Subscription"}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <Link
                href="/student/login"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm sm:text-base bg-white border border-[#221D1D] text-[#221D1D] hover:bg-[#F7F7F5] transition-all duration-200 active:scale-95 cursor-pointer min-h-[46px]"
              >
                <span>Student Portal</span>
              </Link>
            </div>
          </div>

          {/* Graphic Column */}
          <div className="md:col-span-5 lg:col-span-4 flex justify-center items-center">
            <div className="relative w-60 h-60 sm:w-68 sm:h-68 rounded-3xl bg-[#FDFBF7] p-6 border border-[#E7E4E7] shadow-[0_4px_20px_rgba(34,29,29,0.05)] flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#AED7E9] text-[#221D1D] flex items-center justify-center mb-3 shadow-xs">
                <BookOpen className="w-8 h-8" />
              </div>
              <p className="font-serif font-black text-xl text-[#221D1D]">The Law Kaksha</p>
              <p className="text-xs text-[#4B8097] tracking-wider uppercase font-bold mt-1">Study Codex Edition</p>
              <div className="mt-3 px-3 py-1 rounded-full bg-[#C4E1EC]/60 border border-[#AED7E9] text-[11px] font-semibold text-[#221D1D]">
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
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-[#E7E4E7] text-[#221D1D] shadow-md flex items-center justify-center backdrop-blur-md transition-all duration-150 focus:outline-none cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-[#E7E4E7] text-[#221D1D] shadow-md flex items-center justify-center backdrop-blur-md transition-all duration-150 focus:outline-none cursor-pointer"
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
                className={`transition-all duration-300 rounded-full h-2 cursor-pointer ${
                  idx === currentIndex ? "w-8 bg-[#4B8097]" : "w-2 bg-[#AED7E9] hover:bg-[#98C5D8]"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
