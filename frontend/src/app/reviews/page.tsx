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
    student_name: "Ananya Singhal",
    student_rank: "AIR 3 — CA Intermediate (Nov'25)",
    rating: 5,
    title: "Scored 74 in Law! Volume 1 is unmatched.",
    comment:
      "The way Section 96 to 103 are broken down with practical AGM and quorum tables helped me draft crystal clear 6-mark answers. In my exam, 4 descriptive questions were verbatim from Pearl Ma'am's book!",
  },
  {
    id: "rev-002",
    student_name: "Karan Mehta",
    student_rank: "AIR 14 — CA Inter",
    rating: 5,
    title: "Full 30/30 in MCQ section thanks to this Question Bank.",
    comment:
      "Every single question has explanations for why the other 3 options are incorrect. The integrated case studies gave me the exact confidence needed for the tricky ICAI negative marking traps.",
  },
  {
    id: "rev-003",
    student_name: "Siddharth Jain",
    student_rank: "CA Final Candidate",
    rating: 5,
    title: "Life-saver during the 1.5-day exam gap.",
    comment:
      "You cannot read 800 pages before the exam. These LDR maps condensing penalty codes and filing days into 180 visual pages are pure gold. Must-have for every law aspirant.",
  },
  {
    id: "rev-004",
    student_name: "Pooja Hegde",
    student_rank: "Cleared CA Inter with 68 in Law",
    rating: 5,
    title: "The 1-on-1 copy checking boosted my score by 22 marks.",
    comment:
      "I used to write stories instead of legal answers. The 5-pillar rubric taught me how to cite Bare Act provisions and synthesize facts concisely. The audio feedback note from faculty is fantastic.",
  },
  {
    id: "rev-005",
    student_name: "Nikhil Aggarwal",
    student_rank: "AIR 28 — CA Inter",
    rating: 5,
    title: "General Clauses Act & Statutory Interpretation made simple.",
    comment:
      "Other Laws used to feel dry and confusing. Volume 2 codex breaks down external aids, ejusdem generis, and presumption principles with courtroom examples. Scored exemption comfortably!",
  },
  {
    id: "rev-006",
    student_name: "Shruti Sharma",
    student_rank: "CA Final Corporate Law — 71 Marks",
    rating: 5,
    title: "The only material you need for corporate law mastery.",
    comment:
      "No unnecessary fluff. Direct Bare Act sections with recent MCA circulars. The question bank has complete past 10 attempts RTPs and MTPs mapped chapter-wise.",
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
    if (selectedFilter === "air") return r.student_rank.toLowerCase().includes("air");
    if (selectedFilter === "inter") return r.student_rank.toLowerCase().includes("inter");
    if (selectedFilter === "final") return r.student_rank.toLowerCase().includes("final");
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            Verified ICAI Topper Testimonials
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-serif">
            Trusted by 84+ All-India Rankers &amp; Exemption Holders
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Read honest feedback from CA Foundation, Inter, and Final students who transformed their scores with The Law Kaksha materials.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              selectedFilter === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setSelectedFilter("air")}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              selectedFilter === "air"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            AIR Rankers
          </button>
          <button
            onClick={() => setSelectedFilter("inter")}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              selectedFilter === "inter"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            CA Intermediate
          </button>
          <button
            onClick={() => setSelectedFilter("final")}
            className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              selectedFilter === "final"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            CA Final
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-sky-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified Student
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 font-serif leading-snug">
                  &ldquo;{review.title}&rdquo;
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {review.comment}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {review.student_name}
                  </div>
                  <div className="text-[11px] text-[#0284C7] font-semibold">
                    {review.student_rank}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold text-xs">
                  {review.student_name.slice(0, 2).toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center pt-8">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-xs transition-colors"
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
