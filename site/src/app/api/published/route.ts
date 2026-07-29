import { NextResponse } from "next/server";
import { readPublished } from "@/lib/blobStore";

export const dynamic = "force-dynamic";

// Public — the live, published content the site consumes. No auth.
export async function GET() {
  const data = await readPublished();
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
