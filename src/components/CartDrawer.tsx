"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  CheckCircle2,
  Shield,
  Truck,
  Sparkles,
  Tag,
  CreditCard,
  QrCode,
  Lock,
  ChevronLeft,
  Download,
  BookOpen,
  FileCheck,
  Scale,
  KeyRound,
  Printer,
  FileText,
} from "lucide-react";
import { useCart, BookFormat, FORMAT_PRICING } from "@/context/CartContext";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    changeFormat,
    couponCode,
    couponDiscount,
    couponError,
    couponSuccess,
    applyCoupon,
    removeCoupon,
    cartSubtotal,
    cartTotal,
    cartSavings,
    totalItemCount,
    clearCart,
    checkoutStep,
    setCheckoutStep,
    lastOrderDetails,
    setLastOrderDetails,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState("");
  const [shippingData, setShippingData] = useState({
    name: "Rohan Deshmukh",
    email: "rohan.d@gmail.com",
    phone: "+91 98765 43210",
    exam: "CA Intermediate Paper 2",
    address: "B-402, Shanti Heights, Shivaji Nagar",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411005",
  });
  const [selectedPayment, setSelectedPayment] = useState<"upi" | "card" | "netbanking">("upi");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [processingStage, setProcessingStage] = useState("Securing 256-Bit SSL Handshake...");
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  // Auto-prefill student details from existing session
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lawkaksha_active_student");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.name) {
            setShippingData((prev) => ({
              ...prev,
              name: parsed.name || prev.name,
              email: parsed.email || prev.email,
              phone: parsed.phone || prev.phone,
              exam: parsed.targetExam || prev.exam,
            }));
          }
        } catch (e) {}
      }
    }
  }, []);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e?: React.FormEvent, customCode?: string) => {
    if (e) e.preventDefault();
    const codeToApply = customCode || inputCoupon;
    if (codeToApply.trim()) {
      applyCoupon(codeToApply.trim().toUpperCase());
      setInputCoupon("");
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep("payment");
  };

  const handleCompletePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      // Map purchased item IDs to student dashboard unlocked item IDs
      const unlockedIds: string[] = [];
      items.forEach((item) => {
        if (item.id === "ca-book-vol-1") {
          unlockedIds.push("book-vol-1");
        } else if (item.id === "ca-book-vol-2") {
          unlockedIds.push("book-vol-2");
        } else if (item.id === "ca-books-both-digital" || item.id === "ca-books-both-hardcopies") {
          unlockedIds.push("book-vol-1", "book-vol-2");
        } else if (
          item.id === "ca-mcq-engine" ||
          item.title.toLowerCase().includes("mcq") ||
          item.title.toLowerCase().includes("question")
        ) {
          unlockedIds.push("book-mcq");
        } else if (
          item.id === "ca-all-access-pass" ||
          item.title.toLowerCase().includes("all-access") ||
          item.title.toLowerCase().includes("fellowship")
        ) {
          unlockedIds.push("book-vol-1", "book-vol-2", "book-ldr", "book-mcq", "video-classes", "mains-evaluation");
        } else {
          unlockedIds.push("book-vol-1");
        }
      });

      const uniqueUnlockedIds = Array.from(new Set(unlockedIds.length > 0 ? unlockedIds : ["book-mcq"]));
      const generatedStudentId = `LK-2026-CA-${Math.floor(1000 + Math.random() * 9000)}`;
      const generatedPassword = `law@${Math.floor(1000 + Math.random() * 9000)}`;

      const generatedOrder = {
        orderId: `LK-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        razorpayPaymentId: `pay_LK_${Math.floor(10000000 + Math.random() * 90000000)}`,
        items: [...items],
        totalAmount: cartTotal,
        discountGiven: cartSubtotal - cartTotal,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        studentName: shippingData.name,
        email: shippingData.email,
        phone: shippingData.phone,
        studentId: generatedStudentId,
        tempPassword: generatedPassword,
        unlockedItemIds: uniqueUnlockedIds,
        address: `${shippingData.address}, ${shippingData.city}, ${shippingData.state} - ${shippingData.pincode}`,
        trackingNumber: `DTDC-${Math.floor(7000000 + Math.random() * 2000000)}`,
      };

      // Save student session to localStorage for instant sync on /student
      if (typeof window !== "undefined") {
        const studentSession = {
          id: generatedStudentId,
          name: shippingData.name,
          rollNumber: generatedStudentId,
          email: shippingData.email,
          phone: shippingData.phone,
          targetExam: shippingData.exam || "CA Intermediate Paper 2",
          activePlanTitle: items.map((i) => i.title).join(" + "),
          unlockedItemIds: uniqueUnlockedIds,
          streakDays: 1,
          todayMinutes: 0,
          todayGoalMinutes: 45,
          examCountdownDays: 68,
          avatarInitials: shippingData.name
            ? shippingData.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)
            : "ST",
        };
        localStorage.setItem("lawkaksha_active_student", JSON.stringify(studentSession));
      }

      setLastOrderDetails(generatedOrder);
      setIsProcessingPayment(false);
      setCheckoutStep("success");
      clearCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-lg bg-white border-l border-sky-100 text-slate-800 h-full shadow-2xl flex flex-col justify-between overflow-hidden z-10 animate-in slide-in-from-right duration-200">
        
        {/* Top Header */}
        <div className="p-5 bg-sky-50/80 border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-sky-200 flex items-center justify-center text-[#0284C7] shadow-sm">
              <ShoppingBag className="w-5 h-5 text-[#0284C7]" />
            </div>
            <div>
              <h2 className="text-base font-serif font-black text-slate-900 flex items-center gap-2">
                <span>The Law Kaksha Desk</span>
                {totalItemCount > 0 && (
                  <span className="text-xs font-sans font-bold bg-[#0284C7] text-white px-2 py-0.5 rounded-full">
                    {totalItemCount} {totalItemCount === 1 ? "Item" : "Items"}
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-500">Official Exam Reviewers &amp; Compilers Checkout</p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors border border-slate-200"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Breadcrumb Bar */}
        {checkoutStep !== "success" && (
          <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold">
            <button
              onClick={() => setCheckoutStep("cart")}
              className={`flex items-center gap-1.5 transition-colors ${
                checkoutStep === "cart" ? "text-[#0284C7]" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-[10px] text-[#0284C7]">
                1
              </span>
              <span>Review Items</span>
            </button>
            <span className="text-slate-300">→</span>
            <button
              onClick={() => items.length > 0 && setCheckoutStep("shipping")}
              disabled={items.length === 0}
              className={`flex items-center gap-1.5 transition-colors ${
                checkoutStep === "shipping" ? "text-[#0284C7]" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-[10px] text-[#0284C7]">
                2
              </span>
              <span>Student Details</span>
            </button>
            <span className="text-slate-300">→</span>
            <span
              className={`flex items-center gap-1.5 ${
                checkoutStep === "payment" ? "text-[#0284C7]" : "text-slate-400"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-[10px] text-[#0284C7]">
                3
              </span>
              <span>Razorpay Payment</span>
            </span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* STEP 1: CART ITEMS */}
          {checkoutStep === "cart" && (
            <>
              {items.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center mx-auto text-[#0284C7]">
                    <ShoppingBag className="w-8 h-8 text-[#0284C7]" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-slate-900">Your Desk is Empty</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Explore our 2026-2027 CA Law reviewers, question banks, and video courses.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:from-[#0369A1] hover:to-[#0284C7] text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    Browse Law Reviewers
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.format}`}
                      className="p-4 rounded-2xl bg-white border border-sky-100 hover:border-sky-300 transition-all shadow-sm space-y-3"
                    >
                      {/* Title & Delete */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          {item.badge && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] bg-sky-50 border border-sky-200 px-2 py-0.5 rounded mr-2">
                              {item.badge}
                            </span>
                          )}
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-serif mt-1">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">{item.category}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, item.format)}
                          className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Format Selector Pills */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                          Select Study Format:
                        </label>
                        <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                          {(["pdf", "paperback", "combo"] as BookFormat[]).map((fmt) => (
                            <button
                              key={fmt}
                              type="button"
                              onClick={() => changeFormat(item.id, item.format, fmt)}
                              className={`p-2 rounded-xl border text-center transition-all flex flex-col justify-between ${
                                item.format === fmt
                                  ? "bg-sky-50/80 border-[#0284C7] text-slate-900 shadow-xs font-bold"
                                  : "bg-slate-50/50 border-slate-200 hover:border-slate-300 text-slate-600"
                              }`}
                            >
                              <span className="font-bold uppercase tracking-wider text-[9.5px]">
                                {fmt === "pdf" ? "Digital PDF" : fmt === "paperback" ? "Hardcopy" : "Combo"}
                              </span>
                              <span className="text-[#0284C7] font-bold font-mono mt-0.5">
                                ₹{Math.round(item.price * FORMAT_PRICING[fmt].multiplier)}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            onClick={() => updateQuantity(item.id, item.format, item.quantity - 1)}
                            className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 font-mono font-bold text-slate-800">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.format, item.quantity + 1)}
                            className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-[#0284C7] font-mono text-sm">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Coupon Code Section */}
                  <div className="pt-2 space-y-2">
                    <form onSubmit={(e) => handleApplyCoupon(e)} className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={inputCoupon}
                          onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                          placeholder="Coupon Code (e.g. CALAW20)"
                          className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0284C7] uppercase font-mono"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm"
                      >
                        Apply
                      </button>
                    </form>

                    {/* Quick 1-Click Coupon Pills */}
                    <div className="flex items-center gap-1.5 flex-wrap text-[10.5px]">
                      <span className="text-slate-400">Available:</span>
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon(undefined, "CALAW20")}
                        className="px-2 py-0.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0284C7] font-bold border border-sky-200 transition-colors"
                      >
                        ⚡ CALAW20 (20% OFF)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon(undefined, "RANKER10")}
                        className="px-2 py-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 transition-colors"
                      >
                        🎓 RANKER10 (10% OFF)
                      </button>
                    </div>

                    {couponSuccess && (
                      <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {couponSuccess}
                      </p>
                    )}
                    {couponError && (
                      <p className="text-[11px] text-rose-500 font-semibold mt-1">
                        {couponError}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 2: STUDENT DETAILS & DISPATCH */}
          {checkoutStep === "shipping" && (
            <form onSubmit={handleProceedToPayment} className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold font-serif text-slate-900">Student &amp; Shipping Profile</h3>
                <span className="text-[10px] text-slate-500 font-semibold">Step 2 of 3</span>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={shippingData.name}
                  onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                  placeholder="e.g. Rohan Deshmukh"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">WhatsApp Mobile No.</label>
                  <input
                    type="tel"
                    required
                    value={shippingData.phone}
                    onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-mono text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={shippingData.email}
                    onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                    placeholder="student@gmail.com"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Exam Attempt</label>
                <select
                  value={shippingData.exam}
                  onChange={(e) => setShippingData({ ...shippingData, exam: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0284C7]"
                >
                  <option value="CA Intermediate Paper 2">CA Intermediate (Paper 2 Corporate &amp; Other Laws)</option>
                  <option value="CA Final Corporate Laws">CA Final (Corporate &amp; Economic Laws)</option>
                  <option value="CA Foundation Business Laws">CA Foundation (Paper 2 Business Laws)</option>
                  <option value="CS Executive & CSEET">CS Executive &amp; CSEET</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Postal Address (For Printed Books / Invoices)</label>
                <input
                  type="text"
                  required
                  value={shippingData.address}
                  onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                  placeholder="House / Flat No, Street, Landmark"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={shippingData.city}
                    onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                    placeholder="Pune"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={shippingData.state}
                    onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                    placeholder="Maharashtra"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={shippingData.pincode}
                    onChange={(e) => setShippingData({ ...shippingData, pincode: e.target.value })}
                    placeholder="411005"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCheckoutStep("cart")}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 text-slate-600 font-semibold text-xs border border-slate-200 hover:bg-slate-100"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:from-[#0369A1] hover:to-[#0284C7] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Razorpay Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: RAZORPAY PAYMENT GATEWAY */}
          {checkoutStep === "payment" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold font-serif text-slate-900">Razorpay Secure Checkout</h3>
                <span className="text-[10px] text-slate-500 font-semibold">Step 3 of 3</span>
              </div>

              <div className="space-y-3">
                {/* UPI Option */}
                <div
                  onClick={() => setSelectedPayment("upi")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedPayment === "upi"
                      ? "bg-sky-50/80 border-[#0284C7] shadow-sm"
                      : "bg-white border-slate-200 hover:border-sky-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white border border-sky-200 flex items-center justify-center text-[#0284C7] shadow-sm">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Instant UPI &amp; QR Code</p>
                        <p className="text-[10px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      Instant Activation
                    </span>
                  </div>

                  {selectedPayment === "upi" && (
                    <div className="mt-3 pt-3 border-t border-sky-100 flex items-center justify-center p-3 bg-white rounded-xl border border-dashed border-sky-300">
                      <div className="text-center space-y-1">
                        <div className="w-24 h-24 bg-white p-2 rounded-lg mx-auto flex items-center justify-center shadow border border-slate-200">
                          <div className="w-full h-full border-2 border-slate-900 flex items-center justify-center font-mono text-[9px] text-slate-900 font-bold">
                            UPI QR SIM
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-900 font-mono font-bold">thelawkaksha@upi</p>
                        <p className="text-[10px] text-slate-500">Scan &amp; Pay or click Pay below</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Option */}
                <div
                  onClick={() => setSelectedPayment("card")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedPayment === "card"
                      ? "bg-sky-50/80 border-[#0284C7] shadow-sm"
                      : "bg-white border-slate-200 hover:border-sky-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white border border-sky-200 flex items-center justify-center text-[#0284C7] shadow-sm">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Credit / Debit Card</p>
                        <p className="text-[10px] text-slate-500">Visa, MasterCard, RuPay</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100 flex items-center gap-2 text-xs text-slate-700">
                <Lock className="w-4 h-4 text-[#0284C7] shrink-0" />
                <span>256-Bit Bank Grade SSL Encrypted Checkout via Razorpay.</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep("shipping")}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 text-slate-600 font-semibold text-xs flex items-center gap-1 border border-slate-200 hover:text-[#0284C7]"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleCompletePayment}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] hover:from-[#0369A1] hover:to-[#0284C7] text-white font-bold text-xs shadow-md shadow-sky-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  {isProcessingPayment ? (
                    <span>Verifying Banking Gateway...</span>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Pay ₹{cartTotal} &amp; Activate License</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER SUCCESS & STUDENT CREDENTIALS */}
          {checkoutStep === "success" && lastOrderDetails && (
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto text-2xl animate-in zoom-in-50">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Payment Successful • Razorpay Verified
                </span>
                <h3 className="text-xl font-serif font-black text-slate-900 mt-2">
                  Order Confirmed &amp; Access Activated!
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Tax invoice &amp; receipt sent to <span className="text-[#0284C7] font-mono font-bold">{lastOrderDetails.email}</span>
                </p>
              </div>

              {/* Student Access Credentials Card */}
              <div className="text-left p-4 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-sky-100">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Your Student Workspace Credentials</span>
                  </span>
                  <span className="text-[10.5px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-[10.5px] text-slate-400 block">Student Roll / ID:</span>
                    <strong className="font-mono text-slate-900">{lastOrderDetails.studentId || "LK-2026-CA-0842"}</strong>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-slate-400 block">Access Password:</span>
                    <strong className="font-mono text-slate-900">{lastOrderDetails.tempPassword || "law@2026"}</strong>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-slate-400 block">Razorpay Txn ID:</span>
                    <span className="font-mono text-[10.5px] text-slate-600">{lastOrderDetails.razorpayPaymentId || "pay_LK_78192014"}</span>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-slate-400 block">Total Paid:</span>
                    <strong className="font-mono text-[#0284C7] text-sm">₹{lastOrderDetails.totalAmount}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-sky-100 text-[11px] text-slate-600">
                  <p><strong>Registered Email:</strong> {lastOrderDetails.email}</p>
                  {lastOrderDetails.trackingNumber && (
                    <p className="mt-0.5"><strong>Courier Tracking:</strong> {lastOrderDetails.trackingNumber} ({lastOrderDetails.studentName})</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href="/student"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] hover:from-[#0369A1] hover:to-[#0284C7] text-white font-bold text-xs shadow-md shadow-sky-500/25 transition-all hover:scale-[1.01]"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Launch My Student Workspace (Auto-Login)</span>
                </Link>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setInvoiceModalOpen(true)}
                    className="flex-1 py-2.5 rounded-xl bg-white text-slate-700 hover:text-[#0284C7] font-semibold text-xs transition-colors border border-slate-200 hover:border-sky-300 flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Print Tax Invoice</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      setCheckoutStep("cart");
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-slate-50 text-slate-600 hover:text-slate-900 font-semibold text-xs transition-colors border border-slate-200"
                  >
                    Return to Store
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Total & Checkout Bar (for Step 1) */}
        {checkoutStep === "cart" && items.length > 0 && (
          <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal ({totalItemCount} items)</span>
                <span className="font-mono text-slate-900 font-bold">₹{cartSubtotal}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex items-center justify-between text-[#0284C7] font-semibold">
                  <span>Coupon Discount ({couponCode})</span>
                  <span className="font-mono">- ₹{Math.round((cartSubtotal * couponDiscount) / 100)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-slate-600">
                <span>Expedited Courier Dispatch</span>
                <span className="font-bold text-[#0284C7] uppercase text-[10px]">FREE</span>
              </div>
              <div className="flex items-baseline justify-between pt-2 border-t border-slate-200 text-sm">
                <span className="font-bold text-slate-900 font-serif">Total Investment</span>
                <div className="text-right">
                  <div className="text-xl font-black text-[#0284C7] font-serif">₹{cartTotal}</div>
                  {cartSavings > 0 && (
                    <div className="text-[10px] text-slate-500 font-semibold">
                      You save ₹{cartSavings} today
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setCheckoutStep("shipping")}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] hover:from-[#0369A1] hover:to-[#0284C7] text-white font-bold text-xs shadow-md shadow-sky-500/25 transition-all flex items-center justify-center gap-2 tracking-wide hover:scale-[1.01]"
            >
              <span>PROCEED TO DISPATCH ADDRESS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Printable Tax Invoice Modal */}
      {invoiceModalOpen && lastOrderDetails && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 text-slate-800 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Invoice Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  TAX INVOICE / RECEIPT
                </span>
                <h3 className="text-lg font-serif font-black text-slate-900 mt-1">THE LAW KAKSHA CA ACADEMY</h3>
                <p className="text-[11px] text-slate-500">
                  GSTIN: 27AABCT1928C1Z4 • Educational Publishing Division
                </p>
                <p className="text-[11px] text-slate-500">Nariman Point, Mumbai, MH - 400021</p>
              </div>
              <button
                onClick={() => setInvoiceModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bill To & Invoice Info */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Billed To:</span>
                <strong className="text-slate-900 block">{lastOrderDetails.studentName}</strong>
                <p className="text-slate-600">{lastOrderDetails.email}</p>
                <p className="text-slate-600">{lastOrderDetails.phone}</p>
                {lastOrderDetails.address && <p className="text-[11px] text-slate-500">{lastOrderDetails.address}</p>}
              </div>

              <div className="space-y-1 text-right">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Invoice Details:</span>
                <p className="font-mono font-bold text-slate-900">{lastOrderDetails.orderId}</p>
                <p className="text-slate-600 font-mono text-[11px]">Txn: {lastOrderDetails.razorpayPaymentId}</p>
                <p className="text-slate-600">{lastOrderDetails.date}</p>
                <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  PAID VIA RAZORPAY
                </span>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Item Description</th>
                    <th className="p-3 text-center">Format</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {lastOrderDetails.items.map((it: any, iIdx: number) => (
                    <tr key={iIdx}>
                      <td className="p-3 font-medium">
                        {it.title}
                        <span className="block text-[10.5px] text-slate-400">{it.category}</span>
                      </td>
                      <td className="p-3 text-center uppercase font-mono text-[10.5px]">
                        {it.format === "pdf" ? "Digital PDF" : it.format === "paperback" ? "Hardcopy" : "Combo"}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        ₹{it.price * it.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Strip */}
            <div className="flex items-center justify-between p-4 bg-sky-50 rounded-2xl border border-sky-200">
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Student License ID:</span>
                <span className="font-mono text-[#0284C7] font-bold">{lastOrderDetails.studentId}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Total Amount Paid (Incl. Taxes)</span>
                <span className="text-xl font-black text-slate-900 font-mono">₹{lastOrderDetails.totalAmount}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setInvoiceModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") window.print();
                }}
                className="px-5 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold flex items-center gap-2 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
