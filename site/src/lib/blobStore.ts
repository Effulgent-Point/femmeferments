import { put, get, list } from "@vercel/blob";

const DRAFT_PATH = "content/draft.json";
const PUBLISHED_PATH = "published/content.json";

// Both blobs live in a PRIVATE store: reads are authenticated (the store is
// resolved from BLOB_READ_WRITE_TOKEN), so neither the unpublished draft nor the
// published snapshot is ever world-readable at a public URL — they're only
// reachable from our server code. `useCache: false` reads origin-fresh, so an
// edit or publish is always reflected on the next read (no CDN staleness).
async function readBlob(path: string): Promise<unknown | null> {
  try {
    const result = await get(path, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200) return null;
    return await new Response(result.stream).json();
  } catch {
    // Not found / Blob unconfigured / unreachable — caller falls back to baked.
    return null;
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
  } catch {
    return null;
  }
}
