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
      subtitle: "Digital Personal Data Protection (DPDP) Act 2023 Standard",
      content: (
        <div className="space-y-4 text-xs text-[#4D433F] leading-relaxed">
          <p>
            <strong>The Law Kaksha</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to safeguarding candidate data in strict alignment with the <em>Digital Personal Data Protection Act, 2023 (DPDP Act)</em> and applicable Indian cybersecurity guidelines.
          </p>
          <div>
            <h4 className="font-bold text-[#221D1D] mb-1">1. Notice & Purpose Limitation</h4>
            <p>
              We collect personal data (Full Name, Email Address, WhatsApp/Phone Number, Course Enrollment, and Single-Device Session Fingerprint) strictly for:
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-0.5">
              <li>Authenticating student access to enrolled CA Foundation & CSEET digital resources.</li>
              <li>Enforcing single-device digital copyright (DRM) to prevent account compromise.</li>
              <li>Dispatching statutory exam countdown reminders and academic schedule updates.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#221D1D] mb-1">2. Payment & Financial Security</h4>
            <p>
              All fee transactions are processed through PCI-DSS Level 1 certified gateways (Razorpay / UPI). The Law Kaksha does not store debit/credit card credentials, CVV codes, or net banking passwords.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[#221D1D] mb-1">3. Candidate Rights (Right to Correction & Erasure)</h4>
            <p>
              Under the DPDP Act 2023, enrolled candidates hold the statutory right to request access to, correction of, or complete deletion of their personal profile data upon completion of their academic term by writing to our designated Data Protection Officer.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[#221D1D] mb-1">4. Grievance Redressal Officer</h4>
            <p>
              In accordance with DPDP rules, any privacy or data grievances may be addressed to:
              <br />
              <strong>Grievance Officer:</strong> Academic Compliance Team
              <br />
              <strong>Email:</strong> grievance@thelawkaksha.com / support@thelawkaksha.com
              <br />
              <strong>Resolution Turnaround:</strong> Maximum 30 calendar days as mandated by statutory guidelines.
            </p>
          </div>
          <p className="text-[11px] text-[#77716E] italic">
            *Note: All legal and compliance terms are provided for student operational awareness and remain subject to final review by qualified Indian legal counsel.
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
            Welcome to The Law Kaksha. By accessing this learning portal, enrolling in courses, or reading digital codices, you enter into a binding agreement governed by Indian laws.
          </p>
          <div>
            <h4 className="font-bold text-[#221D1D] mb-1">1. Proprietary Academic Material</h4>
            <p>
              All digital codices, flowchart blueprints, model question banks, Section 16(1) comparative rubrics, and video materials are the exclusive intellectual property of The Law Kaksha, protected under the <em>Indian Copyright Act, 1957</em>.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[#221D1D] mb-1">2. Single-Device DRM & Fair Use</h4>
            <p>
              Each candidate subscription is granted for personal academic preparation on a single authorized device. System-level concurrency checks actively block simultaneous multi-device logins. Screen-scraping, unauthorized redistribution, printing for commercial resale, or reverse engineering of DRM viewers will result in immediate subscription termination without refund.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[#221D1D] mb-1">3. Jurisdiction & Dispute Resolution</h4>
            <p>
              Any disputes arising from the use of this portal shall be subject to the exclusive jurisdiction of the competent courts in New Delhi, India.
            </p>
          </div>
        </div>
      ),
    },
    shipping: {
      title: "Subscription & Refund Policy",
      subtitle: "Instant Digital Access & Refund Guidelines",
      content: (
        <div className="space-y-4 text-xs text-[#4D433F] leading-relaxed">
          <div>
            <h4 className="font-bold text-[#221D1D] mb-1">1. Instant Digital Fulfillment</h4>
            <p>
              Upon successful payment verification via Razorpay / UPI, all digital notes, DRM codices, and student dashboard tools are activated instantaneously. No physical dispatch is involved.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[#221D1D] mb-1">2. Refund & Cancellation Terms</h4>
            <p>
              Because digital academic content is unencrypted and accessible immediately upon purchase, subscriptions are generally non-refundable once unlocked.
            </p>
            <p className="mt-1">
              <strong>Exception:</strong> If a technical issue on our server prevents access to your course materials for more than 48 consecutive hours and our technical support desk cannot resolve it, a 100% refund will be credited to the original payment source within 5 to 7 working days.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[#221D1D] mb-1">3. Support Desk</h4>
            <p>
              For subscription assistance or payment confirmation questions, please contact our academic team at <strong>support@thelawkaksha.com</strong> or WhatsApp our helpline.
            </p>
          </div>
        </div>
      ),
    },
    disclaimer: {
      title: "Examination Disclaimer",
      subtitle: "Statutory Examination Notice",
      content: (
        <div className="space-y-4 text-xs text-[#4D433F] leading-relaxed">
          <p>
            <strong>The Law Kaksha</strong> is an independent preparatory platform designed to aid students in mastering Business Laws and Jurisprudence. It is not affiliated with, authorized by, or endorsed by <em>The Institute of Chartered Accountants of India (ICAI)</em> or <em>The Institute of Company Secretaries of India (ICSI)</em>.
          </p>
          <p>
            Candidates must always consult the official study material, statutory pronouncements, and examination announcements issued directly by ICAI and ICSI.
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
            <Link
              href="/privacy"
              className="hover:text-[#221D1D] transition-colors cursor-pointer py-1 min-h-[44px] flex items-center"
            >
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link
              href="/terms"
              className="hover:text-[#221D1D] transition-colors cursor-pointer py-1 min-h-[44px] flex items-center"
            >
              Terms of Service
            </Link>
            <span>&bull;</span>
            <Link
              href="/refund"
              className="hover:text-[#221D1D] transition-colors cursor-pointer py-1 min-h-[44px] flex items-center"
            >
              Refund Policy
            </Link>
            <span>&bull;</span>
            <Link
              href="/cookies"
              className="hover:text-[#221D1D] transition-colors cursor-pointer py-1 min-h-[44px] flex items-center"
            >
              Cookie Policy
            </Link>
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
