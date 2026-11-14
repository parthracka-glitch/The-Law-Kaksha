"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Flame,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Save,
  RotateCcw,
} from "lucide-react";

export interface ExamTargetItem {
  id: string;
  name: string;
  level: string;
  targetDate: string;
  syllabusCoverage: number;
  totalHoursNeeded: number;
  buttonText?: string;
  buttonUrl?: string;
}

export interface MCQOptionItem {
  text: string;
  isCorrect: boolean;
  pct: number;
}

export interface MCQScenarioItem {
  id: string;
  subject: string;
  statutoryRef: string;
  question: string;
  options: MCQOptionItem[];
  explanationTitle: string;
  explanation: string;
  keyDistinction: string;
}

interface RawExamSetting {
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

interface ExamSettingsResponse {
  examSettings?: unknown;
}

interface McqPoolResponse {
  mcqPool?: unknown;
}

function toRawExamSetting(value: unknown): RawExamSetting {
  if (typeof value !== "object" || value === null) {
    return {};
  }
  return value as RawExamSetting;
}

const DEFAULT_EXAMS: ExamTargetItem[] = [
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

const DEFAULT_MCQS: MCQScenarioItem[] = [
  {
    id: "mcq-1",
    subject: "Indian Contract Act, 1872",
    statutoryRef: "Section 2(d) & Privity • Stranger to Consideration",
    question:
      "Ramesh promised to pay his daughter Priya a monthly allowance if she transferred her warehouse to her brother Suresh. Priya transferred the warehouse. Later, Ramesh refused to pay Priya, arguing Suresh furnished no consideration. Can Priya enforce the promise against Ramesh?",
    options: [
      {
        text: "No, because consideration must strictly proceed directly from the promisee herself under general English common law.",
        isCorrect: false,
        pct: 14,
      },
      {
        text: "Yes, under Section 2(d) of the Indian Contract Act, consideration may move from the promisee or any other person (Chinnaya v. Ramayya).",
        isCorrect: true,
        pct: 78,
      },
      {
        text: "No, because family arrangements require registration under Section 17 of the Registration Act to be enforceable.",
        isCorrect: false,
        pct: 5,
      },
      {
        text: "Yes, but only under the law of torts as an action for promissory restitution.",
        isCorrect: false,
        pct: 3,
      },
    ],
    explanationTitle: "Rule in Chinnaya v. Ramayya (1882) & Section 2(d)",
    explanation:
      "Under Section 2(d) of the Indian Contract Act, 1872, consideration can move from 'the promisee or any other person'. In India, a stranger to consideration can sue, provided there is privity of contract between the litigating parties.",
    keyDistinction:
      "ICAI Tip: Clearly distinguish 'Stranger to Consideration' (valid in India) from 'Stranger to Contract' (cannot sue unless an exception like trust applies).",
  },
  {
    id: "mcq-2",
    subject: "Companies Act, 2013",
    statutoryRef: "Section 2(85) • Small Company Criteria",
    question:
      "Zenith FinTech Pvt. Ltd. has a paid-up share capital of ₹3.50 Crore and turnover of ₹32 Crore as per its latest audited profit and loss statement. It is a 100% wholly-owned subsidiary of Global Capital Ltd. Does Zenith FinTech Pvt. Ltd. qualify as a 'Small Company'?",
    options: [
      {
        text: "Yes, because its paid-up capital does not exceed ₹4 Crore and turnover does not exceed ₹40 Crore.",
        isCorrect: false,
        pct: 22,
      },
      {
        text: "No, because the proviso to Section 2(85) explicitly excludes any holding or subsidiary company from being classified as a Small Company.",
        isCorrect: true,
        pct: 72,
      },
      {
        text: "Yes, provided its holding company passes an ordinary resolution giving explicit consent.",
        isCorrect: false,
        pct: 4,
      },
      {
        text: "No, because the statutory turnover cap for a Small Company is strictly ₹20 Crore under the original 2013 Act.",
        isCorrect: false,
        pct: 2,
      },
    ],
    explanationTitle: "Section 2(85) Proviso — Statutory Exclusions",
    explanation:
      "Under Section 2(85) of Companies Act, 2013 (as amended), paid-up capital must not exceed ₹4 Crore and turnover must not exceed ₹40 Crore. However, the proviso states that nothing in this clause applies to: (A) a holding company or a subsidiary company; (B) a Section 8 company; or (C) a company governed by any special Act.",
    keyDistinction:
      "ICAI Exam Trap: Never stop after checking the ₹4 Crore / ₹40 Crore numerical thresholds — always verify whether the company is a holding or subsidiary entity under the proviso!",
  },
  {
    id: "mcq-3",
    subject: "Sale of Goods Act, 1930",
    statutoryRef: "Section 27 Proviso • Sale by Mercantile Agent",
    question:
      "Akash delivered his car to Tarun, a licensed automobile dealer, with strict instructions not to sell the car below ₹8,00,000 without prior written consent. Tarun dishonestly sold and delivered the car to Rohan for ₹6,50,000, who bought it in good faith without knowing of the price restriction. Can Akash recover the car from Rohan?",
    options: [
      {
        text: "Yes, under 'Nemo dat quod non habet' (Section 27), the agent had no legal authority to sell below the mandated reserve price.",
        isCorrect: false,
        pct: 19,
      },
      {
        text: "No, Rohan acquires a valid title under Section 27 proviso because Tarun was in possession as a mercantile agent with owner consent and Rohan bought in good faith.",
        isCorrect: true,
        pct: 75,
      },
      {
        text: "Yes, because selling below the minimum price renders the sale void ab initio for lack of free consent.",
        isCorrect: false,
        pct: 4,
      },
      {
        text: "No, but only if Akash recovers the remaining ₹1,50,000 price deficit directly from the Motor Vehicles Tribunal.",
        isCorrect: false,
        pct: 2,
      },
    ],
    explanationTitle: "Section 27 Proviso & Rule in Folkes v. King (1923)",
    explanation:
      "Under the proviso to Section 27 of Sale of Goods Act, 1930, where a mercantile agent is in possession of goods with owner consent, any sale made by him in the ordinary course of business is valid, provided the buyer acts in good faith and without notice of lack of authority.",
    keyDistinction:
      "ICAI Landmark Precedent: Folkes v. King. Even if the agent breached instructions regarding the minimum selling price, the innocent bona fide buyer's title is protected.",
  },
  {
    id: "mcq-4",
    subject: "Indian Partnership Act, 1932",
    statutoryRef: "Section 30 • Minor Admitted to Partnership Benefits",
    question:
      "Karan was admitted to the benefits of a partnership firm on 1st January 2023 when he was 16 years old. Karan attained majority on 15th March 2025. He did not give any public notice within six months of attaining majority. What is Karan's legal status and liability under Section 30?",
    options: [
      {
        text: "He is automatically treated as having severed all ties with the firm upon expiry of six months.",
        isCorrect: false,
        pct: 14,
      },
      {
        text: "He automatically becomes a full partner under Section 30(5), and becomes personally liable for all firm acts retrospectively from 1st January 2023.",
        isCorrect: true,
        pct: 75,
      },
      {
        text: "He becomes a partner, but his personal liability only commences from the date he attained majority (15th March 2025).",
        isCorrect: false,
        pct: 8,
      },
      {
        text: "His liability remains strictly limited to his capital share because he never signed the original partnership deed.",
        isCorrect: false,
        pct: 3,
      },
    ],
    explanationTitle: "Section 30(5) & Section 30(7) — Retrospective Personal Liability",
    explanation:
      "Under Section 30(5) of the Indian Partnership Act, 1932, a minor who fails to give public notice within 6 months of attaining majority automatically becomes a partner. Under Section 30(7)(a), his personal liability extends retrospectively to all acts of the firm done since he was first admitted to benefits.",
    keyDistinction:
      "Critical ICAI Point: Retrospective personal liability goes all the way back to the date he was admitted to benefits, NOT just from the date he became an adult!",
  },
  {
    id: "mcq-5",
    subject: "Limited Liability Partnership Act, 2008",
    statutoryRef: "Section 6 & Section 7 • Minimum Partners & Reduced Membership",
    question:
      "Apex Logistics LLP had only two partners, Aman and Bharat. Bharat met with an untimely demise on 1st January 2026. Aman continued to carry on the business of the LLP as sole member until 1st November 2026 (10 months). What is Aman's personal liability for obligations contracted in September 2026?",
    options: [
      {
        text: "Aman enjoys perpetual limited liability because an LLP is an incorporated body corporate distinct from its partners.",
        isCorrect: false,
        pct: 17,
      },
      {
        text: "Aman is personally liable for all debts and obligations incurred after 1st July 2026 (the expiry of 6 months) under Section 6(2).",
        isCorrect: true,
        pct: 76,
      },
      {
        text: "Aman's liability is capped at ₹5,00,000 as per the LLP (Amendment) Act 2021 penalty matrix.",
        isCorrect: false,
        pct: 4,
      },
      {
        text: "The LLP's incorporation certificate became void ab initio on the date Bharat passed away.",
        isCorrect: false,
        pct: 3,
      },
    ],
    explanationTitle: "Section 6(2) of Limited Liability Partnership Act, 2008",
    explanation:
      "Under Section 6(2) of the LLP Act, 2008, if an LLP carries on business with less than two partners for more than six months, the sole remaining partner with knowledge is personally liable for all obligations incurred during that period after the six months have elapsed.",
    keyDistinction:
      "ICAI Exam Alert: The first 6 months are a grace period to induct a second partner without personal liability; unlimited personal liability only attaches to debts contracted AFTER the 6-month grace period.",
  },
  {
    id: "mcq-6",
    subject: "Negotiable Instruments Act, 1881",
    statutoryRef: "Section 130 • Cheque Crossed 'Not Negotiable'",
    question:
      "Vikas drew a bearer cheque crossed generally with the words 'Not Negotiable'. The cheque was stolen by a peon, who delivered it for valuable consideration to Harish. Harish accepted it in good faith without any suspicion. Can Harish enforce payment against Vikas as a Holder in Due Course?",
    options: [
      {
        text: "Yes, because Harish took the instrument for value, in good faith, and before maturity without notice of defect (Section 9).",
        isCorrect: false,
        pct: 23,
      },
      {
        text: "No, under Section 130, a transferee of a cheque crossed 'Not Negotiable' cannot acquire a better title than that which the transferor had.",
        isCorrect: true,
        pct: 72,
      },
      {
        text: "Yes, because the words 'Not Negotiable' do not prevent the instrument from remaining negotiable under Section 13.",
        isCorrect: false,
        pct: 3,
      },
      {
        text: "No, because any cheque crossed 'Not Negotiable' is entirely non-transferable and void in the hands of any third party.",
        isCorrect: false,
        pct: 2,
      },
    ],
    explanationTitle: "Section 130 & Rule in Wilson & Meeson v. Pickering (1946)",
    explanation:
      "Under Section 130 of the Negotiable Instruments Act, 1881, a person taking a cheque crossed generally or specially bearing the words 'not negotiable' shall not have and shall not be capable of giving a better title to the cheque than that which the person from whom he took it had. Since the peon was a thief with defective title, Harish gets no better title regardless of good faith or consideration.",
    keyDistinction:
      "ICAI Key Distinction: The cheque remains transferable, but negotiability (the quality of passing better title to a Holder in Due Course free from defects) is destroyed.",
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

export function AdminExamCountdownAndQOTDTab({
  adminFetch,
  showToast,
  initialSection = "exams",
}: {
  adminFetch: (url: string, init?: RequestInit) => Promise<Response>;
  showToast: (msg: string) => void;
  initialSection?: "exams" | "mcq";
}) {
  const [activeSection, setActiveSection] = useState<"exams" | "mcq">(initialSection);

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);
  const [, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Exam Countdowns State
  const [exams, setExams] = useState<ExamTargetItem[]>(DEFAULT_EXAMS);
  const [editingExamIdx, setEditingExamIdx] = useState<number>(0);

  // MCQs State
  const [mcqList, setMcqList] = useState<MCQScenarioItem[]>(DEFAULT_MCQS);
  const [activeMcqIdx, setActiveMcqIdx] = useState<number>(0);

  // Fetch from server on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // Load exam settings
        const resExams = await adminFetch("/api/admin/exam-settings");
        if (resExams.ok) {
          const dataExams = (await resExams.json()) as ExamSettingsResponse;
          if (Array.isArray(dataExams.examSettings) && dataExams.examSettings.length > 0) {
            setExams(
              dataExams.examSettings.map((raw: unknown, idx: number) => {
                const e = toRawExamSetting(raw);
                return {
                  id: e.id || `exam-${idx + 1}`,
                  name: e.name || e.exam || "CA Foundation Business Laws",
                  level: e.level || e.session || "ICAI Paper 2 • 7 Chapters",
                  targetDate: e.targetDate || (e.date ? (e.date.includes("T") ? e.date : `${e.date}T09:00:00`) : "2026-12-15T09:00:00"),
                  syllabusCoverage: e.syllabusCoverage ?? 100,
                  totalHoursNeeded: e.totalHoursNeeded ?? 120,
                  buttonText: e.buttonText || "Open Student Learning Desk",
                  buttonUrl: e.buttonUrl || "/student",
                };
              })
            );
          }
        }

        // Load MCQs pool
        const resMcqs = await adminFetch("/api/admin/mcq-pool");
        if (resMcqs.ok) {
          const dataMcqs = (await resMcqs.json()) as McqPoolResponse;
          if (Array.isArray(dataMcqs.mcqPool) && dataMcqs.mcqPool.length > 0) {
            const hasLegacy = dataMcqs.mcqPool.some(
              (m) =>
                m.question?.includes("hot water bottle") ||
                m.statutoryRef?.includes("Caveat Emptor Exception")
            );
            if (!hasLegacy) {
              setMcqList(dataMcqs.mcqPool as MCQScenarioItem[]);
            } else {
              setMcqList(DEFAULT_MCQS);
            }
          }
        }
      } catch {
        // Fallback to defaults
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [adminFetch]);

  // Reset to Recommended CA Exam Bank
  const handleResetToCAMCQs = () => {
    if (
      confirm(
        "Reset question bank to the recommended CA Foundation syllabus bank (7 High-Yield ICAI Questions)?"
      )
    ) {
      setMcqList(DEFAULT_MCQS);
      setActiveMcqIdx(0);
      showToast("Loaded CA Foundation Question Bank! Click 'Save MCQ Challenge' to publish.");
    }
  };

  // Save all exams
  const handleSaveExams = async () => {
    try {
      setSaving(true);
      showToast("Saving exam targets to MongoDB Atlas...");
      const res = await adminFetch("/api/admin/exam-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examSettings: exams }),
      });
      if (res.ok) {
        showToast("Exam countdowns updated successfully!");
        localStorage.setItem("lawkaksha_exam_settings", JSON.stringify(exams));
      } else {
        throw new Error("Save failed");
      }
    } catch {
      localStorage.setItem("lawkaksha_exam_settings", JSON.stringify(exams));
      showToast("Saved locally (offline mode)");
    } finally {
      setSaving(false);
    }
  };

  // Save all MCQs
  const handleSaveMCQs = async () => {
    try {
      setSaving(true);
      showToast("Saving MCQ challenge pool to MongoDB Atlas...");
      const res = await adminFetch("/api/admin/mcq-pool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mcqPool: mcqList }),
      });
      if (res.ok) {
        showToast("Daily High-Yield MCQs updated successfully!");
        localStorage.setItem("lawkaksha_mcq_pool", JSON.stringify(mcqList));
      } else {
        throw new Error("Save failed");
      }
    } catch {
      localStorage.setItem("lawkaksha_mcq_pool", JSON.stringify(mcqList));
      showToast("Saved locally (offline mode)");
    } finally {
      setSaving(false);
    }
  };

  // Add new Exam
  const handleAddExam = () => {
    const newExam: ExamTargetItem = {
      id: `exam-${Date.now().toString().slice(-4)}`,
      name: "New Target Exam Name",
      level: "Paper Details • Units",
      targetDate: new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 16),
      syllabusCoverage: 100,
      totalHoursNeeded: 100,
      buttonText: "Open Student Learning Desk",
      buttonUrl: "/student",
    };
    const next = [...exams, newExam];
    setExams(next);
    setEditingExamIdx(next.length - 1);
  };

