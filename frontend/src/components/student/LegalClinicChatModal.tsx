"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  MessageSquare,
  Sparkles,
  Shield,
  FileText,
  Paperclip,
  CheckCheck,
  Clock,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Scale,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { ILegalClinicMessage, ILegalClinicTicketModel } from "@/types/student-lms";

interface LegalClinicChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  rollNumber: string;
}

const INITIAL_MESSAGES: ILegalClinicMessage[] = [
  {
    id: "msg-1",
    senderId: "mentor-1",
    senderName: "Adv. Rahul Sharma Sir (Faculty)",
    senderRole: "mentor",
    text: "Namaste Rohan! Welcome to the Law Kaksha Legal Clinic. You can ask any doubts regarding Companies Act 2013, ROC circulars, or ICAI examination case laws.",
    timestamp: new Date(Date.now() - 3600000),
    isDelivered: true,
  },
  {
    id: "msg-2",
    senderId: "student-1",
    senderName: "Rohan Deshmukh",
    senderRole: "student",
    text: "Sir, in Section 103(1) for public companies, if 15 members are personally present within 30 minutes, but 2 of them are proxies, does the quorum hold?",
    statuteRef: "Section 103 (Quorum for Meetings)",
    timestamp: new Date(Date.now() - 1800000),
    isDelivered: true,
  },
  {
    id: "msg-3",
    senderId: "mentor-1",
    senderName: "Adv. Rahul Sharma Sir (Faculty)",
    senderRole: "mentor",
    text: "Great question! Section 103(1) explicitly mandates 'personally present'. Proxies are NOT counted towards quorum under Section 103, although authorized representatives of bodies corporate under Section 113 ARE counted. So 13 personally present would fall short if the slab required 15.",
    statuteRef: "Section 103 read with Section 113",
    timestamp: new Date(Date.now() - 600000),
    isDelivered: true,
  },
];

