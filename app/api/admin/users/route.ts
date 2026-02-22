import { NextResponse } from "next/server";
import { getAdminSessionFromRequest, type AdminRole } from "@/lib/server/adminAuth";
import { createUser, deleteUser, readUsers, updateUser } from "@/lib/server/users";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

function forbidden() {
  return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
}

function isAdmin(role: AdminRole) {
  return role === "admin";
}

export async function GET(req: Request) {
  const session = getAdminSessionFromRequest(req);
  if (!session) return unauthorized();
  if (!isAdmin(session.role)) return forbidden();

  const users = await readUsers();
  return NextResponse.json({
    ok: true,
    users: users.map((u) => ({
      id: u.id,
      username: u.username,
      role: u.role,
      disabled: !!u.disabled,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    })),
  });
}

export async function POST(req: Request) {
  const session = getAdminSessionFromRequest(req);
  if (!session) return unauthorized();
  if (!isAdmin(session.role)) return forbidden();

  let body: { username?: string; password?: string; role?: AdminRole };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const username = String(body.username ?? "").trim();
  const password = String(body.password ?? "");
  const role =
    body.role === "admin" || body.role === "publisher" || body.role === "editor" || body.role === "viewer" ? body.role : "viewer";
  if (!username || !password) return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });

  try {
    const u = await createUser(username, password, role);
    return NextResponse.json({ ok: true, user: { id: u.id, username: u.username, role: u.role } });
  } catch (e: unknown) {
    const detail = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
    return NextResponse.json({ ok: false, error: "create_failed", detail }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  const session = getAdminSessionFromRequest(req);
  if (!session) return unauthorized();
  if (!isAdmin(session.role)) return forbidden();

  let body: { username?: string; password?: string; role?: AdminRole; disabled?: boolean };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const username = String(body.username ?? "").trim();
  if (!username) return NextResponse.json({ ok: false, error: "missing_username" }, { status: 400 });
  const role =
    body.role && (body.role === "admin" || body.role === "publisher" || body.role === "editor" || body.role === "viewer")
      ? body.role
      : undefined;

  try {
    const u = await updateUser(username, { role, password: body.password, disabled: body.disabled });
    return NextResponse.json({ ok: true, user: { id: u.id, username: u.username, role: u.role, disabled: !!u.disabled } });
  } catch (e: unknown) {
    const detail = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
    return NextResponse.json({ ok: false, error: "update_failed", detail }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const session = getAdminSessionFromRequest(req);
  if (!session) return unauthorized();
  if (!isAdmin(session.role)) return forbidden();

  let body: { username?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const username = String(body.username ?? "").trim();
  if (!username) return NextResponse.json({ ok: false, error: "missing_username" }, { status: 400 });
  if (username.toLowerCase() === session.user.toLowerCase()) {
    return NextResponse.json({ ok: false, error: "cannot_delete_self" }, { status: 400 });
  }

  await deleteUser(username);
  return NextResponse.json({ ok: true });
}
