"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  BookOpen,
  Clock,
  CheckCircle2,
  Bell,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  Flame,
  Lock,
} from "lucide-react";

interface CseetComingSoonShellProps {
  onOpenSampleReader: (pdfUrl: string, title: string) => void;
  onPreOrder: () => void;
}

const CSEET_PLANNED_UNITS = [
  { unit: "Unit 1", title: "Indian Contract Act, 1872", status: "Codified & Verified", icon: "⚖️" },
  { unit: "Unit 2", title: "Sale of Goods Act, 1930", status: "Codified & Verified", icon: "📜" },
  { unit: "Unit 3", title: "Indian Partnership Act, 1932", status: "Full Sample Available", icon: "🤝" },
  { unit: "Unit 4", title: "Limited Liability Partnership Act, 2008", status: "Codified & Verified", icon: "🏛️" },
  { unit: "Unit 5", title: "Elements of Company Law", status: "Codified & Verified", icon: "🏢" },
  { unit: "Unit 6", title: "Negotiable Instruments Act, 1881", status: "Codified & Verified", icon: "📑" },
  { unit: "Unit 7", title: "General Principles of Management", status: "In Quality Review", icon: "📊" },
  { unit: "Unit 8", title: "Business Environment & Ethics", status: "In Quality Review", icon: "🌐" },
];

export function CseetComingSoonShell({ onOpenSampleReader, onPreOrder }: CseetComingSoonShellProps) {
  const [notifyEmail, setNotifyEmail] = useState("");
  const [isNotified, setIsNotified] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notifyEmail && notifyEmail.includes("@")) {
      setIsNotified(true);
      try {
        const stored = JSON.parse(localStorage.getItem("lawkaksha_cseet_notify_list") || "[]");
        stored.push({ email: notifyEmail, date: new Date().toISOString() });
        localStorage.setItem("lawkaksha_cseet_notify_list", JSON.stringify(stored));
      } catch (err) {}
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. HERO COMING SOON BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#1E1B4B] via-[#2E1065] to-[#172554] border border-[#BFAFE5]/30 p-6 sm:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-[#BFAFE5]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BFAFE5]/20 border border-[#BFAFE5]/30 text-[#E9DDF5] text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#BFAFE5]" />
            <span>Under Active Production • November 2026 Examination Batch</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight leading-tight">
            CSEET Paper 2: Business Law &amp; Management
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
            The Law कक्षा is rigorously codifying the complete 8-Unit ICSI syllabus. We are constructing unit-wise statutory codices, conceptual question banks, and timed objective mock evaluations tailored specifically for CS Executive Entrance Test candidates.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onOpenSampleReader("/notes/sale-of-goods-unit-1.pdf", "The Sale of Goods Act, 1930 — Unit 1 (Sample)")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-[1.02]"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read Sample Unit 1 in 3D Reader</span>
            </button>

            <button
              onClick={onPreOrder}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all cursor-pointer"
            >
              <span>Lock Launch Offer • ₹99/Month</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. CURRICULUM ARCHITECTURE ROADMAP */}
      <div className="rounded-3xl bg-white border border-[#E7E4E7] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E4E7] pb-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#221D1D] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#4B8097]" />
              <span>8-Unit ICSI Curriculum Matrix</span>
            </h2>
            <p className="text-xs text-[#77716E] mt-0.5">
              Review what is included in the upcoming CSEET master release.
            </p>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-[#AED7E9]/40 text-[#221D1D] border border-[#AED7E9]">
            8 Units • 500+ Practice MCQs
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CSEET_PLANNED_UNITS.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#E7E4E7] p-4 bg-[#FBFBFA] flex flex-col justify-between hover:border-[#AED7E9] transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold font-mono text-[#77716E]">{item.unit}</span>
                  <span className="text-base">{item.icon}</span>
                </div>
                <h3 className="text-xs font-bold text-[#221D1D] leading-snug line-clamp-2">
                  {item.title}
                </h3>
              </div>
              <div className="mt-4 pt-2 border-t border-[#E7E4E7]/60 flex items-center gap-1.5 text-[10px] text-[#4B8097] font-semibold">
                <CheckCircle2 className="w-3 h-3 text-[#4B8097] shrink-0" />
                <span className="truncate">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. NOTIFY ME & PRE-ORDER CARD */}
      <div className="rounded-3xl bg-linear-to-r from-amber-50 via-orange-50 to-rose-50 border border-amber-200/80 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
            <Bell className="w-4 h-4 text-amber-600" />
            <span>Priority Launch Notification</span>
          </div>
          <h3 className="text-lg font-serif font-bold text-[#221D1D]">
            Get alerted the moment the CSEET Question Bank goes live
          </h3>
          <p className="text-xs text-[#4D433F] leading-relaxed">
            Registered candidates receive instant email notification and guaranteed lock-in of the ₹99 launch pricing for 30 days of complete access.
          </p>
        </div>

        <div className="w-full md:w-auto shrink-0 min-w-[280px]">
          {isNotified ? (
            <div className="px-5 py-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>You are on the priority launch list!</span>
            </div>
          ) : (
            <form onSubmit={handleNotifySubmit} className="flex gap-2">
              <input
                type="email"
                required
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                placeholder="Enter your email address"
                className="px-4 py-2.5 rounded-full bg-white border border-[#E7E4E7] text-xs text-[#221D1D] focus:outline-none focus:border-[#BFAFE5] shadow-xs flex-1 min-w-0"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[#221D1D] hover:bg-[#383130] text-white text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                Notify Me
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
