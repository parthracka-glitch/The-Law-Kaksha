"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { EnhancedSampleChapterModal } from "./EnhancedSampleChapterModal";

export function HeroSection() {
  const [sampleModalOpen, setSampleModalOpen] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden bg-[#AED7E9] p-3 sm:p-6 md:p-8">
        {/* Main White Content Card Framed by Sky Blue */}
        <div className="max-w-7xl mx-auto bg-white rounded-3xl md:rounded-[2.5rem] border border-[#E7E4E7] shadow-[0_10px_40px_rgba(34,29,29,0.08)] px-6 py-12 md:px-12 md:py-16 lg:py-20 relative overflow-hidden">

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
            {/* Left Column: 3-Book Visual with Soft Blended Edges */}
            <div className="lg:col-span-6 flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative w-full max-w-[500px] flex items-center justify-center">
                {/* Soft ambient aura in soft sky blue */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none -z-10 blur-3xl opacity-50"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, #C4E1EC 0%, #AED7E9 50%, transparent 75%)",
                  }}
                />

                {/* 3D Books Image with Soft Feathered Mask on Edges */}
                <div
                  className="relative w-full aspect-square max-h-[500px] select-none pointer-events-none"
                  style={{
                    WebkitMaskImage:
                      "radial-gradient(ellipse 90% 90% at 50% 50%, rgba(0, 0, 0, 1) 72%, rgba(0, 0, 0, 0.8) 84%, rgba(0, 0, 0, 0.25) 94%, transparent 100%)",
                    maskImage:
                      "radial-gradient(ellipse 90% 90% at 50% 50%, rgba(0, 0, 0, 1) 72%, rgba(0, 0, 0, 0.8) 84%, rgba(0, 0, 0, 0.25) 94%, transparent 100%)",
                  }}
                >
                  <Image
                    src="/assets/ca-cs-hero-books-v2.png"
                    alt="The Law Kaksha CA Foundation & CSEET Study Codices"
                    fill
                    className="object-contain"
                    priority
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 520px"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Typography, Subtitle, CTAs */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left order-1 lg:order-2">
              {/* Launch Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C4E1EC] border border-[#AED7E9] text-[#221D1D] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#221D1D]" />
                <span>Launch Offer • CA Foundation &amp; CSEET @ ₹99/mo</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif font-black text-[clamp(2rem,5.5vw,4.25rem)] leading-[1.1] tracking-tight text-[#221D1D]">
                Law, Made Simple.
                <br />
                <span className="text-[#4B8097] font-serif font-black">Learning, Made Smarter.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg lg:text-xl text-[#4D433F] leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
                Simplified notes, practical resources and exam-focused preparation for CA Foundation &amp; CSEET students across India.
              </p>

              {/* CTA Action Buttons with Lavender as Primary CTA */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  href="#pricing"
                  className="inline-flex items-center justify-center gap-2 bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-base font-bold px-8 py-3.5 rounded-full shadow-[0_2px_8px_rgba(191,175,229,0.35)] transition-all duration-200 active:scale-95 cursor-pointer w-full sm:w-auto min-h-[48px]"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>

                <button
                  type="button"
                  onClick={() => setSampleModalOpen(true)}
                  className="inline-flex items-center justify-center bg-white border border-[#221D1D] text-[#221D1D] hover:bg-[#F7F7F5] text-base font-bold px-8 py-3.5 rounded-full transition-all duration-200 active:scale-95 cursor-pointer w-full sm:w-auto min-h-[48px]"
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
          bookTitle="CA Foundation Business Laws Master Codex"
          bookId="ca-foundation"
          bookPrice={99}
        />
      </section>
    </>
  );
}
