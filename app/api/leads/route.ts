import { NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/server/adminAuth";
import { roleAtLeast } from "@/lib/server/roles";
import { checkRateLimit, getClientIp } from "@/lib/server/rateLimit";
import { requireTrustedOrigin } from "@/lib/server/requestSecurity";
import { sanitizePlainText } from "@/lib/server/sanitize";
import { appendStoredLead, readStoredLeads, type StoredLead } from "@/lib/server/leadsStore";
import { getGoogleAppsScriptUrl } from "@/lib/site";
import { getGeo, recordConversionEvent } from "@/lib/server/siteAnalytics";
import { DESPROTECCION_EVENT_SOURCE } from "@/lib/server/eventRegistrations";
import { insertDesproteccionRegistration } from "@/lib/server/desproteccionRegistrationsStore";

export const runtime = "nodejs";

type LeadInput = Partial<StoredLead> & {
  contactMethod?: unknown;
  horario?: unknown;
};

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeLeadId(value: unknown) {
  if (typeof value !== "string") return "";
  return sanitizePlainText(value, { maxLen: 120 });
}

async function forwardLeadToGoogleSheets(lead: StoredLead) {
  const response = await fetch(getGoogleAppsScriptUrl(), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(lead),
    cache: "no-store",
  });

  const raw = await response.text();
  let json: { ok?: boolean; error?: string } | null = null;

  try {
    json = JSON.parse(raw) as { ok?: boolean; error?: string };
  } catch {
    json = null;
  }

  if (!response.ok) {
    throw new Error(json?.error || `apps_script_http_${response.status}`);
  }

  if (!json?.ok) {
    throw new Error(json?.error || "apps_script_rejected");
  }
}

export async function POST(req: Request) {
  const invalidOrigin = requireTrustedOrigin(req);
  if (invalidOrigin) return invalidOrigin;

  const ip = getClientIp(req);
  const rl = checkRateLimit(`leads:post:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: LeadInput;
  try {
    body = (await req.json()) as LeadInput;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const lead: StoredLead = {
    id: normalizeLeadId(body.id) || newId("lead"),
    createdAt: Date.now(),
    source: sanitizePlainText(body.source ?? "web", { maxLen: 40 }),
    name: sanitizePlainText(body.name ?? "", { maxLen: 140 }),
    email: sanitizePlainText(body.email ?? "", { maxLen: 140 }),
    phone: body.phone ? sanitizePlainText(body.phone, { maxLen: 40 }) : undefined,
    message: sanitizePlainText(body.message ?? "", { maxLen: 4000 }),
    page: sanitizePlainText(body.page ?? "", { maxLen: 180 }),
    formId: body.formId ? sanitizePlainText(body.formId, { maxLen: 80 }) : undefined,
    fields: {
      ...(body.fields && typeof body.fields === "object" ? (body.fields as Record<string, unknown>) : {}),
      ...(body.contactMethod ? { contactMethod: sanitizePlainText(body.contactMethod, { maxLen: 40 }) } : {}),
      ...(body.horario ? { horario: sanitizePlainText(body.horario, { maxLen: 40 }) } : {}),
    },
  };

  if (!lead.email) {
    return NextResponse.json({ ok: false, error: "missing_contact", id: lead.id }, { status: 400 });
  }

  if (lead.source === DESPROTECCION_EVENT_SOURCE) {
    // Este evento NO se reenvía al Apps Script (ese script pertenece al evento
    // UAH y no podemos verificar que maneje correctamente un `source` nuevo).
    // Supabase es la fuente de verdad aquí: durable y compartida entre todas
    // las instancias serverless, a diferencia del archivo JSON local.
    try {
      await insertDesproteccionRegistration(lead);
    } catch (e: unknown) {
      const detail = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
      return NextResponse.json({ ok: false, error: "write_failed", detail, id: lead.id }, { status: 500 });
    }

    try {
      await appendStoredLead(lead);
    } catch {
      // Mirror local opcional; Supabase ya es la fuente de verdad.
    }
  } else {
    try {
      await forwardLeadToGoogleSheets(lead);

      try {
        await appendStoredLead(lead);
      } catch {
        // Mirror failures should not break successful signups; Google Sheets is the source of truth.
      }
    } catch (e: unknown) {
      const detail = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
      return NextResponse.json({ ok: false, error: "write_failed", detail, id: lead.id }, { status: 500 });
    }
  }

  try {
    const { country } = getGeo(req);
    await recordConversionEvent({
      eventName: "lead_submitted",
      path: lead.page,
      ip,
      country,
      metadata: { source: lead.source, formId: lead.formId },
    });
  } catch {
    // No bloquear la respuesta al usuario si falla el registro de analítica.
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
