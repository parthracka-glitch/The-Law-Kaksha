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
  Radio,
  EyeOff,
  Flame,
  Clock,
  BookOpen,
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
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
  },
  {
    title: "Live Doubt Session",
    badge: "LIVE",
    text: "Live Google Meet doubt clearing session starting today at 6:00 PM! Join inside Student Dashboard.",
    link: "/student",
    icon: Radio,
    badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
  },
  {
    title: "New ICAI Study Notes",
    badge: "NEW",
    text: "New ICAI Exam-Calibrated Chapter Flowcharts & Landmark Case Studies are now unlocked!",
    link: "/courses",
    icon: BookOpen,
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
  },
  {
    title: "Exam Countdown Alert",
    badge: "EXAM",
    text: "ICAI CA Foundation Exam countdown is on: Access high-yield revision codices & PYQs now.",
    link: "/courses",
    icon: Clock,
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
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
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. TOP HEADER & PRIMARY ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#EFF6FF] text-[#005A9C] border border-[#BFDBFE]">
              Top Marquee Banner
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                announcement.enabled
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : "bg-slate-100 text-slate-600 border-slate-300"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  announcement.enabled ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                }`}
              />
              <span>{announcement.enabled ? "Live on Website" : "Turned Off (Hidden)"}</span>
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-extrabold text-[#0A192F] mt-1 flex items-center gap-2 tracking-tight">
            <Megaphone className="w-5 h-5 text-[#005A9C]" />
            <span>Top Announcement Bar</span>
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Shown pinned across the very top of all pages on the main website and student portal.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] hover:bg-slate-50 text-[#0A192F] text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>View Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#005A9C]" />
          </Link>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={() =>
              setAnnouncement((prev) => ({
                ...prev,
                enabled: !prev.enabled,
              }))
            }
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 ${
              announcement.enabled
                ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
            }`}
          >
            {announcement.enabled ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Turn Off</span>
              </>
            ) : (
              <>
                <Radio className="w-3.5 h-3.5 text-slate-500" />
                <span>Turn On</span>
              </>
            )}
          </button>

          {/* Save & Publish */}
          <button
            type="button"
            onClick={handleSaveAnnouncement}
            disabled={isSavingAnnouncement}
            className="px-5 py-2 rounded-xl bg-[#005A9C] hover:bg-[#004F8A] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <Send className="w-3.5 h-3.5 text-white" />
            <span>{isSavingAnnouncement ? "Publishing..." : "Save & Publish"}</span>
          </button>
        </div>
      </div>

      {/* 2. REAL-TIME WEBSITE PREVIEW CARD */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#CBD5E1] p-4 sm:p-5 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#0A192F] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#005A9C]" />
            <span>Real-Time Website Preview:</span>
          </span>
          <span className="text-[11px] text-[#64748B]">
            {announcement.enabled ? "Currently visible to visitors" : "Will appear when enabled"}
          </span>
        </div>

        {/* Live Banner Mockup */}
        <div
          className={`p-3 sm:p-3.5 rounded-xl transition-all duration-200 ${
            announcement.enabled
              ? "bg-[#0A192F] text-white shadow-sm border border-[#1E3A8A]"
              : "bg-slate-50 text-slate-500 border border-dashed border-slate-300 opacity-70"
          }`}
        >
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#EFF6FF] text-[#005A9C] shrink-0 border border-[#BFDBFE]">
                {announcement.badge || "ANNOUNCEMENT"}
              </span>
              <p className="font-medium truncate text-white/95 text-[11px] sm:text-xs">
                {announcement.text || "Type your announcement text below..."}
              </p>
            </div>
            {announcement.link && (
              <div className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-[#38BDF8] underline underline-offset-2">
                <span>Explore</span>
                <ArrowRight className="w-3 h-3 stroke-[2.5]" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. STREAMLINED EDIT FORM */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#CBD5E1] p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="border-b border-[#F1F5F9] pb-2.5">
          <h3 className="text-sm font-bold text-[#0A192F]">Announcement Content</h3>
          <p className="text-xs text-[#64748B]">
            Update the badge tag, banner text, and target destination link.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 text-xs">
          {/* Badge Tag */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="block font-bold text-[#0A192F]">
              Badge Tag <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={announcement.badge}
              onChange={(e) =>
                setAnnouncement({ ...announcement, badge: e.target.value.toUpperCase() })
              }
              placeholder="e.g. OFFER, LIVE, ALERT"
              className="w-full p-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold outline-none focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/15 bg-white uppercase text-[#0A192F]"
            />
            {/* Quick Badge Chips */}
            <div className="flex items-center gap-1 flex-wrap pt-0.5">
              {SUGGESTED_BADGES.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setAnnouncement({ ...announcement, badge: b })}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-50 hover:bg-[#EFF6FF] text-slate-700 hover:text-[#005A9C] border border-slate-200 transition-colors cursor-pointer"
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Announcement Text */}
          <div className="md:col-span-6 space-y-1.5">
            <label className="block font-bold text-[#0A192F]">
              Announcement Message <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={announcement.text}
              onChange={(e) => setAnnouncement({ ...announcement, text: e.target.value })}
              placeholder="e.g. Special CA Foundation & CSEET Study Passes available at introductory ₹99/month!"
              className="w-full p-2.5 rounded-xl border border-[#CBD5E1] text-xs outline-none focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/15 bg-white text-[#0A192F]"
            />
            <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-0.5">
              <span>Keeps visitors informed across every page</span>
              <span className="font-mono">{announcement.text.length} chars</span>
            </div>
          </div>

          {/* Target Link */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="block font-bold text-[#0A192F]">
              Target Link (Optional)
            </label>
            <input
              type="text"
              value={announcement.link || ""}
              onChange={(e) => setAnnouncement({ ...announcement, link: e.target.value })}
              placeholder="e.g. /courses or /student"
              className="w-full p-2.5 rounded-xl border border-[#CBD5E1] text-xs outline-none focus:border-[#005A9C] focus:ring-2 focus:ring-[#005A9C]/15 bg-white text-[#0A192F]"
            />
            {/* Quick Link Chips */}
            <div className="flex items-center gap-1 flex-wrap pt-0.5">
              {["/courses", "/student", "/offers"].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setAnnouncement({ ...announcement, link: l })}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-50 hover:bg-[#EFF6FF] text-slate-700 hover:text-[#005A9C] border border-slate-200 transition-colors cursor-pointer"
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. 1-CLICK INSTANT PRESET TEMPLATES */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#CBD5E1] p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#005A9C]" />
              <h3 className="text-sm font-bold text-[#0A192F]">1-Click Quick Presets</h3>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Click any preset to instantly apply pre-tested announcement copy.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon;
            return (
              <div
                key={tmpl.title}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#BFDBFE] flex flex-col justify-between gap-2.5 transition-all shadow-2xs hover:shadow-xs group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${tmpl.badgeColor}`}>
                      {tmpl.badge}
                    </span>
                    <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005A9C] transition-colors" />
                  </div>
                  <h4 className="text-xs font-bold text-[#0A192F]">{tmpl.title}</h4>
                  <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2 leading-relaxed">
                    {tmpl.text}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => applyPreset(tmpl)}
                  className="w-full py-1.5 rounded-lg bg-white hover:bg-[#005A9C] text-slate-700 hover:text-white text-[11px] font-bold border border-slate-200 hover:border-[#005A9C] shadow-2xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span>Apply Preset</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
