# Session Summary — 2026-07-05/06

Production: https://site-zeta-topaz-83.vercel.app

## What was done

### Root-cause fixes for recurring visual bugs
- **Off-center hero / dead spacing site-wide**: `globals.css` had an unlayered `* { margin: 0; padding: 0 }` reset. Tailwind v4 emits utilities in `@layer utilities`, and unlayered CSS beats layered CSS — so `mx-auto` and every margin/padding utility silently did nothing. Removed the reset (Tailwind preflight covers it).
- **Squished glass mosaic (concepts 1/2)**: `maxHeight: 55vh` fought `aspect-ratio` and vertically compressed the piece grid. Width is now derived from the height budget (`min(1000px, 92vw, calc(52vh * 1.349))`).
- **Tagline white box**: `mix-blend-mode` fails inside sticky/z-index stacking contexts. Generated `public/FF_Tagline_alpha.png` (white → real alpha via PIL) and use it everywhere; no blend-mode tricks left.
- **Frozen scroll fades**: In this Next 16 / React 19 / framer-motion 12 stack, scroll-linked NON-transform style values (opacity) never re-apply via the `style` prop, while transforms work. All glass components (HeroShatter, HeroGlassFirst, HeroAssemble, GlassAssembly) now subscribe with `useMotionValueEvent` and write opacity directly to a DOM ref. Verified with scroll-position probes.
- **canvas_png → tight_png**: hero payload cut ~26MB → ~2.7MB using exact bounding-box positioning (`left/top/w/h` in `glassPieces.ts`).

### Five distinct concept finals (was three near-identical)
1. **concept-1 — Chapters + Scroll Shatter**: sticky hero shatter, Chapter One–Six.
2. **concept-2 — Flowing + Fast Shatter**: no chapter numbers, faster shatter.
3. **concept-3 — The Back Label** (new): framed wine-label hero, serif drop caps, dark wine-cellar Craft panel with glowing glass.
4. **concept-4 — Glass-First Hero**: true full-bleed 110vw glass header that shatters on scroll (matches v3-refined-4).
5. **concept-5 — Broken to Whole** (new): pieces start scattered across the viewport and assemble as you scroll; tagline reveals at completion.

All five share the full approved v3-refined structure: huge bg glass pieces (40–60%), pull quote, Get Involved CTA box, 5-step mission flow, V3 Labeled Specimens cards (1:1 with the chosen showcase: flat border, fill images, light small-caps labels), event card, partner marquee, full-width assembly finale, email signup.

### Quality pipeline (2 rounds, 4 agents each: code review, bug audit, perf, a11y)
Round-2 fixes shipped:
- GlassAssembly got the opacity workaround (was frozen).
- Marquee seam glitch fixed (gap → per-item margin so -50% loops exactly); added pause/play button (WCAG 2.2.2) and `aria-hidden` on the duplicate logo row.
- Sticky heroes no longer clip at 800px-tall viewports (logo/glass/tagline all vh-capped; verified `contentH == stickyH` at 800px).
- JoinForm captures the email (FormData), shows it in the confirmation, wrapped in `role="status"`. TODO note left for backend wiring.
- `--gold-text` darkened to `#6e5624` (5.3:1 on parchment-deep, 6.4:1 on cream — passes AA everywhere).
- FlowSteps h4 → div (fixed heading-level skip); modal `role="dialog"` moved to panel with `aria-labelledby`; navbar `aria-controls`; noscript fallback for `.reveal`.
- Perf: non-center hero pieces lazy; Section bgPieces + concept-3 imgs converted to next/image with intrinsic dims; HeroGlassFirst `sizes` matches the 140vw mobile stage; static-export landmine documented in next.config.ts.

### Legacy gallery
- All 44 old HTML concepts under `/legacy/` with fixed asset paths.
- localStorage star-favorites; starred cards surface in a "Your Favorites" section at top.
- "View earlier concept rounds" link on the gallery index and in every page footer.

