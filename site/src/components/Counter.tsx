"use client";

import { useRef, useState, useEffect } from "react";

interface CounterProps {
  target: number;
  suffix?: string;
  duration?: number;
}

export default function Counter({
  target,
  suffix = "%",
  duration = 1400,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let frameId: number;
    if (prefersReduced) {
      frameId = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(frameId);
    }
    const start = performance.now();
    function step(ts: number) {
      const elapsed = ts - start;
      const pct = Math.min(elapsed / duration, 1);
      setValue(Math.round(pct * target));
      if (pct < 1) frameId = requestAnimationFrame(step);
    }
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [started, target, duration]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}
