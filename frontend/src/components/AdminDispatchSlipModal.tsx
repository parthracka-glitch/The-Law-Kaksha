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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-black/[0.08] w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 sm:px-8 py-4 bg-white/90 backdrop-blur-md border-b border-black/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0071E3]/10 flex items-center justify-center text-[#0071E3]">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1D1D1F] tracking-tight">
                Batch Shipping &amp; AWB Dispatch Slips
              </h3>
              <p className="text-xs text-[#86868B]">
                Courier-compliant dispatch slips for physical Hardcopy Compilers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] flex items-center justify-center transition-all active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div className="p-4 sm:p-5 bg-[#F5F5F7] border-b border-black/[0.06] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#86868B] font-semibold">Courier Partner:</span>
            <div className="flex items-center bg-black/[0.04] p-1 rounded-full gap-1">
              {["DTDC Express", "BlueDart Air", "Speed Post", "Delhivery"].map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCourier(c)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    selectedCourier === c
                      ? "bg-white text-[#1D1D1F] shadow-sm"
                      : "text-[#86868B] hover:text-[#1D1D1F]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
          >
            <Printer className="w-4 h-4" />
            Print All {orders.length} Shipping Slips
          </button>
        </div>

        {/* Printable Label Previews */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 bg-[#FBFBFD]">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-6 rounded-3xl bg-white text-[#1D1D1F] shadow-sm border border-black/[0.08] space-y-4 font-sans"
            >
              {/* Slip Top Header */}
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
                <div className="flex items-center gap-3">
                  <LawKakshaLogo size="sm" />
                  <div className="border-l border-black/[0.08] pl-3">
                    <p className="text-[11px] text-[#86868B] font-medium">
                      Publishing Division • Pan-India Speed Dispatch Hub
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 bg-[#0071E3]/10 text-[#0071E3] font-mono text-xs font-bold rounded-full">
                    {selectedCourier.toUpperCase()}
                  </span>
                  <p className="text-[10px] text-[#86868B] font-mono mt-1">
                    AWB: {order.tracking || "DTDC-7819203"}
                  </p>
                </div>
              </div>

              {/* Barcode & Routing */}
              <div className="flex flex-col sm:flex-row items-center justify-between bg-[#F5F5F7] p-4 rounded-2xl border border-black/[0.04]">
                <div className="font-mono text-xs text-[#1D1D1F] space-y-0.5">
                  <p><strong>ORDER ID:</strong> {order.id}</p>
                  <p className="text-[#86868B]"><strong>DATE:</strong> {order.date} • <strong>TYPE:</strong> PREPAID</p>
                </div>
                {/* Mock Barcode */}
                <div className="flex flex-col items-center mt-2 sm:mt-0">
                  <div className="h-8 flex items-end gap-0.5">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-[#1D1D1F] h-full"
                        style={{ width: i % 4 === 0 ? "3px" : "1.5px" }}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-[#86868B] mt-0.5">
                    *{order.id}*
                  </span>
                </div>
              </div>

              {/* Sender & Consignee Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Consignee */}
                <div className="p-4 rounded-2xl border border-black/[0.06] bg-[#F5F5F7] space-y-1">
                  <p className="text-[10px] font-bold uppercase text-[#86868B] tracking-wider">
                    SHIP TO (CONSIGNEE):
                  </p>
                  <p className="font-bold text-sm text-[#1D1D1F]">{order.customer}</p>
                  <p className="text-[#1D1D1F] leading-snug">
                    {order.address || "Flat 402, Judicial Officers Enclave, Sector 15"},
                  </p>
                  <p className="text-[#1D1D1F] font-semibold">{order.state} — {order.pincode || "226010"}</p>
                  <p className="text-[#86868B] font-mono text-[11px] pt-1">
                    📞 {order.phone}
                  </p>
                </div>

                {/* Sender */}
                <div className="p-4 rounded-2xl border border-black/[0.06] bg-[#F5F5F7] space-y-1">
                  <p className="text-[10px] font-bold uppercase text-[#86868B] tracking-wider">
                    FROM (RETURN ADDRESS):
                  </p>
                  <p className="font-bold text-sm text-[#1D1D1F]">The Law Kaksha Dispatch Hub</p>
                  <p className="text-[#1D1D1F] leading-snug">
                    Plot 18, Bar Council Knowledge Park, Supreme Court Road,
                  </p>
                  <p className="text-[#1D1D1F] font-semibold">New Delhi, Delhi — 110001</p>
                  <p className="text-[#86868B] font-mono text-[11px] pt-1">
                    📞 Helpline: +91 98200 12345
                  </p>
                </div>
              </div>

              {/* Package Content & Sign */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-black/[0.06] text-xs gap-2">
                <div>
                  <span className="font-medium text-[#86868B]">PACKAGE CONTENT: </span>
                  <strong className="text-[#1D1D1F] font-semibold">{order.item}</strong>
                </div>
                <div className="text-right text-[10px] text-[#86868B]">
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
