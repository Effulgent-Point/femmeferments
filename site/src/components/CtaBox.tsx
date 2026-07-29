interface CtaBoxProps {
  label: string;
  heading: string;
  description: string;
  href?: string;
}

export default function CtaBox({
  label,
  heading,
  description,
  href = "#join",
}: CtaBoxProps) {
  return (
    <a
      href={href}
      className="block text-left mt-10 max-w-lg w-full transition-transform duration-300 hover:-translate-y-0.5"
      style={{
        borderLeft: "3px solid var(--gold)",
        background: "var(--parchment-deep)",
        padding: "24px",
        textDecoration: "none",
      }}
    >
      <span
        className="block text-xs tracking-[0.2em] uppercase mb-2"
        style={{
          color: "var(--gold-text)",
          fontFamily: "var(--font-sans)",
          fontWeight: 600,
        }}
      >
        {label}
      </span>
      <h3
        className="mb-2"
        style={{
          fontFamily: "var(--font-serif)",
          color: "var(--wine)",
          fontSize: "1.35rem",
          fontWeight: 600,
        }}
      >
        {heading} &rarr;
      </h3>
      <p
        className="leading-relaxed"
        style={{
          color: "var(--ink-dim)",
          fontFamily: "var(--font-sans)",
          fontSize: "0.88rem",
        }}
      >
        {description}
      </p>
    </a>
  );
}
