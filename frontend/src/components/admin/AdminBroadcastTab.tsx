"use client";

import React from "react";
import Link from "next/link";
import {
  Megaphone,
  ExternalLink,
  CheckCircle2,
  Send,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Flame,
  Radio,
  Clock,
  BookOpen,
  Tag,
} from "lucide-react";

export interface AnnouncementSetting {
  enabled: boolean;
  text: string;
  badge: string;
  link?: string;
}

interface AdminBroadcastTabProps {
  announcement: AnnouncementSetting;
  setAnnouncement: React.Dispatch<React.SetStateAction<AnnouncementSetting>>;
  handleSaveAnnouncement: () => Promise<void>;
  isSavingAnnouncement: boolean;
  showToast: (msg: string) => void;
}

const PRESET_TEMPLATES = [
  {
    title: "Special Discount Offer",
    badge: "OFFER",
    text: "Flat ₹200 OFF on CA Foundation + CSEET Dual Pass! Use coupon code LAUNCH99 at checkout.",
    link: "/courses",
    icon: Flame,
    color: "from-amber-500/10 to-orange-500/10 border-orange-200",
  },
  {
    title: "Live Doubt Session",
    badge: "LIVE",
    text: "Live Google Meet doubt clearing session starting today at 6:00 PM! Join inside Student Dashboard.",
    link: "/student",
    icon: Radio,
    color: "from-rose-500/10 to-pink-500/10 border-rose-200",
  },
  {
    title: "New ICAI Study Notes",
    badge: "NEW",
    text: "New ICAI Exam-Calibrated Chapter Flowcharts & Landmark Case Studies are now unlocked!",
    link: "/courses",
    icon: BookOpen,
    color: "from-blue-500/10 to-cyan-500/10 border-cyan-200",
  },
  {
    title: "Exam Countdown Alert",
    badge: "EXAM",
    text: "ICAI CA Foundation Exam countdown is on: Access high-yield revision codices & PYQs now.",
    link: "/courses",
    icon: Clock,
    color: "from-purple-500/10 to-indigo-500/10 border-purple-200",
  },
];

const SUGGESTED_BADGES = ["OFFER", "LIVE", "EXAM", "NEW", "ALERT", "BATCH OPEN"];

