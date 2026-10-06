"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { apiRequest } from "@/lib/api";
import {
  CheckCircle2,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Clock,
  Sparkles,
  Download,
  Calendar,
} from "lucide-react";

export default function OrderSuccessPage() {
  const params = useParams();
  const orderNo = (params?.orderNo as string) || "LK-ORD-RECENT";
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchOrder() {
      try {
        const res = await apiRequest(`/api/orders/${orderNo}`);
        if (res.success && res.data) {
          if (isMounted) setOrder(res.data);
        }
      } catch (e) {
        // Fallback to minimal state
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchOrder();
    return () => {
      isMounted = false;
    };
  }, [orderNo]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0B192C] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-16 w-full">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-6 relative overflow-hidden">
          {/* Subtle gold glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#C5A880]/15 rounded-full blur-2xl pointer-events-none" />

          {/* Success Check Icon */}
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0B192C] bg-[#C5A880]/20 px-3.5 py-1 rounded-full border border-[#C5A880]/40">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              Booking Confirmed • DRM Activated
            </span>
            <h1 className="text-3xl font-serif font-bold text-[#0B192C]">
              Welcome to The Law Kaksha!
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your subscription pass has been successfully verified. In-browser DRM codex access has been granted to your account.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-[#FDFBF7] border border-slate-200 rounded-2xl p-6 text-left space-y-3.5 text-xs sm:text-sm">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
              <span className="text-slate-500">Order Reference:</span>
              <span className="font-mono font-bold text-[#0B192C]">{orderNo}</span>
            </div>

            {order?.personalDetails?.fullName && (
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-semibold text-[#0B192C]">{order.personalDetails.fullName}</span>
              </div>
            )}

            {order?.personalDetails?.email && (
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
                <span className="text-slate-500">Registered Email:</span>
                <span className="font-semibold text-[#0B192C]">{order.personalDetails.email}</span>
              </div>
            )}

            {order?.total_amount && (
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
                <span className="text-slate-500">Total Paid:</span>
                <span className="font-bold text-[#0B192C]">₹{order.total_amount}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Hardware DRM Security:</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Active Device Protection
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-3 pt-2">
            <Link
              href="/student/login"
              className="w-full py-4 rounded-xl bg-[#0B192C] hover:bg-[#11233D] text-white font-medium text-sm sm:text-base shadow-lg shadow-[#0B192C]/20 flex items-center justify-center gap-2 transition-all"
            >
              <BookOpen className="w-4 h-4 text-[#C5A880]" />
              <span>Go to Student Dashboard &amp; Open Codices</span>
              <ArrowRight className="w-4 h-4 text-[#C5A880]" />
            </Link>

            <Link
              href="/"
              className="inline-block text-xs font-semibold text-slate-500 hover:text-[#0B192C] pt-2"
            >
              Return to Website Homepage
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
