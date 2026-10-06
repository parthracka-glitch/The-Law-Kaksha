"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Video,
  Clock,
  ArrowLeft,
  Flame,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { apiRequest, getStudentAuthToken } from "@/lib/api";

interface LiveSessionItem {
  id: string;
  title: string;
  subscription_id?: string;
  course_title?: string;
  starts_at: string;
  ends_at: string;
  meet_link: string;
  instructor?: string;
  status?: string;
}

const FALLBACK_SESSIONS: LiveSessionItem[] = [
  {
    id: "live-1",
    title: "ICAI Case Analysis Masterclass: Minor Contracts & Section 11",
    course_title: "CA Foundation Business Laws",
    starts_at: "2026-10-10T18:00:00Z",
    ends_at: "2026-10-10T19:30:00Z",
    meet_link: "https://meet.google.com/law-kaksha-live",
    instructor: "Adv. Rahul Sharma (Faculty)",
    status: "Upcoming",
  },
  {
    id: "live-2",
    title: "CSEET Legal Aptitude Doubt Clearing & Rapid MCQ Speed Drills",
    course_title: "CSEET Legal Aptitude",
    starts_at: "2026-10-12T19:00:00Z",
    ends_at: "2026-10-12T20:15:00Z",
    meet_link: "https://meet.google.com/cseet-law-live",
    instructor: "CS Priya Mehta (Faculty)",
    status: "Upcoming",
  },
];

export default function StudentCalendarPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<LiveSessionItem[]>(FALLBACK_SESSIONS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchCalendar() {
      const token = getStudentAuthToken();
      if (!token) {
        router.push("/student/login");
        return;
      }

      try {
        setLoading(true);
        const res = await apiRequest<{ liveSessions: LiveSessionItem[] }>("/api/student/calendar");
        if (res.success && res.data?.liveSessions && Array.isArray(res.data.liveSessions)) {
          if (isMounted) setSessions(res.data.liveSessions);
        }
      } catch (e) {
        // Fallback remains
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchCalendar();
    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0B192C] font-sans flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/student"
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif font-bold text-lg text-[#0B192C]">
              Live Sessions &amp; Study Calendar
            </h1>
            <p className="text-xs text-slate-500">
              Interactive Google Meet Faculty Classes &amp; Expiry Milestones
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Banner */}
        <div className="bg-[#0B192C] text-white p-8 rounded-3xl border border-[#C5A880]/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10 space-y-2 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#C5A880]/20 text-[#E5D0B5] border border-[#C5A880]/30">
              <Video className="w-3.5 h-3.5 text-[#C5A880]" />
              Google Meet Direct Integration
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#FDFBF7]">
              Real-Time Academic Mentorship
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              All live interactive doubt sessions are conducted directly through verified Google Meet links. Audio and video doubt asking supported.
            </p>
          </div>

          <div className="relative z-10 shrink-0 bg-white/10 border border-white/20 p-4 rounded-2xl text-center backdrop-blur-md">
            <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold text-lg">
              <Flame className="w-5 h-5 fill-amber-400" />
              <span>Active Streak</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">Study today to keep it lit</p>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-xl text-[#0B192C]">
              Upcoming Live Faculty Masterclasses
            </h3>
            <span className="text-xs text-slate-500">
              {sessions.length} Scheduled Classes
            </span>
          </div>

          {sessions.map((sess) => {
            const startDate = new Date(sess.starts_at);
            const formattedDate = startDate.toLocaleDateString("en-IN", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const formattedTime = startDate.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={sess.id}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[#C5A880] uppercase tracking-wider">
                      {sess.course_title || "Special Session"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                      LIVE ON GOOGLE MEET
                    </span>
                  </div>

                  <h4 className="text-lg font-serif font-bold text-[#0B192C]">
                    {sess.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#C5A880]" />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                      {formattedTime} IST
                    </span>
                    {sess.instructor && <span>Instructor: {sess.instructor}</span>}
                  </div>
                </div>

                <a
                  href={sess.meet_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium text-xs sm:text-sm bg-[#0B192C] text-white hover:bg-[#11233D] transition-all flex items-center justify-center gap-2 shadow-md shrink-0"
                >
                  <Video className="w-4 h-4 text-[#C5A880]" />
                  <span>Join Google Meet</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Expiry / Schedule Note */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Classes are automatically unlocked for all candidates with active subscription entitlements. Meeting invitations are also synced with your registered Google Calendar.
          </span>
        </div>
      </main>
    </div>
  );
}
