"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Truck,
  Lock,
  Send,
  CheckCircle2,
  ArrowUp,
  X,
  MessageSquare,
  Users,
  BookOpen
} from "lucide-react";
import { LawKakshaLogo } from "./LawKakshaLogo";

export function Footer() {
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activePolicyModal, setActivePolicyModal] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribedEmail.trim()) {
      setIsSubscribed(true);
      setSubscribedEmail("");
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const policyContent: Record<string, { title: string; subtitle: string; content: React.ReactNode }> = {
    privacy: {
      title: "Privacy & Data Protection Policy",
      subtitle: "Commitment to Student Data Privacy & GDPR/DPDP Act 2023 Compliance",
      content: (
        <div className="space-y-4 text-xs text-[#6E6E73] leading-relaxed">
          <p>
            At <strong>The Law Kaksha CA Academy</strong>, we are committed to safeguarding the personal information and academic data of all enrolled CA Foundation, Intermediate, and Final students.
          </p>
          <div className="space-y-2">
            <h5 className="font-semibold text-[#1D1D1F] text-xs uppercase tracking-wider">1. Information Collection & Usage</h5>
            <p>
              We collect contact details solely for fulfilling physical 2-Volume book shipments, delivering automated consignment AWB tracking notifications, activating digital lecture vaults, and sending official ICAI legislative amendments.
            </p>
          </div>
          <div className="space-y-2">
            <h5 className="font-semibold text-[#1D1D1F] text-xs uppercase tracking-wider">2. Payment Security</h5>
            <p>
              All payment transactions are processed through PCI-DSS certified payment gateways (Razorpay, UPI, NetBanking). We never store credit card numbers, CVVs, or banking credentials.
            </p>
          </div>
        </div>
      )
    },
    terms: {
      title: "Terms & Conditions of Service",
      subtitle: "Academic Enrollment, Course Access & Educational Copyright Guidelines",
      content: (
        <div className="space-y-4 text-xs text-[#6E6E73] leading-relaxed">
          <p>
            By accessing The Law Kaksha website or purchasing publications/subscriptions, you agree to adhere to these standard academic terms:
          </p>
          <div className="space-y-2">
            <h5 className="font-semibold text-[#1D1D1F] text-xs uppercase tracking-wider">1. Intellectual Property & Copyright</h5>
            <p>
              All 2-Volume books, chapter codices, 1.5-day LDR notes, and video lectures authored by The Law Kaksha faculty are protected under the Indian Copyright Act, 1957. Unauthorized redistribution or commercial reselling is strictly prohibited.
            </p>
          </div>
          <div className="space-y-2">
            <h5 className="font-semibold text-[#1D1D1F] text-xs uppercase tracking-wider">2. Single-Student Device License</h5>
            <p>
              Digital access licenses and DRM keys are granted for personal, non-exclusive use by the registered student on up to 2 personal devices.
            </p>
          </div>
        </div>
      )
    },
    shipping: {
      title: "Shipping, Dispatch & Refund Policy",
      subtitle: "Pan-India Courier Timelines, Tracking Information & Replacement Assurance",
      content: (
        <div className="space-y-4 text-xs text-[#6E6E73] leading-relaxed">
          <div className="space-y-2">
            <h5 className="font-semibold text-[#1D1D1F] text-xs uppercase tracking-wider">1. Dispatch Timelines</h5>
            <p>
              All physical 2-Volume CA Book Set orders are dispatched within 24 hours via express air courier (BlueDart / DTDC) with live SMS and WhatsApp tracking.
            </p>
          </div>
          <div className="space-y-2">
            <h5 className="font-semibold text-[#1D1D1F] text-xs uppercase tracking-wider">2. Delivery Timeframes</h5>
            <ul className="list-disc pl-4 space-y-1">
              <li>Metro Cities: 2 to 3 business days.</li>
              <li>Rest of India: 3 to 5 business days.</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h5 className="font-semibold text-[#1D1D1F] text-xs uppercase tracking-wider">3. Free Replacement Guarantee</h5>
            <p>
              If a physical book arrives with any transit damage or binding defect, email us at <span className="text-[#0071E3] font-medium">support@thelawkaksha.com</span> within 7 days for a free replacement copy.
            </p>
          </div>
        </div>
      )
    },
    disclaimer: {
      title: "ICAI Statutory Disclaimer",
      subtitle: "Independent Educational Publishing & Curriculum Alignment Declaration",
      content: (
        <div className="space-y-4 text-xs text-[#6E6E73] leading-relaxed">
          <p>
            <strong>The Law Kaksha</strong> is an independent educational publishing house and mentorship academy for CA aspirants.
          </p>
          <div className="space-y-2">
            <h5 className="font-semibold text-[#1D1D1F] text-xs uppercase tracking-wider">Statutory Declaration</h5>
            <p>
              The Institute of Chartered Accountants of India (ICAI) is the statutory regulatory body. The Law Kaksha is an independent preparatory academy. All curriculum titles, paper codes, RTPs, and MTPs referenced are used strictly for academic guidance under fair dealing legal principles.
            </p>
          </div>
        </div>
      )
    }
  };

  return (
    <footer className="bg-[#F5F5F7] text-[#6E6E73] border-t border-black/[0.06] pt-12 pb-10 text-xs relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ======================================================== */}
        {/* 1. SLIM MINIMAL NEWSLETTER BAR                           */}
        {/* ======================================================== */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-black/[0.08] mb-10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3]"></span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0071E3]">
                ICAI Law &amp; MCA Amendment Updates
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-semibold text-[#1D1D1F] mt-1.5">
              Receive free monthly MCA circulars, Section 135 CSR notes &amp; RTP alerts
            </h4>
          </div>

          <div className="w-full md:w-auto">
            {isSubscribed ? (
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-full text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Subscribed! You will receive the next ICAI law digest.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-80">
                <input
                  type="email"
                  required
                  value={subscribedEmail}
                  onChange={(e) => setSubscribedEmail(e.target.value)}
                  placeholder="Enter student email..."
                  className="flex-1 px-4 py-2 rounded-full border border-black/[0.08] bg-[#FBFBFD] text-xs text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#1D1D1F] hover:bg-[#2D2D2F] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 shrink-0 shadow-2xs cursor-pointer"
                >
                  <span>Join</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. MINIMAL 5-COLUMN DIRECTORY                            */}
        {/* ======================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 pb-10 border-b border-black/[0.06]">
          
          {/* Column 1: Brand & Contact (4 cols on lg) */}
          <div className="col-span-2 md:col-span-3 lg:col-span-4 space-y-3.5">
            <Link href="/" className="inline-block transition-opacity hover:opacity-90">
              <LawKakshaLogo variant="light" />
            </Link>

            <p className="text-xs text-[#6E6E73] leading-relaxed max-w-sm">
              India&apos;s specialized preparatory academy for Chartered Accountancy law papers. Comprehensive 2-Volume codices, 9-attempt solved RTPs/MTPs, and high-scoring answer frameworks.
            </p>

            <div className="space-y-1.5 text-xs text-[#6E6E73] pt-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#0071E3] shrink-0" />
                <a href="mailto:support@thelawkaksha.com" className="hover:text-[#0071E3] transition-colors">
                  support@thelawkaksha.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#0071E3] shrink-0" />
                <span className="font-mono text-[11px]">+91 98765 43210 (Mon–Sat 9AM–8PM)</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#0071E3] shrink-0 mt-0.5" />
                <span className="text-[11px]">Nariman Point, Mumbai &bull; Laxmi Nagar, New Delhi</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="w-7 h-7 rounded-full border border-black/[0.08] bg-white flex items-center justify-center text-[#6E6E73] hover:text-[#0071E3] hover:border-[#0071E3]/40 transition-colors"
                title="Telegram CA Community"
              >
                <Send className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-7 h-7 rounded-full border border-black/[0.08] bg-white flex items-center justify-center text-[#6E6E73] hover:text-rose-600 hover:border-rose-400 transition-colors"
                title="YouTube Free Lectures"
              >
                <BookOpen className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://wa.me"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-7 h-7 rounded-full border border-black/[0.08] bg-white flex items-center justify-center text-[#6E6E73] hover:text-emerald-600 hover:border-emerald-400 transition-colors"
                title="WhatsApp Support"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-7 h-7 rounded-full border border-black/[0.08] bg-white flex items-center justify-center text-[#6E6E73] hover:text-[#0071E3] hover:border-[#0071E3]/40 transition-colors"
                title="LinkedIn"
              >
                <Users className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: CA Publications */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-2.5">
            <h5 className="text-[11px] font-semibold uppercase tracking-wider text-[#1D1D1F]">
              CA Books
            </h5>
            <ul className="space-y-2 text-xs text-[#6E6E73]">
              <li>
                <Link href="#pricing" className="hover:text-[#0071E3] transition-colors block">
                  CA Inter Paper 2 (Vol 1 &amp; 2)
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-[#0071E3] transition-colors block">
                  CA Final Corporate Laws
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-[#0071E3] transition-colors block">
                  CA Foundation Business Law
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-[#0071E3] transition-colors block">
                  2-Volume Mastermind Set
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-[#0071E3] transition-colors block">
                  9-Attempt RTP/MTP Scanner
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Courses & Tests */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-2.5">
            <h5 className="text-[11px] font-semibold uppercase tracking-wider text-[#1D1D1F]">
              Courses &amp; Tests
            </h5>
            <ul className="space-y-2 text-xs text-[#6E6E73]">
              <li>
                <Link href="#pricing" className="hover:text-[#0071E3] transition-colors block">
                  CA Inter Masterclass
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-[#0071E3] transition-colors block">
                  CA Final IBC &amp; FEMA
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-[#0071E3] transition-colors block">
                  Foundation Fast-Track
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-[#0071E3] transition-colors block">
                  40 Mock Test Series
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-[#0071E3] transition-colors block">
                  Case-Scenario 30/30 Booster
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Free Resources */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-2.5">
            <h5 className="text-[11px] font-semibold uppercase tracking-wider text-[#1D1D1F]">
              Free Resources
            </h5>
            <ul className="space-y-2 text-xs text-[#6E6E73]">
              <li>
                <Link href="#pricing" className="hover:text-[#0071E3] transition-colors block">
                  Sample Chapter Reader
                </Link>
              </li>
              <li>
                <Link href="#countdown-qotd" className="hover:text-[#0071E3] transition-colors block">
                  Daily MCQ Challenge
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="hover:text-[#0071E3] transition-colors block">
                  CA Rankers Strategy
                </Link>
              </li>
              <li>
                <Link href="/student" className="hover:text-[#0071E3] transition-colors block">
                  1.5-Day LDR Quick Notes
                </Link>
              </li>
              <li>
                <Link href="/student" className="hover:text-[#0071E3] transition-colors block">
                  Section 135 CSR Matrix
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Student Portal */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-2.5">
            <h5 className="text-[11px] font-semibold uppercase tracking-wider text-[#1D1D1F]">
              Portal &amp; Support
            </h5>
            <ul className="space-y-2 text-xs text-[#6E6E73]">
              <li>
                <Link href="/student" className="text-[#0071E3] font-medium hover:underline flex items-center gap-1">
                  <span>Student Portal</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/student" className="hover:text-[#0071E3] transition-colors block">
                  Track Courier (AWB)
                </Link>
              </li>
              <li>
                <Link href="/student" className="hover:text-[#0071E3] transition-colors block">
                  DRM Vault Activation
                </Link>
              </li>
              <li>
                <Link href="/student" className="hover:text-[#0071E3] transition-colors block">
                  Submit Evaluated Copy
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-[#86868B] hover:text-[#1D1D1F] transition-colors block text-[11px]">
                  Faculty Desk
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* ======================================================== */}
        {/* 3. SUBTLE TRUST & PAYMENT PILLARS (SINGLE CLEAN ROW)     */}
        {/* ======================================================== */}
        <div className="py-4 border-b border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#86868B]">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0071E3]" />
              <span>ICAI 2026-2027 New Scheme Certified</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#0071E3]" />
              <span>Pan-India BlueDart / DTDC Express Air</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#0071E3]" />
              <span>256-Bit SSL Secure Checkout (Razorpay, UPI, Cards)</span>
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="text-[11px] text-[#86868B] hover:text-[#1D1D1F] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* 4. COPYRIGHT, LEGAL & COMPACT DISCLAIMER                 */}
        {/* ======================================================== */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-2.5 text-[11px] text-[#86868B]">
          <p>
            &copy; {new Date().getFullYear()} The Law Kaksha CA Academy. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActivePolicyModal("privacy")}
              className="hover:text-[#1D1D1F] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActivePolicyModal("terms")}
              className="hover:text-[#1D1D1F] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActivePolicyModal("shipping")}
              className="hover:text-[#1D1D1F] transition-colors cursor-pointer"
            >
              Dispatch &amp; Refunds
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActivePolicyModal("disclaimer")}
              className="hover:text-[#1D1D1F] transition-colors cursor-pointer"
            >
              ICAI Disclaimer
            </button>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 5. INTERACTIVE POLICY MODAL                              */}
      {/* ======================================================== */}
      {activePolicyModal && policyContent[activePolicyModal] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-black/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.05] bg-[#FBFBFD]">
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-[#1D1D1F]">
                  {policyContent[activePolicyModal].title}
                </h4>
                <p className="text-[10px] text-[#86868B]">
                  {policyContent[activePolicyModal].subtitle}
                </p>
              </div>
              <button
                onClick={() => setActivePolicyModal(null)}
                className="w-7 h-7 rounded-full text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.04] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close Modal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {policyContent[activePolicyModal].content}
            </div>

            <div className="px-6 py-3.5 border-t border-black/[0.05] bg-[#FBFBFD] flex justify-end">
              <button
                onClick={() => setActivePolicyModal(null)}
                className="px-5 py-1.5 rounded-full bg-[#1D1D1F] hover:bg-[#2D2D2F] text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </footer>
  );
}
