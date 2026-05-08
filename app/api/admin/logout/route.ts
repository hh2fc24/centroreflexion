import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/server/adminAuth";
import { requireTrustedOrigin } from "@/lib/server/requestSecurity";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const invalidOrigin = requireTrustedOrigin(req);
  if (invalidOrigin) return invalidOrigin;

  const res = NextResponse.json({ ok: true });
  clearAdminSessionCookie(res);
  return res;
}
