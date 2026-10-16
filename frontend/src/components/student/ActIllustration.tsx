import React from "react";

interface ActIllustrationProps {
  type: "contract" | "soga" | "partnership" | "llp" | "companies" | "ni";
  className?: string;
}

export function ActIllustration({ type, className = "w-16 h-16" }: ActIllustrationProps) {
  switch (type) {
    case "contract":
      // Stack of 3 isometric blue books
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Bottom Book */}
          <path d="M22 66 L55 52 L82 64 L48 78 Z" fill="#2563EB" />
          <path d="M22 66 L48 78 L48 84 L22 72 Z" fill="#1D4ED8" />
          <path d="M48 78 L82 64 L82 70 L48 84 Z" fill="#1E40AF" />
          <path d="M25 67 L48 76 L80 64" stroke="#93C5FD" strokeWidth="1.5" />
          {/* Middle Book */}
          <path d="M20 52 L53 38 L80 50 L46 64 Z" fill="#3B82F6" />
          <path d="M20 52 L46 64 L46 70 L20 58 Z" fill="#2563EB" />
          <path d="M46 64 L80 50 L80 56 L46 70 Z" fill="#1D4ED8" />
          <path d="M23 53 L46 62 L78 50" stroke="#BFDBFE" strokeWidth="1.5" />
          {/* Top Book */}
          <path d="M18 38 L51 24 L78 36 L44 50 Z" fill="#60A5FA" />
          <path d="M18 38 L44 50 L44 56 L18 44 Z" fill="#3B82F6" />
          <path d="M44 50 L78 36 L78 42 L44 56 Z" fill="#2563EB" />
          <path d="M21 39 L44 48 L76 36" stroke="#DBEAFE" strokeWidth="1.5" />
          {/* Bookmark Ribbon */}
          <path d="M42 27 L42 42 L46 39 L50 42 L50 24" fill="#F59E0B" />
        </svg>
      );

    case "soga":
      // Cardboard Delivery Box with Tape (Exact match to SOGA box in screenshot)
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Box Body Top */}
          <path d="M16 38 L50 20 L84 38 L50 56 Z" fill="#E8B878" stroke="#78350F" strokeWidth="2" strokeLinejoin="round" />
          {/* Box Body Left Face */}
          <path d="M16 38 L50 56 L50 82 L16 64 Z" fill="#D29A57" stroke="#78350F" strokeWidth="2" strokeLinejoin="round" />
          {/* Box Body Right Face */}
          <path d="M50 56 L84 38 L84 64 L50 82 Z" fill="#B9803C" stroke="#78350F" strokeWidth="2" strokeLinejoin="round" />
          {/* Sealing Tape across Top Flaps */}
          <path d="M45 22 L45 53 L55 58 L55 28 Z" fill="#FCD34D" stroke="#D97706" strokeWidth="1" opacity="0.85" />
          {/* Front Tape line */}
          <path d="M46 54 L46 76 L54 80 L54 58 Z" fill="#FCD34D" stroke="#D97706" strokeWidth="1" opacity="0.85" />
        </svg>
      );

    case "partnership":
      // Handshake icon with sleeves (Exact match to Partnership in screenshot)
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Left Sleeve */}
          <path d="M14 42 L28 36 L34 52 L20 58 Z" fill="#1D4ED8" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round" />
          <path d="M28 36 L32 34 L36 49 L32 51 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
          {/* Right Sleeve */}
          <path d="M86 42 L72 36 L66 52 L80 58 Z" fill="#1D4ED8" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round" />
          <path d="M72 36 L68 34 L64 49 L68 51 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
          {/* Hands Interlocked */}
          <path
            d="M32 45 L42 40 C46 38 52 40 54 44 L58 48 C60 50 60 54 57 56 L46 64 C43 66 38 65 35 62 L30 55 C28 52 29 47 32 45 Z"
            fill="#FBBF24"
            stroke="#0F172A"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M68 45 L58 40 C54 38 48 40 46 44 L42 48 C40 50 40 54 43 56 L54 64 C57 66 62 65 65 62 L70 55 C72 52 71 47 68 45 Z"
            fill="#F59E0B"
            stroke="#0F172A"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Fingers definition */}
          <path d="M46 51 C48 54 53 53 55 50" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M49 55 C51 58 56 57 58 54" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M52 59 C54 62 59 61 61 58" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case "llp":
      // LLP document papers with stamp (Exact match to LLP in screenshot)
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Back Paper */}
          <rect x="36" y="22" width="40" height="54" rx="4" fill="#F1F5F9" stroke="#334155" strokeWidth="2" transform="rotate(12 36 22)" />
          {/* Front Paper with "LLP" title */}
          <rect x="22" y="24" width="42" height="56" rx="4" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          {/* Folded Top Right Corner */}
          <path d="M54 24 L64 34 L54 34 Z" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1.5" />
          {/* "LLP" Label */}
          <text x="32" y="44" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#0284C7">
            LLP
          </text>
          {/* Text lines */}
          <path d="M30 50 L56 50" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <path d="M30 56 L52 56" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <path d="M30 62 L48 62" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          {/* Red Stamp badge */}
          <circle cx="52" cy="66" r="6" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" />
          <path d="M49 66 L51 68 L55 64" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "companies":
      // Courthouse / Pillars building (Exact match to Companies in screenshot)
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Roof Pediment / Triangle */}
          <path d="M18 36 L50 18 L82 36 Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" strokeLinejoin="round" />
          <rect x="20" y="36" width="60" height="6" rx="1" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
          {/* Columns */}
          <rect x="26" y="44" width="7" height="30" rx="1.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
          <rect x="39" y="44" width="7" height="30" rx="1.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
          <rect x="54" y="44" width="7" height="30" rx="1.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
          <rect x="67" y="44" width="7" height="30" rx="1.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
          {/* Base Steps */}
          <rect x="20" y="74" width="60" height="5" rx="1" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
          <rect x="15" y="79" width="70" height="6" rx="1.5" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
        </svg>
      );

    case "ni":
      // Cheque & Fountain Pen (Exact match to Negotiable Instruments in screenshot)
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cheque slip */}
          <rect x="16" y="34" width="58" height="38" rx="3" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
          <line x1="22" y1="42" x2="44" y2="42" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="50" x2="62" y2="50" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="22" y1="58" x2="52" y2="58" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="56" y="38" width="12" height="10" rx="1" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
          {/* Fountain Pen tilted */}
          <g transform="rotate(-35 70 35)">
            <rect x="65" y="10" width="7" height="42" rx="2" fill="#0284C7" stroke="#0F172A" strokeWidth="1.5" />
            <path d="M65 52 L68.5 62 L72 52 Z" fill="#F59E0B" stroke="#0F172A" strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="68.5" cy="56" r="0.8" fill="#0F172A" />
            <line x1="68.5" y1="56" x2="68.5" y2="62" stroke="#0F172A" strokeWidth="1" />
          </g>
        </svg>
      );

    default:
      return null;
  }
}
