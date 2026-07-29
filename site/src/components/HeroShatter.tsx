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

function ShatterPiece({
  piece,
  scrollYProgress,
  speed,
  reducedMotion,
}: {
  piece: (typeof GLASS_PIECES)[number];
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  speed: "normal" | "fast";
  reducedMotion: boolean;
}) {
  const dx = piece.cx - 50;
  const dy = piece.cy - 50;

  const mult = speed === "fast" ? 12 : 8;
  const maxTx = reducedMotion ? 0 : dx * mult;
  const maxTy = reducedMotion ? 0 : dy * mult * 0.6 + 120;

  const endRange = speed === "fast" ? 0.6 : 0.8;

  const ref = useRef<HTMLDivElement>(null);

  const x = useTransform(scrollYProgress, [0, endRange], [0, maxTx]);
  const y = useTransform(scrollYProgress, [0, endRange], [0, maxTy]);
  const opacity = useTransform(
    scrollYProgress,
    [0, endRange * 0.5, endRange],
    [1, reducedMotion ? 1 : 0.7, reducedMotion ? 1 : 0]
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
        opacity: 1,
      }}
    >
      <Image
        src={`/glass-assets/tight_png/${piece.file}`}
        alt=""
        fill
        sizes={`(max-width: 768px) ${Math.round(piece.w * 0.85)}vw, ${Math.round(900 * piece.w / 100)}px`}
        priority={isCenter}
        loading={isCenter ? undefined : "lazy"}
      />
    </motion.div>
  );
}

interface HeroShatterProps {
  speed?: "normal" | "fast";
  showChapterEyebrow?: boolean;
}

export default function HeroShatter({
  speed = "normal",
  showChapterEyebrow = true,
}: HeroShatterProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end start"],
  });

  return (
    <div
      ref={trackRef}
      className="relative"
      style={{ height: speed === "fast" ? "140vh" : "160vh" }}
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-6">
        {showChapterEyebrow && (
          <div
            className="text-xs tracking-[0.25em] uppercase mb-3"
            style={{
              color: "var(--gold-text)",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
            }}
          >
            Willamette Valley, Oregon
          </div>
        )}

        <Image
          src="/logo_stacked.png"
          alt="Femme Ferments"
          width={900}
          height={349}
          priority
          style={{
            width: "min(380px, 55vw, 44vh)",
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
            <ShatterPiece
              key={piece.file}
              piece={piece}
              scrollYProgress={scrollYProgress}
              speed={speed}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        <Image
          src="/FF_Tagline_alpha.png"
          alt="Beauty in the Broken Glass"
          width={2514}
          height={487}
          priority
          style={{
            marginTop: "4px",
            width: "min(460px, 70vw, 42vh)",
            height: "auto",
          }}
        />

        <div
          className="mt-4 flex flex-col items-center gap-2"
          style={{ color: "var(--ink-dim)" }}
        >
          <span
            className="text-[0.6rem] tracking-[0.3em] uppercase"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}
          >
            Scroll
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
