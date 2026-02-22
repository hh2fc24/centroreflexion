import { mkdir, readFile } from "fs/promises";
import path from "path";
import { hashJson } from "@/lib/server/hash";
import { writeJsonAtomic } from "@/lib/server/atomicWrite";

export type DraftDump = {
  version?: number;
  exportedAt?: number;
  exportedBy?: string;
  theme?: unknown;
  content?: unknown;
  pages?: unknown;
  articles?: unknown;
  blockTemplates?: unknown;
  pageTemplates?: unknown;
};

export type DraftDiskState = {
  savedAt: number;
  savedBy: string;
  hash: string;
  dump: DraftDump;
};

export function draftPath() {
  return path.join(process.cwd(), "data", "draft.json");
}

export async function readDraftDiskState(): Promise<DraftDiskState | null> {
  try {
    const raw = await readFile(draftPath(), "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const rec = parsed as Partial<DraftDiskState> & Record<string, unknown>;
    const savedAt = typeof rec.savedAt === "number" ? rec.savedAt : 0;
    const savedBy = typeof rec.savedBy === "string" ? rec.savedBy : "";
    const dump = (rec.dump && typeof rec.dump === "object" ? (rec.dump as DraftDump) : {}) as DraftDump;
    const hash = typeof rec.hash === "string" ? rec.hash : hashJson({ savedAt, savedBy, dump });
    return { savedAt, savedBy, hash, dump };
  } catch {
    return null;
  }
}

export async function writeDraftDiskState(next: { dump: DraftDump; savedBy: string; savedAt?: number }) {
  const out: DraftDiskState = {
    savedAt: typeof next.savedAt === "number" ? next.savedAt : Date.now(),
    savedBy: next.savedBy,
    hash: "",
    dump: next.dump ?? {},
  };
  out.hash = hashJson({ savedAt: out.savedAt, savedBy: out.savedBy, dump: out.dump });
  await mkdir(path.dirname(draftPath()), { recursive: true });
  await writeJsonAtomic(draftPath(), out);
  return out;
}

