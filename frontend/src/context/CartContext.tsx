"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { getActiveUserEmail, apiRequest } from "@/lib/api";

export type BookFormat = "pdf";

export interface CartItem {
  id: string;
  title: string;
  format: BookFormat;
  price: number;
  originalPrice: number;
  category: string;
  quantity: number;
  badge?: string;
}

/**
 * Receipt / enrolment summary produced after a successful payment.
 * `id`, `total_amount`, `amount` and `currency` mirror the server order payload,
 * the remaining fields are the client-side receipt details.
 */
export interface LastOrderDetails {
  orderId?: string;
  razorpayPaymentId?: string;
  items: CartItem[];
  totalAmount: number;
  discountGiven?: number;
  date: string;
  studentName: string;
  email: string;
  phone?: string;
  studentId: string;
  tempPassword: string;
  boundGmail?: string;
  deviceId?: string;
  deviceName?: string;
  unlockedItemIds?: string[];
  accessType?: string;
  id?: string;
  total_amount?: number;
  amount?: number;
  currency?: string;
  [key: string]: unknown;
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  couponCode: string;
  couponDiscount: number;
  couponError: string;
  couponSuccess: string;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  cartSubtotal: number;
  cartTotal: number;
  cartSavings: number;
  totalItemCount: number;
  clearCart: () => void;
  checkoutStep: "cart" | "details" | "payment" | "success";
  setCheckoutStep: (step: "cart" | "details" | "payment" | "success" | "shipping") => void;
  lastOrderDetails: LastOrderDetails | null;
  setLastOrderDetails: (details: Partial<LastOrderDetails>) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const FORMAT_PRICING = {
  pdf: { multiplier: 1, label: "Encrypted Digital Codex", tag: "Online In-Web Reader" },
};

function getCartStorageKey(email: string | null): string {
  if (email && typeof email === "string" && email.trim()) {
    return `lawkaksha_cart_user_${email.trim().toLowerCase()}`;
  }
  return "lawkaksha_cart_guest";
}

function readStoredCart(email: string | null): { found: boolean; items: CartItem[] } {
  if (typeof window === "undefined") return { found: false, items: [] };
  const key = getCartStorageKey(email);
  const raw = localStorage.getItem(key);
  if (!raw) return { found: false, items: [] };
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return { found: true, items: parsed };
    }
  } catch {}
  return { found: false, items: [] };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [, setActiveEmail] = useState<string | null>(null);
  const [, setIsLoaded] = useState(false);
  const activeEmailRef = useRef<string | null>(null);
  const isLoadedRef = useRef(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [checkoutStep, setInternalCheckoutStep] = useState<"cart" | "details" | "payment" | "success">("cart");
  const [lastOrderDetails, setLastOrderDetailsState] = useState<LastOrderDetails | null>(null);

  // Synchronize cart state whenever the active user logs in or out
  const syncCartWithAuth = useCallback(async (currentEmail: string | null) => {
    const prevEmail = activeEmailRef.current;
    activeEmailRef.current = currentEmail;
    setActiveEmail(currentEmail);

    if (currentEmail) {
      // User is logged in:
      // 1. Check if this exact user already has saved cart items
      const localResult = readStoredCart(currentEmail);
      if (localResult.found) {
        // User has a previously saved cart under this email: restore it!
        setItems(localResult.items);
      } else {
        // First login / no saved cart for this account: cart is EMPTY by default!
        setItems([]);
        localStorage.setItem(getCartStorageKey(currentEmail), JSON.stringify([]));
      }

      // 2. Also check backend database cart in case items were saved from another session
      try {
        const res = await apiRequest<{ items?: CartItem[] }>("/api/student/cart");
        if (res.success && Array.isArray(res.data?.items) && res.data.items.length > 0) {
          if (!localResult.found || localResult.items.length === 0) {
            setItems(res.data.items);
            localStorage.setItem(getCartStorageKey(currentEmail), JSON.stringify(res.data.items));
          }
        }
      } catch {}
    } else {
      // User is logged out / guest:
      if (prevEmail) {
        // User just logged out: clear active cart so next user starts empty
        setItems([]);
        localStorage.removeItem("lawkaksha_cart_guest");
      } else {
        const guestResult = readStoredCart(null);
        setItems(guestResult.items);
      }
    }

    // Clear legacy single-key storage so old unauthenticated items never leak across logins
    if (typeof window !== "undefined") {
      localStorage.removeItem("lawkaksha_cart_items");
    }

    setIsLoaded(true);
    isLoadedRef.current = true;
  }, []);

  // Initial load on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const initialEmail = getActiveUserEmail();
    const timer = setTimeout(() => {
      void syncCartWithAuth(initialEmail);
    }, 0);
    return () => clearTimeout(timer);
  }, [syncCartWithAuth]);

  // Listen for login/logout events across the app and storage updates
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkAuthStatus = () => {
      const currentEmail = getActiveUserEmail();
      if (currentEmail !== activeEmailRef.current) {
        syncCartWithAuth(currentEmail);
      }
    };

    window.addEventListener("storage", checkAuthStatus);
    window.addEventListener("lawkaksha_student_updated", checkAuthStatus);
    window.addEventListener("lawkaksha_auth_changed", checkAuthStatus);

    const interval = window.setInterval(checkAuthStatus, 800);

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
      window.removeEventListener("lawkaksha_student_updated", checkAuthStatus);
      window.removeEventListener("lawkaksha_auth_changed", checkAuthStatus);
      window.clearInterval(interval);
    };
  }, [syncCartWithAuth]);

  // Save cart to specific storage key on changes (only after initial load has finished)
  useEffect(() => {
    if (!isLoadedRef.current || typeof window === "undefined") return;

    const email = activeEmailRef.current;
    const storageKey = getCartStorageKey(email);
    localStorage.setItem(storageKey, JSON.stringify(items));
    localStorage.removeItem("lawkaksha_cart_items");

    // Sync to backend student cart if authenticated
    if (email) {
      const timer = window.setTimeout(() => {
        apiRequest("/api/student/cart", {
          method: "POST",
          body: JSON.stringify({ items }),
        }).catch(() => null);
      }, 500);
      return () => window.clearTimeout(timer);
    }
  }, [items]);

  // The checkout flow stores a partial order payload (server order first, receipt
  // fields added later), so the setter accepts a partial summary.
  const setLastOrderDetails = (details: Partial<LastOrderDetails>) => {
    setLastOrderDetailsState(details as LastOrderDetails);
  };

  const setCheckoutStep = (step: "cart" | "details" | "payment" | "success" | "shipping") => {
    if (step === "shipping") {
      setInternalCheckoutStep("details");
    } else {
      setInternalCheckoutStep(step);
    }
  };

  const addToCart = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === newItem.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { ...newItem, format: "pdf", quantity: 1 }];
    });
    setIsCartOpen(true);
    setCheckoutStep("cart");
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "LAW20" || cleanCode === "CALAW20") {
      setCouponCode(cleanCode);
      setCouponDiscount(20);
      setCouponSuccess("20% Launch Discount Applied!");
      setCouponError("");
      return true;
    } else if (cleanCode === "RANKER10") {
      setCouponCode(cleanCode);
      setCouponDiscount(10);
      setCouponSuccess("10% Ranker Discount Applied!");
      setCouponError("");
      return true;
    } else {
      setCouponError("Invalid coupon code. Try 'LAW20' or 'RANKER10'");
      setCouponSuccess("");
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponError("");
    setCouponSuccess("");
  };

  const clearCart = () => {
    setItems([]);
    if (typeof window !== "undefined") {
      const email = activeEmailRef.current;
      const storageKey = getCartStorageKey(email);
      localStorage.setItem(storageKey, JSON.stringify([]));
      localStorage.removeItem("lawkaksha_cart_items");
      if (email) {
        apiRequest("/api/student/cart", {
          method: "POST",
          body: JSON.stringify({ items: [] }),
        }).catch(() => null);
      }
    }
  };

  const cartSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalOriginal = items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
  
  const discountAmount = Math.round((cartSubtotal * couponDiscount) / 100);
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);
  const cartSavings = Math.max(0, totalOriginal - cartTotal);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        couponCode,
        couponDiscount,
        couponError,
        couponSuccess,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        cartTotal,
        cartSavings,
        totalItemCount,
        clearCart,
        checkoutStep,
        setCheckoutStep,
        lastOrderDetails,
        setLastOrderDetails,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

