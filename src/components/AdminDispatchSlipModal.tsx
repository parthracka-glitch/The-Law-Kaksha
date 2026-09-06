"use client";

import React, { useState } from "react";
import {
  X,
  Printer,
  Truck,
  CheckCircle,
  Package,
  FileText,
  Download,
  Barcode,
  Building,
  MapPin,
  Phone,
  Calendar,
} from "lucide-react";
import { LawKakshaLogo } from "./LawKakshaLogo";

export interface DispatchOrder {
  id: string;
  customer: string;
  phone: string;
  item: string;
  state: string;
  address?: string;
  pincode?: string;
  amount: string;
  date: string;
  status: string;
  tracking: string;
  courier?: string;
}

interface AdminDispatchSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: DispatchOrder[];
}

export function AdminDispatchSlipModal({
  isOpen,
  onClose,
  orders,
}: AdminDispatchSlipModalProps) {
  const [selectedCourier, setSelectedCourier] = useState("DTDC Express");
  const [printSuccess, setPrintSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    setPrintSuccess(true);
    setTimeout(() => {
      window.print();
      setPrintSuccess(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-sky-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-sky-50 border border-sky-200 text-[#0284C7]">
              <Printer className="w-5 h-5 text-[#0284C7]" />
            </span>
            <div>
              <h3 className="text-base font-serif font-bold text-slate-900">
                Batch Dispatch Slips &amp; Shipping Label Generator
              </h3>
              <p className="text-xs text-slate-500">
                Generate courier compliant AWB slips for physical Hardcopy Compilers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors border border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div className="p-4 bg-slate-50 border-b border-sky-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#0284C7] font-bold">Courier Partner:</span>
            {["DTDC Express", "BlueDart Air", "India Post Speed Post", "Delhivery"].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCourier(c)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                  selectedCourier === c
                    ? "bg-white border-sky-300 text-[#0284C7] shadow-xs"
                    : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] hover:brightness-105 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-sky-500/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            Print All {orders.length} Shipping Slips
          </button>
        </div>

        {/* Printable Label Previews */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-[#F8FAFC]">
          {orders.map((order, idx) => (
            <div
              key={order.id}
              className="p-6 rounded-2xl bg-white text-slate-900 shadow-sm border border-sky-200 space-y-4 font-sans"
            >
              {/* Slip Top Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284C7] border border-sky-200 flex items-center justify-center font-serif font-black text-sm shadow-xs">
                    LK
                  </div>
                  <div>
                    <h4 className="font-serif font-black text-base text-slate-900 leading-tight">
                      THE LAW KAKSHA ACADEMY
                    </h4>
                    <p className="text-[10px] text-slate-500 font-semibold">
                      Judicial Examination Publishing Division • New Delhi
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 bg-sky-50 text-[#0284C7] border border-sky-200 font-mono text-xs font-black rounded">
                    {selectedCourier.toUpperCase()}
                  </span>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    AWB: {order.tracking || "DTDC-7819203"}
                  </p>
                </div>
              </div>

              {/* Barcode & Routing */}
              <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="font-mono text-xs text-slate-800 space-y-0.5">
                  <p><strong>ORDER ID:</strong> {order.id}</p>
                  <p><strong>DATE:</strong> {order.date} | <strong>TYPE:</strong> PREPAID HARDCOPY</p>
                </div>
                {/* Mock Barcode */}
                <div className="flex flex-col items-center mt-2 sm:mt-0">
                  <div className="h-8 flex items-end gap-0.5">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <div
                        key={i}
                        className={`bg-slate-900 w-${i % 3 === 0 ? "1" : "0.5"} h-full`}
                        style={{ width: i % 4 === 0 ? "3px" : "1.5px" }}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-slate-600 mt-0.5">
                    *{order.id}*
                  </span>
                </div>
              </div>

              {/* Sender & Consignee Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Consignee */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    SHIP TO (CONSIGNEE):
                  </p>
                  <p className="font-bold text-sm text-slate-900">{order.customer}</p>
                  <p className="text-slate-700 leading-snug">
                    {order.address || "Flat 402, Judicial Officers Enclave, Sector 15"},
                  </p>
                  <p className="text-slate-700 font-semibold">{order.state} — {order.pincode || "226010"}</p>
                  <p className="text-slate-900 font-mono text-[11px] pt-1">
                    📞 {order.phone}
                  </p>
                </div>

                {/* Sender */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    FROM (RETURN ADDRESS):
                  </p>
                  <p className="font-bold text-sm text-slate-900">The Law Kaksha Dispatch Hub</p>
                  <p className="text-slate-700 leading-snug">
                    Plot 18, Bar Council Knowledge Park, Supreme Court Road,
                  </p>
                  <p className="text-slate-700 font-semibold">New Delhi, Delhi — 110001</p>
                  <p className="text-slate-900 font-mono text-[11px] pt-1">
                    📞 Helpline: +91 98200 12345
                  </p>
                </div>
              </div>

              {/* Package Content & Sign */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-200 text-xs gap-2">
                <div>
                  <span className="font-semibold text-slate-600">PACKAGE CONTENT: </span>
                  <strong className="text-slate-900">{order.item}</strong>
                </div>
                <div className="text-right text-[10px] text-slate-500 italic">
                  Handle with Care • Academic Legal Documents • Waterproof Sealed
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
