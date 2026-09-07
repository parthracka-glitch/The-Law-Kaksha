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
    <section id="faqs" className="py-8 sm:py-10 bg-white text-slate-800 border-b border-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] font-serif block mb-1">
            Answers &amp; Clarity
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
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
                className={`rounded-xl border transition-all ${
                  isOpen
                    ? "border-sky-300 bg-sky-50/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between gap-4 p-4 text-left font-serif font-bold text-xs sm:text-sm text-slate-900"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#0284C7]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100/80 animate-in fade-in duration-150">
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