### Code review (round 2) — all findings fixed
- Counter reduced-motion setState moved out of the synchronous effect body (`npx eslint src` now clean).
- Reveal rewritten as progressive enhancement: server renders content fully visible (no-JS / pre-hydration safe); JS hides only below-fold sections and fades them in on scroll. Verified: no-JS opacity is 1, 7 sections hide at load with JS, and they reveal on scroll.
- Page titles use real em dashes, matching layout.tsx.
- Concept-2's join section intentionally omits the "Come Together" eyebrow (flowing concept has no chapter labels).

### Custom content editor (CMS) — MVP shipped
- Concept 4 is the chosen design. "Backend" = a custom site editor so the client can edit content herself (not the email form).
- Architecture pivot: original plan was GoDaddy + PHP (soccersite pattern). Now Vercel-hosted with a possible move to free nonprofit hosting later, so the public site is kept 100% static/portable and the editor is a separate tool.
- `/admin` (`src/app/admin/`) — self-contained custom editor: soft passcode gate (`NEXT_PUBLIC_ADMIN_PASSCODE`, default `femmeferments`), edits every field group (vision, land+CTA, wines, roles w/ tasks·perks·time·glass-piece, how-it-works steps, event, partners), localStorage draft persistence, dirty tracking, and export via Download/Copy `content.json`. noindex, on-brand styling. Verified end-to-end (gate → edit → export reflects edits, all data intact).
### Site preview (like YCSC)
- `/preview` (auth-gated, `src/app/preview/page.tsx`): server-renders the full live site from the current **draft** (unpublished), with a floating "Preview — unpublished draft" pill (`PreviewBanner`). Redirects to `/bosslogin` if not logged in.
- Editor toolbar got a **Preview** button — opens a tab (on the click, dodging popup blockers), saves current edits, then loads `/preview`. So Karen sees exactly how changes look before hitting Publish.
- Fixed a Vercel Blob CDN gotcha found while testing: overwritten blobs (same path) were served stale from the CDN. `readBlob` now cache-busts the fetch with the blob's `uploadedAt` (fresh on change, cacheable between). Verified: save marker → preview shows it immediately, public site unaffected.

### Forge quality pass on the CMS (bugs fixed, verified in prod)
Ran code-review / bug-audit / OWASP-security / perf / a11y agents over the new backend. Fixed:
- **Crash vector (HIGH):** a non-object content payload (`[]`, `null`, string) would publish and crash the public page (`c.vision.headline` on undefined). Now `mergeContent` falls back to defaults on any non-object, and `PUT /api/content` rejects non-content payloads (`isContentLike`, 400). Verified: `[]`/`null` → 400.
- **Content flash (perf, HIGH-visibility):** `/` rendered baked content then swapped to published on the client — visible reflow every visit. Now the page reads published content **server-side** (LiveSite is a server component, content passed as prop). Verified: headline present in initial HTML.
- **Silent draft-load failure (HIGH):** editor could overwrite real content with baked defaults after a failed load. Now `loadDraft` surfaces a red "couldn't load — reload before editing" banner and disables Save/Publish.
- **Expired-session handling (MED):** 401 mid-edit now bounces to login ("Session expired") instead of a misleading "connection" error.
- **Publish double-click race (MED):** save+publish now run under one busy window with a re-entrancy guard.
- **CSRF (MED):** same-origin (Origin header) check on login/logout/content-PUT/publish. Verified: evil Origin → 403.
- **Login brute force (MED):** per-instance rate limit (10/15min) → 429. Verified.
- **JWT alg pin (INFO):** `jwt.verify(..., { algorithms: ["HS256"] })`.
Accepted low-risk: Blob double-hop (fine at this scale); admin clone-per-keystroke (small object, one editor).

