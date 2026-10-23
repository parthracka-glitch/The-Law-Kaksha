"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingBag, Menu, X, ChevronDown, BookOpen, GraduationCap, ArrowRight, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { apiRequest } from "@/lib/api";
import { AnnouncementBar } from "./AnnouncementBar";

interface NavbarCatalogItem {
  id: string;
  title: string;
  subtitle?: string;
  examBody?: string;
  category?: string;
  type?: string;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStudent, setActiveStudent] = useState<{
    name: string;
    email?: string;
    avatarInitials: string;
    role?: string;
  } | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [catalogItems, setCatalogItems] = useState<NavbarCatalogItem[]>([]);

  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const { totalItemCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCoursesDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    const checkSession = () => {
      if (typeof window !== "undefined") {
        const adminSession = localStorage.getItem("lawkaksha_admin_session");
        if (adminSession) {
          try {
            const parsed = JSON.parse(adminSession);
            if (parsed && (parsed.name || parsed.role === "admin")) {
              setActiveStudent({
                name: parsed.name || "Administrator",
                email: parsed.email || "admin@thelawkaksha.com",
                avatarInitials: "AD",
                role: "admin",
              });
              return;
            }
          } catch {}
        }
        const saved = localStorage.getItem("lawkaksha_active_student") || localStorage.getItem("lawkaksha_student_session");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.name) {
              const initials =
                parsed.avatarInitials ||
                (parsed.name
                  ? parsed.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "LK");
              setActiveStudent({
                name: parsed.name,
                email: parsed.email || "",
                avatarInitials: initials,
                role: "student",
              });
              return;
            }
          } catch {}
        }
        setActiveStudent(null);
      }
    };

    checkSession();
    window.addEventListener("storage", checkSession);
    window.addEventListener("lawkaksha_student_updated", checkSession);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("storage", checkSession);
      window.removeEventListener("lawkaksha_student_updated", checkSession);
    };
  }, []);

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    const closeTimer = window.setTimeout(() => {
      setMobileMenuOpen(false);
      setCoursesDropdownOpen(false);
      setProfileDropdownOpen(false);
    }, 0);
    return () => window.clearTimeout(closeTimer);
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    apiRequest<{ products?: NavbarCatalogItem[]; items?: NavbarCatalogItem[] }>("/api/catalog")
      .then((res) => {
        if (cancelled || !res.success) return;
        const items = res.data?.products || res.data?.items;
        if (Array.isArray(items)) setCatalogItems(items.slice(0, 4));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("lawkaksha_admin_session");
      localStorage.removeItem("lawkaksha_student_session");
      localStorage.removeItem("lawkaksha_active_student");
      localStorage.removeItem("lawkaksha_token");
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("lawkaksha_student_updated"));
    }
    setActiveStudent(null);
    setProfileDropdownOpen(false);
    router.push("/");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/student?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <header
          className={`transition-all duration-300 ${
            scrolled
              ? "py-3 bg-white/95 backdrop-blur-md shadow-[0_4px_24px_rgba(10,25,47,0.06)] border-b border-[#DBEAFE]"
              : "py-3.5 sm:py-4 bg-white border-b border-[#DBEAFE]/80"
          }`}
        >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Official Brand Logo */}
          <Link href="/" className="flex items-center transition-all duration-200 hover:opacity-90 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9C] rounded-lg">
            <div className="relative h-10 w-36 sm:h-11 sm:w-44 flex items-center">
              <Image
                src="/assets/logo-transparent.png"
                alt="The Law कक्षा - CA Foundation & CSEET Law Academy"
                fill
                sizes="(max-width: 640px) 144px, 176px"
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-[15px] font-medium text-[#334155]">
            {/* Home */}
            <div className="relative py-1 flex flex-col items-center">
              <Link
                href="/"
                className={`transition-colors duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9C] ${
                  pathname === "/" ? "text-[#0A192F] font-bold" : "text-[#334155] hover:text-[#005A9C]"
                }`}
              >
                Home
              </Link>
              {pathname === "/" && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#005A9C] rounded-full" />
              )}
            </div>

            {/* Courses & Notes Dropdown */}
            <div
              ref={dropdownRef}
              className="relative py-1 flex items-center"
              onMouseEnter={() => setCoursesDropdownOpen(true)}
              onMouseLeave={() => setCoursesDropdownOpen(false)}
            >
              <Link
                href="/courses"
                className={`flex items-center gap-1.5 transition-colors duration-200 cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9C] ${
                  pathname.startsWith("/courses") || pathname.startsWith("/product")
                    ? "text-[#0A192F] font-bold"
                    : "text-[#334155] hover:text-[#005A9C]"
                }`}
              >
                <span>Courses &amp; Notes</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${
                    coursesDropdownOpen ? "rotate-180 text-[#005A9C]" : ""
                  }`}
                />
              </Link>

              {(pathname.startsWith("/courses") || pathname.startsWith("/product")) && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#005A9C] rounded-full" />
              )}

              {/* Dropdown Menu */}
              {coursesDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-88 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="bg-white rounded-2xl shadow-[0_16px_40px_rgba(10,25,47,0.12)] border border-[#DBEAFE] p-2 space-y-1">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#64748B] flex items-center justify-between">
                      <span>Curriculum &amp; Notes ({catalogItems.length})</span>
                      <span className="text-[10px] text-[#8C6D1F] font-bold bg-[#FDF8E8] border border-[#E8D8A6] px-2 py-0.5 rounded-full">Live</span>
                    </div>

                    {catalogItems.length === 0 ? (
                      <div className="px-3 py-4 text-center text-xs text-[#64748B]">
                        No courses published yet.
                      </div>
                    ) : (
                      catalogItems.map((item) => (
                        <Link
                          key={item.id}
                          href={`/product/${item.id}`}
                          onClick={() => setCoursesDropdownOpen(false)}
                          className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F0F7FF] transition-all border border-transparent hover:border-[#DBEAFE] active:scale-[0.98]"
                        >
                          <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#005A9C] flex items-center justify-center shrink-0 group-hover:bg-[#005A9C] group-hover:text-white transition-colors mt-0.5 shadow-2xs">
                            {item.category === "CSEET" ? (
                              <GraduationCap className="w-4.5 h-4.5" />
                            ) : (
                              <BookOpen className="w-4.5 h-4.5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-bold text-[#0A192F] group-hover:text-[#005A9C] transition-colors line-clamp-1">
                                {item.title}
                              </span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE] shrink-0">
                                {item.examBody || item.category || "Course"}
                              </span>
                            </div>
                            <p className="text-xs text-[#64748B] line-clamp-1 mt-0.5">
                              {item.subtitle || item.type || "Study notes & question bank"}
                            </p>
                          </div>
                        </Link>
                      ))
                    )}

                    <div className="pt-2 border-t border-[#DBEAFE] px-3 py-1.5 flex items-center justify-between text-[11px] text-[#64748B]">
                      <span>Online PDF Reading Vault</span>
                      <Link
                        href="/courses"
                        onClick={() => setCoursesDropdownOpen(false)}
                        className="text-[#005A9C] font-bold hover:text-[#004F8A] flex items-center gap-1 transition-colors"
                      >
                        <span>View Catalog</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Free Resources */}
            <div className="relative py-1 flex flex-col items-center">
              <Link
                href="/#free-resources"
                onClick={(e) => {
                  if (pathname === "/") {
                    e.preventDefault();
                    const el = document.getElementById("free-resources");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                      window.history.pushState(null, "", "/#free-resources");
                    }
                  }
                }}
                className="text-[#334155] hover:text-[#005A9C] font-semibold transition-colors duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9C] flex items-center gap-1.5"
              >
                <span>Free Resources</span>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                  PDF
                </span>
              </Link>
            </div>

            {/* Pricing */}
            <div className="relative py-1 flex flex-col items-center">
              <Link
                href="/#pricing"
                onClick={(e) => {
                  if (pathname === "/") {
                    e.preventDefault();
                    const el = document.getElementById("pricing") || document.getElementById("subscriptions");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                      window.history.pushState(null, "", "/#pricing");
                    }
                  }
                }}
                className="text-[#334155] hover:text-[#005A9C] transition-colors duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9C]"
              >
                Pricing
              </Link>
            </div>

            {/* About */}
            <div className="relative py-1 flex flex-col items-center">
              <Link
                href="/about"
                className={`transition-colors duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9C] ${
                  pathname === "/about" ? "text-[#0A192F] font-bold" : "text-[#334155] hover:text-[#005A9C]"
                }`}
              >
                About
              </Link>
              {pathname === "/about" && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#005A9C] rounded-full" />
              )}
            </div>

            {/* Case Studies */}
            <div className="relative py-1 flex flex-col items-center">
              <Link
                href="/case-studies"
                className={`transition-colors duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9C] ${
                  pathname.startsWith("/case-studies") ? "text-[#0A192F] font-bold" : "text-[#334155] hover:text-[#005A9C]"
                }`}
              >
                Case Studies
              </Link>
              {pathname.startsWith("/case-studies") && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#005A9C] rounded-full" />
              )}
            </div>

            {/* Contact */}
            <div className="relative py-1 flex flex-col items-center">
              <Link
                href="/contact"
                className={`transition-colors duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9C] ${
                  pathname === "/contact" ? "text-[#0A192F] font-bold" : "text-[#334155] hover:text-[#005A9C]"
                }`}
              >
                Contact
              </Link>
              {pathname === "/contact" && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#005A9C] rounded-full" />
              )}
            </div>
          </nav>

          {/* Right Action Icons: Search, Cart & Log In Pill Button */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Search Icon Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-full text-[#0A192F] hover:text-[#005A9C] hover:bg-[#F0F7FF] transition-all duration-200 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9C]"
              aria-label="Search Chapters & Notes"
            >
              <Search className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Shopping Cart — Only visible when user is logged in */}
            {activeStudent && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2.5 rounded-full text-[#0A192F] hover:text-[#005A9C] hover:bg-[#F0F7FF] transition-all duration-200 relative cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9C]"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[2]" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#005A9C] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                    {totalItemCount}
                  </span>
                )}
              </button>
            )}

            {/* AUTH BUTTONS: LOG IN (when logged out) VS VISIT DASHBOARD & PROFILE (when logged in) */}
            {activeStudent ? (
              <div className="flex items-center gap-2">
                {/* 1-Click Dashboard Button */}
                <Link
                  href={activeStudent.role === "admin" ? "/admin" : "/student"}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-[#005A9C] hover:bg-[#004F8A] text-white text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer whitespace-nowrap active:scale-[0.97]"
                  title={activeStudent.role === "admin" ? "Admin Dashboard" : "Student Dashboard"}
                >
                  <GraduationCap className="w-4 h-4 text-white" />
                  <span>{activeStudent.role === "admin" ? "Admin Dashboard" : "Student Dashboard"}</span>
                </Link>

                {/* Simplified User Profile Button */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#0A192F] text-xs font-bold transition-all duration-200 border border-[#DBEAFE] cursor-pointer whitespace-nowrap active:scale-[0.97] shadow-2xs"
                    aria-expanded={profileDropdownOpen}
                    aria-haspopup="true"
                    title={`Account settings for ${activeStudent.name}`}
                  >
                    <div className="w-6 h-6 rounded-full bg-[#005A9C] text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-2xs">
                      {activeStudent.avatarInitials}
                    </div>
                    <span className="max-w-[85px] truncate hidden md:inline font-semibold">
                      {activeStudent.name.split(" ")[0]}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#0A192F] transition-transform duration-200 ${
                        profileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Clean Simplified Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-white border border-[#DBEAFE] shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* User Header Card */}
                      <div className="px-3 py-2.5 bg-[#F0F7FF] rounded-xl border border-[#DBEAFE]/80 mb-1.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#005A9C] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            {activeStudent.avatarInitials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-[#0A192F] truncate">{activeStudent.name}</p>
                            <p className="text-[11px] text-[#64748B] truncate">
                              {activeStudent.email || "Verified Account"}
                            </p>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-white text-[#005A9C] border border-[#DBEAFE]">
                              {activeStudent.role === "admin" ? "🛡️ Administrator" : "🎓 Enrolled Student"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Direct Quick-Access Navigation */}
                      <div className="space-y-0.5">
                        <Link
                          href={activeStudent.role === "admin" ? "/admin" : "/student"}
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#0A192F] hover:bg-[#F0F7FF] hover:text-[#005A9C] transition-colors active:scale-[0.98]"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#005A9C]" />
                          <span>{activeStudent.role === "admin" ? "Admin Dashboard" : "Student Dashboard"}</span>
                        </Link>

                        <Link
                          href="/courses"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#0A192F] hover:bg-[#F0F7FF] hover:text-[#005A9C] transition-colors active:scale-[0.98]"
                        >
                          <BookOpen className="w-4 h-4 text-[#005A9C]" />
                          <span>Courses &amp; Notes</span>
                        </Link>
                      </div>

                      {/* Sign Out Action */}
                      <div className="pt-1.5 mt-1.5 border-t border-[#F0F7FF]">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer active:scale-[0.98]"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-[#005A9C] hover:bg-[#004F8A] text-white text-xs sm:text-sm font-bold transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap active:scale-[0.97]"
                title="Log In to Student Account"
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                <span>Log In</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-lg text-[#0A192F] hover:bg-[#F0F7FF] transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-[0.95]"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown Overlay */}
        {searchOpen && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2 animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-[#64748B] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ICAI / ICSI Chapters, Acts, Case Studies & MCQs..."
                className="w-full pl-11 pr-16 py-2.5 bg-[#F0F7FF] border border-[#DBEAFE] rounded-xl text-sm text-[#0A192F] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#005A9C] focus:bg-white transition"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-12 text-xs text-[#64748B] hover:text-[#0A192F]"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="absolute right-3 p-1 text-[#0A192F] hover:text-[#005A9C] transition-colors active:scale-90"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <div
              className="md:hidden fixed inset-0 bg-[#0A192F]/40 backdrop-blur-sm z-40 animate-in fade-in duration-200"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <nav
              className="md:hidden fixed top-0 right-0 bottom-0 w-[min(85vw,320px)] bg-white z-50 shadow-2xl border-l border-[#DBEAFE] animate-in slide-in-from-right duration-300 flex flex-col overflow-y-auto safe-bottom"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#DBEAFE]">
                <span className="text-sm font-bold text-[#0A192F]">Academy Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-full hover:bg-[#F0F7FF] text-[#0A192F] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 px-4 py-3 space-y-1.5 overflow-y-auto">
                <Link
                  href="/"
                  className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-colors min-h-[44px] active:scale-[0.98] ${
                    pathname === "/" ? "bg-[#EFF6FF] text-[#005A9C] font-bold border-l-2 border-[#005A9C]" : "text-[#334155] hover:bg-[#F0F7FF]"
                  }`}
                >
                  Home
                </Link>

                {/* Mobile Courses Section */}
                <div className="px-4 py-3 bg-[#F8FAFC] rounded-xl border border-[#DBEAFE] space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    Courses &amp; Notes ({catalogItems.length})
                  </div>

                  {catalogItems.length === 0 ? (
                    <p className="py-2 text-xs text-[#64748B]">No courses published yet.</p>
                  ) : (
                    catalogItems.map((item) => (
                      <Link
                        key={item.id}
                        href={`/product/${item.id}`}
                        className="flex items-center justify-between gap-2 py-2.5 text-sm font-bold text-[#0A192F] hover:text-[#005A9C] active:text-[#005A9C] border-t border-[#DBEAFE] first:border-t-0 pt-2.5 first:pt-0 min-h-[44px] transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#005A9C] shrink-0" />
                          <span className="line-clamp-1">{item.title}</span>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE] shrink-0">
                          {item.examBody || item.category || "Course"}
                        </span>
                      </Link>
                    ))
                  )}

                  <Link
                    href="/courses"
                    className="flex items-center justify-between py-2 text-xs font-bold text-[#005A9C] hover:text-[#004F8A] border-t border-[#DBEAFE] pt-2.5 min-h-[44px]"
                  >
                    <span>Browse All Notes &amp; Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <Link
                  href="/#free-resources"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    if (pathname === "/") {
                      e.preventDefault();
                      const el = document.getElementById("free-resources");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                        window.history.pushState(null, "", "/#free-resources");
                      }
                    }
                  }}
                  className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-[#005A9C] bg-[#EFF6FF] rounded-xl transition-colors min-h-[44px] active:scale-[0.98] border border-[#BFDBFE]"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#005A9C]" />
                    <span>Free Resource Samples</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white text-[#005A9C] border border-[#DBEAFE]">
                    PDF
                  </span>
                </Link>

                <Link
                  href="/#pricing"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    if (pathname === "/") {
                      e.preventDefault();
                      const el = document.getElementById("pricing") || document.getElementById("subscriptions");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                        window.history.pushState(null, "", "/#pricing");
                      }
                    }
                  }}
                  className="flex items-center px-4 py-3 text-sm font-medium text-[#334155] hover:bg-[#F0F7FF] hover:text-[#005A9C] rounded-xl transition-colors min-h-[44px] active:scale-[0.98]"
                >
                  Pricing
                </Link>

                <Link
                  href="/about"
                  className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-colors min-h-[44px] active:scale-[0.98] ${
                    pathname === "/about" ? "bg-[#EFF6FF] text-[#005A9C] font-bold border-l-2 border-[#005A9C]" : "text-[#334155] hover:bg-[#F0F7FF]"
                  }`}
                >
                  About
                </Link>

                <Link
                  href="/case-studies"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-colors min-h-[44px] active:scale-[0.98] ${
                    pathname.startsWith("/case-studies") ? "bg-[#EFF6FF] text-[#005A9C] font-bold border-l-2 border-[#005A9C]" : "text-[#334155] hover:bg-[#F0F7FF]"
                  }`}
                >
                  Case Studies
                </Link>

                <Link
                  href="/contact"
                  className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-colors min-h-[44px] active:scale-[0.98] ${
                    pathname === "/contact" ? "bg-[#EFF6FF] text-[#005A9C] font-bold border-l-2 border-[#005A9C]" : "text-[#334155] hover:bg-[#F0F7FF]"
                  }`}
                >
                  Contact
                </Link>
              </div>

              {/* Drawer Footer Auth CTA */}
              <div className="px-4 py-4 border-t border-[#DBEAFE] safe-bottom space-y-2.5">
                {activeStudent ? (
                  <>
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F0F7FF] border border-[#DBEAFE]">
                      <div className="w-10 h-10 rounded-full bg-[#005A9C] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {activeStudent.avatarInitials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-[#0A192F] truncate">{activeStudent.name}</p>
                        <p className="text-xs text-[#64748B] truncate">
                          {activeStudent.email || "Verified Account"}
                        </p>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-white text-[#005A9C] border border-[#DBEAFE]">
                          {activeStudent.role === "admin" ? "🛡️ Administrator" : "🎓 Enrolled Student"}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={activeStudent.role === "admin" ? "/admin" : "/student"}
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#005A9C] text-white text-sm font-bold shadow-xs hover:bg-[#004F8A] transition min-h-[44px] active:scale-[0.98]"
                    >
                      <LayoutDashboard className="w-4 h-4 text-white" />
                      <span>{activeStudent.role === "admin" ? "Admin Dashboard" : "Student Dashboard"}</span>
                    </Link>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-rose-600 text-xs font-bold hover:bg-rose-50 transition border border-rose-200 cursor-pointer active:scale-[0.98]"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#005A9C] text-white text-sm font-bold shadow-xs hover:bg-[#004F8A] transition min-h-[48px] active:scale-[0.98]"
                  >
                    <LogIn className="w-4 h-4 text-white" />
                    <span>Log In to Account</span>
                  </Link>
                )}
              </div>
            </nav>
          </>
        )}
      </header>
      </div>
    </>
  );
}
