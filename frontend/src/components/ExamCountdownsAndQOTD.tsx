"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getApiBaseUrl, type JsonObject } from "@/lib/api";
import {
  Clock,
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowRight,
  Flame,
  ChevronRight,
  Bookmark,
  RotateCcw,
} from "lucide-react";

interface ExamTarget {
  id: string;
  name: string;
  level: string;
  targetDate: string;
  syllabusCoverage: number;
  totalHoursNeeded: number;
  buttonText?: string;
  buttonUrl?: string;
  exam?: string;
  session?: string;
  date?: string;
}

interface ExamSettingPayload extends JsonObject {
  id?: string;
  name?: string;
  exam?: string;
  level?: string;
  session?: string;
  targetDate?: string;
  date?: string;
  syllabusCoverage?: number;
  totalHoursNeeded?: number;
  buttonText?: string;
  buttonUrl?: string;
}

interface McqOptionPayload extends JsonObject {
  text?: string;
  isCorrect?: boolean;
  pct?: number;
}

interface QotdPayload extends JsonObject {
  subject?: string;
  act?: string;
  statutoryRef?: string;
  section?: string;
  question?: string;
  options?: Array<string | McqOptionPayload>;
  correctOption?: number;
  explanationTitle?: string;
  explanation?: string;
  keyDistinction?: string;
}

interface SiteDataPayload extends JsonObject {
  success?: boolean;
  examSettings?: ExamSettingPayload[];
  mcqPool?: MCQScenario[];
  qotd?: QotdPayload;
}

