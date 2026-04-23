import { readStoredLeads } from "@/lib/server/leadsStore";
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

export async function readPublicEventRegistrations(): Promise<{
  count: number;
  registrations: PublicRegistration[];
}> {
  const response = await fetch(`${getGoogleAppsScriptUrl()}?mode=registrations&ts=${Date.now()}`, {
    cache: "no-store",
  });
  const json = (await response.json()) as GoogleAppsScriptPayload;

  if (!response.ok || !json.ok || !Array.isArray(json.registrations)) {
    const leads = await readStoredLeads();
    const registrations = leads
      .filter((lead) => lead.source === EVENT_SOURCE || lead.formId === EVENT_FORM_ID)
      .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
      .map((lead) => ({
        id: lead.id,
        name: lead.name?.trim() || "Inscripción registrada",
        email: lead.email?.trim() || "Sin correo",
        phone: lead.phone?.trim() || "Sin teléfono",
        createdAt: lead.createdAt,
        source: lead.source || "web",
      }));

    return {
      count: registrations.length,
      registrations: registrations.slice(0, 200),
    };
  }

  const registrations = json.registrations
    .map((item, index) => ({
      id:
        String(item.id || "").trim() ||
        `sheet-${typeof item.createdAt === "number" ? item.createdAt : Date.parse(String(item.createdAt || "")) || 0}-${index}`,
      name: String(item.name || "").trim() || "Inscripción registrada",
      email: String(item.email || "").trim() || "Sin correo",
      phone: String(item.phone || "").trim() || "Sin teléfono",
      createdAt:
        typeof item.createdAt === "number"
          ? item.createdAt
          : Number.isFinite(Date.parse(String(item.createdAt || "")))
            ? Date.parse(String(item.createdAt))
            : 0,
      source: String(item.source || "web").trim() || "web",
    }))
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

  return {
    count: typeof json.count === "number" ? json.count : registrations.length,
    registrations: registrations.slice(0, 200),
  };
}
