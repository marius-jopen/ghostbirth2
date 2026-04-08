"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { useLang } from "./LangContext";
import styles from "./Hero.module.css";

const HERO_VIDEO_SRC = "https://vz-39ea9c43-53e.b-cdn.net/0c3afd0d-893b-475b-83a8-f839ce86af70/playlist.m3u8";

function getTargetHeight() {
  const w = window.innerWidth;
  const ratio = w >= 768 ? 10 / 20 : 3 / 4;
  return w * ratio;
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [settled, setSettled] = useState(false);
  const { t } = useLang();

  // Setup HLS for hero video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(HERO_VIDEO_SRC);
      hls.attachMedia(video);
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HERO_VIDEO_SRC;
    }
  }, []);

  // Set initial height for intro
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    el.style.height = `${window.innerHeight}px`;
    document.body.classList.add("ready");
  }, []);

  // Dismiss timer and listeners
  useEffect(() => {
    const dismiss = () => setSettled(true);

    const timer = setTimeout(dismiss, 2500);
    window.addEventListener("scroll", dismiss, { once: true });
    window.addEventListener("click", dismiss, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", dismiss);
      window.removeEventListener("click", dismiss);
    };
  }, []);

  // Transition from intro to header
  useEffect(() => {
    if (!settled) return;
    const el = heroRef.current;
    if (!el) return;

    const targetH = getTargetHeight();
    el.style.transition = "height 1.2s ease";
    el.style.height = `${targetH}px`;

    const onEnd = () => {
      el.style.transition = "";
      el.style.height = "";
      el.style.aspectRatio = window.innerWidth >= 768 ? "20 / 10" : "4 / 3";
    };
    el.addEventListener("transitionend", onEnd, { once: true });

    return () => el.removeEventListener("transitionend", onEnd);
  }, [settled]);

  return (
    <section ref={heroRef} className={styles.hero}>
      {/* Poster image for intro */}
      <Image
        src="https://ghostbirth2.b-cdn.net/poster-background.jpg"
        alt=""
        fill
        priority
        className={`${styles.background} ${styles.poster} ${settled ? styles.posterHidden : ""}`}
      />

      {/* Video for after transition */}
      <video
        ref={videoRef}
        className={`${styles.background} ${styles.video} ${settled ? styles.videoVisible : ""}`}
        autoPlay
        loop
        muted
        playsInline
      />

      <div className={styles.content}>
        <h1 ref={titleRef} className={styles.title}>
          {t.hero.title}
        </h1>
        <p ref={subtitleRef} className={styles.subtitle}>
          {t.hero.subtitle}
        </p>
      </div>

    </section>
  );
}
