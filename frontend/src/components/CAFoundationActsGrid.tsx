"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  ArrowRight,
  Lock,
  Bell,
  FileText,
  Scale,
  Handshake,
  Building2,
  Landmark,
  ScrollText,
} from "lucide-react";

interface ActCardData {
  number: number;
  title: string;
  year: string;
  units: string;
  status: "ready" | "arriving" | "coming-soon";
  icon: React.ReactNode;
  description?: string;
}

const CA_ACTS: ActCardData[] = [
  {
    number: 1,
    title: "Indian Contract Act",
    year: "1872",
    units: "9 Units",
    status: "arriving",
    icon: <FileText className="w-10 h-10 text-[#005A9C]/60" />,
    description: "Offer, Acceptance, Consideration, Free Consent, Performance & Breach.",
  },
  {
    number: 2,
    title: "Sale of Goods Act",
    year: "1930",
    units: "4 Units",
    status: "ready",
    icon: <Scale className="w-10 h-10 text-[#005A9C]" />,
    description: "Contract of Sale, Conditions & Warranties, Transfer of Property, Unpaid Seller.",
  },
  {
    number: 3,
    title: "Indian Partnership Act",
    year: "1932",
    units: "3 Units",
    status: "ready",
    icon: <Handshake className="w-10 h-10 text-[#005A9C]" />,
    description: "General Nature, Relations of Partners, Registration & Dissolution.",
  },
  {
    number: 4,
    title: "Limited Liability Partnership Act",
    year: "2008",
    units: "All Units",
    status: "ready",
    icon: <Building2 className="w-10 h-10 text-[#005A9C]" />,
    description: "LLP Concept, Incorporation, Designated Partners, Conversion.",
  },
  {
    number: 5,
    title: "Companies Act",
    year: "2013",
    units: "",
    status: "coming-soon",
    icon: <Landmark className="w-10 h-10 text-[#64748B]/50" />,
    description: "Company Formation, Corporate Veil, MOA & AOA, Ultra Vires.",
  },
  {
    number: 6,
    title: "Negotiable Instruments Act",
    year: "1881",
    units: "",
    status: "coming-soon",
    icon: <ScrollText className="w-10 h-10 text-[#64748B]/50" />,
    description: "Promissory Notes, Bills of Exchange, Cheques, Section 138.",
  },
];

function StatusBadge({ status }: { status: ActCardData["status"] }) {
  if (status === "ready") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </span>
        Notes Ready
      </span>
    );
  }
  if (status === "arriving") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
        <Bell className="w-3 h-3" />
        Content Arriving
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 border border-gray-200">
      <Lock className="w-3 h-3" />
      Coming Soon
    </span>
  );
}

export function CAFoundationActsGrid() {
  return (
    <section className="py-16 bg-white" id="ca-foundation-acts">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE] mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            CA Foundation — Business Laws
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0A192F] mt-3">
            Acts in CA Foundation Business Laws
          </h2>
          <p className="mt-3 text-base text-[#64748B] max-w-2xl mx-auto">
            ICAI Paper 2 — New Scheme Syllabus. Master each Act with structured unit notes, 
            LDR flowcharts, infographics, and exam-pattern practice questions.
          </p>
        </div>

        {/* 6-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CA_ACTS.map((act) => {
            const isActive = act.status === "ready";
            const isArriving = act.status === "arriving";
            return (
              <div
                key={act.number}
                className={`relative rounded-2xl border p-5 sm:p-6 flex flex-col transition-all duration-300 ${
                  isActive
                    ? "bg-white border-[#DBEAFE] hover:border-[#005A9C] hover:shadow-lg cursor-pointer group"
                    : isArriving
                    ? "bg-[#FFFBEB]/40 border-amber-200/60"
                    : "bg-gray-50/60 border-gray-200/60"
                }`}
              >
                {/* Number Badge */}
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      isActive
                        ? "bg-[#005A9C] text-white"
                        : isArriving
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {act.number}
                  </span>
                  <StatusBadge status={act.status} />
                </div>

                {/* Title & Year */}
                <h3
                  className={`text-lg font-serif font-bold mb-0.5 ${
                    isActive ? "text-[#0A192F]" : "text-[#64748B]"
                  }`}
                >
                  {act.title}
                  {act.year && <span className="text-[#94A3B8]">, {act.year}</span>}
                </h3>

                {/* Units count */}
                {act.units && (
                  <p className={`text-sm font-medium mt-1 ${isActive ? "text-[#005A9C]" : "text-[#94A3B8]"}`}>
                    {act.units}
                  </p>
                )}

                {/* Description */}
                <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed flex-1">
                  {act.description}
                </p>

                {/* Icon */}
                <div className="flex items-end justify-between mt-4">
                  <div className="opacity-60">{act.icon}</div>
                  {isActive ? (
                    <Link
                      href="/courses"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full bg-[#005A9C] text-white hover:bg-[#004F8A] transition-all duration-200 active:scale-95 shadow-sm"
                    >
                      Explore <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full bg-gray-100 text-gray-400 border border-gray-200 cursor-default">
                      {act.status === "arriving" ? "Coming Soon" : "Coming Soon"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Question Bank CTA Banner */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-[#EFF6FF] to-[#F0F7FF] border border-[#DBEAFE] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#0A192F]">
              📖 Master Question Bank — Part 1 & Part 2
            </h3>
            <p className="text-sm text-[#64748B] mt-1">
              Comprehensive exam-pattern practice covering all Acts. Sample previews available for free.
            </p>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-full bg-[#005A9C] text-white hover:bg-[#004F8A] transition-all duration-200 active:scale-95 shadow-sm whitespace-nowrap"
          >
            View Question Banks <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
