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

    gsap.set(el, { opacity: 0, y: 20 });

    if (auto) {
      const tween = gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay,
        ease: "power2.out",
      });
      return () => tween.kill();
    }

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      gsap.to(el, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
    };

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.95 && rect.bottom > window.innerHeight * 0.05;
      if (inView) reveal();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [delay, auto]);

  return <div ref={ref}>{children}</div>;
}
