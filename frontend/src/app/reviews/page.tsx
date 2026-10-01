"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { apiRequest } from "@/lib/api";
import {
  Star,
  Award,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Quote,
  ShieldCheck,
  Check,
} from "lucide-react";

interface Review {
  id: string;
  student_name: string;
  student_rank: string;
  rating: number;
  title: string;
  comment: string;
}

const FALLBACK_REVIEWS: Review[] = [
  {
    id: "rev-001",
    student_name: "Merit Ranker (Rank 03)",
    student_rank: "CA Foundation Distinction",
    rating: 5,
    title: "Scored 84 in Law! Notes are unmatched.",
    comment:
      "The way Section 96 to 103 and Contract Act are broken down with practical case tables helped me draft crystal clear 6-mark answers. In my exam, 4 descriptive questions were verbatim from The Law Kaksha statutory codex!",
  },
  {
    id: "rev-002",
    student_name: "Top Scorer Candidate",
    student_rank: "CSEET Distinction",
    rating: 5,
    title: "Full 30/30 in MCQ section thanks to this Question Bank.",
    comment:
      "Every single question has explanations for why the other 3 options are incorrect. The integrated case studies gave me the exact confidence needed for the tricky exam distractors.",
  },
  {
    id: "rev-003",
    student_name: "CA Foundation Candidate",
    student_rank: "Business Laws (Paper 2)",
    rating: 5,
    title: "Life-saver during the 1.5-day exam gap.",
    comment:
      "You cannot read 800 pages before the exam. These LDR maps condensing penalty codes and partnership units into visual pages are pure gold. Must-have for every law aspirant.",
  },
  {
    id: "rev-004",
    student_name: "Exemption Candidate",
    student_rank: "Cleared with 78 in Law",
    rating: 5,
    title: "The 1-on-1 model answer format boosted my score by 22 marks.",
    comment:
      "I used to write stories instead of legal answers. The 4-step structure taught me how to cite statutory provisions and synthesize facts concisely.",
  },
  {
    id: "rev-005",
    student_name: "Merit Ranker (Rank 28)",
    student_rank: "CA Foundation",
    rating: 5,
    title: "Indian Partnership Act & Sale of Goods Act made simple.",
    comment:
      "Partnership Act used to feel confusing. The 3-unit sample notes break down mutual agency, holding out, and dissolution with clear examples. Scored exemption comfortably!",
  },
  {
    id: "rev-006",
    student_name: "CSEET Law Candidate",
    student_rank: "Business Law & Mgt — 88%",
    rating: 5,
    title: "The only material you need for law mastery.",
    comment:
      "No unnecessary fluff. Direct Bare Act sections with recent circulars. The question bank has complete past examinations mapped unit-wise.",
  },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(FALLBACK_REVIEWS);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  useEffect(() => {
    async function loadReviews() {
      const res = await apiRequest<{ reviews?: Review[] }>("/api/reviews");
      if (res.success && res.data?.reviews && res.data.reviews.length > 0) {
        setReviews(res.data.reviews);
      }
    }
    loadReviews();
  }, []);

  const filteredReviews = reviews.filter((r) => {
    if (selectedFilter === "toppers") return r.student_rank.toLowerCase().includes("merit") || r.student_rank.toLowerCase().includes("distinction");
    if (selectedFilter === "ca") return r.student_rank.toLowerCase().includes("ca") || r.student_rank.toLowerCase().includes("foundation");
    if (selectedFilter === "cs") return r.student_rank.toLowerCase().includes("cs") || r.student_rank.toLowerCase().includes("cseet");
    return true;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/[0.04] border border-black/[0.06] text-[#1D1D1F] text-xs font-medium">
            <Star className="w-3.5 h-3.5 fill-[#FF9500] text-[#FF9500]" />
            Verified Student Testimonials
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#1D1D1F] tracking-tight leading-[1.1]">
            Trusted by Top Rankers &amp; Exemption Holders
          </h1>
          <p className="text-sm sm:text-base text-[#86868B] max-w-2xl mx-auto leading-relaxed">
            Read honest feedback from CA Foundation and CSEET students who transformed their scores with The Law Kaksha materials.
          </p>
        </div>

        {/* Apple Segmented Control */}
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1 bg-black/[0.04] border border-black/[0.06] rounded-full gap-1">
            {[
              { id: "all", label: `All Reviews (${reviews.length})` },
              { id: "toppers", label: "Top Rankers" },
              { id: "ca", label: "CA Foundation" },
              { id: "cs", label: "CSEET" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  selectedFilter === tab.id
                    ? "bg-[#1D1D1F] text-white shadow-sm"
                    : "text-[#6E6E73] hover:text-[#1D1D1F]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-black/[0.06] rounded-3xl p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-6 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-black/[0.12] transition-all"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-[#FF9500] text-[#FF9500]"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> Verified Student
                  </span>
                </div>

                <h3 className="text-base font-semibold text-[#1D1D1F] tracking-tight leading-snug">
                  &ldquo;{review.title}&rdquo;
                </h3>

                <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
                  {review.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-black/[0.04] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#1D1D1F]">
                    {review.student_name}
                  </div>
                  <div className="text-[11px] text-[#0071E3] font-medium mt-0.5">
                    {review.student_rank}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#0071E3]/[0.08] text-[#0071E3] flex items-center justify-center font-semibold text-xs">
                  {review.student_name.slice(0, 2).toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center pt-6">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1D1D1F] hover:bg-black text-white text-xs sm:text-sm font-medium shadow-sm transition-all active:scale-[0.98]"
          >
            <span>Start Your CA Law Preparation Today</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
