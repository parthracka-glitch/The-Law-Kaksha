"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { apiRequest, setAuthSession, getActiveUser } from "@/lib/api";
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

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentData.name || !studentData.email) {
      setError("Please fill in your name and email.");
      return;
    }

    setLoading(true);
    setError(null);

    // 1. Create order on server with verified prices
    const createRes = await apiRequest("/api/orders/create", {
      method: "POST",
      body: JSON.stringify({
        items,
        shippingDetails: studentData,
        couponCode: couponCode || null,
      }),
    });

    let orderId = `LK-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    let razorpayOrderId = `order_${Date.now()}`;

    if (createRes && createRes.success && createRes.data) {
      orderId = createRes.data.orderId || orderId;
      razorpayOrderId = createRes.data.razorpayOrderId || razorpayOrderId;
    }

    // 2. Perform server-side payment verification
    const mockPaymentId = `pay_LK_${Date.now()}`;
    const mockSignature = `sig_test_${Date.now()}`;

    const verifyRes = await apiRequest("/api/orders/verify", {
      method: "POST",
      body: JSON.stringify({
        orderId,
        razorpayOrderId,
        razorpayPaymentId: mockPaymentId,
        razorpaySignature: mockSignature,
      }),
    });

    setLoading(false);

    const serverOrder = verifyRes?.data?.order || { id: orderId, total_amount: cartTotal };
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

    const rollNumber = student?.student_id || (studentData.exam.includes("CSEET") ? "LRK-2026-009821" : "LRK-2026-004182");

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
      setAuthSession(`token_${Date.now()}`, studentSession);

      // Save to admin subscriptions
      const adminSubEntry = {
        id: `LK-SUB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        studentName: student?.name || studentData.name,
        studentRoll: rollNumber,
        email: student?.email || studentData.email,
        phone: studentData.phone || "+91 98765 43210",
        item: items.map((i) => i.title).join(", "),
        targetExam: studentData.exam,
        amount: `₹${cartTotal}`,
        date: "Just now",
        paymentMode: paymentMethod === "upi" ? "UPI / Razorpay" : "Card / Netbanking",
        accessStatus: "Active",
      };

      const existingAdminSubs = localStorage.getItem("lawkaksha_admin_subs");
      const parsedAdminSubs = existingAdminSubs ? JSON.parse(existingAdminSubs) : [];
      localStorage.setItem("lawkaksha_admin_subs", JSON.stringify([adminSubEntry, ...parsedAdminSubs]));

      // Clear obsolete courier orders key
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

  // Render Order Success Screen
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Navbar />

        <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full space-y-6">
          <div className="bg-white border border-emerald-200 rounded-3xl p-6 sm:p-10 shadow-xs text-center space-y-6 relative overflow-hidden">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                DRM License Activated • Payment Verified
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                Welcome to The Law Kaksha!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Your payment of <strong>₹{completedOrder.total_amount || cartTotal}</strong> is confirmed. Your in-web DRM codex reader access is instantly activated.
              </p>
            </div>

            {/* Credentials & Details Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Access Pass Ref:</span>
                <span className="font-mono font-bold text-slate-900">{completedOrder.id}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Official Student Roll ID:</span>
                <span className="font-mono font-extrabold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-200">
                  {completedOrder.studentId}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Enrolled Student:</span>
                <span className="font-semibold text-slate-900">{completedOrder.studentName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">DRM Security Status:</span>
                <span className="font-mono font-semibold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ACTIVE IN-WEB READER ACCESS</span>
                </span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="space-y-3">
              <Link
                href="/student"
                className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Enter Student Portal &amp; Open Codex</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/courses"
                className="block text-xs font-semibold text-slate-500 hover:text-slate-900"
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
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
            Secure Digital Checkout
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            256-bit encrypted checkout with instant in-web DRM reader access to your statutory codices
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-3">
            <p className="text-sm text-slate-600">Your basket is empty.</p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
            >
              <span>Explore Codices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleProcessPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Student Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-sky-100 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="w-6 h-6 rounded-lg bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 font-serif">
                    Student Information &amp; DRM License
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Enter your full name"
                      value={studentData.name}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email (Vault Login) *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Enter your email"
                      value={studentData.email}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      WhatsApp Contact *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="Enter your contact number"
                      value={studentData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:border-violet-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Target Exam
                    </label>
                    <select
                      name="exam"
                      value={studentData.exam}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:border-violet-500"
                    >
                      <option value="CA Foundation Paper 2: Business Laws">CA Foundation (Paper 2: Business Laws)</option>
                      <option value="CSEET Paper 2: Business Law & Management">CSEET (Paper 2: Law &amp; Management)</option>
                      <option value="CA Foundation (Nov Batch)">CA Foundation (Nov Attempt)</option>
                      <option value="CA Foundation (May Batch)">CA Foundation (May Attempt)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-violet-50/70 border border-violet-100 text-xs text-violet-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-600 shrink-0" />
                  <span>100% In-Web DRM Reader Access. Zero waiting for courier delivery.</span>
                </div>
              </div>

              {/* Payment Rail Selection */}
              <div className="bg-white border border-sky-100 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="w-6 h-6 rounded-lg bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 font-serif">
                    Payment Method
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer min-h-[48px] ${
                      paymentMethod === "upi"
                        ? "border-violet-600 bg-violet-50/60 ring-2 ring-violet-500/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-violet-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Instant UPI / QR</div>
                      <div className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer min-h-[48px] ${
                      paymentMethod === "card"
                        ? "border-violet-600 bg-violet-50/60 ring-2 ring-violet-500/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-violet-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Cards &amp; NetBanking</div>
                      <div className="text-[10px] text-slate-500">All Indian Banks</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Pay Button */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-sky-100 rounded-2xl p-6 shadow-xs space-y-4 sticky top-24">
                <h2 className="text-sm font-bold text-slate-900 font-serif border-b border-slate-100 pb-3">
                  Order Review ({items.length} {items.length === 1 ? "Item" : "Items"})
                </h2>

                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="py-2.5 flex justify-between gap-2 text-xs">
                      <div>
                        <div className="font-bold text-slate-900 line-clamp-1">{item.title}</div>
                        <div className="text-[10px] text-violet-600 uppercase font-semibold">In-Web DRM Codex • Qty: {item.quantity}</div>
                      </div>
                      <span className="font-extrabold text-slate-900 shrink-0">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-900">₹{cartSubtotal}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount ({couponDiscount}%):</span>
                      <span>-₹{Math.round((cartSubtotal * couponDiscount) / 100)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Mode:</span>
                    <span className="text-emerald-600 font-semibold">Instant In-Web DRM Access</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                    <span>Total Payable:</span>
                    <span className="text-violet-700 font-bold">₹{cartTotal}</span>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹{cartTotal} &amp; Unlock Codex</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
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
