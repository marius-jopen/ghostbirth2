"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LangContext";
import styles from "./Gallery.module.css";

gsap.registerPlugin(ScrollTrigger);

const images = [
  "Cinema_01_14_36_24-1.jpeg",
  "Coffee_01_02_18_16-1.jpeg",
  "Coffee_01_02_18_16-2.jpeg",
  "Graveyard_01_10_52_02.jpeg",
  "Graveyard_01_11_20_03-2.jpeg",
  "Graveyard_01_11_20_03.jpeg",
  "Graveyard_01_11_22_02.jpeg",
  "Graveyard_01_11_22_16-4.jpeg",
  "Graveyard_01_11_26_02.jpeg",
  "Graveyard_01_11_28_13-11.jpeg",
  "Massage_02_16_38_14.jpeg",
  "Massage_02_16_42_15.jpeg",
  "Massage_02_26_19_02-1.jpeg",
  "Massage_02_26_19_02.jpeg",
  "Restaurant_01_13_52_14-3.jpeg",
  "Restaurant_01_17_48_11.jpeg",
  "Temple_01_01_19_09.jpeg",
  "Temple_01_01_20_15.jpeg",
  "Temple_01_08_49_18-6.jpeg",
  "Temple_01_10_01_23-3.jpeg",
  "Temple_01_28_31_22.jpeg",
];

const DESKTOP_INITIAL = 9;
const DESKTOP_MORE = 6;
const MOBILE_INITIAL = 6;
const MOBILE_MORE = 3;
const MOBILE_BREAKPOINT = 768;

function getIsMobile() {
  return typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;
}

export default function Gallery() {
  const { t } = useLang();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleCount, setVisibleCount] = useState(DESKTOP_INITIAL);

  useEffect(() => {
    const mobile = getIsMobile();
    setIsMobile(mobile);
    setVisibleCount(mobile ? MOBILE_INITIAL : DESKTOP_INITIAL);
  }, []);
  const [showControls, setShowControls] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const animatedCount = useRef(0);

  const visibleImages = images.slice(0, visibleCount);
  const hasMore = visibleCount < images.length;

  useEffect(() => {
    if (!gridRef.current) return;
    const cells = Array.from(gridRef.current.children);
    const newCells = cells.slice(animatedCount.current);
    if (newCells.length === 0) return;

    const isFirst = animatedCount.current === 0;
    animatedCount.current = cells.length;

    gsap.set(newCells, { opacity: 0, y: 30 });

    const animate = () => {
      gsap.to(newCells, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
      });
    };

    if (isFirst) {
      // Use ScrollTrigger for first batch, but with a fallback
      const st = ScrollTrigger.create({
        trigger: gridRef.current,
        start: "top 90%",
        once: true,
        onEnter: animate,
      });
      // Fallback: if not triggered after 4s, animate anyway
      const fallback = setTimeout(() => {
        if (newCells[0] && getComputedStyle(newCells[0]).opacity === "0") {
          animate();
        }
      }, 4000);
      return () => {
        st.kill();
        clearTimeout(fallback);
      };
    } else {
      animate();
    }
  }, [visibleCount]);

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(
    () =>
      setLightbox((i) =>
        i !== null ? (i - 1 + images.length) % images.length : null
      ),
    []
  );
  const next = useCallback(
    () =>
      setLightbox((i) => (i !== null ? (i + 1) % images.length : null)),
    []
  );

  const onMouseMove = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 2000);
  }, []);

  useEffect(() => {
    if (lightbox === null) {
      setShowControls(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [lightbox, close, prev, next]);

  const controlsClass = `${styles.lightboxControls} ${
    showControls ? styles.lightboxControlsVisible : ""
  }`;

  return (
    <section id="gallery" className={styles.section}>
      <h2 className="section-title">{t.gallery.title}</h2>
      <div className={styles.grid} ref={gridRef}>
        {visibleImages.map((src, i) => (
          <button
            key={src}
            className={styles.cell}
            onClick={() => setLightbox(i)}
            aria-label={`Open image ${i + 1}`}
          >
            <Image
              src={`/images/${src}`}
              alt=""
              width={600}
              height={400}
              loading="lazy"
              className={styles.image}
            />
          </button>
        ))}
      </div>
      {hasMore && (
        <button
          className={`pill-btn ${styles.loadMore}`}
          onClick={() => setVisibleCount((c) => Math.min(c + (isMobile ? MOBILE_MORE : DESKTOP_MORE), images.length))}
        >
          {t.gallery.loadMore}
        </button>
      )}

      {lightbox !== null && (
        <div
          className={`${styles.lightbox} ${showControls ? styles.lightboxActive : ""}`}
          onClick={close}
          onMouseMove={onMouseMove}
          onTouchStart={onMouseMove}
        >
          <div className={`${controlsClass} ${styles.lightboxBar}`}>
            <button
              className={styles.lightboxBtn}
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              className={styles.lightboxBtn}
              onClick={close}
              aria-label="Close lightbox"
            >
              ✕
            </button>
            <button
              className={styles.lightboxBtn}
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next image"
            >
              →
            </button>
          </div>
          <Image
            src={`/images/${images[lightbox]}`}
            alt=""
            fill
            className={styles.lightboxImage}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
