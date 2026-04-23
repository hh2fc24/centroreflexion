import { readStoredLeads } from "@/lib/server/leadsStore";

export type PublicRegistration = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: number;
  source: string;
};

const EVENT_SOURCE = "evento-tecnocratas-uah";
const EVENT_FORM_ID = "launch-event-modal";

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
