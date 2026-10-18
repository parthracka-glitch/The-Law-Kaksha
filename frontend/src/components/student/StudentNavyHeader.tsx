"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, GraduationCap, Lock, CheckCircle2, Menu } from "lucide-react";

interface StudentNavyHeaderProps {
  studentName?: string;
  avatarColor?: string;
  activeCourse: "ca" | "cs";
  onSwitchCourse: (course: "ca" | "cs") => void;
  isCaUnlocked?: boolean;
  isCsUnlocked?: boolean;
  onOpenProfile: () => void;
  onToggleSidebar?: () => void;
}

export function StudentNavyHeader({
  studentName = "Ayesha",
  avatarColor = "violet",
  activeCourse = "ca",
  onSwitchCourse,
  isCaUnlocked = false,
  isCsUnlocked = false,
  onOpenProfile,
  onToggleSidebar,
}: StudentNavyHeaderProps) {
  // First initial of student
  const initial = (studentName || "S").trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-[#0F2557] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle + Logo Branding */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link href="/student" className="flex items-center gap-2.5 group">
            {/* Academic Cap Icon Emblem matching SVG */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6A9BFF] to-[#2E5BEA] flex items-center justify-center shadow-md shadow-blue-900/50 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                The Law Kaksha
              </h1>
              <p className="text-[10px] text-[#DCE6FF] font-medium leading-none hidden xs:block">
                Learn · Grow · Succeed
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Course Selector (CA Foundation vs CSEET) */}
        <div className="flex items-center bg-[#173684]/80 p-0.5 sm:p-1 rounded-xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => onSwitchCourse("ca")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeCourse === "ca"
                ? "bg-[#3558F0] text-white shadow-xs font-bold"
                : "text-white/70 hover:text-white"
            }`}
          >
            {isCaUnlocked ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
            <span>CA Foundation</span>
          </button>

          <button
            onClick={() => onSwitchCourse("cs")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeCourse === "cs"
                ? "bg-[#3558F0] text-white shadow-xs font-bold"
                : "text-white/70 hover:text-white"
            }`}
          >
            {isCsUnlocked ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
            )}
            <span>CSEET</span>
          </button>
        </div>

        {/* Right: Notification Bell + Student Avatar */}
        <div className="flex items-center gap-3">
          {/* Notification Bell with red indicator matching SVG */}
          <div className="relative">
            <button
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#EF4444] border-2 border-[#0F2557]" />
          </div>

          {/* Student Avatar button matching SVG */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-[#3558F0] transition-all cursor-pointer"
            aria-label="Student Profile"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E3AD8A] to-[#C48C6B] border-2 border-white flex items-center justify-center text-[#24150F] font-bold text-sm shadow-xs">
              {initial}
            </div>
            <span className="text-xs font-semibold text-white/90 hidden md:inline max-w-[100px] truncate">
              {studentName}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
