"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Download,
  RefreshCw,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  ShieldCheck,
} from "lucide-react";

interface PaymentRecord {
  id: string;
  order_id: string;
  gateway: string;
  gateway_payment_id?: string;
  gateway_order_id?: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

export function AdminPaymentsTab({
  adminFetch,
  showToast,
}: {
  adminFetch: (url: string, init?: RequestInit) => Promise<Response>;
  showToast: (msg: string) => void;
}) {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await adminFetch("/api/admin/payments");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPayments(data.data);
      }
    } catch (e) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleExport = async (entity: "orders" | "payments" | "students" | "expenses") => {
    try {
      const res = await adminFetch(`/api/admin/export/${entity}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${entity}-export-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      showToast(`${entity.toUpperCase()} CSV exported.`);
    } catch (e) {
      alert("Failed to export: " + entity);
    }
  };

  const filtered = payments.filter((p) => {
    const term = search.toLowerCase();
    const pid = (p.gateway_payment_id || p.id || "").toLowerCase();
    const oid = (p.order_id || "").toLowerCase();
    return pid.includes(term) || oid.includes(term);
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-[#221D1D]">
            Module B10: Payments Ledger &amp; Data Exports
          </h2>
          <p className="text-xs text-[#77716E]">
            Inspect all payment gateway transactions and download statutory reconciliation CSV files.
          </p>
        </div>

        {/* Quick CSV Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleExport("orders")}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Orders CSV</span>
          </button>
          <button
            onClick={() => handleExport("payments")}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Payments CSV</span>
          </button>
          <button
            onClick={() => handleExport("expenses")}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Expenses CSV</span>
          </button>
          <button
            onClick={() => handleExport("students")}
            className="px-3 py-2 rounded-xl bg-[#221D1D] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Students CSV</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-3xl border border-[#E7E4E7] shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Payment ID or Order ID..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-[#E7E4E7] text-xs focus:outline-none focus:border-[#AED7E9]"
          />
        </div>

        <button
          onClick={loadPayments}
          className="p-2.5 rounded-xl border border-[#E7E4E7] bg-white hover:bg-slate-50 text-slate-700"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#E7E4E7] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F5] text-slate-500 font-bold uppercase tracking-wider border-b border-[#E7E4E7]">
              <tr>
                <th className="p-4">Payment Ref</th>
                <th className="p-4">Order Ref</th>
                <th className="p-4">Gateway</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E4E7]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No payment gateway transactions recorded yet.
                  </td>
                </tr>
              ) : (
                filtered.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#221D1D]">
                      {pay.gateway_payment_id || pay.id}
                    </td>
                    <td className="p-4 font-mono text-slate-600">
                      {pay.order_id}
                    </td>
                    <td className="p-4 uppercase text-[11px] font-semibold text-slate-700">
                      {pay.gateway}
                    </td>
                    <td className="p-4 font-bold text-[#221D1D]">
                      ₹{pay.amount} {pay.currency}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {pay.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(pay.created_at).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
