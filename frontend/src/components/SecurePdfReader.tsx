"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import { getApiBaseUrl } from "@/lib/api";
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

interface Uint8ArrayPolyfill {
  toHex?: (this: Uint8Array) => string;
  toBase64?: (this: Uint8Array) => string;
}

type PolyfilledUint8Array = Uint8Array & Uint8ArrayPolyfill;

// Polyfill ECMAScript Uint8Array.prototype.toHex and toBase64 for pdfjs-dist v6 support across all browsers
if (typeof Uint8Array !== "undefined") {
  const proto = Uint8Array.prototype as PolyfilledUint8Array;
  if (!proto.toHex) {
    proto.toHex = function (this: Uint8Array) {
      return Array.from(this)
        .map((b) => Number(b).toString(16).padStart(2, "0"))
        .join("");
    };
  }
  if (!proto.toBase64) {
    proto.toBase64 = function (this: Uint8Array) {
      let binary = "";
      const len = this.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(this[i]);
      }
      return typeof window !== "undefined" ? window.btoa(binary) : "";
    };
  }
}

function isRenderCancelledError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "RenderingCancelledException"
  );
}

// Design Token Theming Palette
const THEME_STYLES = {
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
    watermarkColor: "text-[#221D1D]",
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
    watermarkColor: "text-[#3D332A]",
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
    watermarkColor: "text-[#221D1D]",
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
    watermarkColor: "text-[#221D1D]",
  },
};

/**
 * Single Scrollable PDF Page with Lazy Canvas Rendering & Student ID Watermarking
 */
interface ScrollablePageProps {
  pageNum: number;
  pdfDoc: PDFDocumentProxy;
  scale: number;
  rotation: number;
  activeRoll: string;
  themeStyles: typeof THEME_STYLES.dark;
  pageWidth: number;
  pageHeight: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onVisible: (pageNum: number) => void;
}

