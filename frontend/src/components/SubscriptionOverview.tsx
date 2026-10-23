"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  ShieldCheck,
  Sparkles,
  Clock,
  ArrowRight,
  ShoppingCart,
  BookOpen,
  X,
  Award,
  Layers,
  Moon,
  Sun,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useCart } from "@/context/CartContext";

export interface PlanFeatureItem {
  title: string;
  subtitle: string;
}

export interface SubscriptionPlanItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  mrp: number;
  duration_days: number;
  features?: string[];
  richFeatures?: PlanFeatureItem[];
  courses_included?: string[];
  badge?: string;
  is_popular?: boolean;
  is_active: boolean;
}

// 9 Rich Features directly from reference design (Image 2)
export const CA_FOUNDATION_RICH_FEATURES: PlanFeatureItem[] = [
  {
    title: "Complete syllabus",
    subtitle: "All 7 CA Foundation Business Law Acts",
  },
  {
    title: "Interactive 3D Codex",
    subtitle: "Explore your digital law books",
  },
  {
    title: "Weekly Case Lab",
    subtitle: "3 new case studies every week",
  },
  {
    title: "Suggested Answers",
    subtitle: "Understand how to solve case studies",
  },
  {
    title: "Study Resources",
    subtitle: "Notes, LDRs and extra practice questions",
  },
  {
    title: "PYQ Analysis",
    subtitle: "Understand past-paper patterns and important areas",
  },
  {
    title: "Landmark Cases Booklet",
    subtitle: "Revise important judgments and their principles",
  },
  {
    title: "Streaks & Leaderboard",
    subtitle: "Track your consistency and compete with fellow learners",
  },
  {
    title: "One Dedicated Dashboard",
    subtitle: "Keep your learning, practice and progress together",
  },
];

export const CSEET_RICH_FEATURES: PlanFeatureItem[] = [
  {
    title: "Complete ICSI syllabus",
    subtitle: "All 8 Units Legal Aptitude & Business Management",
  },
  {
    title: "Interactive 3D Codex",
    subtitle: "Explore your digital ICSI law books",
  },
  {
    title: "Timed MCQ Practice Lab",
    subtitle: "Unit-wise timed drills with score tracking",
  },
  {
    title: "Suggested Model Solutions",
    subtitle: "Understand structured reasoning for ICSI questions",
  },
  {
    title: "Study Resources & Mindmaps",
    subtitle: "High-yield revision notes, LDRs and concept maps",
  },
  {
    title: "PYQ & Exam Trends",
    subtitle: "Understand ICSI past-paper patterns and key areas",
  },
  {
    title: "Statutory Precedents Deck",
    subtitle: "Revise landmark judicial rulings and definitions",
  },
  {
    title: "Streaks & Leaderboard",
    subtitle: "Track your daily consistency and compete with peers",
  },
  {
    title: "One Dedicated Dashboard",
    subtitle: "Keep your learning, practice and progress together",
  },
];

export const CA_FOUNDATION_ACTS_LIST = [
  { name: "The Indian Regulatory Framework", tag: "Unit 1", status: "Live" },
  { name: "The Indian Contract Act, 1872", tag: "9 Units", status: "Live" },
  { name: "The Sale of Goods Act, 1930", tag: "4 Units", status: "Live" },
  { name: "The Indian Partnership Act, 1932", tag: "3 Units", status: "Live" },
  { name: "The Limited Liability Partnership Act, 2008", tag: "Full Act", status: "Live" },
  { name: "The Companies Act, 2013", tag: "Full Coverage", status: "Live" },
  { name: "The Negotiable Instruments Act, 1881", tag: "Sec 138+", status: "Live" },
];

