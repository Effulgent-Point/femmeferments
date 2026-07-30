import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { readDraft, writeDraft } from "@/lib/blobStore";
import { DEFAULT_CONTENT, isContentLike } from "@/lib/content";
import { sameOrigin } from "@/lib/http";

export const dynamic = "force-dynamic";

// Returns the working draft (auth-gated). Falls back to baked defaults when
// nothing has been saved yet.
export async function GET() {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // A genuine read error must NOT look like "no draft" — returning defaults
  // with 200 would let the editor load defaults and overwrite Karen's real
  // draft on the next Save. Surface it as 503 so the editor shows loadError and
  // disables Save/Publish. (readDraft returns null only for a truly-absent
  // draft, which legitimately falls back to defaults.)
  let draft: unknown;
  try {
    draft = await readDraft();
  } catch (err) {
    console.error("readDraft failed:", err);
    return NextResponse.json(
      {
        error: "read_failed",
        message: "Could not load your saved draft. Please retry in a moment.",
      },
      { status: 503 },
    );
  }
  return NextResponse.json(isContentLike(draft) ? draft : DEFAULT_CONTENT);
}

export async function PUT(req: NextRequest) {
  if (!sameOrigin(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!isContentLike(body)) {
    return NextResponse.json(
      {
        error: "invalid_content",
        message: "Payload is not valid site content.",
      },
      { status: 400 },
    );
  }
  try {
    await writeDraft(body);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Write failed" },
      { status: 500 },
    );
  }
}
