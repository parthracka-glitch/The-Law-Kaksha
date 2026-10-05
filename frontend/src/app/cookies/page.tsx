import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cookie & Storage Policy | The Law कक्षा",
  description:
    "Information regarding essential local storage and cookie usage for student sessions and DRM licensing on The Law कक्षा.",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-between text-[#221D1D]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="bg-white border border-[#E7E4E7] rounded-3xl p-6 sm:p-10 md:p-14 shadow-xs space-y-8">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C4E1EC]/60 text-[#221D1D] text-xs font-semibold">
              <span>DPDP Act 2023 & Minimal Storage Standard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#221D1D] tracking-tight font-serif">
              Cookie &amp; Local Storage Policy
            </h1>
            <p className="text-xs sm:text-sm text-[#77716E]">
              Last updated: October 2026 • Version 1.0.0-draft
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 leading-relaxed font-medium">
            <strong>DRAFT NOTICE:</strong> This cookie and storage disclosure is prepared for operational transparency. It requires review by qualified legal counsel prior to formal publication.
          </div>

          <div className="space-y-6 text-sm text-[#4D433F] leading-relaxed">
            <p>
              <strong>The Law कक्षा</strong> adheres to a strict <em>privacy-first minimalist storage architecture</em>. We do not engage in behavioral cross-site tracking or deploy third-party advertising cookies.
            </p>

            <div className="space-y-2">
              <h2 className="text-base font-bold text-[#221D1D]">1. Strictly Essential Storage Only</h2>
              <p>
                All browser storage mechanisms employed across our portal are strictly required to operate authenticated student sessions, retain digital study cart selections, and enforce single-device academic copyright (DRM).
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-bold text-[#221D1D]">2. Technical Storage Inventory</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-[#E7E4E7] rounded-xl overflow-hidden">
                  <thead className="bg-[#F7F7F5] text-[#221D1D] font-bold">
                    <tr>
                      <th className="p-3 border-b border-[#E7E4E7]">Storage Key / Cookie</th>
                      <th className="p-3 border-b border-[#E7E4E7]">Provider</th>
                      <th className="p-3 border-b border-[#E7E4E7]">Purpose</th>
                      <th className="p-3 border-b border-[#E7E4E7]">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E4E7]">
                    <tr>
                      <td className="p-3 font-mono">lawkaksha_token</td>
                      <td className="p-3">First-Party (localStorage)</td>
                      <td className="p-3">Encrypted JWT authorization token for student portal access</td>
                      <td className="p-3">30 days / user logout</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">lawkaksha_active_student</td>
                      <td className="p-3">First-Party (localStorage)</td>
                      <td className="p-3">Cached student name and exam level for client rendering</td>
                      <td className="p-3">Until logout</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">lawkaksha_cart</td>
                      <td className="p-3">First-Party (localStorage)</td>
                      <td className="p-3">Preserves selected study volumes in cart across pages</td>
                      <td className="p-3">Until cart cleared</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">lawkaksha_device_id</td>
                      <td className="p-3">First-Party (localStorage)</td>
                      <td className="p-3">Unique browser device identifier for single-device DRM binding</td>
                      <td className="p-3">Persistent</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">rzp_checkout_anon_id</td>
                      <td className="p-3">Razorpay (Third-Party Cookie)</td>
                      <td className="p-3">Payment gateway transaction state tracking</td>
                      <td className="p-3">Checkout session</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-bold text-[#221D1D]">3. Managing Local Storage</h2>
              <p>
                Because these storage mechanisms are strictly necessary to maintain authenticated sessions and DRM security, disabling browser local storage will prevent student login and access to purchased course modules.
              </p>
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
