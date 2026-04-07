"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Intro.module.css";

export default function Intro() {
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFading(true), 1500);

    const dismiss = () => {
      setFading(true);
      clearTimeout(timer);
    };

    window.addEventListener("scroll", dismiss, { once: true });
    window.addEventListener("click", dismiss, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", dismiss);
      window.removeEventListener("click", dismiss);
    };
  }, []);

  useEffect(() => {
    const el = document.getElementById("site-content");
    if (!el) return;
    el.style.transform = "scale(1.03)";
    el.style.transformOrigin = "center top";
    el.style.transition = "transform 0.8s ease";
  }, []);

  useEffect(() => {
    if (!fading) return;
    const el = document.getElementById("site-content");
    if (el) el.style.transform = "scale(1)";
    const timer = setTimeout(() => {
      setGone(true);
      if (el) {
        el.style.transform = "";
        el.style.transformOrigin = "";
        el.style.transition = "";
      }
    }, 900);
    return () => clearTimeout(timer);
  }, [fading]);

  if (gone) return null;

  return (
    <div className={`${styles.intro} ${fading ? styles.fadeOut : ""}`}>
      <Image
        src="/poster.png"
        alt="Ghostbirth 2"
        width={400}
        height={600}
        priority
        className={styles.poster}
      />
    </div>
  );
}
