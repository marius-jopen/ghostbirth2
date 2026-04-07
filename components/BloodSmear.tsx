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

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const pageHeight = document.documentElement.scrollHeight;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = window.innerWidth * dpr;
      canvas.height = pageHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${pageHeight}px`;
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.putImageData(imageData, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const observer = new MutationObserver(resize);
    observer.observe(document.body, { childList: true, subtree: true });

    // When scrolling, break the line so no strokes happen during scroll
    const onScroll = () => {
      isScrolling = true;
      hasPrev = false;
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        isScrolling = false;
      }, 150);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isScrolling) return;

      const x = e.clientX;
      const y = e.clientY + window.scrollY;

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

      // Thicker when slow, thinner when fast — smoothly interpolated
      const targetThickness = Math.max(1, Math.min(40, 300 / (dist + 3)));
      // Jump to thickness more aggressively — less smoothing for splattery feel
      currentThickness += (targetThickness - currentThickness) * 0.7;

      // Main smear stroke
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "#ff0000";
      ctx.lineWidth = currentThickness;
      ctx.stroke();

      // Sprinkles — tiny dots scattered along the path
      if (dist > 8) {
        const sprinkleCount = Math.floor(dist / 6);
        for (let i = 0; i < sprinkleCount; i++) {
          const t = Math.random();
          const spread = currentThickness * 2 + dist * 0.3;
          const sx = prevX + dx * t + (Math.random() - 0.5) * spread;
          const sy = prevY + dy * t + (Math.random() - 0.5) * spread;
          const sr = Math.random() * 1.5 + 0.5;
          ctx.beginPath();
          ctx.arc(sx, sy, sr, 0, Math.PI * 2);
          ctx.fillStyle = "#ff0000";
          ctx.fill();
        }
      }

      // Medium splashes on moderate speed
      if (dist > 20 && Math.random() > 0.5) {
        const splats = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < splats; i++) {
          const sx = x + (Math.random() - 0.5) * dist * 1.2;
          const sy = y + (Math.random() - 0.5) * dist * 1.2;
          const sr = Math.random() * 5 + 2;
          ctx.beginPath();
          ctx.arc(sx, sy, sr, 0, Math.PI * 2);
          ctx.fillStyle = "#ff0000";
          ctx.fill();
        }
      }

      // Big splashes on fast movement
      if (dist > 50 && Math.random() > 0.4) {
        const bigSplats = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < bigSplats; i++) {
          const sx = x + (Math.random() - 0.5) * dist * 1.5;
          const sy = y + (Math.random() - 0.5) * dist * 1.5;
          const sr = Math.random() * 12 + 5;
          ctx.beginPath();
          ctx.arc(sx, sy, sr, 0, Math.PI * 2);
          ctx.fillStyle = "#ff0000";
          ctx.fill();
          // Sprinkles around big splashes
          for (let j = 0; j < 8; j++) {
            const px = sx + (Math.random() - 0.5) * sr * 4;
            const py = sy + (Math.random() - 0.5) * sr * 4;
            const pr = Math.random() * 1.5 + 0.3;
            ctx.beginPath();
            ctx.arc(px, py, pr, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      prevX = x;
      prevY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      observer.disconnect();
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
