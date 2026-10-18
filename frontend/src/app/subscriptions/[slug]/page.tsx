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
    <div className="min-h-screen bg-[#FDFBF7] text-[#221D1D] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/#subscriptions"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#4D433F] hover:text-[#221D1D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            Back to All Subscriptions
          </Link>
        </div>

        {/* Hero Banner Card */}
        <div className="rounded-3xl md:rounded-[2.5rem] bg-white text-[#221D1D] p-8 sm:p-12 shadow-[0_10px_40px_rgba(34,29,29,0.08)] border border-[#E7E4E7] relative overflow-hidden mb-12">
          {/* Ambient aura */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none -z-0 blur-3xl opacity-40"
            style={{
              background:
                "radial-gradient(circle at 80% 20%, #C4E1EC 0%, #AED7E9 40%, transparent 75%)",
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              {subData.badge && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#C4E1EC] text-[#221D1D] border border-[#AED7E9]">
                  <Sparkles className="w-3.5 h-3.5 text-[#221D1D]" />
                  {subData.badge}
                </span>
              )}

              <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#221D1D] leading-tight">
                {subData.title}
              </h1>

              <p className="text-base sm:text-lg text-[#4D433F] max-w-2xl leading-relaxed">
                {subData.description}
              </p>

              <div className="flex flex-wrap gap-2.5 pt-2 text-xs sm:text-sm text-[#221D1D]">
                <span className="inline-flex items-center gap-1.5 bg-[#F7F7F5] border border-[#E7E4E7] px-3.5 py-1.5 rounded-full font-medium">
                  <Clock className="w-4 h-4 text-[#4B8097]" />
                  {subData.duration_days} Days Access
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#F7F7F5] border border-[#E7E4E7] px-3.5 py-1.5 rounded-full font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#4B8097]" />
                  Single Device DRM Protected
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#F7F7F5] border border-[#E7E4E7] px-3.5 py-1.5 rounded-full font-medium">
                  <Video className="w-4 h-4 text-[#4B8097]" />
                  Google Meet Live Sessions
                </span>
              </div>
            </div>

            {/* Quick Purchase Box in Hero */}
            <div className="lg:col-span-4 bg-[#FDFBF7] text-[#221D1D] p-6 sm:p-8 rounded-3xl shadow-sm border border-[#E7E4E7] flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#77716E] font-bold mb-1">
                  Subscription Pass
                </p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-serif font-black text-[#221D1D]">
                    ₹{subData.price}
                  </span>
                  <span className="text-lg text-[#77716E] line-through font-medium">
                    ₹{subData.mrp}
                  </span>
                  {discountPercent > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#C4E1EC] text-[#221D1D] border border-[#AED7E9] text-xs font-bold">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#77716E] mb-6 font-medium">
                  One-time payment for {subData.duration_days} days. Instant access.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2 bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] shadow-[0_2px_8px_rgba(191,175,229,0.35)] transition-all active:scale-95 cursor-pointer min-h-[46px]"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 px-6 rounded-full font-bold text-sm text-[#221D1D] bg-white border border-[#221D1D] hover:bg-[#F7F7F5] flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer min-h-[46px]"
                >
                  <ShoppingCart className="w-4 h-4 text-[#221D1D]" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features & Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-3xl border border-[#E7E4E7] shadow-[0_4px_20px_rgba(34,29,29,0.04)]">
            <h2 className="text-xl font-serif font-black text-[#221D1D] mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#4B8097]" />
              Key Inclusions
            </h2>
            <ul className="space-y-4">
              {subData.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-[#221D1D]">
                  <div className="w-5 h-5 rounded-full bg-[#C4E1EC] text-[#221D1D] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="font-medium">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#E7E4E7] shadow-[0_4px_20px_rgba(34,29,29,0.04)] flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-serif font-black text-[#221D1D] mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#4B8097]" />
                Digital Rights Management (DRM)
              </h2>
              <p className="text-sm text-[#4D433F] leading-relaxed mb-4">
                To protect original pedagogical scholarship, all study codices are loaded directly into our proprietary high-fidelity web reader.
              </p>
              <ul className="text-xs text-[#77716E] space-y-2">
                <li>• Real-time watermark embedded with your registered Student ID and contact</li>
                <li>• Single active hardware device session enforced at all times</li>
                <li>• Optimized for seamless reading across iPads, laptops, and mobile screens</li>
              </ul>
            </div>

            <div className="mt-6 pt-6 border-t border-[#E7E4E7] flex items-center justify-between text-xs text-[#77716E]">
              <span>Support available 7 days a week</span>
              <Link href="/contact" className="text-[#221D1D] font-bold hover:underline">
                Contact Academic Helpdesk
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Syllabus Breakdown (if available) */}
        {subData.syllabus && subData.syllabus.length > 0 && (
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E7E4E7] shadow-sm mb-12">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4B8097]">
                Curriculum Structure
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#221D1D] mt-1">
                Detailed Syllabus &amp; Covered Acts
              </h2>
            </div>

            <div className="space-y-6">
              {subData.syllabus.map((unit, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-[#FDFBF7] border border-[#E7E4E7] hover:border-[#AED7E9] transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-lg font-serif font-black text-[#221D1D]">
                      {unit.actTitle}
                    </h3>
                    <span className="text-xs font-bold text-[#77716E] bg-[#F7F7F5] px-2.5 py-1 rounded-full border border-[#E7E4E7]">
                      Module {idx + 1}
                    </span>
                  </div>
                  <p className="text-sm text-[#4D433F] mb-4">{unit.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {unit.chapters.map((chap, cIdx) => (
                      <span
                        key={cIdx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-[#E7E4E7] text-[#221D1D]"
                      >
                        <FileText className="w-3 h-3 text-[#4B8097]" />
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
