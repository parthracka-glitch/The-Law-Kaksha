"use client";

import React, { useState, useEffect } from "react";
import {
  Gift,
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  Tag,
  Clock,
  CheckCircle2,
  X,
  Sparkles,
} from "lucide-react";

interface OfferData {
  id: string;
  title: string;
  description: string;
  banner_url?: string;
  coupon_code?: string;
  discount_badge?: string;
  valid_from?: string;
  valid_to?: string;
  is_active: boolean;
}

export function AdminOffersTab({
  adminFetch,
  showToast,
}: {
  adminFetch: (url: string, init?: RequestInit) => Promise<Response>;
  showToast: (msg: string) => void;
}) {
  const [offers, setOffers] = useState<OfferData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<Partial<OfferData>>({
    title: "",
    description: "",
    coupon_code: "LAUNCH99",
    discount_badge: "FLAT ₹200 OFF",
    valid_from: new Date().toISOString().slice(0, 10),
    valid_to: new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10),
    is_active: true,
  });

  const loadOffers = async () => {
    try {
      setLoading(true);
      const res = await adminFetch("/api/admin/offers");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setOffers(data.data);
      }
    } catch (e) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = !!currentOffer.id;
      const url = isEdit ? `/api/admin/offers/${currentOffer.id}` : "/api/admin/offers";
      const method = isEdit ? "PUT" : "POST";

      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentOffer),
      });
      const data = await res.json();
      if (data.success) {
        showToast(isEdit ? "Offer updated." : "Offer published.");
        setModalOpen(false);
        loadOffers();
      } else {
        alert(data.message || "Failed to save offer.");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this promotional offer?")) return;
    try {
      const res = await adminFetch(`/api/admin/offers/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Offer removed.");
        loadOffers();
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
            Module B7: Promotional Offers &amp; Campaign Banners
          </h2>
          <p className="text-xs text-[#77716E]">
            Create active discount campaigns linked to coupons, display on /offers and landing page.
          </p>
        </div>

        <button
          onClick={() => {
            setCurrentOffer({
              title: "",
              description: "",
              coupon_code: "EXEMPTION2026",
              discount_badge: "20% OFF",
              valid_from: new Date().toISOString().slice(0, 10),
              valid_to: new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10),
              is_active: true,
            });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#221D1D] hover:bg-black text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Promo Campaign</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((off) => (
          <div
            key={off.id}
            className="bg-white rounded-3xl p-6 border border-[#E7E4E7] shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                {off.discount_badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {off.discount_badge}
                  </span>
                )}
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    off.is_active ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {off.is_active ? "Active" : "Draft"}
                </span>
              </div>

              <h3 className="font-serif font-bold text-base text-[#221D1D] mb-1">
                {off.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                {off.description}
              </p>

              {off.coupon_code && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F7F7F5] border border-slate-200 text-xs font-mono font-bold text-[#221D1D] mb-4">
                  <Tag className="w-3 h-3 text-[#4B8097]" />
                  <span>{off.coupon_code}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#E7E4E7] flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Until: {off.valid_to || "No expiry"}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCurrentOffer(off);
                    setModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(off.id)}
                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E7E4E7] space-y-5 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-6 top-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-serif font-bold text-[#221D1D]">
                {currentOffer.id ? "Edit Offer" : "New Promotional Offer"}
              </h3>
              <p className="text-xs text-slate-500">Configured campaigns appear on the dedicated /offers page.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  value={currentOffer.title || ""}
                  onChange={(e) => setCurrentOffer({ ...currentOffer, title: e.target.value })}
                  placeholder="e.g. Diwali Exemption 20% Off"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={currentOffer.description || ""}
                  onChange={(e) => setCurrentOffer({ ...currentOffer, description: e.target.value })}
                  placeholder="Campaign terms & details..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Linked Coupon Code</label>
                  <input
                    type="text"
                    value={currentOffer.coupon_code || ""}
                    onChange={(e) => setCurrentOffer({ ...currentOffer, coupon_code: e.target.value.toUpperCase() })}
                    placeholder="e.g. DIWALI20"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:outline-none focus:border-[#AED7E9]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount Badge</label>
                  <input
                    type="text"
                    value={currentOffer.discount_badge || ""}
                    onChange={(e) => setCurrentOffer({ ...currentOffer, discount_badge: e.target.value })}
                    placeholder="e.g. 20% OFF"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Valid From</label>
                  <input
                    type="date"
                    value={currentOffer.valid_from || ""}
                    onChange={(e) => setCurrentOffer({ ...currentOffer, valid_from: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Valid To</label>
                  <input
                    type="date"
                    value={currentOffer.valid_to || ""}
                    onChange={(e) => setCurrentOffer({ ...currentOffer, valid_to: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="offer-active"
                  checked={currentOffer.is_active ?? true}
                  onChange={(e) => setCurrentOffer({ ...currentOffer, is_active: e.target.checked })}
                  className="rounded text-[#221D1D]"
                />
                <label htmlFor="offer-active" className="text-xs font-semibold text-slate-700">
                  Active and visible to students
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
                  Save Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
