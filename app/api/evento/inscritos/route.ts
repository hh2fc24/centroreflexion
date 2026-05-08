import { NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/server/adminAuth";
import { findPublicEventRegistrationById, readPublicEventRegistrations } from "@/lib/server/eventRegistrations";
import { roleAtLeast } from "@/lib/server/roles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_STORE_HEADERS = {
  "cache-control": "no-store, no-cache, must-revalidate, proxy-revalidate",
};

export async function GET(req: Request) {
  const session = getAdminSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  if (!roleAtLeast(session.role, "editor")) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403, headers: NO_STORE_HEADERS });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")?.trim() || "";

  try {
    if (id) {
      const result = await findPublicEventRegistrationById(id);

      if (result.registration) {
        return NextResponse.json(
          { ok: true, found: true, registration: result.registration },
          { headers: NO_STORE_HEADERS }
        );
      }

      if (result.unavailable) {
        return NextResponse.json(
          { ok: false, error: "verification_unavailable" },
          { status: 503, headers: NO_STORE_HEADERS }
        );
      }

      return NextResponse.json(
        { ok: true, found: false },
        { headers: NO_STORE_HEADERS }
      );
    }

    const data = await readPublicEventRegistrations();
    return NextResponse.json(
      { ok: true, ...data },
      {
        headers: NO_STORE_HEADERS,
      }
    );
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { ok: false, error: "registrations_unavailable", detail },
      {
        status: 502,
        headers: NO_STORE_HEADERS,
      }
    );
  }
}
