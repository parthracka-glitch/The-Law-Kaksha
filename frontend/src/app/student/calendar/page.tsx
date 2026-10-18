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
    <div className="min-h-screen bg-[#F7F7F5] text-[#221D1D] font-sans flex flex-col">
      {/* Top Header */}
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
              Live Sessions &amp; Study Calendar
            </h1>
            <p className="text-xs text-[#77716E]">
              Interactive Google Meet Faculty Classes &amp; Expiry Milestones
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Banner */}
        <div className="bg-white text-[#221D1D] p-8 rounded-3xl border border-[#E7E4E7] shadow-[0_4px_20px_rgba(34,29,29,0.04)] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10 space-y-2 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#C4E1EC] text-[#221D1D] border border-[#AED7E9]">
              <Video className="w-3.5 h-3.5 text-[#2B5B70]" />
              Google Meet Direct Integration
            </span>
            <h2 className="text-2xl font-serif font-black text-[#221D1D]">
              Real-Time Academic Mentorship
            </h2>
            <p className="text-xs sm:text-sm text-[#4D433F] max-w-lg">
              All live interactive doubt sessions are conducted directly through verified Google Meet links. Audio and video doubt asking supported.
            </p>
          </div>

          <div className="relative z-10 shrink-0 bg-[#F7F7F5] border border-[#E7E4E7] p-5 rounded-2xl text-center shadow-xs">
            <div className="flex items-center justify-center gap-1.5 text-amber-600 font-bold text-lg">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
              <span>Active Streak</span>
            </div>
            <p className="text-xs text-[#77716E] mt-1">Study today to keep it lit</p>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-black text-xl text-[#221D1D]">
              Upcoming Live Faculty Masterclasses
            </h3>
            <span className="text-xs text-[#77716E]">
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
                className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E4E7] shadow-[0_4px_20px_rgba(34,29,29,0.04)] hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[#2B5B70] uppercase tracking-wider">
                      {sess.course_title || "Special Session"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-100">
                      LIVE ON GOOGLE MEET
                    </span>
                  </div>

                  <h4 className="text-lg font-serif font-black text-[#221D1D]">
                    {sess.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#77716E] pt-1">
                    <span className="flex items-center gap-1 font-medium">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#2B5B70]" />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#2B5B70]" />
                      {formattedTime} IST
                    </span>
                    {sess.instructor && <span>Instructor: {sess.instructor}</span>}
                  </div>
                </div>

                <a
                  href={sess.meet_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] transition-all flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(191,175,229,0.35)] shrink-0 cursor-pointer"
                >
                  <Video className="w-4 h-4 text-[#221D1D]" />
                  <span>Join Google Meet</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Expiry / Schedule Note */}
        <div className="p-6 rounded-3xl bg-white border border-[#E7E4E7] text-xs text-[#77716E] flex items-center gap-3 shadow-[0_4px_20px_rgba(34,29,29,0.04)]">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Classes are automatically unlocked for all candidates with active subscription entitlements. Meeting invitations are also synced with your registered Google Calendar.
          </span>
        </div>
      </main>
    </div>
  );
}
