"use client";

import { useEffect, useMemo, useState } from "react";
import { Reorder } from "framer-motion";
import {
  BookOpen,
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
import { useArticles, useContent, useEditor, useTheme } from "@/lib/editor/hooks";
import type { Section, SectionType } from "@/lib/editor/types";
import { HomeCanvas } from "@/components/site/HomeCanvas";
import { parseDisplayDate } from "@/lib/articles/date";
import { slugify } from "@/lib/editor/articlesStore";

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

type Tab = "content" | "style" | "people" | "articles";

export function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [tab, setTab] = useState<Tab>("content");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [addOpen, setAddOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishValidate, setPublishValidate] = useState(true);
  const [publishGit, setPublishGit] = useState(true);
  const [publishBusy, setPublishBusy] = useState(false);
  const [publishResult, setPublishResult] = useState<string | null>(null);
  const [articlesKind, setArticlesKind] = useState<"columns" | "reviews">("columns");
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const { setAdminEnabled, selectedTextPath, selectText } = useEditor();
  const {
    theme,
    setTheme,
    setTextStyle,
    resetTextStyle,
    resetTheme,
    lastChangedAt: themeChangedAt,
  } = useTheme();
  const {
    content,
    getHomeSections,
    setHomeSections,
    toggleHomeSection,
    duplicateHomeSection,
    deleteHomeSection,
    addHomeSection,
    set: setContent,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    lastChangedAt: contentChangedAt,
  } = useContent();

  const {
    columns: articleColumns,
    reviews: articleReviews,
    add: addArticle,
    rename: renameArticle,
    update: updateArticle,
    remove: removeArticle,
    reset: resetArticles,
    lastChangedAt: articlesChangedAt,
  } = useArticles();

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

  const articles = useMemo(() => {
    const list = articlesKind === "columns" ? articleColumns : articleReviews;
    const sorted = [...list].sort((a, b) => {
      const ta = parseDisplayDate(a.date);
      const tb = parseDisplayDate(b.date);
      if (Number.isFinite(ta) && Number.isFinite(tb)) return tb - ta;
      return b.date.localeCompare(a.date);
    });
    return sorted;
  }, [articleColumns, articleReviews, articlesKind]);

  const selectedArticle = useMemo(() => {
    if (!selectedArticleId) return null;
    const list = articlesKind === "columns" ? articleColumns : articleReviews;
    return list.find((a) => a.id === selectedArticleId) ?? null;
  }, [articleColumns, articleReviews, articlesKind, selectedArticleId]);

  const saveState = useMemo(() => {
    const last = Math.max(themeChangedAt, contentChangedAt, articlesChangedAt);
    if (!last) return { label: "Listo", tone: "muted" as const };
    const delta = now - last;
    if (delta < 1000) return { label: "Guardando…", tone: "active" as const };
    return { label: "Guardado", tone: "ok" as const };
  }, [articlesChangedAt, contentChangedAt, themeChangedAt, now]);

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
            className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-100 hover:bg-cyan-500/15 transition"
            onClick={() => {
              setPublishResult(null);
              setPublishOpen(true);
            }}
          >
            Publicar cambios
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

      {publishOpen ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur-xl shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">Publicar</div>
                <div className="mt-1 text-xs text-white/60">
                  Escribe a disco + (opcional) valida build + commit/push.
                </div>
              </div>
              <button
                type="button"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                onClick={() => setPublishOpen(false)}
                disabled={publishBusy}
              >
                Cerrar
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold">Validar build</div>
                  <div className="text-xs text-white/50">Corre `npm run build` antes de publicar.</div>
                </div>
                <input
                  type="checkbox"
                  checked={publishValidate}
                  onChange={(e) => setPublishValidate(e.target.checked)}
                  disabled={publishBusy}
                />
              </label>
              <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold">Commit + Push</div>
                  <div className="text-xs text-white/50">Hace `git add/commit/push` a `origin/main`.</div>
                </div>
                <input
                  type="checkbox"
                  checked={publishGit}
                  onChange={(e) => setPublishGit(e.target.checked)}
                  disabled={publishBusy}
                />
              </label>

              {publishResult ? (
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/70 whitespace-pre-wrap">
                  {publishResult}
                </div>
              ) : null}

              <button
                type="button"
                className={cn(
                  "w-full rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-3 text-sm font-semibold",
                  "shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition",
                  publishBusy && "opacity-70"
                )}
                disabled={publishBusy}
                onClick={async () => {
                  setPublishBusy(true);
                  setPublishResult(null);
                  try {
                    const r = await fetch("/api/publish", {
                      method: "POST",
                      headers: {
                        "content-type": "application/json",
                        authorization: `Basic ${btoa(`${ADMIN_USER}:${ADMIN_PASS}`)}`,
                      },
                      body: JSON.stringify({
                        theme,
                        content,
                        articles: { columns: articleColumns, reviews: articleReviews },
                        validateBuild: publishValidate,
                        gitCommitPush: publishGit,
                        commitMessage: `chore(publish): ${new Date().toISOString()}`,
                      }),
                    });
                    const json = await r.json();
                    if (!json.ok) {
                      setPublishResult(`Error: ${json.error}\n\n${JSON.stringify(json.logs ?? [], null, 2)}`);
                    } else {
                      setPublishResult(`OK\n\n${JSON.stringify(json.logs ?? [], null, 2)}`);
                    }
                  } catch (e: unknown) {
                    const message =
                      e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
                    setPublishResult(`Error: ${message}`);
                  } finally {
                    setPublishBusy(false);
                  }
                }}
              >
                {publishBusy ? "Publicando…" : "Publicar ahora"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="relative z-10 flex h-[calc(100%-4rem)]">
        {/* Sidebar */}
        <aside className="w-[380px] border-r border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-2 p-3">
            <button
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-semibold border transition inline-flex items-center justify-center gap-2",
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
                "rounded-xl px-3 py-2 text-xs font-semibold border transition inline-flex items-center justify-center gap-2",
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
                "rounded-xl px-3 py-2 text-xs font-semibold border transition inline-flex items-center justify-center gap-2",
                tab === "people"
                  ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              )}
              onClick={() => setTab("people")}
            >
              <Users className="h-4 w-4" />
              Opiniones
            </button>
            <button
              className={cn(
                "rounded-xl px-3 py-2 text-xs font-semibold border transition inline-flex items-center justify-center gap-2",
                tab === "articles"
                  ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              )}
              onClick={() => setTab("articles")}
            >
              <BookOpen className="h-4 w-4" />
              Artículos
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

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold">Enlaces</div>
                  <div className="mt-1 text-xs text-white/50">Botones y redes (sin código).</div>
                  <div className="mt-4 space-y-3">
                    <label className="block text-xs text-white/60">
                      CTA principal (Hero)
                      <input
                        className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                        value={content.hero.primaryCtaHref}
                        onChange={(e) => setContent("hero.primaryCtaHref", e.target.value)}
                      />
                    </label>
                    <label className="block text-xs text-white/60">
                      CTA secundario (Hero)
                      <input
                        className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                        value={content.hero.secondaryCtaHref}
                        onChange={(e) => setContent("hero.secondaryCtaHref", e.target.value)}
                      />
                    </label>
                    <label className="block text-xs text-white/60">
                      Instagram
                      <input
                        className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                        value={content.footer.instagramHref}
                        onChange={(e) => setContent("footer.instagramHref", e.target.value)}
                      />
                    </label>
                    <label className="block text-xs text-white/60">
                      LinkedIn
                      <input
                        className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                        value={content.footer.linkedinHref}
                        onChange={(e) => setContent("footer.linkedinHref", e.target.value)}
                      />
                    </label>
                  </div>
                </div>
              </div>
            ) : null}

            {tab === "style" ? (
              <div className="space-y-4">
                {selectedTextPath ? (
                  <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">Estilo del texto seleccionado</div>
                        <div className="mt-1 text-xs text-white/60 break-all">{selectedTextPath}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                          onClick={() => resetTextStyle(selectedTextPath)}
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                          onClick={() => selectText(null)}
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <label className="text-xs text-white/60">
                        Color
                        <input
                          type="color"
                          className="mt-2 h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent"
                          value={theme.textStyles?.[selectedTextPath]?.color ?? theme.foreground}
                          onChange={(e) => setTextStyle(selectedTextPath, { color: e.target.value })}
                        />
                      </label>
                      <label className="text-xs text-white/60">
                        Fuente
                        <select
                          className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                          value={theme.textStyles?.[selectedTextPath]?.font ?? ""}
                          onChange={(e) => {
                            const v = e.target.value;
                            setTextStyle(selectedTextPath, {
                              font: (v ? (v as "inter" | "geist" | "merriweather") : undefined),
                            });
                          }}
                        >
                          <option value="">(Heredar)</option>
                          <option value="inter">Inter</option>
                          <option value="geist">Geist</option>
                          <option value="merriweather">Merriweather</option>
                        </select>
                      </label>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <label className="text-xs text-white/60">
                        Tamaño (px)
                        <input
                          type="range"
                          min={12}
                          max={96}
                          step={1}
                          value={theme.textStyles?.[selectedTextPath]?.fontSizePx ?? 18}
                          onChange={(e) =>
                            setTextStyle(selectedTextPath, {
                              fontSizePx: Number(e.target.value),
                            })
                          }
                          className="mt-2 w-full"
                        />
                      </label>
                      <label className="text-xs text-white/60">
                        Peso
                        <input
                          type="range"
                          min={300}
                          max={900}
                          step={50}
                          value={theme.textStyles?.[selectedTextPath]?.fontWeight ?? 600}
                          onChange={(e) =>
                            setTextStyle(selectedTextPath, {
                              fontWeight: Number(e.target.value),
                            })
                          }
                          className="mt-2 w-full"
                        />
                      </label>
                    </div>
                  </div>
                ) : null}

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold">Tema global</div>
                  <div className="mt-1 text-xs text-white/50">Preview en vivo en el canvas.</div>

                  <div className="mt-4">
                    <label className="text-xs text-white/60">Modo</label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        className={cn(
                          "rounded-xl px-3 py-2 text-xs font-semibold border transition",
                          theme.mode === "light"
                            ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
                            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                        )}
                        onClick={() => setTheme({ mode: "light" })}
                      >
                        Claro
                      </button>
                      <button
                        type="button"
                        className={cn(
                          "rounded-xl px-3 py-2 text-xs font-semibold border transition",
                          theme.mode === "dark"
                            ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
                            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                        )}
                        onClick={() =>
                          setTheme({
                            mode: "dark",
                            background: theme.background === "#ffffff" ? "#0b1220" : theme.background,
                            surface: theme.surface === "#ffffff" ? "#0f172a" : theme.surface,
                            foreground: theme.foreground === "#0f172a" ? "#e2e8f0" : theme.foreground,
                            mutedForeground: theme.mutedForeground === "#475569" ? "#94a3b8" : theme.mutedForeground,
                            border:
                              theme.border === "rgba(148,163,184,0.25)"
                                ? "rgba(148,163,184,0.18)"
                                : theme.border,
                          })
                        }
                      >
                        Oscuro
                      </button>
                    </div>
                  </div>

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
                      Superficie
                      <input
                        type="color"
                        className="mt-2 h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent"
                        value={theme.surface}
                        onChange={(e) => setTheme({ surface: e.target.value })}
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
                    <label className="text-xs text-white/60">
                      Muted
                      <input
                        type="color"
                        className="mt-2 h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent"
                        value={theme.mutedForeground}
                        onChange={(e) => setTheme({ mutedForeground: e.target.value })}
                      />
                    </label>
                  </div>

                  <div className="mt-4">
                    <label className="text-xs text-white/60">Borde</label>
                    <input
                      type="text"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                      value={theme.border}
                      onChange={(e) => setTheme({ border: e.target.value })}
                      placeholder="rgba(...) o #..."
                    />
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

            {tab === "articles" ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">Artículos</div>
                      <div className="mt-1 text-xs text-white/50">
                        Columnas y críticas que se publican en el sitio.
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                      onClick={() => {
                        const id = addArticle(articlesKind);
                        setSelectedArticleId(id);
                      }}
                    >
                      + Nuevo
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className={cn(
                        "rounded-xl px-3 py-2 text-xs font-semibold border transition",
                        articlesKind === "columns"
                          ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
                          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                      )}
                      onClick={() => {
                        setArticlesKind("columns");
                        setSelectedArticleId(null);
                      }}
                    >
                      Columnas
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "rounded-xl px-3 py-2 text-xs font-semibold border transition",
                        articlesKind === "reviews"
                          ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
                          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                      )}
                      onClick={() => {
                        setArticlesKind("reviews");
                        setSelectedArticleId(null);
                      }}
                    >
                      Crítica
                    </button>
                  </div>

                  <div className="mt-4 space-y-2">
                    {articles.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        className={cn(
                          "w-full rounded-xl border px-3 py-2 text-left transition",
                          "border-white/10 bg-white/5 hover:bg-white/10",
                          selectedArticleId === a.id && "border-cyan-500/30 bg-cyan-500/10"
                        )}
                        onClick={() => setSelectedArticleId(a.id)}
                      >
                        <div className="truncate text-sm font-semibold">{a.title}</div>
                        <div className="mt-0.5 flex items-center justify-between gap-3 text-[11px] text-white/50">
                          <span className="truncate">{a.category}</span>
                          <span className="shrink-0">{a.date}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {selectedArticle ? (
                    <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white/70">URL (id)</div>
                          <div className="mt-1 flex items-center gap-2">
                            <input
                              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                              value={selectedArticle.id}
                              onChange={(e) => {
                                const raw = e.target.value;
                                const next = slugify(raw);
                                if (!next) return;
                                renameArticle(articlesKind, selectedArticle.id, next);
                                setSelectedArticleId(next);
                              }}
                            />
                          </div>
                          <div className="mt-1 text-[11px] text-white/40">
                            Vista pública: /{articlesKind === "columns" ? "columnas" : "critica"}/{selectedArticle.id}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                          onClick={() => {
                            const ok = window.confirm("¿Eliminar este artículo?");
                            if (!ok) return;
                            removeArticle(articlesKind, selectedArticle.id);
                            setSelectedArticleId(null);
                          }}
                        >
                          Eliminar
                        </button>
                      </div>

                      <div className="mt-4 space-y-3">
                        <label className="block text-xs text-white/60">
                          Título
                          <input
                            className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                            value={selectedArticle.title}
                            onChange={(e) => updateArticle(articlesKind, selectedArticle.id, { title: e.target.value })}
                          />
                        </label>
                        <label className="block text-xs text-white/60">
                          Resumen
                          <textarea
                            className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                            rows={2}
                            value={selectedArticle.excerpt}
                            onChange={(e) =>
                              updateArticle(articlesKind, selectedArticle.id, { excerpt: e.target.value })
                            }
                          />
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <label className="block text-xs text-white/60">
                            Autor
                            <input
                              className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                              value={selectedArticle.author}
                              onChange={(e) =>
                                updateArticle(articlesKind, selectedArticle.id, { author: e.target.value })
                              }
                            />
                          </label>
                          <label className="block text-xs text-white/60">
                            Fecha (DD Mon YYYY)
                            <input
                              className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                              value={selectedArticle.date}
                              onChange={(e) =>
                                updateArticle(articlesKind, selectedArticle.id, { date: e.target.value })
                              }
                            />
                          </label>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <label className="block text-xs text-white/60">
                            Categoría
                            <input
                              className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                              value={selectedArticle.category}
                              onChange={(e) =>
                                updateArticle(articlesKind, selectedArticle.id, { category: e.target.value })
                              }
                            />
                          </label>
                          <label className="block text-xs text-white/60">
                            Imagen (ruta)
                            <input
                              className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                              value={selectedArticle.image}
                              onChange={(e) =>
                                updateArticle(articlesKind, selectedArticle.id, { image: e.target.value })
                              }
                            />
                          </label>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-semibold text-white/70">Contenido</div>
                            <button
                              type="button"
                              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                              onClick={() =>
                                updateArticle(articlesKind, selectedArticle.id, {
                                  content: [...selectedArticle.content, "Nuevo párrafo…"],
                                })
                              }
                            >
                              + Párrafo
                            </button>
                          </div>
                          <div className="mt-2 space-y-2">
                            {selectedArticle.content.map((p, idx) => (
                              <div key={idx} className="rounded-xl border border-white/10 bg-black/20 p-2">
                                <textarea
                                  className="w-full resize-none bg-transparent px-1 py-1 text-sm outline-none"
                                  rows={3}
                                  value={p}
                                  onChange={(e) => {
                                    const next = [...selectedArticle.content];
                                    next[idx] = e.target.value;
                                    updateArticle(articlesKind, selectedArticle.id, { content: next });
                                  }}
                                />
                                <div className="mt-1 flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    className="rounded-lg px-2 py-1 text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 transition"
                                    onClick={() => {
                                      const next = selectedArticle.content.filter((_, i) => i !== idx);
                                      updateArticle(articlesKind, selectedArticle.id, { content: next });
                                    }}
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition"
                      onClick={() => resetArticles()}
                    >
                      Reset (repo)
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition"
                      onClick={() => setPublishOpen(true)}
                    >
                      Publicar
                    </button>
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
