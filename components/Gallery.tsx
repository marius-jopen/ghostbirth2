"use client";

import { useRef, useState, useEffect, useCallback } from "react";
// @ts-expect-error — splide react types export issue
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide-core.min.css";
import { useLang } from "./LangContext";
import styles from "./Gallery.module.css";

export default function Gallery({ images }: { images: string[] }) {
  const { t } = useLang();
  const splideRef = useRef<Splide>(null);
  const lightboxRef = useRef<Splide>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);

  const openLightbox = useCallback(() => {
    const idx = splideRef.current?.splide?.index ?? 0;
    setLightbox(idx);
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    // Sync lightbox to the clicked slide
    setTimeout(() => {
      lightboxRef.current?.go(lightbox);
    }, 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") lightboxRef.current?.go("<");
      if (e.key === "ArrowRight") lightboxRef.current?.go(">");
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, close]);

  return (
    <section id="gallery" className={styles.section}>
      <h2 className="section-title">{t.gallery.title}</h2>
      <p className={styles.description}>{t.gallery.description}</p>

      {/* Inline multi-slide slider */}
      <div className={styles.sliderWrap}>
        <Splide
          ref={splideRef}
          options={{
            type: "slide",
            rewind: true,
            autoWidth: true,
            fixedHeight: "60vh",
            gap: 8,
            pagination: false,
            arrows: false,
            drag: true,
            breakpoints: {
              768: {
                fixedHeight: "25vh",
                gap: 4,
              },
            },
          }}
          className={styles.slider}
        >
          {images.map((src) => (
            <SplideSlide key={src}>
              <img
                src={`https://ghostbirth2.b-cdn.net/bts/${src}`}
                alt=""
                className={styles.image}
                loading="lazy"
                onClick={openLightbox}
              />
            </SplideSlide>
          ))}
        </Splide>
      </div>

      <div className={styles.navBar}>
        <button
          className={styles.navBtn}
          onClick={() => splideRef.current?.go("<")}
          aria-label="Previous"
        >
          ←
        </button>
        <button
          className={styles.navBtn}
          onClick={() => splideRef.current?.go(">")}
          aria-label="Next"
        >
          →
        </button>
      </div>

      {/* Fullscreen lightbox */}
      {lightbox !== null && (
        <div className={styles.lightbox}>
          <div className={styles.lightboxOverlay} onClick={close} />
          <Splide
            ref={lightboxRef}
            options={{
              type: "fade",
              rewind: true,
              pagination: false,
              arrows: false,
              drag: true,
              start: lightbox,
            }}
            className={styles.lightboxSlider}
          >
            {images.map((src) => (
              <SplideSlide key={src}>
                <div className={styles.lightboxSlide}>
                  <img
                    src={`https://ghostbirth2.b-cdn.net/bts/${src}`}
                    alt=""
                    className={styles.lightboxImage}
                  />
                </div>
              </SplideSlide>
            ))}
          </Splide>
          <div className={styles.lightboxNav}>
            <button
              className={styles.lightboxBtn}
              onClick={() => lightboxRef.current?.go("<")}
            >
              ←
            </button>
            <button className={styles.lightboxBtn} onClick={close}>
              ✕
            </button>
            <button
              className={styles.lightboxBtn}
              onClick={() => lightboxRef.current?.go(">")}
            >
              →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