  // Delete Exam
  const handleDeleteExam = (idx: number) => {
    if (exams.length <= 1) {
      alert("At least one target exam must remain.");
      return;
    }
    if (confirm(`Delete exam "${exams[idx].name}"?`)) {
      const next = exams.filter((_, i) => i !== idx);
      setExams(next);
      setEditingExamIdx(Math.max(0, idx - 1));
    }
  };

  // Add new MCQ
  const handleAddMCQ = () => {
    const newMcq: MCQScenarioItem = {
      id: `mcq-${Date.now().toString().slice(-4)}`,
      subject: "Law Act Name, Year",
      statutoryRef: "Section XX • Topic Name",
      question: "Write the legal problem scenario or question prompt here...",
      options: [
        { text: "Option A statement", isCorrect: true, pct: 70 },
        { text: "Option B statement", isCorrect: false, pct: 15 },
        { text: "Option C statement", isCorrect: false, pct: 10 },
        { text: "Option D statement", isCorrect: false, pct: 5 },
      ],
      explanationTitle: "Landmark Precedent or Rule",
      explanation: "Provide a detailed statutory analysis explaining why Option A is correct.",
      keyDistinction: "ICAI Exam Tip: quote the specific section and landmark case for full marks.",
    };
    const next = [...mcqList, newMcq];
    setMcqList(next);
    setActiveMcqIdx(next.length - 1);
  };

