import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/server/rateLimit";
import { requireTrustedOrigin } from "@/lib/server/requestSecurity";
import { sanitizePlainText } from "@/lib/server/sanitize";
import { getGeo, recordConsentEvent } from "@/lib/server/siteAnalytics";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const invalidOrigin = requireTrustedOrigin(req);
  if (invalidOrigin) return invalidOrigin;

  const ip = getClientIp(req);
  const rl = checkRateLimit(`analytics:consent:${ip}`, { limit: 20, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: { choice?: string; path?: string };
  try {
    body = (await req.json()) as { choice?: string; path?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const choice = body.choice === "accepted" || body.choice === "rejected" ? body.choice : null;
  if (!choice) return NextResponse.json({ ok: false, error: "invalid_choice" }, { status: 400 });

  const path = sanitizePlainText(body.path ?? "", { maxLen: 300 });
  const { country } = getGeo(req);

  try {
    await recordConsentEvent({ choice, path, ip, country });
  } catch {
    // No bloquear la decisión del visitante si falla el registro.
  }

  return NextResponse.json({ ok: true });
}
