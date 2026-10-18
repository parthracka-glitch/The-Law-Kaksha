"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { apiRequest } from "@/lib/api";
import {
  ArrowLeft,
  Scale,
  Sparkles,
  Award,
  BookOpen,
  CheckCircle2,
  FileText,
  Share2,
  Copy,
  Check,
} from "lucide-react";

interface CaseStudyDetail {
  id: string;
  slug: string;
  title: string;
  subject: string;
  summary: string;
  badge?: string;
  marks?: string;
  precedent?: string;
  facts?: string;
  issue?: string;
  ruling?: string;
  model_answer?: string;
  key_takeaways?: string[];
  content?: string;
}

const FALLBACK_DETAILS: Record<string, CaseStudyDetail> = {
  "mohoribibee-v-dharmodas-ghose": {
    id: "cs-mohoribibee",
    slug: "mohoribibee-v-dharmodas-ghose",
    title: "Mohoribibee v. Dharmodas Ghose (1903) 30 IA 114",
    subject: "The Indian Contract Act, 1872",
    summary: "Landmark Privy Council ruling establishing that an agreement entered into by a minor is void ab initio under Section 11, and no restitution can be claimed.",
    badge: "ICAI FAVORITE",
    marks: "6 Marks Model Case",
    precedent: "Privy Council (1903) 30 IA 114 : ILR 30 Cal 539",
    facts: "Dharmodas Ghose, a minor, mortgaged his immovable property in favour of Brahmo Dutt, a moneylender, to secure a loan of ₹20,000. At the time of the transaction, the moneylender's attorney knew that Dharmodas was a minor. Later, Dharmodas through his mother brought an action for declaration that the mortgage was void and cancelled. The moneylender contended that the minor had fraudulently represented his age and claimed refund of the advanced money under Section 64/65 of the Indian Contract Act.",
    issue: "Whether a mortgage executed by a minor is void or voidable, and whether the moneylender is entitled to restitution of money advanced under Section 64 or 65.",
    ruling: "The Privy Council, speaking through Sir Lord Davey, held that Section 11 of the Indian Contract Act makes it imperative that an agreement made by an incompetent person (such as a minor) is void ab initio (void from the very beginning). Therefore, the mortgage was entirely null and void. Furthermore, Section 64 and Section 65 apply only to agreements between competent parties or voidable contracts that are later rescinded; neither section applies to agreements that were void ab initio.",
    model_answer: "1. APPLICABLE PROVISIONS:\nUnder Section 10 and Section 11 of the Indian Contract Act, 1872, every person is competent to contract who is of the age of majority according to the law to which he is subject, of sound mind, and not disqualified by law.\n\n2. LEGAL PRINCIPLE (RATIO DECIDENDI):\nAs affirmed in the locus classicus Mohoribibee v. Dharmodas Ghose (1903), a contract entered into by a minor is absolute void ab initio. The rule of estoppel (Section 115, Evidence Act) does not apply against a minor. There can be no ratification of an agreement upon attaining majority because a void transaction cannot be validated retrospectively.\n\n3. RESTITUTION DOCTRINE:\nUnder the Specific Relief Act, 1963 (Section 33), if a minor has received any benefit, the Court may require him to restore the benefit only if the goods/property are traceable in his hands and justice so requires, but money cannot be ordered to be refunded if spent.",
    key_takeaways: [
      "A minor's agreement is void ab initio — not merely voidable.",
      "The doctrine of estoppel cannot be invoked against a minor.",
      "A minor cannot ratify a contract entered during minority after attaining majority.",
      "Sections 64 and 65 of ICA 1872 do not apply to void ab initio contracts.",
    ],
  },
  "salomon-v-salomon-co-ltd": {
    id: "cs-salomon",
    slug: "salomon-v-salomon-co-ltd",
    title: "Salomon v. Salomon & Co. Ltd [1897] AC 22",
    subject: "The Companies Act, 2013",
    summary: "The foundational English House of Lords decision establishing that an incorporated company has a legal personality distinct from its members and shareholders.",
    badge: "FOUNDATIONAL",
    marks: "5 Marks Theory Question",
    precedent: "House of Lords [1897] AC 22",
    facts: "Aron Salomon ran a prosperous leather and boot manufacturing business as a sole proprietor. He formed a company, Salomon & Co. Ltd., consisting of himself, his wife, daughter, and four sons. Salomon took 20,001 shares and £10,000 in secured debentures creating a floating charge over the company's assets. During trade depression, the company went into liquidation. Unsecured creditors claimed that Salomon and the company were one and the same entity.",
    issue: "Whether an incorporated company possesses an independent corporate identity distinct from its subscribers and dominant shareholder.",
    ruling: "The House of Lords unanimously reversed the Court of Appeal, holding that once a company is legally incorporated in compliance with statutory formalities, it is an independent legal entity entirely separate from its shareholders and directors. Salomon as a secured debenture holder was entitled to priority payment over ordinary unsecured creditors.",
    key_takeaways: [
      "A company is at law a different person altogether from its subscribers.",
      "The motives of those promoting the company are irrelevant if statutory incorporation is valid.",
      "Debentures held by a majority shareholder maintain priority over unsecured third-party claims.",
    ],
  },
};

