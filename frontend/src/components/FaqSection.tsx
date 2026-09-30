"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What makes The Law Kaksha CA Reviewers different from ordinary exam scanners?",
      a: "The Law Kaksha organizes questions strictly chapter-by-chapter rather than chronological heaps. Each chapter begins with an executive section matrix, ABC weightage category tags, 9 attempts of solved RTPs, MTPs & Suggested Answers, and structured 3-step descriptive answer templates (Provision, Analysis, Conclusion) matching ICAI examiner guidelines.",
    },
    {
      q: "Are the materials updated for the ICAI New Scheme (2026-2027 Exams)?",
      a: "Yes, 100%. All our CA Foundation (Business Laws), CA Intermediate (Paper 2 Corporate & Other Laws), and CA Final (Corporate & Economic Laws) materials are fully compliant with the latest ICAI New Scheme, incorporating recent MCA notifications, CSR Section 135 amendments, and updated IBC/SEBI regulations.",
    },
    {
      q: "How does The Law Kaksha help in scoring 30/30 in the mandatory Case-Scenario MCQs?",
      a: "Volume 1 contains over 1,200+ case scenario and analytical MCQs designed strictly on the ICAI pattern. Each question features detailed statutory rationale and reasoning so you never get trapped by subtle examiner distractors.",
    },
    {
      q: "How quickly do I receive my 2-Volume Books and Course video lectures?",
      a: "Digital PDF access and video lectures activate immediately on your CA Student Portal upon checkout. Physical 2-Volume Deluxe Box Sets are packed in protective weatherproof boxing and dispatched via express air courier with live AWB tracking within 24 hours, typically reaching your address within 2-4 business days across India.",
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faqs" className="py-12 sm:py-16 bg-white text-[#1D1D1F] border-b border-black/[0.05]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3] block mb-2">
            Answers &amp; Clarity
          </span>
          <h2 className="text-2xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion Items */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 ${
                  isOpen
                    ? "border-black/[0.12] bg-[#FBFBFD] shadow-xs"
                    : "border-black/[0.06] bg-white hover:border-black/[0.12]"
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left font-semibold text-xs sm:text-sm text-[#1D1D1F] cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="leading-snug">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#86868B] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#0071E3]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#6E6E73] leading-relaxed border-t border-black/[0.04] animate-in fade-in duration-200">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
