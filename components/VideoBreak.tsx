"use client";

import { useRef, useState } from "react";
import { useLang } from "./LangContext";
import styles from "./VideoBreak.module.css";

export default function VideoBreak({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const { t } = useLang();

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  return (
    <section className={styles.wrapper}>
      <video
        ref={videoRef}
        className={styles.video}
        src={src}
        autoPlay
        loop
        muted
        playsInline
      />
      <button
        className={`pill-btn ${styles.soundToggle}`}
        onClick={toggleSound}
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? t.video.soundOn : t.video.soundOff}
      </button>
    </section>
  );
}
