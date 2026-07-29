import { NextResponse } from "next/server";
import { getImage } from "@/lib/mediaStore";

export const dynamic = "force-dynamic";

// PUBLIC (no auth): this is how <img> tags on the live site load an image. The
// bytes live in the PRIVATE Blob store, so we stream them through here rather
// than exposing a public blob URL — keeping everything in a single store. The
// pathname is reconstructed from the catch-all segments and must stay inside
// `media/` so this can never be used to read the content JSON or drafts.
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  const pathname = path.join("/");
  if (!pathname.startsWith("media/")) {
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
