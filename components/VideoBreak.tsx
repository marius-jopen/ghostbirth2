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

    const forceLoop = () => {
      if (videoEl.ended || (videoEl.duration && videoEl.currentTime >= videoEl.duration - 0.5)) {
        videoEl.currentTime = 0;
        videoEl.play();
      }
    };

    videoEl.addEventListener("ended", forceLoop);
    videoEl.addEventListener("timeupdate", forceLoop);

    if (src.endsWith(".m3u8") && Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoEl);
      hls.on(Hls.Events.MANIFEST_PARSED, () => videoEl.play());
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
