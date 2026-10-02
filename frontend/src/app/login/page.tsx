"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Smartphone,
  ShieldAlert,
  Laptop,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { getOrCreateDeviceId, getDeviceFriendlyName } from "@/utils/deviceHelper";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams ? searchParams.get("redirect") : null;

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [deviceConflictData, setDeviceConflictData] = useState<{
    activeDeviceName: string;
  } | null>(null);

  const handleLogin = async (e?: React.FormEvent, forceSwitch = false) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    if (!forceSwitch) {
      setDeviceConflictData(null);
    }

    try {
      const currentDeviceId = getOrCreateDeviceId();
      const currentDeviceName = getDeviceFriendlyName();

      const res = (await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password.trim(),
          deviceId: currentDeviceId,
          deviceName: currentDeviceName,
          forceSwitchDevice: forceSwitch,
        }),
      })) as any;

      if (res && res.code === "DEVICE_CONFLICT") {
        setDeviceConflictData({
          activeDeviceName: res.activeDeviceName || "Another Registered Device",
        });
        setErrorMsg("");
        return;
      }

      if (res && res.success && res.data) {
        const user = res.data.user || res.data.student || { name: "User" };
        const role = res.data.role || user.role || "student";

        if (role === "admin") {
          const adminSession = {
            name: user.name || "Academic Administrator",
            email: user.email || "admin@thelawkaksha.com",
            role: "admin",
            token: res.token || `admin_token_${Date.now()}`,
          };
          localStorage.setItem("lawkaksha_admin_session", JSON.stringify(adminSession));
          if (res.token) localStorage.setItem("lawkaksha_token", res.token);
          window.dispatchEvent(new Event("storage"));
          router.push("/admin");
        } else {
          localStorage.setItem("lawkaksha_student_session", JSON.stringify(user));
          localStorage.setItem("lawkaksha_active_student", JSON.stringify(user));
          if (res.token) localStorage.setItem("lawkaksha_token", res.token);
          window.dispatchEvent(new Event("storage"));
          
          if (redirectPath) {
            router.push(redirectPath);
          } else {
            router.push("/student");
          }
        }
      } else {
        setErrorMsg(res?.message || "Invalid Email/Student ID or Password.");
      }
    } catch (err: any) {
      if (err?.code === "DEVICE_CONFLICT") {
        setDeviceConflictData({
          activeDeviceName: err.activeDeviceName || "Another Registered Device",
        });
        setErrorMsg("");
      } else {
        setErrorMsg(err?.message || "Unable to connect to server. Please verify your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Clean Minimal Top Header with Back Button and Logo */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E7E4E7] bg-white hover:bg-[#F7F7F5] text-xs font-semibold text-[#221D1D] transition-all cursor-pointer min-h-[44px] shadow-sm"
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

        {/* Balance layout spacer */}
        <div className="w-20 hidden sm:block" />
      </header>

      {/* Main Centered Login Form Card */}
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C4E1EC]/60 text-[#221D1D] text-xs font-medium mb-1">
              <span>Academic Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#221D1D] tracking-tight">
              Sign In to Your Account
            </h1>
            <p className="text-xs sm:text-sm text-[#4D433F]">
              Access your CA Foundation &amp; CSEET study codices, weekly case studies, and exam tests.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E7E4E7] p-6 sm:p-8 shadow-sm space-y-5">
            {/* Device Conflict Notification Modal/Banner */}
            {deviceConflictData && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3 animate-in fade-in-50">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">
                      Active Session on Another Device
                    </h4>
                    <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                      Your account is currently active on:{" "}
                      <span className="font-semibold underline">
                        {deviceConflictData.activeDeviceName}
                      </span>
                      . The Law Kaksha strictly enforces <strong>1 login per device</strong> at a time.
                    </p>
                  </div>
                </div>

                <div className="pt-1 flex flex-col gap-2">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleLogin(undefined, true)}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Laptop className="w-3.5 h-3.5" />
                        <span>Transfer Access to This Device &amp; Sign In</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeviceConflictData(null)}
                    className="w-full py-1.5 rounded-xl bg-transparent hover:bg-amber-100/50 text-amber-800 text-[11px] font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-[#F4C5C0]/40 border border-[#F4C5C0] text-xs text-[#C35F3B] flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#C35F3B]" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={(e) => handleLogin(e, false)} autoComplete="off" className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#221D1D] mb-1.5">
                  Email or Student Roll ID *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77716E]" />
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your registered email or Roll ID (e.g. LRK-2026-CA1001)"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E7E4E7] focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 text-sm text-[#221D1D] placeholder:text-[#77716E] bg-[#F7F7F5] focus:bg-white transition-all min-h-[48px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#221D1D] mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77716E]" />
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E7E4E7] focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 text-sm text-[#221D1D] placeholder:text-[#77716E] bg-[#F7F7F5] focus:bg-white transition-all min-h-[48px]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer active:scale-[0.98] min-h-[48px]"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-[#221D1D] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="text-center text-xs text-[#4D433F] border-t border-[#E7E4E7] pt-4">
              New student?{" "}
              <Link href="/register" className="font-semibold text-[#221D1D] hover:underline underline-offset-4">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal subtle bottom copyright */}
      <footer className="text-center py-3 text-xs text-[#77716E]">
        The Law कक्षा • Academic Learning Space
      </footer>
    </div>
  );
}
