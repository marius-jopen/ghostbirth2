"use client";

import { useRef, useState, useEffect } from "react";
import Hls from "hls.js";
import { useLang } from "./LangContext";
import styles from "./VideoBreak.module.css";

export default function VideoBreak({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onEnded = () => {
      video.currentTime = 0;
      video.play();
    };
    video.addEventListener("ended", onEnded);

    if (src.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
        return () => {
          hls.destroy();
          video.removeEventListener("ended", onEnded);
        };
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      }
    } else {
      video.src = src;
    }

    return () => video.removeEventListener("ended", onEnded);
  }, [src]);

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
