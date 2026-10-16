"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  BookOpen,
  Sparkles,
  Bookmark,
  TrendingUp,
  User,
  Headphones,
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
  // Navigation Menu matching WhatsApp Image 2026-10-15 at 3.00.48 PM.jpeg
  const MENU_ITEMS = [
    { id: "home", label: "Dashboard", icon: Home },
    { id: "chapters", label: "My Course", icon: BookOpen },
    { id: "cases", label: "New This Week", icon: Sparkles, badge: "NEW" },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
    { id: "mastery", label: "My Progress", icon: TrendingUp },
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
        className={`fixed inset-y-0 left-0 z-50 w-60 shrink-0 bg-white border-r border-[#E2E8F0] flex flex-col justify-between h-screen transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* TOP BRAND SECTION (OFFICIAL LOGO) + MENU */}
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

          {/* MAIN MENU ITEMS */}
          <nav className="px-3 py-4 space-y-1">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseSidebar();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer text-left ${
                    isActive
                      ? "bg-[#EFF6FF] text-[#005A9C] font-bold shadow-2xs border border-[#DBEAFE]"
                      : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0A192F]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-[#005A9C]" : "text-[#64748B]"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-pink-100 text-pink-600 border border-pink-200">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Profile Button */}
            <button
              type="button"
              onClick={() => {
                onOpenProfile();
                onCloseSidebar();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0A192F] transition-all cursor-pointer text-left"
            >
              <User className="w-4 h-4 shrink-0 text-[#64748B]" />
              <span>Profile</span>
            </button>
          </nav>
        </div>

        {/* BOTTOM SECTION: NEED HELP CARD + LOGOUT */}
        <div className="p-4 border-t border-[#E2E8F0] space-y-3 bg-white">
          {/* Need Help Box matching WhatsApp Image 2026-10-15 at 3.00.48 PM.jpeg */}
          <div className="p-3.5 rounded-2xl bg-[#F0F7FF] border border-[#DBEAFE] space-y-1">
            <div className="flex items-center gap-2 text-[#005A9C]">
              <Headphones className="w-4 h-4 shrink-0 text-[#005A9C]" />
              <span className="text-xs font-bold text-[#0A192F]">Need Help?</span>
            </div>
            <p className="text-[11px] text-[#475569] leading-tight font-medium">support@thelawkaksha.in</p>
            <p className="text-[10px] text-[#64748B] leading-tight">or DM us on Instagram</p>
          </div>

          {/* Compact User info & Logout */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#005A9C] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                {initials}
              </div>
              <span className="text-xs font-bold text-[#0A192F] truncate">
                {studentName.split(" ")[0]}
              </span>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
