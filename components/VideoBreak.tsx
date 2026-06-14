"use client";

import { useRef, useEffect } from "react";
import Hls from "hls.js";

type VideoBreakContent = {
  src: string | null;
  label: string;
};

export default function VideoBreak({
  video,
  fullscreen = false,
}: {
  video: VideoBreakContent;
  fullscreen?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const src = video.src || "";

  useEffect(() => {
    if (!src) return;
    const videoEl = videoRef.current;
    if (!videoEl) return;

    let hls: Hls | null = null;
    let looping = false;
    let inView = false;
    let manifestReady = false;

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
        if (inView) safePlay();
        setTimeout(() => { looping = false; }, 200);
      }
    };

    videoEl.addEventListener("ended", forceLoop);
    videoEl.addEventListener("timeupdate", forceLoop);

    const isHls = src.endsWith(".m3u8") && Hls.isSupported();
    if (isHls) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoEl);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        manifestReady = true;
        if (inView) safePlay();
      });
    } else {
      videoEl.src = src;
      manifestReady = true;
    }

    // Only decode/composite while the video is on screen. Offscreen HLS
    // videos otherwise keep the decoder hot and starve the scroll thread.
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        inView = entry.isIntersecting;
        if (inView && manifestReady) safePlay();
        else videoEl.pause();
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(videoEl);

    return () => {
      io.disconnect();
      videoEl.removeEventListener("ended", forceLoop);
      videoEl.removeEventListener("timeupdate", forceLoop);
      if (hls) hls.destroy();
    };
  }, [src]);

  const isPlaceholder = !src;

  return (
    <section
      className={`video-break${fullscreen ? " full" : ""}${
        isPlaceholder ? " placeholder-red" : ""
      }`}
    >
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
