import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getAdminSessionFromRequest } from "@/lib/server/adminAuth";
import { roleAtLeast } from "@/lib/server/roles";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = getAdminSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!roleAtLeast(session.role, "editor")) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const indexPath = path.join(process.cwd(), "lib/editor/published-versions.json");
  try {
    const raw = await readFile(indexPath, "utf8");
    const json = JSON.parse(raw) as unknown;
    return NextResponse.json({ ok: true, index: json });
  } catch {
    return NextResponse.json({ ok: true, index: { currentId: null, versions: [] } });
  }
}
