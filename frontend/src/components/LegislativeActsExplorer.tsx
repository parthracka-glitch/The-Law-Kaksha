"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Scale,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { EnhancedSampleChapterModal } from "./EnhancedSampleChapterModal";

interface ActItem {
  id: string;
  name: string;
  shortName: string;
  year: string;
  weightage: string;
  icaiUnits: number;
  description: string;
  keyTopics: string[];
  landmarkCase: string;
  sampleFileName: string;
}

const LEGISLATIVE_ACTS: ActItem[] = [
  {
    id: "contract-act",
    name: "The Indian Contract Act",
    shortName: "Contract Act",
    year: "1872",
    weightage: "25-30% Weightage",
    icaiUnits: 7,
    description:
      "Core foundational law governing offer, acceptance, lawful consideration, free consent, capacity of parties, void agreements, contingent contracts, and remedies for breach.",
    keyTopics: [
      "Offer & Acceptance (Sec 2-9)",
      "Doctrine of Consideration & Privity (Sec 2(d), 25)",
      "Free Consent: Coercion, Undue Influence, Fraud (Sec 13-22)",
      "Quasi Contracts & Quantum Meruit (Sec 68-72)",
      "Discharge & Breach Remedies (Sec 73-75)",
    ],
    landmarkCase: "Mohori Bibee v. Dharmodas Ghose (Minor's Agreement Void ab initio)",
    sampleFileName: "unit-1-general-nature-of-partnership.pdf",
  },
  {
    id: "sale-of-goods",
    name: "The Sale of Goods Act",
    shortName: "Sale of Goods",
    year: "1930",
    weightage: "20-25% Weightage",
    icaiUnits: 4,
    description:
      "Statutory provisions on contracts of sale, condition vs warranty, passing of property/risk, nemo dat quod non habet doctrine, unpaid seller rights, and auction sales.",
    keyTopics: [
      "Formation of Contract of Sale (Sec 4-10)",
      "Implied Conditions & Caveat Emptor (Sec 14-17)",
      "Transfer of Property & Title (Sec 18-30)",
      "Rights of Unpaid Seller: Lien, Stoppage, Resale (Sec 45-54)",
    ],
    landmarkCase: "Priest v. Last (1903) & Grant v. Australian Knitting Mills",
    sampleFileName: "sale-of-goods-unit-1.pdf",
  },
  {
    id: "partnership-act",
    name: "The Indian Partnership Act",
    shortName: "Partnership Act",
    year: "1932",
    weightage: "15-20% Weightage",
    icaiUnits: 3,
    description:
      "Legal definition of partnership, cardinal principle of mutual agency, relations between partners, incoming/outgoing partners, registration procedure, and dissolution rules.",
    keyTopics: [
      "Cardinal Test: Mutual Agency & Profit Sharing (Sec 4-6)",
      "Rights, Duties & Liabilities of Partners (Sec 9-17)",
      "Minor Admitted to Benefits of Partnership (Sec 30)",
      "Modes of Dissolution & Settlement of Accounts (Sec 39-48)",
    ],
    landmarkCase: "Cox v. Hickman (Cardinal Rule of Mutual Agency)",
    sampleFileName: "partnership-ldr-charts.pdf",
  },
  {
    id: "llp-act",
    name: "The Limited Liability Partnership Act",
    shortName: "LLP Act",
    year: "2008",
    weightage: "10-15% Weightage",
    icaiUnits: 2,
    description:
      "Hybrid corporate vehicle combining flexibility of partnership with limited liability of a company. Incorporation procedure, partners, designated partners, and statutory compliances.",
    keyTopics: [
      "Salient Characteristics & Corporate Status (Sec 3-4)",
      "Designated Partners & DPIN Requirements (Sec 7)",
      "Incorporation by Registration & Statement (Sec 11-12)",
      "Distinction between LLP, Traditional Firm & Company",
    ],
    landmarkCase: "Statutory hybrid entity principles under MCA rules",
    sampleFileName: "smart-revision-question-bank-part-1.pdf",
  },
  {
    id: "companies-act",
    name: "The Companies Act",
    shortName: "Companies Act",
    year: "2013",
    weightage: "15-20% Weightage",
    icaiUnits: 2,
    description:
      "Company law essentials: independent corporate entity, doctrine of lifting corporate veil, types of companies (OPC, Private, Public, Small, Section 8), MOA/AOA, and doctrine of ultra vires.",
    keyTopics: [
      "Separate Legal Personality & Corporate Veil (Sec 2(20), 9)",
      "Classification: One Person Company (OPC) & Small Company",
      "Memorandum & Articles of Association (Sec 4, 5)",
      "Doctrine of Ultra Vires & Indoor Management (Turquand Rule)",
    ],
    landmarkCase: "Salomon v. Salomon & Co. Ltd. (Independent Corporate Entity)",
    sampleFileName: "smart-revision-question-bank-part-1.pdf",
  },
  {
    id: "negotiable-instruments",
    name: "The Negotiable Instruments Act",
    shortName: "Negotiable Instruments",
    year: "1881",
    weightage: "10-15% Weightage",
    icaiUnits: 2,
    description:
      "Statutory regime for Promissory Notes, Bills of Exchange, and Cheques. Holder & Holder in Due Course privileges, negotiation modes, crossing of cheques, and Section 138 dishonour prosecution.",
    keyTopics: [
      "Characteristics of Promissory Notes, Bills & Cheques (Sec 4-6)",
      "Holder vs. Holder in Due Course (HDC Privileges, Sec 8-9)",
      "Types of Endorsements & Negotiation (Sec 15, 46-50)",
      "Criminal Liability for Dishonour of Cheques (Sec 138-142)",
    ],
    landmarkCase: "Dalmia Cement (Bharat) Ltd. v. Galaxy Traders (Sec 138 Notice)",
    sampleFileName: "smart-revision-question-bank-part-1.pdf",
  },
  {
    id: "regulatory-framework",
    name: "Indian Regulatory Framework",
    shortName: "Regulatory Framework",
    year: "2026",
    weightage: "5-10% Weightage",
    icaiUnits: 1,
    description:
      "Structure of the Indian legal system, sources of law, parliamentary legislative mechanism, hierarchy of courts (Supreme Court, High Courts, District Courts), and role of MCA, SEBI, and RBI.",
    keyTopics: [
      "Sources of Law: Statutes, Precedents, Custom",
      "How a Bill Becomes an Act (Parliamentary Procedure)",
      "Three-Tier Indian Court Hierarchy & Jurisdiction",
      "Key Economic Regulators: MCA, SEBI, RBI, CCI, IBBI",
    ],
    landmarkCase: "Constitutional framework & judicial review precedents",
    sampleFileName: "september-2026-paper-analysis.pdf",
  },
];

