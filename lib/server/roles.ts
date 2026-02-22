import type { AdminRole } from "@/lib/server/adminAuth";

const RANK: Record<AdminRole, number> = { viewer: 1, editor: 2, publisher: 3, admin: 4 };

export function roleAtLeast(role: AdminRole, required: AdminRole) {
  return (RANK[role] ?? 0) >= (RANK[required] ?? 0);
}
