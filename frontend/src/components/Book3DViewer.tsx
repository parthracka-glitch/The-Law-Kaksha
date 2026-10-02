"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  BookOpen,
  Lock,
  ArrowRight,
  Maximize2,
  Sparkles,
  RotateCcw,
} from "lucide-react";

interface Book3DViewerProps {
  pdfDoc: any;
  totalPages: number;
  currentPage: number;
  onPageChange: (newPage: number) => void;
  isPreviewMode: boolean;
  maxAllowedPage: number;
  onBuy?: () => void;
  studentName: string;
  studentRoll: string;
  bookTitle: string;
  theme: "dark" | "sepia" | "light" | "oled";
  price?: number;
}

// Procedural realistic paper turn sound via Web Audio API (Zero external assets required)
function playProceduralPaperTurnSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const duration = 0.16;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    // Filtered pink-like paper noise
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.153852;
      output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.11;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Dynamic bandpass filter that sweeps frequency like a bending paper leaf
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(950, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2600, ctx.currentTime + 0.07);
    filter.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + duration);
    filter.Q.value = 1.4;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
    source.stop(ctx.currentTime + duration + 0.01);
  } catch (e) {
    // AudioContext blocked or not allowed by browser policy until gesture
  }
}

export function Book3DViewer({
  pdfDoc,
  totalPages,
  currentPage,
  onPageChange,
  isPreviewMode,
  maxAllowedPage,
  onBuy,
  studentName,
  studentRoll,
  bookTitle,
  theme,
  price,
}: Book3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isBookClosed, setIsBookClosed] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [bookTilt, setBookTilt] = useState<{ x: number; y: number }>({ x: 5, y: 0 });
  const [pageAspect, setPageAspect] = useState<number>(1.414); // Default A4 aspect ratio

  // Canvases for 2-page spread
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const flipFrontCanvasRef = useRef<HTMLCanvasElement>(null);
  const flipBackCanvasRef = useRef<HTMLCanvasElement>(null);

  // In-memory cache of rendered page bitmap canvases to allow instantaneous 3D flips
  const pageCache = useRef<Map<number, HTMLCanvasElement>>(new Map());

  // Determine current spread (Left page number, Right page number)
  // Page 1 is on the right, left is inside front cover
  // Pages 2-3: Left=2, Right=3
  // Pages 4-5: Left=4, Right=5
  const currentSpread = useMemo(() => {
    if (currentPage <= 1) {
      return { left: 0, right: 1 };
    }
    const left = currentPage % 2 === 0 ? currentPage : currentPage - 1;
    const right = left + 1;
    return { left, right };
  }, [currentPage]);

  // Clean title for display
  const displayTitle = useMemo(() => {
    return bookTitle.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
  }, [bookTitle]);

  // Render a specific PDF page to an offscreen or provided canvas
  const renderPdfPageToCanvas = useCallback(
    async (pageNum: number, targetCanvas?: HTMLCanvasElement): Promise<HTMLCanvasElement | null> => {
      if (!pdfDoc || pageNum < 1 || pageNum > totalPages) return null;

      // Check cache first if no specific canvas was provided
      if (!targetCanvas && pageCache.current.has(pageNum)) {
        return pageCache.current.get(pageNum)!;
      }

      try {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2 }); // High DPI 2x render
        const canvas = targetCanvas || document.createElement("canvas");
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return null;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;

        if (viewport.height > 0 && viewport.width > 0) {
          setPageAspect(viewport.height / viewport.width);
        }

        if (!targetCanvas) {
          pageCache.current.set(pageNum, canvas);
        }

        return canvas;
      } catch (e) {
        return null;
      }
    },
    [pdfDoc, totalPages]
  );

  // Copy offscreen canvas to displayed target canvas
  const paintCanvas = (source: HTMLCanvasElement, target: HTMLCanvasElement) => {
    target.width = source.width;
    target.height = source.height;
    const ctx = target.getContext("2d", { alpha: false });
    if (ctx) {
      ctx.drawImage(source, 0, 0);
    }
  };

  // Update Left and Right canvases when spread changes
  useEffect(() => {
    if (!pdfDoc) return;

    let active = true;

    async function loadSpreadPages() {
      // 1. Render Left Page (if > 0)
      if (currentSpread.left > 0 && leftCanvasRef.current) {
        const source = await renderPdfPageToCanvas(currentSpread.left);
        if (active && source && leftCanvasRef.current) {
          paintCanvas(source, leftCanvasRef.current);
        }
      }

      // 2. Render Right Page (if <= totalPages)
      if (currentSpread.right <= totalPages && rightCanvasRef.current) {
        const source = await renderPdfPageToCanvas(currentSpread.right);
        if (active && source && rightCanvasRef.current) {
          paintCanvas(source, rightCanvasRef.current);
        }
      }

      // 3. Preload adjacent pages into cache for silky smooth 3D turning
      const preloadPages = [
        currentSpread.left - 2,
        currentSpread.left - 1,
        currentSpread.right + 1,
        currentSpread.right + 2,
      ].filter((p) => p >= 1 && p <= totalPages);

      preloadPages.forEach((p) => {
        if (!pageCache.current.has(p)) {
          renderPdfPageToCanvas(p);
        }
      });
    }

    loadSpreadPages();

    return () => {
      active = false;
    };
  }, [pdfDoc, currentSpread, totalPages, renderPdfPageToCanvas]);

  // Handle 3D page flip animation forward (Next spread)
  const triggerFlipNext = useCallback(async () => {
    if (isFlipping) return;

    const nextTargetPage = currentSpread.right + 1;
    const limit = isPreviewMode ? maxAllowedPage : totalPages;

    if (currentSpread.right >= limit) {
      if (isPreviewMode && onBuy) {
        onBuy();
      }
      return;
    }

    if (soundEnabled) {
      playProceduralPaperTurnSound();
    }

    // Prepare leaf canvas:
    // Front face = current Right page (being turned away)
    // Back face = incoming next Left page (currentSpread.right + 1)
    if (flipFrontCanvasRef.current && rightCanvasRef.current) {
      paintCanvas(rightCanvasRef.current, flipFrontCanvasRef.current);
    }

    const nextLeftSource = await renderPdfPageToCanvas(nextTargetPage);
    if (flipBackCanvasRef.current && nextLeftSource) {
      paintCanvas(nextLeftSource, flipBackCanvasRef.current);
    }

    setFlipDirection("next");
    setIsFlipping(true);

    // After animation finishes (600ms), advance state
    setTimeout(() => {
      onPageChange(Math.min(nextTargetPage, limit));
      setIsFlipping(false);
      setFlipDirection(null);
    }, 580);
  }, [
    isFlipping,
    currentSpread.right,
    isPreviewMode,
    maxAllowedPage,
    totalPages,
    soundEnabled,
    onBuy,
    renderPdfPageToCanvas,
    onPageChange,
  ]);

  // Handle 3D page flip animation backward (Previous spread)
  const triggerFlipPrev = useCallback(async () => {
    if (isFlipping || currentSpread.left <= 0) return;

    const prevTargetPage = Math.max(currentSpread.left - 2, 1);

    if (soundEnabled) {
      playProceduralPaperTurnSound();
    }

    // Prepare leaf canvas for backwards flip:
    // Front face = incoming Right page (currentSpread.left - 1)
    // Back face = current Left page (being turned backward)
    const incomingRight = await renderPdfPageToCanvas(currentSpread.left - 1);
    if (flipFrontCanvasRef.current && incomingRight) {
      paintCanvas(incomingRight, flipFrontCanvasRef.current);
    }

    if (flipBackCanvasRef.current && leftCanvasRef.current) {
      paintCanvas(leftCanvasRef.current, flipBackCanvasRef.current);
    }

    setFlipDirection("prev");
    setIsFlipping(true);

    setTimeout(() => {
      onPageChange(prevTargetPage);
      setIsFlipping(false);
      setFlipDirection(null);
    }, 580);
  }, [
    isFlipping,
    currentSpread.left,
    soundEnabled,
    renderPdfPageToCanvas,
    onPageChange,
  ]);

  // Responsive Book Sizing based on container width
  const [bookDimensions, setBookDimensions] = useState<{ width: number; height: number }>({
    width: 840,
    height: 590,
  });

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const cWidth = containerRef.current.clientWidth;
      const cHeight = containerRef.current.clientHeight;

      // Single leaf target aspect ratio
      const leafAspect = pageAspect > 0 ? pageAspect : 1.414; // height / width

      const maxBookWidth = Math.min(cWidth - 32, 1100);
      const maxBookHeight = Math.min(cHeight - 80, 720);

      // Book is composed of two leaves side-by-side (aspect = leafAspect / 2)
      let bWidth = maxBookWidth;
      let bHeight = (bWidth / 2) * leafAspect;

      if (bHeight > maxBookHeight) {
        bHeight = maxBookHeight;
        bWidth = (bHeight / leafAspect) * 2;
      }

      setBookDimensions({
        width: Math.max(Math.round(bWidth * zoomScale), 320),
        height: Math.max(Math.round(bHeight * zoomScale), 240),
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [pageAspect, zoomScale]);

  // Mouse 3D parallax tilt effect on desktop
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || window.innerWidth < 768) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;
    setBookTilt({
      x: 6 - yRatio * 8, // subtle pitch
      y: xRatio * 10,   // subtle yaw
    });
  };

  const leafWidth = Math.round(bookDimensions.width / 2);
  const leafHeight = bookDimensions.height;

  // Visual stack thickness calculation based on remaining pages
  const leftStackPages = currentSpread.left;
  const rightStackPages = Math.max(totalPages - currentSpread.right, 0);
  const leftStackPx = Math.min(Math.max(Math.round((leftStackPages / (totalPages || 1)) * 14), 2), 16);
  const rightStackPx = Math.min(Math.max(Math.round((rightStackPages / (totalPages || 1)) * 14), 2), 16);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none py-4 px-2"
      style={{
        perspective: "2000px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      {/* 3D BOOK STAGE CONTROLS (Top Right of viewer stage) */}
      <div className="absolute top-3 right-4 z-40 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg text-white">
        <button
          onClick={() => setSoundEnabled((v) => !v)}
          className={`p-1.5 rounded-full transition-all cursor-pointer ${
            soundEnabled ? "text-[#AED7E9] hover:bg-white/15" : "text-white/40 hover:bg-white/10"
          }`}
          title={soundEnabled ? "Paper Audio Enabled (Click to Mute)" : "Paper Audio Muted"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <div className="w-px h-3.5 bg-white/20" />

        <button
          onClick={() => setIsBookClosed((v) => !v)}
          className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all hover:bg-white/15 cursor-pointer text-slate-200 hover:text-white flex items-center gap-1.5"
          title={isBookClosed ? "Open 3D Book" : "View Closed Hardcover"}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#BFAFE5]" />
          <span>{isBookClosed ? "Open Book" : "Cover View"}</span>
        </button>

        <div className="w-px h-3.5 bg-white/20" />

        <button
          onClick={() => setZoomScale((s) => (s >= 1.25 ? 1 : Number((s + 0.15).toFixed(2))))}
          className="p-1.5 rounded-full hover:bg-white/15 text-slate-200 hover:text-white cursor-pointer transition-all"
          title={`Zoom Scale: ${Math.round(zoomScale * 100)}%`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3D PHYSICAL BOOK CONTAINER */}
      <div
        className="relative transition-transform duration-500 ease-out"
        style={{
          width: `${bookDimensions.width}px`,
          height: `${bookDimensions.height}px`,
          transformStyle: "preserve-3d",
          transform: `rotateX(${bookTilt.x}deg) rotateY(${bookTilt.y}deg)`,
        }}
      >
        {/* ============================================================== */}
        {/* CASE 1: 3D CLOSED HARDCOVER PRESENTATION                       */}
        {/* ============================================================== */}
        {isBookClosed ? (
          <div
            onClick={() => setIsBookClosed(false)}
            className="w-1/2 mx-auto h-full rounded-2xl relative cursor-pointer group shadow-[0_30px_70px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #1C1817 0%, #2A2221 45%, #181413 100%)",
              border: "3px solid #845B38",
            }}
          >
            {/* Real Leather Texture Highlight */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-black/60 rounded-xl" />

            {/* Embossed Gold Foil Filigree Frame */}
            <div className="absolute inset-3 rounded-lg border-2 border-[#DDA994]/50 pointer-events-none flex flex-col justify-between p-6 sm:p-8">
              {/* Corner Ornaments */}
              <div className="flex justify-between items-center text-[#DDA994]">
                <span className="text-xs font-serif tracking-widest uppercase">ICAI • ICSI</span>
                <span className="text-[10px] font-mono tracking-widest uppercase">EDITION 2026</span>
              </div>

              {/* Center Seal & Title */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full mx-auto border-2 border-[#DDA994] flex items-center justify-center shadow-lg bg-black/40">
                  <Sparkles className="w-8 h-8 text-[#DDA994]" />
                </div>
                <div className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#DDA994]/80">
                  THE LAW KAKSHA
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide uppercase leading-tight drop-shadow-md">
                  {displayTitle}
                </h2>
                <div className="w-24 h-0.5 bg-[#DDA994]/60 mx-auto" />
                <p className="text-[11px] text-[#DDA994]/90 font-serif italic">
                  Complete Statutory Study Codex
                </p>
              </div>

              {/* Bottom Spine Ribbon Marker */}
              <div className="flex items-center justify-center gap-2 text-xs font-serif text-[#DDA994]/80">
                <BookOpen className="w-4 h-4 text-[#DDA994]" />
                <span className="tracking-wider uppercase text-[10px] font-semibold">
                  Tap to Open Book
                </span>
              </div>
            </div>

            {/* 3D Spine Thickness on Left Edge */}
            <div
              className="absolute -left-3 top-0 bottom-0 w-3 rounded-l-md"
              style={{
                background: "linear-gradient(to right, #110E0D, #2F2422)",
                boxShadow: "-4px 0 10px rgba(0,0,0,0.5)",
              }}
            />

            {/* 3D Stacked Page Thickness on Right Edge */}
            <div
              className="absolute -right-3 top-2 bottom-2 w-3 rounded-r-xs"
              style={{
                background: "repeating-linear-gradient(to bottom, #F4EEDB 0px, #E8DEC7 2px, #D5C7AA 3px)",
                boxShadow: "4px 0 12px rgba(0,0,0,0.5)",
              }}
            />
          </div>
        ) : (
          /* ============================================================== */
          /* CASE 2: 3D OPEN SPREAD (TWO-PAGE PHYSICAL CODEX)               */
          /* ============================================================== */
          <div
            className="w-full h-full relative rounded-2xl flex shadow-[0_35px_80px_rgba(0,0,0,0.85)]"
            style={{
              background: "#221D1D",
              boxShadow: "0 25px 70px -10px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)",
            }}
          >
            {/* 1. LEFT HARDCOVER CASING BASE */}
            <div
              className="absolute -left-2 -top-2 -bottom-2 rounded-l-2xl border-l border-t border-b border-[#4D433F] pointer-events-none"
              style={{
                width: `${leafWidth + 8}px`,
                background: "linear-gradient(to right, #1C1817 0%, #2A2221 100%)",
                boxShadow: "-8px 10px 30px rgba(0,0,0,0.6)",
              }}
            />

            {/* 2. RIGHT HARDCOVER CASING BASE */}
            <div
              className="absolute -right-2 -top-2 -bottom-2 rounded-r-2xl border-r border-t border-b border-[#4D433F] pointer-events-none"
              style={{
                width: `${leafWidth + 8}px`,
                background: "linear-gradient(to left, #1C1817 0%, #2A2221 100%)",
                boxShadow: "8px 10px 30px rgba(0,0,0,0.6)",
              }}
            />

            {/* 3. STACKED PAPER SIDES (Showing physical page count depth) */}
            {/* Left stacked pages edge */}
            <div
              className="absolute -left-1 top-2 bottom-2 rounded-l-xs pointer-events-none transition-all duration-300"
              style={{
                width: `${leftStackPx}px`,
                background: "repeating-linear-gradient(to right, #EFE8DC 0px, #E3D9C8 2px, #D0C3AE 3px)",
                boxShadow: "-3px 0 8px rgba(0,0,0,0.3) inset",
              }}
            />

            {/* Right stacked pages edge */}
            <div
              className="absolute -right-1 top-2 bottom-2 rounded-r-xs pointer-events-none transition-all duration-300"
              style={{
                width: `${rightStackPx}px`,
                background: "repeating-linear-gradient(to left, #EFE8DC 0px, #E3D9C8 2px, #D0C3AE 3px)",
                boxShadow: "3px 0 8px rgba(0,0,0,0.3) inset",
              }}
            />

            {/* 4. SATIN BOOKMARK RIBBON (hanging from top spine) */}
            <div
              className="absolute left-1/2 -top-3 w-4 h-16 -translate-x-1/2 z-30 pointer-events-none shadow-md rounded-b-sm"
              style={{
                background: "linear-gradient(to bottom, #C35F3B 0%, #9E4524 85%, #6B2912 100%)",
                clipPath: "polygon(0 0, 100% 0, 100% 88%, 50% 100%, 0 88%)",
              }}
            />

            {/* ========================================================== */}
            {/* 5. LEFT PAGE LEAF (Even page / Inside Front Cover)         */}
            {/* ========================================================== */}
            <div
              className="relative h-full overflow-hidden flex flex-col justify-center items-center bg-[#FCFAF6] border-r border-[#E8DEC7]"
              style={{
                width: `${leafWidth}px`,
                borderTopLeftRadius: "6px",
                borderBottomLeftRadius: "6px",
                boxShadow: "inset -18px 0 25px -10px rgba(0,0,0,0.18)",
              }}
            >
              {currentSpread.left === 0 ? (
                /* INSIDE FRONT COVER (Ex Libris Bookplate) */
                <div className="w-full h-full p-6 sm:p-10 flex flex-col justify-between items-center text-center bg-[#FAF6EE] relative">
                  {/* Subtle Marbled Paper Border */}
                  <div className="absolute inset-4 border border-[#D5C7AA] rounded-md pointer-events-none" />

                  <div className="space-y-1 mt-4">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#77716E]">
                      Statutory Law Codex
                    </span>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-[#221D1D]">
                      The Law Kaksha
                    </h3>
                  </div>

                  {/* Ex Libris Plate */}
                  <div className="p-5 sm:p-6 rounded-xl border border-[#DDA994] bg-[#F7F2E7] max-w-xs shadow-inner space-y-2">
                    <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#C35F3B]">
                      Ex Libris • Student Edition
                    </div>
                    <div className="text-sm font-serif font-bold text-[#221D1D] uppercase">
                      {studentName}
                    </div>
                    <div className="text-[10px] font-mono text-[#77716E]">
                      Roll ID: {studentRoll}
                    </div>
                    <div className="text-[10px] italic text-[#4D433F] pt-2 border-t border-[#D5C7AA]">
                      &quot;Strictly for personal study preparation.&quot;
                    </div>
                  </div>

                  <div className="text-[10px] font-serif text-[#77716E] mb-2">
                    Turn to page 1 to begin reading →
                  </div>
                </div>
              ) : (
                /* REAL RENDERED LEFT PDF PAGE CANVAS */
                <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-3 overflow-hidden">
                  <canvas
                    ref={leftCanvasRef}
                    className="max-w-full max-h-full object-contain block shadow-xs"
                    style={{ background: "#FFFFFF" }}
                  />

                  {/* Anti-tamper DRM watermark on left page */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 select-none">
                    <div className="flex justify-between text-[8px] font-mono text-[#221D1D]/25 font-bold uppercase">
                      <span>THE LAW KAKSHA</span>
                      <span>PG {currentSpread.left}</span>
                    </div>
                    <div className="text-[9px] font-mono font-bold text-[#221D1D]/15 text-center -rotate-12 select-none uppercase">
                      {studentName} • {studentRoll}
                    </div>
                    <div className="text-[8px] font-mono text-[#221D1D]/25 text-center">
                      SECURE CODEX READER
                    </div>
                  </div>
                </div>
              )}

              {/* LEFT PAGE INTERACTIVE TURN CLICK AREA */}
              {currentSpread.left > 0 && (
                <button
                  onClick={triggerFlipPrev}
                  className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 hover:bg-black/[0.03] transition-colors cursor-pointer flex items-center justify-start pl-2 group"
                  title="Previous Page (←)"
                >
                  <ChevronLeft className="w-6 h-6 text-[#221D1D]/30 group-hover:text-[#221D1D] transition-colors" />
                </button>
              )}
            </div>

            {/* ========================================================== */}
            {/* 6. BOOK CENTER SPINE CREASE & GUTTER SHADOW                */}
            {/* ========================================================== */}
            <div
              className="absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 z-20 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.06) 35%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.06) 65%, rgba(0,0,0,0.22) 100%)",
              }}
            />

            {/* ========================================================== */}
            {/* 7. RIGHT PAGE LEAF (Odd page / Preview Lockout)            */}
            {/* ========================================================== */}
            <div
              className="relative h-full overflow-hidden flex flex-col justify-center items-center bg-[#FCFAF6]"
              style={{
                width: `${leafWidth}px`,
                borderTopRightRadius: "6px",
                borderBottomRightRadius: "6px",
                boxShadow: "inset 18px 0 25px -10px rgba(0,0,0,0.18)",
              }}
            >
              {isPreviewMode && currentSpread.right > maxAllowedPage ? (
                /* SAMPLE LIMIT REACHED LOCK PAGE */
                <div className="w-full h-full p-6 sm:p-10 flex flex-col items-center justify-center text-center bg-[#FAF6EE] relative space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#BFAFE5]/40 text-[#221D1D] flex items-center justify-center shadow-md">
                    <Lock className="w-7 h-7 text-[#221D1D]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C35F3B] bg-[#F4C5C0]/40 px-3 py-1 rounded-full border border-[#F4C5C0]">
                      End of Sample Preview ({maxAllowedPage} Pages)
                    </span>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-[#221D1D] mt-2">
                      Unlock Full Edition
                    </h3>
                    <p className="text-xs text-[#4D433F] max-w-xs mx-auto leading-relaxed mt-1">
                      Continue reading all chapters, high-scoring case analyses, and notes in your dashboard.
                    </p>
                  </div>
                  {onBuy && (
                    <button
                      onClick={onBuy}
                      className="px-6 py-2.5 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2 hover:scale-105 active:scale-95"
                    >
                      <span>Unlock Codex {price ? `• ₹${price}` : ""}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : currentSpread.right <= totalPages ? (
                /* REAL RENDERED RIGHT PDF PAGE CANVAS */
                <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-3 overflow-hidden">
                  <canvas
                    ref={rightCanvasRef}
                    className="max-w-full max-h-full object-contain block shadow-xs"
                    style={{ background: "#FFFFFF" }}
                  />

                  {/* Anti-tamper DRM watermark on right page */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 select-none">
                    <div className="flex justify-between text-[8px] font-mono text-[#221D1D]/25 font-bold uppercase">
                      <span>THE LAW KAKSHA</span>
                      <span>PG {currentSpread.right}</span>
                    </div>
                    <div className="text-[9px] font-mono font-bold text-[#221D1D]/15 text-center -rotate-12 select-none uppercase">
                      {studentName} • {studentRoll}
                    </div>
                    <div className="text-[8px] font-mono text-[#221D1D]/25 text-center">
                      SECURE CODEX READER
                    </div>
                  </div>
                </div>
              ) : (
                /* BACK INSIDE COVER (End of Book) */
                <div className="w-full h-full p-6 sm:p-10 flex flex-col justify-center items-center text-center bg-[#FAF6EE] relative space-y-3">
                  <Sparkles className="w-8 h-8 text-[#C35F3B]" />
                  <h4 className="text-base font-serif font-bold text-[#221D1D]">End of Codex</h4>
                  <p className="text-xs text-[#77716E]">
                    You have reached the final page of {displayTitle}.
                  </p>
                  <button
                    onClick={() => onPageChange(1)}
                    className="px-4 py-2 rounded-full bg-[#E8DEC7] hover:bg-[#D5C7AA] text-[#221D1D] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Return to Beginning</span>
                  </button>
                </div>
              )}

              {/* RIGHT PAGE INTERACTIVE TURN CLICK AREA */}
              <button
                onClick={triggerFlipNext}
                className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 hover:bg-black/[0.03] transition-colors cursor-pointer flex items-center justify-end pr-2 group"
                title="Next Page (→)"
              >
                <ChevronRight className="w-6 h-6 text-[#221D1D]/30 group-hover:text-[#221D1D] transition-colors" />
              </button>

              {/* TACTILE BOTTOM-RIGHT CORNER CURL HOVER EFFECT */}
              <div
                onClick={triggerFlipNext}
                className="absolute bottom-0 right-0 w-12 h-12 cursor-pointer group z-20"
                title="Click corner to flip page"
              >
                <div
                  className="w-full h-full transition-transform duration-200 group-hover:-translate-x-1 group-hover:-translate-y-1"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.08) 51%, rgba(220,210,190,0.9) 100%)",
                    clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                  }}
                />
              </div>
            </div>

            {/* ========================================================== */}
            {/* 8. 3D TURNING LEAF (Animated during Page Flip)             */}
            {/* ========================================================== */}
            {isFlipping && (
              <div
                className="absolute top-0 bottom-0 h-full pointer-events-none z-30"
                style={{
                  left: "50%",
                  width: `${leafWidth}px`,
                  transformOrigin: flipDirection === "next" ? "left center" : "left center",
                  transformStyle: "preserve-3d",
                  animation:
                    flipDirection === "next"
                      ? "flipLeafForward 580ms cubic-bezier(0.25, 1, 0.5, 1) forwards"
                      : "flipLeafBackward 580ms cubic-bezier(0.25, 1, 0.5, 1) forwards",
                }}
              >
                {/* FRONT FACE OF FLIPPING LEAF */}
                <div
                  className="absolute inset-0 w-full h-full bg-[#FCFAF6] overflow-hidden flex items-center justify-center p-2"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    borderTopRightRadius: "6px",
                    borderBottomRightRadius: "6px",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.35)",
                  }}
                >
                  <canvas
                    ref={flipFrontCanvasRef}
                    className="max-w-full max-h-full object-contain block"
                  />
                  {/* Dynamic Shading Gradient traveling across leaf during flip */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(255,255,255,0.15) 40%, rgba(0,0,0,0.2) 100%)",
                    }}
                  />
                </div>

                {/* BACK FACE OF FLIPPING LEAF (Rotated 180deg) */}
                <div
                  className="absolute inset-0 w-full h-full bg-[#FCFAF6] overflow-hidden flex items-center justify-center p-2"
                  style={{
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    borderTopLeftRadius: "6px",
                    borderBottomLeftRadius: "6px",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.35)",
                  }}
                >
                  <canvas
                    ref={flipBackCanvasRef}
                    className="max-w-full max-h-full object-contain block"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to left, rgba(0,0,0,0.3) 0%, rgba(255,255,255,0.15) 40%, rgba(0,0,0,0.2) 100%)",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* KEYFRAME ANIMATIONS FOR 3D FLIP */}
      <style jsx global>{`
        @keyframes flipLeafForward {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(-180deg);
          }
        }
        @keyframes flipLeafBackward {
          0% {
            transform: rotateY(-180deg);
          }
          100% {
            transform: rotateY(0deg);
          }
        }
      `}</style>
    </div>
  );
}
