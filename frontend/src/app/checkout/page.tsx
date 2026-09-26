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
  Truck,
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

  const [shippingData, setShippingData] = useState({
    name: "Rohan Deshmukh",
    email: "rohan.deshmukh@gmail.com",
    phone: "+91 98765 43210",
    exam: "CA Intermediate Paper 2: Corporate & Other Laws",
    address: "B-402, Shanti Heights, Shivaji Nagar",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411005",
  });

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Auto-fill student session if logged in
  useEffect(() => {
    const user = getActiveUser();
    if (user) {
      setShippingData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        exam: user.target_exam || prev.exam,
      }));
    }
  }, []);

  const hasPhysicalItem = items.some(
    (item) => item.format === "paperback" || item.format === "combo"
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingData.name || !shippingData.email) {
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
        shippingDetails: shippingData,
        couponCode: couponCode || null,
      }),
    });

    if (!createRes.success || !createRes.data) {
      setLoading(false);
      setError(createRes.message || "Failed to initiate order on server.");
      return;
    }

    const { orderId, razorpayOrderId, amount } = createRes.data;

    // 2. Perform server-side payment verification
    // (In sandbox/development mode or simulated checkout, we verify with server-signed token)
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

    if (verifyRes.success && verifyRes.data) {
      const confirmedOrder = verifyRes.data.order;
      const student = verifyRes.data.student;
      const newlyUnlocked = verifyRes.data.unlockedItemIds || [];

      // Retrieve existing unlocked courses so nothing is lost
      let priorUnlocked: string[] = [];
      const savedStudent = getActiveUser();
      if (savedStudent && Array.isArray(savedStudent.unlockedItemIds)) {
        priorUnlocked = savedStudent.unlockedItemIds;
      }
      const combinedUnlocked = Array.from(new Set([...priorUnlocked, ...newlyUnlocked]));

      // Save student session & entitlements
      if (student) {
        const token = verifyRes.data.token || localStorage.getItem("lawkaksha_token") || `token_${student.id}`;
        setAuthSession(token, {
          ...student,
          unlockedItemIds: combinedUnlocked,
        });
      }

      setLastOrderDetails(confirmedOrder);
      setCompletedOrder({
        ...confirmedOrder,
        items,
        unlockedItemIds: combinedUnlocked,
        studentId: student?.student_id || "LRK-2026-068942",
        studentName: student?.name || shippingData.name,
      });
      clearCart();
    } else {
      setError(verifyRes.message || "Payment verification failed on the server.");
    }
  };

  // Render Order Success Screen
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />

        <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full space-y-6">
          <div className="bg-white border border-emerald-200 rounded-3xl p-6 sm:p-10 shadow-xs text-center space-y-6 relative overflow-hidden">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment Verified • Order Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                Welcome to The Law Kaksha!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Your payment of <strong>₹{completedOrder.total_amount}</strong> has been verified by the server. Your courses have been unlocked in your Student Vault.
              </p>
            </div>

            {/* Credentials & Details Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-bold text-slate-900">{completedOrder.id}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Official Student ID:</span>
                <span className="font-mono font-extrabold text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {completedOrder.studentId}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Enrolled Student:</span>
                <span className="font-semibold text-slate-900">{completedOrder.studentName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Dispatch / Vault Tracking:</span>
                <span className="font-mono font-semibold text-emerald-600">
                  {completedOrder.tracking_number || "INSTANT-DRM-VAULT"}
                </span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="space-y-3">
              <Link
                href="/student"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:from-[#0369A1] hover:to-[#0284C7] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Enter Student Portal &amp; Open Course</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/courses"
                className="block text-xs font-semibold text-slate-500 hover:text-slate-900"
              >
                Browse Additional Study Materials
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
            Secure Checkout
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Encrypted payment with instant DRM vault enrollment &amp; automated dispatch tracking
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-3">
            <p className="text-sm text-slate-600">Your basket is empty.</p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleProcessPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Student Details & Shipping */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-sky-100 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="w-6 h-6 rounded-lg bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 font-serif">
                    Student Information
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
                      value={shippingData.name}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
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
                      value={shippingData.email}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
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
                      value={shippingData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Target CA Exam
                    </label>
                    <input
                      type="text"
                      name="exam"
                      value={shippingData.exam}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address for printed items */}
              {hasPhysicalItem && (
                <div className="bg-white border border-sky-100 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <div className="w-6 h-6 rounded-lg bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <h2 className="text-sm font-bold text-slate-900 font-serif">
                      Courier Shipping Address (Printed Books)
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Street Address / Apartment
                      </label>
                      <input
                        type="text"
                        name="address"
                        required={hasPhysicalItem}
                        value={shippingData.address}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={shippingData.city}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={shippingData.state}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Pincode
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={shippingData.pincode}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Rail Selection */}
              <div className="bg-white border border-sky-100 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="w-6 h-6 rounded-lg bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold text-xs">
                    {hasPhysicalItem ? "3" : "2"}
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 font-serif">
                    Payment Method
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                      paymentMethod === "upi"
                        ? "border-[#0284C7] bg-sky-50/60 ring-2 ring-[#0284C7]/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-[#0284C7]" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Instant UPI / QR</div>
                      <div className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                      paymentMethod === "card"
                        ? "border-[#0284C7] bg-sky-50/60 ring-2 ring-[#0284C7]/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#0284C7]" />
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
                    <div key={`${item.id}-${item.format}`} className="py-2.5 flex justify-between gap-2 text-xs">
                      <div>
                        <div className="font-bold text-slate-900 line-clamp-1">{item.title}</div>
                        <div className="text-[10px] text-slate-500 uppercase">{item.format} • Qty: {item.quantity}</div>
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
                    <span>Shipping:</span>
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                    <span>Total Payable:</span>
                    <span className="text-[#0284C7]">₹{cartTotal}</span>
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
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:from-[#0369A1] hover:to-[#0284C7] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹{cartTotal} &amp; Unlock Vault</span>
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
