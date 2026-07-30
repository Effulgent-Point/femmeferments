"use client";

import MediaPicker from "@/components/MediaPicker";
import type { GalleryData, GalleryImage } from "@/lib/content";
import {
  Field,
  cardStyle,
  addBtn,
  removeBtn,
  MoveButtons,
  moveItem,
  RICH_TEXT_HINT,
} from "../fields";

export function GalleryPanel({
  data,
  onChange,
}: {
  data: GalleryData;
  onChange: (next: GalleryData) => void;
}) {
  const images = data.images ?? [];

  function updateImages(next: GalleryImage[]) {
    onChange({ ...data, images: next });
  }

  function updateImage(i: number, patch: Partial<GalleryImage>) {
    updateImages(
      images.map((img, j) => (j === i ? { ...img, ...patch } : img)),
    );
  }

  return (
    <div>
      <Field
        label="Intro"
        value={data.intro}
        onChange={(v) => onChange({ ...data, intro: v })}
        textarea
        hint={RICH_TEXT_HINT}
      />

      {images.map((img, i) => (
        <div key={i} style={cardStyle}>
          <MediaPicker
            label="Image"
            value={img.url}
            onChange={(url) => updateImage(i, { url })}
          />
          <Field
            label="Caption"
            value={img.caption ?? ""}
            onChange={(v) => updateImage(i, { caption: v })}
          />
          <div className="flex items-center gap-2">
            <MoveButtons
              onUp={() => updateImages(moveItem(images, i, -1))}
              onDown={() => updateImages(moveItem(images, i, 1))}
              isFirst={i === 0}
              isLast={i === images.length - 1}
            />
            <button
              type="button"
              onClick={() => updateImages(images.filter((_, j) => j !== i))}
              aria-label={`Remove image ${i + 1}`}
              style={removeBtn}
            >
              &times;
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => updateImages([...images, { url: "", caption: "" }])}
        style={addBtn}
      >
        + Add image
      </button>
    </div>
  );
}
