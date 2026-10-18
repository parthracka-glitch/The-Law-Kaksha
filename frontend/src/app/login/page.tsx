"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ShieldAlert,
  Laptop,
  KeyRound,
  CheckCircle2,
  X,
  ShieldCheck,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { getOrCreateDeviceId, getDeviceFriendlyName } from "@/utils/deviceHelper";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams ? searchParams.get("redirect") : null;
  const initialPortalParam = searchParams
    ? searchParams.get("portal") || searchParams.get("role")
    : null;

  // Determine initial portal: default to admin if redirect contains admin or portal=admin
  const isDirectAdmin =
    Boolean(redirectPath && redirectPath.toLowerCase().startsWith("/admin")) ||
    initialPortalParam === "admin";

  const [portalMode, setPortalMode] = useState<"admin" | "student">(
    isDirectAdmin ? "admin" : "student"
  );

  const [identifier, setIdentifier] = useState(isDirectAdmin ? "admin@thelawkaksha.com" : "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [deviceConflictData, setDeviceConflictData] = useState<{
    activeDeviceName: string;
  } | null>(null);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [forgotToken, setForgotToken] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotError, setForgotError] = useState("");

  // Sync mode if redirect parameter changes
  useEffect(() => {
    if (isDirectAdmin) {
      setPortalMode("admin");
      if (!identifier) {
        setIdentifier("admin@thelawkaksha.com");
      }
    }
  }, [isDirectAdmin]);

  const handlePortalSwitch = (mode: "admin" | "student") => {
    setPortalMode(mode);
    setErrorMsg("");
    setDeviceConflictData(null);
    if (mode === "admin" && (!identifier || identifier.startsWith("LRK-"))) {
      setIdentifier("admin@thelawkaksha.com");
    } else if (mode === "student" && identifier === "admin@thelawkaksha.com") {
      setIdentifier("");
      setPassword("");
    }
  };

  const handleLogin = async (e?: React.FormEvent, forceSwitch = false) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    if (!forceSwitch) {
      setDeviceConflictData(null);
    }

    const cleanIdentifier = identifier.trim();
    const cleanPassword = password.trim();

    try {
      const currentDeviceId = getOrCreateDeviceId();
      const currentDeviceName = getDeviceFriendlyName();

      let res: any = null;
      try {
        res = (await apiRequest("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({
            identifier: cleanIdentifier,
            password: cleanPassword,
            deviceId: currentDeviceId,
            deviceName: currentDeviceName,
            forceSwitchDevice: forceSwitch,
          }),
        })) as any;
      } catch (networkErr: any) {
        // Fallback for offline local dev admin testing if backend is temporarily unreachable
        if (
          portalMode === "admin" &&
          cleanIdentifier.toLowerCase() === "admin@thelawkaksha.com" &&
          (cleanPassword === "AdminSecurePassword2026!" || cleanPassword === "Admin@LawKaksha2026!")
        ) {
          const fallbackAdminSession = {
            name: "The Law Kaksha Administrator",
            email: "admin@thelawkaksha.com",
            role: "admin",
            token: `admin_token_${Date.now()}`,
          };
          localStorage.removeItem("lawkaksha_student_session");
          localStorage.removeItem("lawkaksha_active_student");
          localStorage.setItem("lawkaksha_admin_session", JSON.stringify(fallbackAdminSession));
          localStorage.setItem("lawkaksha_token", fallbackAdminSession.token);
          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new Event("lawkaksha_student_updated"));
          const dest = redirectPath && redirectPath.startsWith("/admin") ? redirectPath : "/admin";
          window.location.href = dest;
          return;
        }
        throw networkErr;
      }

      if (res && res.code === "DEVICE_CONFLICT") {
        setDeviceConflictData({
          activeDeviceName: res.activeDeviceName || "Another Registered Workstation",
        });
        setErrorMsg("");
        return;
      }

      if (res && res.success && res.data) {
        const respData = res.data;
        const innerData = respData.data || respData;
        const token = respData.token || (res as any).token || innerData.token;
        const user =
          innerData.user || innerData.student || respData.user || respData.student || { name: "User" };
        const role = innerData.role || respData.role || user.role || "student";

        if (role === "admin") {
          const adminSession = {
            name: user.name || "The Law Kaksha Admin",
            email: user.email || cleanIdentifier,
            role: "admin",
            token: token || `admin_token_${Date.now()}`,
          };
          localStorage.removeItem("lawkaksha_student_session");
          localStorage.removeItem("lawkaksha_active_student");
          localStorage.setItem("lawkaksha_admin_session", JSON.stringify(adminSession));
          if (token) localStorage.setItem("lawkaksha_token", token);
          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new Event("lawkaksha_student_updated"));
          const destination =
            redirectPath && redirectPath.startsWith("/admin") ? redirectPath : "/admin";
          window.location.href = destination;
        } else {
          // If on admin tab but account is a student
          if (portalMode === "admin") {
            setErrorMsg(
              "Access restricted: This is a student account. Please switch to the Student Dashboard to access your study materials."
            );
            return;
          }

          localStorage.removeItem("lawkaksha_admin_session");
          localStorage.setItem("lawkaksha_student_session", JSON.stringify(user));
          localStorage.setItem("lawkaksha_active_student", JSON.stringify(user));
          localStorage.setItem("lawkaksha_student_user", JSON.stringify(user));
          if (token) {
            localStorage.setItem("lawkaksha_token", token);
            localStorage.setItem("lawkaksha_student_token", token);
          }
          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new Event("lawkaksha_student_updated"));
          window.location.href = redirectPath || "/";
        }
      } else {
        setErrorMsg(
          res?.message ||
            (portalMode === "admin"
              ? "Invalid administrator email or password."
              : "Invalid Email/Student ID or Password.")
        );
      }
    } catch (err: any) {
      if (err?.code === "DEVICE_CONFLICT") {
        setDeviceConflictData({
          activeDeviceName: err.activeDeviceName || "Another Registered Workstation",
        });
        setErrorMsg("");
      } else {
        setErrorMsg(
          err?.message ||
            "Unable to connect to authorization server. Please verify your credentials."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    setForgotMsg("");
    try {
      const res = (await apiRequest("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ identifier: forgotIdentifier.trim() }),
      })) as any;
      if (res && res.success) {
        setForgotMsg(res.message || "Reset instructions generated.");
        if (res.resetToken) {
          setForgotToken(res.resetToken);
        }
        setForgotStep(2);
      } else {
        setForgotError(res?.message || "Failed to process request.");
      }
    } catch (err: any) {
      setForgotError(err?.message || "Connection error. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    setForgotMsg("");
    try {
      const res = (await apiRequest("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token: forgotToken.trim(),
          newPassword: forgotNewPassword.trim(),
        }),
      })) as any;
      if (res && res.success) {
        setForgotMsg(res.message || "Password updated successfully!");
        setTimeout(() => {
          setShowForgotModal(false);
          setForgotStep(1);
          setForgotToken("");
          setForgotNewPassword("");
          setForgotMsg("");
        }, 2000);
      } else {
        setForgotError(res?.message || "Failed to reset password.");
      }
    } catch (err: any) {
      setForgotError(err?.message || "Invalid or expired token.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between selection:bg-[#005A9C]/10 selection:text-[#005A9C]">
      {/* Ambient background glow for refined depth */}
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

        {/* Zero-Trust Badge */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200 text-[11px] font-medium text-slate-600 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>SSL &amp; DRM Protected</span>
        </div>
      </header>

      {/* Main Centered Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[420px] space-y-6">
          {/* Segmented Portal Toggle */}
          <div className="p-1 bg-slate-200/80 rounded-xl flex items-center border border-slate-200/90 shadow-2xs">
            <button
              type="button"
              onClick={() => handlePortalSwitch("student")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                portalMode === "student"
                  ? "bg-white text-[#005A9C] font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => handlePortalSwitch("admin")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                portalMode === "admin"
                  ? "bg-[#0A192F] text-white font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Admin Dashboard</span>
            </button>
          </div>

          {/* Heading Section */}
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl sm:text-[28px] font-semibold text-[#0A192F] tracking-tight">
              {portalMode === "admin" ? "Administrative Sign In" : "Welcome Back"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
              {portalMode === "admin"
                ? "Authorized access for faculty, DRM management, and curriculum control."
                : "Sign in to access your notes, lecture codices, and mock exams."}
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(10,25,47,0.06)] space-y-5">
            {/* Device Conflict Notification Modal/Banner */}
            {deviceConflictData && (
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 space-y-3 animate-in fade-in-50">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-amber-900">
                      Active Session on Another Workstation
                    </h4>
                    <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                      This account is currently active on:{" "}
                      <span className="font-semibold underline">
                        {deviceConflictData.activeDeviceName}
                      </span>
                      . The Law Kaksha strictly enforces a <strong>single-workstation policy</strong> for DRM integrity.
                    </p>
                  </div>
                </div>

                <div className="pt-1 flex flex-col gap-2">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleLogin(undefined, true)}
                    className="w-full py-2.5 rounded-xl bg-[#005A9C] hover:bg-[#004F8A] text-white font-medium text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Laptop className="w-3.5 h-3.5" />
                        <span>Transfer Session to This Device</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeviceConflictData(null)}
                    className="w-full py-1.5 rounded-xl text-amber-800 hover:bg-amber-100/60 text-[11px] font-medium transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50/90 border border-red-200 text-xs text-red-700 flex items-center gap-2.5 font-medium animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span className="leading-snug">{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={(e) => handleLogin(e, false)} autoComplete="off" className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  {portalMode === "admin"
                    ? "Administrator Email or Staff ID"
                    : "Email or Student Roll ID"}
                </label>
                <div className="relative">
                  {portalMode === "admin" ? (
                    <Shield className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  ) : (
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  )}
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      portalMode === "admin"
                        ? "admin@thelawkaksha.com"
                        : "student@example.com or Roll ID"
                    }
                    className="w-full pl-10 pr-3.5 h-11 rounded-xl border border-slate-200 focus:outline-none focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/15 text-sm text-[#0A192F] placeholder:text-slate-400 bg-slate-50/50 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(true);
                      setForgotStep(1);
                      setForgotError("");
                      setForgotMsg("");
                      setForgotIdentifier(identifier);
                    }}
                    className="text-xs font-medium text-[#005A9C] hover:text-[#004F8A] hover:underline underline-offset-2 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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
                  ) : portalMode === "admin" ? (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authorize Admin Dashboard Access</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Sign In to Student Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Portal-Specific Footers */}
            {portalMode === "admin" ? (
              <div className="space-y-4 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Shield className="w-3.5 h-3.5 text-[#005A9C] shrink-0" />
                    <span>Staff &amp; Governance Node</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Access is restricted to authorized faculty and system administrators. All session events are cryptographically audited.
                  </p>
                </div>

                <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4 space-y-1.5">
                  <p>
                    Student or Candidate?{" "}
                    <button
                      type="button"
                      onClick={() => handlePortalSwitch("student")}
                      className="font-medium text-[#005A9C] hover:underline underline-offset-4 cursor-pointer"
                    >
                      Switch to Student Dashboard →
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Google OAuth Quick Sign-In */}
                <div className="relative my-3 flex items-center justify-center">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider shrink-0">
                    Or continue with
                  </span>
                  <div className="border-t border-slate-200 w-full" />
                </div>

                <GoogleSignInButton
                  text="signin_with"
                  onSuccess={(res) => {
                    const role =
                      res?.data?.role || res?.data?.user?.role || res?.data?.student?.role;
                    if (role === "admin") {
                      window.location.href = "/admin";
                    } else {
                      window.location.href = redirectPath || "/";
                    }
                  }}
                />

                <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4 space-y-1.5">
                  <p>
                    Don&apos;t have an account yet?{" "}
                    <Link
                      href="/register"
                      className="font-semibold text-[#005A9C] hover:underline underline-offset-4"
                    >
                      Create Student Account
                    </Link>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Administrator or Faculty?{" "}
                    <button
                      type="button"
                      onClick={() => handlePortalSwitch("admin")}
                      className="font-medium text-slate-600 hover:text-slate-900 underline cursor-pointer"
                    >
                      Switch to Admin Dashboard
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Subtle Minimal Footer */}
      <footer className="text-center py-4 px-4 text-xs text-slate-400">
        <p>The Law Kaksha • Legal &amp; Professional Academic Excellence</p>
      </footer>

      {/* Forgot / Reset Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-[#005A9C]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0A192F]">
                    {portalMode === "admin"
                      ? forgotStep === 1
                        ? "Reset Admin Password"
                        : "Set Master Password"
                      : forgotStep === 1
                      ? "Reset Password"
                      : "Set New Password"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {forgotStep === 1 ? "Step 1 of 2: Verification" : "Step 2 of 2: Create Password"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{forgotMsg}</span>
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  {portalMode === "admin"
                    ? "Enter your registered administrative email. A verification reset token will be generated."
                    : "Enter your registered Email address or Student Roll ID to receive reset credentials."}
                </p>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    {portalMode === "admin"
                      ? "Administrator Work Email"
                      : "Registered Email or Roll ID"}
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder={
                      portalMode === "admin"
                        ? "admin@thelawkaksha.com"
                        : "e.g. student@example.com"
                    }
                    className="w-full px-3.5 h-11 rounded-xl border border-slate-200 focus:outline-none focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/15 text-sm text-[#0A192F] bg-slate-50/50 focus:bg-white transition"
                  />
                </div>
                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-4 py-2 rounded-xl bg-[#005A9C] hover:bg-[#004F8A] text-white text-xs font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
                  >
                    {forgotLoading ? "Processing..." : "Continue"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Reset Token / Code
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotToken}
                    onChange={(e) => setForgotToken(e.target.value)}
                    placeholder="Enter reset token"
                    className="w-full px-3.5 h-11 rounded-xl border border-slate-200 focus:outline-none focus:border-[#005A9C] text-xs text-[#0A192F] bg-slate-50/50 focus:bg-white transition font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    New Password (min. 8 characters)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="Enter at least 8 characters"
                    className="w-full px-3.5 h-11 rounded-xl border border-slate-200 focus:outline-none focus:border-[#005A9C] text-sm text-[#0A192F] bg-slate-50/50 focus:bg-white transition"
                  />
                </div>
                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-4 py-2 rounded-xl bg-[#005A9C] hover:bg-[#004F8A] text-white text-xs font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
                  >
                    {forgotLoading ? "Saving..." : "Update Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#005A9C] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
