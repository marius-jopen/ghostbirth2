"use client";

import { useRef, useEffect } from "react";
import Hls from "hls.js";
import styles from "./VideoBreak.module.css";

export default function VideoBreak({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    const forceLoop = () => {
      if (video.ended || (video.duration && video.currentTime >= video.duration - 0.5)) {
        video.currentTime = 0;
        video.play();
      }
    };

    video.addEventListener("ended", forceLoop);
    video.addEventListener("timeupdate", forceLoop);
    video.addEventListener("pause", () => {
      if (!video.ended) return;
      video.currentTime = 0;
      video.play();
    });

    if (src.endsWith(".m3u8") && Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
    } else {
      video.src = src;
    }

    return () => {
      video.removeEventListener("ended", forceLoop);
      video.removeEventListener("timeupdate", forceLoop);
      if (hls) hls.destroy();
    };
  }, [src]);

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
    </section>
  );
}
