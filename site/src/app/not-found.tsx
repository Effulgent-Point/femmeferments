import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

// Next.js auto-injects `<meta name="robots" content="noindex">` for routes
// that resolve to a 404 status, but we set an explicit title/description too
// so the tab and any indexed snapshot read correctly.
export const metadata: Metadata = {
  title: "Page Not Found — Femme Ferments",
  description:
    "The page you're looking for has shattered like glass. Return to Femme Ferments.",
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--wine)" }}
    >
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <p
          className="text-xs tracking-[0.35em] uppercase mb-6"
          style={{ color: "var(--gold)", fontFamily: "var(--font-sans)" }}
        >
          Beauty in the Broken Glass
        </p>
        <h1
          className="text-[6rem] leading-none font-semibold mb-4"
          style={{ color: "var(--cream)", fontFamily: "var(--font-serif)" }}
        >
          404
        </h1>
        <h2
          className="text-2xl md:text-3xl font-semibold mb-4"
          style={{ color: "var(--cream)", fontFamily: "var(--font-serif)" }}
        >
          This piece of glass wandered off.
        </h2>
        <p
          className="max-w-md mb-10"
          style={{
            color: "rgba(250, 245, 235, 0.7)",
            fontFamily: "var(--font-sans)",
          }}
        >
          The page you&rsquo;re looking for doesn&rsquo;t exist, but
          there&rsquo;s still plenty of beauty to find back home.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 text-xs tracking-[0.18em] uppercase transition-colors duration-200"
          style={{
            background: "var(--gold)",
            color: "var(--ink)",
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            borderRadius: "2px",
          }}
        >
          Return Home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
