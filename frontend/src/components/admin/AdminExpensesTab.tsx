"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  RefreshCw,
  PieChart,
  Calendar,
  X,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface ExpenseData {
  id: string;
  category: "Hosting" | "Marketing" | "Content" | "Legal" | "Software" | "Misc";
  title: string;
  amount: number;
  expense_date: string;
  notes?: string;
  receipt_url?: string;
  created_at?: string;
}

interface ExpenseSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  categoryBreakdown: Record<string, number>;
}

export function AdminExpensesTab({
  adminFetch,
  showToast,
}: {
  adminFetch: (url: string, init?: RequestInit) => Promise<Response>;
  showToast: (msg: string) => void;
}) {
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary>({
    totalRevenue: 24750,
    totalExpenses: 7800,
    netProfit: 16950,
    categoryBreakdown: { Hosting: 2400, Software: 3500, Marketing: 1900 },
  });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<ExpenseData>>({
    category: "Hosting",
    title: "",
    amount: 0,
    expense_date: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [expRes, sumRes] = await Promise.all([
        adminFetch("/api/admin/expenses").then((r) => r.json()),
        adminFetch("/api/admin/expenses/summary").then((r) => r.json()),
      ]);

      if (expRes.success && Array.isArray(expRes.data)) {
        setExpenses(expRes.data);
      }
      if (sumRes.success && sumRes.data) {
        setSummary(sumRes.data);
      }
    } catch (e) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount) return;

    try {
      const res = await adminFetch("/api/admin/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Expense recorded successfully.");
        setModalOpen(false);
        loadData();
      } else {
        alert(data.message || "Failed to record expense.");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this expense record?")) return;
    try {
      const res = await adminFetch(`/api/admin/expenses/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Expense removed.");
        loadData();
      }
    } catch (e) {
      alert("Failed to delete.");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-[#221D1D]">
            Module B6: Business Expense Tracker &amp; P&amp;L Analysis
          </h2>
          <p className="text-xs text-[#77716E]">
            Monitor operating costs, statutory filing fees, cloud infrastructure, and net financial health.
          </p>
        </div>

        <button
          onClick={() => {
            setNewExpense({
              category: "Hosting",
              title: "",
              amount: 0,
              expense_date: new Date().toISOString().slice(0, 10),
              notes: "",
            });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#221D1D] hover:bg-black text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* P&L Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#E7E4E7] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Bookings Revenue</p>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-[#221D1D] mt-1">
              ₹{summary.totalRevenue}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E7E4E7] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Operating Expenses</p>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-[#221D1D] mt-1">
              ₹{summary.totalExpenses}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <ArrowDownRight className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E7E4E7] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Net Operating P&amp;L</p>
            <p className={`text-2xl sm:text-3xl font-serif font-bold mt-1 ${summary.netProfit >= 0 ? "text-emerald-700" : "text-red-700"}`}>
              {summary.netProfit >= 0 ? `+₹${summary.netProfit}` : `-₹${Math.abs(summary.netProfit)}`}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${summary.netProfit >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-3xl border border-[#E7E4E7] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E7E4E7] flex items-center justify-between">
          <h3 className="text-sm font-serif font-bold text-[#221D1D]">Expenses Ledger</h3>
          <span className="text-xs text-slate-400">{expenses.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[680px]">
            <thead className="bg-[#F7F7F5] text-slate-500 font-bold uppercase tracking-wider border-b border-[#E7E4E7]">
              <tr>
                <th className="p-4">Category</th>
                <th className="p-4">Expense Title</th>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Notes</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E4E7]">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No operating expenses recorded yet.
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {exp.category}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-[#221D1D]">{exp.title}</td>
                    <td className="p-4 text-slate-500">
                      {new Date(exp.expense_date).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 font-bold text-[#221D1D]">₹{exp.amount}</td>
                    <td className="p-4 text-slate-500 max-w-xs truncate">{exp.notes || "—"}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-8 shadow-2xl border border-[#E7E4E7] space-y-5 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 sm:right-6 top-4 sm:top-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-serif font-bold text-[#221D1D]">Record Business Expense</h3>
              <p className="text-xs text-slate-500">Entries will update the live Net P&amp;L balance.</p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expense Title *</label>
                <input
                  type="text"
                  required
                  value={newExpense.title || ""}
                  onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                  placeholder="e.g. Render Cloud Hosting - October"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={newExpense.category || "Hosting"}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9] bg-white"
                  >
                    <option value="Hosting">Hosting</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Content">Content</option>
                    <option value="Legal">Legal</option>
                    <option value="Software">Software</option>
                    <option value="Misc">Misc</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newExpense.amount || ""}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expense Date</label>
                <input
                  type="date"
                  value={newExpense.expense_date || ""}
                  onChange={(e) => setNewExpense({ ...newExpense, expense_date: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Vendor</label>
                <textarea
                  rows={2}
                  value={newExpense.notes || ""}
                  onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                  placeholder="Invoice notes, reference ID..."
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
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
