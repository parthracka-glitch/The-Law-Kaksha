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
  CheckCircle2,
  FileText,
  Share2,
  Check,
  GraduationCap,
  BookOpen,
  HelpCircle,
  AlertCircle,
  Layers,
  ChevronRight,
} from "lucide-react";

export interface CaseStudyDetail {
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

  // CA Foundation View
  ca_step1_provisions?: string;
  ca_step2_facts?: string;
  ca_step3_precedent?: string;
  ca_step4_conclusion?: string;
  ca_marking_scheme?: string;

  // CSEET View
  cseet_core_doctrine?: string;
  cseet_exam_traps?: string;
  cseet_practice_mcq?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

const FALLBACK_DETAILS: Record<string, CaseStudyDetail> = {
  "salomon-v-salomon-co-ltd": {
    id: "cs-salomon",
    slug: "salomon-v-salomon-co-ltd",
    title: "Salomon v. Salomon & Co. Ltd [1897] AC 22",
    subject: "The Companies Act, 2013",
    summary:
      "The foundational English House of Lords decision establishing that an incorporated company has an independent corporate legal personality distinct from its members and shareholders.",
    badge: "FOUNDATIONAL",
    marks: "6 Marks • High Yield",
    precedent: "House of Lords [1897] AC 22",
    facts:
      "Aron Salomon ran a prosperous leather and boot manufacturing business as a sole proprietor. He formed a company, Salomon & Co. Ltd., consisting of himself, his wife, daughter, and four sons. Salomon took 20,001 shares and £10,000 in secured debentures creating a floating charge over the company's assets. Each family member took 1 share. During a trade depression, the company went into liquidation. Unsecured creditors claimed that Salomon and the company were one and the same entity and that debentures held by him should be subordinated.",
    issue:
      "Whether an incorporated company possesses an independent corporate identity distinct from its subscribers and dominant shareholder, and whether a majority shareholder holding valid debentures can claim priority over unsecured creditors.",
    ruling:
      "The House of Lords unanimously reversed the Court of Appeal, holding that once a company is legally incorporated in compliance with statutory formalities, it is an independent legal entity entirely separate from its shareholders and directors. Salomon as a secured debenture holder was entitled to priority payment over ordinary unsecured creditors.",
    model_answer:
      "1. STATUTORY PROVISIONS:\nUnder Section 9 of the Companies Act, 2013, upon registration and issuance of the Certificate of Incorporation, a company becomes a body corporate with perpetual succession, power to acquire, hold, and dispose of property, to enter into contracts, and to sue and be sued in its own name.\n\n2. FACTS APPLICATION:\nHere, Salomon & Co. Ltd. was duly incorporated in accordance with legal formalities. The mere fact that Aron Salomon held 20,001 out of 20,007 shares does not make the business his personal agency. The company is at law an independent legal persona.\n\n3. LANDMARK PRECEDENT (Salomon v. Salomon & Co. Ltd.):\nThe House of Lords affirmed that the motive of incorporation is irrelevant if statutory requirements are fulfilled. The corporate veil shields members from company liabilities, and debentures held by a shareholder are legally valid and enforceable against the company's assets.\n\n4. DEFINITIVE CONCLUSION:\nSalomon is a legitimate secured creditor. His debenture claims (£10,000) take statutory precedence over unsecured third-party creditors in the liquidation waterfall.",
    key_takeaways: [
      "A company is at law a different person altogether from its subscribers.",
      "The motives of those promoting the company are irrelevant if statutory incorporation is valid.",
      "Debentures held by a majority shareholder maintain statutory priority over general unsecured claims.",
      "The corporate veil can only be lifted in statutory exceptions (fraud, tax evasion, sham company).",
    ],
    // CA Foundation Point of View
    ca_step1_provisions:
      "According to Section 9 of the Companies Act, 2013, from the date of incorporation mentioned in the certificate of incorporation, the subscribers to the memorandum and all other persons who may from time to time become members of the company shall be a body corporate by the name contained in the memorandum, capable of exercising all functions of an incorporated company under this Act and having perpetual succession with power to acquire, hold and dispose of property, and to contract and to sue and be sued in its own name.",
    ca_step2_facts:
      "In the given case, Salomon incorporated a company strictly complying with the Companies Act requirement of 7 members. Salomon took 20,001 shares and £10,000 debentures, while 6 family members took 1 share each. When the company suffered losses and went into liquidation, unsecured trade creditors claimed that the company was a mere sham and Salomon should be personally liable.",
    ca_step3_precedent:
      "In Salomon v. Salomon & Co. Ltd. [1897] AC 22, the House of Lords held that the company has a separate legal existence. Lord Macnaghten observed: 'The company is at law a different person altogether from the subscribers to the memorandum; and, though it may be that after incorporation the business is precisely the same as it was before, and the same persons are managers, and the same hands receive the profits, the company is not in law the agent of the subscribers or trustee for them.'",
    ca_step4_conclusion:
      "CONCLUSION:\n(i) Salomon is not personally liable for the debts of Salomon & Co. Ltd.\n(ii) As a holder of valid mortgage debentures, Salomon is entitled to be paid £10,000 in priority out of the realized assets before any disbursement to unsecured creditors.",
    ca_marking_scheme:
      "ICAI Marking Framework (Total 6 Marks):\n• Step 1 (Quoting Section 9 & Independent Entity): 2 Marks\n• Step 2 (Facts Application & Analysis of Salomon's Holding): 1.5 Marks\n• Step 3 (Citing Salomon v. Salomon precedent & Lord Macnaghten's ratio): 1.5 Marks\n• Step 4 (Definitive Conclusion regarding secured priority): 1 Mark",
    // CSEET Point of View
    cseet_core_doctrine:
      "DOCTRINE OF SEPARATE LEGAL ENTITY: Incorporation gives birth to a new legal person distinct from its members. Shareholders are neither owners of the company's property nor personally liable for its debts. Even if one member holds 99% of share capital, the company remains an independent juristic entity.",
    cseet_exam_traps:
      "ICSI Exam Traps:\n1. Trap: 'Can an employee who is also the 99% owner claim workmen's compensation from the company?' -> YES! As established in Lee v. Lee's Air Farming Ltd., a person can function simultaneously in dual capacities as director and employee of his own company.\n2. Trap: 'Does a sole shareholder hold an insurable interest in the timber owned by the company?' -> NO! In Macaura v. Northern Assurance Co. Ltd., shareholders hold no legal or equitable interest in company assets.",
    cseet_practice_mcq: {
      question:
        "Under Company Law (Salomon v. Salomon & Co. Ltd.), what is the legal relationship between an incorporated company and its majority shareholder?",
      options: [
        "The company is considered a trustee holding property on behalf of its majority shareholder.",
        "The company is an independent legal entity, entirely distinct from its members and shareholders.",
        "The majority shareholder is personally liable as an undisclosed principal for all company debts.",
        "The company acts as the personal commercial agent of the dominant director.",
      ],
      correctIndex: 1,
      explanation:
        "Correct Answer: B. The House of Lords held that once incorporated, a company is at law a distinct legal entity (persona ficta) and is neither the agent nor trustee of its subscribers.",
    },
  },

  "mohoribibee-v-dharmodas-ghose": {
    id: "cs-mohoribibee",
    slug: "mohoribibee-v-dharmodas-ghose",
    title: "Mohoribibee v. Dharmodas Ghose (1903) 30 IA 114",
    subject: "The Indian Contract Act, 1872",
    summary:
      "Landmark Privy Council ruling establishing that an agreement entered into by a minor is void ab initio under Section 11, and no restitution can be claimed.",
    badge: "ICAI FAVORITE",
    marks: "6 Marks Model Case",
    precedent: "Privy Council (1903) 30 IA 114 : ILR 30 Cal 539",
    facts:
      "Dharmodas Ghose, a minor, mortgaged his immovable property in favour of Brahmo Dutt, a moneylender, to secure a loan of ₹20,000. At the time of the transaction, the moneylender's attorney knew that Dharmodas was a minor. Later, Dharmodas through his mother brought an action for declaration that the mortgage was void and cancelled. The moneylender contended that the minor had fraudulently represented his age and claimed refund of the advanced money under Section 64/65 of the Indian Contract Act.",
    issue:
      "Whether a mortgage executed by a minor is void or voidable, and whether the moneylender is entitled to restitution of money advanced under Section 64 or 65.",
    ruling:
      "The Privy Council, speaking through Sir Lord Davey, held that Section 11 of the Indian Contract Act makes it imperative that an agreement made by an incompetent person (such as a minor) is void ab initio (void from the very beginning). Therefore, the mortgage was entirely null and void. Furthermore, Section 64 and Section 65 apply only to agreements between competent parties or voidable contracts that are later rescinded; neither section applies to agreements that were void ab initio.",
    model_answer:
      "1. APPLICABLE PROVISIONS:\nUnder Section 10 and Section 11 of the Indian Contract Act, 1872, every person is competent to contract who is of the age of majority according to the law to which he is subject, of sound mind, and not disqualified by law.\n\n2. LEGAL PRINCIPLE (RATIO DECIDENDI):\nAs affirmed in the locus classicus Mohoribibee v. Dharmodas Ghose (1903), a contract entered into by a minor is absolute void ab initio. The rule of estoppel (Section 115, Evidence Act) does not apply against a minor. There can be no ratification of an agreement upon attaining majority because a void transaction cannot be validated retrospectively.\n\n3. RESTITUTION DOCTRINE:\nUnder the Specific Relief Act, 1963 (Section 33), if a minor has received any benefit, the Court may require him to restore the benefit only if the goods/property are traceable in his hands and justice so requires, but money cannot be ordered to be refunded if spent.",
    key_takeaways: [
      "A minor's agreement is void ab initio — not merely voidable.",
      "The doctrine of estoppel cannot be invoked against a minor under Section 115.",
      "A minor cannot ratify a contract entered during minority after attaining majority.",
      "Sections 64 and 65 of ICA 1872 do not apply to void ab initio contracts.",
    ],
    // CA Foundation Point of View
    ca_step1_provisions:
      "According to Section 10 of the Indian Contract Act, 1872, all agreements are contracts if they are made by the free consent of parties competent to contract, for a lawful consideration and with a lawful object. Section 11 further specifies that every person is competent to contract who is of the age of majority according to the law to which he is subject, and who is of sound mind and is not disqualified from contracting by any law.",
    ca_step2_facts:
      "In the present case, Dharmodas Ghose was a minor when he executed the mortgage in favour of Brahmo Dutt. Although ₹20,000 was stated in the deed, only ₹8,000 was actually paid. The attorney of Brahmo Dutt was fully aware of Dharmodas's minority at the time of execution. Dharmodas subsequently instituted proceedings through his guardian to cancel the mortgage.",
    ca_step3_precedent:
      "The Privy Council in Mohoribibee v. Dharmodas Ghose (1903) 30 IA 114 authoritatively laid down that the Indian Contract Act requires parties to be competent, and an agreement with a minor is void ab initio. The doctrine of estoppel cannot be applied to defeat a positive statutory prohibition. Sections 64 and 65 apply only where a contract exists and is subsequently avoided or discovered to be void; they have no application to an agreement void ab initio.",
    ca_step4_conclusion:
      "CONCLUSION:\n(i) The mortgage deed executed by the minor Dharmodas Ghose is void ab initio and of no legal effect.\n(ii) The moneylender cannot recover the advanced money under Section 64 or 65 of the Indian Contract Act.",
    ca_marking_scheme:
      "ICAI Marking Framework (Total 6 Marks):\n• Step 1 (Section 10 & 11 Competency to Contract): 2 Marks\n• Step 2 (Facts Application & Attorney's Knowledge): 1.5 Marks\n• Step 3 (Citing Mohoribibee ratio & Section 64/65 exclusion): 1.5 Marks\n• Step 4 (Definitive Verdict on Void Ab Initio & No Refund): 1 Mark",
    // CSEET Point of View
    cseet_core_doctrine:
      "MINORS' CAPACITY TO CONTRACT: In India, a minor's agreement is completely void ab initio (void from inception). A minor can always plead his minority as a complete defence. Rule of estoppel does not apply against a minor, nor can an agreement made during minority be ratified after turning 18.",
    cseet_exam_traps:
      "ICSI Exam Traps:\n1. Trap: 'Can a minor be a beneficiary or promisee in a contract?' -> YES! Law protects minors from liabilities, not from receiving benefits (e.g. promissory note executed in favour of a minor is enforceable).\n2. Trap: 'Can a minor's property be attached for necessaries supplied?' -> YES, but only his estate/property is liable under Section 68; the minor is NEVER personally liable.",
    cseet_practice_mcq: {
      question:
        "Under the Indian Contract Act, 1872 (Mohoribibee v. Dharmodas Ghose), what is the legal status of an agreement entered into with a minor?",
      options: [
        "It is voidable at the option of the minor upon attaining majority.",
        "It is valid if supported by adequate consideration and signed in good faith.",
        "It is void ab initio (completely void from the very beginning).",
        "It is enforceable as an equitable contract under the doctrine of restitution.",
      ],
      correctIndex: 2,
      explanation:
        "Correct Answer: C. In Mohoribibee v. Dharmodas Ghose, the Privy Council settled that an agreement with a minor is void ab initio, and the moneylender cannot enforce it or claim restitution under Section 64/65.",
    },
  },

  "carlill-v-carbolic-smoke-ball-co": {
    id: "cs-carlill",
    slug: "carlill-v-carbolic-smoke-ball-co",
    title: "Carlill v. Carbolic Smoke Ball Co. [1893] 1 QB 256",
    subject: "The Indian Contract Act, 1872",
    summary:
      "Landmark Court of Appeal decision establishing that an offer made to the public at large (General Offer) can be accepted through performance of conditions without prior notification.",
    badge: "LANDMARK PRECEDENT",
    marks: "6 Marks Case Problem",
    precedent: "Court of Appeal [1893] 1 QB 256",
    facts:
      "The Carbolic Smoke Ball Co. advertised in several newspapers that it would pay £100 reward to anyone who contracted influenza, cold, or any disease caused by taking cold, after using their ball three times daily for two weeks according to printed directions. To prove their sincerity, they deposited £1,000 with the Alliance Bank, Regent Street. Mrs. Carlill bought and used the smoke ball as directed from November 1891 to January 1892, but contracted influenza. The company refused payment, contending that the ad was a mere sales puff, no contract could be made with the whole world, and Mrs. Carlill never communicated her acceptance.",
    issue:
      "Whether an advertisement addressed to the world constitutes a binding offer and whether acceptance of a general offer requires express advance notification before performance.",
    ruling:
      "The Court of Appeal held that the advertisement was a binding General Offer. Deposit of £1,000 proved sincerity and intention to create legal relations. Under the law of contracts (Section 8 of Indian Contract Act), performance of the conditions of an offer constitutes valid acceptance without requiring advance communication.",
    model_answer:
      "1. STATUTORY PROVISION:\nSection 8 of the Indian Contract Act, 1872 provides that performance of the conditions of a proposal constitutes acceptance of the proposal.\n\n2. GENERAL OFFER DOCTRINE:\nAn offer made to the public at large (General Offer) can be accepted by any person who performs the stipulated conditions with knowledge of the offer (Carlill v. Carbolic Smoke Ball Co.).\n\n3. CONCLUSION:\nMrs. Carlill performed all terms as prescribed; a completed contract came into existence, and the company was legally bound to pay the £100 reward.",
    key_takeaways: [
      "A general offer made to the world can be accepted by any member of the public.",
      "Performance of conditions is sufficient acceptance without advance notice (Section 8).",
      "Depositing funds in a bank proves intention to create legal relations (not a mere puff).",
    ],
    // CA Foundation Point of View
    ca_step1_provisions:
      "According to Section 2(a) and Section 8 of the Indian Contract Act, 1872, an offer may be made to a specific person or to the public at large (General Offer). Section 8 states: 'Performance of the conditions of a proposal, or the acceptance of any consideration for a reciprocal promise which may be offered with a proposal, is an acceptance of the proposal.' Communication of acceptance is dispensed with when the offeror by his offer indicates that performance of the condition will suffice.",
    ca_step2_facts:
      "The Carbolic Smoke Ball Co. advertised a £100 reward for anyone who contracted influenza after using their ball as directed, and deposited £1,000 in a bank as proof of sincerity. Mrs. Carlill purchased the ball, used it strictly as instructed, and contracted influenza.",
    ca_step3_precedent:
      "In Carlill v. Carbolic Smoke Ball Co. [1893] 1 QB 256, Bowen L.J. and Lindley L.J. rejected the company's defence, holding: (i) An offer can be made to the entire world, and matures into a contract with anyone who comes forward and performs the condition; (ii) The deposit of £1,000 was conclusive evidence of intention to create legal relations; (iii) In unilateral contracts, notification of acceptance is not required before performing the condition.",
    ca_step4_conclusion:
      "CONCLUSION:\nA binding contract was created between Mrs. Carlill and the Carbolic Smoke Ball Co. upon her performance of the condition. Mrs. Carlill is entitled to recover the £100 reward.",
    ca_marking_scheme:
      "ICAI Marking Framework (Total 6 Marks):\n• Step 1 (Section 8 & General Offer Principle): 2 Marks\n• Step 2 (Facts Analysis & Deposit of £1,000 Sincerity): 1.5 Marks\n• Step 3 (Citing Carlill v Carbolic Smoke Ball ratio): 1.5 Marks\n• Step 4 (Definitive Finding of Breach & Reward Recovery): 1 Mark",
    // CSEET Point of View
    cseet_core_doctrine:
      "GENERAL OFFER & PERFORMANCE AS ACCEPTANCE: Unlike a specific offer which can only be accepted by the person to whom it is made, a General Offer is made to the world at large. Any person possessing knowledge of the offer can accept it merely by performing the specified condition (Section 8), without giving notice of acceptance.",
    cseet_exam_traps:
      "ICSI Exam Traps:\n1. Trap: 'Can a person who had NO knowledge of the reward claim it after performing the act?' -> NO! In Lalman Shukla v. Gauri Dutt, performance without knowledge of the offer does NOT create a contract.\n2. Trap: 'Is an invitation to offer the same as a general offer?' -> NO! Display of goods in a shop or tender notices are invitations to offer, not offers.",
    cseet_practice_mcq: {
      question:
        "Under Contract Law (Carlill v. Carbolic Smoke Ball Co.), how does an offeree accept a General Offer made to the public at large?",
      options: [
        "By sending an express written acceptance by registered post within 14 days.",
        "By performing the conditions stipulated in the offer without advance communication (Section 8).",
        "By obtaining prior confirmation from the offeror's bank.",
        "By executing a formal bilateral deed attested by witnesses.",
      ],
      correctIndex: 1,
      explanation:
        "Correct Answer: B. Under Section 8 and the rule in Carlill v. Carbolic Smoke Ball Co., performing the conditions of a general offer is valid acceptance without requiring advance communication.",
    },
  },
};

export default function CaseStudyDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "salomon-v-salomon-co-ltd";
  const [caseData, setCaseData] = useState<CaseStudyDetail>(
    FALLBACK_DETAILS[slug] || FALLBACK_DETAILS["salomon-v-salomon-co-ltd"]
  );
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"ca" | "cseet" | "judicial">("ca");
  const [selectedMcqOption, setSelectedMcqOption] = useState<number | null>(null);
  const [isMcqSubmitted, setIsMcqSubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await apiRequest<{ caseStudy?: CaseStudyDetail; data?: CaseStudyDetail } & CaseStudyDetail>(
          `/api/case-studies/${slug}`
        );
        if (res.success && res.data) {
          const raw = res.data;
          const found =
            raw.caseStudy ||
            raw.data ||
            (raw.title ? (raw as CaseStudyDetail) : null);

          if (found && isMounted) {
            setCaseData((prev) => ({
              ...prev,
              ...found,
              id: found.id || prev.id || slug,
              slug: found.slug || prev.slug || slug,
              title: found.title || prev.title,
              subject:
                found.subject ||
                (found as unknown as { act_name?: string }).act_name ||
                prev.subject,
              summary: found.summary || prev.summary,
              badge: found.badge || prev.badge,
              marks: found.marks || prev.marks,
              precedent: found.precedent || prev.precedent,
              facts: found.facts || prev.facts,
              issue: found.issue || prev.issue,
              ruling: found.ruling || prev.ruling,
              model_answer:
                found.model_answer ||
                (found as unknown as { content?: string }).content ||
                prev.model_answer,
              key_takeaways:
                Array.isArray(found.key_takeaways) && found.key_takeaways.length > 0
                  ? found.key_takeaways
                  : prev.key_takeaways,
            }));
          }
        }
      } catch {
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

  const handleMcqSelect = (idx: number) => {
    setSelectedMcqOption(idx);
    setIsMcqSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A192F] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Top Breadcrumb & Dual Exam Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#005A9C] hover:text-[#004F8A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back to Case Studies Directory</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-[#005A9C] border border-blue-200">
              ICAI CA Foundation
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
              ICSI CSEET
            </span>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-slate-200 text-xs font-bold text-[#475569] bg-white hover:bg-slate-50 transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#005A9C]" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Case Header Card */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#CBD5E1] shadow-2xs mb-8 relative overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#005A9C] via-[#38BDF8] to-[#0A192F] absolute top-0 left-0" />

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#005A9C]">
              {caseData.subject}
            </span>
            {caseData.badge && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#EFF6FF] text-[#005A9C] border border-[#BFDBFE]">
                {caseData.badge}
              </span>
            )}
            {caseData.marks && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                {caseData.marks}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-black text-[#0A192F] leading-tight mb-3">
            {caseData.title}
          </h1>

          {caseData.precedent && (
            <p className="font-mono text-xs text-[#64748B] mb-5 bg-slate-50 px-3.5 py-1.5 rounded-xl inline-block border border-slate-200">
              ⚖️ Landmark Precedent Citation: <strong>{caseData.precedent}</strong>
            </p>
          )}

          <div className="p-4 rounded-2xl bg-[#EFF6FF]/70 border-l-4 border-[#005A9C] text-xs sm:text-sm text-[#0A192F] leading-relaxed">
            <span className="font-bold block text-[11px] uppercase tracking-wider text-[#005A9C] mb-1">
              Core Legal Ratio Decidendi
            </span>
            {caseData.summary}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DUAL PERSPECTIVE SWITCHER: CA FOUNDATION vs CSEET vs JUDICIAL BREAKDOWN   */}
        {/* ========================================================================= */}
        <div className="mb-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 flex-wrap gap-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#64748B]">
                Examination Perspective Switcher
              </span>
              <h2 className="text-sm font-bold text-[#0A192F]">
                Tailored Legal Framework for Both Professional Courses
              </h2>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("ca")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "ca"
                    ? "bg-[#005A9C] text-white shadow-xs"
                    : "text-[#475569] hover:text-[#0A192F]"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>📘 CA Foundation (ICAI)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("cseet")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "cseet"
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-[#475569] hover:text-[#0A192F]"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>📗 CSEET (ICSI)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("judicial")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "judicial"
                    ? "bg-[#0A192F] text-white shadow-xs"
                    : "text-[#475569] hover:text-[#0A192F]"
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>⚖️ Judicial Facts</span>
              </button>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: CA FOUNDATION (ICAI) 4-STEP ANSWER PRESENTATION       */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "ca" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header info card */}
            <div className="bg-gradient-to-r from-[#EFF6FF] via-white to-blue-50/40 p-5 rounded-2xl border border-[#BFDBFE] shadow-2xs flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#005A9C] text-white uppercase tracking-wider">
                  ICAI Paper 2 • Model Answer Presentation
                </span>
                <h3 className="text-base font-bold text-[#0A192F]">
                  Official 4-Step Statutory Drafting Structure
                </h3>
                <p className="text-xs text-[#64748B]">
                  Use this strict 4-step sequence (Provision, Facts, Precedent, Conclusion) to secure maximum marks in ICAI Business Laws exams.
                </p>
              </div>
              <Sparkles className="w-8 h-8 text-[#005A9C] shrink-0" />
            </div>

            {/* 4 Steps Stack */}
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="bg-white p-6 rounded-2xl border border-[#CBD5E1] shadow-2xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#005A9C] text-white text-xs font-black flex items-center justify-center shrink-0">
                    1
                  </span>
                  <h4 className="text-xs font-bold text-[#005A9C] uppercase tracking-wider">
                    Step 1: Relevant Statutory Provisions
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed pl-8 whitespace-pre-line font-serif">
                  {caseData.ca_step1_provisions ||
                    "Under the relevant sections of the Act, every person is bound to comply with the statutory provisions strictly as codified by law."}
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-6 rounded-2xl border border-[#CBD5E1] shadow-2xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#005A9C] text-white text-xs font-black flex items-center justify-center shrink-0">
                    2
                  </span>
                  <h4 className="text-xs font-bold text-[#005A9C] uppercase tracking-wider">
                    Step 2: Analysis of Material Facts &amp; Legal Contention
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed pl-8 whitespace-pre-line">
                  {caseData.ca_step2_facts || caseData.facts || "Facts breakdown under examination scenario."}
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-6 rounded-2xl border border-[#CBD5E1] shadow-2xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#005A9C] text-white text-xs font-black flex items-center justify-center shrink-0">
                    3
                  </span>
                  <h4 className="text-xs font-bold text-[#005A9C] uppercase tracking-wider">
                    Step 3: Landmark Judicial Precedent &amp; Ratio Decidendi
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed pl-8 whitespace-pre-line italic">
                  {caseData.ca_step3_precedent ||
                    `In ${caseData.title}, the court authoritatively ruled on the ratio decidendi.`}
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white p-6 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-2xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                    4
                  </span>
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Step 4: Definitive Legal Conclusion
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[#065F46] font-medium leading-relaxed pl-8 whitespace-pre-line">
                  {caseData.ca_step4_conclusion || "Final legal determination resolving the dispute."}
                </p>
              </div>
            </div>

            {/* ICAI Step Marking Scheme Card */}
            {caseData.ca_marking_scheme && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Award className="w-4 h-4 text-amber-700" />
                  <span>Examiner&apos;s Step-Marking Scheme</span>
                </div>
                <p className="whitespace-pre-line pl-5 leading-relaxed font-mono text-[11px]">
                  {caseData.ca_marking_scheme}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 2: CSEET (ICSI) OBJECTIVE, TRAINED DOCTRINE & MCQS       */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "cseet" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header info card */}
            <div className="bg-gradient-to-r from-emerald-50 via-white to-slate-50 p-5 rounded-2xl border border-emerald-200 shadow-2xs flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-700 text-white uppercase tracking-wider">
                  ICSI CSEET • Legal Aptitude Point of View
                </span>
                <h3 className="text-base font-bold text-[#0A192F]">
                  Executive Legal Doctrine &amp; Exam Traps
                </h3>
                <p className="text-xs text-[#64748B]">
                  Designed for objective test speed: fundamental legal doctrines, commonly tested exceptions, and instant practice questions.
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-emerald-600 shrink-0" />
            </div>

            {/* Core Doctrine Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#CBD5E1] shadow-2xs space-y-2">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-700" />
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Fundamental ICSI Legal Doctrine
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-[#334155] leading-relaxed whitespace-pre-line">
                {caseData.cseet_core_doctrine || caseData.summary}
              </p>
            </div>

            {/* ICSI Exam Traps Card */}
            {caseData.cseet_exam_traps && (
              <div className="bg-white p-6 rounded-2xl border border-rose-200 bg-rose-50/10 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-rose-700">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    High-Frequency ICSI Traps &amp; Key Exceptions
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-rose-900 leading-relaxed whitespace-pre-line">
                  {caseData.cseet_exam_traps}
                </p>
              </div>
            )}

            {/* Interactive CSEET Practice MCQ */}
            {caseData.cseet_practice_mcq && (
              <div className="bg-white p-6 rounded-2xl border-2 border-[#BFDBFE] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#EFF6FF] text-[#005A9C] border border-[#BFDBFE]">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>CSEET Rapid-Test Drill</span>
                  </span>
                  <span className="text-[11px] font-bold text-[#64748B]">
                    Instant Self-Assessment
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-bold text-[#0A192F] leading-snug">
                  {caseData.cseet_practice_mcq.question}
                </p>

                <div className="space-y-2">
                  {caseData.cseet_practice_mcq.options.map((opt, idx) => {
                    const isSelected = selectedMcqOption === idx;
                    const isCorrect = idx === caseData.cseet_practice_mcq?.correctIndex;

                    let btnStyle = "bg-slate-50 border-slate-200 hover:bg-slate-100 text-[#0A192F]";
                    if (isMcqSubmitted) {
                      if (isCorrect) {
                        btnStyle = "bg-emerald-50 border-emerald-400 text-emerald-900 font-bold";
                      } else if (isSelected) {
                        btnStyle = "bg-rose-50 border-rose-400 text-rose-900";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleMcqSelect(idx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-2.5 cursor-pointer ${btnStyle}`}
                      >
                        <span className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {isMcqSubmitted && (
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1 animate-in fade-in">
                    <span className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#005A9C]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ICSI Statutory Explanation</span>
                    </span>
                    <p className="leading-relaxed pl-5 font-medium">
                      {caseData.cseet_practice_mcq.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 3: COMPLETE JUDICIAL BREAKDOWN (FACTS & LEGAL ISSUES)     */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "judicial" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseData.facts && (
                <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#CBD5E1] shadow-2xs space-y-2">
                  <h3 className="text-sm font-bold text-[#0A192F] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#005A9C]" />
                    <span>Material Dispute Facts</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed whitespace-pre-line">
                    {caseData.facts}
                  </p>
                </div>
              )}

              {caseData.issue && (
                <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#CBD5E1] shadow-2xs space-y-2">
                  <h3 className="text-sm font-bold text-[#0A192F] flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#005A9C]" />
                    <span>Questions of Law Raised</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed whitespace-pre-line">
                    {caseData.issue}
                  </p>
                </div>
              )}
            </div>

            {caseData.ruling && (
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#CBD5E1] shadow-2xs space-y-2">
                <h3 className="text-sm font-bold text-[#0A192F] flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Judicial Ruling &amp; Operative Order</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed whitespace-pre-line">
                  {caseData.ruling}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Key Takeaways & Exam Anchors Checklist */}
        {caseData.key_takeaways && caseData.key_takeaways.length > 0 && (
          <div className="mt-8 bg-white p-6 sm:p-7 rounded-3xl border border-[#CBD5E1] shadow-2xs space-y-3">
            <h3 className="text-sm font-serif font-bold text-[#0A192F] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#005A9C]" />
              <span>Exam Summary Anchors (Both CA &amp; CSEET Recall)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {caseData.key_takeaways.map((point, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#0A192F]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Navigation CTA */}
        <div className="mt-10 p-6 rounded-3xl bg-gradient-to-r from-[#005A9C] to-[#0A192F] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold">
              Ready to Master More Landmark Precedents?
            </h4>
            <p className="text-xs text-blue-100">
              Explore our full digital library with chapter-wise notes and 3 weekly solved cases.
            </p>
          </div>
          <Link
            href="/case-studies"
            className="px-5 py-2.5 rounded-full bg-white text-[#005A9C] text-xs font-bold hover:bg-blue-50 transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <span>Browse All Case Studies</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
