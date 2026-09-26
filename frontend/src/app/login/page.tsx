"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LawKakshaLogo } from "@/components/LawKakshaLogo";
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { apiRequest, setAuthSession } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.success && res.data?.token) {
      setAuthSession(res.data.token, res.data.user);
      if (res.data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/student");
      }
    } else {
      setError(res.message || "Invalid credentials. Please try again.");
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
              Student &amp; Faculty Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Access your encrypted PDF vault, test evaluations &amp; video masterclasses
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
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7] text-sm text-slate-900 placeholder:text-slate-400 bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[11px] text-[#0284C7] hover:underline cursor-pointer">
                    Forgot Password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
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
                      <span>Sign In to Student Vault</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-600">
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/register"
                  className="font-bold text-[#0284C7] hover:underline"
                >
                  Register with Student ID
                </Link>
              </p>
            </div>

            {/* Quick Demo Credentials helper */}
            <div className="mt-4 p-3 rounded-xl bg-sky-50/70 border border-sky-100 text-[11px] text-slate-600 space-y-1">
              <div className="font-semibold text-slate-900 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#0284C7]" /> Quick Login Credentials:
              </div>
              <div>Student: <code>rohan.deshmukh@gmail.com</code> / <code>StudentSecurePassword2026!</code></div>
              <div>Admin: <code>admin@thelawkaksha.com</code> / <code>AdminSecurePassword2026!</code></div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
