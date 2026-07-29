import Image from "next/image";
import Link from "next/link";

const concepts = [
  {
    href: "/",
    title: "Glass-First Hero (LIVE)",
    description:
      "The chosen design, now the live site. Glass fills the header, name on top, shatters on scroll. Backed by the content editor.",
  },
  {
    href: "/concept-1",
    title: "Chapters + Scroll Shatter",
    description:
      "Classic structure with chapter headings. Glass mosaic shatters on scroll, then reassembles at the bottom.",
  },
  {
    href: "/concept-2",
    title: "Flowing + Fast Shatter",
    description:
      "No chapter numbers. Sections flow naturally. Glass shatter completes faster for a snappier feel.",
  },
  {
    href: "/concept-3",
    title: "The Back Label",
    description:
      "Editorial wine-label treatment. Framed label hero, drop caps, and a dark cellar panel where the wines glow.",
  },
  {
    href: "/concept-5",
    title: "Broken to Whole",
    description:
      "The reverse arc: pieces start scattered and assemble as you scroll — beauty coming together from the broken.",
  },
];

export default function Concepts() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: "var(--cream)" }}
    >
      <Image
        src="/logo_stacked.png"
        alt="Femme Ferments"
        width={280}
        height={109}
        priority
        className="mb-4"
      />
      <Image
        src="/FF_Tagline_alpha.png"
        alt="Beauty in the Broken Glass"
        width={2514}
        height={487}
        className="mb-12"
        style={{ width: "320px", maxWidth: "80vw", height: "auto" }}
      />

      <h1
        className="text-lg tracking-[0.2em] uppercase mb-10"
        style={{
          color: "var(--gold-text)",
          fontFamily: "var(--font-sans)",
          fontWeight: 600,
        }}
      >
        Design Concepts
      </h1>

      <div className="grid gap-6 max-w-3xl w-full md:grid-cols-3">
        {concepts.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="block p-8 text-center transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "var(--parchment)",
              border: "1px solid rgba(74, 14, 43, 0.12)",
              boxShadow: "0 4px 20px rgba(44, 28, 18, 0.08)",
              textDecoration: "none",
            }}
          >
            <h2
              className="text-xl mb-3"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--wine)",
                fontWeight: 600,
              }}
            >
              {c.title}
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{
                color: "var(--ink-dim)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {c.description}
            </p>
          </Link>
        ))}
      </div>

      <a
        href="/legacy/"
        className="mt-10 text-xs tracking-[0.12em] uppercase transition-colors duration-200"
        style={{
          color: "var(--ink-dim)",
          fontFamily: "var(--font-sans)",
          fontWeight: 500,
          textDecoration: "none",
          borderBottom: "1px solid rgba(201, 168, 76, 0.3)",
          paddingBottom: "2px",
        }}
      >
        View earlier concept rounds
      </a>

      <div
        className="mt-10 text-xs"
        style={{
          color: "var(--ink-dim)",
          fontFamily: "var(--font-sans)",
        }}
      >
        Made with &#10084;&#65039; by{" "}
        <a
          href="https://effulgentpoint.com/"
          style={{ color: "var(--copper-text)" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          Effulgent Point
        </a>
      </div>
    </div>
  );
}
