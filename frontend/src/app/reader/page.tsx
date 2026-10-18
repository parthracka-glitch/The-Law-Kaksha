import React, { Suspense } from "react";
import ReaderClient from "./ReaderClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Study Reader | The Law Kaksha DRM Codex",
  description: "Proprietary statutory study codex with in-web DRM protection.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ReaderPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-[#111418] flex flex-col items-center justify-center text-white space-y-3 select-none">
          <div className="w-8 h-8 rounded-full border-2 border-[#BFAFE5] border-t-transparent animate-spin" />
          <p className="text-xs text-neutral-400 font-mono tracking-wider">
            Initializing Protected Codex...
          </p>
        </div>
      }
    >
      <ReaderClient />
    </Suspense>
  );
}
