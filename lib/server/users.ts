import crypto from "crypto";
import { readFile } from "fs/promises";
import path from "path";
import type { AdminRole } from "@/lib/server/adminAuth";
import { writeJsonAtomic } from "@/lib/server/atomicWrite";

export type StoredUser = {
  id: string;
  username: string;
  role: AdminRole;
  salt: string;
  passHash: string;
  createdAt: number;
  updatedAt: number;
  disabled?: boolean;
};

const USERS_PATH = path.join(process.cwd(), "data", "users.json");

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function pbkdf2(password: string, salt: string) {
  const buf = crypto.pbkdf2Sync(password, salt, 120_000, 32, "sha256");
  return buf.toString("hex");
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const passHash = pbkdf2(password, salt);
  return { salt, passHash };
}

export function verifyPassword(password: string, salt: string, passHash: string) {
  const next = pbkdf2(password, salt);
  // Constant-time compare
  const a = Buffer.from(next, "hex");
  const b = Buffer.from(passHash, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function readUsers(): Promise<StoredUser[]> {
  try {
    const raw = await readFile(USERS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
  } catch {
    return [];
  }
}

export async function writeUsers(users: StoredUser[]) {
  await writeJsonAtomic(USERS_PATH, users);
}

export async function findUser(username: string): Promise<StoredUser | null> {
  const users = await readUsers();
  const u = users.find((x) => x.username.toLowerCase() === username.toLowerCase()) ?? null;
  if (!u || u.disabled) return null;
  return u;
}

export async function createUser(username: string, password: string, role: AdminRole): Promise<StoredUser> {
  const users = await readUsers();
  const exists = users.some((u) => u.username.toLowerCase() === username.toLowerCase());
  if (exists) throw new Error("user_exists");
  const { salt, passHash } = hashPassword(password);
  const now = Date.now();
  const u: StoredUser = { id: newId("u"), username, role, salt, passHash, createdAt: now, updatedAt: now };
  users.unshift(u);
  await writeUsers(users);
  return u;
}

export async function updateUser(
  username: string,
  patch: Partial<{ role: AdminRole; password: string; disabled: boolean }>
): Promise<StoredUser> {
  const users = await readUsers();
  const idx = users.findIndex((u) => u.username.toLowerCase() === username.toLowerCase());
  if (idx < 0) throw new Error("not_found");
  const prev = users[idx]!;
  const next: StoredUser = { ...prev, updatedAt: Date.now() };
  if (patch.role) next.role = patch.role;
  if (typeof patch.disabled === "boolean") next.disabled = patch.disabled;
  if (typeof patch.password === "string" && patch.password) {
    const { salt, passHash } = hashPassword(patch.password);
    next.salt = salt;
    next.passHash = passHash;
  }
  users[idx] = next;
  await writeUsers(users);
  return next;
}

export async function deleteUser(username: string) {
  const users = await readUsers();
  const next = users.filter((u) => u.username.toLowerCase() !== username.toLowerCase());
  await writeUsers(next);
}
