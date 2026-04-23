import { readStoredLeads, type StoredLead } from "@/lib/server/leadsStore";
import { getGoogleAppsScriptUrl } from "@/lib/site";

export type PublicRegistration = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: number;
  source: string;
};

type GoogleAppsScriptPayload = {
  ok?: boolean;
  count?: number;
  registrations?: Array<{
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    createdAt?: number | string;
    source?: string;
  }>;
};

const EVENT_SOURCE = "evento-tecnocratas-uah";
const EVENT_FORM_ID = "launch-event-modal";

function normalizeTimestamp(value: number | string | undefined) {
  if (typeof value === "number") return value;
  const parsed = Date.parse(String(value || ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function mapLeadToRegistration(lead: StoredLead): PublicRegistration {
  return {
    id: lead.id,
    name: lead.name?.trim() || "Inscripción registrada",
    email: lead.email?.trim() || "Sin correo",
    phone: lead.phone?.trim() || "Sin teléfono",
    createdAt: lead.createdAt,
    source: lead.source || "web",
  };
}

async function readLocalMirrorRegistrations() {
  const leads = await readStoredLeads();
  return leads
    .filter((lead) => lead.source === EVENT_SOURCE || lead.formId === EVENT_FORM_ID)
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
    .map(mapLeadToRegistration);
}

async function readGoogleRegistrations(): Promise<{
  count: number;
  registrations: PublicRegistration[];
}> {
  const response = await fetch(`${getGoogleAppsScriptUrl()}?mode=registrations&ts=${Date.now()}`, {
    cache: "no-store",
  });
  const raw = await response.text();
  let json: GoogleAppsScriptPayload | null = null;

  try {
    json = JSON.parse(raw) as GoogleAppsScriptPayload;
  } catch {
    json = null;
  }

  if (!response.ok || !json?.ok || !Array.isArray(json.registrations)) {
    throw new Error("google_registrations_unavailable");
  }

  const registrations = json.registrations
    .map((item, index) => ({
      id: String(item.id || "").trim() || `sheet-${normalizeTimestamp(item.createdAt)}-${index}`,
      name: String(item.name || "").trim() || "Inscripción registrada",
      email: String(item.email || "").trim() || "Sin correo",
      phone: String(item.phone || "").trim() || "Sin teléfono",
      createdAt: normalizeTimestamp(item.createdAt),
      source: String(item.source || "web").trim() || "web",
    }))
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

  return {
    count: typeof json.count === "number" ? json.count : registrations.length,
    registrations: registrations.slice(0, 200),
  };
}

export async function readPublicEventRegistrations(): Promise<{
  count: number;
  registrations: PublicRegistration[];
}> {
  try {
    return await readGoogleRegistrations();
  } catch {
    const registrations = await readLocalMirrorRegistrations();
    return {
      count: registrations.length,
      registrations: registrations.slice(0, 200),
    };
  }
}

export async function findPublicEventRegistrationById(id: string): Promise<{
  registration: PublicRegistration | null;
  unavailable: boolean;
}> {
  const targetId = id.trim();
  if (!targetId) {
    return {
      registration: null,
      unavailable: false,
    };
  }

  try {
    const data = await readGoogleRegistrations();
    return {
      registration: data.registrations.find((item) => item.id === targetId) ?? null,
      unavailable: false,
    };
  } catch {
    const fallback = await readLocalMirrorRegistrations();
    const registration = fallback.find((item) => item.id === targetId) ?? null;
    return {
      registration,
      unavailable: !registration,
    };
  }
}
