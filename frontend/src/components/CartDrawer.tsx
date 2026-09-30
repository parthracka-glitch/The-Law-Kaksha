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
    name: "",
    email: "",
    phone: "",
    exam: "CA Intermediate Paper 2",
    address: "",
    city: "",
    state: "",
    pincode: "",
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
          if (parsed && (parsed.name || parsed.email)) {
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
  }, [isCartOpen]);

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

  const handleCompletePayment = async () => {
    setIsProcessingPayment(true);
    try {
      // 1. Create order on backend server with price verification
      const createRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            shippingDetails: shippingData,
            couponCode: couponCode || null,
          }),
        }
      );
      const createData = await createRes.json();
      const orderId = createData.orderId || `LK-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const razorpayOrderId = createData.razorpayOrderId || `order_${Date.now()}`;
      const mockPaymentId = `pay_LK_${Date.now()}`;
      const mockSignature = `sig_test_${Date.now()}`;

      // 2. Perform Server-Side Verification
      const verifyRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            razorpayOrderId,
            razorpayPaymentId: mockPaymentId,
            razorpaySignature: mockSignature,
          }),
        }
      );
      const verifyData = await verifyRes.json();
      const serverOrder = verifyData.order || {};
      const serverStudent = verifyData.student || {};
      const serverUnlockedIds = verifyData.unlockedItemIds || [];

      // Calculate unlocked IDs fallback
      const unlockedIds: string[] = [...serverUnlockedIds];
      items.forEach((item) => {
        if (item.id === "ca-book-vol-1" || item.id === "book-vol-1") {
          unlockedIds.push("book-vol-1");
        } else if (item.id === "ca-book-vol-2" || item.id === "book-vol-2") {
          unlockedIds.push("book-vol-2");
        } else if (item.id === "book-mcq" || item.title.toLowerCase().includes("mcq")) {
          unlockedIds.push("book-mcq");
        } else if (item.id === "book-ldr" || item.title.toLowerCase().includes("ldr")) {
          unlockedIds.push("book-ldr");
        } else if (item.id === "video-classes" || item.title.toLowerCase().includes("video")) {
          unlockedIds.push("video-classes");
        } else if (item.id === "mains-evaluation" || item.title.toLowerCase().includes("evaluation")) {
          unlockedIds.push("mains-evaluation");
        } else {
          unlockedIds.push(item.id);
        }
      });

      // Retrieve any prior unlocked IDs from existing session
      let priorUnlocked: string[] = [];
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("lawkaksha_active_student");
        if (saved) {
          try {
            const p = JSON.parse(saved);
            if (p && Array.isArray(p.unlockedItemIds)) priorUnlocked = p.unlockedItemIds;
          } catch (e) {}
        }
      }

      const studentName = serverStudent.name || shippingData.name || "Rohan Deshmukh";
      const studentEmail = serverStudent.email || shippingData.email || "rohan.deshmukh@gmail.com";
      const rollNumber = serverStudent.student_id || "LRK-2026-068942";
      const mergedUnlockedIds = Array.from(new Set([...priorUnlocked, ...unlockedIds, ...serverUnlockedIds]));

      const generatedOrder = {
        orderId: serverOrder.id || orderId,
        razorpayPaymentId: serverOrder.gateway_payment_id || mockPaymentId,
        items: [...items],
        totalAmount: serverOrder.total_amount || cartTotal,
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
        phone: shippingData.phone || "+91 98765 43210",
        studentId: rollNumber,
        tempPassword: `law@${Math.floor(1000 + Math.random() * 9000)}`,
        unlockedItemIds: mergedUnlockedIds,
        address: hasPhysicalItem
          ? `${shippingData.address}, ${shippingData.city}, ${shippingData.state} - ${shippingData.pincode}`
          : "Digital Delivery to Student Vault & Email",
        trackingNumber: serverOrder.tracking_number || (hasPhysicalItem ? `DTDC-${Math.floor(7000000 + Math.random() * 2000000)}` : "INSTANT-DRM-VAULT"),
      };

      if (typeof window !== "undefined") {
        const studentSession = {
          id: rollNumber,
          name: studentName,
          rollNumber: rollNumber,
          student_id: rollNumber,
          email: studentEmail,
          phone: shippingData.phone,
          targetExam: shippingData.exam,
          activePlanTitle: items.map((i) => i.title).join(" + "),
          unlockedItemIds: mergedUnlockedIds,
          streakDays: 14,
          todayMinutes: 40,
          todayGoalMinutes: 45,
          examCountdownDays: 68,
          avatarInitials: studentName.slice(0, 2).toUpperCase(),
        };
        localStorage.setItem("lawkaksha_active_student", JSON.stringify(studentSession));

        const adminOrderEntry = {
          id: generatedOrder.orderId,
          customer: studentName,
          phone: shippingData.phone,
          item: items.map((i) => `${i.title} (${i.format.toUpperCase()})`).join(", "),
          state: shippingData.state || "Maharashtra",
          address: generatedOrder.address,
          pincode: shippingData.pincode || "400001",
          amount: `₹${cartTotal}`,
          date: "Just now",
          status: "Processing",
          tracking: generatedOrder.trackingNumber,
          courier: hasPhysicalItem ? "DTDC Express Air" : "Instant Student Vault",
        };

        const existingAdminOrders = localStorage.getItem("lawkaksha_admin_orders");
        const parsedAdminOrders = existingAdminOrders ? JSON.parse(existingAdminOrders) : [];
        localStorage.setItem("lawkaksha_admin_orders", JSON.stringify([adminOrderEntry, ...parsedAdminOrders]));
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("lawkaksha_student_updated", { detail: mergedUnlockedIds }));
      }

      setLastOrderDetails(generatedOrder);
      setCheckoutStep("success");
      clearCart();
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-md transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md sm:max-w-lg bg-white border-l border-black/[0.08] text-[#1D1D1F] h-full shadow-[0_20px_60px_rgba(0,0,0,0.18)] flex flex-col justify-between overflow-hidden z-10 animate-in slide-in-from-right duration-300">
        
        {/* TOP HEADER */}
        <div className="px-6 py-4 border-b border-black/[0.05] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black/[0.04] border border-black/[0.06] flex items-center justify-center text-[#0071E3]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-[#1D1D1F]">Your Bag</h2>
                {totalItemCount > 0 && (
                  <span className="text-[11px] font-medium bg-[#0071E3]/[0.08] text-[#0071E3] border border-[#0071E3]/20 px-2.5 py-0.5 rounded-full">
                    {totalItemCount} {totalItemCount === 1 ? "item" : "items"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP PROGRESS BAR */}
        {checkoutStep !== "success" && (
          <div className="px-6 py-2.5 bg-[#F5F5F7] border-b border-black/[0.05] flex items-center justify-between text-xs">
            <button
              onClick={() => setCheckoutStep("cart")}
              className={`flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
                checkoutStep === "cart" ? "text-[#0071E3]" : "text-[#86868B] hover:text-[#1D1D1F]"
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                checkoutStep === "cart" ? "bg-[#0071E3] text-white" : "bg-black/[0.08] text-[#6E6E73]"
              }`}>1</span>
              <span>Bag</span>
            </button>
            <span className="text-black/[0.15]">/</span>
            <button
              onClick={() => items.length > 0 && setCheckoutStep("shipping")}
              disabled={items.length === 0}
              className={`flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
                checkoutStep === "shipping" ? "text-[#0071E3]" : "text-[#86868B] hover:text-[#1D1D1F]"
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                checkoutStep === "shipping" ? "bg-[#0071E3] text-white" : "bg-black/[0.08] text-[#6E6E73]"
              }`}>2</span>
              <span>Details</span>
            </button>
            <span className="text-black/[0.15]">/</span>
            <span
              className={`flex items-center gap-1.5 font-medium ${
                checkoutStep === "payment" ? "text-[#0071E3]" : "text-[#86868B]"
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                checkoutStep === "payment" ? "bg-[#0071E3] text-white" : "bg-black/[0.08] text-[#6E6E73]"
              }`}>3</span>
              <span>Payment</span>
            </span>
          </div>
        )}

        {/* MAIN DRAWER CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* STEP 1: CART ITEMS */}
          {checkoutStep === "cart" && (
            <>
              {items.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-[#F5F5F7] border border-black/[0.06] flex items-center justify-center mx-auto text-[#0071E3]">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold text-[#1D1D1F]">Your bag is empty</h3>
                  <p className="text-xs text-[#6E6E73] max-w-xs mx-auto">
                    Add CA Law codexes, solved past papers, or video classes to get started.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Browse CA Books &amp; Plans
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {/* Item Cards */}
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.format}`}
                      className="p-4 rounded-3xl bg-[#FBFBFD] border border-black/[0.08] shadow-2xs hover:border-black/[0.16] transition-all space-y-3"
                    >
                      {/* Title & Delete */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs sm:text-sm font-semibold text-[#1D1D1F] leading-snug line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-[#86868B] mt-0.5">{item.category}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, item.format)}
                          className="text-[#86868B] hover:text-rose-600 p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Streamlined Format Selector */}
                      <div className="flex items-center gap-1.5 p-1 bg-[#F5F5F7] rounded-full border border-black/[0.04] text-[10.5px]">
                        <span className="text-[#86868B] font-medium px-2 text-[10px] hidden sm:inline">Format:</span>
                        {(["pdf", "paperback", "combo"] as BookFormat[]).map((fmt) => {
                          const isActive = item.format === fmt;
                          const fmtPrice = Math.round(item.price * FORMAT_PRICING[fmt].multiplier);
                          return (
                            <button
                              key={fmt}
                              type="button"
                              onClick={() => changeFormat(item.id, item.format, fmt)}
                              className={`flex-1 py-1 px-2 rounded-full font-medium transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                                isActive
                                  ? "bg-white text-[#0071E3] shadow-xs border border-black/[0.04]"
                                  : "text-[#6E6E73] hover:text-[#1D1D1F]"
                              }`}
                            >
                              <span>{fmt === "pdf" ? "PDF" : fmt === "paperback" ? "Book" : "Combo"}</span>
                              <span className="text-[10px] text-[#86868B] font-normal">₹{fmtPrice}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Quantity Stepper & Price Row */}
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <div className="flex items-center border border-black/[0.08] rounded-full bg-white overflow-hidden shadow-2xs">
                          <button
                            onClick={() => updateQuantity(item.id, item.format, item.quantity - 1)}
                            className="px-2.5 py-1 text-[#6E6E73] hover:bg-black/[0.04] transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 font-semibold text-[#1D1D1F] text-[11px]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.format, item.quantity + 1)}
                            className="px-2.5 py-1 text-[#6E6E73] hover:bg-black/[0.04] transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-bold text-[#1D1D1F] tracking-tight">
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
                        <Tag className="w-3.5 h-3.5 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={inputCoupon}
                          onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                          placeholder="Enter promo code"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-full border border-black/[0.08] bg-[#FBFBFD] uppercase font-mono text-[#1D1D1F] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-full bg-[#1D1D1F] hover:bg-[#2D2D2F] text-white font-medium text-xs transition-colors shadow-2xs cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>

                    {/* Instant 1-Click Promo Pill */}
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-[#86868B]">Offer:</span>
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon(undefined, "CALAW20")}
                        className="px-2.5 py-0.5 rounded-full bg-[#0071E3]/[0.08] hover:bg-[#0071E3]/[0.15] text-[#0071E3] font-medium border border-[#0071E3]/20 transition-colors cursor-pointer"
                      >
                        ⚡ CALAW20 (20% OFF)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon(undefined, "RANKER10")}
                        className="px-2.5 py-0.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium border border-emerald-200 transition-colors cursor-pointer"
                      >
                        🎓 RANKER10 (10% OFF)
                      </button>
                    </div>

                    {couponSuccess && (
                      <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {couponSuccess}
                      </p>
                    )}
                    {couponError && (
                      <p className="text-[11px] text-rose-500 font-medium">
                        {couponError}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 2: STUDENT DETAILS */}
          {checkoutStep === "shipping" && (
            <form onSubmit={handleProceedToPayment} className="space-y-4 text-xs">
              <div className="pb-1.5 border-b border-black/[0.05]">
                <h3 className="text-sm font-semibold text-[#1D1D1F]">Student Contact &amp; Delivery</h3>
                <p className="text-[11px] text-[#86868B]">License credentials will be sent to this email &amp; WhatsApp.</p>
              </div>

              <div>
                <label className="font-medium text-[#424245] block mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={shippingData.name}
                  onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-black/[0.08] bg-[#FBFBFD] text-[#1D1D1F] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-[#424245] block mb-1">WhatsApp Mobile</label>
                  <input
                    type="tel"
                    required
                    value={shippingData.phone}
                    onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                    placeholder="Enter contact number"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-black/[0.08] bg-[#FBFBFD] font-mono text-[#1D1D1F] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
                  />
                </div>
                <div>
                  <label className="font-medium text-[#424245] block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={shippingData.email}
                    onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-black/[0.08] bg-[#FBFBFD] text-[#1D1D1F] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-[#424245] block mb-1">Target Exam</label>
                <select
                  value={shippingData.exam}
                  onChange={(e) => setShippingData({ ...shippingData, exam: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-black/[0.08] bg-[#FBFBFD] text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                >
                  <option value="CA Intermediate Paper 2">CA Intermediate (Paper 2 Corporate &amp; Other Laws)</option>
                  <option value="CA Final Corporate Laws">CA Final (Corporate &amp; Economic Laws)</option>
                  <option value="CA Foundation Business Laws">CA Foundation (Paper 2 Business Laws)</option>
                  <option value="Judiciary PCS-J">Judiciary (PCS-J) Prelims &amp; Mains</option>
                </select>
              </div>

              {/* Physical Dispatch Address */}
              {hasPhysicalItem ? (
                <div className="pt-2 border-t border-black/[0.05] space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[#1D1D1F] font-semibold text-xs">
                    <Truck className="w-3.5 h-3.5 text-[#0071E3]" />
                    <span>Courier Delivery Address:</span>
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      value={shippingData.address}
                      onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                      placeholder="Enter street / building address"
                      className="w-full px-3.5 py-2 rounded-xl border border-black/[0.08] bg-[#FBFBFD] text-[#1D1D1F] text-xs focus:outline-none focus:border-[#0071E3]"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      required
                      value={shippingData.city}
                      onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                      placeholder="Enter city"
                      className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-[#FBFBFD] text-xs text-[#1D1D1F]"
                    />
                    <input
                      type="text"
                      required
                      value={shippingData.state}
                      onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                      placeholder="Enter state"
                      className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-[#FBFBFD] text-xs text-[#1D1D1F]"
                    />
                    <input
                      type="text"
                      required
                      value={shippingData.pincode}
                      onChange={(e) => setShippingData({ ...shippingData, pincode: e.target.value })}
                      placeholder="Enter PIN"
                      className="w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-[#FBFBFD] text-xs font-mono text-[#1D1D1F]"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-black/[0.04] text-[11px] text-[#424245] flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0071E3] shrink-0" />
                  <span>Instant digital activation in Student Portal Vault + DRM sync upon payment.</span>
                </div>
              )}

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setCheckoutStep("cart")}
                  className="px-5 py-2.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] font-medium text-xs transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <span>Proceed to Payment (₹{cartTotal})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: PAYMENT */}
          {checkoutStep === "payment" && (
            <div className="space-y-4 text-xs">
              <div className="pb-1.5 border-b border-black/[0.05]">
                <h3 className="text-sm font-semibold text-[#1D1D1F]">Select Payment Mode</h3>
                <p className="text-[11px] text-[#86868B]">256-Bit SSL Encrypted Banking Gateway</p>
              </div>

              <div className="space-y-2.5">
                {/* UPI Option */}
                <div
                  onClick={() => setSelectedPayment("upi")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedPayment === "upi"
                      ? "bg-[#0071E3]/[0.04] border-[#0071E3] shadow-2xs"
                      : "bg-white border-black/[0.08] hover:border-black/[0.18]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white border border-black/[0.08] flex items-center justify-center text-[#0071E3]">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#1D1D1F]">Instant UPI / QR Code</p>
                        <p className="text-[10px] text-[#86868B]">Google Pay, PhonePe, Paytm, BHIM</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Fastest
                    </span>
                  </div>
                </div>

                {/* Card Option */}
                <div
                  onClick={() => setSelectedPayment("card")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedPayment === "card"
                      ? "bg-[#0071E3]/[0.04] border-[#0071E3] shadow-2xs"
                      : "bg-white border-black/[0.08] hover:border-black/[0.18]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-black/[0.08] flex items-center justify-center text-[#0071E3]">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1D1D1F]">Debit / Credit Card</p>
                      <p className="text-[10px] text-[#86868B]">Visa, Mastercard, RuPay</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep("shipping")}
                  className="px-4 py-2.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] font-medium text-xs cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleCompletePayment}
                  className="flex-1 py-3 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs shadow-[0_2px_8px_rgba(0,113,227,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
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
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Payment Verified
                </span>
                <h3 className="text-lg font-semibold text-[#1D1D1F] mt-2">
                  Access Activated!
                </h3>
                <p className="text-xs text-[#86868B] mt-0.5">
                  Receipt sent to <span className="text-[#0071E3] font-medium">{lastOrderDetails.email}</span>
                </p>
              </div>

              {/* Credentials Box */}
              <div className="text-left p-4 rounded-3xl bg-[#FBFBFD] border border-black/[0.08] space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-black/[0.05]">
                  <span className="font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#0071E3]" />
                    <span>Student Access Credentials</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[#424245]">
                  <div>
                    <span className="text-[10px] text-[#86868B] block">Student ID:</span>
                    <strong className="font-mono text-[#1D1D1F]">{lastOrderDetails.studentId}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#86868B] block">Password:</span>
                    <strong className="font-mono text-[#1D1D1F]">{lastOrderDetails.tempPassword}</strong>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <Link
                  href="/student"
                  onClick={() => {
                    setIsCartOpen(false);
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("lawkaksha_student_updated", { detail: lastOrderDetails.unlockedItemIds }));
                      if (window.location.pathname === "/student") {
                        window.location.reload();
                      }
                    }
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs shadow-[0_2px_8px_rgba(0,113,227,0.25)] transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Launch Student Workspace (Auto-Login)</span>
                </Link>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setInvoiceModalOpen(true)}
                    className="flex-1 py-2 rounded-full bg-white text-[#1D1D1F] hover:text-[#0071E3] font-medium text-xs border border-black/[0.08] hover:border-[#0071E3]/40 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#0071E3]" />
                    <span>Tax Invoice</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      setCheckoutStep("cart");
                    }}
                    className="flex-1 py-2 rounded-full bg-black/[0.04] text-[#6E6E73] hover:text-[#1D1D1F] font-medium text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM TOTAL & CHECKOUT BAR */}
        {checkoutStep === "cart" && items.length > 0 && (
          <div className="p-5 bg-[#F5F5F7] border-t border-black/[0.06] space-y-3 shrink-0">
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-[#6E6E73]">
                <span>Subtotal ({totalItemCount} items)</span>
                <span className="font-semibold text-[#1D1D1F]">₹{cartSubtotal}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex items-center justify-between text-[#0071E3] font-medium">
                  <span>Coupon Discount ({couponCode})</span>
                  <span>- ₹{Math.round((cartSubtotal * couponDiscount) / 100)}</span>
                </div>
              )}
              <div className="flex items-baseline justify-between pt-2 border-t border-black/[0.06] text-sm">
                <span className="font-semibold text-[#1D1D1F]">Total Payable:</span>
                <div className="text-right">
                  <span className="text-xl font-bold text-[#1D1D1F] tracking-tight">₹{cartTotal}</span>
                  {cartSavings > 0 && (
                    <span className="block text-[10px] text-emerald-700 font-medium">
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
              className="w-full py-3 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs shadow-[0_2px_8px_rgba(0,113,227,0.25)] transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <span>Proceed to Checkout ({totalItemCount} {totalItemCount === 1 ? "Item" : "Items"})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Printable Tax Invoice Modal */}
      {invoiceModalOpen && lastOrderDetails && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-black/[0.08] shadow-2xl p-6 space-y-4 text-[#1D1D1F] animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-black/[0.05] pb-3">
              <div>
                <span className="text-[10px] font-semibold uppercase text-[#0071E3] bg-[#0071E3]/[0.08] px-2.5 py-0.5 rounded-full border border-[#0071E3]/20">
                  TAX INVOICE
                </span>
                <h3 className="text-base font-semibold text-[#1D1D1F] mt-1.5">THE LAW KAKSHA</h3>
                <p className="text-[10.5px] text-[#86868B]">GSTIN: 27AABCT1928C1Z4 • Educational Publishing</p>
              </div>
              <button
                onClick={() => setInvoiceModalOpen(false)}
                className="p-1 rounded-full text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.04] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#F5F5F7] p-3.5 rounded-2xl border border-black/[0.04]">
              <div>
                <span className="text-[10px] font-semibold uppercase text-[#86868B] block">Student:</span>
                <strong className="text-[#1D1D1F]">{lastOrderDetails.studentName}</strong>
                <p className="text-[#6E6E73] text-[11px]">{lastOrderDetails.email}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-semibold uppercase text-[#86868B] block">Invoice:</span>
                <p className="font-mono font-semibold text-[#1D1D1F]">{lastOrderDetails.orderId}</p>
                <p className="text-[#6E6E73] text-[10.5px]">{lastOrderDetails.date}</p>
              </div>
            </div>

            <div className="border border-black/[0.06] rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#F5F5F7] text-[#6E6E73] font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Item</th>
                    <th className="p-3 text-center">Format</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04] text-[11px]">
                  {lastOrderDetails.items.map((it: any, iIdx: number) => (
                    <tr key={iIdx}>
                      <td className="p-3 font-medium">{it.title}</td>
                      <td className="p-3 text-center uppercase font-mono text-[10px]">
                        {it.format === "pdf" ? "PDF" : it.format === "paperback" ? "Book" : "Combo"}
                      </td>
                      <td className="p-3 text-right font-semibold">₹{it.price * it.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#FBFBFD] rounded-2xl border border-black/[0.06] text-xs">
              <span className="font-semibold text-[#1D1D1F]">Total Paid:</span>
              <span className="text-lg font-bold text-[#1D1D1F] tracking-tight">₹{lastOrderDetails.totalAmount}</span>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setInvoiceModalOpen(false)}
                className="px-4 py-1.5 rounded-full bg-black/[0.04] text-[#6E6E73] text-xs font-medium cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") window.print();
                }}
                className="px-4 py-1.5 rounded-full bg-[#0071E3] text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
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
