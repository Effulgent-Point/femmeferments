/**
 * Sends a "new signup" notification email via Resend's HTTP API (a plain fetch,
 * so no new dependency / supply-chain surface).
 *
 * Best-effort by design: if RESEND_API_KEY isn't configured, or the send fails
 * or times out, we log and return false rather than throwing. The signup itself
 * is already stored before this runs — a notification must NEVER break signup.
 *
 * Config (Vercel env):
 *   RESEND_API_KEY      required to actually send (absent → forwarding is off)
 *   SIGNUP_NOTIFY_TO    recipient (default Karen@femmeferments.com)
 *   SIGNUP_NOTIFY_FROM  verified sender (default "Femme Ferments <noreply@send.femmeferments.com>")
 */

// Warn once per instance when the key is absent, so a key removed/revoked after
// setup leaves a grep-able trace in the logs without a line per signup.
let warnedNoKey = false;

export async function sendSignupNotification(
  subscriberEmail: string,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (!warnedNoKey) {
      warnedNoKey = true;
      console.warn(
        "Signup notification skipped: RESEND_API_KEY not set (signups are still stored).",
      );
    }
    return false;
  }

  const to = process.env.SIGNUP_NOTIFY_TO || "Karen@femmeferments.com";
  const from =
    process.env.SIGNUP_NOTIFY_FROM ||
    "Femme Ferments <noreply@send.femmeferments.com>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      // Plain text only (no HTML) so a subscriber's address can't inject markup.
      // `subscriberEmail` is already validated (no whitespace/newlines) by the
      // caller, so reply_to can't carry a header-injection payload.
      body: JSON.stringify({
        from,
        to,
        reply_to: subscriberEmail,
        subject: "New Femme Ferments signup",
        text: `New newsletter signup:\n\n${subscriberEmail}\n\nSent automatically from femmeferments.com`,
      }),
      // Bound the added latency: a slow/hung Resend delays the (already-stored)
      // signup response by at most this long — best-effort, never blocking.
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) {
      // Truncate Resend's response body — keeps the useful error (e.g. "domain
      // not verified") while bounding any subscriber PII it might echo into logs.
      const detail = (await res.text().catch(() => "")).slice(0, 200);
      console.error(`Signup notification failed (${res.status}): ${detail}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Signup notification error:", err);
    return false;
  }
}
