import { NextResponse } from "next/server";
import { mkdir, readFile } from "fs/promises";
import path from "path";
import { getAdminSessionFromRequest } from "@/lib/server/adminAuth";
import { roleAtLeast } from "@/lib/server/roles";
import { writeJsonAtomic } from "@/lib/server/atomicWrite";
import { withLock } from "@/lib/server/locks";
import { appendAudit } from "@/lib/server/auditLog";

export const runtime = "nodejs";

type BackupIndex = { backups: { id: string; createdAt: number; name: string; user: string }[] };

function newId() {
  return `${new Date().toISOString().replace(/[:.]/g, "-")}-${Math.random().toString(16).slice(2, 8)}`;
}

export async function POST(req: Request) {
  const session = getAdminSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!roleAtLeast(session.role, "admin")) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  let body: { name?: string; dump?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const id = newId();
  const createdAt = Date.now();
  const name = String(body.name ?? "Backup").slice(0, 140);
  const dump = body.dump ?? {};

  const dir = path.join(process.cwd(), "data", "backups");
  const indexPath = path.join(dir, "index.json");
  const backupPath = path.join(dir, `${id}.json`);

  await mkdir(dir, { recursive: true });
  await writeJsonAtomic(backupPath, { id, createdAt, name, user: session.user, dump });
  await appendAudit({
    user: session.user,
    role: session.role,
    action: "backup",
    entity: { kind: "site" },
    detail: name,
  });

  let index: BackupIndex = { backups: [] };
  await withLock("backups:index", async () => {
    try {
      const raw = await readFile(indexPath, "utf8");
      const parsed = JSON.parse(raw) as Partial<BackupIndex>;
      index = { backups: Array.isArray(parsed.backups) ? (parsed.backups as BackupIndex["backups"]) : [] };
    } catch {
      // ignore
    }
    index.backups.unshift({ id, createdAt, name, user: session.user });
    index.backups = index.backups.slice(0, 50);
    await writeJsonAtomic(indexPath, index);
  });

  return NextResponse.json({ ok: true, id });
}
