"use client";

import { useCallback, useState } from "react";

/* ---------------- shared editor styling ----------------
   Mirrors the tokens/patterns in bosslogin/AdminEditor.tsx so the picker sits
   inside a content field without looking foreign. */
const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-sans)",
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--gold-text)",
  marginBottom: "0.4rem",
};
const primaryBtn: React.CSSProperties = {
  padding: "0.55rem 1.1rem",
  background: "var(--gold)",
  color: "var(--ink)",
  border: "none",
  borderRadius: "6px",
  fontFamily: "var(--font-sans)",
  fontSize: "0.8rem",
  fontWeight: 700,
  letterSpacing: "0.04em",
  cursor: "pointer",
};
const ghostBtn: React.CSSProperties = {
  padding: "0.5rem 0.9rem",
  background: "transparent",
  color: "var(--wine)",
  border: "1px solid rgba(74, 14, 43, 0.22)",
  borderRadius: "6px",
  fontFamily: "var(--font-sans)",
  fontSize: "0.8rem",
  fontWeight: 600,
  cursor: "pointer",
};
const panelStyle: React.CSSProperties = {
  marginTop: "0.75rem",
  background: "var(--cream)",
  border: "1px solid rgba(74, 14, 43, 0.14)",
  borderRadius: "10px",
  padding: "1rem",
};
const thumbStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

type MediaImage = { pathname: string; url: string; uploadedAt: string };

export default function MediaPicker({
  value,
  onChange,
  label,
}: {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<MediaImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/media", { cache: "no-store" });
      if (!res.ok) throw new Error("Could not load the media library.");
      const data = (await res.json()) as { images?: MediaImage[] };
      setImages(data.images ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load images.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle the panel; on open, kick off a library load (a direct result of the
  // click, so it lives here rather than in an effect).
  function togglePanel() {
    const next = !open;
    setOpen(next);
    if (next) loadImages();
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/media", { method: "POST", body: form });
      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Upload failed.");
      }
      onChange(data.url);
      await loadImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(img: MediaImage) {
    setError(null);
    try {
      const res = await fetch(
        `/api/media?pathname=${encodeURIComponent(img.pathname)}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error("Could not delete the image.");
      // Clear the field if the deleted image was the selected one.
      if (value === img.url) onChange("");
      setImages((prev) => prev.filter((i) => i.pathname !== img.pathname));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  return (
    <div className="mb-4">
      {label ? <span style={labelStyle}>{label}</span> : null}

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div
          style={{
            width: "72px",
            height: "72px",
            flexShrink: 0,
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid rgba(74, 14, 43, 0.18)",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Selected image preview" style={thumbStyle} />
          ) : (
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.68rem",
                color: "var(--ink-dim)",
                textAlign: "center",
                padding: "0 0.35rem",
              }}
            >
              No image
            </span>
          )}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={togglePanel}
            aria-expanded={open}
            style={primaryBtn}
          >
            {open ? "Close" : "Choose image"}
          </button>
          {value ? (
            <button type="button" onClick={() => onChange("")} style={ghostBtn}>
              Remove
            </button>
          ) : null}
        </div>
      </div>

      {open ? (
        <div style={panelStyle}>
          <label style={{ display: "block", marginBottom: "0.75rem" }}>
            <span style={labelStyle}>Upload a new image</span>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                e.target.value = "";
              }}
              aria-label="Upload a new image"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                color: "var(--ink)",
              }}
            />
          </label>

          {uploading ? (
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.8rem",
                color: "var(--ink-dim)",
              }}
            >
              Uploading…
            </p>
          ) : null}

          {error ? (
            <p
              role="alert"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.8rem",
                color: "var(--wine)",
              }}
            >
              {error}
            </p>
          ) : null}

          <span style={labelStyle}>Media library</span>
          {loading ? (
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.8rem",
                color: "var(--ink-dim)",
              }}
            >
              Loading…
            </p>
          ) : images.length === 0 ? (
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.8rem",
                color: "var(--ink-dim)",
              }}
            >
              No images uploaded yet.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(84px, 1fr))",
                gap: "0.6rem",
              }}
            >
              {images.map((img) => {
                const selected = value === img.url;
                return (
                  <div key={img.pathname} style={{ position: "relative" }}>
                    <button
                      type="button"
                      onClick={() => onChange(img.url)}
                      aria-label={`Select image ${img.pathname.replace("media/", "")}`}
                      aria-pressed={selected}
                      style={{
                        display: "block",
                        width: "100%",
                        aspectRatio: "1 / 1",
                        padding: 0,
                        borderRadius: "8px",
                        overflow: "hidden",
                        cursor: "pointer",
                        background: "#fff",
                        border: selected
                          ? "2px solid var(--gold)"
                          : "1px solid rgba(74, 14, 43, 0.18)",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.pathname.replace("media/", "")}
                        style={thumbStyle}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(img)}
                      aria-label={`Delete image ${img.pathname.replace("media/", "")}`}
                      style={{
                        position: "absolute",
                        top: "3px",
                        right: "3px",
                        width: "22px",
                        height: "22px",
                        lineHeight: 1,
                        padding: 0,
                        borderRadius: "5px",
                        border: "none",
                        background: "rgba(74, 14, 43, 0.82)",
                        color: "var(--cream)",
                        fontSize: "0.95rem",
                        cursor: "pointer",
                      }}
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