**Sensitive-data-exposure fix (flagged HIGH by automated review):** the draft/published blobs were in a **public** store (world-readable at the store URL, though never exposed to clients). Recreated the Blob store as **private** (`store_nOvp7sBgMZR2WSk1`) and rewrote `blobStore.ts` to authenticated `get(path, { access: "private", useCache: false })` reads — dropping the `list()`+cache-bust dance entirely. Now neither draft nor published is reachable without the server's token. Verified end-to-end (login → save → publish → `/` + `/preview` render; unauth `/preview` → 307).

Code review + a11y (both came back clean — eslint/build pass, contrast all AA+). Fixed:
- Editor `loadDraft` now `mergeContent()`s the blob (a partial/hand-edited draft can't white-screen the editor).
- Login inputs got `autoComplete="username"` / `"current-password"` (WCAG 1.3.5).
- Toast dismiss 2.8s → 4.5s (readability).
- Stale docs updated (`Concept4Live`→`LiveSite`, `concept-4`→`/`); `.env.example` `/admin`→`/bosslogin`.
- De-duped `Role` type (SpecimenCards now imports from `@/lib/content`).

### Base domain + backend provisioned (LIVE)
- `/` now serves the chosen concept-4 experience (`src/components/LiveSite.tsx`); gallery moved to `/concepts`; `/concept-4` redirects to `/`.
- Editor moved `/admin` → `/bosslogin` (YCSC-consistent), now **username + password** login.
- Provisioned entirely via Vercel CLI on project "site": Blob store `femmeferments-content` (all envs) + `ADMIN_USERNAME` / `JWT_SECRET` / `ADMIN_PASSWORD_HASH`.
- Login: `thebosskaren` / (Femme variant of YCSC's password). Verified full production round-trip: login → save → publish → live.
- Note: could not read YCSC's creds (auto-mode security block on `vercel env pull` of another project) — user provided them.

### CMS — Vercel version (one-click publish) SHIPPED
- Adopted the **YCSC** sibling pattern (same org/client, Next.js + Vercel Blob) instead of the git-commit idea.
- Storage `src/lib/blobStore.ts` (Blob draft + published), auth `src/lib/auth.ts` (bcryptjs + JWT httpOnly cookie), `src/lib/content.ts` (schema + prototype-safe deepMerge).
- Routes: `api/auth/{login,logout,check}`, `api/content` (GET/PUT draft), `api/publish`, `api/published` (public, edge-cached ~30s).
- `AdminEditor`: real login, Save draft, **Publish** (live ~30s), Logout; graceful offline export-only mode when backend not configured.
- Public `concept-4` → `Concept4Live.tsx`: renders baked defaults, then swaps in published content. The 5 content components got optional props (default baked), so concepts 1/2/3/5 are unchanged.
- Verified: build, lint, and full auth round-trip (login/gate/check). Blob write/publish needs the real token to test.
- **Activation (needs your secrets):** create a Vercel Blob store, set `ADMIN_PASSWORD_HASH` + `JWT_SECRET`, redeploy — see `docs/cms-vercel-setup.md`. Static/portable fallback documented in `docs/cms-static-version.md`.

## Known issues / left to do
- JoinForm has no backend; email is captured client-side only (TODO in code).
- Partner marquee uses placeholder names (Partner 01–08) pending real partner logos.
- Cycle-diagram component pick from round 3 is still TBD (8 variations live in `/legacy/`).
- GoDaddy static export needs `output: "export"` + `images.unoptimized: true` together (documented in next.config.ts).
- Role names use the v3-refined set (Harvester/Storyteller/…), not the showcase set (Volunteer/Winemaker/…) — flagged to user, awaiting Karen's preference.

## .back files created this session
None in the repo this session. Pre-existing from earlier sessions (in `public/glass-assets/` and project root): `masks.back`, `previews.back`, `svg.back`, `full_canvas.png.back`, `web_usage.back`, `metadata.json.back` — ask before deleting.
