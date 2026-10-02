"use client";

import React, { useState } from "react";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  RotateCw,
  Sparkles,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  Shield,
  Layers,
  ChevronRight,
  Download,
  Flame,
} from "lucide-react";

export interface MasterclassLesson {
  id: string;
  title: string;
  duration: string;
  faculty: string;
  videoUrl?: string;
  summary: string;
  keyTakeaways: string[];
  bareActRefs: string[];
  timestampNotes: { time: string; note: string }[];
}

interface MasterclassVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  activeLesson: MasterclassLesson;
  allLessons?: MasterclassLesson[];
  onSelectLesson?: (lesson: MasterclassLesson) => void;
  studentName?: string;
  rollNumber?: string;
}

export function MasterclassVideoModal({
  isOpen,
  onClose,
  courseTitle,
  activeLesson,
  allLessons = [],
  onSelectLesson,
  studentName = "Rohan Deshmukh",
  rollNumber = "CRO-0689421",
}: MasterclassVideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.25);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes" | "statutes" | "playlist" | "doubt">("notes");
  const [userNote, setUserNote] = useState("");
  const [savedNotes, setSavedNotes] = useState<string[]>([
    "Section 96: First AGM must be held within 9 months of FY close (No ROC extension allowed for first AGM).",
  ]);
  const [doubtText, setDoubtText] = useState("");
  const [doubtSubmitted, setDoubtSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSaveNote = () => {
    if (!userNote.trim()) return;
    setSavedNotes((prev) => [userNote.trim(), ...prev]);
    setUserNote("");
  };

  const handleSubmitDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim()) return;
    setDoubtSubmitted(true);
    setTimeout(() => {
      setDoubtSubmitted(false);
      setDoubtText("");
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#221D1D]/50 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-[#E7E4E7] w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-5 sm:px-7 py-4 bg-white/95 backdrop-blur-md border-b border-[#E7E4E7] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#AED7E9]/40 text-[11px] font-bold text-[#221D1D] flex items-center gap-1.5 border border-[#AED7E9]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#AED7E9] animate-pulse" />
              HD Masterclass
            </span>
            <span className="text-xs text-[#77716E] truncate max-w-md hidden sm:inline font-medium">
              {courseTitle} <span className="text-[#221D1D] font-bold">• {activeLesson.faculty}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-[11px] text-[#77716E] hidden md:flex items-center gap-1.5 font-mono">
              <Shield className="w-3.5 h-3.5 text-[#4B8097]" />
              <span>DRM Watermarked • {studentName} ({rollNumber})</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F7F7F5] hover:bg-[#E7E4E7] text-[#77716E] hover:text-[#221D1D] flex items-center justify-center transition-all active:scale-95 border border-[#E7E4E7]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Player & Interaction Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-hidden">
          {/* Left 2 Cols: Main Video & Player Controls */}
          <div className="lg:col-span-2 flex flex-col bg-[#1A1E24] relative border-b lg:border-b-0 lg:border-r border-[#E7E4E7]">
            {/* Mock HD Video Stage */}
            <div className="relative flex-1 min-h-[260px] sm:min-h-[380px] bg-gradient-to-b from-[#1A1E24] via-[#111418] to-[#111418] flex flex-col items-center justify-center overflow-hidden p-6">
              {/* Dynamic Forensic Watermark Overlay */}
              <div className="absolute inset-0 pointer-events-none select-none opacity-10 overflow-hidden flex flex-wrap gap-12 p-8 rotate-[-12deg]">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="text-xs font-mono font-bold text-white">
                    {studentName} • {rollNumber} • RESTRICTED STREAM
                  </span>
                ))}
              </div>

              {/* Central Video Graphic */}
              <div className="relative z-10 text-center max-w-lg space-y-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-[#AED7E9] hover:bg-[#98C5D8] text-[#221D1D] flex items-center justify-center shadow-lg shadow-[#AED7E9]/40 mx-auto transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-[#221D1D]" />
                  ) : (
                    <Play className="w-7 h-7 fill-[#221D1D] ml-0.5" />
                  )}
                </button>
                <h3 className="text-lg sm:text-xl font-bold text-white px-4 tracking-tight">
                  {activeLesson.title}
                </h3>
                <p className="text-xs text-white/70 font-medium">
                  Delivered by {activeLesson.faculty} • Duration: {activeLesson.duration}
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[11px] font-medium text-white/90">
                  <Flame className="w-3.5 h-3.5 text-[#F7892A]" />
                  <span>High Yield Section Analysis • 10-Yr Trend Mapped</span>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="absolute bottom-14 left-6 right-6 z-20">
                <div className="w-full bg-white/20 hover:bg-white/30 h-1.5 rounded-full overflow-hidden cursor-pointer transition-colors">
                  <div className="bg-[#AED7E9] h-full w-2/5 rounded-full relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-white/50 mt-1.5 font-mono">
                  <span className="text-[#AED7E9] font-semibold">14:32</span>
                  <span>{activeLesson.duration}</span>
                </div>
              </div>

              {/* Bottom Custom Video Controller Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent px-6 flex items-center justify-between z-20">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white hover:text-[#AED7E9] transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                  <button className="text-white/70 hover:text-white transition-colors cursor-pointer">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button className="text-white/70 hover:text-white transition-colors cursor-pointer">
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-[#C35F3B]" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Playback speed selector */}
                  <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full p-0.5 border border-white/10">
                    {[1, 1.25, 1.5, 2].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                          playbackSpeed === spd
                            ? "bg-white text-[#221D1D] shadow-sm"
                            : "text-white/70 hover:text-white"
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                  <button className="text-white/70 hover:text-white transition-colors cursor-pointer">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Video Meta & Summary Banner */}
            <div className="p-5 bg-[#F7F7F5] border-t border-[#E7E4E7] space-y-1.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#77716E]">
                Core Conceptual Overview
              </h4>
              <p className="text-xs text-[#221D1D] leading-relaxed font-medium">{activeLesson.summary}</p>
            </div>
          </div>

          {/* Right Col: Interactive Study Sidebar */}
          <div className="flex flex-col bg-white overflow-hidden">
            {/* Sub-tab Navigation */}
            <div className="p-2 border-b border-[#E7E4E7] bg-[#F7F7F5]">
              <div className="flex items-center bg-white p-1 rounded-xl gap-1 border border-[#E7E4E7]">
                {[
                  { id: "notes", label: "Notes", icon: FileText },
                  { id: "statutes", label: "Bare Acts", icon: BookOpen },
                  { id: "playlist", label: "Playlist", icon: Layers },
                  { id: "doubt", label: "Doubt", icon: MessageSquare },
                ].map((t) => {
                  const Icon = t.icon;
                  const active = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as any)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        active
                          ? "bg-[#AED7E9] text-[#221D1D] shadow-xs font-bold"
                          : "text-[#77716E] hover:text-[#221D1D]"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-tab Content Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {/* TAB 1: SMART NOTES */}
              {activeTab === "notes" && (
                <div className="space-y-4">
                  {/* Timestamped Faculty Bookmarks */}
                  <div>
                    <h5 className="text-[11px] font-bold text-[#77716E] uppercase tracking-wider mb-2">
                      Faculty Timestamp Bookmarks
                    </h5>
                    <div className="space-y-2">
                      {activeLesson.timestampNotes.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7] hover:border-[#AED7E9] transition-all flex items-start gap-2.5"
                        >
                          <span className="px-2 py-0.5 rounded-full bg-[#AED7E9]/40 text-[#221D1D] font-mono text-[10px] font-bold shrink-0 border border-[#AED7E9]">
                            {item.time}
                          </span>
                          <p className="text-xs text-[#221D1D] leading-snug">{item.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Aspirant Personal Note Pad */}
                  <div className="pt-3 border-t border-[#E7E4E7] space-y-2.5">
                    <h5 className="text-[11px] font-bold text-[#77716E] uppercase tracking-wider">
                      Your Personal Notes
                    </h5>
                    <div className="space-y-2">
                      <textarea
                        value={userNote}
                        onChange={(e) => setUserNote(e.target.value)}
                        placeholder="Type personal revision notes here..."
                        rows={2}
                        className="w-full p-3 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7] text-xs text-[#221D1D] focus:outline-none focus:border-[#AED7E9] focus:bg-white transition-colors placeholder:text-[#77716E]"
                      />
                      <button
                        onClick={handleSaveNote}
                        className="w-full py-2.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] font-bold text-xs transition-all active:scale-[0.98] shadow-xs cursor-pointer"
                      >
                        Save Note to Dashboard
                      </button>
                    </div>

                    <div className="space-y-2 mt-2">
                      {savedNotes.map((n, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl bg-[#F7F7F5] border border-[#E7E4E7] text-[11px] text-[#221D1D] flex items-start gap-2"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-[#4B8097] shrink-0 mt-0.5" />
                          <span>{n}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BARE ACT STATUTES */}
              {activeTab === "statutes" && (
                <div className="space-y-3">
                  <h5 className="text-[11px] font-bold text-[#77716E] uppercase tracking-wider">
                    Statutory Sections Cited in this Lecture
                  </h5>
                  <div className="space-y-2">
                    {activeLesson.bareActRefs.map((sec, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7] space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-[#221D1D]">{sec}</span>
                          <span className="text-[10px] text-[#221D1D] bg-[#AED7E9]/40 px-2 py-0.5 rounded-full font-bold border border-[#AED7E9]">
                            High Yield
                          </span>
                        </div>
                        <p className="text-[11px] text-[#77716E]">
                          Directly cross-reference with our in-app DRM bare act compiler.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PLAYLIST */}
              {activeTab === "playlist" && (
                <div className="space-y-2">
                  <h5 className="text-[11px] font-bold text-[#77716E] uppercase tracking-wider mb-2">
                    Course Module Playlist ({allLessons.length} Lectures)
                  </h5>
                  {allLessons.map((les, index) => {
                    const isCurrent = les.id === activeLesson.id;
                    return (
                      <button
                        key={les.id}
                        onClick={() => onSelectLesson && onSelectLesson(les)}
                        className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isCurrent
                            ? "bg-[#AED7E9]/20 border-[#AED7E9] text-[#221D1D]"
                            : "bg-[#F7F7F5] border-transparent hover:border-[#E7E4E7] text-[#77716E]"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                              isCurrent
                                ? "bg-[#AED7E9] text-[#221D1D]"
                                : "bg-[#E7E4E7] text-[#221D1D]"
                            }`}
                          >
                            {index + 1}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-[#221D1D] leading-snug">{les.title}</p>
                            <p className="text-[10px] text-[#77716E] mt-0.5 flex items-center gap-1.5">
                              <span>{les.duration}</span> • <span>{les.faculty}</span>
                            </p>
                          </div>
                        </div>
                        {isCurrent ? (
                          <span className="text-[10px] font-bold text-[#221D1D] bg-white px-2 py-0.5 rounded-full shadow-2xs border border-[#AED7E9]">
                            Playing
                          </span>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-[#77716E]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TAB 4: ASK FACULTY DOUBT */}
              {activeTab === "doubt" && (
                <div className="space-y-3">
                  <h5 className="text-[11px] font-bold text-[#77716E] uppercase tracking-wider">
                    Doubt Resolution Desk
                  </h5>
                  <p className="text-xs text-[#77716E]">
                    Submit your query directly to {activeLesson.faculty}. Average response turnaround is within 4 hours.
                  </p>

                  {doubtSubmitted ? (
                    <div className="p-4 rounded-2xl bg-[#AED7E9]/20 border border-[#AED7E9] text-[#221D1D] text-xs text-center space-y-1.5">
                      <CheckCircle className="w-6 h-6 mx-auto text-[#4B8097]" />
                      <p className="font-bold text-[#221D1D]">Doubt Ticket #LK-DBT-4819 Created!</p>
                      <p className="text-[11px] text-[#77716E]">
                        Faculty notification sent. Check your dashboard notifications for audio/text answer.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitDoubt} className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#221D1D] mb-1">
                          Lecture Timestamp / Topic
                        </label>
                        <input
                          type="text"
                          defaultValue="14:32 - Issue framing on Section 10 vs 11 CPC"
                          className="w-full p-2.5 rounded-xl bg-[#F7F7F5] border border-[#E7E4E7] text-xs text-[#221D1D] focus:border-[#AED7E9] focus:bg-white focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#221D1D] mb-1">
                          Your Specific Question
                        </label>
                        <textarea
                          rows={3}
                          value={doubtText}
                          onChange={(e) => setDoubtText(e.target.value)}
                          placeholder="Explain what concept you need clarification on..."
                          className="w-full p-2.5 rounded-xl bg-[#F7F7F5] border border-[#E7E4E7] text-xs text-[#221D1D] focus:border-[#AED7E9] focus:bg-white focus:outline-none transition-colors placeholder:text-[#77716E]"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] font-bold text-xs transition-all active:scale-[0.98] shadow-xs cursor-pointer"
                      >
                        Submit Doubt to Faculty Desk
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