const ScrollablePdfPage = React.memo(function ScrollablePdfPage({
  pageNum,
  pdfDoc,
  scale,
  rotation,
  activeRoll,
  themeStyles,
  pageWidth,
  pageHeight,
  containerRef,
  onVisible,
}: ScrollablePageProps) {
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const renderTaskRef = useRef<RenderTask | null>(null);

  // Lazy Intersection Observer: Observe when page comes near viewport
  useEffect(() => {
    const el = pageContainerRef.current;
    const root = containerRef.current;
    if (!el || !root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsInView(true);
          onVisible(pageNum);
        } else {
          // Keep rendered if within reasonable distance, or allow cleanup on very large documents
          if (entry.boundingClientRect.top > window.innerHeight * 3 || entry.boundingClientRect.bottom < -window.innerHeight * 3) {
            setIsInView(false);
          }
        }
      },
      {
        root: root,
        rootMargin: "500px 0px 500px 0px", // Pre-render 500px before scrolling into view
        threshold: [0, 0.2, 0.6],
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef, onVisible, pageNum]);

  // Render PDF page to canvas once in view
  useEffect(() => {
    if (!isInView || !pdfDoc) return;
    let cancelled = false;

    async function renderPageCanvas() {
      if (!canvasRef.current || !pdfDoc) return;
      try {
        setIsRendering(true);
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {}
          renderTaskRef.current = null;
        }

        const page = await pdfDoc.getPage(pageNum);
        if (cancelled) return;

        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
        const viewport = page.getViewport({ scale: scale * dpr, rotation });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        const cssWidth = Math.round(viewport.width / dpr);
        const cssHeight = Math.round(viewport.height / dpr);

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;

        const renderTask = page.render({ canvas, canvasContext: ctx, viewport });
        renderTaskRef.current = renderTask;
        await renderTask.promise;
        renderTaskRef.current = null;
        if (!cancelled) {
          setIsRendered(true);
        }
      } catch (err) {
        if (!isRenderCancelledError(err)) {
          console.error(`Render error on page ${pageNum}:`, err);
        }
      } finally {
        if (!cancelled) {
          setIsRendering(false);
        }
      }
    }

    renderPageCanvas();

    return () => {
      cancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {}
        renderTaskRef.current = null;
      }
    };
  }, [isInView, pdfDoc, pageNum, scale, rotation]);

  return (
    <div
      ref={pageContainerRef}
      id={`pdf-page-${pageNum}`}
      data-page-number={pageNum}
      className={`relative my-3 sm:my-5 select-none rounded-xl overflow-hidden ${themeStyles.pageShadow} shrink-0 transition-shadow`}
      style={{
        width: pageWidth > 0 ? `${pageWidth}px` : "auto",
        height: pageHeight > 0 ? `${pageHeight}px` : "auto",
        background: "#ffffff",
      }}
    >
      {/* CANVAS RENDERING SURFACE */}
      <canvas
        ref={canvasRef}
        className="block bg-white"
        style={{
          width: pageWidth > 0 ? `${pageWidth}px` : "auto",
          height: pageHeight > 0 ? `${pageHeight}px` : "auto",
          display: isRendered ? "block" : "none",
        }}
      />

      {/* SKELETON / LOADING PLACEHOLDER */}
      {(!isRendered || isRendering) && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-white text-slate-400 gap-2"
          style={{ width: `${pageWidth}px`, height: `${pageHeight}px` }}
        >
          <Loader2 className="w-6 h-6 animate-spin text-[#4B8097]" />
          <span className="text-[11px] font-mono text-slate-500">Page {pageNum} • Rendering Codex...</span>
        </div>
      )}

      {/* ANTI-SCREENSHOT / DRM WATERMARK OVERLAY WITH STUDENT ROLL NO */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex flex-col justify-between p-3 sm:p-5 z-10">
        {/* Top Header Watermark */}
        <div className="flex justify-between items-center text-[9px] sm:text-[11px] font-mono opacity-25 text-[#221D1D] font-bold uppercase tracking-wider">
          <span>THE LAW KAKSHA • LICENSED STUDENT COPY</span>
          <span className="bg-black/5 px-1.5 py-0.5 rounded font-extrabold text-[#000]">ROLL: {activeRoll}</span>
        </div>

        {/* Multi-point Center Diagonal Watermark Grid */}
        <div className="my-auto space-y-8 sm:space-y-12 transform -rotate-12 select-none opacity-20 text-center font-mono">
          <div className="text-[10px] sm:text-xs font-bold text-[#221D1D] tracking-wider">
            CONFIDENTIAL STUDY NOTES • THE LAW KAKSHA
          </div>
          <div className="text-xs sm:text-sm font-black text-[#221D1D] tracking-widest uppercase">
            STUDENT ID: {activeRoll}
          </div>
          <div className="text-[9px] sm:text-[10px] font-bold text-[#4D433F] tracking-wider">
            STRICTLY FORBIDDEN TO SCREENSHOT, DOWNLOAD OR DISTRIBUTE
          </div>
        </div>

        {/* Bottom Footer Watermark */}
        <div className="flex justify-between items-center text-[9px] sm:text-[11px] font-mono opacity-25 text-[#221D1D] font-bold uppercase tracking-wider">
          <span>STUDENT ID: {activeRoll}</span>
          <span>PG {pageNum} • ENCRYPTED DRM READER</span>
        </div>
      </div>
    </div>
  );
});

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfOutline, setPdfOutline] = useState<PdfOutlineItem[]>([]);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<ReaderTheme>("dark");
  const [sidebarTab, setSidebarTab] = useState<"contents" | "bookmarks" | "shortcuts" | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [basePageSize, setBasePageSize] = useState<{ width: number; height: number }>({ width: 595, height: 842 });

  // Preview Mode Calculation
  const isPreviewMode = !isPurchased && typeof previewPagesLimit === "number" && previewPagesLimit > 0;
  const maxAllowedPage = isPreviewMode
    ? Math.min(previewPagesLimit, totalPages > 0 ? totalPages : previewPagesLimit)
    : totalPages;

  // Student Profile Data
  const [activeStudent, setActiveStudent] = useState({ name: studentName, roll: studentRoll });
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw =
          localStorage.getItem("lawkaksha_student_session") ||
          localStorage.getItem("lawkaksha_active_student") ||
          localStorage.getItem("lawkaksha_student_user");
        if (raw) {
          const parsed = JSON.parse(raw);
          setActiveStudent({
            name: parsed.name || studentName,
            roll: parsed.student_id || parsed.rollNumber || studentRoll,
          });
        }
      } catch {}
    }
  }, [isOpen, studentName, studentRoll]);

  // Load Bookmarks from LocalStorage
  const bookmarkKey = useMemo(() => `lawkaksha_bookmarks_${pdfUrl.split("/").pop() || "default"}`, [pdfUrl]);
  useEffect(() => {
    if (typeof window !== "undefined" && isOpen) {
      try {
        const saved = localStorage.getItem(bookmarkKey);
        if (saved) setBookmarks(JSON.parse(saved));
      } catch {}
    }
  }, [bookmarkKey, isOpen]);

  const toggleBookmark = useCallback(
    (page: number) => {
      setBookmarks((prev) => {
        const next = prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page].sort((a, b) => a - b);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(bookmarkKey, JSON.stringify(next));
          } catch {}
        }
        return next;
      });
    },
    [bookmarkKey]
  );

  // Main PDF Loader — direct binary streaming with HTTP range support + outline extraction
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

      let token = "";
      if (typeof window !== "undefined") {
        token =
          localStorage.getItem("lawkaksha_student_token") ||
          localStorage.getItem("lawkaksha_token") ||
          localStorage.getItem("token") ||
          "";
      }

      const isAbsoluteUrl = /^https?:\/\//i.test(url);
      const isBackendContent = url.startsWith("/api/content/");
      const isSample =
        url.includes("sample=true") ||
        url.includes("sample=1") ||
        url.toLowerCase().includes("sample") ||
        !isPurchased ||
        isPreviewMode;
      const sampleQuery = isSample ? (token ? "&sample=true" : "?sample=true") : "";

      const pdfEndpoint = isAbsoluteUrl
        ? url
        : isBackendContent
        ? `${getApiBaseUrl()}${url}`
        : token
        ? `/api/pdf/${encodeURIComponent(filename)}?token=${encodeURIComponent(token)}${sampleQuery}`
        : `/api/pdf/${encodeURIComponent(filename)}${sampleQuery}`;

      const loadingTask = pdfjsLib.getDocument({
        url: pdfEndpoint,
        httpHeaders: token ? { Authorization: `Bearer ${token}` } : {},
        cMapUrl: "/cmaps/",
        cMapPacked: true,
        standardFontDataUrl: "/standard_fonts/",
        disableRange: false,
        disableStream: false,
        disableAutoFetch: false,
      });

      const doc = await loadingTask.promise;
      setPdfDoc(doc);
      setTotalPages(doc.numPages);

      // Measure Page 1 viewport to establish document aspect ratio
      try {
        const firstPage = await doc.getPage(1);
        const vp = firstPage.getViewport({ scale: 1 });
        setBasePageSize({ width: vp.width, height: vp.height });
      } catch {}

      // Extract real embedded outline
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
      } catch {
        setPdfOutline([]);
      }
    } catch (err) {
      console.error("PDF load failed:", err);
      // Fallback
      if (url.startsWith("/api/content/")) {
        try {
          const pdfjsLib = await import("pdfjs-dist");
          const fallbackTask = pdfjsLib.getDocument({
            url: `/api/pdf/${encodeURIComponent(filename)}?sample=true`,
            cMapUrl: "/cmaps/",
            cMapPacked: true,
            standardFontDataUrl: "/standard_fonts/",
          });
          const fallbackDoc = await fallbackTask.promise;
          setPdfDoc(fallbackDoc);
          setTotalPages(fallbackDoc.numPages);
          return;
        } catch (fallbackErr) {
          console.error("Fallback PDF proxy also failed:", fallbackErr);
        }
      }
      setError("Unable to load the study book. Please click Retry below.");
    } finally {
      setLoading(false);
    }
  }, [isPreviewMode, isPurchased]);

  // Fit to Width calculation
  const handleFitWidth = useCallback(() => {
    if (!containerRef.current || basePageSize.width <= 0) return;
    const horizontalPadding = window.innerWidth < 640 ? 16 : 48;
    const availableWidth = Math.max(containerRef.current.clientWidth - horizontalPadding, 260);
    const targetScale = Math.min(Math.max(availableWidth / basePageSize.width, 0.4), 2.5);
    setScale(Number(targetScale.toFixed(2)));
  }, [basePageSize.width]);

  // Fit to Page calculation
  const handleFitPage = useCallback(() => {
    if (!containerRef.current || basePageSize.height <= 0) return;
    const verticalPadding = window.innerWidth < 640 ? 110 : 130;
    const availableHeight = Math.max(containerRef.current.clientHeight - verticalPadding, 300);
    const targetScale = Math.min(Math.max(availableHeight / basePageSize.height, 0.4), 2.5);
    setScale(Number(targetScale.toFixed(2)));
  }, [basePageSize.height]);

  // Rotate Pages
  const handleRotate = () => {
    setRotation((r) => (r + 90) % 360);
  };

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
      }, 100);
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

  // Scroll to a specific page smoothly
  const scrollToPage = useCallback((pageNum: number) => {
    const pageEl = document.getElementById(`pdf-page-${pageNum}`);
    if (pageEl) {
      pageEl.scrollIntoView({ behavior: "smooth", block: "start" });
      setCurrentPage(pageNum);
    }
  }, []);

  // Update current page as user scrolls through pages
  const handlePageVisible = useCallback((pageNum: number) => {
    setCurrentPage(pageNum);
  }, []);

  // Keyboard navigation & anti-copy / anti-print event interceptors
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      // Prevent Print, Save, Copy, View Source
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "p" || e.key === "P" || e.key === "s" || e.key === "S" || e.key === "c" || e.key === "C" || e.key === "u" || e.key === "U")
      ) {
        e.preventDefault();
        return;
      }

      if (e.key === "F12") {
        e.preventDefault();
        return;
      }

      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        const next = Math.min(currentPage + 1, isPreviewMode ? maxAllowedPage : totalPages);
        scrollToPage(next);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        const prev = Math.max(currentPage - 1, 1);
        scrollToPage(prev);
      } else if (e.key === "+" || e.key === "=") {
        setScale((s) => Math.min(Number((s + 0.15).toFixed(2)), 2.5));
      } else if (e.key === "-" || e.key === "_") {
        setScale((s) => Math.max(Number((s - 0.15).toFixed(2)), 0.5));
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
  }, [isOpen, totalPages, onClose, currentPage, handleFitWidth, handleFitPage, isPreviewMode, maxAllowedPage, toggleBookmark, scrollToPage]);

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

  const themeStyles = THEME_STYLES[theme];

  // Calculate rendered dimensions preserving aspect ratio
  const isRotated = rotation % 180 !== 0;
  const effectiveBaseWidth = isRotated ? basePageSize.height : basePageSize.width;
  const effectiveBaseHeight = isRotated ? basePageSize.width : basePageSize.height;
  const computedPageWidth = Math.round(effectiveBaseWidth * scale);
  const computedPageHeight = Math.round(effectiveBaseHeight * scale);

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

      {/* 1. TOP HEADER BAR */}
      <header
        className={`h-12 sm:h-13 px-3 sm:px-5 border-b shrink-0 z-30 flex items-center justify-between transition-colors ${themeStyles.headerBg}`}
      >
        {/* LEFT: TOC / CONTENTS BUTTON + REAL TITLE */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => setSidebarTab((t) => (t === "contents" ? null : "contents"))}
            className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              sidebarTab === "contents" ? themeStyles.btnActive : themeStyles.btnGhost
            }`}
            title="Table of Contents & Pages"
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline text-xs font-semibold">Contents</span>
          </button>

          <div className="h-4 w-px bg-current opacity-20 hidden sm:block" />

          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold truncate max-w-[200px] sm:max-w-md md:max-w-lg leading-tight">
              {title}
            </h1>
            <div className="flex items-center gap-2 text-[10px] opacity-65 font-mono">
              <span>Student: {activeStudent.roll}</span>
              {isPreviewMode && (
                <span className="text-[#F7892A] font-bold">
                  • Preview Limit: {maxAllowedPage} Pages
                </span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: THEME CYCLER, ZOOM CONTROLS, FULLSCREEN, CLOSE */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            onClick={cycleTheme}
            className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium ${themeStyles.btnGhost}`}
            title={`Current: ${theme.toUpperCase()} (Click to toggle)`}
          >
            {theme === "dark" && <Moon className="w-4 h-4 text-[#BFAFE5]" />}
            {theme === "sepia" && <Coffee className="w-4 h-4 text-[#F7892A]" />}
            {theme === "light" && <Sun className="w-4 h-4 text-amber-500" />}
            {theme === "oled" && <div className="w-3.5 h-3.5 rounded-full border border-white/50 bg-black" />}
            <span className="hidden md:inline uppercase text-[10px] tracking-wider font-mono">
              {theme}
            </span>
          </button>

          <button
            onClick={() => toggleBookmark(currentPage)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              bookmarks.includes(currentPage) ? "text-[#F7892A] bg-[#F7892A]/10 font-bold" : themeStyles.btnGhost
            }`}
            title={bookmarks.includes(currentPage) ? "Remove Bookmark" : "Bookmark Current Page"}
          >
            <Bookmark className={`w-4 h-4 ${bookmarks.includes(currentPage) ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={toggleFullscreen}
            className={`hidden sm:flex p-2 rounded-xl transition-all cursor-pointer ${themeStyles.btnGhost}`}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#C35F3B]/20 text-[#C35F3B] hover:text-[#C35F3B] transition-all cursor-pointer ml-1"
            title="Close Reader (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE WITH SIDEBAR & CONTINUOUS VERTICAL SCROLL CANVAS */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* SIDEBAR DRAWER (TOC / BOOKMARKS / SHORTCUTS) */}
        {sidebarTab && (
          <aside
            className={`w-72 sm:w-80 border-r shrink-0 flex flex-col z-20 shadow-2xl transition-all ${themeStyles.tocBg}`}
          >
            {/* TABS HEADER */}
            <div className="p-3 border-b flex items-center justify-between border-inherit/15">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSidebarTab("contents")}
                  className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    sidebarTab === "contents" ? "bg-[#4D433F] text-white shadow-xs" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  Contents
                </button>
                <button
                  onClick={() => setSidebarTab("bookmarks")}
                  className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    sidebarTab === "bookmarks" ? "bg-[#4D433F] text-white shadow-xs" : "opacity-70 hover:opacity-100"
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
                            scrollToPage(item.page);
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
                        Tap any page to scroll
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => {
                        const isActive = currentPage === pNum;
                        return (
                          <button
                            key={pNum}
                            onClick={() => {
                              scrollToPage(pNum);
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
                      className="p-2.5 rounded-xl bg-black/[0.03] border border-inherit/20 flex items-center justify-between gap-2"
                    >
                      <button
                        onClick={() => {
                          scrollToPage(bmPage);
                          if (typeof window !== "undefined" && window.innerWidth < 768) {
                            setSidebarTab(null);
                          }
                        }}
                        className="flex-1 text-left flex items-center gap-2 cursor-pointer hover:opacity-100 opacity-80"
                      >
                        <div className="w-6 h-6 rounded-lg bg-[#F7892A]/10 text-[#F7892A] flex items-center justify-center shrink-0">
                          <Bookmark className="w-3.5 h-3.5 fill-current" />
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
                  { key: "Scroll / ↑ ↓", label: "Continuous Scroll" },
                  { key: "PageUp / PageDn", label: "Jump Page" },
                  { key: "W", label: "Fit Width" },
                  { key: "+ / -", label: "Zoom In / Out" },
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

        {/* CONTINUOUS VERTICAL DOCUMENT SCROLL WORKSPACE */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto flex flex-col items-center justify-start py-6 sm:py-8 px-2 sm:px-4 relative scroll-smooth touch-auto"
          style={{ background: themeStyles.canvasBg }}
          onContextMenu={blockContext}
        >
          {/* FLOATING PREVIOUS / NEXT SIDE CHEVRONS (Desktop Jump Controls) */}
          {totalPages > 0 && (
            <>
              <button
                onClick={() => scrollToPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="hidden md:flex fixed left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-[#AED7E9] hover:text-[#221D1D] text-white backdrop-blur-md border border-white/15 items-center justify-center transition-all disabled:opacity-0 cursor-pointer shadow-xl hover:scale-105 active:scale-95"
                title="Scroll to Previous Page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  if (isPreviewMode && currentPage >= maxAllowedPage) {
                    if (onBuy) onBuy();
                    return;
                  }
                  scrollToPage(Math.min(currentPage + 1, isPreviewMode ? maxAllowedPage : totalPages));
                }}
                disabled={currentPage >= (isPreviewMode ? maxAllowedPage : totalPages)}
                className="hidden md:flex fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-[#AED7E9] hover:text-[#221D1D] text-white backdrop-blur-md border border-white/15 items-center justify-center transition-all disabled:opacity-30 cursor-pointer shadow-xl hover:scale-105 active:scale-95"
                title={isPreviewMode && currentPage >= maxAllowedPage ? "Preview Limit Reached • Unlock Full Book" : "Scroll to Next Page"}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* LOADING STATE */}
          {loading && (
            <div className="flex flex-col items-center justify-center my-auto gap-3 text-white/70 py-20">
              <Loader2 className="w-7 h-7 animate-spin text-[#4B8097]" />
              <p className="text-xs font-medium opacity-80">Loading Study Codex Pages...</p>
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

          {/* LOADED PDF PAGES: CONTINUOUS VERTICAL SCROLL STREAM */}
          {!loading && !error && pdfDoc && totalPages > 0 && (
            <div className="flex flex-col items-center w-full pb-28">
              {Array.from({ length: maxAllowedPage }, (_, i) => i + 1).map((pNum) => (
                <ScrollablePdfPage
                  key={`${pNum}-${scale}-${rotation}`}
                  pageNum={pNum}
                  pdfDoc={pdfDoc}
                  scale={scale}
                  rotation={rotation}
                  activeRoll={activeStudent.roll}
                  themeStyles={themeStyles}
                  pageWidth={computedPageWidth}
                  pageHeight={computedPageHeight}
                  containerRef={containerRef}
                  onVisible={handlePageVisible}
                />
              ))}

              {/* UNLOCK CARD WHEN REACHING PREVIEW LIMIT IN SCROLL VIEW */}
              {isPreviewMode && maxAllowedPage < totalPages && (
                <div className="w-full max-w-xl mx-auto my-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1A1E24] border-2 border-[#BFAFE5] shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 z-20">
                  <div className="w-12 h-12 rounded-2xl bg-[#BFAFE5]/40 text-[#221D1D] dark:text-white flex items-center justify-center mx-auto shadow-xs">
                    <Lock className="w-6 h-6 text-[#221D1D] dark:text-[#AED7E9]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C35F3B] bg-[#F4C5C0]/40 px-3 py-1 rounded-full border border-[#F4C5C0]">
                      End of Sample Preview ({maxAllowedPage} / {totalPages} Pages)
                    </span>
                    <h4 className="text-base sm:text-xl font-bold font-serif text-[#221D1D] dark:text-white mt-2">
                      Unlock the Complete Edition of {title}
                    </h4>
                    <p className="text-xs text-[#4D433F] dark:text-slate-300 max-w-md mx-auto leading-relaxed mt-1">
                      Get instant access to all remaining chapters, statutory breakdown charts, practice questions, and model answers with secure student ID watermarking.
                    </p>
                  </div>
                  {onBuy && (
                    <div className="pt-2 flex justify-center">
                      <button
                        onClick={onBuy}
                        className="px-6 py-3 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2 hover:scale-[1.02]"
                      >
                        <span>Unlock Full Course Codex {price ? `• ₹${price}` : ""}</span>
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

      {/* 3. ULTRA-SLEEK FLOATING CONTROLLER DOCK */}
      {totalPages > 0 && (
        <footer
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-30 max-w-lg w-[95%] sm:w-auto min-w-0 sm:min-w-[420px] h-12 px-2 sm:px-4 rounded-full border shadow-xl flex items-center justify-between gap-1.5 sm:gap-4 transition-all duration-200 ${themeStyles.dockBg}`}
        >
          {/* PREVIOUS PAGE BUTTON */}
          <button
            onClick={() => scrollToPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed shrink-0 ${themeStyles.btnGhost}`}
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* ZOOM MINUS */}
          <button
            onClick={() => setScale((s) => Math.max(Number((s - 0.15).toFixed(2)), 0.5))}
            disabled={scale <= 0.55}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer opacity-70 hover:opacity-100 disabled:opacity-20 disabled:cursor-not-allowed shrink-0 ${themeStyles.btnGhost}`}
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
              onChange={(e) => scrollToPage(Number(e.target.value))}
              className="w-full h-1 bg-current opacity-20 hover:opacity-40 rounded-full appearance-none cursor-pointer accent-[#AED7E9] focus:outline-none transition-opacity"
              title={`Page ${currentPage} of ${isPreviewMode ? `${maxAllowedPage} (Preview)` : totalPages}`}
            />
            <button
              onClick={() => {
                const target = prompt(`Jump to page (1 - ${isPreviewMode ? maxAllowedPage : totalPages}):`, String(currentPage));
                if (target) {
                  const p = parseInt(target);
                  if (!isNaN(p) && p >= 1 && p <= (isPreviewMode ? maxAllowedPage : totalPages)) {
                    scrollToPage(p);
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
            onClick={() => setScale((s) => Math.min(Number((s + 0.15).toFixed(2)), 2.5))}
            disabled={scale >= 2.45}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer opacity-70 hover:opacity-100 disabled:opacity-20 disabled:cursor-not-allowed shrink-0 ${themeStyles.btnGhost}`}
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
              scrollToPage(Math.min(currentPage + 1, isPreviewMode ? maxAllowedPage : totalPages));
            }}
            disabled={currentPage >= (isPreviewMode ? maxAllowedPage : totalPages)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed shrink-0 ${themeStyles.btnGhost}`}
            title={isPreviewMode && currentPage >= maxAllowedPage ? "Preview Limit Reached • Unlock Full Book" : "Next Page"}
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

          {/* ROTATE BUTTON */}
          <button
            onClick={handleRotate}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer opacity-70 hover:opacity-100 shrink-0 ${themeStyles.btnGhost}`}
            title="Rotate 90°"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </footer>
      )}
    </div>
  );
}
