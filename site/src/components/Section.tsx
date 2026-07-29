import Image from "next/image";
import Reveal from "@/components/Reveal";
import { GLASS_PIECES } from "@/data/glassPieces";

function pieceDimensions(file: string) {
  const piece = GLASS_PIECES.find((p) => p.file === file);
  return piece ? { width: piece.pw, height: piece.ph } : { width: 300, height: 300 };
}

interface BgPiece {
  file: string;
  width: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

interface SectionProps {
  id?: string;
  bg?: "cream" | "parchment" | "parchment-deep";
  chapter?: string;
  bgPieces?: BgPiece[];
  children: React.ReactNode;
}

const bgMap = {
  cream: "var(--cream)",
  parchment: "var(--parchment)",
  "parchment-deep": "var(--parchment-deep)",
};

export default function Section({
  id,
  bg = "cream",
  chapter,
  bgPieces,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className="relative overflow-hidden flex flex-col items-center text-center"
      style={{ padding: "6rem 1.5rem", background: bgMap[bg] }}
    >
      {bgPieces?.map((piece) => {
        const dims = pieceDimensions(piece.file);
        return (
          <Image
            key={piece.file}
            src={`/glass-assets/tight_png/${piece.file}`}
            alt=""
            aria-hidden="true"
            width={dims.width}
            height={dims.height}
            loading="lazy"
            sizes="60vw"
            className="bg-glass-piece absolute pointer-events-none"
            style={{
              width: piece.width,
              height: "auto",
              top: piece.top,
              bottom: piece.bottom,
              left: piece.left,
              right: piece.right,
              opacity: 0.22,
              zIndex: 1,
            }}
          />
        );
      })}
      <div className="relative w-full flex flex-col items-center" style={{ zIndex: 2 }}>
        <Reveal>
          {chapter && (
            <div
              className="text-xs tracking-[0.25em] uppercase mb-4"
              style={{
                color: "var(--gold-text)",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
              }}
            >
              {chapter}
            </div>
          )}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
