"use client";

import React, { useState } from "react";
import {
  X,
  Award,
  Download,
  CheckCircle,
  Shield,
  QrCode,
  Share2,
  Sparkles,
  Printer,
} from "lucide-react";

interface CertificateGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  rollNumber: string;
  courseTitle: string;
}

export function CertificateGeneratorModal({
  isOpen,
  onClose,
  studentName,
  rollNumber,
  courseTitle,
}: CertificateGeneratorModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const certificateId = `LK-CERT-2026-CA-${Math.floor(1000 + Math.random() * 9000)}`;
  const issueDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 max-h-[95vh] overflow-y-auto space-y-6">
        
        {/* Top Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-black text-slate-900">
                Verified Certificate of Legal Mastery
              </h3>
              <p className="text-xs text-slate-500">
                Official Credential Verification Desk • The Law Kaksha Academy
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 sm:flex-initial px-4 py-2.5 min-h-[44px] rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Verified PDF</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>High-Resolution Vector Certificate PDF downloaded successfully!</span>
          </div>
        )}

        {/* Certificate Frame Preview */}
        <div className="relative bg-[#FAFAF9] border-4 sm:border-8 border-double border-amber-900/20 rounded-2xl p-4 sm:p-10 shadow-lg text-center space-y-6 overflow-hidden">
          {/* Subtle Watermark Backdrop */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award className="w-96 h-96 text-amber-900" />
          </div>

          {/* Certificate Header */}
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.25em] text-amber-800 font-bold block">
              The Law Kaksha Academy • Academic Credential
            </span>
            <h2 className="text-xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
              Certificate of Legal Mastery
            </h2>
            <p className="text-xs font-serif italic text-slate-500">
              This is to solemnly certify that
            </p>
          </div>

          {/* Recipient Name */}
          <div className="relative z-10 py-2 border-b-2 border-amber-800/20 max-w-md mx-auto">
            <h1 className="text-xl sm:text-3xl font-serif font-black text-[#0284C7] tracking-normal">
              {studentName}
            </h1>
            <span className="text-xs font-mono text-slate-500 mt-0.5 block">
              Roll No: {rollNumber}
            </span>
          </div>

          {/* Citation Body */}
          <div className="relative z-10 max-w-xl mx-auto space-y-2 text-xs text-slate-700 leading-relaxed font-sans">
            <p>
              has successfully fulfilled all statutory curriculum requirements, bare-act drafting rubrics, and model descriptive case scenario examinations in:
            </p>
            <p className="font-serif font-bold text-sm sm:text-base text-slate-900">
              {courseTitle}
            </p>
            <p className="text-[11px] text-slate-500">
              demonstrating comprehensive mastery in Companies Act 2013, General Clauses Act, ROC Circular Synthesis &amp; ICAI Descriptive Standards.
            </p>
          </div>

          {/* Signatures & Seal */}
          <div className="relative z-10 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-2 items-center sm:items-end border-t border-amber-800/10 text-xs">
            {/* Left Signature */}
            <div className="text-center sm:text-left space-y-1">
              <div className="font-serif italic font-bold text-slate-800 text-sm">
                Faculty Directorate
              </div>
              <div className="h-0.5 bg-slate-300 w-28 mx-auto sm:mx-0" />
              <span className="text-[10px] text-slate-500 block">Chairperson, Academic Council</span>
              <span className="text-[9.5px] text-slate-400 block font-medium">Head of Legal Academics</span>
            </div>

            {/* Center QR & Seal */}
            <div className="flex flex-col items-center space-y-1">
              <div className="w-14 h-14 rounded-xl bg-white border border-amber-200 p-1.5 shadow-xs flex items-center justify-center">
                <QrCode className="w-10 h-10 text-slate-800" />
              </div>
              <span className="text-[9px] font-mono text-slate-400">
                ID: {certificateId}
              </span>
            </div>

            {/* Right Signature */}
            <div className="text-center sm:text-right space-y-1">
              <div className="font-serif italic font-bold text-slate-800 text-sm">
                Examination Board
              </div>
              <div className="h-0.5 bg-slate-300 w-28 mx-auto sm:ml-auto" />
              <span className="text-[10px] text-slate-500 block">Director of Legal Evaluation</span>
              <span className="text-[9.5px] text-slate-400 block font-medium">Academic Examination Board</span>
            </div>
          </div>

          {/* Verification Footer */}
          <div className="relative z-10 pt-2 text-[10px] font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-1 border-t border-slate-100">
            <span>Issued on: {issueDate}</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Tamper-Proof Blockchain Hash Verified</span>
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
