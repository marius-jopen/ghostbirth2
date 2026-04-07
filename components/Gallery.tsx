"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import styles from "./Gallery.module.css";

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

export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(
    () =>
      setLightbox((i) => (i !== null ? (i - 1 + images.length) % images.length : null)),
    []
  );
  const next = useCallback(
    () =>
      setLightbox((i) => (i !== null ? (i + 1) % images.length : null)),
    []
  );

  useEffect(() => {
    if (lightbox === null) return;
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
    };
  }, [lightbox, close, prev, next]);

  return (
    <section className={styles.section}>
      <h2 className="section-title">Test Shoot</h2>
      <div className={styles.grid}>
        {images.map((src, i) => (
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

      {lightbox !== null && (
        <div className={styles.lightbox} onClick={close}>
          <button
            className={styles.lightboxNav}
            style={{ left: 16 }}
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous image"
          >
            ←
          </button>
          <Image
            src={`/images/${images[lightbox]}`}
            alt=""
            fill
            className={styles.lightboxImage}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className={styles.lightboxNav}
            style={{ right: 16 }}
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next image"
          >
            →
          </button>
          <button
            className={styles.lightboxClose}
            onClick={close}
            aria-label="Close lightbox"
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}
