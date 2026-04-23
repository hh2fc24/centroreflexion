import { NextResponse } from "next/server";
import { readPublishedDiskState } from "@/lib/server/publishedDisk";

export const runtime = "nodejs";

export async function GET() {
  const { state, hash } = await readPublishedDiskState();
  return NextResponse.json({ ok: true, state, hash });
}
