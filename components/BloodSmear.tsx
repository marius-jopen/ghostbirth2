"use client";

import { useEffect, useRef } from "react";
import styles from "./BloodSmear.module.css";

export default function BloodSmear() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let prevX = 0;
    let prevY = 0;
    let currentThickness = 10;
    let hasPrev = false;
    let isScrolling = false;
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    let pendingDraw: { x: number; y: number } | null = null;
    let rafId: number | null = null;
    let currentHeight = 0;

    const setCanvasSize = () => {
      const w = window.innerWidth;
      const h = document.documentElement.scrollHeight;
      if (canvas.width === w && currentHeight === h) return;
      // Only grow, never shrink (preserves drawings)
      const newH = Math.max(h, currentHeight);
      if (canvas.width !== w || canvas.height !== newH) {
        const temp = document.createElement("canvas");
        temp.width = canvas.width;
        temp.height = canvas.height;
        temp.getContext("2d")?.drawImage(canvas, 0, 0);
        canvas.width = w;
        canvas.height = newH;
        ctx.drawImage(temp, 0, 0);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
      canvas.style.width = `${w}px`;
      canvas.style.height = `${newH}px`;
      currentHeight = newH;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Check page height periodically (cheap, no MutationObserver)
    const heightCheck = setInterval(setCanvasSize, 2000);

    const onScroll = () => {
      isScrolling = true;
      hasPrev = false;
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => { isScrolling = false; }, 100);
    };

    const draw = () => {
      rafId = null;
      if (!pendingDraw) return;
      const x = pendingDraw.x;
      const y = pendingDraw.y;
      pendingDraw = null;

      if (!hasPrev) {
        prevX = x;
        prevY = y;
        hasPrev = true;
        return;
      }

      const dx = x - prevX;
      const dy = y - prevY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 2) return;

      const targetThickness = Math.max(1, Math.min(40, 300 / (dist + 3)));
      currentThickness += (targetThickness - currentThickness) * 0.7;

      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "#ff0000";
      ctx.lineWidth = currentThickness;
      ctx.stroke();

      // Sprinkles
      if (dist > 12) {
        const count = Math.min(3, Math.floor(dist / 10));
        ctx.fillStyle = "#ff0000";
        for (let i = 0; i < count; i++) {
          const t = Math.random();
          const spread = currentThickness * 2 + dist * 0.3;
          const sx = prevX + dx * t + (Math.random() - 0.5) * spread;
          const sy = prevY + dy * t + (Math.random() - 0.5) * spread;
          const sr = Math.random() * 1.5 + 0.5;
          ctx.beginPath();
          ctx.arc(sx, sy, sr, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Splashes
      if (dist > 40 && Math.random() > 0.6) {
        ctx.fillStyle = "#ff0000";
        const sx = x + (Math.random() - 0.5) * dist;
        const sy = y + (Math.random() - 0.5) * dist;
        const sr = Math.random() * 8 + 3;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }

      prevX = x;
      prevY = y;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isScrolling) return;
      pendingDraw = { x: e.clientX, y: e.clientY + window.scrollY };
      if (!rafId) rafId = requestAnimationFrame(draw);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", setCanvasSize);
      clearInterval(heightCheck);
      if (scrollTimer) clearTimeout(scrollTimer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
