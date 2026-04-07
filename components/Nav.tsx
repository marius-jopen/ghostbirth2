"use client";

import { useState, useEffect } from "react";
import { useLang } from "./LangContext";
import styles from "./Nav.module.css";

const linkKeys = [
  { key: "about" as const, href: "#about" },
  { key: "story" as const, href: "#story" },
  { key: "director" as const, href: "#director" },
  { key: "gallery" as const, href: "#gallery" },
  { key: "contact" as const, href: "#contact" },
];

export default function Nav() {
  const [visible, setVisible] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${visible ? styles.visible : ""}`}>
      {linkKeys.map((link) => (
        <a key={link.href} href={link.href} className={styles.link}>
          {t.nav[link.key]}
        </a>
      ))}
    </nav>
  );
}
