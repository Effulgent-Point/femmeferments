# CMS — Static / Portable Version (for a future free host)

This documents the **static build** of the Femme Ferments content editor, to switch to
if/when the site moves off Vercel onto a free nonprofit host (GitHub Pages,
Cloudflare Pages, Netlify, a donated Apache/cPanel box, etc.).

It is the counterpart to the **Vercel version** (`docs/cms-vercel-setup.md`), which
uses Vercel Blob + serverless routes for instant, in-app publishing. Read that first
for how the live version works; this doc only describes what changes.

---

## Why a separate version

The Vercel version's public site fetches `GET /api/published` **at runtime** from a
serverless function backed by Vercel Blob. A pure-static host has **no server** to run
that function, so that fetch has nothing to answer it. The static version removes the
runtime dependency: **content is baked into the build**, so the deployed output is
plain HTML/CSS/JS that runs anywhere.

Trade-off vs the Vercel version:

| | Vercel version | Static version |
|---|---|---|
| Publish latency | ~30s (edge cache) | ~40–90s (rebuild) |
| Runtime backend | serverless `/api/published` + Blob | none — fully static |
| Portability | Vercel (or any Node host) | **any** static host |
| Content lives in | Vercel Blob | `src/data/content.json` in git |
| History / rollback | Blob versions | git history (free) |

---

## Architecture

```
Editor (/bosslogin)  ──save──▶  content.json in the git repo
                                    │
                              git push / commit
                                    │
                          CI build (next build)  ──bakes content──▶  static out/
                                    │
                             deploy to static host
                                    │
                         Public site reads baked content (no fetch)
```

The public site imports `content.json` at build time (exactly as it does today in
`src/data/content.json`), so there is **no `useContent`/`/api/published` fetch** in the
static build — the runtime content layer is compiled away.

---

## What changes from the Vercel version

The editor UI, the content schema, and every page/component are **unchanged**. Only the
persistence + publish plumbing swaps out. Concretely:

1. **Public read path** — In the Vercel version, `src/app/page.tsx` reads the
   published blob server-side (`readPublished()`) and passes it to `LiveSite` as a
   prop. In the static version, drop the Blob read and hand `LiveSite` the baked
   import instead: `<LiveSite content={DEFAULT_CONTENT} />` (and remove
   `export const dynamic`). `LiveSite` itself is already a pure presentational
   component that takes `content` as a prop, so it needs no change — nor do the
   optional-prop components (`WineCards`, `SpecimenCards`, `FlowSteps`, `EventCard`,
   `PartnerMarquee`), which already default to the baked import.
   - Delete `src/app/preview/page.tsx` + `src/components/PreviewBanner.tsx` (preview
     needs `readDraft` + server auth, so it can't survive static export). Remove the
     Preview button from `AdminEditor`.

2. **Save/publish path** — Repoint "Save" and "Publish" in `AdminEditor` from the Blob
   routes to a **git commit** of `src/data/content.json`. Two ways to run the commit:
   - **(A) Local editor run** (simplest, zero hosting): the maintainer runs the admin
     app locally (`npm run dev`), edits, and the editor writes `src/data/content.json`
     directly via a small dev-only route, then they `git commit && git push`. CI rebuilds.
   - **(B) One serverless function** on a host that allows it (Cloudflare Pages
     Functions, Netlify Functions): a single `commit-content` function uses the GitHub
     API to write `content.json` and push. Everything else stays static.

3. **Auth** — No always-on server to verify a JWT. Options:
   - Local editor run (A): no public auth needed — it only runs on the maintainer's
     machine.
   - Single function (B): gate that one function with a shared secret / GitHub token in
     the host's env.

4. **Config** — Remove `@vercel/blob` usage; delete `src/app/api/{content,publish,
   published}` routes, `src/app/preview/`, and `src/lib/blobStore.ts`. Add `output: "export"` +
   `images: { unoptimized: true }` in `next.config.ts` (already documented there) so
   `next build` emits a static `out/`.

---

## Migration checklist (Vercel → static)

Estimated ~1 hour.

- [ ] `next.config.ts`: uncomment `output: "export"` and `images: { unoptimized: true }`.
- [ ] `page.tsx`: drop `readPublished()` + `export const dynamic`; render `<LiveSite content={DEFAULT_CONTENT} />`.
- [ ] Delete `src/app/api/content`, `src/app/api/publish`, `src/app/api/published`, `src/app/api/auth/*`, and `src/app/preview/`.
- [ ] Delete `src/lib/blobStore.ts`; keep `src/lib/deepMerge.ts` only if still used.
- [ ] `AdminEditor`: swap Save/Publish to the git-commit path (A or B above); drop the JWT login if using local-run (A).
- [ ] Remove deps: `@vercel/blob`, `bcryptjs`, `jsonwebtoken` (if using local-run auth).
- [ ] `npm run build` → confirm a static `out/` is produced with content baked in.
- [ ] Point the static host at `out/`; set up CI to rebuild on push to `content.json`.
- [ ] Spot-check images in `out/` (unoptimized export ships the source files).

---

## Why not just build the static version now

Because the site is on Vercel today and the sibling project (YCSC, same org/client) already
runs the Blob pattern — instant in-app publish with no rebuild and a login Karen already
knows. The static version is strictly a **portability fallback**; keeping this doc means
the switch is a mechanical hour, not a redesign, whenever a free host is chosen.
