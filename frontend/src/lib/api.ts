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

/** Arbitrary JSON object returned by the backend. */
export type JsonObject = Record<string, unknown>;

/**
 * Shape of the student/admin session object persisted in localStorage.
 * The index signature keeps forward-compatibility with backend fields that
 * are added over time, without resorting to `any`.
 */
export interface AuthUser {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  student_id?: string;
  studentId?: string;
  studentRoll?: string;
  rollNumber?: string;
  target_exam?: string;
  targetExam?: string;
  activePlanTitle?: string;
  drm_access?: boolean;
  unlockedItemIds?: string[];
  [key: string]: unknown;
}

/** Normalised result of every backend call. */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  token?: string;
  code?: string;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("lawkaksha_token");
}

export function setAuthSession(token: string, user: AuthUser) {
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

export function getActiveUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("lawkaksha_active_student");
  if (!saved) return null;
  try {
    return JSON.parse(saved) as AuthUser;
  } catch {
    return null;
  }
}

export function getStudentAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("lawkaksha_student_token") ||
    localStorage.getItem("lawkaksha_token") ||
    localStorage.getItem("token") ||
    null
  );
}

export function isUserAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!(
    localStorage.getItem("lawkaksha_active_student") ||
    localStorage.getItem("lawkaksha_student_session") ||
    localStorage.getItem("lawkaksha_student_user") ||
    localStorage.getItem("lawkaksha_admin_session") ||
    localStorage.getItem("lawkaksha_student_token") ||
    localStorage.getItem("lawkaksha_token") ||
    localStorage.getItem("token")
  );
}

export function setStudentAuthSession(token: string, user: AuthUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem("lawkaksha_student_token", token);
  localStorage.setItem("lawkaksha_token", token);
  localStorage.setItem("lawkaksha_student_user", JSON.stringify(user));
  localStorage.setItem("lawkaksha_student_session", JSON.stringify(user));
  localStorage.setItem("lawkaksha_active_student", JSON.stringify(user));
  localStorage.removeItem("lawkaksha_admin_session");
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event("lawkaksha_student_updated"));
}

export function clearStudentAuthSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("lawkaksha_student_token");
  localStorage.removeItem("lawkaksha_token");
  localStorage.removeItem("lawkaksha_student_user");
  localStorage.removeItem("lawkaksha_student_session");
  localStorage.removeItem("lawkaksha_active_student");
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event("lawkaksha_student_updated"));
}

export function getStudentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("lawkaksha_student_user");
  if (!saved) return null;
  try {
    return JSON.parse(saved) as AuthUser;
  } catch {
    return null;
  }
}

export function getAuthSession(): {
  token: string | null;
  user: AuthUser | null;
} | null {
  if (typeof window === "undefined") return null;
  const token = getAuthToken();
  const user = getActiveUser();
  if (!token && !user) return null;
  return { token, user };
}

export async function apiRequest<T = JsonObject>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const isStudentEndpoint = endpoint.includes("/student");
  const token =
    (isStudentEndpoint ? getStudentAuthToken() : null) ||
    getAuthToken() ||
    getStudentAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers["Authorization"]) {
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

    const payload = (await res.json().catch(() => ({}))) as JsonObject;

    if (!res.ok) {
      return {
        success: false,
        message:
          (payload.message as string) ||
          `Request failed with status ${res.status}`,
        error: payload.error as string | undefined,
        code: payload.code as string | undefined,
        data: payload as T,
      };
    }

    return {
      success: true,
      data: payload as T,
      token: payload.token as string | undefined,
      message: payload.message as string | undefined,
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Network connection error. Please ensure your device is connected to the internet.";
    return {
      success: false,
      message,
    };
  }
}
