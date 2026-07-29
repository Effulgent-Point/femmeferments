import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import type { NewsData } from "@/lib/content";

/** Format an ISO-ish date string for display; fall back to the raw string. */
function formatDate(raw: string): string {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NewsSection({
  data,
  heading,
  chapter,
  bg,
}: {
  data: NewsData;
  heading: string;
  chapter?: string;
  bg?: "cream" | "parchment" | "parchment-deep";
}) {
  const items = data.items ?? [];

  return (
    <Section id="news" bg={bg} chapter={chapter}>
      <SectionHeading>{heading}</SectionHeading>

      {data.intro ? (
        <p
          className="max-w-[640px] mx-auto leading-relaxed"
          style={{
            color: "var(--ink-dim)",
            fontFamily: "var(--font-sans)",
          }}
        >
          {data.intro}
        </p>
      ) : null}

      {items.length > 0 ? (
        <div className="w-full max-w-[640px] mx-auto mt-10 text-left">
          {items.map((item, i) => (
            <article
              key={i}
              style={{
                paddingTop: i === 0 ? 0 : "2rem",
                paddingBottom: "2rem",
                borderTop:
                  i === 0 ? "none" : "1px solid rgba(201, 168, 76, 0.3)",
              }}
            >
              {item.date ? (
                <div
                  className="text-xs tracking-[0.2em] uppercase mb-2"
                  style={{
                    color: "var(--gold-text)",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 600,
                  }}
                >
                  {formatDate(item.date)}
                </div>
              ) : null}
              {item.title ? (
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: "var(--font-serif)",
                    color: "var(--wine)",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                  }}
                >
                  {item.title}
                </h3>
              ) : null}
              {item.body ? (
                <p
                  className="leading-relaxed whitespace-pre-line"
                  style={{
                    color: "var(--ink-dim)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {item.body}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}
    </Section>
  );
}
