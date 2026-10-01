"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingBag, Menu, X, ChevronDown, BookOpen, GraduationCap, ArrowRight, ShieldCheck, Sparkles, FileText } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStudent, setActiveStudent] = useState<{
    name: string;
    avatarInitials: string;
    role?: string;
  } | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
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
              setActiveStudent({
                name: parsed.name,
                avatarInitials: parsed.avatarInitials || parsed.name.slice(0, 2).toUpperCase(),
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
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("storage", checkSession);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCoursesDropdownOpen(false);
  }, [pathname]);

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
            ? "py-3 bg-white/95 backdrop-blur-md shadow-[0_2px_16px_rgba(0,0,0,0.06)] border-b border-slate-200/80"
            : "py-3.5 sm:py-4 bg-white border-b border-slate-100"
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
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-[15px] font-medium text-[#334155]">
            {/* Home */}
            <div className="relative py-1 flex flex-col items-center">
              <Link
                href="/"
                className={`transition-colors duration-150 ${
                  pathname === "/" ? "text-[#005FD8] font-semibold" : "text-[#334155] hover:text-[#005FD8]"
                }`}
              >
                Home
              </Link>
              {pathname === "/" && (
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#005FD8] rounded-full" />
              )}
            </div>

            {/* Courses & Notes Dropdown (Navigates directly to /courses shopping catalog) */}
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
                    ? "text-[#005FD8] font-semibold"
                    : "text-[#334155] hover:text-[#005FD8]"
                }`}
              >
                <span>Courses &amp; Notes</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    coursesDropdownOpen ? "rotate-180 text-[#005FD8]" : ""
                  }`}
                />
              </Link>

              {(pathname.startsWith("/courses") || pathname.startsWith("/product")) && (
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#005FD8] rounded-full" />
              )}

              {/* Dropdown Menu */}
              {coursesDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-84 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="bg-white rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-slate-200/90 p-2 space-y-1">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>Available Courses (2)</span>
                      <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded">₹99/mo</span>
                    </div>

                    {/* 1. CA Foundation */}
                    <Link
                      href="/product/course-ca-foundation-sub"
                      onClick={() => setCoursesDropdownOpen(false)}
                      className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-blue-50/70 transition-all border border-transparent hover:border-blue-100"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-100/80 text-[#005FD8] flex items-center justify-center shrink-0 group-hover:bg-[#005FD8] group-hover:text-white transition-colors mt-0.5">
                        <BookOpen className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-900 group-hover:text-[#005FD8] transition-colors">
                            CA Foundation Business Laws
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                            ICAI
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          7 Chapters • Notes, Case Studies &amp; Model Solutions
                        </p>
                      </div>
                    </Link>

                    {/* 2. CSEET (Law & Mgt) */}
                    <Link
                      href="/product/course-cseet-sub"
                      onClick={() => setCoursesDropdownOpen(false)}
                      className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/70 transition-all border border-transparent hover:border-amber-100"
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors mt-0.5">
                        <GraduationCap className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                            CSEET Business Law &amp; Mgt
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            ICSI
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          8 Units • Study Notes, MCQ Drills &amp; Mock Tests
                        </p>
                      </div>
                    </Link>

                    <div className="pt-2 border-t border-slate-100 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Online PDF Reading Vault</span>
                      <Link
                        href="/courses"
                        onClick={() => setCoursesDropdownOpen(false)}
                        className="text-[#005FD8] font-bold hover:underline flex items-center gap-1"
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
                className="text-[#334155] hover:text-[#005FD8] transition-colors duration-150"
              >
                Pricing
              </Link>
            </div>

            {/* About */}
            <div className="relative py-1 flex flex-col items-center">
              <Link
                href="/about"
                className={`transition-colors duration-150 ${
                  pathname === "/about" ? "text-[#005FD8] font-semibold" : "text-[#334155] hover:text-[#005FD8]"
                }`}
              >
                About
              </Link>
              {pathname === "/about" && (
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#005FD8] rounded-full" />
              )}
            </div>

            {/* Contact */}
            <div className="relative py-1 flex flex-col items-center">
              <Link
                href="/contact"
                className={`transition-colors duration-150 ${
                  pathname === "/contact" ? "text-[#005FD8] font-semibold" : "text-[#334155] hover:text-[#005FD8]"
                }`}
              >
                Contact
              </Link>
              {pathname === "/contact" && (
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#005FD8] rounded-full" />
              )}
            </div>
          </nav>

          {/* Right Action Icons: Search, Cart & Log In Pill Button */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Search Icon Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-full text-[#1E293B] hover:text-[#005FD8] hover:bg-slate-100/80 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Search Chapters & Notes"
            >
              <Search className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Shopping Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 rounded-full text-[#1E293B] hover:text-[#005FD8] hover:bg-slate-100/80 transition-colors relative cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[2]" />
              {totalItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#005FD8] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* "Log In / Student Portal" Pill Button */}
            {activeStudent ? (
              <Link
                href={activeStudent.role === "admin" ? "/admin" : "/student"}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#005FD8] bg-blue-50/60 text-[#005FD8] text-sm font-semibold hover:bg-blue-100/70 transition-all duration-200 active:scale-95"
              >
                <div className="w-5 h-5 rounded-full bg-[#005FD8] text-white flex items-center justify-center font-bold text-[10px]">
                  {activeStudent.avatarInitials}
                </div>
                <span className="truncate max-w-[85px]">{activeStudent.name.split(" ")[0]}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-5 py-2 rounded-xl border border-[#005FD8] text-[#005FD8] hover:bg-[#005FD8] hover:text-white text-sm font-semibold transition-all duration-200 active:scale-95"
              >
                Log In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
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
              <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ICAI / ICSI Chapters, Acts, Case Studies & MCQs..."
                className="w-full pl-11 pr-16 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005FD8] focus:bg-white transition"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-12 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="absolute right-3 p-1 text-[#005FD8] hover:text-[#004BB0]"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {/* Mobile Navigation Drawer with overlay */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <div
              className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-in fade-in duration-200"
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
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <span className="text-sm font-semibold text-[#1D1D1F]">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-full hover:bg-slate-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 px-4 py-3 space-y-1.5 overflow-y-auto">
                <Link
                  href="/"
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors min-h-[44px] ${
                    pathname === "/" ? "bg-blue-50 text-[#005FD8] font-semibold" : "text-slate-700 hover:bg-slate-50 active:bg-slate-100"
                  }`}
                >
                  Home
                </Link>

                {/* Mobile Courses Section */}
                <div className="px-4 py-3 bg-slate-50/90 rounded-xl border border-slate-100 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Courses &amp; Notes (2)
                  </div>

                  <Link
                    href="/product/course-ca-foundation-sub"
                    className="flex items-center justify-between py-2.5 text-sm font-semibold text-slate-800 hover:text-[#005FD8] active:text-[#005FD8] min-h-[44px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#005FD8]" />
                      <span>CA Foundation Business Laws</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">ICAI</span>
                  </Link>

                  <Link
                    href="/product/course-cseet-sub"
                    className="flex items-center justify-between py-2.5 text-sm font-semibold text-slate-800 hover:text-amber-800 active:text-amber-800 border-t border-slate-100 pt-2.5 min-h-[44px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>CSEET Business Law &amp; Mgt</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">ICSI</span>
                  </Link>

                  <Link
                    href="/courses"
                    className="flex items-center justify-between py-2 text-xs font-bold text-[#005FD8] hover:underline border-t border-slate-100 pt-2.5 min-h-[44px]"
                  >
                    <span>Browse All Notes &amp; Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <Link
                  href="/#pricing"
                  className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-colors min-h-[44px]"
                >
                  Pricing
                </Link>

                <Link
                  href="/about"
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors min-h-[44px] ${
                    pathname === "/about" ? "bg-blue-50 text-[#005FD8] font-semibold" : "text-slate-700 hover:bg-slate-50 active:bg-slate-100"
                  }`}
                >
                  About
                </Link>

                <Link
                  href="/contact"
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors min-h-[44px] ${
                    pathname === "/contact" ? "bg-blue-50 text-[#005FD8] font-semibold" : "text-slate-700 hover:bg-slate-50 active:bg-slate-100"
                  }`}
                >
                  Contact
                </Link>
              </div>

              {/* Drawer Footer CTA */}
              <div className="px-4 py-4 border-t border-slate-100 safe-bottom">
                {activeStudent ? (
                  <Link
                    href={activeStudent.role === "admin" ? "/admin" : "/student"}
                    className="w-full flex items-center justify-center py-3 rounded-xl border border-[#005FD8] bg-blue-50 text-[#005FD8] text-sm font-semibold hover:bg-blue-100 active:bg-blue-100 transition min-h-[48px]"
                  >
                    {activeStudent.role === "admin" ? "Admin Panel" : "Student Dashboard"}
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center py-3 rounded-xl border border-[#005FD8] bg-blue-50 text-[#005FD8] text-sm font-semibold hover:bg-blue-100 active:bg-blue-100 transition min-h-[48px]"
                  >
                    Log In
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
