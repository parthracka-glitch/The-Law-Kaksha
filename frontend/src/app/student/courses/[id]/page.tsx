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
    <div className="min-h-screen bg-[#FDFBF7] text-[#0B192C] font-sans flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/student"
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif font-bold text-lg text-[#0B192C]">
              {course.title}
            </h1>
            <p className="text-xs text-slate-500">
              Syllabus Units &amp; Chapter Study Codices
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
            {course.exam_body || "Official Syllabus"}
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#0B192C]">
            {course.title}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
            {course.description}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-serif font-bold text-xl text-[#0B192C]">
            Curriculum Units
          </h3>

          <div className="space-y-3">
            {course.chapters?.map((chap, idx) => (
              <div
                key={chap.id || idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-[#C5A880]/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-400">
                    Chapter {idx + 1}
                  </span>
                  <h4 className="text-base font-serif font-bold text-[#0B192C] mt-0.5">
                    {chap.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">{chap.description}</p>
                </div>

                <button
                  onClick={() =>
                    setReader({
                      open: true,
                      url: chap.pdf_url,
                      title: chap.title,
                    })
                  }
                  className="px-4 py-2.5 rounded-xl font-medium text-xs bg-[#0B192C] text-white hover:bg-[#11233D] transition-colors flex items-center gap-2 shrink-0"
                >
                  <Eye className="w-3.5 h-3.5 text-[#C5A880]" />
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
