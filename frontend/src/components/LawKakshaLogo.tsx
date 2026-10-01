import React from "react";
import Image from "next/image";

export interface LawKakshaLogoProps {
  variant?: "light" | "dark" | "white";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showTagline?: boolean;
  priority?: boolean;
}

const SIZE_MAP = {
  xs: { height: 26, width: 43, imgClass: "h-6.5 w-auto" },
  sm: { height: 32, width: 53, imgClass: "h-8 w-auto" },
  md: { height: 42, width: 69, imgClass: "h-10 sm:h-11 w-auto" },
  lg: { height: 52, width: 85, imgClass: "h-12 sm:h-13 w-auto" },
  xl: { height: 68, width: 112, imgClass: "h-16 sm:h-18 w-auto" },
};

export function LawKakshaLogo({
  variant = "light",
  size = "md",
  className = "",
  showTagline = false,
  priority = true,
}: LawKakshaLogoProps) {
  const isDark = variant === "dark";
  const isWhite = variant === "white";

  const logoSrc = isWhite
    ? "/images/logo-white.png"
    : isDark
    ? "/images/logo-dark.png"
    : "/assets/logo law kaskah .png";

  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <div
      className={`inline-flex items-center gap-3 select-none transition-transform duration-200 hover:scale-[1.02] ${className}`}
      title="The Law कक्षा - Premier CA Law Academy"
    >
      <div className="relative flex items-center justify-center shrink-0">
        <Image
          src={logoSrc}
          alt="The Law कक्षा - Premier CA Law Academy"
          width={849}
          height={517}
          className={`${sizeConfig.imgClass} object-contain`}
          priority={priority}
        />
      </div>

      {showTagline && (
        <div
          className={`hidden sm:flex flex-col justify-center border-l pl-2.5 leading-tight ${
            isDark ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-600"
          }`}
        >
          <span
            className={`text-[9.5px] font-bold tracking-wider uppercase font-serif ${
              isDark ? "text-sky-300" : "text-[#0284C7]"
            }`}
          >
            Premier CA Law
          </span>
          <span className="text-[8.5px] font-medium tracking-tight text-slate-400">
            Academy
          </span>
        </div>
      )}
    </div>
  );
}

