import { NextResponse } from "next/server";
import { mkdir, readFile, rm } from "fs/promises";
import path from "path";
import { getAdminSessionFromRequest } from "@/lib/server/adminAuth";
import { roleAtLeast } from "@/lib/server/roles";
import { writeJsonAtomic } from "@/lib/server/atomicWrite";
import { withLock } from "@/lib/server/locks";
import { appendAudit } from "@/lib/server/auditLog";

export const runtime = "nodejs";

export type MediaItem = {
  id: string;
  createdAt: number;
  url: string;
  variants?: { webp?: string; avif?: string; thumb?: string };
  width?: number;
  height?: number;
  filename: string;
  originalName: string;
  mime: string;
  size: number;
};

const MEDIA_DIR = path.join(process.cwd(), "public", "uploads");
const INDEX_PATH = path.join(process.cwd(), "data", "media.json");

async function readIndex(): Promise<MediaItem[]> {
  try {
    const raw = await readFile(INDEX_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as MediaItem[]) : [];
  } catch {
    return [];
  }
}

async function writeIndex(items: MediaItem[]) {
  await writeJsonAtomic(INDEX_PATH, items);
}

export async function GET(req: Request) {
  const session = getAdminSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!roleAtLeast(session.role, "editor")) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const items = await readIndex();
  return NextResponse.json({ ok: true, items });
}

export async function DELETE(req: Request) {
  const session = getAdminSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!roleAtLeast(session.role, "editor")) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? "";
  if (!id) return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });

  return await withLock("media:index", async () => {
    const items = await readIndex();
    const item = items.find((x) => x.id === id) ?? null;
    if (!item) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

    try {
      await mkdir(MEDIA_DIR, { recursive: true });
      await rm(path.join(MEDIA_DIR, item.filename), { force: true });
      const variants = item.variants ?? {};
      const extraUrls = [variants.webp, variants.avif, variants.thumb].filter((x): x is string => typeof x === "string");
      for (const u of extraUrls) {
        const fname = path.basename(u);
        if (!fname) continue;
        await rm(path.join(MEDIA_DIR, fname), { force: true });
      }
      await writeIndex(items.filter((x) => x.id !== id));
      await appendAudit({
        user: session.user,
        role: session.role,
        action: "media_delete",
        entity: { kind: "media", mediaId: id, url: item.url },
        detail: item.filename,
      });
    } catch (e: unknown) {
      const detail = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
      return NextResponse.json({ ok: false, error: "delete_failed", detail }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id });
  });
}
