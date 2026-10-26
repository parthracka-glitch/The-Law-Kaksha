"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, type ApiResponse } from "@/lib/api";
import { getOrCreateDeviceId, getDeviceFriendlyName } from "@/utils/deviceHelper";

interface GoogleAuthUser {
  name?: string;
  email?: string;
  role?: string;
}

interface GoogleAuthPayload {
  success?: boolean;
  message?: string;
  token?: string;
  role?: string;
  user?: GoogleAuthUser;
  student?: GoogleAuthUser;
  data?: GoogleAuthPayload;
}

interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleAccountsId {
  initialize: (params: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    ux_mode?: string;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      theme?: string;
      size?: string;
      type?: string;
      shape?: string;
      text?: string;
      logo_alignment?: string;
      width?: number;
    }
  ) => void;
  prompt: () => void;
}

interface GoogleNamespace {
  accounts?: {
    id?: GoogleAccountsId;
  };
}

interface GoogleWindow extends Window {
  google?: GoogleNamespace;
}

interface GoogleSignInButtonProps {
  onSuccess?: (data: ApiResponse<GoogleAuthPayload>) => void;
  onError?: (error: string) => void;
  selectedCourse?: string;
  text?: "signin_with" | "signup_with" | "continue_with";
  className?: string;
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    const message = err.message;
    if (typeof message === "string" && message) return message;
  }
  return fallback;
}

