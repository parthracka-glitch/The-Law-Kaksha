"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Lock,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Shield,
  TrendingUp,
  Award,
} from "lucide-react";
import { IInternshipJobModel } from "@/types/student-lms";

interface GatedInternshipBoardProps {
  currentProgressPercentage: number;
  studentName: string;
  rollNumber: string;
}

const INTERNSHIPS_DATA: IInternshipJobModel[] = [
  {
    id: "job-1",
    firmName: "Shardul Amarchand Mangaldas & Co.",
    logoInitial: "SAM",
    role: "Corporate Law & Mergers (M&A) Trainee",
    location: "Mumbai (BKC) / Hybrid",
    stipend: "₹35,000 / Month",
    duration: "6 Months",
    requiredCompletionPercentage: 70,
    isUnlocked: true,
    tags: ["Companies Act", "M&A Diligence", "NCLT Filing"],
    description: "Assist partners in corporate restructuring schemes, drafting board resolutions, and due diligence under Section 230-232.",
    deadline: "15 Oct 2026",
    openings: 4,
  },
  {
    id: "job-2",
    firmName: "AZB & Partners",
    logoInitial: "AZB",
    role: "Capital Markets & Regulatory Compliance Analyst",
    location: "New Delhi / Gurgaon",
    stipend: "₹40,000 / Month",
    duration: "3-6 Months",
    requiredCompletionPercentage: 70,
    isUnlocked: true,
    tags: ["SEBI ICDR", "Prospectus §23-42", "ROC Regulatory"],
    description: "Review draft red herring prospectuses (DRHP), analyze ROC filing compliance, and prepare legal advisory memorandums.",
    deadline: "22 Oct 2026",
    openings: 2,
  },
  {
    id: "job-3",
    firmName: "EY Corporate Tax & Legal Advisory",
    logoInitial: "EY",
    role: "Corporate Social Responsibility (CSR) & Governance Associate",
    location: "Bengaluru / Remote",
    stipend: "₹30,000 / Month",
    duration: "6 Months",
    requiredCompletionPercentage: 70,
    isUnlocked: true,
    tags: ["CSR §135", "Schedule VII", "Corporate Governance"],
    description: "Perform CSR expenditure audits, unspent fund account tracking, and compliance advisory for Fortune 500 clients.",
    deadline: "30 Oct 2026",
    openings: 6,
  },
  {
    id: "job-4",
    firmName: "Trilegal",
    logoInitial: "TL",
    role: "Commercial Dispute Resolution & IBC Legal Fellow",
    location: "Mumbai / Bengaluru",
    stipend: "₹45,000 / Month",
    duration: "6 Months",
    requiredCompletionPercentage: 70,
    isUnlocked: true,
    tags: ["Insolvency & Bankruptcy", "NCLAT Appeals", "Contract Enforcement"],
    description: "Support senior associates in Section 7/9 IBC petition drafting, committee of creditors (CoC) advisory, and NCLAT representations.",
    deadline: "05 Nov 2026",
    openings: 3,
  },
];

export function GatedInternshipBoard({
  currentProgressPercentage,
  studentName,
  rollNumber,
}: GatedInternshipBoardProps) {
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const isGated = currentProgressPercentage < 70;

  const handleApply = (id: string) => {
    setAppliedJobIds((prev) => [...prev, id]);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs relative overflow-hidden space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-sky-50 text-[#0284C7] border border-sky-200">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Law Firm &amp; Corporate Career Board</span>
            </span>

            {isGated ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                <Lock className="w-3 h-3 text-amber-600" />
                <span>Locked at {currentProgressPercentage}%</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Unlocked &amp; Eligible</span>
              </span>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-serif font-black text-slate-900 tracking-tight">
            Tier-1 Law Firm &amp; Big-4 Internship Placements
          </h3>
          <p className="text-xs text-slate-500">
            Direct recruitment pipeline for Law Kaksha aspirants who complete 70%+ of the corporate legal curriculum.
          </p>
        </div>

        {/* Progress Gate Status Pill */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 shrink-0 text-center sm:text-right">
          <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">
            Unlock Threshold
          </span>
          <span className="text-sm font-bold text-slate-900 mt-0.5 block">
            {currentProgressPercentage}% <span className="text-slate-400 font-normal">/ 70% Required</span>
          </span>
        </div>
      </div>

      {/* If Locked: Gated Barrier Overlay */}
      {isGated ? (
        <div className="bg-gradient-to-b from-slate-50 to-white rounded-3xl border-2 border-dashed border-amber-200 p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h4 className="text-base font-serif font-bold text-slate-900">
              Complete {70 - currentProgressPercentage}% More to Unlock Applications
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tier-1 law firms require solid mastery of Companies Act 2013 and ROC case law. Keep watching masterclasses and completing notes to unlock instant applications!
            </p>
          </div>

          <div className="w-full max-w-sm mx-auto bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#0284C7] h-full rounded-full transition-all duration-500"
              style={{ width: `${(currentProgressPercentage / 70) * 100}%` }}
            />
          </div>
        </div>
      ) : (
        /* Unlocked: Active Job Openings Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INTERNSHIPS_DATA.map((job) => {
            const isApplied = appliedJobIds.includes(job.id);

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-sky-200 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs font-serif">
                        {job.logoInitial}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {job.firmName}
                        </h4>
                        <span className="text-[11px] text-[#0284C7] font-semibold block">
                          {job.role}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {job.stipend}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.location}</span>
                  </span>

                  {isApplied ? (
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Application Submitted</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(job.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-[#0284C7] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1"
                    >
                      <span>Apply with Profile</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
