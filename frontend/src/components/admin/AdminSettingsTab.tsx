"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Mail,
  Phone,
  MessageCircle,
  Megaphone,
  Globe,
  Check,
  RefreshCw,
  Save,
} from "lucide-react";

interface SiteSettingsData {
  site_title?: string;
  contact_email?: string;
  contact_phone?: string;
  whatsapp_number?: string;
  announcement?: {
    enabled: boolean;
    text: string;
    badge: string;
    link?: string;
  };
  social_links?: {
    youtube?: string;
    telegram?: string;
    instagram?: string;
    linkedin?: string;
  };
  footer_text?: string;
}

export function AdminSettingsTab({
  adminFetch,
  showToast,
}: {
  adminFetch: (url: string, init?: RequestInit) => Promise<Response>;
  showToast: (msg: string) => void;
}) {
  const [settings, setSettings] = useState<SiteSettingsData>({
    site_title: "The Law Kaksha",
    contact_email: "grievance@thelawkaksha.com",
    contact_phone: "+91 98765 43210",
    whatsapp_number: "+91 98765 43210",
    announcement: {
      enabled: true,
      text: "⚡ Special CA Foundation & CSEET Study Passes available at introductory ₹99/month!",
      badge: "LAUNCH OFFER",
      link: "/#subscriptions",
    },
    social_links: {
      youtube: "https://youtube.com/@thelawkaksha",
      telegram: "https://t.me/thelawkaksha",
      instagram: "https://instagram.com/thelawkaksha",
      linkedin: "https://linkedin.com/company/thelawkaksha",
    },
    footer_text: "Exclusively for ICAI CA Foundation & ICSI CSEET Aspirants. Protected by Indian DPDP Act 2023.",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await adminFetch("/api/admin/settings");
        const data = await res.json();
        if (data.success && data.data) {
          setSettings((prev) => ({ ...prev, ...data.data }));
        }
      } catch (e) {
        // Fallback
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Site settings updated successfully.");
      } else {
        alert(data.message || "Failed to save settings.");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl">
      <div>
        <h2 className="text-lg font-serif font-bold text-[#221D1D]">
          Module B11: Platform Configuration &amp; Statutory Settings
        </h2>
        <p className="text-xs text-[#77716E]">
          Update contact details, social links, announcement ribbons, and compliance disclaimers.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Contact Info Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E4E7] shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-[#221D1D] flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#4B8097]" />
            Official Contact &amp; Grievance Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Grievance / Contact Email</label>
              <input
                type="email"
                value={settings.contact_email || ""}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Helpline Phone Number</label>
              <input
                type="text"
                value={settings.contact_phone || ""}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">WhatsApp Support Number</label>
              <input
                type="text"
                value={settings.whatsapp_number || ""}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Platform Brand Title</label>
              <input
                type="text"
                value={settings.site_title || ""}
                onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
              />
            </div>
          </div>
        </div>

        {/* Announcement Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E4E7] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#221D1D] flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#4B8097]" />
              Announcement Ribbon (Top Bar)
            </h3>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.announcement?.enabled ?? true}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcement: {
                      ...(settings.announcement || { text: "", badge: "" }),
                      enabled: e.target.checked,
                    },
                  })
                }
                className="rounded text-[#221D1D]"
              />
              <span className="font-semibold text-slate-700">Enabled</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Badge</label>
              <input
                type="text"
                value={settings.announcement?.badge || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcement: {
                      ...(settings.announcement || { text: "", enabled: true }),
                      badge: e.target.value,
                    },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Announcement Copy</label>
              <input
                type="text"
                value={settings.announcement?.text || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcement: {
                      ...(settings.announcement || { badge: "", enabled: true }),
                      text: e.target.value,
                    },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E4E7] shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-[#221D1D] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#4B8097]" />
            Official Social Communities
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Telegram Community</label>
              <input
                type="url"
                value={settings.social_links?.telegram || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, telegram: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">YouTube Channel</label>
              <input
                type="url"
                value={settings.social_links?.youtube || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, youtube: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
              />
            </div>
          </div>
        </div>

        {/* Footer legal disclaimer */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E4E7] shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-[#221D1D]">
            Statutory Legal Footer &amp; Disclaimers
          </h3>
          <textarea
            rows={3}
            value={settings.footer_text || ""}
            onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
            className="w-full p-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-[#221D1D] hover:bg-black text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving Settings...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Site Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
