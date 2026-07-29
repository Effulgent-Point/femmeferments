# CMS — Vercel Version (active)

How the live content editor works and how to switch it on. Counterpart:
`docs/cms-static-version.md` (the portable build for a future free host).

## How it works

```
/bosslogin (editor) ──save────▶ Vercel Blob  content/draft.json      (private working copy)
                    ──publish──▶            published/content.json   (the live snapshot)
                                                 │
        the `/` route (LiveSite)  ◀──readPublished()── server-renders it, per request
        /preview  (admin-only)    ◀──readDraft()──────── server-renders the draft
```

- The public `/` route **server-renders** the published content: `page.tsx` calls
  `readPublished()` and passes it to `LiveSite` as a prop, so the first paint already
  has the real copy — no client fetch, no flash. Falls back to baked
  `src/data/content.json` when nothing is published (or Blob is off) — nothing breaks.
- The editor saves a **draft** blob; **Publish** copies draft → published, which the
  public site reads. Live within seconds — the Blob read is cache-bust-keyed on the
  blob's `uploadedAt`, so a publish is picked up immediately.
- **Preview:** the editor's Preview button opens `/preview`, which server-renders
  `LiveSite` from the **draft** (unpublished) blob — admin-only (`checkAuth`), noindex —
  so edits can be checked before publishing.
- `/api/published` is an optional public JSON endpoint of the live content; the site's
  own render does **not** use it (it reads the Blob directly, server-side).
- Auth is username + bcrypt-hashed password → signed JWT (HS256) in an httpOnly cookie (8h).

## Files

- `src/lib/blobStore.ts` — draft/published read/write on Vercel Blob (uploadedAt cache-bust)
- `src/lib/auth.ts` — bcrypt + JWT (username + password)
- `src/lib/content.ts` — schema types, baked defaults, prototype-safe deep-merge, validation
- `src/lib/http.ts` — same-origin (CSRF) guard for mutating routes
- `src/app/api/{auth/login,auth/logout,auth/check,content,publish,published}/route.ts`
- `src/app/bosslogin/{page.tsx,AdminEditor.tsx}` — the editor UI
- `src/app/preview/page.tsx` + `src/components/PreviewBanner.tsx` — draft preview
- `src/components/LiveSite.tsx` — the site render, shared by `/` (published) and `/preview` (draft)
- `src/app/page.tsx` — `/`, server-renders published content

## Activation (one-time, ~10 min)

1. **Create a Blob store** — must be **private** (`blobStore.ts` reads with
   `access: "private"`; a public store errors). Via CLI:
   `vercel blob create-store <name> --access private --yes` (auto-adds
   `BLOB_READ_WRITE_TOKEN` to all environments), or the dashboard with private access.

2. **Set the two auth env vars** (Project → Settings → Environment Variables):
   ```bash
   # passcode hash (pick Karen's passcode):
   node -e "console.log(require('bcryptjs').hashSync('THE_PASSCODE', 12))"   # → ADMIN_PASSWORD_HASH
   # session secret:
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"  # → JWT_SECRET
   ```

3. **Redeploy** (`vercel deploy --prod`). Done.

Before activation the deployed site is unaffected and `/bosslogin` shows an
**offline export-only** mode (edit + Download `content.json`). After activation,
`/bosslogin` requires the passcode and the **Save / Publish** buttons appear.

## Local development

```bash
vercel env pull .env.local     # pulls BLOB_READ_WRITE_TOKEN + the two auth vars
npm run dev                     # /bosslogin now runs against the real Blob store
```

## Notes

- Single shared passcode = single editor (fine for one admin). Multi-user with
  named logins is a later upgrade.
- Blob keeps prior versions, so a bad edit is recoverable from the Vercel dashboard.
- `/bosslogin` is `noindex`; don't link it publicly.
