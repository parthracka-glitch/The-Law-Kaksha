import Link from "next/link";
import Image from "next/image";
import { BookOpen, Home, ArrowLeft, GraduationCap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E7E4E7] bg-white hover:bg-[#F7F7F5] text-xs font-semibold text-[#221D1D] transition shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#4D433F]" />
          <span>Back to Home</span>
        </Link>
        <Link href="/">
          <div className="relative h-10 w-36 sm:h-11 sm:w-44 flex items-center">
            <Image
              src="/assets/logo-transparent.png"
              alt="The Law Kaksha Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
        <div className="w-20 hidden sm:block" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="max-w-md w-full text-center space-y-6 bg-white rounded-3xl border border-[#E7E4E7] p-8 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-[#BFAFE5]/20 flex items-center justify-center text-[#221D1D] mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-widest text-[#77716E] uppercase">Error 404</span>
            <h1 className="text-2xl font-serif font-bold text-[#221D1D]">Section Not Found</h1>
            <p className="text-xs text-[#77716E] leading-relaxed">
              The statutory codex, lecture note, or learning page you requested could not be located or may have moved.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center flex-wrap">
            <Link
              href="/"
              className="px-4 py-2.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-semibold shadow-sm transition flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Link>
            <Link
              href="/student"
              className="px-4 py-2.5 rounded-full bg-white border border-[#BFAFE5] hover:bg-[#F3E8FF] text-[#7E22CE] text-xs font-semibold transition flex items-center justify-center gap-2 shadow-xs"
            >
              <GraduationCap className="w-4 h-4 text-[#7E22CE]" />
              <span>Student Portal</span>
            </Link>
            <Link
              href="/courses"
              className="px-4 py-2.5 rounded-full border border-[#E7E4E7] hover:bg-[#F7F7F5] text-[#221D1D] text-xs font-semibold transition flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-[#77716E]" />
              <span>Browse Courses</span>
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
