"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Application Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="max-w-md w-full text-center space-y-6 bg-white rounded-3xl border border-[#E7E4E7] p-8 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-[#F4C5C0]/40 flex items-center justify-center text-[#C35F3B] mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-widest text-[#C35F3B] uppercase">Academic Portal Notice</span>
            <h1 className="text-2xl font-serif font-bold text-[#221D1D]">Something went wrong</h1>
            <p className="text-xs text-[#77716E] leading-relaxed">
              An unexpected issue occurred while rendering this learning resource. Your notes and session progress remain safe.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="px-5 py-3 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-semibold shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Action</span>
            </button>
            <Link
              href="/"
              className="px-5 py-3 rounded-full border border-[#E7E4E7] hover:bg-[#F7F7F5] text-[#221D1D] text-xs font-semibold transition flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4 text-[#77716E]" />
              <span>Go to Home</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="text-center py-3 text-xs text-[#77716E]">
        The Law कक्षा • Academic Learning Space
      </footer>
    </div>
  );
}
