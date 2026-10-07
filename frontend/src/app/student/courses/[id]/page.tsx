"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  ArrowLeft,
  FileText,
  Eye,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
  Lock,
} from "lucide-react";
import { apiRequest, getStudentAuthToken } from "@/lib/api";
import { SecurePdfReader } from "@/components/SecurePdfReader";

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  exam_body?: string;
  chapters?: {
    id: string;
    title: string;
    description: string;
    pdf_url: string;
    pages: string;
  }[];
}

const FALLBACK_COURSE: CourseDetail = {
  id: "ca-foundation-business-laws",
  title: "CA Foundation Paper 2: Business Laws",
  description: "Comprehensive 7-chapter legal framework aligned with ICAI New Scheme.",
  exam_body: "ICAI",
  chapters: [
    {
      id: "ch-1",
      title: "Indian Regulatory Framework",
      description: "Overview of Indian Legal System & Hierarchy of Courts.",
      pdf_url: "/notes/sale-of-goods-unit-1.pdf",
      pages: "18 Pages",
    },
    {
      id: "ch-2",
      title: "The Indian Contract Act, 1872",
      description: "Essentials of valid contract, offer, acceptance, consideration, void agreements, and remedies for breach.",
      pdf_url: "/notes/sale-of-goods-unit-2.pdf",
      pages: "42 Pages",
    },
    {
      id: "ch-3",
      title: "The Sale of Goods Act, 1930",
      description: "Conditions & warranties, caveat emptor exceptions, and unpaid seller rights against goods.",
      pdf_url: "/notes/sale-of-goods-unit-1.pdf",
      pages: "34 Pages",
    },
  ],
};

export default function StudentCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = (params?.id as string) || "ca-foundation-business-laws";

  const [course, setCourse] = useState<CourseDetail>(FALLBACK_COURSE);
  const [loading, setLoading] = useState(false);
  const [reader, setReader] = useState<{ open: boolean; url: string; title: string }>({
    open: false,
    url: "",
    title: "",
  });

  useEffect(() => {
    const token = getStudentAuthToken();
    if (!token) {
      router.push("/student/login");
      return;
    }

    async function loadCourse() {
      try {
        setLoading(true);
        const res = await apiRequest(`/api/courses/${courseId}`);
        if (res.success && res.data) {
          setCourse(res.data);
        }
      } catch (e) {
        // Fallback remains
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [courseId, router]);

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#221D1D] font-sans flex flex-col">
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
              {course.title}
            </h1>
            <p className="text-xs text-[#77716E]">
              Syllabus Units &amp; Chapter Study Codices
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-[#E7E4E7] shadow-[0_4px_20px_rgba(34,29,29,0.04)] space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2B5B70]">
            {course.exam_body || "Official Syllabus"}
          </span>
          <h2 className="text-2xl font-serif font-black text-[#221D1D]">
            {course.title}
          </h2>
          <p className="text-sm text-[#4D433F] leading-relaxed max-w-2xl">
            {course.description}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-serif font-black text-xl text-[#221D1D]">
            Curriculum Units
          </h3>

          <div className="space-y-3">
            {course.chapters?.map((chap, idx) => (
              <div
                key={chap.id || idx}
                className="bg-white p-6 rounded-3xl border border-[#E7E4E7] shadow-[0_4px_20px_rgba(34,29,29,0.04)] hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <span className="text-xs font-bold text-[#77716E]">
                    Chapter {idx + 1}
                  </span>
                  <h4 className="text-base font-serif font-black text-[#221D1D] mt-0.5">
                    {chap.title}
                  </h4>
                  <p className="text-xs text-[#4D433F] mt-1">{chap.description}</p>
                </div>

                <button
                  onClick={() =>
                    setReader({
                      open: true,
                      url: chap.pdf_url,
                      title: chap.title,
                    })
                  }
                  className="px-5 py-2.5 rounded-full font-bold text-xs bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] transition-colors flex items-center gap-2 shrink-0 shadow-[0_2px_8px_rgba(191,175,229,0.35)] cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#221D1D]" />
                  <span>Open Codex</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {reader.open && (
        <SecurePdfReader
          isOpen={reader.open}
          pdfUrl={reader.url}
          title={reader.title}
          onClose={() => setReader({ open: false, url: "", title: "" })}
        />
      )}
    </div>
  );
}
