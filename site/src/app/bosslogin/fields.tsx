"use client";

/* Shared editor UI primitives — used by AdminEditor and every section panel. */

export const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-sans)",
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--gold-text)",
  marginBottom: "0.4rem",
};
export const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.75rem",
  border: "1px solid rgba(74, 14, 43, 0.22)",
  background: "#fff",
  borderRadius: "6px",
  fontFamily: "var(--font-sans)",
  fontSize: "0.9rem",
  color: "var(--ink)",
};
export const removeBtn: React.CSSProperties = {
  flexShrink: 0,
  width: "38px",
  border: "1px solid rgba(74, 14, 43, 0.22)",
  background: "#fff",
  borderRadius: "6px",
  color: "var(--wine)",
  fontSize: "1.1rem",
  cursor: "pointer",
};
export const iconBtn: React.CSSProperties = {
  flexShrink: 0,
  width: "30px",
  height: "30px",
  border: "1px solid rgba(74, 14, 43, 0.22)",
  background: "#fff",
  borderRadius: "6px",
  color: "var(--wine)",
  fontSize: "0.85rem",
  cursor: "pointer",
  lineHeight: 1,
};
export const addBtn: React.CSSProperties = {
  marginTop: "0.5rem",
  padding: "0.4rem 0.9rem",
  border: "1px dashed rgba(201, 168, 76, 0.6)",
  background: "transparent",
  borderRadius: "6px",
  color: "var(--gold-text)",
  fontFamily: "var(--font-sans)",
  fontSize: "0.78rem",
  fontWeight: 600,
  cursor: "pointer",
};
export const cardStyle: React.CSSProperties = {
  background: "var(--cream)",
  border: "1px solid rgba(74, 14, 43, 0.14)",
  borderRadius: "10px",
  padding: "1.25rem",
  marginBottom: "1rem",
};
export const sectionStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(74, 14, 43, 0.1)",
  borderRadius: "12px",
  padding: "1.5rem",
  marginBottom: "1.5rem",
};
export const primaryBtn: React.CSSProperties = {
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
export const ghostBtn: React.CSSProperties = {
  padding: "0.55rem 1rem",
  background: "transparent",
  color: "var(--cream)",
  border: "1px solid rgba(250, 245, 235, 0.4)",
  borderRadius: "6px",
  fontFamily: "var(--font-sans)",
  fontSize: "0.8rem",
  fontWeight: 600,
  cursor: "pointer",
};

/** Immutably move item at `i` up (-1) or down (+1); returns a new array. */
export function moveItem<T>(arr: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

export function Field({
  label,
  value,
  onChange,
  textarea,
  rows = 3,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block mb-4">
      <span style={labelStyle}>{label}</span>
      {textarea ? (
        <textarea
          value={value}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
        />
      ) : (
        <input
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      )}
    </label>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-serif)",
        color: "var(--wine)",
        fontSize: "1.4rem",
        fontWeight: 600,
        marginBottom: "1rem",
      }}
    >
      {children}
    </h2>
  );
}

/** Up/down reorder controls for a list item. */
export function MoveButtons({
  onUp,
  onDown,
  isFirst,
  isLast,
}: {
  onUp: () => void;
  onDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <span className="flex gap-1">
      <button
        type="button"
        onClick={onUp}
        disabled={isFirst}
        aria-label="Move up"
        style={{ ...iconBtn, opacity: isFirst ? 0.35 : 1 }}
      >
        &uarr;
      </button>
      <button
        type="button"
        onClick={onDown}
        disabled={isLast}
        aria-label="Move down"
        style={{ ...iconBtn, opacity: isLast ? 0.35 : 1 }}
      >
        &darr;
      </button>
    </span>
  );
}

export function StringList({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="mb-4">
      <span style={labelStyle}>{label}</span>
      <div className="flex flex-col gap-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={v}
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                onChange(next);
              }}
              style={inputStyle}
            />
            <MoveButtons
              onUp={() => onChange(moveItem(values, i, -1))}
              onDown={() => onChange(moveItem(values, i, 1))}
              isFirst={i === 0}
              isLast={i === values.length - 1}
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              aria-label={`Remove item ${i + 1}`}
              style={removeBtn}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...values, ""])}
        style={addBtn}
      >
        + Add
      </button>
    </div>
  );
}
