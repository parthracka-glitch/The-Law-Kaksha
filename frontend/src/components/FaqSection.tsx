"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is included in the ₹99/month CA Foundation & CSEET subscription?",
      a: "The ₹99/month subscription gives you complete access to all 7 ICAI CA Foundation Business Laws chapters or all 8 ICSI CSEET units, comprehensive simplified PDF notes, weekly case studies, weekly 30-question MCQ tests, and 1.5-day LDR quick revision flowcharts.",
    },
    {
      q: "Where can I find the free sample notes for Indian Partnership Act, 1932?",
      a: "You can download all 3 sample unit PDFs (Unit 1: General Nature of Partnership, Unit 2: Relations of Partners, Unit 3: Registration and Dissolution of Firm) directly in the free sample preview modal or under the Notes section in the student dashboard.",
    },
    {
      q: "What are the Weekly 3 Case Studies for CA Foundation?",
      a: "Every week, CA Foundation students receive 3 high-yield practical case studies: Monster Monday (complex application), Midweek Law Madness (statutory trick questions), and Final Boss Friday (exam-standard simulation) with step-by-step model answers.",
    },
    {
      q: "How do the CSEET Weekly 30-Question MCQ Tests work?",
      a: "CSEET students get a real-time timed test every week covering the 8 ICSI units (Business Laws & Management) with instant score calculation, question-by-question explanations, and platform leaderboard ranking.",
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faqs" className="py-12 sm:py-16 bg-white text-[#0A192F]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#005A9C] block mb-2">
            Answers &amp; Clarity
          </span>
          <h2 className="text-2xl sm:text-4xl font-semibold text-[#0A192F] tracking-tight font-serif">
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
                    ? "border-[#005A9C] bg-[#F0F7FF] shadow-xs"
                    : "border-[#DBEAFE] bg-white hover:border-[#005A9C]"
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left font-semibold text-sm text-[#0A192F] cursor-pointer min-h-[52px]"
                  aria-expanded={isOpen}
                >
                  <span className="leading-snug">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#64748B] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#005A9C]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#64748B] leading-relaxed border-t border-[#DBEAFE] animate-in fade-in duration-200">
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
