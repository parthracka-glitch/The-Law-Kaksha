"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Lock,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";

export function CourseChoiceHero() {
  const [showNotify, setShowNotify] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySubmitted, setNotifySubmitted] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    setNotifySubmitted(true);
    setTimeout(() => setShowNotify(false), 2000);
  };

  return (
    <section className="py-10 sm:py-14 bg-[#F0F7FF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#005A9C] text-xs font-bold border border-[#DBEAFE] shadow-xs">
            <GraduationCap className="w-4 h-4" />
            Choose Your Course
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#0A192F] mt-4">
            Select Your Preparation Stream
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] mt-2 max-w-lg mx-auto">
            Start with the course that matches your exam. Your study materials, notes, and practice questions are waiting.
          </p>
        </div>

        {/* Two Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Card 1: CA Foundation — LIVE */}
          <div className="relative bg-white rounded-2xl sm:rounded-3xl border-2 border-[#005A9C] p-6 sm:p-8 flex flex-col shadow-[0_8px_30px_rgba(0,90,156,0.08)] hover:shadow-[0_12px_40px_rgba(0,90,156,0.14)] transition-all duration-300 group">
            {/* Live Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Live Now
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE]">
                ICAI Paper 2
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0A192F] mb-1">
              CA Foundation
            </h3>
            <p className="text-base font-semibold text-[#005A9C] mb-3">
              Business Law
            </p>

            {/* Features */}
            <ul className="space-y-2 mb-6 flex-1">
              {[
                "6 Acts — Structured Unit-wise Notes",
                "LDR Flowcharts & Visual Infographics",
                "Practice Questions & PYQ Bank",
                "DRM-Protected In-Web Reader",
                "Weekly Live Doubt Sessions",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[#475569]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            {/* Price & CTA */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-black text-[#0A192F]">₹99</span>
              <span className="text-sm text-[#94A3B8] line-through">₹299</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                67% OFF
              </span>
              <span className="text-xs text-[#94A3B8]">/ month</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/courses"
                className="group/btn inline-flex items-center justify-center gap-2 bg-[#005A9C] hover:bg-[#004F8A] text-white text-sm font-bold px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer flex-1 min-h-[48px]"
              >
                <BookOpen className="w-4 h-4" />
                Explore CA Foundation
                <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover/btn:translate-x-1" />
              </Link>
            </div>

            {/* Subscriptions Open tag */}
            <p className="text-xs text-emerald-600 font-semibold mt-3 text-center">
              ✅ Subscriptions Open • Instant Access
            </p>
          </div>

          {/* Card 2: CSEET — COMING SOON */}
          <div className="relative bg-white/80 rounded-2xl sm:rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 flex flex-col transition-all duration-300">
            {/* Coming Soon Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 border border-gray-200">
                <Lock className="w-3 h-3" />
                Coming Soon
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-600 border border-purple-200">
                ICSI Syllabus
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-serif font-black text-[#64748B] mb-1">
              CSEET
            </h3>
            <p className="text-base font-semibold text-[#94A3B8] mb-3">
              Business Law & Business Management
            </p>

            {/* Features - muted */}
            <ul className="space-y-2 mb-6 flex-1">
              {[
                "8 Units — Business Law & Management",
                "Unit-wise MCQ Question Banks",
                "Concept Notes & Mindmaps",
                "Weekly Timed Mock Tests",
                "ICSI Exam Pattern Practice",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[#94A3B8]">
                  <Lock className="w-4 h-4 text-[#CBD5E1] flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            {/* Notify CTA */}
            {!showNotify ? (
              <button
                type="button"
                onClick={() => setShowNotify(true)}
                className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-[#64748B] text-sm font-bold px-6 py-3 rounded-full transition-all duration-200 active:scale-95 cursor-pointer min-h-[48px]"
              >
                <Bell className="w-4 h-4" />
                Notify Me When Available
              </button>
            ) : notifySubmitted ? (
              <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                You&apos;ll be notified!
              </div>
            ) : (
              <form onSubmit={handleNotify} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#005A9C] focus:border-transparent bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#005A9C] text-white text-sm font-bold rounded-full hover:bg-[#004F8A] transition-colors"
                >
                  Notify
                </button>
              </form>
            )}

            <p className="text-xs text-[#94A3B8] font-medium mt-3 text-center">
              🔒 Pre-launch • ICSI Batch Coming Soon
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
