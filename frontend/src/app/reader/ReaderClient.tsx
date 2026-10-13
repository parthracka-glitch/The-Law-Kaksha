"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SecurePdfReader } from "@/components/SecurePdfReader";

export default function ReaderClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const file = searchParams.get("file");
  const rawPdf = searchParams.get("pdf");
  const queryTitle = searchParams.get("title");

  // Compute canonical PDF url
  const pdfUrl = rawPdf || (file ? `/api/pdf/${file}` : "");

  // Clean title
  const title =
    queryTitle ||
    (file
      ? file
          .replace(/\.pdf$/i, "")
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : "The Law Kaksha Master Study Codex");

  const isSampleFile =
    Boolean(
      file &&
        (file.includes("unit-1") ||
          file.includes("sample") ||
          file.includes("unit-2") ||
          file.includes("unit-3") ||
          file.includes("framework"))
    ) || searchParams.get("sample") === "true";

  // Session watermark data
  const [studentProfile, setStudentProfile] = useState({
    name: "Law Student",
    roll: "LK-SECURE-VIEW",
  });
  const [isUnlocked, setIsUnlocked] = useState(isSampleFile);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const adminSession = localStorage.getItem("lawkaksha_admin_session");
        if (adminSession) {
          const parsed = JSON.parse(adminSession);
          if (parsed.role === "admin") {
            setIsUnlocked(true);
            setStudentProfile({
              name: parsed.name || "Administrator",
              roll: "LK-ADMIN-DRM",
            });
            return;
          }
        }

        const studentSession = localStorage.getItem("lawkaksha_student_session");
        const activeStudent = localStorage.getItem("lawkaksha_active_student");
        const unlockedIds: string[] = [];
        let pName = "Enrolled Student";
        let pRoll = "LK-STUDENT";

        if (studentSession) {
          try {
            const p = JSON.parse(studentSession);
            pName = p.name || pName;
            pRoll = p.student_id || pRoll;
            if (Array.isArray(p.unlockedItemIds)) unlockedIds.push(...p.unlockedItemIds);
            if (p.drm_access) unlockedIds.push("all-access");
          } catch (e) {}
        }

        if (activeStudent) {
          try {
            const act = JSON.parse(activeStudent);
            if (Array.isArray(act.unlockedItemIds)) unlockedIds.push(...act.unlockedItemIds);
            if (act.drm_access) unlockedIds.push("all-access");
          } catch (e) {}
        }

        setStudentProfile({ name: pName, roll: pRoll });

        const hasAccess =
          isSampleFile ||
          unlockedIds.includes("all-access") ||
          unlockedIds.some((id) => (file ? file.toLowerCase().includes(id.toLowerCase()) : false)) ||
          unlockedIds.some((id) => id.includes("course-ca") || id.includes("foundation") || id.includes("cseet"));

        setIsUnlocked(Boolean(hasAccess));
      } catch (e) {
        setIsUnlocked(isSampleFile);
      }
    }
  }, [file, isSampleFile]);

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

  if (!pdfUrl) {
    return (
      <main className="w-full h-screen bg-[#111418] flex flex-col items-center justify-center text-white p-6 text-center">
        <h1 className="text-xl font-bold font-serif mb-2">No Document Selected</h1>
        <p className="text-sm text-neutral-400 max-w-md mb-6">
          Please select a study material or chapter notes from your student dashboard to open in the secure DRM reader.
        </p>
        <button
          onClick={handleClose}
          className="px-6 py-2.5 rounded-full bg-[#BFAFE5] text-[#221D1D] font-bold text-sm cursor-pointer hover:bg-[#a591d5] transition-all"
        >
          Return to Dashboard
        </button>
      </main>
    );
  }

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
        studentName={studentProfile.name}
        studentRoll={studentProfile.roll}
      />
    </main>
  );
}
