"use client";

import { Field, RICH_TEXT_HINT } from "../fields";
import type { ContactData } from "@/lib/content";

export function ContactPanel({
  data,
  onChange,
}: {
  data: ContactData;
  onChange: (next: ContactData) => void;
}) {
  return (
    <div>
      <Field
        label="Intro"
        value={data.intro}
        onChange={(v) => onChange({ ...data, intro: v })}
        textarea
        hint={RICH_TEXT_HINT}
      />
      <Field
        label="Email"
        type="email"
        value={data.email}
        onChange={(v) => onChange({ ...data, email: v })}
      />
      <Field
        label="Phone"
        type="tel"
        value={data.phone}
        onChange={(v) => onChange({ ...data, phone: v })}
      />
      <Field
        label="Address"
        value={data.address}
        onChange={(v) => onChange({ ...data, address: v })}
        textarea
        rows={2}
      />
      <Field
        label="Instagram URL"
        value={data.instagram}
        onChange={(v) => onChange({ ...data, instagram: v })}
      />
      <Field
        label="Facebook URL"
        value={data.facebook}
        onChange={(v) => onChange({ ...data, facebook: v })}
      />
      <Field
        label="Google Map embed URL"
        value={data.mapEmbed}
        onChange={(v) => onChange({ ...data, mapEmbed: v })}
        textarea
        rows={2}
      />
      <p
        style={{
          marginTop: "-0.6rem",
          fontFamily: "var(--font-sans)",
          fontSize: "0.72rem",
          color: "var(--ink-dim)",
          lineHeight: 1.5,
        }}
      >
        Paste the <code>src</code> URL from the iframe Google Maps gives you
        under Share &rarr; Embed a map.
      </p>
    </div>
  );
}
