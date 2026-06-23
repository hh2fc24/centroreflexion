import { NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/server/adminAuth";
import { roleAtLeast } from "@/lib/server/roles";
import { getAnalyticsSummary } from "@/lib/server/siteAnalytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_STORE_HEADERS = {
  "cache-control": "no-store, no-cache, must-revalidate, proxy-revalidate",
};

const RANGE_MS: Record<string, number> = {
  "6h": 6 * 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

export async function GET(req: Request) {
  const session = getAdminSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  if (!roleAtLeast(session.role, "editor")) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403, headers: NO_STORE_HEADERS });
  }

  const { searchParams } = new URL(req.url);
  const rangeKey = searchParams.get("range") || "7d";
  const ms = RANGE_MS[rangeKey] ?? RANGE_MS["7d"];
  const sinceIso = new Date(Date.now() - ms).toISOString();

  try {
    const summary = await getAnalyticsSummary(sinceIso, ms);
    if (!summary) {
      return NextResponse.json(
        { ok: false, error: "supabase_not_configured" },
        { status: 503, headers: NO_STORE_HEADERS }
      );
    }
    return NextResponse.json({ ok: true, ...summary }, { headers: NO_STORE_HEADERS });
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { ok: false, error: "analytics_unavailable", detail },
      { status: 502, headers: NO_STORE_HEADERS }
    );
  }
}
