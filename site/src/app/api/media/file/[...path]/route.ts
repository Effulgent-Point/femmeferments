import { NextResponse } from "next/server";
import { getImage, isValidMediaKey } from "@/lib/mediaStore";

export const dynamic = "force-dynamic";

// PUBLIC (no auth): this is how <img> tags on the live site load an image. The
// bytes live in the PRIVATE Blob store, so we stream them through here rather
// than exposing a public blob URL — keeping everything in a single store. The
// pathname is reconstructed from the catch-all segments and must be a strict
// single `media/<file>.<ext>` key (isValidMediaKey) — a mere startsWith check
// is bypassable, e.g. `media/../content/draft.json` normalizes out of media/.
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  const pathname = path.join("/");
  if (!isValidMediaKey(pathname)) {
    return NextResponse.json({ error: "Not found" }, { status: 400 });
  }

  const image = await getImage(pathname);
  if (!image) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new Response(image.stream, {
    status: 200,
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
