"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  FileText,
  Workflow,
  Sparkles,
  Award,
  Lightbulb,
  Target,
  CheckCircle2,
  Lock,
  ChevronDown,
  Search,
  Calendar,
  Layers,
  HelpCircle,
} from "lucide-react";
import { ActIllustration } from "./ActIllustration";

export interface StudentPreparationJourneyProps {
  isCaUnlocked?: boolean;
  onOpenPdf: (url: string, title: string, subtitle?: string, courseType?: "ca" | "cs", isFreeSample?: boolean) => void;
  onBuyCourse?: (type: "ca" | "cs" | "all-access") => void;
  initialActId?: string | null;
  studentName?: string;
  onSelectCaseStudy?: () => void;
}

interface ActUnit {
  unitNumber: number;
  title: string;
  notesPdf?: string;
  flowchartsPdf?: string;
  practicePdf?: string;
  pyqPdf?: string;
  ldrPdf?: string;
  caseScenario?: string;
}

interface ActConfig {
  id: string;
  number: number;
  title: string;
  year: string;
  unitsCount: string;
  status: "ready" | "arriving" | "coming-soon";
  badgeText: string;
  illustrationType: "contract" | "soga" | "partnership" | "llp" | "companies" | "ni";
  weightage: string;
  description: string;
  units: ActUnit[];
}

