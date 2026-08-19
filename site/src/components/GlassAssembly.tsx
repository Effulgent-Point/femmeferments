"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
} from "framer-motion";
import Image from "next/image";
import { GLASS_PIECES } from "@/data/glassPieces";

function AssemblePiece({
  piece,
  scrollProgress,
  reducedMotion,
}: {
  piece: (typeof GLASS_PIECES)[number];
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  reducedMotion: boolean;
}) {
  const dx = piece.cx - 50;
  const dy = piece.cy - 50;

  const scatteredX = reducedMotion ? 0 : dx * 6;
  const scatteredY = reducedMotion ? 0 : dy * 4 + 80;
  const scatteredRotate = reducedMotion ? 0 : dx > 0 ? 8 : -8;

  const ref = useRef<HTMLDivElement>(null);

  const x = useTransform(scrollProgress, [0.1, 0.7], [scatteredX, 0]);
  const y = useTransform(scrollProgress, [0.1, 0.7], [scatteredY, 0]);
  const rotate = useTransform(scrollProgress, [0.1, 0.7], [scatteredRotate, 0]);
  const opacity = useTransform(
    scrollProgress,
    [0.05, 0.25],
    [reducedMotion ? 1 : 0, 1],
  );

  // framer's style applier drops non-transform values in this setup;
  // write opacity to the DOM directly
  useMotionValueEvent(opacity, "change", (v) => {
    if (ref.current) ref.current.style.opacity = String(v);
  });

  return (
    <motion.div
      ref={ref}
      className="absolute"
      style={{
        left: `${piece.left}%`,
        top: `${piece.top}%`,
        width: `${piece.w}%`,
        height: `${piece.h}%`,
        x,
        y,
        rotate,
        opacity: reducedMotion ? 1 : 0,
        willChange: "transform",
      }}
    >
      <Image
        src={`/glass-assets/tight_png/${piece.file}`}
        alt=""
        fill
        sizes={`(max-width: 768px) ${Math.round(piece.w)}vw, ${Math.round((1275 * piece.w) / 100)}px`}
        loading="lazy"
      />
    </motion.div>
  );
}

export default function GlassAssembly() {
  const reducedMotion = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end center"],
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full flex justify-center py-4 overflow-hidden"
    >
      <div
        className="relative"
        style={{
          width: "min(1275px, 100vw)",
          aspectRatio: "1275 / 945",
        }}
      >
        {GLASS_PIECES.map((piece) => (
          <AssemblePiece
            key={piece.file}
            piece={piece}
            scrollProgress={scrollYProgress}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </div>
  );
}
