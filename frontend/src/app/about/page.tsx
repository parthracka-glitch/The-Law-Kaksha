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
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-[#0284C7] text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" /> India&apos;s Dedicated CA Law Academy
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-serif leading-tight">
            We Don&apos;t Just Teach Law.<br />
            <span className="text-[#0284C7]">We Engineer Exemption Scores.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            The Law Kaksha was founded with a single mission: to eliminate the fear of CA Corporate &amp; Other Laws through structured Bare Act codices, statutory flowcharts, and 1-on-1 model evaluation desks.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-sky-100 rounded-3xl p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-serif">Bare Act Synthesis</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every section of the Companies Act 2013 and Other Laws is presented with word-by-word statutory analysis, ROC circulars, and judicial precedents.
            </p>
          </div>

          <div className="bg-white border border-sky-100 rounded-3xl p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-serif">5-Pillar Drafting Desk</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Learn the exact ICAI model answer structure: Relevant Provision, Analysis of Facts, Case Law Reference, and Definitive Conclusion.
            </p>
          </div>

          <div className="bg-white border border-sky-100 rounded-3xl p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-serif">1.5-Day Exam Retainability</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ultra-condensed visual flowcharts, penalty limit code tables, and 1,200+ case scenario questions tailored for the final 36 hours.
            </p>
          </div>
        </div>

        {/* Faculty Profile */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xs flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#0EA5E9] flex items-center justify-center text-white shrink-0 shadow-md font-serif text-3xl font-extrabold">
            PD
          </div>

          <div className="space-y-4 text-center md:text-left">
            <div>
              <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
                Founder &amp; Chief Academic Officer
              </span>
              <h2 className="text-2xl font-bold text-slate-900 font-serif mt-1">
                Pearl Dsouza Ma&apos;am
              </h2>
              <p className="text-xs text-slate-500">
                Corporate Law Practitioner, CA Faculty &amp; ICAI Ranker Mentor
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Having mentored over 15,000+ CA Foundation, Inter, and Final aspirants across India, Pearl Ma&apos;am is renowned for her practical corporate governance case studies, crystal-clear statutory interpretation, and predictive exam test papers.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7]" /> 84+ All-India Rankers
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7]" /> 92% Student Exemption Rate
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7]" /> 1,200+ Solved MCQs
              </span>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-10 text-white text-center space-y-4 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif">
            Ready to Clear Your CA Law Paper with Distinction?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Get instant access to Volume 1 &amp; Volume 2 Codices, 1,200+ ICAI MCQs, and 1-on-1 copy evaluation desk.
          </p>
          <div className="pt-2">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-sm font-bold shadow-xs transition-colors"
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
