"use client";

import React, { useState } from "react";
import {
  Search,
  Scale,
  Sparkles,
  BookOpen,
  Gavel,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

interface SectionData {
  id: string;
  actCategory: "bns" | "bnss" | "bsa" | "cpc" | "constitution" | "corporate";
  actName: string;
  sectionCode: string;
  sectionTitle: string;
  oldProvision: string;
  newProvision: string;
  differenceHighlight: string;
  categoryRank: "A" | "B" | "C";
  frequency10Yr: number;
  ingredients: string[];
  landmarkPrecedents: { title: string; year: string; ratio: string }[];
  modelQuestionSample: {
    question: string;
    modelPointers: string[];
  };
  recommendedBookId: string;
  recommendedBookTitle: string;
  recommendedBookPrice: number;
}

const DECODER_DATABASE: SectionData[] = [
  {
    id: "bns-103",
    actCategory: "bns",
    actName: "Bharatiya Nyaya Sanhita, 2023",
    sectionCode: "Section 103",
    sectionTitle: "Punishment for Murder & Mob Lynching",
    oldProvision: "Indian Penal Code, 1860 — Section 302",
    newProvision: "BNS, 2023 — Section 103(1) & (2)",
    differenceHighlight:
      "Section 103(2) introduces a standalone statutory penalty (death or life imprisonment) for murder committed by a group of 5 or more persons acting in concert on discriminatory grounds.",
    categoryRank: "A",
    frequency10Yr: 24,
    ingredients: [
      "Actus reus: Causing the death of a human being.",
      "Mens rea: Intention of causing death or lethal bodily injury.",
      "Absence of statutory exceptions under Section 100 BNS.",
      "Sub-section (2): Concert of 5+ persons on protected grounds.",
    ],
    landmarkPrecedents: [
      {
        title: "Bachan Singh v. State of Punjab",
        year: "1980 SC",
        ratio: "Rarest of rare doctrine for capital punishment.",
      },
      {
        title: "State of Maharashtra v. Kalu Shivram",
        year: "2024 SC",
        ratio: "Application of Section 300 Clause 3 thirdly test under modern criminal jurisprudence.",
      },
    ],
    modelQuestionSample: {
      question:
        "Discuss the legislative innovation introduced under Section 103(2) of BNS, 2023. How does it strengthen prosecution in hate-motivated group homicides? (15 Marks)",
      modelPointers: [
        "1. Contrast IPC 302/34 vicarious liability vs BNS 103(2) standalone substantive offense.",
        "2. Analyze the 5 protected discrimination grounds codified in statutory text.",
        "3. Burden of proof: Joint liability without proving which specific blow caused demise.",
      ],
    },
    recommendedBookId: "judiciary-prelims",
    recommendedBookTitle: "Judiciary PCS-J Criminal Law & BNS Master Reviewer",
    recommendedBookPrice: 249,
  },
  {
    id: "bnss-173",
    actCategory: "bnss",
    actName: "Bharatiya Nagarik Suraksha Sanhita, 2023",
    sectionCode: "Section 173",
    sectionTitle: "Information in Cognizable Cases (Zero FIR & E-FIR)",
    oldProvision: "Code of Criminal Procedure, 1973 — Section 154",
    newProvision: "BNSS, 2023 — Section 173(1), (2) & (3)",
    differenceHighlight:
      "Codifies Zero FIR registration irrespective of territorial jurisdiction and Electronic FIR with a 3-day window for signing, plus a 14-day preliminary inquiry for offenses punishable by 3 to 7 years.",
    categoryRank: "A",
    frequency10Yr: 19,
    ingredients: [
      "Information given orally must be reduced into writing and signed.",
      "Electronic FIR permitted; must be signed within 3 days.",
      "Zero FIR must be transferred to the jurisdictional police station.",
      "Preliminary inquiry within 14 days for 3-7 year punishments.",
    ],
    landmarkPrecedents: [
      {
        title: "Lalita Kumari v. Govt. of U.P.",
        year: "2014 SC",
        ratio: "Mandatory registration of FIR if information discloses cognizable offence.",
      },
    ],
    modelQuestionSample: {
      question:
        "Critically evaluate the preliminary inquiry mechanism under Section 173(3) BNSS 2023 in light of Lalita Kumari guidelines. (15 Marks)",
      modelPointers: [
        "1. Examine statutory time limit of 14 days and scope of preliminary inquiry.",
        "2. Analyze safeguards against arbitrary refusal to register FIRs.",
      ],
    },
    recommendedBookId: "judiciary-prelims",
    recommendedBookTitle: "Judiciary PCS-J Criminal Procedure BNSS Reviewer",
    recommendedBookPrice: 249,
  },
  {
    id: "cpc-11",
    actCategory: "cpc",
    actName: "Code of Civil Procedure, 1908",
    sectionCode: "Section 11",
    sectionTitle: "Doctrine of Res Judicata & Constructive Bar",
    oldProvision: "Civil Procedure Code, 1908 — Section 11",
    newProvision: "Section 11 with 8 Explanations",
    differenceHighlight:
      "Bars subsequent trial of an issue directly and substantially in issue in a former suit between same parties litigating under the same title.",
    categoryRank: "A",
    frequency10Yr: 28,
    ingredients: [
      "Matter directly and substantially in issue in former suit.",
      "Same parties or parties under whom they litigate.",
      "Court of competent jurisdiction decided the issue finally.",
      "Explanation IV: Constructive Res Judicata applies to might and ought claims.",
    ],
    landmarkPrecedents: [
      {
        title: "Daryao v. State of U.P.",
        year: "1961 SC",
        ratio: "Rule of Res Judicata is founded on public policy to prevent multiplicity of proceedings.",
      },
    ],
    modelQuestionSample: {
      question:
        "Explain Constructive Res Judicata under Explanation IV to Section 11 CPC with illustrative precedents. (15 Marks)",
      modelPointers: [
        "1. Define the doctrine of might and ought.",
        "2. Explain why omission to raise ground of attack or defence in earlier suit acts as bar.",
      ],
    },
    recommendedBookId: "judiciary-mains",
    recommendedBookTitle: "Judiciary Mains Civil Procedure Master Reviewer",
    recommendedBookPrice: 349,
  },
  {
    id: "const-21",
    actCategory: "constitution",
    actName: "Constitution of India",
    sectionCode: "Article 21",
    sectionTitle: "Protection of Life and Personal Liberty",
    oldProvision: "Article 21 (Procedure Established by Law)",
    newProvision: "Article 21 (Substantive Due Process Expansion)",
    differenceHighlight:
      "Transformative jurisprudence establishing that procedure depriving liberty must be fair, just, and reasonable, incorporating privacy and dignified life.",
    categoryRank: "A",
    frequency10Yr: 32,
    ingredients: [
      "No person shall be deprived of life or liberty except by procedure established by law.",
      "Procedure must satisfy test of reasonableness under Articles 14 and 19.",
      "Extends to non-citizens within the territory of India.",
    ],
    landmarkPrecedents: [
      {
        title: "Maneka Gandhi v. Union of India",
        year: "1978 SC",
        ratio: "Procedure depriving liberty must be fair, just, and reasonable.",
      },
      {
        title: "K.S. Puttaswamy v. Union of India",
        year: "2017 SC",
        ratio: "Right to privacy is intrinsic part of Article 21.",
      },
    ],
    modelQuestionSample: {
      question:
        "Trace the evolution of Article 21 from literal interpretation to substantive due process. (15 Marks)",
      modelPointers: [
        "1. A.K. Gopalan literal interpretation vs Maneka Gandhi transformative jurisprudence.",
        "2. The Golden Triangle doctrine (Arts 14, 19, 21).",
      ],
    },
    recommendedBookId: "clat-pg",
    recommendedBookTitle: "CLAT PG Constitutional Law Master Reviewer",
    recommendedBookPrice: 299,
  },
];

export function BareActDecoderTool() {
  const [selectedId, setSelectedId] = useState<string>("bns-103");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { addToCart } = useCart();

  const filteredSections = DECODER_DATABASE.filter((item) => {
    return (
      item.sectionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sectionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.actName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const activeSection =
    DECODER_DATABASE.find((s) => s.id === selectedId) || DECODER_DATABASE[0];

  return (
    <section id="decoder-tool" className="py-8 sm:py-10 bg-[#F8FAFC] text-slate-900 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] font-serif block mb-1">
            Statutory Research Engine
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
            Bare Act &amp; Transition Decoder
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
            Select a statutory clause below to see how our reviewers deconstruct law into essential ingredients and judicial precedents.
          </p>
        </div>

        {/* 2-Column Clean Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Section Selector */}
          <div className="lg:col-span-4 space-y-2">
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search section or topic..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7]"
              />
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {filteredSections.map((sec) => {
                const isSelected = sec.id === selectedId;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setSelectedId(sec.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-white border-[#0284C7] text-slate-900 shadow-xs font-semibold"
                        : "bg-white/70 border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 text-[11px]">
                      <span className="font-mono text-[#0284C7] font-bold">{sec.sectionCode}</span>
                      <span className="text-slate-400 font-mono">{sec.frequency10Yr}x in Mains</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                      {sec.sectionTitle}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate">{sec.actName}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Breakdown Inspector Card */}
          <div className="lg:col-span-8 rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* Header of Active Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-[#0284C7] font-mono font-bold bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                    {activeSection.sectionCode}
                  </span>
                  <span className="text-xs text-slate-500">{activeSection.actName}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-serif font-black text-slate-900">
                  {activeSection.sectionTitle}
                </h3>
              </div>
            </div>

            {/* Old vs New Comparative Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Previous Law</span>
                <p className="font-semibold text-slate-800">{activeSection.oldProvision}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-200">
                <span className="text-[10px] uppercase font-bold text-[#0284C7] block mb-1">2026 Amended Provision</span>
                <p className="font-semibold text-slate-900">{activeSection.newProvision}</p>
              </div>
            </div>

            {/* Key Difference Callout */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Statutory Analysis: </strong>
              {activeSection.differenceHighlight}
            </div>

            {/* Mandatory Ingredients */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Essential Ingredients
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {activeSection.ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2"
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-[#0284C7] text-white text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-slate-700">{ing}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Landmark Precedents */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Binding Supreme Court Precedents
              </h4>
              <div className="space-y-2">
                {activeSection.landmarkPrecedents.map((prec, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs flex items-start justify-between gap-2"
                  >
                    <div>
                      <p className="font-bold text-slate-900">
                        {prec.title} <span className="text-slate-500 font-normal">({prec.year})</span>
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">{prec.ratio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clean CTA */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-slate-900">{activeSection.recommendedBookTitle}</p>
                <p className="text-[11px] text-slate-500">Includes all 400+ statutory clauses.</p>
              </div>

              <button
                onClick={() =>
                  addToCart({
                    id: activeSection.recommendedBookId,
                    title: activeSection.recommendedBookTitle,
                    format: "pdf",
                    price: activeSection.recommendedBookPrice,
                    originalPrice: activeSection.recommendedBookPrice + 150,
                    category: activeSection.actName,
                    badge: "Decoder Match",
                  })
                }
                className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
              >
                <span>Add Reviewer (₹{activeSection.recommendedBookPrice})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
