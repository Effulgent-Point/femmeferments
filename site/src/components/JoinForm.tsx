"use client";

import { useState } from "react";

const fieldStyle = {
  padding: "0.85rem 1.1rem",
  border: "1px solid rgba(74, 14, 43, 0.25)",
  background: "var(--cream)",
  fontFamily: "var(--font-sans)",
  fontSize: "0.9rem",
  color: "var(--ink)",
  width: "100%",
} as const;

export default function JoinForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div role="status" className="w-full flex flex-col items-center">
      {submitted ? (
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
          touch soon.
        </p>
      ) : (
        <form
          className="mt-8 flex flex-col gap-3 w-full max-w-md mx-auto"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const name = (form.get("name") as string)?.trim() || "";
            const email = (form.get("email") as string)?.trim() || "";
            const phone = (form.get("phone") as string)?.trim() || "";
            const botcheck = form.get("botcheck");
            if (!email) return;
            setSubmitting(true);
            setError(null);
            try {
              const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name,
                  email,
                  phone,
                  botcheck: typeof botcheck === "string" ? botcheck : "",
                }),
              });
              if (!res.ok) {
                setError("Something went wrong — please try again.");
                return;
              }
              setSubmitted(true);
            } catch {
              setError("Something went wrong — please try again.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {/* Honeypot */}
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
            type="text"
            name="name"
            placeholder="Your name"
            aria-label="Name"
            style={fieldStyle}
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Email address *"
            aria-label="Email address"
            style={fieldStyle}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone number (optional)"
            aria-label="Phone number"
            style={fieldStyle}
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
      {error && !submitted ? (
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
