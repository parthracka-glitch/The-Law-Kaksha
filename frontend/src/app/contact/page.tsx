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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-[#0284C7] text-xs font-semibold">
            <MessageSquare className="w-3.5 h-3.5" /> Direct Faculty &amp; Support Desk
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-serif">
            How Can We Assist Your Law Studies?
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Have questions about syllabus updates, book dispatches, or test series evaluations? Reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-sky-100 rounded-3xl p-6 shadow-xs space-y-5">
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                Support Channels
              </h2>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs">Official Email Support</div>
                    <a
                      href="mailto:support@thelawkaksha.com"
                      className="font-bold text-slate-900 hover:text-[#0284C7]"
                    >
                      support@thelawkaksha.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs">WhatsApp Student Desk</div>
                    <a
                      href="tel:+919876543210"
                      className="font-bold text-slate-900 hover:text-emerald-600"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs">Support Desk Hours</div>
                    <div className="font-bold text-slate-900">
                      Monday to Saturday (9:00 AM – 7:30 PM IST)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs">Publishing &amp; Dispatch Hub</div>
                    <div className="font-bold text-slate-900">
                      The Law Kaksha Academy, Nariman Point, Mumbai - 400021
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Note Card */}
            <div className="bg-sky-50/70 border border-sky-200/80 rounded-3xl p-6 text-xs text-slate-700 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm font-serif">
                <HelpCircle className="w-4 h-4 text-[#0284C7]" />
                Instant PDF Vault Access
              </div>
              <p className="leading-relaxed">
                Purchased digital PDFs unlock in your <strong>CA Student Portal</strong> immediately after payment verification. You do not need to wait for an email dispatch link.
              </p>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-xs">
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif">
                    Inquiry Received Successfully
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
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
                    className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-900 font-serif border-b border-slate-100 pb-3">
                    Send Us an Inquiry
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Rohan Deshmukh"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="student@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        WhatsApp Contact Number
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Inquiry Category
                      </label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white cursor-pointer"
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
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Message / Query *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Please share details of your query or order ID..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:from-[#0369A1] hover:to-[#0284C7] text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
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
