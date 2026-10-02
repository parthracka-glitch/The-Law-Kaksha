"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Calendar,
  Sparkles,
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowRight,
  Flame,
  Award,
  ChevronRight,
  Bookmark,
  Share2,
  RotateCcw,
} from "lucide-react";

interface ExamTarget {
  id: string;
  name: string;
  level: string;
  targetDate: string;
  syllabusCoverage: number;
  totalHoursNeeded: number;
}

const EXAM_TARGETS: ExamTarget[] = [
  {
    id: "ca-found",
    name: "CA Foundation Business Laws",
    level: "ICAI Paper 2 • 7 Chapters",
    targetDate: "2026-12-15T09:00:00",
    syllabusCoverage: 100,
    totalHoursNeeded: 120,
  },
  {
    id: "cseet",
    name: "CSEET Business Law & Management",
    level: "ICSI • 8 Units",
    targetDate: "2026-11-08T10:00:00",
    syllabusCoverage: 100,
    totalHoursNeeded: 80,
  },
];

interface MCQScenario {
  id: string;
  subject: string;
  statutoryRef: string;
  question: string;
  options: { text: string; isCorrect: boolean; pct: number }[];
  explanationTitle: string;
  explanation: string;
  keyDistinction: string;
}

const MCQ_POOL: MCQScenario[] = [
  {
    id: "mcq-1",
    subject: "Sale of Goods Act, 1930",
    statutoryRef: "Section 16(1) • Caveat Emptor Exception",
    question:
      "A buyer purchased a hot water bottle from a chemist. Upon first usage, it burst and scalded the buyer's wife. Buyer did not state any special purpose. Can the buyer claim damages under Section 16(1)?",
    options: [
      {
        text: "No, because the doctrine of Caveat Emptor strictly applies to all sales without express warranties.",
        isCorrect: false,
        pct: 18,
      },
      {
        text: "Yes, implied condition of fitness applies by implication since the good has only one obvious normal purpose.",
        isCorrect: true,
        pct: 72,
      },
      {
        text: "No, because the chemist gave no express written warranty card.",
        isCorrect: false,
        pct: 6,
      },
      {
        text: "Yes, but only under the general law of torts, not under Sale of Goods Act.",
        isCorrect: false,
        pct: 4,
      },
    ],
    explanationTitle: "Rule in Priest v. Last (1903)",
    explanation:
      "Where goods are capable of only one normal use (like a hot water bottle), the purpose for which they are required is communicated by implication. Relying on seller's skill/judgment triggers Section 16(1) implied condition as to fitness.",
    keyDistinction:
      "ICAI Tip: Don't forget to quote Priest v. Last along with Section 16(1) to secure full 6/6 marks.",
  },
  {
    id: "mcq-2",
    subject: "Indian Partnership Act, 1932",
    statutoryRef: "Section 28 • Holding Out",
    question:
      "Rajesh retired from M/s Apex Traders without giving public notice in the Official Gazette. Creditor Amit lends ₹5,00,000 believing Rajesh is still an active partner. Is Rajesh liable to Amit?",
    options: [
      {
        text: "No, retirement automatically extinguishes all partner liabilities from the date of resignation.",
        isCorrect: false,
        pct: 12,
      },
      {
        text: "Yes, doctrine of holding out makes him liable until public notice is published in the Official Gazette and vernacular paper.",
        isCorrect: true,
        pct: 81,
      },
      {
        text: "Only if he signed the loan promissory note personally.",
        isCorrect: false,
        pct: 4,
      },
      {
        text: "Only to the extent of his remaining unwithdrawn capital in the firm.",
        isCorrect: false,
        pct: 3,
      },
    ],
    explanationTitle: "Doctrine of Holding Out (§28 & §32)",
    explanation:
      "Under Section 28 & 32(3) of Indian Partnership Act, an outgoing partner continues to be liable to third parties for firm acts unless public notice of retirement is duly published.",
    keyDistinction:
      "Notice requirement does not apply to a dormant/sleeping partner not known to the third party.",
  },
  {
    id: "mcq-3",
    subject: "Companies Act, 2013",
    statutoryRef: "Section 8 • Non-Profit Entities",
    question:
      "Can a Section 8 Non-Profit Company declare and pay dividends to its members from accumulated surplus profits?",
    options: [
      {
        text: "Yes, up to 10% per annum with prior Central Government approval.",
        isCorrect: false,
        pct: 14,
      },
      {
        text: "No, Section 8(1)(c) explicitly prohibits payment of any dividend to its members.",
        isCorrect: true,
        pct: 79,
      },
      {
        text: "Yes, by passing a unanimous special resolution at an Extraordinary General Meeting (EGM).",
        isCorrect: false,
        pct: 5,
      },
      {
        text: "Yes, upon conversion into a private limited company within 3 years.",
        isCorrect: false,
        pct: 2,
      },
    ],
    explanationTitle: "Section 8(1)(c) Statutory Prohibition",
    explanation:
      "Section 8 companies must apply their profits in promoting their objects (commerce, art, science, sports, education, research, charity) and are strictly prohibited from paying dividends to members.",
    keyDistinction:
      "Violation of Section 8 terms can lead to license revocation and fine up to ₹1 Crore for the company.",
  },
  {
    id: "mcq-4",
    subject: "Indian Contract Act, 1872",
    statutoryRef: "Section 11 • Minor's Agreement",
    question:
      "A minor fraudulently represents himself to be of full age and executes a mortgage deed to borrow ₹50,000. Can the lender enforce the mortgage or seek personal decree against the minor?",
    options: [
      {
        text: "Yes, because the minor committed fraudulent misrepresentation.",
        isCorrect: false,
        pct: 22,
      },
      {
        text: "No, an agreement with a minor is void ab initio (Mohori Bibee v. Dharmodas Ghose), and rule of estoppel does not apply against a minor.",
        isCorrect: true,
        pct: 71,
      },
      {
        text: "Yes, lender can attach any ancestral property of the minor directly.",
        isCorrect: false,
        pct: 4,
      },
      {
        text: "Yes, upon the minor attaining the age of majority and ratifying the mortgage.",
        isCorrect: false,
        pct: 3,
      },
    ],
    explanationTitle: "Rule in Mohori Bibee v. Dharmodas Ghose (1903)",
    explanation:
      "A minor has no capacity to contract under Section 11. Any agreement with a minor is void ab initio. The doctrine of estoppel does not apply against a minor, nor can a minor's agreement be ratified upon attaining majority.",
    keyDistinction:
      "Under Section 68, only the estate (not personal) of a minor can be held liable for supply of necessaries suited to his condition in life.",
  },
  {
    id: "mcq-5",
    subject: "LLP Act, 2008",
    statutoryRef: "Section 7 • Designated Partners",
    question:
      "Under the Limited Liability Partnership Act 2008, every LLP must have at least two Designated Partners. What is the minimum stay requirement for the resident Designated Partner in India during the financial year?",
    options: [
      {
        text: "Not less than 182 days during the preceding financial year.",
        isCorrect: false,
        pct: 35,
      },
      {
        text: "Not less than 120 days during the financial year (as amended by LLP Amendment Act 2021).",
        isCorrect: true,
        pct: 58,
      },
      {
        text: "Not less than 90 days in the relevant calendar year.",
        isCorrect: false,
        pct: 4,
      },
      {
        text: "Continuous physical presence for 365 days in India.",
        isCorrect: false,
        pct: 3,
      },
    ],
    explanationTitle: "LLP Amendment Act 2021 — Section 7(1)",
    explanation:
      "As per the LLP (Amendment) Act, 2021, the requirement of residency for a designated partner in India was relaxed from 'not less than 182 days' to 'not less than 120 days during the financial year'.",
    keyDistinction:
      "ICAI New Scheme Traps: Always verify latest amendments (120 days vs old 182 days rule).",
  },
  {
    id: "mcq-6",
    subject: "Negotiable Instruments Act, 1881",
    statutoryRef: "Section 138 • Cheque Dishonour",
    question:
      "To initiate criminal proceedings under Section 138 for dishonour of a cheque for insufficiency of funds, within how many days of receipt of information from the bank must the payee give statutory demand notice to the drawer?",
    options: [
      {
        text: "Within 15 days of receiving the memo of dishonour.",
        isCorrect: false,
        pct: 25,
      },
      {
        text: "Within 30 days of receipt of information from the bank regarding return of unpaid cheque.",
        isCorrect: true,
        pct: 69,
      },
      {
        text: "Within 60 days from the date stamped on the cheque.",
        isCorrect: false,
        pct: 4,
      },
      {
        text: "Within 90 days under the Limitation Act.",
        isCorrect: false,
        pct: 2,
      },
    ],
    explanationTitle: "Section 138 Proviso (b) Timelines",
    explanation:
      "Under clause (b) of the proviso to Section 138 of the Negotiable Instruments Act 1881, the payee must make a written demand for payment within 30 days of receiving information from the bank regarding cheque bounce. The drawer then gets 15 days to make payment.",
    keyDistinction:
      "If the drawer fails to pay within 15 days of notice, the cause of action arises, and the complaint must be filed in court within 1 month.",
  },
  {
    id: "mcq-7",
    subject: "Indian Regulatory Framework",
    statutoryRef: "Chapter 1 • Sources & Precedence of Law",
    question:
      "Under the Constitution of India and Indian Judicial Architecture, the law declared by the Supreme Court is binding on all courts within the territory of India under which Article?",
    options: [
      {
        text: "Article 226",
        isCorrect: false,
        pct: 10,
      },
      {
        text: "Article 141 (Doctrine of Stare Decisis)",
        isCorrect: true,
        pct: 78,
      },
      {
        text: "Article 32",
        isCorrect: false,
        pct: 8,
      },
      {
        text: "Article 300A",
        isCorrect: false,
        pct: 4,
      },
    ],
    explanationTitle: "Article 141 of the Constitution of India",
    explanation:
      "Article 141 provides that the law declared by the Supreme Court shall be binding on all courts within the territory of India. This establishes the doctrine of precedent (Stare Decisis) in Indian jurisprudence.",
    keyDistinction:
      "Decisions of a High Court are binding on all subordinate courts in that State, but have only persuasive value for other High Courts.",
  },
];

