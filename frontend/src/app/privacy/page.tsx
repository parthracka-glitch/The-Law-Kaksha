import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | The Law कक्षा",
  description:
    "Privacy Policy and Candidate Data Protection guidelines for The Law कक्षा under the Digital Personal Data Protection Act 2023 (DPDP Act).",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-between text-[#221D1D]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="bg-white border border-[#E7E4E7] rounded-3xl p-6 sm:p-10 md:p-14 shadow-xs space-y-8">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C4E1EC]/60 text-[#221D1D] text-xs font-semibold">
              <span>DPDP Act 2023 Standard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#221D1D] tracking-tight font-serif">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-[#77716E]">
              Last updated: October 2026 • Effective upon enrollment
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 leading-relaxed font-medium">
            <strong>Compliance Notice:</strong> This privacy document is drafted for statutory operational compliance. It remains subject to final review and approval by the platform owner and designated legal counsel.
          </div>

          <div className="space-y-6 text-sm text-[#4D433F] leading-relaxed">
            <p>
              <strong>The Law कक्षा</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) respects candidate privacy and is dedicated to safeguarding personal data in accordance with the <em>Digital Personal Data Protection Act, 2023 (DPDP Act)</em> and relevant Indian information technology regulations.
            </p>

            <div className="space-y-2">
              <h2 className="text-base font-bold text-[#221D1D]">1. Personal Data Collected & Purpose Limitation</h2>
              <p>
                We collect personal information necessary to deliver educational services, including:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Candidate Full Name and Registered Email Address</li>
                <li>WhatsApp / Mobile Phone Number for OTP login &amp; exam alerts</li>
                <li>Course Selection (CA Foundation Paper 2: Business Laws, CSEET)</li>
                <li>Single-Device Hardware / Browser Fingerprint to enforce DRM licensing and protect candidates against unauthorized credential takeover.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-bold text-[#221D1D]">2. Payment Processing & Banking Security</h2>
              <p>
                All student course fees (including our ₹99 introductory offer) are processed via PCI-DSS Level 1 certified payment aggregators (such as Razorpay and UPI). <strong>The Law कक्षा does not capture, store, or process any payment card credentials, CVVs, UPI PINs, or net banking passwords.</strong>
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-bold text-[#221D1D]">3. Candidate Rights (Correction & Erasure)</h2>
              <p>
                In compliance with the DPDP Act 2023, every enrolled student has the statutory right to request access to, correction of, or permanent deletion of their personal data upon completion of their examination cycle.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-bold text-[#221D1D]">4. Data Retention & DRM Watermarking</h2>
              <p>
                To safeguard proprietary academic materials from unauthorized redistribution, digital codices accessed inside the in-web 3D reader display a dynamic session watermark featuring the student&apos;s name and roll ID.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-bold text-[#221D1D]">5. Grievance Redressal & Contact Officer</h2>
              <p>
                For questions regarding personal data or privacy matters, contact:
              </p>
              <div className="p-4 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7] space-y-1 text-xs">
                <p><strong>Designation:</strong> Data Protection &amp; Grievance Redressal Officer</p>
                <p><strong>Email:</strong> grievance@thelawkaksha.com / support@thelawkaksha.com</p>
                <p><strong>Statutory Turnaround:</strong> Maximum 30 calendar days</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E7E4E7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#77716E]">
            <p className="font-serif font-bold text-[#221D1D]">The Law कक्षा • Academic Excellence</p>
            <p>New Delhi, India</p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
