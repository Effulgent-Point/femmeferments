import { NextRequest, NextResponse } from "next/server";
import { authConfigured, verifyLogin, setAuthCookie } from "@/lib/auth";
import { sameOrigin } from "@/lib/http";
import { isRateLimited } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!authConfigured()) {
    return NextResponse.json(
      {
        error: "not_configured",
        message: "Admin backend not set up yet — see docs/cms-vercel-setup.md.",
      },
      { status: 503 },
    );
  }
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (await isRateLimited("login", ip, WINDOW_MS, MAX_ATTEMPTS)) {
    return NextResponse.json(
      {
        error: "rate_limited",
        message: "Too many attempts — try again later.",
      },
      { status: 429 },
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
