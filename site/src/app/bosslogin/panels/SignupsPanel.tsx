"use client";

import { useState } from "react";
import { primaryBtn, ghostBtn, sectionStyle, labelStyle } from "../fields";

interface Signup {
  name: string;
  email: string;
  phone: string;
  at: string;
}

export function SignupsPanel() {
  const [signups, setSignups] = useState<Signup[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/subscribe", { cache: "no-store" });
      if (!res.ok) {
        setError("Could not load signups.");
        return;
      }
      const data = await res.json();
      setSignups(data.subscribers ?? []);
    } catch {
      setError("Could not load signups.");
    } finally {
      setLoading(false);
    }
  }

  function downloadCsv() {
    window.open("/api/subscribe?format=csv", "_blank");
  }

  if (signups === null) {
    return (
      <section style={sectionStyle}>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          style={primaryBtn}
        >
          {loading ? "Loading…" : "Load Signups"}
        </button>
        {error && (
          <p
            style={{
              color: "var(--wine)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.85rem",
              marginTop: "0.5rem",
            }}
          >
            {error}
          </p>
        )}
      </section>
    );
  }

  return (
    <section style={sectionStyle}>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <span style={labelStyle}>
          {signups.length} signup{signups.length !== 1 ? "s" : ""}
        </span>
        <div className="flex gap-2">
          <button type="button" onClick={downloadCsv} style={ghostBtn}>
            Export CSV
          </button>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            style={ghostBtn}
          >
            Refresh
          </button>
        </div>
      </div>

      {signups.length === 0 ? (
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.85rem",
            color: "var(--ink-dim)",
          }}
        >
          No signups yet.
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "var(--font-sans)",
              fontSize: "0.82rem",
            }}
          >
            <thead>
              <tr>
                {["Name", "Email", "Phone", "Date"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "0.5rem 0.6rem",
                      borderBottom: "2px solid rgba(201, 168, 76, 0.4)",
                      color: "var(--wine)",
                      fontWeight: 700,
                      fontSize: "0.72rem",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {signups.map((s, i) => (
                <tr key={i}>
                  <td
                    style={{
                      padding: "0.45rem 0.6rem",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    {s.name || "—"}
                  </td>
                  <td
                    style={{
                      padding: "0.45rem 0.6rem",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    {s.email}
                  </td>
                  <td
                    style={{
                      padding: "0.45rem 0.6rem",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    {s.phone || "—"}
                  </td>
                  <td
                    style={{
                      padding: "0.45rem 0.6rem",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {new Date(s.at).toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
