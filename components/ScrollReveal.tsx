"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({
  children,
  delay = 0,
  auto = false,
}: {
  children: React.ReactNode;
  delay?: number;
  auto?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: 40 });

    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      delay,
      ease: "power3.out",
      scrollTrigger: auto
        ? undefined
        : {
            trigger: el,
            start: "top 85%",
            once: true,
          },
    });

    return () => {
      tween.kill();
    };
  }, [delay, auto]);

  return <div ref={ref}>{children}</div>;
}
