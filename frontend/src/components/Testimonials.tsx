"use client";

import { Star, Sparkles, CheckCircle } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Rohan V.",
      rank: "88 Marks in Business Laws • CA Foundation",
      tag: "CA Foundation",
      verifiedBadge: "88 Marks in Law",
      content:
        "The step-by-step case study decoding for Indian Contract Act and Sale of Goods Act is brilliant. The 3 weekly case studies taught me exactly how ICAI evaluators award marks for relevant provisions, facts, and conclusions.",
    },
    {
      name: "Pooja S.",
      rank: "CSEET Cleared • 1st Attempt",
      tag: "CSEET Exam",
      verifiedBadge: "CSEET Passed",
      content:
        "The weekly 30-question MCQ tests with instant scoring and detailed explanations made Business Law and Principles of Management my strongest section. The notes are crisp and exam-focused.",
    },
    {
      name: "Ananya M.",
      rank: "84 Marks in Paper 2 • CA Foundation",
      tag: "CA Foundation",
      verifiedBadge: "Exemption in Law",
      content:
        "The Partnership Act 3-unit notes and Section 16(1) Caveat Emptor model answers made all the difference. I was able to revise the entire 7 chapters in 1.5 days using the LDR bookmarks.",
    },
    {
      name: "Karan D.",
      rank: "CSEET Law & Mgt Student",
      tag: "CSEET Law & Mgt",
      verifiedBadge: "High Distinction",
      content:
        "The chapter-wise MCQ bank and visual summary flowcharts for Negotiable Instruments Act and Companies Act overview helped me recall provisions instantly during the exam.",
    },
  ];

  // Duplicate for seamless infinite marquee scroll loop
  const scrollList = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-12 sm:py-16 bg-[#FBFBFD] text-[#1D1D1F] border-b border-black/[0.05] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F5F5F7] border border-black/[0.06] text-xs font-medium text-[#1D1D1F] mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>Student Success Stories</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
            Trusted by <span className="text-[#0071E3]">CA &amp; CS Aspirants</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
            Real feedback from CA Foundation &amp; CSEET students who mastered law papers through our simplified notes.
          </p>
        </div>
      </div>

      {/* Infinite Auto-Scrolling Carousel Track Container */}
      <div className="relative w-full overflow-hidden py-2">
        {/* Left & Right Smooth Gradient Masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

        {/* Continuous Auto-Scrolling Row */}
        <div className="flex gap-5 animate-marquee hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing w-max">
          {scrollList.map((t, idx) => (
            <div
              key={idx}
              className="w-[310px] sm:w-[370px] rounded-3xl bg-white border border-black/[0.08] p-6 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:border-black/[0.16] transition-all duration-300 shrink-0 select-none group"
            >
              <div>
                {/* Rating & Tag Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-medium text-[#0071E3] bg-[#0071E3]/[0.08] px-2.5 py-0.5 rounded-full border border-[#0071E3]/15">
                    {t.tag}
                  </span>
                </div>

                {/* Testimonial Quote */}
                <p className="text-xs text-[#424245] leading-relaxed mb-6 italic">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              {/* Author & Verification Footer */}
              <div className="pt-4 border-t border-black/[0.05] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-[#86868B]">{t.rank}</p>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>{t.verifiedBadge}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auto-scroll Hint & Stat strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 flex items-center justify-center gap-4 text-[11px] text-[#86868B]">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3] animate-pulse"></span>
          Auto-scrolling live testimonials (Hover to pause)
        </span>
      </div>
    </section>
  );
}
