"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Check,
  Zap,
  ShoppingBag,
} from "lucide-react";
import { apiRequest, getStudentAuthToken } from "@/lib/api";

interface ExploreItem {
  id: string;
  item_type: "subscription" | "extra_course";
  title: string;
  description: string;
  price: number;
  mrp: number;
  badge?: string;
  features: string[];
}

const FALLBACK_EXPLORE: ExploreItem[] = [
  {
    id: "sub-cseet-monthly",
    item_type: "subscription",
    title: "CSEET Legal Aptitude & Management Pass",
    description: "Expand your mastery into Company Secretary Entrance Examination Paper 2 with 8 comprehensive study units.",
    price: 99,
    mrp: 299,
    badge: "EXPAND PASS",
    features: [
      "Complete 8 Units Legal & Management Study",
      "Timed MCQ Drills & Instant Explanations",
      "Live Google Meet Revision Masterclasses",
    ],
  },
  {
    id: "course-contract-crash",
    item_type: "extra_course",
    title: "The Indian Contract Act High-Yield Crash Codex",
    description: "Deep dive into Section 1 to 75 with 50+ landmark case law frameworks, model answers, and revision mindmaps.",
    price: 49,
    mrp: 149,
    badge: "CRASH CODEX",
    features: [
      "50+ Detailed Case Law Precedent Breakdowns",
      "ICAI Section 16 Model Answer Drafting Templates",
      "High-Yield Concept Flowcharts & Summary Tables",
    ],
  },
  {
    id: "course-soga-mastery",
    item_type: "extra_course",
    title: "Sale of Goods Act, 1930 Application Drill",
    description: "Master unpaid seller remedies, auction rules, and Caveat Emptor exceptions with practical examination problem sets.",
    price: 49,
    mrp: 149,
    badge: "PRACTICE SET",
    features: [
      "100+ Application-based Case Scenarios",
      "Step-by-step Examiner Marking Scheme Insights",
      "Direct in-browser watermarked reading pass",
    ],
  },
];

export default function StudentExplorePage() {
  const router = useRouter();
  const [items, setItems] = useState<ExploreItem[]>(FALLBACK_EXPLORE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadExplore() {
      const token = getStudentAuthToken();
      if (!token) {
        router.push("/student/login");
        return;
      }

      try {
        setLoading(true);
        const res = await apiRequest<ExploreItem[]>("/api/student/explore");
        if (res.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
          if (isMounted) setItems(res.data);
        }
      } catch (e) {
        // Fallback remains
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadExplore();
    return () => {
      isMounted = false;
    };
  }, [router]);

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
              Explore Add-On Codices &amp; Passes
            </h1>
            <p className="text-xs text-[#77716E]">
              1-Click Instant Unlocking For Active Aspirants
            </p>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#C4E1EC] text-[#221D1D] border border-[#AED7E9] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#2B5B70]" />
            Additional Learning Modules
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#221D1D]">
            Enhance Your Preparation Arsenal
          </h2>
          <p className="mt-3 text-sm text-[#4D433F]">
            Enrolled candidates receive instant 1-click checkout with existing credentials and immediate DRM library activation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => {
            const discountPct = Math.round(((item.mrp - item.price) / item.mrp) * 100);

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-7 border border-[#E7E4E7] shadow-[0_4px_20px_rgba(34,29,29,0.04)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#2B5B70]">
                      {item.item_type === "subscription" ? "Access Pass" : "Specialized Codex"}
                    </span>
                    {item.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C4E1EC]/60 text-[#221D1D] border border-[#AED7E9]">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-serif font-black text-[#221D1D] mb-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#4D433F] leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Pricing */}
                  <div className="flex items-baseline justify-between p-3.5 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7] mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-serif font-black text-[#221D1D]">
                        ₹{item.price}
                      </span>
                      <span className="text-xs text-[#77716E] line-through">
                        ₹{item.mrp}
                      </span>
                    </div>
                    {discountPct > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        {discountPct}% OFF
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {item.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs text-[#4D433F]">
                        <Check className="w-3.5 h-3.5 text-[#2B5B70] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#E7E4E7]">
                  <Link
                    href={`/student/checkout/${item.item_type}/${item.id}`}
                    className="w-full py-3 px-4 rounded-full font-bold text-xs sm:text-sm bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] transition-colors flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(191,175,229,0.35)] cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-[#221D1D]" />
                    <span>1-Click Buy Now</span>
                    <ArrowRight className="w-4 h-4 text-[#221D1D]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
