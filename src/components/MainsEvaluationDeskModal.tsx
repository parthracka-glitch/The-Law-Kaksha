"use client";

import React, { useState } from "react";
import {
  X,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Award,
  Sparkles,
  Scale,
  Clock,
  Eye,
  ChevronRight,
  Shield,
  Star,
  Check,
} from "lucide-react";

interface MainsEvaluationDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  rollNumber?: string;
}

export function MainsEvaluationDeskModal({
  isOpen,
  onClose,
  studentName = "Adv. Aryan Sharma",
  rollNumber = "LK-2026-PCSJ-0842",
}: MainsEvaluationDeskModalProps) {
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [viewEvaluation, setViewEvaluation] = useState(true);

  if (!isOpen) return null;

  const mockPrompts = [
    {
      id: "Q-MAINS-2026-01",
      title: "Doctrine of Res Sub-Judice vs Res Judicata (CPC 1908)",
      marks: "15 Marks • Word Limit: 250 Words",
      subject: "Civil Procedure Code, Sections 10 & 11",
      deadline: "Sunday, 11:59 PM",
      submissionStatus: "Evaluated",
      score: "14.0 / 15.0",
      evaluatorName: "Adv. Pearl Dsouza (Ex-Judicial Officer)",
      evaluatorComments:
        "Outstanding synthesis of the 4 statutory ingredients. Excellent distinction between stay of suit vs bar of trial. Case law citations (National Institute of Mental Health v. K. Kalyana Raman) are razor sharp.",
      pillarScores: [
        { pillar: "Statutory Accuracy & Sections", score: "3.0 / 3.0", comment: "Sec 10 & 11 CPC exact verbatim key phrases" },
        { pillar: "Leading Precedents & Citations", score: "3.0 / 3.0", comment: "Supreme Court 3-Judge Bench ratio captured" },
        { pillar: "Issue Framing & Synthesis", score: "2.5 / 3.0", comment: "Clean breakdown into sub-issues" },
        { pillar: "Doctrinal Distinction Table", score: "3.0 / 3.0", comment: "Tabular comparison was exemplary" },
        { pillar: "Judicial Conclusion & Order Format", score: "2.5 / 3.0", comment: "Strong operative drafting" },
      ],
    },
    {
      id: "Q-MAINS-2026-02",
      title: "Bharatiya Nyaya Sanhita (BNS) Sec 103 vs IPC 302 - Murder vs Culpable Homicide",
      marks: "20 Marks • Word Limit: 350 Words",
      subject: "Criminal Law / BNS 2023",
      deadline: "Next Wednesday, 06:00 PM",
      submissionStatus: "Pending Evaluation",
      score: "Under Faculty Review",
      evaluatorName: "Adv. Raghavendra Rao",
      evaluatorComments: "Submission received. Copy allocated to Criminal Law Evaluation Board.",
      pillarScores: [],
    },
  ];

  const currentQ = mockPrompts[selectedQuestion];

  const handleUploadScan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      setFileUploaded(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-sky-200 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-sky-50 border border-sky-200 text-[#0284C7]">
              <Scale className="w-5 h-5 text-[#0284C7]" />
            </span>
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900">
                Judiciary Mains Answer Evaluation &amp; Feedback Portal
              </h3>
              <p className="text-xs text-slate-500">
                Peerless 5-Pillar Rubric Assessment by Senior Advocates &amp; Former Judges
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors border border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-[#F8FAFC]">
          {/* Question Selector Bar */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {mockPrompts.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => {
                  setSelectedQuestion(idx);
                  setSubmissionSuccess(false);
                }}
                className={`p-3 rounded-xl border text-left min-w-[280px] transition-all ${
                  selectedQuestion === idx
                    ? "bg-white border-sky-300 text-slate-900 shadow-md"
                    : "bg-white/70 border-slate-200 hover:border-sky-200 text-slate-600"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-mono text-[#0284C7] font-bold">{q.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      q.submissionStatus === "Evaluated"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {q.submissionStatus}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 line-clamp-1">{q.title}</p>
                <p className="text-[10px] text-slate-500 mt-1">{q.subject}</p>
              </button>
            ))}
          </div>

          {/* Active Question Prompt Details */}
          <div className="p-5 rounded-2xl bg-white border border-sky-100 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
                Target Question Prompt
              </span>
              <span className="text-xs text-slate-500 font-mono">{currentQ.marks}</span>
            </div>
            <h4 className="text-sm sm:text-base font-serif font-bold text-slate-900 leading-relaxed">
              &quot;Distinguish between the Doctrine of Res Sub-Judice (Section 10 CPC) and Res Judicata (Section 11 CPC). Illustrate with Supreme Court precedents whether an interlocutory order can operate as Res Judicata in subsequent stages of the same suit.&quot;
            </h4>
          </div>

          {/* Evaluated Copy Results (If evaluated) */}
          {currentQ.submissionStatus === "Evaluated" && (
            <div className="space-y-6">
              {/* Scorecard Hero */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-50 via-white to-sky-50 border border-sky-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center md:text-left">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                    ★ EVALUATED ANSWER COPY
                  </span>
                  <h4 className="text-xl font-serif font-black text-slate-900">
                    Marks Awarded: <span className="text-[#0284C7]">{currentQ.score}</span>
                  </h4>
                  <p className="text-xs text-slate-600">
                    Evaluated by <strong className="text-slate-900">{currentQ.evaluatorName}</strong> • Benchmark: Top 2% in All-India Batch
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-3 rounded-xl bg-white border border-sky-100 shadow-xs text-center">
                    <p className="text-[10px] text-[#0284C7] uppercase font-semibold">Percentile</p>
                    <p className="text-lg font-black text-slate-900">98.4th</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-sky-100 shadow-xs text-center">
                    <p className="text-[10px] text-[#0284C7] uppercase font-semibold">Time to Eval</p>
                    <p className="text-lg font-black text-slate-900">18 Hrs</p>
                  </div>
                </div>
              </div>

              {/* 5-Pillar Rubric Breakdown Table */}
              <div className="p-5 rounded-2xl bg-white border border-sky-100 shadow-sm space-y-4">
                <h5 className="text-xs font-bold text-[#0284C7] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0284C7]" />
                  Law Kaksha 5-Pillar Score Breakdown
                </h5>

                <div className="space-y-2.5">
                  {currentQ.pillarScores.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-sky-50/40 border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900">{item.pillar}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5">{item.comment}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-white text-[#0284C7] font-mono text-xs font-bold border border-sky-200 shadow-xs shrink-0">
                        {item.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Faculty Remarks */}
              <div className="p-4 rounded-xl bg-white border border-sky-100 shadow-sm text-xs text-slate-700 leading-relaxed">
                <strong className="text-[#0284C7] block mb-1">Detailed Faculty Feedback:</strong>
                {currentQ.evaluatorComments}
              </div>
            </div>
          )}

          {/* Submission Form (If submitting fresh answer) */}
          {currentQ.submissionStatus !== "Evaluated" && (
            <div className="p-6 rounded-2xl bg-white border border-sky-100 shadow-sm space-y-4">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#0284C7]" />
                Upload Handwritten Answer Sheet (PDF / JPEG Scan)
              </h5>
              <p className="text-xs text-slate-600">
                Write your answer on standard A4 ruled paper, scan with your phone, and upload here. Maximum file size: 15 MB.
              </p>

              {submissionSuccess ? (
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-900">Answer Copy Submitted Successfully!</p>
                  <p className="text-xs text-slate-600">
                    Your copy has been queued for evaluation. You will receive an SMS and dashboard alert once graded within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleUploadScan} className="space-y-4">
                  <div className="border-2 border-dashed border-sky-200 hover:border-[#0284C7] rounded-2xl p-8 text-center bg-slate-50 transition-colors cursor-pointer group">
                    <Upload className="w-8 h-8 text-[#0284C7] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-bold text-slate-900">
                      Click to Browse or Drag &amp; Drop Handwritten PDF Scan
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      File format: PDF, JPG, PNG up to 15MB
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>Confidential Evaluation • Only assigned judge will review</span>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] hover:brightness-105 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all"
                    >
                      {isSubmitting ? "Uploading & Encrypting..." : "Submit for Faculty Evaluation"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
