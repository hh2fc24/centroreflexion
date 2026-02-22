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
  const rl = checkRateLimit(`rollback:${session.user}:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: { id?: string; baseHash?: string };
  try {
    body = (await req.json()) as { id?: string; baseHash?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const id = String(body.id ?? "");
  if (!id) return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });

  const snapshotPath = path.join(process.cwd(), "lib/editor/versions", `${id}.json`);
  let snapshot: { theme?: unknown; content?: unknown; pages?: unknown; articles?: unknown };
  try {
    snapshot = JSON.parse(await readFile(snapshotPath, "utf8")) as unknown as {
      theme?: unknown;
      content?: unknown;
      pages?: unknown;
      articles?: unknown;
    };
  } catch {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const nextState = sanitizePublishedState({
    theme: snapshot.theme ?? {},
    content: snapshot.content ?? {},
    pages: snapshot.pages ?? [],
    articles: snapshot.articles ?? {},
  });
  const { versionsIndexPath } = publishedPaths();

  return await withLock("published:write", async () => {
    const { hash: currentHash } = await readPublishedDiskState();
    if (body.baseHash && body.baseHash !== currentHash) {
      return NextResponse.json({ ok: false, error: "conflict", serverHash: currentHash }, { status: 409 });
    }

    await writePublishedDiskState(nextState);
    await appendAudit({
      user: session.user,
      role: session.role,
      action: "rollback",
      entity: { kind: "site" },
      detail: `version=${id}`,
    });

    // Update pointer
    try {
      const raw = await readFile(versionsIndexPath, "utf8");
      const index = JSON.parse(raw);
      index.currentId = id;
      await writeJsonAtomic(versionsIndexPath, index);
    } catch {
      // ignore
    }

    return NextResponse.json({ ok: true, id });
  });
}
