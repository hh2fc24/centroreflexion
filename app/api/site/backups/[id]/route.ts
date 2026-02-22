import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getAdminSessionFromRequest } from "@/lib/server/adminAuth";
import { roleAtLeast } from "@/lib/server/roles";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = getAdminSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!roleAtLeast(session.role, "admin")) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const id = (await params).id;
  const backupPath = path.join(process.cwd(), "data", "backups", `${id}.json`);
  try {
    const raw = await readFile(backupPath, "utf8");
    return NextResponse.json({ ok: true, backup: JSON.parse(raw) });
  } catch {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
}

