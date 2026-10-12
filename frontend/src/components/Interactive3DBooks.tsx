"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Star, Flame } from "lucide-react";

interface Interactive3DBooksProps {
  onOpenPreview: (bookId: "ca-foundation" | "cseet") => void;
}

export function Interactive3DBooks({ onOpenPreview }: Interactive3DBooksProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // 3D physics state with smooth damping
  const targetRotation = useRef({ x: 0, y: 0, z: 0 });
  const currentRotation = useRef({ x: 0, y: 0, z: 0 });
  const [displayTransform, setDisplayTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    floatY: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
  });

  const lastInteractionTime = useRef<number>(0);
  const animFrameId = useRef<number | null>(null);

  // Mouse / Touch Tracking Handler
  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    // Normalized coordinates (-1 to +1 from center of container)
    const normX = Math.max(-1, Math.min(1, ((clientX - rect.left) / rect.width) * 2 - 1));
    const normY = Math.max(-1, Math.min(1, ((clientY - rect.top) / rect.height) * 2 - 1));

    // Subtle, realistic physical tilt angles (keeps books sharp and grounded)
    const maxRotY = 9; // Max 9 degrees turn
    const maxRotX = 7; // Max 7 degrees tilt

    targetRotation.current = {
      x: -normY * maxRotX,
      y: normX * maxRotY,
      z: normX * 1.5,
    };

    lastInteractionTime.current = performance.now();
  }, []);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handlePointerMove(e.clientX, e.clientY);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    targetRotation.current = { x: 0, y: 0, z: 0 };
  };

  // Continuous 60fps Physics & Smooth Damping (Lerp) Loop
  useEffect(() => {
    let startTime = performance.now();

    const loop = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const timeSinceInteraction = currentTime - lastInteractionTime.current;

      // When user is not interacting, add subtle, elegant breathing float
      const isIdle = timeSinceInteraction > 1500;
      const floatSine = Math.sin(elapsed * 0.0018);
      const floatCos = Math.cos(elapsed * 0.0014);

      let targetX = targetRotation.current.x;
      let targetY = targetRotation.current.y;
      let targetZ = targetRotation.current.z;

      if (isIdle) {
        // Ultra-subtle idle breathing
        targetX += floatCos * 1.8;
        targetY += floatSine * 2.2;
        targetZ += floatSine * 0.6;
      }

      // Smooth damping (lerp factor 0.065 for weighted, realistic physical motion)
      const lerp = 0.065;
      currentRotation.current.x += (targetX - currentRotation.current.x) * lerp;
      currentRotation.current.y += (targetY - currentRotation.current.y) * lerp;
      currentRotation.current.z += (targetZ - currentRotation.current.z) * lerp;

      const floatY = floatSine * 4.5;

      // Realistic shadow shift opposite to light/tilt
      const shadowOffsetX = -currentRotation.current.y * 1.4;
      const shadowOffsetY = currentRotation.current.x * 1.2;

      setDisplayTransform({
        rotateX: currentRotation.current.x,
        rotateY: currentRotation.current.y,
        rotateZ: currentRotation.current.z,
        floatY,
        shadowOffsetX,
        shadowOffsetY,
      });

      animFrameId.current = requestAnimationFrame(loop);
    };

    animFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full max-w-[500px] flex items-center justify-center">
      {/* 3D Interactive Stage Canvas */}
      <div
        ref={containerRef}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handlePointerLeave}
        onClick={() => onOpenPreview("ca-foundation")}
        className="relative w-full aspect-[1/0.95] flex items-center justify-center select-none cursor-pointer"
        style={{
          perspective: "1600px",
        }}
        title="Click to preview free sample chapter"
      >
        {/* Soft Ambient Studio Lighting Glow */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none -z-20 blur-3xl opacity-35"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(0, 90, 156, 0.22) 0%, rgba(174, 215, 233, 0.15) 50%, transparent 75%)",
          }}
        />

        {/* Realistic Physical Ground Shadow */}
        <div
          className="absolute bottom-3 w-[82%] h-14 rounded-[100%] pointer-events-none -z-10 blur-xl opacity-40 transition-transform duration-300"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(10, 25, 47, 0.6) 0%, rgba(0, 90, 156, 0.2) 50%, transparent 80%)",
            transform: `translate(${displayTransform.shadowOffsetX}px, ${displayTransform.shadowOffsetY}px) scale(${isHovered ? 1.05 : 1.0})`,
          }}
        />

        {/* ========================================================= */}
        {/* MAIN 3D BOOKS CONTAINER: RAZOR SHARP & PERFECTLY DEFINED  */}
        {/* ========================================================= */}
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: `
              translateY(${displayTransform.floatY}px)
              rotateX(${displayTransform.rotateX}deg)
              rotateY(${displayTransform.rotateY}deg)
              rotateZ(${displayTransform.rotateZ}deg)
              scale(${isHovered ? 1.025 : 1.0})
            `,
          }}
        >
          {/* Razor-Sharp 32-bit RGBA Books Layer */}
          <div
            className="relative w-[92%] h-[92%] select-none pointer-events-auto"
            style={{
              transformStyle: "preserve-3d",
              filter: `
                drop-shadow(0 22px 28px rgba(10, 25, 47, 0.18))
                drop-shadow(0 6px 10px rgba(0, 90, 156, 0.12))
              `,
            }}
          >
            <Image
              src="/assets/ca-cs-hero-books-sharp.png"
              alt="The Law Kaksha CA Foundation & CSEET Study Codices"
              fill
              className="object-contain"
              priority
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
            />
          </div>

          {/* ======================================================= */}
          {/* CLEAN, ELEGANT 3D FLOATING BADGES (NO DISTRACTING PILLS) */}
          {/* ======================================================= */}

          {/* Top-Left Badge: "Popular Resource" */}
          <div
            className="absolute top-6 left-0 sm:left-2 z-20 pointer-events-none transition-transform duration-200"
            style={{
              transform: `translateZ(45px) rotateX(${-displayTransform.rotateX * 0.2}deg) rotateY(${-displayTransform.rotateY * 0.2}deg)`,
            }}
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#DBEAFE] text-[#005A9C] text-xs font-bold shadow-[0_6px_16px_rgba(0,90,156,0.12)]">
              <Flame className="w-3.5 h-3.5 text-[#005A9C] fill-[#005A9C]" />
              <span>Popular Resource</span>
            </div>
          </div>

          {/* Bottom-Right Badge: "4.8 Rating" */}
          <div
            className="absolute bottom-8 right-2 sm:right-6 z-20 pointer-events-none transition-transform duration-200"
            style={{
              transform: `translateZ(55px) rotateX(${-displayTransform.rotateX * 0.2}deg) rotateY(${-displayTransform.rotateY * 0.2}deg)`,
            }}
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#DBEAFE] text-[#0A192F] text-xs font-bold shadow-[0_6px_18px_rgba(10,25,47,0.12)]">
              <Star className="w-3.5 h-3.5 fill-[#005A9C] text-[#005A9C]" />
              <span>4.8 Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
