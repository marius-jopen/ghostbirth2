"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./Hero.module.css";

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2 }
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        "-=0.4"
      )
      .fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 0.5, duration: 0.6 },
        "-=0.2"
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className={styles.hero}>
      <Image
        src="/poster-background.jpg"
        alt=""
        fill
        priority
        className={styles.background}
      />

      <div className={styles.content}>
        <h1 ref={titleRef} className={styles.title} style={{ opacity: 0 }}>
          Ghostbirth 2
        </h1>
        <p ref={subtitleRef} className={styles.subtitle} style={{ opacity: 0 }}>
          A film by Marius Jopen
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
