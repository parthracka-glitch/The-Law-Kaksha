"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ShieldCheck, Sparkles, Clock, ArrowRight, ShoppingCart, BookOpen } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useCart } from "@/context/CartContext";

export interface SubscriptionPlanItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  mrp: number;
  duration_days: number;
  features: string[];
  courses_included?: string[];
  badge?: string;
  is_popular?: boolean;
  is_active: boolean;
}

const FALLBACK_PLANS: SubscriptionPlanItem[] = [
  {
    id: "sub-ca-foundation-monthly",
    title: "CA Foundation Business Laws",
    slug: "ca-foundation-monthly",
    description: "Complete 7 Acts coverage under ICAI New Scheme with chapter codices, case notes & live doubt support.",
    price: 99,
    mrp: 299,
    duration_days: 30,
    features: [
      "Access to all 7 CA Foundation Acts",
      "Interactive 3D Digital Codex Reader",
      "Daily High-Yield Case Scenarios",
      "ICAI Section 16(1) Model Answers",
      "Weekly Google Meet Doubt Classes",
      "Single-Device Watermarked Security",
    ],
    badge: "MOST POPULAR",
    is_popular: true,
    is_active: true,
  },
  {
    id: "sub-cseet-monthly",
    title: "CSEET Legal Aptitude & Management",
    slug: "cseet-monthly",
    description: "Master all 8 Units under ICSI Syllabus with timed MCQ drills, conceptual mindmaps & live mentoring.",
    price: 99,
    mrp: 299,
    duration_days: 30,
    features: [
      "Complete 8 Units Legal & Management Study",
      "Unit-wise Timed MCQ Drills & Analytics",
      "Statutory Definitions & Precedents Deck",
      "Live Google Meet Strategy Sessions",
      "Mobile & Desktop In-Browser DRM",
      "30 Days Continuous Content Updates",
    ],
    badge: "ICSI SYLLABUS",
    is_popular: false,
    is_active: true,
  },
  {
    id: "sub-ca-cs-combo-monthly",
    title: "CA + CSEET Dual Pass",
    slug: "ca-cs-combo-monthly",
    description: "The complete commerce law power pack. Unlocks both CA Foundation & CSEET portals simultaneously.",
    price: 179,
    mrp: 598,
    duration_days: 30,
    features: [
      "Includes BOTH CA Foundation & CSEET Codices",
      "Full 15 Subjects & Acts Access",
      "Unlimited Mock Exams & Evaluation",
      "Priority Google Meet Q&A Sessions",
      "Personalized Study Streak Tracking",
      "Full 30-Day Dual Pass Access",
    ],
    badge: "BEST VALUE",
    is_popular: false,
    is_active: true,
  },
];