export function ExamCountdownsAndQOTD() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const [examTargets, setExamTargets] = useState<ExamTarget[]>(EXAM_TARGETS);
  const [mcqList, setMcqList] = useState<MCQScenario[]>(MCQ_POOL);
  const [selectedExamId, setSelectedExamId] = useState<string>("ca-found");
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [bookmarkedList, setBookmarkedList] = useState<Record<string, boolean>>({});

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Fetch live exam countdowns and QOTD from MongoDB Atlas
  useEffect(() => {
    async function fetchLiveSiteData() {
      try {
        const res = await fetch(`${API_URL}/api/public/site-data`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success) {
          if (Array.isArray(data.examSettings) && data.examSettings.length > 0) {
            const normalized: ExamTarget[] = data.examSettings.map((e: any) => ({
              id: e.id || `exam-${Math.random()}`,
              name: e.name || e.exam || "CA Foundation Business Laws",
              level: e.level || e.session || "ICAI Paper 2 • 7 Chapters",
              targetDate: e.targetDate || (e.date ? (e.date.includes("T") ? e.date : `${e.date}T09:00:00`) : "2026-12-15T09:00:00"),
              syllabusCoverage: e.syllabusCoverage ?? 100,
              totalHoursNeeded: e.totalHoursNeeded ?? 120,
            }));
            setExamTargets(normalized);
            if (!normalized.some((e) => e.id === selectedExamId)) {
              setSelectedExamId(normalized[0].id);
            }
          }
          if (data.qotd && data.qotd.question) {
            const formattedLiveQotd: MCQScenario = {
              id: "live-qotd",
              subject: data.qotd.subject || data.qotd.act || "Daily Legal Drill",
              statutoryRef: data.qotd.statutoryRef || data.qotd.section || "High Yield Topic",
              question: data.qotd.question,
              options: Array.isArray(data.qotd.options)
                ? data.qotd.options.map((opt: any, idx: number) => ({
                    text: typeof opt === "string" ? opt : opt.text,
                    isCorrect: idx === (data.qotd.correctOption ?? 0) || Boolean(opt.isCorrect),
                    pct: typeof opt === "object" && opt.pct ? opt.pct : (idx === (data.qotd.correctOption ?? 0) ? 78 : 7),
                  }))
                : MCQ_POOL[0].options,
              explanationTitle: data.qotd.explanationTitle || "Concept Rationale",
              explanation: data.qotd.explanation || "Direct statutory interpretation.",
              keyDistinction: data.qotd.keyDistinction || "Admin Verified Practice Question.",
            };
            setMcqList([formattedLiveQotd, ...MCQ_POOL]);
          }
        }
      } catch (e) {
        // Fallback silently to pre-bundled local data
      }
    }
    fetchLiveSiteData();
  }, [API_URL, selectedExamId]);

  const activeExam =
    examTargets.find((e) => e.id === selectedExamId) || examTargets[0] || EXAM_TARGETS[0];
  const activeMCQ = mcqList[activeQuestionIdx] || MCQ_POOL[0];

  // Dynamic Countdown Timer Calculation
  useEffect(() => {
    const calculateTime = () => {
      const examDateStr = activeExam?.targetDate || (activeExam as any)?.date || "2026-12-15T09:00:00";
      const targetDate = examDateStr.includes("T") ? examDateStr : `${examDateStr}T09:00:00`;
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [activeExam]);

  const handleToggleBookmark = (id: string) => {
    setBookmarkedList((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setActiveQuestionIdx((prev) => (prev + 1) % mcqList.length);
  };

  const handleResetQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
  };

  return (
    <section
      id="countdown-qotd"
      className="py-12 md:py-16 bg-[#F7F7F5]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C4E1EC]/60 border border-[#AED7E9] text-[#221D1D] text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-[#221D1D]" />
            <span>Exam Timelines &amp; Daily Practice</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#221D1D] tracking-tight">
            Stay on Track for Your Upcoming Attempt
          </h2>
          <p className="text-xs sm:text-sm text-[#77716E]">
            Check your remaining preparation days and practice law questions daily.
          </p>
        </div>

        {/* 2-Column Responsive Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ======================================================== */}
          {/* 1. LEFT CARD: EXAM COUNTDOWN & TIMELINE TRACKER (5 Cols) */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 rounded-3xl bg-white border border-[#E7E4E7] p-5 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5 sm:space-y-6">
            
            {/* Header & Course Switcher */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#77716E]">
                  Target Exam
                </span>
                <span className="text-xs font-bold text-[#221D1D] bg-[#AED7E9]/40 px-2.5 py-0.5 rounded-full border border-[#AED7E9] flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#221D1D]" /> Live Countdown
                </span>
              </div>

              {/* Course Selection Tabs */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7]">
                {examTargets.map((exam) => {
                  const examName = exam?.name || (exam as any)?.exam || "";
                  const isCA = examName.toLowerCase().includes("ca") || (exam?.id || "").includes("ca");
                  return (
                    <button
                      key={exam.id}
                      onClick={() => setSelectedExamId(exam.id)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer text-center truncate min-h-[44px] flex items-center justify-center ${
                        selectedExamId === exam.id
                          ? "bg-white text-[#221D1D] shadow-xs font-bold"
                          : "text-[#77716E] hover:text-[#221D1D]"
                      }`}
                    >
                      {isCA ? "CA Foundation" : "CSEET Law"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Exam Title & Details */}
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-[#221D1D] tracking-tight">
                {activeExam?.name || (activeExam as any)?.exam || "CA Foundation Business Laws"}
              </h3>
              <p className="text-xs text-[#77716E]">{activeExam?.level || (activeExam as any)?.session || "ICAI Paper 2 • 7 Chapters"}</p>
            </div>

            {/* 4-Digit Timer Block */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7]">
                <div className="text-xl sm:text-3xl font-bold text-[#221D1D] font-mono tracking-tight">
                  {timeLeft.days}
                </div>
                <div className="text-[10px] uppercase font-bold text-[#77716E] tracking-wider mt-0.5">
                  Days
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7]">
                <div className="text-xl sm:text-3xl font-bold text-[#221D1D] font-mono tracking-tight">
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <div className="text-[10px] uppercase font-bold text-[#77716E] tracking-wider mt-0.5">
                  Hours
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7]">
                <div className="text-xl sm:text-3xl font-bold text-[#221D1D] font-mono tracking-tight">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <div className="text-[10px] uppercase font-bold text-[#77716E] tracking-wider mt-0.5">
                  Mins
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7]">
                <div className="text-xl sm:text-3xl font-bold text-[#221D1D] font-mono tracking-tight">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </div>
                <div className="text-[10px] uppercase font-bold text-[#77716E] tracking-wider mt-0.5">
                  Secs
                </div>
              </div>
            </div>

            {/* Preparation Roadmap Progress */}
            <div className="space-y-3 pt-2 border-t border-[#E7E4E7]">
              <div className="flex items-center justify-between text-xs text-[#4D433F]">
                <span>Syllabus Coverage:</span>
                <span className="font-bold text-[#221D1D]">
                  100% Comprehensive
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#F7F7F5] overflow-hidden">
                <div className="h-full bg-[#AED7E9] rounded-full w-full" />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Link
                  href="/student"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-bold transition-all shadow-xs min-h-[44px]"
                >
                  <span>Open Student Learning Desk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* 2. RIGHT CARD: DAILY HIGH-YIELD MCQ CHALLENGE (7 Cols)   */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 rounded-3xl bg-white border border-[#E7E4E7] p-5 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4 sm:space-y-5">
            
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#AED7E9] animate-pulse" />
                <span className="text-xs font-bold text-[#221D1D]">
                  Daily High-Yield Case Challenge
                </span>
              </div>

              {/* Bookmark for LDR Button */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleBookmark(activeMCQ.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer min-h-[36px] ${
                    bookmarkedList[activeMCQ.id]
                      ? "bg-[#BFAFE5]/30 text-[#221D1D] border border-[#BFAFE5]"
                      : "bg-[#F7F7F5] text-[#77716E] hover:text-[#221D1D] hover:bg-[#E7E4E7]/60 border border-[#E7E4E7]"
                  }`}
                  title="Bookmark for Last Day Revision (LDR)"
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 ${
                      bookmarkedList[activeMCQ.id] ? "fill-current text-[#221D1D]" : "text-[#77716E]"
                    }`}
                  />
                  <span>
                    {bookmarkedList[activeMCQ.id] ? "Bookmarked LDR" : "Bookmark LDR"}
                  </span>
                </button>
              </div>
            </div>

            {/* Subject Pill & Question Index Switcher */}
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center text-[11px] font-bold text-[#221D1D] bg-[#AED7E9]/40 border border-[#AED7E9] px-2.5 py-0.5 rounded-full">
                {activeMCQ.subject}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-[#77716E]">
                <span>
                  Q{activeQuestionIdx + 1} of {MCQ_POOL.length}
                </span>
                <button
                  onClick={handleNextQuestion}
                  className="text-[#77716E] hover:text-[#221D1D] p-1 rounded-full hover:bg-[#F7F7F5] transition-colors cursor-pointer"
                  title="Next Case Scenario"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Question Text */}
            <h4 className="text-xs sm:text-sm font-semibold text-[#221D1D] leading-relaxed">
              {activeMCQ.question}
            </h4>

            {/* MCQ Options with Percentage Bars */}
            <div className="space-y-2">
              {activeMCQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const letter = String.fromCharCode(65 + idx);

                let cardClasses =
                  "relative overflow-hidden w-full text-left p-3 sm:p-3 rounded-2xl border text-xs transition-all duration-200 cursor-pointer min-h-[44px] ";

                if (!isAnswered) {
                  cardClasses +=
                    "bg-white border-[#E7E4E7] text-[#221D1D] hover:border-[#AED7E9] hover:bg-[#F7F7F5]";
                } else {
                  if (opt.isCorrect) {
                    cardClasses +=
                      "bg-[#AED7E9]/30 border-[#AED7E9] text-[#221D1D] font-bold";
                  } else if (isSelected && !opt.isCorrect) {
                    cardClasses +=
                      "bg-[#F4C5C0]/40 border-[#C35F3B]/50 text-[#221D1D] font-semibold";
                  } else {
                    cardClasses +=
                      "bg-[#F7F7F5] border-[#E7E4E7] text-[#77716E] opacity-75";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => {
                      setSelectedOption(idx);
                      setIsAnswered(true);
                    }}
                    className={cardClasses}
                  >
                    {/* Background Poll Bar when answered */}
                    {isAnswered && (
                      <div
                        className={`absolute top-0 bottom-0 left-0 transition-all duration-700 opacity-20 ${
                          opt.isCorrect
                            ? "bg-[#AED7E9]"
                            : isSelected
                            ? "bg-[#C35F3B]"
                            : "bg-[#77716E]"
                        }`}
                        style={{ width: `${opt.pct}%` }}
                      />
                    )}

                    <div className="relative z-10 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                            isAnswered
                              ? opt.isCorrect
                                ? "bg-[#AED7E9] text-[#221D1D]"
                                : isSelected
                                ? "bg-[#C35F3B] text-white"
                                : "bg-[#E7E4E7] text-[#77716E]"
                              : "bg-[#F7F7F5] text-[#4D433F] border border-[#E7E4E7]"
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="leading-snug">{opt.text}</span>
                      </div>

                      {/* Right feedback icon & percentage */}
                      {isAnswered && (
                        <div className="flex items-center gap-1.5 shrink-0 pl-2">
                          <span className="text-[11px] font-mono font-bold text-[#221D1D]">
                            {opt.pct}%
                          </span>
                          {opt.isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-[#221D1D] shrink-0" />
                          ) : isSelected ? (
                            <XCircle className="w-4 h-4 text-[#C35F3B] shrink-0" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Statutory Explanation Card */}
            {isAnswered && (
              <div className="p-4 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7] space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#221D1D]" />
                    <span className="text-xs font-bold text-[#221D1D]">
                      {activeMCQ.explanationTitle}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#221D1D] bg-[#AED7E9]/40 px-2 py-0.5 rounded-full border border-[#AED7E9] font-bold">
                    {activeMCQ.statutoryRef}
                  </span>
                </div>

                <p className="text-xs text-[#4D433F] leading-relaxed">
                  {activeMCQ.explanation}
                </p>

                <div className="pt-1.5 text-[11px] text-[#77716E] border-t border-[#E7E4E7] flex items-start gap-1.5">
                  <span className="font-bold text-[#221D1D] shrink-0">Examiner Rule:</span>
                  <span>{activeMCQ.keyDistinction}</span>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#E7E4E7]">
                  <button
                    onClick={handleResetQuestion}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#77716E] hover:text-[#221D1D] transition-colors cursor-pointer min-h-[44px] px-2"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Try Again</span>
                  </button>

                  <button
                    onClick={handleNextQuestion}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#221D1D] bg-[#BFAFE5] hover:bg-[#A08DC9] px-3.5 py-1.5 rounded-full transition-colors cursor-pointer min-h-[36px]"
                  >
                    <span>Next Case Scenario</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
