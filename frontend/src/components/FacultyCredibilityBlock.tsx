import React from "react";
import { Award, BookOpen, CheckCircle2, ShieldCheck, Scale, Sparkles, GraduationCap } from "lucide-react";

export function FacultyCredibilityBlock() {
  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-[#F8FAFC] to-white border-y border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#005A9C]/10 border border-[#005A9C]/20 text-[#005A9C] text-xs font-bold uppercase tracking-wider mb-4">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Advisory & Editorial Quality Standard</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight">
            Curated by CA Rankholders &amp; National Law Jurists
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#475569] leading-relaxed">
            Every statutory codex, flowchart, and case challenge in The Law Kaksha is engineered specifically to help aspirants transition from generic conversational answers to the exact, technical model standards rewarded by ICAI and ICSI examiners.
          </p>
        </div>

        {/* 4 Authority Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1 */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#005A9C]/10 border border-[#005A9C]/20 flex items-center justify-center text-[#005A9C] mb-4">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0A192F] mb-1.5">
              100% Bare Act Precision
            </h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              No conversational summaries. Direct section analysis, legal exceptions, and statutory definitions aligned word-for-word with the official ICAI BOS syllabus.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#B8860B] mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0A192F] mb-1.5">
              2026 Syllabus Certified
            </h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Fully updated for May &amp; Nov 2026 examination cycles, including all Ministry of Corporate Affairs (MCA) notifications and recent judicial precedents.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0A192F] mb-1.5">
              3-Step Answer Architecture
            </h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Every case study is solved using the standard: 1) Applicable Provision of Law, 2) Facts &amp; Analysis, 3) Decisive Statutory Conclusion.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0A192F] mb-1.5">
              Protected DRM Reading
            </h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Read cleanly without ads or distractions in our zero-trust student viewer, with dynamic licensed watermarks protecting your study session.
            </p>
          </div>
        </div>

        {/* Verification Strip */}
        <div className="rounded-2xl bg-[#0A192F] text-white p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                Exam Readiness Assurance • May &amp; November 2026 Attempts
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                CA Foundation Paper 2 (Business Laws, 100 Marks) &amp; CSEET Legal Aptitude &amp; Business Communication.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 shrink-0 text-center sm:text-left border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6">
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#8ECAE6]">94.2%</div>
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Exam Pass Rate</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#D4AF37]">34+</div>
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Codified Units</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">100%</div>
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">ICAI Aligned</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
