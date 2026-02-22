import { NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/server/adminAuth";
import { roleAtLeast } from "@/lib/server/roles";
import { withLock } from "@/lib/server/locks";
import { readDraftDiskState, writeDraftDiskState, type DraftDump } from "@/lib/server/draftDisk";
import { sanitizePublishedState } from "@/lib/server/sanitizeSiteState";
import { checkRateLimit, getClientIp } from "@/lib/server/rateLimit";
import { appendAudit } from "@/lib/server/auditLog";

export const runtime = "nodejs";

const lastDraftAuditAt = new Map<string, number>();

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

function sanitizeDraftDump(input: unknown): DraftDump {
  const dump = input && typeof input === "object" ? (input as DraftDump) : ({} as DraftDump);
  const sanitizedCore = sanitizePublishedState({
    theme: dump.theme ?? {},
    content: dump.content ?? {},
    pages: dump.pages ?? [],
    articles: dump.articles ?? {},
  });
  return {
    version: typeof dump.version === "number" ? dump.version : 0,
    exportedAt: typeof dump.exportedAt === "number" ? dump.exportedAt : 0,
    exportedBy: typeof dump.exportedBy === "string" ? dump.exportedBy : "",
    theme: sanitizedCore.theme,
    content: sanitizedCore.content,
    pages: sanitizedCore.pages,
    articles: sanitizedCore.articles,
    blockTemplates: dump.blockTemplates ?? [],
    pageTemplates: dump.pageTemplates ?? [],
  };
}

export async function GET(req: Request) {
  const session = getAdminSessionFromRequest(req);
  if (!session) return unauthorized();
  if (!roleAtLeast(session.role, "editor")) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const include = new URL(req.url).searchParams.get("include");
  const draft = await readDraftDiskState();
  if (!draft) return NextResponse.json({ ok: true, draft: null });

  if (include === "1") return NextResponse.json({ ok: true, draft });
  return NextResponse.json({
    ok: true,
    draft: { savedAt: draft.savedAt, savedBy: draft.savedBy, hash: draft.hash },
  });
}

export async function POST(req: Request) {
  const session = getAdminSessionFromRequest(req);
  if (!session) return unauthorized();
  if (!roleAtLeast(session.role, "editor")) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const ip = getClientIp(req);
  const rl = checkRateLimit(`draft:save:${session.user}:${ip}`, { limit: 120, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: { dump?: unknown; baseHash?: string; force?: boolean };
  try {
    body = (await req.json()) as { dump?: unknown; baseHash?: string; force?: boolean };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const dump = sanitizeDraftDump(body.dump);

  return await withLock("draft:write", async () => {
    const current = await readDraftDiskState();
    if (!body.force && body.baseHash && current?.hash && body.baseHash !== current.hash) {
      return NextResponse.json(
        { ok: false, error: "conflict", serverHash: current.hash, serverSavedAt: current.savedAt, serverSavedBy: current.savedBy },
        { status: 409 }
      );
    }
    const next = await writeDraftDiskState({ dump, savedBy: session.user });
    const prevAt = lastDraftAuditAt.get(session.user) ?? 0;
    const now = Date.now();
    if (now - prevAt > 60_000) {
      lastDraftAuditAt.set(session.user, now);
      const pagesCount = Array.isArray(dump.pages) ? dump.pages.length : 0;
      await appendAudit({
        user: session.user,
        role: session.role,
        action: "draft_save",
        entity: { kind: "site" },
        detail: `autosave (pages=${pagesCount})`,
      });
    }
    return NextResponse.json({ ok: true, hash: next.hash, savedAt: next.savedAt });
  });
}

export async function DELETE(req: Request) {
  const session = getAdminSessionFromRequest(req);
  if (!session) return unauthorized();
  if (!roleAtLeast(session.role, "editor")) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  let body: { baseHash?: string; force?: boolean } = {};
  try {
    body = (await req.json()) as { baseHash?: string; force?: boolean };
  } catch {
    // allow empty
  }

  return await withLock("draft:write", async () => {
    const current = await readDraftDiskState();
    if (current?.hash && !body.force && body.baseHash && body.baseHash !== current.hash) {
      return NextResponse.json(
        { ok: false, error: "conflict", serverHash: current.hash, serverSavedAt: current.savedAt, serverSavedBy: current.savedBy },
        { status: 409 }
      );
    }
    // Clear by writing empty state; keeps file stable.
    const cleared = await writeDraftDiskState({ dump: {}, savedBy: session.user, savedAt: Date.now() });
    return NextResponse.json({ ok: true, hash: cleared.hash });
  });
}
