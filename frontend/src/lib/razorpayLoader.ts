/**
 * The Law Kaksha - Razorpay Checkout Singleton & Pre-Warming Loader
 *
 * Ensures ultra-fast modal opening by:
 * 1. Singleton script loading promise (never duplicate network requests or DOM elements)
 * 2. Reusing pre-existing <script> elements injected by layout.tsx
 * 3. Pre-warming the checkout bundle and DNS/TLS handshakes as soon as the student enters the funnel
 */

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayFailureResponse {
  error?: {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
    metadata?: Record<string, unknown>;
  };
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id?: string;
  handler: (response: RazorpayPaymentResponse) => void | Promise<void>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
    method?: "upi" | "card" | "netbanking" | "wallet" | string;
  };
  notes?: Record<string, string | undefined>;
  theme?: {
    color?: string;
    backdrop_color?: string;
    hide_topbar?: boolean;
  };
  modal?: {
    ondismiss?: () => void;
    backdropclose?: boolean;
    escape?: boolean;
    confirm_close?: boolean;
    animation?: boolean;
  };
  retry?: {
    enabled?: boolean;
    max_count?: number;
  };
  timeout?: number;
}

export interface RazorpayInstance {
  open: () => void;
  close?: () => void;
  on: (
    event: "payment.failed",
    handler: (response: RazorpayFailureResponse) => void
  ) => void;
}

export interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}

export interface RazorpayWindow extends Window {
  Razorpay?: RazorpayConstructor;
}

let razorpayPromise: Promise<boolean> | null = null;

/**
 * Loads or awaits the Razorpay checkout script.
 * Returns true if window.Razorpay is available.
 */
export function loadRazorpayCheckoutScript(): Promise<boolean> {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  // If already available on window, resolve immediately (0ms)
  if ((window as RazorpayWindow).Razorpay) {
    return Promise.resolve(true);
  }

  // If a load is already in-flight, return the shared promise
  if (razorpayPromise) {
    return razorpayPromise;
  }

  razorpayPromise = new Promise<boolean>((resolve) => {
    // 1. Check if a checkout.js script element already exists in the document (e.g. from layout.tsx)
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src*="checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      if ((window as RazorpayWindow).Razorpay) {
        resolve(true);
        return;
      }

      const onExistingLoad = () => {
        resolve(Boolean((window as RazorpayWindow).Razorpay));
      };

      const onExistingError = () => {
        razorpayPromise = null;
        resolve(false);
      };

      existingScript.addEventListener("load", onExistingLoad, { once: true });
      existingScript.addEventListener("error", onExistingError, { once: true });

      // In case the script has already completed loading before the listener was attached
      setTimeout(() => {
        if ((window as RazorpayWindow).Razorpay) {
          resolve(true);
        }
      }, 50);

      return;
    }

    // 2. Inject script if not found in DOM
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    script.onload = () => {
      resolve(Boolean((window as RazorpayWindow).Razorpay));
    };

    script.onerror = () => {
      razorpayPromise = null;
      resolve(false);
    };

    document.body.appendChild(script);
  });

  return razorpayPromise;
}

/**
 * Warm up the Razorpay SDK and network connections in the background
 */
export function preloadRazorpay(): void {
  if (typeof window !== "undefined") {
    loadRazorpayCheckoutScript().catch(() => {});
  }
}
