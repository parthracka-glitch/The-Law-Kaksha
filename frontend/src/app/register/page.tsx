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
        localStorage.setItem(
          "lawkaksha_student_session",
          JSON.stringify(res.data.student || { name: formData.name })
        );
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
    <div className="bg-white rounded-3xl border border-black/[0.08] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      {errorMsg && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
            Full Name (As per ICAI / ICSI Records) *
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30" />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Priya Sharma"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/[0.1] focus:outline-none focus:border-[#0071E3] text-base text-[#1D1D1F] placeholder:text-black/30 bg-[#FBFBFD] focus:bg-white transition-all min-h-[48px]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
            Target Course Program *
          </label>
          <div className="relative">
            <BookOpen className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30" />
            <select
              name="targetCourse"
              value={formData.targetCourse}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/[0.1] focus:outline-none focus:border-[#0071E3] text-base text-[#1D1D1F] bg-[#FBFBFD] focus:bg-white transition-all min-h-[48px]"
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
          <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="student@example.com"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/[0.1] focus:outline-none focus:border-[#0071E3] text-base text-[#1D1D1F] placeholder:text-black/30 bg-[#FBFBFD] focus:bg-white transition-all min-h-[48px]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
            WhatsApp / Mobile Number
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/[0.1] focus:outline-none focus:border-[#0071E3] text-base text-[#1D1D1F] placeholder:text-black/30 bg-[#FBFBFD] focus:bg-white transition-all min-h-[48px]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
            Create Password * (Minimum 6 Characters)
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30" />
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/[0.1] focus:outline-none focus:border-[#0071E3] text-base text-[#1D1D1F] placeholder:text-black/30 bg-[#FBFBFD] focus:bg-white transition-all min-h-[48px]"
            />
          </div>
        </div>

        {/* Pricing Offer Box */}
        <div className="p-3.5 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] text-xs text-[#005A9C] flex items-center justify-between">
          <span>Monthly Subscription (Launch Offer):</span>
          <span className="font-bold text-sm">₹99 / month</span>
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
                <span>Create Student Account &amp; Start Learning</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-5 text-center text-xs text-[#86868B] border-t border-black/[0.06] pt-4">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-[#0071E3] hover:underline">
          Log in with credentials
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Clean Minimal Top Header with Back Button and Logo */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black/[0.08] bg-[#FBFBFD] hover:bg-[#F5F5F7] text-xs font-semibold text-[#1D1D1F] transition-all cursor-pointer"
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

        <div className="w-16 hidden sm:block" />
      </header>

      <main className="flex-1 flex items-center justify-center py-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight">
              Create Your Account
            </h1>
            <p className="text-xs sm:text-sm text-[#86868B]">
              Unlock full ICAI / ICSI notes, weekly case studies, and PYQ analysis.
            </p>
          </div>

          <Suspense fallback={<div className="p-8 text-center text-xs text-[#86868B]">Loading form...</div>}>
            <RegisterForm />
          </Suspense>
        </div>
      </main>

      <footer className="text-center py-3 text-[11px] text-[#86868B]">
        The Law कक्षा • Academic Learning Space
      </footer>
    </div>
  );
}
