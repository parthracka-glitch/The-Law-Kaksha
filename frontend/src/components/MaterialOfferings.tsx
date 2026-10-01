"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  Layers,
  Scale,
  Gavel,
  Award,
  Eye,
  ShoppingBag,
  Sparkles,
  Zap,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { EnhancedSampleChapterModal } from "./EnhancedSampleChapterModal";

type TabKey = "judiciary" | "clat" | "corporate" | "test-series";

interface BookOffering {
  id: string;
  title: string;
  attempt: string;
  badge: string;
  volume: string;
  price: number;
  originalPrice: number;
  description: string;
  highlights: string[];
  subjects: string[];
}

export function MaterialOfferings() {
  const [activeTab, setActiveTab] = useState<TabKey>("judiciary");
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<{ id: string; title: string; price: number }>({
    id: "judiciary-prelims",
    title: "Judiciary (PCS-J) Prelims Reviewer",
    price: 249,
  });
  const { addToCart } = useCart();

  const offerings: Record<TabKey, BookOffering[]> = {
    judiciary: [
      {
        id: "judiciary-prelims",
        title: "Judiciary (PCS-J) Prelims Reviewer",
        attempt: "2026-2027 Edition",
        badge: "BNS, BNSS & BSA Ready",
        volume: "Vol. 1",
        price: 249,
        originalPrice: 399,
        description:
          "Civil & Criminal Major Acts with past 10-year question breakdown, Bare Act section index, and 3,500+ objective questions.",
        highlights: ["10-Yr High Court Solved PYQs", "Parallel BNS/BNSS Section Index", "3,500+ Objective Drills"],
        subjects: ["Constitutional Law", "BNS & BNSS 2023", "CPC & Evidence", "Contracts"],
      },
      {
        id: "judiciary-mains",
        title: "Judiciary Mains Answer Writing Reviewer",
        attempt: "2026-2027 Mains Special",
        badge: "12 State Solved Papers",
        volume: "Vol. 2",
        price: 349,
        originalPrice: 499,
        description:
          "Model subjective drafted answers, issue framing, landmark Supreme Court precedent citations, and structural answer templates.",
        highlights: ["5-Pillar Model Scoring Rubrics", "12 State Mains Solved Papers", "Landmark Precedent Bank"],
        subjects: ["Substantive Law", "Procedure & Evidence", "Judgment Writing", "Local Acts"],
      },
      {
        id: "apo-app",
        title: "Assistant Prosecution Officer (APO/APP) Reviewer",
        attempt: "2026-2027 Edition",
        badge: "Criminal Law Special",
        volume: "Vol. 3",
        price: 199,
        originalPrice: 329,
        description:
          "Specialized compiler for State Public Prosecutors with criminal law case studies, police powers, and trial procedure notes.",
        highlights: ["Trial Advocacy Practical Notes", "Police Remand & Bail Matrix", "Minor Criminal Acts"],
        subjects: ["BNSS 2023", "BNS 2023", "Trial Advocacy", "Minor Acts"],
      },
    ],
    clat: [
      {
        id: "clat-pg",
        title: "CLAT PG & LL.M Entrance Reviewer",
        attempt: "Dec'26 Exam Batch",
        badge: "Constitutional & Jurisprudence",
        volume: "Vol. 1",
        price: 299,
        originalPrice: 449,
        description:
          "Comprehensive analysis of landmark Constitutional Bench decisions, Jurisprudential theories, Criminal, and International Law.",
        highlights: ["Constitution Bench Rulings Digest", "Jurisprudential Thinker Profiles", "Passage Extract Drills"],
        subjects: ["Constitutional Law", "Jurisprudence", "Torts & Contracts", "Public Int'l Law"],
      },
      {
        id: "clat-ug",
        title: "CLAT UG Legal Reasoning Master Reviewer",
        attempt: "Dec'26 NLU Batch",
        badge: "Passage-Based Drills",
        volume: "Vol. 2",
        price: 249,
        originalPrice: 379,
        description:
          "450+ reading comprehension legal passages with deductive legal principles, factual assertions, and detailed explanatory keys.",
        highlights: ["450+ Reading Passages", "Deductive Principle Framework", "NLU Pattern Benchmark"],
        subjects: ["Legal Reasoning", "Current Legal Knowledge", "Constitution Basics", "Torts"],
      },
      {
        id: "ailet-du",
        title: "AILET & Top University LL.B Reviewer",
        attempt: "2026-2027 Batch",
        badge: "3-Yr & 5-Yr LL.B",
        volume: "Vol. 3",
        price: 229,
        originalPrice: 349,
        description:
          "All-in-one entrance compiler for NLU Delhi AILET, Delhi University (DU LL.B), and Panjab University Law entrances.",
        highlights: ["NLU Delhi AILET Solved Papers", "DU LL.B Standard Blueprint", "Legal Aptitude Modules"],
        subjects: ["Analytical Reasoning", "Legal Aptitude", "Statutory Interpretation", "General Studies"],
      },
    ],
    corporate: [
      {
        id: "ca-inter-law",
        title: "CA Inter Corporate & Other Laws Reviewer",
        attempt: "Sept'26 & Jan'27 Exams",
        badge: "Companies Act 2013",
        volume: "Paper 2",
        price: 199,
        originalPrice: 299,
        description:
          "Chapter-wise compilation of last 9 attempts (RTPs, MTPs & PYPs) for Paper 2 Law. Fully amended with MCA notifications.",
        highlights: ["9 Attempts Solved RTPs & MTPs", "MCA 2026 Circulars Integrated", "Case Study Scenario Banks"],
        subjects: ["Company Law 1-10", "Foreign Contribution (FCRA)", "General Clauses", "Statute Interpretation"],
      },
      {
        id: "ca-final-corp-law",
        title: "CA Final Economic, Corporate & Securities Laws",
        attempt: "Nov'26 & May'27",
        badge: "SEBI & IBC Coverage",
        volume: "Paper 2",
        price: 299,
        originalPrice: 429,
        description:
          "Exhaustive case-scenario compiler covering Insolvency & Bankruptcy Code 2016, FEMA 1999, SEBI Regulations, and PMLA.",
        highlights: ["IBC 2016 In-Depth Flowcharts", "SEBI Listing Regulations (LODR)", "PMLA & FEMA Practical Problems"],
        subjects: ["IBC 2016", "SEBI Regulations", "FEMA & PMLA", "Corporate Governance"],
      },
      {
        id: "cs-executive-law",
        title: "CS Executive Jurisprudence & Commercial Laws",
        attempt: "Dec'26 & June'27 ICSI",
        badge: "ICSI New Syllabus",
        volume: "Group 1",
        price: 249,
        originalPrice: 379,
        description:
          "Meticulously organized chapter-wise question bank with draft resolutions, compliance notices, and practical secretarial questions.",
        highlights: ["Draft Resolutions & Petitions", "ICSI Model Answers Comparison", "Commercial Law Summaries"],
        subjects: ["Jurisprudence", "Company Law Practice", "Setting up Business", "Commercial Laws"],
      },
    ],
    "test-series": [
      {
        id: "judiciary-test-series",
        title: "Judiciary Prelims & Mains Test Series",
        attempt: "Full 2026 Season",
        badge: "50+ Tests + Evaluation",
        volume: "Test Series",
        price: 999,
        originalPrice: 1499,
        description:
          "Realistic simulated test environment with state-specific negative marking, rank predictor, and personal Mains evaluation.",
        highlights: ["30 Full Prelims Simulators", "12 Mains Evaluated Papers", "1-on-1 Mentor Feedback"],
        subjects: ["30 Prelims Mocks", "12 Mains Full Papers", "Model Copy Comparisons", "1-on-1 Feedback"],
      },
      {
        id: "clat-pg-test-series",
        title: "CLAT PG Mock Test Series",
        attempt: "2026 Batch",
        badge: "Practice Test Series",
        volume: "Test Series",
        price: 699,
        originalPrice: 999,
        description:
          "Timed passage-based tests strictly modeled on the Consortium of NLUs official question paper blueprints.",
        highlights: ["25 Full-Length NLUs Mocks", "Consortium Pattern Passages", "Platform Percentile Rank"],
        subjects: ["25 Full-Length Tests", "Sectional Drills", "Case Law Digest", "Detailed Analysis"],
      },
      {
        id: "corporate-law-mock",
        title: "Corporate Law MCQs & Caselets Series",
        attempt: "2026 CA/CS Exams",
        badge: "Exam Simulation",
        volume: "Test Series",
        price: 399,
        originalPrice: 599,
        description:
          "1,200+ case-scenario MCQs designed to guarantee exemption in the 30-mark mandatory objective sections of CA and CS law papers.",
        highlights: ["1,200+ Scenario MCQs", "Integrated Caselet Drills", "Instant Answer Explanations"],
        subjects: ["Company Law MCQs", "SEBI Caselets", "IBC Problems", "Instant Solutions"],
      },
    ],
  };

  const openDemo = (item: BookOffering) => {
    setSelectedBook({
      id: item.id,
      title: item.title,
      price: item.price,
    });
    setDemoModalOpen(true);
  };

  const handleOrder = (item: BookOffering) => {
    addToCart({
      id: item.id,
      title: item.title,
      format: "pdf",
      price: item.price,
      originalPrice: item.originalPrice,
      category: "Curated Reviewer",
      badge: item.badge,
    });
  };

  const tabs: { key: TabKey; label: string; icon: any; count: number }[] = [
    { key: "judiciary", label: "Judiciary (PCS-J & APO)", icon: Gavel, count: 3 },
    { key: "clat", label: "CLAT UG & PG / LL.M", icon: BookOpen, count: 3 },
    { key: "corporate", label: "Corporate Law (CA / CS)", icon: Layers, count: 3 },
    { key: "test-series", label: "Mock Test Series", icon: Award, count: 3 },
  ];

  return (
    <section id="offerings" className="py-8 sm:py-10 bg-white text-slate-800 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-[11px] font-semibold text-[#0284C7] mb-2 shadow-xs">
            <Sparkles className="w-3 h-3 text-[#0284C7]" />
            <span className="uppercase tracking-wider">Curated Academic Publications</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
            The Law Kaksha <span className="text-[#0284C7]">Exam Reviewers</span>
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
            Systematic chapter-wise Bare Act solutions with 10-year past paper analysis, new criminal laws (BNS, BNSS, BSA), and model Mains answer rubrics.
          </p>
        </div>

        {/* Category Segmented Tabs */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex flex-wrap items-center justify-center p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 gap-1 shadow-xs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? "bg-white text-slate-900 font-bold shadow-xs border border-slate-200/90"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#0284C7]" : "text-slate-500"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {offerings[activeTab].map((item) => {
            const discountPct = Math.round(
              ((item.originalPrice - item.price) / item.originalPrice) * 100
            );

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between hover:border-sky-300 hover:shadow-[0_8px_26px_-6px_rgba(2,132,199,0.08)] transition-all duration-200 group relative"
              >
                <div>
                  {/* Top Badge & Edition Row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-semibold text-[#0284C7] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                      {item.badge}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.volume} • {item.attempt}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-serif font-bold text-slate-900 mb-2 leading-snug group-hover:text-[#0284C7] transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  {/* 3 Key Highlights */}
                  <div className="space-y-1.5 mb-4 py-2.5 px-3 rounded-xl bg-slate-50/80 border border-slate-100 text-slate-700">
                    {item.highlights.map((hl, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2 text-[11px]">
                        <Check className="w-3 h-3 text-[#0284C7] shrink-0" />
                        <span className="truncate">{hl}</span>
                      </div>
                    ))}
                  </div>

                  {/* Subjects pill list */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.subjects.map((sub, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100/70 text-slate-600 px-2 py-0.5 rounded border border-slate-200/60"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & Action Deck */}
                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg sm:text-xl font-black text-slate-900 font-mono">
                        ₹{item.price}
                      </span>
                      <span className="text-xs text-slate-400 line-through font-mono">
                        ₹{item.originalPrice}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                        {discountPct}% OFF
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      DRM PDF + Option for Paperback
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openDemo(item)}
                      className="p-2 rounded-xl text-slate-600 hover:text-[#0284C7] hover:bg-sky-50 transition-colors border border-slate-200 hover:border-sky-200"
                      title="Preview Sample Chapter"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOrder(item)}
                      className="px-3.5 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimal Trust Strip */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2.5 text-xs text-slate-600">
            <Zap className="w-4 h-4 text-[#0284C7] shrink-0" />
            <span>
              <strong>Instant Digital Access:</strong> Immediate PDF in student portal
            </span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2.5 text-xs text-slate-600">
            <Truck className="w-4 h-4 text-[#0284C7] shrink-0" />
            <span>
              <strong>Doorstep Delivery:</strong> 80 GSM paper with free tracking
            </span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2.5 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-[#0284C7] shrink-0" />
            <span>
              <strong>2026 Certified:</strong> BNS, BNSS &amp; BSA parallel syllabus
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Sample Reader Modal */}
      <EnhancedSampleChapterModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        bookTitle={selectedBook.title}
        bookId={selectedBook.id}
        bookPrice={selectedBook.price}
      />
    </section>
  );
}
