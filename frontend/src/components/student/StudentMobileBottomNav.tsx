"use client";

import React from "react";
import { Home, BookOpen, CheckSquare, User } from "lucide-react";

export type StudentMobileNavTab = "home" | "courses" | "progress" | "profile";

interface StudentMobileBottomNavProps {
  activeTab: StudentMobileNavTab;
  onChangeTab: (tab: StudentMobileNavTab) => void;
  onOpenProfile: () => void;
}

export function StudentMobileBottomNav({
  activeTab,
  onChangeTab,
  onOpenProfile,
}: StudentMobileBottomNavProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E7ECF7] shadow-[0_-4px_20px_rgba(15,37,87,0.06)] lg:hidden transition-all">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-around">
        {/* 1. Home */}
        <button
          onClick={() => onChangeTab("home")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === "home" ? "text-[#2F55E0]" : "text-[#7B87A6] hover:text-[#13264F]"
          }`}
          aria-label="Home"
        >
          <div className="relative">
            <Home className="w-5 h-5" />
            {activeTab === "home" && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#2F55E0]" />
            )}
          </div>
          <span className="text-[10.5px] font-semibold leading-none">Home</span>
        </button>

        {/* 2. Courses */}
        <button
          onClick={() => onChangeTab("courses")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === "courses" ? "text-[#2F55E0]" : "text-[#7B87A6] hover:text-[#13264F]"
          }`}
          aria-label="Courses"
        >
          <div className="relative">
            <BookOpen className="w-5 h-5" />
            {activeTab === "courses" && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#2F55E0]" />
            )}
          </div>
          <span className="text-[10.5px] font-semibold leading-none">Courses</span>
        </button>

        {/* 3. Progress */}
        <button
          onClick={() => onChangeTab("progress")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === "progress" ? "text-[#2F55E0]" : "text-[#7B87A6] hover:text-[#13264F]"
          }`}
          aria-label="Progress"
        >
          <div className="relative">
            <CheckSquare className="w-5 h-5" />
            {activeTab === "progress" && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#2F55E0]" />
            )}
          </div>
          <span className="text-[10.5px] font-semibold leading-none">Progress</span>
        </button>

        {/* 4. Profile */}
        <button
          onClick={() => {
            onChangeTab("profile");
            onOpenProfile();
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === "profile" ? "text-[#2F55E0]" : "text-[#7B87A6] hover:text-[#13264F]"
          }`}
          aria-label="Profile"
        >
          <div className="relative">
            <User className="w-5 h-5" />
            {activeTab === "profile" && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#2F55E0]" />
            )}
          </div>
          <span className="text-[10.5px] font-semibold leading-none">Profile</span>
        </button>
      </div>

      {/* iOS style home indicator bar */}
      <div className="w-24 h-1 mx-auto bg-[#3C4254]/30 rounded-full mb-1" />
    </div>
  );
}