const EXAM_TARGETS: ExamTarget[] = [
  {
    id: "ca-found",
    name: "CA Foundation Business Laws",
    level: "ICAI Paper 2 • 7 Chapters",
    targetDate: "2026-12-15T09:00:00",
    syllabusCoverage: 100,
    totalHoursNeeded: 120,
    buttonText: "Open Student Learning Desk",
    buttonUrl: "/student",
  },
  {
    id: "cseet",
    name: "CSEET Business Laws and Management",
    level: "ICSI • 8 Units",
    targetDate: "2026-11-08T10:00:00",
    syllabusCoverage: 100,
    totalHoursNeeded: 80,
    buttonText: "Open Student Learning Desk",
    buttonUrl: "/student",
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
  const API_URL = getApiBaseUrl();
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
        const data: SiteDataPayload = await res.json();
        if (data.success) {
          if (Array.isArray(data.examSettings) && data.examSettings.length > 0) {
            const normalized: ExamTarget[] = data.examSettings.map((e) => ({
              id: e.id || `exam-${Math.random()}`,
              name: e.name || e.exam || "CA Foundation Business Laws",
              level: e.level || e.session || "ICAI Paper 2 • 7 Chapters",
              targetDate: e.targetDate || (e.date ? (e.date.includes("T") ? e.date : `${e.date}T09:00:00`) : "2026-12-15T09:00:00"),
              syllabusCoverage: e.syllabusCoverage ?? 100,
              totalHoursNeeded: e.totalHoursNeeded ?? 120,
              buttonText: e.buttonText || "Open Student Learning Desk",
              buttonUrl: e.buttonUrl || "/student",
            }));
            setExamTargets(normalized);
            if (!normalized.some((e) => e.id === selectedExamId)) {
              setSelectedExamId(normalized[0].id);
            }
          }
          if (Array.isArray(data.mcqPool) && data.mcqPool.length > 0) {
            setMcqList(data.mcqPool);
          } else if (data.qotd && data.qotd.question) {
            const correctIndex = data.qotd.correctOption ?? 0;
            const formattedLiveQotd: MCQScenario = {
              id: "live-qotd",
              subject: data.qotd.subject || data.qotd.act || "Daily Legal Drill",
              statutoryRef: data.qotd.statutoryRef || data.qotd.section || "High Yield Topic",
              question: data.qotd.question,
              options: Array.isArray(data.qotd.options)
                ? data.qotd.options.map((opt, idx) => {
                    if (typeof opt === "string") {
                      return {
                        text: opt,
                        isCorrect: idx === correctIndex,
                        pct: idx === correctIndex ? 78 : 7,
                      };
                    }
                    return {
                      text: opt.text ?? "",
                      isCorrect: idx === correctIndex || Boolean(opt.isCorrect),
                      pct: opt.pct ? opt.pct : idx === correctIndex ? 78 : 7,
                    };
                  })
                : MCQ_POOL[0].options,
              explanationTitle: data.qotd.explanationTitle || "Concept Rationale",
              explanation: data.qotd.explanation || "Direct statutory interpretation.",
              keyDistinction: data.qotd.keyDistinction || "Admin Verified Practice Question.",
            };
            setMcqList([formattedLiveQotd, ...MCQ_POOL]);
          }
        }
      } catch {
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
      const examDateStr = activeExam?.targetDate || activeExam?.date || "2026-12-15T09:00:00";
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
      className="py-14 sm:py-20 bg-gradient-to-b from-[#F0F7FF] via-white to-[#F8FAFC] text-[#0A192F] relative overflow-hidden border-t border-[#DBEAFE]"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#005A9C] text-xs font-bold tracking-wide uppercase shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-[#005A9C]" />
            <span>Exam Timelines &amp; Daily Practice</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight">
            Stay on Track for Your Upcoming Attempt
          </h2>

          <p className="text-xs sm:text-sm text-[#475569] max-w-xl mx-auto leading-relaxed">
            Real-time ICAI &amp; ICSI exam countdowns paired with examiner-tested daily case scenario practice.
          </p>
        </div>

        {/* 2-Column Responsive Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ======================================================== */}
          {/* 1. LEFT CARD: EXAM COUNTDOWN & TIMELINE TRACKER (5 Cols) */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 rounded-3xl bg-white/95 backdrop-blur-md border border-[#DBEAFE] p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,90,156,0.06)] hover:shadow-[0_12px_40px_rgba(0,90,156,0.1)] transition-all duration-300 space-y-6 relative overflow-hidden group">
            {/* Top decorative gradient bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#005A9C] via-[#38BDF8] to-[#0A192F] absolute top-0 left-0" />

            {/* Header & Course Switcher */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  Target Exam
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <Flame className="w-3 h-3 text-amber-500" />
                  <span>Live Countdown</span>
                </span>
              </div>

              {/* Course Selection Segmented Tabs */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0]">
                {examTargets.map((exam) => {
                  const examName = exam?.name || exam?.exam || "";
                  const isCA = examName.toLowerCase().includes("ca") || (exam?.id || "").includes("ca");
                  const isSelected = selectedExamId === exam.id;

                  return (
                    <button
                      key={exam.id}
                      onClick={() => setSelectedExamId(exam.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer text-center truncate min-h-[40px] flex items-center justify-center ${
                        isSelected
                          ? "bg-[#005A9C] text-white shadow-xs"
                          : "text-[#64748B] hover:text-[#0A192F] hover:bg-white/60"
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
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0A192F] tracking-tight">
                {activeExam?.name || activeExam?.exam || "CA Foundation Business Laws"}
              </h3>
              <p className="text-xs text-[#64748B] font-medium">
                {activeExam?.level || activeExam?.session || "ICAI Paper 2 • 7 Chapters"}
              </p>
            </div>

            {/* 4-Digit Luxury Timer Block */}
            <div className="grid grid-cols-4 gap-2 sm:gap-2.5 text-center">
              <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-[#EFF6FF] border border-[#DBEAFE] hover:border-[#93C5FD] transition-all shadow-2xs">
                <div className="text-2xl sm:text-3xl font-black text-[#0A192F] font-mono tracking-tight">
                  {timeLeft.days}
                </div>
                <div className="text-[10px] uppercase font-extrabold text-[#005A9C] tracking-wider mt-1">
                  Days
                </div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-[#EFF6FF] border border-[#DBEAFE] hover:border-[#93C5FD] transition-all shadow-2xs">
                <div className="text-2xl sm:text-3xl font-black text-[#0A192F] font-mono tracking-tight">
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <div className="text-[10px] uppercase font-extrabold text-[#005A9C] tracking-wider mt-1">
                  Hours
                </div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-[#EFF6FF] border border-[#DBEAFE] hover:border-[#93C5FD] transition-all shadow-2xs">
                <div className="text-2xl sm:text-3xl font-black text-[#0A192F] font-mono tracking-tight">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <div className="text-[10px] uppercase font-extrabold text-[#005A9C] tracking-wider mt-1">
                  Mins
                </div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-[#EFF6FF] border border-[#DBEAFE] hover:border-[#93C5FD] transition-all shadow-2xs">
                <div className="text-2xl sm:text-3xl font-black text-[#0A192F] font-mono tracking-tight text-[#005A9C]">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </div>
                <div className="text-[10px] uppercase font-extrabold text-[#005A9C] tracking-wider mt-1">
                  Secs
                </div>
              </div>
            </div>

            {/* Preparation Roadmap Progress */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-[#475569]">
                <span>Syllabus Coverage:</span>
                <span className="font-bold text-[#0A192F]">
                  {activeExam?.syllabusCoverage ?? 100}% Comprehensive
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#005A9C] to-[#38BDF8] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(activeExam?.syllabusCoverage ?? 100, 100)}%` }}
                />
              </div>

              <div className="pt-2">
                <Link
                  href={activeExam?.buttonUrl || "/student"}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#005A9C] to-[#004880] hover:from-[#004880] hover:to-[#0A192F] text-white text-xs font-bold transition-all shadow-[0_4px_14px_rgba(0,90,156,0.25)] hover:shadow-[0_6px_20px_rgba(0,90,156,0.35)] active:scale-98 cursor-pointer"
                >
                  <span>{activeExam?.buttonText || "Open Student Learning Desk"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* 2. RIGHT CARD: DAILY HIGH-YIELD MCQ CHALLENGE (7 Cols)   */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 rounded-3xl bg-white/95 backdrop-blur-md border border-[#DBEAFE] p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,90,156,0.06)] hover:shadow-[0_12px_40px_rgba(0,90,156,0.1)] transition-all duration-300 space-y-5 relative overflow-hidden">
            {/* Top decorative gradient bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#38BDF8] via-[#005A9C] to-[#0A192F] absolute top-0 left-0" />

            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-[#0A192F]">
                  Daily High-Yield Case Challenge
                </span>
              </div>

              {/* Bookmark for LDR Button */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleBookmark(activeMCQ.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer min-h-[34px] ${
                    bookmarkedList[activeMCQ.id]
                      ? "bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs"
                      : "bg-[#F8FAFC] text-[#64748B] hover:text-[#0A192F] hover:bg-[#EFF6FF] border border-[#E2E8F0]"
                  }`}
                  title="Bookmark for Last Day Revision (LDR)"
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 ${
                      bookmarkedList[activeMCQ.id] ? "fill-amber-500 text-amber-500" : "text-[#64748B]"
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
              <span className="inline-flex items-center text-[11px] font-bold text-[#005A9C] bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-1 rounded-full shadow-2xs">
                {activeMCQ.subject}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <span className="font-semibold text-[#0A192F]">
                  Q{activeQuestionIdx + 1} of {mcqList.length}
                </span>
                <button
                  onClick={handleNextQuestion}
                  className="text-[#64748B] hover:text-[#005A9C] p-1.5 rounded-full hover:bg-[#EFF6FF] transition-colors cursor-pointer"
                  title="Next Case Scenario"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Question Text */}
            <h4 className="font-serif text-sm sm:text-[15px] font-bold text-[#0A192F] leading-relaxed">
              {activeMCQ.question}
            </h4>

            {/* MCQ Options with Percentage Bars */}
            <div className="space-y-2.5">
              {activeMCQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const letter = String.fromCharCode(65 + idx);

                let cardClasses =
                  "relative overflow-hidden w-full text-left p-3.5 rounded-2xl border text-xs transition-all duration-200 cursor-pointer min-h-[46px] group ";

                if (!isAnswered) {
                  cardClasses +=
                    "bg-white border-[#E2E8F0] text-[#0A192F] hover:border-[#005A9C] hover:bg-[#F8FAFC] hover:shadow-xs";
                } else {
                  if (opt.isCorrect) {
                    cardClasses +=
                      "bg-emerald-50/90 border-2 border-emerald-500 text-emerald-950 font-bold shadow-xs";
                  } else if (isSelected && !opt.isCorrect) {
                    cardClasses +=
                      "bg-rose-50/90 border-2 border-rose-500 text-rose-950 font-semibold";
                  } else {
                    cardClasses +=
                      "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] opacity-75";
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
                        className={`absolute top-0 bottom-0 left-0 transition-all duration-700 opacity-25 ${
                          opt.isCorrect
                            ? "bg-emerald-400"
                            : isSelected
                            ? "bg-rose-400"
                            : "bg-slate-300"
                        }`}
                        style={{ width: `${opt.pct}%` }}
                      />
                    )}

                    <div className="relative z-10 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                            isAnswered
                              ? opt.isCorrect
                                ? "bg-emerald-600 text-white"
                                : isSelected
                                ? "bg-rose-600 text-white"
                                : "bg-[#E2E8F0] text-[#64748B]"
                              : "bg-[#EFF6FF] text-[#005A9C] border border-[#BFDBFE] group-hover:bg-[#005A9C] group-hover:text-white"
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="leading-snug text-xs sm:text-[13px]">{opt.text}</span>
                      </div>

                      {/* Right feedback icon & percentage */}
                      {isAnswered && (
                        <div className="flex items-center gap-1.5 shrink-0 pl-2">
                          <span className="text-[11px] font-mono font-bold text-[#0A192F]">
                            {opt.pct}%
                          </span>
                          {opt.isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : isSelected ? (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
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
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#F8FAFC] via-[#EFF6FF]/40 to-white border border-[#BFDBFE] space-y-3 shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#EFF6FF] text-[#005A9C] flex items-center justify-center">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#0A192F]">
                      {activeMCQ.explanationTitle}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#005A9C] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#BFDBFE] font-bold">
                    {activeMCQ.statutoryRef}
                  </span>
                </div>

                <p className="text-xs text-[#475569] leading-relaxed">
                  {activeMCQ.explanation}
                </p>

                <div className="pt-2 text-[11px] text-[#475569] border-t border-slate-200/80 flex items-start gap-1.5 bg-[#EFF6FF]/50 p-2.5 rounded-xl border border-[#DBEAFE]">
                  <span className="font-bold text-[#005A9C] shrink-0">Examiner Rule:</span>
                  <span className="text-[#334155]">{activeMCQ.keyDistinction}</span>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <button
                    onClick={handleResetQuestion}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0A192F] transition-colors cursor-pointer min-h-[38px] px-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>

                  <button
                    onClick={handleNextQuestion}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#005A9C] hover:bg-[#004880] px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer min-h-[36px]"
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
