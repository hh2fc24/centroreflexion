import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/server/rateLimit";
import { requireTrustedOrigin } from "@/lib/server/requestSecurity";
import { sanitizePlainText } from "@/lib/server/sanitize";
import {
  CAMPAIGN_LANDING_EVENT,
  detectBot,
  getGeo,
  recordConversionEvent,
  recordPageview,
  sanitizeAttribution,
} from "@/lib/server/siteAnalytics";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const invalidOrigin = requireTrustedOrigin(req);
  if (invalidOrigin) return invalidOrigin;

  const ip = getClientIp(req);
  const rl = checkRateLimit(`analytics:track:${ip}`, { limit: 120, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: {
    path?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    language?: string;
    viewportWidth?: number;
    touch?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const path = sanitizePlainText(body.path ?? "", { maxLen: 300 });
  if (!path) return NextResponse.json({ ok: false, error: "missing_path" }, { status: 400 });

  const referrer = sanitizePlainText(body.referrer ?? "", { maxLen: 300 });
  const utmSource = sanitizePlainText(body.utmSource ?? "", { maxLen: 100 });
  const utmMedium = sanitizePlainText(body.utmMedium ?? "", { maxLen: 100 });
  const utmCampaign = sanitizePlainText(body.utmCampaign ?? "", { maxLen: 100 });
  const language = sanitizePlainText(body.language ?? "", { maxLen: 20 });
  const viewportWidth = typeof body.viewportWidth === "number" ? body.viewportWidth : undefined;
  const userAgent = req.headers.get("user-agent") || "";
  const { country, region, city } = getGeo(req);

  try {
    await recordPageview({
      path,
      referrer,
      ip,
      userAgent,
      country,
      region,
      city,
      utmSource,
      utmMedium,
      utmCampaign,
      language,
      viewportWidth,
    });
  } catch {
    // No bloquear la navegación del visitante si falla el registro.
  }

  // Llegada con campaña (UTM, clic de anuncio o referrer externo al inicio de
  // la sesión): se guarda completa en analytics_events.metadata porque
  // analytics_pageviews no tiene columnas para utm_content / utm_term.
  const touch = sanitizeAttribution({ last: body.touch });
  if (touch && !detectBot(userAgent)) {
    try {
      await recordConversionEvent({
        eventName: CAMPAIGN_LANDING_EVENT,
        path,
        ip,
        country,
        metadata: { attribution: touch },
      });
    } catch {
      // Igual que el pageview: best-effort.
    }
  }

  return NextResponse.json({ ok: true });
}
