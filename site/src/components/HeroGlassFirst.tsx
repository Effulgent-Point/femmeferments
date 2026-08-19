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

function FullBleedPiece({
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

  const maxTx = reducedMotion ? 0 : dx * 9;
  const maxTy = reducedMotion ? 0 : dy * 5.5 + 130;

  const ref = useRef<HTMLDivElement>(null);

  const x = useTransform(scrollYProgress, [0, 0.75], [0, maxTx]);
  const y = useTransform(scrollYProgress, [0, 0.75], [0, maxTy]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.4, 0.75],
    [1, reducedMotion ? 1 : 0.75, reducedMotion ? 1 : 0],
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
        willChange: "transform",
      }}
    >
      <Image
        src={`/glass-assets/tight_png/${piece.file}`}
        alt=""
        fill
        sizes={`(max-width: 700px) ${Math.round(piece.w * 1.4)}vw, ${Math.round(piece.w * 1.1)}vw`}
        priority={isCenter}
        loading={isCenter ? undefined : "lazy"}
      />
    </motion.div>
  );
}

export default function HeroGlassFirst() {
  const reducedMotion = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "var(--cream)", paddingTop: "84px" }}
    >
      {/* Name + tagline permanently visible, centered above the glass */}
      <div className="relative z-10 flex flex-col items-center text-center px-5 pb-2">
        <div
          className="absolute -top-6 left-1/2 -translate-x-1/2 pointer-events-none -z-10"
          style={{
            width: "min(760px, 85vw)",
            height: "calc(100% + 60px)",
            background:
              "radial-gradient(ellipse at center, rgba(250,245,235,0.95) 0%, rgba(250,245,235,0.7) 55%, transparent 85%)",
            filter: "blur(22px)",
          }}
        />

        <Image
          src="/logo_stacked.png"
          alt="Femme Ferments"
          width={900}
          height={349}
          priority
          style={{ width: "min(340px, 45vw)", height: "auto" }}
        />

        <Image
          src="/FF_Tagline_alpha.png"
          alt="Beauty in the Broken Glass"
          width={2514}
          height={487}
          priority
          style={{
            marginTop: "4px",
            width: "min(480px, 65vw)",
            height: "auto",
          }}
        />
      </div>

      {/* Glass scooted up beneath the name, filling the rest of the viewport */}
      <div className="hero-full-stage" style={{ marginTop: "-7vw" }}>
        {GLASS_PIECES.map((piece) => (
          <FullBleedPiece
            key={piece.file}
            piece={piece}
            scrollYProgress={scrollYProgress}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </section>
  );
}
