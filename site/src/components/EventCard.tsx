import content from "@/data/content.json";
import type { EventInfo } from "@/lib/content";

export default function EventCard({ event }: { event?: EventInfo }) {
  const ev = event ?? (content.event as EventInfo);
  return (
    <div
      className="text-center mt-12 max-w-xl w-full mx-auto"
      style={{
        background: "var(--cream)",
        boxShadow: "0 8px 30px rgba(44, 28, 18, 0.08)",
        borderRadius: "8px",
        padding: "2.5rem",
      }}
    >
      {ev.poster ? (
        // Event poster/flyer (a proxied /api/media URL — next/image is not
        // used here).
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ev.poster}
          alt={`${ev.title} poster`}
          loading="lazy"
          className="mx-auto mb-8"
          style={{
            width: "100%",
            maxWidth: "460px",
            height: "auto",
            borderRadius: "6px",
            boxShadow: "0 8px 30px rgba(44, 28, 18, 0.14)",
            display: "block",
          }}
        />
      ) : null}
      <div
        className="text-xs tracking-[0.2em] uppercase mb-3"
        style={{
          color: "var(--gold-text)",
          fontFamily: "var(--font-sans)",
          fontWeight: 600,
        }}
      >
        {ev.date}
      </div>
      <h3
        className="mb-5"
        style={{
          fontFamily: "var(--font-serif)",
          color: "var(--wine)",
          fontSize: "1.7rem",
          fontWeight: 600,
        }}
      >
        {ev.title}
      </h3>
      <div className="flex flex-col gap-2 mb-6">
        {ev.details.map((detail) => (
          <span
            key={detail}
            className="text-sm"
            style={{
              color: "var(--ink-dim)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {detail}
          </span>
        ))}
      </div>
      <p
        className="leading-relaxed"
        style={{
          color: "var(--ink-dim)",
          fontFamily: "var(--font-sans)",
          fontSize: "0.9rem",
        }}
      >
        {ev.description}
      </p>
    </div>
  );
}
