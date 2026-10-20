"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Scale,
  Award,
  ArrowRight,
  Eye,
} from "lucide-react";
import { SecurePdfReader } from "./SecurePdfReader";

interface SampleResource {
  id: string;
  part: string;
  badge: string;
  title: string;
  subtitle: string;
  actName: string;
  description: string;
  highlights: string[];
  pages: string;
  fileSize: string;
  fileName: string;
  pdfUrl: string;
  downloadUrl: string;
  gradientTheme: string;
  borderTheme: string;
  accentBadge: string;
  pillColor: string;
}

const SAMPLE_RESOURCES: SampleResource[] = [
  {
    id: "sample-qb-part1",
    part: "PART 1",
    badge: "FREE SAMPLE COPY",
    title: "Smart Revision Question Bank — Part 1",
    subtitle: "The Indian Contract Act, 1872 (Units 1 - 9)",
    actName: "The Indian Contract Act, 1872",
    description:
      "Official free sample covering the largest chapter of CA Foundation Paper 2. Experience our three-step answer framework (Provision → Application → Conclusion) with solved exam questions.",
    highlights: [
      "Complete Unit 2: Consideration (Sections 2(d) & 25, Privity of Contract and statutory exceptions)",
      "Part Unit 9: Agency (Sections 182-238, Irrevocable Agency Sec 202, Sub-agent vs Substituted agent)",
      "Examiner-Tested Framework: Model answers written strictly in Provision → Application → Conclusion",
      "Recent Examination Questions: Solved questions with official mark allocations (May & Sept 2026)",
    ],
    pages: "30 Pages",
    fileSize: "932 KB",
    fileName: "Question Bank Part 1- Sample Copy.pdf",
    pdfUrl: "/samples/Question Bank Part 1- Sample Copy.pdf",
    downloadUrl: "/samples/Question-Bank-Part-1-Sample.pdf",
    gradientTheme: "from-[#F0F7FF] via-white to-white",
    borderTheme: "border-[#BAE6FD] hover:border-[#005A9C]",
    accentBadge: "bg-[#EFF6FF] text-[#005A9C] border-[#BFDBFE]",
    pillColor: "bg-[#005A9C] text-white",
  },
  {
    id: "sample-qb-part2",
    part: "PART 2",
    badge: "FREE SAMPLE COPY",
    title: "Smart Revision Question Bank — Part 2",
    subtitle: "Rest of the Acts (SOGA, Partnership, LLP, Companies, N.I. Act)",
    actName: "Commercial & Corporate Enactments",
    description:
      "24 hand-picked case studies, two from every unit across all remaining Business Laws enactments, with complete step-by-step model answers matching latest exam patterns.",
    highlights: [
      "24 Hand-Picked Case Studies: Two comprehensive problems from every single statutory unit",
      "All 6 Syllabi Chapters: Indian Regulatory Framework, SOGA 1930, Partnership 1932, LLP 2008, Companies Act 2013, N.I. Act 1881",
      "Examiner Trend Mapped: Tailored to fact-pattern comprehension tested in recent ICAI exam papers",
      "Unpaid Seller, Caveat Emptor, Sub-Partner, Section 138 Dishonour & Small Company Limits",
    ],
    pages: "43 Pages",
    fileSize: "5.7 MB",
    fileName: "Part 2_Sample Copy.pdf",
    pdfUrl: "/samples/Part 2_Sample Copy.pdf",
    downloadUrl: "/samples/Question-Bank-Part-2-Sample.pdf",
    gradientTheme: "from-[#F8FAFC] via-white to-white",
    borderTheme: "border-[#CBD5E1] hover:border-[#0284C7]",
    accentBadge: "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]",
    pillColor: "bg-[#0284C7] text-white",
  },
];

