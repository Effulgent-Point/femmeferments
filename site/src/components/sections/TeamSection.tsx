import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import RichText from "@/components/RichText";
import type { TeamData, TeamMember } from "@/lib/content";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export default function TeamSection({
  data,
  heading,
  chapter,
  bg,
}: {
  data: TeamData;
  heading: string;
  chapter?: string;
  bg?: "cream" | "parchment" | "parchment-deep";
}) {
  const members = data.members ?? [];

  return (
    <Section id="team" bg={bg} chapter={chapter}>
      <SectionHeading>{heading}</SectionHeading>

      {data.intro ? (
        <p
          className="max-w-[640px] mx-auto leading-relaxed"
          style={{
            color: "var(--ink-dim)",
            fontFamily: "var(--font-sans)",
          }}
        >
          <RichText>{data.intro}</RichText>
        </p>
      ) : null}

      {members.length > 0 ? (
        <div
          className="grid gap-8 w-full max-w-[1100px] mx-auto mt-10"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {members.map((member: TeamMember, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-8"
              style={{
                background: "var(--parchment)",
                border: "1px solid rgba(201, 168, 76, 0.3)",
                boxShadow: "0 6px 28px rgba(44, 28, 18, 0.12)",
              }}
            >
              {member.photo ? (
                // Proxied /api/media URL — next/image is not used here.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.photo}
                  alt={member.name}
                  loading="lazy"
                  className="block"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid rgba(201, 168, 76, 0.3)",
                  }}
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="flex items-center justify-center"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    background: "var(--parchment-deep, var(--cream))",
                    border: "1px solid rgba(201, 168, 76, 0.3)",
                    color: "var(--wine)",
                    fontFamily: "var(--font-serif)",
                    fontSize: "2rem",
                    fontWeight: 600,
                  }}
                >
                  {initials(member.name)}
                </div>
              )}

              <h3
                className="text-2xl mt-5 mb-1"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "var(--wine)",
                  fontWeight: 600,
                }}
              >
                {member.name}
              </h3>

              {member.role ? (
                <div
                  className="text-xs tracking-[0.2em] uppercase mb-3"
                  style={{
                    color: "var(--gold-text)",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 600,
                  }}
                >
                  {member.role}
                </div>
              ) : null}

              {member.bio ? (
                <p
                  className="leading-relaxed"
                  style={{
                    color: "var(--ink-dim)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.85rem",
                  }}
                >
                  <RichText>{member.bio}</RichText>
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </Section>
  );
}
