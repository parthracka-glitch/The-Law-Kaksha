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

            {/* Top Corner "Student Dashboard" CTA Button */}
            {activeStudent ? (
              <Link
                href={activeStudent.role === "admin" ? "/admin" : "/student"}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs sm:text-sm font-bold transition-all duration-200 shadow-xs hover:shadow-sm cursor-pointer whitespace-nowrap"
                title={`${activeStudent.name} (${activeStudent.role === "admin" ? "Admin" : "Student"})`}
              >
                <div className="w-5 h-5 rounded-full bg-[#221D1D] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  {activeStudent.avatarInitials}
                </div>
                <span className="hidden xs:inline sm:inline">Student Dashboard</span>
                <span className="xs:hidden sm:hidden">Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/login?redirect=/student"
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs sm:text-sm font-bold transition-all duration-200 shadow-xs hover:shadow-sm cursor-pointer whitespace-nowrap"
                title="Access Student Portal & Study Notes"
              >
                <GraduationCap className="w-4 h-4 text-[#221D1D]" />
                <span className="hidden xs:inline sm:inline">Student Dashboard</span>
                <span className="xs:hidden sm:hidden">Dashboard</span>
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

              {/* Drawer Footer CTA */}
              <div className="px-4 py-4 border-t border-[#E7E4E7] safe-bottom">
                {activeStudent ? (
                  <Link
                    href={activeStudent.role === "admin" ? "/admin" : "/student"}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#BFAFE5] text-[#221D1D] text-sm font-bold shadow-xs hover:bg-[#A08DC9] transition min-h-[48px]"
                  >
                    <GraduationCap className="w-4 h-4 text-[#221D1D]" />
                    <span>{activeStudent.role === "admin" ? "Admin Panel" : "🎓 Student Dashboard"}</span>
                  </Link>
                ) : (
                  <Link
                    href="/login?redirect=/student"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#BFAFE5] text-[#221D1D] text-sm font-bold shadow-xs hover:bg-[#A08DC9] transition min-h-[48px]"
                  >
                    <GraduationCap className="w-4 h-4 text-[#221D1D]" />
                    <span>🎓 Student Dashboard (Log In)</span>
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
