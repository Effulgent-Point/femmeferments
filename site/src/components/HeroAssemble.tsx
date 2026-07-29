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
import { GLASS_PIECES, CENTER_PIECE_FILES } from "@/data/glassPieces";

function AssemblingPiece({
  piece,
  scrollYProgress,
  reducedMotion,
}: {
  piece: (typeof GLASS_PIECES)[number];
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  reducedMotion: boolean;
}) {
  const dx = piece.cx - 50;
  const dy = piece.cy - 50;

  const ref = useRef<HTMLDivElement>(null);

  const scatterX = reducedMotion ? 0 : dx * 11;
  const scatterY = reducedMotion ? 0 : dy * 7 - 40;
  const scatterRotate = reducedMotion ? 0 : dx > 0 ? 13 : -13;

  const x = useTransform(scrollYProgress, [0.02, 0.72], [scatterX, 0]);
  const y = useTransform(scrollYProgress, [0.02, 0.72], [scatterY, 0]);
  const rotate = useTransform(
    scrollYProgress,
    [0.02, 0.72],
    [scatterRotate, 0]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.25],
    [reducedMotion ? 1 : 0.55, 1]
  );

  // framer's style applier drops non-transform values in this setup;
  // write opacity to the DOM directly
  useMotionValueEvent(opacity, "change", (v) => {
    if (ref.current) ref.current.style.opacity = String(v);
  });

  const isCenter = CENTER_PIECE_FILES.has(piece.file);

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
        opacity: reducedMotion ? 1 : 0.55,
      }}
    >
      <Image
        src={`/glass-assets/tight_png/${piece.file}`}
        alt=""
        fill
        sizes={`(max-width: 768px) ${Math.round(piece.w * 0.92)}vw, ${Math.round(1000 * piece.w / 100)}px`}
        priority={isCenter}
        loading={isCenter ? undefined : "lazy"}
      />
    </motion.div>
  );
}

export default function HeroAssemble() {
  const reducedMotion = useReducedMotion() ?? false;
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const captionRef = useRef<HTMLDivElement>(null);
  const captionOpacity = useTransform(scrollYProgress, [0.55, 0.8], [0, 1]);
  const captionY = useTransform(
    scrollYProgress,
    [0.55, 0.8],
    [reducedMotion ? 0 : 18, 0]
  );

  useMotionValueEvent(captionOpacity, "change", (v) => {
    if (captionRef.current) {
      captionRef.current.style.opacity = String(reducedMotion ? 1 : v);
    }
  });

  return (
    <div ref={trackRef} className="relative" style={{ height: "190vh" }}>
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-6">
        <div
          className="text-xs tracking-[0.25em] uppercase mb-3"
          style={{
            color: "var(--gold-text)",
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
          }}
        >
          From broken pieces, something whole
        </div>

        <Image
          src="/logo_stacked.png"
          alt="Femme Ferments"
          width={900}
          height={349}
          priority
          style={{
            width: "min(360px, 52vw, 44vh)",
            height: "auto",
            marginBottom: "4px",
          }}
        />

        <div
          className="relative"
          style={{
            width: "min(1000px, 92vw, calc(52vh * 1.349))",
            aspectRatio: "1275 / 945",
          }}
        >
          {GLASS_PIECES.map((piece) => (
            <AssemblingPiece
              key={piece.file}
              piece={piece}
              scrollYProgress={scrollYProgress}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        <motion.div
          ref={captionRef}
          className="flex flex-col items-center"
          style={{ opacity: reducedMotion ? 1 : 0, y: captionY }}
        >
          <Image
            src="/FF_Tagline_alpha.png"
            alt="Beauty in the Broken Glass"
            width={2514}
            height={487}
            priority
            style={{
              marginTop: "6px",
              width: "min(440px, 68vw, 42vh)",
              height: "auto",
            }}
          />
        </motion.div>

        <div
          className="mt-4 flex flex-col items-center gap-2"
          style={{ color: "var(--ink-dim)" }}
        >
          <span
            className="text-[0.6rem] tracking-[0.3em] uppercase"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}
          >
            Scroll to bring it together
          </span>
          <div
            style={{
              width: "1px",
              height: "24px",
              background: "linear-gradient(var(--gold), transparent)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
