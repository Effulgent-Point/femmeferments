"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Vision", href: "#vision" },
  { label: "Wines", href: "#wines" },
  { label: "Community", href: "#community" },
  { label: "Events", href: "#events" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: "rgba(250, 245, 235, 0.95)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(201, 168, 76, 0.15)",
        padding: scrolled ? "0.6rem 2rem" : "1rem 2rem",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/FF_Logo.png"
            alt="Femme Ferments"
            width={180}
            height={24}
            className="transition-all duration-300"
            style={{ height: scrolled ? "18px" : "24px", width: "auto" }}
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs tracking-[0.18em] uppercase transition-colors duration-200 hover:text-[var(--wine)]"
              style={{
                color: "var(--ink-dim)",
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span
            className="block w-5 h-[1.5px] transition-transform duration-200"
            style={{
              background: "var(--ink)",
              transform: menuOpen
                ? "translateY(6.5px) rotate(45deg)"
                : "none",
            }}
          />
          <span
            className="block w-5 h-[1.5px] transition-opacity duration-200"
            style={{
              background: "var(--ink)",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-5 h-[1.5px] transition-transform duration-200"
            style={{
              background: "var(--ink)",
              transform: menuOpen
                ? "translateY(-6.5px) rotate(-45deg)"
                : "none",
            }}
          />
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden mt-4 pb-4 flex flex-col gap-4"
          style={{ borderTop: "1px solid rgba(201, 168, 76, 0.15)" }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs tracking-[0.18em] uppercase pt-4"
              style={{
                color: "var(--ink-dim)",
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
              }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
