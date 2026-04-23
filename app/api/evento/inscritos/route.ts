import { NextResponse } from "next/server";
import { readPublicEventRegistrations } from "@/lib/server/eventRegistrations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const data = await readPublicEventRegistrations();
  return NextResponse.json(
    { ok: true, ...data },
    {
      headers: {
        "cache-control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );
}
