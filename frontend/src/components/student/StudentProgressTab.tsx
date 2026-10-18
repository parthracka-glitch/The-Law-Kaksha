"use client";

import React from "react";
import {
  CheckSquare,
  Flame,
  Award,
  Zap,
  Calendar,
  CheckCircle2,
  Circle,
  BarChart3,
  Trophy,
  ArrowRight,
} from "lucide-react";

interface StudentProgressTabProps {
  totalUnitsCompleted: number;
  streakDays: number;
  lawXp: number;
  completedUnits: string[];
  onToggleUnitComplete: (unitId: string) => void;
  onOpenStreakCalendar: () => void;
}

// Statutory curriculum units reference list for CA Foundation & CSEET
const CURRICULUM_UNITS_CATALOG = [
  { id: "unit-ca-contract-1", actTitle: "Indian Contract Act, 1872", title: "Unit 1: Nature of Contracts & Essentials of Valid Offer", weightage: "10-12 Marks" },
  { id: "unit-ca-contract-2", actTitle: "Indian Contract Act, 1872", title: "Unit 2: Consideration & Capacity to Contract", weightage: "6-8 Marks" },
  { id: "unit-ca-contract-3", actTitle: "Indian Contract Act, 1872", title: "Unit 3: Free Consent, Legality of Object & Void Agreements", weightage: "8-10 Marks" },
  { id: "unit-ca-contract-4", actTitle: "Indian Contract Act, 1872", title: "Unit 4: Performance & Discharge of Contract", weightage: "6-8 Marks" },
  { id: "unit-ca-contract-5", actTitle: "Indian Contract Act, 1872", title: "Unit 5: Breach of Contract & Remedies under Section 73", weightage: "8-10 Marks" },
  { id: "unit-ca-soga-1", actTitle: "Sale of Goods Act, 1930", title: "Unit 1: Formation of Contract of Sale & Subject Matter", weightage: "6-8 Marks" },
  { id: "unit-ca-soga-2", actTitle: "Sale of Goods Act, 1930", title: "Unit 2: Conditions and Warranties (Sec 11-17)", weightage: "6-8 Marks" },
  { id: "unit-ca-soga-3", actTitle: "Sale of Goods Act, 1930", title: "Unit 3: Transfer of Property & Rights of Unpaid Seller", weightage: "8-10 Marks" },
  { id: "unit-ca-partnership-1", actTitle: "Indian Partnership Act, 1932", title: "Unit 1: General Nature of Partnership & True Test (Cox v. Hickman)", weightage: "5-6 Marks" },
  { id: "unit-ca-partnership-2", actTitle: "Indian Partnership Act, 1932", title: "Unit 2: Relations of Partners & Implied Authority", weightage: "6-8 Marks" },
  { id: "unit-ca-partnership-3", actTitle: "Indian Partnership Act, 1932", title: "Unit 3: Registration and Dissolution of Firm (Sec 48-49)", weightage: "6-8 Marks" },
  { id: "unit-cs-company-1", actTitle: "Elements of Company Law (2013)", title: "Unit 1: Corporate Veil, MOA, AOA & Ultra Vires Doctrine", weightage: "12-15 Marks" },
];

export function StudentProgressTab({
  totalUnitsCompleted,
  streakDays,
  lawXp,
  completedUnits = [],
  onToggleUnitComplete,
  onOpenStreakCalendar,
}: StudentProgressTabProps) {
  const totalUnits = CURRICULUM_UNITS_CATALOG.length;
  const progressPercent = Math.min(100, Math.round((totalUnitsCompleted / totalUnits) * 100));

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl border border-[#E7ECF7] p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE] mb-2">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Syllabus Mastery Tracker</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0A192F] tracking-tight">
              My Progress & Study Streak
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Track your statutory syllabus completion, daily study discipline, and earned Law XP.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenStreakCalendar}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#005A9C] border border-[#DBEAFE] transition-all cursor-pointer shadow-2xs flex items-center gap-2 self-start sm:self-auto"
          >
            <Calendar className="w-4 h-4" />
            <span>Open Streak Calendar</span>
          </button>
        </div>
      </div>

      {/* THREE KEY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Units Completed */}
        <div className="bg-white rounded-2xl border border-[#E7ECF7] p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Completed Units
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-black text-[#0A192F]">{totalUnitsCompleted}</span>
              <span className="text-xs font-semibold text-[#64748B]">/ {totalUnits} Units</span>
            </div>
            <p className="text-[11px] text-[#047857] font-semibold mt-0.5">
              {progressPercent}% Syllabus Covered
            </p>
          </div>
        </div>

        {/* 2. Study Streak */}
        <div className="bg-white rounded-2xl border border-[#E7ECF7] p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA] flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Active Streak
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-black text-[#0A192F]">{streakDays}</span>
              <span className="text-xs font-semibold text-[#64748B]">Days Active</span>
            </div>
            <p className="text-[11px] text-[#EA580C] font-semibold mt-0.5">
              Daily Study Habit Maintained
            </p>
          </div>
        </div>

        {/* 3. Law XP Earned */}
        <div className="bg-white rounded-2xl border border-[#E7ECF7] p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE] flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Earned Law XP
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-black text-[#0A192F]">{lawXp}</span>
              <span className="text-xs font-semibold text-[#64748B]">XP</span>
            </div>
            <p className="text-[11px] text-[#7C3AED] font-semibold mt-0.5">
              +20 XP per Completed Unit
            </p>
          </div>
        </div>
      </div>

      {/* OVERALL PROGRESS BAR */}
      <div className="bg-white rounded-2xl border border-[#E7ECF7] p-5 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-[#0A192F]">Curriculum Completion Status</span>
          <span className="text-[#005A9C]">{progressPercent}% Completed</span>
        </div>
        <div className="w-full h-3 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] overflow-hidden">
          <div
            className="h-full bg-[#005A9C] transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* UNITS CHECKLIST */}
      <div className="bg-white rounded-2xl border border-[#E7ECF7] p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#0A192F]">
            Curriculum Checklist ({totalUnitsCompleted}/{totalUnits})
          </h3>
          <span className="text-xs text-[#64748B]">
            Check off units as you complete your daily revision
          </span>
        </div>

        <div className="space-y-2">
          {CURRICULUM_UNITS_CATALOG.map((item) => {
            const isCompleted = completedUnits.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => onToggleUnitComplete(item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isCompleted
                    ? "bg-[#F0FDF4] border-[#BBF7D0]"
                    : "bg-white border-[#E7ECF7] hover:border-[#005A9C]/40"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0 text-lg">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-[#047857]" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#94A3B8]" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                      {item.actTitle}
                    </span>
                    <p
                      className={`text-xs sm:text-sm font-bold truncate ${
                        isCompleted ? "text-[#065F46] line-through" : "text-[#0A192F]"
                      }`}
                    >
                      {item.title}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE]">
                    {item.weightage}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
