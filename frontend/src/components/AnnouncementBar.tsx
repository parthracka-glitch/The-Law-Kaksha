"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

export interface AnnouncementData {
  enabled: boolean;
  text: string;
  badge: string;
  link?: string;
}

export function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 1. Check local storage
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("lawkaksha_admin_announcement");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === "object") setAnnouncement(parsed);
        } catch (e) {}
      }
    }

    // 2. Fetch from backend /api/announcement
    fetch("/api/announcement")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.announcement) {
          setAnnouncement(data.announcement);
          try {
            localStorage.setItem("lawkaksha_admin_announcement", JSON.stringify(data.announcement));
          } catch (e) {}
        }
      })
      .catch(() => {});

    // 3. Listen to live updates
    const handleUpdate = (e: any) => {
      if (e?.detail) {
        setAnnouncement(e.detail);
        setDismissed(false);
      }
    };
    window.addEventListener("lawkaksha_announcement_updated", handleUpdate);
    return () => {
      window.removeEventListener("lawkaksha_announcement_updated", handleUpdate);
    };
  }, []);

  if (!announcement || !announcement.enabled || !announcement.text || dismissed) {
    return null;
  }

  return (
    <aside
      aria-label="Announcement"
      className="bg-[#221D1D] text-white text-xs py-2 px-3 sm:px-4 relative z-50 border-b border-[#383130] transition-all animate-in fade-in slide-in-from-top-1 duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex-1 flex items-center justify-center gap-2 sm:gap-3 text-center min-w-0">
          {announcement.badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#AED7E9] text-[#221D1D] shrink-0 font-sans shadow-2xs">
              {announcement.badge}
            </span>
          )}
          <span className="font-medium text-xs truncate sm:text-clip text-white/95">
            {announcement.text}
          </span>
          {announcement.link && (
            <Link
              href={announcement.link}
              className="inline-flex items-center gap-1 font-bold text-[#AED7E9] hover:text-white underline underline-offset-2 shrink-0 transition-colors ml-1"
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
            </Link>
          )}
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-white/60 hover:text-white p-0.5 rounded-full hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
