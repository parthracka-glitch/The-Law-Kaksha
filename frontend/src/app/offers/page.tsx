"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { apiRequest } from "@/lib/api";
import {
  Tag,
  Copy,
  Check,
  ArrowRight,
  Gift,
  Clock,
  Percent,
} from "lucide-react";

interface OfferItem {
  id: string;
  title: string;
  description: string;
  banner_url?: string;
  coupon_code?: string;
  discount_badge?: string;
  valid_from?: string;
  valid_to?: string;
  is_active: boolean;
}

const FALLBACK_OFFERS: OfferItem[] = [];

export default function OffersPage() {
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchOffers() {
      try {
        setLoading(true);
        const res = await apiRequest<{ offers?: OfferItem[] } | OfferItem[]>("/api/offers");
        if (res.success && res.data) {
          const list = Array.isArray(res.data)
            ? res.data
            : (res.data as { offers?: OfferItem[] }).offers || [];
          if (isMounted) {
            setOffers(list);
          }
        } else if (isMounted) {
          setOffers([]);
        }
      } catch {
        if (isMounted) setOffers([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchOffers();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopy = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF]/25 text-[#0A192F] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE] shadow-2xs">
            <Gift className="w-3.5 h-3.5 text-[#005A9C]" />
            Promotions &amp; Coupons
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-[#0A192F] tracking-tight">
            Exclusive Aspirant Offers
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#64748B]">
            Copy active coupon codes and apply them at checkout for instant statutory fee reductions.
          </p>
        </div>

        {/* Offers Grid */}
        {offers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#DBEAFE] shadow-sm max-w-lg mx-auto">
            <Gift className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
            <h3 className="font-serif font-bold text-lg text-[#0A192F]">No Active Offers</h3>
            <p className="text-sm text-[#64748B] mt-1">Check back later for seasonal discounts and promotional coupon codes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-3xl p-8 border border-[#DBEAFE] shadow-[0_4px_20px_rgba(10,25,47,0.04)] hover:shadow-[0_16px_40px_rgba(10,25,47,0.08)] hover:border-[#005A9C]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#005A9C]/5 rounded-bl-full pointer-events-none" />

              <div className="relative z-10">
                {/* Badge */}
                {offer.discount_badge && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FDF8E8] text-[#8C6D1F] border border-[#E8D8A6] mb-4">
                    <Percent className="w-3 h-3" />
                    {offer.discount_badge}
                  </span>
                )}

                <h2 className="text-xl font-serif font-bold text-[#0A192F] group-hover:text-[#005A9C] transition-colors mb-3 leading-snug">
                  {offer.title}
                </h2>

                <p className="text-sm text-[#334155] leading-relaxed mb-6">
                  {offer.description}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#DBEAFE] relative z-10">
                {/* Coupon Code Pill */}
                {offer.coupon_code && (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F0F7FF] border border-[#DBEAFE]">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#005A9C]" />
                      <span className="font-mono font-bold text-sm tracking-wider text-[#0A192F]">
                        {offer.coupon_code}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(offer.coupon_code!)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        copiedCode === offer.coupon_code
                          ? "bg-emerald-600 text-white"
                          : "bg-[#005A9C] hover:bg-[#004F8A] text-white shadow-xs active:scale-95"
                      }`}
                    >
                      {copiedCode === offer.coupon_code ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Validity terms */}
                {offer.valid_to && (
                  <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Valid until: {new Date(offer.valid_to).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                )}

                {/* CTA */}
                <Link
                  href="/courses"
                  className="w-full py-3 px-4 rounded-full font-bold text-xs sm:text-sm bg-[#EFF6FF] hover:bg-[#005A9C] hover:text-white text-[#005A9C] border border-[#DBEAFE] transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-2xs"
                >
                  <span>Apply on Subscriptions</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Security / Terms Notice */}
        <div className="mt-16 p-6 rounded-3xl bg-white border border-[#DBEAFE] text-center max-w-2xl mx-auto shadow-xs">
          <p className="text-xs text-[#64748B] leading-relaxed">
            Coupons are validated directly on our secure server during checkout. Only one promo code can be redeemed per transaction. For bulk institutional passes, contact <span className="font-semibold text-[#0A192F]">grievance@thelawkaksha.com</span>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
