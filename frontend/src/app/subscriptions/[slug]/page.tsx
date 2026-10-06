"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { apiRequest } from "@/lib/api";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  Award,
  Video,
  FileText,
  Clock,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";

interface SubscriptionDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  mrp: number;
  duration_days: number;
  badge?: string;
  features: string[];
  courses_included?: string[];
  syllabus?: {
    actTitle: string;
    description: string;
    chapters: string[];
  }[];
}

const FALLBACK_SUBSCRIPTION_DATA: Record<string, SubscriptionDetail> = {
  "ca-foundation-monthly": {
    id: "sub-ca-foundation-monthly",
    title: "CA Foundation Business Laws Access Pass",
    slug: "ca-foundation-monthly",
    description: "Complete preparation platform for CA Foundation Paper 2 (ICAI New Scheme). Includes comprehensive chapter codices for all 7 Acts, daily case studies, and live Google Meet doubt clearing.",
    price: 99,
    mrp: 299,
    duration_days: 30,
    badge: "ICAI NEW SCHEME",
    features: [
      "Full coverage of all 7 CA Foundation Acts",
      "Encrypted In-Browser 3D DRM Codex Reader",
      "ICAI Section 16(1) Model Answers & Format Analysis",
      "Daily High-Yield Case Scenarios with Model Solutions",
      "Weekly Live Google Meet Faculty Sessions",
      "Personalized Study Streak & Active Recall Gamification",
    ],
    courses_included: ["ca-foundation-business-laws"],
    syllabus: [
      {
        actTitle: "Indian Regulatory Framework",
        description: "Overview of Indian Legal System, Hierarchy of Courts, and enactment of civil and commercial laws.",
        chapters: ["Sources of Law & Legal Traditions", "Structure of Indian Judicial Organs", "Civil vs Criminal Jurisprudence"],
      },
      {
        actTitle: "The Indian Contract Act, 1872",
        description: "General Principles of Contract, Formation, Consideration, Legality, Free Consent, Performance, and Breach.",
        chapters: ["Nature and Classification of Contracts", "Offer and Acceptance", "Free Consent (Coercion, Undue Influence, Fraud)", "Breach and Remedies for Breach"],
      },
      {
        actTitle: "The Sale of Goods Act, 1930",
        description: "Formation of the contract, Conditions and Warranties, Transfer of Property, and Unpaid Seller Rights.",
        chapters: ["Formation of Contract of Sale", "Conditions and Warranties (Sec 11-17)", "Caveat Emptor & Exceptions", "Rights of Unpaid Seller against Goods"],
      },
      {
        actTitle: "The Indian Partnership Act, 1932",
        description: "Nature of Partnership, Relations of Partners inter se and to third parties, Registration, and Dissolution.",
        chapters: ["General Nature of Partnership", "Relation of Partners to One Another", "Doctrine of Holding Out (Sec 28)", "Dissolution of Firms"],
      },
      {
        actTitle: "The Limited Liability Partnership Act, 2008",
        description: "Salient features, incorporation, partner liability, and conversion into LLP.",
        chapters: ["Characteristics and Distinction from Company", "Incorporation Process & Documentation", "Financial Disclosures & Winding Up"],
      },
      {
        actTitle: "The Companies Act, 2013",
        description: "Corporate veil, types of companies, memorandum and articles, and doctrine of indoor management.",
        chapters: ["Corporate Veil & Landmark Judicial Exceptions", "Private vs Public vs One Person Company", "Ultra Vires Doctrine & Constructive Notice"],
      },
      {
        actTitle: "The Negotiable Instruments Act, 1881",
        description: "Promissory notes, bills of exchange, cheques, crossing, and dishonour under Section 138.",
        chapters: ["Definition and Characteristics of Instruments", "Negotiation, Endorsement and Holder in Due Course", "Section 138 Criminal Liability & Notice Timelines"],
      },
    ],
  },
  "cseet-monthly": {
    id: "sub-cseet-monthly",
    title: "CSEET Legal Aptitude & Business Management Pass",
    slug: "cseet-monthly",
    description: "Complete preparation for ICSI CSEET Paper 2. High-yield unit notes, timed MCQ practice tests, case studies, and live strategy sessions.",
    price: 99,
    mrp: 299,
    duration_days: 30,
    badge: "ICSI SYLLABUS",
    features: [
      "Complete 8 Units Legal Aptitude & Management coverage",
      "Interactive 3D Codex Reader with Single-Device DRM",
      "Unit-wise Timed MCQ Drills with Instant Explanations",
      "Landmark Judgments & Statutory Precedents Deck",
      "Weekly Google Meet Guidance & Revision Masterclasses",
      "30 Days Continuous Learning & Analytics Access",
    ],
    courses_included: ["cseet-legal-aptitude-management"],
    syllabus: [
      {
        actTitle: "Constitution of India",
        description: "Preamble, Fundamental Rights, Directive Principles, and Constitutional Remedies.",
        chapters: ["Fundamental Rights (Articles 14 to 32)", "Writ Jurisdiction of High Courts & Supreme Court"],
      },
      {
        actTitle: "Elements of Company Law",
        description: "Meaning of Company, Board of Directors, Meetings, and Governance Basics.",
        chapters: ["Company Concepts & Types", "Role of Company Secretary & Governance"],
      },
      {
        actTitle: "Elements of General Laws (Contract & Torts)",
        description: "Essential elements of valid agreements and Law of Torts principles.",
        chapters: ["Essentials of Valid Contract", "Strict Liability & Vicarious Liability in Torts"],
      },
      {
        actTitle: "Elements of Company Secretaries Legislation",
        description: "The Company Secretaries Act, 1980 and vision of ICSI profession.",
        chapters: ["ICSI Regulatory Framework", "Ethical Conduct & Practicing Charter"],
      },
      {
        actTitle: "Business Communication & Management",
        description: "Management principles, organizational behaviour, and official communication standards.",
        chapters: ["Planning, Organizing, Leading and Controlling", "Digital Business Communication Norms"],
      },
    ],
  },
  "ca-cs-combo-monthly": {
    id: "sub-ca-cs-combo-monthly",
    title: "CA Foundation + CSEET Dual Access Pass",
    slug: "ca-cs-combo-monthly",
    description: "The complete commerce law combo. Gain simultaneous unrestricted access to both CA Foundation Paper 2 and CSEET Paper 2 study portals.",
    price: 179,
    mrp: 598,
    duration_days: 30,
    badge: "BEST VALUE COMBO",
    features: [
      "Complete 15 Acts & Units across CA Foundation and CSEET",
      "Full access to both study codices in the DRM Reader",
      "Over 1,200+ Chapter MCQs and Daily Case Studies",
      "Combined Live Google Meet Sessions & Doubt Solving",
      "Cross-Stream Legal Comparison Frameworks",
      "30-Day Unrestricted Pass for Dual Aspirants",
    ],
    courses_included: ["ca-foundation-business-laws", "cseet-legal-aptitude-management"],
  },
};