const FALLBACK_PLANS: SubscriptionPlanItem[] = [
  {
    id: "sub-ca-foundation-monthly",
    title: "CA Foundation Business Laws",
    slug: "ca-foundation-monthly",
    description: "Complete 7 Acts coverage under ICAI New Scheme with chapter codices, case notes & live doubt support.",
    price: 99,
    mrp: 299,
    duration_days: 30,
    richFeatures: CA_FOUNDATION_RICH_FEATURES,
    badge: "MOST POPULAR",
    is_popular: true,
    is_active: true,
  },
  {
    id: "sub-cseet-monthly",
    title: "CSEET Business Law and Management",
    slug: "cseet-monthly",
    description: "Master all 8 Units under ICSI Syllabus with timed MCQ drills, conceptual mindmaps & live mentoring.",
    price: 99,
    mrp: 299,
    duration_days: 30,
    richFeatures: CSEET_RICH_FEATURES,
    badge: "COMING SOON",
    is_popular: false,
    is_active: true,
  },
];

const planKey = (plan: SubscriptionPlanItem) =>
  `${plan.id || ""} ${plan.slug || ""}`.toLowerCase();

const isCseetPlan = (plan: SubscriptionPlanItem) => planKey(plan).includes("cseet");
const isCaPlan = (plan: SubscriptionPlanItem) => planKey(plan).includes("ca-foundation");

const visiblePlans = (plans: SubscriptionPlanItem[]) =>
  plans
    .filter((plan) => !planKey(plan).includes("combo"))
    .filter((plan) => isCaPlan(plan) || isCseetPlan(plan))
    .sort((a, b) => Number(isCseetPlan(a)) - Number(isCseetPlan(b)))
    .map((plan) => ({
      ...plan,
      title: isCseetPlan(plan) ? "CSEET Business Law and Management" : "CA Foundation Business Laws",
      richFeatures: isCseetPlan(plan) ? CSEET_RICH_FEATURES : CA_FOUNDATION_RICH_FEATURES,
    }));

function getPlanFeatures(plan: SubscriptionPlanItem): PlanFeatureItem[] {
  if (plan.richFeatures && plan.richFeatures.length > 0) {
    return plan.richFeatures;
  }
  const key = `${plan.id || ""} ${plan.slug || ""} ${plan.title || ""}`.toLowerCase();
  if (key.includes("ca-foundation") || key.includes("foundation")) {
    return CA_FOUNDATION_RICH_FEATURES;
  }
  if (key.includes("cseet")) {
    return CSEET_RICH_FEATURES;
  }
  if (plan.features && plan.features.length > 0) {
    return plan.features.map((f) => {
      if (f.includes(" — ")) {
        const [t, s] = f.split(" — ");
        return { title: t.trim(), subtitle: s.trim() };
      }
      if (f.includes(": ")) {
        const [t, s] = f.split(": ");
        return { title: t.trim(), subtitle: s.trim() };
      }
      return { title: f, subtitle: "Full platform inclusion" };
    });
  }
  return CA_FOUNDATION_RICH_FEATURES;
}