export function GoogleSignInButton({
  onSuccess,
  onError,
  selectedCourse,
  text = "continue_with",
  className = "",
}: GoogleSignInButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [conflictData, setConflictData] = useState<{
    credential: string;
    activeDeviceName: string;
  } | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const googleClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "1161695468-r6iekifqhrg221smt0hou13c0lh7scr3.apps.googleusercontent.com";

  const executeGoogleAuth = useCallback(
    async (credentialStr: string, forceSwitch = false) => {
      if (!credentialStr) {
        const err = "Google did not provide a valid authentication token.";
        setErrorMsg(err);
        if (onError) onError(err);
        return;
      }

      setLoading(true);
      setErrorMsg("");
      if (!forceSwitch) {
        setConflictData(null);
      }

      try {
        const currentDeviceId = getOrCreateDeviceId();
        const currentDeviceName = getDeviceFriendlyName();

        const res = await apiRequest<GoogleAuthPayload>("/api/auth/google", {
          method: "POST",
          body: JSON.stringify({
            credential: credentialStr,
            deviceId: currentDeviceId,
            deviceName: currentDeviceName,
            selectedCourse: selectedCourse || "CA Foundation Paper 2: Business Laws",
            forceSwitchDevice: forceSwitch,
          }),
        });

        if (res && (res.code === "DEVICE_CONFLICT" || (res.data as any)?.conflict)) {
          setConflictData({
            credential: credentialStr,
            activeDeviceName:
              (res.data as any)?.activeDeviceName || "Another Registered Workstation",
          });
          setErrorMsg("");
          setLoading(false);
          return;
        }

        if (!res || !res.success) {
          const msg = res?.message || "Google authentication failed. Please try again.";
          setErrorMsg(msg);
          if (onError) onError(msg);
          setLoading(false);
          return;
        }

        const respData = res.data;
        const innerData = respData?.data || respData;
        const token = respData?.token || res.token || innerData?.token;
        const user =
          innerData?.user ||
          innerData?.student ||
          respData?.user ||
          respData?.student || { name: "Student" };
        const role = innerData?.role || respData?.role || user?.role || "student";

        if (role === "admin") {
          const adminSession = {
            name: user.name || "The Law Kaksha Admin",
            email: user.email || "admin@thelawkaksha.com",
            role: "admin",
            token: token,
          };
          localStorage.removeItem("lawkaksha_student_session");
          localStorage.removeItem("lawkaksha_active_student");
          localStorage.setItem("lawkaksha_admin_session", JSON.stringify(adminSession));
          if (token) {
            localStorage.setItem("lawkaksha_admin_token", token);
            localStorage.setItem("lawkaksha_token", token);
          }
          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new Event("lawkaksha_student_updated"));
          if (onSuccess) onSuccess(res);
          else router.push("/admin");
        } else {
          localStorage.removeItem("lawkaksha_admin_session");
          localStorage.setItem("lawkaksha_student_session", JSON.stringify(user));
          localStorage.setItem("lawkaksha_active_student", JSON.stringify(user));
          if (token) localStorage.setItem("lawkaksha_token", token);
          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new Event("lawkaksha_student_updated"));
          if (onSuccess) onSuccess(res);
          else router.push("/");
        }
      } catch (err: unknown) {
        console.error("[Google Auth Error]", err);
        const msg = getErrorMessage(err, "Connection error during Google Sign-In.");
        setErrorMsg(msg);
        if (onError) onError(msg);
      } finally {
        setLoading(false);
      }
    },
    [onError, onSuccess, router, selectedCourse]
  );

  const handleGoogleCallback = useCallback(
    (response: GoogleCredentialResponse) => {
      if (!response || !response.credential) {
        const err = "Google did not provide a valid authentication token.";
        setErrorMsg(err);
        if (onError) onError(err);
        return;
      }
      executeGoogleAuth(response.credential, false);
    },
    [executeGoogleAuth, onError]
  );

  const googleCallbackRef = useRef(handleGoogleCallback);

  useEffect(() => {
    googleCallbackRef.current = handleGoogleCallback;
  }, [handleGoogleCallback]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const initializeGoogle = () => {
      if (typeof window === "undefined" || !googleClientId) return;
      const google = (window as GoogleWindow).google;

      if (google?.accounts?.id) {
        try {
          google.accounts.id.initialize({
            client_id: googleClientId,
            callback: (response: GoogleCredentialResponse) => {
              void googleCallbackRef.current(response);
            },
            auto_select: false,
            cancel_on_tap_outside: true,
            ux_mode: "popup",
          });

          if (buttonRef.current) {
            google.accounts.id.renderButton(buttonRef.current, {
              theme: "outline",
              size: "large",
              type: "standard",
              shape: "pill",
              text,
              logo_alignment: "left",
              width: buttonRef.current.offsetWidth || 340,
            });
          }
        } catch (e) {
          console.warn("[Google Identity Services] Initialization warning:", e);
        }
      }
    };

    if ((window as GoogleWindow).google?.accounts?.id) {
      initializeGoogle();
    } else {
      interval = setInterval(() => {
        if ((window as GoogleWindow).google?.accounts?.id) {
          clearInterval(interval);
          initializeGoogle();
        }
      }, 200);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [googleClientId, text]);

  const handleCustomClick = () => {
    if (!googleClientId) {
      setErrorMsg("Google Client ID is not configured.");
      return;
    }
    const google = typeof window !== "undefined" ? (window as GoogleWindow).google : null;
    if (google?.accounts?.id) {
      try {
        google.accounts.id.prompt();
      } catch (e) {
        console.warn("[Google Prompt]", e);
      }
    }
  };

  return (
    <div className={`w-full flex flex-col items-center gap-2 ${className}`}>
      {/* Official Google GIS Button Container */}
      <div
        ref={buttonRef}
        className="w-full flex justify-center min-h-[44px]"
      />

      {/* Styled Fallback / Manual Trigger Button */}
      <button
        type="button"
        onClick={handleCustomClick}
        disabled={loading}
        className="sr-only focus:not-sr-only focus:static w-full py-2.5 px-4 rounded-full border border-[#E7E4E7] bg-white text-[#221D1D] font-semibold text-xs flex items-center justify-center gap-2 shadow-xs hover:bg-[#F7F7F5] transition-colors"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      {conflictData && (
        <div className="w-full p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs space-y-2.5 animate-in fade-in">
          <div className="space-y-1">
            <p className="font-semibold text-amber-950">
              Active Session on Another Device
            </p>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              This Google account is currently active on:{" "}
              <span className="font-bold underline">{conflictData.activeDeviceName}</span>. Simultaneous logins are strictly prohibited to protect digital rights.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-0.5">
            <button
              type="button"
              disabled={loading}
              onClick={() => executeGoogleAuth(conflictData.credential, true)}
              className="flex-1 py-2 px-3 rounded-lg bg-[#005A9C] hover:bg-[#004F8A] text-white font-medium text-xs shadow-xs transition flex items-center justify-center gap-1 cursor-pointer disabled:opacity-60"
            >
              {loading ? "Transferring..." : "Transfer Session to This Device"}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => setConflictData(null)}
              className="py-1.5 px-3 rounded-lg text-amber-900 hover:bg-amber-100/60 text-xs font-medium transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {errorMsg && (
        <p className="text-xs text-rose-600 font-medium text-center animate-in fade-in">
          {errorMsg}
        </p>
      )}

      {loading && (
        <p className="text-xs text-[#77716E] font-medium text-center animate-pulse">
          Authenticating with Google...
        </p>
      )}
    </div>
  );
}
