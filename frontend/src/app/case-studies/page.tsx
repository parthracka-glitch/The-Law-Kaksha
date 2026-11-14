"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { apiRequest } from "@/lib/api";
import {
  BookOpen,
  Search,
  Scale,
  ChevronRight,
  GraduationCap,
  Sparkles,
  FileText,
} from "lucide-react";

interface CaseStudyItem {
  id: string;
  slug: string;
  title: string;
  subject: string;
  summary: string;
  badge?: string;
  marks?: string;
  precedent?: string;
  created_at?: string;
  applicableExams?: ("CA Foundation" | "CSEET")[];
}

const FALLBACK_CASES: CaseStudyItem[] = [
  {
    id: "cs-salomon",
    slug: "salomon-v-salomon-co-ltd",
    title: "Salomon v. Salomon & Co. Ltd [1897] AC 22",
    subject: "The Companies Act, 2013",
    summary:
      "The foundational English House of Lords decision establishing that an incorporated company has an independent corporate legal personality distinct from its members and shareholders.",
    badge: "FOUNDATIONAL",
    marks: "6 Marks Model Case",
    precedent: "House of Lords [1897] AC 22",
    applicableExams: ["CA Foundation", "CSEET"],
  },
  {
    id: "cs-mohoribibee",
    slug: "mohoribibee-v-dharmodas-ghose",
    title: "Mohoribibee v. Dharmodas Ghose (1903) 30 IA 114",
    subject: "The Indian Contract Act, 1872",
    summary:
      "Landmark Privy Council ruling establishing that an agreement entered into by a minor is void ab initio under Section 11, and no restitution can be claimed.",
    badge: "ICAI FAVORITE",
    marks: "6 Marks Model Case",
    precedent: "Privy Council (1903) 30 IA 114 : ILR 30 Cal 539",
    applicableExams: ["CA Foundation", "CSEET"],
  },
  {
    id: "cs-carlill",
    slug: "carlill-v-carbolic-smoke-ball-co",
    title: "Carlill v. Carbolic Smoke Ball Co. [1893] 1 QB 256",
    subject: "The Indian Contract Act, 1872",
    summary:
      "Landmark Court of Appeal decision establishing that an offer made to the public at large (General Offer) can be accepted through performance of conditions without prior notification.",
    badge: "LANDMARK PRECEDENT",
    marks: "6 Marks Case Problem",
    precedent: "Court of Appeal [1893] 1 QB 256",
    applicableExams: ["CA Foundation", "CSEET"],
  },
];

export default function CaseStudiesDirectoryPage() {
  const [cases, setCases] = useState<CaseStudyItem[]>(FALLBACK_CASES);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [examFilter, setExamFilter] = useState<"all" | "ca" | "cseet">("all");
  const [, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadCases() {
      try {
        setLoading(true);
        const res = await apiRequest<{ caseStudies?: CaseStudyItem[]; cases?: CaseStudyItem[] } | CaseStudyItem[]>("/api/case-studies");
        if (res.success && res.data) {
          const list = Array.isArray(res.data)
            ? res.data
            : (res.data as { caseStudies?: CaseStudyItem[]; cases?: CaseStudyItem[] }).caseStudies ||
              (res.data as { caseStudies?: CaseStudyItem[]; cases?: CaseStudyItem[] }).cases ||
              [];
          if (isMounted) {
            setCases(list.length > 0 ? list : FALLBACK_CASES);
          }
        } else if (isMounted) {
          setCases(FALLBACK_CASES);
        }
      } catch {
        if (isMounted) setCases(FALLBACK_CASES);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadCases();
    return () => {
      isMounted = false;
    };
  }, []);

  const subjects = ["all", ...Array.from(new Set(cases.map((c) => c.subject)))];

  const filtered = cases.filter((c) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.summary.toLowerCase().includes(q) ||
      (c.precedent && c.precedent.toLowerCase().includes(q));

    const matchesSubject = selectedSubject === "all" || c.subject === selectedSubject;

    const matchesExam =
      examFilter === "all"
        ? true
        : examFilter === "ca"
        ? !c.applicableExams || c.applicableExams.includes("CA Foundation")
        : !c.applicableExams || c.applicableExams.includes("CSEET");

    return matchesSearch && matchesSubject && matchesExam;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A192F] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#EFF6FF] text-[#005A9C] border border-[#BFDBFE] shadow-2xs">
            <Scale className="w-3.5 h-3.5 text-[#005A9C]" />
            <span>ICAI &amp; ICSI Case Law Library</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-[#0A192F] tracking-tight">
            Legal Case Studies &amp; Precedents
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            Deconstruct landmark judicial judgments with ICAI 4-step descriptive model answers, ICSI objective aptitude analysis, and practice drills.
          </p>
        </div>

        {/* Dual Exam Filter Switcher Bar */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          <button
            type="button"
            onClick={() => setExamFilter("all")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              examFilter === "all"
                ? "bg-[#0A192F] text-white shadow-xs"
                : "bg-white text-[#475569] hover:bg-slate-100 border border-slate-200"
            }`}
          >
            🎓 All Jurisprudence ({cases.length})
          </button>
          <button
            type="button"
            onClick={() => setExamFilter("ca")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              examFilter === "ca"
                ? "bg-[#005A9C] text-white shadow-xs"
                : "bg-white text-[#005A9C] hover:bg-blue-50 border border-blue-200"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>📘 CA Foundation (ICAI 4-Step)</span>
          </button>
          <button
            type="button"
            onClick={() => setExamFilter("cseet")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              examFilter === "cseet"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>📗 CSEET (ICSI Legal Aptitude)</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 bg-white p-4 rounded-3xl border border-[#CBD5E1] shadow-2xs">
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search case name, section, ratio..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-[#0A192F] placeholder-[#64748B] focus:outline-none focus:border-[#005A9C] focus:bg-white transition"
            />
          </div>

          {/* Subject Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSubject === sub
                    ? "bg-[#005A9C] text-white shadow-2xs"
                    : "bg-slate-100 text-[#475569] hover:bg-slate-200 hover:text-[#0A192F]"
                }`}
              >
                {sub === "all" ? "All Acts" : sub}
              </button>
            ))}
          </div>
        </div>

        {/* Case Studies Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#CBD5E1] shadow-2xs max-w-lg mx-auto">
            <BookOpen className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
            <h3 className="font-serif font-bold text-base text-[#0A192F]">No Case Studies Found</h3>
            <p className="text-xs text-[#64748B] mt-1">Try adjusting your search query or filter options.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#CBD5E1] shadow-2xs hover:shadow-md hover:border-[#BFDBFE] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top Exam applicability & Subject */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-[#005A9C] uppercase tracking-wider">
                      {item.subject}
                    </span>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#EFF6FF] text-[#005A9C] border border-[#BFDBFE]">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h2 className="text-base sm:text-lg font-serif font-bold text-[#0A192F] group-hover:text-[#005A9C] transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h2>

                  {item.precedent && (
                    <p className="text-[10px] text-[#475569] font-mono bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 truncate">
                      ⚖️ {item.precedent}
                    </p>
                  )}

                  <p className="text-xs text-[#475569] leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>

                  {/* Dual Course Relevance Badges */}
                  <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-blue-50 text-[#005A9C] border border-blue-200">
                      ICAI 4-Step Solved
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      ICSI MCQ Drill
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                  {item.marks ? (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      {item.marks}
                    </span>
                  ) : <span />}

                  <Link
                    href={`/case-studies/${item.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#005A9C] hover:text-[#004F8A] transition-all group-hover:translate-x-1"
                  >
                    <span>Read Full Analysis</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
