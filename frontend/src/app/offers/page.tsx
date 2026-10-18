"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { apiRequest } from "@/lib/api";
import {
  Sparkles,
  Tag,
  Copy,
  Check,
  Calendar,
  ArrowRight,
  ShieldCheck,
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

const FALLBACK_OFFERS: OfferItem[] = [
  {
    id: "offer-launch-99",
    title: "Launch Celebration Pass: Study Law at ₹99/Month",
    description: "Introductory price on CA Foundation Business Laws & CSEET Legal Aptitude passes. Instant unlocking of the complete digital codices.",
    coupon_code: "LAUNCH99",
    discount_badge: "FLAT ₹200 OFF",
    valid_from: "2026-10-01",
    valid_to: "2026-11-30",
    is_active: true,
  },
  {
    id: "offer-exemption",
    title: "Ranker's Exemption Discount",
    description: "Get an extra 20% off on your checkout with promo code EXEMPTION2026 on all multi-item cart purchases.",
    coupon_code: "EXEMPTION2026",
    discount_badge: "20% OFF",
    valid_from: "2026-10-01",
    valid_to: "2026-12-31",
    is_active: true,
  },
  {
    id: "offer-first50",
    title: "Early Bird Aspirant Pass",
    description: "Exclusive for the first 500 aspirants. Get 15% instant reduction on any single-subject or combo pass.",
    coupon_code: "FIRST50",
    discount_badge: "15% OFF",
    valid_from: "2026-10-01",
    valid_to: "2026-11-30",
    is_active: true,
  },
];

export default function OffersPage() {
  const [offers, setOffers] = useState<OfferItem[]>(FALLBACK_OFFERS);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchOffers() {
      try {
        setLoading(true);
        const res = await apiRequest<OfferItem[]>("/api/offers");
        if (res.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
          if (isMounted) setOffers(res.data);
        }
      } catch (err) {
        // Fallback remains
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
    <div className="min-h-screen bg-[#FDFBF7] text-[#221D1D] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#C4E1EC] text-[#221D1D] border border-[#AED7E9]">
            <Gift className="w-3.5 h-3.5 text-[#221D1D]" />
            Promotions &amp; Coupons
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#221D1D] tracking-tight">
            Exclusive Aspirant Offers
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#4D433F]">
            Copy active coupon codes and apply them at checkout for instant statutory fee reductions.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-3xl p-8 border border-[#E7E4E7] shadow-[0_4px_20px_rgba(34,29,29,0.04)] hover:shadow-[0_12px_36px_rgba(34,29,29,0.08)] hover:border-[#AED7E9] transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C4E1EC]/30 rounded-bl-full pointer-events-none" />

              <div className="relative z-10">
                {/* Badge */}
                {offer.discount_badge && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C4E1EC] text-[#221D1D] border border-[#AED7E9] mb-4">
                    <Percent className="w-3 h-3" />
                    {offer.discount_badge}
                  </span>
                )}

                <h2 className="text-xl font-serif font-black text-[#221D1D] mb-3 leading-snug">
                  {offer.title}
                </h2>

                <p className="text-sm text-[#4D433F] leading-relaxed mb-6">
                  {offer.description}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#E7E4E7] relative z-10">
                {/* Coupon Code Pill */}
                {offer.coupon_code && (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7]">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#4B8097]" />
                      <span className="font-mono font-bold text-sm tracking-wider text-[#221D1D]">
                        {offer.coupon_code}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(offer.coupon_code!)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        copiedCode === offer.coupon_code
                          ? "bg-emerald-600 text-white"
                          : "bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] shadow-xs active:scale-95"
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
                  <div className="flex items-center gap-1.5 text-xs text-[#77716E]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Valid until: {new Date(offer.valid_to).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                )}

                {/* CTA */}
                <Link
                  href="/#subscriptions"
                  className="w-full py-3 px-4 rounded-full font-bold text-xs sm:text-sm bg-[#F7F7F5] hover:bg-[#BFAFE5] text-[#221D1D] border border-[#E7E4E7] transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <span>Apply on Subscriptions</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Security / Terms Notice */}
        <div className="mt-16 p-6 rounded-3xl bg-white border border-[#E7E4E7] text-center max-w-2xl mx-auto shadow-sm">
          <p className="text-xs text-[#77716E]">
            Coupons are validated directly on our secure server during checkout. Only one promo code can be redeemed per transaction. For bulk institutional passes, contact grievance@thelawkaksha.com.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
