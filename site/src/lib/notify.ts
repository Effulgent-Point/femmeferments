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
 *   SIGNUP_NOTIFY_FROM  verified sender (default noreply@femmeferments.com)
 */
export async function sendSignupNotification(
  subscriberEmail: string,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false; // not configured yet — signups still stored

  const to = process.env.SIGNUP_NOTIFY_TO || "Karen@femmeferments.com";
  const from =
    process.env.SIGNUP_NOTIFY_FROM ||
    "Femme Ferments <noreply@femmeferments.com>";

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
      // Bound the call so a slow/hung Resend can't stall the signup response.
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`Signup notification failed (${res.status}): ${detail}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Signup notification error:", err);
    return false;
  }
}
