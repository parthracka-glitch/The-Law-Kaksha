"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  X,
  Lock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
  CheckCircle2,
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
    if (mins < 1) return "< 1 min read";
    return `${mins} min read`;
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

  // Auto-fit on screen resize / rotation
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
      // 2 fingers -> Pinch to Zoom
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDistRef.current = dist;
      initialPinchScaleRef.current = scale;
      touchStartX.current = null;
      touchStartY.current = null;
    } else if (e.touches.length === 1) {
      // 1 finger -> Swipe or Double-tap
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

    // Check for Double-Tap on Mobile Canvas
    const now = Date.now();
    if (now - lastTapTimeRef.current < 280) {
      // Double tap toggles between fit-to-width and 1.6x zoom
      if (scale > 1.3) {
        handleFitWidth();
      } else {
        setScale(1.6);
      }
      lastTapTimeRef.current = 0;
      touchStartX.current = null;
      touchStartY.current = null;
      return;
    }
    lastTapTimeRef.current = now;

    // Single finger swipe for page turn
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Trigger page turn if horizontal swipe is > 55px and dominant over vertical scroll
    if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX < 0) {
        // Swiped Left -> Next Page
        setCurrentPage((p) => Math.min(p + 1, totalPages));
      } else {
        // Swiped Right -> Previous Page
        setCurrentPage((p) => Math.max(p - 1, 1));
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Keyboard navigation & Security Traps
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      // Disable Print & Save shortcuts
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

  // Theme configuration styles
  const themeStyles = {
    dark: {
      appBg: "#0B0F17",
      headerBg: "bg-[#111827]/95 backdrop-blur-md border-slate-800 text-white shadow-sm",
      canvasBg: "#06090E",
      pageShadow: "shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)]",
      tocBg: "bg-[#111827] border-slate-800 text-white",
      controlBar: "bg-[#111827]/95 border-slate-800 text-white backdrop-blur-md",
      pillBg: "bg-white/10 hover:bg-white/20 text-white border-white/15",
      accent: "text-violet-400",
      dockBorder: "border-slate-800",
      subtext: "text-slate-400",
    },
    sepia: {
      appBg: "#F6F0E6",
      headerBg: "bg-[#EFE7D8]/95 backdrop-blur-md border-amber-900/10 text-[#3D2F1D] shadow-sm",
      canvasBg: "#E8DFC9",
      pageShadow: "shadow-[0_20px_50px_-12px_rgba(80,50,20,0.18),0_0_0_1px_rgba(120,80,30,0.1)]",
      tocBg: "bg-[#EFE7D8] border-amber-900/15 text-[#3D2F1D]",
      controlBar: "bg-[#EFE7D8]/95 border-amber-900/15 text-[#3D2F1D] backdrop-blur-md",
      pillBg: "bg-amber-900/10 hover:bg-amber-900/20 text-[#3D2F1D] border-amber-900/15",
      accent: "text-amber-800",
      dockBorder: "border-amber-900/20",
      subtext: "text-amber-800/70",
    },
    light: {
      appBg: "#F8FAFC",
      headerBg: "bg-white/95 backdrop-blur-md border-slate-200 text-slate-800 shadow-xs",
      canvasBg: "#EEF2F6",
      pageShadow: "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.06)]",
      tocBg: "bg-white border-slate-200 text-slate-800",
      controlBar: "bg-white/95 border-slate-200 text-slate-800 shadow-lg backdrop-blur-md",
      pillBg: "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200",
      accent: "text-violet-600",
      dockBorder: "border-slate-200",
      subtext: "text-slate-500",
    },
    oled: {
      appBg: "#000000",
      headerBg: "bg-[#050505]/95 backdrop-blur-md border-neutral-800 text-white shadow-sm",
      canvasBg: "#000000",
      pageShadow: "shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_25px_60px_rgba(0,0,0,1)]",
      tocBg: "bg-[#050505] border-neutral-800 text-white",
      controlBar: "bg-[#050505]/95 border-neutral-800 text-white backdrop-blur-md",
      pillBg: "bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-700",
      accent: "text-violet-400",
      dockBorder: "border-neutral-800",
      subtext: "text-neutral-400",
    },
  }[theme];

  const readingProgress = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;
  const isBookmarked = bookmarks.includes(currentPage);

  // 1-Tap Instant Theme Cycler (Zero Modals Needed)
  const cycleTheme = () => {
    const sequence: ReaderTheme[] = ["dark", "sepia", "light", "oled"];
    const nextIdx = (sequence.indexOf(theme) + 1) % sequence.length;
    setTheme(sequence[nextIdx]);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col select-none overflow-hidden"
      style={{ background: themeStyles.appBg, fontFamily: "'Inter', system-ui, sans-serif" }}
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

      {/* 1. TOP HEADER BAR: CLEAN, ELEGANT & INTUITIVE */}
      <header
        className={`flex items-center justify-between px-2.5 sm:px-4 py-2 border-b shrink-0 z-30 transition-colors ${themeStyles.headerBg}`}
      >
        {/* LEFT: INDEX DRAWER BUTTON + BOOK TITLE */}
        <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
          <button
            onClick={() => setSidebarTab(sidebarTab ? null : "units")}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 min-h-[38px] ${
              sidebarTab
                ? "bg-violet-600 text-white border-violet-500 shadow-sm"
                : themeStyles.pillBg
            }`}
            title="Curriculum & Chapters Index"
          >
            <List className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Index</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-violet-500/20 text-violet-300 font-mono font-bold">
              {chaptersList.length}
            </span>
          </button>

          {/* Book Title & Current Active Unit */}
          <div className="min-w-0 flex flex-col justify-center">
            <h1 className="text-xs sm:text-sm font-bold tracking-tight truncate leading-tight">
              {title}
            </h1>
            <p className="text-[10px] sm:text-[11px] opacity-65 truncate leading-tight mt-0.5 flex items-center gap-1">
              <span>{activeUnit.title}</span>
              <span className="hidden xs:inline">•</span>
              <span className="hidden xs:inline text-emerald-400 font-medium">DRM Protected</span>
            </p>
          </div>
        </div>

        {/* CENTER: DESKTOP PROGRESS BADGE */}
        {totalPages > 0 && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-black/10 border border-white/10 text-xs font-medium shrink-0">
            <span className="font-mono text-xs">
              Page {currentPage} <span className="opacity-40">/</span> {totalPages}
            </span>
            <span className="w-1 h-1 rounded-full bg-violet-400 opacity-60" />
            <span className="text-[11px] font-bold text-violet-400">{readingProgress}%</span>
            <span className="opacity-30">|</span>
            <span className="text-[10px] opacity-70 font-mono">{formatReadingDuration(readingTime)}</span>
          </div>
        )}

        {/* RIGHT: 1-TAP THEME CYCLER + QUICK BOOKMARK + CLOSE */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* 1-TAP INSTANT THEME CYCLE BUTTON (ZERO MODALS / POPUPS) */}
          <button
            onClick={cycleTheme}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer min-h-[38px] ${
              theme === "dark"
                ? "bg-violet-600 text-white border-violet-500 shadow-xs"
                : theme === "sepia"
                ? "bg-amber-700 text-white border-amber-600 shadow-xs"
                : theme === "light"
                ? "bg-white text-slate-800 border-slate-300 shadow-xs"
                : "bg-neutral-900 text-white border-neutral-700 shadow-xs"
            }`}
            title={`Reading Mode: ${theme.toUpperCase()} (Tap to switch mode)`}
          >
            {theme === "dark" && <Moon className="w-3.5 h-3.5 text-violet-200" />}
            {theme === "sepia" && <Coffee className="w-3.5 h-3.5 text-amber-200" />}
            {theme === "light" && <Sun className="w-3.5 h-3.5 text-amber-500" />}
            {theme === "oled" && <Moon className="w-3.5 h-3.5 text-neutral-400" />}
            <span className="capitalize text-[11px] font-semibold">{theme}</span>
          </button>

          {/* Quick Bookmark Toggle (1-Tap Star) */}
          <button
            onClick={() => toggleBookmark(currentPage)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center transition-all cursor-pointer shrink-0 min-h-[38px] ${
              isBookmarked
                ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                : themeStyles.pillBg
            }`}
            title={isBookmarked ? "Bookmarked Page (Click to remove)" : "Bookmark Page (B)"}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-400 text-amber-400" : "opacity-75"}`} />
          </button>

          {/* Desktop Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-xl border transition-colors cursor-pointer hidden md:flex min-h-[38px] ${themeStyles.pillBg}`}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Reader Button */}
          <button
            onClick={onClose}
            title="Close Reader (Esc)"
            className="w-9 h-9 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 hover:text-white border border-rose-500/30 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close Reader"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden animate-in fade-in duration-150"
            onClick={() => setSidebarTab(null)}
          />
        )}

        {/* COLLAPSIBLE SIDEBAR DRAWER (UNITS / BOOKMARKS / SHORTCUTS) */}
        {sidebarTab && (
          <aside
            className={`fixed md:relative inset-y-0 left-0 w-[85vw] max-w-sm md:w-80 shrink-0 border-r flex flex-col z-40 shadow-2xl animate-in slide-in-from-left duration-200 ${themeStyles.tocBg}`}
          >
            {/* Drawer Tabs Header */}
            <div className="p-3 border-b border-inherit flex items-center justify-between gap-1">
              <div className="flex items-center gap-1 bg-black/10 rounded-xl p-1 w-full">
                <button
                  onClick={() => setSidebarTab("units")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    sidebarTab === "units" ? "bg-violet-600 text-white shadow-xs" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  Curriculum
                </button>
                <button
                  onClick={() => setSidebarTab("bookmarks")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    sidebarTab === "bookmarks" ? "bg-amber-600 text-white shadow-xs" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <span>Bookmarks</span>
                  {bookmarks.length > 0 && <span className="text-[10px]">({bookmarks.length})</span>}
                </button>
                <button
                  onClick={() => setSidebarTab("shortcuts")}
                  className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    sidebarTab === "shortcuts" ? "bg-slate-700 text-white shadow-xs" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  Help
                </button>
              </div>

              <button
                onClick={() => setSidebarTab(null)}
                className="p-2 rounded-lg hover:bg-black/10 text-inherit opacity-70 hover:opacity-100 cursor-pointer ml-1"
                title="Close Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* TAB 1: UNITS & CHAPTERS LIST */}
            {sidebarTab === "units" && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                    Statutory Syllabus &amp; Units
                  </span>
                  <span className="text-[10px] font-semibold text-violet-400">
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
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer group ${
                        isActive
                          ? "bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-900/30 scale-[1.01]"
                          : "bg-black/5 hover:bg-black/10 border-transparent text-inherit opacity-90"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              isActive ? "bg-white/20 text-white" : "bg-violet-500/20 text-violet-400"
                            }`}
                          >
                            Unit {ch.unit}
                          </span>
                          {ch.weightage && (
                            <span className="text-[10px] opacity-70 font-semibold">{ch.weightage}</span>
                          )}
                        </div>

                        <span className="text-[11px] font-mono font-bold opacity-80">
                          Pg {ch.startPage}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold leading-snug">{ch.title}</h4>
                      <p className="text-[11px] opacity-75 mt-1 line-clamp-2">{ch.act}</p>

                      {ch.keyTopics && ch.keyTopics.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-white/10 flex flex-wrap gap-1">
                          {ch.keyTopics.map((topic, tIdx) => (
                            <span
                              key={tIdx}
                              className={`text-[9px] px-1.5 py-0.5 rounded ${
                                isActive ? "bg-white/15 text-white" : "bg-black/10 opacity-70"
                              }`}
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: SAVED BOOKMARKS */}
            {sidebarTab === "bookmarks" && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <div className="flex items-center justify-between px-1 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                    Saved Study Bookmarks
                  </span>
                  <button
                    onClick={() => toggleBookmark(currentPage)}
                    className="text-[11px] font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                  >
                    <span>+ Bookmark Current Pg {currentPage}</span>
                  </button>
                </div>

                {bookmarks.length === 0 ? (
                  <div className="text-center py-12 px-4 space-y-2 opacity-60">
                    <Bookmark className="w-8 h-8 mx-auto stroke-1" />
                    <p className="text-xs font-semibold">No Bookmarks Saved Yet</p>
                    <p className="text-[11px] leading-relaxed">
                      Click the bookmark icon while reading to save crucial sections, case laws, and revision charts.
                    </p>
                  </div>
                ) : (
                  bookmarks.map((bmPage) => (
                    <div
                      key={bmPage}
                      className="p-3 rounded-xl bg-black/5 hover:bg-black/10 border border-white/10 flex items-center justify-between gap-3 transition-colors"
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
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold font-mono text-xs flex items-center justify-center">
                          {bmPage}
                        </div>
                        <div>
                          <p className="text-xs font-bold">Page {bmPage}</p>
                          <p className="text-[10px] opacity-60">Saved Revision Point</p>
                        </div>
                      </button>

                      <button
                        onClick={() => toggleBookmark(bmPage)}
                        className="p-1 rounded-lg hover:bg-rose-500/20 text-rose-400 opacity-70 hover:opacity-100 transition-colors cursor-pointer"
                        title="Remove bookmark"
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
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-violet-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Reader Navigation Guide</h4>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { key: "→ / Space / Swipe Left", label: "Next Page" },
                    { key: "← / Shift+Space / Swipe Right", label: "Previous Page" },
                    { key: "Double Tap / Pinch", label: "Pinch to Zoom / Auto-Fit" },
                    { key: "+ / =", label: "Zoom In (+20%)" },
                    { key: "- / _", label: "Zoom Out (-20%)" },
                    { key: "W", label: "Fit to Screen Width" },
                    { key: "B", label: "Bookmark / Unbookmark Page" },
                    { key: "R", label: "Rotate Page 90°" },
                    { key: "Esc", label: "Exit / Close Reader" },
                  ].map((sc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-xl bg-black/5 border border-white/5"
                    >
                      <span className="opacity-80">{sc.label}</span>
                      <kbd className="px-2 py-0.5 rounded-md bg-black/30 border border-white/20 font-mono text-[10px] font-bold">
                        {sc.key}
                      </kbd>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-[11px] leading-relaxed">
                  <p className="font-bold text-violet-300 mb-1">DRM Protected Document</p>
                  <p className="opacity-75">
                    This statutory codex is encrypted and rendered directly into your browser canvas. Offline saving,
                    copying, and printing are disabled.
                  </p>
                </div>
              </div>
            )}

            {/* DRAWER FOOTER */}
            <div className="p-3 border-t border-inherit text-[10px] opacity-60 text-center font-medium">
              The Law कक्षा Digital Learning System
            </div>
          </aside>
        )}

        {/* CANVAS WORKSPACE WITH PINCH & SWIPE GESTURES */}
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
                className="hidden md:flex fixed left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-black/45 hover:bg-violet-600 text-white backdrop-blur-md border border-white/20 items-center justify-center transition-all disabled:opacity-0 cursor-pointer shadow-2xl group hover:scale-110 active:scale-95"
                title="Previous Page (←)"
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="hidden md:flex fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-black/45 hover:bg-violet-600 text-white backdrop-blur-md border border-white/20 items-center justify-center transition-all disabled:opacity-0 cursor-pointer shadow-2xl group hover:scale-110 active:scale-95"
                title="Next Page (→)"
              >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </>
          )}

          {/* LOADING STATE */}
          {loading && (
            <div className="flex flex-col items-center justify-center my-auto gap-4 text-white/70 py-20">
              <div className="w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white">Opening Secure Study Codex...</p>
                <p className="text-xs text-white/50 mt-1">Decrypting in-memory pages &amp; statutory flowcharts</p>
              </div>
            </div>
          )}

          {/* ERROR STATE */}
          {error && (
            <div className="flex flex-col items-center justify-center my-auto gap-3 max-w-md text-center p-8 rounded-3xl bg-black/30 border border-white/10 backdrop-blur-md">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-white">Book Unavailable</h3>
              <p className="text-xs text-white/60 leading-relaxed">{error}</p>
              <button
                onClick={() => loadPdf(pdfUrl)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Loading
              </button>
            </div>
          )}

          {/* LOADED PDF PAGE WITH SECURITY WATERMARK */}
          {!loading && !error && (
            <div className="relative my-auto flex flex-col items-center pb-28 sm:pb-24 max-w-full">
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

              {/* FOOTNOTE PROGRESS */}
              <div className="mt-3 flex items-center gap-2 text-[10px] sm:text-[11px] opacity-60 font-medium text-center px-4">
                <span className="font-bold">Page {currentPage} of {totalPages}</span>
                <span>•</span>
                <span className="truncate max-w-[200px] sm:max-w-none">{activeUnit.title}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. ULTRA-INTUITIVE FLOATING BOTTOM CONTROLLER DOCK (ZERO MENUS NEEDED) */}
      {totalPages > 0 && (
        <footer
          className={`fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 z-30 max-w-xl w-[96%] sm:w-full px-3 py-2.5 rounded-2xl border shadow-2xl backdrop-blur-md flex flex-col gap-2 ${themeStyles.controlBar} ${themeStyles.dockBorder}`}
        >
          {/* ROW 1: INSTANT ON-SCREEN ZOOM & PAGE CONTROLS (DIRECT 1-TAP ACTION) */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            {/* Previous Page Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed min-h-[40px] ${themeStyles.pillBg}`}
              title="Previous Page (←)"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Prev</span>
            </button>

            {/* DIRECT ON-SCREEN ZOOM CONTROLS (ALWAYS ACCESSIBLE, ZERO EXTRA MENUS) */}
            <div className="flex items-center gap-1 rounded-xl p-0.5 border border-inherit bg-black/10">
              {/* Zoom Out Button */}
              <button
                onClick={() => setScale((s) => Math.max(s - 0.2, 0.4))}
                className="p-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/10 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                title="Zoom Out (-20%)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              {/* 1-Tap Fit-to-Width Auto-Center */}
              <button
                onClick={handleFitWidth}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold hover:bg-black/10 transition-colors cursor-pointer flex items-center gap-1"
                title="Fit to Screen Width (1-Tap Auto Center)"
              >
                <Maximize2 className="w-3 h-3 text-violet-400" />
                <span>{Math.round(scale * 100)}%</span>
              </button>

              {/* Zoom In Button */}
              <button
                onClick={() => setScale((s) => Math.min(s + 0.2, 3.0))}
                className="p-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/10 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                title="Zoom In (+20%)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Rotate 90° Button */}
            <button
              onClick={handleRotate}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center transition-all cursor-pointer min-h-[40px] ${themeStyles.pillBg}`}
              title={`Rotate Page 90° (Current: ${rotation}°)`}
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Next Page Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed min-h-[40px] ${themeStyles.pillBg}`}
              title="Next Page (→)"
            >
              <span className="hidden xs:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* ROW 2: SCRUBBER SLIDER & TAPPABLE PAGE JUMP BADGE */}
          <div className="flex items-center gap-2 px-1 min-w-0 pt-0.5 border-t border-inherit/40">
            <span className="text-[10px] font-mono font-bold opacity-60">1</span>
            <div className="relative flex-1 flex items-center">
              <input
                type="range"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="w-full h-2 bg-black/25 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none"
                title={`Page ${currentPage} of ${totalPages} (${readingProgress}%)`}
              />
            </div>
            {/* Tappable Page Badge for Instant Jump */}
            <button
              onClick={() => {
                const target = prompt(`Enter page number (1 - ${totalPages}):`, String(currentPage));
                if (target) {
                  const p = parseInt(target);
                  if (!isNaN(p) && p >= 1 && p <= totalPages) {
                    setCurrentPage(p);
                  }
                }
              }}
              className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-black/10 hover:bg-black/20 shrink-0 cursor-pointer flex items-center gap-1 border border-inherit/60"
              title="Tap to jump to page number"
            >
              <span>Pg {currentPage}</span>
              <span className="opacity-40">/</span>
              <span className="opacity-70">{totalPages}</span>
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
