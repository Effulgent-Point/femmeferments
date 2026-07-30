import LiveSite from "@/components/LiveSite";
import { readPublished } from "@/lib/blobStore";
import { mergeContent } from "@/lib/content";

// Rendered per request so the server always paints the current published
// content (no client-side swap/flash) and edits go live immediately. The Blob
// read is cheap at this scale and cache-bust-keyed on uploadedAt, so it only
// re-fetches the body when content actually changes. Falls back to baked
// defaults when nothing is published or Blob is unconfigured.
export const dynamic = "force-dynamic";

export default async function Home() {
  // Keep the public site resilient: a transient Blob read error falls back to
  // baked defaults (same as "nothing published yet") rather than 500-ing the
  // homepage — but log it so an outage isn't invisible. The editor path
  // (/api/content) does NOT swallow like this; there a read error must surface
  // so Karen can't overwrite her draft with defaults.
  let published: unknown = null;
  try {
    published = await readPublished();
  } catch (err) {
    console.error("readPublished failed; serving baked defaults:", err);
  }
  return <LiveSite content={mergeContent(published)} />;
}
