"use client";

import { useState, useEffect } from "react";
import styles from "./Nav.module.css";

type NavContent = {
  about: string;
  story: string;
  director: string;
  gallery: string;
  contact: string;
};

const links = [
  { key: "about" as const, href: "#about" },
  { key: "story" as const, href: "#story" },
  { key: "director" as const, href: "#director" },
  { key: "gallery" as const, href: "#gallery" },
  { key: "contact" as const, href: "#contact" },
];

export default function Nav({ nav }: { nav: NavContent }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${visible ? styles.visible : ""}`}>
      {links.map((link) => (
        <a key={link.href} href={link.href} className={styles.link}>
          {nav[link.key]}
        </a>
      ))}
    </nav>
  );
}
