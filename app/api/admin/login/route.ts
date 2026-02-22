import { NextResponse } from "next/server";
import { getAdminCreds, setAdminSessionCookie } from "@/lib/server/adminAuth";
import { findUser, verifyPassword } from "@/lib/server/users";
import { checkRateLimit, getClientIp } from "@/lib/server/rateLimit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl1 = checkRateLimit(`admin:login:ip:${ip}`, { limit: 12, windowMs: 60_000 });
  const rl2 = checkRateLimit(`admin:login:ip:${ip}:h`, { limit: 120, windowMs: 60 * 60_000 });
  if (!rl1.ok || !rl2.ok) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: { user?: string; pass?: string };
  try {
    body = (await req.json()) as { user?: string; pass?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const user = String(body.user ?? "");
  const pass = String(body.pass ?? "");
  const creds = getAdminCreds();

  // Prefer users file if present
  const stored = await findUser(user);
  if (stored) {
    const ok = verifyPassword(pass, stored.salt, stored.passHash);
    if (!ok) return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
    const res = NextResponse.json({
      ok: true,
      user: stored.username,
      role: stored.role,
      insecureDevMode: creds.secret === "dev-insecure-secret",
      usersFile: true,
    });
    setAdminSessionCookie(res, stored.username, stored.role);
    return res;
  }

  if (user !== creds.user || pass !== creds.pass) {
    return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
  }

  const res = NextResponse.json({
    ok: true,
    user,
    role: "admin",
    insecureDevMode: creds.secret === "dev-insecure-secret",
    usersFile: false,
  });
  setAdminSessionCookie(res, user, "admin");
  return res;
}
