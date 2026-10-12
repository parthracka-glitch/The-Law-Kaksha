"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
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
  Eye,
  EyeOff,
  User,
  ShoppingBag,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { apiRequest, setStudentAuthSession, clearStudentAuthSession } from "@/lib/api";
import { getOrCreateDeviceId, getDeviceFriendlyName } from "@/utils/deviceHelper";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

function StudentLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialErrorParam = searchParams ? searchParams.get("error") : null;

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    initialErrorParam === "no_purchase"
      ? "Course enrollment required. Please sign in with the account you used when purchasing your course."
      : null
  );

  // Failed Access state when user logs in with an account that hasn't bought any course
  const [accessFailed, setAccessFailed] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");

  // Existing session from main website
  const [existingUser, setExistingUser] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved =
          localStorage.getItem("lawkaksha_student_session") ||
          localStorage.getItem("lawkaksha_active_student");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && (parsed.email || parsed.name)) {
            setExistingUser(parsed);
            if (parsed.email) setIdentifier(parsed.email);
          }
        }
      } catch (e) {}
    }
  }, []);

  // Shared processor for verifying course purchase upon authentication
  const processAuthResult = async (res: any, userEmail: string) => {
    const innerData = (res.data as any)?.data || res.data;
    const user =
      innerData?.user ||
      innerData?.student ||
      (res.data as any)?.user ||
      (res.data as any)?.student || {
        email: userEmail,
        name: "Student",
        role: "student",
      };
    const role = innerData?.role || res.data?.role || user.role || "student";
    const token = res.token || innerData?.token || res.data?.token;

    // Admin accounts always have full access
    if (role === "admin") {
      if (token) setStudentAuthSession(token, user);
      router.push("/admin");
      return;
    }

    // Check if response explicitly flagged hasPurchasedCourse
    let hasPurchased = Boolean(
      innerData?.hasPurchasedCourse ||
      res.data?.hasPurchasedCourse ||
      innerData?.subscription?.accessStatus === "Active" ||
      res.data?.subscription?.accessStatus === "Active" ||
      (Array.isArray(user.unlockedItemIds) && user.unlockedItemIds.length > 0) ||
      (Array.isArray(user.enrolled_books) && user.enrolled_books.length > 0)
    );

    // If not immediately confirmed, check the verification endpoint
    let serverEnrolledItems: string[] = [];
    if (user.email || user.student_id) {
      try {
        const checkRes = (await apiRequest(
          `/api/student/check-enrollment?email=${encodeURIComponent(user.email || "")}&studentId=${encodeURIComponent(user.student_id || "")}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        )) as any;
        if (checkRes && checkRes.hasPurchasedCourse) {
          hasPurchased = true;
          if (Array.isArray(checkRes.enrolledItems)) {
            serverEnrolledItems = checkRes.enrolledItems;
          }
        }
      } catch (checkErr) {
        console.warn("[Student Login] Enrollment check fallback:", checkErr);
      }
    }

    // Case 1: Account has purchased course -> Grant Access!
    if (hasPurchased) {
      const mergedUnlocked = Array.from(
        new Set([
          ...(Array.isArray(user.unlockedItemIds) ? user.unlockedItemIds : []),
          ...(Array.isArray(user.enrolled_books) ? user.enrolled_books : []),
          ...serverEnrolledItems,
        ])
      );
      user.unlockedItemIds = mergedUnlocked;
      if (token) setStudentAuthSession(token, user);
      localStorage.setItem("lawkaksha_student_verified", "true");
      if (mergedUnlocked.length > 0) {
        localStorage.setItem("lawkaksha_purchased_books", JSON.stringify(mergedUnlocked));
      }
      router.push("/student");
      return;
    }

    // Case 2: Account has NOT purchased course -> Access Failed!
    setAccessFailed(true);
    setUnverifiedEmail(user.email || userEmail);
    setError(null);
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError("Please provide your registered student email and password.");
      return;
    }

    setLoading(true);
    setError(null);
    setAccessFailed(false);

    try {
      const deviceId = getOrCreateDeviceId();
      const deviceName = getDeviceFriendlyName();

      const res = (await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password.trim(),
          deviceId,
          deviceName,
          forceSwitchDevice: true,
        }),
      })) as any;

      if (!res || !res.success) {
        setError(res?.message || "Invalid credentials or student account not found.");
        setLoading(false);
        return;
      }

      await processAuthResult(res, identifier.trim());
    } catch (err: any) {
      setError(err?.message || "Login failed. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Instant verification using already logged-in session from the main site
  const handleVerifyCurrentSession = async () => {
    if (!existingUser) return;
    setLoading(true);
    setError(null);
    setAccessFailed(false);

    try {
      const token = localStorage.getItem("lawkaksha_token");
      const checkRes = (await apiRequest(
        `/api/student/check-enrollment?email=${encodeURIComponent(existingUser.email || "")}&studentId=${encodeURIComponent(existingUser.student_id || "")}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      )) as any;

      if (checkRes && (checkRes.hasPurchasedCourse || checkRes.role === "admin")) {
        localStorage.setItem("lawkaksha_student_verified", "true");
        router.push("/student");
      } else {
        setAccessFailed(true);
        setUnverifiedEmail(existingUser.email || "Current Account");
      }
    } catch (err: any) {
      setError("Unable to verify enrollment. Please log in below.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchAccount = () => {
    clearStudentAuthSession();
    setExistingUser(null);
    setAccessFailed(false);
    setIdentifier("");
    setPassword("");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between selection:bg-[#005A9C]/10 selection:text-[#005A9C]">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#005A9C]/6 to-transparent rounded-full blur-3xl opacity-70" />
      </div>

      {/* Top Header */}
      <header className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white/80 hover:bg-white text-xs font-medium text-slate-700 shadow-2xs transition-all hover:border-slate-300 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
          <span>Back to Home</span>
        </Link>

        <Link href="/" className="inline-block transition-opacity hover:opacity-90">
          <div className="relative h-9 w-36 sm:h-10 sm:w-40 flex items-center">
            <Image
              src="/assets/logo-transparent.png"
              alt="The Law Kaksha Logo"
              fill
              sizes="(max-width: 640px) 144px, 160px"
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <Link
          href="/login"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-[#005A9C] hover:text-[#004F8A] px-3.5 py-1.5 rounded-full border border-slate-200 bg-white/80 hover:bg-white transition"
        >
          <span>Main Website Login</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[430px] space-y-6">
          {/* CASE 1: FAILED ACCESS SCREEN (User logged in with account that hasn't bought any course) */}
          {accessFailed ? (
            <div className="bg-white rounded-2xl border border-rose-200 p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(225,29,72,0.08)] text-center space-y-5 animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
                <XCircle className="w-7 h-7 text-rose-600" />
              </div>

              <div className="space-y-1.5">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                  Access Failed • Course Required
                </span>
                <h1 className="text-xl sm:text-2xl font-semibold text-[#0A192F] tracking-tight">
                  No Active Course Purchase Found
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                  The account <strong className="text-slate-800">{unverifiedEmail}</strong> does not have an active course enrollment.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 text-left space-y-2">
                <p className="font-semibold text-slate-800">Why did this happen?</p>
                <ul className="space-y-1.5 list-disc list-inside text-[11px] text-slate-500 leading-relaxed">
                  <li>The Student Dashboard is reserved for candidates who have purchased a course from the main website.</li>
                  <li>If you already bought a course, you may have used a <strong>different Google account or email address</strong> at checkout.</li>
                </ul>
              </div>

              <div className="space-y-2.5 pt-1">
                {/* Direct CTA to browse and buy courses */}
                <Link
                  href="/#pricing"
                  className="w-full h-11 rounded-xl bg-[#005A9C] hover:bg-[#004F8A] text-white text-xs sm:text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span>Browse Courses &amp; Buy on Main Website</span>
                </Link>

                {/* Try another account */}
                <button
                  type="button"
                  onClick={handleSwitchAccount}
                  className="w-full h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Sign in with the Google Account Used for Purchase</span>
                </button>
              </div>
            </div>
          ) : (
            /* CASE 2: NORMAL STUDENT LOGIN / VERIFICATION SCREEN */
            <div className="space-y-6">
              <div className="text-center space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#005A9C] text-xs font-semibold border border-[#DBEAFE] mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#005A9C]" />
                  <span>Student Portal Gatekeeper</span>
                </div>
                <h1 className="text-2xl sm:text-[28px] font-semibold text-[#0A192F] tracking-tight">
                  Student Dashboard Access
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Sign in with the Google account or email used when purchasing your CA Foundation or CSEET course.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(10,25,47,0.06)] space-y-5">
                {error && (
                  <div className="p-3 rounded-xl bg-red-50/90 border border-red-200 text-xs text-red-700 flex items-center gap-2.5 font-medium animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span className="leading-snug">{error}</span>
                  </div>
                )}

                {/* Quick One-Tap Verification if already logged in on the main site */}
                {existingUser && (
                  <div className="p-4 rounded-xl bg-[#EFF6FF]/70 border border-[#DBEAFE] space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#005A9C] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {existingUser.name ? existingUser.name[0].toUpperCase() : "U"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {existingUser.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {existingUser.email || "Active Main Site Account"}
                        </p>
                      </div>
                    </div>

                    <div className="pt-1 flex flex-col gap-2">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={handleVerifyCurrentSession}
                        className="w-full h-10 rounded-xl bg-[#005A9C] hover:bg-[#004F8A] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60"
                      >
                        {loading ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            <span>Verify Enrollment &amp; Enter Dashboard</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleSwitchAccount}
                        className="text-[11px] text-slate-500 hover:text-slate-800 transition cursor-pointer text-center"
                      >
                        Use a different Google account or email
                      </button>
                    </div>
                  </div>
                )}

                {/* Google Sign-In as Primary Option */}
                <div className="space-y-3">
                  <div className="relative my-2 flex items-center justify-center">
                    <div className="border-t border-slate-200 w-full" />
                    <span className="bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider shrink-0">
                      {existingUser ? "Or Sign In Directly" : "Sign In With Google"}
                    </span>
                    <div className="border-t border-slate-200 w-full" />
                  </div>

                  <GoogleSignInButton
                    text="signin_with"
                    onSuccess={(res) => {
                      processAuthResult(res, res?.data?.user?.email || res?.data?.student?.email || "");
                    }}
                  />
                </div>

                {/* Divider for Email / Password */}
                <div className="relative my-3 flex items-center justify-center">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider shrink-0">
                    Or with Password
                  </span>
                  <div className="border-t border-slate-200 w-full" />
                </div>

                {/* Email / Password Form */}
                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Student Email or Roll ID *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="student@example.com or LRK-2026-..."
                        required
                        className="w-full pl-10 pr-3.5 h-11 rounded-xl border border-slate-200 focus:outline-none focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/15 text-sm text-[#0A192F] placeholder:text-slate-400 bg-slate-50/50 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-slate-700">
                        Password *
                      </label>
                      <Link
                        href="/login"
                        className="text-xs font-medium text-[#005A9C] hover:text-[#004F8A] hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-10 h-11 rounded-xl border border-slate-200 focus:outline-none focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/15 text-sm text-[#0A192F] placeholder:text-slate-400 bg-slate-50/50 focus:bg-white transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer p-0.5"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-1.5">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 rounded-xl bg-[#005A9C] hover:bg-[#004F8A] text-white text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer active:scale-[0.99]"
                    >
                      {loading ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Verify Enrollment &amp; Enter Dashboard</span>
                          <ArrowRight className="w-4 h-4 text-white" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Footer reassurance */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#005A9C]" />
                  <span>Single-Workstation DRM Encrypted Session</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 px-4 text-xs text-slate-400">
        <p>The Law Kaksha • Academic Learning Space. Exclusively for Enrolled Candidates.</p>
      </footer>
    </div>
  );
}

export default function StudentLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#005A9C] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <StudentLoginContent />
    </Suspense>
  );
}
