"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Calendar,
  Flame,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Eye,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Bookmark,
  Share2,
  AlertCircle,
  Save,
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
    name: "CSEET Business Law & Management",
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
];

export function AdminExamCountdownAndQOTDTab({
  adminFetch,
  showToast,
}: {
  adminFetch: (url: string, init?: RequestInit) => Promise<Response>;
  showToast: (msg: string) => void;
}) {
  const [activeSection, setActiveSection] = useState<"exams" | "mcq">("exams");
  const [loading, setLoading] = useState(false);
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
          const dataExams = await resExams.json();
          if (Array.isArray(dataExams.examSettings) && dataExams.examSettings.length > 0) {
            setExams(
              dataExams.examSettings.map((e: any, idx: number) => ({
                id: e.id || `exam-${idx + 1}`,
                name: e.name || e.exam || "CA Foundation Business Laws",
                level: e.level || e.session || "ICAI Paper 2 • 7 Chapters",
                targetDate: e.targetDate || (e.date ? (e.date.includes("T") ? e.date : `${e.date}T09:00:00`) : "2026-12-15T09:00:00"),
                syllabusCoverage: e.syllabusCoverage ?? 100,
                totalHoursNeeded: e.totalHoursNeeded ?? 120,
                buttonText: e.buttonText || "Open Student Learning Desk",
                buttonUrl: e.buttonUrl || "/student",
              }))
            );
          }
        }

        // Load MCQs pool
        const resMcqs = await adminFetch("/api/admin/mcq-pool");
        if (resMcqs.ok) {
          const dataMcqs = await resMcqs.json();
          if (Array.isArray(dataMcqs.mcqPool) && dataMcqs.mcqPool.length > 0) {
            setMcqList(dataMcqs.mcqPool);
          }
        }
      } catch (err) {
        // Fallback to defaults
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [adminFetch]);

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
    } catch (e) {
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
    } catch (e) {
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
                    Control title, countdown date/time, syllabus %, and student portal link.
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
              <div className="flex items-center justify-between pb-2 border-b border-[#E7E4E7]">
                <h3 className="text-sm font-serif font-bold text-[#221D1D]">
                  Daily Question Bank ({mcqList.length})
                </h3>
                <button
                  type="button"
                  onClick={handleAddMCQ}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Question</span>
                </button>
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
