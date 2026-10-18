import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | The Law कक्षा",
  description:
    "Refund and digital fulfillment policy for subscriptions and codices on The Law कक्षा platform.",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-between text-[#221D1D]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="bg-white border border-[#E7E4E7] rounded-3xl p-6 sm:p-10 md:p-14 shadow-xs space-y-8">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4C5C0]/60 text-[#221D1D] text-xs font-semibold">
              <span>Instant Digital Fulfillment</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#221D1D] tracking-tight font-serif">
              Refund &amp; Cancellation Policy
            </h1>
            <p className="text-xs sm:text-sm text-[#77716E]">
              Last updated: October 2026 • Effective upon fee confirmation
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 leading-relaxed font-medium">
            <strong>Compliance Notice:</strong> This refund document is drafted for digital academic operations. It remains subject to final review and approval by the platform owner and designated legal counsel.
          </div>

          <div className="space-y-6 text-sm text-[#4D433F] leading-relaxed">
            <div className="space-y-2">
              <h2 className="text-base font-bold text-[#221D1D]">1. Instant Digital Access</h2>
              <p>
                All course access passes and question bank codices (including the ₹99 launch offer) are fulfilled instantaneously upon payment confirmation. Enrolled students gain immediate access to the in-browser 3D study reader, digital notes, and evaluation desk. No physical books or shipments are dispatched.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-bold text-[#221D1D]">2. Refund &amp; Cancellation Terms</h2>
              <p>
                Because digital study materials, past question answers, and revision blueprints become unencrypted and accessible immediately upon transaction completion, <strong>subscriptions are generally non-refundable and non-transferable</strong>.
              </p>
              <div className="p-4 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7] space-y-2">
                <p className="font-semibold text-[#221D1D]">Technical Exception Guarantee:</p>
                <p className="text-xs">
                  If an unresolvable server failure or platform bug on our infrastructure prevents you from accessing your paid study materials for more than <strong>48 consecutive hours</strong> from purchase, and our academic support team is unable to resolve it upon receiving written notice, you are eligible for a <strong>100% full refund</strong>.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-bold text-[#221D1D]">3. Refund Processing Timeline</h2>
              <p>
                Approved refunds are processed through our payment gateway (Razorpay) and credited back to the original source account (UPI / Bank Account / Card) within <strong>5 to 7 business days</strong>, subject to banking clearing schedules.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-bold text-[#221D1D]">4. Contact &amp; Support Escalation</h2>
              <p>
                For any payment verification issues or refund requests under our guarantee, write to:
              </p>
              <div className="p-4 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7] space-y-1 text-xs">
                <p><strong>Email:</strong> support@thelawkaksha.com</p>
                <p><strong>Subject Format:</strong> REFUND REQUEST - [Your Student Roll ID / Order ID]</p>
                <p><strong>Support Window:</strong> Monday – Saturday (10:00 AM – 7:00 PM IST)</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E7E4E7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#77716E]">
            <p className="font-serif font-bold text-[#221D1D]">The Law कक्षा • Academic Support</p>
            <p>support@thelawkaksha.com</p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
