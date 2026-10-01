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
      <section className="relative overflow-hidden bg-white pt-6 pb-16 md:pt-10 md:pb-24 lg:pt-12 lg:pb-28">


        {/* Subtle Watermark Flower Petals in Background */}
        <div className="hidden sm:block absolute right-0 top-0 w-[380px] h-[380px] opacity-[0.035] pointer-events-none select-none z-0 overflow-hidden">
          <Image
            src="/assets/element lawkaksha.png"
            alt="Motif"
            width={380}
            height={380}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: 3-Book Visual with Soft Blended Edges */}
            <div className="lg:col-span-6 flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative w-full max-w-[520px] flex items-center justify-center">
                {/* Soft ambient aura for seamless background merging */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none -z-10 blur-3xl opacity-60"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, rgba(219, 234, 254, 0.9) 0%, rgba(239, 246, 255, 0.5) 50%, transparent 75%)",
                  }}
                />

                {/* 3D Books Image with Soft Feathered Mask on Edges */}
                <div
                  className="relative w-full aspect-square max-h-[520px] select-none pointer-events-none"
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

            {/* Right Column: Exact Typography, Subtitle, CTAs & Stats from SVG */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left order-1 lg:order-2">
              {/* Launch Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#005FD8] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Offer • CA Foundation &amp; CSEET @ ₹99/mo</span>
              </div>

              {/* Main Headline matching SVG */}
              <h1 className="font-serif font-extrabold text-[clamp(1.75rem,5vw,4.15rem)] leading-[1.12] tracking-tight text-[#0B1E40]">
                Law, Made Simple.
                <br />
                <span className="text-[#005FD8] font-bold">Learning, Made Smarter.</span>
              </h1>

              {/* Subtitle matching SVG */}
              <p className="text-base sm:text-lg lg:text-xl text-[#475569] leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
                Simplified notes, practical resources and exam-focused preparation for CA &amp; CS students.
              </p>

              {/* CTA Action Buttons matching SVG */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1">
                <Link
                  href="#pricing"
                  className="inline-flex items-center justify-center gap-2 bg-[#004B99] hover:bg-[#003D7A] text-white text-base font-semibold px-8 py-3.5 rounded-xl shadow-md shadow-blue-900/10 transition-all duration-200 active:scale-95 cursor-pointer w-full sm:w-auto min-h-[48px]"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>

                <button
                  type="button"
                  onClick={() => setSampleModalOpen(true)}
                  className="inline-flex items-center justify-center border-2 border-[#005FD8] text-[#005FD8] hover:bg-blue-50/80 text-base font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer w-full sm:w-auto min-h-[48px]"
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
