"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  Eye,
  CheckCircle2,
  X,
  Layers,
  ArrowRight,
} from "lucide-react";

interface SlideData {
  id: string;
  placement: string;
  title: string;
  subtitle: string;
  image: string;
  cta_label: string;
  cta_link?: string;
  badge?: string;
  is_active: boolean;
  order: number;
}

export function AdminCarouselTab({
  adminFetch,
  showToast,
}: {
  adminFetch: (url: string, init?: RequestInit) => Promise<Response>;
  showToast: (msg: string) => void;
}) {
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<Partial<SlideData>>({
    placement: "homepage_top",
    title: "",
    subtitle: "",
    image: "/brand/study-carousel-ca.jpg",
    cta_label: "Explore Subscription",
    cta_link: "/courses",
    badge: "LAUNCH OFFER",
    is_active: true,
    order: 1,
  });

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await adminFetch("/api/admin/carousel");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setSlides(data.data);
      }
    } catch (e) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = !!currentSlide.id;
      const url = isEdit ? `/api/admin/carousel/${currentSlide.id}` : "/api/admin/carousel";
      const method = isEdit ? "PUT" : "POST";

      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentSlide),
      });
      const data = await res.json();
      if (data.success) {
        showToast(isEdit ? "Slide updated successfully." : "Slide created successfully.");
        setModalOpen(false);
        fetchSlides();
      } else {
        alert(data.message || "Failed to save slide.");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this carousel slide?")) return;
    try {
      const res = await adminFetch(`/api/admin/carousel/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Slide deleted.");
        fetchSlides();
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
            Module B4: Website Carousel Slide Editor
          </h2>
          <p className="text-xs text-[#77716E]">
            Customize top homepage hero slides, call-to-actions, and promotion badges.
          </p>
        </div>

        <button
          onClick={() => {
            setCurrentSlide({
              placement: "homepage_top",
              title: "",
              subtitle: "",
              image: "/brand/study-carousel-ca.jpg",
              cta_label: "Explore Subscription",
              cta_link: "/courses",
              badge: "NEW",
              is_active: true,
              order: slides.length + 1,
            });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#221D1D] hover:bg-black text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Slide</span>
        </button>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-3xl p-6 border border-[#E7E4E7] shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4B8097]">
                  Order #{s.order}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    s.is_active
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {s.is_active ? "Active" : "Hidden"}
                </span>
              </div>

              {s.badge && (
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#AED7E9]/30 text-[#221D1D] border border-[#AED7E9] mb-2">
                  {s.badge}
                </span>
              )}

              <h3 className="font-serif font-bold text-base text-[#221D1D] mb-1">
                {s.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                {s.subtitle}
              </p>
            </div>

            <div className="pt-4 border-t border-[#E7E4E7] flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                {s.cta_label}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCurrentSlide(s);
                    setModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E7E4E7] space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-6 top-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-serif font-bold text-[#221D1D]">
                {currentSlide.id ? "Edit Slide" : "New Website Slide"}
              </h3>
              <p className="text-xs text-slate-500">Configure slide copy, target destination, and ordering.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  value={currentSlide.title || ""}
                  onChange={(e) => setCurrentSlide({ ...currentSlide, title: e.target.value })}
                  placeholder="e.g. Master CA Foundation Business Laws"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subtitle Description</label>
                <textarea
                  rows={2}
                  value={currentSlide.subtitle || ""}
                  onChange={(e) => setCurrentSlide({ ...currentSlide, subtitle: e.target.value })}
                  placeholder="Short engaging description..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Badge</label>
                  <input
                    type="text"
                    value={currentSlide.badge || ""}
                    onChange={(e) => setCurrentSlide({ ...currentSlide, badge: e.target.value })}
                    placeholder="e.g. MOST POPULAR"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={currentSlide.order || 1}
                    onChange={(e) => setCurrentSlide({ ...currentSlide, order: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CTA Label</label>
                  <input
                    type="text"
                    value={currentSlide.cta_label || ""}
                    onChange={(e) => setCurrentSlide({ ...currentSlide, cta_label: e.target.value })}
                    placeholder="e.g. Explore Subscription"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CTA Link</label>
                  <input
                    type="text"
                    value={currentSlide.cta_link || ""}
                    onChange={(e) => setCurrentSlide({ ...currentSlide, cta_link: e.target.value })}
                    placeholder="/courses or /subscriptions/slug"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="slide-active"
                  checked={currentSlide.is_active ?? true}
                  onChange={(e) => setCurrentSlide({ ...currentSlide, is_active: e.target.checked })}
                  className="rounded text-[#221D1D]"
                />
                <label htmlFor="slide-active" className="text-xs font-semibold text-slate-700">
                  Visible on website
                </label>
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
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
