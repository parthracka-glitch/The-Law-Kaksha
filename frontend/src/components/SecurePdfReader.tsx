"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  X,
  Lock,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  BookOpen,
  Loader2,
  RefreshCw,
  Sun,
  Moon,
  Coffee,
  Maximize2,
  Minimize2,
  List,
  Bookmark,
  RotateCw,
  Clock,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";

interface SecurePdfReaderProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
  studentName?: string;
  studentRoll?: string;
}

type ReaderTheme = "dark" | "sepia" | "light" | "oled";

interface UnitChapter {
  unit: number;
  title: string;
  act: string;
  startPage: number;
  weightage?: string;
  keyTopics?: string[];
}

const VOL1_CHAPTERS: UnitChapter[] = [
  {
    unit: 1,
    title: "Indian Contract Act, 1872",
    act: "Offer, Acceptance, Consideration & Remedies",
    startPage: 1,
    weightage: "20 - 25 Marks",
    keyTopics: ["Essentials of Valid Contract", "Free Consent (Sec 13-22)", "Breach & Section 73 Damages"],
  },
  {
    unit: 2,
    title: "Sale of Goods Act, 1930",
    act: "Conditions, Warranties & Caveat Emptor",
    startPage: 2,
    weightage: "15 - 20 Marks",
    keyTopics: ["Sale vs Agreement to Sell", "Doctrine of Caveat Emptor", "Rights of Unpaid Seller (Sec 45-54)"],
  },
  {
    unit: 3,
    title: "Indian Partnership Act, 1932",
    act: "Mutual Agency, Holding Out & Dissolution",
    startPage: 4,
    weightage: "15 - 20 Marks",
    keyTopics: ["Cox v. Hickman True Test", "Doctrine of Holding Out (Sec 28)", "Section 69 Non-Registration"],
  },
  {
    unit: 4,
    title: "Limited Liability Partnership Act, 2008",
    act: "LLP Framework & Designated Partners",
    startPage: 6,
    weightage: "5 - 10 Marks",
    keyTopics: ["Hybrid Structure Benefits", "Designated Partners Liability", "Incorporation & Annual Compliances"],
  },
  {
    unit: 5,
    title: "Elements of Company Law (2013)",
    act: "Corporate Veil, MOA, AOA & Ultra Vires",
    startPage: 8,
    weightage: "15 - 20 Marks",
    keyTopics: ["Salomon v. Salomon Doctrine", "Doctrine of Ultra Vires", "Indoor Management Exception"],
  },
  {
    unit: 6,
    title: "Negotiable Instruments Act, 1881",
    act: "Cheques, Bills & Section 138 Penalties",
    startPage: 9,
    weightage: "10 - 15 Marks",
    keyTopics: ["Holder in Due Course", "Crossing of Cheques", "Section 138 Dishonour & Cognizance"],
  },
];

const VOL2_CHAPTERS: UnitChapter[] = [
  {
    unit: 7,
    title: "General Principles of Management",
    act: "Henri Fayol's 14 Principles & Scientific Management",
    startPage: 1,
    weightage: "25 - 30 Marks",
    keyTopics: ["Fayol's 14 Principles", "F.W. Taylor Scientific Management", "Functions: PODSCORB & Leadership"],
  },
  {
    unit: 8,
    title: "Business Environment & Ethics",
    act: "PESTLE Analysis, Corporate Governance & CSR",
    startPage: 42,
    weightage: "20 - 25 Marks",
    keyTopics: ["Micro vs Macro Environments", "PESTLE Framework", "Corporate Social Responsibility (CSR)"],
  },
];

