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
  studentName = "Enrolled Candidate",
  rollNumber = "LK-2026-CA-0842",
}: MainsEvaluationDeskModalProps) {
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [viewEvaluation, setViewEvaluation] = useState(true);

  if (!isOpen) return null;

  const mockPrompts = [
    {
      id: "Q-CA-LAW-MTP-01",
      title: "Section 185 (Loans to Directors) vs Section 186 (Loans & Investments by Company)",
      marks: "14 Marks • Word Limit: 300 Words",
      subject: "Companies Act 2013, Chapter XII (Meetings of Board & Powers)",
      deadline: "Sunday, 11:59 PM",
      submissionStatus: "Evaluated",
      score: "13.5 / 14.0",
      evaluatorName: "Faculty Directorate (Corporate Law Evaluator)",
      evaluatorComments:
        "Outstanding legal drafting! Excellent 4-point structure: (1) Applicable provisions & statutory prohibitions, (2) Board resolution vs Special Resolution requirements, (3) Exemption clauses for MD/WTD schemes, and (4) Penalties under Sec 185(4). Model ICAI presentation.",
      pillarScores: [
        { pillar: "Statutory Accuracy & Sections", score: "3.0 / 3.0", comment: "Exact verbatim sub-sections cited (185(1), (2) & (3))" },
        { pillar: "ICAI Drafting Format & Structuring", score: "3.0 / 3.0", comment: "Clean step-by-step conclusion" },
        { pillar: "ROC & MCA Circular Synthesis", score: "2.5 / 3.0", comment: "Covered MCA general circulars on wholly-owned subsidiaries" },
        { pillar: "Tabular Comparative Distinctions", score: "2.5 / 2.5", comment: "Section 185 vs 186 side-by-side table was brilliant" },
        { pillar: "Operative Advice & Penalty Calculation", score: "2.5 / 2.5", comment: "Accurate calculation of maximum penalty limits" },
      ],
    },
    {
      id: "Q-CA-LAW-MTP-02",
      title: "Section 135 CSR Spending Thresholds & Treatment of Unspent CSR Account",
      marks: "10 Marks • Word Limit: 200 Words",
      subject: "Companies Act 2013, Section 135 & Companies (CSR Policy) Rules",
      deadline: "Next Wednesday, 06:00 PM",
      submissionStatus: "Pending Evaluation",
      score: "Under Faculty Review",
      evaluatorName: "Law Faculty Review Board",
      evaluatorComments: "Submission received. Copy assigned to Corporate Law Evaluation Desk.",
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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-black/[0.08] w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 sm:px-8 py-4 bg-white/90 backdrop-blur-md border-b border-black/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0071E3]/10 flex items-center justify-center text-[#0071E3]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1D1D1F] tracking-tight">
                Mains Answer Evaluation &amp; Feedback
              </h3>
              <p className="text-xs text-[#86868B]">
                5-Pillar Rubric Assessment by Senior Advocates &amp; Faculty
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] flex items-center justify-center transition-all active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 bg-[#FBFBFD]">
          {/* Question Selector Bar */}
          <div className="flex gap-3 overflow-x-auto pb-1">
            {mockPrompts.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => {
                  setSelectedQuestion(idx);
                  setSubmissionSuccess(false);
                }}
                className={`p-4 rounded-2xl border text-left min-w-[280px] transition-all ${
                  selectedQuestion === idx
                    ? "bg-white border-[#0071E3] shadow-sm text-[#1D1D1F]"
                    : "bg-[#F5F5F7] border-transparent hover:border-black/[0.08] text-[#86868B]"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-mono text-[#0071E3] font-semibold">{q.id}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                      q.submissionStatus === "Evaluated"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {q.submissionStatus}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#1D1D1F] line-clamp-1">{q.title}</p>
                <p className="text-[10px] text-[#86868B] mt-1">{q.subject}</p>
              </button>
            ))}
          </div>

          {/* Active Question Prompt Details */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-black/[0.06] shadow-sm space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">
                Target Question Prompt
              </span>
              <span className="text-xs text-[#86868B] font-mono">{currentQ.marks}</span>
            </div>
            <h4 className="text-sm sm:text-base font-medium text-[#1D1D1F] leading-relaxed">
              &quot;Distinguish between the Doctrine of Res Sub-Judice (Section 10 CPC) and Res Judicata (Section 11 CPC). Illustrate with Supreme Court precedents whether an interlocutory order can operate as Res Judicata in subsequent stages of the same suit.&quot;
            </h4>
          </div>

          {/* Evaluated Copy Results (If evaluated) */}
          {currentQ.submissionStatus === "Evaluated" && (
            <div className="space-y-6">
              {/* Scorecard Hero */}
              <div className="p-6 rounded-2xl bg-[#F5F5F7] border border-black/[0.06] flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center md:text-left">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                    ★ Evaluated Answer Copy
                  </span>
                  <h4 className="text-xl font-bold text-[#1D1D1F] tracking-tight">
                    Marks Awarded: <span className="text-[#0071E3]">{currentQ.score}</span>
                  </h4>
                  <p className="text-xs text-[#86868B]">
                    Evaluated by <strong className="text-[#1D1D1F] font-semibold">{currentQ.evaluatorName}</strong> • Benchmark: Top Score Range
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-4 py-3 rounded-2xl bg-white border border-black/[0.06] shadow-sm text-center">
                    <p className="text-[10px] text-[#86868B] uppercase font-semibold">Percentile</p>
                    <p className="text-lg font-bold text-[#1D1D1F]">98.4th</p>
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-white border border-black/[0.06] shadow-sm text-center">
                    <p className="text-[10px] text-[#86868B] uppercase font-semibold">Turnaround</p>
                    <p className="text-lg font-bold text-[#1D1D1F]">18 Hrs</p>
                  </div>
                </div>
              </div>

              {/* 5-Pillar Rubric Breakdown Table */}
              <div className="p-6 rounded-2xl bg-white border border-black/[0.06] shadow-sm space-y-4">
                <h5 className="text-xs font-semibold text-[#86868B] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0071E3]" />
                  5-Pillar Evaluation Rubric
                </h5>

                <div className="space-y-2.5">
                  {currentQ.pillarScores.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-black/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <p className="text-xs font-semibold text-[#1D1D1F]">{item.pillar}</p>
                        <p className="text-[11px] text-[#86868B] mt-0.5">{item.comment}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white text-[#0071E3] font-mono text-xs font-bold shadow-sm shrink-0">
                        {item.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Faculty Remarks */}
              <div className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-sm text-xs text-[#1D1D1F] leading-relaxed">
                <strong className="text-[#0071E3] block mb-1 font-semibold">Detailed Faculty Feedback:</strong>
                {currentQ.evaluatorComments}
              </div>
            </div>
          )}

          {/* Submission Form (If submitting fresh answer) */}
          {currentQ.submissionStatus !== "Evaluated" && (
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-black/[0.06] shadow-sm space-y-4">
              <h5 className="text-xs font-semibold text-[#1D1D1F] uppercase tracking-wider flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#0071E3]" />
                Upload Handwritten Answer Sheet (PDF / JPEG Scan)
              </h5>
              <p className="text-xs text-[#86868B]">
                Write your answer on standard A4 ruled paper, scan with your phone, and upload here. Maximum file size: 15 MB.
              </p>

              {submissionSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                  <p className="text-sm font-bold text-[#1D1D1F]">Answer Copy Submitted Successfully!</p>
                  <p className="text-xs text-[#86868B]">
                    Your copy has been queued for evaluation. You will receive an alert once graded within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleUploadScan} className="space-y-4">
                  <div className="border border-dashed border-black/[0.15] hover:border-[#0071E3] rounded-2xl p-8 text-center bg-[#F5F5F7] transition-colors cursor-pointer group">
                    <Upload className="w-8 h-8 text-[#0071E3] mx-auto mb-2 group-hover:scale-105 transition-transform" />
                    <p className="text-xs font-semibold text-[#1D1D1F]">
                      Click to Browse or Drag &amp; Drop Handwritten PDF Scan
                    </p>
                    <p className="text-[10px] text-[#86868B] mt-1">
                      File format: PDF, JPG, PNG up to 15MB
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-[11px] text-[#86868B] flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-[#0071E3]" />
                      <span>Confidential Evaluation • Assigned faculty review only</span>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-50 text-white font-medium text-xs shadow-sm transition-all active:scale-[0.98]"
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
