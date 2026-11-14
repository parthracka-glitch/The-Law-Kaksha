"use client";

import React from "react";
import { Home, BookOpen, Bookmark, CheckSquare, User } from "lucide-react";

export type StudentMobileNavTab = "home" | "courses" | "bookmarks" | "progress" | "profile";

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
  const tabs = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "courses" as const, label: "Courses", icon: BookOpen },
    { id: "bookmarks" as const, label: "Bookmarks", icon: Bookmark },
    { id: "progress" as const, label: "Progress", icon: CheckSquare },
    { id: "profile" as const, label: "Profile", icon: User },
  ];

  return (
    <nav
      aria-label="Student Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E7ECF7] shadow-[0_-4px_25px_rgba(15,37,87,0.08)] lg:hidden transition-all pb-[max(0.45rem,env(safe-area-inset-bottom,0.45rem))] select-none"
    >
      <div className="max-w-md mx-auto px-2 py-1 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (tab.id === "profile") {
                  onChangeTab("profile");
                  onOpenProfile();
                } else {
                  onChangeTab(tab.id);
                }
              }}
              className={`flex-1 flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 px-1 rounded-xl transition-all cursor-pointer touch-manipulation active:scale-95 ${
                isActive ? "text-[#005A9C] font-bold" : "text-[#64748B] hover:text-[#0F2557] font-medium"
              }`}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="relative flex items-center justify-center">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110 text-[#005A9C]" : "text-[#64748B]"}`} />
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#005A9C] shadow-xs" />
                )}
              </div>
              <span className={`text-[10px] leading-tight mt-1 truncate ${isActive ? "font-bold text-[#005A9C]" : "text-[#64748B]"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