const CA_CHAPTERS: UnitChapter[] = [
  {
    unit: 1,
    title: "Indian Regulatory Framework",
    act: "Overview of Indian Legal System & Hierarchy of Courts",
    startPage: 1,
    weightage: "5 - 10 Marks",
    keyTopics: ["Hierarchy of Courts", "Sources of Law", "Role of Regulatory Bodies"],
  },
  {
    unit: 2,
    title: "The Indian Contract Act, 1872",
    act: "Formation, Consideration, Free Consent, Performance & Breach",
    startPage: 19,
    weightage: "20 - 25 Marks",
    keyTopics: ["Essentials of Valid Contract", "Free Consent (§13-22)", "Section 73 Damages"],
  },
  {
    unit: 3,
    title: "The Sale of Goods Act, 1930",
    act: "Formation, Conditions, Warranties & Caveat Emptor",
    startPage: 75,
    weightage: "15 - 20 Marks",
    keyTopics: ["Caveat Emptor Exception", "Priest v. Last", "Unpaid Seller Rights"],
  },
  {
    unit: 4,
    title: "The Indian Partnership Act, 1932",
    act: "General Nature, Relations of Partners & Dissolution",
    startPage: 130,
    weightage: "15 - 20 Marks",
    keyTopics: ["Cox v. Hickman True Test", "Doctrine of Holding Out (§28)", "Section 69 Non-Registration"],
  },
  {
    unit: 5,
    title: "The Limited Liability Partnership Act, 2008",
    act: "LLP Architecture, Incorporation & Designated Partners",
    startPage: 175,
    weightage: "5 - 10 Marks",
    keyTopics: ["Designated Partners", "Perpetual Succession", "Conversion & Compliances"],
  },
  {
    unit: 6,
    title: "The Companies Act, 2013",
    act: "Corporate Veil, Types, MOA/AOA & Ultra Vires",
    startPage: 205,
    weightage: "15 - 20 Marks",
    keyTopics: ["Salomon v. Salomon", "Doctrine of Ultra Vires", "Indoor Management"],
  },
  {
    unit: 7,
    title: "The Negotiable Instruments Act, 1881",
    act: "Promissory Notes, Bills of Exchange & Section 138",
    startPage: 245,
    weightage: "10 - 15 Marks",
    keyTopics: ["Section 138 Penalties", "Crossing of Cheques", "Holder in Due Course"],
  },
];

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function SecurePdfReader({
  isOpen,
  onClose,
  pdfUrl,
  title,
  studentName = "Aarav Sharma",
  studentRoll = "LAW-2026-9821",
}: SecurePdfReaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.1);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<ReaderTheme>("dark");
  const [sidebarTab, setSidebarTab] = useState<"units" | "bookmarks" | "shortcuts" | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const renderTaskRef = useRef<any>(null);

  // Multi-Touch Pinch and Swipe Tracking
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const initialPinchDistRef = useRef<number | null>(null);
  const initialPinchScaleRef = useRef<number>(1.1);
  const lastTapTimeRef = useRef<number>(0);

  // Student Profile Data
  const [activeStudent, setActiveStudent] = useState({ name: studentName, roll: studentRoll });
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("lawkaksha_student_session");
        if (raw) {
          const parsed = JSON.parse(raw);
          setActiveStudent({
            name: parsed.name || studentName,
            roll: parsed.student_id || studentRoll,
          });
        }
      } catch (e) {}
    }
  }, [isOpen, studentName, studentRoll]);

  // Load Bookmarks from LocalStorage
  const bookmarkKey = useMemo(() => `lawkaksha_bookmarks_${pdfUrl.split("/").pop() || "default"}`, [pdfUrl]);
  useEffect(() => {
    if (typeof window !== "undefined" && isOpen) {
      try {
        const saved = localStorage.getItem(bookmarkKey);
        if (saved) setBookmarks(JSON.parse(saved));
      } catch (e) {}
    }
  }, [bookmarkKey, isOpen]);

  const toggleBookmark = (page: number) => {
    setBookmarks((prev) => {
      const next = prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page].sort((a, b) => a - b);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(bookmarkKey, JSON.stringify(next));
        } catch (e) {}
      }
      return next;
    });
  };

  // Timer for active reading duration
  useEffect(() => {
    let interval: any = null;
    if (isOpen) {
      interval = setInterval(() => {
        setReadingTime((t) => t + 1);
      }, 1000);
    } else {
      setReadingTime(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen]);

  const formatReadingDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    if (mins < 1) return "< 1 min";
    return `${mins} min`;
  };

  // Determine chapter outlines based on book title or url
  const chaptersList = useMemo(() => {
    if (pdfUrl.includes("management") || title.toLowerCase().includes("management")) {
      return VOL2_CHAPTERS;
    }
    if (pdfUrl.includes("ca-foundation") || title.toLowerCase().includes("ca foundation")) {
      return CA_CHAPTERS;
    }
    return VOL1_CHAPTERS;
  }, [pdfUrl, title]);

  // Clean filename from URL
  const cleanFilename = useMemo(() => {
    return pdfUrl.split("?")[0].split("/").pop() || "cseet-business-law-full.pdf";
  }, [pdfUrl]);

  // Find active unit for current page
  const activeUnit = useMemo(() => {
    let current = chaptersList[0];
    for (const ch of chaptersList) {
      if (currentPage >= ch.startPage) {
        current = ch;
      }
    }
    return current;
  }, [chaptersList, currentPage]);

  // Main PDF Loader using robust Base64 with binary fallback
  const loadPdf = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    setPdfDoc(null);
    setTotalPages(0);
    setCurrentPage(1);

    const filename = url.split("?")[0].split("/").pop() || "cseet-business-law-full.pdf";

    try {
      const pdfjsLib = await import("pdfjs-dist");

      if (typeof window !== "undefined") {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.mjs`;
      }

      // 1. Fetch JSON base64 payload
      const base64Url = `/api/pdf/${filename}?format=base64`;
      const response = await fetch(base64Url, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const jsonPayload = await response.json();
      if (!jsonPayload.base64 || jsonPayload.base64.length === 0) {
        throw new Error("Received empty base64 payload from PDF service");
      }

      const bytes = base64ToUint8Array(jsonPayload.base64);

      const loadingTask = pdfjsLib.getDocument({
        data: bytes,
        cMapUrl: "/cmaps/",
        cMapPacked: true,
        standardFontDataUrl: "/standard_fonts/",
        disableRange: true,
        disableStream: true,
        disableAutoFetch: true,
      });

      const doc = await loadingTask.promise;
      setPdfDoc(doc);
      setTotalPages(doc.numPages);
    } catch (err: any) {
      console.error("PDF Base64 load failed, attempting binary fallback:", err);

      try {
        const pdfjsLib = await import("pdfjs-dist");
        if (typeof window !== "undefined") {
          pdfjsLib.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.mjs`;
        }

        const binResponse = await fetch(`/api/pdf/${filename}`, { cache: "no-store" });
        const arrayBuf = await binResponse.arrayBuffer();

        const fallbackTask = pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuf),
          cMapUrl: "/cmaps/",
          cMapPacked: true,
          standardFontDataUrl: "/standard_fonts/",
          disableRange: true,
          disableStream: true,
        });

        const doc = await fallbackTask.promise;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
      } catch (retryErr: any) {
        console.error("PDF all load attempts failed:", retryErr);
        setError("Unable to load the study book. Please click Retry below.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fit to Width calculation
  const handleFitWidth = useCallback(async () => {
    if (!containerRef.current || !pdfDoc) return;
    try {
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale: 1, rotation });
      const containerWidth = containerRef.current.clientWidth - (window.innerWidth < 640 ? 16 : 48);
      if (containerWidth > 0 && viewport.width > 0) {
        const targetScale = containerWidth / viewport.width;
        setScale(Math.min(Math.max(targetScale, 0.4), 2.8));
      }
    } catch (e) {}
  }, [currentPage, pdfDoc, rotation]);

  // Fit to Page calculation
  const handleFitPage = useCallback(async () => {
    if (!containerRef.current || !pdfDoc) return;
    try {
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale: 1, rotation });
      const containerHeight = containerRef.current.clientHeight - 80;
      if (containerHeight > 0 && viewport.height > 0) {
        const targetScale = containerHeight / viewport.height;
        setScale(Math.min(Math.max(targetScale, 0.4), 2.8));
      }
    } catch (e) {}
  }, [currentPage, pdfDoc, rotation]);

  // Rotate Page
  const handleRotate = () => {
    setRotation((r) => (r + 90) % 360);
  };

  // Render Page onto Canvas with High-DPI support
  const renderPage = useCallback(
    async (doc: any, pageNum: number, zoom: number, rot: number) => {
      if (!canvasRef.current || !doc) return;
      try {
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch (e) {}
          renderTaskRef.current = null;
        }

        const page = await doc.getPage(pageNum);
        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
        const viewport = page.getViewport({ scale: zoom * dpr, rotation: rot });
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width / dpr}px`;
        canvas.style.height = `${viewport.height / dpr}px`;

        const renderTask = page.render({ canvasContext: ctx, viewport });
        renderTaskRef.current = renderTask;
        await renderTask.promise;
        renderTaskRef.current = null;
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") {
          console.error("Render error:", err);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (isOpen && pdfUrl) {
      loadPdf(pdfUrl);
    }
    if (!isOpen) {
      setPdfDoc(null);
      setTotalPages(0);
      setCurrentPage(1);
    }
  }, [isOpen, pdfUrl, loadPdf]);

  // Auto-fit on initial document load
  useEffect(() => {
    if (pdfDoc) {
      const timer = setTimeout(() => {
        handleFitWidth();
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [pdfDoc, handleFitWidth]);

  // Auto-fit on screen resize / orientation change
  useEffect(() => {
    const onResize = () => {
      if (pdfDoc) handleFitWidth();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pdfDoc, handleFitWidth]);

  useEffect(() => {
    if (pdfDoc) {
      renderPage(pdfDoc, currentPage, scale, rotation);
    }
  }, [pdfDoc, currentPage, scale, rotation, renderPage]);

  // Multi-touch Pinch to Zoom, Double Tap, and Swipe Page Turn Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDistRef.current = dist;
      initialPinchScaleRef.current = scale;
      touchStartX.current = null;
      touchStartY.current = null;
    } else if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistRef.current !== null) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = currentDist / initialPinchDistRef.current;
      const newScale = Math.min(Math.max(initialPinchScaleRef.current * factor, 0.4), 3.0);
      setScale(newScale);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (initialPinchDistRef.current !== null && e.touches.length < 2) {
      initialPinchDistRef.current = null;
      return;
    }

    const now = Date.now();
    if (now - lastTapTimeRef.current < 280) {
      if (scale > 1.3) {
        handleFitWidth();
      } else {
        setScale(1.5);
      }
      lastTapTimeRef.current = 0;
      touchStartX.current = null;
      touchStartY.current = null;
      return;
    }
    lastTapTimeRef.current = now;

    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX < 0) {
        setCurrentPage((p) => Math.min(p + 1, totalPages));
      } else {
        setCurrentPage((p) => Math.max(p - 1, 1));
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "s" || e.key === "u")) {
        e.preventDefault();
        return;
      }

      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) {
        e.preventDefault();
        setCurrentPage((p) => Math.min(p + 1, totalPages));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) {
        e.preventDefault();
        setCurrentPage((p) => Math.max(p - 1, 1));
      } else if (e.key === "+" || e.key === "=") {
        setScale((s) => Math.min(s + 0.15, 3));
      } else if (e.key === "-" || e.key === "_") {
        setScale((s) => Math.max(s - 0.15, 0.4));
      } else if (e.key === "w" || e.key === "W") {
        handleFitWidth();
      } else if (e.key === "p" || e.key === "P") {
        handleFitPage();
      } else if (e.key === "b" || e.key === "B") {
        toggleBookmark(currentPage);
      } else if (e.key === "r" || e.key === "R") {
        handleRotate();
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, totalPages, onClose, currentPage, handleFitWidth, handleFitPage]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const blockContext = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  if (!isOpen) return null;

  // Executive minimal theme palette
  const themeStyles = {
    dark: {
      appBg: "#0F141C",
      headerBg: "bg-[#0F141C]/90 backdrop-blur-xl border-white/[0.08] text-slate-100",
      canvasBg: "#0A0D13",
      pageShadow: "shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.06)]",
      tocBg: "bg-[#0F141C] border-white/[0.08] text-slate-100",
      dockBg: "bg-[#141A23]/90 backdrop-blur-xl border-white/[0.1] text-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.45)]",
      btnGhost: "hover:bg-white/10 active:bg-white/15 text-slate-300 hover:text-white",
      btnActive: "bg-white/15 text-white",
      accent: "text-violet-400",
    },
    sepia: {
      appBg: "#F4EDE2",
      headerBg: "bg-[#F4EDE2]/90 backdrop-blur-xl border-amber-900/[0.08] text-[#342717]",
      canvasBg: "#EBE3D5",
      pageShadow: "shadow-[0_20px_50px_-12px_rgba(60,40,15,0.15),0_0_0_1px_rgba(100,70,20,0.08)]",
      tocBg: "bg-[#F4EDE2] border-amber-900/[0.08] text-[#342717]",
      dockBg: "bg-[#EFE8DC]/90 backdrop-blur-xl border-amber-900/[0.12] text-[#342717] shadow-[0_12px_40px_rgba(60,40,15,0.12)]",
      btnGhost: "hover:bg-amber-900/10 active:bg-amber-900/15 text-[#5C452A] hover:text-[#342717]",
      btnActive: "bg-amber-900/15 text-[#342717]",
      accent: "text-amber-800",
    },
    light: {
      appBg: "#F8FAFC",
      headerBg: "bg-white/90 backdrop-blur-xl border-slate-200/80 text-slate-800",
      canvasBg: "#EFF2F6",
      pageShadow: "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)]",
      tocBg: "bg-white border-slate-200 text-slate-800",
      dockBg: "bg-white/90 backdrop-blur-xl border-slate-200 text-slate-800 shadow-[0_12px_40px_rgba(0,0,0,0.08)]",
      btnGhost: "hover:bg-slate-100 active:bg-slate-200 text-slate-600 hover:text-slate-900",
      btnActive: "bg-slate-100 text-slate-900 font-semibold",
      accent: "text-violet-600",
    },
    oled: {
      appBg: "#000000",
      headerBg: "bg-black/90 backdrop-blur-xl border-neutral-800 text-neutral-100",
      canvasBg: "#000000",
      pageShadow: "shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_25px_60px_rgba(0,0,0,1)]",
      tocBg: "bg-black border-neutral-800 text-neutral-100",
      dockBg: "bg-[#0A0A0A]/90 backdrop-blur-xl border-neutral-800 text-neutral-100 shadow-[0_12px_40px_rgba(0,0,0,0.8)]",
      btnGhost: "hover:bg-neutral-800 active:bg-neutral-700 text-neutral-300 hover:text-white",
      btnActive: "bg-neutral-800 text-white",
      accent: "text-violet-400",
    },
  }[theme];

  const readingProgress = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;
  const isBookmarked = bookmarks.includes(currentPage);

  // 1-Tap Minimal Theme Switcher
  const cycleTheme = () => {
    const sequence: ReaderTheme[] = ["dark", "sepia", "light", "oled"];
    const nextIdx = (sequence.indexOf(theme) + 1) % sequence.length;
    setTheme(sequence[nextIdx]);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col select-none overflow-hidden"
      style={{ background: themeStyles.appBg, fontFamily: "'Inter', -apple-system, system-ui, sans-serif" }}
      onContextMenu={blockContext}
    >
      {/* CSS DRM PRINT BLOCKER */}
      <style jsx global>{`
        @media print {
          body {
            display: none !important;
          }
        }
      `}</style>

      {/* 1. ULTRA-MINIMAL TOP BAR (EXECUTIVE STREAMLINED) */}
      <header
        className={`h-12 sm:h-13 px-3 sm:px-5 border-b shrink-0 z-30 flex items-center justify-between transition-colors ${themeStyles.headerBg}`}
      >
        {/* LEFT: MINIMAL TOC BUTTON + TITLE */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
          <button
            onClick={() => setSidebarTab(sidebarTab ? null : "units")}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              sidebarTab ? themeStyles.btnActive : themeStyles.btnGhost
            }`}
            title="Table of Contents"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-medium">Contents</span>
          </button>

          <div className="w-px h-4 bg-current opacity-10 hidden sm:block" />

          {/* Book Title & Chapter Subtitle */}
          <div className="min-w-0 flex items-baseline gap-2 truncate">
            <h1 className="text-xs sm:text-sm font-semibold tracking-tight truncate">
              {title}
            </h1>
            <span className="text-[11px] opacity-50 truncate hidden xs:inline font-normal">
              {activeUnit.title}
            </span>
          </div>
        </div>

        {/* RIGHT: MINIMAL 1-TAP ICONS */}
        <div className="flex items-center gap-1 shrink-0">
          {/* 1-Tap Theme Toggle */}
          <button
            onClick={cycleTheme}
            className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs ${themeStyles.btnGhost}`}
            title={`Reading Mode: ${theme.toUpperCase()} (Tap to switch)`}
          >
            {theme === "dark" && <Moon className="w-4 h-4 text-violet-300" />}
            {theme === "sepia" && <Coffee className="w-4 h-4 text-amber-500" />}
            {theme === "light" && <Sun className="w-4 h-4 text-amber-500" />}
            {theme === "oled" && <Moon className="w-4 h-4 text-neutral-400" />}
            <span className="hidden sm:inline capitalize text-[11px] font-medium opacity-80">{theme}</span>
          </button>

          {/* Bookmark Toggle */}
          <button
            onClick={() => toggleBookmark(currentPage)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isBookmarked ? "text-amber-400" : themeStyles.btnGhost
            }`}
            title={isBookmarked ? "Page Bookmarked" : "Bookmark this Page (B)"}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-400" : "opacity-70"}`} />
          </button>

          {/* Rotate (Desktop) */}
          <button
            onClick={handleRotate}
            className={`p-2 rounded-xl transition-all cursor-pointer hidden sm:flex ${themeStyles.btnGhost}`}
            title="Rotate 90° (R)"
          >
            <RotateCw className="w-4 h-4 opacity-70" />
          </button>

          {/* Fullscreen (Desktop) */}
          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-xl transition-all cursor-pointer hidden md:flex ${themeStyles.btnGhost}`}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 opacity-70" /> : <Maximize2 className="w-4 h-4 opacity-70" />}
          </button>

          <div className="w-px h-4 bg-current opacity-10 mx-0.5" />

          {/* Close Button */}
          <button
            onClick={onClose}
            title="Close (Esc)"
            className="p-2 rounded-xl hover:bg-rose-500/15 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. MAIN READING WORKSPACE & NAVIGATION DRAWER */}
      <div className="flex-1 flex min-h-0 relative">
        {/* MOBILE BACKDROP FOR SIDEBAR DRAWER */}
        {sidebarTab && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-30 md:hidden animate-in fade-in duration-150"
            onClick={() => setSidebarTab(null)}
          />
        )}

        {/* COLLAPSIBLE SIDEBAR DRAWER (UNITS / BOOKMARKS / SHORTCUTS) */}
        {sidebarTab && (
          <aside
            className={`fixed md:relative inset-y-0 left-0 w-[85vw] max-w-sm md:w-80 shrink-0 border-r flex flex-col z-40 shadow-2xl animate-in slide-in-from-left duration-200 ${themeStyles.tocBg}`}
          >
            {/* Drawer Header */}
            <div className="p-3 border-b border-inherit flex items-center justify-between gap-1">
              <div className="flex items-center gap-1 bg-black/10 rounded-xl p-1 w-full">
                <button
                  onClick={() => setSidebarTab("units")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    sidebarTab === "units" ? "bg-violet-600 text-white shadow-xs" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  Curriculum
                </button>
                <button
                  onClick={() => setSidebarTab("bookmarks")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    sidebarTab === "bookmarks" ? "bg-amber-600 text-white shadow-xs" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <span>Bookmarks</span>
                  {bookmarks.length > 0 && <span className="text-[10px]">({bookmarks.length})</span>}
                </button>
                <button
                  onClick={() => setSidebarTab("shortcuts")}
                  className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    sidebarTab === "shortcuts" ? "bg-slate-700 text-white shadow-xs" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  Guide
                </button>
              </div>

              <button
                onClick={() => setSidebarTab(null)}
                className="p-2 rounded-lg hover:bg-black/10 opacity-70 hover:opacity-100 cursor-pointer ml-1"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* TAB 1: UNITS & CHAPTERS LIST */}
            {sidebarTab === "units" && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <div className="flex items-center justify-between px-1 mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider opacity-50">
                    Curriculum Units
                  </span>
                  <span className="text-[10px] font-medium opacity-60">
                    {chaptersList.length} Units Available
                  </span>
                </div>

                {chaptersList.map((ch) => {
                  const isActive = activeUnit.unit === ch.unit;

                  return (
                    <div
                      key={ch.unit}
                      onClick={() => {
                        setCurrentPage(Math.min(ch.startPage, totalPages || 1));
                        if (typeof window !== "undefined" && window.innerWidth < 768) {
                          setSidebarTab(null);
                        }
                      }}
                      className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                        isActive
                          ? "bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-900/20"
                          : "bg-black/[0.03] hover:bg-black/[0.06] border-transparent opacity-85 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isActive ? "bg-white/20 text-white" : "bg-violet-500/15 text-violet-400"
                          }`}
                        >
                          Unit {ch.unit}
                        </span>

                        <span className="text-[11px] font-mono opacity-80">
                          Pg {ch.startPage}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold leading-snug">{ch.title}</h4>
                      <p className="text-[11px] opacity-70 mt-0.5 line-clamp-1">{ch.act}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: SAVED BOOKMARKS */}
            {sidebarTab === "bookmarks" && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <div className="flex items-center justify-between px-1 mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider opacity-50">
                    Saved Bookmarks
                  </span>
                  <button
                    onClick={() => toggleBookmark(currentPage)}
                    className="text-[11px] font-semibold text-amber-500 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                  >
                    <span>+ Bookmark Current Pg {currentPage}</span>
                  </button>
                </div>

                {bookmarks.length === 0 ? (
                  <div className="text-center py-12 px-4 space-y-2 opacity-50">
                    <Bookmark className="w-8 h-8 mx-auto stroke-1" />
                    <p className="text-xs font-medium">No Bookmarks Saved</p>
                    <p className="text-[11px] leading-relaxed">
                      Tap the bookmark icon on any page to quickly save revision points.
                    </p>
                  </div>
                ) : (
                  bookmarks.map((bmPage) => (
                    <div
                      key={bmPage}
                      className="p-2.5 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] border border-inherit/30 flex items-center justify-between gap-3 transition-colors"
                    >
                      <button
                        onClick={() => {
                          setCurrentPage(bmPage);
                          if (typeof window !== "undefined" && window.innerWidth < 768) {
                            setSidebarTab(null);
                          }
                        }}
                        className="flex items-center gap-2.5 text-left flex-1 cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-mono text-xs font-semibold flex items-center justify-center">
                          {bmPage}
                        </div>
                        <p className="text-xs font-medium">Page {bmPage}</p>
                      </button>

                      <button
                        onClick={() => toggleBookmark(bmPage)}
                        className="p-1 rounded-lg hover:bg-rose-500/20 text-rose-400 opacity-60 hover:opacity-100 transition-colors cursor-pointer"
                        title="Delete bookmark"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: KEYBOARD SHORTCUTS */}
            {sidebarTab === "shortcuts" && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <HelpCircle className="w-4 h-4 opacity-70" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider opacity-70">Navigation Shortcuts</h4>
                </div>

                {[
                  { key: "Swipe / ← →", label: "Flip Page" },
                  { key: "Double Tap", label: "Auto Fit / Zoom" },
                  { key: "Pinch", label: "Smooth Zoom" },
                  { key: "B", label: "Bookmark Page" },
                  { key: "R", label: "Rotate 90°" },
                  { key: "Esc", label: "Close Reader" },
                ].map((sc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-xl bg-black/[0.03] border border-inherit/20"
                  >
                    <span className="opacity-75">{sc.label}</span>
                    <kbd className="px-2 py-0.5 rounded-md bg-black/20 border border-white/10 font-mono text-[10px] font-semibold">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>
            )}
          </aside>
        )}

        {/* CANVAS WORKSPACE */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto flex flex-col items-center justify-start py-6 sm:py-8 px-2 sm:px-4 relative scroll-smooth touch-pan-y"
          style={{ background: themeStyles.canvasBg }}
          onContextMenu={blockContext}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* FLOATING PREVIOUS / NEXT SIDE CHEVRONS (Desktop only) */}
          {totalPages > 0 && (
            <>
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="hidden md:flex fixed left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-violet-600 text-white backdrop-blur-md border border-white/15 items-center justify-center transition-all disabled:opacity-0 cursor-pointer shadow-xl hover:scale-105 active:scale-95"
                title="Previous Page (←)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="hidden md:flex fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-violet-600 text-white backdrop-blur-md border border-white/15 items-center justify-center transition-all disabled:opacity-0 cursor-pointer shadow-xl hover:scale-105 active:scale-95"
                title="Next Page (→)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* LOADING STATE */}
          {loading && (
            <div className="flex flex-col items-center justify-center my-auto gap-3 text-white/70 py-20">
              <Loader2 className="w-7 h-7 animate-spin text-violet-400" />
              <p className="text-xs font-medium opacity-80">Loading Study Codex...</p>
            </div>
          )}

          {/* ERROR STATE */}
          {error && (
            <div className="flex flex-col items-center justify-center my-auto gap-3 max-w-sm text-center p-6 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-md">
              <BookOpen className="w-6 h-6 text-rose-400 mx-auto" />
              <p className="text-xs opacity-75">{error}</p>
              <button
                onClick={() => loadPdf(pdfUrl)}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer mx-auto"
              >
                <RefreshCw className="w-3 h-3" />
                Retry
              </button>
            </div>
          )}

          {/* LOADED PDF PAGE WITH DRUG-SHIELD WATERMARK */}
          {!loading && !error && (
            <div className="relative my-auto flex flex-col items-center pb-24 sm:pb-20 max-w-full">
              <div
                className={`relative select-none rounded-xl overflow-hidden ${themeStyles.pageShadow} transition-transform duration-150 max-w-full`}
                style={{
                  background: "#ffffff",
                }}
                onContextMenu={blockContext}
              >
                {/* CANVAS RENDERING SURFACE */}
                <canvas ref={canvasRef} className="block max-w-full h-auto" />

                {/* ANTI-SCREENSHOT / DRM WATERMARK OVERLAY */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 opacity-[0.035] text-black select-none font-mono text-[10px] sm:text-xs overflow-hidden leading-relaxed">
                  <div className="flex justify-between">
                    <span>THE LAW KAKSHA • LICENSED STUDENT EDITION</span>
                    <span>ROLL: {activeStudent.roll}</span>
                  </div>
                  <div className="text-center transform -rotate-12 text-xs sm:text-sm font-bold">
                    CONFIDENTIAL STUDY MATERIAL • LICENSED TO {activeStudent.name.toUpperCase()} • DO NOT DISTRIBUTE
                  </div>
                  <div className="flex justify-between">
                    <span>
                      {activeStudent.name} • {cleanFilename}
                    </span>
                    <span>SECURE IN-WEB READER</span>
                  </div>
                </div>
              </div>

              {/* FOOTNOTE */}
              <div className="mt-3 text-[11px] opacity-40 font-mono text-center">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. ULTRA-SLEEK, MINIMAL & PROFESSIONAL FLOATING CONTROLLER (SINGLE-ROW APPLE-GRADE ISLAND) */}
      {totalPages > 0 && (
        <footer
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-30 max-w-lg w-[92%] sm:w-auto min-w-[320px] sm:min-w-[420px] h-12 px-2.5 sm:px-4 rounded-full border shadow-xl flex items-center justify-between gap-2.5 sm:gap-4 transition-all duration-200 ${themeStyles.dockBg}`}
        >
          {/* PREVIOUS PAGE BUTTON */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed shrink-0 ${themeStyles.btnGhost}`}
            title="Previous Page (←)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* ZOOM MINUS */}
          <button
            onClick={() => setScale((s) => Math.max(s - 0.2, 0.4))}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer opacity-70 hover:opacity-100 shrink-0 ${themeStyles.btnGhost}`}
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* SLIM PROGRESS TRACK WITH EMBEDDED PAGE NUMBER */}
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <input
              type="range"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="w-full h-1 bg-current opacity-20 hover:opacity-40 rounded-full appearance-none cursor-pointer accent-violet-500 focus:outline-none transition-opacity"
              title={`Page ${currentPage} of ${totalPages}`}
            />
            <button
              onClick={() => {
                const target = prompt(`Jump to page (1 - ${totalPages}):`, String(currentPage));
                if (target) {
                  const p = parseInt(target);
                  if (!isNaN(p) && p >= 1 && p <= totalPages) {
                    setCurrentPage(p);
                  }
                }
              }}
              className="font-mono text-[11px] font-medium opacity-85 hover:opacity-100 shrink-0 cursor-pointer px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors"
              title="Click to jump to page"
            >
              {currentPage}/{totalPages}
            </button>
          </div>

          {/* ZOOM PLUS */}
          <button
            onClick={() => setScale((s) => Math.min(s + 0.2, 3.0))}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer opacity-70 hover:opacity-100 shrink-0 ${themeStyles.btnGhost}`}
            title="Zoom In (+)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* 1-TAP FIT TO WIDTH AUTO-CENTER */}
          <button
            onClick={handleFitWidth}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer opacity-70 hover:opacity-100 shrink-0 ${themeStyles.btnGhost}`}
            title="Fit to Screen Width (1-Tap)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* NEXT PAGE BUTTON */}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed shrink-0 ${themeStyles.btnGhost}`}
            title="Next Page (→)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </footer>
      )}
    </div>
  );
}
