"use client";

import React, { useState, useEffect } from "react";
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
  Tag,
  CreditCard,
  QrCode,
  Lock,
  ChevronLeft,
  BookOpen,
  Printer,
  Sparkles,
  Truck,
  Check,
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
  const [selectedPayment, setSelectedPayment] = useState<"upi" | "card">("upi");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  // Check if any paperback / hardcopy is in cart
  const hasPhysicalItem = items.some((item) => item.format === "paperback" || item.format === "combo");

  // Auto-prefill student details from existing session
  useEffect(() => {
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

  const handleProceedToPayment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCheckoutStep("payment");
  };

  const handleCompletePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const unlockedIds: string[] = [];
      items.forEach((item) => {
        if (item.id === "ca-book-vol-1" || item.id === "book-vol-1") {
          unlockedIds.push("book-vol-1");
        } else if (item.id === "ca-book-vol-2" || item.id === "book-vol-2") {
          unlockedIds.push("book-vol-2");
        } else if (item.id === "book-mcq" || item.title.toLowerCase().includes("mcq")) {
          unlockedIds.push("book-mcq");
        } else if (item.id === "book-ldr" || item.title.toLowerCase().includes("ldr") || item.title.toLowerCase().includes("revision")) {
          unlockedIds.push("book-ldr");
        } else if (item.id === "video-classes" || item.title.toLowerCase().includes("video") || item.title.toLowerCase().includes("masterclass")) {
          unlockedIds.push("video-classes");
        } else if (item.id === "mains-evaluation" || item.title.toLowerCase().includes("evaluation") || item.title.toLowerCase().includes("desk")) {
          unlockedIds.push("mains-evaluation");
        } else if (item.id.includes("both") || item.id.includes("combo")) {
          unlockedIds.push("book-vol-1", "book-vol-2");
        } else if (item.title.toLowerCase().includes("foundation")) {
          unlockedIds.push("book-foundation");
        } else if (item.title.toLowerCase().includes("final")) {
          unlockedIds.push("book-final");
        } else {
          unlockedIds.push(item.id);
        }
      });

      // Retrieve existing student session to preserve current unlocked items and profile
      let existingUnlocked: string[] = [];
      let studentName = shippingData.name || "Rohan Deshmukh";
      let rollNumber = "CRO-0689421";
      let studentEmail = shippingData.email || "rohan.d@gmail.com";
      let studentPhone = shippingData.phone || "+91 98765 43210";
      let targetExam = shippingData.exam || "CA Intermediate Paper 2: Corporate & Other Laws";

      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("lawkaksha_active_student");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed) {
              if (Array.isArray(parsed.unlockedItemIds)) existingUnlocked = parsed.unlockedItemIds;
              if (parsed.name) studentName = parsed.name;
              if (parsed.rollNumber) rollNumber = parsed.rollNumber;
              if (parsed.email) studentEmail = parsed.email;
              if (parsed.phone) studentPhone = parsed.phone;
              if (parsed.targetExam) targetExam = parsed.targetExam;
            }
          } catch (e) {}
        }
      }

      const mergedUnlockedIds = Array.from(new Set([...existingUnlocked, ...unlockedIds]));
      const generatedOrderId = `LK-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const generatedTxnId = `pay_LK_${Math.floor(10000000 + Math.random() * 90000000)}`;

      const generatedOrder = {
        orderId: generatedOrderId,
        razorpayPaymentId: generatedTxnId,
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
        studentName: studentName,
        email: studentEmail,
        phone: studentPhone,
        studentId: rollNumber,
        tempPassword: `law@${Math.floor(1000 + Math.random() * 9000)}`,
        unlockedItemIds: mergedUnlockedIds,
        address: hasPhysicalItem
          ? `${shippingData.address}, ${shippingData.city}, ${shippingData.state} - ${shippingData.pincode}`
          : "Digital Delivery to Student Vault & Email",
        trackingNumber: hasPhysicalItem ? `DTDC-${Math.floor(7000000 + Math.random() * 2000000)}` : "INSTANT-DRM-VAULT",
      };

      if (typeof window !== "undefined") {
        // 1. Update Student Session in localStorage
        const studentSession = {
          id: rollNumber,
          name: studentName,
          rollNumber: rollNumber,
          email: studentEmail,
          phone: studentPhone,
          targetExam: targetExam,
          activePlanTitle: items.map((i) => i.title).join(" + "),
          unlockedItemIds: mergedUnlockedIds,
          streakDays: 14,
          todayMinutes: 40,
          todayGoalMinutes: 45,
          examCountdownDays: 68,
          avatarInitials: studentName.slice(0, 2).toUpperCase(),
        };
        localStorage.setItem("lawkaksha_active_student", JSON.stringify(studentSession));

        // 2. Automatically sync to Admin Orders Ledger
        const adminOrderEntry = {
          id: generatedOrderId,
          customer: studentName,
          phone: studentPhone,
          item: items.map((i) => `${i.title} (${i.format.toUpperCase()})`).join(", "),
          state: shippingData.state || "Maharashtra",
          address: hasPhysicalItem
            ? `${shippingData.address}, ${shippingData.city}, ${shippingData.state} - ${shippingData.pincode}`
            : "Digital Instant DRM Vault Delivery",
          pincode: shippingData.pincode || "400001",
          amount: `₹${cartTotal}`,
          date: "Just now",
          status: "Processing",
          tracking: hasPhysicalItem ? `DTDC-${Math.floor(7000000 + Math.random() * 2000000)}` : "INSTANT-DRM-VAULT",
          courier: hasPhysicalItem ? "DTDC Express Air" : "Instant Student Vault",
        };

        const existingAdminOrders = localStorage.getItem("lawkaksha_admin_orders");
        const parsedAdminOrders = existingAdminOrders ? JSON.parse(existingAdminOrders) : [];
        localStorage.setItem("lawkaksha_admin_orders", JSON.stringify([adminOrderEntry, ...parsedAdminOrders]));

        // 3. Dispatch global storage event for immediate UI reflection
        window.dispatchEvent(new Event("storage"));
      }

      setLastOrderDetails(generatedOrder);
      setIsProcessingPayment(false);
      setCheckoutStep("success");
      clearCart();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md sm:max-w-lg bg-white border-l border-slate-200 text-slate-900 h-full shadow-2xl flex flex-col justify-between overflow-hidden z-10 animate-in slide-in-from-right duration-200">
        
        {/* TOP HEADER */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-serif font-black text-slate-900">Your Cart</h2>
                {totalItemCount > 0 && (
                  <span className="text-[11px] font-mono font-bold bg-sky-50 text-[#0284C7] border border-sky-200 px-2 py-0.5 rounded-full">
                    {totalItemCount} {totalItemCount === 1 ? "item" : "items"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP PROGRESS BAR */}
        {checkoutStep !== "success" && (
          <div className="px-5 py-2 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => setCheckoutStep("cart")}
              className={`flex items-center gap-1.5 font-bold transition-colors ${
                checkoutStep === "cart" ? "text-[#0284C7]" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                checkoutStep === "cart" ? "bg-[#0284C7] text-white" : "bg-slate-200 text-slate-600"
              }`}>1</span>
              <span>Cart</span>
            </button>
            <span className="text-slate-300">/</span>
            <button
              onClick={() => items.length > 0 && setCheckoutStep("shipping")}
              disabled={items.length === 0}
              className={`flex items-center gap-1.5 font-bold transition-colors ${
                checkoutStep === "shipping" ? "text-[#0284C7]" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                checkoutStep === "shipping" ? "bg-[#0284C7] text-white" : "bg-slate-200 text-slate-600"
              }`}>2</span>
              <span>Details</span>
            </button>
            <span className="text-slate-300">/</span>
            <span
              className={`flex items-center gap-1.5 font-bold ${
                checkoutStep === "payment" ? "text-[#0284C7]" : "text-slate-400"
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                checkoutStep === "payment" ? "bg-[#0284C7] text-white" : "bg-slate-200 text-slate-600"
              }`}>3</span>
              <span>Payment</span>
            </span>
          </div>
        )}

        {/* MAIN DRAWER CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* STEP 1: CART ITEMS */}
          {checkoutStep === "cart" && (
            <>
              {items.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center mx-auto text-[#0284C7]">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-serif font-bold text-slate-900">Your cart is empty</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Add CA Law codexes, solved past papers, or video classes to get started.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    Browse CA Books &amp; Plans
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Item Cards */}
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.format}`}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-sky-300 transition-all space-y-2.5"
                    >
                      {/* Title & Delete */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-serif leading-snug line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">{item.category}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, item.format)}
                          className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Streamlined Format Selector (Clean Inline Pills) */}
                      <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-200/80 text-[10.5px]">
                        <span className="text-slate-400 font-medium px-1.5 text-[10px] hidden sm:inline">Format:</span>
                        {(["pdf", "paperback", "combo"] as BookFormat[]).map((fmt) => {
                          const isActive = item.format === fmt;
                          const fmtPrice = Math.round(item.price * FORMAT_PRICING[fmt].multiplier);
                          return (
                            <button
                              key={fmt}
                              type="button"
                              onClick={() => changeFormat(item.id, item.format, fmt)}
                              className={`flex-1 py-1 px-1.5 rounded-lg font-medium transition-all text-center flex items-center justify-center gap-1 ${
                                isActive
                                  ? "bg-white text-[#0284C7] font-bold shadow-2xs border border-sky-200"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              <span>{fmt === "pdf" ? "PDF" : fmt === "paperback" ? "Book" : "Combo"}</span>
                              <span className="font-mono text-[10px] text-slate-500 font-normal">₹{fmtPrice}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Quantity Stepper & Price Row */}
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.format, item.quantity - 1)}
                            className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 font-mono font-bold text-slate-800 text-[11px]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.format, item.quantity + 1)}
                            className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right font-mono">
                          <span className="text-sm font-black text-slate-900">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Clean 1-Click Coupon Section */}
                  <div className="pt-2 space-y-2">
                    <form onSubmit={(e) => handleApplyCoupon(e)} className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={inputCoupon}
                          onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                          placeholder="Promo code (e.g. CALAW20)"
                          className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 uppercase font-mono focus:outline-none focus:border-[#0284C7]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-2xs"
                      >
                        Apply
                      </button>
                    </form>

                    {/* Instant 1-Click Promo Pill */}
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="text-slate-400">Offer:</span>
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon(undefined, "CALAW20")}
                        className="px-2 py-0.5 rounded-md bg-sky-50 hover:bg-sky-100 text-[#0284C7] font-bold border border-sky-200 transition-colors"
                      >
                        ⚡ CALAW20 (20% OFF)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon(undefined, "RANKER10")}
                        className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 transition-colors"
                      >
                        🎓 RANKER10 (10% OFF)
                      </button>
                    </div>

                    {couponSuccess && (
                      <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {couponSuccess}
                      </p>
                    )}
                    {couponError && (
                      <p className="text-[11px] text-rose-500 font-semibold">
                        {couponError}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 2: STUDENT DETAILS (Simplified) */}
          {checkoutStep === "shipping" && (
            <form onSubmit={handleProceedToPayment} className="space-y-3.5 text-xs">
              <div className="pb-1 border-b border-slate-100">
                <h3 className="text-sm font-bold font-serif text-slate-900">Student Contact &amp; Delivery</h3>
                <p className="text-[11px] text-slate-500">License credentials will be sent to this email &amp; WhatsApp.</p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={shippingData.name}
                  onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                  placeholder="e.g. Rohan Deshmukh"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">WhatsApp Mobile</label>
                  <input
                    type="tel"
                    required
                    value={shippingData.phone}
                    onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-900 focus:outline-none focus:border-[#0284C7]"
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
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Exam</label>
                <select
                  value={shippingData.exam}
                  onChange={(e) => setShippingData({ ...shippingData, exam: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0284C7]"
                >
                  <option value="CA Intermediate Paper 2">CA Intermediate (Paper 2 Corporate &amp; Other Laws)</option>
                  <option value="CA Final Corporate Laws">CA Final (Corporate &amp; Economic Laws)</option>
                  <option value="CA Foundation Business Laws">CA Foundation (Paper 2 Business Laws)</option>
                  <option value="Judiciary PCS-J">Judiciary (PCS-J) Prelims &amp; Mains</option>
                </select>
              </div>

              {/* Physical Dispatch Address (Only if physical book is in cart) */}
              {hasPhysicalItem ? (
                <div className="pt-2 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
                    <Truck className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Courier Delivery Address:</span>
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      value={shippingData.address}
                      onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                      placeholder="Street / Flat Address"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      required
                      value={shippingData.city}
                      onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                      placeholder="City"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900"
                    />
                    <input
                      type="text"
                      required
                      value={shippingData.state}
                      onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                      placeholder="State"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900"
                    />
                    <input
                      type="text"
                      required
                      value={shippingData.pincode}
                      onChange={(e) => setShippingData({ ...shippingData, pincode: e.target.value })}
                      placeholder="PIN"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-900"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-[11px] text-slate-700 flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0284C7] shrink-0" />
                  <span>Instant digital activation in Student Portal Vault + DRM sync upon payment.</span>
                </div>
              )}

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setCheckoutStep("cart")}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Proceed to Payment (₹{cartTotal})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: RAZORPAY PAYMENT */}
          {checkoutStep === "payment" && (
            <div className="space-y-4 text-xs">
              <div className="pb-1 border-b border-slate-100">
                <h3 className="text-sm font-bold font-serif text-slate-900">Select Payment Mode</h3>
                <p className="text-[11px] text-slate-500">256-Bit SSL Encrypted Banking Gateway</p>
              </div>

              <div className="space-y-2.5">
                {/* UPI Option */}
                <div
                  onClick={() => setSelectedPayment("upi")}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedPayment === "upi"
                      ? "bg-sky-50/80 border-[#0284C7] shadow-2xs"
                      : "bg-white border-slate-200 hover:border-sky-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white border border-sky-200 flex items-center justify-center text-[#0284C7]">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Instant UPI / QR Code</p>
                        <p className="text-[10px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Fastest
                    </span>
                  </div>
                </div>

                {/* Card Option */}
                <div
                  onClick={() => setSelectedPayment("card")}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedPayment === "card"
                      ? "bg-sky-50/80 border-[#0284C7] shadow-2xs"
                      : "bg-white border-slate-200 hover:border-sky-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white border border-sky-200 flex items-center justify-center text-[#0284C7]">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Debit / Credit Card</p>
                      <p className="text-[10px] text-slate-500">Visa, Mastercard, RuPay</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep("shipping")}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleCompletePayment}
                  className="flex-1 py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <span>Verifying with Bank...</span>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Pay ₹{cartTotal} &amp; Complete Order</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER SUCCESS */}
          {checkoutStep === "success" && lastOrderDetails && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto animate-in zoom-in-50">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Payment Verified
                </span>
                <h3 className="text-lg font-serif font-black text-slate-900 mt-2">
                  Access Activated!
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Receipt sent to <span className="text-[#0284C7] font-semibold">{lastOrderDetails.email}</span>
                </p>
              </div>

              {/* Credentials Box */}
              <div className="text-left p-4 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-sky-100">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Student Access Credentials</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Student ID:</span>
                    <strong className="font-mono text-slate-900">{lastOrderDetails.studentId}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Password:</span>
                    <strong className="font-mono text-slate-900">{lastOrderDetails.tempPassword}</strong>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <Link
                  href="/student"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Launch Student Workspace (Auto-Login)</span>
                </Link>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setInvoiceModalOpen(true)}
                    className="flex-1 py-2 rounded-xl bg-white text-slate-700 hover:text-[#0284C7] font-semibold text-xs border border-slate-200 hover:border-sky-300 flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Tax Invoice</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      setCheckoutStep("cart");
                    }}
                    className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 font-semibold text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM TOTAL & CHECKOUT BAR (For Step 1) */}
        {checkoutStep === "cart" && items.length > 0 && (
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 space-y-3 shrink-0">
            <div className="space-y-1 text-xs">
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
              <div className="flex items-baseline justify-between pt-1.5 border-t border-slate-200 text-sm">
                <span className="font-bold text-slate-900 font-serif">Total Payable:</span>
                <div className="text-right">
                  <span className="text-xl font-black text-[#0284C7] font-mono">₹{cartTotal}</span>
                  {cartSavings > 0 && (
                    <span className="block text-[10px] text-emerald-700 font-bold">
                      Saved ₹{cartSavings}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (hasPhysicalItem) {
                  setCheckoutStep("shipping");
                } else {
                  setCheckoutStep("payment");
                }
              }}
              className="w-full py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <span>Proceed to Checkout ({totalItemCount} {totalItemCount === 1 ? "Item" : "Items"})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Printable Tax Invoice Modal */}
      {invoiceModalOpen && lastOrderDetails && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-slate-800 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  TAX INVOICE
                </span>
                <h3 className="text-base font-serif font-black text-slate-900 mt-1">THE LAW KAKSHA</h3>
                <p className="text-[10.5px] text-slate-500">GSTIN: 27AABCT1928C1Z4 • Educational Publishing</p>
              </div>
              <button
                onClick={() => setInvoiceModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Student:</span>
                <strong className="text-slate-900">{lastOrderDetails.studentName}</strong>
                <p className="text-slate-600 text-[11px]">{lastOrderDetails.email}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Invoice:</span>
                <p className="font-mono font-bold text-slate-900">{lastOrderDetails.orderId}</p>
                <p className="text-slate-600 text-[10.5px]">{lastOrderDetails.date}</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Item</th>
                    <th className="p-2.5 text-center">Format</th>
                    <th className="p-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {lastOrderDetails.items.map((it: any, iIdx: number) => (
                    <tr key={iIdx}>
                      <td className="p-2.5 font-medium">{it.title}</td>
                      <td className="p-2.5 text-center uppercase font-mono text-[10px]">
                        {it.format === "pdf" ? "PDF" : it.format === "paperback" ? "Book" : "Combo"}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold">₹{it.price * it.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs">
              <span className="font-bold text-slate-900">Total Paid:</span>
              <span className="text-lg font-black text-slate-900 font-mono">₹{lastOrderDetails.totalAmount}</span>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setInvoiceModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") window.print();
                }}
                className="px-4 py-1.5 rounded-lg bg-[#0284C7] text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
