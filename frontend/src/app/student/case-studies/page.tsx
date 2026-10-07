"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Search,
  Scale,
  Sparkles,
  ArrowLeft,
  X,
  Award,
  FileText,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { apiRequest, getStudentAuthToken } from "@/lib/api";

interface CaseItem {
  id: string;
  slug: string;
  title: string;
  subject: string;
  summary: string;
  badge?: string;
  marks?: string;
  precedent?: string;
  facts?: string;
  issue?: string;
  ruling?: string;
  model_answer?: string;
  key_takeaways?: string[];
}

const FALLBACK_DASHBOARD_CASES: CaseItem[] = [
  {
    id: "cs-mohoribibee",
    slug: "mohoribibee-v-dharmodas-ghose",
    title: "Mohoribibee v. Dharmodas Ghose (1903): Minor's Capacity to Contract",
    subject: "The Indian Contract Act, 1872",
    summary: "Privy Council decision holding that a contract with a minor is void ab initio under Section 11.",
    badge: "ICAI FAVORITE",
    marks: "6 Marks Model Case",
    precedent: "Privy Council (1903) 30 IA 114",
    facts: "Dharmodas Ghose, a minor, executed a mortgage of immovable property in favour of a moneylender...",
    issue: "Whether minor's contract is void or voidable and whether restitution can be ordered under Section 65.",
    ruling: "Section 11 makes minor's agreement void ab initio. Sections 64 and 65 do not apply to void ab initio contracts.",
    model_answer: "1. Under Section 11 of the Contract Act, competency is an essential condition of validity...\n2. In Mohoribibee v. Dharmodas Ghose, the Privy Council authoritatively laid down that an agreement by a minor is absolute void ab initio.",
    key_takeaways: ["Minor's agreement is void ab initio", "No estoppel against minor", "No ratification after majority"],
  },
  {
    id: "cs-salomon",
    slug: "salomon-v-salomon-co-ltd",
    title: "Salomon v. Salomon & Co. Ltd: The Principle of Separate Legal Entity",
    subject: "The Companies Act, 2013",
    summary: "House of Lords ruling on independent corporate entity distinct from shareholders.",
    badge: "FOUNDATIONAL",
    marks: "5 Marks Theory Question",
    precedent: "[1897] AC 22 (House of Lords)",
    facts: "Aron Salomon incorporated Salomon & Co. Ltd. with seven family members and issued secured debentures...",
    issue: "Whether company and its dominant promoter shareholder are distinct legal persons.",
    ruling: "Once legally incorporated, the company is an independent juristic person distinct from its members.",
    model_answer: "Salomon's case establishes the bedrock principle of corporate veil and distinct juristic personality.",
    key_takeaways: ["Company has independent legal personality", "Debentures held by founder have legal priority"],
  },
];

export default function StudentCaseStudiesPage() {
  const router = useRouter();
  const [cases, setCases] = useState<CaseItem[]>(FALLBACK_DASHBOARD_CASES);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadCases() {
      const token = getStudentAuthToken();
      if (!token) {
        router.push("/student/login");
        return;
      }

      try {
        setLoading(true);
        const res = await apiRequest<CaseItem[]>("/api/student/case-studies");
        if (res.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
          if (isMounted) setCases(res.data);
        }
      } catch (e) {
        // Fallback remains
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadCases();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const filtered = cases.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#221D1D] font-sans flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-[#E7E4E7] sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/student"
            className="w-9 h-9 rounded-full border border-[#E7E4E7] bg-white hover:bg-[#F7F7F5] text-[#221D1D] flex items-center justify-center transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#4D433F]" />
          </Link>
          <div>
            <h1 className="font-serif font-black text-lg text-[#221D1D]">
              Candidate Case Studies Repository
            </h1>
            <p className="text-xs text-[#77716E]">
              Exam Precedents &amp; ICAI Model Answer Blueprints
            </p>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Search */}
        <div className="mb-8 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-[#77716E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search precedent, section or judgment..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E7E4E7] text-sm focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 bg-white text-[#221D1D] placeholder:text-[#77716E]"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-[#E7E4E7] shadow-[0_4px_20px_rgba(34,29,29,0.04)] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#2B5B70]">
                    {item.subject}
                  </span>
                  {item.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C4E1EC]/60 text-[#221D1D] border border-[#AED7E9]">
                      {item.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-serif font-black text-[#221D1D] mb-2 leading-snug line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-xs text-[#4D433F] leading-relaxed mb-4 line-clamp-3">
                  {item.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E7E4E7] flex items-center justify-between">
                {item.marks ? (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                    {item.marks}
                  </span>
                ) : <span />}

                <button
                  onClick={() => setSelectedCase(item)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#221D1D] hover:text-[#4B8097] transition-colors cursor-pointer"
                >
                  <span>Study Blueprint</span>
                  <ChevronRight className="w-4 h-4 text-[#221D1D]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Case Study Reading Modal Drawer */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 shadow-2xl space-y-6 relative border border-[#E7E4E7]">
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute right-6 top-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2B5B70]">
                {selectedCase.subject}
              </span>
              <h2 className="text-2xl font-serif font-black text-[#221D1D] mt-1">
                {selectedCase.title}
              </h2>
              {selectedCase.precedent && (
                <p className="text-xs font-mono text-[#77716E] mt-1">
                  Citation: {selectedCase.precedent}
                </p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E7E4E7] text-sm italic text-[#4D433F]">
              {selectedCase.summary}
            </div>

            {selectedCase.facts && (
              <div>
                <h4 className="font-serif font-black text-base text-[#221D1D] mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#2B5B70]" />
                  Material Facts
                </h4>
                <p className="text-xs sm:text-sm text-[#4D433F] leading-relaxed whitespace-pre-line">
                  {selectedCase.facts}
                </p>
              </div>
            )}

            {selectedCase.ruling && (
              <div>
                <h4 className="font-serif font-black text-base text-[#221D1D] mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#2B5B70]" />
                  Ratio Decidendi / Court Ruling
                </h4>
                <p className="text-xs sm:text-sm text-[#4D433F] leading-relaxed whitespace-pre-line">
                  {selectedCase.ruling}
                </p>
              </div>
            )}

            {selectedCase.model_answer && (
              <div className="bg-[#FDFBF7] border border-[#E7E4E7] text-[#221D1D] p-6 rounded-3xl space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2B5B70]" />
                  <h4 className="font-serif font-black text-sm text-[#221D1D]">
                    ICAI Model Answer Drafting Scheme
                  </h4>
                </div>
                <pre className="font-sans text-xs text-[#4D433F] whitespace-pre-wrap leading-relaxed">
                  {selectedCase.model_answer}
                </pre>
              </div>
            )}

            <div className="pt-4 border-t border-[#E7E4E7] flex justify-end">
              <button
                onClick={() => setSelectedCase(null)}
                className="px-6 py-2.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] font-bold text-xs shadow-[0_2px_8px_rgba(191,175,229,0.35)] cursor-pointer"
              >
                Close Blueprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
