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
import { apiRequest, getStudentAuthToken, getStudentUser, setStudentAuthSession } from "@/lib/api";

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
          const itemObj = (res.data as any).item || res.data;
          setItem({
            id: itemObj.id || itemId,
            title: itemObj.title || "High-Yield Law Codex Pass",
            price: Number(itemObj.price) || 49,
            mrp: Number(itemObj.mrp) || 149,
            description: itemObj.description || "Specialized study codex with in-browser DRM reader access.",
          });
          if ((res.data as any).prefilledDetails) {
            setStudent((prev) => ({
              ...prev,
              ...(res.data as any).prefilledDetails,
            }));
          }
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

      const orderData = createRes.data || createRes;
      const internalOrderId = orderData.order?.id || orderData.orderId || orderData.id;
      const razorpayOrderId = orderData.order_id || orderData.razorpayOrderId || orderData.gateway_order_id;
      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || orderData.key_id;

      if (!keyId) {
        setError("Payment gateway is not configured. Please contact support.");
        setLoading(false);
        return;
      }

      const options = {
        key: keyId,
        amount: orderData.amount_paise || Math.round(finalAmount * 100),
        currency: orderData.currency || "INR",
        name: "The Law कक्षा",
        description: item.title,
        image: "/assets/logo-transparent.png",
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await apiRequest("/api/orders/verify", {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || razorpayOrderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: internalOrderId || razorpayOrderId,
              }),
            });

            if (verifyRes.success) {
              const resData = verifyRes.data || verifyRes;
              const serverStudent = resData.student || {};
              const serverToken = resData.token;
              if (serverToken) {
                setStudentAuthSession(serverToken, serverStudent);
              }
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
          color: "#BFAFE5",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setError("Payment window closed. You can retry whenever you are ready.");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (failResponse: any) {
        console.error("[Razorpay Payment Failed]", failResponse.error);
        setLoading(false);
        setError(
          failResponse.error?.description ||
            "Payment failed. Please verify your card/UPI account or try another payment method."
        );
      });
      rzp.open();
    } catch (err: any) {
      setError(err?.message || "Payment process interrupted.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#221D1D] font-sans flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E7E4E7] sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/student/explore"
            className="w-9 h-9 rounded-full border border-[#E7E4E7] bg-white hover:bg-[#F7F7F5] text-[#221D1D] flex items-center justify-center transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#4D433F]" />
          </Link>
          <div>
            <h1 className="font-serif font-black text-lg text-[#221D1D]">
              1-Click Candidate Checkout
            </h1>
            <p className="text-xs text-[#77716E]">
              Direct Unlocking Linked to Existing Hardware ID
            </p>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-xl mx-auto px-4 py-12 w-full space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-[#E7E4E7] shadow-[0_10px_40px_rgba(34,29,29,0.06)] space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2B5B70]">
              Instant Access Pass
            </span>
            <h2 className="text-2xl font-serif font-black text-[#221D1D] mt-1">
              {item.title}
            </h2>
            <p className="text-xs text-[#4D433F] mt-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-[#F4C5C0]/40 border border-[#F4C5C0] text-xs text-[#C35F3B] flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#C35F3B]" />
              <span>{error}</span>
            </div>
          )}

          {/* Student Account Snapshot */}
          <div className="p-4 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7] text-xs space-y-1.5">
            <p className="font-bold text-[#221D1D]">Enrolling Account:</p>
            <p className="text-[#4D433F]">Name: {student.name}</p>
            <p className="text-[#4D433F]">Email: {student.email}</p>
          </div>

          {/* Coupon Input */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-[#77716E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="PROMO CODE"
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono uppercase rounded-2xl border border-[#E7E4E7] bg-[#F7F7F5] focus:bg-white text-[#221D1D] focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-5 py-2 rounded-full text-xs font-bold bg-white border border-[#E7E4E7] text-[#221D1D] hover:bg-[#F7F7F5] transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
            {couponMsg && (
              <p className={`text-xs ${discount > 0 ? "text-emerald-700 font-bold" : "text-[#77716E]"}`}>
                {couponMsg}
              </p>
            )}
          </div>

          {/* Order Summary */}
          <div className="pt-4 border-t border-[#E7E4E7] space-y-2 text-sm">
            <div className="flex justify-between text-[#4D433F]">
              <span>Item MRP:</span>
              <span className="line-through text-[#77716E]">₹{item.mrp}</span>
            </div>
            <div className="flex justify-between text-[#4D433F]">
              <span>Candidate Price:</span>
              <span>₹{item.price}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Coupon Discount:</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-serif font-black text-[#221D1D] pt-2 border-t border-[#E7E4E7]">
              <span>Total Payable:</span>
              <span>₹{finalAmount}</span>
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayNow}
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-full font-bold text-sm bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] transition-all flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(191,175,229,0.35)] disabled:opacity-50 cursor-pointer active:scale-[0.98]"
          >
            <Zap className="w-4 h-4 text-[#221D1D]" />
            <span>{loading ? "Processing..." : `Pay ₹${finalAmount} & Unlock Instantly`}</span>
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#77716E]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2B5B70]" />
            <span>Secured by Razorpay • Single Device Hardware Binding</span>
          </div>
        </div>
      </main>
    </div>
  );
}
