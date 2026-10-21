"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

export interface AnnouncementData {
  enabled: boolean;
  text: string;
  badge: string;
  link?: string;
}

const ANNOUNCEMENT_CACHE_KEY = "lawkaksha_admin_announcement";

function subscribeToAnnouncementCache(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
  };
}

function getCachedAnnouncement(): string {
  return localStorage.getItem(ANNOUNCEMENT_CACHE_KEY) ?? "";
}

function getServerCachedAnnouncement(): string {
  return "";
}

function parseCachedAnnouncement(cached: string): AnnouncementData | null {
  if (!cached) return null;
  try {
    const parsed: unknown = JSON.parse(cached);
    if (parsed && typeof parsed === "object") {
      return parsed as AnnouncementData;
    }
  } catch {
  }
  return null;
}

export function AnnouncementBar() {
  const cachedRaw = useSyncExternalStore(
    subscribeToAnnouncementCache,
    getCachedAnnouncement,
    getServerCachedAnnouncement
  );
  const cachedAnnouncement = useMemo(
    () => parseCachedAnnouncement(cachedRaw),
    [cachedRaw]
  );
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 1. Fetch from backend /api/announcement
    fetch("/api/announcement")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.announcement) {
          setAnnouncement(data.announcement);
          try {
            localStorage.setItem(ANNOUNCEMENT_CACHE_KEY, JSON.stringify(data.announcement));
          } catch {
          }
        }
      })
      .catch(() => {});

    // 2. Listen to live updates
    const handleUpdate = (event: Event) => {
      const detail = (event as CustomEvent<AnnouncementData>).detail;
      if (detail) {
        setAnnouncement(detail);
        setDismissed(false);
      }
    };
    window.addEventListener("lawkaksha_announcement_updated", handleUpdate);
    return () => {
      window.removeEventListener("lawkaksha_announcement_updated", handleUpdate);
    };
  }, []);

  const activeAnnouncement = announcement ?? cachedAnnouncement;

  if (
    !activeAnnouncement ||
    !activeAnnouncement.enabled ||
    !activeAnnouncement.text ||
    dismissed
  ) {
    return null;
  }

  return (
    <aside
      aria-label="Announcement"
      className="bg-[#0A192F] text-white text-xs py-2 px-3 sm:px-4 relative z-50 border-b border-[#005A9C]/30 transition-all animate-in fade-in slide-in-from-top-1 duration-200"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex-1 flex items-center justify-center gap-2 sm:gap-3 text-center min-w-0">
          {activeAnnouncement.badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#D4AF37] text-[#0A192F] shrink-0 font-sans shadow-2xs">
              {activeAnnouncement.badge}
            </span>
          )}
          <span className="font-medium text-xs truncate sm:text-clip text-white/95">
            {activeAnnouncement.text}
          </span>
          {activeAnnouncement.link && (
            <Link
              href={activeAnnouncement.link}
              className="inline-flex items-center gap-1 font-bold text-[#8ECAE6] hover:text-white underline underline-offset-2 shrink-0 transition-colors ml-1"
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
            </Link>
          )}
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors shrink-0 cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
