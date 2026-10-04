"use client";

import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Bell,
  ArrowRight,
  Layers,
  Clock,
} from "lucide-react";

interface CseetComingSoonShellProps {
  onOpenSampleReader: (pdfUrl: string, title: string) => void;
  onPreOrder: () => void;
}

const CSEET_PLANNED_UNITS = [
  { unit: "Unit 1", title: "Indian Contract Act, 1872", status: "Codified & Verified", ready: true },
  { unit: "Unit 2", title: "Sale of Goods Act, 1930", status: "Codified & Verified", ready: true },
  { unit: "Unit 3", title: "Indian Partnership Act, 1932", status: "Sample Available", ready: true },
  { unit: "Unit 4", title: "LLP Act, 2008", status: "Codified & Verified", ready: true },
  { unit: "Unit 5", title: "Elements of Company Law", status: "Codified & Verified", ready: true },
  { unit: "Unit 6", title: "Negotiable Instruments Act", status: "Codified & Verified", ready: true },
  { unit: "Unit 7", title: "Principles of Management", status: "In Quality Review", ready: false },
  { unit: "Unit 8", title: "Business Environment & Ethics", status: "In Quality Review", ready: false },
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
    <div className="space-y-5 animate-in fade-in duration-300">

      {/* 1. COMPACT HEADER BANNER */}
      <div className="rounded-2xl bg-[#221D1D] border border-[#221D1D] p-5 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold tracking-wider uppercase text-white/70">
              <Sparkles className="w-3 h-3" />
              <span>Under Active Production · Nov 2026 Batch</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white leading-tight">
              CSEET Paper 2: Business Law & Management
            </h1>
            <p className="text-xs text-white/60 leading-relaxed max-w-xl">
              Complete 8-Unit ICSI syllabus — unit-wise notes, question banks & timed mock evaluations for CS Executive Entrance Test.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => onOpenSampleReader("/notes/unit-1-general-nature-of-partnership.pdf", "Indian Partnership Act — Unit 1 (Sample)")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#AED7E9] hover:bg-[#9BC9DD] text-[#221D1D] text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Sample</span>
            </button>
            <button
              onClick={onPreOrder}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
            >
              <span>₹99/Month</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. CURRICULUM GRID */}
      <div className="rounded-2xl bg-white border border-[#E7E4E7] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#4B8097]" />
            <h2 className="text-sm font-bold text-[#221D1D]">8-Unit ICSI Curriculum Matrix</h2>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#AED7E9]/30 text-[#221D1D] border border-[#AED7E9]">
            500+ Practice MCQs
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {CSEET_PLANNED_UNITS.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[#E7E4E7] p-3 bg-[#FAFAF9] flex flex-col gap-2 hover:border-[#AED7E9] hover:bg-white transition-all"
            >
              <span className="text-[10px] font-bold font-mono text-[#77716E]">{item.unit}</span>
              <p className="text-xs font-semibold text-[#221D1D] leading-snug line-clamp-2">{item.title}</p>
              <div className="flex items-center gap-1 mt-auto pt-1 border-t border-[#E7E4E7]/60">
                {item.ready ? (
                  <CheckCircle2 className="w-3 h-3 text-[#4B8097] shrink-0" />
                ) : (
                  <Clock className="w-3 h-3 text-[#C4B5A5] shrink-0" />
                )}
                <span className={`text-[10px] font-semibold truncate ${item.ready ? "text-[#4B8097]" : "text-[#C4B5A5]"}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. NOTIFY CARD */}
      <div className="rounded-2xl bg-white border border-[#E7E4E7] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#221D1D]">
            <Bell className="w-3.5 h-3.5 text-[#4B8097]" />
            <span>Priority Launch Notification</span>
          </div>
          <p className="text-xs text-[#77716E] leading-relaxed max-w-md">
            Get notified when the CSEET Question Bank goes live — with guaranteed ₹99 launch pricing locked in for 30 days.
          </p>
        </div>

        <div className="w-full sm:w-auto shrink-0 sm:min-w-[280px]">
          {isNotified ? (
            <div className="px-4 py-2.5 rounded-xl bg-[#AED7E9]/20 border border-[#AED7E9] text-[#221D1D] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#4B8097]" />
              <span>You're on the priority list!</span>
            </div>
          ) : (
            <form onSubmit={handleNotifySubmit} className="flex gap-2">
              <input
                type="email"
                required
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                placeholder="Your email address"
                className="px-4 py-2 rounded-full bg-[#F7F7F5] border border-[#E7E4E7] text-xs text-[#221D1D] placeholder-[#B8B1AE] focus:outline-none focus:border-[#4B8097] flex-1 min-w-0"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-full bg-[#221D1D] hover:bg-[#383130] text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
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
