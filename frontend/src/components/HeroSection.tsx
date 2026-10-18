"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Flame } from "lucide-react";
import { EnhancedSampleChapterModal } from "./EnhancedSampleChapterModal";

export function HeroSection() {
  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [previewBook, setPreviewBook] = useState<"ca-foundation" | "cseet">("ca-foundation");
  const typographyRef = useRef<HTMLDivElement>(null);

  const handleOpenPreview = (bookId: "ca-foundation" | "cseet") => {
    setPreviewBook(bookId);
    setSampleModalOpen(true);
  };

  useEffect(() => {
    // Respect user preference for reduced motion
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    let rafId: number;
    const handleScroll = () => {
      if (!typographyRef.current) return;
      const scrollY = window.scrollY;
      // Parallax fade progression across first 480px of scrolling down to Course Spotlight
      const progress = Math.min(Math.max(scrollY / 480, 0), 1);

      const opacity = 1 - progress * 0.75; // Silky dimming from 1.0 to 0.25
      const translateY = progress * 36; // Elegant downward parallax drift
      const blurAmount = (progress * 3.5).toFixed(1); // Soft focus lens blur

      typographyRef.current.style.opacity = `${opacity}`;
      typographyRef.current.style.transform = `translateY(${translateY}px)`;
      typographyRef.current.style.filter = `blur(${blurAmount}px)`;
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
        {/* Main White Content Card Framed by Soft Blue Wash */}
        <div className="max-w-7xl mx-auto bg-white rounded-3xl md:rounded-[2.5rem] border border-[#DBEAFE] shadow-[0_10px_40px_rgba(10,25,47,0.06)] px-6 py-12 md:px-12 md:py-16 lg:py-20 relative overflow-hidden">

          {/* Subtle Watermark Flower Petals in Background */}
          <div className="hidden sm:block absolute right-0 top-0 w-[380px] h-[380px] opacity-[0.03] pointer-events-none select-none z-0 overflow-hidden">
            <Image
              src="/assets/element lawkaksha.png"
              alt="Motif"
              width={380}
              height={380}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Hero Books Visual */}
            <div className="lg:col-span-6 flex justify-center lg:justify-start order-2 lg:order-1">
              <div
                onClick={() => handleOpenPreview("ca-foundation")}
                className="relative w-full max-w-[500px] aspect-[1/0.95] flex items-center justify-center select-none cursor-pointer group"
                title="Click to preview free sample chapter"
              >
                {/* Soft Ambient Studio Lighting Glow */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none -z-20 blur-3xl opacity-35"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, rgba(0, 90, 156, 0.22) 0%, rgba(174, 215, 233, 0.15) 50%, transparent 75%)",
                  }}
                />

                {/* Ground Shadow */}
                <div
                  className="absolute bottom-3 w-[82%] h-14 rounded-[100%] pointer-events-none -z-10 blur-xl opacity-40"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 50%, rgba(10, 25, 47, 0.6) 0%, rgba(0, 90, 156, 0.2) 50%, transparent 80%)",
                  }}
                />

                {/* Books Image */}
                <div className="relative w-[92%] h-[92%] select-none transition-transform duration-300 group-hover:scale-102">
                  <Image
                    src="/assets/ca-cs-hero-books-sharp.png"
                    alt="The Law Kaksha CA Foundation & CSEET Study Codices"
                    fill
                    className="object-contain drop-shadow-[0_22px_28px_rgba(10,25,47,0.18)]"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                  />
                </div>

                {/* Popular Resource Badge */}
                <div className="absolute top-6 left-0 sm:left-2 z-20 pointer-events-none">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#DBEAFE] text-[#005A9C] text-xs font-bold shadow-[0_6px_16px_rgba(0,90,156,0.12)]">
                    <Flame className="w-3.5 h-3.5 text-[#005A9C] fill-[#005A9C]" />
                    <span>Popular Resource</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Typography, Subtitle, CTAs */}
            <div
              ref={typographyRef}
              style={{ willChange: "transform, opacity, filter" }}
              className="lg:col-span-6 space-y-6 text-center lg:text-left order-1 lg:order-2"
            >
              {/* Launch Badge with Live Pulse & Staggered Fade 1 */}
              <div className="animate-hero-fade-1 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#005A9C] text-xs font-bold animate-badge-glow shadow-xs hover:scale-102 transition-transform cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#005A9C] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#005A9C]" />
                </span>
                <span>Launch Offer • CA Foundation &amp; CSEET @ ₹99/mo</span>
              </div>

              {/* Main Headline with Staggered Fade 2 & 3 and Shimmering Gradient */}
              <h1 className="font-serif font-black text-[clamp(2.15rem,5.5vw,4.35rem)] leading-[1.12] tracking-tight text-[#0A192F]">
                <span className="block animate-hero-fade-2">
                  Law, Made Simple.
                </span>
                <span className="block animate-hero-fade-3 mt-1 bg-gradient-to-r from-[#005A9C] via-[#0284C7] to-[#0A192F] bg-clip-text text-transparent animate-luxury-shimmer">
                  Learning, Made Smarter.
                </span>
              </h1>

              {/* Subtitle with Staggered Fade 4 */}
              <p className="animate-hero-fade-4 text-base sm:text-lg lg:text-xl text-[#64748B] leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
                Simplified notes, practical resources and exam-focused preparation for CA Foundation &amp; CSEET students across India.
              </p>

              {/* CTA Action Buttons with Staggered Fade 5 */}
              <div className="animate-hero-fade-5 flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  href="#subscriptions"
                  className="group inline-flex items-center justify-center gap-2 bg-[#005A9C] hover:bg-[#004F8A] text-white text-base font-bold px-8 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer w-full sm:w-auto min-h-[48px]"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <button
                  type="button"
                  onClick={() => setSampleModalOpen(true)}
                  className="inline-flex items-center justify-center bg-white border border-[#005A9C] text-[#005A9C] hover:bg-[#F0F7FF] text-base font-bold px-8 py-3.5 rounded-full transition-all duration-200 active:scale-95 cursor-pointer w-full sm:w-auto min-h-[48px]"
                >
                  <span>Browse Free Notes</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Sample Reader Modal */}
        <EnhancedSampleChapterModal
          isOpen={sampleModalOpen}
          onClose={() => setSampleModalOpen(false)}
          bookTitle={
            previewBook === "cseet"
              ? "CSEET Business Law & Management Codex"
              : "CA Foundation Business Laws Master Codex"
          }
          bookId={previewBook}
          bookPrice={99}
        />
      </section>
    </>
  );
}
