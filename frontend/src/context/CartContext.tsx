"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [checkoutStep, setInternalCheckoutStep] = useState<"cart" | "details" | "payment" | "success">("cart");
  const [lastOrderDetails, setLastOrderDetailsState] = useState<LastOrderDetails | null>(null);

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

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("lawkaksha_cart_items");
    if (!saved) return;

    let parsed: unknown;
    try {
      parsed = JSON.parse(saved);
    } catch {
      return;
    }
    if (!Array.isArray(parsed)) return;

    const restoreTimer = window.setTimeout(() => {
      setItems(parsed);
    }, 0);
    return () => window.clearTimeout(restoreTimer);
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lawkaksha_cart_items", JSON.stringify(items));
    }
  }, [items]);

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

