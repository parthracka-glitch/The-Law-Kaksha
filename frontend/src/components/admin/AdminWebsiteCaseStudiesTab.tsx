"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Scale,
  Plus,
  Search,
  Trash2,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Filter,
  X,
  Save,
  Check,
} from "lucide-react";

export interface WebsiteCaseStudy {
  id: string;
  slug: string;
  title: string;
  subject: string;
  act_name?: string;
  summary: string;
  badge?: string;
  marks?: string;
  marks_weight?: number;
  precedent?: string;
  facts?: string;
  issue?: string;
  ruling?: string;
  model_answer?: string;
  content?: string;
  key_takeaways?: string[];
  cover_image?: string;
  show_on_website: boolean;
  show_on_dashboard?: boolean;
  is_published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const BADGE_PRESETS = [
  "ICAI FAVORITE",
  "LANDMARK PRECEDENT",
  "EXAM CRITICAL",
  "FOUNDATIONAL",
  "HIGH YIELD",
  "4-STEP MODEL ANSWER",
];

const SUBJECT_PRESETS = [
  "The Indian Contract Act, 1872",
  "The Companies Act, 2013",
  "The Sale of Goods Act, 1930",
  "The Indian Partnership Act, 1932",
  "The Limited Liability Partnership Act, 2008",
  "The Negotiable Instruments Act, 1881",
  "Indian Regulatory Framework",
];

export function AdminWebsiteCaseStudiesTab({
  adminFetch,
  showToast,
}: {
  adminFetch: (url: string, init?: RequestInit) => Promise<Response>;
  showToast: (msg: string) => void;
}) {
  const [cases, setCases] = useState<WebsiteCaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<WebsiteCaseStudy | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formSubject, setFormSubject] = useState(SUBJECT_PRESETS[0]);
  const [formBadge, setFormBadge] = useState("ICAI FAVORITE");
  const [formMarks, setFormMarks] = useState("6 Marks Model Case");
  const [formPrecedent, setFormPrecedent] = useState("");
  const [formSummary, setFormSummary] = useState("");
  const [formFacts, setFormFacts] = useState("");
  const [formIssue, setFormIssue] = useState("");
  const [formModelAnswer, setFormModelAnswer] = useState("");
  const [formKeyTakeaways, setFormKeyTakeaways] = useState("");
  const [formShowOnWebsite, setFormShowOnWebsite] = useState(true);
  const [formIsPublished, setFormIsPublished] = useState(true);