const CA_ACTS_CONFIG: ActConfig[] = [
  {
    id: "ca-ch2",
    number: 1,
    title: "Indian Contract Act",
    year: "1872",
    unitsCount: "9 Units",
    status: "ready",
    badgeText: "9 Units",
    illustrationType: "contract",
    weightage: "20 - 25 Marks",
    description: "Nature of Contracts, Offer & Acceptance, Consideration, Free Consent, Performance, Breach & Remedies across 9 core ICAI units.",
    units: [
      { unitNumber: 1, title: "Nature of Contracts & Offer / Acceptance (Sec 1-9)", notesPdf: "/notes/smart-revision-question-bank-part-1.pdf", practicePdf: "/notes/qbank-part1-sample.pdf", ldrPdf: "/notes/partnership-ldr-charts.pdf" },
      { unitNumber: 2, title: "Consideration & Capacity of Parties (Sec 10-25)", notesPdf: "/notes/smart-revision-question-bank-part-1.pdf", practicePdf: "/notes/qbank-part1-sample.pdf" },
      { unitNumber: 3, title: "Free Consent, Coercion, Fraud & Misrepresentation (Sec 13-19)", notesPdf: "/notes/smart-revision-question-bank-part-1.pdf", practicePdf: "/notes/qbank-part1-sample.pdf" },
      { unitNumber: 4, title: "Capacity of Parties (Minor, Unsound Mind, Disqualified)", notesPdf: "/notes/smart-revision-question-bank-part-1.pdf", practicePdf: "/notes/qbank-part1-sample.pdf" },
      { unitNumber: 5, title: "Void & Illegal Agreements (Sec 23-30)", notesPdf: "/notes/smart-revision-question-bank-part-1.pdf", practicePdf: "/notes/qbank-part1-sample.pdf" },
      { unitNumber: 6, title: "Performance of Contract & Joint Promisors (Sec 37-67)", notesPdf: "/notes/smart-revision-question-bank-part-1.pdf", practicePdf: "/notes/qbank-part1-sample.pdf" },
      { unitNumber: 7, title: "Discharge of Contract & Supervening Impossibility (Sec 56)", notesPdf: "/notes/smart-revision-question-bank-part-1.pdf", practicePdf: "/notes/qbank-part1-sample.pdf" },
      { unitNumber: 8, title: "Breach of Contract & Liquidated Damages (Sec 73-75)", notesPdf: "/notes/smart-revision-question-bank-part-1.pdf", practicePdf: "/notes/qbank-part1-sample.pdf" },
      { unitNumber: 9, title: "Contingent & Quasi Contracts (Sec 31-36, 68-72)", notesPdf: "/notes/smart-revision-question-bank-part-1.pdf", practicePdf: "/notes/qbank-part1-sample.pdf" },
    ],
  },
  {
    id: "ca-ch3",
    number: 2,
    title: "Sale of Goods Act",
    year: "1930",
    unitsCount: "4 Units",
    status: "ready",
    badgeText: "4 Units",
    illustrationType: "soga",
    weightage: "15 - 20 Marks",
    description: "Formation of Contract of Sale, Conditions & Warranties, Transfer of Ownership, Unpaid Seller Rights.",
    units: [
      {
        unitNumber: 1,
        title: "Formation of Contract of Sale",
        notesPdf: "/notes/soga-unit-1.pdf",
        flowchartsPdf: "/notes/partnership-infographics.pdf",
        practicePdf: "/notes/qbank-part1-sample.pdf",
        pyqPdf: "/notes/september-2026-paper-analysis.pdf",
        ldrPdf: "/notes/partnership-ldr-charts.pdf",
        caseScenario: "Priest v. Last (Hot water bottle burst) & Section 16(1) Caveat Emptor exceptions.",
      },
      {
        unitNumber: 2,
        title: "Conditions & Warranties",
        notesPdf: "/notes/soga-unit-2.pdf",
        flowchartsPdf: "/notes/partnership-infographics.pdf",
        practicePdf: "/notes/qbank-part1-final.pdf",
        pyqPdf: "/notes/september-2026-paper-analysis.pdf",
        ldrPdf: "/notes/partnership-ldr-charts.pdf",
        caseScenario: "Grant v. Australian Knitting Mills (Implied condition as to merchantability).",
      },
      {
        unitNumber: 3,
        title: "Transfer of Property and Performance of Contract of Sale",
        notesPdf: "/notes/soga-unit-3.pdf",
        flowchartsPdf: "/notes/partnership-infographics.pdf",
        practicePdf: "/notes/qbank-part1-final.pdf",
        pyqPdf: "/notes/september-2026-paper-analysis.pdf",
        ldrPdf: "/notes/partnership-ldr-charts.pdf",
      },
      {
        unitNumber: 4,
        title: "Rights of Unpaid Seller against Goods & Buyer",
        notesPdf: "/notes/soga-unit-4.pdf",
        flowchartsPdf: "/notes/partnership-infographics.pdf",
        practicePdf: "/notes/qbank-part1-final.pdf",
        pyqPdf: "/notes/september-2026-paper-analysis.pdf",
        ldrPdf: "/notes/partnership-ldr-charts.pdf",
      },
    ],
  },
  {
    id: "ca-ch4",
    number: 3,
    title: "Indian Partnership Act",
    year: "1932",
    unitsCount: "3 Units",
    status: "ready",
    badgeText: "3 Units",
    illustrationType: "partnership",
    weightage: "15 - 20 Marks",
    description: "General Nature of Partnership, Relations of Partners, Registration and Dissolution of Firm.",
    units: [
      {
        unitNumber: 1,
        title: "General Nature of Partnership",
        notesPdf: "/notes/ipa-unit-1.pdf",
        flowchartsPdf: "/notes/ipa-infographics.pdf",
        practicePdf: "/notes/ipa-practice-questions.pdf",
        pyqPdf: "/notes/ipa-rtp-mtp-pyp.pdf",
        ldrPdf: "/notes/ipa-ldr-charts.pdf",
        caseScenario: "Cox v. Hickman (Mutual agency as cardinal test of partnership).",
      },
      {
        unitNumber: 2,
        title: "Relations of Partners",
        notesPdf: "/notes/ipa-unit-2.pdf",
        flowchartsPdf: "/notes/ipa-infographics.pdf",
        practicePdf: "/notes/ipa-practice-questions.pdf",
        pyqPdf: "/notes/ipa-rtp-mtp-pyp.pdf",
        ldrPdf: "/notes/ipa-ldr-charts.pdf",
        caseScenario: "Scarf v. Jardine (Doctrine of holding out & liability of retired partner).",
      },
      {
        unitNumber: 3,
        title: "Registration & Dissolution of Firm",
        notesPdf: "/notes/ipa-unit-3.pdf",
        flowchartsPdf: "/notes/ipa-infographics.pdf",
        practicePdf: "/notes/ipa-practice-questions.pdf",
        pyqPdf: "/notes/ipa-rtp-mtp-pyp.pdf",
        ldrPdf: "/notes/ipa-ldr-charts.pdf",
      },
    ],
  },
  {
    id: "ca-ch5",
    number: 4,
    title: "Limited Liability Partnership Act",
    year: "2008",
    unitsCount: "All Units",
    status: "ready",
    badgeText: "All Units",
    illustrationType: "llp",
    weightage: "5 - 10 Marks",
    description: "LLP Architecture, Salient Features, Incorporation, Designated Partners & Conversion.",
    units: [
      {
        unitNumber: 1,
        title: "The Limited Liability Partnership Act, 2008 (Complete Notes)",
        notesPdf: "/notes/llp-notes.pdf",
        flowchartsPdf: "/notes/llp-infographics.pdf",
        practicePdf: "/notes/llp-practice-questions.pdf",
        pyqPdf: "/notes/qbank-part2-sample.pdf",
        ldrPdf: "/notes/llp-ldr-flowcharts.pdf",
        caseScenario: "Salomon v. Salomon principles applied to statutory LLP artificial legal personality.",
      },
    ],
  },
  {
    id: "ca-ch6",
    number: 5,
    title: "Companies Act",
    year: "2013",
    unitsCount: "Coming Soon",
    status: "coming-soon",
    badgeText: "COMING SOON",
    illustrationType: "companies",
    weightage: "15 - 20 Marks",
    description: "Meaning & characteristics of company, corporate veil, MOA & AOA, doctrine of ultra vires.",
    units: [
      { unitNumber: 1, title: "Essential Characteristics & Corporate Veil" },
      { unitNumber: 2, title: "Memorandum & Articles of Association (MOA/AOA)" },
    ],
  },
  {
    id: "ca-ch7",
    number: 6,
    title: "Negotiable Instruments Act",
    year: "1881",
    unitsCount: "Coming Soon",
    status: "coming-soon",
    badgeText: "COMING SOON",
    illustrationType: "ni",
    weightage: "10 - 15 Marks",
    description: "Promissory notes, bills of exchange, cheques, negotiation, endorsement and Section 138 dishonour.",
    units: [
      { unitNumber: 1, title: "Promissory Notes, Bills of Exchange & Cheques (Sec 138)" },
    ],
  },
];

