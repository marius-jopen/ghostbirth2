"use client";

import { useState, useEffect } from "react";
import { useLang } from "./LangContext";
import styles from "./Testimonials.module.css";

const testimonials = [
  { quote: "I don't even know what this film is about but I already can't sleep.", author: "Someone on Instagram" },
  { quote: "They haven't even shot the film yet and I'm already traumatized.", author: "Newsletter reader" },
  { quote: "My therapist said I should stop visiting this website.", author: "Festival programmer, name withheld" },
];

export default function Testimonials() {
  const { t: lang } = useLang();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % testimonials.length);
        setVisible(true);
      }, 600);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const t = testimonials[index];

  return (
    <section className={styles.section}>
      <h2 className="section-title">{lang.testimonials.title}</h2>
      <div className={`${styles.testimonial} ${visible ? styles.visible : styles.hidden}`}>
        <p className={styles.quote}>&ldquo;{t.quote}&rdquo;</p>
        <p className={styles.author}>&mdash; {t.author}</p>
      </div>
    </section>
  );
}
