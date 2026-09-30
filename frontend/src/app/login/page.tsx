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
    <div className="min-h-screen bg-[#FBFBFD] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-3">
              <LawKakshaLogo variant="light" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight">
              Student &amp; Faculty Portal
            </h1>
            <p className="text-xs sm:text-sm text-[#86868B]">
              Access your encrypted PDF vault, test evaluations &amp; video masterclasses
            </p>
          </div>

          <div className="bg-white border border-black/[0.06] rounded-3xl p-8 sm:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)] relative overflow-hidden">
            {error && (
              <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-black/[0.1] focus:outline-none focus:border-[#0071E3] text-sm text-[#1D1D1F] placeholder:text-black/30 bg-[#FBFBFD] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#1D1D1F]">
                    Password
                  </label>
                  <span className="text-[11px] text-[#0071E3] hover:underline cursor-pointer font-medium">
                    Forgot Password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-black/[0.1] focus:outline-none focus:border-[#0071E3] text-sm text-[#1D1D1F] placeholder:text-black/30 bg-[#FBFBFD] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs sm:text-sm font-medium shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer active:scale-[0.98]"
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

            <div className="mt-6 pt-5 border-t border-black/[0.06] text-center">
              <p className="text-xs text-[#86868B]">
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-[#0071E3] hover:underline"
                >
                  Register with Student ID
                </Link>
              </p>
            </div>

            {/* Quick Demo Credentials helper */}
            <div className="mt-5 p-3.5 rounded-2xl bg-[#F5F5F7] border border-black/[0.04] text-[11px] text-[#515154] space-y-1">
              <div className="font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0071E3]" /> Quick Login Credentials:
              </div>
              <div className="truncate">Student: <code className="text-[#1D1D1F] font-mono">student@thelawkaksha.com</code> / <code className="text-[#1D1D1F] font-mono">StudentSecurePassword2026!</code></div>
              <div className="truncate">Admin: <code className="text-[#1D1D1F] font-mono">admin@thelawkaksha.com</code> / <code className="text-[#1D1D1F] font-mono">AdminSecurePassword2026!</code></div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
