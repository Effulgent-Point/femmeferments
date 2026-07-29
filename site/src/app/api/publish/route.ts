import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { publishDraft } from "@/lib/blobStore";
import { sameOrigin } from "@/lib/http";

export const dynamic = "force-dynamic";

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
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Publish failed" },
      { status: 500 }
    );
  }
}
