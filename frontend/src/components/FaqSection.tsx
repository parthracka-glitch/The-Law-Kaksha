"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Search,
  BookOpen,
  CreditCard,
  ShieldCheck,
  HelpCircle,
  Mail,
  CheckCircle2,
  ArrowRight,
  X,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export interface FaqItem {
  id: string;
  category: "curriculum" | "pricing" | "security" | "support";
  categoryLabel: string;
  q: string;
  a: string;
  highlights?: string[];
  cta?: {
    label: string;
    href: string;
  };
}

const FAQS_DATA: FaqItem[] = [
  {
    id: "faq-1",
    category: "curriculum",
    categoryLabel: "Platform Overview",
    q: "What is The Law कक्षा?",
    a: "The Law कक्षा is India's dedicated legal learning and exam-revision platform tailored specifically for CA Foundation Paper 2 Business Laws and CSEET. We unify comprehensive chapter codices, examiner-evaluated question banks, Last Day Revision (LDR) flowcharts, landmark case laws, and timed test series into one structured student reading vault.",
    highlights: [
      "All 4 ICAI Acts + ICSI Management Modules",
      "Interactive In-Web DRM Reader with Dark Mode",
      "Examiner-Tested Provision → Application → Conclusion model frameworks",
    ],
    cta: {
      label: "Explore Courses Catalog",
      href: "/courses",
    },
  },
  {
    id: "faq-2",
    category: "pricing",
    categoryLabel: "Passes & Pricing",
    q: "How much does a subscription pass cost?",
    a: "Access to The Law कक्षा is available at an introductory price of just ₹99 for 30 days (MRP ₹299 — 67% OFF). Your pass provides unrestricted in-browser reading access to all codices and smart question banks under your chosen curriculum. There are no hidden fees or forced recurring auto-debits.",
    highlights: [
      "₹99 / 30 Days Full Access",
      "Zero hidden renewal fees or lock-ins",
      "Instant dashboard unlocking upon checkout",
    ],
    cta: {
      label: "View Pricing & Passes",
      href: "/courses",
    },
  },
  {
    id: "faq-3",
    category: "curriculum",
    categoryLabel: "CA Foundation",
    q: "What resources are included for CA Foundation Business Laws?",
    a: "CA Foundation enrollment gives you complete access to all 4 statutory acts across 20 units: The Indian Contract Act 1872 (10 units), The Sale of Goods Act 1930 (4 units), The Indian Partnership Act 1932 (4 units), and The Limited Liability Partnership Act 2008 (2 units) — plus LDR Flowcharts and 70+ solved landmark case studies. The Smart Revision Question Bank (Part 1 & 2) is available as an independent comprehensive exam pass for ₹349.",
    highlights: [
      "20 Core Chapter Units across 4 Statutory Acts",
      "LDR Flowcharts & High-Yield Infographics",
      "Dedicated Question Bank (Part 1 & 2) Available for ₹349",
    ],
    cta: {
      label: "Browse Free Sample Codices",
      href: "#free-resources",
    },
  },
  {
    id: "faq-4",
    category: "security",
    categoryLabel: "DRM & Security",
    q: "Are the study codices and Question Banks downloadable as PDFs?",
    a: "To protect intellectual property and guarantee authentic examination materials, all codices and Question Banks are served exclusively through our secure, proprietary In-Web DRM Reader. Materials feature dynamic candidate watermarking and single-device access, while allowing seamless zoom, reading streaks, and full dark/light reading modes.",
    highlights: [
      "Encrypted In-Browser DRM protection",
      "Personalized dynamic watermarking",
      "Optimized for smooth reading on phone, tablet, and PC",
    ],
  },
  {
    id: "faq-5",
    category: "curriculum",
    categoryLabel: "Physical Delivery",
    q: "Can I order a physical printed copy of the Question Bank?",
    a: "Yes. Students who prefer studying from a physical, spiral-bound reference book can order printed copies directly. Contact our academic desk at support@thelawkaksha.com or DM our team on Instagram (@thelawkaksha) with your delivery address for pricing, delivery timeline, and courier tracking.",
    highlights: [
      "High-grade spiral binding with protective frosted cover",
      "Full ICAI model question-answer framework",
      "Pan-India express courier dispatch",
    ],
  },
  {
    id: "faq-6",
    category: "curriculum",
    categoryLabel: "Curriculum Streams",
    q: "Which courses are currently live on The Law कक्षा?",
    a: "CA Foundation Paper 2 Business Laws (4 Acts, 20 Units), CA Foundation Question Bank Part 1 & 2 (₹349), and CSEET Paper 2 Business Laws & Management (Lessons 7, 8, 9, 10) are live with full codices, free samples, and interactive practice. You can enroll in each course individually.",
    highlights: [
      "CA Foundation Paper 2 (ICAI New Scheme • 20 Units)",
      "CA Foundation Smart Revision Question Bank (Part 1 & 2)",
      "CSEET Paper 2 Part B Management (ICSI)",
    ],
    cta: {
      label: "View All Available Courses",
      href: "/courses",
    },
  },
  {
    id: "faq-7",
    category: "curriculum",
    categoryLabel: "Daily Practice",
    q: "How does the weekly case study challenge work?",
    a: "Students receive three new application-oriented practical case studies every week: Monster Monday (complex contract disputes), Midweek Law Madness (partnership and sales issues), and Final Boss Friday (multi-provision exam-level problem sets). Each case follows ICAI's strict model answer formatting.",
    highlights: [
      "3 fresh high-yield scenario cases weekly",
      "Step-by-step reasoning breakdown",
      "Available directly inside your student dashboard",
    ],
  },
  {
    id: "faq-8",
    category: "curriculum",
    categoryLabel: "Learning Method",
    q: "Is the platform self-paced or live video classes?",
    a: "The Law कक्षा is 100% self-paced and revision-centric. Rather than sitting through 100-hour video lectures, students read distilled, high-yield statutory codices and practice case questions at their own speed with automatic page memory.",
    highlights: [
      "No video bloat — direct concise legal reading",
      "Resume reading anywhere with saved page progress",
      "Accessible 24/7 on any modern web browser",
    ],
  },
  {
    id: "faq-9",
    category: "support",
    categoryLabel: "Getting Started",
    q: "How do I sign up and start reading?",
    a: "Getting started takes less than 60 seconds: click 'Browse Free Sample Notes' to read free chapters without logging in, or create an account, select your course pass at ₹99, and complete secure checkout via UPI, Cards, or Netbanking for instant access.",
    highlights: [
      "Instant auto-provisioning upon payment",
      "No software download or app installation required",
      "Compatible with Chrome, Safari, Edge, and mobile browsers",
    ],
    cta: {
      label: "Create Account / Login",
      href: "/login",
    },
  },
  {
    id: "faq-10",
    category: "support",
    categoryLabel: "Order Assistance",
    q: "What should I do if my payment succeeds but access isn't unlocked?",
    a: "Payment activations are automated and instant. In the rare case of a bank network delay, simply refresh your dashboard. If access is still pending, email support@thelawkaksha.com with your registered email and transaction reference; our team resolves student access within 2 hours.",
    highlights: [
      "Automated instant order fulfillment",
      "2-hour student priority resolution",
      "Direct academic desk support",
    ],
  },
  {
    id: "faq-11",
    category: "security",
    categoryLabel: "Access & Devices",
    q: "Can I switch devices during my subscription?",
    a: "Yes. For security and exam-content integrity, your account operates with single active session protection. If you log in on a new device (e.g. switching from your laptop to your mobile phone), your session transfers securely.",
    highlights: [
      "Single active session protection",
      "Seamless switching between phone, tablet, and PC",
      "No loss of reading streaks or progress",
    ],
  },
  {
    id: "faq-12",
    category: "pricing",
    categoryLabel: "Renewal Policy",
    q: "What happens when my 30-day access pass expires?",
    a: "When your pass reaches 30 days, you can renew with one click for another 30 days at the prevailing student price. All your bookmarks, reading statistics, streak history, and solved case attempts are permanently preserved in your student account.",
    highlights: [
      "Preserved bookmarks & progress history",
      "Zero cancellation penalty or recurring traps",
      "Transparent 1-click renewal anytime",
    ],
  },
];

