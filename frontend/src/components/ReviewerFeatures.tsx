import Link from "next/link";
import {
  Check,
  HelpCircle,
  ArrowRight,
  BookMarked,
  Sparkles,
  Scale,
  Scroll,
  Gavel,
  CheckCircle2,
  Clock,
  Layers,
  Award,
} from "lucide-react";

export function ReviewerFeatures() {
  const pillars = [
    {
      title: "Bare Act Synopsis & Definitions",
      desc: "Instant statutory summaries, definition tables, and flowcharts mapped at the beginning of every chapter.",
      icon: Scroll,
    },
    {
      title: "ABC Frequency & Weightage Analysis",
      desc: "Scientific categorization into Category A, B, and C statutory sections based on 10-year exam patterns.",
      icon: Layers,
    },
    {
      title: "1.5-Day Last Day Revision (LDR) Tags",
      desc: "Curated high-yield questions marked with LDR tags to enable complete syllabus review in the crucial 36 hours before exams.",
      icon: Clock,
    },
    {
      title: "Landmark Precedents & Rulings",
      desc: "Supreme Court and High Court ratio decidendi, landmark citations, and modern 2024-2026 jurisprudence.",
      icon: Gavel,
    },
    {
      title: "Objective MCQs & Caselet Drills",
      desc: "Topic-wise multiple-choice drills with explanatory rationale to tackle negative-marking Prelims exams with confidence.",
      icon: CheckCircle2,
    },
    {
      title: "Gradual Difficulty Progression",
      desc: "Structured from straightforward statutory questions to intricate multi-issue practical case studies.",
      icon: Award,
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 bg-slate-50/50 text-slate-900 border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3">
            <BookMarked className="w-3.5 h-3.5 text-sky-600" />
            <span>Redefining Legal Exam Preparation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-serif text-slate-900">
            What is <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] to-[#0EA5E9]">The Law Kaksha Reviewer?</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            The Law Kaksha Reviewer is the next-generation evolution of standard legal compilers. While standard books merely dump raw past papers, our Reviewer provides chapter-wise conceptual synthesis, statutory breakdowns, and model answer drafting templates.
          </p>
        </div>

        {/* 6 Core Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p, idx) => {
            const IconComponent = p.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-sky-100 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 mb-4 group-hover:scale-105 group-hover:bg-sky-100 group-hover:border-sky-400 transition-all">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition-colors font-serif">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* The 27-Paper Advantage Breakdown Banner */}
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-sky-50 via-white to-sky-50 border border-sky-200 p-8 sm:p-10 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-[11px] font-bold text-sky-800 bg-white px-3 py-1 rounded-full border border-sky-200 uppercase tracking-wider shadow-xs">
                Exhaustive Question Repository
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
                Why Solve Unorganized Question Dumps?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Standard books present past exams year-by-year, forcing you to flip across 10 different papers to study a single concept like Section 100 CPC or Section 103 BNS. The Law Kaksha organizes all 27+ state past papers chapter-wise, allowing complete topical mastery in one sitting.
              </p>
            </div>

            <div className="lg:col-span-4 text-center lg:text-right">
              <Link
                href="#offerings"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:from-[#0369A1] hover:to-[#0284C7] text-white text-xs font-black px-6 py-3.5 rounded-xl shadow-md shadow-sky-500/25 transition-all hover:scale-[1.02]"
              >
                <span>Browse All Compilers</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
