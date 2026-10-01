/**
 * The Law Kaksha - API Client & Session Helper
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

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
      message: err.message || "Network error. Please ensure the backend is running.",
    };
  }
}
