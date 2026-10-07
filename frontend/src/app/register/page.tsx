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
  Sparkles,
  BookOpen,
  GraduationCap,
  AlertCircle,
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
        ? "CSEET Business Law & Management"
        : "CA Foundation Paper 2: Business Laws",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        const student = innerData.student || innerData.user || respData.student || respData.user || { name: formData.name };
        localStorage.setItem("lawkaksha_student_session", JSON.stringify(student));
        localStorage.setItem("lawkaksha_active_student", JSON.stringify(student));
        localStorage.setItem("lawkaksha_student_user", JSON.stringify(student));
        if (token) {
          localStorage.setItem("lawkaksha_token", token);
          localStorage.setItem("lawkaksha_student_token", token);
        }
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("lawkaksha_student_updated"));
        router.push("/student");
      } else {
        setErrorMsg(res?.message || "Failed to complete registration.");
      }
    } catch (err: any) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E7E4E7] p-6 sm:p-8 shadow-sm">
      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-2xl bg-[#F4C5C0]/40 border border-[#F4C5C0] text-xs text-[#C35F3B] flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#C35F3B]" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#221D1D] mb-1.5">
            Full Name (As per ICAI / ICSI Records) *
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77716E]" />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Priya Sharma"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E7E4E7] focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 text-sm text-[#221D1D] placeholder:text-[#77716E] bg-[#F7F7F5] focus:bg-white transition-all min-h-[48px]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#221D1D] mb-1.5">
            Target Course Program *
          </label>
          <div className="relative">
            <BookOpen className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77716E]" />
            <select
              name="targetCourse"
              value={formData.targetCourse}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E7E4E7] focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 text-sm text-[#221D1D] bg-[#F7F7F5] focus:bg-white transition-all min-h-[48px]"
            >
              <option value="CA Foundation Paper 2: Business Laws">
                CA Foundation Paper 2: Business Laws (7 Chapters)
              </option>
              <option value="CSEET Business Law & Management">
                CSEET Business Law &amp; Management (8 Units)
              </option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#221D1D] mb-1.5">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77716E]" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="student@example.com"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E7E4E7] focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 text-sm text-[#221D1D] placeholder:text-[#77716E] bg-[#F7F7F5] focus:bg-white transition-all min-h-[48px]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#221D1D] mb-1.5">
            WhatsApp / Mobile Number
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77716E]" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E7E4E7] focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 text-sm text-[#221D1D] placeholder:text-[#77716E] bg-[#F7F7F5] focus:bg-white transition-all min-h-[48px]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#221D1D] mb-1.5">
            Create Password * (Minimum 6 Characters)
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77716E]" />
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E7E4E7] focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20 text-sm text-[#221D1D] placeholder:text-[#77716E] bg-[#F7F7F5] focus:bg-white transition-all min-h-[48px]"
            />
          </div>
        </div>

        {/* Pricing Offer Box */}
        <div className="p-3.5 rounded-2xl bg-[#C4E1EC]/40 border border-[#AED7E9] text-xs text-[#221D1D] flex items-center justify-between">
          <span className="font-medium">Monthly Study Desk Access (Launch Offer):</span>
          <span className="font-bold text-sm text-[#221D1D]">₹99 / month</span>
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
                <span>Create Student Account &amp; Start Learning</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Google OAuth Quick Sign-Up */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="border-t border-[#E7E4E7] w-full" />
        <span className="bg-white px-3 text-[11px] font-semibold text-[#77716E] uppercase tracking-wider shrink-0">
          Or Register With
        </span>
        <div className="border-t border-[#E7E4E7] w-full" />
      </div>

      <GoogleSignInButton
        text="signup_with"
        selectedCourse={formData.targetCourse}
        onSuccess={() => {
          window.location.href = "/student";
        }}
      />

      <div className="mt-5 text-center text-xs text-[#4D433F] border-t border-[#E7E4E7] pt-4">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-[#221D1D] hover:underline underline-offset-4">
          Log in with credentials
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Clean Minimal Top Header with Back Button and Logo */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E7E4E7] bg-white hover:bg-[#F7F7F5] text-xs font-semibold text-[#221D1D] transition-all cursor-pointer shadow-sm"
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

        <div className="w-20 hidden sm:block" />
      </header>

      <main className="flex-1 flex items-center justify-center py-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#AED7E9]/40 text-[#221D1D] border border-[#AED7E9] text-xs font-medium mb-1">
              <span>Start Your Journey</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#221D1D] tracking-tight">
              Create Your Account
            </h1>
            <p className="text-xs sm:text-sm text-[#4D433F]">
              Unlock full ICAI / ICSI notes, weekly case studies, and PYQ analysis.
            </p>
          </div>

          <Suspense fallback={<div className="p-8 text-center text-xs text-[#77716E]">Loading form...</div>}>
            <RegisterForm />
          </Suspense>
        </div>
      </main>

      <footer className="text-center py-3 text-xs text-[#77716E]">
        The Law कक्षा • Academic Learning Space
      </footer>
    </div>
  );
}
