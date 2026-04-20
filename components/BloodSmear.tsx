"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import styles from "./BloodSmear.module.css";

export default function BloodSmear() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const disabled = pathname?.startsWith("/keystatic") ?? false;

  useEffect(() => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset on (re)mount and on route change
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
      // Measure page height with the canvas collapsed so its own size doesn't
      // feed back into document.documentElement.scrollHeight.
      const priorHeight = canvas.style.height;
      canvas.style.height = "0px";
      const h = document.documentElement.scrollHeight;
      canvas.style.height = priorHeight || "0px";
      if (canvas.width === w && currentHeight === h) return;
      // Grow during a single page; route change resets currentHeight so canvas
      // can shrink to the shorter new page.
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

    let distAccumulated = 0;
    let nextDropAt = 50 + Math.random() * 180;
    // Smear session: when active, mouse movement draws a continuous red line.
    let smearTicks = 0;
    let smearWidth = 1;
    // Track last velocity for whip/stop splatter detection.
    let lastDx = 0;
    let lastDy = 0;
    // Local accumulation grid — tracks how much blood has painted in each cell.
    // Cells with more blood spawn more and bigger drops.
    const accumulation = new Map<string, number>();
    const ACC_CELL = 40;
    const cellKey = (cx: number, cy: number) =>
      `${Math.floor(cx / ACC_CELL)},${Math.floor(cy / ACC_CELL)}`;
    const addAccumulation = (cx: number, cy: number, amount: number) => {
      const key = cellKey(cx, cy);
      accumulation.set(key, Math.min(260, (accumulation.get(key) ?? 0) + amount));
    };
    const localAccumulation = (cx: number, cy: number) =>
      accumulation.get(cellKey(cx, cy)) ?? 0;

    // Splatter burst in the cone of the cursor's momentum direction.
    const spawnSplatter = (
      cx: number,
      cy: number,
      momentumDx: number,
      momentumDy: number,
      mag: number
    ) => {
      const ux = momentumDx / mag;
      const uy = momentumDy / mag;
      // Strength grows with speed, but capped.
      const strength = Math.min(1.4, 0.4 + mag / 60);
      const count = 4 + Math.floor(Math.random() * 8 * strength);
      ctx.fillStyle = "#ff0000";
      for (let i = 0; i < count; i++) {
        const throwDist = 8 + Math.random() * 55 * strength;
        const angle = (Math.random() - 0.5) * 1.0; // ±0.5 rad cone
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const rx = ux * cosA - uy * sinA;
        const ry = ux * sinA + uy * cosA;
        const sx = cx + rx * throwDist;
        const sy = cy + ry * throwDist;
        const r = Math.random() < 0.35
          ? 0.6 + Math.random() * 1.2
          : 1.4 + Math.random() * 4 * strength;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
        addAccumulation(sx, sy, r * 1.5);
        // Bigger spatters occasionally produce a drip of their own.
        if (r > 3 && Math.random() < 0.3) {
          spawnDrip(sx, sy, r);
          ensureDripLoop();
        }
      }
    };

    type Drip = {
      x: number;
      y: number;
      vx: number;
      vxTarget: number;
      vxChangeAt: number;
      speed: number;
      accel: number;
      length: number;
      max: number;
      width: number;
      startWidth: number;
      minWidth: number;
      taperRate: number;
      nextBeadAt: number;
    };
    const drips: Drip[] = [];
    let dripRafId: number | null = null;

    const spawnDrip = (x: number, y: number, r: number) => {
      const dripRoll = Math.random();
      let max: number;
      if (r >= 10 && Math.random() < 0.5) {
        max = 220 + Math.random() * 400;                    // heavy runner
      } else if (dripRoll < 0.35) {
        max = 8 + Math.random() * 22;                        // short fade
      } else if (dripRoll < 0.85) {
        max = 35 + Math.random() * 110;
      } else {
        max = 140 + Math.random() * 240;
      }

      const speedRoll = Math.random();
      const speed =
        speedRoll < 0.35 ? 0.2 + Math.random() * 0.7
        : speedRoll < 0.85 ? 0.8 + Math.random() * 1.6
        : 2.5 + Math.random() * 2.2;

      const accel = 1.003 + Math.random() * 0.015;

      // Start as wide as the drop itself, so the drop blends into its trail.
      const startWidth = r * (1.15 + Math.random() * 0.3);
      // Variation per drip: some taper to a hair, some hold most of their thickness.
      const taperRoll = Math.random();
      const taperRate =
        taperRoll < 0.45 ? 2.4 + Math.random() * 1.2     // heavy taper
        : taperRoll < 0.8 ? 0.9 + Math.random() * 1.0    // medium
        : 0.15 + Math.random() * 0.45;                   // barely tapers
      const minWidth =
        Math.random() < 0.7
          ? 0.25 + Math.random() * 0.4                   // thin tail
          : Math.max(0.9, startWidth * (0.45 + Math.random() * 0.3)); // chunky tail

      const initialVx =
        Math.random() < 0.9
          ? (Math.random() - 0.5) * 0.16
          : (Math.random() - 0.5) * 0.5;

      drips.push({
        x,
        y,
        vx: initialVx,
        vxTarget: initialVx,
        vxChangeAt: 50 + Math.random() * 120,
        speed,
        accel,
        length: 0,
        max,
        width: startWidth,
        startWidth,
        minWidth,
        taperRate,
        nextBeadAt: max + 1,
      });
    };

    const spawnDrop = (x: number, y: number, sizeBias = 1) => {
      const roll = Math.random();
      let r: number;
      if (roll < 0.5) r = 2 + Math.random() * 3;
      else if (roll < 0.85) r = 5 + Math.random() * 5;
      else r = 10 + Math.random() * 8;
      r *= sizeBias;

      ctx.fillStyle = "#ff0000";

      // Splatter around medium/big drops
      if (r > 4 && Math.random() < 0.6) {
        const count = 1 + Math.floor(Math.random() * 4);
        for (let i = 0; i < count; i++) {
          const sr = Math.random() * 1.4 + 0.3;
          const ox = x + (Math.random() - 0.5) * r * 4.5;
          const oy = y + (Math.random() - 0.5) * r * 4.5;
          ctx.beginPath();
          ctx.arc(ox, oy, sr, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const dripChance = Math.min(0.95, 0.15 + r * 0.07);
      const willDrip = Math.random() < dripChance;

      if (!willDrip) {
        // Static drop: draw its circle and stop
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        return;
      }

      // Dripping: skip the initial circle, the drip's wide tip becomes the drop head
      const dripCount = r > 8 && Math.random() < 0.22 ? 2 : 1;
      for (let i = 0; i < dripCount; i++) {
        const ox = dripCount === 1 ? 0 : (i === 0 ? -1 : 1) * (r * 0.35);
        spawnDrip(x + ox, y, r * (dripCount === 1 ? 1 : 0.75));
      }
      ensureDripLoop();
    };

    const animateDrips = () => {
      if (drips.length === 0) {
        dripRafId = null;
        return;
      }
      ctx.strokeStyle = "#ff0000";
      ctx.fillStyle = "#ff0000";
      ctx.lineCap = "round";
      for (let i = drips.length - 1; i >= 0; i--) {
        const d = drips[i];

        // Very subtle lateral drift — most stay essentially vertical.
        if (d.length >= d.vxChangeAt) {
          d.vxTarget =
            Math.random() < 0.85
              ? (Math.random() - 0.5) * 0.25 // tiny wobble
              : (Math.random() - 0.5) * 0.6; // occasional small lean
          d.vxChangeAt += 40 + Math.random() * 120;
        }
        d.vx += (d.vxTarget - d.vx) * 0.04;

        const newX = d.x + d.vx;
        const newY = d.y + d.speed;

        ctx.beginPath();
        ctx.lineWidth = d.width;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(newX, newY);
        ctx.stroke();

        d.x = newX;
        d.y = newY;
        d.length += d.speed;

        // Natural exponential taper from startWidth → minWidth. No end bulge.
        // taperRate varies per drip: heavy → almost vanishes, light → stays thick.
        const progress = d.length / d.max;
        const taper = Math.exp(-progress * d.taperRate);
        const base = d.minWidth + (d.startWidth - d.minWidth) * taper;
        // Per-frame liquid noise
        d.width = Math.max(0.2, base * (0.88 + Math.random() * 0.2));

        d.speed = Math.min(6, d.speed * d.accel);

        if (d.length >= d.max) {
          drips.splice(i, 1);
        }
      }
      dripRafId = requestAnimationFrame(animateDrips);
    };

    const ensureDripLoop = () => {
      if (dripRafId === null) dripRafId = requestAnimationFrame(animateDrips);
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
      const px = prevX;
      const py = prevY;
      prevX = x;
      prevY = y;
      if (dist < 1) return;

      // Whip / stop splatter: a rapid move followed by a direction flip or
      // sudden deceleration sheds blood off the cursor.
      const lastMag = Math.hypot(lastDx, lastDy);
      if (lastMag > 18) {
        let triggered = false;
        if (dist > 3) {
          const dot = (dx * lastDx + dy * lastDy) / (dist * lastMag);
          if (dot < 0.25) triggered = true; // angle wider than ~75°
        } else {
          triggered = true; // sudden stop
        }
        if (triggered) {
          spawnSplatter(x, y, lastDx, lastDy, lastMag);
        }
      }
      lastDx = dx;
      lastDy = dy;

      // Fast move: paint nothing (the cursor moved too quickly for blood to transfer).
      if (dist > 40) return;

      // Continuous paint stroke — like the original: thickness inversely related
      // to speed (slow = thick, fast = thin), with sprinkles and splashes.
      const targetThickness = Math.max(1, Math.min(40, 300 / (dist + 3)));
      currentThickness += (targetThickness - currentThickness) * 0.7;

      ctx.strokeStyle = "#ff0000";
      ctx.fillStyle = "#ff0000";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.lineWidth = currentThickness;
      ctx.moveTo(px, py);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Track accumulation along the stroke so repeat passes build up.
      addAccumulation(x, y, currentThickness * 0.35 + dist * 0.05);

      // Sprinkles along the stroke
      if (dist > 12) {
        const count = Math.min(3, Math.floor(dist / 10));
        for (let i = 0; i < count; i++) {
          const t = Math.random();
          const spread = currentThickness * 2 + dist * 0.3;
          const sx = px + dx * t + (Math.random() - 0.5) * spread;
          const sy = py + dy * t + (Math.random() - 0.5) * spread;
          const sr = Math.random() * 1.5 + 0.5;
          ctx.beginPath();
          ctx.arc(sx, sy, sr, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Splashes on fast flicks
      if (dist > 40 && Math.random() > 0.6) {
        const sx = x + (Math.random() - 0.5) * dist;
        const sy = y + (Math.random() - 0.5) * dist;
        const sr = Math.random() * 8 + 3;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Brief smear session thickens the stroke for a few frames
      if (smearTicks <= 0) {
        const smearChance = dist > 30 ? 0.08 : dist > 14 ? 0.02 : 0.003;
        if (Math.random() < smearChance) {
          smearTicks = 3 + Math.floor(Math.random() * 8);
          smearWidth = currentThickness + 1 + Math.random() * 3;
        }
      }
      if (smearTicks > 0) {
        ctx.beginPath();
        ctx.lineWidth = Math.max(0.5, smearWidth * (0.8 + Math.random() * 0.4));
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
        smearTicks--;
        smearWidth *= 0.92;
      }

      // Occasional drops that drip downward, biased by local blood accumulation.
      const weight = localAccumulation(x, y);
      const frequencyScale = 1 / (1 + weight * 0.025); // high weight → drop sooner
      const sizeBias = Math.min(2.5, 1 + weight * 0.012); // high weight → bigger
      distAccumulated += dist;
      while (distAccumulated >= nextDropAt * frequencyScale) {
        distAccumulated -= nextDropAt * frequencyScale;
        spawnDrop(
          x + (Math.random() - 0.5) * 20,
          y + (Math.random() - 0.5) * 14,
          sizeBias
        );
        nextDropAt = 80 + Math.random() * 260;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isScrolling) return;
      pendingDraw = { x: e.clientX, y: e.clientY + window.scrollY };
      if (!rafId) rafId = requestAnimationFrame(draw);
    };

    let prevTouchClientX = 0;
    let prevTouchClientY = 0;
    let hasTouchPrev = false;

    const drawDrop = (x: number, y: number) => {
      const size = Math.random() * 10 + 4;
      ctx.fillStyle = "#ff0000";
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      const count = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < count; i++) {
        const ox = x + (Math.random() - 0.5) * size * 4;
        const oy = y + (Math.random() - 0.5) * size * 4;
        const sr = Math.random() * 2 + 0.5;
        ctx.beginPath();
        ctx.arc(ox, oy, sr, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      const cx = touch.clientX;
      const cy = touch.clientY;
      const x = cx;
      const y = cy + window.scrollY;

      if (!hasTouchPrev) {
        prevTouchClientX = cx;
        prevTouchClientY = cy;
        prevX = x;
        prevY = y;
        hasTouchPrev = true;
        hasPrev = true;
        return;
      }

      const dxClient = Math.abs(cx - prevTouchClientX);
      const dyClient = Math.abs(cy - prevTouchClientY);

      prevTouchClientX = cx;
      prevTouchClientY = cy;

      // Mostly vertical = scrolling → drop a blood droplet occasionally
      if (dyClient > dxClient * 3 && dxClient < 8) {
        if (Math.random() > 0.85) {
          drawDrop(x + (Math.random() - 0.5) * 30, y);
        }
        prevX = x;
        prevY = y;
        return;
      }

      // Horizontal or diagonal = intentional painting → draw stroke
      pendingDraw = { x, y };
      if (!rafId) rafId = requestAnimationFrame(draw);
    };

    const onTouchEnd = () => {
      hasPrev = false;
      hasTouchPrev = false;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", setCanvasSize);
      clearInterval(heightCheck);
      if (scrollTimer) clearTimeout(scrollTimer);
      if (rafId) cancelAnimationFrame(rafId);
      if (dripRafId !== null) cancelAnimationFrame(dripRafId);
    };
  }, [pathname, disabled]);

  if (disabled) return null;
  return <canvas ref={canvasRef} className={styles.canvas} />;
}
