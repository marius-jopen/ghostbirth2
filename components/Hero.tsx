"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLang } from "./LangContext";
import styles from "./Hero.module.css";

function getTargetHeight() {
  const w = window.innerWidth;
  // mobile: 4/3, desktop: 20/10
  const ratio = w >= 768 ? 10 / 20 : 3 / 4;
  return w * ratio;
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLAnchorElement>(null);
  const [settled, setSettled] = useState(false);
  const { t } = useLang();

  // Set initial height and animate text in (runs once)
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    el.style.height = `${window.innerHeight}px`;

    // Wait for background image to load before revealing
    let tl: gsap.core.Timeline | null = null;
    const img = el.querySelector("img");
    const reveal = () => {
      document.body.classList.add("ready");

      tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 2 }
      ).fromTo(
        subtitleRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2 },
        "-=0.6"
      );
    };

    if (img && img.complete) {
      reveal();
    } else if (img) {
      img.addEventListener("load", reveal, { once: true });
    } else {
      reveal();
    }

    return () => { if (tl) tl.kill(); };
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

  useEffect(() => {
    if (!settled) return;
    const el = heroRef.current;
    if (!el) return;

    const targetH = getTargetHeight();

    // Set aspect-ratio now so it's ready, but height override keeps control
    el.style.aspectRatio = window.innerWidth >= 768 ? "20 / 10" : "4 / 3";

    // Animate hero height
    gsap.to(el, {
      height: targetH,
      duration: 1.2,
      ease: "power2.inOut",
      onComplete: () => {
        // Remove height so aspect-ratio takes over (already matches)
        el.style.height = "";
      },
    });

    // Show scroll arrow
    gsap.set(scrollRef.current, { opacity: 0.5 });
  }, [settled]);

  return (
    <section ref={heroRef} className={styles.hero}>
      <Image
        src="/poster-background.jpg"
        alt=""
        fill
        priority
        className={styles.background}
      />

      <div className={styles.content}>
        <h1 ref={titleRef} className={styles.title} style={{ opacity: 0 }}>
          {t.hero.title}
        </h1>
        <p ref={subtitleRef} className={styles.subtitle} style={{ opacity: 0 }}>
          {t.hero.subtitle}
        </p>
      </div>
      <a
        ref={scrollRef}
        href="#logline"
        className={styles.scroll}
        aria-label="Scroll down"
        style={{ opacity: 0 }}
      >
        ↓
      </a>
    </section>
  );
}
