"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Award,
  Share2,
  FileText,
  CreditCard,
  BookOpen,
  Flame,
  Sparkles,
  Info,
  ChevronDown,
  LogOut,
  User,
  Bookmark,
  CheckSquare,
  Workflow,
  X,
} from "lucide-react";

interface StudentSidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  studentName: string;
  initials: string;
  onOpenProfile: () => void;
  onLogout: () => void;
  sidebarOpen: boolean;
  onCloseSidebar: () => void;
}

export function StudentSidebar({
  activeTab,
  onSelectTab,
  studentName = "Parth Racka",
  initials = "PR",
  onOpenProfile,
  onLogout,
  sidebarOpen,
  onCloseSidebar,
}: StudentSidebarProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Study Materials & Notes come FIRST right below Dashboard
  const STUDY_MATERIALS_MENU = [
    { id: "home", label: "Dashboard", icon: LayoutDashboard },
    { id: "chapters", label: "Chapter Notes", icon: BookOpen },
    { id: "cases", label: "Case Studies", icon: Flame },
    { id: "mcqtest", label: "Practice Tests", icon: Sparkles },
    { id: "ldr", label: "Revision Flowcharts", icon: Workflow },
    { id: "mastery", label: "My Progress", icon: CheckSquare },
  ];

  // Certification, Refer & Earn, and extras come BELOW it
  const EXTRAS_MENU = [
    { id: "certificates", label: "Certificates", icon: Award },
    { id: "refer", label: "Refer and Earn", icon: Share2 },
    { id: "purchases", label: "Purchase History", icon: CreditCard },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 shrink-0 bg-white border-r border-[#E7E4E7] flex flex-col justify-between min-h-screen transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* TOP BRAND SECTION (OFFICIAL LOGO + PORTAL BADGE) */}
        <div>
          <div className="px-5 pt-5 pb-4 border-b border-[#F0F7FF] flex items-center justify-between">
            <div>
              <Link href="/" className="flex items-center transition-opacity hover:opacity-90">
                <div className="relative h-9 w-40 flex items-center">
                  <Image
                    src="/assets/logo-transparent.png"
                    alt="The Law Kaksha"
                    fill
                    sizes="160px"
                    className="object-contain object-left"
                    priority
                  />
                </div>
              </Link>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005A9C] animate-pulse" />
                  <span>Student Portal</span>
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onCloseSidebar}
              className="lg:hidden p-1.5 rounded-xl text-[#64748B] hover:text-[#0A192F] hover:bg-[#F0F7FF] transition-colors cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MAIN MENU ITEMS (NOTES & STUDY MATERIAL FIRST) */}
          <nav className="px-3 py-3 space-y-1">
            <div className="pb-1 px-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B]">
                Study Material
              </span>
            </div>

            {STUDY_MATERIALS_MENU.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseSidebar();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer text-left ${
                    isActive
                      ? "bg-[#EFF6FF] text-[#005A9C] font-bold shadow-2xs border border-[#DBEAFE]"
                      : "text-[#64748B] hover:bg-[#F0F7FF] hover:text-[#0A192F]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-[#005A9C]" : "text-[#64748B]"
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* CERTIFICATION, REFER & EARN, AND EXTRAS BELOW */}
            <div className="pt-3 pb-1 px-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B]">
                Certificates &amp; Rewards
              </span>
            </div>

            {EXTRAS_MENU.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseSidebar();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer text-left ${
                    isActive
                      ? "bg-[#EFF6FF] text-[#005A9C] font-bold shadow-2xs border border-[#DBEAFE]"
                      : "text-[#64748B] hover:bg-[#F0F7FF] hover:text-[#0A192F]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-[#005A9C]" : "text-[#64748B]"
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM SECTION: SUPPORT BUTTON + USER PROFILE PILL */}
        <div className="p-3.5 border-t border-[#DBEAFE] space-y-2 bg-white">
          {/* Support Button */}
          <Link
            href="/contact"
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[#DBEAFE] hover:border-[#005A9C] text-xs font-bold text-[#0A192F] hover:bg-[#EFF6FF] transition-all cursor-pointer shadow-2xs"
          >
            <div className="w-4 h-4 rounded-full border border-[#005A9C] text-[#005A9C] flex items-center justify-center text-[10px] font-bold">
              i
            </div>
            <span>Academic Helpdesk</span>
          </Link>

          {/* User Profile Pill (Avatar initials, name, dropdown chevron) */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              className="w-full flex items-center justify-between p-2 rounded-2xl border border-[#DBEAFE] hover:border-[#005A9C] hover:bg-[#F0F7FF] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#005A9C] text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs">
                  {initials}
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-xs font-bold text-[#0A192F] truncate group-hover:text-[#005A9C] transition-colors">
                    {studentName.split(" ")[0] || "Student"}
                  </p>
                  <p className="text-[10px] text-[#64748B] truncate">Enrolled Candidate</p>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#0A192F] transition-transform" />
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-[#DBEAFE] rounded-2xl shadow-xl p-1.5 space-y-1 animate-in fade-in zoom-in-95 z-50">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#0A192F] hover:bg-[#EFF6FF] hover:text-[#005A9C] transition-colors text-left cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#005A9C]" />
                  <span>My Profile &amp; Exam</span>
                </button>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
