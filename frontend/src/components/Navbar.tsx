"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingBag, Menu, X, ChevronDown, BookOpen, GraduationCap, ArrowRight, ShieldCheck, Sparkles, FileText, LogIn, LogOut, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

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
          } catch (e) {}
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
          } catch (e) {}
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
    setMobileMenuOpen(false);
    setCoursesDropdownOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

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
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "py-3 bg-white/95 backdrop-blur-md shadow-[0_2px_16px_rgba(34,29,29,0.06)] border-b border-[#E7E4E7]"
            : "py-3.5 sm:py-4 bg-white border-b border-[#E7E4E7]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Official Brand Logo */}
          <Link href="/" className="flex items-center transition-opacity hover:opacity-90">
            <div className="relative h-10 w-36 sm:h-11 sm:w-44 flex items-center">
              <Image
                src="/assets/logo-transparent.png"
                alt="The Law कक्षा - CA Foundation & CSEET Law Academy"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-[15px] font-medium text-[#4D433F]">
            {/* Home */}
            <div className="relative py-1 flex flex-col items-center">
              <Link
                href="/"
                className={`transition-colors duration-150 ${
                  pathname === "/" ? "text-[#221D1D] font-bold" : "text-[#4D433F] hover:text-[#221D1D]"
                }`}
              >
                Home
              </Link>
              {pathname === "/" && (
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#AED7E9] rounded-full" />
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
                className={`flex items-center gap-1.5 transition-colors duration-150 cursor-pointer ${
                  pathname.startsWith("/courses") || pathname.startsWith("/product")
                    ? "text-[#221D1D] font-bold"
                    : "text-[#4D433F] hover:text-[#221D1D]"
                }`}
              >
                <span>Courses &amp; Notes</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#77716E] transition-transform duration-200 ${
                    coursesDropdownOpen ? "rotate-180 text-[#AED7E9]" : ""
                  }`}
                />
              </Link>

              {(pathname.startsWith("/courses") || pathname.startsWith("/product")) && (
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#AED7E9] rounded-full" />
              )}

              {/* Dropdown Menu */}
              {coursesDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-84 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="bg-white rounded-2xl shadow-[0_12px_36px_rgba(34,29,29,0.08)] border border-[#E7E4E7] p-2 space-y-1">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#77716E] flex items-center justify-between">
                      <span>Available Courses (2)</span>
                      <span className="text-[10px] text-[#221D1D] font-bold bg-[#BFAFE5] px-2 py-0.5 rounded-full">₹99/mo</span>
                    </div>

                    {/* 1. CA Foundation */}
                    <Link
                      href="/product/course-ca-foundation-sub"
                      onClick={() => setCoursesDropdownOpen(false)}
                      className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F7F7F5] transition-all border border-transparent hover:border-[#E7E4E7]"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#AED7E9] text-[#221D1D] flex items-center justify-center shrink-0 group-hover:bg-[#BFAFE5] transition-colors mt-0.5">
                        <BookOpen className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-[#221D1D] group-hover:text-[#221D1D] transition-colors">
                            CA Foundation Business Laws
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#C4E1EC] text-[#221D1D]">
                            ICAI
                          </span>
                        </div>
                        <p className="text-xs text-[#4D433F] line-clamp-1 mt-0.5">
                          7 Chapters • Notes, Case Studies &amp; Model Solutions
                        </p>
                      </div>
                    </Link>

                    {/* 2. CSEET (Law & Mgt) */}
                    <Link
                      href="/product/course-cseet-sub"
                      onClick={() => setCoursesDropdownOpen(false)}
                      className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F7F7F5] transition-all border border-transparent hover:border-[#E7E4E7]"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#C4E1EC] text-[#221D1D] flex items-center justify-center shrink-0 group-hover:bg-[#AED7E9] transition-colors mt-0.5">
                        <GraduationCap className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-[#221D1D] group-hover:text-[#221D1D] transition-colors">
                            CSEET Business Law &amp; Mgt
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#C4E1EC] text-[#221D1D]">
                            ICSI
                          </span>
                        </div>
                        <p className="text-xs text-[#4D433F] line-clamp-1 mt-0.5">
                          8 Units • Study Notes, MCQ Drills &amp; Mock Tests
                        </p>
                      </div>
                    </Link>

                    <div className="pt-2 border-t border-[#E7E4E7] px-3 py-1.5 flex items-center justify-between text-[11px] text-[#77716E]">
                      <span>Online PDF Reading Vault</span>
                      <Link
                        href="/courses"
                        onClick={() => setCoursesDropdownOpen(false)}
                        className="text-[#221D1D] font-bold hover:text-[#98C5D8] flex items-center gap-1"
                      >
                        <span>View Catalog</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="relative py-1 flex flex-col items-center">
              <Link
                href="/#pricing"
                className="text-[#4D433F] hover:text-[#221D1D] transition-colors duration-150"
              >
                Pricing
              </Link>
            </div>

            {/* About */}
            <div className="relative py-1 flex flex-col items-center">
              <Link
                href="/about"
                className={`transition-colors duration-150 ${
                  pathname === "/about" ? "text-[#221D1D] font-bold" : "text-[#4D433F] hover:text-[#221D1D]"
                }`}
              >
                About
              </Link>
              {pathname === "/about" && (
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#AED7E9] rounded-full" />
              )}
            </div>

            {/* Contact */}
            <div className="relative py-1 flex flex-col items-center">
              <Link
                href="/contact"
                className={`transition-colors duration-150 ${
                  pathname === "/contact" ? "text-[#221D1D] font-bold" : "text-[#4D433F] hover:text-[#221D1D]"
                }`}
              >
                Contact
              </Link>
              {pathname === "/contact" && (
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#AED7E9] rounded-full" />
              )}
            </div>
          </nav>

          {/* Right Action Icons: Search, Cart & Log In Pill Button */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Search Icon Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-full text-[#221D1D] hover:text-[#221D1D] hover:bg-[#F7F7F5] transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Search Chapters & Notes"
            >
              <Search className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Shopping Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 rounded-full text-[#221D1D] hover:text-[#221D1D] hover:bg-[#F7F7F5] transition-colors relative cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[2]" />
              {totalItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#BFAFE5] text-[#221D1D] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs border border-[#A08DC9]">
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* AUTH BUTTONS: LOG IN (when logged out) VS PROFILE & DASHBOARD (when logged in) */}
            {activeStudent ? (
              <div className="flex items-center gap-2">
                {/* Quick Shortcut to Student Dashboard / Admin Panel */}
                <Link
                  href={activeStudent.role === "admin" ? "/admin" : "/student"}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-full bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#7E22CE] border border-[#DDD6FE] text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer whitespace-nowrap active:scale-95"
                  title={activeStudent.role === "admin" ? "Open Admin Panel" : "Open Student Dashboard"}
                >
                  <GraduationCap className="w-4 h-4 text-[#7E22CE]" />
                  <span>{activeStudent.role === "admin" ? "Admin Panel" : "Dashboard"}</span>
                </Link>

                {/* Dedicated Profile Dropdown Button */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs sm:text-sm font-bold transition-all duration-200 shadow-xs hover:shadow-sm cursor-pointer whitespace-nowrap border border-[#A08DC9]/40 active:scale-95"
                    aria-expanded={profileDropdownOpen}
                    aria-haspopup="true"
                    title={`View profile for ${activeStudent.name}`}
                  >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#221D1D] text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-2xs">
                      {activeStudent.avatarInitials}
                    </div>
                    <span className="max-w-[90px] truncate hidden xs:inline sm:inline">
                      {activeStudent.name.split(" ")[0]}
                    </span>
                    <span className="hidden sm:inline text-[11px] font-semibold text-[#4D433F]">• Profile</span>
                    <span className="xs:hidden sm:hidden">Profile</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#221D1D] transition-transform duration-200 ${
                        profileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Rich Profile Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-72 rounded-2xl bg-white border border-[#E7E4E7] shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 divide-y divide-[#F3F4F6]">
                      {/* User Card Header */}
                      <div className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#BFAFE5] to-[#7E22CE] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                            {activeStudent.avatarInitials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-[#1F2937] truncate">{activeStudent.name}</p>
                            <p className="text-xs text-[#6B7280] truncate">
                              {activeStudent.email || (activeStudent.role === "admin" ? "Administrator" : "Verified Student")}
                            </p>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#FAF5FF] text-[#7E22CE] border border-[#DDD6FE]">
                              {activeStudent.role === "admin" ? "⚡ Administrator" : "🎓 Law Student"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Navigation Links */}
                      <div className="p-1.5 space-y-0.5">
                        <Link
                          href={activeStudent.role === "admin" ? "/admin" : "/student"}
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1F2937] hover:bg-[#F3E8FF] hover:text-[#7E22CE] transition-colors"
                        >
                          <GraduationCap className="w-4 h-4 text-[#7E22CE]" />
                          <span>{activeStudent.role === "admin" ? "Admin Control Center" : "Student Dashboard"}</span>
                        </Link>

                        <Link
                          href="/student"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1F2937] hover:bg-[#F7F7F5] transition-colors"
                        >
                          <User className="w-4 h-4 text-[#4B8097]" />
                          <span>My Profile &amp; Stats</span>
                        </Link>

                        <Link
                          href="/courses"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#1F2937] hover:bg-[#F7F7F5] transition-colors"
                        >
                          <BookOpen className="w-4 h-4 text-[#F7892A]" />
                          <span>Browse Notes &amp; Codices</span>
                        </Link>
                      </div>

                      {/* Sign Out Action */}
                      <div className="p-1.5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs sm:text-sm font-bold transition-all duration-200 shadow-xs hover:shadow-sm cursor-pointer whitespace-nowrap active:scale-95"
                title="Log In to Student Account"
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#221D1D]" />
                <span>Log In</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-lg text-[#221D1D] hover:bg-[#F7F7F5] transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
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
              <Search className="absolute left-4 w-4 h-4 text-[#77716E] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ICAI / ICSI Chapters, Acts, Case Studies & MCQs..."
                className="w-full pl-11 pr-16 py-2.5 bg-[#F7F7F5] border border-[#E7E4E7] rounded-xl text-sm text-[#221D1D] focus:outline-none focus:ring-2 focus:ring-[#BFAFE5] focus:bg-white transition"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-12 text-xs text-[#77716E] hover:text-[#221D1D]"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="absolute right-3 p-1 text-[#221D1D] hover:text-[#98C5D8]"
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
              className="md:hidden fixed inset-0 bg-[#221D1D]/30 backdrop-blur-sm z-40 animate-in fade-in duration-200"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <nav
              className="md:hidden fixed top-0 right-0 bottom-0 w-[min(85vw,320px)] bg-white z-50 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col overflow-y-auto safe-bottom"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E4E7]">
                <span className="text-sm font-bold text-[#221D1D]">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-full hover:bg-[#F7F7F5] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 px-4 py-3 space-y-1.5 overflow-y-auto">
                <Link
                  href="/"
                  className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-colors min-h-[44px] ${
                    pathname === "/" ? "bg-[#AED7E9]/30 text-[#221D1D] font-bold" : "text-[#4D433F] hover:bg-[#F7F7F5] active:bg-[#E7E4E7]"
                  }`}
                >
                  Home
                </Link>

                {/* Mobile Courses Section */}
                <div className="px-4 py-3 bg-[#F7F7F5] rounded-xl border border-[#E7E4E7] space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#77716E]">
                    Courses &amp; Notes (2)
                  </div>

                  <Link
                    href="/product/course-ca-foundation-sub"
                    className="flex items-center justify-between py-2.5 text-sm font-bold text-[#221D1D] hover:text-[#98C5D8] active:text-[#98C5D8] min-h-[44px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#AED7E9]" />
                      <span>CA Foundation Business Laws</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#AED7E9] text-[#221D1D]">ICAI</span>
                  </Link>

                  <Link
                    href="/product/course-cseet-sub"
                    className="flex items-center justify-between py-2.5 text-sm font-bold text-[#221D1D] hover:text-[#98C5D8] active:text-[#98C5D8] border-t border-[#E7E4E7] pt-2.5 min-h-[44px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C4E1EC]" />
                      <span>CSEET Business Law &amp; Mgt</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#C4E1EC] text-[#221D1D]">ICSI</span>
                  </Link>

                  <Link
                    href="/courses"
                    className="flex items-center justify-between py-2 text-xs font-bold text-[#221D1D] hover:underline border-t border-[#E7E4E7] pt-2.5 min-h-[44px]"
                  >
                    <span>Browse All Notes &amp; Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <Link
                  href="/#pricing"
                  className="flex items-center px-4 py-3 text-sm font-medium text-[#4D433F] hover:bg-[#F7F7F5] active:bg-[#E7E4E7] rounded-xl transition-colors min-h-[44px]"
                >
                  Pricing
                </Link>

                <Link
                  href="/about"
                  className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-colors min-h-[44px] ${
                    pathname === "/about" ? "bg-[#AED7E9]/30 text-[#221D1D] font-bold" : "text-[#4D433F] hover:bg-[#F7F7F5] active:bg-[#E7E4E7]"
                  }`}
                >
                  About
                </Link>

                <Link
                  href="/contact"
                  className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-colors min-h-[44px] ${
                    pathname === "/contact" ? "bg-[#AED7E9]/30 text-[#221D1D] font-bold" : "text-[#4D433F] hover:bg-[#F7F7F5] active:bg-[#E7E4E7]"
                  }`}
                >
                  Contact
                </Link>
              </div>

              {/* Drawer Footer Auth CTA */}
              <div className="px-4 py-4 border-t border-[#E7E4E7] safe-bottom space-y-2.5">
                {activeStudent ? (
                  <>
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7]">
                      <div className="w-10 h-10 rounded-full bg-[#221D1D] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {activeStudent.avatarInitials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-[#1F2937] truncate">{activeStudent.name}</p>
                        <p className="text-xs text-[#6B7280] truncate">
                          {activeStudent.role === "admin" ? "Administrator" : "Student Account"}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={activeStudent.role === "admin" ? "/admin" : "/student"}
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#BFAFE5] text-[#221D1D] text-sm font-bold shadow-xs hover:bg-[#A08DC9] transition min-h-[44px]"
                    >
                      <GraduationCap className="w-4 h-4 text-[#221D1D]" />
                      <span>{activeStudent.role === "admin" ? "Admin Control Panel" : "🎓 Student Dashboard"}</span>
                    </Link>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-rose-600 text-xs font-bold hover:bg-rose-50 transition border border-rose-200 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#BFAFE5] text-[#221D1D] text-sm font-bold shadow-xs hover:bg-[#A08DC9] transition min-h-[48px]"
                  >
                    <LogIn className="w-4 h-4 text-[#221D1D]" />
                    <span>Log In to Account</span>
                  </Link>
                )}
              </div>
            </nav>
          </>
        )}
      </header>
    </>
  );
}
