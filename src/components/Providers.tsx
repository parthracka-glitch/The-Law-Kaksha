"use client";

import React from "react";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { DeviceSessionProvider } from "@/context/DeviceSessionContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DeviceSessionProvider>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </DeviceSessionProvider>
  );
}
