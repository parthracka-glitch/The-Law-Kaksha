"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  X,
  Plus,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

interface OrderRecord {
  id: string;
  order_no?: string;
  user_id?: string;
  user_email?: string;
  student_name?: string;
  student_phone?: string;
  total_amount?: number;
  subtotal?: number;
  discount_amount?: number;
  status: "paid" | "pending" | "refunded" | "failed";
  created_at: string;
  personal_details?: {
    fullName?: string;
    email?: string;
    phone?: string;
    city?: string;
    state?: string;
    targetExam?: string;
  };
  items?: {
    id: string;
    title: string;
    price: number;
    quantity: number;
  }[];
  entitlement_id?: string;
}

export function AdminOrdersTab({ adminFetch, showToast }: { adminFetch: (url: string, init?: RequestInit) => Promise<Response>; showToast: (msg: string) => void }) {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminFetch("/api/admin/orders");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      }
    } catch (e) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefund = async (orderId: string) => {
    if (!confirm("Are you sure you want to issue a full refund for this booking? This will automatically revoke all associated course entitlements.")) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await adminFetch(`/api/admin/orders/${orderId}/refund`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        showToast("Order refunded and access revoked successfully.");
        fetchOrders();
        setSelectedOrder(null);
      } else {
        alert(data.message || "Failed to process refund.");
      }
    } catch (err: any) {
      alert("Error processing refund: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExtendEntitlement = async (entitlementId: string) => {
    try {
      setActionLoading(true);
      const res = await adminFetch(`/api/admin/entitlements/${entitlementId}/extend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: 30 }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Entitlement extended by 30 days.");
        fetchOrders();
      } else {
        alert(data.message || "Failed to extend entitlement.");
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await adminFetch("/api/admin/export/orders");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-export-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      showToast("Orders CSV exported successfully.");
    } catch (e) {
      alert("Export failed.");
    }
  };

  const filtered = orders.filter((o) => {
    const term = search.toLowerCase();
    const orderRef = (o.order_no || o.id || "").toLowerCase();
    const name = (o.personal_details?.fullName || o.student_name || "").toLowerCase();
    const email = (o.personal_details?.email || o.user_email || "").toLowerCase();

    const matchesSearch = orderRef.includes(term) || name.includes(term) || email.includes(term);
    const matchesFilter = filter === "all" || o.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Export Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-[#221D1D]">
            Module B1: Subscription Bookings &amp; Orders Management
          </h2>
          <p className="text-xs text-[#77716E]">
            Inspect student personal snapshots, process statutory refunds, and manage access rights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="p-2.5 rounded-xl border border-[#E7E4E7] bg-white hover:bg-slate-50 text-slate-700 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#221D1D] hover:bg-black text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#E7E4E7] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ref, student, email..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-[#E7E4E7] text-xs focus:outline-none focus:border-[#AED7E9]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar scrollbar-none touch-pan-x">
          {["all", "paid", "pending", "refunded"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
                filter === st
                  ? "bg-[#AED7E9]/40 text-[#221D1D] border border-[#AED7E9]"
                  : "bg-[#F7F7F5] text-slate-600 hover:bg-slate-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E7E4E7] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-[#F7F7F5] text-slate-500 font-bold uppercase tracking-wider border-b border-[#E7E4E7]">
              <tr>
                <th className="p-4">Order Ref</th>
                <th className="p-4">Candidate</th>
                <th className="p-4">Target Exam</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E4E7]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const name = order.personal_details?.fullName || order.student_name || "Aspirant";
                  const email = order.personal_details?.email || order.user_email || "N/A";
                  const exam = order.personal_details?.targetExam || "CA Foundation";
                  const dateStr = new Date(order.created_at).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#221D1D]">
                        {order.order_no || order.id}
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-[#221D1D]">{name}</p>
                        <p className="text-[11px] text-slate-400">{email}</p>
                      </td>
                      <td className="p-4 text-slate-600">{exam}</td>
                      <td className="p-4 font-bold text-[#221D1D]">
                        ₹{order.total_amount || 0}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === "paid"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : order.status === "refunded"
                              ? "bg-red-50 text-red-800 border border-red-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{dateStr}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 rounded-lg border border-[#E7E4E7] bg-white hover:bg-slate-100 text-[#221D1D] font-semibold text-xs transition-colors"
                        >
                          Inspect Snapshot
                        </button>

                        {order.status === "paid" && (
                          <button
                            onClick={() => handleRefund(order.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs border border-red-200 transition-colors"
                          >
                            Refund
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Snapshot Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E7E4E7] space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-6 top-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Personal Details Snapshot (§10 DPDP)
              </span>
              <h3 className="text-xl font-serif font-bold text-[#221D1D] mt-0.5">
                Order {selectedOrder.order_no || selectedOrder.id}
              </h3>
            </div>

            {/* Candidate Info Box */}
            <div className="bg-[#F7F7F5] p-5 rounded-2xl border border-[#E7E4E7] space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <User className="w-4 h-4 text-slate-400" />
                <span className="font-semibold">Full Name:</span>
                <span>{selectedOrder.personal_details?.fullName || selectedOrder.student_name || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="font-semibold">Email:</span>
                <span>{selectedOrder.personal_details?.email || selectedOrder.user_email || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="font-semibold">Phone:</span>
                <span>{selectedOrder.personal_details?.phone || selectedOrder.student_phone || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="font-semibold">Location:</span>
                <span>
                  {selectedOrder.personal_details?.city || "N/A"}, {selectedOrder.personal_details?.state || "N/A"}
                </span>
              </div>
            </div>

            {/* Purchased Items Box */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                Purchased Pass Items
              </h4>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="font-semibold text-slate-800">{item.title}</span>
                    <span className="font-bold text-[#221D1D]">₹{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions in Modal */}
            <div className="pt-4 border-t border-[#E7E4E7] flex items-center justify-between">
              {selectedOrder.status === "paid" && (
                <button
                  onClick={() => handleRefund(selectedOrder.id)}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Issue Full Refund &amp; Revoke</span>
                </button>
              )}

              <button
                onClick={() => setSelectedOrder(null)}
                className="ml-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