export function SubscriptionOverview() {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();
  const [plans, setPlans] = useState<SubscriptionPlanItem[]>(FALLBACK_PLANS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchPlans() {
      try {
        setLoading(true);
        const res = await apiRequest<SubscriptionPlanItem[]>("/api/subscriptions");
        if (res.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
          if (isMounted) setPlans(res.data);
        }
      } catch (err) {
        // Fallback remains
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchPlans();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleBuyNow = (plan: SubscriptionPlanItem) => {
    addToCart({
      id: plan.id,
      title: plan.title,
      format: "pdf",
      price: plan.price,
      originalPrice: plan.mrp,
      category: "Subscription Pass",
      badge: plan.badge,
    });
    router.push("/checkout");
  };

  const handleAddToCart = (plan: SubscriptionPlanItem) => {
    addToCart({
      id: plan.id,
      title: plan.title,
      format: "pdf",
      price: plan.price,
      originalPrice: plan.mrp,
      category: "Subscription Pass",
      badge: plan.badge,
    });
    setIsCartOpen(true);
  };

  return (
    <section id="subscriptions" className="py-16 sm:py-24 bg-[#FDFBF7] relative overflow-hidden">
      {/* Subtle background flourishes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
        <div className="absolute top-12 left-10 w-72 h-72 rounded-full bg-[#AED7E9]/30 blur-3xl" />
        <div className="absolute bottom-12 right-10 w-96 h-96 rounded-full bg-[#BFAFE5]/20 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#C4E1EC] text-[#221D1D] border border-[#AED7E9]">
            <Sparkles className="w-3.5 h-3.5 text-[#221D1D]" />
            Law Study Passes
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#221D1D] tracking-tight leading-tight">
            Transparent, Affordable &amp; Exam-Focused
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#4D433F] leading-relaxed font-sans">
            Choose your preparation stream. Get instant access to watermarked digital codices, real-time doubt solving, and ICAI/ICSI aligned model answer frameworks.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const isHighlighted = plan.is_popular || plan.badge === "MOST POPULAR" || plan.badge === "BEST VALUE";
            const discountPct = Math.round(((plan.mrp - plan.price) / plan.mrp) * 100);

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-3xl transition-all duration-300 p-7 sm:p-8 ${
                  isHighlighted
                    ? "bg-white border-2 border-[#AED7E9] shadow-[0_12px_40px_rgba(174,215,233,0.35)] -translate-y-1.5"
                    : "bg-white border border-[#E7E4E7] shadow-[0_4px_20px_rgba(34,29,29,0.04)] hover:shadow-[0_12px_36px_rgba(34,29,29,0.08)] hover:border-[#AED7E9]"
                }`}
              >
                {/* Header Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#BFAFE5] text-[#221D1D] shadow-xs border border-[#A08DC9]">
                      <Sparkles className="w-3 h-3 text-[#221D1D]" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="flex-1 flex flex-col">
                  {/* Plan Details */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-serif font-black text-[#221D1D]">
                      {plan.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#4D433F] line-clamp-2">
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing Box */}
                  <div className="mb-6 p-4 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7] flex items-baseline justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-serif font-black text-[#221D1D]">
                          ₹{plan.price}
                        </span>
                        <span className="text-base text-[#77716E] line-through font-medium">
                          ₹{plan.mrp}
                        </span>
                      </div>
                      <span className="text-xs text-[#77716E] font-medium">
                        / {plan.duration_days} Days Access
                      </span>
                    </div>

                    {discountPct > 0 && (
                      <span className="px-2.5 py-1 rounded-full bg-[#C4E1EC] text-[#221D1D] border border-[#AED7E9] text-xs font-bold">
                        {discountPct}% OFF
                      </span>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8 flex-1">
                    <p className="text-xs font-bold text-[#77716E] uppercase tracking-wider">
                      Included in this pass:
                    </p>
                    <ul className="space-y-2.5">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-[#221D1D]">
                          <div className="w-5 h-5 rounded-full bg-[#C4E1EC] text-[#221D1D] flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                          <span className="font-medium">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTAs */}
                  <div className="space-y-3 pt-4 border-t border-[#E7E4E7]">
                    <button
                      onClick={() => handleBuyNow(plan)}
                      className="w-full py-3.5 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2 bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] shadow-[0_2px_8px_rgba(191,175,229,0.35)] transition-all duration-200 active:scale-95 cursor-pointer min-h-[46px]"
                    >
                      <span>Buy Now</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </button>

                    <button
                      onClick={() => handleAddToCart(plan)}
                      className="w-full py-3 px-6 rounded-full font-bold text-sm text-[#221D1D] bg-white border border-[#221D1D] hover:bg-[#F7F7F5] flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer min-h-[46px]"
                    >
                      <ShoppingCart className="w-4 h-4 text-[#221D1D]" />
                      <span>Add to Cart</span>
                    </button>

                    <div className="text-center pt-1">
                      <Link
                        href={`/subscriptions/${plan.slug}`}
                        className="text-xs text-[#4B8097] hover:text-[#221D1D] font-bold underline-offset-4 hover:underline inline-flex items-center gap-1 transition-colors"
                      >
                        <BookOpen className="w-3 h-3" />
                        View Full Syllabus &amp; Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security / DRM Footer callout */}
        <div className="mt-12 p-6 rounded-3xl bg-white border border-[#E7E4E7] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#AED7E9] text-[#221D1D] flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#221D1D]" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#221D1D]">Strict Single-Device Protection</p>
              <p className="text-xs text-[#4D433F]">All materials are served securely inside the in-browser reader with custom dynamic watermarking.</p>
            </div>
          </div>
          <Link
            href="/student/login"
            className="text-xs font-bold text-[#221D1D] hover:text-[#221D1D] bg-[#F7F7F5] hover:bg-[#AED7E9]/40 px-5 py-2.5 rounded-full border border-[#E7E4E7] transition-all cursor-pointer whitespace-nowrap"
          >
            Already enrolled? Sign in to Portal &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
