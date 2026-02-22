import { appendFile, mkdir, readFile, rename, stat } from "fs/promises";
import path from "path";
import { withLock } from "@/lib/server/locks";

export type AuditAction =
  | "draft_save"
  | "publish"
  | "rollback"
  | "restore"
  | "backup"
  | "import"
  | "export"
  | "media_upload"
  | "media_delete";

export type AuditEntity =
  | { kind: "site" }
  | { kind: "page"; pageId: string }
  | { kind: "block"; pageId: string; blockId: string }
  | { kind: "media"; mediaId: string; url?: string };

export type AuditEntry = {
  id: string;
  at: number;
  user: string;
  role?: string;
  action: AuditAction;
  entity?: AuditEntity;
  detail?: string;
};

const LOG_PATH = path.join(process.cwd(), "data", "audit.jsonl");
const MAX_BYTES = 5 * 1024 * 1024;

function newId() {
  return `aud-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

async function rotateIfNeeded() {
  try {
    const s = await stat(LOG_PATH);
    if (s.size < MAX_BYTES) return;
    const rotated = path.join(process.cwd(), "data", `audit-${new Date().toISOString().replace(/[:.]/g, "-")}.jsonl`);
    await rename(LOG_PATH, rotated);
  } catch {
    // ignore
  }
}

export async function appendAudit(entry: Omit<AuditEntry, "id" | "at"> & { id?: string; at?: number }) {
  const out: AuditEntry = {
    id: entry.id ?? newId(),
    at: entry.at ?? Date.now(),
    user: entry.user,
    role: entry.role,
    action: entry.action,
    entity: entry.entity,
    detail: entry.detail,
  };
  await withLock("audit:write", async () => {
    await mkdir(path.dirname(LOG_PATH), { recursive: true });
    await rotateIfNeeded();
    await appendFile(LOG_PATH, JSON.stringify(out) + "\n", "utf8");
  });
  return out;
}

export async function readAudit({ limit = 200 }: { limit?: number } = {}): Promise<AuditEntry[]> {
  try {
    const raw = await readFile(LOG_PATH, "utf8");
    const lines = raw.split("\n").filter(Boolean);
    const start = Math.max(0, lines.length - Math.max(1, Math.min(limit, 1000)));
    const out: AuditEntry[] = [];
    for (let i = lines.length - 1; i >= start; i--) {
      try {
        const parsed = JSON.parse(lines[i]!) as AuditEntry;
        if (parsed && typeof parsed === "object") out.push(parsed);
      } catch {
        // ignore
      }
    }
    return out;
  } catch {
    return [];
  }
}