const PREPARATION_STEPS = [
  { step: 1, label: "Select Act", icon: BookOpen },
  { step: 2, label: "Learn\n(Notes)", icon: FileText },
  { step: 3, label: "Practise\n(Questions)", icon: Sparkles },
  { step: 4, label: "Solve\nPYQs", icon: Award },
  { step: 5, label: "Apply\n(Case Studies)", icon: Lightbulb },
  { step: 6, label: "Revise\n(LDR)", icon: Target },
];

export function StudentPreparationJourney({
  isCaUnlocked = true,
  onOpenPdf,
  onBuyCourse,
  initialActId = null,
  studentName = "Student",
  onSelectCaseStudy,
}: StudentPreparationJourneyProps) {
  const [selectedActId, setSelectedActId] = useState<string | null>(initialActId);
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number>(0);
  const [subTab, setSubTab] = useState<"units" | "overview" | "progress">("units");
  const [actDropdownOpen, setActDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (initialActId !== undefined) {
      setSelectedActId(initialActId);
      setSelectedUnitIndex(0);
    }
  }, [initialActId]);

  const selectedAct = CA_ACTS_CONFIG.find((a) => a.id === selectedActId);
  const currentUnit = selectedAct?.units[selectedUnitIndex] || selectedAct?.units[0];

  const handleResourceClick = (pdfUrl?: string, title?: string, resType?: string) => {
    if (pdfUrl) {
      onOpenPdf(
        pdfUrl,
        selectedAct ? `${selectedAct.title}, ${selectedAct.year}` : "CA Foundation",
        title || "Study Material",
        "ca",
        true
      );
    } else {
      alert(`The ${resType || "resource"} for this unit is currently in preparation and will be available shortly.`);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // VIEW 2: ACT DETAIL VIEW (Matching WhatsApp Image 2026-10-15 at 3.00.47 PM.jpeg)
  // ─────────────────────────────────────────────────────────────────────────────
  if (selectedAct) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* 1. BREADCRUMBS */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-[#64748B]">
          <button
            onClick={() => {
              setSelectedActId(null);
              setActDropdownOpen(false);
            }}
            className="hover:text-[#005A9C] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <span>&gt;</span>
          <span className="font-medium text-[#475569]">CA Foundation</span>
          <span>&gt;</span>
          <span className="font-bold text-[#005A9C]">{selectedAct.title}, {selectedAct.year}</span>
        </div>

        {/* 2. ACT TITLE BAR & CHANGE ACT DROPDOWN */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs flex items-center justify-between gap-4 relative">
          <div className="flex items-center gap-3.5 min-w-0">
            <button
              onClick={() => setSelectedActId(null)}
              className="p-2 rounded-xl text-[#64748B] hover:text-[#0A192F] hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 shrink-0 flex items-center justify-center">
              <ActIllustration type={selectedAct.illustrationType} className="w-12 h-12" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-serif font-black text-[#0A192F] tracking-tight truncate">
                {selectedAct.title}, {selectedAct.year}
              </h1>
              <p className="text-xs text-[#64748B] font-medium mt-0.5">
                CA Foundation Paper 2 • Business Laws • {selectedAct.weightage}
              </p>
            </div>
          </div>

          {/* Change Act Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setActDropdownOpen(!actDropdownOpen)}
              className="px-3.5 py-2 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-xs font-bold text-[#0A192F] transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <span>Change Act</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
            </button>

            {actDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-[#CBD5E1] shadow-xl p-2 z-30 space-y-1 animate-in fade-in zoom-in-95">
                <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  Select an Act
                </div>
                {CA_ACTS_CONFIG.map((act) => (
                  <button
                    key={act.id}
                    onClick={() => {
                      setSelectedActId(act.id);
                      setSelectedUnitIndex(0);
                      setActDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                      act.id === selectedAct.id
                        ? "bg-[#EFF6FF] text-[#005A9C] font-bold"
                        : "text-[#334155] hover:bg-gray-50"
                    }`}
                  >
                    <span className="truncate">{act.title}, {act.year}</span>
                    <span className="text-[10px] text-[#64748B] shrink-0">{act.unitsCount}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3. TABS: UNITS | OVERVIEW | PROGRESS */}
        <div className="flex items-center gap-6 border-b border-[#E2E8F0] px-1">
          <button
            onClick={() => setSubTab("units")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              subTab === "units"
                ? "border-[#005A9C] text-[#005A9C]"
                : "border-transparent text-[#64748B] hover:text-[#0A192F]"
            }`}
          >
            Units
          </button>
          <button
            onClick={() => setSubTab("overview")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              subTab === "overview"
                ? "border-[#005A9C] text-[#005A9C]"
                : "border-transparent text-[#64748B] hover:text-[#0A192F]"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSubTab("progress")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              subTab === "progress"
                ? "border-[#005A9C] text-[#005A9C]"
                : "border-transparent text-[#64748B] hover:text-[#0A192F]"
            }`}
          >
            Progress
          </button>
        </div>

        {/* 4. MAIN SPLIT VIEW (LEFT: UNITS LIST | RIGHT: THE 6 STUDY PILLARS) */}
        {subTab === "units" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-1">
            {/* LEFT COLUMN: UNITS LIST */}
            <div className="lg:col-span-4 space-y-2">
              {selectedAct.units.map((unit, idx) => {
                const isSelected = idx === selectedUnitIndex;
                return (
                  <button
                    key={unit.unitNumber}
                    onClick={() => setSelectedUnitIndex(idx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? "bg-[#EFF6FF] border-[#BFDBFE] text-[#0A192F] shadow-2xs font-semibold"
                        : "bg-white border-[#E2E8F0] hover:border-[#CBD5E1] text-[#475569]"
                    }`}
                  >
                    {/* Left vertical blue bar indicator */}
                    {isSelected && (
                      <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#005A9C] rounded-r-full" />
                    )}
                    <div className="pl-1">
                      <p className={`text-xs font-bold mb-0.5 ${isSelected ? "text-[#005A9C]" : "text-[#64748B]"}`}>
                        Unit {unit.unitNumber}
                      </p>
                      <h4 className="text-xs sm:text-sm leading-snug line-clamp-2">
                        {unit.title}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* RIGHT COLUMN: ACTIVE UNIT & THE 6 STUDY PILLARS */}
            <div className="lg:col-span-8 space-y-4">
              {/* Unit Header with 20% progress */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
                <div>
                  <span className="text-xs font-bold text-[#005A9C]">
                    Unit {currentUnit?.unitNumber}
                  </span>
                  <h3 className="text-lg sm:text-xl font-serif font-black text-[#0A192F] mt-0.5">
                    {currentUnit?.title}
                  </h3>
                </div>

                {/* Progress bar on the right matching reference */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-xs font-bold text-[#475569]">20% complete</span>
                  <div className="w-28 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full bg-[#005A9C] rounded-full" style={{ width: "20%" }} />
                  </div>
                </div>
              </div>

              {/* THE 6 STUDY PILLARS (2 Columns x 3 Rows Grid) matching WhatsApp Image 2026-10-15 at 3.00.47 PM.jpeg */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Study Notes */}
                <div
                  onClick={() => handleResourceClick(currentUnit?.notesPdf, `${currentUnit?.title} - Study Notes`, "Study Notes")}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-4 hover:border-[#005A9C] hover:shadow-md transition-all flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#005A9C] shrink-0 group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5 text-[#005A9C]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#0A192F]">Study Notes</h4>
                      <p className="text-[11px] text-[#64748B] truncate">Read and understand the concept.</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#005A9C] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>

                {/* 2. Flowcharts */}
                <div
                  onClick={() => handleResourceClick(currentUnit?.flowchartsPdf || (selectedAct.id === "ca-ch4" ? "/notes/ipa-infographics.pdf" : selectedAct.id === "ca-ch5" ? "/notes/llp-infographics.pdf" : "/notes/partnership-infographics.pdf"), `${currentUnit?.title} - Flowcharts`, "Flowcharts")}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-4 hover:border-[#005A9C] hover:shadow-md transition-all flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#005A9C] shrink-0 group-hover:scale-105 transition-transform">
                      <Workflow className="w-5 h-5 text-[#005A9C]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#0A192F]">Flowcharts</h4>
                      <p className="text-[11px] text-[#64748B] truncate">Visual summary for quick revision.</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#005A9C] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>

                {/* 3. Practice Questions */}
                <div
                  onClick={() => handleResourceClick(currentUnit?.practicePdf || (selectedAct.id === "ca-ch4" ? "/notes/ipa-practice-questions.pdf" : selectedAct.id === "ca-ch5" ? "/notes/llp-practice-questions.pdf" : "/notes/qbank-part1-sample.pdf"), `${currentUnit?.title} - Practice Questions`, "Practice Questions")}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-4 hover:border-[#005A9C] hover:shadow-md transition-all flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#005A9C] shrink-0 group-hover:scale-105 transition-transform">
                      <Sparkles className="w-5 h-5 text-[#005A9C]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#0A192F]">Practice Questions</h4>
                      <p className="text-[11px] text-[#64748B] truncate">Unit-wise practice with model answers.</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#005A9C] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>

                {/* 4. Previous-Year Questions (PYQs) */}
                <div
                  onClick={() => handleResourceClick(currentUnit?.pyqPdf || (selectedAct.id === "ca-ch4" ? "/notes/ipa-rtp-mtp-pyp.pdf" : "/notes/september-2026-paper-analysis.pdf"), `${currentUnit?.title} - Previous-Year Questions`, "PYQs")}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-4 hover:border-[#005A9C] hover:shadow-md transition-all flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#005A9C] shrink-0 group-hover:scale-105 transition-transform">
                      <Award className="w-5 h-5 text-[#005A9C]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#0A192F]">Previous-Year Questions</h4>
                      <p className="text-[11px] text-[#64748B] truncate">Past exam questions with detailed analysis.</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#005A9C] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>

                {/* 5. Case Studies */}
                <div
                  onClick={() => {
                    const casePdf =
                      currentUnit?.practicePdf ||
                      (selectedAct.id === "ca-ch5"
                        ? "/notes/llp-practice-questions.pdf"
                        : selectedAct.id === "ca-ch4"
                        ? "/notes/ipa-practice-questions.pdf"
                        : "/notes/qbank-part1-sample.pdf");
                    handleResourceClick(casePdf, `${currentUnit?.title} - Case Studies`, "Case Studies");
                  }}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-4 hover:border-[#005A9C] hover:shadow-md transition-all flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#005A9C] shrink-0 group-hover:scale-105 transition-transform">
                      <Lightbulb className="w-5 h-5 text-[#005A9C]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#0A192F]">Case Studies</h4>
                      <p className="text-[11px] text-[#64748B] truncate">Application-based questions to test your understanding.</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#005A9C] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>

                {/* 6. Last Day Revision (LDR) */}
                <div
                  onClick={() => handleResourceClick(currentUnit?.ldrPdf || (selectedAct.id === "ca-ch4" ? "/notes/ipa-ldr-charts.pdf" : selectedAct.id === "ca-ch5" ? "/notes/llp-ldr-flowcharts.pdf" : "/notes/partnership-ldr-charts.pdf"), `${currentUnit?.title} - Last Day Revision`, "LDR")}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-4 hover:border-[#005A9C] hover:shadow-md transition-all flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#005A9C] shrink-0 group-hover:scale-105 transition-transform">
                      <Target className="w-5 h-5 text-[#005A9C]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#0A192F]">Last Day Revision (LDR)</h4>
                      <p className="text-[11px] text-[#64748B] truncate">Key points for quick revision.</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#005A9C] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OVERVIEW SUBTAB */}
        {subTab === "overview" && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#0A192F]">
              {selectedAct.title}, {selectedAct.year} Overview
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              {selectedAct.description}
            </p>
            <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#005A9C] font-semibold flex items-center gap-2">
              <span>Exam Weightage: {selectedAct.weightage} in ICAI Foundation Paper 2.</span>
            </div>
          </div>
        )}

        {/* PROGRESS SUBTAB */}
        {subTab === "progress" && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#0A192F]">
              {selectedAct.title} Progress Tracker
            </h3>
            <p className="text-xs text-[#64748B]">
              Complete all units, case problems and question banks to achieve exam readiness.
            </p>
            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
              <div className="bg-[#005A9C] h-full rounded-full" style={{ width: "25%" }} />
            </div>
            <p className="text-xs font-bold text-[#005A9C]">1 of {selectedAct.units.length} Units Mastered</p>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // VIEW 1: MAIN DASHBOARD VIEW (Matching WhatsApp Image 2026-10-15 at 3.00.48 PM.jpeg)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. TOP HEADER: TITLE + SUBTITLE + SEARCH BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-[#0A192F] tracking-tight">
            CA Foundation - Business Laws
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-medium">
            Welcome back, {studentName.split(" ")[0]}!
          </p>
        </div>

        {/* Search input matching WhatsApp screenshot */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Act, Unit or Topic..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0A192F] placeholder-[#94A3B8] focus:outline-none focus:border-[#005A9C] shadow-2xs transition-all"
          />
        </div>
      </div>

      {/* 2. CARD: "YOUR PREPARATION JOURNEY" */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs">
        <h2 className="text-sm sm:text-base font-bold text-[#0A192F] mb-4">
          Your Preparation Journey
        </h2>

        {/* Step Flow with Arrows matching WhatsApp Image 2026-10-15 at 3.00.48 PM.jpeg */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
          {PREPARATION_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === PREPARATION_STEPS.length - 1;

            return (
              <React.Fragment key={step.step}>
                <div className="flex flex-col items-center text-center shrink-0 min-w-[70px] sm:min-w-[80px]">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#005A9C] mb-2 shadow-2xs">
                    <Icon className="w-5 h-5 text-[#005A9C]" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-[#0A192F] leading-tight whitespace-pre-line">
                    {step.label}
                  </span>
                </div>

                {!isLast && (
                  <span className="text-[#94A3B8] text-sm sm:text-base shrink-0 font-bold mb-5">
                    →
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* 3. SECTION: "Acts in CA Foundation Business Laws" */}
      <section className="space-y-4">
        <h3 className="text-base sm:text-lg font-serif font-black text-[#0A192F]">
          Acts in CA Foundation Business Laws
        </h3>

        {/* 6 Act Cards Grid (3 cols on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {CA_ACTS_CONFIG.map((act) => {
            const isComingSoon = act.status === "coming-soon";

            return (
              <div
                key={act.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Top row: Number circle + Title + Illustration */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                          isComingSoon
                            ? "bg-[#E2E8F0] text-[#64748B]"
                            : "bg-[#005A9C] text-white"
                        }`}
                      >
                        {act.number}
                      </span>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-[#0A192F] leading-snug">
                          {act.title}
                          <br />
                          {act.year}
                        </h4>
                        {!isComingSoon ? (
                          <p className="text-xs text-[#64748B] mt-1 font-medium">{act.unitsCount}</p>
                        ) : (
                          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#EFF6FF] text-[#005A9C] border border-[#BFDBFE]">
                            <Calendar className="w-3 h-3" />
                            <span>COMING SOON</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Act Illustration on Right */}
                    <div className="w-16 h-16 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <ActIllustration type={act.illustrationType} className="w-16 h-16" />
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div>
                  {!isComingSoon ? (
                    <button
                      onClick={() => {
                        setSelectedActId(act.id);
                        setSelectedUnitIndex(0);
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#005A9C] hover:bg-[#004F8A] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2 rounded-xl bg-[#F1F5F9] text-[#94A3B8] text-xs font-bold cursor-not-allowed text-center"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
