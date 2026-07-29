import Image from "next/image";
import { GLASS_PIECES, CENTER_PIECE_FILES } from "@/data/glassPieces";

export default function HeroLabel() {
  return (
    <section
      className="flex justify-center"
      style={{
        background: "var(--parchment)",
        padding: "110px 1.25rem 5rem",
      }}
    >
      <div
        className="relative w-full flex flex-col items-center text-center"
        style={{
          maxWidth: "880px",
          background: "var(--cream)",
          border: "1px solid var(--gold)",
          outline: "1px solid rgba(201, 168, 76, 0.45)",
          outlineOffset: "6px",
          padding: "clamp(2.5rem, 6vw, 5rem) clamp(1.25rem, 5vw, 4rem)",
          boxShadow: "0 20px 60px rgba(44, 28, 18, 0.1)",
        }}
      >
        <div
          className="text-[0.68rem] tracking-[0.3em] uppercase"
          style={{
            color: "var(--gold-text)",
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
          }}
        >
          Est. 2024 &mdash; Willamette Valley, Oregon
        </div>

        <Image
          src="/logo_stacked.png"
          alt="Femme Ferments"
          width={900}
          height={349}
          priority
          className="mt-6"
          style={{ width: "min(340px, 55vw)", height: "auto" }}
        />

        <div
          className="relative mx-auto my-8"
          style={{ width: "54px", height: "10px" }}
        >
          <span
            className="absolute left-0 right-0"
            style={{ top: "50%", height: "1px", background: "var(--gold)" }}
          />
          <span
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              width: "6px",
              height: "6px",
              transform: "translate(-50%, -50%) rotate(45deg)",
              background: "var(--gold)",
            }}
          />
        </div>

        <div
          className="relative"
          style={{
            width: "min(620px, 78vw)",
            aspectRatio: "1275 / 945",
          }}
        >
          {GLASS_PIECES.map((piece) => {
            const isCenter = CENTER_PIECE_FILES.has(piece.file);
            return (
              <div
                key={piece.file}
                className="absolute"
                style={{
                  left: `${piece.left}%`,
                  top: `${piece.top}%`,
                  width: `${piece.w}%`,
                  height: `${piece.h}%`,
                }}
              >
                <Image
                  src={`/glass-assets/tight_png/${piece.file}`}
                  alt=""
                  fill
                  sizes={`${Math.round(620 * piece.w / 100)}px`}
                  priority={isCenter}
                  loading={isCenter ? undefined : "lazy"}
                />
              </div>
            );
          })}
        </div>

        <Image
          src="/FF_Tagline_alpha.png"
          alt="Beauty in the Broken Glass"
          width={2514}
          height={487}
          priority
          className="mt-6"
          style={{ width: "min(420px, 62vw)", height: "auto" }}
        />

        <div
          className="mt-8 text-[0.68rem] tracking-[0.24em] uppercase"
          style={{
            color: "var(--ink-dim)",
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
          }}
        >
          Albarino &middot; Pinot Noir &middot; 100% of profits empower women
        </div>
      </div>
    </section>
  );
}
