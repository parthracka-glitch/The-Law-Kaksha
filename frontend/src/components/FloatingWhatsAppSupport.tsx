"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

export function FloatingWhatsAppSupport() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const dismissed = localStorage.getItem("lawkaksha_wa_dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
    }
  }, []);

  if (!isClient) return null;

  const phoneNumber = "919172204870";
  const defaultMessage = encodeURIComponent(
    "Hi The Law Kaksha, I am preparing for CA Foundation / CSEET 2026. Can you guide me regarding syllabus updates and the study pass?"
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  if (isDismissed) {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Academic Counselor on WhatsApp"
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
        title="Chat with Academic Counselor on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
      </a>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 bg-white hover:bg-slate-50 border border-emerald-500/40 rounded-full py-2.5 px-4 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
        title="Chat with Academic Counselor on WhatsApp"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
          <MessageCircle className="w-5 h-5 fill-current" />
        </div>
        <div className="text-left pr-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Academic Helpdesk
            </span>
          </div>
          <p className="text-xs font-bold text-[#0A192F] leading-tight">
            Chat with Counselor
          </p>
        </div>
      </a>
      <button
        type="button"
        onClick={() => {
          setIsDismissed(true);
          try {
            localStorage.setItem("lawkaksha_wa_dismissed", "true");
          } catch (_) {}
        }}
        className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center shadow-sm cursor-pointer transition-colors"
        aria-label="Minimize WhatsApp button"
        title="Minimize"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
