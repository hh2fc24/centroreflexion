import crypto from "crypto";
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

type EncryptedLeadFile = {
  encrypted: true;
  version: 1;
  iv: string;
  tag: string;
  data: string;
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

function parseEncryptionKey() {
  const raw = process.env.CRC_LEADS_ENCRYPTION_KEY?.trim();
  if (!raw) return null;
  if (/^[a-f0-9]{64}$/i.test(raw)) return Buffer.from(raw, "hex");
  try {
    const key = Buffer.from(raw, "base64");
    return key.length === 32 ? key : null;
  } catch {
    return null;
  }
}

function isEncryptedLeadFile(input: unknown): input is EncryptedLeadFile {
  return !!input && typeof input === "object" && (input as EncryptedLeadFile).encrypted === true;
}

function decryptLeadsFile(payload: EncryptedLeadFile): StoredLead[] {
  const key = parseEncryptionKey();
  if (!key) throw new Error("leads_encryption_key_missing_or_invalid");
  const iv = Buffer.from(payload.iv, "base64");
  const tag = Buffer.from(payload.tag, "base64");
  const data = Buffer.from(payload.data, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
  const parsed = JSON.parse(plaintext);
  return Array.isArray(parsed) ? (parsed as StoredLead[]) : [];
}

function serializeLeads(leads: StoredLead[]) {
  const key = parseEncryptionKey();
  if (!key) return leads;

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const plaintext = Buffer.from(JSON.stringify(leads), "utf8");
  const data = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    encrypted: true,
    version: 1,
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    data: data.toString("base64"),
  } satisfies EncryptedLeadFile;
}

async function readLeadsFile(filePath: string): Promise<StoredLead[]> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    if (isEncryptedLeadFile(parsed)) return decryptLeadsFile(parsed);
    return Array.isArray(parsed) ? (parsed as StoredLead[]) : [];
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : String(error);
    if (detail.includes("leads_encryption_key_missing_or_invalid")) {
      throw error;
    }
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
        await writeJsonAtomic(filePath, serializeLeads(leads.slice(0, 2000)));
      });
      return { filePath };
    } catch (error: unknown) {
      const detail = error instanceof Error ? error.message : String(error);
      errors.push(`${filePath}: ${detail}`);
    }
  }

  throw new Error(errors.join(" | "));
}
