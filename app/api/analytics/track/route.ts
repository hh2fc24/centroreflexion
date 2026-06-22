import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/server/rateLimit";
import { requireTrustedOrigin } from "@/lib/server/requestSecurity";
import { sanitizePlainText } from "@/lib/server/sanitize";
import { getGeo, recordPageview } from "@/lib/server/siteAnalytics";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const invalidOrigin = requireTrustedOrigin(req);
  if (invalidOrigin) return invalidOrigin;

  const ip = getClientIp(req);
  const rl = checkRateLimit(`analytics:track:${ip}`, { limit: 120, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: { path?: string; referrer?: string };
  try {
    body = (await req.json()) as { path?: string; referrer?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const path = sanitizePlainText(body.path ?? "", { maxLen: 300 });
  if (!path) return NextResponse.json({ ok: false, error: "missing_path" }, { status: 400 });

  const referrer = sanitizePlainText(body.referrer ?? "", { maxLen: 300 });
  const userAgent = req.headers.get("user-agent") || "";
  const { country, region, city } = getGeo(req);

  try {
    await recordPageview({ path, referrer, ip, userAgent, country, region, city });
  } catch {
    // No bloquear la navegación del visitante si falla el registro.
  }

  return NextResponse.json({ ok: true });
}
