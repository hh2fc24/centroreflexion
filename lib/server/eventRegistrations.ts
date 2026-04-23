import { readFile } from "fs/promises";
import path from "path";

type Lead = {
  id: string;
  createdAt: number;
  source?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  page?: string;
  formId?: string;
  fields?: Record<string, unknown>;
};

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

async function readLeadsFile(): Promise<Lead[]> {
  const filePath = path.join(process.cwd(), "data", "leads.json");
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Lead[]) : [];
  } catch {
    return [];
  }
}

export async function readPublicEventRegistrations(): Promise<{
  count: number;
  registrations: PublicRegistration[];
}> {
  const leads = await readLeadsFile();

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
