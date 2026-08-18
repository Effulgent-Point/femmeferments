import { NextRequest, NextResponse } from "next/server";
import { put, list, get } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { requireAuth } from "@/lib/auth";
import { sendSignupNotification } from "@/lib/notify";
import { isRateLimited } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const PREFIX = "subscribers/";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const WINDOW_MS = 60 * 60 * 1000;
const MAX_SUBMISSIONS = 20;

function randomSuffix(): string {
  return randomUUID();
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (await isRateLimited("signup", ip, WINDOW_MS, MAX_SUBMISSIONS)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  const b = (body ?? {}) as { email?: unknown; botcheck?: unknown };

  if (typeof b.botcheck === "string" && b.botcheck.length > 0) {
    return NextResponse.json({ success: true });
  }

  const email = typeof b.email === "string" ? b.email.trim() : "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const at = new Date().toISOString();
  const path = `${PREFIX}${at}-${randomSuffix()}.json`;
  try {
    await put(path, JSON.stringify({ email, at }), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
  // The signup is safely stored above; forward a notification to the org inbox.
  // Best-effort — a failed/unconfigured send never fails the signup.
  await sendSignupNotification(email);
  return NextResponse.json({ success: true });
}

interface Subscriber {
  email: string;
  at: string;
}

// AUTH-gated: lets the admin view collected signups.
export async function GET() {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const subscribers: Subscriber[] = [];
  try {
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: PREFIX, cursor });
      for (const blob of page.blobs) {
        // Skip the folder placeholder Vercel creates for a trailing-slash path.
        if (blob.pathname === PREFIX) continue;
        const result = await get(blob.pathname, {
          access: "private",
          useCache: false,
        });
        if (!result || result.statusCode !== 200) continue;
        const data = (await new Response(result.stream).json()) as unknown;
        const d = (data ?? {}) as { email?: unknown; at?: unknown };
        if (typeof d.email === "string" && typeof d.at === "string") {
          subscribers.push({ email: d.email, at: d.at });
        }
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  subscribers.sort((a, b) => b.at.localeCompare(a.at));
  return NextResponse.json({ count: subscribers.length, subscribers });
}
