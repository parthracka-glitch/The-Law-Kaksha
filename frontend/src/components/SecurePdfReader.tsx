"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  X,
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
  HelpCircle,
  FileText,
  Lock,
  ArrowRight,
} from "lucide-react";

interface SecurePdfReaderProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
  studentName?: string;
  studentRoll?: string;
  previewPagesLimit?: number;
  isPurchased?: boolean;
  price?: number;
  onBuy?: () => void;
}

type ReaderTheme = "dark" | "sepia" | "light" | "oled";

interface PdfOutlineItem {
  title: string;
  page: number;
}

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
  studentName = "Student",
  studentRoll = "LK-2026-STU",
  previewPagesLimit,
  isPurchased = false,
  price,
  onBuy,
}: SecurePdfReaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfOutline, setPdfOutline] = useState<PdfOutlineItem[]>([]);
  const [scale, setScale] = useState(1.1);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<ReaderTheme>("dark");
  const [sidebarTab, setSidebarTab] = useState<"contents" | "bookmarks" | "shortcuts" | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const renderTaskRef = useRef<any>(null);

  // Preview Mode Calculation
  const isPreviewMode = !isPurchased && typeof previewPagesLimit === "number" && previewPagesLimit > 0;
  const maxAllowedPage = isPreviewMode
    ? Math.min(previewPagesLimit, totalPages > 0 ? totalPages : previewPagesLimit)
    : totalPages;

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

  const cleanFilename = useMemo(() => {
    return pdfUrl.split("?")[0].split("/").pop() || "study-codex.pdf";
  }, [pdfUrl]);

  // Main PDF Loader using Base64 with binary fallback + Real Outline Extraction
  const loadPdf = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    setPdfDoc(null);
    setTotalPages(0);
    setCurrentPage(1);
    setPdfOutline([]);

    const filename = url.split("?")[0].split("/").pop() || "study-codex.pdf";

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

      // Extract real embedded outline from the actual PDF file
      try {
        const rawOutline = await doc.getOutline();
        if (rawOutline && Array.isArray(rawOutline) && rawOutline.length > 0) {
          const resolved: PdfOutlineItem[] = [];
          for (const item of rawOutline) {
            let pNum = 1;
            if (typeof item.dest === "string") {
              const dest = await doc.getDestination(item.dest);
              if (dest && dest[0]) {
                pNum = (await doc.getPageIndex(dest[0])) + 1;
              }
            } else if (Array.isArray(item.dest) && item.dest[0]) {
              pNum = (await doc.getPageIndex(item.dest[0])) + 1;
            }
            if (pNum >= 1 && pNum <= doc.numPages) {
              resolved.push({ title: item.title || `Section (Page ${pNum})`, page: pNum });
            }
          }
          setPdfOutline(resolved);
        } else {
          setPdfOutline([]);
        }
      } catch (e) {
        setPdfOutline([]);
      }
    } catch (err: any) {
      console.error("PDF Base64 load failed, attempting binary fallback:", err);

      try {
        const pdfjsLib = await import("pdfjs-dist");
        if (typeof window !== "undefined") {
          pdfjsLib.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.mjs`;
        }

        let binResponse = await fetch(`/api/pdf/${filename}`, { cache: "no-store" });
        if (!binResponse.ok) {
          binResponse = await fetch(url.startsWith("/") ? url : `/notes/${url}`, { cache: "no-store" });
        }
        if (!binResponse.ok && !url.includes("/notes/")) {
          binResponse = await fetch(`/notes/${filename}`, { cache: "no-store" });
        }
        if (!binResponse.ok) {
          throw new Error(`Failed to fetch PDF binary: HTTP ${binResponse.status}`);
        }
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

        try {
          const rawOutline = await doc.getOutline();
          if (rawOutline && Array.isArray(rawOutline) && rawOutline.length > 0) {
            const resolved: PdfOutlineItem[] = [];
            for (const item of rawOutline) {
              let pNum = 1;
              if (typeof item.dest === "string") {
                const dest = await doc.getDestination(item.dest);
                if (dest && dest[0]) {
                  pNum = (await doc.getPageIndex(dest[0])) + 1;
                }
              } else if (Array.isArray(item.dest) && item.dest[0]) {
                pNum = (await doc.getPageIndex(item.dest[0])) + 1;
              }
              if (pNum >= 1 && pNum <= doc.numPages) {
                resolved.push({ title: item.title || `Section (Page ${pNum})`, page: pNum });
              }
            }
            setPdfOutline(resolved);
          }
        } catch (e) {}
      } catch (retryErr: any) {
        console.error("PDF all load attempts failed:", retryErr);
        setError("Unable to load the study book. Please click Retry below.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fit to Width calculation - strictly preserves aspect ratio
  const handleFitWidth = useCallback(async () => {
    if (!containerRef.current || !pdfDoc) return;
    try {
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale: 1, rotation });
      const horizontalPadding = window.innerWidth < 640 ? 16 : 48;
      const availableWidth = Math.max(containerRef.current.clientWidth - horizontalPadding, 240);
      if (availableWidth > 0 && viewport.width > 0) {
        const targetScale = availableWidth / viewport.width;
        setScale(targetScale);
      }
    } catch (e) {}
  }, [currentPage, pdfDoc, rotation]);

  // Fit to Page calculation - strictly preserves aspect ratio
  const handleFitPage = useCallback(async () => {
    if (!containerRef.current || !pdfDoc) return;
    try {
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale: 1, rotation });
      const verticalPadding = window.innerWidth < 640 ? 110 : 130;
      const availableHeight = Math.max(containerRef.current.clientHeight - verticalPadding, 300);
      if (availableHeight > 0 && viewport.height > 0) {
        const targetScale = availableHeight / viewport.height;
        setScale(targetScale);
      }
    } catch (e) {}
  }, [currentPage, pdfDoc, rotation]);

  // Rotate Page
  const handleRotate = () => {
    setRotation((r) => (r + 90) % 360);
  };

  // Render Page onto Canvas with High-DPI support and locked aspect ratio
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

        const cssWidth = Math.round(viewport.width / dpr);
        const cssHeight = Math.round(viewport.height / dpr);

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;
        setCanvasSize({ width: cssWidth, height: cssHeight });

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
        const limit = isPreviewMode ? maxAllowedPage : totalPages;
        setCurrentPage((p) => Math.min(p + 1, limit));
      } else {
        setCurrentPage((p) => Math.max(p - 1, 1));
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Comprehensive Keyboard & DRM Anti-Piracy Protection
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      // 1. Block PrintScreen and wipe clipboard
      if (e.key === "PrintScreen") {
        e.preventDefault();
        try {
          navigator.clipboard.writeText("");
        } catch (err) {}
        return;
      }

      // 2. Block Ctrl/Cmd + P (Print), S (Save), U (Source), C (Copy), X (Cut), V (Paste)
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "p" || e.key === "s" || e.key === "u" || e.key === "c" || e.key === "x" || e.key === "v")
      ) {
        e.preventDefault();
        return;
      }

      // 3. Block Developer Tools & Inspect Combos (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C)
      if (
        e.key === "F12" ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c"))
      ) {
        e.preventDefault();
        return;
      }

      // 4. Block Mac Screen Capture Shortcuts (Cmd + Shift + 3 / 4 / 5)
      if (e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4" || e.key === "5")) {
        e.preventDefault();
        return;
      }

      // Navigation Shortcuts
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) {
        e.preventDefault();
        const limit = isPreviewMode ? maxAllowedPage : totalPages;
        setCurrentPage((p) => (p >= limit ? limit : Math.min(p + 1, limit)));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) {
        e.preventDefault();
        setCurrentPage((p) => Math.max(p - 1, 1));
      } else if (e.key === "+" || e.key === "=") {
        setScale((s) => Math.min(s + 0.15, 3.5));
      } else if (e.key === "-" || e.key === "_") {
        setScale((s) => Math.max(s - 0.15, 0.3));
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

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("copy", handleCopy);
    window.addEventListener("cut", handleCopy);

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("copy", handleCopy);
      window.removeEventListener("cut", handleCopy);
    };
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

  // Design Token Theming Palette
  const themeStyles = {
    dark: {
      appBg: "#1A1E24",
      headerBg: "bg-[#1A1E24]/90 backdrop-blur-xl border-white/[0.08] text-slate-100",
      canvasBg: "#111418",
      pageShadow: "shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.06)]",
      tocBg: "bg-[#1A1E24] border-white/[0.08] text-slate-100",
      dockBg: "bg-[#242B35]/90 backdrop-blur-xl border-white/[0.1] text-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.45)]",
      btnGhost: "hover:bg-white/10 active:bg-white/15 text-slate-300 hover:text-white",
      btnActive: "bg-[#AED7E9] text-[#221D1D] font-bold",
      accent: "text-[#BFAFE5]",
    },
    sepia: {
      appBg: "#F7F4EB",
      headerBg: "bg-[#F7F4EB]/90 backdrop-blur-xl border-[#AED7E9]/[0.15] text-[#221D1D]",
      canvasBg: "#EDE7D9",
      pageShadow: "shadow-[0_20px_50px_-12px_rgba(60,40,15,0.15),0_0_0_1px_rgba(100,70,20,0.08)]",
      tocBg: "bg-[#F7F4EB] border-[#AED7E9]/[0.15] text-[#221D1D]",
      dockBg: "bg-[#EFE8DC]/90 backdrop-blur-xl border-[#AED7E9]/[0.2] text-[#221D1D] shadow-[0_12px_40px_rgba(60,40,15,0.12)]",
      btnGhost: "hover:bg-[#AED7E9]/10 active:bg-[#AED7E9]/15 text-[#4D433F] hover:text-[#221D1D]",
      btnActive: "bg-[#AED7E9] text-[#221D1D] font-bold",
      accent: "text-[#4B8097]",
    },
    light: {
      appBg: "#F7F7F5",
      headerBg: "bg-white/95 backdrop-blur-xl border-[#E7E4E7] text-[#221D1D]",
      canvasBg: "#EFEFEA",
      pageShadow: "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1),0_0_0_1px_rgba(231,228,231,0.8)]",
      tocBg: "bg-white border-[#E7E4E7] text-[#221D1D]",
      dockBg: "bg-white/95 backdrop-blur-xl border-[#E7E4E7] text-[#221D1D] shadow-[0_12px_40px_rgba(0,0,0,0.08)]",
      btnGhost: "hover:bg-[#F7F7F5] active:bg-[#E7E4E7] text-[#4D433F] hover:text-[#221D1D]",
      btnActive: "bg-[#AED7E9] text-[#221D1D] font-bold",
      accent: "text-[#4B8097]",
    },
    oled: {
      appBg: "#000000",
      headerBg: "bg-black/90 backdrop-blur-xl border-neutral-800 text-neutral-100",
      canvasBg: "#000000",
      pageShadow: "shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_25px_60px_rgba(0,0,0,1)]",
      tocBg: "bg-black border-neutral-800 text-neutral-100",
      dockBg: "bg-[#0A0A0A]/90 backdrop-blur-xl border-neutral-800 text-neutral-100 shadow-[0_12px_40px_rgba(0,0,0,0.8)]",
      btnGhost: "hover:bg-neutral-800 active:bg-neutral-700 text-neutral-300 hover:text-white",
      btnActive: "bg-[#AED7E9] text-[#221D1D] font-bold",
      accent: "text-[#BFAFE5]",
    },
  }[theme];

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

      {/* 1. ULTRA-MINIMAL TOP BAR */}
      <header
        className={`h-12 sm:h-13 px-3 sm:px-5 border-b shrink-0 z-30 flex items-center justify-between transition-colors ${themeStyles.headerBg}`}
      >
        {/* LEFT: TOC / CONTENTS BUTTON + REAL TITLE */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
          <button
            onClick={() => setSidebarTab(sidebarTab ? null : "contents")}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              sidebarTab ? themeStyles.btnActive : themeStyles.btnGhost
            }`}
            title="Document Contents & Pages"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-medium">Contents</span>
            {totalPages > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#AED7E9]/40 text-[#221D1D] font-mono font-bold">
                {totalPages} {totalPages === 1 ? "Page" : "Pages"}
              </span>
            )}
          </button>

          <div className="w-px h-4 bg-current opacity-10 hidden sm:block" />

          {/* Book Title */}
          <div className="min-w-0 flex items-center gap-2 truncate">
            <h1 className="text-xs sm:text-sm font-semibold tracking-tight truncate">
              {title}
            </h1>
          </div>
        </div>

        {/* RIGHT: 1-TAP ICONS */}
        <div className="flex items-center gap-1 shrink-0">
          {/* 1-Tap Theme Toggle */}
          <button
            onClick={cycleTheme}
            className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs ${themeStyles.btnGhost}`}
            title={`Theme: ${theme.toUpperCase()} (Tap to switch)`}
          >
            {theme === "dark" && <Moon className="w-4 h-4 text-[#BFAFE5]" />}
            {theme === "sepia" && <Coffee className="w-4 h-4 text-[#4B8097]" />}
            {theme === "light" && <Sun className="w-4 h-4 text-[#F7892A]" />}
            {theme === "oled" && <Moon className="w-4 h-4 text-neutral-400" />}
            <span className="hidden sm:inline capitalize text-[11px] font-medium opacity-80">{theme}</span>
          </button>

          {/* Bookmark Toggle */}
          <button
            onClick={() => toggleBookmark(currentPage)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isBookmarked ? "text-[#F7892A]" : themeStyles.btnGhost
            }`}
            title={isBookmarked ? "Page Bookmarked" : "Bookmark this Page (B)"}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-[#F7892A]" : "opacity-70"}`} />
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
            className="p-2 rounded-xl hover:bg-[#C35F3B]/15 text-[#77716E] hover:text-[#C35F3B] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* PREVIEW MODE TOP NOTIFICATION BAR */}
      {isPreviewMode && (
        <div className="bg-[#BFAFE5] text-[#221D1D] px-3 sm:px-5 py-2 flex items-center justify-between text-xs font-semibold shrink-0 z-30 shadow-xs border-b border-[#A08DC9]">
          <div className="flex items-center gap-2 truncate mr-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white text-[10px] font-bold uppercase tracking-wider text-[#221D1D] border border-[#A08DC9] shrink-0">
              Free Sample Preview ({maxAllowedPage} Pages Limit)
            </span>
            <span className="hidden sm:inline text-xs text-[#221D1D] font-medium truncate">
              You are reading free sample pages. Full study codex contains {totalPages > 0 ? totalPages : "complete"} pages.
            </span>
          </div>
          {onBuy && (
            <button
              onClick={onBuy}
              className="px-3.5 py-1 rounded-full bg-[#221D1D] hover:bg-[#383130] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs active:scale-95"
            >
              <span>Unlock Full Book {price ? `• ₹${price}` : ""}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#AED7E9]" />
            </button>
          )}
        </div>
      )}

      {/* 2. MAIN READING WORKSPACE & NAVIGATION DRAWER */}
      <div className="flex-1 flex min-h-0 relative">
        {/* MOBILE BACKDROP FOR SIDEBAR DRAWER */}
        {sidebarTab && (
          <div
            className="fixed inset-0 bg-[#221D1D]/50 backdrop-blur-xs z-30 md:hidden animate-in fade-in duration-150"
            onClick={() => setSidebarTab(null)}
          />
        )}

        {/* COLLAPSIBLE SIDEBAR DRAWER */}
        {sidebarTab && (
          <aside
            className={`fixed md:relative inset-y-0 left-0 w-[85vw] max-w-sm md:w-80 shrink-0 border-r flex flex-col z-40 shadow-2xl animate-in slide-in-from-left duration-200 ${themeStyles.tocBg}`}
          >
            {/* Drawer Header */}
            <div className="p-3 border-b border-inherit flex items-center justify-between gap-1">
              <div className="flex items-center gap-1 bg-black/10 rounded-xl p-1 w-full">
                <button
                  onClick={() => setSidebarTab("contents")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    sidebarTab === "contents" ? "bg-[#AED7E9] text-[#221D1D] shadow-xs font-bold" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {pdfOutline.length > 0 ? "Sections" : "Pages"}
                </button>
                <button
                  onClick={() => setSidebarTab("bookmarks")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    sidebarTab === "bookmarks" ? "bg-[#F7892A] text-white shadow-xs" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <span>Bookmarks</span>
                  {bookmarks.length > 0 && <span className="text-[10px]">({bookmarks.length})</span>}
                </button>
                <button
                  onClick={() => setSidebarTab("shortcuts")}
                  className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    sidebarTab === "shortcuts" ? "bg-[#4D433F] text-white shadow-xs" : "opacity-70 hover:opacity-100"
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

            {/* TAB 1: REAL CONTENTS OR REAL PAGE INDEX */}
            {sidebarTab === "contents" && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {pdfOutline.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between px-1 mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider opacity-50">
                        Document Sections
                      </span>
                      <span className="text-[10px] font-mono opacity-60">
                        {pdfOutline.length} items
                      </span>
                    </div>

                    {pdfOutline.map((item, idx) => {
                      const isActive = currentPage === item.page;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentPage(item.page);
                            if (typeof window !== "undefined" && window.innerWidth < 768) {
                              setSidebarTab(null);
                            }
                          }}
                          className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isActive
                              ? "bg-[#AED7E9] text-[#221D1D] border-[#98C5D8] shadow-md shadow-[#AED7E9]/30 font-bold"
                              : "bg-black/[0.03] hover:bg-black/[0.06] border-transparent opacity-85 hover:opacity-100 font-normal"
                          }`}
                        >
                          <span className="text-xs leading-snug truncate flex-1">{item.title}</span>
                          <span className="text-[11px] font-mono opacity-75 shrink-0">Pg {item.page}</span>
                        </button>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between px-1 mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider opacity-50">
                        All Pages ({totalPages})
                      </span>
                      <span className="text-[10px] opacity-60">
                        Tap any page to jump
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => {
                        const isActive = currentPage === pNum;
                        return (
                          <button
                            key={pNum}
                            onClick={() => {
                              setCurrentPage(pNum);
                              if (typeof window !== "undefined" && window.innerWidth < 768) {
                                setSidebarTab(null);
                              }
                            }}
                            className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                              isActive
                                ? "bg-[#AED7E9] text-[#221D1D] border-[#98C5D8] shadow-md shadow-[#AED7E9]/30 font-bold"
                                : "bg-black/[0.03] hover:bg-black/[0.06] border-transparent opacity-80 hover:opacity-100 font-medium"
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5 opacity-60" />
                            <span className="text-xs font-mono">Page {pNum}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
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
                    className="text-[11px] font-semibold text-[#F7892A] hover:text-[#C35F3B] flex items-center gap-1 cursor-pointer"
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
                        <div className="w-6 h-6 rounded-lg bg-[#F7892A]/20 text-[#F7892A] font-mono text-xs font-semibold flex items-center justify-center">
                          {bmPage}
                        </div>
                        <p className="text-xs font-medium">Page {bmPage}</p>
                      </button>

                      <button
                        onClick={() => toggleBookmark(bmPage)}
                        className="p-1 rounded-lg hover:bg-[#C35F3B]/20 text-[#C35F3B] opacity-60 hover:opacity-100 transition-colors cursor-pointer"
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
          className="flex-1 overflow-auto flex flex-col items-center justify-start py-6 sm:py-8 px-2 sm:px-4 relative scroll-smooth touch-auto"
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
                className="hidden md:flex fixed left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-[#AED7E9] hover:text-[#221D1D] text-white backdrop-blur-md border border-white/15 items-center justify-center transition-all disabled:opacity-0 cursor-pointer shadow-xl hover:scale-105 active:scale-95"
                title="Previous Page (←)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  if (isPreviewMode && currentPage >= maxAllowedPage) {
                    if (onBuy) onBuy();
                    return;
                  }
                  setCurrentPage((p) => Math.min(p + 1, isPreviewMode ? maxAllowedPage : totalPages));
                }}
                disabled={currentPage >= (isPreviewMode ? maxAllowedPage : totalPages)}
                className="hidden md:flex fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-[#AED7E9] hover:text-[#221D1D] text-white backdrop-blur-md border border-white/15 items-center justify-center transition-all disabled:opacity-30 cursor-pointer shadow-xl hover:scale-105 active:scale-95"
                title={isPreviewMode && currentPage >= maxAllowedPage ? "Preview Limit Reached • Unlock Full Book" : "Next Page (→)"}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* LOADING STATE */}
          {loading && (
            <div className="flex flex-col items-center justify-center my-auto gap-3 text-white/70 py-20">
              <Loader2 className="w-7 h-7 animate-spin text-[#4B8097]" />
              <p className="text-xs font-medium opacity-80">Loading Study Codex...</p>
            </div>
          )}

          {/* ERROR STATE */}
          {error && (
            <div className="flex flex-col items-center justify-center my-auto gap-3 max-w-sm text-center p-6 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-md">
              <BookOpen className="w-6 h-6 text-[#C35F3B] mx-auto" />
              <p className="text-xs opacity-75">{error}</p>
              <button
                onClick={() => loadPdf(pdfUrl)}
                className="px-4 py-2 rounded-xl bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer mx-auto"
              >
                <RefreshCw className="w-3 h-3" />
                Retry
              </button>
            </div>
          )}

          {/* LOADED PDF PAGE WITH SECURITY WATERMARK */}
          {!loading && !error && (
            <div className="relative my-auto flex flex-col items-center pb-24 sm:pb-20">
              <div
                className={`relative select-none rounded-xl overflow-hidden ${themeStyles.pageShadow} shrink-0`}
                style={{
                  width: canvasSize.width > 0 ? `${canvasSize.width}px` : "auto",
                  height: canvasSize.height > 0 ? `${canvasSize.height}px` : "auto",
                  background: "#ffffff",
                }}
                onContextMenu={blockContext}
              >
                {/* CANVAS RENDERING SURFACE */}
                <canvas
                  ref={canvasRef}
                  className="block"
                  style={{
                    width: canvasSize.width > 0 ? `${canvasSize.width}px` : "auto",
                    height: canvasSize.height > 0 ? `${canvasSize.height}px` : "auto",
                  }}
                />

                {/* ANTI-SCREENSHOT / DRM MULTI-LAYER WATERMARK OVERLAY */}
                <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex flex-col justify-between p-3 sm:p-5">
                  {/* Top Header Watermark */}
                  <div className="flex justify-between items-center text-[9px] sm:text-[11px] font-mono opacity-25 text-[#221D1D] font-bold uppercase tracking-wider">
                    <span>THE LAW KAKSHA • LICENSED STUDENT COPY</span>
                    <span>ROLL: {activeStudent.roll}</span>
                  </div>

                  {/* Multi-point Center Diagonal Watermark Grid */}
                  <div className="my-auto space-y-8 sm:space-y-12 transform -rotate-12 select-none opacity-20 text-center font-mono">
                    <div className="text-[11px] sm:text-xs font-bold text-[#221D1D] tracking-wider">
                      CONFIDENTIAL STUDY NOTES • PROPERTY OF THE LAW KAKSHA
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-[#221D1D] tracking-widest uppercase">
                      LICENSED TO: {activeStudent.name.toUpperCase()} • ID: {activeStudent.roll}
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-[#4D433F] tracking-wider">
                      STRICTLY FORBIDDEN TO SCREENSHOT, COPY OR DISTRIBUTE
                    </div>
                  </div>

                  {/* Bottom Footer Watermark */}
                  <div className="flex justify-between items-center text-[9px] sm:text-[11px] font-mono opacity-25 text-[#221D1D] font-bold uppercase tracking-wider">
                    <span>STUDENT: {activeStudent.name}</span>
                    <span>SECURE IN-WEB DRM READER</span>
                  </div>
                </div>
              </div>

              {/* FOOTNOTE */}
              <div className="mt-3 text-[11px] opacity-60 font-mono text-center">
                Page {currentPage} of {isPreviewMode ? `${maxAllowedPage} (Preview)` : totalPages}
              </div>

              {/* UNLOCK CARD WHEN REACHING PREVIEW LIMIT */}
              {isPreviewMode && currentPage >= maxAllowedPage && (
                <div className="w-full max-w-xl mx-auto my-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1A1E24] border-2 border-[#BFAFE5] shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 z-20">
                  <div className="w-12 h-12 rounded-2xl bg-[#BFAFE5]/40 text-[#221D1D] dark:text-white flex items-center justify-center mx-auto shadow-xs">
                    <Lock className="w-6 h-6 text-[#221D1D] dark:text-[#AED7E9]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C35F3B] bg-[#F4C5C0]/40 px-3 py-1 rounded-full border border-[#F4C5C0]">
                      End of Sample Preview ({maxAllowedPage} / {totalPages > 0 ? totalPages : maxAllowedPage} Pages)
                    </span>
                    <h4 className="text-base sm:text-xl font-bold font-serif text-[#221D1D] dark:text-white mt-2">
                      Unlock the Complete Edition of {title}
                    </h4>
                    <p className="text-xs text-[#4D433F] dark:text-slate-300 max-w-md mx-auto leading-relaxed mt-1">
                      Get instant digital access to all chapters, unit breakdowns, practice questions, and landmark case precedents inside your personal Student Dashboard with continuous DRM watermark security.
                    </p>
                  </div>
                  {onBuy && (
                    <div className="pt-2 flex justify-center">
                      <button
                        onClick={onBuy}
                        className="px-6 py-3 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2 hover:scale-[1.02]"
                      >
                        <span>Unlock Full Codex {price ? `• ₹${price}` : ""}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. ULTRA-SLEEK FLOATING CONTROLLER ISLAND */}
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
              max={isPreviewMode ? maxAllowedPage : totalPages}
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="w-full h-1 bg-current opacity-20 hover:opacity-40 rounded-full appearance-none cursor-pointer accent-[#AED7E9] focus:outline-none transition-opacity"
              title={`Page ${currentPage} of ${isPreviewMode ? `${maxAllowedPage} (Preview)` : totalPages}`}
            />
            <button
              onClick={() => {
                const target = prompt(`Jump to page (1 - ${isPreviewMode ? maxAllowedPage : totalPages}):`, String(currentPage));
                if (target) {
                  const p = parseInt(target);
                  if (!isNaN(p) && p >= 1 && p <= (isPreviewMode ? maxAllowedPage : totalPages)) {
                    setCurrentPage(p);
                  }
                }
              }}
              className="font-mono text-[11px] font-medium opacity-85 hover:opacity-100 shrink-0 cursor-pointer px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors whitespace-nowrap"
              title="Click to jump to page"
            >
              {currentPage}/{isPreviewMode ? `${maxAllowedPage} (Preview)` : totalPages}
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

          {/* NEXT PAGE BUTTON */}
          <button
            onClick={() => {
              if (isPreviewMode && currentPage >= maxAllowedPage) {
                if (onBuy) onBuy();
                return;
              }
              setCurrentPage((p) => Math.min(p + 1, isPreviewMode ? maxAllowedPage : totalPages));
            }}
            disabled={currentPage >= (isPreviewMode ? maxAllowedPage : totalPages)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed shrink-0 ${themeStyles.btnGhost}`}
            title={isPreviewMode && currentPage >= maxAllowedPage ? "Preview Limit Reached • Unlock Full Book" : "Next Page (→)"}
          >
            <ChevronRight className="w-4 h-4" />
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
