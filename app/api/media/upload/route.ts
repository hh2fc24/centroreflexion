import { NextResponse } from "next/server";
import { mkdir, readFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { getAdminSessionFromRequest } from "@/lib/server/adminAuth";
import type { MediaItem } from "@/app/api/media/route";
import { roleAtLeast } from "@/lib/server/roles";
import { writeFileAtomic, writeJsonAtomic } from "@/lib/server/atomicWrite";
import { withLock } from "@/lib/server/locks";
import { checkRateLimit, getClientIp } from "@/lib/server/rateLimit";
import { appendAudit } from "@/lib/server/auditLog";

export const runtime = "nodejs";

const MEDIA_DIR = path.join(process.cwd(), "public", "uploads");
const INDEX_PATH = path.join(process.cwd(), "data", "media.json");

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function safeName(input: string) {
  return input
    .trim()
    .replace(/[/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, "-")
    .slice(0, 120);
}

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

export async function POST(req: Request) {
  const session = getAdminSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!roleAtLeast(session.role, "editor")) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const ip = getClientIp(req);
  const rl = checkRateLimit(`media:upload:${session.user}:${ip}`, { limit: 40, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_formdata" }, { status: 400 });
  }

  const file = form.get("file");
  if (!file || typeof file === "string") return NextResponse.json({ ok: false, error: "missing_file" }, { status: 400 });

  const f = file as unknown as File;
  const originalName = f.name || "upload";
  const mime = f.type || "application/octet-stream";
  const bytes = Buffer.from(await f.arrayBuffer());
  const size = bytes.byteLength;

  // Basic size guard (20MB)
  if (size > 20 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: "file_too_large" }, { status: 413 });
  }

  const id = newId("m");
  const ext = path.extname(originalName).slice(0, 12) || "";
  const base = safeName(path.basename(originalName, path.extname(originalName))) || "file";
  const filename = `${id}-${base}${ext}`;
  const url = `/uploads/${filename}`;

  try {
    await mkdir(MEDIA_DIR, { recursive: true });
    await writeFileAtomic(path.join(MEDIA_DIR, filename), bytes);

    let variants: MediaItem["variants"] | undefined;
    let width: number | undefined;
    let height: number | undefined;

    const isImage = mime.startsWith("image/") && !mime.includes("svg") && !mime.includes("gif");
    if (isImage) {
      try {
        const img = sharp(bytes, { failOnError: false }).rotate();
        const meta = await img.metadata();
        width = typeof meta.width === "number" ? meta.width : undefined;
        height = typeof meta.height === "number" ? meta.height : undefined;

        const main = img.clone().resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true });
        const thumb = img.clone().resize({ width: 320, height: 320, fit: "inside", withoutEnlargement: true });

        const webpName = `${id}-${base}-opt.webp`;
        const avifName = `${id}-${base}-opt.avif`;
        const thumbName = `${id}-${base}-thumb.webp`;

        const [webpBuf, avifBuf, thumbBuf] = await Promise.all([
          main.clone().webp({ quality: 82 }).toBuffer(),
          main.clone().avif({ quality: 55 }).toBuffer(),
          thumb.clone().webp({ quality: 72 }).toBuffer(),
        ]);

        await writeFileAtomic(path.join(MEDIA_DIR, webpName), webpBuf);
        await writeFileAtomic(path.join(MEDIA_DIR, avifName), avifBuf);
        await writeFileAtomic(path.join(MEDIA_DIR, thumbName), thumbBuf);

        variants = { webp: `/uploads/${webpName}`, avif: `/uploads/${avifName}`, thumb: `/uploads/${thumbName}` };
      } catch {
        // ignore optimization failure; keep original
      }
    }
    const item: MediaItem = {
      id,
      createdAt: Date.now(),
      url,
      variants,
      width,
      height,
      filename,
      originalName,
      mime,
      size,
    };
    await withLock("media:index", async () => {
      const items = await readIndex();
      items.unshift(item);
      await writeIndex(items.slice(0, 5000));
    });
    await appendAudit({
      user: session.user,
      role: session.role,
      action: "media_upload",
      entity: { kind: "media", mediaId: id, url },
      detail: filename,
    });
    return NextResponse.json({ ok: true, item });
  } catch (e: unknown) {
    const detail = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
    return NextResponse.json({ ok: false, error: "upload_failed", detail }, { status: 500 });
  }
}
