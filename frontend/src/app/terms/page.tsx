import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | The Law कक्षा",
  description:
    "Terms of Service, digital academic license, and platform usage terms for The Law कक्षा CA Foundation & CSEET platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-between text-[#221D1D]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="bg-white border border-[#E7E4E7] rounded-3xl p-6 sm:p-10 md:p-14 shadow-xs space-y-8">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#AED7E9]/50 text-[#221D1D] text-xs font-semibold">
              <span>Academic License Agreement</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#221D1D] tracking-tight font-serif">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-[#77716E]">
              Last updated: October 2026 • Governed by Indian Jurisdiction
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 leading-relaxed font-medium">
            <strong>Compliance Notice:</strong> These terms are drafted for candidate guidance and platform governance. They remain subject to final review and approval by the platform owner and designated legal counsel.
          </div>

          <div className="space-y-6 text-sm text-[#4D433F] leading-relaxed">
            <p>
              Welcome to <strong>The Law कक्षा</strong>. By registering an account, purchasing access, or reading course notes, you agree to comply with the terms and conditions outlined below.
            </p>

            <div className="space-y-2">
              <h2 className="text-base font-bold text-[#221D1D]">1. Intellectual Property &amp; Copyright</h2>
              <p>
                All digital study codices, flowchart blueprints, model question banks, Section 16 comparative tables, and interactive modules are the exclusive proprietary property of The Law कक्षा, protected under the <em>Indian Copyright Act, 1957</em>. No candidate is authorized to photocopy, screen-record, publicly broadcast, or resell any content.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-bold text-[#221D1D]">2. Single-Device DRM Policy</h2>
              <p>
                To maintain fair access and integrity, subscriptions are licensed strictly for single-device personal preparation. Concurrency checks detect simultaneous logins across multiple browsers or locations. Attempting to bypass the DRM viewer or distribute access keys constitutes a material breach and results in immediate account deactivation without refund.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-bold text-[#221D1D]">3. Statutory Examination Disclaimer</h2>
              <p>
                The Law कक्षा is an independent digital academic preparatory resource. It is not affiliated with, accredited by, or endorsed by <em>The Institute of Chartered Accountants of India (ICAI)</em> or <em>The Institute of Company Secretaries of India (ICSI)</em>. Students are advised to refer to official statutory pronouncements issued by the respective regulatory bodies.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-bold text-[#221D1D]">4. Dispute Resolution &amp; Jurisdiction</h2>
              <p>
                Any dispute, controversy, or claim arising under or related to these terms shall be governed by the laws of the Republic of India and subject to the exclusive jurisdiction of the competent courts in New Delhi, India.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E7E4E7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#77716E]">
            <p className="font-serif font-bold text-[#221D1D]">The Law कक्षा • Learn • Practice • Excel</p>
            <p>Academic Desk: support@thelawkaksha.com</p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
