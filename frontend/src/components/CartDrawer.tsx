"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Check,
  Copy,
  Eye,
  EyeOff,
  Smartphone,
  KeyRound,
  AlertCircle,
} from "lucide-react";
import { useCart, BookFormat, FORMAT_PRICING } from "@/context/CartContext";
import { getOrCreateDeviceId, getDeviceFriendlyName } from "@/utils/deviceHelper";
import { getApiBaseUrl } from "@/lib/api";

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
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    phone: "",
    exam: "CA Foundation Paper 2: Business Laws",
  });
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState<"upi" | "card">("upi");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopyText = (text: string, fieldName: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2500);
    }
  };

  // Auto-prefill student details from existing session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lawkaksha_active_student");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && (parsed.name || parsed.email)) {
            setStudentData((prev) => ({
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
    setPaymentError(null);
    try {
      // 1. Ensure Razorpay Checkout script is loaded
      const scriptLoaded = await loadRazorpayCheckoutScript();
      if (!scriptLoaded) {
        setPaymentError("Unable to load Razorpay payment gateway. Redirecting to checkout page...");
        setIsProcessingPayment(false);
        setIsCartOpen(false);
        router.push("/checkout");
        return;
      }

      // 2. Create order on backend server with price validation
      const createRes = await fetch(
        `${getApiBaseUrl()}/api/orders/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            shippingDetails: studentData,
            couponCode: couponCode || null,
          }),
        }
      );

      const createData = await createRes.json();
      if (!createRes.ok || !createData.success) {
        setPaymentError(createData?.message || "Failed to initiate payment order.");
        setIsProcessingPayment(false);
        return;
      }

      const orderData = createData.data || createData;
      const orderId = orderData.orderId || orderData.id;
      const razorpayOrderId = orderData.order_id || orderData.razorpayOrderId;
      const amountPaise = orderData.amount_paise || Math.round((orderData.amount || cartTotal) * 100);
      const currency = orderData.currency || "INR";
      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || orderData.key_id;

      if (!keyId) {
        setPaymentError("Payment gateway key is missing on the client. Please complete checkout on the main checkout page.");
        setIsProcessingPayment(false);
        return;
      }

      const currentDeviceId = getOrCreateDeviceId();
      const currentDeviceName = getDeviceFriendlyName();

      // 3. Configure Razorpay Standard Checkout options
      const options: any = {
        key: keyId,
        amount: amountPaise,
        currency,
        name: "The Law कक्षा",
        description: items.map((i) => i.title).join(", ") || "CA Foundation / CSEET Codex Pass",
        image: "/assets/logo-transparent.png",
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          setIsProcessingPayment(true);
          try {
            const verifyRes = await fetch(
              `${getApiBaseUrl()}/api/orders/verify`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
              }
            );

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData?.message || "Payment signature verification failed.");
            }

            const serverOrder = verifyData.order || {};
            const serverStudent = verifyData.student || {};
            const serverUnlockedIds = verifyData.unlockedItemIds || [];
            const verifiedStudentId = verifyData.studentId || (verifyData.credentials && verifyData.credentials.studentId) || serverStudent.student_id;
            const verifiedTempPassword = verifyData.tempPassword || (verifyData.credentials && verifyData.credentials.tempPassword);
            const verifiedToken = verifyData.token || "";

            const unlockedIds: string[] = [...serverUnlockedIds];
            items.forEach((item) => {
              if (item.id === "ca-book-vol-1" || item.id === "book-vol-1" || item.id === "prod-vol1" || item.id === "course-ca-foundation-sub" || item.id === "ca-foundation-business-laws") {
                unlockedIds.push("course-ca-foundation-sub", "ca-foundation-business-laws", "book-vol-1");
              } else if (item.id === "ca-book-vol-2" || item.id === "book-vol-2" || item.id === "prod-vol2" || item.id === "course-cseet-sub" || item.id === "cseet-business-law") {
                unlockedIds.push("course-cseet-sub", "cseet-business-law", "book-vol-2");
              } else if (item.id === "prod-combo") {
                unlockedIds.push("course-ca-foundation-sub", "course-cseet-sub", "book-vol-1", "book-vol-2");
              } else {
                unlockedIds.push(item.id);
              }
            });

            let priorUnlocked: string[] = [];
            if (typeof window !== "undefined") {
              const saved = localStorage.getItem("lawkaksha_active_student") || localStorage.getItem("lawkaksha_student_session");
              if (saved) {
                try {
                  const p = JSON.parse(saved);
                  if (p && Array.isArray(p.unlockedItemIds)) priorUnlocked = p.unlockedItemIds;
                } catch (e) {}
              }
            }

            const studentName = serverStudent.name || studentData.name || "Student";
            const studentEmail = serverStudent.email || studentData.email || "";
            const rollNumber = verifiedStudentId || serverStudent.student_id || `LRK-2026-CA${Math.floor(1000 + Math.random() * 9000)}`;
            const finalTempPassword = verifiedTempPassword || `Law@${Math.floor(1000 + Math.random() * 9000)}`;
            const mergedUnlockedIds = Array.from(new Set([...priorUnlocked, ...unlockedIds, ...serverUnlockedIds]));

            const generatedOrder = {
              orderId: serverOrder.id || orderId,
              razorpayPaymentId: response.razorpay_payment_id,
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
              studentName,
              email: studentEmail,
              phone: studentData.phone || "",
              studentId: rollNumber,
              tempPassword: finalTempPassword,
              boundGmail: studentEmail,
              deviceId: currentDeviceId,
              deviceName: currentDeviceName,
              unlockedItemIds: mergedUnlockedIds,
              accessType: "Instant In-Web DRM Access Pass",
            };

            if (typeof window !== "undefined") {
              const studentSession = {
                id: rollNumber,
                name: studentName,
                rollNumber,
                student_id: rollNumber,
                email: studentEmail,
                phone: studentData.phone,
                targetExam: studentData.exam,
                activePlanTitle: items.map((i) => i.title).join(" + "),
                unlockedItemIds: mergedUnlockedIds,
                streakDays: 14,
                todayMinutes: 40,
                todayGoalMinutes: 45,
                examCountdownDays: 68,
                avatarInitials: studentName.slice(0, 2).toUpperCase(),
                activeDeviceId: currentDeviceId,
                activeDeviceName: currentDeviceName,
                boundGmail: studentEmail,
              };

              localStorage.setItem("lawkaksha_student_session", JSON.stringify(studentSession));
              localStorage.setItem("lawkaksha_active_student", JSON.stringify(studentSession));
              if (verifiedToken) {
                localStorage.setItem("lawkaksha_token", verifiedToken);
              }

              const adminSubEntry = {
                id: `LK-SUB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                studentName,
                studentRoll: rollNumber,
                email: studentEmail,
                phone: studentData.phone || "+91 98765 43210",
                item: items.map((i) => i.title).join(", "),
                targetExam: studentData.exam,
                amount: `₹${orderData.amount || cartTotal}`,
                date: "Just now",
                paymentMode: selectedPayment === "upi" ? "UPI / Razorpay" : "Card / Netbanking",
                accessStatus: "Active",
              };

              const existingAdminSubs = localStorage.getItem("lawkaksha_admin_subs");
              const parsedAdminSubs = existingAdminSubs ? JSON.parse(existingAdminSubs) : [];
              localStorage.setItem("lawkaksha_admin_subs", JSON.stringify([adminSubEntry, ...parsedAdminSubs]));
              localStorage.removeItem("lawkaksha_admin_orders");

              window.dispatchEvent(new Event("storage"));
              window.dispatchEvent(new CustomEvent("lawkaksha_student_updated", { detail: mergedUnlockedIds }));
            }

            setLastOrderDetails(generatedOrder);
            setCheckoutStep("success");
            clearCart();
          } catch (verifyErr: any) {
            console.error("Verification error:", verifyErr);
            setPaymentError(verifyErr?.message || "Payment verification failed. Please contact support.");
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: studentData.name,
          email: studentData.email,
          contact: studentData.phone,
        },
        theme: {
          color: "#BFAFE5",
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Payment error:", err);
      setPaymentError(err?.message || "Failed to complete payment transaction.");
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#221D1D]/40 backdrop-blur-md transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-[100vw] sm:max-w-lg bg-white border-l border-[#E7E4E7] text-[#221D1D] h-full shadow-[0_20px_60px_rgba(0,0,0,0.18)] flex flex-col justify-between overflow-hidden z-10 animate-in slide-in-from-right duration-300">
        
        {/* TOP HEADER */}
        <div className="px-4 sm:px-6 py-4 border-b border-[#E7E4E7] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#AED7E9]/40 border border-[#AED7E9] flex items-center justify-center text-[#4B8097]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#221D1D]">Your Bag</h2>
                {totalItemCount > 0 && (
                  <span className="text-[11px] font-semibold bg-[#AED7E9]/40 text-[#221D1D] border border-[#AED7E9] px-2.5 py-0.5 rounded-full">
                    {totalItemCount} {totalItemCount === 1 ? "item" : "items"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2.5 rounded-full bg-[#F7F7F5] hover:bg-[#E7E4E7] text-[#77716E] hover:text-[#221D1D] transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close cart"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* STEP PROGRESS BAR */}
        {checkoutStep !== "success" && (
          <div className="px-4 sm:px-6 py-2.5 bg-[#F7F7F5] border-b border-[#E7E4E7] flex items-center justify-between text-xs">
            <button
              onClick={() => setCheckoutStep("cart")}
              className={`flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                checkoutStep === "cart" ? "text-[#4B8097]" : "text-[#77716E] hover:text-[#221D1D]"
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                checkoutStep === "cart" ? "bg-[#AED7E9] text-[#221D1D]" : "bg-[#E7E4E7] text-[#77716E]"
              }`}>1</span>
              <span>Bag</span>
            </button>
            <span className="text-[#E7E4E7]">/</span>
            <button
              onClick={() => items.length > 0 && setCheckoutStep("details")}
              disabled={items.length === 0}
              className={`flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                checkoutStep === "details" ? "text-[#4B8097]" : "text-[#77716E] hover:text-[#221D1D]"
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                checkoutStep === "details" ? "bg-[#AED7E9] text-[#221D1D]" : "bg-[#E7E4E7] text-[#77716E]"
              }`}>2</span>
              <span>Student Details</span>
            </button>
            <span className="text-[#E7E4E7]">/</span>
            <span
              className={`flex items-center gap-1.5 font-semibold ${
                checkoutStep === "payment" ? "text-[#4B8097]" : "text-[#77716E]"
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                checkoutStep === "payment" ? "bg-[#AED7E9] text-[#221D1D]" : "bg-[#E7E4E7] text-[#77716E]"
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
                  <div className="w-14 h-14 rounded-full bg-[#F7F7F5] border border-[#E7E4E7] flex items-center justify-center mx-auto text-[#4B8097]">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#221D1D]">Your Bag is Empty</h3>
                    <p className="text-xs text-[#77716E] max-w-xs mx-auto mt-1">
                      Explore our statutory law codices and test question banks to begin your preparation.
                    </p>
                  </div>
                  <Link
                    href="/courses"
                    onClick={() => setIsCartOpen(false)}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-bold transition-all shadow-sm"
                  >
                    <span>Browse Codices</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl border border-[#E7E4E7] bg-[#F7F7F5] hover:border-[#AED7E9] transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-bold uppercase text-[#221D1D] bg-[#AED7E9]/40 border border-[#AED7E9] px-2 py-0.5 rounded-full">
                              In-Web DRM Codex
                            </span>
                            {item.badge && (
                              <span className="text-[10px] font-bold text-[#221D1D] bg-[#F4C5C0] px-2 py-0.5 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-[#221D1D] leading-snug">{item.title}</h4>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 rounded-md text-[#77716E] hover:text-[#C35F3B] hover:bg-[#F4C5C0]/30 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-[#E7E4E7]">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#221D1D]">₹{item.price * item.quantity}</span>
                          {item.originalPrice > item.price && (
                            <span className="text-[11px] text-[#77716E] line-through">
                              ₹{item.originalPrice * item.quantity}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 bg-white border border-[#E7E4E7] rounded-full px-2 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-[#77716E] hover:text-[#221D1D] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-[#221D1D] min-w-[12px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-[#77716E] hover:text-[#221D1D] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Coupon Code Section */}
                  <div className="pt-2">
                    {couponCode ? (
                      <div className="p-3 rounded-2xl bg-[#AED7E9]/30 border border-[#AED7E9] text-[#221D1D] text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-[#4B8097]" />
                          <div>
                            <span className="font-bold">{couponCode}</span>
                            <span className="text-[11px] text-[#4D433F] ml-1.5">({couponDiscount}% Off applied)</span>
                          </div>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-[#4B8097] hover:text-[#2B5B70] font-semibold text-[11px] underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Coupon code (e.g. EXEMPTION2026)"
                          value={inputCoupon}
                          onChange={(e) => setInputCoupon(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl border border-[#E7E4E7] bg-[#F7F7F5] text-xs text-[#221D1D] focus:outline-none focus:border-[#AED7E9] uppercase"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-[#E7E4E7] hover:bg-[#DDA994]/40 text-xs font-bold text-[#221D1D] transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </form>
                    )}
                    {couponError && <p className="text-[11px] text-[#C35F3B] mt-1 pl-1">{couponError}</p>}
                    {couponSuccess && <p className="text-[11px] text-[#4B8097] mt-1 pl-1">{couponSuccess}</p>}
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 2: STUDENT DETAILS */}
          {checkoutStep === "details" && (
            <form onSubmit={handleProceedToPayment} className="space-y-4 text-xs">
              <div className="pb-1.5 border-b border-[#E7E4E7]">
                <h3 className="text-sm font-bold text-[#221D1D]">Student Information &amp; DRM License</h3>
                <p className="text-[11px] text-[#77716E]">In-web DRM reader access will be activated instantly for this student account.</p>
              </div>

              <div>
                <label className="font-semibold text-[#4D433F] block mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={studentData.name}
                  onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E7E4E7] bg-[#F7F7F5] text-[#221D1D] focus:outline-none focus:border-[#AED7E9] focus:ring-2 focus:ring-[#AED7E9]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#4D433F] block mb-1">WhatsApp Mobile</label>
                  <input
                    type="tel"
                    required
                    value={studentData.phone}
                    onChange={(e) => setStudentData({ ...studentData, phone: e.target.value })}
                    placeholder="Enter contact number"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E7E4E7] bg-[#F7F7F5] font-mono text-[#221D1D] focus:outline-none focus:border-[#AED7E9] focus:ring-2 focus:ring-[#AED7E9]/30"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#4D433F] block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={studentData.email}
                    onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E7E4E7] bg-[#F7F7F5] text-[#221D1D] focus:outline-none focus:border-[#AED7E9] focus:ring-2 focus:ring-[#AED7E9]/30"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#4D433F] block mb-1">Target Examination</label>
                <select
                  value={studentData.exam}
                  onChange={(e) => setStudentData({ ...studentData, exam: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E7E4E7] bg-[#F7F7F5] text-[#221D1D] focus:outline-none focus:border-[#AED7E9]"
                >
                  <option value="CA Foundation Paper 2: Business Laws">CA Foundation (Paper 2: Business Laws)</option>
                  <option value="CSEET Paper 2: Business Law & Management">CSEET (Paper 2: Business Law &amp; Management)</option>
                  <option value="CA Foundation (Nov Batch)">CA Foundation (November Attempt)</option>
                  <option value="CA Foundation (May Batch)">CA Foundation (May Attempt)</option>
                </select>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#BFAFE5]/20 border border-[#BFAFE5]/40 text-[11px] text-[#221D1D] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4B8097] shrink-0" />
                <span>100% Instant In-Web DRM Codex Access activated immediately upon payment.</span>
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setCheckoutStep("cart")}
                  className="px-5 py-2.5 rounded-full bg-[#F7F7F5] hover:bg-[#E7E4E7] text-[#221D1D] font-semibold text-xs transition-colors cursor-pointer border border-[#E7E4E7]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
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
              <div className="pb-1.5 border-b border-[#E7E4E7]">
                <h3 className="text-sm font-bold text-[#221D1D]">Select Payment Mode</h3>
                <p className="text-[11px] text-[#77716E]">256-Bit SSL Encrypted Banking Gateway</p>
              </div>

              <div className="space-y-2.5">
                {/* UPI Option */}
                <div
                  onClick={() => setSelectedPayment("upi")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedPayment === "upi"
                      ? "bg-[#AED7E9]/20 border-[#AED7E9] shadow-xs"
                      : "bg-white border-[#E7E4E7] hover:border-[#AED7E9]/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white border border-[#E7E4E7] flex items-center justify-center text-[#4B8097]">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#221D1D]">Instant UPI / QR Code</p>
                        <p className="text-[10px] text-[#77716E]">Google Pay, PhonePe, Paytm, BHIM</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#221D1D] bg-[#AED7E9]/50 px-2.5 py-0.5 rounded-full border border-[#AED7E9]">
                      Fastest
                    </span>
                  </div>
                </div>

                {/* Card Option */}
                <div
                  onClick={() => setSelectedPayment("card")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedPayment === "card"
                      ? "bg-[#AED7E9]/20 border-[#AED7E9] shadow-xs"
                      : "bg-white border-[#E7E4E7] hover:border-[#AED7E9]/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-[#E7E4E7] flex items-center justify-center text-[#4B8097]">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#221D1D]">Debit / Credit Card &amp; Netbanking</p>
                      <p className="text-[10px] text-[#77716E]">Visa, Mastercard, RuPay, Netbanking</p>
                    </div>
                  </div>
                </div>
              </div>

              {paymentError && (
                <div className="p-3 rounded-2xl bg-[#F4C5C0]/40 border border-[#F4C5C0] text-[#C35F3B] text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#C35F3B]" />
                  <span>{paymentError}</span>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep("details")}
                  className="px-4 py-2.5 rounded-full bg-[#F7F7F5] hover:bg-[#E7E4E7] text-[#221D1D] font-semibold text-xs cursor-pointer border border-[#E7E4E7]"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleCompletePayment}
                  className="flex-1 py-3 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {isProcessingPayment ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-[#221D1D] border-t-transparent rounded-full animate-spin" />
                      <span>Opening Secure Gateway...</span>
                    </span>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Pay ₹{cartTotal} &amp; Unlock Codex</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-1">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="text-[11px] text-[#4B8097] hover:underline"
                >
                  Prefer full-page checkout? Click here →
                </Link>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER SUCCESS */}
          {checkoutStep === "success" && lastOrderDetails && (
            <div className="text-center py-2 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#AED7E9]/30 text-[#4B8097] border border-[#AED7E9] flex items-center justify-center mx-auto animate-in zoom-in-50">
                <CheckCircle2 className="w-8 h-8 text-[#4B8097]" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#221D1D] bg-[#AED7E9]/40 px-3 py-1 rounded-full border border-[#AED7E9]">
                  Access Pass Verified &amp; Activated
                </span>
                <h3 className="text-lg font-bold text-[#221D1D] mt-2">
                  Enrollment Successful!
                </h3>
                <p className="text-xs text-[#77716E] mt-0.5">
                  Receipt sent to <span className="text-[#4B8097] font-semibold">{lastOrderDetails.email}</span>
                </p>
              </div>

              {/* Secure Credentials Display Card */}
              <div className="text-left p-4 rounded-3xl bg-[#F7F7F5] border border-[#E7E4E7] space-y-3 text-xs shadow-2xs">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#E7E4E7]">
                  <span className="font-bold text-[#221D1D] flex items-center gap-1.5 text-xs">
                    <KeyRound className="w-4 h-4 text-[#4B8097]" />
                    <span>Your Student Login Credentials</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#221D1D] font-bold bg-[#AED7E9]/40 px-2 py-0.5 rounded-full border border-[#AED7E9]">
                    1-Device DRM Lock
                  </span>
                </div>

                {/* Bound Gmail Account */}
                <div className="p-2.5 rounded-2xl bg-white border border-[#E7E4E7] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold text-[#77716E] block">
                      Bound Google / Gmail Account:
                    </span>
                    <span className="font-medium text-[#221D1D] text-xs truncate block">
                      {lastOrderDetails.boundGmail || lastOrderDetails.email}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5" />
                    Verified
                  </span>
                </div>

                {/* Student Roll ID with 1-Click Copy */}
                <div className="p-2.5 rounded-2xl bg-white border border-[#E7E4E7] flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold text-[#77716E] block">
                      Student Roll ID (Username):
                    </span>
                    <strong className="font-mono text-sm text-[#221D1D] tracking-wide">
                      {lastOrderDetails.studentId}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(lastOrderDetails.studentId, "id")}
                    className="px-2.5 py-1.5 rounded-xl bg-[#F7F7F5] hover:bg-[#E7E4E7] text-[#221D1D] text-[11px] font-semibold border border-[#E7E4E7] transition-all flex items-center gap-1 cursor-pointer"
                  >
                    {copiedField === "id" ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-[#77716E]" />
                        <span>Copy ID</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Generated Password with Show/Hide and Copy */}
                <div className="p-2.5 rounded-2xl bg-white border border-[#E7E4E7] flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold text-[#77716E] block">
                      Account Passcode:
                    </span>
                    <strong className="font-mono text-sm text-[#221D1D] tracking-wider">
                      {showPassword ? lastOrderDetails.tempPassword : "••••••••••••"}
                    </strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 rounded-xl bg-[#F7F7F5] hover:bg-[#E7E4E7] text-[#77716E] border border-[#E7E4E7] transition-all cursor-pointer"
                      title={showPassword ? "Hide Passcode" : "Show Passcode"}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyText(lastOrderDetails.tempPassword, "pass")}
                      className="px-2.5 py-1.5 rounded-xl bg-[#F7F7F5] hover:bg-[#E7E4E7] text-[#221D1D] text-[11px] font-semibold border border-[#E7E4E7] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === "pass" ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#77716E]" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Single Active Device Enforcement Notice */}
                <div className="p-2.5 rounded-2xl bg-[#AED7E9]/20 border border-[#AED7E9]/50 text-[10.5px] text-[#4D433F] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#221D1D]">
                    <Smartphone className="w-3.5 h-3.5 text-[#4B8097]" />
                    <span>Single-Device DRM Security Policy</span>
                  </div>
                  <p className="text-[10px] leading-relaxed text-[#77716E]">
                    Your account is registered to this device (<span className="font-semibold text-[#221D1D]">{lastOrderDetails.deviceName || "This Browser"}</span>). Simultaneous logins on multiple devices are disallowed.
                  </p>
                </div>

                {/* 1-Click Copy All Credentials */}
                <button
                  type="button"
                  onClick={() => {
                    const fullText = `The Law Kaksha Credentials:\nStudent Roll ID: ${lastOrderDetails.studentId}\nPassword: ${lastOrderDetails.tempPassword}\nBound Email: ${lastOrderDetails.email}\nDashboard: https://thelawkaksha.com/login`;
                    handleCopyText(fullText, "all");
                  }}
                  className="w-full py-1.5 rounded-xl bg-white hover:bg-[#F7F7F5] text-[#4D433F] text-[11px] font-semibold border border-[#E7E4E7] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedField === "all" ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">All Credentials Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#77716E]" />
                      <span>Copy Full Credentials Note</span>
                    </>
                  )}
                </button>
              </div>

              {/* ACTION BUTTONS: Access Student Dashboard */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/student"
                  onClick={() => {
                    setIsCartOpen(false);
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(
                        new CustomEvent("lawkaksha_student_updated", {
                          detail: lastOrderDetails.unlockedItemIds,
                        })
                      );
                      if (window.location.pathname === "/student") {
                        window.location.reload();
                      }
                    }
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] font-bold text-sm shadow-md transition-all cursor-pointer active:scale-98"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>🎓 Access Student Dashboard</span>
                </Link>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setInvoiceModalOpen(true)}
                    className="flex-1 py-2 rounded-full bg-white text-[#221D1D] hover:text-[#4B8097] font-semibold text-xs border border-[#E7E4E7] hover:border-[#AED7E9] flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#4B8097]" />
                    <span>Receipt Invoice</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      setCheckoutStep("cart");
                    }}
                    className="flex-1 py-2 rounded-full bg-[#F7F7F5] text-[#77716E] hover:text-[#221D1D] font-semibold text-xs cursor-pointer border border-[#E7E4E7]"
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
          <div className="p-4 sm:p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] bg-[#F7F7F5] border-t border-[#E7E4E7] space-y-3 shrink-0">
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-[#77716E]">
                <span>Subtotal ({totalItemCount} items)</span>
                <span className="font-bold text-[#221D1D]">₹{cartSubtotal}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex items-center justify-between text-[#4B8097] font-bold">
                  <span>Coupon Discount ({couponCode})</span>
                  <span>- ₹{Math.round((cartSubtotal * couponDiscount) / 100)}</span>
                </div>
              )}
              <div className="flex items-baseline justify-between pt-2 border-t border-[#E7E4E7] text-sm">
                <span className="font-bold text-[#221D1D]">Total Payable:</span>
                <div className="text-right">
                  <span className="text-xl font-bold text-[#221D1D] tracking-tight">₹{cartTotal}</span>
                  {cartSavings > 0 && (
                    <span className="block text-[10px] text-[#4B8097] font-semibold">
                      Saved ₹{cartSavings}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setCheckoutStep("details")}
              className="w-full py-3 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <span>Proceed to Access Details ({totalItemCount} {totalItemCount === 1 ? "Item" : "Items"})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Printable Tax Invoice Modal */}
      {invoiceModalOpen && lastOrderDetails && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#221D1D]/50 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E7E4E7] shadow-2xl p-6 space-y-4 text-[#221D1D] animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#E7E4E7] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#221D1D] bg-[#AED7E9]/40 px-2.5 py-0.5 rounded-full border border-[#AED7E9]">
                  DIGITAL ACCESS RECEIPT
                </span>
                <h3 className="text-base font-bold text-[#221D1D] mt-1.5">THE LAW KAKSHA</h3>
                <p className="text-[10.5px] text-[#77716E]">GSTIN: 27AABCT1928C1Z4 • Statutory Law Education</p>
              </div>
              <button
                onClick={() => setInvoiceModalOpen(false)}
                className="p-1 rounded-full text-[#77716E] hover:text-[#221D1D] hover:bg-[#F7F7F5] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#F7F7F5] p-3.5 rounded-2xl border border-[#E7E4E7]">
              <div>
                <span className="text-[10px] font-semibold uppercase text-[#77716E] block">Student:</span>
                <strong className="text-[#221D1D]">{lastOrderDetails.studentName}</strong>
                <p className="text-[#4D433F] text-[11px]">{lastOrderDetails.email}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-semibold uppercase text-[#77716E] block">Access Ref:</span>
                <p className="font-mono font-bold text-[#221D1D]">{lastOrderDetails.orderId}</p>
                <p className="text-[#77716E] text-[10.5px]">{lastOrderDetails.date}</p>
              </div>
            </div>

            <div className="border border-[#E7E4E7] rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#F7F7F5] text-[#77716E] font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Codex / Pass</th>
                    <th className="p-3 text-center">Format</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E4E7] text-[11px]">
                  {lastOrderDetails.items.map((it: any, iIdx: number) => (
                    <tr key={iIdx}>
                      <td className="p-3 font-semibold text-[#221D1D]">{it.title}</td>
                      <td className="p-3 text-center uppercase font-mono text-[10px] text-[#4B8097] font-bold">
                        In-Web DRM Codex
                      </td>
                      <td className="p-3 text-right font-bold text-[#221D1D]">₹{it.price * it.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#F7F7F5] rounded-2xl border border-[#E7E4E7] text-xs">
              <span className="font-bold text-[#221D1D]">Total Paid:</span>
              <span className="text-lg font-bold text-[#221D1D] tracking-tight">₹{lastOrderDetails.totalAmount}</span>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setInvoiceModalOpen(false)}
                className="px-4 py-1.5 rounded-full bg-[#F7F7F5] text-[#77716E] text-xs font-semibold cursor-pointer border border-[#E7E4E7]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") window.print();
                }}
                className="px-4 py-1.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
