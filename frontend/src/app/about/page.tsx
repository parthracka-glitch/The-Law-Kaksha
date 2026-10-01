"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between text-[#1D1D1F]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 w-full flex flex-col justify-center">
        <div className="bg-white border border-black/[0.06] rounded-3xl p-8 sm:p-12 md:p-16 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-8">
          
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1E40] tracking-tight font-serif">
            About The Law कक्षा
          </h1>

          {/* Body Paragraphs */}
          <div className="space-y-6 text-sm sm:text-base md:text-lg text-[#334155] leading-relaxed font-sans">
            <p>
              The Law कक्षा is a dedicated learning space for law, currently focusing on Business Law for CA Foundation and CSEET students. Through structured practice, application-based case studies and exam-oriented resources, we aim to help students move beyond memorising provisions and develop a clear understanding of how to apply the law.
            </p>

            <p>
              We believe that learning the law is not just about knowing what a provision says. It is about understanding when, why and how it applies.
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <p className="font-medium text-[#0B1E40]">
                The Law कक्षा is a learning space built around that belief.
              </p>
              <p className="font-semibold text-[#005FD8]">
                Learn with clarity. Practice with purpose.
              </p>
            </div>
          </div>

          {/* Brand Signature */}
          <div className="pt-6 border-t border-slate-100 space-y-1">
            <p className="text-base sm:text-lg font-bold text-[#0B1E40]">
              The Law कक्षा
            </p>
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#005FD8] uppercase">
              Learn | Practice | Excel
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
