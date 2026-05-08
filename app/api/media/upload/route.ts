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
import { requireTrustedOrigin } from "@/lib/server/requestSecurity";
import { appendAudit } from "@/lib/server/auditLog";

export const runtime = "nodejs";

const MEDIA_DIR = path.join(process.cwd(), "public", "uploads");
const INDEX_PATH = path.join(process.cwd(), "data", "media.json");
const SAFE_UPLOAD_TYPES: Record<string, { extensions: string[] }> = {
  "application/pdf": { extensions: [".pdf"] },
  "image/avif": { extensions: [".avif"] },
  "image/gif": { extensions: [".gif"] },
  "image/jpeg": { extensions: [".jpg", ".jpeg"] },
  "image/png": { extensions: [".png"] },
  "image/webp": { extensions: [".webp"] },
  "video/mp4": { extensions: [".mp4"] },
  "video/quicktime": { extensions: [".mov"] },
  "video/webm": { extensions: [".webm"] },
};

function hasPrefix(bytes: Buffer, prefix: number[]) {
  if (bytes.length < prefix.length) return false;
  return prefix.every((value, index) => bytes[index] === value);
}

function includesAscii(bytes: Buffer, value: string, start = 0, end = Math.min(bytes.length, 64)) {
  return bytes.subarray(start, end).toString("ascii").includes(value);
}

function matchesFileSignature(mime: string, bytes: Buffer) {
  if (mime === "application/pdf") return includesAscii(bytes, "%PDF-", 0, 16);
  if (mime === "image/png") return hasPrefix(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (mime === "image/jpeg") return hasPrefix(bytes, [0xff, 0xd8, 0xff]);
  if (mime === "image/gif") return includesAscii(bytes, "GIF87a", 0, 8) || includesAscii(bytes, "GIF89a", 0, 8);
  if (mime === "image/webp") {
    return includesAscii(bytes, "RIFF", 0, 4) && includesAscii(bytes, "WEBP", 8, 16);
  }
  if (mime === "image/avif") {
    return includesAscii(bytes, "ftypavif", 4, 24) || includesAscii(bytes, "ftypavis", 4, 24);
  }
  if (mime === "video/webm") return hasPrefix(bytes, [0x1a, 0x45, 0xdf, 0xa3]);
  if (mime === "video/mp4") {
    return includesAscii(bytes, "ftyp", 4, 16) && /isom|iso2|mp41|mp42|avc1|M4V /.test(bytes.subarray(8, 16).toString("ascii"));
  }
  if (mime === "video/quicktime") {
    return includesAscii(bytes, "ftypqt", 4, 16) || includesAscii(bytes, "qt  ", 8, 16);
  }
  return false;
}

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
  const invalidOrigin = requireTrustedOrigin(req);
  if (invalidOrigin) return invalidOrigin;

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
  const mime = (f.type || "application/octet-stream").toLowerCase();
  const bytes = Buffer.from(await f.arrayBuffer());
  const size = bytes.byteLength;

  // Basic size guard (20MB)
  if (size > 20 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: "file_too_large" }, { status: 413 });
  }

  const id = newId("m");
  const allowedType = SAFE_UPLOAD_TYPES[mime];
  if (!allowedType) {
    return NextResponse.json({ ok: false, error: "unsupported_file_type" }, { status: 415 });
  }
  if (!matchesFileSignature(mime, bytes)) {
    return NextResponse.json({ ok: false, error: "file_signature_mismatch" }, { status: 415 });
  }

  const originalExt = path.extname(originalName).toLowerCase();
  const ext = (allowedType.extensions.includes(originalExt) ? originalExt : allowedType.extensions[0]).slice(0, 12);
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
