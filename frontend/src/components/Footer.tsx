"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp, X } from "lucide-react";

export function Footer() {
  const [activePolicyModal, setActivePolicyModal] = useState<
    "privacy" | "terms" | "shipping" | "disclaimer" | null
  >(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const policyContent = {
    privacy: {
      title: "Privacy Policy",
      subtitle: "The Law Kaksha Student Data Protection & Privacy Standard",
      content: (
        <div className="space-y-4 text-xs text-[#4D433F] leading-relaxed">
          <p>
            The Law Kaksha (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) respects student privacy. We collect minimal account data (name, email, course enrollment) strictly for delivering academic notes, digital access, and portal services.
          </p>
          <p>
            Your payment transactions are processed securely by 256-bit SSL encrypted PCI-DSS certified gateways (Razorpay / UPI). We never store debit/credit card numbers or banking PINs.
          </p>
        </div>
      ),
    },
    terms: {
      title: "Terms of Service",
      subtitle: "Academic Platform Terms & Digital License Agreement",
      content: (
        <div className="space-y-4 text-xs text-[#4D433F] leading-relaxed">
          <p>
            All digital notes, statutory question banks, and model answer rubrics on The Law Kaksha are the proprietary academic materials of The Law Kaksha.
          </p>
          <p>
            Subscription grants a personal, single-user non-exclusive license for browser reading and examination preparation. Unauthorized redistribution or commercial sale is strictly prohibited.
          </p>
        </div>
      ),
    },
    shipping: {
      title: "Subscription Policy",
      subtitle: "Instant Digital Access & Academic Delivery",
      content: (
        <div className="space-y-4 text-xs text-[#4D433F] leading-relaxed">
          <p>
            Digital PDF notes, chapter tests, and sample readings activate immediately in the student dashboard upon successful subscription confirmation.
          </p>
          <p>
            For any billing or technical access queries, contact our academic support desk at support@thelawkaksha.com.
          </p>
        </div>
      ),
    },
    disclaimer: {
      title: "Examination Disclaimer",
      subtitle: "Statutory Examination Notice",
      content: (
        <div className="space-y-4 text-xs text-[#4D433F] leading-relaxed">
          <p>
            The Law Kaksha is an independent supplementary education portal. It is not officially affiliated with or endorsed by The Institute of Chartered Accountants of India (ICAI) or The Institute of Company Secretaries of India (ICSI).
          </p>
          <p>
            Students are advised to refer to the official curriculum and study guidelines published by ICAI and ICSI for their respective examination attempts.
          </p>
        </div>
      ),
    },
  };

  return (
    <footer className="bg-[#AED7E9] text-[#221D1D] pt-12 pb-10 border-t border-[#98C5D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#221D1D]/15">
          
          {/* Column 1: Brand & Contact */}
          <div className="md:col-span-6 lg:col-span-6 space-y-3">
            <Link href="/" className="inline-block transition-opacity hover:opacity-90">
              <div className="relative h-14 w-52 sm:h-16 sm:w-60 flex items-center bg-white rounded-2xl px-3 py-1 shadow-xs border border-[#E7E4E7]">
                <Image
                  src="/assets/logo-transparent.png"
                  alt="The Law Kaksha Logo"
                  fill
                  className="object-contain object-left p-1"
                />
              </div>
            </Link>

            <p className="text-xs text-[#4D433F] max-w-sm leading-relaxed font-medium">
              Simplified notes, practical resources and exam-focused preparation for CA Foundation &amp; CSEET students across India.
            </p>

            <div className="pt-1 text-[11px] text-[#4D433F] space-y-0.5 font-semibold">
              <p>Academic Desk: support@thelawkaksha.com</p>
              <p>Launch Subscription: ₹99/month</p>
            </div>
          </div>

          {/* Column 2: Courses */}
          <div className="md:col-span-3 lg:col-span-3 space-y-2.5">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#221D1D]">
              Courses
            </h5>
            <ul className="space-y-2 text-xs text-[#4D433F] font-semibold">
              <li>
                <Link href="/product/course-ca-foundation-sub" className="hover:text-[#221D1D] transition-colors block">
                  CA Foundation (Paper 2)
                </Link>
              </li>
              <li>
                <Link href="/product/course-cseet-sub" className="hover:text-[#221D1D] transition-colors block">
                  CSEET Business Law &amp; Mgt
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Navigation */}
          <div className="md:col-span-3 lg:col-span-3 space-y-2.5">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#221D1D]">
              Navigation
            </h5>
            <ul className="space-y-2 text-xs text-[#4D433F] font-semibold">
              <li>
                <Link href="/" className="hover:text-[#221D1D] transition-colors block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-[#221D1D] transition-colors block">
                  Courses &amp; Notes
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#221D1D] transition-colors block">
                  About Academy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#221D1D] transition-colors block">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright, Policies & Back to top */}
        <div className="pt-4 flex flex-col items-center justify-between gap-3 text-[11px] text-[#4D433F] sm:flex-row font-medium">
          <p>
            &copy; 2026 The Law Kaksha. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
            <button
              onClick={() => setActivePolicyModal("privacy")}
              className="hover:text-[#221D1D] transition-colors cursor-pointer py-1 min-h-[44px] flex items-center"
            >
              Privacy Policy
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActivePolicyModal("terms")}
              className="hover:text-[#221D1D] transition-colors cursor-pointer py-1 min-h-[44px] flex items-center"
            >
              Terms of Service
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActivePolicyModal("shipping")}
              className="hover:text-[#221D1D] transition-colors cursor-pointer py-1 min-h-[44px] flex items-center"
            >
              Subscription Policy
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActivePolicyModal("disclaimer")}
              className="hover:text-[#221D1D] transition-colors cursor-pointer py-1 min-h-[44px] flex items-center"
            >
              Examination Disclaimer
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="text-[11px] text-[#221D1D] hover:text-[#4D433F] flex items-center gap-1 transition-colors cursor-pointer py-1 min-h-[44px] font-bold"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>

      </div>

      {/* Policy Modal */}
      {activePolicyModal && policyContent[activePolicyModal] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xl animate-in fade-in duration-200 modal-responsive">
          <div className="bg-white text-[#221D1D] rounded-3xl max-w-lg w-full border border-[#E7E4E7] shadow-[0_20px_50px_rgba(34,29,29,0.15)] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#E7E4E7] bg-[#F7F7F5]">
              <div className="min-w-0 flex-1 mr-3">
                <h4 className="text-xs sm:text-sm font-bold text-[#221D1D]">
                  {policyContent[activePolicyModal].title}
                </h4>
                <p className="text-[10px] text-[#77716E]">
                  {policyContent[activePolicyModal].subtitle}
                </p>
              </div>
              <button
                onClick={() => setActivePolicyModal(null)}
                className="w-9 h-9 rounded-full text-[#77716E] hover:text-[#221D1D] hover:bg-[#E7E4E7] flex items-center justify-center transition-colors cursor-pointer shrink-0 min-w-[44px] min-h-[44px]"
                aria-label="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto text-[#4D433F]">
              {policyContent[activePolicyModal].content}
            </div>

            <div className="px-5 sm:px-6 py-3.5 border-t border-[#E7E4E7] bg-[#F7F7F5] flex justify-end safe-bottom">
              <button
                onClick={() => setActivePolicyModal(null)}
                className="px-5 py-2 rounded-full bg-[#221D1D] hover:bg-[#4D433F] text-white text-xs font-semibold transition-colors cursor-pointer min-h-[44px]"
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