  // Delete MCQ
  const handleDeleteMCQ = (idx: number) => {
    if (mcqList.length <= 1) {
      alert("At least one question must remain in the challenge pool.");
      return;
    }
    if (confirm(`Delete question Q${idx + 1}?`)) {
      const next = mcqList.filter((_, i) => i !== idx);
      setMcqList(next);
      setActiveMcqIdx(Math.max(0, idx - 1));
    }
  };

  const currentExam = exams[editingExamIdx] || exams[0];
  const currentMcq = mcqList[activeMcqIdx] || mcqList[0];

  return (
    <div className="space-y-6">
      {/* Top Banner / Navigation */}
      <div className="bg-white rounded-3xl border border-[#E7E4E7] shadow-sm p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#AED7E9]/40 border border-[#AED7E9] text-[#221D1D] text-xs font-bold mb-2">
            <Clock className="w-3.5 h-3.5 text-[#221D1D]" />
            <span>Website Section Editor</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#221D1D]">
            Exam Countdown &amp; Daily Practice Drill
          </h2>
          <p className="text-xs text-[#77716E]">
            Directly customize the live Target Exam countdown timers (Left Card) and Daily High-Yield Case Challenge MCQs (Right Card) on your homepage.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7] shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveSection("exams")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === "exams"
                ? "bg-white text-[#221D1D] shadow-xs border border-[#E7E4E7]"
                : "text-[#77716E] hover:text-[#221D1D]"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#C35F3B]" />
            <span>1. Target Exams &amp; Timers</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#F7F7F5] text-[#221D1D] border border-[#E7E4E7]">
              {exams.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("mcq")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === "mcq"
                ? "bg-white text-[#221D1D] shadow-xs border border-[#E7E4E7]"
                : "text-[#77716E] hover:text-[#221D1D]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#4B8097]" />
            <span>2. Daily Case Challenge MCQs</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#F7F7F5] text-[#221D1D] border border-[#E7E4E7]">
              {mcqList.length}
            </span>
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* SECTION 1: TARGET EXAMS & COUNTDOWN TIMERS (LEFT CARD EDITOR)   */}
      {/* ================================================================= */}
      {activeSection === "exams" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Exam List & Selector */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-[#E7E4E7] shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E7E4E7]">
                <h3 className="text-sm font-serif font-bold text-[#221D1D]">Configured Exams</h3>
                <button
                  type="button"
                  onClick={handleAddExam}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Exam</span>
                </button>
              </div>

              <div className="space-y-2">
                {exams.map((ex, idx) => {
                  const isSelected = editingExamIdx === idx;
                  return (
                    <div
                      key={ex.id || idx}
                      onClick={() => setEditingExamIdx(idx)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-[#EFF6FF] border-[#93C5FD] shadow-xs"
                          : "bg-[#F7F7F5] border-[#E7E4E7] hover:bg-white"
                      }`}
                    >
                      <div className="space-y-0.5 truncate pr-2">
                        <p className="text-xs font-bold text-[#0A192F] truncate">{ex.name}</p>
                        <p className="text-[11px] text-[#64748B] truncate">{ex.level}</p>
                        <p className="text-[10px] text-[#005A9C] font-mono">
                          Target: {ex.targetDate ? ex.targetDate.replace("T", " ") : "Not set"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteExam(idx);
                          }}
                          className="p-1.5 rounded-xl hover:bg-[#F4C5C0]/40 text-[#C35F3B] transition-colors"
                          title="Delete Exam"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Live Preview Box */}
            <div className="bg-[#0A192F] text-white rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#93C5FD]">
                  Card Live Preview
                </span>
                <span className="text-[10px] font-bold bg-[#005A9C] text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-400" /> Live Countdown
                </span>
              </div>
              <div>
                <p className="text-sm font-bold">{currentExam?.name || "Exam Title"}</p>
                <p className="text-xs text-[#94A3B8]">{currentExam?.level || "Level / Paper details"}</p>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-[#93C5FD]">
                <span>Syllabus: {currentExam?.syllabusCoverage || 100}%</span>
                <span>{currentExam?.buttonText || "Open Student Learning Desk"}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Active Exam Editor Form */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl border border-[#E7E4E7] shadow-sm p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E4E7]">
                <div>
                  <h3 className="text-base font-serif font-bold text-[#221D1D]">
                    Edit Target Exam #{editingExamIdx + 1}
                  </h3>
                  <p className="text-xs text-[#77716E]">
                    Control title, countdown date/time, syllabus %, and student dashboard link.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveExams}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#005A9C] hover:bg-[#004F8A] text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving..." : "Save Exam Settings"}</span>
                </button>
              </div>

              {currentExam && (
                <div className="space-y-4 text-xs">
                  {/* Exam Name & Level */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#4D433F] mb-1.5">
                        Exam Full Name
                      </label>
                      <input
                        type="text"
                        value={currentExam.name}
                        onChange={(e) => {
                          const next = [...exams];
                          next[editingExamIdx].name = e.target.value;
                          setExams(next);
                        }}
                        placeholder="e.g. CA Foundation Business Laws"
                        className="w-full p-3 rounded-2xl border border-[#E7E4E7] text-xs text-[#221D1D] outline-none focus:border-[#005A9C] bg-[#F7F7F5]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#4D433F] mb-1.5">
                        Subtitle / Chapter Coverage
                      </label>
                      <input
                        type="text"
                        value={currentExam.level}
                        onChange={(e) => {
                          const next = [...exams];
                          next[editingExamIdx].level = e.target.value;
                          setExams(next);
                        }}
                        placeholder="e.g. ICAI Paper 2 • 7 Chapters"
                        className="w-full p-3 rounded-2xl border border-[#E7E4E7] text-xs text-[#221D1D] outline-none focus:border-[#005A9C] bg-[#F7F7F5]"
                      />
                    </div>
                  </div>

                  {/* Target Exam Date & Time Picker */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#4D433F] mb-1.5">
                        Target Exam Date &amp; Time (Counts down to this moment)
                      </label>
                      <input
                        type="datetime-local"
                        value={currentExam.targetDate ? currentExam.targetDate.slice(0, 16) : ""}
                        onChange={(e) => {
                          const next = [...exams];
                          next[editingExamIdx].targetDate = e.target.value;
                          setExams(next);
                        }}
                        className="w-full p-3 rounded-2xl border border-[#E7E4E7] text-xs text-[#221D1D] outline-none focus:border-[#005A9C] bg-[#F7F7F5]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#4D433F] mb-1.5">
                        Syllabus Coverage (%)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={currentExam.syllabusCoverage}
                        onChange={(e) => {
                          const next = [...exams];
                          next[editingExamIdx].syllabusCoverage = Number(e.target.value);
                          setExams(next);
                        }}
                        className="w-full p-3 rounded-2xl border border-[#E7E4E7] text-xs text-[#221D1D] outline-none focus:border-[#005A9C] bg-[#F7F7F5]"
                      />
                    </div>
                  </div>

                  {/* CTA Button Text & Link */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#4D433F] mb-1.5">
                        CTA Button Label
                      </label>
                      <input
                        type="text"
                        value={currentExam.buttonText || "Open Student Learning Desk"}
                        onChange={(e) => {
                          const next = [...exams];
                          next[editingExamIdx].buttonText = e.target.value;
                          setExams(next);
                        }}
                        className="w-full p-3 rounded-2xl border border-[#E7E4E7] text-xs text-[#221D1D] outline-none focus:border-[#005A9C] bg-[#F7F7F5]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#4D433F] mb-1.5">
                        CTA Button URL (Destination Link)
                      </label>
                      <input
                        type="text"
                        value={currentExam.buttonUrl || "/student"}
                        onChange={(e) => {
                          const next = [...exams];
                          next[editingExamIdx].buttonUrl = e.target.value;
                          setExams(next);
                        }}
                        placeholder="e.g. /student or #subscriptions"
                        className="w-full p-3 rounded-2xl border border-[#E7E4E7] text-xs text-[#221D1D] outline-none focus:border-[#005A9C] bg-[#F7F7F5]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveExams}
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-[#005A9C] hover:bg-[#004F8A] text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? "Saving to Cloud..." : "Save All Exam Settings"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SECTION 2: DAILY HIGH-YIELD CASE CHALLENGE MCQS (RIGHT CARD)      */}
      {/* ================================================================= */}
      {activeSection === "mcq" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Question Pool Navigator */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-[#E7E4E7] shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E7E4E7] gap-2">
                <div>
                  <h3 className="text-sm font-serif font-bold text-[#221D1D]">
                    Daily Question Bank ({mcqList.length})
                  </h3>
                  <span className="text-[10px] text-emerald-700 font-semibold">CA Foundation &amp; CSEET</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleResetToCAMCQs}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#005A9C] text-[11px] font-bold border border-[#BFDBFE] transition-all cursor-pointer"
                    title="Load CA Foundation syllabus question bank"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>CA Bank</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAddMCQ}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#005A9C] hover:bg-[#004F8A] text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {mcqList.map((mcq, idx) => {
                  const isSelected = activeMcqIdx === idx;
                  const correctOpt = mcq.options.find((o) => o.isCorrect);
                  return (
                    <div
                      key={mcq.id || idx}
                      onClick={() => setActiveMcqIdx(idx)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                        isSelected
                          ? "bg-[#EFF6FF] border-[#93C5FD] shadow-xs"
                          : "bg-[#F7F7F5] border-[#E7E4E7] hover:bg-white"
                      }`}
                    >
                      <div className="space-y-1 truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-[#005A9C]">Q{idx + 1}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DBEAFE] text-[#005A9C] truncate max-w-[170px]">
                            {mcq.subject}
                          </span>
                        </div>
                        <p className="text-xs text-[#334155] line-clamp-2 leading-relaxed">
                          {mcq.question}
                        </p>
                        {correctOpt && (
                          <p className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate">Ans: {correctOpt.text}</span>
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMCQ(idx);
                        }}
                        className="p-1.5 rounded-xl hover:bg-[#F4C5C0]/40 text-[#C35F3B] transition-colors shrink-0"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Question Editor Form */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl border border-[#E7E4E7] shadow-sm p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E4E7]">
                <div>
                  <h3 className="text-base font-serif font-bold text-[#221D1D]">
                    Edit Question #{activeMcqIdx + 1} of {mcqList.length}
                  </h3>
                  <p className="text-xs text-[#77716E]">
                    Configure legal prompt, options A-D, landmark case rationale, and student tips.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveMCQs}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#005A9C] hover:bg-[#004F8A] text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving..." : "Save MCQ Challenge"}</span>
                </button>
              </div>

              {currentMcq && (
                <div className="space-y-4 text-xs">
                  {/* Subject & Statutory Tag */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#4D433F] mb-1.5">
                        Law Subject / Act Name
                      </label>
                      <input
                        type="text"
                        value={currentMcq.subject}
                        onChange={(e) => {
                          const next = [...mcqList];
                          next[activeMcqIdx].subject = e.target.value;
                          setMcqList(next);
                        }}
                        placeholder="e.g. Sale of Goods Act, 1930"
                        className="w-full p-3 rounded-2xl border border-[#E7E4E7] text-xs text-[#221D1D] outline-none focus:border-[#005A9C] bg-[#F7F7F5]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#4D433F] mb-1.5">
                        Statutory Reference / Topic Tag
                      </label>
                      <input
                        type="text"
                        value={currentMcq.statutoryRef}
                        onChange={(e) => {
                          const next = [...mcqList];
                          next[activeMcqIdx].statutoryRef = e.target.value;
                          setMcqList(next);
                        }}
                        placeholder="e.g. Section 16(1) • Caveat Emptor Exception"
                        className="w-full p-3 rounded-2xl border border-[#E7E4E7] text-xs text-[#221D1D] outline-none focus:border-[#005A9C] bg-[#F7F7F5]"
                      />
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <div>
                    <label className="block font-semibold text-[#4D433F] mb-1.5">
                      Case Study Problem Prompt / Question Text
                    </label>
                    <textarea
                      rows={3}
                      value={currentMcq.question}
                      onChange={(e) => {
                        const next = [...mcqList];
                        next[activeMcqIdx].question = e.target.value;
                        setMcqList(next);
                      }}
                      placeholder="Enter the full legal problem scenario..."
                      className="w-full p-3 rounded-2xl border border-[#E7E4E7] text-xs text-[#221D1D] outline-none focus:border-[#005A9C] bg-[#F7F7F5] leading-relaxed"
                    />
                  </div>

                  {/* 4 Options Editor */}
                  <div className="space-y-2.5 pt-1">
                    <label className="block font-semibold text-[#4D433F]">
                      Answer Options (Select which option is correct &amp; community poll %):
                    </label>

                    {currentMcq.options.map((opt, oIdx) => {
                      const letter = ["A", "B", "C", "D"][oIdx] || `Opt ${oIdx + 1}`;
                      return (
                        <div
                          key={oIdx}
                          className={`p-3 rounded-2xl border flex items-center gap-3 transition-colors ${
                            opt.isCorrect
                              ? "bg-emerald-50/60 border-emerald-300"
                              : "bg-[#F7F7F5] border-[#E7E4E7]"
                          }`}
                        >
                          <label
                            className="flex items-center gap-1.5 cursor-pointer shrink-0 font-bold text-xs"
                            title="Mark as correct answer"
                          >
                            <input
                              type="radio"
                              name={`correct-option-${activeMcqIdx}`}
                              checked={opt.isCorrect}
                              onChange={() => {
                                const next = [...mcqList];
                                next[activeMcqIdx].options = next[activeMcqIdx].options.map(
                                  (o, idx) => ({
                                    ...o,
                                    isCorrect: idx === oIdx,
                                  })
                                );
                                setMcqList(next);
                              }}
                              className="accent-emerald-600 w-4 h-4 cursor-pointer"
                            />
                            <span className={opt.isCorrect ? "text-emerald-800" : "text-[#4D433F]"}>
                              {letter}
                            </span>
                          </label>

                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => {
                              const next = [...mcqList];
                              next[activeMcqIdx].options[oIdx].text = e.target.value;
                              setMcqList(next);
                            }}
                            placeholder={`Option ${letter} statement...`}
                            className="grow p-2 rounded-xl border border-[#E7E4E7] text-xs text-[#221D1D] outline-none focus:border-[#005A9C] bg-white"
                          />

                          <div className="flex items-center gap-1 shrink-0" title="Community vote percentage">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={opt.pct}
                              onChange={(e) => {
                                const next = [...mcqList];
                                next[activeMcqIdx].options[oIdx].pct = Number(e.target.value);
                                setMcqList(next);
                              }}
                              className="w-16 p-2 rounded-xl border border-[#E7E4E7] text-xs text-[#221D1D] outline-none text-center bg-white"
                            />
                            <span className="text-[#64748B]">%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Landmark Case & Explanation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block font-semibold text-[#4D433F] mb-1.5">
                        Landmark Precedent / Explanation Header
                      </label>
                      <input
                        type="text"
                        value={currentMcq.explanationTitle}
                        onChange={(e) => {
                          const next = [...mcqList];
                          next[activeMcqIdx].explanationTitle = e.target.value;
                          setMcqList(next);
                        }}
                        placeholder="e.g. Rule in Priest v. Last (1903)"
                        className="w-full p-3 rounded-2xl border border-[#E7E4E7] text-xs text-[#221D1D] outline-none focus:border-[#005A9C] bg-[#F7F7F5]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#4D433F] mb-1.5">
                        ICAI / ICSI Exam Tip (Key Distinction)
                      </label>
                      <input
                        type="text"
                        value={currentMcq.keyDistinction}
                        onChange={(e) => {
                          const next = [...mcqList];
                          next[activeMcqIdx].keyDistinction = e.target.value;
                          setMcqList(next);
                        }}
                        placeholder="e.g. Quote Section 16(1) and priest v last for full marks"
                        className="w-full p-3 rounded-2xl border border-[#E7E4E7] text-xs text-[#221D1D] outline-none focus:border-[#005A9C] bg-[#F7F7F5]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#4D433F] mb-1.5">
                      Detailed Legal Explanation &amp; Rationale
                    </label>
                    <textarea
                      rows={3}
                      value={currentMcq.explanation}
                      onChange={(e) => {
                        const next = [...mcqList];
                        next[activeMcqIdx].explanation = e.target.value;
                        setMcqList(next);
                      }}
                      placeholder="Explain the statutory provisions and legal reasoning..."
                      className="w-full p-3 rounded-2xl border border-[#E7E4E7] text-xs text-[#221D1D] outline-none focus:border-[#005A9C] bg-[#F7F7F5] leading-relaxed"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveMCQs}
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-[#005A9C] hover:bg-[#004F8A] text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? "Saving to Cloud..." : "Save All MCQs to Website"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
