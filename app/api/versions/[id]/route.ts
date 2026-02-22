import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getAdminSessionFromRequest } from "@/lib/server/adminAuth";
import { roleAtLeast } from "@/lib/server/roles";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = getAdminSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!roleAtLeast(session.role, "editor")) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const id = (await params).id;
  const snapshotPath = path.join(process.cwd(), "lib/editor/versions", `${id}.json`);
  try {
    const raw = await readFile(snapshotPath, "utf8");
    return NextResponse.json({ ok: true, snapshot: JSON.parse(raw) });
  } catch {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
}
