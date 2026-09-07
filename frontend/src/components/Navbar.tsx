"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  User,
  Menu,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { LawKakshaLogo } from "./LawKakshaLogo";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItemCount, setIsCartOpen } = useCart();

  const [activeStudent, setActiveStudent] = useState<{ name: string; avatarInitials: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);

    // Check active student session
    const checkSession = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("lawkaksha_active_student");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.name) {
              setActiveStudent({
                name: parsed.name,
                avatarInitials: parsed.avatarInitials || parsed.name.slice(0, 2).toUpperCase(),
              });
              return;
            }
          } catch (e) {}
        }
        setActiveStudent(null);
      }
    };

    checkSession();
    window.addEventListener("storage", checkSession);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkSession);
    };
  }, []);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-sky-50/80 text-slate-700 text-xs py-1.5 px-4 border-b border-sky-100 flex items-center justify-center gap-2 text-center">
        <span className="inline-flex items-center gap-1 text-[#0284C7] font-semibold text-[11px]">
          <Sparkles className="w-3 h-3 text-[#0284C7]" /> ICAI 2026-2027 Scheme:
        </span>
        <span className="text-slate-600 text-[11px]">
          CA Foundation, Inter &amp; Final Law Reviewers with 9-Attempt Solved RTPs/MTPs
        </span>
        <span className="hidden sm:inline text-slate-400 font-mono">•</span>
        <span className="hidden sm:inline text-[#0284C7] font-medium text-[11px]">
          Use code <strong>CALAW20</strong> for 20% Off
        </span>
      </div>

      {/* Clean Header Bar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled
            ? "py-3 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/80"
            : "py-3.5 bg-white border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center">
            <LawKakshaLogo variant="light" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-6 text-xs lg:text-sm font-medium text-slate-600">
            <Link
              href="#pricing"
              className="px-2 py-1 hover:text-[#0284C7] transition-colors"
            >
              2-Volume CA Books &amp; Courses
            </Link>
            <Link
              href="#testimonials"
              className="px-2 py-1 hover:text-[#0284C7] transition-colors"
            >
              CA Rankers
            </Link>
            <Link
              href="#faqs"
              className="px-2 py-1 hover:text-[#0284C7] transition-colors"
            >
              FAQs
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-xl hover:bg-sky-50 text-slate-700 hover:text-[#0284C7] transition-colors relative border border-slate-200 bg-white"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0284C7] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* Student Portal CTA (Dynamic depending on login status) */}
            {activeStudent ? (
              <Link
                href="/student"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sky-50 border border-sky-200 hover:border-[#0284C7] text-slate-900 text-xs font-semibold shadow-2xs transition-all group"
              >
                <div className="w-6 h-6 rounded-lg bg-[#0284C7] text-white flex items-center justify-center font-bold text-[10px]">
                  {activeStudent.avatarInitials}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 max-w-[100px] truncate">
                    {activeStudent.name.split(" ")[0]}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#0284C7] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : (
              <Link
                href="/student"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <span>CA Student Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150">
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-[#0284C7] rounded-lg"
            >
              2-Volume CA Books &amp; Subscriptions
            </Link>
            <Link
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-[#0284C7] rounded-lg"
            >
              CA All-India Rankers
            </Link>
            <Link
              href="#faqs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-[#0284C7] rounded-lg"
            >
              Frequently Asked Questions
            </Link>
            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/student"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold"
              >
                <span>Enter CA Student Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
