"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getOrCreateDeviceId, getDeviceFriendlyName } from "@/utils/deviceHelper";
import { ShieldAlert, LogOut, ArrowRight, Laptop } from "lucide-react";
import Link from "next/link";

export interface BoundDevice {
  deviceId: string;
  deviceName: string;
  deviceType: "mobile" | "desktop" | "tablet";
  ipAddress: string;
  boundDate: string;
  lastActive: string;
  status: "active" | "terminated";
}

interface DeviceSessionContextType {
  activeDevice: BoundDevice;
  deviceConflict: boolean;
  setDeviceConflict: (val: boolean) => void;
  conflictDetails: { message: string; activeDeviceName?: string } | null;
  transferDevice: (newDeviceName: string) => void;
  resetDeviceCount: number;
  maxResets: number;
  deviceTransferHistory: { date: string; from: string; to: string; reason: string }[];
  logout: () => Promise<void>;
}

const DeviceSessionContext = createContext<DeviceSessionContextType | undefined>(undefined);

export function DeviceSessionProvider({ children }: { children: React.ReactNode }) {
  const [activeDevice, setActiveDevice] = useState<BoundDevice>({
    deviceId: "",
    deviceName: "Current Device",
    deviceType: "desktop",
    ipAddress: "Verified Network",
    boundDate: "Today",
    lastActive: "Active Session",
    status: "active",
  });

  const [deviceConflict, setDeviceConflict] = useState(false);
  const [conflictDetails, setConflictDetails] = useState<{
    message: string;
    activeDeviceName?: string;
  } | null>(null);
  const [resetDeviceCount, setResetDeviceCount] = useState(1);
  const maxResets = 3;

  const [deviceTransferHistory, setDeviceTransferHistory] = useState([
    {
      date: "Enrollment Session",
      from: "Hardware Authorization Gate",
      to: "Current Hardware",
      reason: "Initial Enrollment Registration",
    },
  ]);

  // Initialize current device identifiers on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const devId = getOrCreateDeviceId();
      const devName = getDeviceFriendlyName();
      setActiveDevice({
        deviceId: devId,
        deviceName: devName,
        deviceType: /phone|android|iphone/i.test(devName) ? "mobile" : "desktop",
        ipAddress: "Verified Device",
        boundDate: "Active",
        lastActive: "Just now",
        status: "active",
      });
    }
  }, []);

  const logout = useCallback(async () => {
    if (typeof window === "undefined") return;
    try {
      const token = localStorage.getItem("lawkaksha_token");
      const devId = getOrCreateDeviceId();
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ deviceId: devId }),
        }).catch(() => null);
      }
    } catch (e) {}

    localStorage.removeItem("lawkaksha_token");
    localStorage.removeItem("lawkaksha_student_session");
    localStorage.removeItem("lawkaksha_active_student");
    setDeviceConflict(false);
    setConflictDetails(null);
    window.dispatchEvent(new Event("storage"));
    window.location.href = "/login";
  }, []);

  // Periodic Single-Device Heartbeat (Runs every 45 seconds when logged in)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkHeartbeat = async () => {
      const token = localStorage.getItem("lawkaksha_token");
      const studentSessionStr = localStorage.getItem("lawkaksha_student_session") || localStorage.getItem("lawkaksha_active_student");
      if (!token || !studentSessionStr) return;

      let identifier = "";
      try {
        const parsed = JSON.parse(studentSessionStr);
        identifier = parsed.student_id || parsed.studentId || parsed.email || "";
      } catch (e) {}

      const currentDevId = getOrCreateDeviceId();

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/device-heartbeat`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              deviceId: currentDevId,
              studentId: identifier,
              email: identifier.includes("@") ? identifier : undefined,
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (data.conflict) {
            setDeviceConflict(true);
            setConflictDetails({
              message: data.message || "Your session has been terminated because your account was logged in on another device.",
              activeDeviceName: data.activeDeviceName || "Another Device",
            });
            // Revoke local credentials to prevent unauthorized browsing
            localStorage.removeItem("lawkaksha_token");
            localStorage.removeItem("lawkaksha_student_session");
            localStorage.removeItem("lawkaksha_active_student");
            window.dispatchEvent(new Event("storage"));
          }
        }
      } catch (err) {
        // Network or offline, ignore harmless heartbeat errors
      }
    };

    // Run initial heartbeat after 15s, then every 45s
    const initialTimer = setTimeout(checkHeartbeat, 15000);
    const interval = setInterval(checkHeartbeat, 45000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const transferDevice = (newDeviceName: string) => {
    const oldName = activeDevice.deviceName;
    const devId = getOrCreateDeviceId();
    const newBound: BoundDevice = {
      deviceId: devId,
      deviceName: newDeviceName,
      deviceType: newDeviceName.toLowerCase().includes("phone") ? "mobile" : "desktop",
      ipAddress: "Verified Network",
      boundDate: "Today",
      lastActive: "Just now",
      status: "active",
    };

    setActiveDevice(newBound);
    setResetDeviceCount((c) => c + 1);
    setDeviceTransferHistory((prev) => [
      {
        date: new Date().toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        from: oldName,
        to: newDeviceName,
        reason: "User Initiated Hardware License Transfer",
      },
      ...prev,
    ]);
    setDeviceConflict(false);
    setConflictDetails(null);
  };

  return (
    <DeviceSessionContext.Provider
      value={{
        activeDevice,
        deviceConflict,
        setDeviceConflict,
        conflictDetails,
        transferDevice,
        resetDeviceCount,
        maxResets,
        deviceTransferHistory,
        logout,
      }}
    >
      {children}

      {/* Global Device Conflict Modal (Appears when another device takes over the account) */}
      {deviceConflict && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-red-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100/70 px-3 py-1 rounded-full border border-red-200">
                Single-Device Security Policy
              </span>
              <h3 className="text-lg font-bold text-[#221D1D] mt-2">
                Active Session Terminated
              </h3>
              <p className="text-xs text-[#77716E] mt-1.5 leading-relaxed">
                {conflictDetails?.message ||
                  "Your account was accessed from another device. To protect copyright study codices, The Law Kaksha strictly limits each account to 1 single device at a time."}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#F7F7F5] border border-[#E7E4E7] text-left text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#221D1D]">
                <Laptop className="w-3.5 h-3.5 text-[#4B8097]" />
                <span>Currently Active Device:</span>
              </div>
              <p className="font-mono text-[11px] text-[#4D433F]">
                {conflictDetails?.activeDeviceName || "Another Computer / Phone"}
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => {
                  setDeviceConflict(false);
                  setConflictDetails(null);
                }}
                className="w-full py-3 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Re-Authenticate on This Device</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  setDeviceConflict(false);
                  setConflictDetails(null);
                  window.location.href = "/";
                }}
                className="w-full py-2 rounded-full bg-[#F7F7F5] hover:bg-[#E7E4E7] text-[#77716E] hover:text-[#221D1D] font-semibold text-xs border border-[#E7E4E7] transition cursor-pointer"
              >
                Back to Home Page
              </button>
            </div>
          </div>
        </div>
      )}
    </DeviceSessionContext.Provider>
  );
}

export function useDeviceSession() {
  const context = useContext(DeviceSessionContext);
  if (!context) {
    throw new Error("useDeviceSession must be used within a DeviceSessionProvider");
  }
  return context;
}
