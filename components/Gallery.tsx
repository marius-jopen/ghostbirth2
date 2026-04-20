"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { emph } from "@/lib/emph";

type GalleryContent = {
  sectionLabelNum: string;
  sectionLabel: string;
  title: string;
  facts: readonly { value: string; label: string }[];
  images: readonly string[];
};

const GAP_PX = 14;
const SLIDE_WIDTH_CAP = 860;

export default function Gallery({ gallery }: { gallery: GalleryContent }) {
  const images = gallery.images;
  const carouselRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [slideWidth, setSlideWidth] = useState(800);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      const target = w < 720 ? w * 0.8 : Math.min(SLIDE_WIDTH_CAP, w * 0.62);
      setSlideWidth(target);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const scrollToIndex = useCallback(
    (i: number, smooth = true) => {
      const el = carouselRef.current;
      if (!el) return;
      const w = slideWidth + GAP_PX;
      const viewport = el.clientWidth;
      const left = i * w - (viewport - slideWidth) / 2;
      el.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
    },
    [slideWidth]
  );

  // Keep idx synced with scroll position (user drag, wheel, trackpad)
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let tid: number | null = null;
    const onScroll = () => {
      if (tid !== null) window.cancelAnimationFrame(tid);
      tid = window.requestAnimationFrame(() => {
        const w = slideWidth + GAP_PX;
        const centerX = el.scrollLeft + el.clientWidth / 2;
        const i = Math.max(
          0,
          Math.min(images.length - 1, Math.round((centerX - slideWidth / 2) / w))
        );
        setIdx(i);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (tid !== null) window.cancelAnimationFrame(tid);
    };
  }, [slideWidth, images.length]);

  // Autoplay
  useEffect(() => {
    if (paused || images.length <= 1) return;
    const id = setInterval(() => {
      setIdx((i) => {
        const next = (i + 1) % images.length;
        scrollToIndex(next);
        return next;
      });
    }, 3800);
    return () => clearInterval(id);
  }, [paused, images.length, scrollToIndex]);

  const prev = () =>
    setIdx((i) => {
      const n = (i - 1 + images.length) % images.length;
      scrollToIndex(n);
      return n;
    });

  const next = () =>
    setIdx((i) => {
      const n = (i + 1) % images.length;
      scrollToIndex(n);
      return n;
    });

  if (images.length === 0) return null;

  return (
    <section id="gallery" className="gallery-section">
      <div className="wrap">
        <div className="section-label">
          <span className="num">{gallery.sectionLabelNum}</span>
          <span>{gallery.sectionLabel}</span>
          <span className="bar" />
        </div>
        <div className="gallery-header">
          <div style={{ maxWidth: 700 }}>
            <h2 className="big">{emph(gallery.title)}</h2>
            <div className="facts">
              {gallery.facts.map((f, i) => (
                <div className="f" key={i}>
                  <b>{f.value}</b>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="gallery-controls">
            <button className="gctrl" onClick={prev} aria-label="Previous">
              ←
            </button>
            <div className="gcounter">
              {String(idx + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </div>
            <button className="gctrl" onClick={next} aria-label="Next">
              →
            </button>
            <button
              className="gctrl"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play" : "Pause"}
            >
              {paused ? "▶" : "❚❚"}
            </button>
          </div>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className={`cslide ${!src ? "placeholder-red" : ""}`}
            style={{ width: `${slideWidth}px` }}
            onClick={() => {
              setIdx(i);
              scrollToIndex(i);
            }}
          >
            {src ? (
              <img src={src} alt="" />
            ) : (
              <span className="ph-label">IMG · {String(i + 1).padStart(2, "0")}</span>
            )}
            <div className="cmeta">
              <span>
                Frame {String(i + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </span>
              <b>BKK · 2025</b>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
