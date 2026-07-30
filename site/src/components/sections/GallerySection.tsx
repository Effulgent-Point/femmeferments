import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import RichText from "@/components/RichText";
import type { GalleryData } from "@/lib/content";

export default function GallerySection({
  data,
  heading,
  chapter,
  bg,
}: {
  data: GalleryData;
  heading: string;
  chapter?: string;
  bg?: "cream" | "parchment" | "parchment-deep";
}) {
  const images = data.images ?? [];

  return (
    <Section id="gallery" bg={bg} chapter={chapter}>
      <SectionHeading>{heading}</SectionHeading>

      {data.intro ? (
        <p
          className="max-w-[640px] mx-auto leading-relaxed"
          style={{
            color: "var(--ink-dim)",
            fontFamily: "var(--font-sans)",
          }}
        >
          <RichText>{data.intro}</RichText>
        </p>
      ) : null}

      {images.length > 0 ? (
        <div
          className="grid gap-6 w-full max-w-[1100px] mx-auto mt-10"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          }}
        >
          {images.map((img, i) => (
            <figure key={i} className="m-0">
              {/* Proxied /api/media URL — next/image is not used here. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.caption || "Photo from Femme Ferments"}
                loading="lazy"
                className="w-full block"
                style={{
                  aspectRatio: "4 / 3",
                  objectFit: "cover",
                  borderRadius: "10px",
                  border: "1px solid rgba(201, 168, 76, 0.3)",
                  boxShadow: "0 6px 28px rgba(44, 28, 18, 0.12)",
                }}
              />
              {img.caption ? (
                <figcaption
                  className="mt-3 leading-relaxed"
                  style={{
                    color: "var(--ink-dim)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.82rem",
                  }}
                >
                  {img.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : null}
    </Section>
  );
}
