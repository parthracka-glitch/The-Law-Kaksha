"use client";

import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  MessageSquare,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Mail,
  ExternalLink,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/api";

export interface StudentSupportTicket {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  subject: string;
  category: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  admin_reply?: string;
  admin_replied_at?: string;
  createdAt: string;
}

export function StudentHelpSupportTab() {
  const API_URL = getApiBaseUrl();
  const [siteDetails, setSiteDetails] = useState<{
    support_email?: string;
    whatsapp_number?: string;
    domain?: string;
    site_title?: string;
  }>({});
  const [tickets, setTickets] = useState<StudentSupportTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState<boolean>(true);

  // Form state
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Access / Entitlement Issue");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load public site settings (real contact info, WhatsApp only if configured)
  useEffect(() => {
    async function fetchSiteSettings() {
      try {
        const res = await fetch(`${API_URL}/api/public/site-settings`);
        const data = await res.json();
        if (data.success && data.site_details) {
          setSiteDetails(data.site_details);
        }
      } catch (err) {
        console.error("Failed to fetch site settings:", err);
      }
    }
    fetchSiteSettings();
  }, [API_URL]);

  // Load student's support tickets
  const fetchTickets = async () => {
    try {
      setLoadingTickets(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`${API_URL}/api/student/support-tickets`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.tickets)) {
        setTickets(data.tickets);
      }
    } catch (err) {
      console.error("Failed to fetch support tickets:", err);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [API_URL]);

  // Handle ticket submission
  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setSubmitError("Please fill in both the subject and detailed message.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(null);

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`${API_URL}/api/student/support-tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          subject: subject.trim(),
          category,
          priority,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.ticket) {
        setSubmitSuccess("Your support ticket has been logged. Our academic team will reply shortly.");
        setSubject("");
        setMessage("");
        setTickets((prev) => [data.ticket, ...prev]);
      } else {
        setSubmitError(data.message || "Failed to create support ticket.");
      }
    } catch (err: any) {
      setSubmitError(err.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const cleanWhatsappNumber = siteDetails.whatsapp_number
    ? siteDetails.whatsapp_number.replace(/[^0-9]/g, "")
    : "";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl border border-[#E7ECF7] p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE] mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Academic & Student Helpdesk</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0A192F] tracking-tight">
              Help & Academic Support
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Have questions regarding statutory interpretations, DRM access, or orders? We are here to help.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* WHATSAPP BUTTON: RENDERED ONLY IF whatsapp_number IS CONFIGURED */}
            {cleanWhatsappNumber ? (
              <a
                href={`https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
                  "Hello The Law Kaksha Team, I need assistance with my student account."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20BD5A] text-white transition-all cursor-pointer shadow-2xs flex items-center gap-2 shrink-0"
              >
                <span>Chat on WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : null}

            {siteDetails.support_email && (
              <a
                href={`mailto:${siteDetails.support_email}`}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#005A9C] border border-[#DBEAFE] transition-all cursor-pointer shadow-2xs flex items-center gap-2 shrink-0"
              >
                <Mail className="w-4 h-4" />
                <span>{siteDetails.support_email}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: CREATE TICKET FORM */}
        <div className="bg-white rounded-2xl border border-[#E7ECF7] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#F0F4F8] pb-3">
            <MessageSquare className="w-5 h-5 text-[#005A9C]" />
            <h3 className="text-base font-bold text-[#0A192F]">Raise a Support Ticket</h3>
          </div>

          {submitSuccess && (
            <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{submitSuccess}</span>
            </div>
          )}

          {submitError && (
            <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0A192F] mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#DBEAFE] bg-[#F8FAFC] text-xs font-semibold text-[#0A192F] focus:outline-hidden focus:ring-2 focus:ring-[#005A9C]"
              >
                <option value="Access / Entitlement Issue">Access / Entitlement Issue</option>
                <option value="Content / Academic Doubt">Content / Academic Doubt</option>
                <option value="Payment / Invoice">Payment / Invoice</option>
                <option value="Technical / Reader Issue">Technical / Reader Issue</option>
                <option value="Other">Other Query</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0A192F] mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#DBEAFE] bg-[#F8FAFC] text-xs font-semibold text-[#0A192F] focus:outline-hidden focus:ring-2 focus:ring-[#005A9C]"
              >
                <option value="low">Low — General Question</option>
                <option value="medium">Medium — Standard Support</option>
                <option value="high">High — Exam Urgency</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0A192F] mb-1">
                Subject <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Cannot access SOGA Unit 2 notes after purchase"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#DBEAFE] bg-[#F8FAFC] text-xs font-semibold text-[#0A192F] focus:outline-hidden focus:ring-2 focus:ring-[#005A9C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0A192F] mb-1">
                Message Details <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Provide complete details (order ID, page number, or specific legal query) so faculty can assist you accurately."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#DBEAFE] bg-[#F8FAFC] text-xs font-semibold text-[#0A192F] focus:outline-hidden focus:ring-2 focus:ring-[#005A9C]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#005A9C] hover:bg-[#004080] text-white transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <span>Submitting Ticket...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: TICKETS HISTORY */}
        <div className="bg-white rounded-2xl border border-[#E7ECF7] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0F4F8] pb-3">
            <h3 className="text-base font-bold text-[#0A192F]">My Ticket History</h3>
            <span className="text-xs font-semibold text-[#64748B]">
              {tickets.length} Logged Ticket(s)
            </span>
          </div>

          {loadingTickets ? (
            <div className="py-12 text-center text-xs text-[#64748B]">Loading ticket history...</div>
          ) : tickets.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#64748B]">
              You have no active support tickets. Use the form to raise a question anytime.
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl border border-[#E7ECF7] bg-[#F8FAFC] space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-[#005A9C]">{t.id}</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          t.status === "resolved"
                            ? "bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]"
                            : t.status === "in_progress"
                            ? "bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE]"
                            : "bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0A192F]">{t.subject}</h4>
                    <p className="text-xs text-[#64748B] mt-1 whitespace-pre-wrap">{t.message}</p>
                    <p className="text-[10px] text-[#94A3B8] mt-1.5">
                      Submitted on {new Date(t.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* ADMIN REPLY BOX (IF REPLIED) */}
                  {t.admin_reply && (
                    <div className="mt-2.5 p-3 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] space-y-1">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#005A9C]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Faculty / Admin Response</span>
                      </div>
                      <p className="text-xs text-[#0A192F] whitespace-pre-wrap">{t.admin_reply}</p>
                      {t.admin_replied_at && (
                        <p className="text-[10px] text-[#64748B]">
                          Replied on {new Date(t.admin_replied_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
