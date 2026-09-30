"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LawKakshaLogo } from "@/components/LawKakshaLogo";
import {
  Award,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Users,
  Sparkles,
  ArrowRight,
  Flame,
  Check,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFD] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/[0.04] border border-black/[0.06] text-[#1D1D1F] text-xs font-medium">
            <GraduationCap className="w-3.5 h-3.5 text-[#0071E3]" /> India&apos;s Dedicated CA Law Academy
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#1D1D1F] tracking-tight leading-[1.1]">
            We Don&apos;t Just Teach Law.<br />
            <span className="text-[#0071E3]">We Engineer Exemption Scores.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#86868B] max-w-2xl mx-auto leading-relaxed">
            The Law Kaksha was founded with a single mission: to eliminate the fear of CA Corporate &amp; Other Laws through structured Bare Act codices, statutory flowcharts, and 1-on-1 model evaluation desks.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-black/[0.06] rounded-3xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4 hover:border-black/[0.12] transition-all">
            <div className="w-11 h-11 rounded-2xl bg-[#0071E3]/[0.08] text-[#0071E3] flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-[#1D1D1F] tracking-tight">Bare Act Synthesis</h3>
            <p className="text-xs sm:text-sm text-[#86868B] leading-relaxed">
              Every section of the Companies Act 2013 and Other Laws is presented with word-by-word statutory analysis, ROC circulars, and judicial precedents.
            </p>
          </div>

          <div className="bg-white border border-black/[0.06] rounded-3xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4 hover:border-black/[0.12] transition-all">
            <div className="w-11 h-11 rounded-2xl bg-[#0071E3]/[0.08] text-[#0071E3] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-[#1D1D1F] tracking-tight">5-Pillar Drafting Desk</h3>
            <p className="text-xs sm:text-sm text-[#86868B] leading-relaxed">
              Learn the exact ICAI model answer structure: Relevant Provision, Analysis of Facts, Case Law Reference, and Definitive Conclusion.
            </p>
          </div>

          <div className="bg-white border border-black/[0.06] rounded-3xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4 hover:border-black/[0.12] transition-all">
            <div className="w-11 h-11 rounded-2xl bg-[#0071E3]/[0.08] text-[#0071E3] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-[#1D1D1F] tracking-tight">1.5-Day Exam Retainability</h3>
            <p className="text-xs sm:text-sm text-[#86868B] leading-relaxed">
              Ultra-condensed visual flowcharts, penalty limit code tables, and 1,200+ case scenario questions tailored for the final 36 hours.
            </p>
          </div>
        </div>

        {/* Faculty Directorate Profile */}
        <div className="bg-white border border-black/[0.06] rounded-3xl p-8 sm:p-12 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center gap-8 lg:gap-12">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-[#0A192F] text-white flex items-center justify-center shrink-0 shadow-lg text-2xl sm:text-3xl font-semibold tracking-tight font-serif">
            LK
          </div>

          <div className="space-y-4 text-center md:text-left flex-1">
            <div>
              <span className="text-[11px] font-semibold text-[#005A9C] uppercase tracking-wide">
                Academic Council &amp; Faculty Directorate
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight mt-1">
                Corporate &amp; Economic Laws Faculty
              </h2>
              <p className="text-xs sm:text-sm text-[#86868B] mt-0.5">
                Corporate Law Practitioners, CA Mentors &amp; Valuation Analysts
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#515154] leading-relaxed max-w-3xl">
              Having mentored over 15,000+ CA Foundation, Intermediate, and Final aspirants across India, our faculty directorate specializes in practical corporate governance analysis, crystal-clear statutory interpretation, and predictive exam preparation models.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <span className="px-3.5 py-1.5 rounded-full bg-[#F5F5F7] border border-black/[0.06] text-xs font-medium text-[#1D1D1F] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#005A9C]" /> 84+ All-India Rankers
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-[#F5F5F7] border border-black/[0.06] text-xs font-medium text-[#1D1D1F] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#005A9C]" /> 92% Student Exemption Rate
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-[#F5F5F7] border border-black/[0.06] text-xs font-medium text-[#1D1D1F] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#005A9C]" /> 1,200+ Solved MCQs
              </span>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#1D1D1F] rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white">
            Ready to Clear Your CA Law Paper with Distinction?
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1A6] max-w-xl mx-auto leading-relaxed">
            Get instant access to Volume 1 &amp; Volume 2 Codices, 1,200+ ICAI MCQs, and 1-on-1 copy evaluation desk.
          </p>
          <div className="pt-3">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs sm:text-sm font-medium shadow-sm transition-all active:scale-[0.98]"
            >
              <span>Explore All Courses &amp; Codices</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