export function LegalClinicChatModal({
  isOpen,
  onClose,
  studentName,
  rollNumber,
}: LegalClinicChatModalProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "tickets">("chat");
  const [messages, setMessages] = useState<ILegalClinicMessage[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState("");
  const [isMentorTyping, setIsMentorTyping] = useState(false);

  // Fallback Ticket Form state
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketChapter, setTicketChapter] = useState("Corporate Law (Ch 1-6)");
  const [ticketQuery, setTicketQuery] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: ILegalClinicMessage = {
      id: `msg-${Date.now()}`,
      senderId: "student-1",
      senderName: studentName,
      senderRole: "student",
      text: inputMessage.trim(),
      timestamp: new Date(),
      isDelivered: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");

    // Simulate real-time mentor response via Socket.io event loop
    setIsMentorTyping(true);
    setTimeout(() => {
      setIsMentorTyping(false);
      const mentorReply: ILegalClinicMessage = {
        id: `msg-${Date.now() + 1}`,
        senderId: "mentor-1",
        senderName: "Adv. Rahul Sharma Sir (Faculty)",
        senderRole: "mentor",
        text: "Understood! I am reviewing your query with the MCA 2026 notification handbook. Stand by for the precise ratio.",
        timestamp: new Date(),
        isDelivered: true,
      };
      setMessages((prev) => [...prev, mentorReply]);
    }, 2000);
  };

  const insertStatuteTag = (tag: string) => {
    setInputMessage((prev) => (prev ? `${prev} [Ref: ${tag}]` : `[Ref: ${tag}] `));
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setTicketSubject("");
      setTicketQuery("");
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl h-[88vh] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-serif font-black text-slate-900">
                  Legal Clinic &amp; Mentorship Desk
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Adv. Rahul Sharma (Online)</span>
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Direct faculty resolution for CA Law statutory queries &amp; drafting doubts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("chat")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === "chat" ? "bg-white text-[#0284C7] font-bold shadow-2xs" : "text-slate-600"
                }`}
              >
                Live Chat
              </button>
              <button
                onClick={() => setActiveTab("tickets")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === "tickets" ? "bg-white text-[#0284C7] font-bold shadow-2xs" : "text-slate-600"
                }`}
              >
                Query Tickets
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {activeTab === "chat" ? (
          <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#F8FAFC]">
            
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((m) => {
                const isMe = m.senderRole === "student";

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="text-[10.5px] font-bold text-slate-600">
                        {m.senderName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <div
                      className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-2xl text-xs leading-relaxed shadow-2xs space-y-1.5 ${
                        isMe
                          ? "bg-[#0284C7] text-white rounded-tr-none"
                          : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                      }`}
                    >
                      {m.statuteRef && (
                        <div
                          className={`text-[10.5px] font-bold font-mono px-2 py-0.5 rounded-md inline-block ${
                            isMe ? "bg-sky-800 text-sky-100" : "bg-sky-50 text-[#0284C7] border border-sky-200"
                          }`}
                        >
                          📜 {m.statuteRef}
                        </div>
                      )}
                      <p className="whitespace-pre-line">{m.text}</p>
                    </div>
                  </div>
                );
              })}

              {isMentorTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-500 italic bg-white px-3.5 py-2 rounded-2xl border border-slate-200 max-w-xs shadow-2xs">
                  <span className="w-2 h-2 bg-[#0284C7] rounded-full animate-ping" />
                  <span>Adv. Rahul Sharma is reviewing &amp; typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Quick Statute Pills & Input Box */}
            <div className="p-3 sm:p-4 bg-white border-t border-slate-200 space-y-2.5">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] shrink-0">
                  Quick Ref:
                </span>
                {[
                  "§96 AGM Rules",
                  "§103 Quorum",
                  "§135 CSR Limits",
                  "§185 Loans to Directors",
                  "§241 Oppression",
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => insertStatuteTag(s)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-[#0284C7] text-slate-600 transition-colors shrink-0 font-medium"
                  >
                    + {s}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask a doubt or legal query to faculty..."
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0284C7]"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="px-5 py-2.5 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        ) : (
          /* Tickets Fallback Desk */
          <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC] space-y-6">
            
            {ticketSubmitted ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-3 max-w-md mx-auto">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-900 font-serif">
                  Case Query Ticket Raised!
                </h4>
                <p className="text-xs text-emerald-800">
                  Ticket <strong>TKT-CA-LAW-8942</strong> has been logged. Senior faculty will review and attach an audio explanation within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 text-xs">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-serif">
                    Submit a Complex Legal Case Query
                  </h4>
                  <p className="text-slate-500 mt-0.5">
                    For multi-paragraph problem statements or ICAI question disputes requiring audio feedback.
                  </p>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Subject &amp; Core Issue
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="e.g. Conflict between Sec 185(1) and Sec 186(2) for WOS"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Chapter Reference
                    </label>
                    <select
                      value={ticketChapter}
                      onChange={(e) => setTicketChapter(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0284C7] bg-white"
                    >
                      <option>Chapter XII: Meetings of Board &amp; Powers</option>
                      <option>Chapter VII: Management &amp; Administration</option>
                      <option>Chapter IX: Accounts of Companies &amp; CSR</option>
                      <option>General Clauses Act &amp; Interpretation</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Attach Handwritten Scan / ICAI Question (PDF/JPG)
                    </label>
                    <div className="px-3.5 py-2 rounded-xl border border-dashed border-slate-300 text-slate-500 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-50">
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>Choose File (Max 10MB)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Detailed Query &amp; Legal Ambiguity
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={ticketQuery}
                    onChange={(e) => setTicketQuery(e.target.value)}
                    placeholder="Explain the specific factual situation or question where the law seems ambiguous..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Submit Query Ticket</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* Active Tickets List */}
            <div className="max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                Your Past Support Tickets:
              </span>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono text-[#0284C7] font-bold text-[11px] block">TKT-CA-LAW-8941</span>
                  <span className="font-bold text-slate-900 block">Section 185 vs 186 Inter-Corporate Loans</span>
                  <span className="text-[11px] text-slate-500">Resolved by Adv. Pearl Dsouza • Audio note attached</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Resolved
                </span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
