import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AboutInteractiveView } from "@/components/AboutInteractiveView";
import { Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About Us | The Law कक्षा - Learn. Practise. Excel.",
  description: "Learn about the educational methodology, 3-step answer writing blueprint, and mission behind The Law कक्षा for CA Foundation Business Laws.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F7FF]/50 via-white to-[#F0F7FF]/30 flex flex-col justify-between text-[#0A192F] font-sans selection:bg-[#005A9C] selection:text-white">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Floating breadcrumb / badge */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#005A9C] transition-colors"
          >
            ← Back to Home
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-[#005A9C] bg-[#EFF6FF] px-3 py-1 rounded-full border border-[#BFDBFE]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Guide</span>
          </div>
        </div>

        {/* The Premium Interactive About View */}
        <AboutInteractiveView />
      </main>

      <Footer />
    </div>
  );
}

