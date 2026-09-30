"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Check,
} from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Book Order & Dispatch Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/[0.04] border border-black/[0.06] text-[#1D1D1F] text-xs font-medium">
            <MessageSquare className="w-3.5 h-3.5 text-[#0071E3]" /> Direct Faculty &amp; Support Desk
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-[#1D1D1F] tracking-tight leading-[1.1]">
            How Can We Assist Your Law Studies?
          </h1>
          <p className="text-sm sm:text-base text-[#86868B] max-w-2xl mx-auto leading-relaxed">
            Have questions about syllabus updates, book dispatches, or test series evaluations? Reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details Cards */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white border border-black/[0.06] rounded-3xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
              <h2 className="text-lg font-semibold text-[#1D1D1F] tracking-tight">
                Support Channels
              </h2>

              <div className="space-y-5 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#0071E3]/[0.08] text-[#0071E3] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[#86868B] text-xs">Official Email Support</div>
                    <a
                      href="mailto:support@thelawkaksha.com"
                      className="font-medium text-[#1D1D1F] hover:text-[#0071E3] transition-colors mt-0.5 block"
                    >
                      support@thelawkaksha.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[#86868B] text-xs">Student Support Helpline</div>
                    <div className="font-medium text-[#1D1D1F] mt-0.5">
                      Available via Student Portal &amp; Support Email
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-black/[0.04] text-[#1D1D1F] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[#86868B] text-xs">Support Desk Hours</div>
                    <div className="font-medium text-[#1D1D1F] mt-0.5">
                      Monday to Saturday (9:00 AM – 7:30 PM IST)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-black/[0.04] text-[#1D1D1F] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[#86868B] text-xs">Publishing &amp; Dispatch Directorate</div>
                    <div className="font-medium text-[#1D1D1F] mt-0.5">
                      The Law Kaksha Publication Hub, India
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Note Card */}
            <div className="bg-[#F5F5F7] border border-black/[0.04] rounded-3xl p-6 text-xs text-[#515154] space-y-2">
              <div className="font-semibold text-[#1D1D1F] flex items-center gap-1.5 text-sm">
                <HelpCircle className="w-4 h-4 text-[#0071E3]" />
                Instant PDF Vault Access
              </div>
              <p className="leading-relaxed">
                Purchased digital PDFs unlock in your <strong>CA Student Portal</strong> immediately after payment verification. You do not need to wait for an email dispatch link.
              </p>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-black/[0.06] rounded-3xl p-8 sm:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1D1D1F] tracking-tight">
                    Inquiry Received Successfully
                  </h3>
                  <p className="text-xs text-[#86868B] max-w-sm mx-auto">
                    Our student academic coordinator will respond to <strong>{form.email}</strong> within 4 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: "",
                        email: "",
                        phone: "",
                        subject: "Book Order & Dispatch Inquiry",
                        message: "",
                      });
                    }}
                    className="mt-4 px-5 py-2.5 rounded-full bg-[#1D1D1F] hover:bg-black text-white text-xs font-medium transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-lg font-semibold text-[#1D1D1F] tracking-tight border-b border-black/[0.06] pb-3">
                    Send Us an Inquiry
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.1] text-xs sm:text-sm text-[#1D1D1F] bg-[#FBFBFD] focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="Enter your email"
                        className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.1] text-xs sm:text-sm text-[#1D1D1F] bg-[#FBFBFD] focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
                        WhatsApp Contact Number
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="Enter your contact number"
                        className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.1] text-xs sm:text-sm text-[#1D1D1F] bg-[#FBFBFD] focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
                        Inquiry Category
                      </label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.1] text-xs text-[#1D1D1F] bg-[#FBFBFD] focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="Book Order & Dispatch Inquiry">Book Order &amp; Dispatch Tracking</option>
                        <option value="Syllabus & ICAI Scheme Question">Syllabus &amp; ICAI Scheme Guidance</option>
                        <option value="1-on-1 Test Series Evaluation Desk">1-on-1 Copy Checking Evaluation</option>
                        <option value="DRM Vault Technical Support">Student DRM Vault Technical Help</option>
                        <option value="Bulk Academy / Faculty Enquiries">Bulk College / Academy Adoption</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
                      Your Message / Query *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Enter your message or query details..."
                      className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.1] text-xs sm:text-sm text-[#1D1D1F] bg-[#FBFBFD] focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Query to Academic Desk</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