export function FreeResourceModule() {
  const [activeReader, setActiveReader] = useState<{
    isOpen: boolean;
    pdfUrl: string;
    title: string;
  }>({
    isOpen: false,
    pdfUrl: "",
    title: "",
  });

  const handleOpenReader = (resource: SampleResource) => {
    setActiveReader({
      isOpen: true,
      pdfUrl: resource.pdfUrl,
      title: resource.title,
    });
  };

  return (
    <section
      id="free-resources"
      className="py-16 sm:py-20 bg-gradient-to-b from-[#F0F7FF] via-white to-[#F8FAFC] border-y border-[#DBEAFE] relative overflow-hidden"
    >
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#DBEAFE]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#EFF6FF]/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Module Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#005A9C] border border-[#BFDBFE] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#005A9C]" />
            <span>100% Free Resources • No Login Required</span>
          </div>

          <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-[#0A192F] tracking-tight leading-[1.15]">
            Official Free Sample Question Banks
          </h2>

          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
            CA Foundation Paper 2: Business Laws. Preview the exact question bank format, case study fact patterns, and the 3-step <strong className="text-[#0A192F] font-semibold">Provision → Application → Conclusion</strong> framework before you subscribe.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-[#475569]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              Direct Soft Copy PDF
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              In-Browser DRM Reader
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              ICAI Examination Standard
            </span>
          </div>
        </div>

        {/* Two Sample Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {SAMPLE_RESOURCES.map((resource) => (
            <div
              key={resource.id}
              className={`rounded-3xl border-2 ${resource.borderTheme} bg-gradient-to-br ${resource.gradientTheme} p-6 sm:p-8 shadow-[0_10px_35px_rgba(10,25,47,0.06)] hover:shadow-[0_16px_48px_rgba(0,90,156,0.12)] transition-all duration-300 flex flex-col justify-between group relative`}
            >
              <div className="space-y-6">
                
                {/* Header row with badges */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-black tracking-wider px-3 py-1 rounded-full ${resource.pillColor}`}>
                      {resource.part}
                    </span>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border shadow-2xs ${resource.accentBadge}`}>
                      {resource.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-[#64748B] bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-200">
                    <FileText className="w-3.5 h-3.5 text-[#005A9C]" />
                    <span>{resource.pages}</span>
                    <span className="text-slate-300">•</span>
                    <span>{resource.fileSize}</span>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#005A9C] block mb-1">
                    {resource.actName}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#0A192F] group-hover:text-[#005A9C] transition-colors leading-snug">
                    {resource.title}
                  </h3>
                  <p className="text-sm font-semibold text-[#475569] mt-1.5">
                    {resource.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-3 leading-relaxed">
                    {resource.description}
                  </p>
                </div>

                {/* Key Syllabus Highlights */}
                <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A192F] flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#005A9C]" />
                    What&apos;s Included In This Free Sample:
                  </h4>
                  <ul className="space-y-2 text-xs text-[#334155] leading-relaxed">
                    {resource.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-6 border-t border-slate-200/70 space-y-3">
                {/* Primary CTA: Open Interactive Reader */}
                <button
                  type="button"
                  onClick={() => handleOpenReader(resource)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#005A9C] hover:bg-[#004F8A] text-white font-bold text-sm px-6 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read Sample In-Browser</span>
                </button>

                <div className="flex items-center justify-between text-[11px] text-[#64748B] px-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#005A9C]" />
                    <span>Instant reader with zoom &amp; dark mode</span>
                  </span>
                  <Link
                    href={`/reader?file=${encodeURIComponent(resource.fileName)}&title=${encodeURIComponent(resource.title)}&sample=true`}
                    className="text-[#005A9C] hover:underline font-bold flex items-center gap-0.5"
                  >
                    <span>Dedicated Reader Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner with Full Subscription Upsell */}
        <div className="mt-12 bg-white rounded-3xl border border-[#DBEAFE] p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#005A9C] flex items-center justify-center md:justify-start gap-1.5">
              <Scale className="w-4 h-4 text-[#005A9C]" />
              Need The Complete Question Bank?
            </span>
            <h4 className="text-xl sm:text-2xl font-serif font-black text-[#0A192F]">
              Unlock All 9 Contract Act Units &amp; 70+ Case Studies
            </h4>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-xl">
              Get full access to all CA Foundation Paper 2 questions, exhaustive descriptive models, and timed mock simulators starting at just ₹99.
            </p>
          </div>

          <Link
            href="/#pricing"
            className="inline-flex items-center justify-center gap-2 bg-[#005A9C] hover:bg-[#004F8A] text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer shrink-0"
          >
            <span>Unlock Full Question Bank @ ₹99</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>

      {/* Interactive DRM In-Browser Reader Modal */}
      <SecurePdfReader
        isOpen={activeReader.isOpen}
        onClose={() => setActiveReader({ isOpen: false, pdfUrl: "", title: "" })}
        pdfUrl={activeReader.pdfUrl}
        title={activeReader.title}
        isPurchased={true}
        studentName="CA Foundation Student"
        studentRoll="LK-FREE-SAMPLE"
        price={99}
      />
    </section>
  );
}