export function AdminBroadcastTab({
  announcement,
  setAnnouncement,
  handleSaveAnnouncement,
  isSavingAnnouncement,
  showToast,
}: AdminBroadcastTabProps) {
  const applyPreset = (preset: (typeof PRESET_TEMPLATES)[0]) => {
    setAnnouncement({
      enabled: true,
      badge: preset.badge,
      text: preset.text,
      link: preset.link,
    });
    showToast(`Applied preset: ${preset.title}. Remember to click Save!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. TOP HEADER & INSTANT LIVE LINK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E4E7]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#AED7E9]/40 text-[#221D1D] border border-[#AED7E9] uppercase tracking-wider">
              Website Header Control
            </span>
            <span className="text-xs text-[#77716E]">Live across all pages</span>
          </div>
          <h2 className="text-xl font-serif font-bold text-[#221D1D] mt-1 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#4B8097]" />
            <span>Live Broadcast Announcement Bar</span>
          </h2>
          <p className="text-xs text-[#77716E] mt-0.5 max-w-xl">
            Control the top announcement marquee shown to all visitors on the homepage and student dashboard. Set urgency alerts, discounts, or live batch reminders.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 rounded-full bg-white border border-[#E7E4E7] hover:bg-[#F7F7F5] text-[#221D1D] text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#4B8097]" />
          </Link>
          <button
            type="button"
            onClick={handleSaveAnnouncement}
            disabled={isSavingAnnouncement}
            className="px-5 py-2 rounded-full bg-[#221D1D] hover:bg-[#383130] text-white text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-[#AED7E9]" />
            <span>{isSavingAnnouncement ? "Publishing..." : "Save & Publish"}</span>
          </button>
        </div>
      </div>

      {/* 2. MASTER TOGGLE & LIVE PREVIEW STRIP */}
      <div className="bg-white rounded-3xl border border-[#E7E4E7] p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E4E7]">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all ${
                announcement.enabled
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-xs"
                  : "bg-[#F7F7F5] border-[#E7E4E7] text-[#77716E]"
              }`}
            >
              {announcement.enabled ? (
                <Radio className="w-5 h-5 animate-pulse text-emerald-600" />
              ) : (
                <EyeOff className="w-5 h-5 text-[#77716E]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#221D1D]">Broadcast Visibility Status</h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    announcement.enabled
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-[#F7F7F5] text-[#77716E] border border-[#E7E4E7]"
                  }`}
                >
                  {announcement.enabled ? "● Currently Live on Website" : "○ Hidden from Public"}
                </span>
              </div>
              <p className="text-xs text-[#77716E] mt-0.5">
                {announcement.enabled
                  ? "This announcement bar is active and visible to all students and website visitors."
                  : "The announcement bar is currently turned off and invisible."}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={() =>
              setAnnouncement((prev) => ({
                ...prev,
                enabled: !prev.enabled,
              }))
            }
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
              announcement.enabled
                ? "bg-[#D1FAE5] hover:bg-[#A7F3D0] text-[#065F46] border border-[#A7F3D0]"
                : "bg-[#F7F7F5] hover:bg-[#E7E4E7] text-[#4D433F] border border-[#E7E4E7]"
            }`}
          >
            {announcement.enabled ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Turn Off Broadcast</span>
              </>
            ) : (
              <>
                <Radio className="w-3.5 h-3.5 text-[#4B8097]" />
                <span>Turn On Broadcast</span>
              </>
            )}
          </button>
        </div>

        {/* REAL-TIME PREVIEW CONTAINER */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#4D433F] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#4B8097]" />
              <span>Real-Time Website Preview:</span>
            </span>
            <span className="text-[11px] text-[#77716E]">
              {announcement.enabled ? "Live Preview (Active)" : "Live Preview (Will appear when enabled)"}
            </span>
          </div>

          <div
            className={`p-3.5 sm:p-4 rounded-2xl transition-all duration-300 ${
              announcement.enabled
                ? "bg-[#221D1D] text-white border border-[#383130] shadow-sm"
                : "bg-[#F7F7F5] text-[#77716E] border border-dashed border-[#D5D0D5]"
            }`}
          >
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#AED7E9] text-[#221D1D] shrink-0 font-sans shadow-2xs">
                  {announcement.badge || "ANNOUNCEMENT"}
                </span>
                <p className="font-medium truncate text-white/95">
                  {announcement.text || "Type your announcement message in the form below..."}
                </p>
              </div>
              {announcement.link && (
                <div className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-[#AED7E9] underline underline-offset-2">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
              )}
            </div>
          </div>
          <p className="text-[11px] text-[#77716E] italic">
            This banner stays pinned right above the navigation bar at the top of every page.
          </p>
        </div>
      </div>

      {/* 3. SIMPLE, MINIMAL EDIT FORM */}
      <div className="bg-white rounded-3xl border border-[#E7E4E7] p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="border-b border-[#E7E4E7] pb-3">
          <h3 className="text-sm font-bold text-[#221D1D] flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#4B8097]" />
            <span>Customize Announcement Details</span>
          </h3>
          <p className="text-xs text-[#77716E] mt-0.5">
            Fill in the badge, text, and link. Changes apply instantly once saved.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
          {/* Badge Input */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="block font-semibold text-[#221D1D]">
              Badge Tag <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={announcement.badge}
              onChange={(e) =>
                setAnnouncement({ ...announcement, badge: e.target.value.toUpperCase() })
              }
              placeholder="e.g. OFFER, LIVE, ALERT"
              className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] text-xs font-bold outline-none focus:border-[#AED7E9] focus:ring-2 focus:ring-[#AED7E9]/30 bg-[#F7F7F5] focus:bg-white uppercase text-[#221D1D]"
            />
            {/* Quick Badge Chips */}
            <div className="flex items-center gap-1 flex-wrap pt-1">
              {SUGGESTED_BADGES.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setAnnouncement({ ...announcement, badge: b })}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-[#F7F7F5] hover:bg-[#AED7E9]/30 text-[#4D433F] hover:text-[#221D1D] border border-[#E7E4E7] transition-colors cursor-pointer"
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Announcement Message */}
          <div className="md:col-span-6 space-y-1.5">
            <label className="block font-semibold text-[#221D1D]">
              Announcement Message <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={announcement.text}
              onChange={(e) => setAnnouncement({ ...announcement, text: e.target.value })}
              placeholder="e.g. CA Foundation Business Laws Marathon session this Sunday at 11 AM!"
              className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] text-xs outline-none focus:border-[#AED7E9] focus:ring-2 focus:ring-[#AED7E9]/30 bg-[#F7F7F5] focus:bg-white text-[#221D1D]"
            />
            <div className="flex items-center justify-between text-[11px] text-[#77716E] pt-0.5">
              <span>Clear, high-yield announcement copy</span>
              <span>{announcement.text.length} characters</span>
            </div>
          </div>

          {/* Target Link */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="block font-semibold text-[#221D1D]">
              Target Link (Optional)
            </label>
            <input
              type="text"
              value={announcement.link || ""}
              onChange={(e) => setAnnouncement({ ...announcement, link: e.target.value })}
              placeholder="e.g. /courses or /student"
              className="w-full p-2.5 rounded-2xl border border-[#E7E4E7] text-xs outline-none focus:border-[#AED7E9] focus:ring-2 focus:ring-[#AED7E9]/30 bg-[#F7F7F5] focus:bg-white text-[#221D1D]"
            />
            {/* Quick Link Chips */}
            <div className="flex items-center gap-1 flex-wrap pt-1">
              {["/courses", "/student", "/checkout"].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setAnnouncement({ ...announcement, link: l })}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-[#F7F7F5] hover:bg-[#AED7E9]/30 text-[#4D433F] hover:text-[#221D1D] border border-[#E7E4E7] transition-colors cursor-pointer"
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM SAVE BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E7E4E7]">
          <div className="flex items-center gap-2 text-xs text-[#77716E]">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Saved changes sync instantly to website visitors without re-deploying.</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setAnnouncement({
                  enabled: false,
                  badge: "",
                  text: "",
                  link: "",
                });
                showToast("Cleared broadcast details. Click Save to publish.");
              }}
              className="px-4 py-2 rounded-full bg-white border border-[#E7E4E7] hover:bg-[#F7F7F5] text-[#77716E] hover:text-[#221D1D] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={handleSaveAnnouncement}
              disabled={isSavingAnnouncement}
              className="px-6 py-2.5 rounded-full bg-[#221D1D] hover:bg-[#383130] text-white text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-[#AED7E9]" />
              <span>{isSavingAnnouncement ? "Saving Changes..." : "Save Broadcast Announcement"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. 1-CLICK INSTANT PRESET TEMPLATES */}
      <div className="bg-white rounded-3xl border border-[#E7E4E7] p-5 sm:p-6 shadow-2xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4B8097]" />
            <h3 className="text-sm font-bold text-[#221D1D]">1-Click Quick Broadcast Presets</h3>
          </div>
          <p className="text-xs text-[#77716E] mt-0.5">
            Click any template below to automatically fill the announcement bar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {PRESET_TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon;
            return (
              <div
                key={tmpl.title}
                className={`p-4 rounded-2xl border bg-gradient-to-br ${tmpl.color} flex flex-col justify-between space-y-3 hover:shadow-sm transition-all`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/80 text-[#221D1D] border border-black/10 uppercase tracking-wide">
                      {tmpl.badge}
                    </span>
                    <Icon className="w-4 h-4 text-[#221D1D]/70" />
                  </div>
                  <h4 className="text-xs font-bold text-[#221D1D]">{tmpl.title}</h4>
                  <p className="text-[11px] text-[#4D433F] mt-1 line-clamp-2 leading-relaxed">
                    {tmpl.text}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => applyPreset(tmpl)}
                  className="w-full py-1.5 rounded-xl bg-white/90 hover:bg-white text-[#221D1D] text-[11px] font-bold border border-black/10 shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Use This Preset</span>
                  <ArrowRight className="w-3 h-3 text-[#4B8097]" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
