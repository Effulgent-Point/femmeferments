"use client";

import { useState } from "react";

export default function JoinForm() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

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
          onSubmit={(e) => {
            e.preventDefault();
            const email = new FormData(e.currentTarget).get("email");
            if (typeof email === "string" && email) {
              // TODO: wire to the signup backend before launch
              setSubmittedEmail(email);
            }
          }}
        >
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
            }}
          >
            Join Us &rarr;
          </button>
        </form>
      )}
    </div>
  );
}
