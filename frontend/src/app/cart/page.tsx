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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
              Shopping Basket
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Review your course selections, choose digital or printed formats &amp; apply ranker coupons
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
            >
              Clear Basket
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-xs">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">Your basket is currently empty</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Explore our CA Law Codices, 1,200+ MCQ Banks and Video Masterclasses to begin preparation.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xs"
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
                  key={`${item.id}-${item.format}`}
                  className="bg-white border border-sky-100 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-md">
                    <span className="text-[10px] font-bold tracking-wider text-[#0284C7] uppercase bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                      {item.category || "Study Material"}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 font-serif leading-snug">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Format:</span>
                      <select
                        value={item.format}
                        onChange={(e) =>
                          changeFormat(item.id, item.format, e.target.value as BookFormat)
                        }
                        className="py-0.5 px-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
                      >
                        <option value="pdf">Encrypted PDF (Instant)</option>
                        <option value="paperback">Deluxe Hardcopy (Doorstep)</option>
                        <option value="combo">Combo Pass (PDF + Book + Mocks)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                    <div className="text-right">
                      <div className="text-lg font-extrabold text-slate-900">
                        ₹{item.price * item.quantity}
                      </div>
                      {item.originalPrice > item.price && (
                        <div className="text-[11px] text-slate-400 line-through">
                          ₹{item.originalPrice * item.quantity}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.format, item.quantity - 1)}
                          className="p-1.5 hover:bg-slate-50 text-slate-600 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.format, item.quantity + 1)}
                          className="p-1.5 hover:bg-slate-50 text-slate-600 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id, item.format)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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
              <div className="bg-white border border-sky-100 rounded-2xl p-6 shadow-xs space-y-5">
                <h2 className="text-base font-bold text-slate-900 font-serif">Order Summary</h2>

                {/* Coupon Code Input */}
                <div className="space-y-2">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 uppercase font-semibold focus:outline-none focus:border-[#0284C7]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>

                  {couponSuccess && (
                    <div className="text-[11px] text-emerald-600 font-semibold flex items-center justify-between bg-emerald-50 px-2 py-1 rounded-md">
                      <span>{couponSuccess}</span>
                      <button onClick={removeCoupon} className="text-slate-400 hover:text-red-500">
                        &times;
                      </button>
                    </div>
                  )}
                  {couponError && (
                    <div className="text-[11px] text-red-600 font-semibold">{couponError}</div>
                  )}
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-900">₹{cartSubtotal}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Coupon Discount ({couponDiscount}%):</span>
                      <span>-₹{Math.round((cartSubtotal * couponDiscount) / 100)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Pan-India Delivery:</span>
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-100">
                    <span>Final Total:</span>
                    <span className="text-[#0284C7]">₹{cartTotal}</span>
                  </div>
                  {cartSavings > 0 && (
                    <div className="text-[11px] text-emerald-600 font-bold text-center bg-emerald-50 py-1 rounded-md">
                      🎉 Total Savings: ₹{cartSavings}
                    </div>
                  )}
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:from-[#0369A1] hover:to-[#0284C7] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="text-center">
                  <Link href="/courses" className="text-xs text-slate-500 hover:text-slate-900">
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
