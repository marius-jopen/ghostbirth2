"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";

function getTargetHeight() {
  const w = window.innerWidth;
  const ratio = w >= 768 ? 10 / 20 : 3 / 4;
  return w * ratio;
}

type HeroContent = {
  title: string;
  subtitle: string;
  status: string;
  posterImage: string | null;
};

export default function Hero({ hero }: { hero: HeroContent }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    el.style.height = `${window.innerHeight}px`;

    const img = el.querySelector("img");
    const show = () => document.body.classList.add("ready");

    if (img && img.complete) {
      show();
    } else if (img) {
      img.addEventListener("load", show, { once: true });
      setTimeout(show, 2000);
    } else {
      show();
    }
  }, []);

  useEffect(() => {
    const dismiss = () => setSettled(true);

    const timer = setTimeout(dismiss, 5000);
    window.addEventListener("scroll", dismiss, { once: true });
    window.addEventListener("click", dismiss, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", dismiss);
      window.removeEventListener("click", dismiss);
    };
  }, []);

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

  const posterSrc = hero.posterImage ?? "/poster-background.jpg";
  const cdnPrefix = process.env.NEXT_PUBLIC_CDN_URL || "";

  return (
    <section ref={heroRef} className={styles.hero}>
      <Image
        src={`${cdnPrefix}${posterSrc}`}
        alt=""
        fill
        priority
        className={styles.background}
      />

      <div className={styles.content}>
        <h1 className={styles.title}>{hero.title}</h1>
        <p className={styles.subtitle}>{hero.subtitle}</p>
        <p className={styles.status}>{hero.status}</p>
      </div>
    </section>
  );
}
