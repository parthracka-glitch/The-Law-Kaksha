"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { apiRequest, setAuthSession, getActiveUser } from "@/lib/api";
import { getOrCreateDeviceId, getDeviceFriendlyName } from "@/utils/deviceHelper";
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
} from "lucide-react";

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

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    cartTotal,
    cartSubtotal,
    couponCode,
    couponDiscount,
    clearCart,
    setLastOrderDetails,
  } = useCart();

  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    phone: "",
    exam: "CA Foundation Paper 2: Business Laws",
  });

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Auto-fill student session if logged in
  useEffect(() => {
    const user = getActiveUser();
    if (user) {
      setStudentData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        exam: user.target_exam || prev.exam,
      }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const completeEnrollment = (verifyRes: any, orderId: string, finalAmount: number) => {
    const serverOrder = verifyRes?.data?.order || { id: orderId, total_amount: finalAmount };
    const student = verifyRes?.data?.student;
    const newlyUnlocked = verifyRes?.data?.unlockedItemIds || [];

    // Fallback unlocked IDs calculation
    const fallbackUnlocked: string[] = [...newlyUnlocked];
    items.forEach((item) => {
      if (item.id === "ca-book-vol-1" || item.id === "book-vol-1" || item.id === "prod-vol1") {
        fallbackUnlocked.push("book-vol-1");
      } else if (item.id === "ca-book-vol-2" || item.id === "book-vol-2" || item.id === "prod-vol2") {
        fallbackUnlocked.push("book-vol-2");
      } else if (item.id === "prod-combo") {
        fallbackUnlocked.push("book-vol-1");
        fallbackUnlocked.push("book-vol-2");
      } else {
        fallbackUnlocked.push(item.id);
      }
    });

    let priorUnlocked: string[] = [];
    const savedStudent = getActiveUser();
    if (savedStudent && Array.isArray(savedStudent.unlockedItemIds)) {
      priorUnlocked = savedStudent.unlockedItemIds;
    }
    const combinedUnlocked = Array.from(new Set([...priorUnlocked, ...fallbackUnlocked]));

    const rollNumber =
      student?.student_id ||
      (studentData.exam.includes("CSEET") ? "LRK-2026-009821" : "LRK-2026-004182");

    // Save student session & entitlements
    if (typeof window !== "undefined") {
      const studentSession = {
        id: rollNumber,
        name: student?.name || studentData.name,
        rollNumber: rollNumber,
        student_id: rollNumber,
        email: student?.email || studentData.email,
        phone: studentData.phone,
        targetExam: studentData.exam,
        activePlanTitle: items.map((i) => i.title).join(" + "),
        unlockedItemIds: combinedUnlocked,
        streakDays: 14,
        todayMinutes: 40,
        todayGoalMinutes: 45,
        examCountdownDays: 68,
        avatarInitials: (student?.name || studentData.name).slice(0, 2).toUpperCase(),
      };
      setAuthSession(verifyRes?.token || `token_${Date.now()}`, studentSession);

      // Save to admin subscriptions
      const adminSubEntry = {
        id: `LK-SUB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        studentName: student?.name || studentData.name,
        studentRoll: rollNumber,
        email: student?.email || studentData.email,
        phone: studentData.phone || "+91 98765 43210",
        item: items.map((i) => i.title).join(", "),
        targetExam: studentData.exam,
        amount: `₹${finalAmount}`,
        date: "Just now",
        paymentMode: "Razorpay Standard Checkout",
        accessStatus: "Active",
      };

      const existingAdminSubs = localStorage.getItem("lawkaksha_admin_subs");
      const parsedAdminSubs = existingAdminSubs ? JSON.parse(existingAdminSubs) : [];
      localStorage.setItem("lawkaksha_admin_subs", JSON.stringify([adminSubEntry, ...parsedAdminSubs]));

      localStorage.removeItem("lawkaksha_admin_orders");
    }

    setLastOrderDetails(serverOrder);
    setCompletedOrder({
      ...serverOrder,
      items,
      unlockedItemIds: combinedUnlocked,
      studentId: rollNumber,
      studentName: student?.name || studentData.name,
    });
    clearCart();
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentData.name || !studentData.email) {
      setError("Please fill in your name and email.");
      return;
    }

    setLoading(true);
    setError(null);

    // 1. Ensure Razorpay Checkout script is loaded
    const scriptLoaded = await loadRazorpayCheckoutScript();
    if (!scriptLoaded) {
      setError("Unable to load Razorpay payment gateway. Please check your internet connection.");
      setLoading(false);
      return;
    }

    // 2. Call backend to create Razorpay Order
    let createRes: any;
    try {
      createRes = await apiRequest("/api/orders/create", {
        method: "POST",
        body: JSON.stringify({
          items,
          shippingDetails: studentData,
          couponCode: couponCode || null,
        }),
      });
    } catch (err: any) {
      setError(err?.message || "Failed to initiate payment order.");
      setLoading(false);
      return;
    }

    if (!createRes || !createRes.success) {
      setError(createRes?.message || "Failed to create payment order.");
      setLoading(false);
      return;
    }

    const orderData = createRes.data || createRes;
    const orderId = orderData.orderId || orderData.id;
    const razorpayOrderId = orderData.order_id || orderData.razorpayOrderId;
    const amountPaise = orderData.amount_paise || Math.round((orderData.amount || cartTotal) * 100);
    const currency = orderData.currency || "INR";
    const keyId =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      orderData.key_id ||
      "rzp_test_TjoIIrwrXrydpn";

    // 3. Configure Razorpay Standard Checkout modal options
    const options: any = {
      key: keyId,
      amount: amountPaise,
      currency: currency,
      name: "The Law कक्षा",
      description: items.map((i) => i.title).join(", ") || "CA Foundation / CSEET Codex Pass",
      image: "/assets/logo-transparent.png",
      order_id: razorpayOrderId,
      handler: async function (response: any) {
        // response: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
        setLoading(true);
        try {
          const currentDeviceId = getOrCreateDeviceId();
          const currentDeviceName = getDeviceFriendlyName();

          const verifyRes = (await apiRequest("/api/orders/verify", {
            method: "POST",
            body: JSON.stringify({
              orderId,
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              deviceId: currentDeviceId,
              deviceName: currentDeviceName,
            }),
          })) as any;

          if (!verifyRes || !verifyRes.success) {
            throw new Error(verifyRes?.message || "Payment signature verification failed.");
          }

          completeEnrollment(verifyRes, orderId, orderData.amount || cartTotal);
        } catch (verifyErr: any) {
          console.error("[Payment Verification Error]", verifyErr);
          setError(verifyErr?.message || "Payment verification failed. Please contact support.");
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: studentData.name,
        email: studentData.email,
        contact: studentData.phone,
      },
      notes: {
        exam: studentData.exam,
        orderId: orderId,
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

    try {
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
    } catch (modalErr: any) {
      console.error("[Razorpay Modal Error]", modalErr);
      setError("Unable to open Razorpay payment window. Please check your browser pop-up permissions.");
      setLoading(false);
    }
  };

  // Render Order Success Screen
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-between">
        <Navbar />

        <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full space-y-6">
          <div className="bg-white border border-[#E7E4E7] rounded-3xl p-6 sm:p-10 shadow-sm text-center space-y-6 relative overflow-hidden">
            <div className="w-16 h-16 bg-[#AED7E9]/30 text-[#4B8097] rounded-full flex items-center justify-center mx-auto border border-[#AED7E9]">
              <CheckCircle2 className="w-9 h-9 text-[#4B8097]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#221D1D] bg-[#AED7E9]/40 px-3 py-1 rounded-full border border-[#AED7E9]">
                DRM License Activated • Payment Verified
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#221D1D]">
                Welcome to The Law Kaksha!
              </h1>
              <p className="text-xs sm:text-sm text-[#4D433F]">
                Your payment of <strong>₹{completedOrder.total_amount || cartTotal}</strong> is confirmed. Your in-web DRM codex reader access is instantly activated.
              </p>
            </div>

            {/* Credentials & Details Card */}
            <div className="bg-[#F7F7F5] border border-[#E7E4E7] rounded-2xl p-5 text-left space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[#E7E4E7]">
                <span className="text-[#77716E]">Access Pass Ref:</span>
                <span className="font-mono font-bold text-[#221D1D]">{completedOrder.id}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#E7E4E7]">
                <span className="text-[#77716E]">Official Student Roll ID:</span>
                <span className="font-mono font-bold text-[#221D1D] bg-[#BFAFE5]/30 px-2.5 py-0.5 rounded-full border border-[#BFAFE5]">
                  {completedOrder.studentId}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#E7E4E7]">
                <span className="text-[#77716E]">Enrolled Student:</span>
                <span className="font-semibold text-[#221D1D]">{completedOrder.studentName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#77716E]">DRM Security Status:</span>
                <span className="font-mono font-semibold text-[#4B8097] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ACTIVE IN-WEB READER ACCESS</span>
                </span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="space-y-3">
              <Link
                href="/student"
                className="w-full py-3.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] font-semibold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Enter Student Portal &amp; Open Codex</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/courses"
                className="block text-xs font-semibold text-[#77716E] hover:text-[#221D1D]"
              >
                Browse Additional Study Codices
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C4E1EC]/60 text-[#221D1D] text-xs font-medium mb-1">
            <span>Encrypted Checkout</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#221D1D] tracking-tight">
            Secure Digital Checkout
          </h1>
          <p className="text-xs sm:text-sm text-[#4D433F]">
            256-bit encrypted checkout with instant in-web DRM reader access to your statutory codices
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-[#E7E4E7] rounded-3xl p-10 text-center space-y-3 shadow-sm">
            <p className="text-sm text-[#4D433F]">Your basket is empty.</p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-semibold"
            >
              <span>Explore Codices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleProcessPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Student Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-[#E7E4E7] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-[#E7E4E7] pb-3">
                  <div className="w-6 h-6 rounded-full bg-[#C4E1EC] text-[#221D1D] flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h2 className="text-base font-serif font-bold text-[#221D1D]">
                    Student Information &amp; DRM License
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#221D1D] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Enter your full name"
                      value={studentData.name}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E7E4E7] text-xs sm:text-sm text-[#221D1D] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#221D1D] mb-1.5">
                      Email (Vault Login) *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Enter your email"
                      value={studentData.email}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E7E4E7] text-xs sm:text-sm text-[#221D1D] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#221D1D] mb-1.5">
                      WhatsApp Contact *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="Enter your contact number"
                      value={studentData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E7E4E7] text-xs sm:text-sm text-[#221D1D] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#221D1D] mb-1.5">
                      Target Exam
                    </label>
                    <select
                      name="exam"
                      value={studentData.exam}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E7E4E7] text-xs sm:text-sm text-[#221D1D] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20"
                    >
                      <option value="CA Foundation Paper 2: Business Laws">CA Foundation (Paper 2: Business Laws)</option>
                      <option value="CSEET Paper 2: Business Law & Management">CSEET (Paper 2: Law &amp; Management)</option>
                      <option value="CA Foundation (Nov Batch)">CA Foundation (Nov Attempt)</option>
                      <option value="CA Foundation (May Batch)">CA Foundation (May Attempt)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#C4E1EC]/40 border border-[#AED7E9] text-xs text-[#221D1D] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#221D1D] shrink-0" />
                  <span>100% In-Web DRM Reader Access. Zero waiting for courier delivery.</span>
                </div>
              </div>

              {/* Payment Rail Selection */}
              <div className="bg-white border border-[#E7E4E7] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-[#E7E4E7] pb-3">
                  <div className="w-6 h-6 rounded-full bg-[#C4E1EC] text-[#221D1D] flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h2 className="text-base font-serif font-bold text-[#221D1D]">
                    Payment Method
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer min-h-[48px] ${
                      paymentMethod === "upi"
                        ? "border-[#BFAFE5] bg-[#BFAFE5]/20 ring-2 ring-[#BFAFE5]/40"
                        : "border-[#E7E4E7] hover:border-[#D8D4D8] bg-[#F7F7F5]"
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-[#221D1D] shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-[#221D1D]">Instant UPI / QR</div>
                      <div className="text-[11px] text-[#4D433F]">GPay, PhonePe, Paytm</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer min-h-[48px] ${
                      paymentMethod === "card"
                        ? "border-[#BFAFE5] bg-[#BFAFE5]/20 ring-2 ring-[#BFAFE5]/40"
                        : "border-[#E7E4E7] hover:border-[#D8D4D8] bg-[#F7F7F5]"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#221D1D] shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-[#221D1D]">Cards &amp; NetBanking</div>
                      <div className="text-[11px] text-[#4D433F]">All Indian Banks</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Pay Button */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-[#E7E4E7] rounded-3xl p-6 shadow-sm space-y-4 sticky top-24">
                <h2 className="text-base font-serif font-bold text-[#221D1D] border-b border-[#E7E4E7] pb-3">
                  Order Review ({items.length} {items.length === 1 ? "Item" : "Items"})
                </h2>

                <div className="divide-y divide-[#E7E4E7] max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="py-2.5 flex justify-between gap-2 text-xs">
                      <div>
                        <div className="font-semibold text-[#221D1D] line-clamp-1">{item.title}</div>
                        <div className="text-[10px] text-[#77716E] uppercase font-semibold">In-Web DRM Codex • Qty: {item.quantity}</div>
                      </div>
                      <span className="font-bold font-serif text-[#221D1D] shrink-0">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-3 border-t border-[#E7E4E7] text-xs">
                  <div className="flex justify-between text-[#4D433F]">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-[#221D1D]">₹{cartSubtotal}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-[#4B8097] font-semibold">
                      <span>Discount ({couponDiscount}%):</span>
                      <span>-₹{Math.round((cartSubtotal * couponDiscount) / 100)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#4D433F]">
                    <span>Delivery Mode:</span>
                    <span className="text-[#4B8097] font-semibold">Instant In-Web DRM Access</span>
                  </div>
                  <div className="flex justify-between text-base font-serif font-bold text-[#221D1D] pt-2 border-t border-[#E7E4E7]">
                    <span>Total Payable:</span>
                    <span>₹{cartTotal}</span>
                  </div>
                </div>

                {error && (
                  <div className="p-3.5 rounded-2xl bg-[#F4C5C0]/40 border border-[#F4C5C0] text-[#C35F3B] text-xs flex items-center gap-2 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#C35F3B]" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-[#221D1D] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹{cartTotal} &amp; Unlock Codex</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-[#77716E] pt-1">
                  <ShieldCheck className="w-4 h-4 text-[#4B8097]" />
                  <span>256-bit Encrypted Server Payment Verification</span>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
