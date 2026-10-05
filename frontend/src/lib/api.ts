/**
 * The Law Kaksha - API Client & Session Helper
 */

export const PRODUCTION_BACKEND_URL = "https://the-law-kaksha.onrender.com";

/**
 * Dynamically resolves the API base URL.
 * Automatically detects whether code is executing in a production browser (e.g. Vercel,
 * custom domains, or mobile devices accessing production) and routes requests to the
 * live production Render backend when NEXT_PUBLIC_API_URL is unset or pointing to localhost.
 */
export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  // 1. Browser context (client-side execution on any device)
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname.endsWith(".local");

    // If accessing from a remote production host (e.g. *.vercel.app, thelawkaksha.com, or any mobile browser)
    if (!isLocalhost) {
      if (
        envUrl &&
        !envUrl.includes("localhost") &&
        !envUrl.includes("127.0.0.1") &&
        !envUrl.includes("0.0.0.0")
      ) {
        return envUrl.replace(/\/$/, "");
      }
      return PRODUCTION_BACKEND_URL;
    }

    // Local dev on localhost / 127.0.0.1
    if (envUrl) {
      return envUrl.replace(/\/$/, "");
    }
    return "http://localhost:5000";
  }

  // 2. Server-side / build-time context
  if (
    envUrl &&
    !envUrl.includes("localhost") &&
    !envUrl.includes("127.0.0.1") &&
    !envUrl.includes("0.0.0.0")
  ) {
    return envUrl.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    return PRODUCTION_BACKEND_URL;
  }

  return envUrl ? envUrl.replace(/\/$/, "") : "http://localhost:5000";
}

export const API_BASE_URL = getApiBaseUrl();

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("lawkaksha_token");
}

export function setAuthSession(token: string, user: any) {
  if (typeof window === "undefined") return;
  localStorage.setItem("lawkaksha_token", token);
  localStorage.setItem("lawkaksha_active_student", JSON.stringify(user));
  window.dispatchEvent(new Event("storage"));
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("lawkaksha_token");
  localStorage.removeItem("lawkaksha_active_student");
  window.dispatchEvent(new Event("storage"));
}

export function getActiveUser(): any | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("lawkaksha_active_student");
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch (e) {
    return null;
  }
}

export function getAuthSession(): { token: string | null; user: any | null } | null {
  if (typeof window === "undefined") return null;
  const token = getAuthToken();
  const user = getActiveUser();
  if (!token && !user) return null;
  return { token, user };
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const baseUrl = getApiBaseUrl();
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data.message || `Request failed with status ${res.status}`,
        error: data.error,
        data,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Network connection error. Please ensure your device is connected to the internet.",
    };
  }
}
