"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type AdminRole = "admin" | "publisher" | "editor" | "viewer";

type UserRow = {
  id: string;
  username: string;
  role: AdminRole;
  disabled: boolean;
  createdAt: number;
  updatedAt: number;
};

export function UsersPanel() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<AdminRole>("editor");

  const load = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/admin/users", { cache: "no-store" });
      const json = (await r.json()) as { ok?: boolean; users?: unknown; error?: string };
      if (!json.ok) throw new Error(json.error || "fetch_failed");
      setUsers(Array.isArray(json.users) ? (json.users as UserRow[]) : []);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
      setError(message);
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Roles & Usuarios</div>
            <div className="mt-1 text-xs text-white/50">
              Admin: gestiona accesos y todo el sistema. Publisher: puede publicar. Editor: edita (sin publicar). Viewer: solo lectura.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
              disabled={busy}
              onClick={() => load()}
            >
              {busy ? "Cargando…" : "Refrescar"}
            </button>
            <button
              type="button"
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-2 text-xs font-semibold"
              onClick={() => setCreateOpen((v) => !v)}
            >
              {createOpen ? "Cerrar" : "+ Usuario"}
            </button>
          </div>
        </div>

        {createOpen ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs text-white/60">
                Username
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </label>
              <label className="block text-xs text-white/60">
                Role
                <select
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as AdminRole)}
                >
                  <option value="admin">admin</option>
                  <option value="publisher">publisher</option>
                  <option value="editor">editor</option>
                  <option value="viewer">viewer</option>
                </select>
              </label>
              <label className="block text-xs text-white/60 col-span-2">
                Password
                <input
                  type="password"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </label>
            </div>
            <button
              type="button"
              className={cn("mt-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-3 text-sm font-semibold", busy && "opacity-70")}
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setError(null);
                try {
                  const r = await fetch("/api/admin/users", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ username: newUsername.trim(), password: newPassword, role: newRole }),
                  });
                  const json = await r.json();
                  if (!json.ok) throw new Error(json.detail || json.error || "create_failed");
                  setNewUsername("");
                  setNewPassword("");
                  setNewRole("editor");
                  setCreateOpen(false);
                  await load();
                } catch (e: unknown) {
                  const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
                  setError(message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              Crear
            </button>
          </div>
        ) : null}

        {error ? <div className="mt-3 text-xs text-red-200">Error: {error}</div> : null}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-xs font-semibold text-white/70">Usuarios ({users.length})</div>
        <div className="mt-3 space-y-2">
          {users.map((u) => (
            <div key={u.id} className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-white/90">
                    {u.username} {u.disabled ? <span className="text-white/40">(disabled)</span> : null}
                  </div>
                  <div className="mt-1 text-[11px] text-white/50">
                    {new Date(u.createdAt).toLocaleString()} · role: {u.role}
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-lg px-2 py-2 text-[11px] font-semibold text-white/60 hover:text-red-200 hover:bg-white/10 transition"
                  onClick={async () => {
                    const ok = window.confirm(`¿Eliminar usuario ${u.username}?`);
                    if (!ok) return;
                    setBusy(true);
                    try {
                      const r = await fetch("/api/admin/users", {
                        method: "DELETE",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ username: u.username }),
                      });
                      const json = await r.json();
                      if (!json.ok) throw new Error(json.detail || json.error || "delete_failed");
                      await load();
                    } catch (e: unknown) {
                      const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
                      setError(message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Eliminar
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <label className="block text-[11px] text-white/60">
                  Role
                  <select
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-2 py-2 text-xs outline-none"
                    value={u.role}
                  onChange={async (e) => {
                      const role = e.target.value as AdminRole;
                      setBusy(true);
                      setError(null);
                      try {
                        const r = await fetch("/api/admin/users", {
                          method: "PATCH",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify({ username: u.username, role }),
                        });
                        const json = await r.json();
                        if (!json.ok) throw new Error(json.detail || json.error || "update_failed");
                        await load();
                      } catch (e2: unknown) {
                        const message = e2 instanceof Error ? e2.message : typeof e2 === "string" ? e2 : JSON.stringify(e2);
                        setError(message);
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    <option value="admin">admin</option>
                    <option value="publisher">publisher</option>
                    <option value="editor">editor</option>
                    <option value="viewer">viewer</option>
                  </select>
                </label>
                <label className="block text-[11px] text-white/60">
                  Estado
                  <select
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-2 py-2 text-xs outline-none"
                    value={u.disabled ? "disabled" : "active"}
                    onChange={async (e) => {
                      const disabled = e.target.value === "disabled";
                      setBusy(true);
                      setError(null);
                      try {
                        const r = await fetch("/api/admin/users", {
                          method: "PATCH",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify({ username: u.username, disabled }),
                        });
                        const json = await r.json();
                        if (!json.ok) throw new Error(json.detail || json.error || "update_failed");
                        await load();
                      } catch (e2: unknown) {
                        const message = e2 instanceof Error ? e2.message : typeof e2 === "string" ? e2 : JSON.stringify(e2);
                        setError(message);
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    <option value="active">active</option>
                    <option value="disabled">disabled</option>
                  </select>
                </label>
              </div>

              <div className="mt-3">
                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold hover:bg-white/10 transition"
                  onClick={async () => {
                    const pass = window.prompt(`Nueva contraseña para ${u.username}:`, "") ?? "";
                    if (!pass) return;
                    setBusy(true);
                    setError(null);
                    try {
                      const r = await fetch("/api/admin/users", {
                        method: "PATCH",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ username: u.username, password: pass }),
                      });
                      const json = await r.json();
                      if (!json.ok) throw new Error(json.detail || json.error || "update_failed");
                      await load();
                    } catch (e2: unknown) {
                      const message = e2 instanceof Error ? e2.message : typeof e2 === "string" ? e2 : JSON.stringify(e2);
                      setError(message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Cambiar password
                </button>
              </div>
            </div>
          ))}
        </div>

        {!users.length ? <div className="mt-3 text-xs text-white/50">No hay usuarios en `data/users.json` aún.</div> : null}
      </div>
    </div>
  );
}