export function LegislativeActsExplorer() {
  const [selectedActId, setSelectedActId] = useState<string>("contract-act");
  const [sampleModalOpen, setSampleModalOpen] = useState(false);

  const activeAct = LEGISLATIVE_ACTS.find((a) => a.id === selectedActId) || LEGISLATIVE_ACTS[0];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#DBEAFE_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#005A9C] text-xs font-bold tracking-wider uppercase shadow-xs">
            <Scale className="w-3.5 h-3.5 text-[#005A9C]" />
            <span>ICAI New Scheme 2026 • 7 Legislative Acts</span>
          </div>

          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
            Every section, condition, proviso, and landmark precedent synthesized into concise high-yield revision codices designed for maximum score in CA Foundation Paper 2.
          </p>
        </div>

        {/* Acts Selector Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none justify-start lg:justify-center">
          {LEGISLATIVE_ACTS.map((act) => {
            const isSelected = act.id === selectedActId;
            return (
              <button
                key={act.id}
                onClick={() => setSelectedActId(act.id)}
                className={`shrink-0 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? "bg-[#005A9C] text-white border-[#005A9C] shadow-md shadow-[#005A9C]/20 scale-102"
                    : "bg-white text-[#64748B] hover:text-[#0A192F] border-[#DBEAFE] hover:border-[#005A9C]/40 hover:bg-[#F0F7FF]"
                }`}
              >
                <span>{act.shortName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isSelected ? "bg-white/20 text-white" : "bg-[#EFF6FF] text-[#005A9C]"
                  }`}
                >
                  {act.year}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Act Detail Card */}
        <div className="bg-[#F0F7FF] rounded-3xl border border-[#DBEAFE] p-6 sm:p-10 shadow-[0_12px_40px_rgba(10,25,47,0.06)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Side: Act Deep Dive */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-[#005A9C] border border-[#DBEAFE] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#005A9C]" />
                {activeAct.weightage}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-[#64748B] border border-[#DBEAFE]">
                <BookOpen className="w-3.5 h-3.5" />
                {activeAct.icaiUnits} ICAI Syllabus Units
              </span>
            </div>

            <div>
              <h3 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-[#0A192F] mb-3">
                {activeAct.name}, {activeAct.year}
              </h3>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                {activeAct.description}
              </p>
            </div>

            {/* Key Topics Checklist */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A192F]">
                Codified Chapter Breakdown:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeAct.keyTopics.map((topic, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs sm:text-sm text-[#334155] bg-white rounded-xl p-2.5 border border-[#DBEAFE]/80 shadow-2xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#005A9C] shrink-0 mt-0.5" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Landmark Precedent Callout */}
            <div className="bg-white rounded-2xl p-4 border border-[#DBEAFE] flex items-start gap-3 shadow-2xs">
              <Scale className="w-5 h-5 text-[#005A9C] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                  Signature Case Precedent:
                </span>
                <span className="text-xs sm:text-sm font-serif font-bold text-[#0A192F]">
                  {activeAct.landmarkCase}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSampleModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 bg-[#005A9C] hover:bg-[#004F8A] text-white text-sm font-bold px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Read Free Sample Unit</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/product/course-ca-foundation-sub"
                className="inline-flex items-center justify-center gap-2 bg-white border border-[#005A9C] text-[#005A9C] hover:bg-[#EFF6FF] text-sm font-bold px-6 py-3 rounded-full transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <span>Enroll in Full Codex @ ₹99</span>
              </Link>
            </div>
          </div>

          {/* Right Side: Visual Showcase of Digital Codex Mindmap */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#DBEAFE] shadow-lg group">
              <Image
                src="/images/digital_law_codex_tablet.jpg"
                alt="Interactive Law Codex Study Experience"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 450px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-transparent to-transparent pointer-events-none" />

              {/* Floating Badge */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#005A9C]/90 backdrop-blur-md text-white border border-white/20 mb-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Watermarked DRM In-Browser Reader
                </span>
                <p className="text-xs text-white/90 line-clamp-1 font-medium">
                  Includes flowcharts, statutory definitions, and model ICAI answers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reader Modal */}
      <EnhancedSampleChapterModal
        isOpen={sampleModalOpen}
        onClose={() => setSampleModalOpen(false)}
        bookTitle={`${activeAct.name} (${activeAct.year})`}
        bookId="ca-foundation"
        bookPrice={99}
      />
    </section>
  );
}
