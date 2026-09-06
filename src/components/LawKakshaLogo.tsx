import React from "react";
import { BookCheck, Building2 } from "lucide-react";

interface LawKakshaLogoProps {
  variant?: "light" | "dark";
  className?: string;
}

export function LawKakshaLogo({
  variant = "light",
  className = "",
}: LawKakshaLogoProps) {
  const isDarkBg = variant === "dark";

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 text-[#0284C7] shrink-0">
        <Building2 className="w-4 h-4 text-[#0284C7] stroke-[2.2]" />
      </div>
      <div className="flex flex-col leading-tight">
        <span
          className={`font-serif font-bold text-base sm:text-lg tracking-tight ${
            isDarkBg ? "text-white" : "text-slate-900"
          }`}
        >
          The Law Kaksha
        </span>
        <span
          className={`text-[9.5px] font-semibold tracking-wider uppercase ${
            isDarkBg ? "text-sky-300" : "text-[#0284C7]"
          }`}
        >
          Premier CA Law Academy
        </span>
      </div>
    </div>
  );
}
