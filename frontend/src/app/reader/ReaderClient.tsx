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
  const pdfUrl = rawPdf || (file ? `/api/pdf/${file}` : "/api/pdf/cseet-business-law-full.pdf");

  // Clean title
  const title =
    queryTitle ||
    (file
      ? file
          .replace(/\.pdf$/i, "")
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : "The Law Kaksha Master Study Codex");

  // Session watermark data
  const [studentProfile, setStudentProfile] = useState({
    name: "Law Student",
    roll: "LK-SECURE-VIEW",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const studentSession = localStorage.getItem("lawkaksha_student_session");
        if (studentSession) {
          const parsed = JSON.parse(studentSession);
          setStudentProfile({
            name: parsed.name || "Student",
            roll: parsed.student_id || "LK-STU",
          });
          return;
        }
        const adminSession = localStorage.getItem("lawkaksha_admin_session");
        if (adminSession) {
          const parsed = JSON.parse(adminSession);
          setStudentProfile({
            name: parsed.name || "Administrator",
            roll: "LK-ADMIN-DRM",
          });
        }
      } catch (e) {}
    }
  }, []);

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

  return (
    <main className="w-full h-screen bg-[#111418] overflow-hidden select-none">
      <SecurePdfReader
        isOpen={true}
        onClose={handleClose}
        pdfUrl={pdfUrl}
        title={title}
        isPurchased={true}
        studentName={studentProfile.name}
        studentRoll={studentProfile.roll}
      />
    </main>
  );
}
