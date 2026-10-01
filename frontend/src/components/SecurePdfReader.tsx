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
        setCurrentPage((p) => Math.min(p + 1, totalPages));
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
        setCurrentPage((p) => Math.min(p + 1, totalPages));
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

      {/* 1. ULTRA-MINIMAL TOP BAR (100% REAL & STREAMLINED) */}
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
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/15 text-violet-400 font-mono font-medium">
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

        {/* COLLAPSIBLE SIDEBAR DRAWER (100% REAL CONTENTS / BOOKMARKS / GUIDE) */}
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
                    sidebarTab === "contents" ? "bg-violet-600 text-white shadow-xs" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {pdfOutline.length > 0 ? "Sections" : "Pages"}
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

            {/* TAB 1: 100% REAL CONTENTS OR REAL PAGE INDEX */}
            {sidebarTab === "contents" && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {pdfOutline.length > 0 ? (
                  // REAL EMBEDDED PDF OUTLINE
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
                              ? "bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-900/20 font-semibold"
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
                  // REAL EXACT PAGES LIST (NO ASSUMPTIONS)
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
                                ? "bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-900/20 font-bold"
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
                {/* CANVAS RENDERING SURFACE - LOCKED 1:1 ASPECT RATIO (NO STRETCH) */}
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
                  <div className="flex justify-between items-center text-[9px] sm:text-[11px] font-mono opacity-25 text-slate-800 font-bold uppercase tracking-wider">
                    <span>THE LAW KAKSHA • LICENSED STUDENT COPY</span>
                    <span>ROLL: {activeStudent.roll}</span>
                  </div>

                  {/* Multi-point Center Diagonal Watermark Grid */}
                  <div className="my-auto space-y-8 sm:space-y-12 transform -rotate-12 select-none opacity-20 text-center font-mono">
                    <div className="text-[11px] sm:text-xs font-bold text-slate-900 tracking-wider">
                      CONFIDENTIAL STUDY NOTES • PROPERTY OF THE LAW KAKSHA
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-violet-950 tracking-widest uppercase">
                      LICENSED TO: {activeStudent.name.toUpperCase()} • ID: {activeStudent.roll}
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-slate-800 tracking-wider">
                      STRICTLY FORBIDDEN TO SCREENSHOT, COPY OR DISTRIBUTE
                    </div>
                  </div>

                  {/* Bottom Footer Watermark */}
                  <div className="flex justify-between items-center text-[9px] sm:text-[11px] font-mono opacity-25 text-slate-800 font-bold uppercase tracking-wider">
                    <span>STUDENT: {activeStudent.name}</span>
                    <span>SECURE IN-WEB DRM READER</span>
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
