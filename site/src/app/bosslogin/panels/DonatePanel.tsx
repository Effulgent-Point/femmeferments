"use client";

import type { DonateData, DonateTier } from "@/lib/content";
import {
  Field,
  MoveButtons,
  addBtn,
  cardStyle,
  labelStyle,
  moveItem,
  removeBtn,
} from "../fields";

export function DonatePanel({
  data,
  onChange,
}: {
  data: DonateData;
  onChange: (next: DonateData) => void;
}) {
  const tiers = data.tiers ?? [];

  function updateTier(i: number, patch: Partial<DonateTier>) {
    onChange({
      ...data,
      tiers: tiers.map((t, j) => (j === i ? { ...t, ...patch } : t)),
    });
  }

  return (
    <>
      <Field
        label="Intro"
        textarea
        value={data.intro}
        onChange={(v) => onChange({ ...data, intro: v })}
      />

      {tiers.map((tier, i) => (
        <div key={i} style={cardStyle}>
          <div className="flex justify-between items-center mb-2">
            <span style={labelStyle}>
              Tier {i + 1}
              {tier.amount ? ` — ${tier.amount}` : ""}
            </span>
            <span className="flex gap-1 items-center">
              <MoveButtons
                onUp={() =>
                  onChange({ ...data, tiers: moveItem(tiers, i, -1) })
                }
                onDown={() =>
                  onChange({ ...data, tiers: moveItem(tiers, i, 1) })
                }
                isFirst={i === 0}
                isLast={i === tiers.length - 1}
              />
              <button
                type="button"
                onClick={() =>
                  onChange({ ...data, tiers: tiers.filter((_, j) => j !== i) })
                }
                style={removeBtn}
                aria-label={`Remove tier ${i + 1}`}
              >
                &times;
              </button>
            </span>
          </div>
          <Field
            label="Amount"
            value={tier.amount}
            onChange={(v) => updateTier(i, { amount: v })}
          />
          <Field
            label="Description"
            textarea
            value={tier.description}
            onChange={(v) => updateTier(i, { description: v })}
          />
          <Field
            label="Button text"
            value={tier.cta}
            onChange={(v) => updateTier(i, { cta: v })}
          />
          <Field
            label="Link"
            value={tier.href}
            onChange={(v) => updateTier(i, { href: v })}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange({
            ...data,
            tiers: [
              ...tiers,
              { amount: "", description: "", cta: "", href: "#" },
            ],
          })
        }
        style={addBtn}
      >
        + Add tier
      </button>

      <div className="mt-4">
        <Field
          label="Note"
          textarea
          value={data.note}
          onChange={(v) => onChange({ ...data, note: v })}
        />
      </div>
    </>
  );
}
