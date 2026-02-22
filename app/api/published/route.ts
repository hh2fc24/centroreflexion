import { NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/server/adminAuth";
import { roleAtLeast } from "@/lib/server/roles";
import { readPublishedDiskState } from "@/lib/server/publishedDisk";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = getAdminSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!roleAtLeast(session.role, "viewer")) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const { state, hash } = await readPublishedDiskState();
  return NextResponse.json({ ok: true, state, hash });
}
