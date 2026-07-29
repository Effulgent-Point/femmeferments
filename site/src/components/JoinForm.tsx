"use client";

import { useState } from "react";

export default function JoinForm() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div role="status" className="w-full flex flex-col items-center">
      {submittedEmail ? (
        <p
          className="mt-8 text-center"
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "1.2rem",
            color: "var(--wine)",
          }}
        >
          Thank you — you&rsquo;re part of the picture now. We&rsquo;ll be in
          touch at {submittedEmail}.
        </p>
      ) : (
        <form
          className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const email = form.get("email");
            const botcheck = form.get("botcheck");
            if (typeof email !== "string" || !email) return;
            setSubmitting(true);
            setError(null);
            try {
              const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email,
                  botcheck: typeof botcheck === "string" ? botcheck : "",
                }),
              });
              if (!res.ok) {
                setError("Something went wrong — please try again.");
                return;
              }
              setSubmittedEmail(email);
            } catch {
              setError("Something went wrong — please try again.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {/* Honeypot: hidden from real users; bots that fill it are dropped server-side. */}
          <input
            type="text"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              padding: 0,
              margin: "-1px",
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Your email address"
            aria-label="Email address"
            className="flex-1 min-w-0"
            style={{
              padding: "0.85rem 1.1rem",
              border: "1px solid rgba(74, 14, 43, 0.25)",
              background: "var(--cream)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.9rem",
              color: "var(--ink)",
            }}
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex-shrink-0 cursor-pointer transition-colors duration-200"
            style={{
              padding: "0.85rem 1.6rem",
              background: "var(--wine)",
              color: "var(--cream)",
              border: "none",
              fontFamily: "var(--font-sans)",
              fontSize: "0.85rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Joining…" : "Join Us →"}
          </button>
        </form>
      )}
      {error && !submittedEmail ? (
        <p
          className="mt-3 text-center"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.85rem",
            color: "var(--wine)",
          }}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
