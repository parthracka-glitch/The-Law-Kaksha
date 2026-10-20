"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCourse = searchParams.get("course") || "ca-foundation";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    targetCourse:
      initialCourse === "cseet"
        ? "CSEET Business Laws and Management"
        : "CA Foundation Paper 2: Business Laws",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (res && res.success && res.data) {
        const respData = res.data;
        const innerData = respData.data || respData;
        const token = respData.token || (res as any).token || innerData.token;
        const student =
          innerData.student ||
          innerData.user ||
          respData.student ||
          respData.user || { name: formData.name };
        localStorage.setItem("lawkaksha_student_session", JSON.stringify(student));
        localStorage.setItem("lawkaksha_active_student", JSON.stringify(student));
        localStorage.setItem("lawkaksha_student_user", JSON.stringify(student));
        if (token) {
          localStorage.setItem("lawkaksha_token", token);
          localStorage.setItem("lawkaksha_student_token", token);
        }
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("lawkaksha_student_updated"));
        router.push("/");
      } else {
        setErrorMsg(res?.message || "Failed to complete registration.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(10,25,47,0.06)] space-y-5">
      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-50/90 border border-red-200 text-xs text-red-700 flex items-center gap-2.5 font-medium animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span className="leading-snug">{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Full Name (As per ICAI / ICSI Records) *
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Priya Sharma"
              className="w-full pl-10 pr-3.5 h-11 rounded-xl border border-slate-200 focus:outline-none focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/15 text-sm text-[#0A192F] placeholder:text-slate-400 bg-slate-50/50 focus:bg-white transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Target Course Program *
          </label>
          <div className="relative">
            <BookOpen className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              name="targetCourse"
              value={formData.targetCourse}
              onChange={handleChange}
              className="w-full pl-10 pr-4 h-11 rounded-xl border border-slate-200 focus:outline-none focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/15 text-sm text-[#0A192F] bg-slate-50/50 focus:bg-white transition appearance-none cursor-pointer"
            >
              <option value="CA Foundation Paper 2: Business Laws">
                CA Foundation Paper 2: Business Laws (7 Chapters)
              </option>
              <option value="CSEET Business Laws and Management">
                CSEET Business Laws and Management (8 Units)
              </option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
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
                placeholder="student@example.com"
                className="w-full pl-10 pr-3 h-11 rounded-xl border border-slate-200 focus:outline-none focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/15 text-sm text-[#0A192F] placeholder:text-slate-400 bg-slate-50/50 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              WhatsApp / Mobile
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-3 h-11 rounded-xl border border-slate-200 focus:outline-none focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/15 text-sm text-[#0A192F] placeholder:text-slate-400 bg-slate-50/50 focus:bg-white transition"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Create Password * (Minimum 6 Characters)
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a secure password"
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

        {/* Feature highlight banner */}
        <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] text-xs text-[#005A9C] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#005A9C]" />
          <span className="text-[11px] font-medium leading-relaxed">
            Includes chapter codices, interactive flowcharts, and PYQ mock questions.
          </span>
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
                <span>Create Student Account &amp; Start Learning</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Google OAuth Quick Sign-Up */}
      <div className="relative my-3 flex items-center justify-center">
        <div className="border-t border-slate-200 w-full" />
        <span className="bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider shrink-0">
          Or register with
        </span>
        <div className="border-t border-slate-200 w-full" />
      </div>

      <GoogleSignInButton
        text="signup_with"
        selectedCourse={formData.targetCourse}
        onSuccess={(res) => {
          const role =
            res?.data?.role || res?.data?.user?.role || res?.data?.student?.role;
          if (role === "admin") {
            window.location.href = "/admin";
          } else {
            window.location.href = "/";
          }
        }}
      />

      <div className="mt-4 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
        Already registered?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#005A9C] hover:underline underline-offset-4"
        >
          Sign in to your account
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
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

        {/* Academic Tag */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200 text-[11px] font-medium text-slate-600 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>ICAI &amp; ICSI Curriculum</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[440px] space-y-6">
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl sm:text-[28px] font-semibold text-[#0A192F] tracking-tight">
              Create Student Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              Join The Law Kaksha for comprehensive CA Foundation &amp; CSEET curriculum mastery.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="p-8 text-center text-xs text-slate-500">
                Loading registration...
              </div>
            }
          >
            <RegisterForm />
          </Suspense>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="text-center py-4 px-4 text-xs text-slate-400">
        <p>The Law Kaksha • Legal &amp; Professional Academic Excellence</p>
      </footer>
    </div>
  );
}
