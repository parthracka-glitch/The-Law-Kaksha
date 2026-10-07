"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { apiRequest } from "@/lib/api";
import {
  BookOpen,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  Scale,
  Award,
  ChevronRight,
  Bookmark,
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
}

const FALLBACK_CASES: CaseStudyItem[] = [
  {
    id: "cs-mohoribibee",
    slug: "mohoribibee-v-dharmodas-ghose",
    title: "Mohoribibee v. Dharmodas Ghose (1903): Minor's Capacity to Contract",
    subject: "The Indian Contract Act, 1872",
    summary: "Landmark Privy Council ruling establishing that an agreement entered into by a minor is void ab initio under Section 11, and no restitution can be claimed.",
    badge: "ICAI FAVORITE",
    marks: "6 Marks Model Case",
    precedent: "Privy Council (1903) 30 IA 114",
  },
  {
    id: "cs-salomon",
    slug: "salomon-v-salomon-co-ltd",
    title: "Salomon v. Salomon & Co. Ltd: The Principle of Separate Legal Entity",
    subject: "The Companies Act, 2013",
    summary: "The foundational English House of Lords decision establishing that an incorporated company has a legal personality distinct from its members and shareholders.",
    badge: "FOUNDATIONAL",
    marks: "5 Marks Theory Question",
    precedent: "[1897] AC 22 (House of Lords)",
  },
  {
    id: "cs-carlill",
    slug: "carlill-v-carbolic-smoke-ball-co",
    title: "Carlill v. Carbolic Smoke Ball Co: General Offer & Unilateral Contracts",
    subject: "The Indian Contract Act, 1872",
    summary: "Court of Appeal ruling on how an offer made to the world at large can be accepted through performance of conditions without formal notification.",
    badge: "HIGH YIELD",
    marks: "4 Marks Application",
    precedent: "[1893] 1 QB 256",
  },
];

export default function CaseStudiesDirectoryPage() {
  const [cases, setCases] = useState<CaseStudyItem[]>(FALLBACK_CASES);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadCases() {
      try {
        setLoading(true);
        const res = await apiRequest<CaseStudyItem[]>("/api/case-studies");
        if (res.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
          if (isMounted) setCases(res.data);
        }
      } catch (err) {
        // Fallback remains
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
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.summary.toLowerCase().includes(search.toLowerCase()) ||
      (c.precedent && c.precedent.toLowerCase().includes(search.toLowerCase()));
    const matchesSubject = selectedSubject === "all" || c.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#221D1D] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#C4E1EC] text-[#221D1D] border border-[#AED7E9]">
            <Scale className="w-3.5 h-3.5 text-[#4B8097]" />
            Jurisprudence &amp; Precedents
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#221D1D] tracking-tight">
            Legal Case Studies &amp; Analysis
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#4D433F]">
            Deconstruct statutory judgments with ICAI/ICSI model answers, facts breakdown, and ratio decidendi.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 bg-white p-4 rounded-3xl border border-[#E7E4E7] shadow-sm">
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-[#77716E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search case name, section, ratio..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#E7E4E7] text-sm focus:outline-none focus:border-[#AED7E9] focus:ring-1 focus:ring-[#AED7E9]"
            />
          </div>

          {/* Subject Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSubject === sub
                    ? "bg-[#BFAFE5] text-[#221D1D] shadow-xs"
                    : "bg-[#F7F7F5] text-[#4D433F] hover:bg-[#E7E4E7] hover:text-[#221D1D]"
                }`}
              >
                {sub === "all" ? "All Acts" : sub}
              </button>
            ))}
          </div>
        </div>

        {/* Case Studies Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E7E4E7] shadow-sm max-w-lg mx-auto">
            <BookOpen className="w-12 h-12 text-[#77716E] mx-auto mb-4" />
            <h3 className="font-serif font-black text-lg text-[#221D1D]">No Case Studies Found</h3>
            <p className="text-sm text-[#4D433F] mt-1">Try adjusting your search criteria or filter options.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-7 border border-[#E7E4E7] shadow-[0_4px_20px_rgba(34,29,29,0.04)] hover:shadow-[0_12px_36px_rgba(34,29,29,0.08)] hover:border-[#AED7E9] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-[#4B8097] uppercase tracking-wider">
                      {item.subject}
                    </span>
                    {item.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C4E1EC] text-[#221D1D] border border-[#AED7E9]">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-serif font-black text-[#221D1D] mb-3 leading-snug line-clamp-2">
                    {item.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#4D433F] leading-relaxed mb-4 line-clamp-3">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E7E4E7] space-y-3">
                  {item.precedent && (
                    <p className="text-[11px] text-[#77716E] font-mono truncate">
                      Citation: {item.precedent}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    {item.marks && (
                      <span className="text-xs font-bold text-[#221D1D] bg-[#C4E1EC]/60 border border-[#AED7E9] px-2.5 py-1 rounded-full">
                        {item.marks}
                      </span>
                    )}

                    <Link
                      href={`/case-studies/${item.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#221D1D] hover:text-[#4B8097] transition-colors"
                    >
                      <span>Read Full Analysis</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
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
