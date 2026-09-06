"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type BookFormat = "pdf" | "paperback" | "combo";

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

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string, format: BookFormat) => void;
  updateQuantity: (id: string, format: BookFormat, quantity: number) => void;
  changeFormat: (id: string, currentFormat: BookFormat, newFormat: BookFormat) => void;
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
  checkoutStep: "cart" | "shipping" | "payment" | "success";
  setCheckoutStep: (step: "cart" | "shipping" | "payment" | "success") => void;
  lastOrderDetails: any | null;
  setLastOrderDetails: (details: any) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Format pricing table relative to base PDF price
export const FORMAT_PRICING = {
  pdf: { multiplier: 1, label: "Encrypted Digital PDF", tag: "Instant Access" },
  paperback: { multiplier: 1.8, label: "Deluxe Paper Back Book", tag: "Doorstep Dispatch" },
  combo: { multiplier: 2.2, label: "Mastermind Combo (PDF + Book + Mock Pass)", tag: "Best Value • 40% Off" },
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Default with one starter popular item for instant engagement
  const [items, setItems] = useState<CartItem[]>([
    {
      id: "ca-books-both-hardcopies",
      title: "Deluxe Hardcopies: Both Volumes Box Set (Vol 1 & 2)",
      format: "paperback",
      price: 699,
      originalPrice: 1199,
      category: "2-Volume CA Book Set",
      quantity: 1,
      badge: "Most Popular • Printed Set",
    },
  ]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("LAW20");
  const [couponDiscount, setCouponDiscount] = useState(20); // 20% by default
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("20% Launch Discount Applied!");
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "shipping" | "payment" | "success">("cart");
  const [lastOrderDetails, setLastOrderDetails] = useState<any | null>(null);

  const addToCart = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.id === newItem.id && i.format === newItem.format
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
    setIsCartOpen(true);
    setCheckoutStep("cart");
  };

  const removeFromCart = (id: string, format: BookFormat) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.format === format)));
  };

  const updateQuantity = (id: string, format: BookFormat, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, format);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.format === format ? { ...i, quantity } : i
      )
    );
  };

  const changeFormat = (id: string, currentFormat: BookFormat, newFormat: BookFormat) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === id && i.format === currentFormat) {
          // calculate adjusted price
          let basePrice = i.price;
          if (currentFormat === "paperback") basePrice = Math.round(i.price / 1.8);
          else if (currentFormat === "combo") basePrice = Math.round(i.price / 2.2);

          let newPrice = basePrice;
          let newOrig = Math.round(basePrice * 1.6);
          if (newFormat === "paperback") {
            newPrice = Math.round(basePrice * 1.8);
            newOrig = Math.round(newPrice * 1.5);
          } else if (newFormat === "combo") {
            newPrice = Math.round(basePrice * 2.2);
            newOrig = Math.round(newPrice * 1.6);
          }

          return {
            ...i,
            format: newFormat,
            price: newPrice,
            originalPrice: newOrig,
          };
        }
        return i;
      })
    );
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "LAW20" || cleanCode === "JUDICIARY20") {
      setCouponCode(cleanCode);
      setCouponDiscount(20);
      setCouponSuccess("Flat 20% Off Applied Successfully!");
      setCouponError("");
      return true;
    } else if (cleanCode === "AIR1" || cleanCode === "TOPPER30") {
      setCouponCode(cleanCode);
      setCouponDiscount(30);
      setCouponSuccess("Special Ranker 30% Off Applied!");
      setCouponError("");
      return true;
    } else if (cleanCode === "FIRST100") {
      setCouponCode(cleanCode);
      setCouponDiscount(15);
      setCouponSuccess("Welcome Bonus Applied!");
      setCouponError("");
      return true;
    } else {
      setCouponError("Invalid coupon code. Try 'LAW20' or 'AIR1'");
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
  const cartSavings = totalOriginal - cartTotal;
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
        changeFormat,
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
