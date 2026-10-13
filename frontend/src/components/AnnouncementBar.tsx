"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, X, Sparkles, Flame, BookOpen } from "lucide-react";

export interface AnnouncementData {
  enabled: boolean;
  text: string;
  badge: string;
  link?: string;
}

interface MarqueeItem {
  id: string;
  badge: string;
  isNew?: boolean;
  text: string;
  link: string;
}

export function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null);
  const [newBooks, setNewBooks] = useState<any[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 1. Check local storage for cached announcement
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("lawkaksha_admin_announcement");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === "object") setAnnouncement(parsed);
        } catch (e) {}
      }
    }

    // 2. Fetch live site data (products + announcement)
    fetch("/api/public/site-data")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          if (Array.isArray(data.products) && data.products.length > 0) {
            setNewBooks(data.products);
          }
          if (data.announcement) {
            setAnnouncement(data.announcement);
            try {
              localStorage.setItem("lawkaksha_admin_announcement", JSON.stringify(data.announcement));
            } catch (e) {}
          }
        }
      })
      .catch(() => {});

    // Fallback: also check /api/announcement
    fetch("/api/announcement")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.announcement) {
          setAnnouncement(data.announcement);
        }
      })
      .catch(() => {});

    // 3. Listen to live updates from admin broadcasts
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

  if (dismissed) {
    return null;
  }

  // Build the list of ticker items
  const items: MarqueeItem[] = [];

  // Priority 1: New books added in admin
  if (newBooks.length > 0) {
    newBooks.forEach((book, idx) => {
      items.push({
        id: `book-${book.id || idx}`,
        badge: "NEW CONTENT",
        isNew: true,
        text: `📚 "${book.title}" is now LIVE! Read with In-Web DRM Access • Starting @ ₹${book.price || 99}`,
        link: `/product/${book.id}`,
      });
    });
  }

  // Priority 2: Admin broadcast announcement if active
  if (announcement && announcement.enabled && announcement.text) {
    items.push({
      id: "admin-announcement",
      badge: announcement.badge || "ANNOUNCEMENT",
      isNew: false,
      text: announcement.text,
      link: announcement.link || "/courses",
    });
  }

  // Priority 3: Default curriculum and launch passes
  if (items.length === 0) {
    items.push(
      {
        id: "default-launch",
        badge: "LAUNCH OFFER",
        isNew: false,
        text: "⚡ Special CA Foundation & CSEET Study Passes available at introductory ₹99/month!",
        link: "/courses",
      },
      {
        id: "default-curriculum",
        badge: "2026 CURRICULUM",
        isNew: false,
        text: "📖 All 8 Statutory Modules, Landmark Case Scenarios & ICAI Model Answers Active",
        link: "/case-studies",
      }
    );
  }

  // Duplicate items for a seamless marquee loop
  const marqueeList = [...items, ...items, ...items];

  return (
    <aside
      aria-label="Announcement & New Releases Marquee"
      className="bg-[#0A192F] text-white text-xs py-2 relative z-50 border-b border-[#1E293B] overflow-hidden select-none"
    >
      <div className="flex items-center justify-between w-full">
        {/* Fixed Left Tag */}
        <div className="shrink-0 pl-3 sm:pl-4 pr-3 z-10 bg-[#0A192F] flex items-center gap-1.5 shadow-[4px_0_12px_rgba(10,25,47,0.8)] border-r border-[#1E293B]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 hidden sm:inline">
            Live Feed
          </span>
        </div>

        {/* Scrolling Marquee Bar */}
        <div className="flex-1 overflow-hidden relative group">
          <div className="flex items-center gap-8 sm:gap-12 animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap w-max py-0.5">
            {marqueeList.map((item, index) => (
              <div key={`${item.id}-${index}`} className="inline-flex items-center gap-2.5 shrink-0">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase inline-flex items-center gap-1 shadow-xs ${
                    item.isNew
                      ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white animate-pulse"
                      : "bg-[#005A9C] text-white"
                  }`}
                >
                  {item.isNew ? <Flame className="w-2.5 h-2.5" /> : <Sparkles className="w-2.5 h-2.5" />}
                  <span>{item.badge}</span>
                </span>

                <span className="text-slate-200 text-xs font-medium">
                  {item.text}
                </span>

                {item.link && (
                  <Link
                    href={item.link}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#60A5FA] hover:text-white underline underline-offset-2 transition-colors ml-1"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                  </Link>
                )}

                <span className="text-slate-600 font-bold ml-2">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dismiss Button */}
        <div className="shrink-0 pr-3 sm:pr-4 pl-2 z-10 bg-[#0A192F] shadow-[-4px_0_12px_rgba(10,25,47,0.8)] border-l border-[#1E293B]">
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Dismiss scrolling bar"
            title="Dismiss announcement bar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
