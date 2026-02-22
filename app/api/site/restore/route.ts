import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getAdminSessionFromRequest } from "@/lib/server/adminAuth";
import { roleAtLeast } from "@/lib/server/roles";
import { withLock } from "@/lib/server/locks";
import { readPublishedDiskState, writePublishedDiskState, publishedPaths } from "@/lib/server/publishedDisk";
import { writeJsonAtomic } from "@/lib/server/atomicWrite";
import { sanitizePublishedState } from "@/lib/server/sanitizeSiteState";
import { checkRateLimit, getClientIp } from "@/lib/server/rateLimit";
import { appendAudit } from "@/lib/server/auditLog";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (process.env.CRC_ENABLE_PUBLISH !== "1") {
    return NextResponse.json({ ok: false, error: "publish_disabled" }, { status: 404 });
  }

  const session = getAdminSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!roleAtLeast(session.role, "publisher")) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const ip = getClientIp(req);
  const rl = checkRateLimit(`restore:${session.user}:${ip}`, { limit: 6, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: { id?: string; baseHash?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const id = String(body.id ?? "");
  if (!id) return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });

  const backupPath = path.join(process.cwd(), "data", "backups", `${id}.json`);
  let backupJson: unknown;
  try {
    backupJson = JSON.parse(await readFile(backupPath, "utf8")) as unknown;
  } catch {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const backupObj = backupJson && typeof backupJson === "object" ? (backupJson as Record<string, unknown>) : {};
  const dump =
    backupObj.dump && typeof backupObj.dump === "object" ? (backupObj.dump as Record<string, unknown>) : {};
  const backupName = typeof backupObj.name === "string" ? backupObj.name : undefined;

  const nextState = sanitizePublishedState({
    theme: dump.theme ?? {},
    content: dump.content ?? {},
    pages: dump.pages ?? [],
    articles: dump.articles ?? {},
  });

  return await withLock("published:write", async () => {
    const { hash: currentHash } = await readPublishedDiskState();
    if (body.baseHash && body.baseHash !== currentHash) {
      return NextResponse.json({ ok: false, error: "conflict", serverHash: currentHash }, { status: 409 });
    }

    await writePublishedDiskState(nextState);
    await appendAudit({
      user: session.user,
      role: session.role,
      action: "restore",
      entity: { kind: "site" },
      detail: `backup=${id}${backupName ? ` (${backupName})` : ""}`,
    });

    // Create a version snapshot for rollback safety
    try {
      const { versionsDir } = publishedPaths();
      const versionId = `restore-${id}-${new Date().toISOString().replace(/[:.]/g, "-")}`;
      const createdAt = Date.now();
      const message = `restore: ${backupName ?? id}`.slice(0, 140);
      const snapshotPath = path.join(versionsDir, `${versionId}.json`);
      await writeJsonAtomic(snapshotPath, {
        id: versionId,
        createdAt,
        message,
        user: session.user,
        theme: dump.theme ?? {},
        content: dump.content ?? {},
        pages: dump.pages ?? [],
        articles: dump.articles ?? {},
      });
    } catch {
      // ignore
    }

    return NextResponse.json({ ok: true, id });
  });
}