type CategoryFilter = "all" | "curriculum" | "pricing" | "security" | "support";

export function FaqSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  // Start with first 2 open so content is immediately visible without looking like empty boxes
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["faq-1", "faq-2"]));

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: FAQS_DATA.length,
      curriculum: FAQS_DATA.filter((f) => f.category === "curriculum").length,
      pricing: FAQS_DATA.filter((f) => f.category === "pricing").length,
      security: FAQS_DATA.filter((f) => f.category === "security").length,
      support: FAQS_DATA.filter((f) => f.category === "support").length,
    };
  }, []);

  // Filtered FAQs based on Category and Search Query
  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.filter((faq) => {
      const matchesCategory =
        activeCategory === "all" || faq.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        faq.q.toLowerCase().includes(q) ||
        faq.a.toLowerCase().includes(q) ||
        faq.categoryLabel.toLowerCase().includes(q) ||
        (faq.highlights && faq.highlights.some((h) => h.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenIds(new Set(filteredFaqs.map((f) => f.id)));
  };

  const collapseAll = () => {
    setOpenIds(new Set());
  };

  const categories: { key: CategoryFilter; label: string; icon: React.ReactNode; count: number }[] = [
    { key: "all", label: "All Questions", icon: <Layers className="w-3.5 h-3.5" />, count: categoryCounts.all },
    { key: "curriculum", label: "Curriculum & Codices", icon: <BookOpen className="w-3.5 h-3.5" />, count: categoryCounts.curriculum },
    { key: "pricing", label: "₹99 Passes & Pricing", icon: <CreditCard className="w-3.5 h-3.5" />, count: categoryCounts.pricing },
    { key: "security", label: "DRM Reader Security", icon: <ShieldCheck className="w-3.5 h-3.5" />, count: categoryCounts.security },
    { key: "support", label: "Account & Support", icon: <HelpCircle className="w-3.5 h-3.5" />, count: categoryCounts.support },
  ];

  return (
    <section
      id="faqs"
      className="py-14 sm:py-20 bg-gradient-to-b from-[#F8FAFC] via-white to-[#F0F7FF] text-[#0A192F] relative border-t border-[#DBEAFE]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER: Centered & Minimal */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#005A9C] text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#005A9C]" />
            <span>Answers &amp; Clarity</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A192F] tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-sm sm:text-base text-[#475569] max-w-2xl mx-auto leading-relaxed">
            Instant answers about our ₹99 access passes, ICAI/ICSI syllabus coverage, in-browser DRM reader security, and exam preparation frameworks.
          </p>
        </div>

        {/* MINIMAL SPACE-UTILIZING CONTROLS BAR */}
        <div className="bg-white rounded-2xl border border-[#DBEAFE] p-3 sm:p-4 mb-8 shadow-xs space-y-3">
          {/* Top row: Horizontal Category Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-[#005A9C] text-white shadow-xs"
                      : "bg-[#F8FAFC] text-[#475569] hover:bg-[#EFF6FF] hover:text-[#005A9C] border border-[#E2E8F0]"
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      isActive ? "bg-white/20 text-white" : "bg-[#E2E8F0] text-[#64748B]"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom row: Search input + Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. ₹99 pass, contract, DRM reader, mobile, printed)..."
                className="w-full pl-9 pr-9 py-2 rounded-xl text-xs bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/10 outline-none transition-all placeholder:text-[#94A3B8] text-[#0A192F]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Topic Chips & Expand All / Collapse All Controls */}
            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
              <span className="text-[#64748B] text-xs">
                Showing <strong className="text-[#0A192F]">{filteredFaqs.length}</strong> of {FAQS_DATA.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={expandAll}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#005A9C] hover:bg-[#EFF6FF] transition-colors cursor-pointer"
                >
                  Expand All
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#64748B] hover:text-[#0A192F] hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Collapse All
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2-COLUMN BALANCED FULL-WIDTH GRID (Proper Space Utilization) */}
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#DBEAFE] p-10 text-center space-y-3 shadow-xs max-w-xl mx-auto my-6">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#005A9C] flex items-center justify-center mx-auto">
              <Search className="w-5 h-5 text-[#005A9C]" />
            </div>
            <h4 className="font-bold text-base text-[#0A192F]">No matching questions found</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              No results for &ldquo;{searchQuery}&rdquo;. Try another term or reset to view all questions.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="px-4 py-2 rounded-xl bg-[#005A9C] text-white text-xs font-bold hover:bg-[#004880] transition-colors cursor-pointer"
            >
              Reset Search &amp; Show All
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-4.5 items-start">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIds.has(faq.id);

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl transition-all duration-200 overflow-hidden bg-white ${
                    isOpen
                      ? "border-2 border-[#005A9C] shadow-[0_4px_16px_rgba(0,90,156,0.08)]"
                      : "border border-[#E2E8F0] hover:border-[#93C5FD] hover:shadow-xs shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-start justify-between gap-3.5 p-4 sm:p-5 text-left cursor-pointer group"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-1.5 flex-1 pr-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#005A9C] border border-[#BFDBFE]">
                          {faq.categoryLabel}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-[#94A3B8]">
                          Q{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </span>
                      </div>

                      <h3
                        className={`font-serif font-bold text-[15px] sm:text-base leading-snug transition-colors ${
                          isOpen ? "text-[#005A9C]" : "text-[#0A192F] group-hover:text-[#005A9C]"
                        }`}
                      >
                        {faq.q}
                      </h3>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 ${
                        isOpen
                          ? "bg-[#005A9C] text-white rotate-180"
                          : "bg-[#F1F5F9] text-[#64748B] group-hover:bg-[#005A9C] group-hover:text-white"
                      }`}
                    >
                      <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-0 space-y-3.5 border-t border-slate-100 text-xs sm:text-sm">
                      <p className="text-[#475569] leading-relaxed pt-3">
                        {faq.a}
                      </p>

                      {faq.highlights && faq.highlights.length > 0 && (
                        <div className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E2E8F0] space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A192F] block">
                            Key Takeaways:
                          </span>
                          <ul className="space-y-1">
                            {faq.highlights.map((highlight, hIdx) => (
                              <li
                                key={hIdx}
                                className="flex items-start gap-2 text-[11px] sm:text-xs text-[#334155] leading-normal"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {faq.cta && (
                        <div className="pt-0.5">
                          <Link
                            href={faq.cta.href}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005A9C] hover:text-[#004880] hover:underline"
                          >
                            <span>{faq.cta.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* BOTTOM MINIMAL SPACE-EFFICIENT SUPPORT BANNER (Full Width) */}
        <div className="mt-8 sm:mt-12 rounded-2xl bg-gradient-to-r from-[#0A192F] via-[#0A2244] to-[#0A192F] text-white p-5 sm:p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0 text-[#93C5FD]">
              <Mail className="w-5 h-5 text-[#93C5FD]" />
            </div>
            <div>
              <h4
                style={{ color: "#FFFFFF" }}
                className="font-serif font-bold text-sm sm:text-base !text-white"
              >
                Have a question not listed here?
              </h4>
              <p
                style={{ color: "#CBD5E1" }}
                className="text-xs !text-slate-300 mt-0.5"
              >
                Our academic counselors and technical desk typically respond within 2 hours.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-center">
            <a
              href="mailto:support@thelawkaksha.com?subject=FAQ%20Inquiry%20from%20Website"
              className="px-4 py-2.5 rounded-xl bg-[#005A9C] hover:bg-[#004880] text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email: support@thelawkaksha.com</span>
            </a>

            <Link
              href="/contact"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Contact Desk</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
