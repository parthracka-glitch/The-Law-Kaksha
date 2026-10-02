"use client";

import React, { useState, useRef, useEffect } from "react";
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
  HelpCircle,
  Check,
  ChevronDown,
} from "lucide-react";

const INQUIRY_OPTIONS = [
  { value: "CA Foundation (Paper 2) Query", label: "CA Foundation (Paper 2)" },
  { value: "CSEET Business Law & Management Query", label: "CSEET Business Law & Management" },
  { value: "Subscription & Access Query", label: "Subscription & Portal Access (@ ₹99/mo)" },
  { value: "Academic Notes & Case Studies Query", label: "Academic Notes & Case Studies" },
  { value: "General Inquiry / Feedback", label: "General Inquiry / Feedback" },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "CA Foundation (Paper 2) Query",
    message: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  const selectedOption = INQUIRY_OPTIONS.find((opt) => opt.value === form.subject) || INQUIRY_OPTIONS[0];

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#C4E1EC]/60 text-[#221D1D] text-xs font-medium">
            <MessageSquare className="w-3.5 h-3.5 text-[#221D1D]" /> Direct Academic &amp; Support Desk
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#221D1D] tracking-tight leading-[1.1]">
            How Can We Assist Your Law Studies?
          </h1>
          <p className="text-sm sm:text-base text-[#4D433F] max-w-2xl mx-auto leading-relaxed">
            Have questions about CA Foundation, CSEET notes, or your subscription? Reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details Cards */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white border border-[#E7E4E7] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-serif font-bold text-[#221D1D] tracking-tight">
                Support Channels
              </h2>

              <div className="space-y-5 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#C4E1EC]/50 text-[#221D1D] flex items-center justify-center shrink-0 border border-[#AED7E9]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[#77716E] text-xs">Official Email Support</div>
                    <a
                      href="mailto:support@thelawkaksha.com"
                      className="font-medium text-[#221D1D] hover:underline transition-colors mt-0.5 block"
                    >
                      support@thelawkaksha.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#AED7E9]/40 text-[#221D1D] flex items-center justify-center shrink-0 border border-[#AED7E9]">
                    <Phone className="w-4 h-4 text-[#4B8097]" />
                  </div>
                  <div>
                    <div className="text-[#77716E] text-xs">Student Support Desk</div>
                    <div className="font-medium text-[#221D1D] mt-0.5">
                      Available via Student Portal &amp; Support Email
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#F7F7F5] text-[#221D1D] flex items-center justify-center shrink-0 border border-[#E7E4E7]">
                    <Clock className="w-4 h-4 text-[#77716E]" />
                  </div>
                  <div>
                    <div className="text-[#77716E] text-xs">Support Desk Hours</div>
                    <div className="font-medium text-[#221D1D] mt-0.5">
                      Monday to Saturday (9:00 AM – 7:30 PM IST)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#F7F7F5] text-[#221D1D] flex items-center justify-center shrink-0 border border-[#E7E4E7]">
                    <MapPin className="w-4 h-4 text-[#77716E]" />
                  </div>
                  <div>
                    <div className="text-[#77716E] text-xs">Academic Office</div>
                    <div className="font-medium text-[#221D1D] mt-0.5">
                      The Law Kaksha Academy, India
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Note Card */}
            <div className="bg-[#AED7E9]/25 border border-[#AED7E9]/60 rounded-3xl p-6 text-xs text-[#4D433F] space-y-2">
              <div className="font-semibold text-[#221D1D] flex items-center gap-1.5 text-sm">
                <HelpCircle className="w-4 h-4 text-[#4B8097]" />
                Instant Portal Access
              </div>
              <p className="leading-relaxed">
                Subscribed digital notes and study modules unlock in your <strong>Student Portal</strong> immediately upon activation.
              </p>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E7E4E7] rounded-3xl p-6 sm:p-10 shadow-sm">
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-14 h-14 bg-[#AED7E9]/30 text-[#4B8097] rounded-full flex items-center justify-center mx-auto border border-[#AED7E9]">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#221D1D] tracking-tight">
                    Inquiry Received Successfully
                  </h3>
                  <p className="text-xs text-[#4D433F] max-w-sm mx-auto">
                    Our academic coordinator will respond to <strong>{form.email}</strong> within 4 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: "",
                        email: "",
                        phone: "",
                        subject: "CA Foundation (Paper 2) Query",
                        message: "",
                      });
                    }}
                    className="mt-4 px-6 py-3 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer min-h-[44px]"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-lg font-serif font-bold text-[#221D1D] tracking-tight border-b border-[#E7E4E7] pb-3">
                    Send Us an Inquiry
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#221D1D] mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 rounded-2xl border border-[#E7E4E7] text-sm text-[#221D1D] bg-[#F7F7F5] focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 focus:bg-white transition-all min-h-[48px]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#221D1D] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 rounded-2xl border border-[#E7E4E7] text-sm text-[#221D1D] bg-[#F7F7F5] focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 focus:bg-white transition-all min-h-[48px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#221D1D] mb-1.5">
                        Contact / WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="Enter your contact number"
                        className="w-full px-4 py-3 rounded-2xl border border-[#E7E4E7] text-sm text-[#221D1D] bg-[#F7F7F5] focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 focus:bg-white transition-all min-h-[48px]"
                      />
                    </div>

                    <div className="relative" ref={dropdownRef}>
                      <label className="block text-xs font-semibold text-[#221D1D] mb-1.5">
                        Inquiry Category
                      </label>
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full px-4 py-3 rounded-2xl border border-[#E7E4E7] text-sm text-left text-[#221D1D] bg-[#F7F7F5] hover:bg-white focus:outline-none focus:border-[#BFAFE5] focus:bg-white transition-all cursor-pointer flex items-center justify-between gap-2 min-h-[48px]"
                      >
                        <span className="truncate font-medium">{selectedOption.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#77716E] transition-transform duration-200 shrink-0 ${
                            dropdownOpen ? "rotate-180 text-[#221D1D]" : ""
                          }`}
                        />
                      </button>

                      {dropdownOpen && (
                        <div className="absolute z-30 left-0 right-0 mt-1.5 py-1.5 bg-white rounded-2xl border border-[#E7E4E7] shadow-lg overflow-hidden">
                          {INQUIRY_OPTIONS.map((opt) => {
                            const isSelected = form.subject === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setForm({ ...form, subject: opt.value });
                                  setDropdownOpen(false);
                                }}
                                className={`w-full px-4 py-3 text-xs text-left flex items-center justify-between transition-colors cursor-pointer min-h-[44px] ${
                                  isSelected
                                    ? "bg-[#C4E1EC]/40 text-[#221D1D] font-semibold"
                                    : "text-[#221D1D] hover:bg-[#F7F7F5] font-normal"
                                }`}
                              >
                                <span className="truncate">{opt.label}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#221D1D] shrink-0 ml-2" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#221D1D] mb-1.5">
                      Your Message / Query *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Enter your message or query details..."
                      className="w-full px-4 py-3 rounded-2xl border border-[#E7E4E7] text-sm text-[#221D1D] bg-[#F7F7F5] focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] min-h-[48px]"
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

