import { readStoredLeads } from "@/lib/server/leadsStore";

export type PublicRegistration = {
  id: string;
  name: string;
  createdAt: number;
  source: string;
};

const EVENT_SOURCE = "evento-tecnocratas-uah";
const EVENT_FORM_ID = "launch-event-modal";

function maskName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "Inscripción registrada";
  if (parts.length === 1) return parts[0]!;
  const last = parts[parts.length - 1]!;
  return `${parts.slice(0, -1).join(" ")} ${last.charAt(0)}.`;
}

export async function readPublicEventRegistrations(): Promise<{
  count: number;
  registrations: PublicRegistration[];
}> {
  const leads = await readStoredLeads();

  const registrations = leads
    .filter((lead) => lead.source === EVENT_SOURCE || lead.formId === EVENT_FORM_ID)
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
    .map((lead) => ({
      id: lead.id,
      name: maskName(lead.name || ""),
      createdAt: lead.createdAt,
      source: lead.source || "web",
    }));

  return {
    count: registrations.length,
    registrations: registrations.slice(0, 200),
  };
}
