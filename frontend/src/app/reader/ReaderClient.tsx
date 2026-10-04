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
  const pdfUrl = rawPdf || (file ? `/api/pdf/${file}` : "/api/pdf/sale-of-goods-unit-1.pdf");

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
      if (window.opener) {
        window.close();
      } else if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/student");
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
        studentName={studentProfile.name}
        studentRoll={studentProfile.roll}
      />
    </main>
  );
}
