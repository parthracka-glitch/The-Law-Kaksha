"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Sparkles,
  ArrowRight,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Mail,
  Key,
} from "lucide-react";
import { apiRequest, setStudentAuthSession, clearStudentAuthSession } from "@/lib/api";
import { getOrCreateDeviceId, getDeviceFriendlyName } from "@/utils/deviceHelper";

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gating state: when user is valid but has 0 active entitlements
  const [isGated, setIsGated] = useState(false);
  const [gatedUser, setGatedUser] = useState<any | null>(null);

  const checkEntitlementAndProceed = async (token: string, user: any) => {
    try {
      const gateRes = await apiRequest("/api/student/gate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (gateRes.success && gateRes.data?.has_active_entitlement) {
        // Enrolled and entitled -> store session and proceed
        setStudentAuthSession(token, user);
        router.push("/student");
      } else {
        // Unentitled -> display gated screen
        setIsGated(true);
        setGatedUser(user);
      }
    } catch (e: any) {
      // If gate check fails unexpectedly, show error
      setError(e?.message || "Failed to verify student subscription status.");
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please provide your registered student email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const deviceId = getOrCreateDeviceId();
      const deviceName = getDeviceFriendlyName();

      const res = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          deviceId,
          deviceName,
          forceSwitchDevice: true,
        }),
      });

      if (!res.success || !res.token) {
        setError(res.message || "Invalid credentials or student account not found.");
        setLoading(false);
        return;
      }

      await checkEntitlementAndProceed(res.token, res.data?.user || res.data);
    } catch (err: any) {
      setError(err?.message || "Login failed. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetToLogin = () => {
    clearStudentAuthSession();
    setIsGated(false);
    setGatedUser(null);
    setEmail("");
    setPassword("");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0B192C] text-[#FDFBF7] flex flex-col justify-between selection:bg-[#C5A880]/30 selection:text-white">
      {/* Top Ambient Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-96 h-96 bg-[#C5A880]/15 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-[#1E3E62]/30 rounded-full blur-3xl" />
      </div>

      {/* Header bar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C5A880] to-[#E5D0B5] text-[#0B192C] flex items-center justify-center font-serif font-bold text-lg shadow-md">
            LK
          </div>
          <div>
            <span className="font-serif font-bold text-lg text-[#FDFBF7] tracking-tight block">
              The Law Kaksha
            </span>
            <span className="text-[10px] text-[#C5A880] tracking-widest uppercase font-semibold block -mt-1">
              Student Portal
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-[#C5A880] transition-colors"
        >
          Return to Website &rarr;
        </Link>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* GATED STATE SCREEN */}
          {isGated ? (
            <div className="bg-[#11233D] border border-[#C5A880]/40 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Access Restricted
                </span>
                <h1 className="text-2xl font-serif font-bold text-[#FDFBF7]">
                  No Active Subscription
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Welcome, <strong>{gatedUser?.name || "Student"}</strong> ({gatedUser?.email}). Your account is verified, but you do not currently have an active course or study pass entitlement.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-slate-300 text-left space-y-2">
                <p className="font-semibold text-[#C5A880]">To unlock the Student Portal:</p>
                <ul className="space-y-1 list-disc list-inside text-slate-400">
                  <li>Enroll in CA Foundation Business Laws pass</li>
                  <li>Enroll in CSEET Legal Aptitude & Management pass</li>
                  <li>Purchase a Standalone Extra Course or Codex</li>
                </ul>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  href="/#subscriptions"
                  className="w-full py-3.5 px-6 rounded-xl font-medium text-sm bg-gradient-to-r from-[#C5A880] to-[#E5D0B5] text-[#0B192C] hover:from-[#d6bd99] hover:to-[#f0dfc8] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C5A880]/20"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Browse Subscriptions on Website</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={handleResetToLogin}
                  className="w-full py-3 px-6 rounded-xl font-medium text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  Sign in with another account
                </button>
              </div>
            </div>
          ) : (
            /* NORMAL STUDENT LOGIN FORM */
            <div className="bg-[#11233D] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6">
              <div className="text-center space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#C5A880]/20 text-[#E5D0B5] border border-[#C5A880]/30">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                  Candidate Workspace
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FDFBF7]">
                  Student Sign In
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Access your encrypted DRM codices, live Google Meet sessions, and study streaks.
                </p>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Registered Student Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Hardware DRM session will be locked</span>
                  <Link href="/login" className="text-[#C5A880] hover:underline">
                    Website Login
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl font-medium text-sm bg-gradient-to-r from-[#C5A880] to-[#E5D0B5] text-[#0B192C] hover:from-[#d6bd99] hover:to-[#f0dfc8] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C5A880]/20 disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Entitlement...</span>
                    </>
                  ) : (
                    <>
                      <span>Enter Candidate Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Security Footnote */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Protected by DPDP &amp; Single-Device Hardware Security</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer bar */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-4 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} The Law Kaksha. All Rights Reserved. Exclusively for CA Foundation &amp; CSEET Candidates.
      </footer>
    </div>
  );
}
