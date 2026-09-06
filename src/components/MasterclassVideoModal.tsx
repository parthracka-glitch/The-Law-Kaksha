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
  studentName = "Adv. Aryan Sharma",
  rollNumber = "LK-2026-PCSJ-0842",
}: MasterclassVideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.25);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes" | "statutes" | "playlist" | "doubt">("notes");
  const [userNote, setUserNote] = useState("");
  const [savedNotes, setSavedNotes] = useState<string[]>([
    "Section 10 CPC Res Sub-Judice applies when previous suit is pending in a court of competent jurisdiction.",
    "Section 11 Res Judicata bar requires matter directly and substantially in issue in former suit.",
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-sky-200 w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-white border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-[11px] font-bold text-[#0284C7] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse" />
              HD MASTERCLASS PLAYER
            </span>
            <span className="text-xs text-slate-600 truncate max-w-md hidden sm:inline font-medium">
              {courseTitle} • {activeLesson.faculty}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-[11px] text-[#0284C7] hidden md:flex items-center gap-2 font-mono font-semibold">
              <Shield className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>DRM Protected • {studentName} ({rollNumber})</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors border border-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player & Interaction Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-hidden">
          {/* Left 2 Cols: Main Video & Player Controls */}
          <div className="lg:col-span-2 flex flex-col bg-slate-950 relative border-b lg:border-b-0 lg:border-r border-sky-100">
            {/* Mock HD Video Stage */}
            <div className="relative flex-1 min-h-[260px] sm:min-h-[380px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center overflow-hidden p-6">
              {/* Dynamic Forensic Watermark Overlay */}
              <div className="absolute inset-0 pointer-events-none select-none opacity-15 overflow-hidden flex flex-wrap gap-12 p-8 rotate-[-12deg]">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="text-xs font-mono font-black text-sky-400">
                    {studentName} • {rollNumber} • RESTRICTED STREAM
                  </span>
                ))}
              </div>

              {/* Central Video Graphic / Faculty Presentation */}
              <div className="relative z-10 text-center max-w-lg space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] flex items-center justify-center text-white shadow-xl shadow-sky-500/30 mx-auto">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
                <h3 className="text-lg sm:text-xl font-serif font-black text-white px-4">
                  {activeLesson.title}
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  Delivered by {activeLesson.faculty} • Duration: {activeLesson.duration}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-sky-400/40 text-[11px] text-sky-300">
                  <Flame className="w-3.5 h-3.5 text-sky-400" />
                  <span>High Yield Section Analysis • 10-Yr Trend Mapped</span>
                </div>
              </div>

              {/* Progress Slider (Mock Live Scrubbing) */}
              <div className="absolute bottom-14 left-4 right-4 z-20">
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden cursor-pointer">
                  <div className="bg-gradient-to-r from-[#0284C7] to-[#38BDF8] h-full w-2/5 rounded-full relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg shadow-sky-500/50" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span className="text-sky-400 font-bold">14:32</span>
                  <span>{activeLesson.duration}</span>
                </div>
              </div>

              {/* Bottom Custom Video Controller Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent px-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 rounded-lg bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white font-bold hover:brightness-110 transition-all shadow-md shadow-sky-500/30"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>
                  <button className="text-slate-300 hover:text-sky-400 transition-colors">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button className="text-slate-300 hover:text-sky-400 transition-colors">
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-slate-300 hover:text-sky-400 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Playback speed selector */}
                  <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg p-0.5">
                    {[1, 1.25, 1.5, 2].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                          playbackSpeed === spd
                            ? "bg-[#0284C7] text-white"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                  <button className="text-slate-300 hover:text-sky-400 transition-colors">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Video Meta & Summary Banner */}
            <div className="p-4 bg-sky-50/50 border-t border-sky-100 space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">
                Core Conceptual Overview
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">{activeLesson.summary}</p>
            </div>
          </div>

          {/* Right Col: Interactive Study Sidebar (Tabs: Notes, Statutes, Playlist, Doubt) */}
          <div className="flex flex-col bg-white overflow-hidden">
            {/* Sub-tab Navigation */}
            <div className="flex border-b border-sky-100 bg-slate-50">
              {[
                { id: "notes", label: "Smart Notes", icon: FileText },
                { id: "statutes", label: "Bare Acts", icon: BookOpen },
                { id: "playlist", label: "Playlist", icon: Layers },
                { id: "doubt", label: "Ask Doubt", icon: MessageSquare },
              ].map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                      active
                        ? "border-[#0284C7] text-[#0284C7] bg-white shadow-xs"
                        : "border-transparent text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-tab Content Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {/* TAB 1: SMART NOTES */}
              {activeTab === "notes" && (
                <div className="space-y-4">
                  {/* Timestamped Faculty Bookmarks */}
                  <div>
                    <h5 className="text-[11px] font-bold text-[#0284C7] uppercase tracking-wider mb-2">
                      Faculty Timestamp Bookmarks
                    </h5>
                    <div className="space-y-2">
                      {activeLesson.timestampNotes.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-white border border-sky-100 hover:border-sky-300 transition-colors flex items-start gap-2.5 shadow-xs"
                        >
                          <span className="px-1.5 py-0.5 rounded bg-sky-50 text-[#0284C7] font-mono text-[10px] font-bold shrink-0 border border-sky-200">
                            {item.time}
                          </span>
                          <p className="text-xs text-slate-700 leading-snug">{item.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Aspirant Personal Note Pad */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <h5 className="text-[11px] font-bold text-[#0284C7] uppercase tracking-wider">
                      Your Timestamped Notes
                    </h5>
                    <div className="space-y-1.5">
                      <textarea
                        value={userNote}
                        onChange={(e) => setUserNote(e.target.value)}
                        placeholder="Type personal revision notes here..."
                        rows={2}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7] focus:bg-white"
                      />
                      <button
                        onClick={handleSaveNote}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] hover:brightness-105 text-white font-bold text-xs transition-all shadow-md shadow-sky-500/20"
                      >
                        Save Note to Dashboard
                      </button>
                    </div>

                    <div className="space-y-2 mt-2">
                      {savedNotes.map((n, i) => (
                        <div
                          key={i}
                          className="p-2 rounded-lg bg-sky-50/60 border border-sky-100 text-[11px] text-slate-700 flex items-start gap-2"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
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
                  <h5 className="text-[11px] font-bold text-[#0284C7] uppercase tracking-wider">
                    Statutory Sections Cited in this Lecture
                  </h5>
                  <div className="space-y-2">
                    {activeLesson.bareActRefs.map((sec, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-white border border-sky-100 shadow-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-[#0284C7]">{sec}</span>
                          <span className="text-[10px] text-[#0284C7] bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full font-semibold">
                            High Yield
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">
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
                  <h5 className="text-[11px] font-bold text-[#0284C7] uppercase tracking-wider mb-2">
                    Course Module Playlist ({allLessons.length} Lectures)
                  </h5>
                  {allLessons.map((les, index) => {
                    const isCurrent = les.id === activeLesson.id;
                    return (
                      <button
                        key={les.id}
                        onClick={() => onSelectLesson && onSelectLesson(les)}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          isCurrent
                            ? "bg-sky-50 border-sky-300 text-slate-900 shadow-xs"
                            : "bg-white border-slate-200 hover:border-sky-200 text-slate-600"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                              isCurrent
                                ? "bg-[#0284C7] text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {index + 1}
                          </span>
                          <div>
                            <p className="text-xs font-bold leading-snug text-slate-900">{les.title}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
                              <span>{les.duration}</span> • <span>{les.faculty}</span>
                            </p>
                          </div>
                        </div>
                        {isCurrent ? (
                          <span className="text-[10px] font-bold text-[#0284C7] uppercase bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                            Playing
                          </span>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TAB 4: ASK FACULTY DOUBT */}
              {activeTab === "doubt" && (
                <div className="space-y-3">
                  <h5 className="text-[11px] font-bold text-[#0284C7] uppercase tracking-wider">
                    Doubt Resolution Desk
                  </h5>
                  <p className="text-xs text-slate-600">
                    Submit your query directly to {activeLesson.faculty}. Responses are received within 4 hours.
                  </p>

                  {doubtSubmitted ? (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs text-center space-y-1">
                      <CheckCircle className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
                      <p className="font-bold">Doubt Ticket #LK-DBT-4819 Created!</p>
                      <p className="text-[11px] text-slate-600">
                        Faculty notification sent. Check your dashboard notifications for audio/text answer.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitDoubt} className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Lecture Timestamp / Topic
                        </label>
                        <input
                          type="text"
                          defaultValue="14:32 - Issue framing on Section 10 vs 11 CPC"
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-[#0284C7] focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Your Specific Question
                        </label>
                        <textarea
                          rows={3}
                          value={doubtText}
                          onChange={(e) => setDoubtText(e.target.value)}
                          placeholder="Explain what concept you need clarification on..."
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-[#0284C7] focus:bg-white focus:outline-none"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] hover:brightness-105 text-white font-bold text-xs transition-all shadow-md shadow-sky-500/20"
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
