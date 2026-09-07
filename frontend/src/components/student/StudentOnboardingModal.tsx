"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  BookOpen,
  Scale,
  Award,
  CheckCircle2,
  ArrowRight,
  Shield,
  FileText,
  Clock,
  ChevronRight,
  Check,
  Flame,
} from "lucide-react";

interface StudentOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  rollNumber: string;
}

export function StudentOnboardingModal({
  isOpen,
  onClose,
  studentName,
  rollNumber,
}: StudentOnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Welcome to The Law Kaksha Workspace",
      subtitle: "Premier CA Corporate & Economic Law Digital Academy",
      badge: "Step 1 of 4: Orientation",
      icon: <Scale className="w-6 h-6 text-[#0284C7]" />,
      content: (
        <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
          <p>
            Welcome, <strong className="text-slate-900">{studentName}</strong> (Roll: <span className="font-mono text-[#0284C7] font-semibold">{rollNumber}</span>)! Your unified learning workspace is now initialized.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="bg-sky-50/80 p-3 rounded-2xl border border-sky-100">
              <span className="text-[10px] font-bold text-[#0284C7] uppercase block mb-0.5">Bare Act Synthesis</span>
              <p className="text-[11.5px] text-slate-700">Every Companies Act &amp; Economic Law section analyzed line-by-line with ROC rules.</p>
            </div>
            <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-0.5">High-Yield DRM Reader</span>
              <p className="text-[11.5px] text-slate-700">6-page preview or full continuous vertical scroll with personal watermark protection.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "100% Fee-Refund & Ranker Policy",
      subtitle: "Study consistently and earn 100% fee cashback upon exam qualification",
      badge: "Step 2 of 4: Gamification & Refund",
      icon: <Award className="w-6 h-6 text-amber-500" />,
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            Under our <strong>Ranker Fellowship Guarantee</strong>, all enrolled students who satisfy the 3 study criteria are eligible for 100% fee reimbursement:
          </p>
          <div className="space-y-2 pt-1">
            <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-xs">Maintain a 14+ Day Study Streak</strong>
                <span className="text-[11px] text-slate-500">Log in daily and complete at least 30 minutes of video or note reading.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-xs">Submit All 8 ICAI Model Descriptive Drafts</strong>
                <span className="text-[11px] text-slate-500">Upload your handwritten answer sheets to the Mains Evaluation Desk for faculty checking.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-xs">Achieve &gt;80% in MCQ Question Bank Drills</strong>
                <span className="text-[11px] text-slate-500">Complete chapter-wise 30-mark case scenario quizzes.</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Real-Time Legal Clinic & Mentorship",
      subtitle: "Direct live doubt resolution with senior advocates & CA faculty",
      badge: "Step 3 of 4: Mentorship",
      icon: <Sparkles className="w-6 h-6 text-indigo-500" />,
      content: (
        <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
          <p>
            Whenever you encounter a tricky legal contradiction or need clarification on ROC notifications:
          </p>
          <div className="space-y-2">
            <div className="bg-sky-50/70 p-3 rounded-2xl border border-sky-100 space-y-1">
              <span className="text-[11px] font-bold text-[#0284C7] block">1. Real-Time Legal Clinic Chat</span>
              <p className="text-[11.5px] text-slate-700">Instant direct messaging with faculty on duty (Mon-Sat, 9 AM - 9 PM).</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold text-slate-800 block">2. Fallback Complex Case Query Desk</span>
              <p className="text-[11.5px] text-slate-600">Submit multi-paragraph problem statements with screenshots for line-by-line faculty feedback.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Career Board & Verified Certificate",
      subtitle: "Unlock law firm internships at 70% completion & download your credential",
      badge: "Step 4 of 4: Career & Verification",
      icon: <Shield className="w-6 h-6 text-emerald-600" />,
      content: (
        <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
          <p>
            Upon reaching <strong>70% course progress</strong>, the gated <strong>Law Firm &amp; Corporate Internship Board</strong> unlocks automatically, connecting you with opportunities at Tier-1 corporate law desks.
          </p>
          <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100 text-[11.5px] text-slate-700 space-y-1">
            <span className="font-bold text-emerald-800 block text-xs">🎓 Verified PDF Certificate with QR Code</span>
            <p className="text-slate-600">Your final Certificate of Corporate &amp; Economic Law Mastery contains a permanent verification QR code and academic seal.</p>
          </div>
        </div>
      ),
    },
  ];

  const current = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 animate-in zoom-in-95 duration-150 flex flex-col justify-between max-h-[90vh] overflow-y-auto">
        
        {/* Top Progress Indicator */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center shadow-xs">
                {current.icon}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                  {current.badge}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Stepper Dots */}
          <div className="flex gap-1.5 pt-1">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep
                    ? "w-8 bg-[#0284C7]"
                    : idx < currentStep
                    ? "w-4 bg-emerald-500"
                    : "w-4 bg-slate-200"
                }`}
              />
            ))}
          </div>

          {/* Title & Subtitle */}
          <div className="pt-2">
            <h3 className="text-lg sm:text-xl font-serif font-black text-slate-900">
              {current.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {current.subtitle}
            </p>
          </div>

          {/* Content Body */}
          <div className="pt-2">
            {current.content}
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentStep === 0
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Back
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Next Guideline</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Complete &amp; Enter Dashboard</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
