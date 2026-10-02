"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart, BookFormat, FORMAT_PRICING } from "@/context/CartContext";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Tag,
  BookOpen,
  Truck,
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
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
    clearCart,
  } = useCart();

  const [inputCode, setInputCode] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyCoupon(inputCode.trim().toUpperCase());
      setInputCode("");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C4E1EC]/60 text-[#221D1D] text-xs font-medium mb-1">
              <span>Your Library Order</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#221D1D] tracking-tight">
              Shopping Basket
            </h1>
            <p className="text-xs sm:text-sm text-[#4D433F]">
              Review your statutory law codices, apply student coupons &amp; unlock instant in-web reader access
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-[#C35F3B] hover:text-[#221D1D] font-semibold cursor-pointer underline underline-offset-4"
            >
              Clear Basket
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-[#E7E4E7] rounded-3xl p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#F7F7F5] flex items-center justify-center mx-auto text-[#77716E]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-serif font-bold text-[#221D1D]">Your basket is currently empty</h2>
            <p className="text-xs text-[#4D433F] max-w-md mx-auto">
              Explore our CA Foundation Law Codices, 1,200+ MCQ Banks and Video Masterclasses to begin preparation.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-semibold shadow-sm transition-all"
            >
              <span>Explore All Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#E7E4E7] rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tracking-wider text-[#221D1D] uppercase bg-[#C4E1EC]/60 px-2.5 py-0.5 rounded-full border border-[#AED7E9]">
                        In-Web DRM Codex
                      </span>
                      <span className="text-xs text-[#77716E]">{item.category}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-[#221D1D] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#4D433F]">
                      Online browser reading in student learning workspace with zero courier wait.
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                    <div className="text-right">
                      <div className="text-xl font-bold font-serif text-[#221D1D]">
                        ₹{item.price * item.quantity}
                      </div>
                      {item.originalPrice > item.price && (
                        <div className="text-xs text-[#77716E] line-through">
                          ₹{item.originalPrice * item.quantity}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-[#E7E4E7] rounded-xl bg-[#F7F7F5]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-white text-[#221D1D] rounded-l-xl cursor-pointer transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#221D1D]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-white text-[#221D1D] rounded-r-xl cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-xl text-[#77716E] hover:text-[#C35F3B] hover:bg-[#F4C5C0]/30 transition-colors cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary & Coupon */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white border border-[#E7E4E7] rounded-3xl p-6 shadow-sm space-y-5">
                <h2 className="text-base font-serif font-bold text-[#221D1D]">Order Summary</h2>

                {/* Coupon Code Input */}
                <div className="space-y-2">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77716E]" />
                      <input
                        type="text"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder="Promo code"
                        className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-[#E7E4E7] bg-[#F7F7F5] focus:bg-white text-xs text-[#221D1D] uppercase font-semibold focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-2xl bg-[#221D1D] hover:bg-[#4D433F] text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>

                  {couponSuccess && (
                    <div className="text-xs text-[#221D1D] font-medium flex items-center justify-between bg-[#AED7E9]/40 border border-[#AED7E9] px-3 py-1.5 rounded-xl">
                      <span>{couponSuccess}</span>
                      <button onClick={removeCoupon} className="text-[#4D433F] hover:text-[#C35F3B]">
                        &times;
                      </button>
                    </div>
                  )}
                  {couponError && (
                    <div className="text-xs text-[#C35F3B] font-medium bg-[#F4C5C0]/40 border border-[#F4C5C0] px-3 py-1.5 rounded-xl">{couponError}</div>
                  )}
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-2.5 pt-3 border-t border-[#E7E4E7] text-xs">
                  <div className="flex justify-between text-[#4D433F]">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-[#221D1D]">₹{cartSubtotal}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-[#4B8097] font-semibold">
                      <span>Coupon Discount ({couponDiscount}%):</span>
                      <span>-₹{Math.round((cartSubtotal * couponDiscount) / 100)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#4D433F]">
                    <span>DRM Delivery:</span>
                    <span className="text-[#4B8097] font-semibold">Instant In-Web Activation</span>
                  </div>
                  <div className="flex justify-between text-base font-serif font-bold text-[#221D1D] pt-3 border-t border-[#E7E4E7]">
                    <span>Final Total:</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  {cartSavings > 0 && (
                    <div className="text-xs text-[#221D1D] font-semibold text-center bg-[#AED7E9]/30 border border-[#AED7E9] py-1.5 rounded-xl">
                      🎉 Total Savings: ₹{cartSavings}
                    </div>
                  )}
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-3.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="text-center pt-1">
                  <Link href="/courses" className="text-xs text-[#77716E] hover:text-[#221D1D] transition-colors">
                    &larr; Continue Browsing Courses
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
