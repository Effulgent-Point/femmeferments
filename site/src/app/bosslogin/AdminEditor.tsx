"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import MediaPicker from "@/components/MediaPicker";
import {
  DEFAULT_CONTENT,
  mergeContent,
  type Content,
  type SectionId,
} from "@/lib/content";
import {
  Field,
  SectionTitle,
  StringList,
  MoveButtons,
  moveItem,
  RICH_TEXT_HINT,
  labelStyle,
  inputStyle,
  removeBtn,
  addBtn,
  cardStyle,
  sectionStyle,
  primaryBtn,
  ghostBtn,
} from "./fields";
import { ContactPanel } from "./panels/ContactPanel";
import { GalleryPanel } from "./panels/GalleryPanel";
import { DonatePanel } from "./panels/DonatePanel";
import { NewsPanel } from "./panels/NewsPanel";
import { TeamPanel } from "./panels/TeamPanel";

const SECTION_LABELS: Record<SectionId, string> = {
  vision: "The Vision",
  land: "The Land",
  wines: "The Wines",
  mission: "The Mission",
  community: "Community Roles",
  events: "The Event",
  partners: "Partners",
  contact: "Contact / Find Us",
  gallery: "Photo Gallery",
  donate: "Donate / Support",
  news: "News & Updates",
  team: "Team / People",
};

const PIECE_OPTIONS = [
  "01_left_outer_teal_points_tight.png",
  "02_left_top_teal_shards_tight.png",
  "03_left_mid_blue_green_tight.png",
  "04_left_lower_green_blue_tight.png",
  "05_lower_left_blue_tail_tight.png",
  "06_upper_mid_green_crown_tight.png",
  "07_mid_left_green_bridge_tight.png",
  "08_center_core_burst_tight.png",
  "09_lower_center_cyan_blue_tight.png",
  "10_upper_yellow_orange_tight.png",
  "11_right_upper_pink_orange_tight.png",
  "12_upper_right_purple_sail_tight.png",
  "13_right_mid_teal_glass_tight.png",
  "14_right_warm_red_orange_tight.png",
  "15_right_lower_blue_purple_tight.png",
  "16_far_right_red_tail_tight.png",
  "17_lower_right_purple_tail_tight.png",
  "18_bottom_center_teal_splinters_tight.png",
];

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

/* Field primitives (Field, SectionTitle, and the shared styles) come from
 * ./fields — the single source of truth also used by every section panel. */

type Phase = "loading" | "login" | "editing";

