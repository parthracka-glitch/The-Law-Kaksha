"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  FileText,
  Search,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowLeft,
  Eye,
  Filter,
  CheckCircle2,
  Lock,
  ExternalLink,
} from "lucide-react";
import { apiRequest, getStudentAuthToken } from "@/lib/api";
import { SecurePdfReader } from "@/components/SecurePdfReader";

interface EntitledResource {
  id: string;
  title: string;
  type: string;
  course_id?: string;
  course_title?: string;
  subscription_title?: string;
  file_or_url: string;
  pages?: string;
  description?: string;
  expiry_date?: string;
}

const FALLBACK_RESOURCES: EntitledResource[] = [
  {
    id: "res-ca-soga-1",
    title: "Sale of Goods Act, 1930 — Unit 1: Formation of Contract of Sale",
    type: "notes",
    course_title: "CA Foundation Business Laws",
    subscription_title: "CA Foundation Monthly Pass",
    file_or_url: "/notes/sale-of-goods-unit-1.pdf",
    pages: "18 Pages",
    description: "Sale vs Agreement to Sell, Ascertained Goods, Formalities & Statutory Rules.",
    expiry_date: "2026-11-06",
  },
  {
    id: "res-ca-soga-2",
    title: "Sale of Goods Act, 1930 — Unit 2: Conditions and Warranties (Sec 11-17)",
    type: "notes",
    course_title: "CA Foundation Business Laws",
    subscription_title: "CA Foundation Monthly Pass",
    file_or_url: "/notes/sale-of-goods-unit-2.pdf",
    pages: "16 Pages",
    description: "Implied conditions of fitness, Caveat Emptor, and landmark English precedents.",
    expiry_date: "2026-11-06",
  },
  {
    id: "res-ca-contract-infographic",
    title: "Indian Contract Act — Visual Architecture & Memory Mindmaps",
    type: "flowchart",
    course_title: "CA Foundation Business Laws",
    subscription_title: "CA Foundation Monthly Pass",
    file_or_url: "/notes/sale-of-goods-unit-1.pdf",
    pages: "12 Infographic Sheets",
    description: "Visual logic pathways for Offer, Acceptance, Coercion, Fraud and Breach damages.",
    expiry_date: "2026-11-06",
  },
  {
    id: "res-ca-qbank",
    title: "Smart Revision Question Bank (Part 1) — With ICAI Model Solutions",
    type: "practice",
    course_title: "CA Foundation Business Laws",
    subscription_title: "CA Foundation Monthly Pass",
    file_or_url: "/notes/sale-of-goods-unit-2.pdf",
    pages: "65+ Pages",
    description: "Exhaustive application scenarios, case-based questions & past exam problem sets.",
    expiry_date: "2026-11-06",
  },
];

export default function StudentResourcesPage() {
  const router = useRouter();
  const [resources, setResources] = useState<EntitledResource[]>(FALLBACK_RESOURCES);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  // In-app DRM reader state
  const [readerState, setReaderState] = useState<{
    open: boolean;
    url: string;
    title: string;
  }>({
    open: false,
    url: "",
    title: "",
  });

  useEffect(() => {
    let isMounted = true;
    async function loadResources() {
      const token = getStudentAuthToken();
      if (!token) {
        router.push("/student/login");
        return;
      }

      try {
        setLoading(true);
        const res = await apiRequest<EntitledResource[]>("/api/student/resources");
        if (res.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
          if (isMounted) setResources(res.data);
        }
      } catch (e) {
        // Fallback remains
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadResources();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const filtered = resources.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase())) ||
      (item.course_title && item.course_title.toLowerCase().includes(search.toLowerCase()));
    const matchesType = selectedType === "all" || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#221D1D] font-sans flex flex-col">
      {/* Top Navbar */}
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
              Entitled Study Codices &amp; Resources
            </h1>
            <p className="text-xs text-[#77716E]">
              DRM-Protected Candidate Library • Single-Device Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/student/explore"
            className="text-xs font-bold text-[#221D1D] bg-[#C4E1EC] hover:bg-[#AED7E9] px-4 py-2 rounded-full transition-all border border-[#AED7E9]"
          >
            Explore More Passes &rarr;
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-3xl border border-[#E7E4E7] shadow-[0_4px_20px_rgba(34,29,29,0.04)]">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-[#77716E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes, chapters, acts..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E7E4E7] bg-[#F7F7F5] focus:bg-white text-sm text-[#221D1D] placeholder:text-[#77716E] focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {["all", "notes", "flowchart", "practice", "pyq"].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedType === t
                    ? "bg-[#221D1D] text-white shadow-xs"
                    : "bg-white border border-[#E7E4E7] text-[#4D433F] hover:bg-[#F7F7F5]"
                }`}
              >
                {t === "all" ? "All Formats" : t}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E7E4E7] shadow-sm max-w-md mx-auto">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h2 className="font-serif font-black text-lg text-[#221D1D]">No Resources Match Search</h2>
            <p className="text-xs text-[#77716E] mt-1">Try clearing your search keyword or selected format filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-[#E7E4E7] shadow-[0_4px_20px_rgba(34,29,29,0.04)] hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#2B5B70]">
                      {item.course_title || "Law Codex"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C4E1EC]/60 text-[#221D1D] border border-[#AED7E9]">
                      {item.type}
                    </span>
                  </div>

                  <h2 className="text-base font-serif font-black text-[#221D1D] mb-2 leading-snug line-clamp-2">
                    {item.title}
                  </h2>

                  {item.description && (
                    <p className="text-xs text-[#4D433F] leading-relaxed mb-4 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-[#E7E4E7] space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#77716E]">
                    <span className="flex items-center gap-1 font-medium">
                      <FileText className="w-3.5 h-3.5 text-[#2B5B70]" />
                      {item.pages || "Full PDF"}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-emerald-700">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Entitled
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      setReaderState({
                        open: true,
                        url: item.file_or_url || "/notes/sale-of-goods-unit-1.pdf",
                        title: item.title,
                      })
                    }
                    className="w-full py-2.5 px-4 rounded-full font-bold text-xs bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] transition-colors flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(191,175,229,0.35)] cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#221D1D]" />
                    <span>Open in DRM Reader</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* In-Browser DRM PDF Reader Modal */}
      {readerState.open && (
        <SecurePdfReader
          isOpen={readerState.open}
          pdfUrl={readerState.url}
          title={readerState.title}
          onClose={() => setReaderState({ open: false, url: "", title: "" })}
        />
      )}
    </div>
  );
}
