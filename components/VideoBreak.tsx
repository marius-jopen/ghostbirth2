"use client";

import { useRef, useEffect } from "react";
import Hls from "hls.js";

type VideoBreakContent = {
  src: string | null;
  label: string;
};

export default function VideoBreak({ video }: { video: VideoBreakContent }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const src = video.src || "";

  useEffect(() => {
    if (!src) return;
    const videoEl = videoRef.current;
    if (!videoEl) return;

    let hls: Hls | null = null;
    let looping = false;

    const safePlay = () => {
      const p = videoEl.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {});
      }
    };

    const forceLoop = () => {
      if (looping) return;
      if (videoEl.ended || (videoEl.duration && videoEl.currentTime >= videoEl.duration - 0.5)) {
        looping = true;
        videoEl.currentTime = 0;
        safePlay();
        setTimeout(() => { looping = false; }, 200);
      }
    };

    videoEl.addEventListener("ended", forceLoop);
    videoEl.addEventListener("timeupdate", forceLoop);

    if (src.endsWith(".m3u8") && Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoEl);
      hls.on(Hls.Events.MANIFEST_PARSED, safePlay);
    } else {
      videoEl.src = src;
    }

    return () => {
      videoEl.removeEventListener("ended", forceLoop);
      videoEl.removeEventListener("timeupdate", forceLoop);
      if (hls) hls.destroy();
    };
  }, [src]);

  const isPlaceholder = !src;

  return (
    <section className={`video-break ${isPlaceholder ? "placeholder-red" : ""}`}>
      {!isPlaceholder && (
        <video ref={videoRef} autoPlay loop muted playsInline />
      )}
      {isPlaceholder ? (
        <span className="ph-label">VIDEO · {video.label || "PLACEHOLDER"}</span>
      ) : (
        <span className="vlabel">{video.label}</span>
      )}
    </section>
  );
}
