import { NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/server/adminAuth";
import { roleAtLeast } from "@/lib/server/roles";
import { checkRateLimit, getClientIp } from "@/lib/server/rateLimit";
import { sanitizePlainText } from "@/lib/server/sanitize";
import { appendStoredLead, readStoredLeads, type StoredLead } from "@/lib/server/leadsStore";

export const runtime = "nodejs";

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`leads:post:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: Partial<StoredLead>;
  try {
    body = (await req.json()) as Partial<StoredLead>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const lead: StoredLead = {
    id: newId("lead"),
    createdAt: Date.now(),
    source: sanitizePlainText(body.source ?? "web", { maxLen: 40 }),
    name: sanitizePlainText(body.name ?? "", { maxLen: 140 }),
    email: sanitizePlainText(body.email ?? "", { maxLen: 140 }),
    phone: body.phone ? sanitizePlainText(body.phone, { maxLen: 40 }) : undefined,
    message: sanitizePlainText(body.message ?? "", { maxLen: 4000 }),
    page: sanitizePlainText(body.page ?? "", { maxLen: 180 }),
    formId: body.formId ? sanitizePlainText(body.formId, { maxLen: 80 }) : undefined,
    fields: body.fields && typeof body.fields === "object" ? (body.fields as Record<string, unknown>) : undefined,
  };

  if (!lead.email) {
    return NextResponse.json({ ok: false, error: "missing_contact" }, { status: 400 });
  }

  try {
    await appendStoredLead(lead);
  } catch (e: unknown) {
    const detail = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
    return NextResponse.json({ ok: false, error: "write_failed", detail }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: lead.id });
}

export async function GET(req: Request) {
  const session = getAdminSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!roleAtLeast(session.role, "editor")) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const leads = await readStoredLeads();
  return NextResponse.json({ ok: true, leads });
}
