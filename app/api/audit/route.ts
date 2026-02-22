import { NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/server/adminAuth";
import { roleAtLeast } from "@/lib/server/roles";
import { appendAudit, readAudit } from "@/lib/server/auditLog";
import { checkRateLimit, getClientIp } from "@/lib/server/rateLimit";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = getAdminSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!roleAtLeast(session.role, "editor")) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const ip = getClientIp(req);
  const rl = checkRateLimit(`audit:read:${session.user}:${ip}`, { limit: 120, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  const url = new URL(req.url);
  const limitRaw = Number(url.searchParams.get("limit") ?? "200");
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(500, Math.floor(limitRaw))) : 200;

  const entries = await readAudit({ limit });
  return NextResponse.json({ ok: true, entries });
}

export async function POST(req: Request) {
  const session = getAdminSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!roleAtLeast(session.role, "editor")) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const ip = getClientIp(req);
  const rl = checkRateLimit(`audit:write:${session.user}:${ip}`, { limit: 60, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: { action?: unknown; detail?: unknown };
  try {
    body = (await req.json()) as { action?: unknown; detail?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const action = String(body.action ?? "");
  if (action !== "import" && action !== "export") return NextResponse.json({ ok: false, error: "invalid_action" }, { status: 400 });
  const detail = typeof body.detail === "string" ? body.detail.slice(0, 280) : undefined;

  await appendAudit({
    user: session.user,
    role: session.role,
    action,
    entity: { kind: "site" },
    detail,
  });

  return NextResponse.json({ ok: true });
}
