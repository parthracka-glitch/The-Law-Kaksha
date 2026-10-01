"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  BookOpen,
  Award,
  CheckCircle2,
  Calendar,
  Save,
  ShieldCheck,
  Sparkles,
  MapPin,
  Clock,
  Flame,
} from "lucide-react";

export interface StudentProfileData {
  id?: string;
  student_id?: string;
  name: string;
  email: string;
  phone?: string;
  targetExam: string;
  role?: string;
  city?: string;
  goalScore?: string;
  studyMode?: string;
  avatarColor?: string;
}

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: (updated: StudentProfileData) => void;
  streak: number;
}

const AVATAR_COLORS = [
  { id: "violet", bg: "bg-violet-600", text: "text-white", border: "border-violet-300" },
  { id: "sky", bg: "bg-sky-600", text: "text-white", border: "border-sky-300" },
  { id: "emerald", bg: "bg-emerald-600", text: "text-white", border: "border-emerald-300" },
  { id: "amber", bg: "bg-amber-600", text: "text-white", border: "border-amber-300" },
  { id: "rose", bg: "bg-rose-600", text: "text-white", border: "border-rose-300" },
  { id: "indigo", bg: "bg-indigo-600", text: "text-white", border: "border-indigo-300" },
];

export function StudentProfileModal({
  isOpen,
  onClose,
  onProfileUpdated,
  streak,
}: StudentProfileModalProps) {
  const [formData, setFormData] = useState<StudentProfileData>({
    name: "Aarav Sharma",
    email: "aarav.sharma@thelawkaksha.com",
    phone: "+91 98210 45678",
    student_id: "LAW-2026-9821",
    targetExam: "CSEET Law & Management",
    city: "New Delhi",
    goalScore: "Exemption (75+ Marks)",
    studyMode: "Daily 2 Hours Intensive",
    avatarColor: "violet",
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "academic" | "stats">("general");

  useEffect(() => {
    if (typeof window !== "undefined" && isOpen) {
      const sessionStr = localStorage.getItem("lawkaksha_student_session");
      if (sessionStr) {
        try {
          const parsed = JSON.parse(sessionStr);
          setFormData((prev) => ({
            ...prev,
            name: parsed.name || prev.name,
            email: parsed.email || prev.email,
            phone: parsed.phone || prev.phone,
            student_id: parsed.student_id || parsed.id || prev.student_id,
            targetExam: parsed.targetExam || prev.targetExam,
            city: parsed.city || prev.city,
            goalScore: parsed.goalScore || prev.goalScore,
            studyMode: parsed.studyMode || prev.studyMode,
            avatarColor: parsed.avatarColor || prev.avatarColor || "violet",
          }));
        } catch (e) {}
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const initials = formData.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "AS";

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const updated = {
        ...formData,
        role: "student",
      };
      localStorage.setItem("lawkaksha_student_session", JSON.stringify(updated));
      localStorage.setItem("lawkaksha_active_student", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      onProfileUpdated(updated);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 900);
    }
  };

  const selectedColor =
    AVATAR_COLORS.find((c) => c.id === formData.avatarColor) || AVATAR_COLORS[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* HEADER BANNER */}
        <div className="relative bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 p-6 text-white shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            {/* Avatar Pill */}
            <div
              className={`w-16 h-16 rounded-2xl ${selectedColor.bg} text-white text-xl font-bold flex items-center justify-center shadow-lg ring-4 ring-white/20 shrink-0`}
            >
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white leading-tight">
                  {formData.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" />
                  Active Student
                </span>
              </div>
              <p className="text-violet-200 text-xs mt-1">
                Roll No:{" "}
                <span className="font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">
                  {formData.student_id || "LAW-2026-9821"}
                </span>
              </p>
            </div>
          </div>

          {/* TABS */}
          <div className="flex items-center gap-2 mt-5 pt-3 border-t border-white/10">
            {[
              { id: "general" as const, label: "Personal Details", icon: User },
              { id: "academic" as const, label: "Exam & Goals", icon: BookOpen },
              { id: "stats" as const, label: "Study Stats", icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-violet-700 shadow-sm"
                      : "text-violet-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6">
          {savedSuccess && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          <form id="profile-edit-form" onSubmit={handleSave} className="space-y-5">
            {activeTab === "general" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-violet-500" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-violet-500" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. student@thelawkaksha.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-violet-500" />
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.phone || ""}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98210 45678"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-violet-500" />
                      City & State
                    </label>
                    <input
                      type="text"
                      value={formData.city || ""}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Mumbai, Maharashtra"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Avatar Color Choice */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Profile Avatar Color Theme
                  </label>
                  <div className="flex items-center gap-3">
                    {AVATAR_COLORS.map((color) => {
                      const isSelected = formData.avatarColor === color.id;
                      return (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, avatarColor: color.id })}
                          className={`w-8 h-8 rounded-xl ${color.bg} transition-all cursor-pointer flex items-center justify-center text-white ${
                            isSelected ? "ring-2 ring-offset-2 ring-slate-800 scale-110" : "opacity-80 hover:opacity-100"
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "academic" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-violet-500" />
                      Target Examination
                    </label>
                    <select
                      value={formData.targetExam}
                      onChange={(e) => setFormData({ ...formData, targetExam: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all cursor-pointer"
                    >
                      <option value="CSEET Law & Management">CSEET — Business Law & Management</option>
                      <option value="CA Foundation Paper 2">CA Foundation — Paper 2 Business Laws</option>
                      <option value="CSEET + CA Foundation Both">CSEET & CA Foundation (Combo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                      Target Score / Goal
                    </label>
                    <input
                      type="text"
                      value={formData.goalScore || ""}
                      onChange={(e) => setFormData({ ...formData, goalScore: e.target.value })}
                      placeholder="e.g. Exemption (75+ Marks)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-violet-500" />
                    Preferred Study Routine
                  </label>
                  <select
                    value={formData.studyMode || "Daily 2 Hours Intensive"}
                    onChange={(e) => setFormData({ ...formData, studyMode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="Daily 2 Hours Intensive">Daily 2 Hours Intensive (Evenings 7–9 PM)</option>
                    <option value="Morning Focus 6–8 AM">Morning Focus (6–8 AM Fresh Recall)</option>
                    <option value="Weekend Super-Sprint">Weekend Super-Sprint (4 Hours Sat & Sun)</option>
                    <option value="Self-Paced Flexible">Self-Paced Flexible Review</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === "stats" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center">
                    <Flame className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                    <p className="text-xl font-bold text-amber-800">{streak} Days</p>
                    <p className="text-[10px] text-amber-600 font-semibold uppercase tracking-wider">Current Streak</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100 text-center">
                    <BookOpen className="w-5 h-5 text-violet-500 mx-auto mb-1" />
                    <p className="text-xl font-bold text-violet-800">2 Books</p>
                    <p className="text-[10px] text-violet-600 font-semibold uppercase tracking-wider">Study Notes</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-center">
                    <Sparkles className="w-5 h-5 text-sky-500 mx-auto mb-1" />
                    <p className="text-xl font-bold text-sky-800">30 Qs</p>
                    <p className="text-[10px] text-sky-600 font-semibold uppercase tracking-wider">Weekly Tests</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                    <p className="text-xl font-bold text-emerald-800">Pro</p>
                    <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">Membership</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Account ID:</span>
                    <span className="font-mono text-slate-500">{formData.student_id || "LAW-2026-9821"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Enrolled Since:</span>
                    <span>October 2026</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Digital Rights:</span>
                    <span className="text-emerald-600 font-semibold">Active · 2 In-Web Codex Books</span>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* FOOTER */}
        <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            form="profile-edit-form"
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-md shadow-violet-200 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Save Profile Details
          </button>
        </div>
      </div>
    </div>
  );
}
