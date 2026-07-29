import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import type { ContactData } from "@/lib/content";

const linkStyle: React.CSSProperties = {
  color: "var(--copper-text)",
  textDecoration: "none",
  fontWeight: 600,
};

const rowStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "1rem",
  color: "var(--ink)",
};

// The map embed is admin-editable free text that we drop into an <iframe src>.
// Only allow https URLs from known map providers — this rejects `javascript:` /
// `data:` schemes and arbitrary attacker origins (clickjacking/phishing) that a
// bare `src={data.mapEmbed}` would happily render. Returns a clean URL or null.
const MAP_EMBED_HOSTS = new Set([
  "www.google.com",
  "maps.google.com",
  "www.openstreetmap.org",
  "www.bing.com",
]);
function safeMapSrc(raw: string): string | null {
  try {
    const u = new URL(raw.trim());
    if (u.protocol !== "https:" || !MAP_EMBED_HOSTS.has(u.hostname))
      return null;
    return u.toString();
  } catch {
    return null;
  }
}

export default function ContactSection({
  data,
  heading,
  chapter,
  bg,
}: {
  data: ContactData;
  heading: string;
  chapter?: string;
  bg?: "cream" | "parchment" | "parchment-deep";
}) {
  const socials = [
    { label: "Instagram", href: data.instagram },
    { label: "Facebook", href: data.facebook },
  ].filter((s) => s.href.trim() !== "");

  return (
    <Section id="contact" bg={bg} chapter={chapter}>
      <SectionHeading>{heading}</SectionHeading>

      {data.intro.trim() !== "" && (
        <p
          className="leading-relaxed max-w-xl mx-auto mb-8"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "1.05rem",
            color: "var(--ink-dim)",
          }}
        >
          {data.intro}
        </p>
      )}

      <div className="flex flex-col items-center gap-3 max-w-xl mx-auto">
        {data.email.trim() !== "" && (
          <a
            href={`mailto:${data.email}`}
            style={{ ...rowStyle, ...linkStyle }}
          >
            {data.email}
          </a>
        )}
        {data.phone.trim() !== "" && (
          <a
            href={`tel:${data.phone.replace(/[^\d+]/g, "")}`}
            style={{ ...rowStyle, ...linkStyle }}
          >
            {data.phone}
          </a>
        )}
        {data.address.trim() !== "" && (
          <address
            className="not-italic whitespace-pre-line"
            style={{ ...rowStyle, color: "var(--ink-dim)" }}
          >
            {data.address}
          </address>
        )}

        {socials.length > 0 && (
          <div className="flex items-center justify-center gap-6 mt-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-[0.2em] uppercase"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  color: "var(--gold-text)",
                  textDecoration: "none",
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {(() => {
        const mapSrc = safeMapSrc(data.mapEmbed);
        return mapSrc ? (
          <div
            className="w-full max-w-3xl mx-auto mt-10 overflow-hidden"
            style={{
              borderRadius: "8px",
              boxShadow: "0 8px 30px rgba(44, 28, 18, 0.08)",
            }}
          >
            <iframe
              src={mapSrc}
              title={`Map of ${data.address || "our location"}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              style={{
                width: "100%",
                height: "360px",
                border: 0,
                display: "block",
              }}
            />
          </div>
        ) : null;
      })()}
    </Section>
  );
}
