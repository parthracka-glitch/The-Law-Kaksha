"use client";

import React, { useMemo } from "react";
import { ArrowRight } from "lucide-react";

interface StudentHeroCardProps {
  studentName?: string;
  lastReadTitle?: string;
  lastReadSubtitle?: string;
  onContinueLearning: () => void;
}

export function StudentHeroCard({
  studentName = "Student",
  onContinueLearning,
}: StudentHeroCardProps) {
  // Determine greeting based on current local hour
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  // Format student name cleanly (e.g. "Administrator Parth" -> "Parth", default "Student")
  const displayName = useMemo(() => {
    if (!studentName || studentName.toLowerCase() === "user") {
      return "Student";
    }
    const cleaned = studentName.replace(/^administrator\s+/i, "").trim();
    const firstName = cleaned.split(" ")[0];
    return firstName || cleaned || "Student";
  }, [studentName]);

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#EFF4FE] via-[#E7F0FD] to-[#DDE8FD] border border-[#D0DEF8] p-5 sm:p-7 md:px-8 md:py-6 shadow-[0_4px_20px_rgba(30,58,138,0.05)] text-[#13264F]">
      {/* Subtle ambient light glows (hidden on low-spec mobile to save GPU fill-rate) */}
      <div className="hidden sm:block absolute -top-12 -right-12 w-56 h-56 rounded-full bg-blue-300/20 blur-xl pointer-events-none" />
      <div className="hidden sm:block absolute -bottom-10 left-1/4 w-60 h-60 rounded-full bg-indigo-200/25 blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side: Greeting & CTA */}
        <div className="max-w-md space-y-2.5 sm:space-y-3">
          {/* Headline with Sun Emoji */}
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl md:text-[28px] font-extrabold tracking-tight text-[#111827] leading-tight">
              {greeting}, {displayName}!
            </h2>
            <span className="text-xl sm:text-2xl inline-block select-none animate-pulse" role="img" aria-label="sun">
              ☀️
            </span>
          </div>

          {/* Subtitle matching exact template */}
          <p className="text-xs sm:text-sm text-[#5B6B8A] leading-relaxed font-normal">
            Keep going! Your hard work today builds a brighter future tomorrow.
          </p>

          {/* CTA Pill Button */}
          <div className="pt-2 sm:pt-3">
            <button
              onClick={onContinueLearning}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#3558F0] hover:bg-[#2546D8] active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-[0_4px_14px_rgba(53,88,240,0.35)] transition-all cursor-pointer group"
            >
              <span>Continue Learning</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Right Side: Exact Vector Study Illustration Matching Screenshot */}
        <div className="relative self-center md:self-auto shrink-0 w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px] lg:max-w-[480px] h-[130px] sm:h-[155px] md:h-[170px] flex items-center justify-center">
          <svg
            viewBox="0 0 460 170"
            className="w-full h-full select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Soft table / desk shadow base */}
            <ellipse cx="210" cy="158" rx="170" ry="8" fill="#D3E0FA" opacity="0.6" />

            {/* ========================================================= */}
            {/* 1. POTTED PLANT (LEFT OF LAPTOP)                         */}
            {/* ========================================================= */}
            <g id="potted-plant">
              {/* Pot */}
              <path d="M52 130 L68 130 L65 154 L55 154 Z" fill="#9FB5ED" />
              <ellipse cx="60" cy="130" rx="8" ry="2.5" fill="#809CE6" />
              {/* Leaves */}
              <path d="M60 130 C55 114 45 104 36 100 C45 110 55 120 60 130 Z" fill="#2E995B" />
              <path d="M60 128 C57 110 54 94 60 82 C65 94 65 110 60 128 Z" fill="#42B872" />
              <path d="M60 130 C64 115 75 106 84 102 C77 112 69 122 60 130 Z" fill="#38A169" />
              <path d="M60 116 C51 106 47 96 49 89 C55 95 60 105 60 116 Z" fill="#58D18C" />
              <path d="M60 116 C66 107 73 99 76 93 C73 101 67 109 60 116 Z" fill="#42B872" />
            </g>

            {/* ========================================================= */}
            {/* 2. GIRL STUDENT (CENTER)                                 */}
            {/* ========================================================= */}
            <g id="student-character">
              {/* Yellow Hoodie Body */}
              <path
                d="M130 156 C124 126 132 106 146 96 C155 90 170 90 179 96 C193 106 201 126 195 156 Z"
                fill="#FBBF24"
              />
              {/* Hoodie Collar & Drawstrings */}
              <path
                d="M148 98 Q162 112 176 98"
                fill="none"
                stroke="#D97706"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path d="M157 105 L155 120 M168 105 L170 120" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />

              {/* Neck */}
              <rect x="157" y="87" width="10" height="11" rx="4" fill="#FBD5B5" />

              {/* Head / Face */}
              <ellipse cx="162" cy="74" rx="17" ry="19" fill="#FBD5B5" />

              {/* Dark Navy Hair */}
              <path
                d="M141 76 C138 52 152 42 166 42 C182 42 189 54 186 78 C180 66 173 60 162 60 C151 60 144 66 141 76 Z"
                fill="#1C1E33"
              />
              {/* Side strands falling over shoulders */}
              <path d="M138 72 C135 94 139 122 144 130 C146 122 144 90 146 76 Z" fill="#1C1E33" />
              <path d="M186 72 C189 94 185 122 180 130 C178 122 180 90 178 76 Z" fill="#1C1E33" />

              {/* Facial features */}
              <ellipse cx="155" cy="73" rx="2" ry="2.2" fill="#1C1E33" />
              <ellipse cx="169" cy="73" rx="2" ry="2.2" fill="#1C1E33" />
              <path d="M152 68 Q155 66 158 68" stroke="#1C1E33" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path d="M166 68 Q169 66 172 68" stroke="#1C1E33" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path d="M159 82 Q162 86 165 82" stroke="#B91C1C" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              <ellipse cx="151" cy="78" rx="3.5" ry="2" fill="#F87171" opacity="0.45" />
              <ellipse cx="173" cy="78" rx="3.5" ry="2" fill="#F87171" opacity="0.45" />

              {/* Lavender / Blue Headphones */}
              <path d="M141 73 C138 46 186 46 183 73" fill="none" stroke="#818CF8" strokeWidth="4.5" strokeLinecap="round" />
              <rect x="137" y="67" width="7.5" height="17" rx="3.75" fill="#6366F1" />
              <rect x="139" y="70" width="3.5" height="11" rx="1.75" fill="#A5B4FC" />
              <rect x="180" y="67" width="7.5" height="17" rx="3.75" fill="#6366F1" />
              <rect x="182" y="70" width="3.5" height="11" rx="1.75" fill="#A5B4FC" />

              {/* Arms & Hands Typing */}
              <path d="M141 144 Q154 138 163 141" stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" />
              <path d="M184 144 Q171 138 162 141" stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" />
              <ellipse cx="158" cy="142" rx="4.5" ry="3" fill="#FBD5B5" />
              <ellipse cx="166" cy="142" rx="4.5" ry="3" fill="#FBD5B5" />
            </g>

            {/* ========================================================= */}
            {/* 3. LAPTOP (DESK FRONT)                                   */}
            {/* ========================================================= */}
            <g id="laptop">
              {/* Screen / Back Cover */}
              <polygon points="132,118 192,118 188,148 136,148" fill="#1E293B" />
              {/* Apple-style circular emblem */}
              <circle cx="162" cy="133" r="3" fill="#60A5FA" opacity="0.95" />
              {/* Keyboard base */}
              <polygon points="126,148 198,148 204,154 120,154" fill="#94A3B8" />
              <polygon points="138,149 186,149 188,152 136,152" fill="#475569" />
            </g>

            {/* ========================================================= */}
            {/* 4. STACK OF 3 BOOKS (RIGHT OF LAPTOP)                    */}
            {/* ========================================================= */}
            <g id="book-stack">
              {/* Bottom Book: Royal Blue */}
              <rect x="225" y="140" width="65" height="13" rx="2" fill="#2563EB" />
              <rect x="228" y="142" width="60" height="9" fill="#FFFFFF" />
              <rect x="225" y="140" width="6" height="13" rx="1.5" fill="#1D4ED8" />
              {/* Red Ribbon Bookmark */}
              <path d="M272 151 L272 158 L275 155 L278 158 L278 151 Z" fill="#EF4444" />

              {/* Middle Book: Sky Blue */}
              <rect x="230" y="127" width="58" height="12" rx="2" fill="#3B82F6" />
              <rect x="233" y="129" width="53" height="8" fill="#FFFFFF" />
              <rect x="230" y="127" width="5" height="12" rx="1.5" fill="#2563EB" />

              {/* Top Book: Periwinkle */}
              <rect x="236" y="114" width="50" height="12" rx="2" fill="#60A5FA" />
              <rect x="239" y="116" width="45" height="8" fill="#FFFFFF" />
              <rect x="236" y="114" width="5" height="12" rx="1.5" fill="#3B82F6" />
            </g>

            {/* ========================================================= */}
            {/* 5. HANDWRITTEN MOTIVATIONAL SCRIPT & HEART (FAR RIGHT)    */}
            {/* ========================================================= */}
            <g transform="rotate(-8 375 75)" fill="#4361EE" style={{ fontFamily: "'Caveat', 'Dancing Script', 'Brush Script MT', cursive" }}>
              <text x="365" y="44" fontSize="26" fontWeight="700" letterSpacing="0.5">
                Learn
              </text>
              <text x="357" y="74" fontSize="26" fontWeight="700" letterSpacing="0.5">
                Anytime
              </text>
              <text x="355" y="104" fontSize="26" fontWeight="700" letterSpacing="0.5">
                Anywhere
              </text>

              {/* Underline Dash & Cute Hand-drawn Heart */}
              <path d="M358 120 Q370 122 380 120" stroke="#4361EE" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              <path
                d="M394 116 C390 110 382 111 384 119 C386 125 394 130 394 130 C394 130 402 125 404 119 C406 111 398 110 394 116 Z"
                fill="none"
                stroke="#4361EE"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
