"use client";

import React, { useState, useEffect } from "react";
import {
  Award,
  CheckCircle2,
  Clock,
  Flame,
  ArrowRight,
  Shield,
  Zap,
  TrendingUp,
  FileCheck,
  AlertCircle,
  Database,
} from "lucide-react";

interface GamificationRefundWidgetProps {
  studentName: string;
  examCountdownDays: number;
  streakDays: number;
  onOpenEvaluationDesk: () => void;
}

export function GamificationRefundWidget({
  studentName,
  examCountdownDays,
  streakDays,
  onOpenEvaluationDesk,
}: GamificationRefundWidgetProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(examCountdownDays * 86400);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const days = Math.floor(secondsRemaining / 86400);
  const hours = Math.floor((secondsRemaining % 86400) / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  const submittedDraftsCount = 6;
  const targetDraftsCount = 8;
  const draftPercentage = Math.round((submittedDraftsCount / targetDraftsCount) * 100);

  const draftsList = [
    { id: "D-1", title: "Section 103 Public vs Private AGM Quorum Draft", status: "Evaluated", score: "14/15" },
    { id: "D-2", title: "Section 185/186 Inter-Corporate Loan Limits", status: "Evaluated", score: "13.5/14" },
    { id: "D-3", title: "Section 135 CSR Spending & Penalty Calculation", status: "Evaluated", score: "9/10" },
    { id: "D-4", title: "Section 241 Oppression & Mismanagement Drafting", status: "Evaluated", score: "14/15" },
    { id: "D-5", title: "Foreign Contribution (FCRA) Statutory Notice", status: "Evaluated", score: "12/15" },
    { id: "D-6", title: "General Clauses Act Precedent Synthesis", status: "Evaluated", score: "13/15" },
    { id: "D-7", title: "NCLT Merger Scheme (§230) Drafting Exercise", status: "Pending", score: "Upload Ready" },
    { id: "D-8", title: "Full 100-Mark ICAI Law Mock Exam Paper", status: "Pending", score: "Upload Ready" },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs relative overflow-hidden space-y-5">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-amber-100/50 via-amber-50/20 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header with Title & Redis Cache Performance Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <Award className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              <span>Ranker Fellowship Program</span>
            </span>

            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <Database className="w-3 h-3 text-emerald-600" />
              <span>Redis: Hit (3ms)</span>
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-serif font-black text-slate-900 tracking-tight">
            100% Fee-Refund &amp; Study Milestone Tracker
          </h3>
          <p className="text-xs text-slate-500">
            Submit all 8 model drafts &amp; maintain your streak to trigger automatic 100% fee cashback upon exam result.
          </p>
        </div>

        {/* Live Countdown Clock */}
        <div className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl border border-slate-800 shrink-0 text-center sm:text-right shadow-xs">
          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
            Eligibility Deadline
          </span>
          <div className="text-xs font-mono font-bold tracking-tight text-white mt-0.5">
            <span className="text-sky-400 font-black text-sm">{days}d</span> : {String(hours).padStart(2, "0")}h : {String(minutes).padStart(2, "0")}m : {String(seconds).padStart(2, "0")}s
          </div>
        </div>
      </div>

      {/* 3 Milestone Progress Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 relative z-10">
        
        {/* 1. Streak Requirement */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Study Streak</span>
            </span>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[10.5px]">
              ✓ Qualified
            </span>
          </div>
          <div className="text-xl font-bold font-serif text-slate-900">
            {streakDays} <span className="text-xs font-sans text-slate-500 font-normal">/ 14 Days Required</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full w-full" />
          </div>
        </div>

        {/* 2. Descriptive Drafts Submitted */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-[#0284C7]" />
              <span>Mains Drafts</span>
            </span>
            <span className="font-bold text-[#0284C7] text-[11px] font-mono">
              {draftPercentage}%
            </span>
          </div>
          <div className="text-xl font-bold font-serif text-slate-900">
            {submittedDraftsCount} <span className="text-xs font-sans text-slate-500 font-normal">/ {targetDraftsCount} Submitted</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#0284C7] h-full rounded-full transition-all duration-500" style={{ width: `${draftPercentage}%` }} />
          </div>
        </div>

        {/* 3. MCQ Question Bank Accuracy */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>MCQ Accuracy</span>
            </span>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[10.5px]">
              ✓ &gt;80% Met
            </span>
          </div>
          <div className="text-xl font-bold font-serif text-slate-900">
            88% <span className="text-xs font-sans text-slate-500 font-normal">Average Accuracy</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full w-[88%]" />
          </div>
        </div>

      </div>

      {/* Drafts Submitted Checklist Preview */}
      <div className="space-y-2.5 relative z-10 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">
            Mains Legal Answer Checklist (Submit remaining 2 drafts for 100% eligibility):
          </span>
          <button
            onClick={onOpenEvaluationDesk}
            className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1"
          >
            <span>Open Mains Evaluation Desk</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {draftsList.map((d, i) => (
            <div
              key={d.id}
              className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                d.status === "Evaluated"
                  ? "bg-slate-50 border-slate-200/80 text-slate-700"
                  : "bg-sky-50/70 border-sky-200 text-slate-900 font-medium"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {d.status === "Evaluated" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                )}
                <span className="truncate text-[11.5px]">{d.title}</span>
              </div>

              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-md shrink-0 font-bold ${
                  d.status === "Evaluated"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-[#0284C7] text-white"
                }`}
              >
                {d.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
