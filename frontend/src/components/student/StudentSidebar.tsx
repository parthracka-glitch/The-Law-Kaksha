"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  BookOpen,
  Bookmark,
  CheckSquare,
  User,
  HelpCircle,
  LogOut,
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
  studentName = "Student",
  initials = "ST",
  onOpenProfile,
  onLogout,
  sidebarOpen,
  onCloseSidebar,
}: StudentSidebarProps) {
  const MENU_ITEMS = [
    { id: "home", label: "Dashboard", icon: LayoutDashboard },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
    { id: "progress", label: "My Progress", icon: CheckSquare },
    { id: "profile", label: "Profile", icon: User },
    { id: "support", label: "Help & Support", icon: HelpCircle },
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
        className={`fixed inset-y-0 left-0 z-50 w-60 shrink-0 bg-white border-r border-[#E7E4E7] flex flex-col justify-between h-screen transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* TOP BRAND SECTION (OFFICIAL LOGO + PORTAL BADGE) + SCROLLABLE MENU */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="px-5 pt-5 pb-4 border-b border-[#F0F7FF] flex items-center justify-between sticky top-0 bg-white z-10">
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
                  <span>Student Dashboard</span>
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

          {/* MAIN MENU ITEMS (STANDARDIZED 6 CORE TABS) */}
          <nav className="px-3 py-3 space-y-1">
            <div className="pb-1 px-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B]">
                Navigation
              </span>
            </div>

            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "profile") {
                      onOpenProfile();
                    }
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

            {/* LOGOUT BUTTON */}
            <div className="pt-2 space-y-1 border-t border-[#F0F4F8] mt-2">
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onCloseSidebar();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer text-left group"
              >
                <LogOut className="w-4 h-4 shrink-0 text-rose-600 group-hover:scale-110 transition-transform" />
                <span>Log Out</span>
              </button>
            </div>
          </nav>
        </div>

        {/* BOTTOM SECTION: SUPPORT BUTTON + USER SUMMARY */}
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

          {/* User Profile Summary */}
          <div className="flex items-center gap-2.5 p-2 rounded-2xl border border-[#DBEAFE] bg-[#F8FAFC]">
            <div className="w-8 h-8 rounded-full bg-[#005A9C] text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs">
              {initials}
            </div>
            <div className="min-w-0 text-left">
              <p className="text-xs font-bold text-[#0A192F] truncate">
                {studentName.split(" ")[0] || "Student"}
              </p>
              <p className="text-[10px] text-[#64748B] truncate">Enrolled Candidate</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
