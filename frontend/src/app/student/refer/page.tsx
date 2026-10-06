"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Share2,
  Copy,
  Check,
  Gift,
  Users,
  Award,
  ArrowLeft,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { apiRequest, getStudentAuthToken, getStudentUser } from "@/lib/api";

interface ReferralData {
  referralCode: string;
  referralUrl: string;
  totalInvited: number;
  successfulReferrals: number;
  rewardDaysEarned: number;
}

export default function StudentReferPage() {
  const router = useRouter();
  const [data, setData] = useState<ReferralData>({
    referralCode: "LAWCA2026",
    referralUrl: "https://thelawkaksha.com?ref=LAWCA2026",
    totalInvited: 3,
    successfulReferrals: 1,
    rewardDaysEarned: 15,
  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchReferral() {
      const token = getStudentAuthToken();
      if (!token) {
        router.push("/student/login");
        return;
      }

      try {
        setLoading(true);
        const res = await apiRequest<ReferralData>("/api/student/refer");
        if (res.success && res.data) {
          if (isMounted) setData(res.data);
        }
      } catch (e) {
        // Fallback remains
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchReferral();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = encodeURIComponent(
    `Hey! I am preparing for CA Foundation / CSEET Business Laws on The Law Kaksha. Join with my invite link to get an instant discount on your monthly pass: ${data.referralUrl}`
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0B192C] font-sans flex flex-col">
      {/* Header */}
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
              Refer &amp; Earn Rewards
            </h1>
            <p className="text-xs text-slate-500">
              Invite Peers &amp; Earn Extended Free Access Days
            </p>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-br from-[#0B192C] to-[#11233D] text-white p-8 sm:p-10 rounded-3xl border border-[#C5A880]/30 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#C5A880]/20 text-[#E5D0B5] border border-[#C5A880]/30">
              <Gift className="w-3.5 h-3.5 text-[#C5A880]" />
              Peer Invite Program
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#FDFBF7]">
              Give 15% Off, Get 15 Free Days
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              When fellow commerce law aspirants enroll using your personal invite link, they get 15% off their subscription pass, and your active entitlement is extended by 15 days automatically!
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-3">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-3xl font-serif font-bold text-[#0B192C]">{data.totalInvited}</p>
            <p className="text-xs text-slate-500 mt-1">Friends Invited</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Check className="w-5 h-5" />
            </div>
            <p className="text-3xl font-serif font-bold text-[#0B192C]">{data.successfulReferrals}</p>
            <p className="text-xs text-slate-500 mt-1">Successful Enrolments</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-10 h-10 rounded-xl bg-[#C5A880]/15 text-[#0B192C] flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-5 h-5 text-[#C5A880]" />
            </div>
            <p className="text-3xl font-serif font-bold text-[#0B192C]">+{data.rewardDaysEarned} Days</p>
            <p className="text-xs text-slate-500 mt-1">Free Access Added</p>
          </div>
        </div>

        {/* Personal Invite Link Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-lg text-[#0B192C]">
            Your Shareable Referral Link
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full bg-[#FDFBF7] border border-slate-200 rounded-xl px-4 py-3 font-mono text-xs sm:text-sm text-slate-700 select-all overflow-x-auto">
              {data.referralUrl}
            </div>

            <button
              onClick={handleCopy}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shrink-0 ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-[#0B192C] text-white hover:bg-[#11233D]"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          {/* Social Share */}
          <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
            <a
              href={`https://api.whatsapp.com/send?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors text-xs font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
