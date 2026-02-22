import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/server/adminAuth";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  clearAdminSessionCookie(res);
  return res;
}
