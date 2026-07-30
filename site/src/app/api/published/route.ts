import { NextResponse } from "next/server";
import { readPublished } from "@/lib/blobStore";

export const dynamic = "force-dynamic";

// Public — the live, published content the site consumes. No auth.
export async function GET() {
  let data: unknown;
  try {
    data = await readPublished();
  } catch (err) {
    // A read error is not "nothing published" — answer 503, not 404.
    console.error("readPublished failed:", err);
    return NextResponse.json({ error: "read_failed" }, { status: 503 });
  }
  if (!data) {
    return NextResponse.json({ error: "nothing_published" }, { status: 404 });
  }
  return NextResponse.json(data, {
    headers: {
      // Edge-cached; refreshed within ~30s of a publish.
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=300",
    },
  });
}
