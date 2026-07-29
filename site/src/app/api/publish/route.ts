import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { publishDraft, getPublishedAt } from "@/lib/blobStore";
import { sameOrigin } from "@/lib/http";

export const dynamic = "force-dynamic";

// When the site was last published (the published blob's timestamp).
export async function GET() {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ publishedAt: await getPublishedAt() });
}

// Copies the saved draft into the published snapshot the public site reads.
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await publishDraft();
    return NextResponse.json({
      success: true,
      publishedAt: await getPublishedAt(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Publish failed" },
      { status: 500 },
    );
  }
}