export default function CaseStudyDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "mohoribibee-v-dharmodas-ghose";
  const [caseData, setCaseData] = useState<CaseStudyDetail>(
    FALLBACK_DETAILS[slug] || FALLBACK_DETAILS["mohoribibee-v-dharmodas-ghose"]
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await apiRequest<CaseStudyDetail>(`/api/case-studies/${slug}`);
        if (res.success && res.data) {
          if (isMounted) setCaseData(res.data);
        }
      } catch (e) {
        // Fallback remains
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#221D1D] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Top actions */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#4D433F] hover:text-[#221D1D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            Back to Case Studies
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E7E4E7] text-xs font-bold text-[#221D1D] bg-white hover:bg-[#F7F7F5] transition-all shadow-xs cursor-pointer active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                <span>Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#4B8097]" />
                <span>Share Case</span>
              </>
            )}
          </button>
        </div>

        {/* Case Header Card */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl md:rounded-[2.5rem] border border-[#E7E4E7] shadow-[0_10px_40px_rgba(34,29,29,0.08)] mb-8">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4B8097]">
              {caseData.subject}
            </span>
            {caseData.badge && (
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#C4E1EC] text-[#221D1D] border border-[#AED7E9]">
                {caseData.badge}
              </span>
            )}
            {caseData.marks && (
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#C4E1EC]/60 text-[#221D1D] border border-[#AED7E9]">
                {caseData.marks}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-black text-[#221D1D] leading-snug mb-4">
            {caseData.title}
          </h1>

          {caseData.precedent && (
            <p className="font-mono text-xs text-[#77716E] mb-6 bg-[#F7F7F5] px-3.5 py-1.5 rounded-full inline-block border border-[#E7E4E7]">
              Citation: {caseData.precedent}
            </p>
          )}

          <p className="text-base sm:text-lg text-[#4D433F] leading-relaxed border-l-4 border-[#BFAFE5] pl-4 italic bg-[#FDFBF7] py-3.5 rounded-r-2xl">
            {caseData.summary}
          </p>
        </div>

        {/* Facts & Legal Issues */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {caseData.facts && (
            <div className="bg-white p-8 rounded-3xl border border-[#E7E4E7] shadow-[0_4px_20px_rgba(34,29,29,0.04)]">
              <h2 className="text-lg font-serif font-black text-[#221D1D] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#4B8097]" />
                Material Facts
              </h2>
              <p className="text-sm text-[#4D433F] leading-relaxed whitespace-pre-line">
                {caseData.facts}
              </p>
            </div>
          )}

          {caseData.issue && (
            <div className="bg-white p-8 rounded-3xl border border-[#E7E4E7] shadow-[0_4px_20px_rgba(34,29,29,0.04)]">
              <h2 className="text-lg font-serif font-black text-[#221D1D] mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#4B8097]" />
                Legal Issue Raised
              </h2>
              <p className="text-sm text-[#4D433F] leading-relaxed whitespace-pre-line">
                {caseData.issue}
              </p>
            </div>
          )}
        </div>

        {/* Ratio Decidendi / Ruling */}
        {caseData.ruling && (
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E7E4E7] shadow-[0_4px_20px_rgba(34,29,29,0.04)] mb-8">
            <h2 className="text-xl font-serif font-black text-[#221D1D] mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#4B8097]" />
              Judgment &amp; Ratio Decidendi
            </h2>
            <p className="text-sm sm:text-base text-[#4D433F] leading-relaxed whitespace-pre-line">
              {caseData.ruling}
            </p>
          </div>
        )}

        {/* Model Answer Drafting Framework */}
        {caseData.model_answer && (
          <div className="bg-white text-[#221D1D] p-8 sm:p-10 rounded-3xl border-2 border-[#AED7E9] shadow-[0_8px_30px_rgba(174,215,233,0.3)] mb-8 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#4B8097]" />
              <h2 className="text-xl font-serif font-black text-[#221D1D]">
                ICAI / ICSI Model Answer Blueprint
              </h2>
            </div>
            <pre className="font-sans text-xs sm:text-sm text-[#221D1D] whitespace-pre-wrap leading-relaxed bg-[#FDFBF7] p-6 rounded-2xl border border-[#E7E4E7]">
              {caseData.model_answer}
            </pre>
          </div>
        )}

        {/* Key Takeaways */}
        {caseData.key_takeaways && caseData.key_takeaways.length > 0 && (
          <div className="bg-white p-8 rounded-3xl border border-[#E7E4E7] shadow-sm mb-12">
            <h2 className="text-lg font-serif font-black text-[#221D1D] mb-4">
              Exam Summary Anchors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {caseData.key_takeaways.map((point, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7] text-xs sm:text-sm text-[#221D1D]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#4B8097] shrink-0 mt-0.5" />
                  <span className="font-medium">{point}</span>
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
