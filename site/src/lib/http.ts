import { NextRequest } from "next/server";

/**
 * CSRF guard for state-changing routes. Browsers always send an Origin header
 * on cross-site POST/PUT/DELETE, so a mismatched Origin means a cross-site
 * (forged) request → reject. A missing Origin (curl, server-to-server, same-site
 * navigations) can't carry a CSRF attack that relies on the victim's cookie, so
 * it's allowed. Pairs with the httpOnly + sameSite=lax session cookie.
 */
export function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const host = req.headers.get("host");
    return !!host && new URL(origin).host === host;
  } catch {
    return false;
  }
}
