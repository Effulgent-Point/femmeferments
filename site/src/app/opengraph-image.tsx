import { ImageResponse } from "next/og";

export const alt = "Femme Ferments — Beauty in the Broken Glass";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Statically generated at build time (no request-time APIs used below), so
// this incurs no runtime cost and is safe for a static-export deployment.
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #2c1c12 0%, #4a0e2b 55%, #2c1c12 100%)",
        padding: "80px",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 40,
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "#c9a84c",
          marginBottom: 28,
        }}
      >
        Femme Ferments
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 78,
          fontWeight: 600,
          color: "#faf5eb",
          textAlign: "center",
          lineHeight: 1.15,
          maxWidth: 980,
        }}
      >
        Beauty in the Broken Glass
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 30,
          color: "#e8c97a",
          marginTop: 36,
          textAlign: "center",
        }}
      >
        Willamette Valley, Oregon — 100% of profits empower women
      </div>
    </div>,
    {
      ...size,
    },
  );
}
