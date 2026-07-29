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
  const published = await readPublished();
  const content = mergeContent(published);
  return <LiveSite content={content} />;
}
