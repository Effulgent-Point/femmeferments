import { put, get, list } from "@vercel/blob";

const DRAFT_PATH = "content/draft.json";
const PUBLISHED_PATH = "published/content.json";

// Both blobs live in a PRIVATE store: reads are authenticated (the store is
// resolved from BLOB_READ_WRITE_TOKEN), so neither the unpublished draft nor the
// published snapshot is ever world-readable at a public URL — they're only
// reachable from our server code. `useCache: false` reads origin-fresh, so an
// edit or publish is always reflected on the next read (no CDN staleness).
async function readBlob(path: string): Promise<unknown | null> {
  // `get` resolves to null ONLY when the blob doesn't exist yet — the one
  // "nothing saved" case a caller may safely treat as empty. Any real failure
  // (expired/misconfigured token, Blob outage, malformed stored JSON) THROWS,
  // and we let it propagate rather than coercing it to null. Conflating the two
  // is dangerous: a transient read error that looked like "no draft" let the
  // editor load defaults with Save enabled and overwrite Karen's real draft.
  // Each caller decides how to handle the throw (page.tsx stays resilient and
  // logs; /api/content returns 503 so the editor disables Save).
  const result = await get(path, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) return null;
  try {
    return await new Response(result.stream).json();
  } catch (err) {
    throw new Error(
      `Malformed JSON in blob "${path}": ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

async function writeBlob(path: string, data: unknown): Promise<void> {
  await put(path, JSON.stringify(data, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export const readDraft = () => readBlob(DRAFT_PATH);
export const writeDraft = (data: unknown) => writeBlob(DRAFT_PATH, data);
export const readPublished = () => readBlob(PUBLISHED_PATH);

/** Copy the current draft into the published snapshot the public site reads. */
export async function publishDraft(): Promise<void> {
  const draft = await readDraft();
  if (draft == null) throw new Error("No draft to publish — save first.");
  await writeBlob(PUBLISHED_PATH, draft);
}

/** ISO timestamp of the last publish (the published blob's uploadedAt), or null. */
export async function getPublishedAt(): Promise<string | null> {
  try {
    const { blobs } = await list({ prefix: PUBLISHED_PATH });
    const match = blobs.find((b) => b.pathname === PUBLISHED_PATH);
    return match ? new Date(match.uploadedAt).toISOString() : null;
  } catch (err) {
    // Only feeds the cosmetic "last published" label — safe to degrade to
    // null, but log so an outage still leaves a trail.
    console.error("getPublishedAt failed:", err);
    return null;
  }
}
