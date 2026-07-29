"use client";

import { useEffect, useRef } from "react";

// Progressive enhancement: the server renders content fully visible (no-JS
// and pre-hydration safe). After mount, sections still below the fold get
// hidden and fade up when scrolled into view.
export default function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.getBoundingClientRect().top <= window.innerHeight * 0.95) return;

    el.classList.add("reveal");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("reveal-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full flex flex-col items-center">
      {children}
    </div>
  );
}
