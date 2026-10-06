"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Tag,
  Check,
} from "lucide-react";
import { apiRequest, getStudentAuthToken, getStudentUser } from "@/lib/api";

const loadRazorpayCheckoutScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function StudentDirectCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const itemType = (params?.itemType as string) || "extra_course";
  const itemId = (params?.itemId as string) || "course-contract-crash";

  const [item, setItem] = useState<{
    id: string;
    title: string;
    price: number;
    mrp: number;
    description: string;
  }>({
    id: itemId,
    title: "High-Yield Law Codex Pass",
    price: 49,
    mrp: 149,
    description: "Specialized study codex with in-browser DRM reader access.",
  });

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Student details
  const [student, setStudent] = useState({
    name: "Aspirant",
    email: "student@example.com",
    phone: "+91 98765 43210",
  });

  useEffect(() => {
    const token = getStudentAuthToken();
    if (!token) {
      router.push("/student/login");
      return;
    }

    const user = getStudentUser();
    if (user) {
      setStudent({
        name: user.name || "Aspirant",
        email: user.email || "student@example.com",
        phone: user.phone || "+91 98765 43210",
      });
    }

    // Fetch item details
    async function loadItem() {
      try {
        const res = await apiRequest(`/api/student/checkout-item/${itemType}/${itemId}`);
        if (res.success && res.data) {
          setItem(res.data);
        }
      } catch (e) {
        // Fallback remains
      }
    }
    loadItem();
  }, [itemType, itemId, router]);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      const res = await apiRequest("/api/coupons/validate", {
        method: "POST",
        body: JSON.stringify({
          coupon_code: couponCode,
          order_amount: item.price,
        }),
      });

      if (res.success && res.data?.discount_amount) {
        setDiscount(res.data.discount_amount);
        setCouponMsg(`Coupon applied: ₹${res.data.discount_amount} saved!`);
      } else {
        setDiscount(0);
        setCouponMsg(res.message || "Invalid coupon code.");
      }
    } catch (e: any) {
      setCouponMsg("Failed to validate coupon.");
    }
  };

  const finalAmount = Math.max(1, item.price - discount);

  const handlePayNow = async () => {
    setLoading(true);
    setError(null);

    const scriptLoaded = await loadRazorpayCheckoutScript();
    if (!scriptLoaded) {
      setError("Unable to load Razorpay payment gateway.");
      setLoading(false);
      return;
    }

    try {
      const createRes = await apiRequest("/api/orders/create", {
        method: "POST",
        body: JSON.stringify({
          items: [
            {
              id: item.id,
              title: item.title,
              price: item.price,
              format: "pdf",
              quantity: 1,
            },
          ],
          shippingDetails: student,
          couponCode: discount > 0 ? couponCode : null,
        }),
      });

      if (!createRes.success || !createRes.data) {
        setError(createRes.message || "Could not initiate payment order.");
        setLoading(false);
        return;
      }

      const orderData = createRes.data;
      const orderId = orderData.orderId || orderData.id;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: Math.round(finalAmount * 100),
        currency: "INR",
        name: "The Law Kaksha",
        description: item.title,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await apiRequest("/api/orders/verify", {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderId,
              }),
            });

            if (verifyRes.success) {
              router.push("/student/resources");
            } else {
              setError("Payment verification failed.");
            }
          } catch (err: any) {
            setError(err.message || "Verification error.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: student.name,
          email: student.email,
          contact: student.phone,
        },
        theme: {
          color: "#0B192C",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err?.message || "Payment process interrupted.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0B192C] font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/student/explore"
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif font-bold text-lg text-[#0B192C]">
              1-Click Candidate Checkout
            </h1>
            <p className="text-xs text-slate-500">
              Direct Unlocking Linked to Existing Hardware ID
            </p>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-xl mx-auto px-4 py-12 w-full space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
              Instant Access Pass
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#0B192C] mt-1">
              {item.title}
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Student Account Snapshot */}
          <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-slate-200 text-xs space-y-1.5">
            <p className="font-semibold text-[#0B192C]">Enrolling Account:</p>
            <p className="text-slate-600">Name: {student.name}</p>
            <p className="text-slate-600">Email: {student.email}</p>
          </div>

          {/* Coupon Input */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="PROMO CODE"
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono uppercase rounded-xl border border-slate-200 focus:outline-none focus:border-[#C5A880]"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Apply
              </button>
            </div>
            {couponMsg && (
              <p className={`text-xs ${discount > 0 ? "text-emerald-600 font-medium" : "text-slate-500"}`}>
                {couponMsg}
              </p>
            )}
          </div>

          {/* Order Summary */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Item MRP:</span>
              <span className="line-through">₹{item.mrp}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Candidate Price:</span>
              <span>₹{item.price}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Coupon Discount:</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-serif font-bold text-[#0B192C] pt-2 border-t border-slate-200">
              <span>Total Payable:</span>
              <span>₹{finalAmount}</span>
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayNow}
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl font-medium text-sm bg-[#0B192C] text-white hover:bg-[#11233D] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0B192C]/20 disabled:opacity-50"
          >
            <Zap className="w-4 h-4 text-[#C5A880]" />
            <span>{loading ? "Processing..." : `Pay ₹${finalAmount} & Unlock Instantly`}</span>
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Secured by Razorpay • Single Device Hardware Binding</span>
          </div>
        </div>
      </main>
    </div>
  );
}