/* ---------------- editor ---------------- */
export default function AdminEditor() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [serverMode, setServerMode] = useState(false); // authed → can save/publish

  const [userInput, setUserInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [draft, setDraft] = useState<Content>(() => clone(DEFAULT_CONTENT));
  const [dirty, setDirty] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [justPublished, setJustPublished] = useState(false);

  async function refreshPublishedAt() {
    try {
      const res = await fetch("/api/publish", { cache: "no-store" });
      if (res.ok) setPublishedAt((await res.json()).publishedAt ?? null);
    } catch {
      /* leave as-is */
    }
  }

  async function loadDraft(): Promise<boolean> {
    try {
      const res = await fetch("/api/content", { cache: "no-store" });
      if (res.ok) {
        // Merge over baked defaults so a partial/hand-edited draft blob can't
        // white-screen the editor (mirrors the public render path).
        setDraft(mergeContent(await res.json()));
        setDirty(false);
        setLoadError(false);
        return true;
      }
      setLoadError(true);
      return false;
    } catch {
      setLoadError(true);
      return false;
    }
  }

  // Decide mode on mount: is the backend configured? are we authed?
  useEffect(() => {
    let alive = true;
    (async () => {
      let authed = false;
      let isConfigured = false;
      try {
        const res = await fetch("/api/auth/check", { cache: "no-store" });
        if (res.ok) {
          const j = await res.json();
          authed = Boolean(j.authed);
          isConfigured = Boolean(j.configured);
        }
      } catch {
        /* offline / not configured */
      }
      if (!alive) return;
      if (isConfigured && !authed) {
        setPhase("login");
      } else {
        if (authed) {
          setServerMode(true);
          await loadDraft();
          await refreshPublishedAt();
        }
        if (alive) setPhase("editing");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  function update(mutator: (d: Content) => void) {
    setDraft((prev) => {
      const next = clone(prev);
      mutator(next);
      return next;
    });
    setDirty(true);
    setJustPublished(false); // new edits aren't reflected in "published just now"
  }

  function formatPublishedAt(iso: string): string {
    try {
      return new Date(iso).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return iso;
    }
  }

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 4500);
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setLoginErr(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userInput, password: passInput }),
      });
      if (res.ok) {
        setServerMode(true);
        await loadDraft();
        await refreshPublishedAt();
        setPhase("editing");
      } else if (res.status === 503) {
        setPhase("editing"); // fall through to offline export mode
      } else if (res.status === 429) {
        setLoginErr("Too many attempts — try again in a few minutes.");
      } else {
        setLoginErr("Incorrect username or password.");
      }
    } catch {
      setLoginErr("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    setServerMode(false);
    setDraft(clone(DEFAULT_CONTENT));
    setDirty(false);
    setPhase("login");
  }

  // An expired session (401) mid-edit → bounce back to login rather than
  // showing a misleading "connection" error and silently losing work.
  function handleAuthExpiry(status: number): boolean {
    if (status === 401) {
      setServerMode(false);
      setPhase("login");
      flash("Session expired — please log in again.");
      return true;
    }
    return false;
  }

  async function putDraft(): Promise<{ ok: boolean; status: number }> {
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      return { ok: res.ok, status: res.status };
    } catch {
      return { ok: false, status: 0 };
    }
  }

  async function saveDraft(): Promise<boolean> {
    if (busy) return false;
    setBusy(true);
    try {
      const r = await putDraft();
      if (r.ok) {
        setDirty(false);
        flash("Draft saved.");
        return true;
      }
      if (handleAuthExpiry(r.status)) return false;
      flash("Save failed — check your connection.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  // Save + publish under a single busy window so a fast double-click can't fire
  // two concurrent save/publish sequences.
  async function publish() {
    if (busy) return;
    setBusy(true);
    try {
      const saved = await putDraft();
      if (!saved.ok) {
        if (!handleAuthExpiry(saved.status)) {
          flash("Save failed — check your connection.");
        }
        return;
      }
      setDirty(false);
      let res: Response;
      try {
        res = await fetch("/api/publish", { method: "POST" });
      } catch {
        flash("Publish failed.");
        return;
      }
      if (res.ok) {
        let ts: string | null = null;
        try {
          ts = (await res.json()).publishedAt ?? null;
        } catch {
          /* fall back to now */
        }
        setPublishedAt(ts ?? new Date().toISOString());
        setJustPublished(true);
        flash("Published — live in ~30 seconds.");
      } else if (!handleAuthExpiry(res.status)) {
        flash("Publish failed.");
      }
    } finally {
      setBusy(false);
    }
  }

  // Opens the live site rendered from the draft in a new tab. Opens the tab
  // synchronously (on the click, to dodge popup blockers), saves any unsaved
  // edits, then points it at /preview.
  async function preview() {
    if (busy) return;
    const w = window.open("", "_blank");
    if (dirty) {
      const ok = await saveDraft();
      if (!ok) {
        w?.close();
        return;
      }
    }
    if (w) {
      w.location.href = "/preview";
    } else if (!window.open("/preview", "_blank")) {
      flash("Pop-up blocked — allow pop-ups for this site to preview.");
    }
  }

  async function revert() {
    if (!confirm("Discard your edits and reload the last saved content?"))
      return;
    if (serverMode) {
      await loadDraft();
    } else {
      setDraft(clone(DEFAULT_CONTENT));
      setDirty(false);
    }
    flash("Reverted.");
  }

  function download() {
    const blob = new Blob([JSON.stringify(draft, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "content.json";
    a.click();
    URL.revokeObjectURL(url);
    flash("content.json downloaded.");
  }

  async function copyJson() {
    // clipboard.writeText rejects on denied permission / insecure context —
    // catch it so the click doesn't become an unhandled rejection with no
    // feedback to the user.
    try {
      await navigator.clipboard.writeText(JSON.stringify(draft, null, 2));
      flash("JSON copied to clipboard.");
    } catch {
      flash("Couldn’t copy — your browser blocked clipboard access.");
    }
  }

  /* ---- loading ---- */
  if (phase === "loading") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--parchment)" }}
      >
        <span
          style={{ fontFamily: "var(--font-sans)", color: "var(--ink-dim)" }}
        >
          Loading editor…
        </span>
      </div>
    );
  }

  /* ---- login ---- */
  if (phase === "login") {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "var(--parchment)" }}
      >
        <form
          onSubmit={login}
          style={{ ...sectionStyle, maxWidth: "380px", width: "100%" }}
        >
          <SectionTitle>Femme Ferments — Editor</SectionTitle>
          <Field
            label="Username"
            autoComplete="username"
            value={userInput}
            onChange={(v) => {
              setUserInput(v);
              setLoginErr(null);
            }}
          />
          <Field
            label="Password"
            type="password"
            autoComplete="current-password"
            value={passInput}
            onChange={(v) => {
              setPassInput(v);
              setLoginErr(null);
            }}
          />
          {loginErr && (
            <p
              role="alert"
              style={{
                color: "var(--wine)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.82rem",
                marginBottom: "0.75rem",
              }}
            >
              {loginErr}
            </p>
          )}
          <button type="submit" disabled={busy} style={primaryBtn}>
            {busy ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    );
  }

  /* ---- editing ---- */
  return (
    <div style={{ background: "var(--parchment)", minHeight: "100vh" }}>
      <div
        className="sticky top-0 z-10 flex items-center justify-between flex-wrap gap-3"
        style={{ background: "var(--wine)", padding: "0.9rem 1.25rem" }}
      >
        <div className="flex items-center gap-3">
          <span
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--cream)",
              fontSize: "1.1rem",
              fontWeight: 600,
            }}
          >
            Content Editor
          </span>
          {serverMode && (
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.68rem",
                color: justPublished
                  ? "var(--gold)"
                  : "rgba(250, 245, 235, 0.7)",
                fontWeight: justPublished ? 700 : 400,
              }}
            >
              {publishedAt
                ? (justPublished
                    ? "✓ Published just now · "
                    : "Last published ") + formatPublishedAt(publishedAt)
                : "Not published yet"}
            </span>
          )}
          {dirty && (
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.68rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--wine)",
                background: "var(--gold)",
                padding: "0.15rem 0.55rem",
                borderRadius: "99px",
                fontWeight: 700,
              }}
            >
              Unsaved
            </span>
          )}
          {!serverMode && (
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.64rem",
                letterSpacing: "0.04em",
                color: "rgba(250,245,235,0.7)",
              }}
            >
              offline — export only
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" onClick={revert} style={ghostBtn}>
            Revert
          </button>
          <button type="button" onClick={copyJson} style={ghostBtn}>
            Copy JSON
          </button>
          <button type="button" onClick={download} style={ghostBtn}>
            Download
          </button>
          {serverMode && (
            <>
              <button
                type="button"
                onClick={preview}
                disabled={busy || loadError}
                style={ghostBtn}
              >
                Preview
              </button>
              <button
                type="button"
                onClick={saveDraft}
                disabled={busy || loadError}
                style={ghostBtn}
              >
                Save draft
              </button>
              <button
                type="button"
                onClick={publish}
                disabled={busy || loadError}
                style={primaryBtn}
              >
                {busy ? "Working…" : "Publish"}
              </button>
              <button type="button" onClick={logout} style={ghostBtn}>
                Log out
              </button>
            </>
          )}
        </div>
      </div>

      <div
        className="mx-auto"
        style={{ maxWidth: "760px", padding: "1.5rem 1.25rem 5rem" }}
      >
        {serverMode ? (
          <div
            style={{
              background: "var(--cream)",
              border: "1px solid rgba(201, 168, 76, 0.4)",
              borderLeft: "3px solid var(--gold)",
              borderRadius: "8px",
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--wine)",
                marginBottom: "0.6rem",
              }}
            >
              How to edit &amp; publish
            </h2>
            <ol
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                lineHeight: 1.7,
                color: "var(--ink-dim)",
                paddingLeft: "1.15rem",
                margin: 0,
              }}
            >
              <li>
                Edit any text, and add photos with the upload buttons (wine
                labels, event poster, gallery, and more).
              </li>
              <li>
                Click <strong>Save draft</strong> — this saves your changes
                privately. Nothing is public yet, and you can keep working or
                come back later.
              </li>
              <li>
                Click <strong>Publish</strong> — this pushes your saved draft
                live to the website (visible in about 30 seconds).{" "}
                <em>Your changes are not on the site until you Publish.</em>
              </li>
            </ol>
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.78rem",
                color: "var(--ink-dim)",
                marginTop: "0.6rem",
              }}
            >
              The toolbar at the top shows when you last published, so you can
              always tell whether your latest changes are live.
            </div>
          </div>
        ) : (
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.85rem",
              lineHeight: 1.6,
              color: "var(--ink-dim)",
              marginBottom: "1.5rem",
            }}
          >
            The publishing backend isn&rsquo;t connected yet, so this is
            export-only: edit and <strong>Download</strong> the{" "}
            <code>content.json</code>. To enable one-click Publish, see{" "}
            <code>docs/cms-vercel-setup.md</code>.
          </p>
        )}

        {loadError && serverMode && (
          <div
            role="alert"
            className="flex items-center justify-between gap-3 flex-wrap"
            style={{
              background: "#fde8e8",
              border: "1px solid rgba(74, 14, 43, 0.25)",
              borderRadius: "8px",
              padding: "0.85rem 1rem",
              marginBottom: "1.5rem",
              fontFamily: "var(--font-sans)",
              fontSize: "0.85rem",
              color: "var(--wine)",
            }}
          >
            <span>
              Couldn&rsquo;t load your saved content. Reload before editing —
              saving now could overwrite it.
            </span>
            <button
              type="button"
              onClick={loadDraft}
              disabled={busy}
              style={{
                ...primaryBtn,
                flexShrink: 0,
              }}
            >
              Reload
            </button>
          </div>
        )}

        {/* SECTION MANAGER */}
        <section style={sectionStyle}>
          <SectionTitle>Sections</SectionTitle>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.82rem",
              color: "var(--ink-dim)",
              marginBottom: "1rem",
            }}
          >
            Turn sections on or off and drag them into order with the arrows.
            Off sections stay saved — they just don&rsquo;t show on the site.
          </p>
          <div className="flex flex-col gap-2">
            {draft.sectionLayout.map((entry, i) => (
              <div
                key={entry.id}
                className="flex items-center justify-between gap-3"
                style={{
                  ...cardStyle,
                  marginBottom: 0,
                  padding: "0.7rem 0.9rem",
                  opacity: entry.enabled ? 1 : 0.6,
                }}
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={entry.enabled}
                    onChange={() =>
                      update((d) => {
                        d.sectionLayout[i].enabled =
                          !d.sectionLayout[i].enabled;
                      })
                    }
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "var(--wine)",
                    }}
                  >
                    {SECTION_LABELS[entry.id]}
                  </span>
                  {!entry.enabled && (
                    <span
                      style={{
                        fontSize: "0.66rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "var(--ink-dim)",
                      }}
                    >
                      hidden
                    </span>
                  )}
                </label>
                <MoveButtons
                  onUp={() =>
                    update(
                      (d) =>
                        (d.sectionLayout = moveItem(d.sectionLayout, i, -1)),
                    )
                  }
                  onDown={() =>
                    update(
                      (d) =>
                        (d.sectionLayout = moveItem(d.sectionLayout, i, 1)),
                    )
                  }
                  isFirst={i === 0}
                  isLast={i === draft.sectionLayout.length - 1}
                />
              </div>
            ))}
          </div>
        </section>

        {/* VISION */}
        <section style={sectionStyle}>
          <SectionTitle>The Vision</SectionTitle>
          <Field
            label="Headline"
            value={draft.vision.headline}
            onChange={(v) => update((d) => (d.vision.headline = v))}
          />
          <Field
            label="Body"
            textarea
            rows={5}
            value={draft.vision.body}
            onChange={(v) => update((d) => (d.vision.body = v))}
            hint={RICH_TEXT_HINT}
          />
          <Field
            label="Pull quote"
            value={draft.vision.quote}
            onChange={(v) => update((d) => (d.vision.quote = v))}
          />
        </section>

        {/* VALLEY */}
        <section style={sectionStyle}>
          <SectionTitle>The Land</SectionTitle>
          <Field
            label="Headline"
            value={draft.valley.headline}
            onChange={(v) => update((d) => (d.valley.headline = v))}
          />
          <Field
            label="Body"
            textarea
            rows={5}
            value={draft.valley.body}
            onChange={(v) => update((d) => (d.valley.body = v))}
            hint={RICH_TEXT_HINT}
          />
          <span style={labelStyle}>Get-Involved Calls to Action</span>
          {draft.valley.ctas.map((cta, i) => (
            <div key={i} style={cardStyle}>
              <div className="flex justify-between items-center mb-2">
                <span style={labelStyle}>
                  Call to action {i + 1}
                  {cta.heading ? ` — ${cta.heading}` : ""}
                </span>
                <div className="flex items-center gap-2">
                  <MoveButtons
                    onUp={() =>
                      update(
                        (d) => (d.valley.ctas = moveItem(d.valley.ctas, i, -1)),
                      )
                    }
                    onDown={() =>
                      update(
                        (d) => (d.valley.ctas = moveItem(d.valley.ctas, i, 1)),
                      )
                    }
                    isFirst={i === 0}
                    isLast={i === draft.valley.ctas.length - 1}
                  />
                  <button
                    type="button"
                    onClick={() => update((d) => d.valley.ctas.splice(i, 1))}
                    style={removeBtn}
                    aria-label={`Remove call to action ${i + 1}`}
                  >
                    &times;
                  </button>
                </div>
              </div>
              <Field
                label="Small label"
                value={cta.label}
                onChange={(v) => update((d) => (d.valley.ctas[i].label = v))}
              />
              <Field
                label="Heading"
                value={cta.heading}
                onChange={(v) => update((d) => (d.valley.ctas[i].heading = v))}
              />
              <Field
                label="Description"
                textarea
                value={cta.description}
                onChange={(v) =>
                  update((d) => (d.valley.ctas[i].description = v))
                }
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              update((d) =>
                d.valley.ctas.push({ label: "", heading: "", description: "" }),
              )
            }
            style={addBtn}
          >
            + Add call to action
          </button>
        </section>

        {/* SECTION HEADINGS */}
        <section style={sectionStyle}>
          <SectionTitle>Section Headings</SectionTitle>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.82rem",
              color: "var(--ink-dim)",
              marginBottom: "1rem",
            }}
          >
            The title (and intro text) shown above each section of the site.
          </p>
          <div style={cardStyle}>
            <span style={labelStyle}>Wines section</span>
            <Field
              label="Heading"
              value={draft.sections.wines.heading}
              onChange={(v) => update((d) => (d.sections.wines.heading = v))}
            />
            <Field
              label="Intro"
              textarea
              value={draft.sections.wines.intro}
              onChange={(v) => update((d) => (d.sections.wines.intro = v))}
              hint={RICH_TEXT_HINT}
            />
          </div>
          <div style={cardStyle}>
            <span style={labelStyle}>Mission section</span>
            <Field
              label="Heading"
              value={draft.sections.mission.heading}
              onChange={(v) => update((d) => (d.sections.mission.heading = v))}
            />
            <Field
              label="Caption (under 100%)"
              value={draft.sections.mission.caption}
              onChange={(v) => update((d) => (d.sections.mission.caption = v))}
            />
          </div>
          <div style={cardStyle}>
            <span style={labelStyle}>Community section</span>
            <Field
              label="Heading"
              value={draft.sections.community.heading}
              onChange={(v) =>
                update((d) => (d.sections.community.heading = v))
              }
            />
            <Field
              label="Intro"
              textarea
              value={draft.sections.community.intro}
              onChange={(v) => update((d) => (d.sections.community.intro = v))}
              hint={RICH_TEXT_HINT}
            />
          </div>
          <div style={cardStyle}>
            <span style={labelStyle}>Events section</span>
            <Field
              label="Heading"
              value={draft.sections.events.heading}
              onChange={(v) => update((d) => (d.sections.events.heading = v))}
            />
          </div>
          <div style={cardStyle}>
            <span style={labelStyle}>Partners section</span>
            <Field
              label="Heading"
              value={draft.sections.partners.heading}
              onChange={(v) => update((d) => (d.sections.partners.heading = v))}
            />
          </div>
          <div style={cardStyle}>
            <span style={labelStyle}>Join section (bottom)</span>
            <Field
              label="Eyebrow"
              value={draft.sections.join.eyebrow}
              onChange={(v) => update((d) => (d.sections.join.eyebrow = v))}
            />
            <Field
              label="Heading"
              value={draft.sections.join.heading}
              onChange={(v) => update((d) => (d.sections.join.heading = v))}
            />
          </div>
        </section>

        {/* WINES */}
        <section style={sectionStyle}>
          <SectionTitle>The Wines</SectionTitle>
          {draft.wines.map((wine, i) => (
            <div key={i} style={cardStyle}>
              <div className="flex justify-between items-center mb-2">
                <span style={labelStyle}>Wine {i + 1}</span>
                <div className="flex items-center gap-2">
                  <MoveButtons
                    onUp={() =>
                      update((d) => (d.wines = moveItem(d.wines, i, -1)))
                    }
                    onDown={() =>
                      update((d) => (d.wines = moveItem(d.wines, i, 1)))
                    }
                    isFirst={i === 0}
                    isLast={i === draft.wines.length - 1}
                  />
                  <button
                    type="button"
                    onClick={() => update((d) => d.wines.splice(i, 1))}
                    style={removeBtn}
                    aria-label={`Remove wine ${i + 1}`}
                  >
                    &times;
                  </button>
                </div>
              </div>
              <Field
                label="Varietal"
                value={wine.varietal}
                onChange={(v) => update((d) => (d.wines[i].varietal = v))}
              />
              <Field
                label="Name"
                value={wine.name}
                onChange={(v) => update((d) => (d.wines[i].name = v))}
              />
              <Field
                label="Year"
                value={wine.year}
                onChange={(v) => update((d) => (d.wines[i].year = v))}
              />
              <Field
                label="Description"
                textarea
                value={wine.description}
                onChange={(v) => update((d) => (d.wines[i].description = v))}
              />
              <MediaPicker
                label="Label photo"
                value={wine.image}
                onChange={(url) => update((d) => (d.wines[i].image = url))}
              />
              <label className="flex items-center gap-2 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={!!wine.soldOut}
                  onChange={() =>
                    update((d) => (d.wines[i].soldOut = !d.wines[i].soldOut))
                  }
                />
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--wine)",
                  }}
                >
                  Sold out
                </span>
              </label>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              update((d) =>
                d.wines.push({
                  varietal: "",
                  name: "",
                  year: "",
                  description: "",
                  image: "",
                  soldOut: false,
                }),
              )
            }
            style={addBtn}
          >
            + Add wine
          </button>
        </section>

        {/* ROLES */}
        <section style={sectionStyle}>
          <SectionTitle>Community Roles</SectionTitle>
          {draft.roles.map((role, i) => (
            <div key={role.id || i} style={cardStyle}>
              <div className="flex justify-between items-center mb-2">
                <span style={labelStyle}>
                  No. {role.number} — {role.title || "Untitled"}
                </span>
                <div className="flex items-center gap-2">
                  <MoveButtons
                    onUp={() =>
                      update((d) => (d.roles = moveItem(d.roles, i, -1)))
                    }
                    onDown={() =>
                      update((d) => (d.roles = moveItem(d.roles, i, 1)))
                    }
                    isFirst={i === 0}
                    isLast={i === draft.roles.length - 1}
                  />
                  <button
                    type="button"
                    onClick={() => update((d) => d.roles.splice(i, 1))}
                    style={removeBtn}
                    aria-label={`Remove role ${i + 1}`}
                  >
                    &times;
                  </button>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <Image
                  src={`/glass-assets/tight_png/${role.piece}`}
                  alt=""
                  width={64}
                  height={64}
                  style={{
                    objectFit: "contain",
                    flexShrink: 0,
                    height: "auto",
                  }}
                />
                <div className="flex-1">
                  <label className="block mb-4">
                    <span style={labelStyle}>Glass piece</span>
                    <select
                      value={role.piece}
                      onChange={(e) =>
                        update((d) => (d.roles[i].piece = e.target.value))
                      }
                      style={inputStyle}
                    >
                      {PIECE_OPTIONS.map((p) => (
                        <option key={p} value={p}>
                          {p.replace("_tight.png", "").replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Number"
                  value={role.number}
                  onChange={(v) => update((d) => (d.roles[i].number = v))}
                />
                <Field
                  label="Title"
                  value={role.title}
                  onChange={(v) => update((d) => (d.roles[i].title = v))}
                />
              </div>
              <Field
                label="Description"
                textarea
                value={role.description}
                onChange={(v) => update((d) => (d.roles[i].description = v))}
              />
              <StringList
                label="What You'll Do"
                values={role.tasks}
                onChange={(v) => update((d) => (d.roles[i].tasks = v))}
              />
              <StringList
                label="What We Provide"
                values={role.perks}
                onChange={(v) => update((d) => (d.roles[i].perks = v))}
              />
              <Field
                label="Time commitment"
                value={role.time}
                onChange={(v) => update((d) => (d.roles[i].time = v))}
              />
            </div>
          ))}
        </section>

        {/* HOW IT WORKS */}
        <section style={sectionStyle}>
          <SectionTitle>How It Works</SectionTitle>
          {draft.flowSteps.map((step, i) => (
            <div key={i} style={cardStyle}>
              <div className="flex justify-between items-center mb-2">
                <span style={labelStyle}>Step {i + 1}</span>
                <div className="flex items-center gap-2">
                  <MoveButtons
                    onUp={() =>
                      update(
                        (d) => (d.flowSteps = moveItem(d.flowSteps, i, -1)),
                      )
                    }
                    onDown={() =>
                      update((d) => (d.flowSteps = moveItem(d.flowSteps, i, 1)))
                    }
                    isFirst={i === 0}
                    isLast={i === draft.flowSteps.length - 1}
                  />
                  <button
                    type="button"
                    onClick={() => update((d) => d.flowSteps.splice(i, 1))}
                    style={removeBtn}
                    aria-label={`Remove step ${i + 1}`}
                  >
                    &times;
                  </button>
                </div>
              </div>
              <Field
                label="Title"
                value={step.title}
                onChange={(v) => update((d) => (d.flowSteps[i].title = v))}
              />
              <Field
                label="Description"
                textarea
                value={step.description}
                onChange={(v) =>
                  update((d) => (d.flowSteps[i].description = v))
                }
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              update((d) => d.flowSteps.push({ title: "", description: "" }))
            }
            style={addBtn}
          >
            + Add step
          </button>
        </section>

        {/* EVENT */}
        <section style={sectionStyle}>
          <SectionTitle>The Event</SectionTitle>
          <Field
            label="Title"
            value={draft.event.title}
            onChange={(v) => update((d) => (d.event.title = v))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Date"
              value={draft.event.date}
              onChange={(v) => update((d) => (d.event.date = v))}
            />
            <Field
              label="Location"
              value={draft.event.location}
              onChange={(v) => update((d) => (d.event.location = v))}
            />
          </div>
          <StringList
            label="Detail lines"
            values={draft.event.details}
            onChange={(v) => update((d) => (d.event.details = v))}
          />
          <Field
            label="Description"
            textarea
            value={draft.event.description}
            onChange={(v) => update((d) => (d.event.description = v))}
          />
          <MediaPicker
            label="Event poster / flyer"
            value={draft.event.poster}
            onChange={(url) => update((d) => (d.event.poster = url))}
          />
        </section>

        {/* PARTNERS */}
        <section style={sectionStyle}>
          <SectionTitle>Partners</SectionTitle>
          <StringList
            label="Partner names"
            values={draft.partners}
            onChange={(v) => update((d) => (d.partners = v))}
          />
        </section>

        {/* ---- Optional / new sections (toggle them on in "Sections" above) ---- */}
        <section style={sectionStyle}>
          <SectionTitle>Contact / Find Us</SectionTitle>
          <Field
            label="Section heading"
            value={draft.sections.contact.heading}
            onChange={(v) => update((d) => (d.sections.contact.heading = v))}
          />
          <ContactPanel
            data={draft.contact}
            onChange={(next) => update((d) => (d.contact = next))}
          />
        </section>

        <section style={sectionStyle}>
          <SectionTitle>Photo Gallery</SectionTitle>
          <Field
            label="Section heading"
            value={draft.sections.gallery.heading}
            onChange={(v) => update((d) => (d.sections.gallery.heading = v))}
          />
          <GalleryPanel
            data={draft.gallery}
            onChange={(next) => update((d) => (d.gallery = next))}
          />
        </section>

        <section style={sectionStyle}>
          <SectionTitle>Donate / Support</SectionTitle>
          <Field
            label="Section heading"
            value={draft.sections.donate.heading}
            onChange={(v) => update((d) => (d.sections.donate.heading = v))}
          />
          <DonatePanel
            data={draft.donate}
            onChange={(next) => update((d) => (d.donate = next))}
          />
        </section>

        <section style={sectionStyle}>
          <SectionTitle>News &amp; Updates</SectionTitle>
          <Field
            label="Section heading"
            value={draft.sections.news.heading}
            onChange={(v) => update((d) => (d.sections.news.heading = v))}
          />
          <NewsPanel
            data={draft.news}
            onChange={(next) => update((d) => (d.news = next))}
          />
        </section>

        <section style={sectionStyle}>
          <SectionTitle>Team / People</SectionTitle>
          <Field
            label="Section heading"
            value={draft.sections.team.heading}
            onChange={(v) => update((d) => (d.sections.team.heading = v))}
          />
          <TeamPanel
            data={draft.team}
            onChange={(next) => update((d) => (d.team = next))}
          />
        </section>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed left-1/2 -translate-x-1/2"
          style={{
            bottom: "1.5rem",
            background: "var(--ink)",
            color: "var(--cream)",
            padding: "0.7rem 1.3rem",
            borderRadius: "99px",
            fontFamily: "var(--font-sans)",
            fontSize: "0.85rem",
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