export function SubscriptionOverview() {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();
  const [plans, setPlans] = useState<SubscriptionPlanItem[]>(FALLBACK_PLANS);
  const [, setLoading] = useState(false);
  const [cardTheme, setCardTheme] = useState<"dark" | "light">("dark");
  const [selectedPlanForDetails, setSelectedPlanForDetails] = useState<SubscriptionPlanItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchPlans() {
      try {
        setLoading(true);
        const res = await apiRequest<SubscriptionPlanItem[]>("/api/subscriptions");
        const payload = res.data as unknown as { subscriptions?: SubscriptionPlanItem[] } | SubscriptionPlanItem[] | undefined;
        const remotePlans = Array.isArray(payload) ? payload : payload?.subscriptions;
        const livePlans = Array.isArray(remotePlans) ? visiblePlans(remotePlans).slice(0, 2) : [];
        if (res.success && livePlans.length === 2 && isMounted) {
          setPlans(livePlans);
        }
      } catch {
        // Fallback remains
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchPlans();

    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash === "#pricing" || hash === "#subscriptions") {
        setTimeout(() => {
          const el = document.getElementById(hash.slice(1));
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 200);
      }
    }

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
    <section
      id="pricing"
      className="py-16 sm:py-24 bg-[#F0F7FF] relative overflow-hidden border-t border-b border-[#DBEAFE] scroll-mt-20"
    >
      <div id="subscriptions" className="absolute -top-24 left-0 pointer-events-none" />

      {/* Subtle background flourishes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
        <div className="absolute top-12 left-10 w-72 h-72 rounded-full bg-[#005A9C]/10 blur-3xl" />
        <div className="absolute bottom-12 right-10 w-96 h-96 rounded-full bg-[#4A90E2]/15 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Theme Switcher */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE]">
              <Sparkles className="w-3.5 h-3.5 text-[#005A9C]" />
              Law Study Passes
            </span>

            {/* Quick Visual Theme Toggle */}
            <div className="inline-flex items-center bg-white p-1 rounded-full border border-[#DBEAFE] shadow-2xs">
              <button
                type="button"
                onClick={() => setCardTheme("dark")}
                className={`flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  cardTheme === "dark"
                    ? "bg-[#0A192F] text-white shadow-xs"
                    : "text-[#64748B] hover:text-[#0A192F]"
                }`}
                title="View in High-Contrast Executive Dark mode matching mobile design"
              >
                <Moon className="w-3 h-3 text-sky-400" />
                <span>Executive Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setCardTheme("light")}
                className={`flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  cardTheme === "light"
                    ? "bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE] shadow-xs"
                    : "text-[#64748B] hover:text-[#0A192F]"
                }`}
                title="View in Classic Light mode"
              >
                <Sun className="w-3 h-3 text-amber-500" />
                <span>Classic Light</span>
              </button>
            </div>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#0A192F] tracking-tight leading-tight">
            Transparent, Affordable &amp; Exam-Focused
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed font-sans">
            Choose your preparation stream. Get instant access to watermarked digital codices, real-time doubt solving, and ICAI/ICSI aligned model answer frameworks.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {plans.map((plan) => {
            const comingSoon = isCseetPlan(plan);
            const isHighlighted = !comingSoon;
            const discountPct = Math.round(((plan.mrp - plan.price) / plan.mrp) * 100);
            const displayBadge = comingSoon ? "COMING SOON" : plan.badge || "MOST POPULAR";
            const richFeatures = getPlanFeatures(plan);
            const isDark = cardTheme === "dark" && isHighlighted;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-3xl transition-all duration-300 p-6 sm:p-8 ${
                  isDark
                    ? "bg-[#070D18] text-white border-2 border-sky-600/50 shadow-[0_20px_50px_rgba(2,132,199,0.22)] -translate-y-1.5"
                    : isHighlighted
                    ? "bg-white text-[#0A192F] border-2 border-[#005A9C] shadow-[0_12px_40px_rgba(0,90,156,0.12)] -translate-y-1.5"
                    : "bg-white text-[#0A192F] border border-[#DBEAFE] shadow-[0_4px_20px_rgba(10,25,47,0.04)] hover:shadow-[0_12px_36px_rgba(0,90,156,0.08)] hover:border-[#005A9C]"
                }`}
              >
                {/* Header Badge */}
                {displayBadge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span
                      className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-md border ${
                        comingSoon
                          ? "bg-[#F8FAFC] text-[#64748B] border-[#CBD5E1]"
                          : isDark
                          ? "bg-sky-500 text-white border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.5)]"
                          : "bg-[#005A9C] text-white border-[#004F8A]"
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-white" />
                      {displayBadge}
                    </span>
                  </div>
                )}

                <div className="flex-1 flex flex-col">
                  {/* Plan Details */}
                  <div className="mb-6 pt-2">
                    <h3
                      className={`text-2xl sm:text-3xl font-serif font-black ${
                        isDark ? "text-white" : "text-[#0A192F]"
                      }`}
                    >
                      {plan.title}
                    </h3>
                    <p
                      className={`mt-2 text-sm leading-relaxed ${
                        isDark ? "text-slate-300" : "text-[#64748B]"
                      }`}
                    >
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing Box */}
                  <div
                    className={`mb-6 p-4 rounded-2xl flex items-baseline justify-between transition-colors ${
                      isDark
                        ? "bg-[#0F172A] border border-slate-800"
                        : "bg-[#EFF6FF] border border-[#DBEAFE]"
                    }`}
                  >
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`text-4xl font-serif font-black ${
                            isDark ? "text-white" : "text-[#0A192F]"
                          }`}
                        >
                          ₹{plan.price}
                        </span>
                        <span
                          className={`text-base line-through font-medium ${
                            isDark ? "text-slate-500" : "text-[#64748B]"
                          }`}
                        >
                          ₹{plan.mrp}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          isDark ? "text-slate-400" : "text-[#64748B]"
                        }`}
                      >
                        / {plan.duration_days} Days Access
                      </span>
                    </div>

                    {discountPct > 0 && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          isDark
                            ? "bg-sky-500/15 text-sky-300 border-sky-500/40"
                            : "bg-white text-[#005A9C] border-[#DBEAFE]"
                        }`}
                      >
                        {discountPct}% OFF
                      </span>
                    )}
                  </div>

                  {/* Subscription Details Part — Exact layout as Image 2 */}
                  <div
                    className={`rounded-2xl p-4 sm:p-5 mb-6 flex-1 transition-all ${
                      isDark
                        ? "bg-black/60 border border-slate-800/80 shadow-inner"
                        : "bg-[#F8FAFC] border border-[#E2E8F0]"
                    }`}
                  >
                    {/* Header: Everything you need, in one place */}
                    <div
                      className={`flex items-center justify-between pb-3.5 mb-4 border-b ${
                        isDark ? "border-slate-800" : "border-slate-200"
                      }`}
                    >
                      <h4
                        className={`text-[15px] sm:text-base font-bold tracking-tight ${
                          isDark ? "text-white" : "text-[#0A192F]"
                        }`}
                      >
                        Everything you need, in one place
                      </h4>
                      <span
                        className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                          isDark
                            ? "bg-sky-950/80 text-sky-300 border-sky-800/80"
                            : "bg-[#EFF6FF] text-[#005A9C] border-[#BFDBFE]"
                        }`}
                      >
                        {richFeatures.length} Key Inclusions
                      </span>
                    </div>

                    {/* Features List with Circular Blue Checkmarks */}
                    <ul className="space-y-3.5">
                      {richFeatures.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-3 group">
                          {/* Circular Blue Checkmark matching Image 2 */}
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110 ${
                              isDark
                                ? "bg-sky-500/15 border border-sky-400/50 text-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.25)]"
                                : "bg-[#EFF6FF] border border-[#93C5FD] text-[#005A9C]"
                            }`}
                          >
                            <Check
                              className={`w-3.5 h-3.5 stroke-[2.75] ${
                                isDark ? "text-sky-400" : "text-[#005A9C]"
                              }`}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-[14px] sm:text-[15px] font-bold leading-snug tracking-tight transition-colors ${
                                isDark
                                  ? "text-white group-hover:text-sky-300"
                                  : "text-[#0A192F] group-hover:text-[#005A9C]"
                              }`}
                            >
                              {feat.title}
                            </p>
                            <p
                              className={`text-[12px] sm:text-[13px] leading-relaxed mt-0.5 font-normal ${
                                isDark ? "text-neutral-400" : "text-[#64748B]"
                              }`}
                            >
                              {feat.subtitle}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTAs */}
                  <div
                    className={`space-y-3 pt-4 border-t ${
                      isDark ? "border-slate-800" : "border-[#DBEAFE]"
                    }`}
                  >
                    {comingSoon ? (
                      <button
                        type="button"
                        disabled
                        className="w-full py-3.5 px-6 rounded-2xl sm:rounded-full font-bold text-sm flex items-center justify-center gap-2 bg-[#F1F5F9] text-[#94A3B8] border border-[#E2E8F0] cursor-not-allowed min-h-[48px]"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Enrolment Opening Soon</span>
                      </button>
                    ) : (
                      <>
                        {/* Start Learning Now -> (Primary CTA from Image 2) */}
                        <button
                          onClick={() => handleBuyNow(plan)}
                          className="w-full py-3.5 px-6 rounded-2xl sm:rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 bg-[#005A9C] hover:bg-[#004880] text-white shadow-[0_4px_16px_rgba(0,90,156,0.35)] transition-all duration-200 active:scale-95 cursor-pointer min-h-[48px]"
                        >
                          <span>Start Learning Now</span>
                          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                        </button>

                        {/* Add to Cart (Secondary CTA) */}
                        <button
                          onClick={() => handleAddToCart(plan)}
                          className={`w-full py-3 px-6 rounded-2xl sm:rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer min-h-[46px] ${
                            isDark
                              ? "bg-transparent border border-slate-700 hover:border-slate-500 text-slate-200 hover:bg-slate-800/60"
                              : "bg-white border border-[#005A9C] text-[#005A9C] hover:bg-[#EFF6FF]"
                          }`}
                        >
                          <ShoppingCart className={`w-4 h-4 ${isDark ? "text-slate-300" : "text-[#005A9C]"}`} />
                          <span>Add to Cart</span>
                        </button>
                      </>
                    )}

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPlanForDetails(plan)}
                        className={`text-xs font-bold underline-offset-4 hover:underline inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isDark
                            ? "text-sky-400 hover:text-sky-300"
                            : "text-[#005A9C] hover:text-[#004F8A]"
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>View Full Syllabus &amp; Act Breakdown</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security / DRM Footer callout */}
        <div className="mt-12 p-6 rounded-3xl bg-white border border-[#DBEAFE] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE] flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#005A9C]" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#0A192F]">Strict Single-Device Protection</p>
              <p className="text-xs text-[#64748B]">All materials are served securely inside the in-browser reader with custom dynamic watermarking.</p>
            </div>
          </div>
          <Link
            href="/login"
            className="text-xs font-bold text-[#005A9C] bg-[#EFF6FF] hover:bg-[#DBEAFE] px-5 py-2.5 rounded-full border border-[#DBEAFE] transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-2xs"
          >
            Already enrolled? Sign in to Portal &rarr;
          </Link>
        </div>
      </div>

      {/* Full Curriculum & Syllabus Modal (Image 2 Full Details View) */}
      {selectedPlanForDetails && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedPlanForDetails(null)}
        >
          <div
            className="bg-[#0B0F19] text-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-800 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-[#070D18]">
              <div>
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  {selectedPlanForDetails.title}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Everything you need, in one place
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlanForDetails(null)}
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Features List */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  Included In This Learning Pass
                </h4>
                <ul className="space-y-3.5 bg-black/40 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
                  {getPlanFeatures(selectedPlanForDetails).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-sky-500/15 border border-sky-400/50 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[2.75]" />
                      </div>
                      <div>
                        <p className="text-[14px] sm:text-[15px] font-bold text-white leading-snug">
                          {feat.title}
                        </p>
                        <p className="text-[12px] sm:text-[13px] text-neutral-400 mt-0.5 font-normal">
                          {feat.subtitle}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Covered Acts Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  7 Covered Acts &amp; Statutory Codices
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CA_FOUNDATION_ACTS_LIST.map((act, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-200 line-clamp-1">{act.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800 shrink-0 ml-2">
                        {act.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="p-5 border-t border-slate-800 bg-[#070D18] flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-baseline gap-2 w-full sm:w-auto">
                <span className="text-3xl font-serif font-black text-white">
                  ₹{selectedPlanForDetails.price}
                </span>
                <span className="text-sm line-through text-slate-500">
                  ₹{selectedPlanForDetails.mrp}
                </span>
                <span className="text-xs text-slate-400">/ 30 Days Access</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart(selectedPlanForDetails);
                    setSelectedPlanForDetails(null);
                  }}
                  className="flex-1 sm:flex-initial py-3 px-5 rounded-full text-xs font-bold border border-slate-700 hover:border-slate-500 text-slate-200 hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlanForDetails(null);
                    handleBuyNow(selectedPlanForDetails);
                  }}
                  className="flex-1 sm:flex-initial py-3 px-6 rounded-full text-xs sm:text-sm font-bold bg-[#005A9C] hover:bg-[#004880] text-white flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/40 cursor-pointer transition-all active:scale-95"
                >
                  <span>Start Learning Now</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