  // Load cases from backend
  const loadCaseStudies = async () => {
    try {
      setLoading(true);
      const res = await adminFetch("/api/admin/case-studies");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.caseStudies)) {
          setCases(data.caseStudies);
        }
      }
    } catch {
      showToast("Could not load case studies from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCaseStudies();
  }, []);

  // Filtered list
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.title?.toLowerCase().includes(q) ||
        c.subject?.toLowerCase().includes(q) ||
        c.summary?.toLowerCase().includes(q) ||
        c.precedent?.toLowerCase().includes(q) ||
        c.slug?.toLowerCase().includes(q);

      const matchesSubject =
        filterSubject === "all" ||
        c.subject === filterSubject ||
        c.act_name === filterSubject;

      return matchesSearch && matchesSubject;
    });
  }, [cases, search, filterSubject]);

  // Open modal for new
  const handleOpenAdd = () => {
    setEditingCase(null);
    setFormTitle("");
    setFormSlug("");
    setFormSubject(SUBJECT_PRESETS[0]);
    setFormBadge("ICAI FAVORITE");
    setFormMarks("6 Marks Model Case");
    setFormPrecedent("");
    setFormSummary("");
    setFormFacts("");
    setFormIssue("");
    setFormModelAnswer("");
    setFormKeyTakeaways("");
    setFormShowOnWebsite(true);
    setFormIsPublished(true);
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEdit = (cs: WebsiteCaseStudy) => {
    setEditingCase(cs);
    setFormTitle(cs.title || "");
    setFormSlug(cs.slug || "");
    setFormSubject(cs.subject || cs.act_name || SUBJECT_PRESETS[0]);
    setFormBadge(cs.badge || "ICAI FAVORITE");
    setFormMarks(cs.marks || "6 Marks Model Case");
    setFormPrecedent(cs.precedent || "");
    setFormSummary(cs.summary || "");
    setFormFacts(cs.facts || "");
    setFormIssue(cs.issue || "");
    setFormModelAnswer(cs.model_answer || cs.content || "");
    setFormKeyTakeaways(
      Array.isArray(cs.key_takeaways) ? cs.key_takeaways.join("\n") : ""
    );
    setFormShowOnWebsite(cs.show_on_website !== false);
    setFormIsPublished(cs.is_published !== false);
    setIsModalOpen(true);
  };

  // Auto-slug generation from title
  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingCase) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormSlug(autoSlug);
    }
  };

  // Save (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert("Please enter a case study title.");
      return;
    }

    const payload: Partial<WebsiteCaseStudy> = {
      title: formTitle.trim(),
      slug:
        formSlug.trim() ||
        formTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      subject: formSubject,
      act_name: formSubject,
      badge: formBadge,
      marks: formMarks,
      precedent: formPrecedent.trim(),
      summary: formSummary.trim(),
      facts: formFacts.trim(),
      issue: formIssue.trim(),
      model_answer: formModelAnswer.trim(),
      content: formModelAnswer.trim(),
      key_takeaways: formKeyTakeaways
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      show_on_website: formShowOnWebsite,
      is_published: formIsPublished,
    };

    try {
      setIsSaving(true);
      if (editingCase) {
        // Update
        const res = await adminFetch(`/api/admin/case-studies/${editingCase.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast(`Case study "${payload.title}" updated successfully!`);
          setIsModalOpen(false);
          await loadCaseStudies();
        } else {
          throw new Error("Update failed");
        }
      } else {
        // Create
        const res = await adminFetch("/api/admin/case-studies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast(`Case study "${payload.title}" published!`);
          setIsModalOpen(false);
          await loadCaseStudies();
        } else {
          throw new Error("Creation failed");
        }
      }
    } catch {
      showToast("Error saving case study to server.");
    } finally {
      setIsSaving(false);
    }
  };

  // Quick toggle visibility
  const handleToggleVisibility = async (cs: WebsiteCaseStudy) => {
    const nextVal = !cs.show_on_website;
    try {
      const res = await adminFetch(`/api/admin/case-studies/${cs.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ show_on_website: nextVal }),
      });
      if (res.ok) {
        setCases((prev) =>
          prev.map((item) =>
            item.id === cs.id ? { ...item, show_on_website: nextVal } : item
          )
        );
        showToast(
          `Case study is now ${nextVal ? "visible on" : "hidden from"} website directory.`
        );
      }
    } catch {
      showToast("Failed to update visibility.");
    }
  };

  // Delete
  const handleDelete = async (cs: WebsiteCaseStudy) => {
    if (
      !confirm(
        `Are you sure you want to permanently delete the case study:\n"${cs.title}"?`
      )
    ) {
      return;
    }

    try {
      const res = await adminFetch(`/api/admin/case-studies/${cs.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCases((prev) => prev.filter((item) => item.id !== cs.id));
        showToast("Case study deleted.");
      }
    } catch {
      showToast("Failed to delete case study.");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#CBD5E1] p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#005A9C] text-xs font-bold mb-2 shadow-2xs">
            <Scale className="w-3.5 h-3.5" />
            <span>Public Website Directory Manager</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0A192F]">
            Main Website Case Studies
          </h2>
          <p className="text-xs text-[#64748B] mt-1 max-w-2xl leading-relaxed">
            Manage the public landmark judicial cases, statutory precedents, and 4-step model answers showcased at{" "}
            <Link
              href="/case-studies"
              target="_blank"
              className="text-[#005A9C] font-semibold underline underline-offset-2 hover:text-[#004F8A]"
            >
              /case-studies
            </Link>
            . (Separate from the 3 student weekly cases).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <Link
            href="/case-studies"
            target="_blank"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#475569] hover:text-[#0A192F] bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span>View Public Directory</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
          </Link>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#005A9C] hover:bg-[#004F8A] transition-all flex items-center gap-1.5 shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Website Case Study</span>
          </button>
        </div>
      </div>

      {/* 2. Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-[#CBD5E1] shadow-2xs">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
            Total Case Studies
          </span>
          <span className="text-xl font-extrabold text-[#0A192F] mt-0.5 block">
            {cases.length}
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-[#CBD5E1] shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
            Live On Website
          </span>
          <span className="text-xl font-extrabold text-emerald-700 mt-0.5 block">
            {cases.filter((c) => c.show_on_website && c.is_published).length}
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-[#CBD5E1] shadow-2xs">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
            Hidden / Drafts
          </span>
          <span className="text-xl font-extrabold text-amber-700 mt-0.5 block">
            {cases.filter((c) => !c.show_on_website || !c.is_published).length}
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-[#CBD5E1] shadow-2xs">
          <span className="text-[11px] font-bold text-[#005A9C] uppercase tracking-wider block">
            Subjects Covered
          </span>
          <span className="text-xl font-extrabold text-[#005A9C] mt-0.5 block">
            {new Set(cases.map((c) => c.subject || c.act_name)).size}
          </span>
        </div>
      </div>

      {/* 3. Search & Filters Bar */}
      <div className="bg-white rounded-2xl border border-[#CBD5E1] p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, precedent, or slug..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-[#0A192F] outline-none focus:border-[#005A9C] bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
          <span className="text-xs font-semibold text-[#64748B] shrink-0">Subject:</span>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-[#0A192F] bg-white outline-none focus:border-[#005A9C] cursor-pointer"
          >
            <option value="all">All Law Subjects</option>
            {SUBJECT_PRESETS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Case Studies List Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-12 text-center text-xs text-[#64748B] shadow-2xs">
          Loading main website case studies from MongoDB Atlas...
        </div>
      ) : filteredCases.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#CBD5E1] p-12 text-center shadow-2xs space-y-3">
          <Scale className="w-10 h-10 text-[#94A3B8] mx-auto" />
          <h3 className="text-sm font-bold text-[#0A192F]">No Case Studies Found</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            {search || filterSubject !== "all"
              ? "No cases matched your search query. Try clearing filters."
              : "No main website case studies are currently published. Click below to add your first case study."}
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#005A9C] hover:bg-[#004F8A] shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Case Study</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCases.map((cs) => {
            const isLive = cs.show_on_website && cs.is_published;
            return (
              <div
                key={cs.id || cs.slug}
                className="bg-white rounded-2xl border border-[#CBD5E1] p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3.5 group hover:border-[#BFDBFE]"
              >
                <div className="space-y-2">
                  {/* Top badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#EFF6FF] text-[#005A9C] border border-[#BFDBFE]">
                      {cs.badge || "ICAI FAVORITE"}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(cs)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer border ${
                        isLive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                      }`}
                      title="Click to toggle live visibility on website"
                    >
                      {isLive ? (
                        <>
                          <Eye className="w-3 h-3 text-emerald-600" />
                          <span>Live</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 text-slate-400" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Subject Tag */}
                  <p className="text-[11px] font-bold text-[#64748B]">
                    {cs.subject || cs.act_name || "The Indian Contract Act, 1872"}
                  </p>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-[#0A192F] line-clamp-2 leading-snug group-hover:text-[#005A9C] transition-colors">
                    {cs.title}
                  </h3>

                  {/* Precedent Citation */}
                  {cs.precedent && (
                    <p className="text-[10px] text-[#475569] font-mono bg-slate-50 px-2 py-1 rounded-md border border-slate-100 line-clamp-1">
                      ⚖️ {cs.precedent}
                    </p>
                  )}

                  {/* Summary */}
                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                    {cs.summary || cs.facts || "No summary provided."}
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(cs)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                      title="Edit Case Details"
                    >
                      <Edit3 className="w-3 h-3 text-[#005A9C]" />
                      <span>Edit</span>
                    </button>

                    <Link
                      href={`/case-studies/${cs.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-[#005A9C] border border-slate-200 transition-colors"
                      title="Open Live Website Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(cs)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Case Study"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#CBD5E1] shadow-2xl w-full max-w-3xl overflow-hidden my-6 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0A192F] flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#005A9C]" />
                  <span>
                    {editingCase ? "Edit Main Website Case Study" : "Add New Main Website Case Study"}
                  </span>
                </h3>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  Published to the public website directory at{" "}
                  <code className="text-[#005A9C]">/case-studies/{formSlug || ":slug"}</code>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#0A192F] mb-1">
                    Case Study Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Carlill v. Carbolic Smoke Ball Co. [1893] 1 QB 256"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-[#0A192F] outline-none focus:border-[#005A9C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A192F] mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="e.g. carlill-v-carbolic-smoke-ball-co"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-[#0A192F] outline-none focus:border-[#005A9C] font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A192F] mb-1">
                    Law Subject / Act Name
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-[#0A192F] bg-white outline-none focus:border-[#005A9C]"
                  >
                    {SUBJECT_PRESETS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Badge & Marks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0A192F] mb-1">
                    Badge Tag
                  </label>
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    {BADGE_PRESETS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setFormBadge(b)}
                        className={`px-2 py-0.5 rounded-md text-[9px] font-bold border transition-colors ${
                          formBadge === b
                            ? "bg-[#005A9C] text-white border-[#005A9C]"
                            : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-[#0A192F] outline-none focus:border-[#005A9C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A192F] mb-1">
                    Marks Weight / Exam Label
                  </label>
                  <input
                    type="text"
                    value={formMarks}
                    onChange={(e) => setFormMarks(e.target.value)}
                    placeholder="e.g. 6 Marks Model Case"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-[#0A192F] outline-none focus:border-[#005A9C]"
                  />
                </div>
              </div>

              {/* Precedent Citation */}
              <div>
                <label className="block text-xs font-bold text-[#0A192F] mb-1">
                  Landmark Judicial Citation / Precedent
                </label>
                <input
                  type="text"
                  value={formPrecedent}
                  onChange={(e) => setFormPrecedent(e.target.value)}
                  placeholder="e.g. Court of Appeal [1893] 1 QB 256"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-[#0A192F] outline-none focus:border-[#005A9C]"
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-[#0A192F] mb-1">
                  Executive Summary / Synopsis
                </label>
                <textarea
                  rows={2}
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="Concise 1-2 sentence overview of the legal principle decided..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-[#0A192F] outline-none focus:border-[#005A9C]"
                />
              </div>

              {/* Facts of the Case */}
              <div>
                <label className="block text-xs font-bold text-[#0A192F] mb-1">
                  Material Facts of the Case
                </label>
                <textarea
                  rows={3}
                  value={formFacts}
                  onChange={(e) => setFormFacts(e.target.value)}
                  placeholder="State the factual background of the dispute..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-[#0A192F] outline-none focus:border-[#005A9C]"
                />
              </div>

              {/* Legal Issue */}
              <div>
                <label className="block text-xs font-bold text-[#0A192F] mb-1">
                  Core Legal Issue / Question of Law
                </label>
                <textarea
                  rows={2}
                  value={formIssue}
                  onChange={(e) => setFormIssue(e.target.value)}
                  placeholder="Whether an offer made to the public at large constitutes a binding agreement..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-[#0A192F] outline-none focus:border-[#005A9C]"
                />
              </div>

              {/* Model Answer / Ratio Decidendi */}
              <div>
                <label className="block text-xs font-bold text-[#0A192F] mb-1">
                  Ratio Decidendi &amp; ICAI 4-Step Model Answer
                </label>
                <textarea
                  rows={5}
                  value={formModelAnswer}
                  onChange={(e) => setFormModelAnswer(e.target.value)}
                  placeholder={`1. APPLICABLE STATUTORY PROVISIONS:\nSection 8 of the Indian Contract Act, 1872...\n\n2. LEGAL PRINCIPLE (RATIO DECIDENDI):\nAn offer made to the public at large can be accepted...\n\n3. FACTS APPLICATION & CONCLUSION:\nMrs. Carlill performed the condition, creating a valid contract.`}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-[#0A192F] font-mono outline-none focus:border-[#005A9C]"
                />
              </div>

              {/* Key Takeaways */}
              <div>
                <label className="block text-xs font-bold text-[#0A192F] mb-1">
                  Key Takeaways (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formKeyTakeaways}
                  onChange={(e) => setFormKeyTakeaways(e.target.value)}
                  placeholder={`A general offer can be accepted by performance without notice.\nDepositing funds in a bank proves intention to create legal relations.`}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-[#0A192F] outline-none focus:border-[#005A9C]"
                />
              </div>

              {/* Visibility Switches */}
              <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formShowOnWebsite}
                    onChange={(e) => setFormShowOnWebsite(e.target.checked)}
                    className="w-4 h-4 rounded text-[#005A9C] focus:ring-[#005A9C] border-slate-300 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#0A192F]">
                    Show in Website Directory (/case-studies)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsPublished}
                    onChange={(e) => setFormIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-[#005A9C] focus:ring-[#005A9C] border-slate-300 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#0A192F]">
                    Publish Immediately (Active)
                  </span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#005A9C] hover:bg-[#004F8A] shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? "Saving..." : editingCase ? "Save Changes" : "Publish Case Study"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
