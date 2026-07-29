import { put, get, list, del } from "@vercel/blob";

// Uploaded images live in the SAME private Blob store as the content JSON, under
// the `media/` prefix. Because the store is private (resolved from
// BLOB_READ_WRITE_TOKEN), a media blob is never world-readable at its own URL —
// the public site loads each image through /api/media/file/<pathname>, a route
// that streams the private bytes back. `useCache: false` on reads keeps a freshly
// uploaded (or re-uploaded) image from being shadowed by a stale CDN copy.
const PREFIX = "media/";
const MAX_BYTES = 8 * 1024 * 1024; // 8MB

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

/** 6 lowercase-alphanumeric chars, to keep filenames unique without collisions. */
function shortId(): string {
  return Math.random().toString(36).slice(2, 8).padEnd(6, "0");
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

/** All stored images, newest first. */
export async function listImages(): Promise<
  { pathname: string; uploadedAt: string }[]
> {
  const { blobs } = await list({ prefix: PREFIX });
  return blobs
    .map((b) => ({
      pathname: b.pathname,
      uploadedAt:
        b.uploadedAt instanceof Date
          ? b.uploadedAt.toISOString()
          : String(b.uploadedAt),
    }))
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
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
  try {
    const result = await get(pathname, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    const stored = result.blob.contentType;
    const contentType =
      stored && stored.startsWith("image/")
        ? stored
        : typeFromPathname(pathname);
    return { stream: result.stream, contentType };
  } catch {
    return null;
  }
}

/** Permanently remove one stored image. */
export async function deleteImage(pathname: string): Promise<void> {
  await del(pathname);
}
