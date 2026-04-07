import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
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
        <h1 className={styles.title}>Ghostbirth 2</h1>
        <p className={styles.subtitle}>A film by Marius Jopen</p>
      </div>
      <a href="#logline" className={styles.scroll} aria-label="Scroll down">
        ↓
      </a>
    </section>
  );
}
