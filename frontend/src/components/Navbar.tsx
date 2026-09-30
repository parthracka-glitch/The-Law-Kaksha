"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  User,
  Menu,
  X,
  ArrowRight,
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
      setScrolled(window.scrollY > 12);
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
      {/* Apple-Style Frosted Minimal Header Bar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "py-2.5 bg-white/80 backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border-b border-black/[0.06]"
            : "py-3 bg-white/95 backdrop-blur-md border-b border-black/[0.04]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center transition-opacity hover:opacity-90">
            <LawKakshaLogo variant="light" size="md" />
          </Link>

          {/* Desktop Navigation Links - Apple Precision Hierarchy */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-7 text-[13px] font-normal tracking-[-0.01em] text-[#1D1D1F]/80">
            <Link
              href="/courses"
              className="px-2 py-1 rounded-full hover:text-[#0071E3] transition-colors"
            >
              Courses &amp; Books
            </Link>
            <Link
              href="/about"
              className="px-2 py-1 rounded-full hover:text-[#0071E3] transition-colors"
            >
              About Faculty
            </Link>
            <Link
              href="/reviews"
              className="px-2 py-1 rounded-full hover:text-[#0071E3] transition-colors"
            >
              CA Rankers
            </Link>
            <Link
              href="/contact"
              className="px-2 py-1 rounded-full hover:text-[#0071E3] transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Minimal Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-full hover:bg-black/[0.04] text-[#1D1D1F] transition-all relative border border-black/[0.08] bg-white/80 active:scale-95 cursor-pointer"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4 stroke-[1.75]" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0071E3] text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* Student Portal CTA (Apple Pill Style) */}
            {activeStudent ? (
              <Link
                href="/student"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.04] border border-black/[0.08] hover:border-black/[0.15] text-[#1D1D1F] text-xs font-medium transition-all duration-200 active:scale-95 group"
              >
                <div className="w-5 h-5 rounded-full bg-[#0071E3] text-white flex items-center justify-center font-semibold text-[10px]">
                  {activeStudent.avatarInitials}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-[#1D1D1F] max-w-[90px] truncate">
                    {activeStudent.name.split(" ")[0]}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#0071E3] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : (
              <Link
                href="/student"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1D1D1F] hover:bg-[#2D2D2F] text-white text-xs font-medium shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all duration-200 active:scale-95"
              >
                <span>CA Student Portal</span>
                <ArrowRight className="w-3 h-3 text-white/80" />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-slate-700 hover:text-slate-900 hover:bg-black/[0.04] transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-black/[0.06] bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
            <Link
              href="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2 text-sm font-medium text-[#1D1D1F] hover:bg-black/[0.04] rounded-xl transition-colors"
            >
              Courses &amp; Books
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2 text-sm font-medium text-[#1D1D1F] hover:bg-black/[0.04] rounded-xl transition-colors"
            >
              About Faculty
            </Link>
            <Link
              href="/reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2 text-sm font-medium text-[#1D1D1F] hover:bg-black/[0.04] rounded-xl transition-colors"
            >
              CA All-India Rankers
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2 text-sm font-medium text-[#1D1D1F] hover:bg-black/[0.04] rounded-xl transition-colors"
            >
              Contact &amp; Support
            </Link>
            <div className="pt-2.5 border-t border-black/[0.06]">
              <Link
                href="/student"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#1D1D1F] text-white text-xs font-medium shadow-sm active:scale-95 transition-all"
              >
                <span>Enter CA Student Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
