import Link from "next/link";
import { ArrowRight, Sparkles, Scale, Users, MessageSquare, Shield, BookOpen } from "lucide-react";

export function CommunityBanner() {
  return (
    <section className="py-14 bg-white border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 border border-sky-200 bg-gradient-to-r from-sky-50/90 via-white to-sky-50/90 shadow-lg overflow-hidden">
          
          {/* Subtle Background Glow Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-72 h-72 bg-sky-100/50 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Text & Action */}
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-[#0284C7] text-xs font-bold uppercase tracking-wider border border-sky-200">
                <Users className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>The Law Kaksha Aspirants Guild</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-serif leading-tight">
                Empowering India&apos;s Future Legal Minds &amp; Judicial Officers.
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                Connect with 45,000+ law students and judicial aspirants. Receive daily Supreme Court judgment summaries, Bare Act amendment alerts, and participate in peer answer writing reviews.
              </p>

              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  href="#offerings"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] hover:from-[#0369A1] hover:to-[#0284C7] text-white text-xs sm:text-sm font-bold px-7 py-3.5 rounded-xl shadow-md shadow-sky-500/25 transition-all tracking-wide hover:scale-[1.02]"
                >
                  <span>JOIN THE ASPIRANTS GUILD</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center gap-2 bg-white hover:bg-sky-50 text-[#0284C7] border border-sky-200 hover:border-sky-300 text-xs sm:text-sm font-semibold px-6 py-3.5 rounded-xl transition-colors shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 text-[#0284C7]" />
                  <span>Explore Daily Notes</span>
                </Link>
              </div>
            </div>

            {/* Right: Key Stats / Trust Box */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3">
              <div className="bg-white border border-sky-100 rounded-2xl p-4 text-center shadow-sm">
                <Scale className="w-6 h-6 text-[#0284C7] mx-auto mb-2" />
                <p className="text-2xl font-black text-[#0284C7] font-serif">45,000+</p>
                <p className="text-[11px] text-slate-500">Active Law Students</p>
              </div>
              <div className="bg-white border border-sky-100 rounded-2xl p-4 text-center shadow-sm">
                <BookOpen className="w-6 h-6 text-[#0284C7] mx-auto mb-2" />
                <p className="text-2xl font-black text-[#0284C7] font-serif">1,200+</p>
                <p className="text-[11px] text-slate-500">Landmark Rulings</p>
              </div>
              <div className="bg-white border border-sky-100 rounded-2xl p-4 text-center shadow-sm">
                <Shield className="w-6 h-6 text-[#0284C7] mx-auto mb-2" />
                <p className="text-2xl font-black text-[#0284C7] font-serif">98.4%</p>
                <p className="text-[11px] text-slate-500">Prelims Pass Rate</p>
              </div>
              <div className="bg-white border border-sky-100 rounded-2xl p-4 text-center shadow-sm">
                <Sparkles className="w-6 h-6 text-[#0284C7] mx-auto mb-2" />
                <p className="text-2xl font-black text-[#0284C7] font-serif">Top 50</p>
                <p className="text-[11px] text-slate-500">Ranks in State PCS-J</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
