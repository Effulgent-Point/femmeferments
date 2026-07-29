"use client";

import { useState } from "react";
import content from "@/data/content.json";

function LogoRow({ names, hidden }: { names: string[]; hidden?: boolean }) {
  return (
    <div className="flex flex-shrink-0" aria-hidden={hidden || undefined}>
      {names.map((name) => (
        <div
          key={name}
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: "120px",
            height: "50px",
            marginRight: "2rem",
            borderRadius: "8px",
            background: "#e8e0d0",
            color: "var(--ink-dim)",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
          }}
        >
          {name}
        </div>
      ))}
    </div>
  );
}

export default function PartnerMarquee({ partners }: { partners?: string[] }) {
  const names = partners ?? (content.partners as string[]);
  const [paused, setPaused] = useState(false);

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      <div
        className="relative overflow-hidden mt-12 w-full"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div
          className="marquee-track"
          style={{ animationPlayState: paused ? "paused" : undefined }}
        >
          <LogoRow names={names} />
          <LogoRow names={names} hidden />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused(!paused)}
        aria-pressed={paused}
        className="mt-4 cursor-pointer text-[0.62rem] tracking-[0.2em] uppercase"
        style={{
          background: "none",
          border: "none",
          color: "var(--ink-dim)",
          fontFamily: "var(--font-sans)",
          fontWeight: 600,
          borderBottom: "1px solid rgba(107, 90, 82, 0.3)",
          paddingBottom: "2px",
        }}
      >
        {paused ? "Play" : "Pause"} scrolling
      </button>
    </div>
  );
}
