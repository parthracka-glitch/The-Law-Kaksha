"use client";

import React, { useMemo, useSyncExternalStore } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SecurePdfReader } from "@/components/SecurePdfReader";
import type { AuthUser } from "@/lib/api";

const ADMIN_SESSION_KEY = "lawkaksha_admin_session";
const STUDENT_SESSION_KEY = "lawkaksha_student_session";
const ACTIVE_STUDENT_KEY = "lawkaksha_active_student";

interface ReaderSession {
  name: string;
  roll: string;
}

interface ReaderAccess {
  isUnlocked: boolean;
  session: ReaderSession;
}

function subscribeToSessionChanges(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("lawkaksha_student_updated", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("lawkaksha_student_updated", onStoreChange);
  };
}

function getSessionSnapshot(): string | null {
  try {
    return JSON.stringify([
      localStorage.getItem(ADMIN_SESSION_KEY),
      localStorage.getItem(STUDENT_SESSION_KEY),
      localStorage.getItem(ACTIVE_STUDENT_KEY),
    ]);
  } catch {
    return null;
  }
}

function getServerSessionSnapshot(): string | null {
  return null;
}

function parseSession(raw: string | null): AuthUser | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function computeReaderAccess(
  snapshot: string | null,
  file: string | null,
  isSampleFile: boolean
): ReaderAccess {
  if (snapshot === null) {
    return {
      isUnlocked: isSampleFile,
      session: { name: "Law Student", roll: "LK-SECURE-VIEW" },
    };
  }

  let rawSessions: (string | null)[] = [];
  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (Array.isArray(parsed)) rawSessions = parsed as (string | null)[];
  } catch {
  }

  const adminRaw = rawSessions[0] ?? null;
  if (adminRaw) {
    const adminSession = parseSession(adminRaw);
    if (adminSession && adminSession.role === "admin") {
      return {
        isUnlocked: true,
        session: { name: adminSession.name || "Administrator", roll: "LK-ADMIN-DRM" },
      };
    }
  }

  const unlockedIds: string[] = [];
  let name = "Student";
  let roll = "LK-2026-STU";

  const studentSession = parseSession(rawSessions[1] ?? null);
  if (studentSession) {
    name = studentSession.name || name;
    roll = studentSession.student_id || studentSession.rollNumber || roll;
    if (Array.isArray(studentSession.unlockedItemIds)) {
      unlockedIds.push(...studentSession.unlockedItemIds);
    }
  }

  const activeStudent = parseSession(rawSessions[2] ?? null);
  if (activeStudent) {
    name = activeStudent.name || name;
    roll = activeStudent.student_id || activeStudent.rollNumber || roll;
    if (Array.isArray(activeStudent.unlockedItemIds)) {
      unlockedIds.push(...activeStudent.unlockedItemIds);
    }
  }

  const lowerFile = (file || "").toLowerCase();
  const isCseetFile = lowerFile.includes("cseet") || lowerFile.includes("vol-2") || lowerFile.includes("vol2");
  const isCaFile = lowerFile.includes("ca-") || lowerFile.includes("foundation") || lowerFile.includes("soga") || lowerFile.includes("partnership") || lowerFile.includes("contract") || lowerFile.includes("vol-1") || lowerFile.includes("vol1");

  const hasCaAccess = unlockedIds.some((id) => {
    const l = id.toLowerCase();
    return l.includes("ca-foundation") || l.includes("course-ca") || l.includes("prod-vol1") || l.includes("all-access");
  });

  const hasCsAccess = unlockedIds.some((id) => {
    const l = id.toLowerCase();
    return l.includes("cseet") || l.includes("course-cseet") || l.includes("prod-vol2") || l.includes("all-access");
  });

  let hasAccess = false;
  if (isCseetFile) {
    hasAccess = hasCsAccess;
  } else if (isCaFile) {
    hasAccess = hasCaAccess;
  } else {
    hasAccess = unlockedIds.some((id) => lowerFile.includes(id.toLowerCase())) || hasCaAccess || hasCsAccess;
  }

  return {
    isUnlocked: Boolean(isSampleFile || hasAccess),
    session: { name, roll },
  };
}

export default function ReaderClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const file = searchParams.get("file");
  const rawPdf = searchParams.get("pdf");
  const queryTitle = searchParams.get("title");

  const isSampleFile =
    Boolean(
      file &&
        (file.includes("unit-1") ||
          file.includes("unit_1") ||
          file.includes("sample") ||
          file.includes("preview") ||
          file.includes("unit-2") ||
          file.includes("unit_2") ||
          file.includes("unit-3") ||
          file.includes("unit_3") ||
          file.includes("part 1") ||
          file.includes("part1") ||
          file.includes("infographic") ||
          file.includes("ldr") ||
          file.includes("framework"))
    ) ||
    searchParams.get("sample") === "true" ||
    searchParams.get("sample") === "1";

  // Clean title
  const title =
    queryTitle ||
    (file
      ? file
          .replace(/\.pdf$/i, "")
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : "The Law Kaksha Master Study Codex");

  // Compute canonical PDF url
  const sampleParam = isSampleFile ? "?sample=true" : "";
  const pdfUrl = rawPdf
    ? rawPdf
    : file
    ? `/api/pdf/${encodeURIComponent(file)}${sampleParam}`
    : `/api/pdf/sale-of-goods-unit-1.pdf?sample=true`;

  // Session watermark data, derived from the stored session
  const sessionSnapshot = useSyncExternalStore(
    subscribeToSessionChanges,
    getSessionSnapshot,
    getServerSessionSnapshot
  );
  const { isUnlocked, session } = useMemo(
    () => computeReaderAccess(sessionSnapshot, file, isSampleFile),
    [sessionSnapshot, file, isSampleFile]
  );

  const handleClose = () => {
    if (typeof window !== "undefined") {
      const fromParam = searchParams.get("from");
      if (fromParam === "admin") {
        router.push("/admin");
        return;
      }
      if (fromParam === "student") {
        router.push("/student");
        return;
      }
      if (fromParam === "main" || fromParam === "home") {
        router.push("/");
        return;
      }
      if (window.opener) {
        window.close();
      } else if (window.history.length > 1 && !document.referrer.includes("/login") && !document.referrer.includes("/notes/")) {
        router.back();
      } else {
        router.push("/");
      }
    }
  };

  const handleBuy = () => {
    router.push("/courses");
  };

  return (
    <main className="w-full h-screen bg-[#111418] overflow-hidden select-none">
      <SecurePdfReader
        isOpen={true}
        onClose={handleClose}
        pdfUrl={pdfUrl}
        title={title}
        isPurchased={isUnlocked}
        previewPagesLimit={isUnlocked ? undefined : 5}
        price={99}
        onBuy={handleBuy}
        studentName={session.name}
        studentRoll={session.roll}
      />
    </main>
  );
}
