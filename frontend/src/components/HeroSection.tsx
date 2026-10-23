"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { EnhancedSampleChapterModal } from "./EnhancedSampleChapterModal";
import { apiRequest } from "@/lib/api";

export function HeroSection() {
  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [previewBook] = useState<"ca-foundation" | "cseet">("ca-foundation");
  const [livePrice, setLivePrice] = useState<number>(99);
  const typographyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadLivePrice() {
      try {
        const res = await apiRequest<{ courses?: Array<{ id: string; price?: number }> }>("/api/courses");
        if (res.success && res.data?.courses) {
          const caCourse = res.data.courses.find(
            (c) => c.id?.toLowerCase().includes("ca-foundation") || c.id?.toLowerCase() === "ca-foundation"
          );
          if (caCourse && typeof caCourse.price === "number") {
            setLivePrice(caCourse.price);
          }
        }
      } catch {}
    }
    loadLivePrice();
  }, []);

  useEffect(() => {
    // Respect user preference for reduced motion
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    let rafId: number;
    const handleScroll = () => {
      if (!typographyRef.current) return;
      const scrollY = window.scrollY;
      const progress = Math.min(Math.max(scrollY / 480, 0), 1);
      const opacity = 1 - progress * 0.45;
      const translateY = progress * 32;

      typographyRef.current.style.opacity = `${opacity}`;
      typographyRef.current.style.transform = `translateY(${translateY}px)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <section className="relative overflow-hidden bg-[#F0F7FF] p-3 sm:p-6 md:p-8">
        {/* Main Architectural Card */}
        <div className="max-w-7xl mx-auto bg-white rounded-3xl md:rounded-[2.5rem] border border-[#DBEAFE] shadow-[0_12px_44px_rgba(10,25,47,0.06)] px-6 py-10 md:px-12 md:py-16 lg:py-20 relative overflow-hidden">
          
          {/* Subtle Ambient Background Watermark */}
          <div className="hidden sm:block absolute right-0 top-0 w-[420px] h-[420px] opacity-[0.035] pointer-events-none select-none z-0 overflow-hidden">
            <Image
              src="/assets/element lawkaksha.png"
              alt="Motif"
              width={420}
              height={420}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Editorial Typography, Trust Indicators, CTAs */}
            <div
              ref={typographyRef}
              style={{ willChange: "transform, opacity" }}
              className="lg:col-span-6 space-y-6 text-center lg:text-left order-1"
            >
              {/* Main Headline */}
              <h1 className="font-serif font-black text-[clamp(2.2rem,5.6vw,4.4rem)] leading-[1.12] tracking-tight text-[#0A192F]">
                <span className="block animate-hero-fade-2">
                  Law, Made Simple.
                </span>
                <span className="block animate-hero-fade-3 mt-1 bg-gradient-to-r from-[#005A9C] via-[#0284C7] to-[#0A192F] bg-clip-text text-transparent">
                  Learning, Made Smarter.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="animate-hero-fade-4 text-base sm:text-lg lg:text-xl text-[#64748B] leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
                Notes, mindmaps, case laws &amp; model answers, built for CA Foundation &amp; CSEET.
              </p>

              {/* CTA Action Buttons */}
              <div className="animate-hero-fade-5 flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  href="#subscriptions"
                  className="group inline-flex items-center justify-center gap-2 bg-[#005A9C] hover:bg-[#004F8A] text-white text-base font-bold px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer w-full sm:w-auto min-h-[48px]"
                >
                  <span>Start Learning @ ₹{livePrice}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <a
                  href="#free-resources"
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-[#005A9C] text-[#005A9C] hover:bg-[#F0F7FF] text-base font-bold px-7 py-3 rounded-full transition-all duration-200 active:scale-95 cursor-pointer w-full sm:w-auto min-h-[48px]"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Browse Free Sample Notes</span>
                </a>
              </div>
            </div>

            {/* Right Column: Student Success Collage */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end order-2">
              <Image
                src="/images/hero_student_success_collage.png"
                alt="The Law Kaksha students with Business Laws study material"
                width={1536}
                height={1024}
                className="w-full max-w-[620px] h-auto"
                priority
              />
            </div>
          </div>
        </div>

        {/* Interactive Sample Reader Modal */}
        <EnhancedSampleChapterModal
          isOpen={sampleModalOpen}
          onClose={() => setSampleModalOpen(false)}
          bookTitle={
            previewBook === "cseet"
              ? "CSEET Business Laws and Management Codex"
              : "CA Foundation Business Laws Master Codex"
          }
          bookId={previewBook}
          bookPrice={livePrice}
        />
      </section>
    </>
  );
}
