"use client";

import React, { useState, useEffect } from "react";
import {
  Video,
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  ExternalLink,
  Calendar,
  Clock,
  CheckCircle2,
  X,
} from "lucide-react";

interface LiveSessionData {
  id: string;
  title: string;
  subscription_id?: string;
  course_id?: string;
  starts_at: string;
  ends_at: string;
  meet_link: string;
  instructor?: string;
  status?: string;
}

export function AdminLiveSessionsTab({
  adminFetch,
  showToast,
}: {
  adminFetch: (url: string, init?: RequestInit) => Promise<Response>;
  showToast: (msg: string) => void;
}) {
  const [sessions, setSessions] = useState<LiveSessionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<Partial<LiveSessionData>>({
    title: "",
    meet_link: "https://meet.google.com/",
    starts_at: "",
    ends_at: "",
    instructor: "Faculty",
    status: "Upcoming",
  });

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await adminFetch("/api/admin/live-sessions");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setSessions(data.data);
      }
    } catch (e) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = !!currentSession.id;
      const url = isEdit ? `/api/admin/live-sessions/${currentSession.id}` : "/api/admin/live-sessions";
      const method = isEdit ? "PUT" : "POST";

      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentSession),
      });
      const data = await res.json();
      if (data.success) {
        showToast(isEdit ? "Session updated." : "Live class scheduled successfully.");
        setModalOpen(false);
        fetchSessions();
      } else {
        alert(data.message || "Failed to save session.");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Cancel & delete this scheduled live class?")) return;
    try {
      const res = await adminFetch(`/api/admin/live-sessions/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Session deleted.");
        fetchSessions();
      }
    } catch (e) {
      alert("Delete failed.");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-[#221D1D]">
            Module B5: Google Meet Live Classes
          </h2>
          <p className="text-xs text-[#77716E]">
            Schedule live doubt sessions, manage verified Google Meet links, and sync attendee permissions.
          </p>
        </div>

        <button
          onClick={() => {
            setCurrentSession({
              title: "",
              meet_link: "https://meet.google.com/law-kaksha-live",
              starts_at: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
              ends_at: new Date(Date.now() + 90000000).toISOString().slice(0, 16),
              instructor: "Adv. Rahul Sharma",
              status: "Upcoming",
            });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#221D1D] hover:bg-black text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule Live Class</span>
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sessions.map((sess) => (
          <div
            key={sess.id}
            className="bg-white rounded-3xl p-6 border border-[#E7E4E7] shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Video className="w-3 h-3 text-emerald-600" />
                  Google Meet
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">
                  {sess.instructor || "Faculty"}
                </span>
              </div>

              <h3 className="font-serif font-bold text-base text-[#221D1D] mb-3">
                {sess.title}
              </h3>

              <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-[#F7F7F5] p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#4B8097]" />
                  <span>Starts: {new Date(sess.starts_at).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#4B8097]" />
                  <span>Ends: {new Date(sess.ends_at).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E7E4E7] flex items-center justify-between">
              <a
                href={sess.meet_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#4B8097] hover:underline"
              >
                <span>Test Meet Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCurrentSession(sess);
                    setModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(sess.id)}
                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-8 shadow-2xl border border-[#E7E4E7] space-y-5 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 sm:right-6 top-4 sm:top-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-serif font-bold text-[#221D1D]">
                {currentSession.id ? "Edit Live Class" : "Schedule New Live Class"}
              </h3>
              <p className="text-xs text-slate-500">Google Meet link will be visible to entitled students in their dashboard calendar.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Class Title *</label>
                <input
                  type="text"
                  required
                  value={currentSession.title || ""}
                  onChange={(e) => setCurrentSession({ ...currentSession, title: e.target.value })}
                  placeholder="e.g. Contract Act Section 11 Minor's Agreement Masterclass"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Google Meet URL *</label>
                <input
                  type="url"
                  required
                  value={currentSession.meet_link || ""}
                  onChange={(e) => setCurrentSession({ ...currentSession, meet_link: e.target.value })}
                  placeholder="https://meet.google.com/xxx-yyyy-zzz"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Starts At *</label>
                  <input
                    type="datetime-local"
                    required
                    value={currentSession.starts_at ? currentSession.starts_at.slice(0, 16) : ""}
                    onChange={(e) => setCurrentSession({ ...currentSession, starts_at: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ends At *</label>
                  <input
                    type="datetime-local"
                    required
                    value={currentSession.ends_at ? currentSession.ends_at.slice(0, 16) : ""}
                    onChange={(e) => setCurrentSession({ ...currentSession, ends_at: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instructor / Faculty</label>
                <input
                  type="text"
                  value={currentSession.instructor || ""}
                  onChange={(e) => setCurrentSession({ ...currentSession, instructor: e.target.value })}
                  placeholder="e.g. CS Priya Mehta"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#221D1D] hover:bg-black text-white font-semibold"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
