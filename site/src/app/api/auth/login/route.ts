import { NextRequest, NextResponse } from "next/server";
import { authConfigured, verifyLogin, setAuthCookie } from "@/lib/auth";
import { sameOrigin } from "@/lib/http";

export const dynamic = "force-dynamic";

// Best-effort per-instance rate limit. Serverless instances are ephemeral and
// there may be several, so this is friction, not a hard guarantee — but it
// blunts scripted brute force against the single admin credential.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const attempts = new Map<string, number[]>();

function tooManyAttempts(ip: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  if (attempts.size > 5000) attempts.clear(); // crude unbounded-growth guard
  return recent.length > MAX_ATTEMPTS;
}

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!authConfigured()) {
    return NextResponse.json(
      {
        error: "not_configured",
        message:
          "Admin backend not set up yet — see docs/cms-vercel-setup.md.",
      },
      { status: 503 }
    );
  }
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (tooManyAttempts(ip)) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many attempts — try again later." },
      { status: 429 }
    );
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const b = (body ?? {}) as { username?: unknown; password?: unknown };
  const username = typeof b.username === "string" ? b.username : "";
  const password = typeof b.password === "string" ? b.password : "";
  const token = await verifyLogin(username, password);
  if (!token) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }
  await setAuthCookie(token);
  return NextResponse.json({ success: true });
}
