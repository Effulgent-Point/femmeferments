import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import type { DonateData } from "@/lib/content";

export default function DonateSection({
  data,
  heading,
  chapter,
  bg,
}: {
  data: DonateData;
  heading: string;
  chapter?: string;
  bg?: "cream" | "parchment" | "parchment-deep";
}) {
  const tiers = data.tiers ?? [];

  return (
    <Section id="donate" bg={bg} chapter={chapter}>
      <SectionHeading>{heading}</SectionHeading>

      {data.intro && (
        <p
          className="max-w-[640px] mx-auto leading-relaxed"
          style={{
            color: "var(--ink-dim)",
            fontFamily: "var(--font-sans)",
            fontSize: "0.95rem",
          }}
        >
          {data.intro}
        </p>
      )}

      {tiers.length > 0 && (
        <div
          className="grid gap-8 max-w-[900px] w-full mx-auto mt-10"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          {tiers.map((tier, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-8"
              style={{
                background: "var(--parchment)",
                border: "1px solid rgba(201, 168, 76, 0.3)",
                boxShadow: "0 6px 28px rgba(44, 28, 18, 0.12)",
              }}
            >
              <div
                className="mb-3"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "var(--wine)",
                  fontSize: "2.25rem",
                  fontWeight: 600,
                }}
              >
                {tier.amount}
              </div>

              <p
                className="leading-relaxed mb-6 grow"
                style={{
                  color: "var(--ink-dim)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.85rem",
                }}
              >
                {tier.description}
              </p>

              {tier.cta && (
                <a
                  href={tier.href}
                  className="inline-block transition-transform duration-300 hover:-translate-y-0.5"
                  style={{
                    background: "var(--wine)",
                    color: "var(--cream)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "0.7rem 1.5rem",
                    borderRadius: "4px",
                    textDecoration: "none",
                  }}
                >
                  {tier.cta}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {data.note && (
        <p
          className="max-w-[560px] mx-auto mt-8 leading-relaxed"
          style={{
            color: "var(--ink-dim)",
            fontFamily: "var(--font-sans)",
            fontSize: "0.78rem",
            fontStyle: "italic",
          }}
        >
          {data.note}
        </p>
      )}
    </Section>
  );
}
