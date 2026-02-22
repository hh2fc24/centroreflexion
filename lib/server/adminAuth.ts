import crypto from "crypto";
import type { NextResponse } from "next/server";

const COOKIE_NAME = "crc_admin_session";

export type AdminRole = "admin" | "publisher" | "editor" | "viewer";

type SessionPayload = { user: string; role: AdminRole; exp: number };

function base64url(input: Buffer | string) {
  const b = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return b.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64urlDecode(input: string) {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((input.length + 3) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
}

function sign(data: string, secret: string) {
  return base64url(crypto.createHmac("sha256", secret).update(data).digest());
}

export function getAdminCreds() {
  return {
    user: process.env.CRC_ADMIN_USER || "Jrauld",
    pass: process.env.CRC_ADMIN_PASS || "Jrauld.2026",
    secret: process.env.CRC_ADMIN_SECRET || "dev-insecure-secret",
  };
}

export function createAdminToken(user: string) {
  const { secret } = getAdminCreds();
  const payload: SessionPayload = { user, role: "admin", exp: Date.now() + 1000 * 60 * 60 * 24 * 30 };
  const data = base64url(JSON.stringify(payload));
  const sig = sign(data, secret);
  return `${data}.${sig}`;
}

export function createAdminTokenWithRole(user: string, role: AdminRole) {
  const { secret } = getAdminCreds();
  const payload: SessionPayload = { user, role, exp: Date.now() + 1000 * 60 * 60 * 24 * 30 };
  const data = base64url(JSON.stringify(payload));
  const sig = sign(data, secret);
  return `${data}.${sig}`;
}

export function verifyAdminToken(token: string): { user: string; role: AdminRole } | null {
  const { secret } = getAdminCreds();
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  if (sign(data, secret) !== sig) return null;
  try {
    const payload = JSON.parse(base64urlDecode(data)) as SessionPayload;
    if (!payload?.user || !payload?.exp) return null;
    const role: AdminRole =
      payload.role === "admin" || payload.role === "publisher" || payload.role === "editor" || payload.role === "viewer"
        ? payload.role
        : "viewer";
    if (Date.now() > payload.exp) return null;
    return { user: payload.user, role };
  } catch {
    return null;
  }
}

function readCookie(cookieHeader: string, name: string) {
  const parts = cookieHeader.split(/;\s*/g);
  for (const p of parts) {
    const idx = p.indexOf("=");
    if (idx < 0) continue;
    const k = p.slice(0, idx).trim();
    if (k !== name) continue;
    return decodeURIComponent(p.slice(idx + 1));
  }
  return null;
}

export function getAdminSessionFromRequest(req: Request) {
  const cookie = req.headers.get("cookie") ?? "";
  const token = readCookie(cookie, COOKIE_NAME);
  if (!token) return null;
  return verifyAdminToken(token);
}

export function setAdminSessionCookie(res: NextResponse, user: string, role: AdminRole = "admin") {
  const token = createAdminTokenWithRole(user, role);
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearAdminSessionCookie(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
