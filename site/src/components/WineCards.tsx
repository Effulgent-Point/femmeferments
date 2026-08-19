import content from "@/data/content.json";
import type { Wine } from "@/lib/content";

export default function WineCards({ wines }: { wines?: Wine[] }) {
  const list = wines ?? (content.wines as Wine[]);
  return (
    <div className="grid gap-8 max-w-[900px] mx-auto mt-8 grid-cols-1 sm:grid-cols-2">
      {list.map((wine) => (
        <div
          key={wine.varietal}
          className="text-center p-6 sm:p-10"
          style={{
            background: "var(--parchment)",
            border: "1px solid rgba(201, 168, 76, 0.3)",
            boxShadow: "0 6px 28px rgba(44, 28, 18, 0.12)",
          }}
        >
          <div
            className="text-xs tracking-[0.2em] uppercase mb-2"
            style={{
              color: "var(--gold-text)",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
            }}
          >
            {wine.year} {wine.varietal}
          </div>

          {wine.soldOut ? (
            <div
              className="inline-block mb-3"
              style={{
                padding: "0.2rem 0.7rem",
                borderRadius: "999px",
                background: "var(--wine)",
                color: "var(--cream)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Sold Out
            </div>
          ) : null}

          <div
            className="relative mx-auto mb-5"
            style={{ width: "40px", height: "10px" }}
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
                width: "5px",
                height: "5px",
                transform: "translate(-50%, -50%) rotate(45deg)",
                background: "var(--gold)",
              }}
            />
          </div>

          <h3
            className="text-2xl mb-4"
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--wine)",
              fontWeight: 600,
              fontStyle: "italic",
            }}
          >
            {wine.name}
          </h3>

          {wine.image ? (
            // Label photo, right above the description (a proxied /api/media
            // URL — next/image is not used here).
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={wine.image}
              alt={`${wine.name} label`}
              loading="lazy"
              className="mx-auto mb-4"
              style={{
                maxHeight: "240px",
                maxWidth: "70%",
                objectFit: "contain",
                display: "block",
              }}
            />
          ) : null}

          <p
            className="leading-relaxed"
            style={{
              color: "var(--ink-dim)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.85rem",
            }}
          >
            {wine.description}
          </p>
        </div>
      ))}
    </div>
  );
}
