"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Scale,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  ShieldCheck,
  Compass,
  FileText,
  Target,
  Zap,
  Quote,
  Flame,
} from "lucide-react";

export function AboutInteractiveView() {
  // State for the 3 Imperatives interactive tab
  const [activePillar, setActivePillar] = useState<"learn" | "practise" | "excel">("learn");

  // State for the 3-step live answering framework simulator
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  const pillars = [
    {
      id: "learn" as const,
      tag: "PILLAR 1",
      title: "Learn with Clarity",
      shortTitle: "1. Learn",
      subtitle: "Beyond Surface-Level Reading",
      icon: Compass,
      dilemma: "Students read chapters like the Contract Act and feel confident because concepts like 'Offer' and 'Acceptance' seem easy. But surface familiarity evaporates the moment a complex dispute is set instead of a plain definition.",
      solution: "We unpack every statutory section with exact constituent elements, judicial interpretations, and real commercial contexts so you understand not just what the law says, but why it exists.",
      keyInsight: "Readability can be deceptively dangerous. Conceptual mastery requires testing provisions against real situations.",
      color: "from-blue-500/10 to-indigo-500/10",
      accent: "text-[#005A9C]",
      border: "border-[#BFDBFE]",
    },
    {
      id: "practise" as const,
      tag: "PILLAR 2",
      title: "Practise with Purpose",
      shortTitle: "2. Practise",
      subtitle: "High-Yield Fact-Pattern Analysis",
      icon: Target,
      dilemma: "Candidates often jump from reading the bare act to attempting mock tests without deliberate practice in fact extraction—leaving them unable to identify which specific section governs the case problem.",
      solution: "Our question bank provides chapter-wise application case studies with named parties, precise dates, and deliberate examiner traps to train your legal reasoning instincts under timed conditions.",
      keyInsight: "The recent May & September papers test fact comprehension: identifying the hidden crux behind 15 lines of narrative.",
      color: "from-emerald-500/10 to-teal-500/10",
      accent: "text-emerald-700",
      border: "border-emerald-200",
    },
    {
      id: "excel" as const,
      tag: "PILLAR 3",
      title: "Excel with Structure",
      shortTitle: "3. Excel",
      subtitle: "The 3-Step Scoring Blueprint",
      icon: Award,
      dilemma: "Most marks in Business Laws are lost not from lack of legal knowledge, but from unstructured drafting. Writing conclusions without legal provisions, or quoting sections without mapping facts, guarantees lost step marks.",
      solution: "Every suggested answer in our question bank strictly follows the three-step format: Provision → Application → Conclusion. This mirrors how ICAI examiners actually award marks on evaluation sheets.",
      keyInsight: "A correct conclusion without the provision earns almost nothing. Writing in this 3-step order is the fastest way to +20 marks.",
      color: "from-purple-500/10 to-pink-500/10",
      accent: "text-purple-700",
      border: "border-purple-200",
    },
  ];

  const currentPillar = pillars.find((p) => p.id === activePillar) || pillars[0];

  return (
    <div className="space-y-16 sm:space-y-24 py-8">
      
      {/* ========================================================================= */}
      {/* 1. HERO HEADER WITH EDITORIAL DEPTH                                       */}
      {/* ========================================================================= */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#005A9C] border border-[#BFDBFE] shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#005A9C]" />
          <span>The Law कक्षा • Jurisprudence &amp; Pedagogy</span>
        </div>

        <h1 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-[#0A192F] tracking-tight leading-[1.12]">
          Because learning the law is not just knowing what a provision says.
          <span className="block mt-2 bg-gradient-to-r from-[#005A9C] via-[#0284C7] to-[#0A192F] bg-clip-text text-transparent">
            It is about understanding when, why and how it applies.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-[#64748B] max-w-2xl mx-auto leading-relaxed font-normal">
          The Law Kaksha was founded on a singular conviction: true examination preparation begins when conceptual understanding meets disciplined application.
        </p>

        {/* Core Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 max-w-3xl mx-auto">
          {[
            { value: "100%", label: "ICAI New Scheme Aligned", sub: "Paper 2 Business Laws" },
            { value: "3-Step", label: "Answer Writing Engine", sub: "Provision → App → Conclusion" },
            { value: "200+", label: "Solved Case Problems", sub: "With Exact Mark Split" },
            { value: "0 Fluff", label: "Statutory Precision", sub: "Exam-First Methodology" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/90 backdrop-blur-xs rounded-2xl p-3.5 sm:p-4 border border-[#DBEAFE] shadow-2xs hover:shadow-md transition-all duration-300 text-center space-y-1 hover:-translate-y-0.5"
            >
              <div className="font-serif font-black text-xl sm:text-2xl text-[#005A9C]">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-[#0A192F] leading-tight">
                {stat.label}
              </div>
              <div className="text-[10px] text-[#64748B] truncate">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE THREE IMPERATIVES (INTERACTIVE TABS)                              */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-3xl border border-[#DBEAFE] p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#005A9C] flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-[#005A9C]" />
            The Three Imperatives of Legal Preparation
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#0A192F]">
            The Law Kaksha Educational Method
          </h2>
          <p className="text-sm text-[#64748B]">
            Click through the three pillars to see how we bridge the gap between reading bare provisions and scoring in the examination hall.
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-1.5 bg-[#F0F7FF] rounded-2xl border border-[#DBEAFE] mb-8">
          {pillars.map((p) => {
            const Icon = p.icon;
            const isActive = activePillar === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePillar(p.id)}
                className={`flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer active:scale-95 ${
                  isActive
                    ? "bg-[#005A9C] text-white shadow-md"
                    : "bg-transparent text-[#334155] hover:bg-white hover:text-[#005A9C]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{p.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Card (Interactive Depth) */}
        <div className={`rounded-2xl border-2 ${currentPillar.border} bg-gradient-to-br ${currentPillar.color} p-6 sm:p-8 space-y-6 transition-all duration-300`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
            <div>
              <span className={`text-[11px] font-black tracking-wider uppercase ${currentPillar.accent}`}>
                {currentPillar.tag}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0A192F]">
                {currentPillar.title}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#475569]">
                {currentPillar.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-[#0A192F]">
              <Sparkles className="w-3.5 h-3.5 text-[#005A9C]" />
              <span>Core Methodology</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Common Trap */}
            <div className="bg-white/90 rounded-2xl p-5 border border-red-100 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                The Common Student Trap
              </span>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                {currentPillar.dilemma}
              </p>
            </div>

            {/* The Law Kaksha Solution */}
            <div className="bg-white/90 rounded-2xl p-5 border border-emerald-100 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                The Law Kaksha Approach
              </span>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                {currentPillar.solution}
              </p>
            </div>
          </div>

          {/* Bottom Highlight Callout */}
          <div className="p-4 rounded-xl bg-white/80 border border-slate-200 flex items-center gap-3">
            <Zap className="w-5 h-5 text-[#005A9C] shrink-0" />
            <p className="text-xs font-semibold text-[#0A192F]">
              <strong>Examiner Insight:</strong> {currentPillar.keyInsight}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE 3-STEP ANSWER WRITING WORKBENCH                           */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-br from-[#0A192F] via-[#0E2749] to-[#0A192F] text-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#005A9C]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7DD3FC] flex items-center justify-center gap-1.5">
              <Award className="w-4 h-4 text-[#7DD3FC]" />
              Live Interactive Answering Simulator
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight">
              The Provision → Application → Conclusion Framework
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Interactive demonstration of how marks are awarded by ICAI evaluators. Click each step to see how a model answer is structured.
            </p>
          </div>

          {/* Fact Pattern Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/15 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#93C5FD]">
              <span>SAMPLE CASE SCENARIO (Section 25 / Privity of Contract)</span>
              <span>ICAI 6-Mark Problem</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif italic">
              &quot;Smt. Radhabai gifted landed property to her daughter Sushila directing her to pay ₹12,000 annual annuity to Radhabai&apos;s sister Vimal. Sushila signed an agreement with Vimal to pay the annuity, but stopped after two years claiming Vimal gave no consideration. Can Vimal recover the annuity?&quot;
            </p>
          </div>

          {/* Interactive Step Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { num: 1 as const, title: "Step 1: The Provision", score: "+2.5 Marks", desc: "Statutory section & legal doctrine" },
              { num: 2 as const, title: "Step 2: The Application", score: "+2.0 Marks", desc: "Mapping law to the named parties" },
              { num: 3 as const, title: "Step 3: The Conclusion", score: "+1.5 Marks", desc: "Direct answer to the question asked" },
            ].map((step) => (
              <button
                key={step.num}
                type="button"
                onClick={() => setActiveStep(step.num)}
                className={`p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                  activeStep === step.num
                    ? "bg-[#005A9C] border-white/40 shadow-lg scale-[1.02]"
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {step.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    {step.score}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {step.desc}
                </p>
              </button>
            ))}
          </div>

          {/* Display for Active Step */}
          <div className="bg-white text-[#0A192F] rounded-2xl p-6 sm:p-8 space-y-4 shadow-lg animate-in fade-in duration-200">
            {activeStep === 1 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#005A9C] font-mono">
                    Step 1: The Governing Provision [Section 2(d)]
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Statutory Foundation
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                  Under Section 2(d) of the Indian Contract Act, 1872, consideration may move from the promisee <em>&quot;or any other person&quot;</em>. In India, a stranger to consideration can sue. In <strong>Chinnayya v. Ramayya (1882)</strong>, it was held that consideration need not move from the beneficiary herself if consideration has moved from a third party under a family arrangement.
                </p>
                <div className="text-[11px] text-[#64748B] bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  ⚠️ <strong>Examiner Note:</strong> Citing the section number with the landmark case law establishes immediate statutory credibility with the paper evaluator.
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#005A9C] font-mono">
                    Step 2: Fact Application &amp; Party Mapping
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Factual Synthesis
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                  Consideration for Sushila&apos;s promise to pay annuity moved from Radhabai in the form of gifted landed property. Vimal is a stranger to consideration, but Sushila executed a written undertaking in Vimal&apos;s favour pursuant to the family arrangement. Therefore, the requirement of lawful consideration under Section 2(d) is fully satisfied.
                </p>
                <div className="text-[11px] text-[#64748B] bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  ⚠️ <strong>Examiner Note:</strong> You must explicitly name the parties (Sushila, Radhabai, Vimal). Generic summaries without mapping party names lose up to 50% of application marks.
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#005A9C] font-mono">
                    Step 3: Clear Legal Conclusion
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Definitive Judgment
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[#0A192F] leading-relaxed bg-[#F0FDF4] p-3 rounded-xl border border-[#BBF7D0]">
                  Vimal is legally entitled to recover the annuity of ₹12,000 per year from Sushila. Sushila&apos;s contention that Vimal was a stranger to the consideration is untenable in law.
                </p>
                <div className="text-[11px] text-[#64748B] bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  ⚠️ <strong>Examiner Note:</strong> State the final answer unequivocally. Avoid ambiguous phrases like &quot;maybe&quot; or &quot;depends&quot; unless specifically asked for multiple alternatives.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE FOUNDATIONAL BELIEF & ORIGIN STORY                                */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-3xl border border-[#DBEAFE] p-6 sm:p-12 shadow-sm space-y-8">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#005A9C]">
            The Origin Story
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#0A192F]">
            The Layer Above The Floor
          </h2>
        </div>

        {/* Editorial Quote Card */}
        <div className="relative p-6 sm:p-8 rounded-2xl bg-[#F0F7FF] border border-[#DBEAFE] space-y-4">
          <Quote className="w-10 h-10 text-[#005A9C]/20 absolute top-4 right-4 pointer-events-none" />
          <p className="text-sm sm:text-base font-serif italic text-[#1E293B] leading-relaxed">
            &quot;Nothing here replaces the ICAI Study Material, or the RTPs, MTPs, and past papers that remain the floor of preparation. What this book adds is the layer above that floor: fact comprehension and structured application, reading a set of facts accurately, and applying the right provision to them. That is what recent papers have shifted toward testing, and it is what most students are still not prepared for.&quot;
          </p>
          <div className="text-xs font-bold text-[#005A9C] font-mono">
            — Preface, The Law Kaksha Smart Revision Question Bank
          </div>
        </div>

        {/* Academic Principles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {[
            {
              title: "Bare Act Fidelity",
              desc: "Every section is stated strictly in the language of the Act. No watered-down simplifications that fail under evaluation.",
              icon: Scale,
            },
            {
              title: "Application-First",
              desc: "Problems mirror real examiner drafts: named parties, dates, and commercial scenarios rather than repetitive theory.",
              icon: Target,
            },
            {
              title: "3-Step Marking Grid",
              desc: "All solutions are labelled Provision → Application → Conclusion so students master scoring discipline.",
              icon: FileText,
            },
            {
              title: "In-Browser Study Vault",
              desc: "Instant single-device watermarked reading vault with continuous scrolling, dark mode, and zero download hassle.",
              icon: ShieldCheck,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 hover:border-[#005A9C] hover:bg-white hover:shadow-md transition-all duration-300 space-y-2 group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#005A9C] flex items-center justify-center group-hover:bg-[#005A9C] group-hover:text-white transition-colors shadow-2xs">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-[#0A192F]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CALL TO ACTION: SAMPLE RESOURCES & SUBSCRIPTIONS                       */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-br from-[#EFF6FF] via-white to-[#F0F7FF] rounded-3xl border-2 border-[#BFDBFE] p-8 sm:p-12 text-center space-y-6 shadow-md">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-[#005A9C] border border-[#BFDBFE] shadow-2xs mx-auto">
          <Flame className="w-3.5 h-3.5 text-[#005A9C]" />
          <span>Begin Your Preparation With Purpose</span>
        </div>

        <h2 className="font-serif font-black text-2xl sm:text-4xl text-[#0A192F] max-w-2xl mx-auto leading-tight">
          Experience The Law Kaksha Difference First-Hand
        </h2>

        <p className="text-sm sm:text-base text-[#64748B] max-w-xl mx-auto leading-relaxed">
          Read our free 30-page &amp; 43-page Smart Revision Question Bank sample codices directly in your browser without any commitment.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link
            href="/#free-resources"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#005A9C] hover:bg-[#004F8A] text-white text-sm font-bold px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer min-h-[48px]"
          >
            <BookOpen className="w-4 h-4" />
            <span>Read Free Sample Question Banks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/courses"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border-2 border-[#005A9C] text-[#005A9C] hover:bg-[#F0F7FF] text-sm font-bold px-7 py-3 rounded-full transition-all duration-200 active:scale-95 cursor-pointer min-h-[48px]"
          >
            <span>Explore All Passes @ ₹99</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
