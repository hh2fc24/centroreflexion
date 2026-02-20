"use client";

import { useEffect, useMemo, useState } from "react";
import { Reorder } from "framer-motion";
import {
  Eye,
  EyeOff,
  LayoutGrid,
  LogOut,
  Paintbrush,
  Plus,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useContent, useEditor, useTheme } from "@/lib/editor/hooks";
import type { Section, SectionType } from "@/lib/editor/types";
import { HomeCanvas } from "@/components/site/HomeCanvas";

const ADMIN_USER = "Jrauld";
const ADMIN_PASS = "Jrauld.2026";
const SESSION_KEY = "crc.admin.session.v1";

type Session = { user: string; expiresAt: number };

function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (!parsed?.user || !parsed?.expiresAt) return null;
    if (Date.now() > parsed.expiresAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveSession(user: string) {
  const session: Session = {
    user,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 días
  };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

function sectionTitle(type: Section["type"]) {
  switch (type) {
    case "hero":
      return "Hero";
    case "servicesPreview":
      return "Servicios";
    case "latestArticles":
      return "Lo más reciente";
    case "publications":
      return "Publicaciones";
    case "interviews":
      return "Multimedia";
    case "testimonials":
      return "Opiniones";
  }
}

function isReorderable(section: Section) {
  return section.type !== "hero";
}

const SECTION_ADD: { type: SectionType; label: string }[] = [
  { type: "servicesPreview", label: "Servicios" },
  { type: "latestArticles", label: "Lo más reciente" },
  { type: "publications", label: "Publicaciones" },
  { type: "interviews", label: "Multimedia" },
  { type: "testimonials", label: "Opiniones" },
];

type Tab = "content" | "style" | "people";

export function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [tab, setTab] = useState<Tab>("content");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [addOpen, setAddOpen] = useState(false);

  const { setAdminEnabled } = useEditor();
  const { theme, setTheme, resetTheme, lastChangedAt: themeChangedAt } = useTheme();
  const {
    content,
    getHomeSections,
    setHomeSections,
    toggleHomeSection,
    duplicateHomeSection,
    deleteHomeSection,
    addHomeSection,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    lastChangedAt: contentChangedAt,
  } = useContent();

  useEffect(() => {
    const sync = () => {
      const s = loadSession();
      setSession(s);
      setAdminEnabled(!!s);
    };

    queueMicrotask(sync);

    const handler = () => sync();
    window.addEventListener("storage", handler);
    window.addEventListener("crc-admin-session", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("crc-admin-session", handler);
    };
  }, [setAdminEnabled]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 600);
    return () => window.clearInterval(id);
  }, []);

  const sections = getHomeSections();

  const saveState = useMemo(() => {
    const last = Math.max(themeChangedAt, contentChangedAt);
    if (!last) return { label: "Listo", tone: "muted" as const };
    const delta = now - last;
    if (delta < 1000) return { label: "Guardando…", tone: "active" as const };
    return { label: "Guardado", tone: "ok" as const };
  }, [contentChangedAt, themeChangedAt, now]);

  if (!session) {
    return (
      <div className="fixed inset-0 z-[999] bg-[#05070c] text-white">
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(56,189,248,0.25),transparent_40%),radial-gradient(800px_circle_at_70%_30%,rgba(99,102,241,0.18),transparent_45%),radial-gradient(700px_circle_at_40%_90%,rgba(168,85,247,0.14),transparent_45%)]" />
        <div className="absolute inset-0 opacity-25 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),transparent)]" />

        <div className="relative mx-auto flex min-h-full max-w-6xl items-center justify-center px-6 py-16">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wide">
                <ShieldCheck className="h-4 w-4 text-cyan-300" />
                Panel de administración
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight">
                Edita tu web como si fuera Notion.
              </h1>
              <p className="mt-2 text-sm text-white/60">
                Inicia sesión para cambiar textos, secciones, estilos y opiniones en minutos.
              </p>
            </div>

            <div className="crc-glass rounded-2xl p-5 shadow-2xl shadow-black/30">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setError(null);
                  setBusy(true);
                  const form = new FormData(e.currentTarget);
                  const user = String(form.get("user") ?? "");
                  const pass = String(form.get("pass") ?? "");
                    window.setTimeout(() => {
                      setBusy(false);
                      if (user === ADMIN_USER && pass === ADMIN_PASS) {
                        saveSession(user);
                      window.dispatchEvent(new Event("crc-admin-session"));
                        return;
                      }
                      setError("Usuario o contraseña incorrectos.");
                    }, 350);
                }}
              >
                <label className="block text-xs font-semibold text-white/70">Usuario</label>
                <input
                  name="user"
                  autoComplete="username"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none ring-1 ring-transparent focus:ring-cyan-300/30"
                  placeholder="Jrauld"
                  disabled={busy}
                />

                <label className="mt-4 block text-xs font-semibold text-white/70">Contraseña</label>
                <input
                  name="pass"
                  type="password"
                  autoComplete="current-password"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none ring-1 ring-transparent focus:ring-cyan-300/30"
                  placeholder="••••••••••••"
                  disabled={busy}
                />

                {error ? (
                  <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  className={cn(
                    "mt-5 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-3 text-sm font-semibold",
                    "shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition",
                    busy && "opacity-70"
                  )}
                  disabled={busy}
                >
                  {busy ? "Verificando…" : "Entrar"}
                </button>
              </form>
            </div>

            <div className="mt-6 text-xs text-white/40">
              Tip: una vez dentro, haz click sobre cualquier texto para editarlo.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[999] bg-[#05070c] text-white">
      <div className="absolute inset-0 opacity-60 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(56,189,248,0.18),transparent_40%),radial-gradient(800px_circle_at_70%_30%,rgba(99,102,241,0.12),transparent_45%),radial-gradient(700px_circle_at_40%_90%,rgba(168,85,247,0.1),transparent_45%)]" />

      {/* Topbar */}
      <div className="relative z-20 flex h-16 items-center justify-between border-b border-white/10 bg-black/20 px-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
            <Sparkles className="h-5 w-5 text-cyan-300" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">CRC Editor</div>
            <div className="text-[11px] text-white/50">Edición visual · guardado automático</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={cn(
              "hidden sm:inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
              saveState.tone === "active"
                ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
                : saveState.tone === "ok"
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-100"
                  : "border-white/10 bg-white/5 text-white/60"
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
            {saveState.label}
          </div>

          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
            onClick={() => window.open("/", "_blank", "noopener,noreferrer")}
          >
            Ver sitio como cliente
          </button>

          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition inline-flex items-center gap-2"
            onClick={() => {
              clearSession();
              window.dispatchEvent(new Event("crc-admin-session"));
            }}
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </div>
      </div>

      <div className="relative z-10 flex h-[calc(100%-4rem)]">
        {/* Sidebar */}
        <aside className="w-[380px] border-r border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="flex items-center gap-2 p-3">
            <button
              className={cn(
                "flex-1 rounded-xl px-3 py-2 text-xs font-semibold border transition inline-flex items-center justify-center gap-2",
                tab === "content"
                  ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              )}
              onClick={() => setTab("content")}
            >
              <LayoutGrid className="h-4 w-4" />
              Contenido
            </button>
            <button
              className={cn(
                "flex-1 rounded-xl px-3 py-2 text-xs font-semibold border transition inline-flex items-center justify-center gap-2",
                tab === "style"
                  ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              )}
              onClick={() => setTab("style")}
            >
              <Paintbrush className="h-4 w-4" />
              Estilo
            </button>
            <button
              className={cn(
                "flex-1 rounded-xl px-3 py-2 text-xs font-semibold border transition inline-flex items-center justify-center gap-2",
                tab === "people"
                  ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              )}
              onClick={() => setTab("people")}
            >
              <Users className="h-4 w-4" />
              Opiniones
            </button>
          </div>

          <div className="h-[calc(100%-3.25rem)] overflow-auto px-3 pb-6">
            {tab === "content" ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Secciones (Inicio)</div>
                      <div className="mt-1 text-xs text-white/50">Arrastra para reordenar. Ojo para ocultar.</div>
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition inline-flex items-center gap-2"
                        onClick={() => setAddOpen((v) => !v)}
                        title="Añadir sección"
                      >
                        <Plus className="h-4 w-4" />
                        Añadir
                      </button>
                      {addOpen ? (
                        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-black/60 p-2 backdrop-blur-xl shadow-2xl shadow-black/40">
                          {SECTION_ADD.map((opt) => (
                            <button
                              key={opt.type}
                              type="button"
                              className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-white/80 hover:bg-white/10 transition"
                              onClick={() => {
                                addHomeSection(opt.type);
                                setAddOpen(false);
                              }}
                            >
                              + {opt.label}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Reorder.Group
                      axis="y"
                      values={sections}
                      onReorder={(next) => {
                        // Mantiene hero arriba si existe
                        const hero = next.find((s) => s.type === "hero") ?? null;
                        const others = next.filter((s) => s.type !== "hero");
                        const locked = hero ? [hero, ...others] : others;
                        setHomeSections(locked);
                      }}
                      className="space-y-2"
                    >
                      {sections.map((s) => (
                        <Reorder.Item
                          key={s.id}
                          value={s}
                          dragListener={isReorderable(s)}
                          className={cn(
                            "group rounded-xl border px-3 py-2 text-sm",
                            "border-white/10 bg-white/5 hover:bg-white/10 transition",
                            !s.visible && "opacity-50"
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold">{sectionTitle(s.type)}</div>
                              <div className="mt-0.5 text-[11px] text-white/50 truncate">
                                {s.type === "hero" ? "Fijado arriba" : "Arrastrable"}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                className="rounded-lg p-2 text-white/70 hover:text-white hover:bg-white/10 transition"
                                onClick={() => toggleHomeSection(s.id)}
                                aria-label={s.visible ? "Ocultar sección" : "Mostrar sección"}
                              >
                                {s.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              </button>
                              <button
                                type="button"
                                className="rounded-lg p-2 text-white/70 hover:text-white hover:bg-white/10 transition"
                                onClick={() => duplicateHomeSection(s.id)}
                                aria-label="Duplicar sección"
                              >
                                ⎘
                              </button>
                              <button
                                type="button"
                                className="rounded-lg p-2 text-white/70 hover:text-white hover:bg-white/10 transition"
                                onClick={() => {
                                  const ok = window.confirm("¿Eliminar esta sección?");
                                  if (!ok) return;
                                  deleteHomeSection(s.id);
                                }}
                                aria-label="Eliminar sección"
                              >
                                ⌫
                              </button>
                            </div>
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  </div>

                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold">Acciones rápidas</div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition"
                      onClick={() => addTestimonial()}
                    >
                      + Testimonio
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition"
                      onClick={() => resetTheme()}
                    >
                      Reset estilo
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {tab === "style" ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold">Tema global</div>
                  <div className="mt-1 text-xs text-white/50">Preview en vivo en el canvas.</div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <label className="text-xs text-white/60">
                      Primario
                      <input
                        type="color"
                        className="mt-2 h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent"
                        value={theme.primary}
                        onChange={(e) => setTheme({ primary: e.target.value })}
                      />
                    </label>
                    <label className="text-xs text-white/60">
                      Secundario
                      <input
                        type="color"
                        className="mt-2 h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent"
                        value={theme.secondary}
                        onChange={(e) => setTheme({ secondary: e.target.value })}
                      />
                    </label>
                    <label className="text-xs text-white/60">
                      Fondo
                      <input
                        type="color"
                        className="mt-2 h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent"
                        value={theme.background}
                        onChange={(e) => setTheme({ background: e.target.value })}
                      />
                    </label>
                    <label className="text-xs text-white/60">
                      Texto
                      <input
                        type="color"
                        className="mt-2 h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent"
                        value={theme.foreground}
                        onChange={(e) => setTheme({ foreground: e.target.value })}
                      />
                    </label>
                  </div>

                  <div className="mt-4">
                    <label className="text-xs text-white/60">Tipografía</label>
                    <select
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                      value={theme.font}
                      onChange={(e) =>
                        setTheme({ font: e.target.value as "inter" | "geist" | "merriweather" })
                      }
                    >
                      <option value="inter">Inter</option>
                      <option value="geist">Geist</option>
                      <option value="merriweather">Merriweather</option>
                    </select>
                  </div>

                  <div className="mt-4">
                    <label className="flex items-center justify-between text-xs text-white/60">
                      Tamaño de texto
                      <span className="text-white/50">{Math.round(theme.textScale * 100)}%</span>
                    </label>
                    <input
                      type="range"
                      min={0.9}
                      max={1.15}
                      step={0.01}
                      value={theme.textScale}
                      onChange={(e) => setTheme({ textScale: Number(e.target.value) })}
                      className="mt-2 w-full"
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <label className="text-xs text-white/60">
                      Bordes (radio)
                      <input
                        type="range"
                        min={8}
                        max={28}
                        step={1}
                        value={theme.radius}
                        onChange={(e) => setTheme({ radius: Number(e.target.value) })}
                        className="mt-2 w-full"
                      />
                    </label>
                    <label className="text-xs text-white/60">
                      Sombras
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={theme.shadow}
                        onChange={(e) => setTheme({ shadow: Number(e.target.value) })}
                        className="mt-2 w-full"
                      />
                    </label>
                  </div>
                </div>
              </div>
            ) : null}

            {tab === "people" ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Testimonios</div>
                      <div className="mt-1 text-xs text-white/50">Edita desde el canvas o aquí.</div>
                    </div>
                    <button
                      type="button"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition inline-flex items-center gap-2"
                      onClick={() => addTestimonial()}
                    >
                      <Plus className="h-4 w-4" />
                      Nuevo
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {content.testimonials.map((t) => (
                      <div
                        key={t.id}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <input
                              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                              value={t.name}
                              onChange={(e) => updateTestimonial(t.id, { name: e.target.value })}
                            />
                            <input
                              className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs outline-none text-white/80"
                              value={t.category}
                              onChange={(e) => updateTestimonial(t.id, { category: e.target.value })}
                            />
                          </div>
                          <button
                            type="button"
                            className="rounded-lg p-2 text-white/60 hover:text-red-200 hover:bg-white/10 transition"
                            onClick={() => {
                              const ok = window.confirm("¿Eliminar este testimonio?");
                              if (!ok) return;
                              deleteTestimonial(t.id);
                            }}
                            aria-label="Eliminar"
                          >
                            ⌫
                          </button>
                        </div>
                        <textarea
                          className="mt-3 w-full resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                          rows={3}
                          value={t.text}
                          onChange={(e) => updateTestimonial(t.id, { text: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </aside>

        {/* Canvas */}
        <main className="flex-1 overflow-auto bg-[color:var(--background)] text-[color:var(--foreground)]">
          <div className="mx-auto max-w-[1200px] px-0">
            <HomeCanvas />
          </div>
        </main>
      </div>
    </div>
  );
}
