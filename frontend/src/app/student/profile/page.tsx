"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  ArrowLeft,
  Check,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { apiRequest, getStudentAuthToken, getStudentUser } from "@/lib/api";

interface StudentProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  target_exam: string;
  avatar_url?: string;
  student_id?: string;
}

export default function StudentProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile>({
    name: "Aspirant",
    email: "",
    phone: "",
    city: "",
    state: "",
    target_exam: "CA Foundation Paper 2: Business Laws",
    student_id: "LRK-2026-004182",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      const token = getStudentAuthToken();
      if (!token) {
        router.push("/student/login");
        return;
      }

      try {
        setLoading(true);
        const res = await apiRequest<StudentProfile>("/api/student/profile");
        if (res.success && res.data) {
          if (isMounted) setProfile((prev) => ({ ...prev, ...res.data }));
        } else {
          const cached = getStudentUser();
          if (cached && isMounted) {
            setProfile((prev) => ({
              ...prev,
              name: cached.name || prev.name,
              email: cached.email || prev.email,
              phone: cached.phone || prev.phone,
              target_exam: cached.targetExam || cached.target_exam || prev.target_exam,
            }));
          }
        }
      } catch (e) {
        // Fallback remains
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    try {
      const res = await apiRequest("/api/student/profile", {
        method: "PUT",
        body: JSON.stringify(profile),
      });

      if (res.success) {
        setMsg({ text: "Profile details updated successfully!", type: "success" });
      } else {
        setMsg({ text: res.message || "Failed to update profile.", type: "error" });
      }
    } catch (err: any) {
      setMsg({ text: err.message || "An error occurred.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#221D1D] font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E7E4E7] sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/student"
            className="w-9 h-9 rounded-full border border-[#E7E4E7] bg-white hover:bg-[#F7F7F5] text-[#221D1D] flex items-center justify-center transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#4D433F]" />
          </Link>
          <div>
            <h1 className="font-serif font-black text-lg text-[#221D1D]">
              Candidate Profile
            </h1>
            <p className="text-xs text-[#77716E]">
              Identity Records &amp; Academic Examination Details
            </p>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E7E4E7] shadow-[0_4px_20px_rgba(34,29,29,0.04)] space-y-6">
          {/* Avatar and Info Header */}
          <div className="flex items-center gap-4 pb-6 border-b border-[#E7E4E7]">
            <div className="w-16 h-16 rounded-2xl bg-[#C4E1EC]/60 border border-[#AED7E9] text-[#221D1D] font-serif font-black text-2xl flex items-center justify-center shadow-xs">
              {(profile.name || "S").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-serif font-black text-[#221D1D]">
                {profile.name}
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Roll ID: {profile.student_id || "LRK-2026-ACTIVE"}
              </p>
            </div>
          </div>

          {msg && (
            <div
              className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
                msg.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {msg.type === "success" && <Check className="w-4 h-4 text-emerald-600" />}
              <span>{msg.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Full Name (Google Verified)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={profile.name}
                    readOnly
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Email Address (Read Only)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={profile.email}
                    readOnly
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#221D1D] uppercase tracking-wider mb-1.5">
                  Mobile Contact Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#77716E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E7E4E7] bg-[#F7F7F5] focus:bg-white text-sm text-[#221D1D] focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#221D1D] uppercase tracking-wider mb-1.5">
                  Target Exam Stream
                </label>
                <select
                  value={profile.target_exam}
                  onChange={(e) => setProfile({ ...profile, target_exam: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E7E4E7] bg-[#F7F7F5] focus:bg-white text-sm text-[#221D1D] focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20"
                >
                  <option value="CA Foundation Paper 2: Business Laws">
                    CA Foundation Paper 2: Business Laws
                  </option>
                  <option value="CSEET Paper 2: Legal Aptitude & Management">
                    CSEET Paper 2: Legal Aptitude &amp; Management
                  </option>
                  <option value="Both CA Foundation & CSEET">
                    Both CA Foundation &amp; CSEET
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#221D1D] uppercase tracking-wider mb-1.5">
                  City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#77716E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    placeholder="e.g. Mumbai, New Delhi"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E7E4E7] bg-[#F7F7F5] focus:bg-white text-sm text-[#221D1D] focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#221D1D] uppercase tracking-wider mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  placeholder="e.g. Maharashtra, Delhi"
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E7E4E7] bg-[#F7F7F5] focus:bg-white text-sm text-[#221D1D] focus:outline-none focus:border-[#BFAFE5] focus:ring-2 focus:ring-[#BFAFE5]/20"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E7E4E7] flex items-center justify-between">
              <span className="text-xs text-[#77716E] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2B5B70]" />
                Single Device Hardware Lock Enabled
              </span>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] transition-colors flex items-center gap-2 shadow-[0_2px_8px_rgba(191,175,229,0.35)] cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#221D1D]" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-[#221D1D]" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
