"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
  transferDevice: (newDeviceName: string) => void;
  resetDeviceCount: number;
  maxResets: number;
  deviceTransferHistory: { date: string; from: string; to: string; reason: string }[];
}

const DeviceSessionContext = createContext<DeviceSessionContextType | undefined>(undefined);

export function DeviceSessionProvider({ children }: { children: React.ReactNode }) {
  const [activeDevice, setActiveDevice] = useState<BoundDevice>({
    deviceId: "DEV-WIN11-SEC-8492",
    deviceName: "Primary Device: Windows 11 PC (Google Chrome 124)",
    deviceType: "desktop",
    ipAddress: "103.21.144.92 (New Delhi, India)",
    boundDate: "15 Jan 2026",
    lastActive: "Just now (Active Session)",
    status: "active",
  });

  const [deviceConflict, setDeviceConflict] = useState(false);
  const [resetDeviceCount, setResetDeviceCount] = useState(1);
  const maxResets = 3;

  const [deviceTransferHistory, setDeviceTransferHistory] = useState([
    {
      date: "15 Jan 2026, 10:30 AM",
      from: "Initial Enrollment Registration",
      to: "Windows 11 PC (Google Chrome 124)",
      reason: "Primary Authorized Hardware Binding",
    },
  ]);

  const transferDevice = (newDeviceName: string) => {
    const oldName = activeDevice.deviceName;
    const newBound: BoundDevice = {
      deviceId: `DEV-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`,
      deviceName: newDeviceName,
      deviceType: newDeviceName.toLowerCase().includes("phone") ? "mobile" : "desktop",
      ipAddress: "103.21.144.92 (Verified Network)",
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
        reason: "User Initiated Hardware License Re-binding",
      },
      ...prev,
    ]);
    setDeviceConflict(false);
  };

  return (
    <DeviceSessionContext.Provider
      value={{
        activeDevice,
        deviceConflict,
        setDeviceConflict,
        transferDevice,
        resetDeviceCount,
        maxResets,
        deviceTransferHistory,
      }}
    >
      {children}
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
