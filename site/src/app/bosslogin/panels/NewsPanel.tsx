"use client";

import type { NewsData } from "@/lib/content";
import {
  Field,
  MoveButtons,
  addBtn,
  cardStyle,
  labelStyle,
  moveItem,
  removeBtn,
  RICH_TEXT_HINT,
} from "../fields";

export function NewsPanel({
  data,
  onChange,
}: {
  data: NewsData;
  onChange: (next: NewsData) => void;
}) {
  const items = data.items ?? [];

  function setItems(next: NewsData["items"]) {
    onChange({ ...data, items: next });
  }

  return (
    <>
      <Field
        label="Intro"
        textarea
        value={data.intro}
        onChange={(v) => onChange({ ...data, intro: v })}
        hint={RICH_TEXT_HINT}
      />

      {items.map((item, i) => (
        <div key={i} style={cardStyle}>
          <div className="flex justify-between items-center mb-2">
            <span style={labelStyle}>
              Update {i + 1}
              {item.title ? ` — ${item.title}` : ""}
            </span>
            <span className="flex gap-1 items-center">
              <MoveButtons
                onUp={() => setItems(moveItem(items, i, -1))}
                onDown={() => setItems(moveItem(items, i, 1))}
                isFirst={i === 0}
                isLast={i === items.length - 1}
              />
              <button
                type="button"
                onClick={() => setItems(items.filter((_, j) => j !== i))}
                aria-label={`Remove update ${i + 1}`}
                style={removeBtn}
              >
                &times;
              </button>
            </span>
          </div>
          <Field
            label="Date"
            type="date"
            value={item.date}
            onChange={(v) =>
              setItems(
                items.map((it, j) => (j === i ? { ...it, date: v } : it)),
              )
            }
          />
          <Field
            label="Title"
            value={item.title}
            onChange={(v) =>
              setItems(
                items.map((it, j) => (j === i ? { ...it, title: v } : it)),
              )
            }
          />
          <Field
            label="Body"
            textarea
            value={item.body}
            onChange={(v) =>
              setItems(
                items.map((it, j) => (j === i ? { ...it, body: v } : it)),
              )
            }
            hint={RICH_TEXT_HINT}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() => setItems([...items, { date: "", title: "", body: "" }])}
        style={addBtn}
      >
        + Add update
      </button>
    </>
  );
}
