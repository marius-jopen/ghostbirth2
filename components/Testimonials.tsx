"use client";

import { useState, useEffect } from "react";
import styles from "./Testimonials.module.css";

type TestimonialItem = { quote: string; author: string };
type TestimonialsContent = {
  title: string;
  items: readonly TestimonialItem[];
};

export default function Testimonials({
  testimonials,
}: {
  testimonials: TestimonialsContent;
}) {
  const items = testimonials.items;
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % items.length);
        setVisible(true);
      }, 600);
    }, 7000);
    return () => clearInterval(interval);
  }, [items.length]);

  const current = items[index];
  if (!current) return null;

  return (
    <section className={styles.section}>
      <h2 className="section-title">{testimonials.title}</h2>
      <div className={`${styles.testimonial} ${visible ? styles.visible : styles.hidden}`}>
        <p className={styles.quote}>&ldquo;{current.quote}&rdquo;</p>
        <p className={styles.author}>&mdash; {current.author}</p>
      </div>
    </section>
  );
}
