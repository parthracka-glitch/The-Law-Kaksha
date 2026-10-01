"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = (await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password.trim(),
        }),
      })) as any;

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
          router.push("/student");
        }
      } else {
        setErrorMsg(res?.message || "Invalid Email/Student ID or Password.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Unable to connect to server. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Clean Minimal Top Header with Back Button and Logo */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-black/[0.08] bg-[#FBFBFD] hover:bg-[#F5F5F7] text-xs font-semibold text-[#1D1D1F] transition-all cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-black/60" />
          <span>Back</span>
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
        <div className="w-16 hidden sm:block" />
      </header>

      {/* Main Centered Login Form Card */}
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight">
              Sign In to Your Account
            </h1>
            <p className="text-xs sm:text-sm text-[#86868B]">
              Access your CA Foundation &amp; CSEET study codices, weekly case studies, and exam tests.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-black/[0.08] p-5 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            {errorMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} autoComplete="off" className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
                  Email or Student Roll ID *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30" />
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your registered email or Roll ID"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/[0.1] focus:outline-none focus:border-[#0071E3] text-base text-[#1D1D1F] placeholder:text-black/30 bg-[#FBFBFD] focus:bg-white transition-all min-h-[48px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30" />
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/[0.1] focus:outline-none focus:border-[#0071E3] text-base text-[#1D1D1F] placeholder:text-black/30 bg-[#FBFBFD] focus:bg-white transition-all min-h-[48px]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-sm font-medium shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer active:scale-[0.98] min-h-[48px]"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-xs text-[#86868B]">
              New student?{" "}
              <Link href="/register" className="font-semibold text-[#0071E3] hover:underline">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal subtle bottom copyright */}
      <footer className="text-center py-3 text-[11px] text-[#86868B]">
        The Law कक्षा • Academic Learning Space
      </footer>
    </div>
  );
}

