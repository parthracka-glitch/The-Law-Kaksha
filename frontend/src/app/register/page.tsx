"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LawKakshaLogo } from "@/components/LawKakshaLogo";
import { Lock, Mail, User, Phone, BookOpen, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { apiRequest, setAuthSession } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    targetExam: "CA Intermediate Paper 2: Corporate & Other Laws (Nov'26)",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all mandatory fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    setLoading(false);

    if (res.success && res.data?.token) {
      setAuthSession(res.data.token, res.data.user);
      router.push("/student");
    } else {
      setError(res.message || "Failed to create account. Email may already be in use.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <LawKakshaLogo variant="light" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
              Join The Law Kaksha
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Create your account to receive your official Student ID &amp; access course materials
            </p>
          </div>

          <div className="bg-white border border-sky-100 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Rohan Deshmukh"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7] text-sm text-slate-900 placeholder:text-slate-400 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7] text-sm text-slate-900 placeholder:text-slate-400 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  WhatsApp Contact Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7] text-sm text-slate-900 placeholder:text-slate-400 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target CA Examination
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select
                    name="targetExam"
                    value={formData.targetExam}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7] text-xs sm:text-sm text-slate-900 bg-white appearance-none cursor-pointer"
                  >
                    <option value="CA Intermediate Paper 2: Corporate & Other Laws (Nov'26)">
                      CA Intermediate Paper 2 (Nov&apos;26 Scheme)
                    </option>
                    <option value="CA Intermediate Paper 2: Corporate & Other Laws (May'27)">
                      CA Intermediate Paper 2 (May&apos;27 Scheme)
                    </option>
                    <option value="CA Final Paper 3: Advanced Corporate & Economic Laws">
                      CA Final: Corporate &amp; Economic Laws
                    </option>
                    <option value="CA Foundation Paper 2: Business Laws">
                      CA Foundation Paper 2: Business Laws
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Create Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7] text-sm text-slate-900 placeholder:text-slate-400 bg-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:from-[#0369A1] hover:to-[#0284C7] text-white text-sm font-bold shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Generate Student ID &amp; Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-600">
                Already registered?{" "}
                <Link
                  href="/login"
                  className="font-bold text-[#0284C7] hover:underline"
                >
                  Log in with credentials
                </Link>
              </p>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-[11px] text-emerald-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Instantly generates unique <strong>LRK-2026-XXXXXX</strong> credentials</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
