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
  Sparkles,
} from "lucide-react";

interface OrderPersonalDetails {
  fullName?: string;
  email?: string;
}

interface OrderItem {
  id?: string;
  title?: string;
  name?: string;
  price?: number;
}

interface OrderRecord {
  id?: string;
  orderId?: string;
  customer_name?: string;
  customerName?: string;
  studentName?: string;
  customer_email?: string;
  customerEmail?: string;
  studentEmail?: string;
  personalDetails?: OrderPersonalDetails;
  total_amount?: number;
  amount?: number;
  total?: number;
  item?: string;
  activePlanTitle?: string;
  items?: OrderItem[];
}

interface OrderApiPayload extends OrderRecord {
  order?: OrderRecord;
}

export default function OrderSuccessPage() {
  const params = useParams();
  const orderNo = (params?.orderNo as string) || "LK-ORD-RECENT";
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // 1. Immediately hydrate from localStorage for zero latency
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("lawkaksha_last_order");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && isMounted) {
            setOrder(parsed);
          }
        }
      } catch (err) {
        console.warn("Failed reading cached order:", err);
      }
    }

    // 2. Fetch official order from backend if available
    async function fetchOrder() {
      try {
        const res = await apiRequest<OrderApiPayload>(`/api/orders/${orderNo}`);
        if (res.success && res.data) {
          const orderObj = res.data.order || res.data;
          if (isMounted) setOrder((prev) => ({ ...prev, ...orderObj }));
        }
      } catch {
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

  const studentName =
    order?.customer_name ||
    order?.customerName ||
    order?.studentName ||
    order?.personalDetails?.fullName ||
    "Enrolled Student";

  const studentEmail =
    order?.customer_email ||
    order?.customerEmail ||
    order?.studentEmail ||
    order?.personalDetails?.email;

  const totalPaid =
    typeof order?.total_amount === "number"
      ? order.total_amount
      : typeof order?.amount === "number"
      ? order.amount
      : typeof order?.total === "number"
      ? order.total
      : 1;

  let courseTitle = "CA Foundation Business Laws Master Codex";
  if (Array.isArray(order?.items) && order.items.length > 0) {
    courseTitle = order.items.map((i) => i.title || i.name || "Course").join(", ");
  } else if (order?.activePlanTitle) {
    courseTitle = String(order.activePlanTitle);
  } else if (order?.item) {
    courseTitle = String(order.item);
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#221D1D] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-16 w-full">
        <div className="bg-white border border-[#E7E4E7] rounded-3xl md:rounded-[2.5rem] p-8 sm:p-12 shadow-[0_10px_40px_rgba(34,29,29,0.08)] text-center space-y-6 relative overflow-hidden">
          {/* Subtle pastel glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#AED7E9]/30 rounded-full blur-2xl pointer-events-none" />

          {/* Success Check Icon */}
          <div className="w-20 h-20 bg-[#C4E1EC] text-[#221D1D] rounded-full flex items-center justify-center mx-auto border-2 border-[#AED7E9] shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#221D1D] bg-[#C4E1EC] px-3.5 py-1 rounded-full border border-[#AED7E9]">
              <Sparkles className="w-3.5 h-3.5 text-[#221D1D]" />
              Booking Confirmed • DRM Activated
            </span>
            <h1 className="text-3xl font-serif font-black text-[#221D1D]">
              Welcome to The Law Kaksha!
            </h1>
            <p className="text-sm text-[#4D433F] max-w-md mx-auto">
              Your subscription pass has been successfully verified. In-browser DRM codex access has been granted to your account.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-[#F7F7F5] border border-[#E7E4E7] rounded-3xl p-6 text-left space-y-3.5 text-xs sm:text-sm">
            <div className="flex justify-between items-center pb-2.5 border-b border-[#E7E4E7]">
              <span className="text-[#77716E]">Order Reference:</span>
              <span className="font-mono font-bold text-[#221D1D]">{orderNo}</span>
            </div>

            <div className="flex justify-between items-center pb-2.5 border-b border-[#E7E4E7]">
              <span className="text-[#77716E]">Enrolled Course / Codex:</span>
              <span className="font-bold text-[#221D1D] text-right">{courseTitle}</span>
            </div>

            {studentName && (
              <div className="flex justify-between items-center pb-2.5 border-b border-[#E7E4E7]">
                <span className="text-[#77716E]">Student Name:</span>
                <span className="font-bold text-[#221D1D]">{studentName}</span>
              </div>
            )}

            {studentEmail && (
              <div className="flex justify-between items-center pb-2.5 border-b border-[#E7E4E7]">
                <span className="text-[#77716E]">Registered Email:</span>
                <span className="font-bold text-[#221D1D]">{studentEmail}</span>
              </div>
            )}

            <div className="flex justify-between items-center pb-2.5 border-b border-[#E7E4E7]">
              <span className="text-[#77716E]">Total Paid:</span>
              <span className="font-black text-[#221D1D]">₹{totalPaid}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#77716E]">Hardware DRM Security:</span>
              <span className="font-bold text-[#221D1D] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#4B8097]" />
                Active Device Protection
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-3 pt-2">
            <Link
              href="/student"
              className="w-full py-4 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] font-bold text-sm sm:text-base shadow-[0_2px_8px_rgba(191,175,229,0.35)] flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#221D1D]" />
              <span>Go to Student Dashboard &amp; Open Codices</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            <Link
              href="/"
              className="inline-block text-xs font-bold text-[#77716E] hover:text-[#221D1D] pt-2 transition-colors"
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
