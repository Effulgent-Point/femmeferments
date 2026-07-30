import React from "react";

/**
 * Renders a small, safe subset of inline Markdown for body/prose fields:
 *   [label](url)   → link  (scheme-validated: https/http/mailto/tel/relative)
 *   **bold**       → <strong>
 *   _italic_       → <em>
 *   newlines       → <br>
 *
 * XSS-safe by construction: every non-link fragment is emitted as a React text
 * node (auto-escaped) and links render only for validated schemes — there is no
 * dangerouslySetInnerHTML. Backward-compatible: prose containing none of these
 * delimiters renders exactly as plain text did before (a lone `\n` now becomes a
 * <br>, which just honors the author's line break).
 *
 * Deliberately NOT a full Markdown engine — no nesting, no block elements. It
 * drops inline into an existing <p>, so callers keep their own paragraph styling.
 */

/** Allow only safe link targets; reject javascript:/data:/etc. Returns null if unsafe. */
function safeHref(raw: string): string | null {
  const t = raw.trim();
  if (/^(https?:|mailto:|tel:)/i.test(t)) return t; // explicit safe scheme
  if (t.startsWith("#")) return t; // in-page anchor
  // Site-relative path, but NOT a protocol-relative `//host` (which escapes to
  // another origin while looking internal).
  if (t.startsWith("/") && !t.startsWith("//")) return t;
  if (/^[\w-]+(\.[\w-]+)+(\/|$)/.test(t)) return "https://" + t; // bare domain
  return null;
}

// One pass matches the earliest of: [label](url) | **bold** | _italic_.
// The URL group is greedy ([^\s]+ then backtracks to the last `)`), so a link
// whose URL itself contains parens — e.g. a Wikipedia .../Foo_(bar) URL — keeps
// the inner `)` instead of truncating at the first one.
const INLINE_RE = /\[([^\]]+)\]\(([^\s]+)\)|\*\*([^*]+?)\*\*|_([^_]+?)_/g;

function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of text.matchAll(INLINE_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(text.slice(last, idx));
    if (m[1] !== undefined) {
      const href = safeHref(m[2]);
      if (href) {
        const external = /^https?:/i.test(href);
        out.push(
          <a
            key={`${keyBase}-${k++}`}
            href={href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            style={{ color: "var(--wine)", textDecoration: "underline" }}
          >
            {m[1]}
            {external ? (
              <span className="sr-only"> (opens in new tab)</span>
            ) : null}
          </a>,
        );
      } else {
        // Unsafe/unparseable target — render the source literally, don't drop it.
        out.push(m[0]);
      }
    } else if (m[3] !== undefined) {
      out.push(<strong key={`${keyBase}-${k++}`}>{m[3]}</strong>);
    } else if (m[4] !== undefined) {
      out.push(<em key={`${keyBase}-${k++}`}>{m[4]}</em>);
    }
    last = idx + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function RichText({ children }: { children?: string }) {
  const lines = (children ?? "").split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          {i > 0 && <br />}
          {renderInline(line, String(i))}
        </React.Fragment>
      ))}
    </>
  );
}
