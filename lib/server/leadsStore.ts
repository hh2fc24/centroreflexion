import { mkdir, readFile } from "fs/promises";
import os from "os";
import path from "path";
import { writeJsonAtomic } from "@/lib/server/atomicWrite";
import { withLock } from "@/lib/server/locks";

export type StoredLead = {
  id: string;
  createdAt: number;
  source: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  page: string;
  formId?: string;
  fields?: Record<string, unknown>;
};

function uniquePaths(paths: string[]): string[] {
  return [...new Set(paths)];
}

function leadFileCandidates(): string[] {
  const configuredDir = process.env.CRC_DATA_DIR?.trim();
  return uniquePaths([
    configuredDir ? path.join(configuredDir, "leads.json") : "",
    path.join(process.cwd(), "data", "leads.json"),
    path.join(os.tmpdir(), "centroreflexion-data", "leads.json"),
  ].filter(Boolean));
}

async function readLeadsFile(filePath: string): Promise<StoredLead[]> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredLead[]) : [];
  } catch {
    return [];
  }
}

export async function readStoredLeads(): Promise<StoredLead[]> {
  const files = leadFileCandidates();
  const all = (await Promise.all(files.map((filePath) => readLeadsFile(filePath)))).flat();
  const deduped = new Map<string, StoredLead>();

  for (const lead of all) {
    if (!lead?.id) continue;
    const prev = deduped.get(lead.id);
    if (!prev || (lead.createdAt ?? 0) > (prev.createdAt ?? 0)) {
      deduped.set(lead.id, lead);
    }
  }

  return [...deduped.values()].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}

export async function appendStoredLead(lead: StoredLead): Promise<{ filePath: string }> {
  const files = leadFileCandidates();
  const errors: string[] = [];

  for (const filePath of files) {
    try {
      await mkdir(path.dirname(filePath), { recursive: true });
      await withLock(`leads:write:${filePath}`, async () => {
        const leads = await readLeadsFile(filePath);
        leads.unshift(lead);
        await writeJsonAtomic(filePath, leads.slice(0, 2000));
      });
      return { filePath };
    } catch (error: unknown) {
      const detail = error instanceof Error ? error.message : String(error);
      errors.push(`${filePath}: ${detail}`);
    }
  }

  throw new Error(errors.join(" | "));
}
