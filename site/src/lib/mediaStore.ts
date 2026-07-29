import { put, get, list, del } from "@vercel/blob";
import { randomUUID } from "node:crypto";

// Uploaded images live in the SAME private Blob store as the content JSON, under
// the `media/` prefix. Because the store is private (resolved from
// BLOB_READ_WRITE_TOKEN), a media blob is never world-readable at its own URL —
// the public site loads each image through /api/media/file/<pathname>, a route
// that streams the private bytes back. `useCache: false` on reads keeps a freshly
// uploaded (or re-uploaded) image from being shadowed by a stale CDN copy.
const PREFIX = "media/";
const MAX_BYTES = 8 * 1024 * 1024; // 8MB

/**
 * True only for a well-formed key we could have written ourselves: a single
 * `media/<name>.<ext>` segment with an image extension and NO path separators
 * or `.`/`..` traversal.
 *
 * This is the traversal guard for the public proxy and delete routes. A
 * `startsWith("media/")` check is NOT sufficient: `get()`/`del()` build the
 * blob URL by string interpolation, and `new URL("…/media/../content/draft.json")`
 * collapses the `..` back to `/content/draft.json`, escaping the prefix and
 * exposing the private draft/subscribers. Validating the whole key shape (no
 * `/` allowed after `media/`) makes a `..` segment unrepresentable.
 */
export function isValidMediaKey(pathname: string): boolean {
  return /^media\/[a-z0-9][a-z0-9._-]*\.(png|jpe?g|webp|gif)$/.test(pathname);
}

// contentType → canonical extension. Also the allow-list: anything not here is
// rejected before it ever reaches the store.
const EXT_BY_TYPE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

// Fallback content-type for a stored blob when we only have its extension.
const TYPE_BY_EXT: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

/** Lowercase, keep only [a-z0-9-_.]; collapse the rest to "-". Never empty. */
function sanitizeBase(name: string): string {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9-_.]+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "");
  return cleaned || "image";
}

/** 8 hex chars from a CSPRNG — unique and unguessable (not Math.random). */
function shortId(): string {
  return randomUUID().replace(/-/g, "").slice(0, 8);
}

function toBuffer(bytes: ArrayBuffer | Buffer | Uint8Array): Buffer {
  if (Buffer.isBuffer(bytes)) return bytes;
  if (bytes instanceof Uint8Array) return Buffer.from(bytes);
  return Buffer.from(new Uint8Array(bytes));
}

/**
 * Validate + store one image. Throws on an unsupported type or oversize payload
 * so the caller can surface a 400. Returns the stored `pathname` (e.g.
 * `media/logo-a1b2c3.png`), which the API turns into a public proxy URL.
 */
export async function uploadImage(
  filename: string,
  bytes: ArrayBuffer | Buffer | Uint8Array,
  contentType: string,
): Promise<{ pathname: string }> {
  const type = contentType.toLowerCase();
  const ext = EXT_BY_TYPE[type];
  if (!ext) {
    throw new Error(`Unsupported image type: ${contentType}`);
  }
  const buf = toBuffer(bytes);
  if (buf.byteLength > MAX_BYTES) {
    throw new Error("Image exceeds 8MB limit.");
  }

  // Drop any extension the caller sent; we append the canonical one.
  const base = sanitizeBase(filename.replace(/\.[a-z0-9]+$/i, ""));
  const pathname = `${PREFIX}${base}-${shortId()}.${ext}`;

  await put(pathname, buf, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: type,
  });

  return { pathname };
}

/** All stored images, newest first. Pages through the full list (a single
 *  `list()` caps at ~1000 blobs and would silently drop the rest). */
export async function listImages(): Promise<
  { pathname: string; uploadedAt: string }[]
> {
  const out: { pathname: string; uploadedAt: string }[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: PREFIX, cursor });
    for (const b of page.blobs) {
      if (b.pathname === PREFIX) continue; // folder placeholder
      out.push({
        pathname: b.pathname,
        uploadedAt:
          b.uploadedAt instanceof Date
            ? b.uploadedAt.toISOString()
            : String(b.uploadedAt),
      });
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

/** Fall back to the extension when a stored blob has no usable content-type. */
function typeFromPathname(pathname: string): string {
  const ext = pathname.split(".").pop()?.toLowerCase() ?? "";
  return TYPE_BY_EXT[ext] ?? "application/octet-stream";
}

/**
 * Stream one private image back for the public proxy route. Returns null when
 * the blob is missing/unreachable so the caller can answer 404.
 */
export async function getImage(
  pathname: string,
): Promise<{ stream: ReadableStream; contentType: string } | null> {
  // Defense in depth — the route validates too, but never let a malformed key
  // reach get(), where `..` would collapse out of the media/ prefix.
  if (!isValidMediaKey(pathname)) return null;
  try {
    const result = await get(pathname, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    const stored = result.blob.contentType;
    const contentType =
      stored && stored.startsWith("image/")
        ? stored
        : typeFromPathname(pathname);
    return { stream: result.stream, contentType };
  } catch (err) {
    console.error(`getImage failed for ${pathname}:`, err);
    return null;
  }
}

/** Permanently remove one stored image. */
export async function deleteImage(pathname: string): Promise<void> {
  if (!isValidMediaKey(pathname)) throw new Error("Invalid media key.");
  await del(pathname);
}
