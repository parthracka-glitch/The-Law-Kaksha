"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Video,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Scale,
  Award,
  BookOpen,
  UserCheck,
} from "lucide-react";

export function EducatorLectures() {
  const lectures = [
    {
      id: 1,
      title: "Judiciary (PCS-J) Comprehensive Criminal Law Batch",
      faculty: "Adv. Arvind Sharma",
      credentials: "22+ Yrs Bar Experience • Criminal Procedure Expert",
      subject: "BNS, BNSS & Bharatiya Sakshya Adhiniyam",
      price: "6,999",
      badge: "Flagship Batch",
      duration: "140+ Hours",
      students: "3,200+ Enrolled",
    },
    {
      id: 2,
      title: "Constitutional Law & Landmark Precedents Masterclass",
      faculty: "Adv. Rajeshwari Sen",
      credentials: "Former High Court Research Scholar • NLU Alum",
      subject: "Constitutional Bench Analysis & Jurisprudence",
      price: "4,499",
      badge: "CLAT PG & Judiciary",
      duration: "90+ Hours",
      students: "2,850+ Enrolled",
    },
    {
      id: 3,
      title: "Corporate & Securities Laws (Companies Act, SEBI, IBC)",
      faculty: "CS Meenakshi Rao",
      credentials: "Fellow Company Secretary & Corporate Consultant",
      subject: "Company Law & Economic Legislation",
      price: "5,499",
      badge: "CA / CS Special",
      duration: "110+ Hours",
      students: "4,100+ Enrolled",
    },
    {
      id: 4,
      title: "Judiciary Mains Answer Writing & Judgment Drafting",
      faculty: "Prof. Vikram Malhotra",
      credentials: "Author of 5 Legal Reviewers • Judicial Mentor",
      subject: "Pleadings, Charge Framing & Order Writing",
      price: "3,999",
      badge: "Answer Evaluation Included",
      duration: "75+ Hours",
      students: "1,950+ Enrolled",
    },
    {
      id: 5,
      title: "CLAT UG Legal Reasoning & Critical Thinking Masterclass",
      faculty: "Adv. Ananya Deshmukh",
      credentials: "NLU Gold Medalist • AIR 7 in CLAT PG",
      subject: "Passage Analysis & Deductive Legal Reasoning",
      price: "3,499",
      badge: "Passage Drills",
      duration: "60+ Hours",
      students: "3,600+ Enrolled",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? lectures.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === lectures.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="lectures" className="py-16 sm:py-24 bg-[#F8FAFC] text-slate-800 border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-[#0284C7] text-xs font-bold uppercase tracking-wider mb-3">
              <GraduationCap className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Learn From India&apos;s Foremost Legal Minds</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-serif text-slate-900">
              The Law Kaksha <span className="text-[#0284C7]">Faculty Masterclasses</span>
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Intensive, concept-driven video masterclasses providing deep Bare Act interpretation, case analysis, and exam strategy.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-3 rounded-xl bg-white border border-sky-200 hover:border-sky-400 hover:bg-sky-50 text-[#0284C7] transition-all shadow-sm"
              aria-label="Previous faculty"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-3 rounded-xl bg-white border border-sky-200 hover:border-sky-400 hover:bg-sky-50 text-[#0284C7] transition-all shadow-sm"
              aria-label="Next faculty"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lectures.slice(currentIndex, currentIndex + 3).map((lecture) => (
            <div
              key={lecture.id}
              className="rounded-2xl bg-white border border-sky-100 hover:border-sky-300 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10 group"
            >
              <div>
                {/* Badge & Subject */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold text-[#0284C7] bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
                    {lecture.badge}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {lecture.duration}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 font-serif group-hover:text-[#0284C7] transition-colors leading-snug">
                  {lecture.title}
                </h3>

                {/* Faculty Details */}
                <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-100 mb-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <UserCheck className="w-4 h-4 text-[#0284C7]" />
                    <span>{lecture.faculty}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {lecture.credentials}
                  </p>
                </div>

                {/* Subject covered */}
                <p className="text-xs text-slate-600 mb-4">
                  <span className="font-semibold text-[#0284C7]">Focus Areas: </span>
                  {lecture.subject}
                </p>
              </div>

              {/* Price & Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500">Complete Batch</span>
                  <div className="text-xl font-extrabold text-[#0284C7]">
                    ₹{lecture.price}
                  </div>
                </div>

                <Link
                  href="/student"
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] hover:from-[#0369A1] hover:to-[#0284C7] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-sky-500/20 hover:scale-[1.02]"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Start Learning</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