export default function SubscriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "ca-foundation-monthly";
  const { addToCart, setIsCartOpen } = useCart();

  const [subData, setSubData] = useState<SubscriptionDetail>(
    FALLBACK_SUBSCRIPTION_DATA[slug] || FALLBACK_SUBSCRIPTION_DATA["ca-foundation-monthly"]
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const res = await apiRequest<SubscriptionDetail>(`/api/subscriptions/${slug}`);
        if (res.success && res.data) {
          if (isMounted) setSubData(res.data);
        }
      } catch (err) {
        // Fallback remains
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const discountPercent = Math.round(((subData.mrp - subData.price) / subData.mrp) * 100);

  const handleBuyNow = () => {
    addToCart({
      id: subData.id,
      title: subData.title,
      format: "pdf",
      price: subData.price,
      originalPrice: subData.mrp,
      category: "Subscription Pass",
      badge: subData.badge,
    });
    router.push("/checkout");
  };

  const handleAddToCart = () => {
    addToCart({
      id: subData.id,
      title: subData.title,
      format: "pdf",
      price: subData.price,
      originalPrice: subData.mrp,
      category: "Subscription Pass",
      badge: subData.badge,
    });
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0B192C] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/#subscriptions"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#0B192C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Subscriptions
          </Link>
        </div>

        {/* Hero Banner Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0B192C] via-[#11233D] to-[#0A1422] text-white p-8 sm:p-12 shadow-2xl border border-[#C5A880]/30 relative overflow-hidden mb-12">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#C5A880]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              {subData.badge && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#C5A880]/20 text-[#E5D0B5] border border-[#C5A880]/40">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                  {subData.badge}
                </span>
              )}

              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#FDFBF7] leading-tight">
                {subData.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                {subData.description}
              </p>

              <div className="flex flex-wrap gap-4 pt-2 text-xs sm:text-sm text-slate-300">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Clock className="w-4 h-4 text-[#C5A880]" />
                  {subData.duration_days} Days Access
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                  Single Device DRM Protected
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Video className="w-4 h-4 text-[#C5A880]" />
                  Google Meet Live Sessions
                </span>
              </div>
            </div>

            {/* Quick Purchase Box in Hero */}
            <div className="lg:col-span-4 bg-white text-[#0B192C] p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">
                  Subscription Pass
                </p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-serif font-bold text-[#0B192C]">
                    ₹{subData.price}
                  </span>
                  <span className="text-lg text-slate-400 line-through">
                    ₹{subData.mrp}
                  </span>
                  {discountPercent > 0 && (
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-6">
                  One-time payment for {subData.duration_days} days. Instant access.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 bg-[#0B192C] text-white hover:bg-[#11233D] transition-all shadow-md"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                </button>
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 px-6 rounded-xl font-medium text-sm text-[#0B192C] bg-white border border-[#0B192C]/20 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4 text-slate-500" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features & Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-serif font-bold text-[#0B192C] mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#C5A880]" />
              Key Inclusions
            </h2>
            <ul className="space-y-4">
              {subData.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#0B192C] mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
                Digital Rights Management (DRM)
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                To protect original pedagogical scholarship, all study codices are loaded directly into our proprietary high-fidelity web reader.
              </p>
              <ul className="text-xs text-slate-500 space-y-2">
                <li>• Real-time watermark embedded with your registered Student ID and contact</li>
                <li>• Single active hardware device session enforced at all times</li>
                <li>• Optimized for seamless reading across iPads, laptops, and mobile screens</li>
              </ul>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Support available 7 days a week</span>
              <Link href="/contact" className="text-[#0B192C] font-semibold hover:underline">
                Contact Academic Helpdesk
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Syllabus Breakdown (if available) */}
        {subData.syllabus && subData.syllabus.length > 0 && (
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm mb-12">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
                Curriculum Structure
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B192C] mt-1">
                Detailed Syllabus & Covered Acts
              </h2>
            </div>

            <div className="space-y-6">
              {subData.syllabus.map((unit, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#FDFBF7] border border-slate-200/80 hover:border-[#C5A880]/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-lg font-serif font-bold text-[#0B192C]">
                      {unit.actTitle}
                    </h3>
                    <span className="text-xs font-semibold text-slate-400">
                      Module {idx + 1}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">{unit.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {unit.chapters.map((chap, cIdx) => (
                      <span
                        key={cIdx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-white border border-slate-200 text-slate-700"
                      >
                        <FileText className="w-3 h-3 text-[#C5A880]" />
                        {chap}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
