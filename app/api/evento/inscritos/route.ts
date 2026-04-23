import { NextResponse } from "next/server";
import { readPublicEventRegistrations } from "@/lib/server/eventRegistrations";

export const runtime = "nodejs";

export async function GET() {
  const data = await readPublicEventRegistrations();
  return NextResponse.json({ ok: true, ...data });
}
