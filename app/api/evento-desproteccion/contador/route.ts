import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/server/rateLimit";
import { readDesproteccionEventRegistrations } from "@/lib/server/eventRegistrations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_STORE_HEADERS = {
  "cache-control": "no-store, no-cache, must-revalidate, proxy-revalidate",
};

// Public, unauthenticated endpoint. Only ever returns an aggregate count —
// never names/emails/phones — so it's safe to poll from the public modal
// and landing page for social-proof copy ("N personas ya se inscribieron").
export async function GET(req: Request) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`evento-desproteccion:contador:${ip}`, { limit: 60, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429, headers: NO_STORE_HEADERS });
  }

  try {
    const { count } = await readDesproteccionEventRegistrations();
    return NextResponse.json({ ok: true, count }, { headers: NO_STORE_HEADERS });
  } catch {
    return NextResponse.json({ ok: true, count: 0 }, { headers: NO_STORE_HEADERS });
  }
}
