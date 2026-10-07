"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  AlertCircle,
  RefreshCw,
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

  // Gating state: fallback display when needed
  const [isGated, setIsGated] = useState(false);
  const [gatedUser, setGatedUser] = useState<any | null>(null);

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

      const innerData = (res.data as any)?.data || res.data;
      const user =
        innerData?.user ||
        innerData?.student ||
        (res.data as any)?.user ||
        (res.data as any)?.student || {
          email,
          name: "Student",
          role: "student",
        };

      // Set complete auth session for the student in localStorage
      setStudentAuthSession(res.token, user);

      // Route to destination
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/student");
      }
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
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-between p-4 sm:p-6 lg:p-8 text-[#221D1D] selection:bg-[#BFAFE5]/40 selection:text-[#221D1D]">
      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E7E4E7] bg-white hover:bg-[#F7F7F5] text-xs font-semibold text-[#221D1D] transition-all cursor-pointer min-h-[44px] shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#4D433F]" />
          <span>Back to Home</span>
        </Link>

        <Link href="/" className="inline-block transition-opacity hover:opacity-90">
          <div className="relative h-10 w-36 sm:h-11 sm:w-44 flex items-center">
            <Image
              src="/assets/logo-transparent.png"
              alt="The Law Kaksha Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <Link
          href="/login"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#4D433F] hover:text-[#221D1D] px-4 py-2 rounded-full border border-[#E7E4E7] bg-white hover:bg-[#F7F7F5] transition min-h-[44px]"
        >
          <span>Website Login</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="max-w-md w-full space-y-6">
          {/* GATED STATE SCREEN */}
          {isGated ? (
            <div className="bg-white rounded-3xl border border-[#E7E4E7] p-8 sm:p-10 shadow-[0_10px_40px_rgba(34,29,29,0.06)] text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#C4E1EC]/40 border border-[#AED7E9] text-[#2B5B70] flex items-center justify-center mx-auto shadow-xs">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#C4E1EC] text-[#221D1D] border border-[#AED7E9]">
                  Access Restricted
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#221D1D]">
                  No Active Subscription
                </h1>
                <p className="text-xs sm:text-sm text-[#4D433F] leading-relaxed">
                  Welcome, <strong className="text-[#221D1D]">{gatedUser?.name || "Student"}</strong>{gatedUser?.email ? ` (${gatedUser.email})` : ""}. Your account is verified, but you do not currently have an active course or study pass entitlement.
                </p>
              </div>

              <div className="bg-[#FDFBF7] border border-[#E7E4E7] rounded-2xl p-5 text-xs text-[#4D433F] text-left space-y-2.5">
                <p className="font-bold text-[#221D1D]">To unlock the Student Portal:</p>
                <ul className="space-y-1.5 list-disc list-inside text-[#4D433F]">
                  <li>Enroll in CA Foundation Business Laws pass</li>
                  <li>Enroll in CSEET Legal Aptitude &amp; Management pass</li>
                  <li>Purchase a Standalone Extra Course or Codex</li>
                </ul>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.push("/student")}
                  className="w-full py-3.5 px-6 rounded-full font-bold text-sm bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] transition-all flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(191,175,229,0.35)] cursor-pointer active:scale-[0.98]"
                >
                  <BookOpen className="w-4 h-4 text-[#221D1D]" />
                  <span>Enter Student Portal (Preview Mode)</span>
                  <ArrowRight className="w-4 h-4 text-[#221D1D]" />
                </button>

                <Link
                  href="/#subscriptions"
                  className="w-full py-3 px-6 rounded-full font-bold text-xs text-[#221D1D] hover:bg-[#F7F7F5] bg-white border border-[#E7E4E7] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Browse Subscriptions on Website (₹99/mo)</span>
                </Link>

                <button
                  type="button"
                  onClick={handleResetToLogin}
                  className="w-full py-2.5 px-6 rounded-full font-bold text-xs text-[#77716E] hover:text-[#221D1D] transition-colors cursor-pointer"
                >
                  Sign in with another account
                </button>
              </div>
            </div>
          ) : (
            /* NORMAL STUDENT LOGIN FORM */
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C4E1EC]/70 text-[#221D1D] text-xs font-bold border border-[#AED7E9] mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#2B5B70]" />
                  <span>Candidate Workspace</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#221D1D] tracking-tight">
                  Student Sign In
                </h1>
                <p className="text-xs sm:text-sm text-[#4D433F]">
                  Access your encrypted DRM codices, live Google Meet sessions, and study streaks.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-[#E7E4E7] p-6 sm:p-8 shadow-[0_10px_40px_rgba(34,29,29,0.06)] space-y-5">
                {error && (
                  <div className="p-3.5 rounded-2xl bg-[#F4C5C0]/40 border border-[#F4C5C0] text-xs text-[#C35F3B] flex items-center gap-2 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#C35F3B]" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#221D1D] mb-1.5">
                      Registered Student Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#77716E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@example.com"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E7E4E7] focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 text-sm text-[#221D1D] placeholder:text-[#77716E] bg-[#F7F7F5] focus:bg-white transition-all min-h-[48px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#221D1D] mb-1.5">
                      Password *
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-[#77716E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E7E4E7] focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 text-sm text-[#221D1D] placeholder:text-[#77716E] bg-[#F7F7F5] focus:bg-white transition-all min-h-[48px]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#77716E] pt-1">
                    <span>Hardware DRM session will be locked</span>
                    <Link href="/login" className="text-[#221D1D] font-semibold hover:underline">
                      Website Login &rarr;
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-full font-bold text-sm bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] shadow-[0_2px_8px_rgba(191,175,229,0.35)] flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2 cursor-pointer active:scale-[0.98] min-h-[48px]"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#221D1D]" />
                        <span>Verifying Entitlement...</span>
                      </>
                    ) : (
                      <>
                        <span>Enter Candidate Portal</span>
                        <ArrowRight className="w-4 h-4 text-[#221D1D]" />
                      </>
                    )}
                  </button>
                </form>

                {/* Security Footnote */}
                <div className="pt-4 border-t border-[#E7E4E7] flex items-center justify-center gap-2 text-[11px] text-[#77716E]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2B5B70]" />
                  <span>Protected by DPDP &amp; Single-Device Hardware Security</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer bar */}
      <footer className="text-center py-3 text-xs text-[#77716E]">
        &copy; {new Date().getFullYear()} The Law Kaksha • Academic Learning Space. Exclusively for CA Foundation &amp; CSEET Candidates.
      </footer>
    </div>
  );
}
