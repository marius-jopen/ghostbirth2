import styles from "./VideoBreak.module.css";

export default function VideoBreak2() {
  return (
    <section className={styles.wrapper}>
      <video
        className={styles.video}
        src="/video-2.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
    </section>
  );
}
