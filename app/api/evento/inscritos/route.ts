import { NextResponse } from "next/server";
import { readPublicEventRegistrations } from "@/lib/server/eventRegistrations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await readPublicEventRegistrations();
    return NextResponse.json(
      { ok: true, ...data },
      {
        headers: {
          "cache-control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { ok: false, error: "registrations_unavailable", detail },
      {
        status: 502,
        headers: {
          "cache-control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  }
}
